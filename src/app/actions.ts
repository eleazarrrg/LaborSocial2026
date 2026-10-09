"use server";

import { z } from "zod";
import { POLITICA_VERSION } from "@/lib/contacto";
import { CAMPO_TRAMPA, type EstadoFormulario } from "@/lib/estado-formulario";
import {
  esquemaCita,
  esquemaContacto,
  esquemaPadrino,
  esquemaVoluntariado,
} from "@/lib/esquemas";
import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { describirError } from "@/payload/errores";

/**
 * Acciones de servidor de los formularios.
 *
 * El orden es el de CLAUDE.md §4 y no se altera:
 *   1. validar con Zod
 *   2. si el campo trampa viene lleno, el envío va a la cuarentena (nada se descarta)
 *   3. guardar en Postgres con la API local de Payload  ← síncrono, y es lo único crítico
 *   4. devolver éxito al usuario
 * Los avisos por correo reaccionan después (ganchos de Payload). Si fallan, la solicitud ya está
 * guardada. Si falla el paso 3, se le dice a la persona con todas sus letras y se le da
 * WhatsApp: nunca un «recibido» sin haber recibido.
 */

type Tabla =
  | "solicitudes-cita"
  | "inscripciones-voluntariado"
  | "inscripciones-padrinos"
  | "mensajes-contacto";

type Fila = Record<string, unknown>;

const FALLO: EstadoFormulario = {
  estado: "fallo",
  mensaje:
    "No pudimos guardar tu envío. No es culpa tuya: falló algo de nuestro lado. Inténtalo de nuevo en un rato, o escríbenos por WhatsApp.",
};

const ENVIADO: EstadoFormulario = { estado: "enviado" };

const CONVOCATORIA_CERRADA: EstadoFormulario = {
  estado: "error",
  mensaje:
    "La convocatoria de padrinos y madrinas no está abierta en este momento. Escríbenos y te avisamos cuando abra.",
};

const YA_INSCRITO: EstadoFormulario = {
  estado: "error",
  errores: { correo: "Este correo ya está inscrito en esta convocatoria." },
  mensaje: "Ya tenemos tu inscripción. Si quieres cambiar algo, escríbenos y lo ajustamos.",
};

function aplanarErrores(error: z.ZodError): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? "_");
    // El primer error por campo es el que se muestra: más de uno abruma.
    if (!errores[campo]) errores[campo] = issue.message;
  }
  return errores;
}

/**
 * Lo que la persona escribió, para devolvérselo si hay que corregir algo: React vacía el
 * formulario al terminar la acción, y volver a escribirlo todo es la forma más rápida de
 * que alguien que pide ayuda desista. No se devuelve la trampa ni el consentimiento, que
 * se vuelve a marcar a mano (RNF-10).
 */
function valoresDe(formData: FormData): Record<string, string | string[]> {
  const valores: Record<string, string | string[]> = {};
  for (const clave of new Set(formData.keys())) {
    if (clave.startsWith("$") || clave === CAMPO_TRAMPA || clave === "consentimiento") continue;
    const todos = formData.getAll(clave).filter((v) => typeof v === "string");
    valores[clave] = todos.length > 1 ? todos : (todos[0] ?? "");
  }
  return valores;
}

function registrar(donde: string, error: unknown) {
  console.error(`[formularios] ${donde}: ${describirError(error)}`);
}

async function procesar<T extends z.ZodType>(
  tabla: Tabla,
  esquema: T,
  formData: FormData,
  crudo: Record<string, unknown>,
  aFila: (datos: z.output<T>, payload: Payload) => Promise<Fila | EstadoFormulario> | Fila,
): Promise<EstadoFormulario> {
  const resultado = esquema.safeParse(crudo);
  if (!resultado.success) {
    return {
      estado: "error",
      errores: aplanarErrores(resultado.error),
      mensaje: "Revisa los campos marcados.",
      valores: valoresDe(formData),
    };
  }

  try {
    const payload = await getPayload({ config });

    // Un humano no ve el campo trampa; un bot lo llena. Se guarda aparte, ya validado y
    // recortado, por si era alguien de verdad (RNF-22). Al bot se le responde lo de siempre.
    if (formData.get(CAMPO_TRAMPA)) {
      await payload.create({
        collection: "cuarentena",
        overrideAccess: true,
        data: { formulario: tabla, motivo: "campo_trampa", carga: resultado.data as Record<string, unknown> },
      });
      return ENVIADO;
    }

    const fila = await aFila(resultado.data, payload);
    if ("estado" in fila) return { ...(fila as EstadoFormulario), valores: valoresDe(formData) };

    // overrideAccess: la colección no deja crear a nadie desde la API. Este es el único camino,
    // y llega aquí solo después de Zod y de la trampa.
    await payload.create({
      collection: tabla,
      overrideAccess: true,
      data: {
        ...fila,
        consentimientoEn: new Date().toISOString(),
        politicaVersion: POLITICA_VERSION,
      } as never,
    });
    return ENVIADO;
  } catch (error) {
    registrar(`procesar ${tabla}`, error);
    return { ...FALLO, valores: valoresDe(formData) };
  }
}

function texto(formData: FormData, campo: string): string {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor : "";
}

/* ------------------------------------------------------------------ Cita */

export async function accionCita(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "solicitudes-cita",
    esquemaCita,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      contactoPreferido: texto(formData, "contactoPreferido"),
      modalidad: texto(formData, "modalidad"),
      motivo: texto(formData, "motivo"),
      disponibilidad: texto(formData, "disponibilidad"),
      atencionPronto: formData.get("atencionPronto") ?? undefined,
      consentimiento: formData.get("consentimiento") ?? "",
    },
    (d) => ({
      nombre: d.nombre,
      correo: d.correo ?? null,
      telefono: d.telefono ?? null,
      contactoPreferido: d.contactoPreferido,
      motivo: d.motivo ?? null,
      modalidad: d.modalidad,
      disponibilidad: d.disponibilidad ?? null,
      atencionPronto: d.atencionPronto === "on",
    }),
  );
}

/* ---------------------------------------------------------- Voluntariado */

export async function accionVoluntariado(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "inscripciones-voluntariado",
    esquemaVoluntariado,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      areas: formData.getAll("areas").filter((a) => typeof a === "string"),
      otraArea: texto(formData, "otraArea"),
      disponibilidad: texto(formData, "disponibilidad"),
      experiencia: texto(formData, "experiencia"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    (d) => ({
      nombre: d.nombre,
      correo: d.correo,
      telefono: d.telefono ?? null,
      areasInteres: [...new Set(d.areas)],
      // Si no marcó «Otra», lo que haya escrito ahí no se guarda.
      otraArea: d.areas.includes("otra") ? (d.otraArea ?? null) : null,
      disponibilidad: d.disponibilidad ?? null,
      experiencia: d.experiencia ?? null,
    }),
  );
}

/* --------------------------------------------------------- Apadrinamiento */

export async function accionPadrino(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "inscripciones-padrinos",
    esquemaPadrino,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      cantidadNinos: texto(formData, "cantidadNinos"),
      formaEntrega: texto(formData, "formaEntrega"),
      comentario: texto(formData, "comentario"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    async (d, payload) => {
      // La convocatoria la busca el servidor; nunca se confía en un id que mande el formulario.
      const ahora = new Date().toISOString();
      const { docs } = await payload.find({
        collection: "convocatorias",
        overrideAccess: true,
        depth: 0,
        limit: 1,
        where: {
          and: [
            { proyectoSlug: { equals: "una-estrella-otiliana" } },
            { tipo: { equals: "padrinos" } },
            { cerradaManualmente: { equals: false } },
            { abreEn: { less_than_equal: ahora } },
            { cierraEn: { greater_than: ahora } },
          ],
        },
      });
      const convocatoria = docs[0];
      if (!convocatoria) return CONVOCATORIA_CERRADA;

      // Una inscripción por correo y convocatoria. El índice único de la colección es la red de
      // seguridad; esta consulta es la que da el mensaje claro.
      const { totalDocs } = await payload.count({
        collection: "inscripciones-padrinos",
        overrideAccess: true,
        where: {
          and: [
            { convocatoria: { equals: convocatoria.id } },
            { correo: { equals: d.correo } },
          ],
        },
      });
      if (totalDocs > 0) return YA_INSCRITO;

      return {
        convocatoria: convocatoria.id,
        nombre: d.nombre,
        correo: d.correo,
        telefono: d.telefono,
        cantidadNinos: d.cantidadNinos,
        formaEntrega: d.formaEntrega,
        comentario: d.comentario ?? null,
      };
    },
  );
}

/* -------------------------------------------------------------- Contacto */

export async function accionContacto(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "mensajes-contacto",
    esquemaContacto,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      asunto: texto(formData, "asunto"),
      mensaje: texto(formData, "mensaje"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    (d) => ({
      nombre: d.nombre,
      correo: d.correo ?? null,
      telefono: d.telefono ?? null,
      asunto: d.asunto,
      mensaje: d.mensaje,
    }),
  );
}
