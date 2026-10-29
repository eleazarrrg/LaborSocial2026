import type { MetadataRoute } from "next";
import { rutaDe } from "@/lib/catalogo";
import { catalogo } from "@/lib/contenido";
import { noticias } from "@/lib/publicaciones";
import { URL_SITIO } from "@/lib/sitio";

// Se arma con lo publicado en el panel: un proyecto nuevo o una noticia aparecen sin tocar código.
export const dynamic = "force-dynamic";

const PAGINAS = [
  "/",
  "/proyectos",
  "/campanas",
  "/nosotros",
  "/participar",
  "/participar/apadrinar",
  "/participar/voluntariado",
  "/donar",
  "/agendar-cita",
  "/ayuda-en-crisis",
  "/alianzas",
  "/contacto",
  "/noticias",
  "/preguntas-frecuentes",
  "/privacidad",
  "/terminos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [entradas, { items }] = await Promise.all([catalogo(), noticias({ limite: 500 })]);
  const rutas = [
    ...PAGINAS,
    ...entradas.map(rutaDe),
    ...items.map((n) => `/noticias/${n.slug}`),
  ];
  return [...new Set(rutas)].map((ruta) => ({ url: `${URL_SITIO}${ruta === "/" ? "" : ruta}` }));
}
