/**
 * Datos de contacto y de donación de la fundación.
 *
 * Todo lo que hay aquí en `null` es un pendiente real que Edwin tiene que
 * entregar (docs/06-inventario-contenido.md). El prototipo los muestra como
 * pendientes en vez de inventarlos: un número de WhatsApp equivocado en el
 * sitio de una fundación manda a la gente a un desconocido, y un número de
 * cuenta equivocado manda dinero a otra parte.
 *
 * En producción esto vive en la tabla `ajustes` y lo edita el panel (RF-09,
 * módulo 3.2.7). Un número de cuenta escrito en el código es un error de diseño.
 */

export const CONTACTO = {
  /**
   * WhatsApp de la fundación, solo dígitos con el código de país (Panamá, 507): es la forma que pide
   * `wa.me`. Entregado el 29-10-2026 (+507 6058-3801). Confirmar con Edwin que es el número de la fundación.
   */
  whatsapp: "50760583801" as string | null,
  /**
   * El correo que la fundación usa hoy. Es un Gmail, no el institucional:
   * sirve de interino hasta que haya dominio propio (R-07, pendiente T-05).
   */
  correo: "refuva.panama@gmail.com" as string | null,
  instagram: "https://www.instagram.com/refuva_pma/",
  instagramUsuario: "@refuva_pma",
  /** Pendiente S-05: dirección física, si es publicable. */
  direccion: null as string | null,
  /** Pendiente S-05: horarios de atención. */
  horario: null as string | null,
} as const;

export const DONACIONES = {
  /** Pendiente S-06: alias de Yappy Comercial. Requiere cuenta comercial en Banco General. */
  yappy: null as string | null,
  /** Pendiente S-06: banco, tipo de cuenta, número y titular exactos. */
  cuenta: null as {
    banco: string;
    tipo: string;
    numero: string;
    titular: string;
  } | null,
} as const;

/** Precio de la atención psicológica, confirmado en la reunión (S-01). */
export const PRECIO_CONSULTA = "B/.15.00";

/**
 * Versión de /privacidad que cada persona aceptó al enviar un formulario. Se guarda con la
 * fila (`politica_version`). Cambia este texto cada vez que cambie la política.
 */
export const POLITICA_VERSION = "borrador-2026-10";

/** «+507 6058-3801»: como se escribe en pantalla el número de WhatsApp (507 + 8 dígitos). */
export function whatsappVisible(): string | null {
  const m = CONTACTO.whatsapp?.match(/^507(\d{4})(\d{4})$/);
  return m ? `+507 ${m[1]}-${m[2]}` : (CONTACTO.whatsapp ?? null);
}

/** El enlace que abre el chat (la app en el teléfono, WhatsApp Web en el computador). */
export function enlaceWhatsapp(): string | null {
  return CONTACTO.whatsapp ? `https://wa.me/${CONTACTO.whatsapp}` : null;
}
