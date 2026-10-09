import type { Metadata } from "next";
import Link from "next/link";
import { BloqueCrisis } from "@/components/banda-crisis";
import { VERIFICADO_EL } from "@/lib/crisis";

export const metadata: Metadata = {
  title: "Ayuda en crisis",
  description:
    "Números que contestan ahora mismo en Panamá si estás pasando por un momento difícil.",
};

/**
 * Página de crisis (RF-11, módulo 3.1.10).
 *
 * Es la única página del sitio que alguien puede abrir en el peor momento de su
 * vida. Por eso: los números primero, el texto después, frases cortas, sin
 * jerga, sin pedir nada a cambio y sin un solo formulario.
 *
 * Aplica la guía de mensajes seguros de la OMS/IASP (CLAUDE.md §5.1): no se
 * describen métodos, no hay cifras, y la página cierra con esperanza y no con
 * el dolor.
 */
export default function AyudaEnCrisis() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Si hoy estás mal, llama.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-tinta-suave">
        No tienes que estar seguro de nada para marcar. No tienes que saber
        explicarlo. Al otro lado hay alguien que contesta y escucha.
      </p>

      <div className="mt-10">
        <BloqueCrisis titulo="Números que contestan ahora" />
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Qué pasa cuando llamas
        </h2>
        <ul className="mt-5 space-y-4 text-tinta-suave">
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-valiente" />
            <span>
              Contesta una persona, no una grabación. En la Línea 147 son
              psicólogos y trabajadores sociales.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-valiente" />
            <span>
              Es gratis desde cualquier operador, y es confidencial. No tienes
              que dar tu nombre.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-valiente" />
            <span>
              Puedes llamar por alguien más. Si te preocupa una persona cercana,
              también es una razón válida.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Si te preocupa otra persona
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-suave">
          Pregúntale directamente cómo está y quédate a escuchar la respuesta.
          No hace falta tener las palabras correctas ni una solución. Acompañar
          y no dejarla sola ya es mucho. Si crees que hay riesgo inmediato, llama
          al{" "}
          <a href="tel:911" className="font-semibold text-tinta underline underline-offset-2">
            911
          </a>{" "}
          y quédate con ella.
        </p>
      </section>

      <section className="mt-14 rounded-2xl bg-fuerte-tenue p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Lo que hace REFUVA
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-suave">
          Cada año, entre el 10 de agosto y el 10 de septiembre, salimos a la
          calle a dar terapia psicológica gratuita y abrazos. La primera vez
          pensamos que nadie se acercaría. Se formaron filas.
        </p>
        <p className="mt-4 leading-relaxed text-tinta-suave">
          Fuera de la campaña atendemos por B/.15.00, y hacemos jornadas
          gratuitas. Si el precio es el problema, escríbenos igual.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/agendar-cita"
            className="rounded-xl bg-fuerte px-6 py-3.5 font-semibold text-superficie transition-opacity hover:opacity-90"
          >
            Solicitar una cita
          </Link>
          <Link
            href="/campanas/hablame-panama"
            className="rounded-xl bg-superficie px-6 py-3.5 font-semibold text-tinta ring-1 ring-inset ring-borde transition-colors hover:bg-papel-alto"
          >
            Ver Háblame Panamá
          </Link>
        </div>
        <p className="mt-6 text-sm text-tinta-suave">
          Pedir una cita aquí no es un canal de emergencia y puede tardar en
          responderse. Si es ahora, usa los números de arriba.
        </p>
      </section>

      <p className="mt-14 border-t border-borde pt-6 text-sm text-tinta-suave">
        Números verificados el {VERIFICADO_EL}. Se revisan cada seis meses. Si
        encuentras uno que no funciona,{" "}
        <Link href="/contacto" className="text-fuerte underline underline-offset-2">
          avísanos
        </Link>
        .
      </p>
    </article>
  );
}
