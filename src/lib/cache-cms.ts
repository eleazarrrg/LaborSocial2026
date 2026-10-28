/**
 * La caché de lo que el sitio lee del panel.
 *
 * POR QUÉ. Antes cada visita a cada página hacía varias consultas a la base (el pie de página solo
 * ya lista los proyectos en TODAS las páginas): ~480 ms de piso por clic, hasta 3 s en la portada.
 * Ahora la lectura se guarda en la caché de datos de Next y las visitas normales no tocan la base.
 *
 * CUÁNDO SE RENUEVA.
 *  1. Al instante, cuando Edwin guarda o publica algo en el panel: los ganchos de
 *     src/payload/revalidar.ts expiran la etiqueta `ETIQUETA_CMS`.
 *  2. Pase lo que pase, cada `SEGUNDOS_CACHE`: si un gancho fallara, el sitio se pone al día solo.
 *
 * QUÉ NO SE GUARDA. Un fallo de la base. La función cacheada LANZA el error y quien la llama
 * (lib/contenido.ts, lib/publicaciones.ts) lo atrapa y muestra el respaldo del código, sin guardarlo:
 * una caída de dos segundos no puede dejar el sitio mostrando el catálogo de respaldo durante minutos.
 */
export const ETIQUETA_CMS = "cms";
export const SEGUNDOS_CACHE = 120;
