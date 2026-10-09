/**
 * Crea la PRIMERA cuenta de administración. Es la única forma de crearla: desde la web está
 * bloqueado, porque mientras la base esté vacía cualquiera que llegara antes a /admin quedaría como
 * administrador (src/payload/colecciones/usuarios.ts).
 *
 * Se corre UNA vez, en la consola de la app en DigitalOcean (la app → Console):
 *
 *   CORREO=edwin@refuva.org NOMBRE="Edwin Quintero" npx payload run scripts/crear-primera-admin.ts
 *
 * Imprime una contraseña temporal UNA sola vez. Se le dicta a la persona en el momento; al entrar,
 * configura el código del teléfono y cambia la contraseña en «Cuenta». Las demás cuentas se crean
 * después desde el panel (docs/09 §5.0.2).
 */
import { randomBytes } from "node:crypto";
import { getPayload } from "payload";
import config from "../src/payload.config";

const correo = (process.env.CORREO ?? "").trim().toLowerCase();
const nombre = (process.env.NOMBRE ?? "").trim();
if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(correo) || nombre.length < 2) {
  console.error('Uso: CORREO=persona@refuva.org NOMBRE="Nombre Apellido" npx payload run scripts/crear-primera-admin.ts');
  process.exit(1);
}

const payload = await getPayload({ config });
const { totalDocs } = await payload.count({ collection: "usuarios", overrideAccess: true });
if (totalDocs > 0) {
  console.error("Ya existen cuentas. Las demás se crean desde el panel: Sistema → Usuarios.");
  process.exit(1);
}

const temporal = randomBytes(18).toString("base64url");
await payload.create({
  collection: "usuarios",
  overrideAccess: true,
  context: { primeraCuenta: true },
  data: { email: correo, nombre, password: temporal, rol: "administrador", activo: true },
});

console.log(`\nCuenta creada: ${correo}`);
console.log(`Contraseña temporal (se muestra una sola vez): ${temporal}`);
console.log("Al entrar: configurar el código del teléfono y cambiar la contraseña en «Cuenta».\n");
process.exit(0);
