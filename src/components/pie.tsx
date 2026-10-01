import Link from "next/link";
import { CAMPANAS, PROYECTOS, rutaDe } from "@/lib/catalogo";
import { VERIFICADO_EL } from "@/lib/crisis";

const PARTICIPAR = [
  { href: "/donar", texto: "Donar" },
  { href: "/agendar-cita", texto: "Agendar una cita" },
  { href: "/participar/apadrinar", texto: "Ser padrino o madrina" },
  { href: "/participar/voluntariado", texto: "Ser voluntario" },
  { href: "/alianzas", texto: "Solicitar una alianza" },
  { href: "/contacto", texto: "Contacto" },
];

export function Pie() {
  return (
    <footer className="border-t border-borde-fuerte bg-papel-alto">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-x-8 gap-y-11 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <p className="font-display text-xl font-semibold tracking-tight">
              Fundación REFUVA
            </p>
            <p className="mt-3 max-w-xs leading-relaxed text-tinta-suave">
              Resiliente, Fuerte, Valiente. Varios proyectos y dos campañas en
              Panamá — la salud mental es una parte, no el todo.
            </p>
          </div>

          <nav aria-label="Proyectos y campañas">
            <p className="text-sm font-semibold tracking-wide uppercase">
              Proyectos
            </p>
            <ul className="mt-4 space-y-2.5">
              {PROYECTOS.map((p) => (
                <li key={p.codigo}>
                  <Link
                    href={rutaDe(p)}
                    className="text-tinta-suave transition-colors hover:text-tinta"
                  >
                    {p.nombreCorto}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Las campañas repiten aquí el argumento de O-04, y con mejor
                proporción: ocho proyectos arriba, dos campañas debajo. */}
            <p className="mt-7 text-sm font-semibold tracking-wide uppercase">
              Campañas
            </p>
            <ul className="mt-4 space-y-2.5">
              {CAMPANAS.map((c) => (
                <li key={c.codigo}>
                  <Link
                    href={rutaDe(c)}
                    className="text-tinta-suave transition-colors hover:text-tinta"
                  >
                    {c.nombreCorto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Participar">
            <p className="text-sm font-semibold tracking-wide uppercase">
              Participar
            </p>
            <ul className="mt-4 space-y-2.5">
              {PARTICIPAR.map((e) => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    className="text-tinta-suave transition-colors hover:text-tinta"
                  >
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rounded-xl bg-fuerte px-5 py-5 text-papel">
            <p className="text-sm font-semibold tracking-wide uppercase opacity-75">
              Ayuda inmediata
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-baseline gap-3">
                <a
                  href="tel:911"
                  className="cifras-alineadas font-display text-2xl font-semibold underline decoration-papel/30 decoration-2 underline-offset-4"
                >
                  911
                </a>
                <span className="text-sm opacity-80">Emergencias</span>
              </li>
              <li className="flex items-baseline gap-3">
                <a
                  href="tel:147"
                  className="cifras-alineadas font-display text-2xl font-semibold underline decoration-papel/30 decoration-2 underline-offset-4"
                >
                  147
                </a>
                <span className="text-sm opacity-80">MIDES · 24/7, gratuita</span>
              </li>
            </ul>
            <Link
              href="/ayuda-en-crisis"
              className="mt-4 inline-block text-sm font-medium underline underline-offset-2 opacity-90 hover:opacity-100"
            >
              Todos los recursos →
            </Link>
            <p className="mt-4 text-xs opacity-65">
              Verificados el {VERIFICADO_EL}.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-borde pt-7 text-sm text-tinta-suave sm:flex-row sm:items-center sm:justify-between">
          <p>Fundación REFUVA · Panamá</p>
          <nav aria-label="Legales">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link href="/privacidad" className="hover:text-tinta">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-tinta">
                  Términos
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-7 rounded-lg border border-dashed border-valiente/35 bg-valiente-tenue px-4 py-3.5 text-sm leading-relaxed text-tinta-suave">
          <strong className="text-tinta">Prototipo en revisión.</strong> Los
          textos definitivos y las fotografías están pendientes de entrega. Lo
          que se muestra proviene de la reunión de levantamiento del 20 de agosto
          de 2026 y sirve para validar la dirección, no para publicarse.
        </p>
      </div>
    </footer>
  );
}
