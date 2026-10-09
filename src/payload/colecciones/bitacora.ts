import type { CollectionConfig, PayloadRequest } from "payload";
import { nadie, soloAdmin } from "../acceso";

/**
 * Quién vio y quién cambió qué. Solo se escribe desde el servidor (los ganchos de las
 * solicitudes) y nadie la puede editar ni borrar, ni siquiera la administración.
 */
export const Bitacora: CollectionConfig = {
  slug: "bitacora",
  labels: { singular: "Entrada de bitácora", plural: "Bitácora" },
  admin: {
    group: "Sistema",
    useAsTitle: "resumen",
    defaultColumns: ["createdAt", "accion", "correo", "resumen"],
    description: "Registro inalterable de quién vio y quién cambió cada solicitud.",
  },
  defaultSort: "-createdAt",
  access: { read: soloAdmin, create: nadie, update: nadie, delete: nadie },
  fields: [
    {
      name: "accion",
      type: "select",
      required: true,
      options: [
        { label: "Vio una solicitud", value: "ver_solicitud" },
        { label: "Consultó una lista de solicitudes", value: "ver_lista" },
        { label: "Cambió el estado", value: "cambiar_estado" },
        { label: "Borró una solicitud", value: "borrar_solicitud" },
      ],
    },
    { name: "coleccion", type: "text", required: true },
    { name: "documento", type: "text", required: true },
    { name: "usuario", type: "relationship", relationTo: "usuarios" },
    { name: "correo", type: "text" },
    { name: "resumen", type: "text", required: true },
    { name: "datos", type: "json" },
  ],
};

/**
 * Escribe una entrada. Si falla, lanza: una acción sobre una solicitud que no deja rastro no se
 * permite (CLAUDE.md §6, sin fallos silenciosos). Usa la misma transacción que la operación.
 */
export async function registrarEnBitacora(
  req: PayloadRequest,
  entrada: {
    accion: "ver_solicitud" | "ver_lista" | "cambiar_estado" | "borrar_solicitud";
    coleccion: string;
    documento: string | number;
    resumen: string;
    datos?: Record<string, unknown>;
  },
): Promise<void> {
  const usuario = req.user as { id: number | string; email?: string } | null;
  await req.payload.create({
    collection: "bitacora",
    req,
    overrideAccess: true,
    data: {
      ...entrada,
      documento: String(entrada.documento),
      usuario: usuario?.id as number | undefined,
      correo: usuario?.email,
    },
  });
}
