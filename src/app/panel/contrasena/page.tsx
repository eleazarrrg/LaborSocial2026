import { redirect } from "next/navigation";
import { exigirSesion } from "@/lib/panel";
import { FormContrasena } from "../formularios";

/**
 * Crear o cambiar la contraseña. Llega aquí quien abrió una invitación o un enlace de
 * recuperación (/panel/auth/confirmar). Si la cuenta ya tiene segundo factor, Supabase exige
 * verificarlo antes de cambiar la contraseña.
 */
export default async function Contrasena() {
  const { supabase, claims } = await exigirSesion();

  if (claims.aal !== "aal2") {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw new Error(`No se pudieron leer los factores: ${error.message}`);
    if (data.totp.some((f) => f.status === "verified")) {
      redirect("/panel/mfa?siguiente=/panel/contrasena");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-extrabold">Elige tu contraseña</h1>
      <p className="mt-3 text-tinta-suave">
        Después configurarás el código del teléfono, si todavía no lo tienes.
      </p>
      <div className="mt-8">
        <FormContrasena />
      </div>
    </div>
  );
}
