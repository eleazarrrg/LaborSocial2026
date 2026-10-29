import { Suspense } from "react";
import { sitioIndexable, URL_SITIO } from "@/lib/sitio";

/**
 * Prueba de SEO técnica, dentro del panel (Publicar > Ajustes > Prueba de SEO).
 *
 * Descarga las páginas públicas tal como las ve un buscador y revisa lo que SÍ se puede comprobar desde
 * aquí: título, descripción, dirección canónica, imagen al compartir, un solo título principal y datos
 * estructurados; y del sitio entero: robots.txt, sitemap.xml e íconos. No mide posicionamiento (eso
 * depende del contenido y del tiempo, y se ve en Search Console) ni rendimiento (eso es Lighthouse).
 *
 * Corre cada vez que se abre la pestaña, sin caché: el resultado es de ese momento. Va en Suspense para
 * que el formulario no espere a las descargas.
 */

type Estado = "bien" | "revisar" | "falla";
type Fila = { clave: string; estado: Estado; detalle: string };
type Pagina = { nombre: string; ruta: string; estado: number | null; filas: Fila[] };

const PAGINAS: [string, string][] = [
  ["Inicio", "/"],
  ["Proyectos", "/proyectos"],
  ["Un proyecto", "/proyectos/psicoeducativo"],
  ["Nosotros", "/nosotros"],
  ["Donar", "/donar"],
  ["Pedir una cita", "/agendar-cita"],
  ["Preguntas frecuentes", "/preguntas-frecuentes"],
  ["Contacto", "/contacto"],
];

const ETIQUETA: Record<Estado, string> = { bien: "Bien", revisar: "Revisar", falla: "Falla" };

const decodificar = (t: string) =>
  t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

async function bajar(ruta: string): Promise<{ estado: number | null; html: string }> {
  try {
    const r = await fetch(`${URL_SITIO}${ruta}`, { cache: "no-store", signal: AbortSignal.timeout(10_000), redirect: "follow" });
    return { estado: r.status, html: r.ok && /text\/html/.test(r.headers.get("content-type") ?? "") ? await r.text() : "" };
  } catch {
    return { estado: null, html: "" };
  }
}

async function existe(ruta: string): Promise<{ ok: boolean; texto: string }> {
  try {
    const r = await fetch(`${URL_SITIO}${ruta}`, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
    return { ok: r.ok, texto: r.ok ? await r.text() : "" };
  } catch {
    return { ok: false, texto: "" };
  }
}

const primero = (html: string, re: RegExp) => {
  const m = html.match(re);
  return m ? decodificar(m[1]) : null;
};

function revisarPagina(ruta: string, estado: number | null, html: string): Fila[] {
  if (estado !== 200) {
    return [{ clave: "La página responde", estado: "falla", detalle: estado ? `Respondió ${estado}.` : "No respondió a tiempo." }];
  }
  const filas: Fila[] = [{ clave: "La página responde", estado: "bien", detalle: "Respondió 200." }];

  const titulo = primero(html, /<title>([^<]*)<\/title>/);
  filas.push(
    !titulo
      ? { clave: "Título", estado: "falla", detalle: "No tiene título." }
      : titulo.length > 60 || titulo.length < 15
        ? { clave: "Título", estado: "revisar", detalle: `${titulo.length} caracteres: lo ideal es de 15 a 60. «${titulo}»` }
        : { clave: "Título", estado: "bien", detalle: `${titulo.length} caracteres. «${titulo}»` },
  );

  const descripcion = primero(html, /<meta name="description" content="([^"]*)"/);
  filas.push(
    !descripcion
      ? { clave: "Descripción", estado: "falla", detalle: "No tiene descripción." }
      : descripcion.length > 160 || descripcion.length < 50
        ? { clave: "Descripción", estado: "revisar", detalle: `${descripcion.length} caracteres: lo ideal es de 50 a 160; Google corta lo que pasa de 160.` }
        : { clave: "Descripción", estado: "bien", detalle: `${descripcion.length} caracteres.` },
  );

  const canonica = primero(html, /<link rel="canonical" href="([^"]*)"/);
  const esperada = `${URL_SITIO}${ruta === "/" ? "" : ruta}`;
  filas.push(
    !canonica
      ? { clave: "Dirección canónica", estado: "falla", detalle: "Falta: los buscadores no saben cuál es la versión principal." }
      : canonica !== esperada
        ? { clave: "Dirección canónica", estado: "revisar", detalle: `Apunta a ${canonica}; se esperaba ${esperada}.` }
        : { clave: "Dirección canónica", estado: "bien", detalle: "Apunta a sí misma." },
  );

  filas.push(
    primero(html, /<meta property="og:image" content="([^"]*)"/)
      ? { clave: "Imagen al compartir", estado: "bien", detalle: "Tiene imagen para WhatsApp, Facebook y similares." }
      : { clave: "Imagen al compartir", estado: "falla", detalle: "No tiene: se compartirá sin foto." },
  );

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  filas.push(
    h1 === 1
      ? { clave: "Un solo título principal (h1)", estado: "bien", detalle: "Tiene uno." }
      : { clave: "Un solo título principal (h1)", estado: h1 === 0 ? "falla" : "revisar", detalle: `Tiene ${h1}: debe tener exactamente uno.` },
  );

  filas.push(
    /application\/ld\+json/.test(html)
      ? { clave: "Datos estructurados", estado: "bien", detalle: "Tiene datos para buscadores y asistentes." }
      : { clave: "Datos estructurados", estado: "revisar", detalle: "No tiene datos estructurados (JSON-LD)." },
  );

  return filas;
}

function revisarSitio(inicio: string, robots: { ok: boolean; texto: string }, mapa: { ok: boolean; texto: string }, icono: boolean, preguntas: string): Fila[] {
  const filas: Fila[] = [];

  const meta = primero(inicio, /<meta name="robots" content="([^"]*)"/);
  const cerrado = /noindex/i.test(meta ?? "") || !sitioIndexable();
  filas.push(
    cerrado
      ? { clave: "Indexación", estado: "revisar", detalle: "El sitio está oculto a los buscadores (modo prueba). Se abre al lanzar con INDEXAR=true." }
      : { clave: "Indexación", estado: "bien", detalle: "Los buscadores pueden indexar el sitio." },
  );

  filas.push(
    !robots.ok
      ? { clave: "robots.txt", estado: "falla", detalle: "No responde." }
      : !cerrado && !/Sitemap:/i.test(robots.texto)
        ? { clave: "robots.txt", estado: "revisar", detalle: "No indica dónde está el mapa del sitio." }
        : { clave: "robots.txt", estado: "bien", detalle: "Responde." },
  );

  const urls = (mapa.texto.match(/<loc>/g) ?? []).length;
  filas.push(
    !mapa.ok
      ? { clave: "Mapa del sitio (sitemap.xml)", estado: "falla", detalle: "No responde." }
      : urls < PAGINAS.length
        ? { clave: "Mapa del sitio (sitemap.xml)", estado: "revisar", detalle: `Solo lista ${urls} direcciones.` }
        : { clave: "Mapa del sitio (sitemap.xml)", estado: "bien", detalle: `Lista ${urls} direcciones.` },
  );

  filas.push(
    icono && /rel="icon"/.test(inicio)
      ? { clave: "Ícono de la pestaña (favicon)", estado: "bien", detalle: "Tiene ícono propio." }
      : { clave: "Ícono de la pestaña (favicon)", estado: "revisar", detalle: "No se encontró el ícono." },
  );

  filas.push(
    /FAQPage/.test(preguntas)
      ? { clave: "Preguntas frecuentes para buscadores", estado: "bien", detalle: "La página de preguntas lleva sus datos estructurados." }
      : { clave: "Preguntas frecuentes para buscadores", estado: "revisar", detalle: "La página de preguntas no lleva datos estructurados." },
  );
  return filas;
}

function Lista({ filas }: { filas: Fila[] }) {
  return (
    <ul>
      {filas.map((f) => (
        <li key={f.clave} data-estado={f.estado}>
          <strong className="prueba-seo__estado">{ETIQUETA[f.estado]}</strong>
          <span>
            <b>{f.clave}.</b> {f.detalle}
          </span>
        </li>
      ))}
    </ul>
  );
}

async function Resultados() {
  const [bajadas, robots, mapa, icono] = await Promise.all([
    Promise.all(PAGINAS.map(([, ruta]) => bajar(ruta))),
    existe("/robots.txt"),
    existe("/sitemap.xml"),
    existe("/icon.png").then((r) => r.ok),
  ]);
  const paginas: Pagina[] = PAGINAS.map(([nombre, ruta], i) => ({
    nombre,
    ruta,
    estado: bajadas[i].estado,
    filas: revisarPagina(ruta, bajadas[i].estado, bajadas[i].html),
  }));
  const preguntas = bajadas[PAGINAS.findIndex(([, r]) => r === "/preguntas-frecuentes")].html;
  const sitio = revisarSitio(bajadas[0].html, robots, mapa, icono, preguntas);

  const todas = [...paginas.flatMap((p) => p.filas), ...sitio];
  const bien = todas.filter((f) => f.estado === "bien").length;
  const fallas = todas.filter((f) => f.estado === "falla").length;
  const porRevisar = todas.filter((f) => f.estado === "revisar").length;
  const hora = new Intl.DateTimeFormat("es-PA", { timeZone: "America/Panama", dateStyle: "medium", timeStyle: "short" }).format(new Date());

  return (
    <>
      <p className="prueba-seo__resumen" role="status">
        <strong>
          {bien} de {todas.length} revisiones bien
        </strong>
        {fallas > 0 && ` · ${fallas} con falla`}
        {porRevisar > 0 && ` · ${porRevisar} por revisar`}. Hecha el {hora} (hora de Panamá).
      </p>

      <section aria-labelledby="seo-sitio" className="prueba-seo__bloque">
        <h3 id="seo-sitio">Todo el sitio</h3>
        <Lista filas={sitio} />
      </section>

      {paginas.map((p) => (
        <section key={p.ruta} aria-labelledby={`seo-${p.nombre}`} className="prueba-seo__bloque">
          <h3 id={`seo-${p.nombre}`}>
            {p.nombre} <small>{p.ruta}</small>
          </h3>
          <Lista filas={p.filas} />
        </section>
      ))}

      <p className="prueba-seo__nota">
        Esta prueba mira la parte técnica. No mide el posicionamiento (eso depende del contenido y del tiempo, y se ve en
        Google Search Console) ni la velocidad (eso es Lighthouse). Para corregir un título o una descripción, edita el
        proyecto o la noticia correspondiente en Publicar.
      </p>
    </>
  );
}

export function PruebaSeo() {
  return (
    <div className="prueba-seo">
      <Suspense
        fallback={
          <p className="prueba-seo__resumen" role="status">
            Probando las páginas públicas… tarda unos segundos.
          </p>
        }
      >
        <Resultados />
      </Suspense>
    </div>
  );
}
