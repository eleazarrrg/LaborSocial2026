import type { Metadata } from "next";
import { Boton, TituloPagina } from "@/components/ui";

export const metadata: Metadata = { title: "Página no encontrada" };

/**
 * El 404 de las páginas del sitio (un proyecto, una campaña o una noticia que no existe, que se
 * ocultó o cuya dirección cambió). Lleva la marca y salidas claras, y la banda de ayuda de arriba
 * sigue a la vista: quien llega aquí buscando ayuda no tiene que encontrarla de nuevo.
 */
export default function NoEncontrada() {
  return (
    <>
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
    </>
  );
}
