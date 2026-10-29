/**
 * Las preguntas frecuentes con las que nace el sitio. Todas se apoyan en lo que el propio sitio ya
 * afirma (páginas de cita, donar, voluntariado, padrinos y ayuda); ninguna inventa un dato.
 *
 * Son el respaldo: si la base no responde o nunca se sembró, el sitio las muestra. Una vez sembradas
 * (`npm run sembrar`), Edwin las edita, las ordena o las oculta desde el panel, y mandan las del panel.
 *
 * Reglas (CLAUDE.md): sin conteos escritos a mano de proyectos; solo el 911 y la Línea 147 como
 * recursos de crisis, sin cifras que no estén verificadas; nada de datos de menores.
 */

export const TEMAS = ["general", "cita", "donar", "voluntariado", "padrinos", "alianzas"] as const;
export type TemaPregunta = (typeof TEMAS)[number];

export const ETIQUETA_TEMA: Record<TemaPregunta, string> = {
  general: "Sobre la fundación",
  cita: "Citas psicológicas",
  donar: "Donaciones",
  voluntariado: "Voluntariado",
  padrinos: "Padrinos y madrinas",
  alianzas: "Alianzas",
};

export type Pregunta = {
  pregunta: string;
  respuesta: string;
  tema: TemaPregunta;
  orden: number;
};

type Base = Omit<Pregunta, "orden">;

const BASE: Base[] = [
  // ── Sobre la fundación
  {
    tema: "general",
    pregunta: "¿Qué es la Fundación REFUVA?",
    respuesta:
      "Una fundación panameña sin fines de lucro que dirige el psicólogo Edwin Quintero. Empezó atendiendo gratis a quien lo necesitaba y hoy sostiene varios proyectos y campañas: salud mental, alimentación en la calle, Navidad para niños, cuidado de animales, escritura terapéutica y emprendimiento.",
  },
  {
    tema: "general",
    pregunta: "¿Qué significa REFUVA?",
    respuesta: "Resiliente, Fuerte, Valiente. Es el nombre de la fundación y la manera en que trabaja.",
  },
  {
    tema: "general",
    pregunta: "¿REFUVA solo trabaja con salud mental?",
    respuesta:
      "No. La salud mental es una parte, no el todo. La fundación también reparte comida a personas en situación de calle, cuida perros y gatos sin hogar, acompaña a familias, trabaja en escuelas y organiza una Navidad para niños que nunca la han vivido.",
  },
  {
    tema: "general",
    pregunta: "¿Cómo se sostiene la fundación?",
    respuesta:
      "Con aportes pequeños y constantes de quienes donan, y con el costo mínimo de las sesiones de atención psicológica. No depende de un solo gran aporte.",
  },
  {
    tema: "general",
    pregunta: "¿Qué hacen con mis datos si les escribo?",
    respuesta:
      "Los formularios piden lo mínimo: nombre, una forma de contacto y, si quieres, el motivo en una línea. No pedimos diagnósticos, síntomas ni medicación. Solo el personal autorizado de la fundación puede verlos, y puedes pedir que los borremos cuando quieras.",
  },
  // ── Citas psicológicas
  {
    tema: "cita",
    pregunta: "¿Cuánto cuesta una cita?",
    respuesta:
      "B/.15.00 por sesión. La fundación empezó atendiendo gratis y cobra lo mínimo para poder sostenerse. También hay jornadas gratuitas, y si el precio es el problema, escríbenos igual.",
  },
  {
    tema: "cita",
    pregunta: "¿La atención es virtual o presencial?",
    respuesta: "Puede ser virtual o presencial. Eliges la modalidad al llenar el formulario.",
  },
  {
    tema: "cita",
    pregunta: "¿Qué pasa después de enviar el formulario?",
    respuesta:
      "Tu solicitud queda registrada y te escribimos por el medio que elegiste para acordar día y hora. El plazo de respuesta lo confirma la fundación; no prometemos un tiempo que no podamos cumplir.",
  },
  {
    tema: "cita",
    pregunta: "¿Tengo que explicar lo que me pasa para pedir una cita?",
    respuesta:
      "No. No hace falta que expliques nada en el formulario ni que sepas cómo llamar a lo que te pasa. Si quieres, puedes dejar el motivo en una sola línea.",
  },
  {
    tema: "cita",
    pregunta: "¿Puedo usar el formulario si estoy en una emergencia?",
    respuesta:
      "No. El formulario no es un canal de emergencia: alguien lo lee cuando puede, no al instante. Si estás en riesgo ahora, llama al 911 o a la Línea 147 del MIDES, gratuita y confidencial. Sigues siendo importante, y hay alguien al otro lado que contesta.",
  },
  // ── Donaciones
  {
    tema: "donar",
    pregunta: "¿Cómo puedo donar?",
    respuesta:
      "Por Yappy o por transferencia directa a la cuenta de la fundación. No hay formularios ni registro. Los datos se publican en la página de donar en cuanto la fundación los confirme, para que nadie transfiera a una cuenta equivocada.",
  },
  {
    tema: "donar",
    pregunta: "¿Piden los datos de mi tarjeta?",
    respuesta:
      "Nunca. Este sitio no procesa, no transmite y no guarda datos de tarjeta. Yappy y la transferencia van directo del banco de quien dona al de la fundación, sin que nosotros toquemos nada por el camino.",
  },
  {
    tema: "donar",
    pregunta: "¿Qué logra mi donación?",
    respuesta:
      "Pagar sesiones de atención psicológica para alguien que no puede costearlas y raciones de comida para las jornadas en la calle, entre otras cosas. La fundación se sostiene con aportes pequeños y constantes, no con uno grande.",
  },
  // ── Voluntariado
  {
    tema: "voluntariado",
    pregunta: "¿Necesito ser psicólogo para ser voluntario?",
    respuesta:
      "No. Hace falta gente que reparta, que conduzca, que diseñe una publicación o que cocine. Dices en qué puedes apoyar y te avisamos solo de eso.",
  },
  {
    tema: "voluntariado",
    pregunta: "¿Cuántas horas tengo que dar?",
    respuesta:
      "Ninguna fija. No hay compromiso de horas ni de frecuencia: te escribimos cuando haya algo de lo que marcaste.",
  },
  // ── Padrinos y madrinas
  {
    tema: "padrinos",
    pregunta: "¿Cómo funciona ser padrino o madrina?",
    respuesta:
      "Te inscribes en el formulario y te asignamos un niño o una niña de una de las comunidades seleccionadas. Tú compras el regalo que decidas para la fiesta navideña. Después te escribimos para coordinar todo lo demás.",
  },
  {
    tema: "padrinos",
    pregunta: "¿Hay un monto mínimo para el regalo?",
    respuesta: "No. La fundación no fija ningún monto: el regalo es conforme a lo que te salga del corazón.",
  },
  // ── Alianzas
  {
    tema: "alianzas",
    pregunta: "¿Mi escuela, empresa u organización puede trabajar con la fundación?",
    respuesta:
      "Sí. Escríbenos desde la página de alianzas y cuéntanos con cuál de los proyectos te gustaría trabajar.",
  },
];

/** Con su orden (de 10 en 10, para poder intercalar una nueva desde el panel sin renumerar). */
export const PREGUNTAS_BASE: Pregunta[] = BASE.map((p, i) => ({ ...p, orden: (i + 1) * 10 }));
