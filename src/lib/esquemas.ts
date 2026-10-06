import { z } from "zod";
import {
  AREAS_VALORES,
  CONTACTO_VALORES,
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

// Las longitudes son las mismas que los CHECK de supabase/migrations/*_formularios.sql.
// Si cambias una, cambia la otra: si no, Postgres rechaza lo que Zod dejó pasar.

/** Un campo opcional que llega vacío (o solo con espacios) es «no lo llenó». */
const opcional = <T extends z.ZodType>(esquema: T) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    esquema.optional(),
  );

const nombre = z
  .string()
  .trim()
  .min(2, "Escribe tu nombre.")
  .max(120, "Nombre demasiado largo.");

// En minúscula: el CHECK de la base lo exige y así un mismo correo no se inscribe dos veces.
const correo = z
  .string()
  .trim()
  .toLowerCase()
  .max(160, "Correo demasiado largo.")
  .email("Ese correo no parece válido.");

// Panamá: 7 u 8 dígitos, con o sin guion, con o sin +507.
const telefono = z
  .string()
  .trim()
  .max(25, "Teléfono demasiado largo.")
  .regex(/^[+\d][\d\s()-]{5,}$/, "Ese teléfono no parece válido.");

const disponibilidad = opcional(
  z.string().trim().min(3, "Cuéntanos un poco más.").max(200),
);

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
    correo: opcional(correo),
    telefono: opcional(telefono),
    contactoPreferido: z.enum(CONTACTO_VALORES, {
      message: "Dinos por dónde prefieres que te escribamos.",
    }),
    modalidad: z.enum(MODALIDADES_VALORES, { message: requerido }),
    // Opcional a propósito. Nadie debería tener que explicar por qué está mal
    // para poder pedir una cita.
    motivo: opcional(
      z.string().trim().min(5, "Si lo escribes, que sean unas palabras.").max(280, "Con una línea basta."),
    ),
    disponibilidad,
    atencionPronto: z.literal("on").optional(),
    consentimiento,
  })
  .superRefine((datos, ctx) => {
    exigirContacto(datos, ctx);
    if (datos.contactoPreferido === "correo" && !datos.correo) {
      ctx.addIssue({
        code: "custom",
        path: ["correo"],
        message: "Elegiste correo: déjanos tu correo.",
      });
    }
    if (datos.contactoPreferido !== "correo" && !datos.telefono) {
      ctx.addIssue({
        code: "custom",
        path: ["telefono"],
        message: "Elegiste teléfono o WhatsApp: déjanos tu número.",
      });
    }
  });

/* --------------------------------------------------- Voluntariado (RF-03) */

// El correo es obligatorio aquí, no en la cita: la logística de una jornada se
// coordina por correo, y quien se ofrece a ayudar no está en crisis (docs/07 §3.8).
export const esquemaVoluntariado = z
  .object({
    nombre,
    correo,
    telefono: opcional(telefono),
    areas: z
      .array(z.enum(AREAS_VALORES))
      .min(1, "Marca al menos un área en la que puedas apoyar."),
    otraArea: opcional(z.string().trim().min(2, "Cuéntanos cuál.").max(80)),
    disponibilidad,
    experiencia: opcional(z.string().trim().max(500)),
    consentimiento,
  })
  .refine((d) => !d.areas.includes("otra") || d.otraArea, {
    path: ["otraArea"],
    message: "Marcaste «Otra»: cuéntanos cuál.",
  });

/* -------------------------------------------------- Apadrinamiento (RF-03) */

// Correo y teléfono, los dos: hay que coordinar la entrega de un regalo en fecha fija.
export const esquemaPadrino = z.object({
  nombre,
  correo,
  telefono,
  cantidadNinos: z.preprocess(
    (v) => (v === "" || v == null ? 1 : v),
    z.coerce
      .number({ message: "Escribe un número." })
      .int("Escribe un número entero.")
      .min(1, "Al menos uno.")
      .max(10, "Para más de diez, escríbenos y lo coordinamos."),
  ),
  formaEntrega: z.enum(ENTREGA_VALORES, { message: requerido }),
  comentario: opcional(z.string().trim().max(400)),
  consentimiento,
});

/* --------------------------------------------------------- Contacto (RF-10) */

export const esquemaContacto = z
  .object({
    nombre,
    correo: opcional(correo),
    telefono: opcional(telefono),
    asunto: z.string().trim().min(3, requerido).max(140),
    mensaje: z.string().trim().min(10, "Cuéntanos un poco más.").max(2000),
    consentimiento,
  })
  .superRefine(exigirContacto);
