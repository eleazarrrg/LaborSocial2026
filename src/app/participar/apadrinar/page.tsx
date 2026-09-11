import type { Metadata } from "next";
import Link from "next/link";
import { FormularioPadrino } from "@/components/formularios/form-padrino";
import { Marco } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ser padrino o madrina",
  description:
    "Apadrina a un niño para la fiesta navideña de la Fundación REFUVA. El regalo lo eliges tú: la fundación no fija ningún monto.",
};

/**
 * Inscripción de padrinos (módulo 3.1.5, RF-03, HU-13).
 *
 * Dos reglas del proyecto se ven aquí a simple vista:
 *
 * 1. No aparece ningún monto sugerido, en ninguna parte. Edwin fue explícito:
 *    el regalo es «conforme a lo que salga de su corazón» y la fundación no
 *    estima nada. Un «desde B/.25» convertiría esto en otra cosa.
 * 2. No se pide ni se muestra ningún dato del niño (X-06). El emparejamiento
 *    ocurre fuera de línea, entre personas.
 */
export default function Apadrinar() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Miga de pan" className="text-sm text-tinta-suave">
        <Link href="/participar" className="hover:text-tinta">
          Participar
        </Link>
        <span className="mx-2 text-borde-fuerte">/</span>
        <span className="text-tinta">Ser padrino o madrina</span>
      </nav>

      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-valiente uppercase">
          Fiesta navideña · 3.er año
        </p>
        <h1 className="mt-3 text-4xl leading-[1.06] font-semibold sm:text-5xl lg:text-6xl">
          Un niño, un regalo, una Navidad que nunca tuvo.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-tinta-suave sm:text-xl">
          Te asignamos un niño de una de las comunidades seleccionadas y tú le
          haces el regalo.{" "}
          <strong className="font-semibold text-tinta">
            No fijamos ningún monto
          </strong>{" "}
          — es conforme a lo que te salga del corazón.
        </p>
      </header>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Inscríbete</h2>
          <p className="mt-3 mb-8 text-tinta-suave">
            Con esto quedas en la lista de padrinos. Después te escribimos para
            coordinar todo lo demás.
          </p>
          <FormularioPadrino />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-xl border border-borde bg-papel-alto p-6">
            <h2 className="font-display text-lg font-semibold">Cómo funciona</h2>
            <ol className="mt-4 space-y-4 text-sm">
              {[
                "Te inscribes aquí.",
                "Te escribimos y te asignamos un niño.",
                "Compras el regalo que decidas.",
                "Coordinamos la entrega o vienes a la fiesta.",
              ].map((paso, i) => (
                <li key={paso} className="flex gap-3.5">
                  <span
                    aria-hidden
                    className="cifras-alineadas grid size-6 shrink-0 place-items-center rounded-full bg-fuerte text-xs font-semibold text-papel"
                  >
                    {i + 1}
                  </span>
                  <span className="text-tinta-suave">{paso}</span>
                </li>
              ))}
            </ol>
          </section>

          <Marco proporcion="4/3" pie="La fiesta navideña del año pasado" />
        </aside>
      </div>
    </div>
  );
}
