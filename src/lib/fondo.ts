/**
 * Los fondos con foto: los tipos que comparten el panel (src/payload/campos/fondo.ts) y el sitio
 * (src/components/fondo.tsx). Sin dependencias, para poder importarse desde cualquier lado.
 *
 * Los cuatro tintes son los `--tinte-*` de globals.css, y `npm run contraste` mide cada uno.
 */
export const TINTES = [
  { label: "Turquesa", value: "turquesa" },
  { label: "Naranja", value: "naranja" },
  { label: "Marrón", value: "marron" },
  { label: "Noche", value: "noche" },
] as const;

export type Tinte = (typeof TINTES)[number]["value"];

export const esTinte = (v: unknown): v is Tinte => TINTES.some((t) => t.value === v);

/** Una foto de la biblioteca, ya con sus tamaños (los genera Payload al subirla). */
export type Foto = {
  /** El original, ya reducido a 2000 px. */
  original: string;
  miniatura?: string;
  portada?: string;
  panoramica?: string;
  ancho: number;
  alto: number;
  /** Punto de enfoque, de 0 a 100: la parte de la foto que no debe recortarse. */
  focoX?: number;
  focoY?: number;
  /** Texto alternativo (obligatorio al subirla). Los fondos son decorativos y no lo usan. */
  alt?: string;
  /** Foto de referencia (de archivo), no de la fundación. */
  provisional?: boolean;
};

/** Un fondo: el tinte siempre existe; la foto, no. Sin foto se ve el bloque en el color del tinte. */
export type Fondo = { tinte: Tinte; foto?: Foto };
