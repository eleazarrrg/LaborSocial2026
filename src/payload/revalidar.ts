import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook, Plugin } from "payload";
import { ETIQUETA_CMS } from "@/lib/cache-cms";

/**
 * Cuando Edwin guarda, publica, oculta o borra algo en el panel, el sitio se entera AL INSTANTE.
 *
 * El sitio lee del panel a través de una caché (lib/cache-cms.ts) para que cada clic no consulte la
 * base. Este plugin expira esa caché en cada cambio de lo que el sitio muestra: proyectos y campañas,
 * noticias, eventos, imágenes y los fondos del inicio. Va como plugin y no en cada colección para que
 * quien agregue una colección nueva vea en UN solo lugar cuáles invalidan el sitio.
 *
 * Si algo falla aquí NO se pierde nada ni se bloquea el guardado: el error queda en el registro y el
 * sitio se pone al día solo cuando vence la caché (SEGUNDOS_CACHE).
 */

const COLECCIONES = new Set(["proyectos", "noticias", "eventos", "medios"]);
const GLOBALES = new Set(["fondos"]);

function expirar(origen: string): void {
  // Fuera de Next (scripts de siembra o de pruebas) no hay caché de datos que expirar.
  if (!process.env.NEXT_RUNTIME) return;
  try {
    revalidateTag(ETIQUETA_CMS, { expire: 0 });
  } catch (error) {
    console.error(
      `[revalidar] ${origen}: no se pudo expirar la caché; el sitio se actualiza al vencer. ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

const alCambiar =
  (origen: string): CollectionAfterChangeHook =>
  ({ doc }) => {
    expirar(origen);
    return doc;
  };

const alBorrar =
  (origen: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    expirar(origen);
    return doc;
  };

const alCambiarGlobal =
  (origen: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    expirar(origen);
    return doc;
  };

export const revalidarAlGuardar: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map((c) =>
    COLECCIONES.has(c.slug)
      ? {
          ...c,
          hooks: {
            ...c.hooks,
            afterChange: [...(c.hooks?.afterChange ?? []), alCambiar(c.slug)],
            afterDelete: [...(c.hooks?.afterDelete ?? []), alBorrar(c.slug)],
          },
        }
      : c,
  ),
  globals: config.globals?.map((g) =>
    GLOBALES.has(g.slug)
      ? { ...g, hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), alCambiarGlobal(g.slug)] } }
      : g,
  ),
});
