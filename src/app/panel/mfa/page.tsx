import { redirect } from "next/navigation";
import { exigirSesion } from "@/lib/panel";
import { Enrolar, VerificarCodigo } from "../formularios";

/**
 * Segundo factor (RF-04). Sin él, la base no entrega ninguna solicitud: privado.es_admin()
 * exige `aal2` en el token.
 */
export default async function SegundoFactor({
  searchParams,
}: {
  searchParams: Promise<{ siguiente?: string }>;
}) {
  const { siguiente: pedido } = await searchParams;
  const siguiente = pedido === "/panel/contrasena" ? pedido : "/panel";

  const { supabase, claims } = await exigirSesion();
  if (claims.aal === "aal2") redirect(siguiente);

  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw new Error(`No se pudieron leer los factores: ${error.message}`);
  const factor = data.totp.find((f) => f.status === "verified");

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-extrabold">
        {factor ? "Escribe tu código" : "Configura tu segundo factor"}
      </h1>
      <p className="mt-3 text-tinta-suave">
        {factor
          ? "Ábrelo en la aplicación de códigos de tu teléfono."
          : "La bandeja guarda solicitudes de ayuda psicológica. Por eso, además de la contraseña, se entra con un código que cambia cada 30 segundos en tu teléfono. Se configura una sola vez."}
      </p>
      <div className="mt-8">
        {factor ? (
          <VerificarCodigo factorId={factor.id} siguiente={siguiente} />
        ) : (
          <Enrolar siguiente={siguiente} />
        )}
      </div>
    </div>
  );
}
