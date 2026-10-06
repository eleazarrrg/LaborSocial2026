import Image from "next/image";
import Link from "next/link";
import { Flecha, Telefono } from "@/components/iconos";
import { SelectorTema } from "@/components/tema";
import { CAMPANAS, PROYECTOS, rutaDe } from "@/lib/catalogo";
import { RECURSOS_CRISIS, VERIFICADO_EL } from "@/lib/crisis";

/**
 * Pie, con el patrón de Mind: una franja entera en el turquesa de marca.
 *
 * Lista los proyectos uno por uno (docs/03 §5): un solo enlace «Proyectos»
 * escondería justo lo que el sitio existe para demostrar. La ayuda inmediata
 * es una columna más, no una caja dentro de otra, y el selector de tema vive
 * aquí y no en la cabecera, donde sumaba tres botones a la primera pantalla.
 */

const PARTICIPAR = [
  { href: "/agendar-cita", texto: "Pedir una cita" },
  { href: "/participar/apadrinar", texto: "Ser padrino o madrina" },
  { href: "/participar/voluntariado", texto: "Ser voluntario" },
  { href: "/donar", texto: "Donar" },
  { href: "/alianzas", texto: "Proponer una alianza" },
  { href: "/contacto", texto: "Contacto" },
];

const ENLACE = "underline-offset-4 hover:underline";

function Columna({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-extrabold">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Pie() {
  return (
    <footer className="bg-marca text-sobre-marca">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg">
              <span className="grid size-14 place-items-center rounded-xl bg-papel">
                <Image
                  src="/marca/institucional-recortado.png"
                  alt=""
                  width={243}
                  height={349}
                  className="h-11 w-auto"
                />
              </span>
              <span className="text-xl font-extrabold">Fundación REFUVA</span>
            </Link>
            <p className="mt-5 max-w-xs leading-relaxed">
              Resiliente, Fuerte, Valiente. {PROYECTOS.length} proyectos y{" "}
              {CAMPANAS.length} campañas en Panamá: la salud mental es una parte,
              no el todo.
            </p>
          </div>

          <nav aria-label="Proyectos y campañas">
            <Columna titulo="Proyectos">
              <ul className="space-y-2.5">
                {PROYECTOS.map((p) => (
                  <li key={p.codigo}>
                    <Link href={rutaDe(p)} className={ENLACE}>
                      {p.nombreCorto}
                    </Link>
                  </li>
                ))}
              </ul>
            </Columna>
            <h2 className="mt-8 text-lg font-extrabold">Campañas</h2>
            <ul className="mt-4 space-y-2.5">
              {CAMPANAS.map((c) => (
                <li key={c.codigo}>
                  <Link href={rutaDe(c)} className={ENLACE}>
                    {c.nombreCorto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Participar">
            <Columna titulo="Participar">
              <ul className="space-y-2.5">
                {PARTICIPAR.map((e) => (
                  <li key={e.href}>
                    <Link href={e.href} className={ENLACE}>
                      {e.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </Columna>
          </nav>

          <Columna titulo="Ayuda inmediata">
            <ul className="space-y-4">
              {RECURSOS_CRISIS.map((r) => (
                <li key={r.numero}>
                  <a
                    href={`tel:${r.marcar}`}
                    className="inline-flex items-center gap-2.5 text-3xl leading-none font-extrabold underline-offset-4 hover:underline"
                  >
                    <Telefono className="size-6" />
                    <span className="cifras-alineadas">{r.numero}</span>
                  </a>
                  <p className="mt-1.5">{r.nombre}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/ayuda-en-crisis"
              className="mt-5 inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-4"
            >
              Todos los recursos
              <Flecha className="size-5" />
            </Link>
            <p className="mt-3 text-sm">Verificados el {VERIFICADO_EL}.</p>
          </Columna>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-sobre-marca/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Legales">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link href="/privacidad" className={ENLACE}>
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className={ENLACE}>
                  Términos
                </Link>
              </li>
            </ul>
          </nav>
          {/* Sobre el turquesa, el selector va en una ficha clara: sus botones
              inactivos están pensados para fondo claro. */}
          <div className="flex items-center gap-3 self-start rounded-xl bg-papel py-1.5 pr-1.5 pl-4 text-tinta sm:self-auto">
            <span className="text-sm font-bold">Tema</span>
            <SelectorTema />
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed">
          <strong>Prototipo en revisión.</strong> Los textos definitivos y las
          fotografías están pendientes de entrega; lo que se muestra sirve para
          validar la dirección con la fundación, no para publicarse.
        </p>
      </div>
    </footer>
  );
}
