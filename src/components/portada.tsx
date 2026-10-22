import { srcSetDe } from "@/components/fondo";
import type { Foto } from "@/lib/fondo";

/**
 * Una foto del CMS a la vista, con su texto alternativo (la biblioteca lo exige al subirla).
 * `<img>` con `srcSet` y no `next/image`: ver el comentario de components/fondo.tsx y CLAUDE.md §5.4.
 */
export function Portada({
  foto,
  sizes,
  prioridad = false,
  className = "",
}: {
  foto: Foto;
  sizes: string;
  prioridad?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ver el comentario del archivo
    <img
      src={foto.portada ?? foto.original}
      srcSet={srcSetDe(foto)}
      sizes={sizes}
      width={foto.ancho}
      height={foto.alto}
      alt={foto.alt ?? ""}
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : undefined}
      decoding="async"
      className={`h-auto w-full object-cover ${className}`}
      style={{ objectPosition: `${foto.focoX ?? 50}% ${foto.focoY ?? 50}%` }}
    />
  );
}
