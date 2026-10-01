import type { Metadata } from "next";
import { Boton, Marco, Nota, TituloPagina } from "@/components/ui";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Quién es la Fundación REFUVA, cómo empezó y por qué sostiene tantos proyectos a la vez en Panamá.",
};

export default function Nosotros() {
  return (
    <>
      <TituloPagina
        sobretitulo="La fundación"
        titulo="Empezó atendiendo gratis."
        entrada="REFUVA nació del trabajo de un psicólogo que salía a atender sin cobrar. Hoy son varios proyectos y dos campañas, y cada uno nació de una historia."
      />

      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="min-w-0">
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed">
            <p>
              La fundación la dirige{" "}
              <strong className="font-semibold">Edwin Quintero</strong>,
              psicólogo. Empezó atendiendo de forma gratuita, hasta que le
              hicieron ver que así no podría sostenerse en el tiempo — y que
              para seguir ayudando necesitaba que otros ayudaran también.
            </p>
            <p>
              Aquella etapa gratuita sirvió para darse a conocer y para que la
              gente viera el trabajo que se estaba haciendo. Hoy la atención
              cuesta B/.15.00 y se siguen haciendo jornadas gratuitas, porque la
              fundación sabe que hay quien no tiene esos quince balboas.
            </p>
            <p>
              De ahí fueron saliendo los demás proyectos. Cada uno nació de una
              historia y va en honor a alguien. Se sostienen todos a la
              vez: escuelas, calle, animales, prevención del suicidio,
              comunidades de alto riesgo, escritura terapéutica y Navidad.
            </p>
          </div>

          <div className="mt-9 max-w-[62ch]">
            <Nota tono="atencion">
              <strong className="text-tinta">
                Misión, visión y valores pendientes.
              </strong>{" "}
              El texto oficial lo tiene la fundación y todavía no ha llegado
              (pendiente O-08). Lo de arriba lo redactó el equipo a partir de la
              reunión del 20 de agosto de 2026, y hay que sustituirlo por el
              definitivo antes de publicar.
            </Nota>
          </div>

          <section className="mt-16">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Misión, visión y valores
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {["Misión", "Visión", "Valores"].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-dashed border-borde-fuerte bg-papel-alto p-6"
                >
                  <h3 className="font-display text-lg font-semibold">{t}</h3>
                  <p className="mt-2.5 text-sm text-tinta-suave">
                    Texto pendiente de entrega.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Para instituciones y patrocinadores
            </h2>
            <p className="mt-4 max-w-[62ch] leading-relaxed text-tinta-suave">
              La fundación documenta cada jornada. Las fotografías, los
              testimonios y la trayectoria de los proyectos recurrentes son lo
              que se presenta cuando se busca patrocinio.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Boton href="/alianzas">Solicitar una alianza</Boton>
              <Boton href="/proyectos" variante="secundario">
                Ver todos los proyectos
              </Boton>
            </div>
            <div className="mt-7 max-w-[62ch]">
              <Nota>
                Documentos de personería jurídica y transparencia: pendiente de
                decidir con la fundación si se publican o solo se mencionan.
              </Nota>
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <Marco proporcion="4/3" pie="El equipo en una jornada" />
          <Marco proporcion="1/1" pie="Logo oficial de la fundación" />
        </aside>
      </div>
    </>
  );
}
