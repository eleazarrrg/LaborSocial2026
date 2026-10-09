import type { Payload } from "payload";

/**
 * La convocatoria de padrinos de Una Estrella Otiliana 2026, abierta del 6 de octubre al final del
 * 15 de diciembre en Panamá (UTC-5, sin horario de verano). Fechas decididas por el equipo el
 * 5-10-2026; Edwin puede cambiarlas desde el panel.
 *
 * Corre al arrancar y no hace nada si ya existe: es seguro en cada despliegue.
 */
export async function sembrarConvocatoria2026(payload: Payload): Promise<void> {
  const titulo = "Padrinos y madrinas · Navidad 2026";
  const { totalDocs } = await payload.count({
    collection: "convocatorias",
    overrideAccess: true,
    where: { titulo: { equals: titulo } },
  });
  if (totalDocs > 0) return;

  await payload.create({
    collection: "convocatorias",
    overrideAccess: true,
    data: {
      proyectoSlug: "una-estrella-otiliana",
      tipo: "padrinos",
      titulo,
      descripcion:
        "Apadrinas a un niño o una niña para la fiesta navideña y le haces el regalo conforme a lo que te salga del corazón. La fundación no fija ningún monto.",
      textoSiCerrada:
        "La convocatoria de padrinos y madrinas no está abierta en este momento. Escríbenos y te avisamos cuando abra.",
      abreEn: "2026-10-06T05:00:00.000Z",
      cierraEn: "2026-12-16T05:00:00.000Z",
    },
  });
  payload.logger.info(`[semillas] Creada la convocatoria «${titulo}».`);
}
