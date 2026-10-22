import type { ReactNode } from "react";
import type { Fondo as FondoTipo, Foto } from "@/lib/fondo";

/**
 * Un bloque con foto de fondo y el tinte de la marca encima.
 *
 * La foto se pasa a blanco y negro y se mezcla con el tinte (`multiply`): ningún punto queda más
 * claro que el color del tinte, así que el texto blanco pasa AA con cualquier foto que suba Edwin
 * (`npm run contraste` mide los cuatro tintes). Sin foto, el bloque es del color del tinte, y se ve
 * completo: nunca una caja de «foto pendiente».
 *
 * Es `<img>` con `srcSet` y no `next/image` a propósito: las fotos del CMS ya vienen en tres
 * tamaños hechos al subirlas (480, 1280 y 1920 px) y el servidor de 512 MB no debe ser también el
 * optimizador de imágenes. Ver CLAUDE.md §5.4.
 */

const ANCHOS = [
  ["miniatura", 480],
  ["portada", 1280],
  ["panoramica", 1920],
] as const;

function srcSetDe(foto: Foto): string | undefined {
  const candidatas = ANCHOS.flatMap(([clave, ancho]) => (foto[clave] ? [`${foto[clave]} ${ancho}w`] : []));
  return candidatas.length > 1 ? candidatas.join(", ") : undefined;
}

type Props = {
  fondo: FondoTipo;
  como?: "div" | "section" | "header" | "li" | "aside";
  className?: string;
  /** Solo la foto de la primera pantalla: se pide con prioridad. Las demás cargan al acercarse. */
  prioridad?: boolean;
  /** Ancho que ocupa la foto en pantalla, para que el navegador elija el tamaño. */
  sizes?: string;
  children?: ReactNode;
};

export function Fondo({ fondo, como: Etiqueta = "div", className = "", prioridad = false, sizes = "100vw", children }: Props) {
  const { tinte, foto } = fondo;
  return (
    <Etiqueta
      className={`relative isolate overflow-hidden ${className}`}
      style={{ backgroundColor: `var(--tinte-${tinte})`, color: "var(--sobre-tinte)" }}
    >
      {foto && (
        // eslint-disable-next-line @next/next/no-img-element -- ver el comentario del archivo
        <img
          src={foto.portada ?? foto.original}
          srcSet={srcSetDe(foto)}
          sizes={sizes}
          width={foto.ancho}
          height={foto.alto}
          alt=""
          loading={prioridad ? "eager" : "lazy"}
          fetchPriority={prioridad ? "high" : undefined}
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover mix-blend-multiply grayscale"
          style={{ objectPosition: `${foto.focoX ?? 50}% ${foto.focoY ?? 50}%` }}
        />
      )}
      {children}
    </Etiqueta>
  );
}
