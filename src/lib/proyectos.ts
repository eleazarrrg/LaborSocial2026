/**
 * Las siete líneas de acción de la Fundación REFUVA.
 *
 * Este archivo ES el requisito raíz del proyecto (O-04 / RF-06): la gente cree
 * que REFUVA solo hace salud mental, y son siete frentes. Por eso son siete
 * entradas de igual jerarquía y ninguna se presenta como subordinada.
 *
 * Todo lo que hay aquí sale de lo que Edwin dijo en la reunión del 20 de agosto
 * de 2026 — ver docs/00-fuentes/hechos-verificados.md §2. Nada está inventado.
 * Lo que falta está en `pendiente`, y se muestra como tal en el prototipo para
 * que Edwin vea exactamente qué texto tiene que enviar (docs/06).
 *
 * En producción esta lista vive en la tabla `proyectos` de Supabase y la edita
 * el panel. Aquí es la semilla del prototipo.
 */

export type Accion = {
  etiqueta: string;
  href: string;
};

export type Proyecto = {
  /** Slug de la URL. Coincide con CLAUDE.md §2 y con docs/03. */
  codigo: string;
  /** Nombre corto, para el índice. */
  nombre: string;
  /** Nombre completo, para la página del proyecto y el <title>. */
  nombreLargo: string;
  /** Una línea. Es lo que se lee en el índice del Inicio. */
  resumen: string;
  /** El dato concreto que demuestra que esto pasa de verdad. */
  dato: string;
  datoPie: string;
  /** A quién sirve. */
  poblacion: string;
  /** Párrafos confirmados en la reunión. El texto definitivo lo debe Edwin. */
  parrafos: string[];
  /** Requisitos de participación, cuando los hay (RF-07). */
  requisitos?: string[];
  /** Periodicidad o fechas conocidas. */
  cuando?: string;
  accion: Accion;
  /** Pies de las fotos que hacen falta. El prototipo los muestra como encargo. */
  fotosPendientes: string[];
  /** Si toca salud mental, la página lleva el bloque completo de crisis. */
  saludMental: boolean;
};

export const PROYECTOS: Proyecto[] = [
  {
    codigo: "psicoeducativo",
    nombre: "Proyecto Psicoeducativo",
    nombreLargo: "Proyecto Psicoeducativo REFUVA",
    resumen:
      "Salud mental dentro de las escuelas, empezando por las que nadie atiende.",
    dato: "+30",
    datoPie: "escuelas en lista de espera",
    poblacion: "Estudiantes de escuelas públicas en riesgo social",
    parrafos: [
      "Es el proyecto con el que empezó todo. Lleva la salud mental a las escuelas: no como una charla suelta, sino como acompañamiento sostenido a estudiantes que nadie más está mirando.",
      "Hay más de treinta escuelas en lista. No se han podido atender todas porque el equipo no da para más, y esa es exactamente la razón por la que la fundación necesita crecer.",
      "El grueso del trabajo ha sido en la Escuela Jerónimo de la Osa. La población estudiantil ahí está en riesgo social y muchos no cuentan con un padre o un cuidador pendiente de ellos. Buscan atención donde pueden, y a veces por caminos que les hacen daño.",
    ],
    cuando: "Durante todo el año escolar",
    accion: { etiqueta: "Solicitar una alianza", href: "/alianzas" },
    fotosPendientes: [
      "Una jornada dentro de una escuela, con estudiantes",
      "El equipo trabajando en la Escuela Jerónimo de la Osa",
    ],
    saludMental: true,
  },
  {
    codigo: "navidad",
    nombre: "Fiesta navideña",
    nombreLargo: "Fiesta navideña para niños que nunca han vivido una Navidad",
    resumen:
      "Una Navidad para niños que nunca han tenido una. Tercer año consecutivo.",
    dato: "3.er",
    datoPie: "año consecutivo",
    poblacion: "Niños de comunidades en situación de vulnerabilidad",
    parrafos: [
      "Cada fin de año REFUVA organiza una fiesta de Navidad para niños que nunca han vivido esa magia. Va por su tercer año.",
      "Funciona con dos convocatorias. En una, cualquier persona puede postular a su comunidad: hay que demostrar que es un lugar en estado de vulnerabilidad real donde los niños no han tenido una Navidad.",
      "En la otra se inscriben padrinos y madrinas. Cada uno apadrina a un niño y le hace el regalo conforme a lo que le salga del corazón. La fundación no fija un monto ni lo sugiere.",
    ],
    requisitos: [
      "Que sea una comunidad en estado de vulnerabilidad real.",
      "Que los niños no hayan vivido una Navidad.",
      "Que quien postula tenga relación directa con esa comunidad y pueda coordinar en el terreno.",
    ],
    cuando: "Convocatoria a mitad de año · fiesta en diciembre",
    accion: { etiqueta: "Ser padrino o madrina", href: "/participar/apadrinar" },
    fotosPendientes: [
      "La fiesta del año pasado, con los niños",
      "Entrega de regalos",
      "El equipo preparando la jornada",
    ],
    saludMental: false,
  },
  {
    codigo: "alimentacion",
    nombre: "Alimentación en la calle",
    nombreLargo: "Alimentación a personas en situación de calle",
    resumen:
      "Comida para personas en situación de calle, recorriendo la ciudad entera.",
    dato: "+100",
    datoPie: "raciones por jornada",
    poblacion: "Personas en situación de calle",
    parrafos: [
      "El equipo se moviliza por toda la ciudad buscando a las personas en situación de calle y llevándoles comida. Empezaron con cincuenta raciones. Hoy manejan más de cien.",
      "«El hambre no es un solo día.» La intención es salir todos los meses, aunque a veces pasan dos o tres entre una jornada y la siguiente, según las ocupaciones del equipo.",
      "Esto es el primer paso hacia algo más grande: un refugio donde se pueda dar atención de verdad a las personas en situación de calle.",
    ],
    cuando: "Mensual, según la capacidad del equipo",
    accion: { etiqueta: "Ser voluntario", href: "/participar/voluntariado" },
    fotosPendientes: [
      "Una jornada de reparto en la calle",
      "La preparación de las raciones",
    ],
    saludMental: false,
  },
  {
    codigo: "animales",
    nombre: "Animales de la calle",
    nombreLargo: "Alimentación a animales en situación de calle",
    resumen:
      "Perros y gatos de la calle, en la misma salida. El primer paso hacia un refugio.",
    dato: "= 1",
    datoPie: "misma jornada que la alimentación",
    poblacion: "Perros y gatos en situación de calle",
    parrafos: [
      "En la misma salida en que se reparte comida a las personas, se alimenta a los perros y gatos de la calle.",
      "La meta a futuro es la misma que con las personas: un refugio, donde además los animales puedan ser adoptados.",
    ],
    cuando: "Junto a cada jornada de alimentación",
    accion: { etiqueta: "Donar", href: "/donar" },
    fotosPendientes: ["Alimentación de animales durante una jornada"],
    saludMental: false,
  },
  {
    codigo: "prevencion-suicidio",
    nombre: "Prevención del suicidio",
    nombreLargo: "Campaña del Día Mundial para la Prevención del Suicidio",
    resumen:
      "El equipo sale a la calle a dar terapia gratuita y abrazos. Se formaron filas.",
    dato: "3.er",
    datoPie: "año consecutivo",
    poblacion: "Cualquier persona que necesite hablar",
    parrafos: [
      "Cada año, del 10 de agosto al 10 de septiembre, el equipo sale a la calle a dar terapia psicológica gratuita. Y abrazos.",
      "La primera vez pensaron que nadie se acercaría a hablar, ni siquiera a recibir un abrazo. Pasó lo contrario: se formaron filas para hablar con los psicólogos, y hubo gente que corrió desde lejos para recibir uno.",
      "La campaña nació porque es un tema del que nadie habla. Se puede hablar. Esta es una de las jornadas gratuitas de la fundación.",
    ],
    cuando: "Del 10 de agosto al 10 de septiembre",
    accion: { etiqueta: "Buscar ayuda ahora", href: "/ayuda-en-crisis" },
    fotosPendientes: [
      "La jornada en la calle, con la gente esperando para hablar",
      "El equipo de psicólogos atendiendo",
    ],
    saludMental: true,
  },
  {
    codigo: "rompiendo-el-circulo",
    nombre: "Rompiendo el Círculo",
    nombreLargo: "Rompiendo el Círculo",
    resumen:
      "Barrios y escuelas de área roja. Este proyecto abrió las cárceles a la capacitación.",
    dato: "→",
    datoPie: "llega a centros penitenciarios",
    poblacion: "Personas en riesgo social y privados de libertad",
    parrafos: [
      "Trabaja con personas en riesgo social: barrios de área roja y escuelas de área roja, con salud mental puesta en el contexto de la comunidad con la que se está tratando.",
      "Este proyecto es el que le abrió a REFUVA las puertas de las cárceles, donde el equipo brinda capacitación a privados de libertad.",
    ],
    accion: { etiqueta: "Ser voluntario", href: "/participar/voluntariado" },
    fotosPendientes: [
      "Trabajo en comunidad",
      "Una capacitación en centro penitenciario, si es publicable",
    ],
    saludMental: true,
  },
  {
    codigo: "historias-que-sanan",
    nombre: "Historias que Sanan",
    nombreLargo: "Historias que Sanan",
    resumen:
      "Escritura terapéutica: sanar escribiendo, y que esa historia ayude a otros.",
    dato: "✎",
    datoPie: "liderado por escritores publicados",
    poblacion: "Quien quiera escribir su historia",
    parrafos: [
      "Lo lideran escritores que ya han publicado libros, junto al equipo de salud mental.",
      "La idea es sencilla: hay gente que sana escribiendo. Y esa historia, una vez escrita, puede ayudar a muchas otras personas que están pasando por lo mismo.",
    ],
    accion: { etiqueta: "Quiero participar", href: "/participar" },
    fotosPendientes: ["Un taller de escritura", "Libros o textos publicados"],
    saludMental: true,
  },
];

export function buscarProyecto(codigo: string): Proyecto | undefined {
  return PROYECTOS.find((p) => p.codigo === codigo);
}
