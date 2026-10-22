import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Portada } from "@/components/portada";
import { Boton, TituloPagina } from "@/components/ui";
import { CONTACTO } from "@/lib/contacto";
import { catalogo } from "@/lib/contenido";
import { eventos, fechaLarga, horaCorta, noticias } from "@/lib/publicaciones";

export const metadata: Metadata = {
  title: "Noticias y eventos",
  description:
    "Publicaciones y actividades de la Fundación REFUVA: jornadas, convocatorias y contenido psicoeducativo.",
};

/**
 * Noticias y eventos (módulo 3.1.7, RF-01).
 *
 * Todo lo publica Edwin desde el panel. Las noticias van en filas (se leen mejor que una rejilla de
 * tarjetas y aguantan titulares largos), con un filtro por proyecto y paginación en la dirección
 * (`?proyecto=` y `?pagina=`) para poder compartir una vista. Los eventos vencidos dejan de listarse
 * por su fecha, sin tareas programadas.
 *
 * Con la base vacía se ve un estado vacío honesto, que es lo que verá Edwin el día del lanzamiento.
 */

type Props = { searchParams: Promise<{ proyecto?: string | string[]; pagina?: string | string[] }> };

const ruta = (proyecto?: string, pagina?: number) => {
  const q = new URLSearchParams();
  if (proyecto) q.set("proyecto", proyecto);
  if (pagina && pagina > 1) q.set("pagina", String(pagina));
  const s = q.toString();
  return s ? `/noticias?${s}` : "/noticias";
};

export default async function Noticias({ searchParams }: Props) {
  const params = await searchParams;
  // Un parámetro repetido llega como arreglo: vale el primero.
  const primero = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const proyecto = primero(params.proyecto);
  const pidida = Math.min(1000, Math.max(1, Math.floor(Number(primero(params.pagina))) || 1));
  const [lista, proximos, entradas] = await Promise.all([
    noticias({ pagina: pidida, proyecto }),
    eventos(),
    catalogo(),
  ]);
  // Una página que no existe vuelve a la última: no se muestra «no hay nada» con noticias publicadas.
  if (pidida > lista.paginas) redirect(ruta(proyecto, lista.paginas));
  const hayFiltro = Boolean(proyecto);

  return (
    <>
      <TituloPagina
        titulo="Lo que va pasando."
        entrada="Jornadas, convocatorias y contenido psicoeducativo, publicados por la fundación."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0">
          <nav aria-label="Filtrar por proyecto">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href="/noticias"
                  aria-current={hayFiltro ? undefined : "page"}
                  className={`inline-flex min-h-11 items-center rounded-full border-2 px-4 font-bold ${hayFiltro ? "border-borde-fuerte" : "border-tinta bg-tinta text-papel"}`}
                >
                  Todas
                </Link>
              </li>
              {entradas.map((e) => (
                <li key={e.codigo}>
                  <Link
                    href={ruta(e.codigo)}
                    aria-current={proyecto === e.codigo ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full border-2 px-4 font-bold ${proyecto === e.codigo ? "border-tinta bg-tinta text-papel" : "border-borde-fuerte"}`}
                  >
                    {e.nombreCorto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {lista.items.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-borde-fuerte bg-papel-alto px-6 py-14 text-center sm:px-10">
              <p className="text-2xl font-extrabold sm:text-3xl">
                {hayFiltro ? "No hay noticias de este proyecto todavía." : "Todavía no hay nada publicado."}
              </p>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-tinta-suave">
                Mientras tanto, la actividad de la fundación se ve en Instagram.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {hayFiltro && <Boton href="/noticias" variante="secundario">Ver todas las noticias</Boton>}
                <Boton href="/proyectos" variante="secundario">Ver los proyectos</Boton>
              </div>
            </div>
          ) : (
            <ul className="mt-8 border-t border-borde">
              {lista.items.map((n) => (
                <li key={n.slug} className="border-b border-borde">
                  <article className="grid gap-5 py-7 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8">
                    {n.portada && (
                      <Link href={`/noticias/${n.slug}`} tabIndex={-1} aria-hidden className="block overflow-hidden rounded-xl">
                        <Portada foto={n.portada} sizes="(min-width: 640px) 224px, 100vw" className="aspect-[3/2]" />
                      </Link>
                    )}
                    <div className={n.portada ? "" : "sm:col-span-2"}>
                      <p className="text-sm text-tinta-suave">
                        <time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time>
                        {n.proyecto && <> · {n.proyecto.nombre}</>}
                      </p>
                      <h2 className="mt-2 text-2xl leading-tight font-extrabold">
                        <Link href={`/noticias/${n.slug}`} className="underline-offset-4 hover:underline">
                          {n.titulo}
                        </Link>
                      </h2>
                      <p className="mt-3 max-w-[60ch] leading-relaxed text-tinta-suave">{n.resumen}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}

          {lista.paginas > 1 && (
            <nav aria-label="Páginas de noticias" className="mt-8 flex items-center justify-between gap-4">
              {lista.pagina > 1 ? (
                <Link href={ruta(proyecto, lista.pagina - 1)} className="inline-flex min-h-11 items-center font-bold text-fuerte underline underline-offset-4">
                  ← Más recientes
                </Link>
              ) : <span />}
              <span className="text-sm text-tinta-suave">Página {lista.pagina} de {lista.paginas}</span>
              {lista.pagina < lista.paginas ? (
                <Link href={ruta(proyecto, lista.pagina + 1)} className="inline-flex min-h-11 items-center font-bold text-fuerte underline underline-offset-4">
                  Anteriores →
                </Link>
              ) : <span />}
            </nav>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section aria-labelledby="eventos" className="rounded-xl border border-borde bg-papel-alto p-6">
            <h2 id="eventos" className="text-lg font-extrabold">Próximos eventos</h2>
            {proximos.length === 0 ? (
              <p className="mt-3 text-sm text-tinta-suave">No hay eventos próximos por ahora.</p>
            ) : (
              <ul className="mt-4 space-y-5">
                {proximos.map((e) => (
                  <li key={`${e.titulo}-${e.inicio}`}>
                    <p className="text-sm font-bold text-fuerte">
                      <time dateTime={e.inicio}>{fechaLarga(e.inicio)}, {horaCorta(e.inicio)}</time>
                    </p>
                    <p className="mt-1 font-extrabold">{e.titulo}</p>
                    {e.lugar && <p className="text-sm text-tinta-suave">{e.lugar}</p>}
                    <p className="mt-1 text-sm text-tinta-suave">{e.resumen}</p>
                    {e.inscripcionUrl && (
                      <a href={e.inscripcionUrl} rel="noopener noreferrer" target="_blank" className="mt-2 inline-flex min-h-11 items-center font-bold text-fuerte underline underline-offset-4">
                        Inscribirme
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="instagram" className="rounded-xl border border-borde p-6">
            <h2 id="instagram" className="text-lg font-extrabold">Y en Instagram</h2>
            <p className="mt-3 text-sm text-tinta-suave">El día a día de la fundación se ve primero en sus redes.</p>
            <a href={CONTACTO.instagram} rel="noopener noreferrer" target="_blank" className="mt-3 inline-flex min-h-11 items-center font-bold text-fuerte underline underline-offset-4">
              @refuva_pma
            </a>
          </section>
        </aside>
      </div>
    </>
  );
}
