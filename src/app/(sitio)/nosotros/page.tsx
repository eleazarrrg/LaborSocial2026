import type { Metadata } from "next";
import Image from "next/image";
import { FotoBanda } from "@/components/foto-banda";
import { Boton, Nota, TituloPagina } from "@/components/ui";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Quién es la Fundación REFUVA, cómo empezó y por qué sostiene tantos proyectos a la vez en Panamá.",
};

/**
 * Los textos oficiales de la fundación (documento BANNERS, entregado el 29-10-2026), copiados sin cambios.
 * Hoy viven aquí; pasarlos al panel es parte del apartado de textos editables.
 */
const QUIENES = "Es una organización comprometida con el fortalecimiento humano, emocional, psicológico y comunitario a través de programas de acompañamiento psicológico, promoción de la salud mental, prevención social, actividades comunitarias, capacitaciones y apoyo integral. Nos enfocamos en mejorar la calidad de vida de niños, jóvenes, adultos y familias, creando espacios seguros donde cada persona pueda descubrir su fortaleza interior, superar obstáculos, desarrollar habilidades que contribuyan a su crecimiento personal, y a la creación de comunidades más resilientes, empáticas y unidas.";
const MISION = "Brindar acompañamiento humano, psicológico y social a personas en situación de vulnerabilidad, promoviendo la resiliencia, la fortaleza emocional y el desarrollo integral mediante programas de orientación, apoyo comunitario y atención profesional.";
const VISION = "Ser una fundación reconocida por su compromiso social, impacto humano y fortalecimiento comunitario, generando espacios seguros, inclusivos y transformadores para las personas y familias que requieren apoyo integral.";
const VALORES = ["Respeto", "Empatía", "Solidaridad", "Compromiso social", "Confidencialidad", "Inclusión", "Responsabilidad", "Humanidad"];
const PRINCIPIOS = [
  { nombre: "Resiliencia", texto: "Es la capacidad de afrontar situaciones difíciles, superar adversidades y transformar las experiencias dolorosas en procesos de crecimiento personal y fortalecimiento emocional." },
  { nombre: "Fuerza", texto: "Es la habilidad emocional, mental y humana para mantenerse firme ante las dificultades, perseverar y continuar avanzando a pesar de las circunstancias." },
  { nombre: "Valentía", texto: "Es la fuerza interior que impulsa a las personas a enfrentar sus miedos, dificultades y desafíos con determinación, esperanza y dignidad." },
];

export default async function Nosotros() {
  return (
    <>
      <TituloPagina
        titulo="Empezó atendiendo gratis."
        entrada="REFUVA nació del trabajo de un psicólogo que salía a atender sin cobrar. Hoy son varios proyectos y dos campañas, y cada uno nació de una historia."
      />

      <FotoBanda codigo="comida-en-la-calle" />

      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="min-w-0">
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed">
            <p>
              La fundación la dirige{" "}
              <strong className="font-semibold">Edwin Quintero</strong>,
              psicólogo. Empezó atendiendo de forma gratuita, hasta que le
              hicieron ver que así no podría sostenerse en el tiempo — y que
              para seguir ayudando necesitaba que otros ayudaran también.
            </p>
            <p>
              Aquella etapa gratuita sirvió para darse a conocer y para que la
              gente viera el trabajo que se estaba haciendo. Hoy la atención
              cuesta B/.15.00 y se siguen haciendo jornadas gratuitas, porque la
              fundación sabe que hay quien no tiene esos quince balboas.
            </p>
            <p>
              De ahí fueron saliendo los demás proyectos. Cada uno nació de una
              historia y va en honor a alguien. Se sostienen todos a la
              vez: escuelas, calle, animales, prevención del suicidio,
              comunidades de alto riesgo, escritura terapéutica y Navidad.
            </p>
          </div>

          <div className="mt-9 max-w-[62ch]">
            <Nota tono="atencion">
              <strong className="text-tinta">
                Misión, visión y valores pendientes.
              </strong>{" "}
              El texto oficial lo tiene la fundación y todavía no ha llegado
              (pendiente O-08). Lo de arriba lo redactó el equipo a partir de la
              reunión del 20 de agosto de 2026, y hay que sustituirlo por el
              definitivo antes de publicar.
            </Nota>
          </div>

          <section className="mt-16" aria-labelledby="mision">
            <h2 id="mision" className="text-2xl font-semibold sm:text-3xl">
              Misión, visión y valores
            </h2>
            <p className="mt-4 max-w-[62ch] leading-relaxed sm:text-lg">{QUIENES}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { titulo: "Misión", texto: MISION },
                { titulo: "Visión", texto: VISION },
              ].map((b) => (
                <div key={b.titulo} className="rounded-2xl border border-borde bg-papel-alto p-6 sm:p-7">
                  <h3 className="font-display text-xl font-extrabold">{b.titulo}</h3>
                  <p className="mt-3 leading-relaxed">{b.texto}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-10 font-display text-xl font-extrabold">Valores</h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {VALORES.map((v) => (
                <li
                  key={v}
                  className="rounded-full border border-borde-fuerte bg-superficie px-4 py-2 font-semibold"
                >
                  {v}
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-xl font-extrabold">Principios fundamentales</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {PRINCIPIOS.map((pr) => (
                <div key={pr.nombre} className="rounded-2xl border border-borde bg-superficie p-6">
                  <p className="font-display text-2xl font-extrabold text-fuerte">{pr.nombre}</p>
                  <p className="mt-2.5 leading-relaxed text-tinta-suave">{pr.texto}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Para instituciones y patrocinadores
            </h2>
            <p className="mt-4 max-w-[62ch] leading-relaxed text-tinta-suave">
              La fundación documenta cada jornada. Las fotografías, los
              testimonios y la trayectoria de los proyectos recurrentes son lo
              que se presenta cuando se busca patrocinio.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Boton href="/alianzas">Solicitar una alianza</Boton>
              <Boton href="/proyectos" variante="secundario">
                Ver todos los proyectos
              </Boton>
            </div>
            <div className="mt-7 max-w-[62ch]">
              <Nota>
                Documentos de personería jurídica y transparencia: pendiente de
                decidir con la fundación si se publican o solo se mencionan.
              </Nota>
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          {/* El logo que antes era un hueco «pendiente»: llegó en octubre. */}
          <figure className="rounded-2xl bg-papel-alto p-8">
            <Image
              src="/marca/institucional.png"
              alt="Árbol de la Fundación REFUVA: su tronco es la letra Ψ, con un cerebro y un corazón"
              width={495}
              height={496}
              className="mx-auto w-full max-w-64"
            />
            <figcaption className="mt-5 text-center font-bold">
              Resiliente · Fuerte · Valiente
            </figcaption>
          </figure>
        </aside>
      </div>
    </>
  );
}
