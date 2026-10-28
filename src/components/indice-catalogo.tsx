import Link from "next/link";
import { Fondo } from "@/components/fondo";
import { Flecha } from "@/components/iconos";
import { Placa } from "@/components/ui";
import { rutaDe, type Entrada } from "@/lib/catalogo";

/**
 * El catálogo como lositas con foto y tinte, a dos columnas.
 *
 * QUÉ CAMBIÓ Y POR QUÉ. Fue un índice numerado, después ocho tarjetas tintadas sin foto y luego
 * filas con filete. Con las fotos editables desde el panel (Edwin las cambia sin nosotros), cada
 * entrada lleva la suya con el tinte de la marca encima, como las fundaciones de referencia
 * (difunda.org): el catálogo se ve como un catálogo de lugares y gente, no como una lista de texto.
 *
 * Todas las lositas son iguales a propósito (HU-01): ninguna se presenta como subordinada a otra.
 * La loseta entera es el enlace: un solo destino de foco. Sin foto se ve el color del tinte.
 */
export function IndiceCatalogo({
  entradas,
  encabezado = "h2",
  entrada = "scroll",
}: {
  entradas: Entrada[];
  /** h2 en las páginas de índice; h3 cuando va dentro de una sección. */
  encabezado?: "h2" | "h3";
  /**
   * Cómo entran las losetas: «scroll» (se revelan al llegar a pantalla, para la portada) o «carga»
   * (en cascada al abrir la página, para /proyectos y /campanas, donde ya están a la vista).
   */
  entrada?: "scroll" | "carga";
}) {
  const Titulo = encabezado;
  const alCargar = entrada === "carga";
  // Las campañas de prevención del suicidio no se mueven (CLAUDE.md §5.1): ni entrada ni paralaje.
  const sensible = (e: Entrada) => e.tipo === "campana" && e.bloqueCrisis;

  return (
    // Con 4 o más entradas, 4 columnas en pantallas grandes: los ocho proyectos se ven en dos filas.
    // Con 4 o más, las losetas pares bajan un poco: la rejilla deja de ser un bloque uniforme.
    <ul className={`grid gap-4 md:grid-cols-2 ${alCargar ? "cascada" : ""} ${entradas.length >= 4 ? "xl:grid-cols-4 xl:pb-10" : ""}`}>
      {entradas.map((e, i) => (
        <Fondo
          key={e.codigo}
          como="li"
          indice={i}
          quieto={sensible(e)}
          fondo={e.fondo ?? { tinte: e.tinte }}
          sizes={entradas.length >= 4 ? "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className={`${alCargar || sensible(e) ? "" : "revelar"} elevable rounded-2xl focus-within:ring-4 focus-within:ring-tinta xl:even:translate-y-10`}
        >
          <Link
            href={rutaDe(e)}
            className="group flex h-full min-h-72 flex-col gap-6 p-6 outline-none sm:p-8 xl:min-h-80 xl:p-6"
          >
            {e.logo && <Placa src={e.logo.src} alt="" fondo={e.logo.fondo} tamano="fila" />}

            <div className="mt-auto pr-12">
              <Titulo className="text-2xl leading-tight font-extrabold underline-offset-4 group-hover:underline sm:text-3xl xl:text-2xl">
                {e.nombreCorto}
              </Titulo>
              <p className="mt-3 max-w-[46ch] leading-snug">{e.resumen}</p>
              {e.enHonorA && (
                <p className="mt-3 font-bold">
                  <span className="font-normal">En honor a </span>
                  {e.enHonorA}
                </p>
              )}
            </div>

            <span
              aria-hidden
              className="absolute right-0 bottom-0 grid size-14 place-items-center rounded-tl-xl bg-papel text-tinta"
            >
              <Flecha className="size-6 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Fondo>
      ))}
    </ul>
  );
}
