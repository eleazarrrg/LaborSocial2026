import type { PayloadRequest } from "payload";
import { RECURSOS_CRISIS } from "@/lib/crisis";
import { ErrorSeguro, describirError } from "./errores";

/**
 * Avisos por correo cuando llega una solicitud (CLAUDE.md §4):
 *   · a la fundación: tipo, fecha y enlace al panel. NUNCA el contenido: los datos se leen dentro
 *     del panel, con segundo factor, no en un buzón.
 *   · a la persona, si dejó correo: que su solicitud llegó. En la de cita, los recursos de crisis.
 *
 * Si el correo falla, la solicitud YA está guardada: no se pierde nada. Queda `avisoEnviado` en
 * falso, visible en el panel, y el error en el registro del servidor (sin datos personales).
 */

const [emergencia, linea147] = RECURSOS_CRISIS;

const CRISIS = [
  `Si mientras esperas sientes que no puedes más, no esperes:`,
  `· ${linea147.nombre}: ${linea147.numero}${linea147.whatsapp ? ` o WhatsApp ${linea147.whatsapp.visible}` : ""} (${linea147.disponibilidad.toLowerCase()}).`,
  `· Si hay riesgo para la vida ahora mismo: ${emergencia.numero}.`,
].join("\n");

const CONFIRMACION: Record<string, { asunto: string; cuerpo: string }> = {
  "solicitudes-cita": {
    asunto: "Recibimos tu solicitud de cita",
    cuerpo: `Recibimos tu solicitud de cita con la Fundación REFUVA. Te escribiremos por el medio que elegiste para acordar día y hora.\n\n${CRISIS}`,
  },
  "inscripciones-voluntariado": {
    asunto: "Recibimos tu inscripción de voluntariado",
    cuerpo:
      "Gracias por ofrecer tu tiempo. Te escribiremos a este correo cuando haya una actividad en las áreas que marcaste.",
  },
  "inscripciones-padrinos": {
    asunto: "Recibimos tu inscripción: Una Estrella Otiliana",
    cuerpo:
      "Gracias por sumarte a Una Estrella Otiliana. Te contactaremos antes de la fiesta para coordinar la entrega del regalo.",
  },
  "mensajes-contacto": {
    asunto: "Recibimos tu mensaje",
    cuerpo: "Recibimos tu mensaje. Te responderemos por el correo o el teléfono que dejaste.",
  },
};

const UN_DIA = 24 * 60 * 60 * 1000;
const UNA_HORA = 60 * 60 * 1000;
const TOPE_POR_HORA = 15;

const FIRMA = "\n\n— Fundación REFUVA\n\nEste correo es automático. No es un canal de emergencia.";

export async function avisarNuevaSolicitud(
  req: PayloadRequest,
  coleccion: string,
  singular: string,
  doc: { id: number | string; correo?: string | null; atencionPronto?: boolean | null },
): Promise<void> {
  const { payload } = req;
  try {
    const destino = process.env.AVISOS_CORREO;
    if (!destino) throw new ErrorSeguro("Falta AVISOS_CORREO: nadie recibiría el aviso.");

    // Tope de volumen: un ataque de envíos no puede agotar la cuota diaria de Resend (100) y dejar
    // sin aviso a las solicitudes reales. Pasado el tope, las solicitudes se siguen guardando y el
    // panel muestra cuántas quedaron sin aviso.
    const { totalDocs: enLaUltimaHora } = await payload.count({
      collection: coleccion as "solicitudes-cita",
      overrideAccess: true,
      req,
      where: { createdAt: { greater_than: new Date(Date.now() - UNA_HORA).toISOString() } },
    });
    if (enLaUltimaHora > TOPE_POR_HORA) {
      throw new ErrorSeguro(
        `Más de ${TOPE_POR_HORA} envíos en la última hora: aviso omitido para no agotar la cuota.`,
      );
    }

    const enlace = `${payload.config.serverURL}/admin/collections/${coleccion}/${doc.id}`;
    await payload.sendEmail({
      to: destino,
      // «Nuevo envío: …» y no «Nueva …»: los cuatro tipos no comparten género gramatical.
      subject: `${doc.atencionPronto ? "[Atención pronto] " : ""}Nuevo envío: ${singular}`,
      text: [
        `Llegó por el sitio: ${singular}.`,
        doc.atencionPronto ? "La persona marcó «Necesito atención pronto»." : "",
        `Fecha: ${new Date().toLocaleString("es-PA", {
          timeZone: "America/Panama",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}`,
        `Ábrela en el panel: ${enlace}`,
        "",
        "Por seguridad, el contenido no viaja por correo: solo se lee dentro del panel.",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    // Una sola confirmación por correo y por día. Sin esto, cualquiera podría usar los formularios
    // para mandar correos de la fundación a un tercero, o agotar la cuota diaria de Resend.
    const confirmacion = CONFIRMACION[coleccion];
    const yaConfirmado =
      !!doc.correo &&
      (
        await payload.count({
          collection: coleccion as "solicitudes-cita",
          overrideAccess: true,
          req,
          where: {
            and: [
              { correo: { equals: doc.correo } },
              { avisoEnviado: { equals: true } },
              { createdAt: { greater_than: new Date(Date.now() - UN_DIA).toISOString() } },
            ],
          },
        })
      ).totalDocs > 0;
    if (doc.correo && confirmacion && !yaConfirmado) {
      await payload.sendEmail({
        to: doc.correo,
        subject: `${confirmacion.asunto} · Fundación REFUVA`,
        text: confirmacion.cuerpo + FIRMA,
      });
    }

    await payload.update({
      collection: coleccion as "solicitudes-cita",
      id: doc.id,
      data: { avisoEnviado: true },
      req,
      overrideAccess: true,
      context: { sinBitacora: true, desdeAvisos: true },
    });
  } catch (error) {
    payload.logger.error(`[avisos] ${coleccion} ${doc.id}: no se envió el aviso. ${describirError(error)}`);
  }
}
