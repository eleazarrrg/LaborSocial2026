import Link from "next/link";
import { IndiceCatalogo } from "@/components/indice-catalogo";
import { CAMPANAS, PROYECTOS, enPalabras, rutaDe } from "@/lib/catalogo";
import { Boton, Dato, Marco, Nota, Placa } from "@/components/ui";

/**
 * Inicio.
 *
 * Tiene un solo trabajo, y es el requisito raíz (O-04 / RF-06): que en diez
 * segundos se entienda que REFUVA son muchos frentes y no uno. De ahí salen dos
 * decisiones que no se negocian: el SUBTÍTULO nombra al menos dos frentes
 * ajenos a salud mental (HU-01 lo exige del subtítulo, no del titular), y los
 * proyectos aparecen como índice numerado —
 * todas al mismo nivel, ninguna «la principal».
 *
 * Los cuatro CTA de HU-02 van juntos y por encima del pliegue, verificado a
 * 375×667. Edwin puede reordenar las secciones de más abajo (C-11: «usted es
 * el dueño de su página»); el titular y la banda de crisis no se mueven.
 */

const CTAS = [
  { href: "/donar", texto: "Donar", variante: "primario" as const },
  { href: "/agendar-cita", texto: "Agendar una cita", variante: "secundario" as const },
  { href: "/participar/apadrinar", texto: "Ser padrino o madrina", variante: "secundario" as const },
  { href: "/participar/voluntariado", texto: "Ser voluntario", variante: "secundario" as const },
];

const CIFRAS = [
  { valor: String(PROYECTOS.length), pie: "proyectos sostenidos a la vez" },
  { valor: "50 → +100", pie: "raciones por jornada en la calle" },
  { valor: "+30", pie: "escuelas esperando el programa" },
  { valor: "3", pie: "años saliendo a dar terapia gratuita" },
];

export default function Inicio() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ Hero */}
      <section className="border-b border-borde">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-14 sm:px-6 sm:pt-20 sm:pb-20">
          <p className="text-sm font-semibold tracking-wide text-valiente uppercase">
            Fundación REFUVA · Panamá
          </p>

          <h1 className="mt-5 max-w-[19ch] text-[var(--paso-display)] leading-[0.98] font-semibold">
            Damos terapia en la calle. Y comida. Y una Navidad{" "}
            <span className="text-fuerte">a quien nunca ha tenido una.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
            Sostenemos{" "}
            <strong className="font-semibold text-tinta">
              {enPalabras(PROYECTOS.length)} proyectos
            </strong>{" "}
            en Panamá: escuelas, calle, animales, familias, escritura,
            emprendimiento y Navidad. La salud mental es uno de ellos —{" "}
            <strong className="font-semibold text-tinta">no es la única</strong>.
          </p>

          <div className="mt-9 flex flex-wrap gap-2.5">
            {CTAS.map((c) => (
              <Boton key={c.href} href={c.href} variante={c.variante}>
                {c.texto}
              </Boton>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ Cifras */}
      <section
        aria-label="La fundación en cifras"
        className="border-b border-borde bg-papel-alto"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-9 px-4 py-11 sm:px-6 lg:grid-cols-4 lg:py-12">
          {CIFRAS.map((c) => (
            <Dato key={c.pie} valor={c.valor} pie={c.pie} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ Los proyectos (núcleo) */}
      <section
        aria-labelledby="lineas"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 id="lineas" className="text-3xl font-semibold sm:text-4xl">
              Nuestros proyectos
            </h2>
            <p className="mt-4 text-lg text-tinta-suave">
              Cada uno nació de una historia y va en honor a alguien. Se
              sostienen todos a la vez, con el mismo equipo.
            </p>
          </div>
          <Link
            href="/proyectos"
            className="shrink-0 font-semibold text-fuerte decoration-2 underline-offset-4 hover:underline"
          >
            Ver todos en detalle →
          </Link>
        </div>

        <IndiceCatalogo entradas={PROYECTOS} />
      </section>

      {/* ═══════════════════════════════════════════════════ Campañas
          Van aparte de los proyectos porque la fundación las separa, y porque
          juntas serían media lista de salud mental — justo lo que el sitio
          existe para desmentir. Banda baja y tipográfica: no es una rejilla de
          logos, que sería el collage. */}
      <section
        aria-labelledby="campanas"
        className="border-y border-borde bg-papel-alto"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 id="campanas" className="text-2xl font-semibold sm:text-3xl">
                Y dos campañas, para que se hable de esto
              </h2>
              <p className="mt-3 text-tinta-suave">
                No piden que te inscribas a nada. Piden que hablemos, que
                escuchemos y que acompañemos.
              </p>
            </div>
            <Link
              href="/campanas"
              className="shrink-0 font-semibold text-fuerte decoration-2 underline-offset-4 hover:underline"
            >
              Ver las campañas →
            </Link>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {CAMPANAS.map((c) => (
              <li key={c.codigo}>
                <Link
                  href={rutaDe(c)}
                  className="group flex h-full items-start gap-4 rounded-xl border border-borde bg-superficie p-5 transition-colors hover:bg-papel-alto"
                >
                  {c.logo && (
                    <Placa
                      src={c.logo.src}
                      alt={c.logo.alt}
                      fondo={c.logo.fondo}
                      tamano="listado"
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-semibold group-hover:text-fuerte">
                      {c.nombreCorto}
                    </span>
                    <span className="mt-1.5 block text-sm leading-snug text-tinta-suave">
                      {c.resumen}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════ Atención psicológica */}
      <section aria-labelledby="atencion" className="border-b border-borde">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
          <div>
            <h2 id="atencion" className="text-3xl font-semibold sm:text-4xl">
              Atención psicológica por{" "}
              <span className="cifras-alineadas whitespace-nowrap text-fuerte">
                B/.15.00
              </span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-tinta-suave">
              Empezamos atendiendo gratis. Hoy cobramos lo mínimo para que la
              fundación se sostenga en el tiempo — y seguimos haciendo jornadas
              gratuitas, porque sabemos que hay quien no tiene esos quince
              balboas.
            </p>
            <p className="mt-4 text-lg text-tinta">
              <strong className="font-semibold">
                Si el precio es el problema, escríbenos igual.
              </strong>
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Boton href="/agendar-cita">Solicitar una cita</Boton>
              <Boton href="/ayuda-en-crisis" variante="secundario">
                Necesito ayuda ahora
              </Boton>
            </div>
          </div>

          {/* La cita de Edwin es el corazón emocional del sitio. Se trata como
              tal: comillas colgadas y tamaño de titular, no como texto suelto. */}
          <figure className="relative">
            <span
              aria-hidden
              className="absolute -top-8 -left-2 font-display text-[7rem] leading-none text-valiente/25 select-none sm:-left-5 sm:text-[9rem]"
            >
              &ldquo;
            </span>
            <blockquote className="relative">
              <p className="font-display text-2xl leading-[1.35] font-medium text-balance sm:text-[1.75rem]">
                Pensábamos que nadie se iba a acercar a hablar, ni siquiera a
                recibir un abrazo. Se formaron filas para hablar con los
                psicólogos. Hubo gente que corrió desde muy lejos para darnos
                uno, porque lo necesitaba en ese momento.
              </p>
            </blockquote>
            <figcaption className="mt-6 border-l-2 border-valiente pl-4 text-sm leading-snug text-tinta-suave">
              <span className="block font-semibold text-tinta">
                Edwin Quintero
              </span>
              Sobre la campaña de prevención del suicidio
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ Evidencia */}
      <section
        aria-labelledby="evidencia"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <h2 id="evidencia" className="text-3xl font-semibold sm:text-4xl">
              Lo que estamos haciendo
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-tinta-suave">
              Aquí van las publicaciones recientes de Instagram y las fotografías
              de cada jornada. Es lo que la fundación enseña cuando busca
              patrocinio: la evidencia de que esto pasa de verdad.
            </p>
            <div className="mt-7">
              <Nota tono="atencion">
                <strong className="text-tinta">Pendiente de conectar.</strong>{" "}
                Requiere convertir la cuenta de Instagram a Profesional y
                vincularla con el correo institucional de la fundación — nunca
                con el de un estudiante.
              </Nota>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <Marco
              proporcion="3/4"
              pie="Jornada de alimentación en la calle"
              className="sm:mt-10"
            />
            <Marco proporcion="3/4" pie="Fiesta navideña del año pasado" />
            <Marco
              proporcion="1/1"
              pie="Terapia gratuita, 10 de septiembre"
              className="sm:mt-10"
            />
            <Marco proporcion="1/1" pie="Trabajo en la Escuela Jerónimo de la Osa" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Cierre */}
      <section className="bg-fuerte text-papel">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h2 className="max-w-[16ch] text-3xl leading-tight font-semibold sm:text-5xl">
                Muchos frentes, un solo equipo.
              </h2>
              <p className="mt-5 max-w-xl text-lg opacity-85">
                Sosteniendo todo esto hay muy poca gente. Con tiempo, con un
                regalo de Navidad o con una donación, cabe una persona más.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 lg:justify-end">
              <Boton href="/donar" variante="sobre-fuerte">
                Donar ahora
              </Boton>
              <Link
                href="/participar"
                className="inline-flex items-center rounded-lg px-6 py-3.5 font-semibold ring-1 ring-inset ring-papel/60 transition-colors hover:bg-papel/10"
              >
                Otras formas de ayudar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
