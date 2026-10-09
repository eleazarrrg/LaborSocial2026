/**
 * Cómo se escribe un error en el registro sin filtrar datos personales.
 *
 * Los errores de la base (DrizzleQueryError) arman su mensaje con la consulta Y SUS PARÁMETROS: el
 * nombre, el correo y el teléfono de quien pidió ayuda. Por eso nunca se registra `message` de un
 * error ajeno: solo su tipo y el código de Postgres. Los errores propios con mensaje seguro se
 * lanzan como `ErrorSeguro`, y de esos sí se registra el mensaje.
 */
export class ErrorSeguro extends Error {
  override name = "ErrorSeguro";
}

export function describirError(error: unknown): string {
  if (error instanceof ErrorSeguro) return error.message;
  if (!(error instanceof Error)) return "error desconocido";
  const causa = error.cause as { code?: unknown } | undefined;
  const codigo = causa?.code ?? (error as { code?: unknown }).code;
  return `${error.name}${typeof codigo === "string" ? ` (código ${codigo})` : ""}`;
}
