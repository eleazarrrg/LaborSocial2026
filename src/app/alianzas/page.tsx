import type { Metadata } from "next";
import { FormularioContacto } from "@/components/formularios/form-contacto";
import { Nota, TituloPagina } from "@/components/ui";
import { PROYECTOS } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "Solicitar una alianza",
  description:
    "Escuelas, empresas y organizaciones que quieran trabajar con alguno de los proyectos de la Fundación REFUVA.",
};

/**
 * Solicitud de alianza institucional (RF-08, HU-08).
 *
 * RF-08 exige que este canal sea distinto del contacto general: una escuela que
 * quiere abrir sus puertas no puede quedar sepultada entre mensajes sueltos.
 *
 * En el prototipo reutiliza el formulario de contacto. Los campos propios
 * —institución, tipo, cargo, proyecto de interés y población estimada— entran
 * con el modelo de datos, junto con el etiquetado que separa esta bandeja.
 */
export default function Alianzas() {
  return (
    <>
      <TituloPagina
        sobretitulo="Para instituciones"
        titulo="Abrir una puerta también es ayudar."
        entrada="Hay más de treinta escuelas esperando el programa psicoeducativo. Si tu institución quiere trabajar con alguno de nuestros proyectos, escríbenos."
      />

      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0 max-w-2xl">
          <FormularioContacto />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-xl border border-borde bg-papel-alto p-6">
            <h2 className="font-display text-lg font-semibold">
              Líneas disponibles
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-tinta-suave">
              {PROYECTOS.map((p) => (
                <li key={p.codigo}>{p.nombreCorto}</li>
              ))}
            </ul>
          </section>

          <Nota>
            <strong className="text-tinta">Nota del prototipo.</strong> Este
            formulario todavía es el genérico. Los campos propios de una alianza
            —institución, cargo, proyecto de interés y población estimada—
            entran con la siguiente iteración, junto con su bandeja separada en
            el panel.
          </Nota>
        </aside>
      </div>
    </>
  );
}
