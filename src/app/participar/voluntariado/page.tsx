import type { Metadata } from "next";
import Link from "next/link";
import { FormularioVoluntariado } from "@/components/formularios/form-voluntariado";

export const metadata: Metadata = {
  title: "Ser voluntario",
  description:
    "Ofrece tu tiempo a la Fundación REFUVA: reparto de comida, redes sociales, diseño, logística, transporte y más.",
};

const NECESIDADES = [
  {
    area: "Reparto en la calle",
    texto: "Acompañar la jornada de alimentación, cargar y repartir.",
  },
  {
    area: "Redes sociales y diseño",
    texto:
      "Es lo que más falta hace: la fundación lleva sus redes sin ayuda de nadie.",
  },
  {
    area: "Transporte",
    texto: "Un vehículo para las jornadas resuelve la mitad del problema.",
  },
  {
    area: "Psicología",
    texto: "Profesionales para las jornadas gratuitas y el trabajo en escuelas.",
  },
];

export default function Voluntariado() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Miga de pan" className="text-sm text-tinta-suave">
        <Link href="/participar" className="hover:text-tinta">
          Participar
        </Link>
        <span className="mx-2 text-borde-fuerte">/</span>
        <span className="text-tinta">Ser voluntario</span>
      </nav>

      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-valiente uppercase">
          Voluntariado
        </p>
        <h1 className="mt-3 text-4xl leading-[1.06] font-semibold sm:text-5xl lg:text-6xl">
          Siete proyectos, muy poca gente.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-tinta-suave sm:text-xl">
          No hace falta ser psicólogo. Hace falta gente que reparta, que
          conduzca, que diseñe una publicación o que cocine. Dices en qué puedes
          apoyar y te avisamos solo de eso.
        </p>
      </header>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Inscríbete</h2>
          <p className="mt-3 mb-8 text-tinta-suave">
            Sin compromiso de horas ni de frecuencia. Te escribimos cuando haya
            algo de lo que marcaste.
          </p>
          <FormularioVoluntariado />
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-xl border border-borde bg-papel-alto p-6">
            <h2 className="font-display text-lg font-semibold">
              Dónde hace más falta
            </h2>
            <dl className="mt-5 space-y-5 text-sm">
              {NECESIDADES.map((n) => (
                <div key={n.area}>
                  <dt className="font-semibold">{n.area}</dt>
                  <dd className="mt-1 leading-relaxed text-tinta-suave">
                    {n.texto}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
