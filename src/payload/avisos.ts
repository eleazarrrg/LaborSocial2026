import type { Payload, PayloadRequest } from "payload";
import { RECURSOS_CRISIS } from "@/lib/crisis";
import type { SlugBandeja } from "./bandejas";
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

const CONFIRMACION: Record<SlugBandeja, { asunto: string; cuerpo: string }> = {
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
/** Quien pide una cita siempre recibe los recursos de crisis; el resto, una confirmación al día. */
const CONFIRMACIONES_POR_DIA: Record<SlugBandeja, number> = {
  "solicitudes-cita": 3,
  "inscripciones-voluntariado": 1,
  "inscripciones-padrinos": 1,
  "mensajes-contacto": 1,
};

const FIRMA = "\n\n— Fundación REFUVA\n\nEste correo es automático. No es un canal de emergencia.";

type Doc = { id: number | string; correo?: string | null };

const fechaLarga = () =>
  new Date().toLocaleString("es-PA", {
    timeZone: "America/Panama",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

/** Un ataque de envíos no puede agotar la cuota diaria de Resend (100) y dejar sin aviso a las reales. */
async function exigirDentroDelTope(req: PayloadRequest, coleccion: SlugBandeja): Promise<void> {
  const { totalDocs } = await req.payload.count({
    collection: coleccion,
    overrideAccess: true,
    req,
    where: { createdAt: { greater_than: new Date(Date.now() - UNA_HORA).toISOString() } },
  });
  if (totalDocs > TOPE_POR_HORA) {
    throw new ErrorSeguro(
      `Más de ${TOPE_POR_HORA} envíos en la última hora: aviso omitido para no agotar la cuota.`,
    );
  }
}

/** A la fundación: tipo, fecha y enlace. Ni el contenido ni la urgencia: eso se lee en el panel. */
async function avisarALaFundacion(
  payload: Payload,
  coleccion: SlugBandeja,
  singular: string,
  doc: Doc,
): Promise<void> {
  const destino = process.env.AVISOS_CORREO;
  if (!destino) throw new ErrorSeguro("Falta AVISOS_CORREO: nadie recibiría el aviso.");
  await payload.sendEmail({
    to: destino,
    // «Nuevo envío: …» y no «Nueva …»: los cuatro tipos no comparten género gramatical.
    subject: `Nuevo envío: ${singular}`,
    text: [
      `Llegó por el sitio: ${singular}.`,
      `Fecha: ${fechaLarga()}`,
      `Ábrela en el panel: ${payload.config.serverURL}/admin/collections/${coleccion}/${doc.id}`,
      "",
      "Por seguridad, el contenido no viaja por correo: solo se lee dentro del panel.",
    ].join("\n"),
  });
}

/**
 * A la persona, si dejó correo. Con tope por día: sin él, cualquiera podría usar los formularios
 * para mandar correos de la fundación a un tercero.
 */
async function confirmarALaPersona(req: PayloadRequest, coleccion: SlugBandeja, doc: Doc): Promise<void> {
  if (!doc.correo) return;
  const { totalDocs: previas } = await req.payload.count({
    collection: coleccion,
    overrideAccess: true,
    req,
    where: {
      and: [
        { correo: { equals: doc.correo } },
        { avisoEnviado: { equals: true } },
        { createdAt: { greater_than: new Date(Date.now() - UN_DIA).toISOString() } },
      ],
    },
  });
  if (previas >= CONFIRMACIONES_POR_DIA[coleccion]) return;

  const { asunto, cuerpo } = CONFIRMACION[coleccion];
  await req.payload.sendEmail({
    to: doc.correo,
    subject: `${asunto} · Fundación REFUVA`,
    text: cuerpo + FIRMA,
  });
}

export async function avisarNuevaSolicitud(
  req: PayloadRequest,
  coleccion: SlugBandeja,
  singular: string,
  doc: Doc,
): Promise<void> {
  const { payload } = req;
  try {
    await exigirDentroDelTope(req, coleccion);
    await avisarALaFundacion(payload, coleccion, singular, doc);
    await confirmarALaPersona(req, coleccion, doc);
  } catch (error) {
    payload.logger.error(`[avisos] ${coleccion} ${doc.id}: no se envió el aviso. ${describirError(error)}`);
    return;
  }

  // Aparte del envío: si esto falla, el correo ya salió, y no se debe reportar como «sin aviso».
  try {
    await payload.update({
      collection: coleccion,
      id: doc.id,
      data: { avisoEnviado: true },
      req,
      overrideAccess: true,
      context: { sinBitacora: true, desdeAvisos: true },
    });
  } catch (error) {
    payload.logger.error(`[avisos] ${coleccion} ${doc.id}: el correo salió pero no se pudo marcar. ${describirError(error)}`);
  }
}
