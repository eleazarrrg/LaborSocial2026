import { createClient } from "@supabase/supabase-js";
import { clavePublicable, urlSupabase } from "@/lib/supabase/entorno";

/**
 * Latido: una consulta mínima para que el proyecto Free de Supabase no se pause a los 7 días
 * sin actividad. Lo llama un trabajo programado una vez al día (docs/09: Vercel Cron o
 * Coolify; nunca GitHub Actions, que se apaga solo, CLAUDE.md §5.3).
 *
 * Usa la clave publicable y lee `convocatorias`, que es pública: no toca datos de personas.
 */
export async function GET() {
  const supabase = createClient(urlSupabase(), clavePublicable(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from("convocatorias").select("id").limit(1);
  if (error) {
    console.error(`[latido] ${error.code ?? "sin código"} ${error.message}`);
    return Response.json({ ok: false }, { status: 503 });
  }
  return Response.json({ ok: true });
}
