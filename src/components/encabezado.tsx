import Image from "next/image";
import Link from "next/link";
import { Corazon, Menu } from "@/components/iconos";

/**
 * Cabecera, con el patrón de Mind (mind.org.uk), la vara de acabado elegida.
 *
 * Dos pisos. Arriba, en blanco: el árbol Ψ y los dos botones que el visitante
 * vino a buscar, «Necesito ayuda» PRIMERO y «Donar» después, del mismo tamaño.
 * El orden es una decisión del equipo: quien llega mal desde WhatsApp tiene
 * que sentirse reconocido antes de que se le pida dinero. Abajo, una franja en
 * el turquesa de marca con la navegación.
 *
 * No es fija: la banda de crisis ya está en lo alto de cada página y una
 * cabecera fija de dos pisos se come media pantalla de un teléfono pequeño.
 *
 * El menú móvil es un <details> nativo: cero JavaScript en el cliente.
 */

const NAVEGACION = [
  { href: "/proyectos", texto: "Proyectos" },
  { href: "/campanas", texto: "Campañas" },
  { href: "/participar", texto: "Participar" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/noticias", texto: "Noticias" },
  { href: "/contacto", texto: "Contacto" },
];

const BOTON_CABECERA =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-tinta px-4 font-bold text-tinta transition-colors";

function Marca() {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-lg">
      {/* El árbol cuyo tronco es la Ψ, recortado a su tinta: el archivo
          original deja un 53 % de margen transparente y, en una caja de 48 px,
          el árbol medía 23 px. Se quitó solo transparencia; el dibujo es el
          mismo. */}
      <Image
        src="/marca/institucional-recortado.png"
        alt=""
        width={243}
        height={349}
        priority
        className="h-13 w-auto shrink-0 sm:h-14"
      />
      <span className="leading-tight">
        <span className="block text-xl font-extrabold tracking-tight sm:text-[1.375rem]">
          Fundación REFUVA
        </span>
        <span className="block text-sm text-tinta-suave">
          Resiliente · Fuerte · Valiente
        </span>
      </span>
    </Link>
  );
}

function BotonesPrincipales({ className }: { className: string }) {
  return (
    <div className={className}>
      <Link
        href="/ayuda-en-crisis"
        className={`${BOTON_CABECERA} bg-valiente-tenue hover:bg-valiente hover:text-papel`}
      >
        Necesito ayuda
      </Link>
      <Link
        href="/donar"
        className={`${BOTON_CABECERA} bg-fuerte-tenue hover:bg-fuerte hover:text-papel`}
      >
        <Corazon className="size-4" />
        Donar
      </Link>
    </div>
  );
}

export function Encabezado() {
  return (
    <header>
      <div className="border-b border-borde bg-papel">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
          <div className="mr-auto">
            <Marca />
          </div>

          <BotonesPrincipales className="hidden gap-3 sm:flex" />

          {/* Menú compacto: nativo, sin JavaScript. */}
          <details className="relative shrink-0 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border-2 border-tinta px-3 font-bold [&::-webkit-details-marker]:hidden">
              <Menu className="size-5" />
              Menú
            </summary>
            <nav
              aria-label="Principal"
              className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl bg-marca text-sobre-marca shadow-xl shadow-black/20"
            >
              <ul className="py-2">
                {NAVEGACION.map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="block px-5 py-3 font-semibold underline-offset-4 hover:underline"
                    >
                      {e.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>

        {/* En el teléfono, los dos botones ocupan su propia fila, a lo ancho. */}
        <BotonesPrincipales className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 pb-4 sm:hidden" />
      </div>

      <nav aria-label="Principal" className="hidden bg-marca text-sobre-marca lg:block">
        <ul className="mx-auto flex max-w-6xl gap-8 px-6">
          {NAVEGACION.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className="block py-4 font-semibold decoration-2 underline-offset-[6px] hover:underline"
              >
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
