import type { Metadata } from "next";
import Link from "next/link";
import { Nota, TituloPagina } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos recoge el sitio de la Fundación REFUVA, para qué, cuánto tiempo y quién puede verlos.",
};

/**
 * Política de privacidad (módulo 3.1.9, HU-31).
 *
 * BORRADOR. Describe los compromisos técnicos que el sistema sí cumple, en
 * lenguaje llano y sin jerga jurídica. El texto legal definitivo lo tiene que
 * revisar el asesor legal de la fundación, y los plazos de retención los tiene
 * que aprobar Edwin.
 *
 * Se escribe en segunda persona y con frases cortas a propósito: una política
 * de privacidad que nadie entiende no informa a nadie.
 */

const SECCIONES = [
  {
    titulo: "Qué recogemos, y solo eso",
    parrafos: [
      "Cuando pides una cita te pedimos tu nombre, una forma de contacto —correo o teléfono, con uno basta—, si prefieres la sesión virtual o presencial, y cuándo te viene bien. Nada más.",
      "El motivo de consulta es opcional y de una línea. No te pedimos diagnóstico, ni síntomas, ni medicación, ni que nos cuentes lo que te pasa. Eso se habla en sesión, con un profesional, no en un formulario.",
      "En los formularios de voluntariado y apadrinamiento pedimos datos de contacto y disponibilidad. En el de apadrinamiento no recogemos ningún dato del niño.",
    ],
  },
  {
    titulo: "Para qué los usamos",
    parrafos: [
      "Para responderte. Nada más. No vendemos datos, no los compartimos con terceros y no los usamos para publicidad.",
      "Si te inscribes a un programa, usamos tu contacto para avisarte de ese programa y no de todos los demás.",
    ],
  },
  {
    titulo: "Quién puede verlos",
    parrafos: [
      "Solo el personal autorizado de la fundación, después de iniciar sesión con su cuenta y su segundo factor. No hay una hoja de cálculo compartida con las solicitudes ni una carpeta que cualquiera pueda abrir.",
      "Quien entra al panel solo a publicar noticias no puede ver las solicitudes de cita.",
      "Los avisos internos que salen por correo no llevan el contenido de tu solicitud: llevan un enlace al panel, donde hay que autenticarse para leerla.",
    ],
  },
  {
    titulo: "Cuánto tiempo los guardamos",
    parrafos: [
      "Cada tipo de dato tiene un plazo y se borra de verdad cuando vence — no se archiva ni se esconde, se elimina.",
      "Los plazos concretos están pendientes de aprobación por la fundación y se publicarán aquí antes del lanzamiento.",
    ],
  },
  {
    titulo: "Qué puedes pedirnos",
    parrafos: [
      "Que te digamos qué tenemos tuyo, que lo corrijamos si está mal, o que lo borremos. Lo pides por cualquiera de nuestros canales y no hace falta que expliques por qué.",
    ],
  },
  {
    titulo: "Cookies y medición",
    parrafos: [
      "El sitio no usa cookies para seguirte. La analítica que utilizamos no las necesita y no construye un perfil tuyo, por eso no verás un banner pidiéndote permiso.",
    ],
  },
];

export default function Privacidad() {
  return (
    <>
      <TituloPagina
        titulo="Privacidad"
        entrada="Qué datos recogemos, para qué, quién los ve y cuánto duran. En lenguaje llano, porque una política que nadie entiende no informa a nadie."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <Nota tono="atencion">
          <strong className="text-tinta">Borrador.</strong> Describe los
          compromisos que el sistema cumple de verdad, pero el texto definitivo
          lo tiene que revisar el asesor legal de la fundación y los plazos de
          retención los tiene que aprobar la dirección.
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

        <section className="mt-14 rounded-xl bg-fuerte p-6 text-papel sm:p-8">
          <h2 className="text-2xl font-semibold">
            Esto no es atención en línea
          </h2>
          <p className="mt-3 leading-relaxed opacity-90">
            El sitio recibe solicitudes; no presta terapia y no es un canal de
            emergencia. Nadie está leyendo los formularios en tiempo real. Si
            necesitas ayuda ahora, llama al 911 o a la Línea 147.
          </p>
          <Link
            href="/ayuda-en-crisis"
            className="mt-4 inline-block font-semibold underline underline-offset-4"
          >
            Ver todos los recursos →
          </Link>
        </section>
      </div>
    </>
  );
}
