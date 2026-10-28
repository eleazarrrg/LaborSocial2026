import { srcSetDe } from "@/components/fondo";
import type { Fondo } from "@/lib/fondo";

/**
 * La foto del héroe en forma de arco (como una puerta o una ventana), a COLOR y sin tinte encima:
 * el texto ya no va sobre ella, así que no hace falta oscurecerla para cumplir el contraste, y la
 * calidez de la foto se ve. Detrás, una forma del tinte desplazada le da profundidad. Sin foto,
 * el arco se rellena con el color del tinte, así que nunca queda un hueco.
 *
 * `<img>` con `srcSet` y no `next/image`: ver components/fondo.tsx y CLAUDE.md §5.4.
 */
export function ArcoFoto({
  fondo,
  className = "",
  quieto = false,
}: {
  fondo: Fondo;
  className?: string;
  /** Sin movimiento: para temas sensibles (prevención del suicidio). */
  quieto?: boolean;
}) {
  const { foto, tinte } = fondo;
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className={`absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-3xl sm:translate-x-5 sm:translate-y-5 ${quieto ? "" : "arco-detras"}`}
        style={{ backgroundColor: "var(--tinte-naranja)" }}
      />
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl ${quieto ? "" : "arco-entra paralaje-contenedor"}`}
        style={{ backgroundColor: `var(--tinte-${tinte})` }}
      >
        {foto && (
          // eslint-disable-next-line @next/next/no-img-element -- ver el comentario del archivo
          <img
            src={foto.portada ?? foto.original}
            srcSet={srcSetDe(foto)}
            sizes="(min-width: 1024px) 40vw, 80vw"
            width={foto.ancho}
            height={foto.alto}
            alt=""
            fetchPriority="high"
            decoding="async"
            className={`size-full object-cover ${quieto ? "" : "paralaje"}`}
            style={{ objectPosition: `${foto.focoX ?? 50}% ${foto.focoY ?? 50}%` }}
          />
        )}
      </div>
    </div>
  );
}
