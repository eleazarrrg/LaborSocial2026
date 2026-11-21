/**
 * Crea una cuenta de administración adicional, sin entrar al panel. Para cuando ya existe la primera
 * (scripts/crear-primera-admin.ts) y hay que dar de alta a otra persona desde la consola.
 *
 *   CORREO=persona@correo.com NOMBRE="Nombre Apellido" CLAVE="clave temporal" npm run demo:crear-admin
 *
 * La clave es temporal: al entrar, la persona configura el código del teléfono (segundo factor,
 * obligatorio) y cambia la contraseña en «Cuenta». Nada se guarda en el repositorio ni se imprime.
 */
import { getPayload } from "payload";
import config from "../src/payload.config";

const correo = (process.env.CORREO ?? "").trim().toLowerCase();
const nombre = (process.env.NOMBRE ?? "").trim();
const clave = process.env.CLAVE ?? "";
if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(correo) || nombre.length < 2 || clave.length < 8) {
  console.error('Uso: CORREO=persona@correo.com NOMBRE="Nombre Apellido" CLAVE="mínimo 8 caracteres" npm run demo:crear-admin');
  process.exit(1);
}

const payload = await getPayload({ config });
const { totalDocs } = await payload.count({ collection: "usuarios", where: { email: { equals: correo } }, overrideAccess: true });
if (totalDocs > 0) {
  console.error(`Ya existe una cuenta con ${correo}. No se toca.`);
  process.exit(1);
}

await payload.create({
  collection: "usuarios",
  overrideAccess: true,
  data: { email: correo, nombre, password: clave, rol: "administrador", activo: true },
});

console.log(`Cuenta de administración creada: ${correo}. Al entrar debe configurar el segundo factor y cambiar la contraseña.`);
process.exit(0);
