import Link from "next/link";
import { RECURSOS_CRISIS } from "@/lib/crisis";

/**
 * Banda de crisis (RF-11, RNF-05).
 *
 * Una sola línea, en el armazón, en TODAS las páginas. No es un banner
 * promocional: es la ruta más corta entre alguien que está mal y un teléfono
 * que contesta. Por eso es lo primero del documento y lo primero en pantalla.
 *
 * DECISIÓN DE DISEÑO: el marrón del tronco del árbol Ψ —lo que sostiene—, no
 * rojo de alarma. Tampoco el turquesa de la navegación: la banda tiene que
 * leerse como algo aparte del sitio, no como su primera barra. Dos razones
 * más para no usar rojo. Una, un
 * rojo permanente en todas las páginas se vuelve invisible por costumbre y
 * alarma a quien no lo necesita — y este sitio también lo abren patrocinadores.
 * Dos, la comunicación en crisis funciona mejor con calma que con urgencia
 * gritada. La banda dice «te tenemos», no «EMERGENCIA».
 *
 * Deliberadamente NO es fija al hacer scroll: taparía contenido de forma
 * permanente en pantallas pequeñas, justo lo que WCAG 2.2 (2.4.11) pide
 * evitar. El acceso permanente lo da /ayuda-en-crisis, enlazada desde aquí y
 * desde el pie.
 */
export function BandaCrisis() {
  const [emergencia, linea] = RECURSOS_CRISIS;

  return (
    <div className="bg-tronco text-papel">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-sm sm:px-6">
        <span className="font-semibold">¿Necesitas ayuda ahora?</span>
        <span className="opacity-90">
          Emergencia{" "}
          <a
            href={`tel:${emergencia.marcar}`}
            className="cifras-alineadas font-display text-base font-semibold underline decoration-2 underline-offset-[3px] hover:no-underline"
          >
            {emergencia.numero}
          </a>
          <span className="mx-2 opacity-50">·</span>
          Hablar con alguien{" "}
          <a
            href={`tel:${linea.marcar}`}
            className="cifras-alineadas font-display text-base font-semibold underline decoration-2 underline-offset-[3px] hover:no-underline"
          >
            {linea.numero}
          </a>
        </span>
        <Link
          href="/ayuda-en-crisis"
          className="ml-auto shrink-0 font-medium underline decoration-1 underline-offset-[3px] opacity-90 hover:opacity-100"
        >
          Más recursos
        </Link>
      </div>
    </div>
  );
}

/**
 * Bloque completo de crisis (RF-11, RNF-05).
 *
 * Va en /agendar-cita —antes del primer campo, nunca al final en letra chica—,
 * en /ayuda-en-crisis, y en las páginas de proyecto etiquetadas como salud
 * mental. El Inicio lleva solo la banda.
 */
export function BloqueCrisis({
  titulo = "Si necesitas ayuda ahora mismo",
  entrada = "Esta página no es un canal de emergencia y nadie la está leyendo en este momento. Estos números sí contestan.",
}: {
  titulo?: string;
  entrada?: string;
}) {
  return (
    <section
      aria-labelledby="bloque-crisis"
      className="overflow-hidden rounded-xl bg-tronco text-papel"
    >
      <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8">
        <h2 id="bloque-crisis" className="text-2xl font-semibold sm:text-3xl">
          {titulo}
        </h2>
        <p className="mt-3 max-w-prose opacity-85">{entrada}</p>
      </div>

      <ul className="grid gap-px bg-papel/15 sm:grid-cols-2">
        {RECURSOS_CRISIS.map((r) => (
          <li key={r.numero} className="bg-tronco px-6 py-6 sm:px-8">
            <p className="text-sm font-semibold tracking-wide uppercase opacity-75">
              {r.nombre}
            </p>
            <a
              href={`tel:${r.marcar}`}
              className="cifras-alineadas mt-1.5 block font-display text-6xl leading-none font-semibold tracking-tight underline decoration-papel/30 decoration-4 underline-offset-8 hover:decoration-papel"
            >
              {r.numero}
            </a>
            <p className="mt-5 leading-snug">{r.cuando}</p>
            <p className="mt-1.5 text-sm opacity-75">{r.disponibilidad}</p>
            {r.whatsapp && (
              <p className="mt-3 text-sm">
                WhatsApp{" "}
                <a
                  href={r.whatsapp.enlace}
                  className="cifras-alineadas font-semibold underline underline-offset-2"
                >
                  {r.whatsapp.visible}
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
