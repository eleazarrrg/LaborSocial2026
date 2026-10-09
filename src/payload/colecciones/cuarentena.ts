import type { CollectionConfig } from "payload";
import { nadie, soloAdmin } from "../acceso";

/**
 * Lo que cayó en el campo trampa de un formulario: casi siempre un robot. No entra a la bandeja,
 * pero tampoco se descarta (RNF-22): si era una persona, se le contacta a mano.
 */
export const Cuarentena: CollectionConfig = {
  slug: "cuarentena",
  labels: { singular: "Envío en cuarentena", plural: "Cuarentena" },
  admin: {
    group: "Solicitudes",
    useAsTitle: "formulario",
    defaultColumns: ["createdAt", "formulario", "revisado"],
    description:
      "Envíos que llenaron un campo que una persona no ve. Revísalos de vez en cuando por si alguno era real.",
  },
  defaultSort: "createdAt",
  access: { read: soloAdmin, update: soloAdmin, delete: soloAdmin, create: nadie },
  fields: [
    {
      name: "formulario",
      type: "select",
      required: true,
      options: [
        { label: "Cita", value: "solicitudes-cita" },
        { label: "Voluntariado", value: "inscripciones-voluntariado" },
        { label: "Padrinos", value: "inscripciones-padrinos" },
        { label: "Contacto", value: "mensajes-contacto" },
      ],
      admin: { readOnly: true },
    },
    {
      name: "motivo",
      type: "select",
      required: true,
      defaultValue: "campo_trampa",
      options: [{ label: "Llenó el campo trampa", value: "campo_trampa" }],
      admin: { readOnly: true },
    },
    // Solo los campos ya validados y recortados por Zod; nunca el FormData crudo.
    { name: "carga", label: "Lo que envió", type: "json", required: true, admin: { readOnly: true } },
    { name: "revisado", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    {
      name: "veredicto",
      type: "select",
      options: [
        { label: "Era un robot", value: "robot" },
        { label: "Era una persona: se le contactó", value: "persona" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
