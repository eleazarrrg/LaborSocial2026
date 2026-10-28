import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Aviso del linter de Supabase (function_search_path_mutable): la función de la bitácora no fija su
 * search_path. Solo usa lower() y RAISE, que viven en pg_catalog (Postgres siempre lo consulta), así
 * que vaciar el search_path es seguro y cierra el aviso.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER FUNCTION public.bitacora_es_inalterable() SET search_path = '';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER FUNCTION public.bitacora_es_inalterable() RESET search_path;`)
}
