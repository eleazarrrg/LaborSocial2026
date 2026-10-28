import Link from "next/link";
import { ArcoFoto } from "@/components/arco-foto";
import { Contador } from "@/components/contador";
import { Fondo } from "@/components/fondo";
import { Flecha } from "@/components/iconos";
import { IndiceCatalogo } from "@/components/indice-catalogo";
import { Palabras } from "@/components/palabras";
import { Boton, Placa } from "@/components/ui";
import { enPalabras, rutaDe } from "@/lib/catalogo";
import { campanas, fondosInicio, proyectos } from "@/lib/contenido";
import type { FondosInicio } from "@/lib/contenido";
import { fechaLarga, noticias } from "@/lib/publicaciones";

/**
 * Inicio.
 *
 * Tiene un solo trabajo, el requisito raíz (O-04 / RF-06): que en diez segundos
 * se entienda que REFUVA son muchos frentes y no uno.
 *
 * Decisiones:
 * 1. La amplitud se VE: los emblemas de todos los proyectos van justo bajo el titular.
 * 2. Le habla primero a quien pide ayuda: el botón principal es «Pedir una cita» y la primera
 *    casilla de «¿Cómo te podemos ayudar?» es «Estoy pasando por un momento difícil».
 * 3. Personalidad propia, no plantilla: titulares en una segunda familia, la foto del héroe en arco
 *    y a color (el texto ya no va sobre ella), y las dedicatorias «En honor a…» como recurso
 *    tipográfico grande. Es lo que distingue a REFUVA de una ONG genérica (CLAUDE.md §2).
 * 4. El movimiento comunica algo (secuencia, amplitud, orden de lectura, cifras reales) y es CSS
 *    puro, salvo el contador. Todo se apaga con reduced-motion. Nada se mueve en la banda de
 *    crisis ni en el contenido sobre suicidio.
 *
 * HU-01 exige que el SUBTÍTULO nombre al menos dos frentes ajenos a salud mental. El conteo se
 * deriva del catálogo; nunca se escribe a mano.
 */

const mayuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const indice = (i: number) => ({ "--i": i }) as React.CSSProperties;

const AYUDA: { clave: keyof FondosInicio; href: string; titulo: string; texto: string }[] = [
  {
    clave: "ayudaDificil",
    href: "/ayuda-en-crisis",
    titulo: "Estoy pasando por un momento difícil",
    texto: "Números que contestan ahora mismo, y qué hacer mientras llega la ayuda.",
  },
  {
    clave: "ayudaCita",
    href: "/agendar-cita",
    titulo: "Quiero pedir una cita",
    texto: "Atención psicológica por B/.15.00. Si el precio es el problema, escríbenos igual.",
  },
  {
    clave: "ayudaParticipar",
    href: "/participar",
    titulo: "Quiero ayudar",
    texto: "Ser padrino o madrina en Navidad, dar tu tiempo como voluntario o donar.",
  },
];

export default async function Inicio() {
  const [lista, listaCampanas, fondos, recientes] = await Promise.all([
    proyectos(),
    campanas(),
    fondosInicio(),
    noticias({ limite: 3 }),
  ]);
  const dedicatorias = [...lista, ...listaCampanas].filter((e) => e.enHonorA);

  return (
    <>
      {/* ═════════════════════════════════════════════════════════ Héroe */}
      <section className="bg-papel">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 pb-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14 lg:pt-12 lg:pb-14">
          <div>
            <h1 className="text-[length:clamp(2.4rem,1.2rem+3.6vw,3.9rem)] leading-[1.03] font-extrabold">
              <span className="linea" style={indice(0)}>Damos terapia en la calle.</span>
              <span className="linea" style={indice(1)}>Y comida.</span>
              <span className="linea text-fuerte" style={indice(2)}>
                Y una Navidad a quien nunca ha tenido una.
              </span>
            </h1>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-tinta-suave sm:text-xl">
              Sostenemos{" "}
              <strong className="font-bold text-tinta">{enPalabras(lista.length)} proyectos</strong>{" "}
              en Panamá: escuelas, calle, animales, familias, escritura, emprendimiento y Navidad. La
              salud mental es uno de ellos,{" "}
              <span className="relative inline-block whitespace-nowrap">
                <strong className="font-bold text-tinta">no es el único</strong>
                <svg
                  aria-hidden
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  className="subrayado absolute -bottom-1.5 left-0 h-2 w-full"
                >
                  <path
                    d="M1 5 C 20 1, 40 8, 60 4 S 90 3, 99 5"
                    pathLength={1}
                    fill="none"
                    stroke="var(--tinte-naranja)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
              .
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Boton href="/agendar-cita">Pedir una cita</Boton>
              <Link
                href="#proyectos"
                className="group inline-flex min-h-11 items-center gap-2 font-bold text-fuerte underline decoration-2 underline-offset-4 hover:decoration-[3px]"
              >
                Ver los proyectos
                <Flecha className="size-5 rotate-90 transition-transform duration-200 motion-reduce:transition-none group-hover:translate-y-1 group-active:translate-y-2" />
              </Link>
            </div>
          </div>

          <ArcoFoto fondo={fondos.portada} className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none" />
        </div>

        {/* Los emblemas reales: la prueba de amplitud, justo bajo el titular. */}
        <nav aria-label="Los proyectos de un vistazo" className="border-t border-borde">
          <ul className="cascada mx-auto grid max-w-6xl grid-cols-1 gap-x-3 gap-y-2 px-4 py-6 min-[400px]:grid-cols-2 sm:grid-cols-4 sm:px-6 lg:grid-cols-8">
            {lista.map((p, i) => (
              <li key={p.codigo} style={indice(i)}>
                <Link
                  href={rutaDe(p)}
                  className="group flex min-h-14 items-center gap-3 rounded-xl p-1 lg:flex-col lg:gap-2 lg:text-center"
                >
                  {p.logo && (
                    <span className="block w-14 shrink-0 transition-transform duration-200 group-hover:-translate-y-1 lg:w-20">
                      <Placa src={p.logo.src} alt="" fondo={p.logo.fondo} tamano="fluida" />
                    </span>
                  )}
                  <span className="min-w-0 text-sm leading-tight font-bold break-words group-hover:text-fuerte group-hover:underline">
                    {p.nombreCorto}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* ═════════════════════════════════════════ ¿Cómo te podemos ayudar? */}
      <section aria-labelledby="ayuda">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 id="ayuda" className="text-3xl font-extrabold sm:text-5xl">
            <Palabras texto="¿Cómo te podemos ayudar?" />
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {AYUDA.map((a) => (
              <Fondo
                key={a.href}
                como="li"
                fondo={fondos[a.clave]}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="revelar elevable rounded-xl focus-within:ring-4 focus-within:ring-tinta"
              >
                <Link href={a.href} className="group flex h-full min-h-56 flex-col p-6 pb-20 outline-none">
                  <span className="text-xl leading-snug font-extrabold underline-offset-4 group-hover:underline sm:text-2xl">
                    {a.titulo}
                  </span>
                  <span className="mt-3">{a.texto}</span>
                  <span
                    aria-hidden
                    className="absolute right-0 bottom-0 grid size-14 place-items-center rounded-tl-xl bg-papel text-tinta"
                  >
                    <Flecha className="size-6 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Fondo>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════ Proyectos */}
      <section
        id="proyectos"
        aria-labelledby="titulo-proyectos"
        className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-14 sm:px-6 sm:pb-20"
      >
        <div className="max-w-3xl">
          <h2 id="titulo-proyectos" className="text-3xl font-extrabold sm:text-5xl">
            <Palabras texto={`${mayuscula(enPalabras(lista.length))} proyectos, un mismo equipo`} />
          </h2>
          <p className="mt-4 text-lg text-tinta-suave">
            Cada uno nació de una historia y va en honor a alguien. Se sostienen todos a la vez, con
            muy poca gente.
          </p>
        </div>
        <div className="mt-9">
          <IndiceCatalogo entradas={lista} encabezado="h3" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ En honor a… (la firma de REFUVA)
          Cada proyecto nació de una historia: esa es la diferencia con una ONG genérica. Las líneas
          avanzan y se encienden al cruzar la pantalla; sin movimiento, se ven completas. */}
      {dedicatorias.length > 0 && (
        <section
          aria-labelledby="titulo-honor"
          className="overflow-hidden"
          style={{ backgroundColor: "var(--tinte-marron)", color: "var(--sobre-tinte)" }}
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <h2 id="titulo-honor" className="max-w-2xl text-2xl font-extrabold sm:text-3xl">
              Nada de esto empezó como un proyecto. Empezó como una persona.
            </h2>
            <ul className="mt-12 space-y-10 sm:space-y-14">
              {dedicatorias.map((e, i) => (
                <li key={e.codigo} className={`honor ${i % 2 ? "sm:pl-[10vw]" : ""}`}>
                  <Link href={rutaDe(e)} className="group block">
                    <span className="block text-base font-bold underline-offset-4 group-hover:underline sm:text-lg">
                      {e.nombreCorto}
                    </span>
                    <span className="mt-1 block font-display text-[length:clamp(1.9rem,0.9rem+4.4vw,4.4rem)] leading-[1.04] font-extrabold text-balance">
                      En honor a {e.enHonorA}.
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════ Declaración */}
      <Fondo fondo={fondos.declaracion} como="section">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="font-display text-3xl leading-tight font-extrabold text-balance sm:text-6xl">
            Resiliente. Fuerte. Valiente.
          </p>
          <p className="mx-auto mt-4 max-w-[50ch] text-lg sm:text-xl">
            Eso quiere decir REFUVA. Es el nombre de la fundación y es la manera en que trabaja.
          </p>
        </div>
      </Fondo>

      {/* ═════════════════════════════════════════════════════ Campañas
          Van aparte porque la fundación las separa, y porque juntas con los
          proyectos serían media lista de salud mental (CLAUDE.md §2). */}
      <section aria-labelledby="titulo-campanas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <h2 id="titulo-campanas" className="text-3xl font-extrabold sm:text-5xl">
              <Palabras texto={`Y ${enPalabras(listaCampanas.length)} campañas, para que se hable de esto`} />
            </h2>
            <p className="mt-4 text-lg text-tinta-suave">
              No piden que te inscribas a nada. Piden que hablemos, que escuchemos y que acompañemos.
            </p>
          </div>
          <div className="mt-9">
            <IndiceCatalogo entradas={listaCampanas} encabezado="h3" />
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════ Últimas noticias
          Solo aparece cuando Edwin ya publicó algo: sin noticias no se pinta nada. */}
      {recientes.items.length > 0 && (
        <section aria-labelledby="titulo-noticias" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="titulo-noticias" className="text-3xl font-extrabold sm:text-4xl">Últimas noticias</h2>
            <Link href="/noticias" className="inline-flex min-h-11 items-center font-bold text-fuerte underline underline-offset-4">
              Todas las noticias →
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {recientes.items.map((n) => (
              <li key={n.slug} className="border-t-2 border-tinta pt-4">
                <p className="text-sm text-tinta-suave">
                  <time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time>
                </p>
                <h3 className="mt-2 text-xl leading-tight font-extrabold">
                  <Link href={`/noticias/${n.slug}`} className="underline-offset-4 hover:underline">{n.titulo}</Link>
                </h3>
                <p className="mt-2 leading-snug text-tinta-suave">{n.resumen}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ═══════════════════════════════════════════ Lo que ya está pasando
          Solo cifras dichas por Edwin y registradas en hechos-verificados.md. Cada una cuenta hasta
          su valor al llegar a pantalla (sin movimiento se ve el número final). */}
      <section aria-labelledby="titulo-impacto" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
        <h2 id="titulo-impacto" className="text-3xl font-extrabold sm:text-5xl">
          <Palabras texto="Lo que ya está pasando" />
        </h2>
        <dl className="mt-10 divide-y divide-borde-fuerte border-y border-borde-fuerte">
          {[
            { numero: <Contador desde={50} hasta={100} sufijo="+" />, texto: "raciones en cada jornada de comida en la calle. Empezamos con 50." },
            { numero: <Contador hasta={30} sufijo="+" />, texto: "escuelas esperando el Proyecto Psicoeducativo." },
            { numero: <Contador hasta={3} sufijo=".er" />, texto: "año de la campaña navideña y de la de prevención." },
          ].map((c, i) => (
            <div key={i} className="grid items-baseline gap-2 py-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10 sm:py-8">
              <dt className="font-display text-6xl leading-none font-extrabold text-fuerte sm:text-8xl">{c.numero}</dt>
              <dd className="max-w-[40ch] text-xl leading-snug sm:text-2xl">{c.texto}</dd>
            </div>
          ))}
        </dl>

        <figure className="mt-12 rounded-2xl bg-papel-alto p-8 sm:p-12">
          <blockquote>
            <p className="max-w-[46ch] font-display text-2xl leading-snug font-bold text-balance sm:text-[1.9rem]">
              «Pensábamos que nadie se iba a acercar a hablar, ni siquiera a recibir un abrazo. Se
              formaron filas para hablar con los psicólogos. Hubo gente que corrió desde muy lejos
              para darnos uno, porque lo necesitaba en ese momento.»
            </p>
          </blockquote>
          <figcaption className="mt-6">
            <span className="block font-extrabold">Edwin Quintero</span>
            <span className="text-tinta-suave">Director de la fundación, sobre la campaña en la calle</span>
          </figcaption>
        </figure>
      </section>
    </>
  );
}
