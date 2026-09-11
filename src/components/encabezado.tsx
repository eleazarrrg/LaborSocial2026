import Link from "next/link";
import { SelectorTema } from "@/components/tema";

/**
 * Cabecera. Se lee como la mancheta de una publicación, no como la barra de
 * navegación de una aplicación.
 *
 * Seis entradas como máximo (docs/03-arquitectura-informacion.md). Contacto
 * vive en el pie: RF-10 es de prioridad baja y no compite aquí.
 *
 * El menú móvil es un <details> nativo: cero JavaScript en el cliente. En un
 * sitio cuyo público navega con datos caros y teléfonos modestos, eso no es
 * purismo, es rendimiento.
 */

const NAVEGACION = [
  { href: "/proyectos", texto: "Proyectos" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/participar", texto: "Participar" },
  { href: "/noticias", texto: "Noticias" },
];

function Marca() {
  return (
    <Link href="/" className="group flex items-baseline gap-2.5">
      {/* Marca provisional. El logo oficial es el pendiente O-08. */}
      <span
        aria-hidden
        className="grid size-8 shrink-0 translate-y-1 place-items-center rounded-md bg-fuerte font-display text-base font-bold text-papel"
      >
        R
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        Fundación REFUVA
      </span>
    </Link>
  );
}

export function Encabezado() {
  return (
    <header className="sticky top-0 z-50 border-b border-borde bg-papel/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6">
        <div className="mr-auto">
          <Marca />
        </div>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9375rem]">
            {NAVEGACION.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  className="text-tinta-suave decoration-valiente decoration-2 underline-offset-[6px] transition-colors hover:text-tinta hover:underline"
                >
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <SelectorTema />
          <span aria-hidden className="h-6 w-px bg-borde" />
          <Link
            href="/agendar-cita"
            className="rounded-lg px-3.5 py-2 text-[0.9375rem] font-semibold text-fuerte ring-1 ring-inset ring-borde-fuerte transition-colors hover:bg-fuerte-tenue"
          >
            Agendar cita
          </Link>
          <Link
            href="/donar"
            className="rounded-lg bg-fuerte px-4 py-2 text-[0.9375rem] font-semibold text-papel transition-opacity hover:opacity-90"
          >
            Donar
          </Link>
        </div>

        {/* Menú compacto: nativo, sin JavaScript. */}
        <details className="relative shrink-0 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-[0.9375rem] font-semibold ring-1 ring-inset ring-borde-fuerte [&::-webkit-details-marker]:hidden">
            Menú
            <span aria-hidden className="text-xs">
              ▾
            </span>
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-borde bg-superficie p-2 shadow-lg shadow-black/5">
            <ul className="text-[0.9375rem]">
              {NAVEGACION.map((e) => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    className="block rounded-lg px-3 py-2.5 hover:bg-papel-alto"
                  >
                    {e.texto}
                  </Link>
                </li>
              ))}
              <li className="my-1.5 border-t border-borde" />
              <li className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="text-tinta-suave">Tema</span>
                <SelectorTema />
              </li>
              <li className="my-1.5 border-t border-borde" />
              <li>
                <Link
                  href="/agendar-cita"
                  className="block rounded-lg px-3 py-2.5 font-semibold text-fuerte hover:bg-papel-alto"
                >
                  Agendar cita
                </Link>
              </li>
              <li>
                <Link
                  href="/donar"
                  className="mt-1 block rounded-lg bg-fuerte px-3 py-2.5 text-center font-semibold text-papel"
                >
                  Donar
                </Link>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </header>
  );
}
