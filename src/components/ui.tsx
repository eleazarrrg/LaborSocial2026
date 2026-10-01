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
  tamano?: "ficha" | "listado";
}) {
  const px = tamano === "ficha" ? 112 : 56;
  return (
    <div
      className="grid shrink-0 place-items-center overflow-hidden rounded-2xl ring-1 ring-borde-fuerte"
      style={{ backgroundColor: fondo, width: px, height: px }}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
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

const VARIANTES = {
  primario:
    "bg-fuerte text-papel hover:-translate-y-px hover:shadow-[0_6px_0_-2px_var(--color-borde-fuerte)]",
  secundario:
    "bg-superficie text-tinta ring-1 ring-inset ring-borde-fuerte hover:bg-papel-alto hover:-translate-y-px",
  "sobre-fuerte":
    "bg-papel text-fuerte hover:-translate-y-px hover:shadow-[0_6px_0_-2px_rgba(0,0,0,.25)]",
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
      className={`inline-flex items-center justify-center rounded-lg px-6 py-3.5 font-semibold transition-all duration-150 ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ Dato
   El motivo recurrente del sitio. La credibilidad de REFUVA está en cifras
   concretas — 50 raciones que hoy son 100, más de 30 escuelas, tres años —
   así que las cifras se tratan como un elemento de diseño, no como texto. */

export function Dato({
  valor,
  pie,
  tamano = "normal",
}: {
  valor: string;
  pie: string;
  tamano?: "normal" | "grande";
}) {
  return (
    <div>
      <span
        className={`cifras-alineadas block font-display font-semibold leading-none tracking-tight text-fuerte ${
          tamano === "grande"
            ? "text-5xl sm:text-6xl"
            : "text-4xl sm:text-[2.75rem]"
        }`}
      >
        {valor}
      </span>
      <span className="mt-2.5 block text-sm leading-snug text-tinta-suave">
        {pie}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------- Marco
   Hueco de fotografía, diseñado a propósito.

   Todavía no hay fotos (pendiente P-08). En vez de un rectángulo gris roto o
   una imagen de banco, el hueco dice qué fotografía va ahí. Así el prototipo
   le sirve a Edwin como encargo visual: ve el sitio y ve qué tiene que
   mandar. Cuando lleguen las fotos, se reemplaza este componente por
   <Image> y la maqueta no se mueve. */

export function Marco({
  pie,
  proporcion = "4/3",
  className = "",
}: {
  pie: string;
  proporcion?: "4/3" | "16/9" | "1/1" | "3/4";
  className?: string;
}) {
  const clases = {
    "4/3": "aspect-4/3",
    "16/9": "aspect-video",
    "1/1": "aspect-square",
    "3/4": "aspect-3/4",
  }[proporcion];

  return (
    <figure className={className}>
      <div
        className={`relative grid ${clases} place-items-center overflow-hidden rounded-lg bg-papel-alto ring-1 ring-inset ring-borde`}
      >
        {/* Trama diagonal: se lee como «hueco reservado», no como error. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-borde-fuerte) 0 1px, transparent 1px 11px)",
          }}
        />
        <span className="relative rounded-full bg-superficie px-3 py-1 text-xs font-semibold tracking-wide text-tinta-suave uppercase ring-1 ring-borde">
          Foto pendiente
        </span>
      </div>
      <figcaption className="mt-2.5 text-sm text-tinta-suave">{pie}</figcaption>
    </figure>
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

export function TituloPagina({
  sobretitulo,
  titulo,
  entrada,
}: {
  sobretitulo?: string;
  titulo: string;
  entrada?: string;
}) {
  return (
    <header className="border-b border-borde">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
        {sobretitulo && (
          <p className="text-sm font-semibold tracking-wide text-valiente uppercase">
            {sobretitulo}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-6xl">
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
