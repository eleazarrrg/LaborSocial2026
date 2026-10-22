import type { Field } from "payload";
import { TINTES, type Tinte } from "@/lib/fondo";

/**
 * Un fondo con foto: la imagen y el tinte que la viste. Sin imagen, el sitio muestra el bloque en
 * el color del tinte (no una caja vacía), así que un fondo sin foto nunca se ve roto.
 */
export function campoFondo(c: { name: string; label: string; ayuda?: string; tinte?: Tinte }): Field {
  return {
    name: c.name,
    label: c.label,
    type: "group",
    admin: { description: c.ayuda },
    fields: [
      {
        name: "imagen",
        label: "Foto de fondo",
        type: "upload",
        relationTo: "medios",
        admin: {
          description:
            "Horizontal y de 2000 px de ancho como mínimo para que se vea nítida en pantallas grandes. Sin foto, el bloque queda en el color del tinte.",
        },
      },
      {
        name: "tinte",
        label: "Tinte",
        type: "select",
        required: true,
        defaultValue: c.tinte ?? "turquesa",
        options: [...TINTES],
        admin: { description: "El color de la marca que viste la foto. Con cualquiera de los cuatro, el texto blanco se lee." },
      },
    ],
  };
}
