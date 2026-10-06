import type { Metadata } from "next";

// Solo presentación. La puerta está en cada página y en cada acción (src/lib/panel.ts):
// el layout no se vuelve a ejecutar al navegar, así que aquí no se decide nada.
export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function LayoutPanel({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">{children}</div>;
}
