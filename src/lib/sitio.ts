/**
 * Dirección pública del sitio y si se deja indexar.
 *
 * El sitio nace con `noindex` (prototipo en revisión). El día del lanzamiento se pone la variable
 * INDEXAR=true en el hosting y se vuelve a desplegar: no hay que tocar código. Sin la variable, todo
 * (etiqueta robots, robots.txt) dice «no indexar».
 */
export const URL_SITIO = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").replace(/\/$/, "");

export const sitioIndexable = (): boolean => process.env.INDEXAR === "true";

/** Imagen que se ve al compartir una dirección. Va fija en `public/` para que cada página la declare. */
export const IMAGEN_COMPARTIR = {
  url: "/marca/compartir.png",
  width: 1200,
  height: 630,
  alt: "Fundación REFUVA: Resiliente, Fuerte, Valiente. Salud mental, calle, animales, familias y Navidad en Panamá.",
};
