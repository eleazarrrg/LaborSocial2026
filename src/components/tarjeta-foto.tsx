import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { srcSetDe } from "@/components/fondo";
import { Flecha } from "@/components/iconos";
import type { Fondo } from "@/lib/fondo";

/**
 * Tarjeta con la foto a color arriba y el texto sobre papel debajo.
 *
 * Reemplaza a las losetas con tinte oscuro: el texto vive sobre un fondo liso (contraste AA sin
 * depender de la foto) y la foto se ve como es, no como una mancha. Sin foto se ve el color del
 * tinte, completo. La tarjeta entera es el enlace: un solo destino de foco.
 */
export function TarjetaFoto({
  href,
  fondo,
  sizes,
  indice,
  quieto = false,
  revelar = true,
  insignia,
  children,
}: {
  href: string;
  fondo: Fondo;
  sizes: string;
  indice?: number;
  /** Sin movimiento de entrada ni paralaje: temas sensibles (CLAUDE.md §5.1). */
  quieto?: boolean;
  revelar?: boolean;
  /** Logo u otra marca que se monta sobre el borde inferior de la foto. */
  insignia?: ReactNode;
  children: ReactNode;
}) {
  const { foto, tinte } = fondo;
  return (
    <li
      className={`${revelar && !quieto ? "revelar" : ""} elevable relative overflow-hidden rounded-2xl border border-borde bg-superficie focus-within:ring-4 focus-within:ring-tinta`}
      style={indice === undefined ? undefined : ({ "--i": indice } as CSSProperties)}
    >
      <Link href={href} className="group flex h-full flex-col outline-none">
        <div
          className={`relative aspect-[16/10] overflow-hidden ${quieto ? "" : "paralaje-contenedor"}`}
          style={{ backgroundColor: `var(--tinte-${tinte})` }}
        >
          {foto && (
            // eslint-disable-next-line @next/next/no-img-element -- ver components/fondo.tsx
            <img
              src={foto.portada ?? foto.original}
              srcSet={srcSetDe(foto)}
              sizes={sizes}
              width={foto.ancho}
              height={foto.alto}
              alt=""
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 size-full object-cover ${quieto ? "" : "paralaje"}`}
              style={{ objectPosition: `${foto.focoX ?? 50}% ${foto.focoY ?? 50}%` }}
            />
          )}
        </div>
        {insignia && <div className="relative z-10 -mt-9 px-5">{insignia}</div>}
        <div className={`flex grow flex-col px-5 pb-5 ${insignia ? "pt-3" : "pt-5"}`}>
          {children}
          <span className="mt-auto flex justify-end pt-4 text-fuerte" aria-hidden>
            <Flecha className="size-6 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </li>
  );
}
