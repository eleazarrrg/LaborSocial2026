"use client";

import { useState } from "react";

/**
 * Copiar al portapapeles (RF-09).
 *
 * Un número de cuenta que hay que transcribir a mano desde el teléfono es un
 * número de cuenta que se escribe mal. El botón de copiar no es una comodidad:
 * evita que una donación acabe en otra parte.
 *
 * Si el portapapeles no está disponible —navegador viejo, contexto sin HTTPS—
 * el texto sigue siendo seleccionable a mano y el botón lo dice en vez de
 * fallar en silencio.
 */
export function BotonCopiar({
  valor,
  etiqueta,
}: {
  valor: string;
  etiqueta: string;
}) {
  const [estado, setEstado] = useState<"listo" | "copiado" | "fallo">("listo");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor);
      setEstado("copiado");
      setTimeout(() => setEstado("listo"), 2200);
    } catch {
      setEstado("fallo");
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex min-h-11 shrink-0 items-center rounded-lg px-3.5 py-2 text-sm font-semibold text-fuerte ring-1 ring-inset ring-borde-fuerte transition-colors hover:bg-fuerte-tenue"
    >
      <span aria-live="polite">
        {estado === "copiado"
          ? "Copiado"
          : estado === "fallo"
            ? "Selecciónalo a mano"
            : "Copiar"}
      </span>
      <span className="sr-only"> {etiqueta}</span>
    </button>
  );
}
