import Link from "next/link";
import { PROYECTOS } from "@/lib/proyectos";

/**
 * Las siete líneas de acción, como índice numerado.
 *
 * DECISIÓN DE DISEÑO, y es la que define el sitio.
 *
 * Lo obvio sería una cuadrícula de siete tarjetas. Se descartó por dos motivos.
 * El primero es semántico: RF-06 exige que las siete tengan la misma jerarquía,
 * y una cuadrícula con un hueco impar en la última fila siempre acaba
 * sugiriendo que una sobra. El segundo es de carácter: una cuadrícula de
 * tarjetas es exactamente el aspecto que tiene el sitio de cualquier otra ONG.
 *
 * Un índice numerado las trata como iguales de verdad —son una lista— y se lee
 * como el sumario de un informe: serio, documental, y creíble para el
 * patrocinador que Edwin necesita convencer. Además aguanta bien el móvil, que
 * es donde va a estar la mayoría del tráfico, y deja sitio para una fotografía
 * por fila el día que lleguen (P-08) sin rehacer nada.
 */
export function IndiceProyectos() {
  return (
    <ol className="border-t border-borde-fuerte">
      {PROYECTOS.map((p, i) => (
        <li key={p.codigo} className="border-b border-borde">
          <Link
            href={`/proyectos/${p.codigo}`}
            className="group grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 px-1 py-6 transition-colors hover:bg-papel-alto sm:gap-x-7 sm:px-3 sm:py-8 lg:grid-cols-[4.5rem_1fr_11rem_2rem]"
          >
            <span
              aria-hidden
              className="cifras-alineadas font-display text-2xl leading-none font-semibold text-valiente sm:text-3xl lg:text-4xl"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="font-display text-2xl leading-tight font-semibold tracking-tight transition-colors group-hover:text-fuerte sm:text-3xl lg:text-[2.125rem]">
              {p.nombre}
            </span>

            <span className="col-start-2 max-w-xl text-tinta-suave lg:col-start-2 lg:row-start-2 lg:mt-1">
              {p.resumen}
            </span>

            <span className="col-start-2 mt-3 flex items-baseline gap-2 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start lg:gap-0 lg:self-center">
              <span className="cifras-alineadas font-display text-2xl leading-none font-semibold text-fuerte lg:text-3xl">
                {p.dato}
              </span>
              <span className="text-sm leading-snug text-tinta-suave lg:mt-1.5">
                {p.datoPie}
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
