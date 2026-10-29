import type { Metadata } from "next";
import { rutaDe, type Entrada } from "@/lib/catalogo";

/**
 * Metadatos de la página de un proyecto o campaña: título, descripción y vista previa al compartir.
 * La imagen para compartir es la de la fundación (opengraph-image): las fotos de cada entrada siguen
 * marcadas como provisionales y no se usan hasta que la fundación entregue las suyas.
 * Se repiten `type`, `siteName` y `locale` porque `openGraph` de una página reemplaza al del layout.
 */
export function metadatosDeEntrada(e: Entrada): Metadata {
  return {
    title: e.nombre,
    description: e.resumen,
    openGraph: {
      type: "website",
      siteName: "Fundación REFUVA",
      locale: "es_PA",
      title: e.nombre,
      description: e.resumen,
      url: rutaDe(e),
    },
  };
}
