import Link from "next/link";
import { BloqueCrisis } from "@/components/banda-crisis";
import { Boton, Dato, Marco, Nota, Placa } from "@/components/ui";
import { CAMPANAS, PROYECTOS, rutaDe, type Entrada } from "@/lib/catalogo";

/**
 * La ficha de un proyecto o de una campaña.
 *
 * Las diez usan la misma plantilla a propósito: si una tuviera un diseño más
 * lucido que las otras, el sitio estaría diciendo que esa importa más, que es lo
 * contrario del requisito raíz (O-04).
 *
 * El color propio de la entrada aparece exactamente dos veces aquí —el filo
 * superior y la viñeta de los requisitos—, más una en el índice. Esas son las
 * tres del presupuesto. Ni una más: diez colores incompatibles compitiendo en
 * rellenos grandes es justo el collage que hay que evitar.
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
    <>
      {/* Filo de color: la segunda de las tres apariciones. */}
      <div
        aria-hidden
        className="h-1 w-full"
        style={{ backgroundColor: entrada.colorAcento }}
      />

      <header className="border-b border-borde">
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
              <div className="flex items-center gap-5">
                {entrada.logo && (
                  <Placa
                    src={entrada.logo.src}
                    alt={entrada.logo.alt}
                    fondo={entrada.logo.fondo}
                  />
                )}
                <p
                  className="cifras-alineadas font-display text-3xl font-semibold"
                  style={{ color: entrada.colorAcento }}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>

              <h1 className="mt-6 max-w-[18ch] text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
                {entrada.nombre}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
                {entrada.resumen}
              </p>
            </div>

            <div className="lg:pb-2 lg:text-right">
              <Dato valor={entrada.dato} pie={entrada.datoPie} tamano="grande" />
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
            <p className="mt-9 max-w-[62ch] border-l-2 pl-5 text-lg leading-relaxed text-tinta-suave" style={{ borderColor: entrada.colorAcento }}>
              <span className="font-semibold text-tinta">En honor a </span>
              {entrada.enHonorA}.
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
                    {/* La tercera y última aparición del color propio. */}
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entrada.colorAcento }}
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-14">
            <h2 className="text-2xl font-semibold sm:text-3xl">Evidencia</h2>
            <p className="mt-3 max-w-[62ch] text-tinta-suave">
              Las fotografías de este {esCampana ? "trabajo" : "proyecto"}. Es lo
              que la fundación enseña cuando busca patrocinio.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {entrada.fotosPendientes.map((pie) => (
                <Marco key={pie} pie={pie} />
              ))}
            </div>
          </section>

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

          {!entrada.logo && (
            <div className="mt-6">
              <Nota tono="atencion">
                <strong className="text-tinta">Sin logo todavía.</strong> Este{" "}
                {esCampana ? "campaña" : "proyecto"} no tiene imagen propia en el
                material entregado. Está pedido en el inventario de contenido.
              </Nota>
            </div>
          )}

          <Link
            href={rutaDe(siguiente)}
            className="group mt-6 block rounded-xl border border-borde bg-papel-alto p-6 transition-colors hover:bg-fuerte-tenue"
          >
            <span className="text-sm text-tinta-suave">
              {esCampana ? "Siguiente campaña" : "Siguiente proyecto"}
            </span>
            <span className="mt-1.5 block font-display text-xl font-semibold group-hover:text-fuerte">
              {siguiente.nombreCorto} →
            </span>
          </Link>
        </aside>
      </div>
    </>
  );
}
