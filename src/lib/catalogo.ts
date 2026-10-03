/**
 * El catálogo de la Fundación REFUVA: ocho proyectos y dos campañas.
 *
 * Sustituye a `proyectos.ts`, que modelaba «siete líneas de acción» inferidas de
 * la reunión del 20 de agosto. El material oficial que la fundación entregó en
 * octubre de 2026 desmintió esa estructura: son ocho proyectos, y las campañas
 * son otra cosa — la propia fundación las separa bajo el encabezado «Campañas
 * memorables de Refuva».
 *
 * POR QUÉ CAMPAÑAS VAN APARTE, y es la decisión que protege el requisito raíz:
 * juntas serían diez entradas de las cuales cinco son salud mental. Esa lista le
 * daría la razón a la percepción que el sitio existe para desmentir (O-04).
 * Separadas, los ocho proyectos los dominan la comida, los animales, la Navidad,
 * las familias y el emprendimiento — y la salud mental queda donde debe: una
 * parte importante, no el todo.
 *
 * EL CONTEO NUNCA SE ESCRIBE A MANO. Se deriva de estos datos. Viene una tercera
 * campaña y Edwin puede abrir el noveno proyecto desde el panel; que el número
 * estuviera quemado en 27 archivos es justo lo que hizo caro este cambio.
 *
 * Los `parrafos` son el texto oficial de la fundación, literal. Los `dato` salen
 * de lo que Edwin contó en la reunión. Ver docs/00-fuentes/hechos-verificados.md
 * y docs/10-migracion-catalogo-2026-10.md.
 *
 * En producción esto vive en la tabla `proyectos` con su columna `tipo`.
 */

export type TipoEntrada = "proyecto" | "campana";

export type Accion = {
  etiqueta: string;
  href: string;
};

export type Logo = {
  src: string;
  /**
   * El fondo horneado del archivo, medido de sus esquinas.
   *
   * Los diez logos de proyectos y campañas llegaron como PNG opacos: el fondo
   * está dentro de la imagen. La placa que los contiene usa ESTE color, no un
   * token del tema, para que el borde del PNG desaparezca contra ella. El
   * rectángulo no se esconde — se convierte en el objeto.
   *
   * `transparent` solo lo tiene el logo institucional.
   */
  fondo: string;
  alt: string;
};

export type Entrada = {
  /** Slug de la URL: minúsculas, guiones, sin tildes ni ñ. */
  codigo: string;
  tipo: TipoEntrada;
  /** Nombre completo, para el titular y el <title>. */
  nombre: string;
  /** Nombre corto, para índices y navegación. */
  nombreCorto: string;
  /** Una línea. Es lo que se lee en el índice. */
  resumen: string;
  /** El dato concreto que demuestra que esto pasa de verdad. */
  dato: string;
  datoPie: string;
  poblacion: string;
  /** Texto oficial de la fundación. */
  parrafos: string[];
  /** Cada proyecto nació de una historia (O-06). Solo tres están confirmadas. */
  enHonorA?: string;
  requisitos?: string[];
  cuando?: string;
  accion: Accion;
  logo?: Logo;
  /**
   * Color de identidad, derivado del logo y oscurecido hasta pasar 4.5:1 sobre
   * los dos papeles. El hex de marca puro vive en `colorMarca`: varios no pasan
   * contraste y no pueden tocar texto.
   *
   * REGLA ANTI-COLLAGE: este color aparece tres veces por entrada y ni una más —
   * la regla del numeral, el filo superior de su página y la viñeta de sus
   * requisitos. Nunca como relleno grande, nunca en el armazón.
   */
  colorAcento: string;
  /**
   * El mismo matiz para tema oscuro: aclarado y dessaturado hasta pasar 4.5:1
   * sobre los tres fondos oscuros. No es opcional — el valor claro sobre
   * `#12100c` da 2.36:1 y el numeral se vuelve invisible.
   */
  colorAcentoOscuro: string;
  colorMarca?: string;
  /** Si lleva el bloque completo de crisis. Lo decide el dato, no quien publica. */
  bloqueCrisis: boolean;
  fotosPendientes: string[];
};

export const CATALOGO: Entrada[] = [
  /* ───────────────────────────────────────────────────────── PROYECTOS ── */
  {
    codigo: "psicoeducativo",
    tipo: "proyecto",
    nombre: "Proyecto Psicoeducativo REFUVA",
    nombreCorto: "Psicoeducativo",
    resumen:
      "Orientación y acompañamiento para toda la comunidad educativa, no solo para los estudiantes.",
    dato: "+30",
    datoPie: "escuelas en lista de espera",
    poblacion:
      "Comunidad educativa: administrativos, docentes, padres de familia y estudiantes",
    parrafos: [
      "Es un proyecto psicoeducativo creado con el propósito de brindar orientación, acompañamiento y herramientas que contribuyan al bienestar emocional, social y educativo a la comunidad educativa en general: administrativos, docentes, padres de familia y estudiantes.",
      "A través de diferentes actividades y espacios de aprendizaje, buscamos fortalecer habilidades, promover valores y brindar herramientas que permitan afrontar de manera positiva los diferentes desafíos de la vida.",
      "Nuestro objetivo es crear espacios seguros donde cada persona pueda sentirse escuchada, valorada y acompañada, fomentando el crecimiento personal, la convivencia saludable y una comunidad más consciente y solidaria.",
    ],
    cuando: "Durante todo el año escolar",
    accion: { etiqueta: "Solicitar una alianza", href: "/alianzas" },
    // Sin logo propio: no vino en el material. Usa el acento institucional.
    colorAcento: "#903000",
    colorAcentoOscuro: "#d5794b",
    bloqueCrisis: true,
    fotosPendientes: [
      "Una jornada dentro de una escuela",
      "Trabajo con docentes o con padres de familia",
    ],
  },
  {
    codigo: "psicoempresarial",
    tipo: "proyecto",
    nombre: "Proyecto Psicoempresarial REFUVA",
    nombreCorto: "Psicoempresarial",
    resumen:
      "Formación y acompañamiento para convertir ideas en oportunidades y sueños en proyectos sostenibles.",
    dato: "—",
    datoPie: "proyecto recién incorporado",
    poblacion: "Personas emprendedoras y equipos de trabajo",
    parrafos: [
      "Es un proyecto que busca brindar herramientas y conocimientos para fortalecer el desarrollo personal, profesional y empresarial de las personas.",
      "A través de espacios de formación, orientación y acompañamiento, promovemos el emprendimiento, el liderazgo, la creatividad y el desarrollo de habilidades que permitan convertir ideas en oportunidades y sueños en proyectos sostenibles.",
      "Nuestro propósito es impulsar personas con iniciativa, confianza y visión, capaces de generar cambios positivos tanto en su vida como en su entorno. Porque cuando fortalecemos nuestras capacidades, también creamos nuevas oportunidades para crecer y avanzar.",
    ],
    accion: { etiqueta: "Solicitar una alianza", href: "/alianzas" },
    colorAcento: "#903000",
    colorAcentoOscuro: "#d5794b",
    bloqueCrisis: false,
    fotosPendientes: ["Una sesión de formación o taller"],
  },
  {
    codigo: "rompiendo-el-circulo",
    tipo: "proyecto",
    nombre: "Rompiendo el Círculo",
    nombreCorto: "Rompiendo el Círculo",
    resumen:
      "Acompañamiento a personas en riesgo social. Ninguna persona queda definida por sus circunstancias.",
    dato: "→",
    datoPie: "abre caminos donde parecían cerrados",
    poblacion: "Personas en situación de riesgo social",
    parrafos: [
      "Es un proyecto enfocado en acompañar y brindar apoyo a personas en situación de riesgo social, creando espacios de orientación, escucha y oportunidades para superar las circunstancias que pueden limitar su desarrollo y bienestar.",
      "A través de diferentes acciones y programas, buscamos fortalecer la autoestima, promover la toma de decisiones positivas y brindar herramientas que permitan construir nuevas oportunidades y caminos de vida.",
      "Creemos que ninguna persona debe quedar definida por sus circunstancias. Romper el círculo es abrir la posibilidad de comenzar de nuevo, transformar realidades y construir un futuro con esperanza, dignidad y nuevas oportunidades.",
    ],
    accion: { etiqueta: "Ser voluntario", href: "/participar/voluntariado" },
    logo: {
      src: "/marca/proyectos/rompiendo-el-circulo.png",
      fondo: "#ffffff",
      alt: "Insignia circular dorada sobre negro con un árbol de raíces visibles y el círculo roto en un costado",
    },
    colorAcento: "#846000",
    colorAcentoOscuro: "#b18c29",
    colorMarca: "#c09000",
    bloqueCrisis: true,
    fotosPendientes: ["Trabajo en comunidad"],
  },
  {
    codigo: "historias-que-sanan",
    tipo: "proyecto",
    nombre: "Historias que Sanan",
    nombreCorto: "Historias que Sanan",
    resumen:
      "Escritura terapéutica. Algunas historias necesitan ser contadas para comenzar a sanar.",
    dato: "✎",
    datoPie: "escritura como herramienta de bienestar",
    poblacion: "Quien quiera poner en palabras lo vivido",
    parrafos: [
      "Es un proyecto que utiliza la escritura como una herramienta de expresión, reflexión y bienestar emocional. A través de la escritura terapéutica, buscamos brindar un espacio seguro donde las personas puedan expresar sus pensamientos, emociones y experiencias, permitiéndoles darle voz a aquello que muchas veces resulta difícil comunicar.",
      "El proyecto invita a transformar experiencias en palabras, recuerdos en historias y emociones en oportunidades de reflexión y crecimiento personal. Escribir puede convertirse en un espacio para conocernos, comprender lo vivido y avanzar con una nueva perspectiva.",
      "Porque algunas historias necesitan ser contadas para comenzar a sanar.",
    ],
    accion: { etiqueta: "Quiero participar", href: "/participar" },
    logo: {
      src: "/marca/proyectos/historias-que-sanan.png",
      fondo: "#ffffff",
      alt: "Emblema de Historias que Sanan sobre fondo claro",
    },
    colorAcento: "#9a3246",
    colorAcentoOscuro: "#d37688",
    colorMarca: "#f0d8d8",
    bloqueCrisis: true,
    fotosPendientes: ["Un taller de escritura"],
  },
  {
    codigo: "grupo-un-solo-corazon",
    tipo: "proyecto",
    nombre: "Grupo Un Solo Corazón",
    nombreCorto: "Un Solo Corazón",
    resumen:
      "Nació en la pandemia llevando bolsas de comida a familias. Sigue hasta hoy.",
    dato: "2020",
    datoPie: "desde la pandemia, sin parar",
    poblacion: "Familias en dificultad",
    parrafos: [
      "Grupo Un Solo Corazón nace durante la pandemia, en un momento en el que muchas familias atravesaban grandes dificultades y necesitaban apoyo para salir adelante. Desde entonces, nos unimos con un mismo propósito: ayudar y acompañar a quienes más lo necesitan.",
      "Durante ese tiempo, llevamos bolsas de comida a numerosas familias, compartiendo no solo alimentos, sino también esperanza, solidaridad y el mensaje de que no estaban solas.",
      "Lo que comenzó como una respuesta ante una situación de necesidad se convirtió en un compromiso que continúa hasta hoy. Grupo Un Solo Corazón representa la unión de personas que creen que, cuando trabajamos juntos y ponemos el corazón en servir, podemos transformar vidas y llevar esperanza a nuestra comunidad.",
    ],
    enHonorA: "Las familias que sostuvieron la pandemia sin soltarse",
    accion: { etiqueta: "Ser voluntario", href: "/participar/voluntariado" },
    logo: {
      src: "/marca/proyectos/grupo-un-solo-corazon.png",
      fondo: "#cdcdcb",
      alt: "Dos manos de distinto tono sosteniendo un corazón rojo, con el lema «Todo se puede lograr siempre que estemos unidos»",
    },
    colorAcento: "#b81c00",
    colorAcentoOscuro: "#da7360",
    colorMarca: "#d80000",
    bloqueCrisis: false,
    fotosPendientes: ["Entrega de bolsas de comida a una familia"],
  },
  {
    codigo: "una-estrella-otiliana",
    tipo: "proyecto",
    nombre: "Una Estrella Otiliana",
    nombreCorto: "Una Estrella Otiliana",
    resumen:
      "El proyecto navideño. Nace en honor a Otilia, la abuela de Edwin.",
    dato: "3.er",
    datoPie: "año consecutivo",
    poblacion: "Niños de comunidades en situación de vulnerabilidad",
    parrafos: [
      "Una Estrella Otiliana es un proyecto navideño que nace en honor a alguien muy especial, mi abuela Otilia, con el propósito de llevar la magia, la alegría y el espíritu de la Navidad a una comunidad. A través de esta iniciativa, buscamos compartir momentos especiales, brindar sonrisas y crear experiencias llenas de amor, esperanza y solidaridad.",
      "Creemos que la Navidad es mucho más que recibir; es una oportunidad para compartir, unir corazones y llevar un poco de luz a quienes nos rodean. Por eso, nos unimos para hacer realidad una celebración especial y demostrar que, juntos, podemos convertir pequeños gestos en grandes momentos de felicidad.",
    ],
    enHonorA: "Otilia, la abuela de Edwin",
    requisitos: [
      "Que sea una comunidad en estado de vulnerabilidad real.",
      "Que los niños no hayan vivido una Navidad.",
      "Que quien postula tenga relación directa con esa comunidad y pueda coordinar en el terreno.",
    ],
    cuando: "Convocatoria a mitad de año · celebración en diciembre",
    accion: { etiqueta: "Ser padrino o madrina", href: "/participar/apadrinar" },
    // Lo que llegó es un afiche vertical 1080×1350, no un emblema: va como
    // imagen de la sección de evidencia, no dentro de una placa cuadrada.
    colorAcento: "#806300",
    colorAcentoOscuro: "#ac8e28",
    colorMarca: "#f0c000",
    bloqueCrisis: false,
    fotosPendientes: [
      "La celebración del año pasado, con los niños",
      "Entrega de regalos",
    ],
  },
  {
    codigo: "comida-en-la-calle",
    tipo: "proyecto",
    nombre: "Comida en la Calle, Esperanza en el Corazón",
    nombreCorto: "Comida en la Calle",
    resumen:
      "Alimento al cuerpo y esperanza al corazón, para personas en situación de calle.",
    dato: "+100",
    datoPie: "raciones por jornada",
    poblacion: "Personas en situación de calle",
    parrafos: [
      "Comida en la Calle, Esperanza en el Corazón es un proyecto que nace con el propósito de brindar alimentación y acompañamiento a personas en situación de calle.",
      "A través de esta iniciativa buscamos ofrecer mucho más que un plato de comida: queremos compartir un momento de cercanía, respeto y solidaridad, recordando que cada persona merece ser tratada con dignidad y empatía.",
      "Con pequeñas acciones buscamos llevar alimento al cuerpo y esperanza al corazón, demostrando que cuando nos unimos para ayudar, podemos generar un impacto positivo en nuestra comunidad.",
    ],
    cuando: "Mensual, según la capacidad del equipo",
    accion: { etiqueta: "Ser voluntario", href: "/participar/voluntariado" },
    logo: {
      src: "/marca/proyectos/comida-en-la-calle.png",
      fondo: "#f6f6f6",
      alt: "Emblema de Comida en la Calle, Esperanza en el Corazón",
    },
    colorAcento: "#903000",
    colorAcentoOscuro: "#d5794b",
    bloqueCrisis: false,
    fotosPendientes: ["Una jornada de reparto en la calle"],
  },
  {
    codigo: "angelitos-de-la-calle",
    tipo: "proyecto",
    nombre: "Angelitos de la Calle",
    nombreCorto: "Angelitos de la Calle",
    resumen:
      "Alimento para perritos y gatitos sin hogar. Ayudar a un animalito también transforma una vida.",
    dato: "= 1",
    datoPie: "misma jornada que la alimentación",
    poblacion: "Perros y gatos en situación de calle",
    parrafos: [
      "Angelitos de la Calle es un proyecto que nace del amor y la preocupación por aquellos animalitos que viven en las calles y que muchas veces no tienen un hogar ni alimento.",
      "A través de esta iniciativa brindamos alimentación a perritos y gatitos en situación de calle, compartiendo con ellos un poco de cariño, cuidado y esperanza.",
      "Creemos que cada vida merece respeto y que un pequeño acto de amor puede marcar una gran diferencia. Nuestro propósito es seguir sumando corazones para ayudar a estos pequeños angelitos que, aunque no pueden pedir ayuda con palabras, también necesitan de nosotros.",
      "Porque ayudar a un animalito también es una forma de transformar una vida.",
    ],
    cuando: "Junto a cada jornada de alimentación",
    accion: { etiqueta: "Donar", href: "/donar" },
    logo: {
      src: "/marca/proyectos/angelitos-de-la-calle.png",
      fondo: "#f5f5f5",
      alt: "Corazón rojo con alas y una aureola sobre un comedero, en un círculo turquesa, con el nombre Angelitos de la Calle",
    },
    colorAcento: "#006b6b",
    colorAcentoOscuro: "#27a5a5",
    colorMarca: "#90c0c0",
    bloqueCrisis: false,
    fotosPendientes: ["Alimentación de animales durante una jornada"],
  },

  /* ────────────────────────────────────────────────────────── CAMPAÑAS ── */
  {
    codigo: "hablame-panama",
    tipo: "campana",
    nombre: "Háblame Panamá",
    nombreCorto: "Háblame Panamá",
    resumen:
      "Campaña de prevención del suicidio. Nace en honor a Jessica.",
    dato: "#",
    datoPie: "hablemos · escuchemos · acompañemos",
    poblacion: "Toda persona que atraviese un momento difícil, y quien la acompaña",
    parrafos: [
      "Háblame Panamá es una campaña de prevención del suicidio que nace en honor a Jessica, transformando su historia en un llamado a la empatía, la escucha y la esperanza.",
      "La campaña busca generar conciencia sobre la importancia de hablar abiertamente sobre la salud emocional, reconocer señales de alerta y acercarnos a quienes puedan estar atravesando momentos difíciles. Promovemos espacios donde las personas puedan sentirse escuchadas, acompañadas y libres de pedir ayuda sin miedo a ser juzgadas.",
      "A través de Háblame Panamá, queremos recordar que una conversación puede abrir una puerta, que escuchar también es una forma de ayudar y que pedir apoyo es un acto de valentía.",
      "Hablemos. Escuchemos. Acompañemos. Porque detrás de cada historia hay una vida que merece ser escuchada. Recuerda: no estás solo.",
    ],
    enHonorA: "Jessica",
    accion: { etiqueta: "Buscar ayuda ahora", href: "/ayuda-en-crisis" },
    logo: {
      src: "/marca/campanas/hablame-panama.png",
      fondo: "#fdfdfd",
      alt: "#HáblamePanamá en ámbar, con el mapa de Panamá, un corazón y el lazo de prevención del suicidio",
    },
    // El ámbar es el lazo internacional de prevención del suicidio. El matiz se
    // respeta; solo se baja la luminancia para que pase contraste.
    colorAcento: "#8a6000",
    colorAcentoOscuro: "#b48a2a",
    colorMarca: "#f0a800",
    bloqueCrisis: true,
    fotosPendientes: ["La jornada en la calle, con la gente esperando para hablar"],
  },
  {
    codigo: "escuchame-panama",
    tipo: "campana",
    nombre: "#EscúchamePanamá",
    nombreCorto: "#EscúchamePanamá",
    resumen:
      "Campaña de sensibilización en salud mental. Pedir ayuda es un acto de fortaleza.",
    dato: "#",
    datoPie: "escuchar también es cuidar",
    poblacion: "La sociedad panameña",
    parrafos: [
      "#EscúchamePanamá es una campaña de sensibilización y promoción de la salud mental, creada para generar espacios donde las personas puedan expresarse, ser escuchadas y sentirse acompañadas sin miedo a ser juzgadas.",
      "La campaña busca visibilizar la importancia de hablar sobre lo que sentimos, reconocer que pedir ayuda es un acto de fortaleza y fomentar una cultura de empatía, comprensión y apoyo emocional en la sociedad panameña.",
      "A través del mensaje «Escúchame», se pretende recordar que detrás de cada persona puede existir una preocupación, una emoción o una situación que necesita ser atendida. La campaña promueve la escucha activa, el diálogo y la búsqueda oportuna de apoyo profesional cuando sea necesario.",
      "#EscúchamePanamá invita a construir un Panamá donde hablar de salud mental sea cada vez más natural, donde escuchar también sea una forma de cuidar y donde nadie sienta que tiene que enfrentar sus dificultades en silencio.",
    ],
    accion: { etiqueta: "Buscar ayuda ahora", href: "/ayuda-en-crisis" },
    logo: {
      src: "/marca/campanas/escuchame-panama.png",
      fondo: "#fefefe",
      alt: "#EscúchamePanamá en verde, con un cerebro, un corazón, el mapa de Panamá y el lazo de salud mental",
    },
    // El verde es el lazo internacional de salud mental.
    colorAcento: "#006018",
    colorAcentoOscuro: "#27a747",
    colorMarca: "#006018",
    bloqueCrisis: true,
    fotosPendientes: ["Una actividad de la campaña"],
  },
];

/* ─────────────────────────────────────────────────────────── Selectores ── */

export const PROYECTOS = CATALOGO.filter((e) => e.tipo === "proyecto");
export const CAMPANAS = CATALOGO.filter((e) => e.tipo === "campana");

export function buscarEntrada(codigo: string): Entrada | undefined {
  return CATALOGO.find((e) => e.codigo === codigo);
}

export function buscarPorTipo(tipo: TipoEntrada, codigo: string) {
  return CATALOGO.find((e) => e.tipo === tipo && e.codigo === codigo);
}

/** La ruta pública de una entrada, según su tipo. */
export function rutaDe(e: Entrada): string {
  return e.tipo === "campana"
    ? `/campanas/${e.codigo}`
    : `/proyectos/${e.codigo}`;
}

/**
 * El conteo, en palabras. Se deriva — nunca se escribe «ocho» a mano, porque
 * viene una tercera campaña y Edwin puede abrir el noveno proyecto desde el
 * panel. Que el número estuviera quemado en 27 archivos es lo que hizo caro
 * este cambio; no se repite.
 */
const PALABRAS = [
  "cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete",
  "ocho", "nueve", "diez", "once", "doce",
] as const;

export function enPalabras(n: number): string {
  return PALABRAS[n] ?? String(n);
}
