import type { Metadata } from "next";
import { IndiceProyectos } from "@/components/indice-proyectos";
import { TituloPagina, Boton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Las siete líneas de acción de la Fundación REFUVA: escuelas, calle, animales, prevención del suicidio, comunidades de alto riesgo, escritura terapéutica y Navidad.",
};

export default function Proyectos() {
  return (
    <>
      <TituloPagina
        sobretitulo="Siete líneas de acción"
        titulo="Todo lo que hace REFUVA, en un solo lugar."
        entrada="No es una fundación de salud mental que además hace otras cosas. Son siete frentes que se sostienen a la vez, con el mismo equipo y la misma gente."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <IndiceProyectos />
      </section>

      <section className="border-t border-borde bg-papel-alto">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-6">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              ¿Tu institución quiere trabajar con alguno?
            </h2>
            <p className="mt-3 text-tinta-suave">
              Escuelas, empresas y organizaciones pueden solicitar una alianza
              para cualquiera de las siete líneas.
            </p>
          </div>
          <Boton href="/alianzas">Solicitar una alianza</Boton>
        </div>
      </section>
    </>
  );
}
