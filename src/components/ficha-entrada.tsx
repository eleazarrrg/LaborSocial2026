import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { BloqueCrisis } from "@/components/banda-crisis";
import { ArcoFoto } from "@/components/arco-foto";
import { Flecha } from "@/components/iconos";
import { Boton, Placa } from "@/components/ui";
import { rutaDe, type Entrada } from "@/lib/catalogo";
import { campanas, proyectos } from "@/lib/contenido";

/**
 * La ficha de un proyecto o de una campaña.
 *
 * Las diez usan la misma plantilla a propósito: si una tuviera un diseño más
 * lucido que las otras, el sitio estaría diciendo que esa importa más, que es lo
 * contrario del requisito raíz (O-04).
 *
 * La cabecera lleva la foto de la entrada con su tinte (se cambia desde el panel,
 * en cada proyecto). Sin foto, el color del tinte.
 *
 * El texto sale del editor del panel (Lexical) cuando la entrada lo tiene; si no,
 * de los párrafos del catálogo del código.
 *
 * El bloque completo de crisis lo decide `bloqueCrisis`, que es un dato. Meterlo
 * en la página de alimentación de animales sería ruido, y el ruido gasta la
 * señal donde sí hace falta.
 */
export async function FichaEntrada({ entrada }: { entrada: Entrada }) {
  const esCampana = entrada.tipo === "campana";
  const hermanas = esCampana ? await campanas() : await proyectos();
  const i = hermanas.findIndex((e) => e.codigo === entrada.codigo);
  const siguiente = hermanas[(i + 1) % hermanas.length];

  return (
    <>
      {/* Misma composición que la portada: texto sobre papel y la foto en arco, a color. Si la
          entrada es de prevención del suicidio (`bloqueCrisis`), nada se mueve. */}
      <header className="overflow-hidden border-b border-borde bg-papel">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 pb-12 sm:px-6 sm:pt-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-14 lg:pb-14">
          <div className="min-w-0">
            <nav aria-label="Miga de pan" className="text-sm text-tinta-suave">
              <Link href={esCampana ? "/campanas" : "/proyectos"} className="-my-1.5 inline-block py-1.5 underline-offset-4 hover:text-tinta hover:underline">
                {esCampana ? "Campañas" : "Proyectos"}
              </Link>
              <span aria-hidden className="mx-2 text-borde-fuerte">/</span>
              <span className="text-tinta">{entrada.nombreCorto}</span>
            </nav>

            <div className="mt-8">
              {entrada.logo && <Placa src={entrada.logo.src} alt={entrada.logo.alt} fondo={entrada.logo.fondo} />}

              <h1 className="mt-6 max-w-[18ch] text-4xl leading-[1.04] font-extrabold sm:text-5xl lg:text-[3.6rem]">
                <span className={entrada.bloqueCrisis ? undefined : "linea"}>{entrada.nombre}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">{entrada.resumen}</p>
              {/* La dedicatoria es el gancho narrativo de REFUVA: va arriba, a la vista, no al final. */}
              {entrada.enHonorA && (
                <p className="mt-6 max-w-[22ch] font-display text-2xl leading-tight font-extrabold text-fuerte sm:text-4xl">
                  En honor a {entrada.enHonorA}.
                </p>
              )}
              {/* La cifra real va en una línea de texto, no como número gigante. */}
              {entrada.cifra && (
                <p className="mt-4 text-lg sm:text-xl">
                  <strong className="font-extrabold text-fuerte">{entrada.cifra.valor}</strong> {entrada.cifra.pie}
                </p>
              )}
            </div>
          </div>

          <ArcoFoto
            fondo={entrada.fondo ?? { tinte: entrada.tinte }}
            className="mx-auto w-full max-w-[16rem] sm:max-w-xs lg:max-w-none"
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0">
          {entrada.historia ? (
            <RichText data={entrada.historia} className="max-w-[62ch] space-y-6 text-lg leading-relaxed" />
          ) : (
            <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed">
              {entrada.parrafos.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          )}

          {entrada.requisitos && (
            <section className="mt-14 max-w-[62ch]">
              <h2 className="text-2xl font-semibold sm:text-3xl">Requisitos para participar</h2>
              <p className="mt-3 text-tinta-suave">
                Se listan antes del formulario, no después: quien no cumple debe saberlo sin llenar nada.
              </p>
              <ul className="mt-6 space-y-4">
                {entrada.requisitos.map((r) => (
                  <li key={r} className="flex gap-3.5">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fuerte" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {entrada.bloqueCrisis && (
            <div className="mt-14">
              <BloqueCrisis />
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-borde bg-superficie p-6">
            <h2 className="font-display text-lg font-semibold">Cómo participar</h2>
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
            className="group mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-papel-alto p-6 font-extrabold transition-colors hover:bg-fuerte-tenue"
          >
            <span className="font-normal text-tinta-suave">Siguiente:</span>
            <span className="group-hover:text-fuerte">{siguiente.nombreCorto}</span>
            <Flecha className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>
    </>
  );
}
