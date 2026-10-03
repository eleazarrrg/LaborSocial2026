import Link from "next/link";
import type { CSSProperties } from "react";
import { rutaDe, type Entrada } from "@/lib/catalogo";

/**
 * El índice del catálogo, numerado y tipográfico.
 *
 * DECISIÓN DE DISEÑO, y es la que define el sitio. Se mantiene sin logos **a
 * propósito**, incluso ahora que cada entrada tiene el suyo.
 *
 * Los diez logos vienen de nueve paletas que chocan: una insignia dorada sobre
 * negro, un círculo turquesa pastel, una caricatura navideña multicolor, dos
 * lazos planos. Apilados en una columna *son* el collage. El índice numerado
 * nunca los pone juntos: el logo aparece una sola vez por entrada, en su propia
 * página, dentro de su placa.
 *
 * Lo que sí entra del color propio es una regla de 3 px bajo el numeral. Es una
 * de las tres apariciones que el presupuesto de color permite por entrada — ver
 * la regla anti-collage en src/lib/catalogo.ts.
 *
 * Y una cuadrícula de tarjetas seguiría siendo mala idea: ocho proyectos en tres
 * columnas dejan un hueco impar que siempre acaba sugiriendo que uno sobra.
 */
export function IndiceCatalogo({ entradas }: { entradas: Entrada[] }) {
  return (
    <ol className="border-t border-borde-fuerte">
      {entradas.map((e, i) => (
        <li key={e.codigo} className="border-b border-borde">
          <Link
            href={rutaDe(e)}
            className="tinte group grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 px-1 py-6 transition-colors hover:bg-papel-alto sm:gap-x-7 sm:px-3 sm:py-8 lg:grid-cols-[4.5rem_1fr_11rem_2rem]"
            style={
              {
                "--tinte-claro": e.colorAcento,
                "--tinte-oscuro": e.colorAcentoOscuro,
              } as CSSProperties
            }
          >
            <span className="lg:row-span-2 lg:self-start">
              <span
                aria-hidden
                className="cifras-alineadas block font-display text-2xl leading-none font-semibold text-[var(--tinte)] sm:text-3xl lg:text-4xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* La primera de las tres apariciones del color propio. */}
              <span
                aria-hidden
                className="mt-2 block h-[3px] w-7 rounded-full bg-[var(--tinte)]"
              />
            </span>

            <span className="font-display text-2xl leading-tight font-semibold tracking-tight transition-colors group-hover:text-fuerte sm:text-3xl lg:text-[2.125rem]">
              {e.nombreCorto}
            </span>

            <span className="col-start-2 max-w-xl text-tinta-suave lg:col-start-2 lg:row-start-2 lg:mt-1">
              {e.resumen}
            </span>

            <span className="col-start-2 mt-3 flex items-baseline gap-2 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start lg:gap-0 lg:self-center">
              <span className="cifras-alineadas font-display text-2xl leading-none font-semibold text-fuerte lg:text-3xl">
                {e.dato}
              </span>
              <span className="text-sm leading-snug text-tinta-suave lg:mt-1.5">
                {e.datoPie}
              </span>
            </span>

            <span
              aria-hidden
              className="hidden text-xl text-borde-fuerte transition-all duration-200 group-hover:translate-x-1 group-hover:text-fuerte lg:col-start-4 lg:row-span-2 lg:row-start-1 lg:block lg:self-center lg:justify-self-end"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
