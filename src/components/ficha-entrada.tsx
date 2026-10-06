import Link from "next/link";
import type { CSSProperties } from "react";
import { BloqueCrisis } from "@/components/banda-crisis";
import { Flecha } from "@/components/iconos";
import { Boton, Placa } from "@/components/ui";
import { CAMPANAS, PROYECTOS, rutaDe, type Entrada } from "@/lib/catalogo";

/**
 * La ficha de un proyecto o de una campaña.
 *
 * Las diez usan la misma plantilla a propósito: si una tuviera un diseño más
 * lucido que las otras, el sitio estaría diciendo que esa importa más, que es lo
 * contrario del requisito raíz (O-04).
 *
 * El color propio de la entrada se usa en un solo lugar: las viñetas de los
 * requisitos. Nunca como relleno grande —diez colores incompatibles en bloques
 * sólidos son el collage que hay que evitar—, y la dedicatoria «En honor a» va
 * en el turquesa de marca para todas, porque el rojo de una entrada se leía
 * como un error.
 *
 * Las dos variantes del color llegan como variables en línea en el envoltorio
 * `.tinte` y el tema resuelve cuál se pinta (ver globals.css).
 *
 * El bloque completo de crisis lo decide `bloqueCrisis`, que es un dato. Meterlo
 * en la página de alimentación de animales sería ruido, y el ruido gasta la
 * señal donde sí hace falta.
 */
export function FichaEntrada({ entrada }: { entrada: Entrada }) {
  const hermanas = entrada.tipo === "campana" ? CAMPANAS : PROYECTOS;
  const i = hermanas.findIndex((e) => e.codigo === entrada.codigo);
  const siguiente = hermanas[(i + 1) % hermanas.length];
  const esCampana = entrada.tipo === "campana";

  return (
    <div
      className="tinte"
      style={
        {
          "--tinte-claro": entrada.colorAcento,
          "--tinte-oscuro": entrada.colorAcentoOscuro,
        } as CSSProperties
      }
    >
      <header className="border-b border-borde bg-papel-alto">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16">
          <nav aria-label="Miga de pan" className="text-sm text-tinta-suave">
            <Link
              href={esCampana ? "/campanas" : "/proyectos"}
              className="hover:text-tinta"
            >
              {esCampana ? "Campañas" : "Proyectos"}
            </Link>
            <span className="mx-2 text-borde-fuerte">/</span>
            <span className="text-tinta">{entrada.nombreCorto}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              {entrada.logo && (
                <Placa
                  src={entrada.logo.src}
                  alt={entrada.logo.alt}
                  fondo={entrada.logo.fondo}
                />
              )}

              <h1 className="mt-6 max-w-[18ch] text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.5rem]">
                {entrada.nombre}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
                {entrada.resumen}
              </p>
              {/* La cifra real va en una línea de texto, no como número gigante. */}
              {entrada.cifra && (
                <p className="mt-3 text-lg sm:text-xl">
                  <strong className="font-extrabold text-fuerte">
                    {entrada.cifra.valor}
                  </strong>{" "}
                  {entrada.cifra.pie}
                </p>
              )}
            </div>


          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0">
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed">
            {entrada.parrafos.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>

          {entrada.enHonorA && (
            /* La dedicatoria es el gancho narrativo de REFUVA: va con el peso de
               un titular, no como una nota al margen con barra de color. */
            <p className="mt-10 max-w-[30ch] text-2xl leading-snug font-extrabold sm:text-3xl">
              <span className="text-tinta-suave">En honor a </span>
              <span className="text-fuerte">{entrada.enHonorA}</span>.
            </p>
          )}

          {entrada.requisitos && (
            <section className="mt-14 max-w-[62ch]">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Requisitos para participar
              </h2>
              <p className="mt-3 text-tinta-suave">
                Se listan antes del formulario, no después: quien no cumple debe
                saberlo sin llenar nada.
              </p>
              <ul className="mt-6 space-y-4">
                {entrada.requisitos.map((r) => (
                  <li key={r} className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--tinte)]"
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* La sección de evidencia vuelve cuando lleguen fotografías reales
              (P-08). La lista de las que faltan sigue en `fotosPendientes`, y
              es el encargo para Edwin; no se pinta como cajas vacías. */}

          {entrada.bloqueCrisis && (
            <div className="mt-14">
              <BloqueCrisis />
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-borde bg-superficie p-6">
            <h2 className="font-display text-lg font-semibold">
              Cómo participar
            </h2>
            <Boton href={entrada.accion.href} className="mt-4 w-full">
              {entrada.accion.etiqueta}
            </Boton>

            <dl className="mt-7 space-y-5 border-t border-borde pt-6 text-sm">
              <div>
                <dt className="font-semibold">Para quién</dt>
                <dd className="mt-1 text-tinta-suave">{entrada.poblacion}</dd>
              </div>
              {entrada.cuando && (
                <div>
                  <dt className="font-semibold">Cuándo</dt>
                  <dd className="mt-1 text-tinta-suave">{entrada.cuando}</dd>
                </div>
              )}
            </dl>
          </div>

          <Link
            href={rutaDe(siguiente)}
            className="group mt-6 flex items-center gap-2 rounded-xl bg-papel-alto p-6 font-extrabold transition-colors hover:bg-fuerte-tenue"
          >
            <span className="font-normal text-tinta-suave">Siguiente:</span>
            <span className="group-hover:text-fuerte">{siguiente.nombreCorto}</span>
            <Flecha className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
