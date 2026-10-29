import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Bricolage_Grotesque } from "next/font/google";
import { BandaCrisis } from "@/components/banda-crisis";
import { Encabezado } from "@/components/encabezado";
import { JsonLd } from "@/components/json-ld";
import { Pie } from "@/components/pie";
import { guionAntiParpadeo } from "@/components/tema";
import { CONTACTO } from "@/lib/contacto";
import { IMAGEN_COMPARTIR, sitioIndexable, URL_SITIO } from "@/lib/sitio";
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

/**
 * Segunda familia, solo para titulares: Bricolage Grotesque. Tiene carácter propio (trazo
 * grueso, aperturas amplias, un poco de oficio) sin ser serif, así que el sitio deja de leerse como
 * plantilla sin perder legibilidad. El texto corrido, los formularios y los números de emergencia
 * siguen en Atkinson Hyperlegible Next. Se cargan solo los pesos que se usan.
 */
const titulares = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--fuente-display",
  weight: ["700", "800"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  // Las imágenes de las noticias para compartir salen con dirección relativa sin esto.
  metadataBase: new URL(URL_SITIO),
  title: {
    default: "Fundación REFUVA — Resiliente, Fuerte, Valiente",
    template: "%s · Fundación REFUVA",
  },
  description:
    "Fundación panameña: salud mental en escuelas, alimentación en la calle y a animales, Navidad para niños que nunca la han vivido, escritura terapéutica, emprendimiento y campañas de prevención del suicidio.",
  // Prototipo en revisión: no se indexa hasta que se ponga INDEXAR=true (ver lib/sitio.ts).
  robots: { index: sitioIndexable(), follow: sitioIndexable() },
  // «./» = la dirección de cada página (cada una declara su propia versión preferida).
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "Fundación REFUVA",
    locale: "es_PA",
    images: [IMAGEN_COMPARTIR],
    title: "Fundación REFUVA — Resiliente, Fuerte, Valiente",
    description:
      "Fundación panameña: salud mental en escuelas, alimentación en la calle y a animales, Navidad para niños que nunca la han vivido, escritura terapéutica y emprendimiento.",
  },
  twitter: { card: "summary_large_image" },
};

/** Quién es la fundación, para buscadores y asistentes. Solo datos ya públicos en el sitio. */
const DATOS_FUNDACION = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": `${URL_SITIO}/#fundacion`,
      name: "Fundación REFUVA",
      alternateName: "REFUVA",
      url: URL_SITIO,
      logo: `${URL_SITIO}/marca/institucional.png`,
      slogan: "Resiliente, Fuerte, Valiente",
      description:
        "Fundación panameña sin fines de lucro con varios proyectos y campañas: salud mental en escuelas, alimentación en la calle y a animales, Navidad para niños, escritura terapéutica y emprendimiento.",
      areaServed: { "@type": "Country", name: "Panamá" },
      founder: { "@type": "Person", name: "Edwin Quintero", jobTitle: "Psicólogo" },
      sameAs: [CONTACTO.instagram],
      ...(CONTACTO.correo ? { email: CONTACTO.correo } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${URL_SITIO}/#sitio`,
      url: URL_SITIO,
      name: "Fundación REFUVA",
      inLanguage: "es-PA",
      publisher: { "@id": `${URL_SITIO}/#fundacion` },
    },
  ],
};

/**
 * Lo que Edwin publica o cambia en el panel se ve en el sitio en la siguiente visita, sin esperar a
 * una nueva versión. Cada página lee del CMS (lib/contenido.ts) y, si la base falla, cae al catálogo
 * del código. La carga la absorben Cloudflare delante y el caché por petición de `cache()`.
 */
export const dynamic = "force-dynamic";

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
    <html lang="es-PA" className={`${fuente.variable} ${titulares.variable}`}>
      <head>
        {/* Corre antes del primer pintado para que quien eligió tema oscuro no
            vea un fogonazo blanco en cada carga. Ver components/tema.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: guionAntiParpadeo }} />
      </head>
      <body>
        <JsonLd datos={DATOS_FUNDACION} />
        {/* Una barra de color avanza con el scroll (CSS puro; invisible sin soporte o con reduced-motion). */}
        <div aria-hidden className="progreso-scroll" />
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
