import "server-only";
import config from "@payload-config";
import { cache } from "react";
import { getPayload } from "payload";
import type { Fondo as FondoDeInicio, Medio, Proyecto } from "@/payload-types";
import { describirError } from "@/payload/errores";
import { proyectosActivos } from "@/payload/lecturaPublica";
import { textoPlano } from "@/payload/lenguaSeguro";
import { CATALOGO, type Entrada, type TipoEntrada } from "./catalogo";
import { esTinte, type Foto, type Fondo, type Tinte } from "./fondo";

/**
 * Lo que el sitio lee del CMS, y la única puerta por la que lo lee.
 *
 * Regla de oro (CLAUDE.md §6): una página nunca queda en blanco. Si la base falla, o todavía no se
 * sembró, se muestra el catálogo del código (src/lib/catalogo.ts) y el error queda en el registro
 * del servidor. El sitio puede verse sin fotos y con los textos de siempre; no puede verse roto.
 */

const CATALOGO_POR_CODIGO = new Map(CATALOGO.map((e) => [e.codigo, e]));

/* ------------------------------------------------------------------ Fotos */

function aFoto(m: unknown): Foto | undefined {
  if (!m || typeof m !== "object") return undefined;
  const x = m as Medio;
  if (!x.url || !x.width || !x.height) return undefined;
  return {
    original: x.url,
    miniatura: x.sizes?.miniatura?.url ?? undefined,
    portada: x.sizes?.portada?.url ?? undefined,
    panoramica: x.sizes?.panoramica?.url ?? undefined,
    ancho: x.width,
    alto: x.height,
    focoX: x.focalX ?? undefined,
    focoY: x.focalY ?? undefined,
    provisional: x.provisional ?? undefined,
  };
}

function aFondo(f: { imagen?: unknown; tinte?: string | null } | null | undefined, porDefecto: Tinte): Fondo {
  return { tinte: esTinte(f?.tinte) ? f.tinte : porDefecto, foto: aFoto(f?.imagen) };
}

/* -------------------------------------------------------------- Catálogo */

/** Los párrafos de un texto enriquecido, para quien necesita texto plano (descripciones, respaldo). */
function parrafosDe(historia: unknown): string[] {
  const raiz = (historia as { root?: { children?: unknown[] } } | null)?.root;
  return (raiz?.children ?? []).map((n) => textoPlano(n).replace(/\s+/g, " ").trim()).filter(Boolean);
}

function aEntrada(p: Proyecto): Entrada {
  const base = CATALOGO_POR_CODIGO.get(p.codigo);
  const parrafos = parrafosDe(p.historia);
  const tinte = esTinte(p.fondo?.tinte) ? p.fondo.tinte : (base?.tinte ?? "turquesa");
  const logo = aFoto(p.logo);
  const logoMedio = typeof p.logo === "object" ? p.logo : null;

  return {
    codigo: p.codigo,
    tipo: p.tipo,
    nombre: p.nombre,
    nombreCorto: p.nombreCorto,
    resumen: p.resumen,
    cifra: p.cifraValor && p.cifraPie ? { valor: p.cifraValor, pie: p.cifraPie } : undefined,
    poblacion: p.poblacion ?? base?.poblacion ?? "",
    parrafos: parrafos.length ? parrafos : (base?.parrafos ?? []),
    historia: parrafos.length ? (p.historia ?? undefined) : undefined,
    enHonorA: p.enHonorA ?? undefined,
    requisitos: p.requisitos?.length ? p.requisitos.map((r) => r.texto) : base?.requisitos,
    cuando: p.cuando ?? base?.cuando,
    accion: {
      etiqueta: p.accionEtiqueta || base?.accion.etiqueta || "Participar",
      href: p.accionHref || base?.accion.href || "/participar",
    },
    logo: logo
      ? { src: logo.miniatura ?? logo.original, fondo: p.logoFondo ?? "#ffffff", alt: logoMedio?.alt ?? p.nombre }
      : base?.logo,
    bloqueCrisis: p.bloqueCrisis ?? false,
    tinte,
    fondo: aFondo(p.fondo, tinte),
  };
}

/** Los proyectos y las campañas activos, ordenados. Es la lista que se muestra en todo el sitio. */
export const catalogo = cache(async (): Promise<Entrada[]> => {
  try {
    const payload = await getPayload({ config });
    const { docs } = await proyectosActivos(payload);
    // Base vacía (aún no se sembró): el catálogo del código. Con al menos uno, manda la base.
    return docs.length ? docs.map(aEntrada) : CATALOGO;
  } catch (error) {
    console.error(`[contenido] catálogo: se usa el del código. ${describirError(error)}`);
    return CATALOGO;
  }
});

export const proyectos = async () => (await catalogo()).filter((e) => e.tipo === "proyecto");
export const campanas = async () => (await catalogo()).filter((e) => e.tipo === "campana");

export async function entradaPorCodigo(tipo: TipoEntrada, codigo: string): Promise<Entrada | undefined> {
  return (await catalogo()).find((e) => e.tipo === tipo && e.codigo === codigo);
}

/* ---------------------------------------------------------------- Inicio */

export type FondosInicio = Record<
  "portada" | "ayudaDificil" | "ayudaCita" | "ayudaParticipar" | "declaracion",
  Fondo
>;

/** Los tintes con que se ve cada bloque cuando todavía no hay foto ni nada guardado. */
const TINTES_INICIO: Record<keyof FondosInicio, Tinte> = {
  portada: "turquesa",
  ayudaDificil: "naranja",
  ayudaCita: "turquesa",
  ayudaParticipar: "marron",
  declaracion: "turquesa",
};

export const fondosInicio = cache(async (): Promise<FondosInicio> => {
  let guardado: Partial<FondoDeInicio> = {};
  try {
    const payload = await getPayload({ config });
    guardado = await payload.findGlobal({ slug: "fondos", depth: 1, overrideAccess: true });
  } catch (error) {
    console.error(`[contenido] fondos del inicio: se usan los colores. ${describirError(error)}`);
  }
  const fondo = (clave: keyof FondosInicio) => aFondo(guardado[clave], TINTES_INICIO[clave]);
  return {
    portada: fondo("portada"),
    ayudaDificil: fondo("ayudaDificil"),
    ayudaCita: fondo("ayudaCita"),
    ayudaParticipar: fondo("ayudaParticipar"),
    declaracion: fondo("declaracion"),
  };
});
