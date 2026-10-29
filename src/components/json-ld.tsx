/**
 * Datos estructurados (JSON-LD) para buscadores y asistentes. El contenido sale siempre de constantes
 * y del catálogo del propio sitio, nunca de lo que escribe un visitante; aun así se escapa `<` para que
 * ningún texto pueda cerrar la etiqueta <script>.
 */
export function JsonLd({ datos }: { datos: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\u003c") }}
    />
  );
}
