/**
 * Variables de entorno de Supabase, leídas al USARSE y no al importarse.
 *
 * El build no las necesita (las páginas públicas son estáticas) y en local puede no haber
 * `.env.local` todavía. Si faltan cuando una petición las necesita, se falla con un mensaje
 * claro: nunca en silencio (CLAUDE.md §6).
 *
 * La clave SECRET no está aquí a propósito: vive solo en `servicio.ts`, que importa
 * `server-only`, para que ningún componente de cliente pueda arrastrarla por error.
 */

function exigir(nombre: string, valor: string | undefined): string {
  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre}. Ver .env.example.`);
  }
  return valor;
}

export const urlSupabase = () =>
  exigir("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const clavePublicable = () =>
  exigir(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
