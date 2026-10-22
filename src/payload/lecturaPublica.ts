import type { Payload, Where } from "payload";

/**
 * Lo que el sitio público lee, y la ÚNICA puerta por la que lo lee.
 *
 * La API de Payload está cerrada al público (payload-totp exige sesión verificada en toda lectura),
 * así que el sitio usa la API local del servidor, que se salta los permisos. Por eso el filtro de
 * «solo lo publicado» y «solo lo activo» tiene que vivir aquí, explícito y probado: si alguien
 * consultara una colección directo, un borrador podría llegar al sitio.
 *
 * Todas las funciones reciben `payload` para poder probarse sin Next. El sitio las llama desde
 * src/lib/contenido.ts. Con `fallbackLocale`, un texto sin traducir se muestra en español.
 */

type Idioma = "es" | "en";
type Opciones = { idioma?: Idioma };

const base = (o: Opciones) => ({
  overrideAccess: true as const,
  locale: o.idioma ?? "es",
  fallbackLocale: "es" as const,
});

const publicado: Where = { _status: { equals: "published" } };

export async function noticiasPublicadas(
  payload: Payload,
  o: Opciones & { pagina?: number; limite?: number; proyecto?: number | string } = {},
) {
  return payload.find({
    collection: "noticias",
    ...base(o),
    draft: false,
    depth: 1,
    page: o.pagina ?? 1,
    limit: o.limite ?? 10,
    sort: "-publicadoEn",
    where: o.proyecto ? { and: [publicado, { proyecto: { equals: o.proyecto } }] } : publicado,
  });
}

export async function noticiaPorSlug(payload: Payload, slug: string, o: Opciones = {}) {
  const { docs } = await payload.find({
    collection: "noticias",
    ...base(o),
    draft: false,
    depth: 2,
    limit: 1,
    where: { and: [publicado, { slug: { equals: slug } }] },
  });
  return docs[0] ?? null;
}

/** Los eventos que todavía no terminaron. Uno vencido deja de listarse por su fecha, sin tareas programadas. */
export async function eventosProximos(payload: Payload, o: Opciones & { ahora?: Date; limite?: number } = {}) {
  const ahora = (o.ahora ?? new Date()).toISOString();
  return payload.find({
    collection: "eventos",
    ...base(o),
    draft: false,
    depth: 1,
    limit: o.limite ?? 20,
    sort: "fechaInicio",
    where: {
      and: [
        publicado,
        // Sin fecha de fin, vale la de inicio.
        {
          or: [
            { fechaFin: { greater_than_equal: ahora } },
            { and: [{ fechaFin: { exists: false } }, { fechaInicio: { greater_than_equal: ahora } }] },
          ],
        },
      ],
    },
  });
}

export async function proyectosActivos(payload: Payload, o: Opciones & { tipo?: "proyecto" | "campana" } = {}) {
  return payload.find({
    collection: "proyectos",
    ...base(o),
    depth: 1,
    limit: 100,
    sort: "orden",
    where: o.tipo
      ? { and: [{ activo: { equals: true } }, { tipo: { equals: o.tipo } }] }
      : { activo: { equals: true } },
  });
}

export async function proyectoPorCodigo(
  payload: Payload,
  tipo: "proyecto" | "campana",
  codigo: string,
  o: Opciones = {},
) {
  const { docs } = await payload.find({
    collection: "proyectos",
    ...base(o),
    depth: 1,
    limit: 1,
    where: { and: [{ activo: { equals: true } }, { tipo: { equals: tipo } }, { codigo: { equals: codigo } }] },
  });
  return docs[0] ?? null;
}
