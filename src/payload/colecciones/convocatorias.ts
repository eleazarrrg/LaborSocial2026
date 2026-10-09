import { APIError, type CollectionConfig } from "payload";
import { soloAdmin } from "../acceso";

/**
 * Un periodo de inscripción que se abre y se cierra en fechas (RF-13). Hoy solo la de padrinos de
 * Una Estrella Otiliana. El formulario deja de aceptar inscripciones por la fecha, no porque una
 * tarea programada la apague.
 */
export const Convocatorias: CollectionConfig = {
  slug: "convocatorias",
  labels: { singular: "Convocatoria", plural: "Convocatorias" },
  admin: {
    group: "Contenido",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "abreEn", "cierraEn", "cerradaManualmente"],
  },
  defaultSort: "-abreEn",
  // El sitio la lee desde el servidor; no hace falta exponerla en la API.
  access: { read: soloAdmin, create: soloAdmin, update: soloAdmin, delete: soloAdmin },
  fields: [
    {
      name: "proyectoSlug",
      label: "Proyecto",
      type: "text",
      required: true,
      defaultValue: "una-estrella-otiliana",
      admin: { description: "El código del proyecto, como aparece en su dirección web." },
    },
    {
      name: "tipo",
      type: "select",
      required: true,
      defaultValue: "padrinos",
      options: [{ label: "Padrinos y madrinas", value: "padrinos" }],
    },
    { name: "titulo", label: "Título", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    {
      name: "textoSiCerrada",
      label: "Texto cuando está cerrada",
      type: "textarea",
      required: true,
    },
    {
      name: "abreEn",
      label: "Abre el",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "cierraEn",
      label: "Cierra el",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "Hora de Panamá. Para que cierre al terminar el 15, pon el 16 a las 00:00.",
      },
    },
    {
      name: "cerradaManualmente",
      label: "Cerrarla ya, antes de la fecha",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data) return data;
        const abre = data.abreEn ?? originalDoc?.abreEn;
        const cierra = data.cierraEn ?? originalDoc?.cierraEn;
        if (abre && cierra && new Date(cierra) <= new Date(abre)) {
          throw new APIError("La fecha de cierre tiene que ser posterior a la de apertura.", 400, undefined, true);
        }
        // Dos convocatorias del mismo proyecto y tipo no pueden solaparse en fechas.
        const { docs } = await req.payload.find({
          collection: "convocatorias",
          req,
          overrideAccess: true,
          depth: 0,
          limit: 1,
          where: {
            and: [
              { proyectoSlug: { equals: data.proyectoSlug ?? originalDoc?.proyectoSlug } },
              { tipo: { equals: data.tipo ?? originalDoc?.tipo } },
              { abreEn: { less_than: cierra } },
              { cierraEn: { greater_than: abre } },
              ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
            ],
          },
        });
        if (docs.length) {
          throw new APIError(
            `Se solapa con «${docs[0].titulo}». Cambia las fechas de una de las dos.`,
            400,
            undefined,
            true,
          );
        }
        return data;
      },
    ],
  },
};
