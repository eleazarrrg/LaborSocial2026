"use server";

import { z } from "zod";
import type { EstadoFormulario } from "@/lib/estado-formulario";
import {
  esquemaCita,
  esquemaContacto,
  esquemaPadrino,
  esquemaVoluntariado,
} from "@/lib/esquemas";

/**
 * Acciones de servidor de los formularios.
 *
 * ESTADO: PROTOTIPO. Aquí todavía no se escribe nada.
 *
 * Y eso se le dice al usuario con todas sus letras. Un formulario que responde
 * «recibido» sin haber recibido nada es una mentira en cualquier sitio; en uno
 * donde alguien pide ayuda psicológica es una forma de hacer daño. Mientras no
 * exista la base de datos, el formulario valida, enseña el flujo completo, y
 * deja clarísimo que hay que escribir por WhatsApp.
 *
 * CUANDO ENTRE SUPABASE, el orden es el de CLAUDE.md §4 y no se altera:
 *   1. validar
 *   2. INSERT en Postgres  ← síncrono, y es lo único crítico
 *   3. devolver éxito al usuario
 *   4. el Database Webhook dispara n8n, que manda los correos
 * Si el paso 4 falla, la solicitud ya está guardada y se reintenta. Nunca al
 * revés: un formulario que apunta directo a un webhook pierde datos en silencio.
 */

function aplanarErrores(error: z.ZodError): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? "_");
    // El primer error por campo es el que se muestra: más de uno abruma.
    if (!errores[campo]) errores[campo] = issue.message;
  }
  return errores;
}

function validar(
  esquema: z.ZodTypeAny,
  datos: unknown,
  mensajeExito: string,
): EstadoFormulario {
  const resultado = esquema.safeParse(datos);

  if (!resultado.success) {
    return {
      estado: "error",
      errores: aplanarErrores(resultado.error),
      mensaje: "Revisa los campos marcados.",
    };
  }

  // === Aquí va el INSERT en Supabase. Ver la nota de arriba. ===
  return { estado: "prototipo", mensaje: mensajeExito };
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
  return validar(
    esquemaCita,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      modalidad: texto(formData, "modalidad"),
      motivo: texto(formData, "motivo"),
      disponibilidad: texto(formData, "disponibilidad"),
      atencionPronto: formData.get("atencionPronto") ?? undefined,
      consentimiento: formData.get("consentimiento") ?? "",
    },
    "Tus datos son válidos y el formulario funciona.",
  );
}

/* ---------------------------------------------------------- Voluntariado */

export async function accionVoluntariado(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return validar(
    esquemaVoluntariado,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      areas: formData.getAll("areas").filter((a) => typeof a === "string"),
      disponibilidad: texto(formData, "disponibilidad"),
      experiencia: texto(formData, "experiencia"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    "Tus datos son válidos y el formulario funciona.",
  );
}

/* --------------------------------------------------------- Apadrinamiento */

export async function accionPadrino(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return validar(
    esquemaPadrino,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      formaEntrega: texto(formData, "formaEntrega"),
      comentario: texto(formData, "comentario"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    "Tus datos son válidos y el formulario funciona.",
  );
}

/* -------------------------------------------------------------- Contacto */

export async function accionContacto(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return validar(
    esquemaContacto,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      asunto: texto(formData, "asunto"),
      mensaje: texto(formData, "mensaje"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    "Tus datos son válidos y el formulario funciona.",
  );
}
