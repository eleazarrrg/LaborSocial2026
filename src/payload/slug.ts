import type { FieldHook } from "payload";

/** Minúsculas, sin tildes ni eñes, solo letras, números y guiones: una dirección web que no se rompe. */
export function aSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const SLUG_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * El slug sale del título si no se escribió uno, y NO cambia una vez publicado: una dirección que
 * ya se compartió por WhatsApp no se reasigna ni se rompe (docs/07 §3.3).
 */
export function slugDesde(campoOrigen: string): FieldHook {
  return ({ value, siblingData, originalDoc }) => {
    if (originalDoc?._status === "published" && originalDoc.slug) return originalDoc.slug;
    const escrito = typeof value === "string" ? aSlug(value) : "";
    return escrito || aSlug(String(siblingData?.[campoOrigen] ?? ""));
  };
}
