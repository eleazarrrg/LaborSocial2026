import type { Metadata } from "next";
import Link from "next/link";
import { TituloPagina } from "@/components/ui";

export const metadata: Metadata = {
  title: "Participar",
  description:
    "Formas de sostener a la Fundación REFUVA: apadrinar a un niño en Navidad, ser voluntario, donar o proponer una alianza institucional.",
};

const FORMAS = [
  {
    href: "/participar/apadrinar",
    titulo: "Ser padrino o madrina",
    tiempo: "Un regalo, una vez al año",
    texto:
      "Apadrinas a un niño para la fiesta navideña y le haces el regalo conforme a lo que te salga del corazón. La fundación no fija ningún monto.",
    destacado: true,
  },
  {
    href: "/participar/voluntariado",
    titulo: "Ser voluntario",
    tiempo: "Según tu disponibilidad",
    texto:
      "Repartir comida en la calle, ayudar con redes sociales, diseñar, conducir, cocinar. Dices en qué puedes apoyar y te avisamos solo de eso.",
  },
  {
    href: "/donar",
    titulo: "Donar",
    tiempo: "Ahora mismo, en un minuto",
    texto:
      "Yappy o transferencia. Sin formularios, sin registro y sin que el sitio toque tus datos bancarios.",
  },
  {
    href: "/alianzas",
    titulo: "Proponer una alianza",
    tiempo: "Para instituciones",
    texto:
      "Escuelas, empresas y organizaciones que quieran trabajar con alguno de nuestros proyectos.",
  },
];

export default function Participar() {
  return (
    <>
      <TituloPagina
        sobretitulo="Participar"
        titulo="Cuatro formas de sostener esto."
        entrada="Sosteniendo todo esto hay muy poca gente. Cualquiera de estas cuatro cosas suma, y ninguna exige más de lo que puedas dar."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <ul className="grid gap-5 lg:grid-cols-2">
          {FORMAS.map((f) => (
            <li key={f.href}>
              <Link
                href={f.href}
                className={`group flex h-full flex-col rounded-2xl border p-7 transition-all duration-150 hover:-translate-y-0.5 sm:p-8 ${
                  f.destacado
                    ? "border-fuerte/30 bg-fuerte-tenue"
                    : "border-borde bg-superficie hover:bg-papel-alto"
                }`}
              >
                <p className="text-sm font-semibold tracking-wide text-valiente uppercase">
                  {f.tiempo}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold group-hover:text-fuerte sm:text-[1.75rem]">
                  {f.titulo}
                </h2>
                <p className="mt-3 grow leading-relaxed text-tinta-suave">
                  {f.texto}
                </p>
                <p className="mt-6 font-semibold text-fuerte">
                  Empezar{" "}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            ¿Y si quiero postular a mi comunidad?
          </h2>
          <p className="mt-4 leading-relaxed text-tinta-suave">
            La convocatoria navideña recibe postulaciones de comunidades en
            estado de vulnerabilidad donde los niños no han vivido una Navidad.
            Los requisitos están en la página del proyecto.
          </p>
          <Link
            href="/proyectos/una-estrella-otiliana"
            className="mt-5 inline-block font-semibold text-fuerte decoration-2 underline-offset-4 hover:underline"
          >
            Ver los requisitos de Una Estrella Otiliana →
          </Link>
        </section>
      </div>
    </>
  );
}
