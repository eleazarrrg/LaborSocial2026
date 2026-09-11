import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { BandaCrisis } from "@/components/banda-crisis";
import { Encabezado } from "@/components/encabezado";
import { Pie } from "@/components/pie";
import { guionAntiParpadeo } from "@/components/tema";
import "./globals.css";

/**
 * Pareja tipográfica: Fraunces con sus ejes activados contra Inter.
 *
 * Fraunces con WONK y SOFT tiene terminaciones raras y curvas blandas — cálida
 * y con carácter, que es exactamente el registro de REFUVA. Inter para el
 * cuerpo, que a 17 px se lee bien en pantallas malas. Es una pareja, no dos
 * fuentes puestas juntas: la tensión entre el serif con personalidad y el
 * grotesco neutro es lo que sostiene la jerarquía sin recurrir al color.
 */
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--fuente-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--fuente-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fundación REFUVA — Siete formas de ayudar en Panamá",
    template: "%s · Fundación REFUVA",
  },
  description:
    "Fundación panameña con siete líneas de acción: salud mental en escuelas, alimentación en la calle, prevención del suicidio, Navidad para niños que nunca la han vivido y más.",
  // Prototipo en revisión: no se indexa hasta que Edwin apruebe el contenido.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#12100c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PA" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Corre antes del primer pintado para que quien eligió tema oscuro no
            vea un fogonazo blanco en cada carga. Ver components/tema.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: guionAntiParpadeo }} />
      </head>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-70 focus:rounded-lg focus:bg-fuerte focus:px-4 focus:py-2 focus:font-semibold focus:text-papel"
        >
          Saltar al contenido
        </a>
        <BandaCrisis />
        <Encabezado />
        <main id="contenido">{children}</main>
        <Pie />
      </body>
    </html>
  );
}
