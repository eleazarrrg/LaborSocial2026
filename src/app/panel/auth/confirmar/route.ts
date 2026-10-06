import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Destino de los enlaces de invitación y de recuperación de contraseña. Las plantillas de
 * correo de Supabase apuntan aquí con `token_hash` (docs/09): así el canje ocurre en el
 * servidor y la sesión queda en cookies, sin pasar tokens por el fragmento de la URL.
 */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const tipo = request.nextUrl.searchParams.get("type");

  if (tokenHash && (tipo === "invite" || tipo === "recovery")) {
    const supabase = await clienteServidor();
    const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
    if (!error) redirect("/panel/contrasena");
    console.error(`[panel] confirmar ${tipo}: ${error.code ?? "sin código"} ${error.message}`);
  }

  redirect("/panel/entrar?aviso=enlace-vencido");
}
