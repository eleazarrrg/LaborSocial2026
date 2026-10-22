import Link from "next/link";
import { Fondo } from "@/components/fondo";
import { Flecha } from "@/components/iconos";
import { IndiceCatalogo } from "@/components/indice-catalogo";
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
 * Tres decisiones:
 * 1. La amplitud se VE, no solo se lee: los emblemas reales están en la
 *    primera pantalla, junto al titular.
 * 2. Le habla primero a quien pide ayuda: el botón principal es «Pedir una
 *    cita» y la primera casilla de «¿Cómo te podemos ayudar?» es «Estoy
 *    pasando por un momento difícil». Donar está en la cabecera, segundo.
 * 3. Los fondos con foto (héroe, ayuda, declaración y cada proyecto) se cambian
 *    desde el panel (Fondos del inicio y cada proyecto). Sin foto, cada bloque
 *    se ve en el color de su tinte: nunca una caja de «foto pendiente».
 *
 * HU-01 exige que el SUBTÍTULO nombre al menos dos frentes ajenos a salud
 * mental. El conteo se deriva del catálogo; nunca se escribe a mano.
 */

const mayuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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

  return (
    <>
      {/* ═════════════════════════════════════════════════════════ Héroe */}
      {/* Foto a sangre con el tinte encima: la tarjeta blanca lleva el titular
          y los emblemas ocupan la otra mitad del mismo campo. */}
      <Fondo fondo={fondos.portada} como="section" prioridad>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch lg:gap-12">
          <div className="rounded-2xl bg-papel p-6 text-tinta sm:p-10">
            {/* Las frases cortas no se parten: sin esto, a 1440 quedaba una «Y»
                sola al final de la tercera línea. */}
            <h1 className="max-w-[19ch] text-[length:var(--paso-display)] leading-[1.06] font-extrabold">
              Damos terapia en la calle.{" "}
              <span className="whitespace-nowrap">Y comida.</span>{" "}
              <span className="whitespace-nowrap">Y una Navidad</span>{" "}
              <span className="whitespace-nowrap">a quien</span> nunca ha
              tenido una.
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-tinta-suave sm:text-xl">
              Sostenemos{" "}
              <strong className="font-bold text-tinta">
                {enPalabras(lista.length)} proyectos
              </strong>{" "}
              en Panamá: escuelas, calle, animales, familias, escritura,
              emprendimiento y Navidad. La salud mental es uno de ellos —{" "}
              <strong className="font-bold text-tinta">no es el único</strong>.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Boton href="/agendar-cita">Pedir una cita</Boton>
              <Link
                href="#proyectos"
                className="inline-flex min-h-11 items-center gap-2 font-bold text-fuerte underline decoration-2 underline-offset-4 hover:decoration-[3px]"
              >
                Ver los proyectos
                <Flecha className="size-5" />
              </Link>
            </div>
          </div>

          {/* Los emblemas reales: la prueba de amplitud en un vistazo. */}
          <nav aria-label="Los proyectos de un vistazo" className="lg:flex">
            <ul className="grid w-full grid-cols-4 gap-3 sm:gap-x-4 sm:gap-y-6 lg:content-start">
              {lista.map((p) => (
                <li key={p.codigo}>
                  <Link
                    href={rutaDe(p)}
                    className="group flex flex-col items-center gap-2 rounded-xl p-1 text-center"
                  >
                    {p.logo && (
                      <span className="block w-full transition-transform duration-200 group-hover:-translate-y-1">
                        <Placa
                          src={p.logo.src}
                          alt=""
                          fondo={p.logo.fondo}
                          tamano="fluida"
                        />
                      </span>
                    )}
                    <span className="text-sm leading-tight font-bold group-hover:underline max-sm:sr-only">
                      {p.nombreCorto}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Fondo>

      {/* ═════════════════════════════════════════ ¿Cómo te podemos ayudar? */}
      <section aria-labelledby="ayuda">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 id="ayuda" className="text-3xl font-extrabold sm:text-4xl">
            ¿Cómo te podemos ayudar?
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
                <Link
                  href={a.href}
                  className="group flex h-full min-h-56 flex-col p-6 pb-20 outline-none"
                >
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
        <div className="max-w-2xl">
          <h2 id="titulo-proyectos" className="text-3xl font-extrabold sm:text-4xl">
            {mayuscula(enPalabras(lista.length))} proyectos, un mismo equipo
          </h2>
          <p className="mt-4 text-lg text-tinta-suave">
            Cada uno nació de una historia y va en honor a alguien. Se sostienen
            todos a la vez, con muy poca gente.
          </p>
        </div>
        <div className="mt-9">
          <IndiceCatalogo entradas={lista} encabezado="h3" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ Declaración */}
      <Fondo fondo={fondos.declaracion} como="section">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-3xl leading-tight font-extrabold text-balance sm:text-5xl">
            Resiliente. Fuerte. Valiente.
          </p>
          <p className="mx-auto mt-4 max-w-[50ch] text-lg sm:text-xl">
            Eso quiere decir REFUVA. Es el nombre de la fundación y es la manera
            en que trabaja.
          </p>
        </div>
      </Fondo>

      {/* ═════════════════════════════════════════════════════ Campañas
          Van aparte porque la fundación las separa, y porque juntas con los
          proyectos serían media lista de salud mental (CLAUDE.md §2). */}
      <section aria-labelledby="titulo-campanas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <h2 id="titulo-campanas" className="text-3xl font-extrabold sm:text-4xl">
              Y {enPalabras(listaCampanas.length)} campañas, para que se hable de esto
            </h2>
            <p className="mt-4 text-lg text-tinta-suave">
              No piden que te inscribas a nada. Piden que hablemos, que
              escuchemos y que acompañemos.
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

      {/* ═══════════════════════════════════════════ Lo que ya está pasando */}
      <section
        aria-labelledby="titulo-impacto"
        className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20"
      >
        <h2 id="titulo-impacto" className="text-3xl font-extrabold sm:text-4xl">
          Lo que ya está pasando
        </h2>
        {/* Las cifras van en prosa, no como franja de números grandes: el
            contrato de dirección la rechaza por plantilla. Solo cifras dichas
            por Edwin y registradas en hechos-verificados.md. */}
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-tinta-suave sm:text-xl">
          Las jornadas de comida en la calle empezaron con 50 raciones y hoy
          pasan de <strong className="font-extrabold text-tinta">100</strong>.
          Hay <strong className="font-extrabold text-tinta">más de 30</strong>{" "}
          escuelas esperando el Proyecto Psicoeducativo. Y la campaña navideña y
          la de prevención van por su{" "}
          <strong className="font-extrabold text-tinta">tercer año</strong>.
        </p>

        <figure className="mt-10 rounded-2xl bg-papel-alto p-8 sm:p-12">
          <blockquote>
            <p className="max-w-[46ch] text-2xl leading-snug font-bold text-balance sm:text-[1.75rem]">
              «Pensábamos que nadie se iba a acercar a hablar, ni siquiera a
              recibir un abrazo. Se formaron filas para hablar con los
              psicólogos. Hubo gente que corrió desde muy lejos para darnos uno,
              porque lo necesitaba en ese momento.»
            </p>
          </blockquote>
          <figcaption className="mt-6">
            <span className="block font-extrabold">Edwin Quintero</span>
            <span className="text-tinta-suave">
              Director de la fundación, sobre la campaña en la calle
            </span>
          </figcaption>
        </figure>
      </section>
    </>
  );
}
