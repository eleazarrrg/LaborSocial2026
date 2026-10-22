import { APIError, type CollectionConfig } from "payload";
import { soloAdmin, soloEquipo } from "../acceso";

/**
 * La biblioteca de imágenes. Tres reglas que no se negocian (CLAUDE.md §5.2 y §5.4):
 *   · el texto alternativo es obligatorio SIEMPRE, no solo al publicar: una imagen sin él no tiene
 *     ningún uso legítimo en un sitio que tiene que pasar WCAG AA;
 *   · una foto que requiere consentimiento (niños, personas en situación de calle) no se guarda
 *     sin tener el consentimiento registrado;
 *   · solo formatos de imagen que no pueden llevar código (nada de SVG).
 *
 * Las imágenes son públicas por diseño: lo que está aquí se ve en el sitio.
 */
export const Medios: CollectionConfig = {
  slug: "medios",
  labels: { singular: "Imagen", plural: "Imágenes" },
  admin: {
    group: "Contenido",
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "createdAt"],
    description: "Las fotos y los logos del sitio. Cada imagen necesita su texto alternativo.",
  },
  // Las imágenes son públicas por diseño: se salta el envoltorio del segundo factor solo en la lectura,
  // para que el visitante pueda ver las fotos. Crear, cambiar y borrar siguen exigiendo sesión verificada.
  custom: { totp: { disableAccessWrapper: { read: true } } },
  access: {
    read: () => true,
    create: soloEquipo,
    update: soloEquipo,
    // Borrar una imagen que alguna página usa la rompe: solo administración.
    delete: soloAdmin,
  },
  upload: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    // El original se reduce: una foto de teléfono de 12 MB nunca debería llegar así al visitante.
    resizeOptions: { width: 2000, withoutEnlargement: true },
    imageSizes: [
      { name: "miniatura", width: 480, formatOptions: { format: "webp", options: { quality: 80 } } },
      { name: "portada", width: 1280, formatOptions: { format: "webp", options: { quality: 82 } } },
    ],
    adminThumbnail: "miniatura",
    focalPoint: true,
    staticDir: ".medios-local",
  },
  fields: [
    {
      name: "alt",
      label: "Texto alternativo",
      type: "text",
      required: true,
      localized: true,
      minLength: 5,
      admin: {
        description:
          "Describe qué se ve, para quien no puede verla. Por ejemplo: «Voluntarios sirviendo comida en una jornada». Si es un logo, el nombre del proyecto.",
      },
    },
    {
      name: "pie",
      label: "Pie de foto",
      type: "text",
      localized: true,
      admin: { description: "Opcional. Se ve debajo de la foto." },
    },
    {
      name: "requiereConsentimiento",
      label: "Salen niños o personas en situación de calle",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Márcalo si en la foto se reconoce a un menor o a alguien en situación de calle." },
    },
    {
      name: "consentimientoRegistrado",
      label: "Tengo el consentimiento firmado",
      type: "checkbox",
      defaultValue: false,
      admin: {
        condition: (_, hermanos) => hermanos?.requiereConsentimiento === true,
        description: "Sin el consentimiento firmado no se puede guardar esta foto.",
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.requiereConsentimiento && !data.consentimientoRegistrado) {
          throw new APIError(
            "Esta foto necesita el consentimiento firmado de quienes salen en ella. Regístralo para poder guardarla.",
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
