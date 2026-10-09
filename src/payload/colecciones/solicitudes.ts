import type { CollectionConfig, Field } from "payload";
import {
  AREAS_VOLUNTARIADO,
  CONTACTO_PREFERIDO,
  FORMAS_ENTREGA,
  MODALIDADES,
} from "@/lib/opciones";
import { nadie, soloAdmin } from "../acceso";
import { avisarNuevaSolicitud } from "../avisos";
import { registrarEnBitacora } from "./bitacora";

/**
 * Las cuatro bandejas: cita, voluntariado, padrinos y contacto.
 *
 * Reglas comunes (CLAUDE.md §5.2):
 *   · crear:  nadie desde la API. El servidor guarda tras validar con Zod (src/app/actions.ts).
 *   · leer:   solo administración, con el segundo factor ya verificado (payload-totp).
 *   · cambiar: solo el estado y las notas internas. Lo que escribió la persona no se toca.
 *   · cada vista y cada cambio de estado deja rastro en la bitácora.
 */

export const ESTADOS = [
  { label: "Pendiente", value: "pendiente" },
  { label: "En gestión", value: "en_gestion" },
  { label: "Atendida", value: "atendida" },
  { label: "Cerrada sin atender", value: "cerrada_sin_atender" },
] as const;

const FINALES = new Set(["atendida", "cerrada_sin_atender"]);

const opciones = (lista: ReadonlyArray<{ valor: string; etiqueta: string }>) =>
  lista.map((o) => ({ label: o.etiqueta, value: o.valor }));

/**
 * Visible y no editable en el panel. La garantía de verdad está en el gancho `beforeChange`,
 * que restaura estos campos desde el documento original: un permiso de campo no serviría,
 * porque Payload lo aplica después del gancho y borraría lo que el gancho escribe.
 */
const soloLectura = (campos: Field[]): Field[] =>
  campos.map((c) => ({ ...c, admin: { ...("admin" in c ? c.admin : {}), readOnly: true } }) as Field);

const nombreDe = (c: Field) => ("name" in c ? c.name : null);

const nombre: Field = { name: "nombre", type: "text", required: true };
const correo: Field = { name: "correo", type: "email" };
const telefono: Field = { name: "telefono", label: "Teléfono", type: "text" };

type Nota = { id?: string | null; texto?: string; autor?: unknown; fecha?: string };

function crearBandeja(config: {
  slug: string;
  singular: string;
  plural: string;
  campos: Field[];
  indexes?: CollectionConfig["indexes"];
}): CollectionConfig {
  const inmutables = [
    ...config.campos.map(nombreDe).filter((n): n is string => !!n),
    "consentimientoEn",
    "politicaVersion",
    "atendidaPor",
    "atendidaEn",
    "createdAt", // decide el orden de la bandeja: nadie se adelanta ni se atrasa en la cola
  ];
  return {
    slug: config.slug,
    labels: { singular: config.singular, plural: config.plural },
    admin: {
      group: "Solicitudes",
      useAsTitle: "nombre",
      defaultColumns: ["nombre", "estado", "createdAt"],
      listSearchableFields: ["nombre", "correo"],
    },
    // La bandeja: la espera más larga primero (RF-12).
    defaultSort: "createdAt",
    indexes: config.indexes,
    access: { read: soloAdmin, update: soloAdmin, delete: soloAdmin, create: nadie },
    fields: [
      ...soloLectura([
        ...config.campos,
        { name: "consentimientoEn", label: "Consentimiento dado el", type: "date", required: true },
        { name: "politicaVersion", label: "Versión de la política", type: "text", required: true },
      ]),
      {
        name: "estado",
        type: "select",
        required: true,
        defaultValue: "pendiente",
        index: true,
        options: [...ESTADOS],
        admin: { position: "sidebar" },
      },
      ...soloLectura([
        {
          name: "atendidaPor",
          label: "Último cambio de estado por",
          type: "relationship",
          relationTo: "usuarios",
          admin: { position: "sidebar" },
        },
        {
          name: "atendidaEn",
          label: "Cerrada el",
          type: "date",
          admin: { position: "sidebar" },
        },
      ]),
      {
        name: "avisoEnviado",
        label: "Aviso por correo enviado",
        type: "checkbox",
        defaultValue: false,
        admin: {
          position: "sidebar",
          readOnly: true,
          description: "Si está sin marcar, el correo de aviso falló: la solicitud igual está guardada.",
        },
      },
      {
        name: "notas",
        label: "Notas internas del equipo",
        type: "array",
        admin: {
          description: "Solo las ve la administración. No se pueden editar ni borrar después.",
        },
        fields: [
          { name: "texto", type: "textarea", required: true },
          ...soloLectura([
            { name: "autor", type: "relationship", relationTo: "usuarios" },
            { name: "fecha", type: "date" },
          ]),
        ],
      },
    ],
    hooks: {
      beforeChange: [
        ({ data, originalDoc, operation, req }) => {
          if (operation !== "update" || !originalDoc) return data;

          // Payload relee el documento al terminar de guardar: eso no es «verlo» otra vez.
          req.context.sinBitacora = true;

          // Lo que escribió la persona y los datos del sistema no cambian por ninguna vía.
          for (const campo of inmutables) data[campo] = originalDoc[campo];
          // `avisoEnviado` solo lo marca el servidor tras enviar el correo (avisos.ts).
          if (req.context.desdeAvisos !== true) data.avisoEnviado = originalDoc.avisoEnviado;

          if (data.estado && data.estado !== originalDoc.estado) {
            data.atendidaPor = req.user?.id;
            data.atendidaEn = FINALES.has(data.estado) ? new Date().toISOString() : null;
          }

          // Notas: solo se agregan. Las que ya existían se conservan tal cual, aunque el
          // navegador las mande cambiadas o no las mande.
          const anteriores = (originalDoc.notas ?? []) as Nota[];
          const enviadas = (data.notas ?? anteriores) as Nota[];
          const idsAnteriores = new Set(anteriores.map((n) => n.id));
          const nuevas = enviadas
            .filter((n) => !n.id || !idsAnteriores.has(n.id))
            .map((n) => ({ texto: n.texto, autor: req.user?.id, fecha: new Date().toISOString() }));
          data.notas = [...anteriores, ...nuevas];
          return data;
        },
      ],
      afterChange: [
        async ({ doc, previousDoc, operation, req }) => {
          if (operation === "create") {
            await avisarNuevaSolicitud(req, config.slug, config.singular, doc);
            return doc;
          }
          if (operation === "update" && previousDoc?.estado !== doc.estado) {
            await registrarEnBitacora(req, {
              accion: "cambiar_estado",
              coleccion: config.slug,
              documento: doc.id,
              resumen: `Estado: ${previousDoc?.estado} → ${doc.estado}`,
              datos: { de: previousDoc?.estado, a: doc.estado },
            });
          }
          return doc;
        },
      ],
      afterOperation: [
        async ({ operation, args, result, req }) => {
          // Una consulta de lista también es ver datos: queda una entrada por consulta, con
          // cuántas filas devolvió. Sin esto, leer la bandeja entera no dejaría rastro.
          if (operation !== "find" || !req.user || req.context?.sinBitacora === true) return result;
          const total = (result as { docs?: unknown[] }).docs?.length ?? 0;
          if (total > 0) {
            await registrarEnBitacora(req, {
              accion: "ver_lista",
              coleccion: config.slug,
              documento: "-",
              resumen: `Consultó la lista: ${total} ${config.plural.toLowerCase()}`,
              datos: { pagina: args?.page ?? 1, limite: args?.limit ?? null },
            });
          }
          return result;
        },
      ],
      afterRead: [
        async ({ doc, findMany, req }) => {
          // Una ficha abierta por una persona del equipo. Las listas no cuentan como «ver».
          if (!findMany && req.user && req.context?.sinBitacora !== true) {
            await registrarEnBitacora(req, {
              accion: "ver_solicitud",
              coleccion: config.slug,
              documento: doc.id,
              resumen: `Vio: ${config.singular.toLowerCase()}`,
            });
          }
          return doc;
        },
      ],
      afterDelete: [
        async ({ doc, req }) => {
          await registrarEnBitacora(req, {
            accion: "borrar_solicitud",
            coleccion: config.slug,
            documento: doc.id,
            resumen: `Borró: ${config.singular.toLowerCase()}`,
          });
        },
      ],
    },
  };
}

/* ------------------------------------------------------------- Las cuatro */

// Sin diagnóstico, síntomas, medicación ni relato clínico (CLAUDE.md §5.2).
export const SolicitudesCita = crearBandeja({
  slug: "solicitudes-cita",
  singular: "Solicitud de cita",
  plural: "Citas",
  campos: [
    nombre,
    correo,
    telefono,
    {
      name: "contactoPreferido",
      label: "Prefiere que le escriban por",
      type: "select",
      required: true,
      options: opciones(CONTACTO_PREFERIDO),
    },
    { name: "motivo", label: "Sobre qué quiere hablar", type: "textarea" },
    { name: "modalidad", type: "select", required: true, options: opciones(MODALIDADES) },
    { name: "disponibilidad", type: "text" },
    { name: "atencionPronto", label: "Pidió atención pronto", type: "checkbox" },
  ],
});

export const InscripcionesVoluntariado = crearBandeja({
  slug: "inscripciones-voluntariado",
  singular: "Inscripción de voluntariado",
  plural: "Voluntariado",
  campos: [
    nombre,
    { ...correo, required: true } as Field,
    telefono,
    {
      name: "areasInteres",
      label: "Áreas",
      type: "select",
      hasMany: true,
      required: true,
      options: opciones(AREAS_VOLUNTARIADO),
    },
    { name: "otraArea", label: "Otra área", type: "text" },
    { name: "disponibilidad", type: "text" },
    { name: "experiencia", label: "Algo que debamos saber", type: "textarea" },
  ],
});

// Sin ningún dato del niño o la niña: el emparejamiento ocurre fuera de línea (§5.2).
export const InscripcionesPadrinos = crearBandeja({
  slug: "inscripciones-padrinos",
  singular: "Inscripción de padrino o madrina",
  plural: "Padrinos y madrinas",
  campos: [
    {
      name: "convocatoria",
      type: "relationship",
      relationTo: "convocatorias",
      required: true,
    },
    nombre,
    { ...correo, required: true } as Field,
    { ...telefono, required: true } as Field,
    {
      name: "cantidadNinos",
      label: "Cuántos niños o niñas apadrina",
      type: "number",
      required: true,
      min: 1,
      max: 10,
    },
    {
      name: "formaEntrega",
      label: "Entrega del regalo",
      type: "select",
      required: true,
      options: opciones(FORMAS_ENTREGA),
    },
    { name: "comentario", type: "textarea" },
  ],
  // Una persona, una inscripción por convocatoria. El correo ya llega en minúscula.
  indexes: [{ fields: ["convocatoria", "correo"], unique: true }],
});

export const MensajesContacto = crearBandeja({
  slug: "mensajes-contacto",
  singular: "Mensaje de contacto",
  plural: "Contacto",
  campos: [
    nombre,
    correo,
    telefono,
    { name: "asunto", type: "text", required: true },
    { name: "mensaje", type: "textarea", required: true },
  ],
});
