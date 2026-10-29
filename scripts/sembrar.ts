/**
 * Siembra el CMS con lo que el sitio ya tenía en el código, y le pone las fotos de referencia.
 *
 *   npm run sembrar
 *
 * Se puede correr cuantas veces haga falta y NUNCA pisa lo que la fundación ya editó:
 *   · un proyecto o campaña que ya existe no se toca (se crea solo el que falta);
 *   · una foto ya subida no se vuelve a subir;
 *   · un espacio de foto que ya tiene imagen no se reemplaza.
 *
 * Qué pone:
 *   1. los logos de `public/marca/` en la biblioteca de imágenes;
 *   2. los 8 proyectos y 2 campañas de `src/lib/catalogo.ts`, con su texto oficial;
 *   3. las fotos de referencia de `contenido-provisional/` (marcadas como «Foto de referencia») en sus
 *      espacios: cada proyecto y los fondos del inicio. Ver docs/fotos-referencia.md.
 *
 * En producción se corre desde la consola de la app (docs/09), con Spaces configurado.
 */
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { getPayload } from "payload";
import { CATALOGO } from "../src/lib/catalogo";
import { PREGUNTAS_BASE } from "../src/lib/preguntas-base";
import type { Tinte } from "../src/lib/fondo";
import config from "../src/payload.config";
import { parrafosALexical } from "../src/payload/lexical";

type Ranura = `inicio:${"portada" | "ayudaDificil" | "ayudaCita" | "ayudaParticipar" | "declaracion"}` | `proyecto:${string}`;
type FotoDeReferencia = {
  archivo: string;
  origen: string;
  autor: string;
  ranura: Ranura;
  alt: string;
  focoX?: number;
  focoY?: number;
};

const HEX = /^#[0-9a-f]{6}$/i;
const payload = await getPayload({ config });
const cuenta = { logos: 0, proyectos: 0, fotos: 0, asignadas: 0, existentes: 0 };

/** Una imagen por nombre de archivo: si ya está, se reutiliza. */
async function medioPorArchivo(archivo: string): Promise<number | null> {
  const { docs } = await payload.find({
    collection: "medios",
    where: { filename: { equals: basename(archivo) } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return docs[0]?.id ?? null;
}

/* ------------------------------------------------------------------ 1. Logos */

const logoPorCodigo = new Map<string, number>();
for (const e of CATALOGO) {
  if (!e.logo?.src.startsWith("/marca/")) continue;
  const ruta = join("public", e.logo.src);
  let id = await medioPorArchivo(ruta);
  if (id === null) {
    const medio = await payload.create({
      collection: "medios",
      overrideAccess: true,
      filePath: ruta,
      data: { alt: e.logo.alt },
    });
    id = medio.id;
    cuenta.logos++;
  }
  logoPorCodigo.set(e.codigo, id);
}

/* ------------------------------------------------------------- 2. Catálogo */

for (const [i, e] of CATALOGO.entries()) {
  const { totalDocs } = await payload.count({
    collection: "proyectos",
    where: { codigo: { equals: e.codigo } },
    overrideAccess: true,
  });
  if (totalDocs > 0) {
    cuenta.existentes++;
    continue;
  }
  await payload.create({
    collection: "proyectos",
    overrideAccess: true,
    data: {
      codigo: e.codigo,
      tipo: e.tipo,
      nombre: e.nombre,
      nombreCorto: e.nombreCorto,
      resumen: e.resumen,
      historia: parrafosALexical(e.parrafos),
      enHonorA: e.enHonorA,
      poblacion: e.poblacion,
      requisitos: e.requisitos?.map((texto) => ({ texto })),
      cuando: e.cuando,
      cifraValor: e.cifra?.valor,
      cifraPie: e.cifra?.pie,
      accionEtiqueta: e.accion.etiqueta,
      accionHref: e.accion.href,
      logo: logoPorCodigo.get(e.codigo),
      logoFondo: e.logo && HEX.test(e.logo.fondo) ? e.logo.fondo : undefined,
      bloqueCrisis: e.bloqueCrisis,
      // Saltos de 10: Edwin puede meter uno en medio sin renumerar todo (docs/07).
      orden: (i + 1) * 10,
      activo: true,
      fondo: { tinte: e.tinte },
    },
  });
  cuenta.proyectos++;
}

/* ---------------------------------------------- 3. Fotos de referencia */

const fotos = JSON.parse(readFileSync(join("contenido-provisional", "fotos.json"), "utf8")) as FotoDeReferencia[];

for (const f of fotos) {
  let id = await medioPorArchivo(f.archivo);
  if (id === null) {
    const medio = await payload.create({
      collection: "medios",
      overrideAccess: true,
      filePath: join("contenido-provisional", "fotos", f.archivo),
      data: {
        alt: f.alt,
        provisional: true,
        autor: f.autor,
        fuente: `https://unsplash.com/photos/${f.origen}`,
        licencia: "Licencia de Unsplash",
        focalX: f.focoX,
        focalY: f.focoY,
      },
    });
    id = medio.id;
    cuenta.fotos++;
  }

  const [tipo, clave] = f.ranura.split(":");
  if (tipo === "proyecto") {
    const { docs } = await payload.find({
      collection: "proyectos",
      where: { codigo: { equals: clave } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const p = docs[0];
    if (!p || p.fondo?.imagen) continue;
    await payload.update({
      collection: "proyectos",
      id: p.id,
      overrideAccess: true,
      data: { fondo: { imagen: id, tinte: (p.fondo?.tinte ?? "turquesa") as Tinte } },
    });
    cuenta.asignadas++;
  } else {
    const guardado = (await payload.findGlobal({ slug: "fondos", depth: 0, overrideAccess: true })) as unknown as Record<
      string,
      { imagen?: unknown; tinte?: Tinte } | undefined
    >;
    if (guardado[clave]?.imagen) continue;
    await payload.updateGlobal({
      slug: "fondos",
      overrideAccess: true,
      data: { [clave]: { imagen: id, tinte: guardado[clave]?.tinte ?? "turquesa" } },
    });
    cuenta.asignadas++;
  }
}

// 4. Las preguntas frecuentes de `src/lib/preguntas-base.ts`: solo si la colección está vacía, para
//    no pisar lo que la fundación ya editó, ocultó o borró a propósito.
const { totalDocs: yaHayPreguntas } = await payload.count({ collection: "preguntas", overrideAccess: true });
let preguntasNuevas = 0;
if (yaHayPreguntas === 0) {
  for (const p of PREGUNTAS_BASE) {
    await payload.create({ collection: "preguntas", overrideAccess: true, data: { ...p, activo: true } });
    preguntasNuevas++;
  }
}

console.log(
  `\nSiembra lista: ${cuenta.logos} logos, ${cuenta.proyectos} proyectos o campañas nuevos` +
    ` (${cuenta.existentes} ya estaban), ${cuenta.fotos} fotos de referencia subidas y ${cuenta.asignadas} asignadas a su espacio.` +
    ` Preguntas frecuentes nuevas: ${preguntasNuevas}${yaHayPreguntas ? " (ya había, no se tocan)" : ""}.`,
);
process.exit(0);
