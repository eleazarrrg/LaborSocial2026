import type { CollectionSlug } from "payload";

/**
 * Las cuatro bandejas de solicitudes. Un solo lugar que conoce sus slugs: las colecciones, las
 * Server Actions, los avisos y el inicio del panel lo importan de aquí, en vez de repetir los
 * cuatro textos (y de castear a «solicitudes-cita» para que compile).
 */
export const BANDEJAS = [
  "solicitudes-cita",
  "inscripciones-voluntariado",
  "inscripciones-padrinos",
  "mensajes-contacto",
] as const satisfies readonly CollectionSlug[];

export type SlugBandeja = (typeof BANDEJAS)[number];

/** El proyecto de la convocatoria de padrinos. Un solo lugar, no un texto suelto en la acción. */
export const PROYECTO_PADRINOS = "una-estrella-otiliana";
