import type { Metadata } from "next";
import Link from "next/link";
import { Boton, Nota, TituloPagina } from "@/components/ui";

export const metadata: Metadata = {
  title: "Noticias y eventos",
  description:
    "Publicaciones y actividades de la Fundación REFUVA: jornadas, convocatorias y contenido psicoeducativo.",
};

/**
 * Noticias y eventos (módulo 3.1.7, RF-01).
 *
 * Estado vacío deliberado. Todavía no hay base de datos ni panel, así que no
 * hay nada publicado — y en vez de rellenar con noticias inventadas, la página
 * dice qué va a haber aquí y quién lo va a poner.
 *
 * Este estado vacío importa más de lo que parece: es exactamente lo que Edwin
 * verá el día del lanzamiento, antes de publicar su primera noticia. Si el
 * sitio se ve roto ese día, la herramienta arranca mal.
 */
export default function Noticias() {
  return (
    <>
      <TituloPagina
        sobretitulo="Noticias y eventos"
        titulo="Lo que va pasando."
        entrada="Jornadas, convocatorias y contenido psicoeducativo. Todo lo publica la fundación desde su panel, sin depender de nadie."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-2xl border border-dashed border-borde-fuerte bg-papel-alto px-6 py-16 text-center sm:px-10 sm:py-20">
          <p className="font-display text-2xl font-semibold sm:text-3xl">
            Todavía no hay nada publicado.
          </p>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-tinta-suave">
            Cuando el panel esté listo, aquí aparecerán las noticias y los
            eventos que publique la fundación. Los eventos vencidos dejan de
            listarse solos, sin que nadie tenga que acordarse de apagarlos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <Boton href="/proyectos" variante="secundario">
              Ver los proyectos
            </Boton>
            <Link
              href="/participar"
              className="inline-flex items-center px-3 py-3.5 font-semibold text-fuerte decoration-2 underline-offset-4 hover:underline"
            >
              Formas de participar →
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <Nota>
            Mientras tanto, la actividad de la fundación se ve en Instagram. El
            feed se conectará al Inicio cuando la cuenta pase a Profesional y se
            vincule al correo institucional.
          </Nota>
        </div>
      </div>
    </>
  );
}
