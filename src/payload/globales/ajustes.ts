import type { FieldHook, GlobalAfterChangeHook, GlobalConfig, Validate } from "payload";
import { soloAdmin, soloEquipo } from "../acceso";
import { registrarEnBitacora } from "../colecciones/bitacora";

/**
 * Ajustes de la fundación: lo que antes vivía escrito en el código y que Edwin necesita poder cambiar sin
 * pedirle nada a nadie: WhatsApp, correo, redes, dirección, horario, y los datos de donación (Yappy y
 * cuenta). El sitio los lee de aquí (src/lib/ajustes.ts) y, si la base falla, usa los del código.
 *
 * Quién puede qué: el equipo lo ve; solo ADMINISTRACIÓN lo cambia, porque cambiar la cuenta o el alias de
 * donación desvía dinero. Cada cambio queda en la Bitácora (quién y qué sección, nunca los valores) y la
 * historia de versiones permite volver atrás.
 *
 * Las normalizaciones van en `beforeValidate`: Edwin escribe como le salga («+507 6058-3801», «@refuva_pma»)
 * y se guarda en la forma que el sitio necesita.
 */

const digitos = (v: string) => v.replace(/\D/g, "");
const vacio = (v: unknown) => typeof v !== "string" || v.trim() === "";

/** «+507 6058-3801», «6058-3801» o «50760583801» → «50760583801» (la forma de wa.me). */
const normalizarWhatsapp: FieldHook = ({ value }) => {
  if (vacio(value)) return null;
  const d = digitos(String(value));
  if (d.length === 8) return `507${d}`;
  if (/^507\d{8}$/.test(d)) return d;
  // Lo que no se entiende como número se deja tal cual: así la validación lo rechaza con un aviso,
  // en vez de guardarlo vacío en silencio.
  return String(value).trim();
};

const validarWhatsapp: Validate<string | null | undefined> = (v) =>
  !v || /^507\d{8}$/.test(v) ? true : "Escribe un número de Panamá de 8 dígitos, por ejemplo +507 6058-3801.";

/** «@refuva_pma», «refuva_pma» o el enlace completo → el enlace de la cuenta. */
const normalizarInstagram: FieldHook = ({ value }) => {
  if (vacio(value)) return null;
  const t = String(value).trim();
  if (/^https?:\/\//i.test(t)) return t;
  const usuario = t.replace(/^@/, "").replace(/\/+$/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(usuario) ? `https://www.instagram.com/${usuario}/` : t;
};

const validarInstagram: Validate<string | null | undefined> = (v) => {
  if (!v) return true;
  try {
    const u = new URL(v);
    const ok = u.protocol === "https:" && /(^|\.)instagram\.com$/.test(u.hostname) && u.pathname.replace(/\//g, "") !== "";
    return ok || "Pega el enlace de la cuenta (https://www.instagram.com/…) o escribe @usuario.";
  } catch {
    return "Pega el enlace de la cuenta (https://www.instagram.com/…) o escribe @usuario.";
  }
};

const validarHttps: Validate<string | null | undefined> = (v) => {
  if (!v) return "Pega el enlace.";
  try {
    return new URL(v).protocol === "https:" || "El enlace debe empezar con https://";
  } catch {
    return "El enlace no es válido: debe empezar con https://";
  }
};

/** Los cuatro datos de la cuenta van juntos: o están todos o no se muestra ninguno. */
const cuentaCompleta =
  (campo: string): Validate<string | null | undefined> =>
  (v, { siblingData }) => {
    const alguno = ["banco", "tipo", "numero", "titular"].some((k) => !vacio((siblingData as Record<string, unknown>)?.[k]));
    if (!alguno) return true;
    if (vacio(v)) return `Falta ${campo}: los cuatro datos de la cuenta van juntos.`;
    return true;
  };

const validarNumeroCuenta: Validate<string | null | undefined> = (v, o) => {
  const base = cuentaCompleta("el número")(v, o);
  if (base !== true) return base;
  return !v || /^\d{6,20}$/.test(v) ? true : "Solo dígitos, sin espacios ni guiones (de 6 a 20).";
};

const SECCIONES: Record<string, string[]> = {
  "contacto y redes": ["whatsapp", "correo", "instagram", "otrasRedes", "direccion", "horario"],
  donaciones: ["yappy", "cuenta"],
};

/**
 * Vacío «de verdad»: nada, texto en blanco, lista sin filas o un grupo cuyos campos están todos vacíos.
 * Sin esto, guardar por primera vez un grupo sin llenar contaría como «cambió las donaciones».
 */
const sinContenido = (v: unknown): boolean =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.every(sinContenido)) ||
  (typeof v === "object" && !Array.isArray(v) && Object.entries(v as Record<string, unknown>).every(([k, x]) => k === "id" || sinContenido(x)));

const huella = (v: unknown): string => (sinContenido(v) ? "" : JSON.stringify(v, (k, x) => (k === "id" ? undefined : x)));

/** Deja rastro de QUIÉN cambió QUÉ SECCIÓN. Nunca guarda los valores (una cuenta bancaria no va a la bitácora). */
const registrarCambio: GlobalAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const antes = (previousDoc ?? {}) as Record<string, unknown>;
  const ahora = doc as Record<string, unknown>;
  const cambiadas = Object.entries(SECCIONES)
    .filter(([, campos]) => campos.some((c) => huella(antes[c]) !== huella(ahora[c])))
    .map(([nombre]) => nombre);
  if (cambiadas.length === 0) return doc;
  await registrarEnBitacora(req, {
    accion: "cambiar_ajustes",
    coleccion: "ajustes",
    documento: "ajustes",
    resumen: `Cambió los ajustes: ${cambiadas.join(" y ")}`,
    datos: { secciones: cambiadas },
  });
  return doc;
};

export const Ajustes: GlobalConfig = {
  slug: "ajustes",
  label: "Ajustes",
  admin: {
    group: "Publicar",
    description: "Contacto, redes y datos de donación del sitio, y la prueba de SEO. Lo que escribes aquí se ve en el sitio al guardar.",
  },
  // La API pública está cerrada; el sitio lee con la API local (src/lib/ajustes.ts).
  access: { read: soloEquipo, update: soloAdmin },
  versions: { max: 30 },
  hooks: { afterChange: [registrarCambio] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Contacto y redes",
          description: "Aparece en el pie de página, en Contacto y en los botones de WhatsApp de los formularios.",
          fields: [
            {
              name: "whatsapp",
              label: "WhatsApp de la fundación",
              type: "text",
              hooks: { beforeValidate: [normalizarWhatsapp] },
              validate: validarWhatsapp,
              admin: {
                description:
                  "Con o sin +507; se muestra como +507 XXXX-XXXX y abre el chat. No es un canal de emergencia: así se avisa en el sitio. Vacío = no se muestra.",
              },
            },
            {
              name: "correo",
              label: "Correo de la fundación",
              type: "email",
              admin: { description: "El que ve el público. Vacío = no se muestra." },
            },
            {
              name: "instagram",
              label: "Instagram",
              type: "text",
              hooks: { beforeValidate: [normalizarInstagram] },
              validate: validarInstagram,
              admin: { description: "Pega el enlace de la cuenta o escribe @usuario. Vacío = no se muestra." },
            },
            {
              name: "otrasRedes",
              label: "Otras redes",
              type: "array",
              maxRows: 5,
              labels: { singular: "Red", plural: "Otras redes" },
              admin: { description: "Facebook, TikTok, YouTube… Salen en el pie de página con su nombre y un icono genérico." },
              fields: [
                { name: "nombre", label: "Nombre", type: "text", required: true, maxLength: 30, admin: { placeholder: "Facebook" } },
                { name: "url", label: "Enlace", type: "text", required: true, validate: validarHttps, admin: { placeholder: "https://…" } },
              ],
            },
            {
              name: "direccion",
              label: "Dirección",
              type: "textarea",
              admin: { description: "Solo si la fundación quiere publicarla. Vacío = no se muestra." },
            },
            { name: "horario", label: "Horario de atención", type: "text", admin: { description: "Por ejemplo: lunes a viernes, 9:00 a. m. a 4:00 p. m." } },
          ],
        },
        {
          label: "Donaciones",
          description:
            "Cambiar estos datos cambia a dónde llega el dinero. Solo administración puede hacerlo y cada cambio queda en la Bitácora. Revisa dos veces antes de guardar.",
          fields: [
            {
              name: "yappy",
              label: "Alias de Yappy Comercial",
              type: "text",
              admin: { description: "Tal como aparece en Yappy. Vacío = no se muestra." },
            },
            {
              name: "cuenta",
              label: "Cuenta para transferencias (ACH)",
              type: "group",
              admin: { description: "Los cuatro datos van juntos: si falta uno, no se guarda." },
              fields: [
                { name: "banco", label: "Banco", type: "text", validate: cuentaCompleta("el banco") },
                {
                  name: "tipo",
                  label: "Tipo de cuenta",
                  type: "select",
                  options: [
                    { label: "Ahorros", value: "Ahorros" },
                    { label: "Corriente", value: "Corriente" },
                  ],
                  // Mismo control que los otros tres datos; el tipo de `validate` de un select es otro, de ahí el cast.
                  validate: cuentaCompleta("el tipo de cuenta") as never,
                },
                { name: "numero", label: "Número de cuenta", type: "text", validate: validarNumeroCuenta },
                { name: "titular", label: "Titular", type: "text", validate: cuentaCompleta("el titular") },
              ],
            },
          ],
        },
        {
          label: "Prueba de SEO",
          description: "Revisa las páginas públicas: título, descripción, imagen al compartir, datos estructurados y más.",
          fields: [
            {
              name: "pruebaSeo",
              type: "ui",
              admin: { components: { Field: "/payload/componentes/prueba-seo#PruebaSeo" } },
            },
          ],
        },
      ],
    },
  ],
};
