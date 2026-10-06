/**
 * Iconos del sitio: SVG dibujados aquí, todos con el mismo trazo de 2 px y
 * extremos redondeados, y `currentColor` para heredar el color del texto.
 *
 * Sustituyen a los glifos Unicode (→, ▾, ✎) que hacían de iconos. Son cuatro:
 * no justifican una dependencia más que tenga que heredar el próximo equipo.
 * Siempre decorativos (`aria-hidden`): el texto del enlace lleva el nombre.
 */

type Props = { className?: string };

function Trazo({ className, children }: Props & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "size-5"}
    >
      {children}
    </svg>
  );
}

export function Flecha({ className }: Props) {
  return (
    <Trazo className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Trazo>
  );
}

export function Telefono({ className }: Props) {
  return (
    <Trazo className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </Trazo>
  );
}

export function Menu({ className }: Props) {
  return (
    <Trazo className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Trazo>
  );
}

export function Corazon({ className }: Props) {
  return (
    <Trazo className={className}>
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
    </Trazo>
  );
}
