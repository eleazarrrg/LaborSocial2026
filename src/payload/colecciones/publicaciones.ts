import { APIError, type CollectionConfig, type CollectionBeforeChangeHook, type Field } from "payload";
import { soloEquipo } from "../acceso";
import { editorTexto } from "../editorTexto";
import { lenguajeSeguro } from "../lenguaSeguro";
import { SLUG_VALIDO, slugDesde } from "../slug";

/**
 * Noticias y eventos: casi lo mismo (título, resumen, texto, portada), con la fecha como lo que
 * distingue a un evento y hace que caduque. Una sola fábrica, para que se editen igual.
 *
 * Estados (versions.drafts): borrador → publicado, y de vuelta. Un borrador nunca lo ve el público,
 * ni siquiera por la API. Borrar manda a la papelera, de donde se recupera.
 */

const URL_HTTP = /^https?:\/\/\S+$/i;

const camposComunes: Field[] = [
  {
    name: "titulo",
    label: "Título",
    type: "text",
    required: true,
    localized: true,
    minLength: 5,
    maxLength: 160,
    hooks: { beforeValidate: [lenguajeSeguro] },
    admin: { description: "Dice de qué trata. Entre 5 y 160 caracteres." },
  },
  {
    name: "slug",
    label: "Dirección web",
    type: "text",
    required: true,
    unique: true,
    index: true,
    hooks: { beforeValidate: [slugDesde("titulo")] },
    validate: (v: unknown) =>
      typeof v === "string" && SLUG_VALIDO.test(v) ? true : "Solo minúsculas, números y guiones.",
    admin: {
      position: "sidebar",
      description: "Sale del título. No cambia después de publicar, para no romper los enlaces compartidos.",
    },
  },
  {
    name: "resumen",
    label: "Resumen",
    type: "textarea",
    required: true,
    localized: true,
    minLength: 20,
    maxLength: 300,
    hooks: { beforeValidate: [lenguajeSeguro] },
    admin: { description: "Es lo que se ve en la lista y al compartir. Una o dos frases." },
  },
  {
    name: "cuerpo",
    label: "Texto",
    type: "richText",
    localized: true,
    editor: editorTexto,
    hooks: { beforeValidate: [lenguajeSeguro] },
    admin: { description: "Negrita, enlaces, listas y fotos entre párrafos. Nada más: así todas las noticias se ven igual de bien." },
  },
  {
    name: "portada",
    label: "Foto de portada",
    type: "upload",
    relationTo: "medios",
    admin: { description: "Elígela de la biblioteca o súbela. Su texto alternativo se pide al subirla." },
  },
  {
    name: "proyecto",
    label: "Proyecto relacionado",
    type: "relationship",
    relationTo: "proyectos",
    admin: { position: "sidebar", description: "Opcional. Aparece en su página y en los filtros." },
  },
  {
    name: "destacado",
    label: "Destacar en el inicio",
    type: "checkbox",
    defaultValue: false,
    admin: { position: "sidebar" },
  },
  {
    name: "publicadoEn",
    label: "Fecha de publicación",
    type: "date",
    admin: {
      position: "sidebar",
      date: { pickerAppearance: "dayAndTime" },
      description: "Se pone sola al publicar. Es la fecha que ve el visitante y la que ordena la lista.",
    },
  },
];

const camposDeEvento: Field[] = [
  {
    name: "fechaInicio",
    label: "Empieza",
    type: "date",
    required: true,
    admin: { date: { pickerAppearance: "dayAndTime" }, description: "Hora de Panamá. Cuando pasa, el evento deja de listarse solo." },
  },
  {
    name: "fechaFin",
    label: "Termina",
    type: "date",
    admin: { date: { pickerAppearance: "dayAndTime" } },
  },
  { name: "lugar", label: "Lugar", type: "text", localized: true },
  { name: "direccion", label: "Dirección", type: "text", localized: true },
  {
    name: "inscripcionUrl",
    label: "Enlace para inscribirse",
    type: "text",
    validate: (v: unknown) =>
      !v || (typeof v === "string" && URL_HTTP.test(v)) ? true : "Tiene que empezar con https://",
  },
];

/**
 * Un evento no puede terminar antes de empezar. Va como gancho y no como `validate` del campo
 * porque Payload no ejecuta las validaciones propias al guardar un borrador, y un borrador con
 * fechas al revés es justo lo que luego alguien publica sin mirar.
 */
const fechasCoherentes: CollectionBeforeChangeHook = ({ data }) => {
  if (data.fechaInicio && data.fechaFin && new Date(data.fechaFin) < new Date(data.fechaInicio)) {
    throw new APIError("El evento no puede terminar antes de empezar.", 400, undefined, true);
  }
  return data;
};

function crearPublicacion(c: {
  slug: "noticias" | "eventos";
  singular: string;
  plural: string;
  extras?: Field[];
  antesDeGuardar?: CollectionBeforeChangeHook[];
  columnas: string[];
  orden: string;
}): CollectionConfig {
  return {
    slug: c.slug,
    labels: { singular: c.singular, plural: c.plural },
    admin: {
      group: "Contenido",
      useAsTitle: "titulo",
      defaultColumns: c.columnas,
      listSearchableFields: ["titulo", "resumen"],
    },
    defaultSort: c.orden,
    // La API pública está cerrada (payload-totp exige sesión verificada en toda lectura). El sitio
    // lee con la API local del servidor y filtra lo publicado en src/lib/contenido.ts.
    access: {
      read: soloEquipo,
      create: soloEquipo,
      update: soloEquipo,
      delete: soloEquipo,
    },
    trash: true,
    versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 30 },
    fields: [...camposComunes, ...(c.extras ?? [])],
    hooks: {
      beforeChange: [
        ...(c.antesDeGuardar ?? []),
        // La fecha que ve el visitante: se fija la primera vez que se publica, no al escribir el borrador.
        ({ data, originalDoc }) =>
          data._status === "published" && !data.publicadoEn && !originalDoc?.publicadoEn
            ? { ...data, publicadoEn: new Date().toISOString() }
            : data,
      ],
    },
  };
}

export const Noticias = crearPublicacion({
  slug: "noticias",
  singular: "Noticia",
  plural: "Noticias",
  columnas: ["titulo", "_status", "publicadoEn"],
  orden: "-publicadoEn",
});

export const Eventos = crearPublicacion({
  slug: "eventos",
  singular: "Evento",
  plural: "Eventos",
  extras: camposDeEvento,
  antesDeGuardar: [fechasCoherentes],
  columnas: ["titulo", "fechaInicio", "_status"],
  orden: "fechaInicio",
});
