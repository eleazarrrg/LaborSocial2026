import Link from "next/link";
import type { ServerProps } from "payload";
import { sitioIndexable } from "@/lib/sitio";
import { esEquipo } from "../acceso";
import { noticiasPublicadas } from "../lecturaPublica";

/**
 * «Salud del sitio»: lo que conviene corregir para que buscadores y asistentes entiendan y muestren
 * bien a la fundación. Se calcula con la base, sin servicios externos ni claves que caduquen.
 * Lo ve todo el equipo: corregirlo es tarea de quien edita contenido. No muestra datos de personas.
 */

/** Largo a partir del cual los buscadores cortan la descripción. */
const LARGO_DESCRIPCION = 160;

type Punto = { bien: boolean; texto: string; enlace?: { href: string; texto: string } };

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

export async function SaludSitio({ payload, user }: ServerProps) {
  if (!esEquipo(user)) return null;

  const [proyectos, noticias, sinAlt] = await Promise.all([
    payload.find({
      collection: "proyectos",
      overrideAccess: true,
      depth: 0,
      limit: 100,
      where: { activo: { equals: true } },
    }),
    noticiasPublicadas(payload, { pagina: 1, limite: 100 }),
    payload.count({
      collection: "medios",
      overrideAccess: true,
      where: { or: [{ alt: { exists: false } }, { alt: { equals: "" } }] },
    }),
  ]);

  const proyectosSinFoto = proyectos.docs.filter((p) => !p.fondo?.imagen).length;
  const proyectosLargos = proyectos.docs.filter((p) => (p.resumen ?? "").length > LARGO_DESCRIPCION).length;
  const noticiasSinPortada = noticias.docs.filter((n) => !n.portada).length;
  const noticiasLargas = noticias.docs.filter((n) => (n.resumen ?? "").length > LARGO_DESCRIPCION).length;

  const puntos: Punto[] = [
    sitioIndexable()
      ? { bien: true, texto: "El sitio puede aparecer en buscadores." }
      : {
          bien: false,
          texto:
            "El sitio está oculto a los buscadores (modo prueba). Se abre al lanzar poniendo INDEXAR=true en el hosting.",
        },
    proyectosSinFoto === 0
      ? { bien: true, texto: "Todos los proyectos y campañas activos tienen foto." }
      : {
          bien: false,
          texto: `${plural(proyectosSinFoto, "proyecto o campaña activo", "proyectos y campañas activos")} sin foto: se ven solo con el color.`,
          enlace: { href: "/admin/collections/proyectos", texto: "Ir a proyectos" },
        },
    proyectosLargos === 0
      ? { bien: true, texto: `Los resúmenes de proyectos caben en ${LARGO_DESCRIPCION} caracteres.` }
      : {
          bien: false,
          texto: `${plural(proyectosLargos, "resumen de proyecto pasa", "resúmenes de proyecto pasan")} de ${LARGO_DESCRIPCION} caracteres: los buscadores lo cortan.`,
          enlace: { href: "/admin/collections/proyectos", texto: "Ir a proyectos" },
        },
    noticiasSinPortada === 0
      ? { bien: true, texto: "Todas las noticias publicadas tienen foto de portada." }
      : {
          bien: false,
          texto: `${plural(noticiasSinPortada, "noticia publicada sin portada", "noticias publicadas sin portada")}: se compartirá sin foto.`,
          enlace: { href: "/admin/collections/noticias", texto: "Ir a noticias" },
        },
    noticiasLargas === 0
      ? { bien: true, texto: `Los resúmenes de noticias caben en ${LARGO_DESCRIPCION} caracteres.` }
      : {
          bien: false,
          texto: `${plural(noticiasLargas, "resumen de noticia pasa", "resúmenes de noticia pasan")} de ${LARGO_DESCRIPCION} caracteres.`,
          enlace: { href: "/admin/collections/noticias", texto: "Ir a noticias" },
        },
    sinAlt.totalDocs === 0
      ? { bien: true, texto: "Todas las fotos tienen texto alternativo." }
      : {
          bien: false,
          texto: `${plural(sinAlt.totalDocs, "foto sin texto alternativo", "fotos sin texto alternativo")}: quien usa lector de pantalla no sabe qué muestra.`,
          enlace: { href: "/admin/collections/medios", texto: "Ir a imágenes" },
        },
  ];

  const porRevisar = puntos.filter((p) => !p.bien).length;

  return (
    <section className="salud-sitio" aria-labelledby="salud-sitio-titulo">
      <h2 id="salud-sitio-titulo">Salud del sitio</h2>
      <p className="salud-sitio__resumen">
        {porRevisar === 0 ? "Todo en orden." : `${plural(porRevisar, "cosa por revisar", "cosas por revisar")}.`}
      </p>
      <ul>
        {puntos.map((p) => (
          <li key={p.texto} data-estado={p.bien ? "bien" : "revisar"}>
            <strong className="salud-sitio__estado">{p.bien ? "Bien" : "Revisar"}</strong>
            <span>
              {p.texto}
              {p.enlace && (
                <>
                  {" "}
                  <Link href={p.enlace.href}>{p.enlace.texto}</Link>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="salud-sitio__nota">
        Los buscadores leen <a href="/sitemap.xml">el mapa del sitio</a> y <a href="/robots.txt">las reglas de acceso</a>; se arman solos con lo que publicas.
      </p>
    </section>
  );
}
