import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { BandaCrisis } from "@/components/banda-crisis";
import { Encabezado } from "@/components/encabezado";
import { Pie } from "@/components/pie";
import { guionAntiParpadeo } from "@/components/tema";
import "./globals.css";

/**
 * Una sola familia, como Mind: Atkinson Hyperlegible Next.
 *
 * La diseñó el Braille Institute para lectores con baja visión: letras que no
 * se confunden entre sí (I, l, 1; O, 0). Es la razón de producto, no de gusto:
 * el público incluye gente en crisis, con teléfonos viejos y sol de frente.
 *
 * Sustituye a Fraunces + Inter, la pareja más reconocible de lo que genera la
 * IA, y una de las razones de que el sitio se leyera genérico.
 */
const fuente = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--fuente",
  display: "swap",
  // Next no trae las métricas de esta familia para ajustar la de respaldo y
  // avisa en cada build. Se desactiva a propósito: con `swap` el texto se ve
  // desde el primer pintado, y el salto al cambiar de fuente es de unos
  // píxeles en el titular. Revisar el CLS en campo cuando haya datos reales.
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Fundación REFUVA — Resiliente, Fuerte, Valiente",
    template: "%s · Fundación REFUVA",
  },
  description:
    "Fundación panameña: salud mental en escuelas, alimentación en la calle y a animales, Navidad para niños que nunca la han vivido, escritura terapéutica, emprendimiento y campañas de prevención del suicidio.",
  // Prototipo en revisión: no se indexa hasta que Edwin apruebe el contenido.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1413" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PA" className={fuente.variable}>
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
