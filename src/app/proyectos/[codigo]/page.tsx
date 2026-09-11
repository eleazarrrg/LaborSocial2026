import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BloqueCrisis } from "@/components/banda-crisis";
import { Boton, Dato, Marco, Nota } from "@/components/ui";
import { PROYECTOS, buscarProyecto } from "@/lib/proyectos";

type Props = { params: Promise<{ codigo: string }> };

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ codigo: p.codigo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const proyecto = buscarProyecto(codigo);
  if (!proyecto) return {};
  return {
    title: proyecto.nombreLargo,
    description: proyecto.resumen,
  };
}

/**
 * Página de proyecto (módulo 3.1.3, RF-06).
 *
 * Las siete usan la misma plantilla a propósito: si una tuviera un diseño más
 * lucido que las otras, el sitio estaría diciendo que esa importa más, que es
 * justo lo contrario del requisito raíz.
 *
 * Las que tocan salud mental llevan el bloque completo de crisis (RNF-05). Las
 * que no, no — meter un bloque de prevención del suicidio en la página de
 * alimentación de animales sería ruido, y el ruido gasta la señal.
 */
export default async function PaginaProyecto({ params }: Props) {
  const { codigo } = await params;
  const proyecto = buscarProyecto(codigo);
  if (!proyecto) notFound();

  const indice = PROYECTOS.findIndex((p) => p.codigo === codigo);
  const siguiente = PROYECTOS[(indice + 1) % PROYECTOS.length];

  return (
    <>
      {/* ──────────────────────────────────────────────── Cabecera */}
      <header className="border-b border-borde">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16">
          <nav aria-label="Miga de pan" className="text-sm text-tinta-suave">
            <Link href="/proyectos" className="hover:text-tinta">
              Proyectos
            </Link>
            <span className="mx-2 text-borde-fuerte">/</span>
            <span className="text-tinta">{proyecto.nombre}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="cifras-alineadas font-display text-3xl font-semibold text-valiente">
                {String(indice + 1).padStart(2, "0")}
              </p>
              <h1 className="mt-3 max-w-[16ch] text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
                {proyecto.nombreLargo}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
                {proyecto.resumen}
              </p>
            </div>

            <div className="lg:pb-2 lg:text-right">
              <Dato valor={proyecto.dato} pie={proyecto.datoPie} tamano="grande" />
            </div>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────── Cuerpo */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0">
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed">
            {proyecto.parrafos.map((parrafo) => (
              <p key={parrafo.slice(0, 40)}>{parrafo}</p>
            ))}
          </div>

          <div className="mt-8 max-w-[62ch]">
            <Nota tono="atencion">
              <strong className="text-tinta">Texto provisional.</strong> Esto es
              lo que Edwin contó en la reunión del 20 de agosto, redactado por el
              equipo. El texto definitivo —y la historia de en honor a quién nace
              este proyecto— está pendiente de entrega.
            </Nota>
          </div>

          {proyecto.requisitos && (
            <section className="mt-14 max-w-[62ch]">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Requisitos para participar
              </h2>
              <p className="mt-3 text-tinta-suave">
                Se listan antes del formulario, no después: quien no cumple debe
                saberlo sin llenar nada.
              </p>
              <ul className="mt-6 space-y-4">
                {proyecto.requisitos.map((r) => (
                  <li key={r} className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-valiente"
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Evidencia. Los huecos dicen qué foto va en cada uno: el prototipo
              le sirve a Edwin como encargo visual (docs/06). */}
          <section className="mt-14">
            <h2 className="text-2xl font-semibold sm:text-3xl">Evidencia</h2>
            <p className="mt-3 max-w-[62ch] text-tinta-suave">
              Las fotografías de este proyecto. Es lo que la fundación enseña
              cuando busca patrocinio.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {proyecto.fotosPendientes.map((pie) => (
                <Marco key={pie} pie={pie} />
              ))}
            </div>
          </section>

          {proyecto.saludMental && (
            <div className="mt-14">
              <BloqueCrisis />
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────── Columna lateral */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-borde bg-superficie p-6">
            <h2 className="font-display text-lg font-semibold">
              Cómo participar
            </h2>
            <Boton href={proyecto.accion.href} className="mt-4 w-full">
              {proyecto.accion.etiqueta}
            </Boton>

            <dl className="mt-7 space-y-5 border-t border-borde pt-6 text-sm">
              <div>
                <dt className="font-semibold">Para quién</dt>
                <dd className="mt-1 text-tinta-suave">{proyecto.poblacion}</dd>
              </div>
              {proyecto.cuando && (
                <div>
                  <dt className="font-semibold">Cuándo</dt>
                  <dd className="mt-1 text-tinta-suave">{proyecto.cuando}</dd>
                </div>
              )}
            </dl>
          </div>

          <Link
            href={`/proyectos/${siguiente.codigo}`}
            className="group mt-6 block rounded-xl border border-borde bg-papel-alto p-6 transition-colors hover:bg-fuerte-tenue"
          >
            <span className="text-sm text-tinta-suave">Siguiente línea</span>
            <span className="mt-1.5 block font-display text-xl font-semibold group-hover:text-fuerte">
              {siguiente.nombre} →
            </span>
          </Link>
        </aside>
      </div>
    </>
  );
}
