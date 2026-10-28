import { ViewTransition } from "react";

/**
 * Cambiar de página no es un corte seco: la que se va sale rápido (150 ms) y la nueva sube con
 * suavidad (420 ms). El encabezado, la banda de ayuda y el pie NO se mueven: están en el layout y
 * persisten, así que solo cambia el contenido.
 *
 * Es `template.tsx` y no `layout.tsx` a propósito: un layout persiste entre navegaciones y las
 * animaciones de entrada y salida nunca dispararían (docs de Next: «View transitions»). Un template
 * se vuelve a montar en cada navegación. Las clases `pagina-sale` y `pagina-entra` se definen en
 * globals.css, que además las apaga con `prefers-reduced-motion`.
 */
export default function Plantilla({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="pagina-entra" exit="pagina-sale" default="none">
      {children}
    </ViewTransition>
  );
}
