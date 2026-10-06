import Link from "next/link";
import { Flecha } from "@/components/iconos";
import { Placa } from "@/components/ui";
import { rutaDe, type Entrada } from "@/lib/catalogo";

/**
 * El catálogo como lista de filas, a dos columnas, sin contenedor de tarjeta.
 *
 * QUÉ CAMBIÓ Y POR QUÉ. Primero fue un índice numerado 01–08 sin logos (lo
 * más genérico del sitio, según la crítica de octubre). Después, ocho tarjetas
 * tintadas iguales: la revisión final de impeccable las rechazó por ser el
 * andamio de «tarjetas de icono, título y texto» que su piso de calidad
 * prohíbe, y porque repetían en grande los emblemas que el héroe ya enseña.
 *
 * Ahora: filas separadas por un filete, el emblema pequeño, el nombre con peso
 * de titular y una línea. La dedicatoria «En honor a» lleva un solo
 * tratamiento en todas las entradas: con el color de cada una, el rojo de Un
 * Solo Corazón se leía como un error.
 *
 * Todas las filas iguales a propósito (HU-01): ninguna se presenta como
 * subordinada a otra. La fila entera es el enlace: un solo destino de foco.
 */
export function IndiceCatalogo({
  entradas,
  encabezado = "h2",
}: {
  entradas: Entrada[];
  /** h2 en las páginas de índice; h3 cuando va dentro de una sección. */
  encabezado?: "h2" | "h3";
}) {
  const Titulo = encabezado;

  return (
    <ul className="grid gap-x-12 border-t border-borde md:grid-cols-2">
      {entradas.map((e) => (
        <li key={e.codigo} className="border-b border-borde">
          <Link
            href={rutaDe(e)}
            className="group flex h-full items-start gap-5 py-6 sm:gap-6"
          >
            {e.logo && (
              <Placa src={e.logo.src} alt="" fondo={e.logo.fondo} tamano="fila" />
            )}

            <div className="min-w-0 flex-1">
              <Titulo className="text-xl leading-tight font-extrabold underline-offset-4 group-hover:text-fuerte group-hover:underline sm:text-2xl">
                {e.nombreCorto}
              </Titulo>
              <p className="mt-2 leading-snug text-tinta-suave">{e.resumen}</p>
              {e.enHonorA && (
                <p className="mt-2 font-bold">
                  <span className="font-normal text-tinta-suave">En honor a </span>
                  {e.enHonorA}
                </p>
              )}
            </div>

            <Flecha className="mt-1 size-6 shrink-0 text-fuerte transition-transform group-hover:translate-x-1" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
