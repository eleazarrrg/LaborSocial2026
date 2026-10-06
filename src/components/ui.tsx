import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/* ----------------------------------------------------------------- Placa
   El contenedor de un logo, y la pieza que resuelve el problema de marca.

   De los once logos que entregó la fundación, solo el institucional tiene
   transparencia. Los otros diez son PNG con el fondo horneado dentro —y no el
   mismo: hay blancos, un gris #cdcdcb, un #f5f5f5—. Puestos sobre una
   superficie de color aparece un rectángulo; en tema oscuro, un bloque que
   deslumbra.

   La solución no es recortarlos. Media docena tiene el borde en un solo color y
   un relleno por inundación los limpiaría, pero `grupo-un-solo-corazon` tiene un
   degradado de 81 colores en el borde, el antialiasing dejaría orla blanca sobre
   papel oscuro, y sobre todo: son los activos de marca de un tercero y no nos
   toca recortarlos por nuestra cuenta.

   Lo que se hace es usar el fondo horneado del archivo COMO color de la placa.
   El borde del PNG desaparece contra ella porque son el mismo color. El
   rectángulo deja de ser un accidente y pasa a ser el objeto: un sello, con su
   radio y su anillo. Y funciona igual el día que lleguen los vectores.

   Tamaños cerrados a propósito. Una placa de 112 px sobre papel oscuro es un
   cuadrito del tamaño del icono de una app: el patrón que la gente ya reconoce.
   Una banda de 600 px sería una linterna. */

export function Placa({
  src,
  alt,
  fondo,
  tamano = "ficha",
}: {
  src: string;
  alt: string;
  fondo: string;
  /** `fluida` ocupa el ancho de su columna, cuadrada; las demás son fijas. */
  tamano?: "ficha" | "fila" | "fluida";
}) {
  const px = { ficha: 112, fila: 72, fluida: 160 }[tamano];
  const fluida = tamano === "fluida";
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl ring-1 ring-borde-fuerte ${fluida ? "aspect-square w-full" : ""}`}
      style={
        fluida
          ? { backgroundColor: fondo }
          : { backgroundColor: fondo, width: px, height: px }
      }
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        sizes={fluida ? "(min-width: 1024px) 140px, 22vw" : undefined}
        className="size-full object-contain"
      />
    </div>
  );
}

/* ---------------------------------------------------------------- Botones */

type BotonProps = {
  href: string;
  children: ReactNode;
  variante?: "primario" | "secundario" | "sobre-fuerte";
  className?: string;
};

/* Botones con el patrón de Mind: borde de 2 px y relleno, sin sombras duras
   ni desplazamientos. El estado se nota en el relleno, no en un salto.

   El primario es SÓLIDO a propósito y es la única excepción al relleno
   tintado: es la acción principal de la página («Pedir una cita») y tiene que
   ser lo más fuerte de la pantalla. Los secundarios y los de la cabecera van
   con relleno tintado y borde de tinta. */
const VARIANTES = {
  primario: "border-fuerte bg-fuerte text-papel hover:border-marca hover:bg-marca",
  secundario: "border-tinta bg-papel text-tinta hover:bg-papel-alto",
  "sobre-fuerte":
    "border-papel bg-papel text-fuerte hover:bg-transparent hover:text-papel",
} as const;

export function Boton({
  href,
  children,
  variante = "primario",
  className = "",
}: BotonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 px-6 py-3 font-bold transition-colors duration-150 ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ Nota
   Una advertencia honesta. Se usa para decir lo que el prototipo todavía no
   hace, en vez de fingir que lo hace. */

export function Nota({
  children,
  tono = "neutro",
}: {
  children: ReactNode;
  tono?: "neutro" | "atencion";
}) {
  const clases =
    tono === "atencion"
      ? "border-valiente/35 bg-valiente-tenue"
      : "border-borde bg-papel-alto";
  return (
    <p className={`rounded-lg border border-dashed ${clases} px-4 py-3 text-sm text-tinta-suave`}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------- Título de página */

/* Sin etiqueta sobre el titular: el titular se sostiene solo. La etiqueta en
   mayúsculas encima es la marca más reconocible de una plantilla. */
export function TituloPagina({
  titulo,
  entrada,
}: {
  titulo: string;
  entrada?: string;
}) {
  return (
    <header className="border-b border-borde bg-papel-alto">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
        <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.5rem]">
          {titulo}
        </h1>
        {entrada && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
            {entrada}
          </p>
        )}
      </div>
    </header>
  );
}
