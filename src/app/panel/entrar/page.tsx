import { Nota } from "@/components/ui";
import { FormEntrar, FormOlvide } from "../formularios";

const AVISOS: Record<string, string> = {
  "sin-acceso":
    "Tu cuenta existe, pero todavía no tiene acceso a la bandeja. Pídele a la administración de la fundación que la active.",
  "enlace-vencido": "Ese enlace ya no sirve: venció o ya se usó. Pide uno nuevo aquí abajo.",
};

export default async function Entrar({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { aviso } = await searchParams;
  const textoAviso = aviso ? AVISOS[aviso] : undefined;

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-extrabold">Entrar al panel</h1>
      <p className="mt-3 text-tinta-suave">Solo para la administración de la fundación.</p>

      {textoAviso && (
        <div className="mt-6">
          <Nota tono="atencion">{textoAviso}</Nota>
        </div>
      )}

      <div className="mt-8">
        <FormEntrar />
      </div>

      <details className="mt-10 border-t border-borde pt-6">
        <summary className="cursor-pointer font-semibold">Olvidé mi contraseña</summary>
        <div className="mt-5">
          <FormOlvide />
        </div>
      </details>
    </div>
  );
}
