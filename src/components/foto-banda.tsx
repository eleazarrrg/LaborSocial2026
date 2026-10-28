import { Portada } from "@/components/portada";
import { entradaPorCodigo } from "@/lib/contenido";

/**
 * Banda de foto bajo el título de una página interior, tomada de la foto de un proyecto del catálogo
 * (así Edwin la cambia desde el panel). Si el proyecto no tiene foto, no se pinta nada.
 */
export async function FotoBanda({ codigo }: { codigo: string }) {
  const foto = (await entradaPorCodigo("proyecto", codigo))?.fondo?.foto;
  if (!foto) return null;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-papel-alto">
        <Portada foto={foto} sizes="(min-width: 1152px) 1152px, 100vw" className="size-full" />
      </div>
    </div>
  );
}
