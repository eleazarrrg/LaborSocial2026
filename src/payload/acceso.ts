import type { Access, FieldAccess } from "payload";

/**
 * Quién puede qué. Payload-totp envuelve cada función: antes de llegar aquí, la persona ya
 * verificó el código de su teléfono. Sin eso, ninguna de estas funciones se llega a llamar.
 */

type ConRol = { rol?: string | null; activo?: boolean | null } | null | undefined;

export const esAdmin = (usuario: unknown): boolean => {
  const u = usuario as ConRol;
  return u?.activo === true && u.rol === "administrador";
};

/** Solicitudes, cuarentena, bitácora y usuarios: solo administración. */
export const soloAdmin: Access = ({ req }) => esAdmin(req.user);

/** Nadie desde la API. Los formularios guardan con la API local, tras validar con Zod. */
export const nadie: Access = () => false;

export const campoSoloAdmin: FieldAccess = ({ req }) => esAdmin(req.user);
export const campoNadie: FieldAccess = () => false;
