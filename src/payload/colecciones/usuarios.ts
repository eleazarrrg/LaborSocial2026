import { APIError, type CollectionConfig } from "payload";
import { campoSoloAdmin, esAdmin, soloAdmin } from "../acceso";

const CINCO_MINUTOS = 5 * 60 * 1000;
const DOS_HORAS = 2 * 60 * 60;

/**
 * Las personas que entran al panel. Toda cuenta nace INACTIVA y como «edición»: nadie se da acceso
 * a sí mismo. La única excepción es la primera cuenta, que nace administradora porque si no nadie
 * podría activar a nadie; por eso NO se puede crear desde la web, solo desde la consola del servidor.
 *
 * El segundo factor lo exige payload-totp para todas (payload.config.ts, forceSetup).
 */
export const Usuarios: CollectionConfig = {
  slug: "usuarios",
  labels: { singular: "Usuario", plural: "Usuarios" },
  admin: {
    group: "Sistema",
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "email", "rol", "activo"],
  },
  auth: {
    // Bloqueo corto: con uno largo, cualquiera podría dejar a Edwin fuera tecleando mal su correo.
    // Lo que de verdad frena los intentos es el límite por IP en Cloudflare (docs/09 §5.0.1).
    maxLoginAttempts: 10,
    lockTime: CINCO_MINUTOS,
    tokenExpiration: DOS_HORAS,
    cookies: {
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    },
  },
  access: {
    // Cada quien ve su propia cuenta; la administración ve todas.
    read: ({ req }) =>
      esAdmin(req.user) ? true : req.user?.activo ? { id: { equals: req.user.id } } : false,
    create: soloAdmin,
    update: ({ req }) =>
      esAdmin(req.user) ? true : req.user?.activo ? { id: { equals: req.user.id } } : false,
    delete: soloAdmin,
  },
  fields: [
    { name: "nombre", type: "text", required: true },
    {
      name: "rol",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Administración (ve las solicitudes)", value: "administrador" },
        { label: "Edición de contenido", value: "editor" },
      ],
      // Nadie se sube el rol a sí mismo.
      access: { create: campoSoloAdmin, update: campoSoloAdmin },
      admin: { position: "sidebar" },
    },
    {
      name: "activo",
      type: "checkbox",
      defaultValue: false,
      access: { create: campoSoloAdmin, update: campoSoloAdmin },
      admin: {
        position: "sidebar",
        description:
          "Sin marcar, la cuenta no puede entrar ni ver nada. Una sesión ya abierta caduca en 2 horas como máximo.",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "usuarios", req });
        if (totalDocs > 0) return data;
        // La primera cuenta NO se crea desde la web: mientras la base esté vacía, cualquiera que
        // llegara antes que Edwin a /admin sería administrador. Se crea desde la consola del servidor
        // con scripts/crear-primera-admin.ts (docs/09 §5.0.1), que marca este contexto.
        if (req.context.primeraCuenta !== true) {
          throw new APIError(
            "La primera cuenta se crea desde la consola del servidor (docs/09 §5.0.1).",
            403,
            undefined,
            true,
          );
        }
        return { ...data, rol: "administrador", activo: true };
      },
    ],
    beforeLogin: [
      ({ user }) => {
        if (!user.activo) {
          throw new APIError(
            "Tu cuenta todavía no está activa. Pídele a la administración de la fundación que la active.",
            403,
            undefined,
            true,
          );
        }
        return user;
      },
    ],
  },
};
