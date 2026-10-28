import { TarjetaFoto } from "@/components/tarjeta-foto";
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
    <ul className={`grid gap-5 sm:grid-cols-2 ${alCargar ? "cascada" : ""} ${entradas.length >= 4 ? "xl:grid-cols-4" : ""}`}>
      {entradas.map((e, i) => (
        <TarjetaFoto
          key={e.codigo}
          href={rutaDe(e)}
          indice={i}
          quieto={sensible(e)}
          revelar={!alCargar}
          fondo={e.fondo ?? { tinte: e.tinte }}
          sizes={entradas.length >= 4 ? "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
          insignia={e.logo && <Placa src={e.logo.src} alt="" fondo={e.logo.fondo} tamano="fila" />}
        >
          <Titulo className="text-xl leading-tight font-extrabold underline-offset-4 group-hover:underline">
            {e.nombreCorto}
          </Titulo>
          <p className="mt-2 line-clamp-3 leading-snug text-tinta-suave">{e.resumen}</p>
          {e.enHonorA && (
            <p className="mt-2 text-sm font-bold">
              <span className="font-normal">En honor a </span>
              {e.enHonorA}
            </p>
          )}
        </TarjetaFoto>
      ))}
    </ul>
  );
}
