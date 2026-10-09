import type { Metadata } from "next";
import Link from "next/link";
import { Nota, TituloPagina } from "@/components/ui";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Qué es y qué no es el sitio de la Fundación REFUVA.",
};

const SECCIONES = [
  {
    titulo: "Qué es este sitio",
    parrafos: [
      "Es el sitio informativo de la Fundación REFUVA. Sirve para conocer sus proyectos, solicitar una cita, inscribirse como voluntario o padrino, y donar.",
    ],
  },
  {
    titulo: "Qué NO es",
    parrafos: [
      "No presta atención psicológica en línea. No hay chat ni videollamada con un profesional: lo que hay es un formulario para solicitar una cita.",
      "No es un canal de emergencia. Nadie está leyendo los formularios en tiempo real, y una solicitud puede tardar en responderse.",
      "No sustituye a un diagnóstico ni a un tratamiento profesional. Lo que se publica en noticias y contenido psicoeducativo es información general, no una indicación para tu caso.",
    ],
  },
  {
    titulo: "Solicitudes y citas",
    parrafos: [
      "Enviar una solicitud no reserva un horario ni garantiza una cita. La fundación te contacta para acordarla según su disponibilidad.",
      "La atención tiene un costo de B/.15.00 por sesión. Hay jornadas gratuitas, y si el costo es un impedimento, la fundación pide que se lo digas.",
    ],
  },
  {
    titulo: "Donaciones",
    parrafos: [
      "Las donaciones se hacen por Yappy o por transferencia bancaria, directamente entre tu banco y el de la fundación. Este sitio no procesa pagos y nunca te pide datos de tarjeta.",
      "Si alguna vez una página de este sitio te pide un número de tarjeta, no lo escribas y avísanos.",
    ],
  },
  {
    titulo: "Contenido del sitio",
    parrafos: [
      "Los textos y las fotografías son de la Fundación REFUVA. Las fotografías de personas se publican con su consentimiento.",
      "Si apareces en una fotografía y quieres que la retiremos, escríbenos y la quitamos.",
    ],
  },
];

export default function Terminos() {
  return (
    <>
      <TituloPagina
        titulo="Términos de uso"
        entrada="Qué es este sitio, qué no es, y qué puedes esperar de él."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <Nota tono="atencion">
          <strong className="text-tinta">Borrador.</strong> Pendiente de revisión
          por el asesor legal de la fundación antes de publicar.
        </Nota>

        <div className="mt-12 space-y-12">
          {SECCIONES.map((s) => (
            <section key={s.titulo}>
              <h2 className="text-2xl font-semibold sm:text-3xl">{s.titulo}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-tinta-suave">
                {s.parrafos.map((p) => (
                  <p key={p.slice(0, 30)}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-borde pt-6 text-tinta-suave">
          Ver también la{" "}
          <Link
            href="/privacidad"
            className="font-medium text-fuerte underline underline-offset-2"
          >
            política de privacidad
          </Link>
          .
        </p>
      </div>
    </>
  );
}
