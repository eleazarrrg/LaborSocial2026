/**
 * Recursos de crisis.
 *
 * REGLA DURA (CLAUDE.md §5.1): aquí solo entra lo VERIFICADO. Un número
 * equivocado en una página de prevención del suicidio hace daño real.
 *
 * La 169 del MINSA y los números del INSAM NO están en esta lista a propósito:
 * están sin confirmar y en conflicto entre fuentes. Para agregarlos hay que
 * llamar primero y anotar qué contesta. Ver docs/04-requisitos-no-funcionales.md.
 *
 * En producción esto se lee de la tabla `ajustes` para que un administrador
 * pueda corregirlo sin un despliegue (RF-11). Mientras el prototipo no tiene
 * base de datos, vive aquí.
 */

export type RecursoCrisis = {
  nombre: string;
  numero: string;
  /** Formato E.164 sin signos, para el enlace tel: */
  marcar: string;
  cuando: string;
  disponibilidad: string;
  whatsapp?: { visible: string; enlace: string };
};

export const RECURSOS_CRISIS: RecursoCrisis[] = [
  {
    nombre: "Emergencias",
    numero: "911",
    marcar: "911",
    cuando: "Si hay riesgo para la vida ahora mismo, tuya o de alguien más.",
    disponibilidad: "24 horas, todos los días",
  },
  {
    nombre: "Línea 147 — MIDES",
    numero: "147",
    marcar: "147",
    cuando:
      "Si necesitas hablar con alguien. Atiende psicólogos y trabajadores sociales.",
    disponibilidad: "Gratuita y confidencial, 24 horas, los 365 días",
    // El número 6694-2747 está verificado en fuentes oficiales del MIDES.
    // La FORMA del enlace wa.me hay que probarla en Android e iOS antes de publicar.
    whatsapp: { visible: "6694-2747", enlace: "https://wa.me/50766942747" },
  },
];

/** Fecha en que alguien del equipo verificó estos datos por última vez. */
export const VERIFICADO_EL = "6 de septiembre de 2026";
