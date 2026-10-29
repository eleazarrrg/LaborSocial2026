import type { Metadata } from "next";
import { BloqueCrisis } from "@/components/banda-crisis";
import { JsonLd } from "@/components/json-ld";
import { datosFaq, ListaPreguntas } from "@/components/preguntas-frecuentes";
import { TituloPagina } from "@/components/ui";
import { preguntas } from "@/lib/preguntas";
import { ETIQUETA_TEMA, TEMAS } from "@/lib/preguntas-base";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas claras sobre la Fundación REFUVA: citas psicológicas, donaciones, voluntariado, padrinos y madrinas, y alianzas.",
};

export default async function PreguntasFrecuentesPagina() {
  const todas = await preguntas();
  const grupos = TEMAS.map((tema) => ({ tema, lista: todas.filter((p) => p.tema === tema) })).filter(
    (g) => g.lista.length > 0,
  );

  return (
    <>
      <TituloPagina
        titulo="Lo que más nos preguntan."
        entrada="Respuestas cortas y sin letra chica. Si tu duda no está aquí, escríbenos."
        quieto
      />
      <JsonLd datos={datosFaq(todas)} />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Temas de las preguntas" className="lg:sticky lg:top-6 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {grupos.map((g) => (
              <li key={g.tema}>
                <a
                  href={`#tema-${g.tema}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-borde-fuerte px-4 font-semibold transition-colors hover:bg-papel-alto lg:rounded-lg lg:border-transparent lg:px-3 lg:hover:border-borde"
                >
                  {ETIQUETA_TEMA[g.tema]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-14">
          {grupos.map((g) => (
            <section key={g.tema} id={`tema-${g.tema}`} aria-labelledby={`titulo-${g.tema}`} className="scroll-mt-6">
              <h2 id={`titulo-${g.tema}`} className="mb-4 font-display text-2xl font-extrabold sm:text-3xl">
                {ETIQUETA_TEMA[g.tema]}
              </h2>
              <ListaPreguntas lista={g.lista} />
            </section>
          ))}
        </div>
      </div>

      <section aria-label="Si necesitas ayuda ahora" className="border-t border-borde bg-papel">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="mb-6 max-w-2xl text-lg text-tinta-suave">
            Pedir ayuda es un acto de valentía, y hay alguien que contesta.
          </p>
          <BloqueCrisis titulo="Si necesitas ayuda ahora" />
        </div>
      </section>
    </>
  );
}
