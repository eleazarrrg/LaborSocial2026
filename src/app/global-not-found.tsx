import type { Metadata } from "next";
import { BandaCrisis } from "@/components/banda-crisis";
import { Boton, TituloPagina } from "@/components/ui";
import "./(sitio)/globals.css";

export const metadata: Metadata = { title: "Página no encontrada · Fundación REFUVA" };

/**
 * El 404 de cualquier dirección que no existe (una URL mal escrita, un enlace viejo). Hay dos layouts raíz
 * —el sitio y el panel—, así que Next no puede armarlo desde un layout: lleva su propio <html>.
 *
 * No toca la base de datos a propósito: es la página que sale cuando todo lo demás falla, y quien llega
 * buscando ayuda ve los números de crisis igual (la banda es estática).
 */
export default function NoEncontradaGlobal() {
  return (
    <html lang="es-PA">
      <body>
        <BandaCrisis />
        <main id="contenido">
          <TituloPagina
            quieto
            titulo="Esta página no está aquí."
            entrada="Puede que la dirección esté mal escrita, o que ese contenido ya no esté publicado."
          />
          <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 py-12 sm:px-6 sm:py-16">
            <Boton href="/">Ir al inicio</Boton>
            <Boton href="/proyectos" variante="secundario">Ver los proyectos</Boton>
            <Boton href="/ayuda-en-crisis" variante="secundario">Necesito ayuda ahora</Boton>
          </div>
        </main>
      </body>
    </html>
  );
}
