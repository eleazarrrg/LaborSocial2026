import type { CollectionConfig } from "payload";
import { ETIQUETA_TEMA, TEMAS } from "@/lib/preguntas-base";
import { soloAdmin, soloEquipo } from "../acceso";
import { lenguajeSeguro } from "../lenguaSeguro";

/**
 * Preguntas frecuentes: se ven en `/preguntas-frecuentes` y al pie de la página de su tema (citas,
 * donar, voluntariado, padrinos, alianzas), y alimentan los datos estructurados para buscadores.
 *
 * Ocultar una pregunta (`activo` sin marcar) la quita del sitio sin borrarla.
 */
export const Preguntas: CollectionConfig = {
  slug: "preguntas",
  labels: { singular: "Pregunta frecuente", plural: "Preguntas frecuentes" },
  admin: {
    group: "Publicar",
    useAsTitle: "pregunta",
    defaultColumns: ["pregunta", "tema", "orden", "activo"],
    listSearchableFields: ["pregunta", "respuesta"],
    description: "Las preguntas que más se repiten, con su respuesta. Se ven en el sitio y ayudan a que te encuentren.",
    preview: () => "/preguntas-frecuentes",
  },
  defaultSort: "orden",
  access: {
    // La API pública está cerrada; el sitio lee con la API local y filtra lo activo.
    read: soloEquipo,
    create: soloEquipo,
    update: soloEquipo,
    delete: soloAdmin,
  },
  fields: [
    {
      name: "pregunta",
      label: "Pregunta",
      type: "text",
      required: true,
      maxLength: 140,
      admin: { description: "Como la diría una persona que entra por primera vez. Termina con signo de interrogación." },
      hooks: { beforeValidate: [lenguajeSeguro] },
    },
    {
      name: "respuesta",
      label: "Respuesta",
      type: "textarea",
      required: true,
      minLength: 20,
      maxLength: 600,
      admin: {
        description:
          "Clara y corta (hasta 600 caracteres). Solo lo que la fundación puede cumplir: nada de plazos ni montos que no estén confirmados. Si hablas de una emergencia, remite al 911 o a la Línea 147.",
      },
      hooks: { beforeValidate: [lenguajeSeguro] },
    },
    {
      type: "row",
      fields: [
        {
          name: "tema",
          label: "¿Dónde se ve?",
          type: "select",
          required: true,
          defaultValue: "general",
          options: TEMAS.map((t) => ({ value: t, label: ETIQUETA_TEMA[t] })),
          admin: {
            width: "50%",
            description: "Además de la página de preguntas, aparece al pie de la página de su tema.",
          },
        },
        {
          name: "orden",
          label: "Orden",
          type: "number",
          required: true,
          defaultValue: 100,
          admin: { width: "25%", description: "Menor número, más arriba." },
        },
        {
          name: "activo",
          label: "Visible en el sitio",
          type: "checkbox",
          defaultValue: true,
          admin: {
            width: "25%",
            components: { Cell: "/payload/componentes/celda-visible#CeldaVisible" },
          },
        },
      ],
    },
  ],
};
