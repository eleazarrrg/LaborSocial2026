import { z } from "zod";
import {
  AREAS_VOLUNTARIADO,
  ENTREGA_VALORES,
  MODALIDADES_VALORES,
} from "./opciones";

/**
 * Esquemas de validación.
 *
 * El mismo esquema corre en el cliente y en el servidor (CLAUDE.md §6). Los
 * tipos se derivan con z.infer; no se escriben dos veces.
 *
 * MINIMIZACIÓN (RNF-09, X-05): cada campo de aquí tiene que estar justificado.
 * Lo que no se recoge no se puede filtrar. En particular, el formulario de cita
 * NO pide diagnóstico, síntomas, medicación ni relato clínico, y el motivo es
 * OPCIONAL y de una línea.
 */

const requerido = "Este campo es obligatorio.";

const nombre = z
  .string()
  .trim()
  .min(2, "Escribe tu nombre.")
  .max(120, "Nombre demasiado largo.");

const correo = z
  .string()
  .trim()
  .max(160)
  .email("Ese correo no parece válido.")
  .optional()
  .or(z.literal("").transform(() => undefined));

// Panamá: 7 u 8 dígitos, con o sin guion, con o sin +507.
const telefono = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+\d][\d\s()-]{5,}$/, "Ese teléfono no parece válido.")
  .optional()
  .or(z.literal("").transform(() => undefined));

const consentimiento = z.literal("on", {
  message: "Necesitamos tu autorización para responderte.",
});

/** Si no hay ni correo ni teléfono, no hay forma de responder. */
function exigirContacto(
  datos: { correo?: string; telefono?: string },
  ctx: z.RefinementCtx,
) {
  if (!datos.correo && !datos.telefono) {
    ctx.addIssue({
      code: "custom",
      path: ["correo"],
      message: "Déjanos un correo o un teléfono para poder responderte.",
    });
  }
}

/* ------------------------------------------------- Solicitud de cita (RF-02) */

export const esquemaCita = z
  .object({
    nombre,
    correo,
    telefono,
    modalidad: z.enum(MODALIDADES_VALORES, {
      message: requerido,
    }),
    // Opcional a propósito. Nadie debería tener que explicar por qué está mal
    // para poder pedir una cita.
    motivo: z
      .string()
      .trim()
      .max(280, "Con una línea basta.")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    disponibilidad: z.string().trim().max(200).optional(),
    atencionPronto: z.literal("on").optional(),
    consentimiento,
  })
  .superRefine(exigirContacto);

/* --------------------------------------------------- Voluntariado (RF-03) */

export const esquemaVoluntariado = z
  .object({
    nombre,
    correo,
    telefono,
    areas: z
      .array(z.enum(AREAS_VOLUNTARIADO))
      .min(1, "Marca al menos un área en la que puedas apoyar."),
    disponibilidad: z.string().trim().max(200).optional(),
    experiencia: z.string().trim().max(600).optional(),
    consentimiento,
  })
  .superRefine(exigirContacto);

/* -------------------------------------------------- Apadrinamiento (RF-03) */

export const esquemaPadrino = z
  .object({
    nombre,
    correo,
    telefono,
    formaEntrega: z.enum(ENTREGA_VALORES, {
      message: requerido,
    }),
    comentario: z.string().trim().max(400).optional(),
    consentimiento,
  })
  .superRefine(exigirContacto);

/* --------------------------------------------------------- Contacto (RF-10) */

export const esquemaContacto = z
  .object({
    nombre,
    correo,
    telefono,
    asunto: z.string().trim().min(3, requerido).max(140),
    mensaje: z.string().trim().min(10, "Cuéntanos un poco más.").max(2000),
    consentimiento,
  })
  .superRefine(exigirContacto);

export type DatosCita = z.infer<typeof esquemaCita>;
export type DatosVoluntariado = z.infer<typeof esquemaVoluntariado>;
export type DatosPadrino = z.infer<typeof esquemaPadrino>;
export type DatosContacto = z.infer<typeof esquemaContacto>;
