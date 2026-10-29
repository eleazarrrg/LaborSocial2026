import { JsonLd } from "@/components/json-ld";
import { preguntas } from "@/lib/preguntas";
import { ETIQUETA_TEMA, type Pregunta, type TemaPregunta } from "@/lib/preguntas-base";

/**
 * Preguntas frecuentes como acordeón nativo (`<details>`): se abre con teclado y con lector de pantalla
 * sin JavaScript, y sin él sigue legible. Cada lista lleva sus datos estructurados (FAQPage).
 */

export function datosFaq(lista: Pregunta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lista.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}

export function ListaPreguntas({ lista }: { lista: Pregunta[] }) {
  return (
    <div className="divide-y divide-borde border-y border-borde">
      {lista.map((p) => (
        <details key={p.pregunta} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-lg leading-snug font-bold outline-offset-4 marker:hidden hover:text-fuerte [&::-webkit-details-marker]:hidden">
            <span>{p.pregunta}</span>
            <span
              aria-hidden
              className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-borde-fuerte text-xl leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <p className="max-w-[65ch] pr-11 pb-5 leading-relaxed text-tinta-suave">{p.respuesta}</p>
        </details>
      ))}
    </div>
  );
}

/** Las preguntas de un tema, al pie de su página. No pinta nada si no hay ninguna visible. */
export async function PreguntasFrecuentes({ tema, titulo = "Preguntas frecuentes" }: { tema: TemaPregunta; titulo?: string }) {
  const lista = await preguntas(tema);
  if (lista.length === 0) return null;
  const id = `preguntas-${tema}`;
  return (
    <section aria-labelledby={id} className="border-t border-borde bg-papel">
      <JsonLd datos={datosFaq(lista)} />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 id={id} className="font-display text-2xl font-extrabold sm:text-3xl">
          {titulo}
        </h2>
        <p className="mt-2 mb-6 text-tinta-suave">{ETIQUETA_TEMA[tema]}</p>
        <ListaPreguntas lista={lista} />
      </div>
    </section>
  );
}
