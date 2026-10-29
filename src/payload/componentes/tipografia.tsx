"use client";

import { Atkinson_Hyperlegible_Next, Bricolage_Grotesque } from "next/font/google";
import { useEffect, type ReactNode } from "react";

/**
 * Las dos tipografías del sitio, también en el panel: Atkinson Hyperlegible Next para el texto (la diseñó
 * el Braille Institute para leer sin confundir letras) y Bricolage Grotesque para los títulos.
 *
 * Payload carga este componente como «proveedor» de toda la aplicación. Las variables CSS van en un
 * contenedor sin caja propia y también en <html>, para que los menús y diálogos que Payload saca fuera
 * de la página (portales) las hereden.
 */

const cuerpo = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--fuente-panel", display: "swap" });
const titulos = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--fuente-titulos",
  display: "swap",
});

export function Tipografia({ children }: { children: ReactNode }) {
  const clases = `${cuerpo.variable} ${titulos.variable}`;

  useEffect(() => {
    const lista = clases.split(" ");
    document.documentElement.classList.add(...lista);
    return () => document.documentElement.classList.remove(...lista);
  }, [clases]);

  return (
    <div className={clases} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
