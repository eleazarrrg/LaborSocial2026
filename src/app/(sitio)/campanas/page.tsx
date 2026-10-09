import type { Metadata } from "next";
import Link from "next/link";
import { IndiceCatalogo } from "@/components/indice-catalogo";
import { TituloPagina } from "@/components/ui";
import { CAMPANAS } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "Campañas",
  description:
    "Háblame Panamá y #EscúchamePanamá: las campañas de prevención del suicidio y de salud mental de la Fundación REFUVA.",
};

/**
 * Índice de campañas (RF-06).
 *
 * Colección aparte de los proyectos, y no es una sutileza: la propia fundación
 * las separa en su material bajo el encabezado «Campañas memorables de Refuva».
 *
 * Y hay una razón de fondo. Si las diez entradas fueran una sola lista, cinco de
 * las diez serían salud mental — media lista dándole la razón a la percepción
 * que el sitio existe para desmentir. Separadas, los ocho proyectos los dominan
 * la comida, los animales, la Navidad, las familias y el emprendimiento, y la
 * salud mental tiene su propia sección, honesta y etiquetada.
 */
export default function Campanas() {
  return (
    <>
      <TituloPagina
        titulo="Hablar de esto, en voz alta."
        entrada="Dos campañas de sensibilización que REFUVA sostiene en el espacio público. No piden que te inscribas a nada: piden que hablemos, que escuchemos y que acompañemos."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <IndiceCatalogo entradas={CAMPANAS} />
      </section>

      <section className="border-t border-borde bg-papel-alto">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Si lo que necesitas es ayuda, no información
            </h2>
            <p className="mt-3 leading-relaxed text-tinta-suave">
              Estas campañas existen para que hablar de salud mental sea más
              fácil. Pero si hoy estás mal, no hace falta que leas nada más.
            </p>
            <Link
              href="/ayuda-en-crisis"
              className="mt-5 inline-block font-semibold text-fuerte decoration-2 underline-offset-4 hover:underline"
            >
              Ver los números que contestan →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
