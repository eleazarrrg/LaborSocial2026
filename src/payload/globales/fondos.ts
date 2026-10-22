import type { GlobalConfig } from "payload";
import { soloEquipo } from "../acceso";
import { campoFondo } from "../campos/fondo";

/**
 * Los fondos con foto del inicio que no pertenecen a ningún proyecto: la portada, los tres bloques
 * de «¿Cómo te podemos ayudar?» y la franja «Resiliente. Fuerte. Valiente.». Los de cada proyecto
 * viven en su propia ficha (colección Proyectos).
 *
 * Sin foto, cada bloque se muestra en el color de su tinte: nunca vacío ni roto.
 */
export const Fondos: GlobalConfig = {
  slug: "fondos",
  label: "Fondos del inicio",
  admin: {
    group: "Sitio",
    description: "Cambia la foto de cada bloque del inicio y elige su tinte. Si quitas la foto, el bloque vuelve a su color.",
  },
  // La API pública está cerrada; el sitio lee con la API local (src/lib/contenido.ts).
  access: { read: soloEquipo, update: soloEquipo },
  versions: { max: 30 },
  fields: [
    campoFondo({ name: "portada", label: "Portada", tinte: "turquesa", ayuda: "La foto grande de arriba, detrás del titular." }),
    campoFondo({ name: "ayudaDificil", label: "Bloque «Estoy pasando por un momento difícil»", tinte: "naranja" }),
    campoFondo({ name: "ayudaCita", label: "Bloque «Quiero pedir una cita»", tinte: "turquesa" }),
    campoFondo({ name: "ayudaParticipar", label: "Bloque «Quiero ayudar»", tinte: "marron" }),
    campoFondo({ name: "declaracion", label: "Franja «Resiliente. Fuerte. Valiente.»", tinte: "turquesa" }),
  ],
};
