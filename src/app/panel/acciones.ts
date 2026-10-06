"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { BANDEJAS, ESTADOS, esTipoBandeja, exigirAdmin, exigirSesion } from "@/lib/panel";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Acciones del panel. Cada una se defiende sola: una Server Action es un endpoint público
 * y se puede llamar sin pasar por la página que la muestra.
 */

export type EstadoPanel = {
  mensaje?: string;
  /** Enrolamiento del segundo factor en curso: el QR se queda en pantalla si el código falla. */
  factorId?: string;
  qr?: string;
  secreto?: string;
};

/** Solo destinos conocidos: un `siguiente` libre sería una redirección abierta. */
const DESTINOS = ["/panel", "/panel/contrasena"] as const;
const destino = (v: FormDataEntryValue | null) =>
  DESTINOS.find((d) => d === v) ?? "/panel";

function registrar(donde: string, error: { code?: string; message: string }) {
  console.error(`[panel] ${donde}: ${error.code ?? "sin código"} ${error.message}`);
}

/* ------------------------------------------------------------------ Entrar */

const credenciales = z.object({
  correo: z.string().trim().toLowerCase().email(),
  contrasena: z.string().min(1),
});

export async function accionEntrar(
  _previo: EstadoPanel,
  formData: FormData,
): Promise<EstadoPanel> {
  const datos = credenciales.safeParse({
    correo: formData.get("correo"),
    contrasena: formData.get("contrasena"),
  });
  if (!datos.success) return { mensaje: "Escribe tu correo y tu contraseña." };

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: datos.data.correo,
    password: datos.data.contrasena,
  });
  if (error) {
    // Mismo mensaje si el correo no existe o la contraseña está mal: no se revela cuál.
    if (error.status && error.status < 500) return { mensaje: "Correo o contraseña incorrectos." };
    registrar("entrar", error);
    return { mensaje: "No pudimos conectar con el sistema. Inténtalo en unos minutos." };
  }
  redirect("/panel/mfa");
}

export async function accionOlvide(
  _previo: EstadoPanel,
  formData: FormData,
): Promise<EstadoPanel> {
  const correo = z.string().trim().toLowerCase().email().safeParse(formData.get("correo"));
  if (!correo.success) return { mensaje: "Escribe el correo de tu cuenta." };

  const supabase = await clienteServidor();
  // El enlace del correo apunta a /panel/auth/confirmar (plantilla «Reset password», docs/09).
  const { error } = await supabase.auth.resetPasswordForEmail(correo.data);
  if (error && (!error.status || error.status >= 429)) {
    registrar("olvidé", error);
    return { mensaje: "No pudimos enviar el correo. Inténtalo en unos minutos." };
  }
  return {
    mensaje: "Si ese correo tiene cuenta en el panel, te llegó un enlace para crear una contraseña nueva.",
  };
}

/* ---------------------------------------------------- Segundo factor (TOTP) */

export async function accionEnrolar(): Promise<EstadoPanel> {
  const { supabase } = await exigirSesion();

  // Un intento anterior a medias deja un factor sin verificar que bloquea el nombre.
  const { data: factores, error: errorLista } = await supabase.auth.mfa.listFactors();
  if (errorLista) {
    registrar("listar factores", errorLista);
    return { mensaje: "No pudimos preparar el código. Recarga la página." };
  }
  for (const f of factores.all.filter((f) => f.status === "unverified")) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: f.id });
    if (error) {
      registrar("quitar factor sin verificar", error);
      return { mensaje: "No pudimos preparar el código. Recarga la página." };
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Panel REFUVA",
  });
  if (error) {
    registrar("enrolar", error);
    return { mensaje: "No pudimos preparar el código. Recarga la página." };
  }
  return { factorId: data.id, qr: data.totp.qr_code, secreto: data.totp.secret };
}

export async function accionVerificar(
  previo: EstadoPanel,
  formData: FormData,
): Promise<EstadoPanel> {
  const { supabase } = await exigirSesion();

  const factorId = z.uuid().safeParse(formData.get("factorId"));
  const codigo = z
    .string()
    .trim()
    .regex(/^\d{6}$/)
    .safeParse(formData.get("codigo"));
  if (!factorId.success) return { ...previo, mensaje: "Recarga la página e inténtalo otra vez." };
  if (!codigo.success) return { ...previo, mensaje: "El código tiene seis números." };

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: factorId.data,
    code: codigo.data,
  });
  if (error) {
    if (error.status && error.status < 500) {
      return { ...previo, mensaje: "Ese código no es válido o ya venció. Usa el que aparece ahora." };
    }
    registrar("verificar", error);
    return { ...previo, mensaje: "No pudimos verificar el código. Inténtalo en unos minutos." };
  }
  redirect(destino(formData.get("siguiente")));
}

/* -------------------------------------------------------------- Contraseña */

// Lo mismo que exige supabase/config.toml: 12 caracteres, minúscula, mayúscula y número.
const contrasenaNueva = z
  .object({
    contrasena: z
      .string()
      .min(12, "Al menos 12 caracteres.")
      .regex(/[a-z]/, "Incluye una minúscula.")
      .regex(/[A-Z]/, "Incluye una mayúscula.")
      .regex(/\d/, "Incluye un número."),
    repetir: z.string(),
  })
  .refine((d) => d.contrasena === d.repetir, { message: "Las dos contraseñas no coinciden." });

export async function accionContrasena(
  _previo: EstadoPanel,
  formData: FormData,
): Promise<EstadoPanel> {
  const { supabase } = await exigirSesion();

  const datos = contrasenaNueva.safeParse({
    contrasena: formData.get("contrasena"),
    repetir: formData.get("repetir"),
  });
  if (!datos.success) return { mensaje: datos.error.issues[0].message };

  const { error } = await supabase.auth.updateUser({ password: datos.data.contrasena });
  if (error) {
    if (error.code === "same_password") return { mensaje: "Esa es la contraseña que ya tenías." };
    if (error.code === "weak_password") return { mensaje: "Esa contraseña es demasiado débil." };
    if (error.code === "reauthentication_needed") {
      return { mensaje: "El enlace ya es viejo. Pide uno nuevo desde «Entrar»." };
    }
    registrar("contraseña", error);
    return { mensaje: "No pudimos guardar la contraseña. Inténtalo en unos minutos." };
  }
  redirect("/panel/mfa");
}

/* ---------------------------------------------------------- Cambiar estado */

const cambio = z.object({
  tipo: z.string().refine(esTipoBandeja),
  id: z.uuid(),
  estado: z.enum(ESTADOS.map((e) => e.valor) as [string, ...string[]]),
});

export async function accionCambiarEstado(formData: FormData): Promise<void> {
  const { supabase } = await exigirAdmin();

  const datos = cambio.safeParse({
    tipo: formData.get("tipo"),
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!datos.success) redirect("/panel");
  const { tipo, id, estado } = datos.data;
  const ruta = `/panel/solicitudes/${tipo}/${id}`;

  // Con `.select()`: si la RLS no deja cambiar la fila, el UPDATE no falla, solo no toca
  // nada. Una lista vacía es un error, no un éxito.
  const { data, error } = await supabase
    .from(BANDEJAS[tipo as keyof typeof BANDEJAS].tabla)
    .update({ estado })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) {
    if (error) registrar("cambiar estado", error);
    redirect(`${ruta}?aviso=no-guardado`);
  }
  redirect(`${ruta}?aviso=guardado`);
}

/* ------------------------------------------------------------------- Salir */

export async function accionSalir(): Promise<void> {
  const supabase = await clienteServidor();
  // Aunque el servidor de Auth no responda, las cookies de este navegador se borran igual.
  const { error } = await supabase.auth.signOut();
  if (error) registrar("salir", error);
  redirect("/panel/entrar");
}
