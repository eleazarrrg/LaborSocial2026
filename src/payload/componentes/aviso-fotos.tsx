import Link from "next/link";
import type { ServerProps } from "payload";
import { esEquipo } from "../acceso";

/**
 * «N fotos de referencia sin reemplazar». Lo ve todo el equipo, no solo administración, porque
 * reemplazarlas es tarea de quien edita contenido. Las fotos de referencia son de archivo, no de la
 * fundación: no se publica el sitio con ellas (docs/09, pendiente bloqueante antes de publicar).
 */
export async function AvisoFotos({ payload, user }: ServerProps) {
  if (!esEquipo(user)) return null;

  const { totalDocs } = await payload.count({
    collection: "medios",
    overrideAccess: true,
    where: { provisional: { equals: true } },
  });
  if (totalDocs === 0) return null;

  return (
    <p className="aviso-fotos" role="note">
      <strong>
        {totalDocs} foto{totalDocs === 1 ? "" : "s"} de referencia sin reemplazar.
      </strong>{" "}
      No son de la fundación: están para que el sitio se vea completo mientras llegan las tuyas. Cámbialas
      antes de publicar.{" "}
      <Link href="/admin/collections/medios?where[provisional][equals]=true">Ver las fotos de referencia</Link>
    </p>
  );
}
