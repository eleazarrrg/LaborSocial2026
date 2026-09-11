"use client";

import { useSyncExternalStore } from "react";

/**
 * Selector de tema: claro, oscuro o el del sistema.
 *
 * TRES ESTADOS, NO DOS. «Sistema» es el valor por defecto y tiene que existir:
 * mucha gente ya configuró su teléfono en oscuro por la noche, y forzarle un
 * tema claro a las dos de la mañana en la página de crisis es exactamente el
 * momento en que peor sienta.
 *
 * CÓMO SE GUARDA. Una llave en localStorage y un atributo `data-tema` en <html>.
 * No hay cookie: no hace falta, y este sitio no pone cookies (así se evita el
 * banner de consentimiento). Si el usuario no ha elegido nada, no hay atributo
 * y manda `prefers-color-scheme`.
 *
 * EL PARPADEO. Lo resuelve `guionAntiParpadeo`, que se inyecta en el <head> y
 * corre antes del primer pintado. Sin él, quien elige oscuro ve un fogonazo
 * blanco en cada carga.
 */

export const LLAVE_TEMA = "refuva-tema";

/**
 * Se inserta en el <head> y bloquea el pintado durante menos de un milisegundo.
 * Va minificado a mano porque viaja en cada respuesta HTML.
 */
export const guionAntiParpadeo = `(function(){try{var t=localStorage.getItem("${LLAVE_TEMA}");if(t==="claro"||t==="oscuro"){document.documentElement.setAttribute("data-tema",t)}}catch(e){}})()`;

type Tema = "sistema" | "claro" | "oscuro";

const OPCIONES: { valor: Tema; etiqueta: string; icono: React.ReactNode }[] = [
  {
    valor: "claro",
    etiqueta: "Tema claro",
    icono: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
  {
    valor: "sistema",
    etiqueta: "Seguir al sistema",
    icono: (
      <>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    valor: "oscuro",
    etiqueta: "Tema oscuro",
    icono: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  },
];

/**
 * localStorage es un almacén externo a React, así que se lee con
 * useSyncExternalStore y no con un efecto. Además de ser el patrón correcto
 * para renderizado concurrente, sale gratis la sincronización entre pestañas:
 * si cambias el tema en una, la otra se entera.
 */
const EVENTO_TEMA = "refuva:tema";

function suscribir(alCambiar: () => void) {
  // `storage` solo dispara en las OTRAS pestañas; el evento propio cubre esta.
  window.addEventListener("storage", alCambiar);
  window.addEventListener(EVENTO_TEMA, alCambiar);
  return () => {
    window.removeEventListener("storage", alCambiar);
    window.removeEventListener(EVENTO_TEMA, alCambiar);
  };
}

function leerCliente(): Tema {
  try {
    const guardado = localStorage.getItem(LLAVE_TEMA);
    if (guardado === "claro" || guardado === "oscuro") return guardado;
  } catch {
    // localStorage puede estar bloqueado (navegación privada, políticas del
    // dispositivo). No es motivo para romper la página: se cae a «sistema».
  }
  return "sistema";
}

/** En el servidor no hay preferencia que leer. */
function leerServidor(): Tema {
  return "sistema";
}

export function SelectorTema() {
  const tema = useSyncExternalStore(suscribir, leerCliente, leerServidor);

  function elegir(nuevo: Tema) {
    const raiz = document.documentElement;
    try {
      if (nuevo === "sistema") localStorage.removeItem(LLAVE_TEMA);
      else localStorage.setItem(LLAVE_TEMA, nuevo);
    } catch {
      // Si no se puede persistir, al menos se aplica en esta sesión.
    }
    if (nuevo === "sistema") raiz.removeAttribute("data-tema");
    else raiz.setAttribute("data-tema", nuevo);
    window.dispatchEvent(new Event(EVENTO_TEMA));
  }

  return (
    <div
      role="group"
      aria-label="Tema del sitio"
      className="flex items-center gap-0.5 rounded-lg border border-borde p-0.5"
    >
      {OPCIONES.map((o) => {
        const activo = tema === o.valor;
        return (
          <button
            key={o.valor}
            type="button"
            onClick={() => elegir(o.valor)}
            aria-pressed={activo}
            title={o.etiqueta}
            className={`grid size-8 place-items-center rounded-md transition-colors ${
              activo
                ? "bg-fuerte text-papel"
                : "text-tinta-suave hover:bg-papel-alto hover:text-tinta"
            }`}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              {o.icono}
            </svg>
            <span className="sr-only">{o.etiqueta}</span>
          </button>
        );
      })}
    </div>
  );
}
