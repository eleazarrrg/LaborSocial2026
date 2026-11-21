"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BloqueCrisis } from "@/components/banda-crisis";

/**
 * Lo que se ve cuando una página del sitio falla al mostrarse. En español, con salida clara y con los
 * números de crisis a la vista: quien llega aquí puede estar buscando ayuda, y «Application error» en
 * inglés no le sirve. El error queda en el registro del navegador y del servidor (CLAUDE.md §6).
 */
export default function ErrorDelSitio({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sitio] la página falló al mostrarse", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Algo salió mal de nuestro lado.</h1>
      <p className="mt-4 max-w-[60ch] leading-relaxed text-tinta-suave">
        No pudimos mostrar esta página. No hiciste nada mal. Puedes intentarlo de nuevo o volver al inicio.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center rounded-lg border-2 border-fuerte bg-fuerte px-6 py-3 font-bold text-papel hover:border-marca hover:bg-marca"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-lg border-2 border-tinta bg-papel px-6 py-3 font-bold text-tinta hover:bg-papel-alto"
        >
          Ir al inicio
        </Link>
      </div>
      <div className="mt-12">
        <BloqueCrisis />
      </div>
    </div>
  );
}
