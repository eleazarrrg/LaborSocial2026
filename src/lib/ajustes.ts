import "server-only";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getPayload } from "payload";
import { describirError } from "@/payload/errores";
import { ETIQUETA_CMS, SEGUNDOS_CACHE } from "./cache-cms";
import { CONTACTO, DONACIONES } from "./contacto";

/**
 * Los ajustes de la fundación tal como los usa el sitio: contacto, redes y donaciones.
 *
 * Edwin los cambia en el panel (Publicar > Ajustes). Misma regla que lib/contenido.ts: la página nunca
 * queda sin ellos. Si la base falla, o el apartado todavía no se guardó nunca, se usan los del código
 * (lib/contacto.ts) y el error queda en el registro del servidor (CLAUDE.md §6). Una vez guardado, manda
 * lo del panel por completo: un campo vacío significa «no mostrar», no «volver al valor del código».
 */

export type RedExtra = { nombre: string; url: string };
export type Cuenta = { banco: string; tipo: string; numero: string; titular: string };

export type Ajustes = {
  /** Solo dígitos con el código de país, la forma de wa.me. */
  whatsapp: string | null;
  correo: string | null;
  /** El enlace de la cuenta de Instagram. */
  instagram: string | null;
  /** «@refuva_pma», sacado del enlace. */
  instagramUsuario: string | null;
  otrasRedes: RedExtra[];
  direccion: string | null;
  horario: string | null;
  yappy: string | null;
  cuenta: Cuenta | null;
};

const texto = (v: unknown): string | null => (typeof v === "string" && v.trim() !== "" ? v.trim() : null);

/** «https://www.instagram.com/refuva_pma/» → «@refuva_pma». */
export function usuarioDeInstagram(enlace: string | null): string | null {
  if (!enlace) return null;
  try {
    const primero = new URL(enlace).pathname.split("/").filter(Boolean)[0];
    return primero ? `@${primero}` : null;
  } catch {
    return null;
  }
}

/** Lo que el sitio mostraba antes de que existiera el panel: es el respaldo. */
export const POR_DEFECTO: Ajustes = {
  whatsapp: CONTACTO.whatsapp,
  correo: CONTACTO.correo,
  instagram: CONTACTO.instagram,
  instagramUsuario: CONTACTO.instagramUsuario,
  otrasRedes: [],
  direccion: CONTACTO.direccion,
  horario: CONTACTO.horario,
  yappy: DONACIONES.yappy,
  cuenta: DONACIONES.cuenta,
};

type Guardado = Record<string, unknown> & {
  cuenta?: Record<string, unknown> | null;
  otrasRedes?: { nombre?: unknown; url?: unknown }[] | null;
};

/** Del documento del panel a lo que usa el sitio. Solo muestra la cuenta si están los cuatro datos. */
export function aAjustes(g: Guardado): Ajustes {
  const instagram = texto(g.instagram);
  const c = g.cuenta ?? {};
  const cuenta =
    texto(c.banco) && texto(c.tipo) && texto(c.numero) && texto(c.titular)
      ? { banco: texto(c.banco)!, tipo: texto(c.tipo)!, numero: texto(c.numero)!, titular: texto(c.titular)! }
      : null;
  return {
    whatsapp: texto(g.whatsapp),
    correo: texto(g.correo),
    instagram,
    instagramUsuario: usuarioDeInstagram(instagram),
    otrasRedes: (g.otrasRedes ?? []).flatMap((r) => {
      const nombre = texto(r.nombre);
      const url = texto(r.url);
      return nombre && url ? [{ nombre, url }] : [];
    }),
    direccion: texto(g.direccion),
    horario: texto(g.horario),
    yappy: texto(g.yappy),
    cuenta,
  };
}

/** La lectura de la base, en la caché de datos. LANZA si la base falla (así no se cachea el fallo). */
const leer = unstable_cache(
  async (): Promise<Guardado | null> => {
    const payload = await getPayload({ config });
    const g = (await payload.findGlobal({ slug: "ajustes", depth: 0, overrideAccess: true })) as unknown as Guardado;
    // Un global que nunca se guardó no trae fecha de actualización: ahí manda el código.
    return g.updatedAt ? g : null;
  },
  ["cms-ajustes"],
  { tags: [ETIQUETA_CMS], revalidate: SEGUNDOS_CACHE },
);

export const ajustes = cache(async (): Promise<Ajustes> => {
  try {
    const g = await leer();
    return g ? aAjustes(g) : POR_DEFECTO;
  } catch (error) {
    console.error(`[ajustes] se usan los del código. ${describirError(error)}`);
    return POR_DEFECTO;
  }
});

/** «+507 6058-3801»: como se escribe en pantalla un número de Panamá (507 + 8 dígitos). */
export function whatsappVisible(digitos: string | null): string | null {
  if (!digitos) return null;
  const m = digitos.match(/^507(\d{4})(\d{4})$/);
  return m ? `+507 ${m[1]}-${m[2]}` : digitos;
}

/** El enlace que abre el chat (la app en el teléfono, WhatsApp Web en el computador). */
export function enlaceWhatsapp(digitos: string | null): string | null {
  return digitos ? `https://wa.me/${digitos}` : null;
}
