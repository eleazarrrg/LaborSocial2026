/**
 * Opciones de los formularios, sin ninguna dependencia.
 *
 * POR QUÉ ESTÁN AQUÍ Y NO EN esquemas.ts: los componentes de formulario son de
 * cliente y necesitan estas listas para pintar los controles. Si las importaran
 * del módulo de esquemas, el navegador se descargaría Zod entero con ellas —
 * unos 85 KB comprimidos que nadie usa en el cliente, porque la validación de
 * verdad ocurre en el servidor.
 *
 * En un sitio cuyo público navega con datos caros y teléfonos modestos, eso no
 * es una micro-optimización: es la mitad del peso de la página de citas.
 *
 * esquemas.ts importa de aquí, nunca al revés.
 */

export const MODALIDADES = [
  { valor: "cualquiera", etiqueta: "Cualquiera de las dos" },
  { valor: "virtual", etiqueta: "Virtual" },
  { valor: "presencial", etiqueta: "Presencial" },
] as const;

// Los valores son los mismos slugs que admite el CHECK de inscripciones_voluntariado.
export const AREAS_VOLUNTARIADO = [
  { valor: "redes-sociales", etiqueta: "Redes sociales" },
  { valor: "diseno", etiqueta: "Diseño" },
  { valor: "logistica", etiqueta: "Logística" },
  { valor: "psicologia", etiqueta: "Psicología" },
  { valor: "escritura", etiqueta: "Escritura" },
  { valor: "transporte", etiqueta: "Transporte" },
  { valor: "cocina", etiqueta: "Cocina" },
  { valor: "otra", etiqueta: "Otra" },
] as const;

export const CONTACTO_PREFERIDO = [
  { valor: "whatsapp", etiqueta: "WhatsApp" },
  { valor: "telefono", etiqueta: "Llamada" },
  { valor: "correo", etiqueta: "Correo" },
] as const;

export const FORMAS_ENTREGA = [
  { valor: "llevo", etiqueta: "Llevo el regalo a un punto de entrega" },
  { valor: "coordinar", etiqueta: "Prefiero coordinarlo con la fundación" },
  { valor: "asisto", etiqueta: "Quiero asistir a la fiesta y entregarlo" },
] as const;

export const MODALIDADES_VALORES = ["cualquiera", "virtual", "presencial"] as const;
export const ENTREGA_VALORES = ["llevo", "coordinar", "asisto"] as const;
export const AREAS_VALORES = [
  "redes-sociales", "diseno", "logistica", "psicologia",
  "escritura", "transporte", "cocina", "otra",
] as const;
export const CONTACTO_VALORES = ["whatsapp", "telefono", "correo"] as const;
