import type { Metadata } from "next";
import Link from "next/link";
import { BloqueCrisis } from "@/components/banda-crisis";
import { FormularioCita } from "@/components/formularios/form-cita";
import { AlternativaWhatsApp } from "@/components/alternativa-whatsapp";
import { PRECIO_CONSULTA } from "@/lib/contacto";

export const metadata: Metadata = {
  title: "Agendar una cita",
  description:
    "Solicita una cita de atención psicológica con la Fundación REFUVA. Virtual o presencial, por B/.15.00, con jornadas gratuitas.",
};

/**
 * Solicitud de cita (módulo 3.1.4, RF-02).
 *
 * ORDEN DE LA PÁGINA, y no es negociable (RNF-05): el bloque de crisis va
 * ANTES del primer campo. No al final, no en letra chica, no en un pie. Quien
 * llega aquí en el peor momento no debería tener que rellenar un formulario
 * para descubrir que hay un teléfono que contesta ya.
 *
 * Después del bloque viene lo segundo más importante: decir con claridad qué
 * es esto y qué NO es. Esto pide una cita; no es terapia en línea, no es
 * inmediato y no es un canal de emergencia.
 */
export default function AgendarCita() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl leading-[1.08] font-semibold sm:text-5xl">
          Pedir una cita
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-tinta-suave sm:text-xl">
          Déjanos tus datos y te escribimos. No hace falta que expliques nada
          aquí, ni que sepas cómo llamar a lo que te pasa.
        </p>
      </header>

      {/* Primero los teléfonos. Después el formulario. */}
      <div className="mt-10 max-w-3xl">
        <BloqueCrisis
          titulo="Antes de empezar"
          entrada="Este formulario no es un canal de emergencia: alguien lo lee cuando puede, no al instante. Si estás en riesgo ahora, llama."
        />
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0 max-w-2xl">
          <FormularioCita />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-xl border border-borde bg-superficie p-6">
            <h2 className="font-display text-lg font-semibold">Cuánto cuesta</h2>
            <p className="cifras-alineadas mt-2 font-display text-4xl font-semibold text-fuerte">
              {PRECIO_CONSULTA}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
              Por sesión. La fundación empezó atendiendo gratis y cobra lo mínimo
              para sostenerse en el tiempo.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tinta">
              <strong className="font-semibold">
                Hay jornadas gratuitas, y si el precio es el problema, escríbenos
                igual.
              </strong>
            </p>
          </section>

          <section className="rounded-xl border border-borde bg-papel-alto p-6">
            <h2 className="font-display text-lg font-semibold">Qué pasa después</h2>
            <ol className="mt-4 space-y-4 text-sm">
              {[
                "Recibimos tu solicitud y queda registrada.",
                "Te llega un correo confirmando que llegó.",
                "Te escribimos para acordar día y hora.",
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
            <p className="mt-5 border-t border-borde pt-4 text-sm text-tinta-suave">
              El plazo de respuesta lo confirma la fundación. Mientras tanto, no
              prometemos un tiempo que no podamos cumplir.
            </p>
          </section>

          <section className="rounded-xl border border-borde bg-superficie p-6">
            <h2 className="font-display text-lg font-semibold">
              ¿Prefieres escribir?
            </h2>
            <div className="mt-3">
              <AlternativaWhatsApp />
            </div>
          </section>
        </aside>
      </div>

      <p className="mt-14 max-w-2xl border-t border-borde pt-6 text-sm leading-relaxed text-tinta-suave">
        Tus datos se guardan solo para responderte y los ve únicamente el
        personal autorizado de la fundación. Puedes pedir que los borremos cuando
        quieras. Ver la{" "}
        <Link
          href="/privacidad"
          className="font-medium text-fuerte underline underline-offset-2"
        >
          política de privacidad
        </Link>
        .
      </p>
    </div>
  );
}
