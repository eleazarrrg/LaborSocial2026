import Link from "next/link";
import { accionSalir } from "./acciones";

/** Cabecera de las pantallas del panel con sesión completa. */
export function BarraPanel({ nombre }: { nombre: string }) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-borde pb-5">
      <Link href="/panel" className="text-lg font-bold underline-offset-4 hover:underline">
        Panel de REFUVA
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-tinta-suave">{nombre}</span>
        <form action={accionSalir}>
          <button
            type="submit"
            className="min-h-11 rounded-lg border border-borde-fuerte px-4 font-semibold hover:bg-papel-alto"
          >
            Salir
          </button>
        </form>
      </div>
    </div>
  );
}
