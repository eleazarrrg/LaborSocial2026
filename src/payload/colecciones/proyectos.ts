import type { CollectionConfig } from "payload";
import { esAdmin, esEquipo, soloAdmin, soloEquipo } from "../acceso";
import { campoFondo } from "../campos/fondo";
import { editorTexto } from "../editorTexto";
import { lenguajeSeguro } from "../lenguaSeguro";
import { SLUG_VALIDO } from "../slug";

const HEX = /^#[0-9a-f]{6}$/i;

/**
 * El catálogo: los proyectos y las campañas. Una colección con dos tipos, porque la diferencia es
 * solo de dónde se muestran (`/proyectos/{codigo}` y `/campanas/{codigo}`) y de que las campañas
 * van aparte en el sitio, para que no parezcan media lista de salud mental (CLAUDE.md §2).
 *
 * No hay un tope de entradas: Edwin abre el noveno proyecto desde aquí, sin pedirle nada a nadie.
 *
 * Ocultar un proyecto (`activo` sin marcar) lo quita del sitio sin borrarlo.
 */
export const Proyectos: CollectionConfig = {
  slug: "proyectos",
  labels: { singular: "Proyecto o campaña", plural: "Proyectos y campañas" },
  admin: {
    group: "Contenido",
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "tipo", "orden", "activo"],
    listSearchableFields: ["nombre", "nombreCorto"],
  },
  defaultSort: "orden",
  access: {
    // La API pública está cerrada; el sitio lee con la API local y filtra lo activo (src/lib/contenido.ts).
    read: soloEquipo,
    create: soloEquipo,
    update: soloEquipo,
    // Un proyecto se oculta, no se borra: borrarlo rompe sus noticias y sus enlaces.
    delete: soloAdmin,
  },
  versions: { maxPerDoc: 30 },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "tipo",
          label: "Es un",
          type: "select",
          required: true,
          defaultValue: "proyecto",
          options: [
            { label: "Proyecto", value: "proyecto" },
            { label: "Campaña", value: "campana" },
          ],
        },
        {
          name: "codigo",
          label: "Dirección web",
          type: "text",
          required: true,
          unique: true,
          index: true,
          validate: (v: unknown) =>
            typeof v === "string" && SLUG_VALIDO.test(v) ? true : "Solo minúsculas, números y guiones.",
          admin: { description: "Ejemplo: historias-que-sanan. No se cambia después: rompería los enlaces." },
        },
      ],
    },
    { name: "nombre", label: "Nombre completo", type: "text", required: true, localized: true, minLength: 3 },
    {
      name: "nombreCorto",
      label: "Nombre corto",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Para el menú y las listas, donde el nombre completo no cabe." },
    },
    {
      name: "resumen",
      label: "Resumen de una línea",
      type: "textarea",
      required: true,
      localized: true,
      minLength: 20,
      maxLength: 240,
      hooks: { beforeValidate: [lenguajeSeguro] },
    },
    {
      name: "historia",
      label: "Texto del proyecto",
      type: "richText",
      localized: true,
      editor: editorTexto,
      hooks: { beforeValidate: [lenguajeSeguro] },
      admin: { description: "El texto oficial de la fundación. Cada proyecto nació de una historia." },
    },
    {
      name: "enHonorA",
      label: "En honor a",
      type: "text",
      localized: true,
      admin: { description: "Solo si es verdad y la fundación lo confirmó. Si no, déjalo en blanco." },
    },
    { name: "poblacion", label: "A quién llega", type: "text", localized: true },
    {
      name: "requisitos",
      label: "Requisitos para participar",
      type: "array",
      localized: true,
      labels: { singular: "Requisito", plural: "Requisitos" },
      fields: [{ name: "texto", label: "Requisito", type: "text", required: true }],
    },
    { name: "cuando", label: "Cuándo", type: "text", localized: true },
    {
      type: "row",
      fields: [
        {
          name: "cifraValor",
          label: "Cifra (opcional)",
          type: "text",
          admin: { description: "Solo una cifra real que Edwin haya dicho. Ejemplo: +30" },
        },
        {
          name: "cifraPie",
          label: "Qué cuenta la cifra",
          type: "text",
          localized: true,
          admin: { description: "Ejemplo: escuelas en lista de espera" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "accionEtiqueta", label: "Texto del botón", type: "text", localized: true },
        {
          name: "accionHref",
          label: "A dónde lleva el botón",
          type: "text",
          admin: { description: "Una página del sitio (por ejemplo /participar/apadrinar) o un enlace completo." },
          validate: (v: unknown) =>
            !v || (typeof v === "string" && (/^\/(?!\/)/.test(v) || /^https?:\/\//.test(v)))
              ? true
              : "Empieza con / para una página del sitio, o con https:// para otra.",
        },
      ],
    },
    {
      name: "logo",
      label: "Logo o emblema",
      type: "upload",
      relationTo: "medios",
      admin: { description: "Su texto alternativo se pide al subirlo a la biblioteca." },
    },
    campoFondo({
      name: "fondo",
      label: "Foto de fondo de la página",
      ayuda: "La foto principal del proyecto: se ve a todo el ancho arriba de su página y en su bloque del inicio.",
    }),
    {
      name: "logoFondo",
      label: "Color de fondo del logo",
      type: "text",
      validate: (v: unknown) => (!v || (typeof v === "string" && HEX.test(v)) ? true : "Un color como #ffffff."),
      admin: { description: "Para los logos que traen fondo propio: el color de sus esquinas, para que el borde no se note." },
    },
    {
      name: "bloqueCrisis",
      label: "Cierra con los recursos de ayuda",
      type: "checkbox",
      defaultValue: false,
      // Es un control de seguridad, no una preferencia: quitarlo lo decide solo administración.
      access: { create: ({ req }) => esEquipo(req.user), update: ({ req }) => esAdmin(req.user) },
      admin: {
        position: "sidebar",
        description:
          "Obligatorio en todo lo que toque salud mental o suicidio: la página termina con el 911 y la Línea 147. Solo administración puede cambiarlo.",
      },
    },
    {
      name: "orden",
      label: "Orden",
      type: "number",
      defaultValue: 100,
      admin: { position: "sidebar", description: "Menor va primero. Usa saltos de 10 para poder meter uno en medio." },
    },
    {
      name: "activo",
      label: "Visible en el sitio",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Desmárcalo para ocultarlo sin borrarlo." },
    },
  ],
};
