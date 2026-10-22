import "server-only";
import config from "@payload-config";
import { cache } from "react";
import { getPayload } from "payload";
import type { Evento, Noticia, Proyecto } from "@/payload-types";
import { describirError } from "@/payload/errores";
import { eventosProximos, noticiaPorSlug, noticiasPublicadas } from "@/payload/lecturaPublica";
import { aFoto } from "./contenido";
import type { Foto } from "./fondo";

/**
 * Noticias y eventos tal como los usa el sitio. Misma regla que lib/contenido.ts: la página nunca
 * queda en blanco. Si la base falla se muestra «todavía no hay nada» y el error queda en el registro
 * del servidor (CLAUDE.md §6), nunca un 500 en una página pública.
 */

export const NOTICIAS_POR_PAGINA = 9;

export type ResumenNoticia = {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
  portada?: Foto;
  proyecto?: { codigo: string; nombre: string; ruta: string };
};

export type DetalleNoticia = ResumenNoticia & {
  cuerpo?: NonNullable<Noticia["cuerpo"]>;
  /** El proyecto de la noticia pide el bloque de crisis (CLAUDE.md §5.1). */
  bloqueCrisis: boolean;
};

export type ResumenEvento = {
  titulo: string;
  resumen: string;
  inicio: string;
  fin?: string;
  lugar?: string;
  inscripcionUrl?: string;
};

const proyectoDe = (p: Noticia["proyecto"]): ResumenNoticia["proyecto"] => {
  if (!p || typeof p !== "object") return undefined;
  const x: Proyecto = p;
  // Un proyecto oculto no se nombra ni se enlaza: su página daría 404.
  if (x.activo === false) return undefined;
  return { codigo: x.codigo, nombre: x.nombreCorto, ruta: `/${x.tipo === "campana" ? "campanas" : "proyectos"}/${x.codigo}` };
};

const aResumen = (n: Noticia): ResumenNoticia => ({
  slug: n.slug,
  titulo: n.titulo,
  resumen: n.resumen,
  fecha: n.publicadoEn ?? n.createdAt,
  portada: aFoto(n.portada),
  proyecto: proyectoDe(n.proyecto),
});

export async function noticias(o: { pagina?: number; proyecto?: string; limite?: number } = {}) {
  const vacio = { items: [] as ResumenNoticia[], paginas: 1, pagina: 1 };
  try {
    const payload = await getPayload({ config });
    let proyecto: number | undefined;
    if (o.proyecto) {
      const { docs } = await payload.find({
        collection: "proyectos",
        where: { and: [{ codigo: { equals: o.proyecto } }, { activo: { equals: true } }] },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      // Un filtro con un código que no existe no muestra «todas»: muestra ninguna.
      if (!docs[0]) return vacio;
      proyecto = docs[0].id;
    }
    const r = await noticiasPublicadas(payload, { pagina: o.pagina, limite: o.limite ?? NOTICIAS_POR_PAGINA, proyecto });
    return { items: r.docs.map(aResumen), paginas: r.totalPages || 1, pagina: r.page ?? 1 };
  } catch (error) {
    console.error(`[publicaciones] noticias: se muestra la lista vacía. ${describirError(error)}`);
    return vacio;
  }
}

/**
 * `null` solo cuando la noticia de verdad no existe. Si la base falla el error se propaga: un 404
 * falso podría quedar en caché o en buscadores, y un 500 no.
 */
export const noticia = cache(async (slug: string): Promise<DetalleNoticia | null> => {
  const payload = await getPayload({ config });
  const n = await noticiaPorSlug(payload, slug);
  if (!n) return null;
  const bloqueCrisis = typeof n.proyecto === "object" && n.proyecto ? (n.proyecto.bloqueCrisis ?? false) : false;
  return { ...aResumen(n), cuerpo: n.cuerpo ?? undefined, bloqueCrisis };
});

export async function eventos(limite = 5): Promise<ResumenEvento[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await eventosProximos(payload, { limite });
    return docs.map((e: Evento) => ({
      titulo: e.titulo,
      resumen: e.resumen,
      inicio: e.fechaInicio,
      fin: e.fechaFin ?? undefined,
      lugar: e.lugar ?? undefined,
      inscripcionUrl: e.inscripcionUrl ?? undefined,
    }));
  } catch (error) {
    console.error(`[publicaciones] eventos: se muestra la lista vacía. ${describirError(error)}`);
    return [];
  }
}

const FORMATO = new Intl.DateTimeFormat("es-PA", { dateStyle: "long", timeZone: "America/Panama" });
const FORMATO_HORA = new Intl.DateTimeFormat("es-PA", { timeStyle: "short", timeZone: "America/Panama" });

export const fechaLarga = (iso: string) => FORMATO.format(new Date(iso));
export const horaCorta = (iso: string) => FORMATO_HORA.format(new Date(iso));
