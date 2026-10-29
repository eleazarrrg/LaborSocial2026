import "server-only";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getPayload } from "payload";
import { describirError } from "@/payload/errores";
import { ETIQUETA_CMS, SEGUNDOS_CACHE } from "./cache-cms";
import { PREGUNTAS_BASE, type Pregunta, type TemaPregunta } from "./preguntas-base";

/**
 * Las preguntas frecuentes tal como las usa el sitio. Misma regla que lib/contenido.ts: la página
 * nunca queda sin ellas. Si la base falla, o la colección todavía no se creó o sembró, se muestran las
 * del código; el error queda en el registro del servidor (CLAUDE.md §6).
 */

/** La lectura de la base, en la caché de datos. LANZA si la base falla (así no se cachea el fallo). */
const leer = unstable_cache(
  async (): Promise<Pregunta[]> => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "preguntas",
      overrideAccess: true,
      depth: 0,
      limit: 200,
      sort: "orden",
      where: { activo: { equals: true } },
    });
    if (docs.length) {
      return docs.map((d) => ({ pregunta: d.pregunta, respuesta: d.respuesta, tema: d.tema, orden: d.orden }));
    }
    // Sin activas: las del código solo si la colección NUNCA se sembró. Si Edwin ocultó todas, se respeta.
    const { totalDocs } = await payload.count({ collection: "preguntas", overrideAccess: true });
    return totalDocs === 0 ? PREGUNTAS_BASE : [];
  },
  ["cms-preguntas"],
  { tags: [ETIQUETA_CMS], revalidate: SEGUNDOS_CACHE },
);

/** Las preguntas visibles, en orden; solo las de un tema si se pide. */
export const preguntas = cache(async (tema?: TemaPregunta): Promise<Pregunta[]> => {
  let todas: Pregunta[];
  try {
    todas = await leer();
  } catch (error) {
    console.error(`[preguntas] se usan las del código. ${describirError(error)}`);
    todas = PREGUNTAS_BASE;
  }
  return tema ? todas.filter((p) => p.tema === tema) : todas;
});
