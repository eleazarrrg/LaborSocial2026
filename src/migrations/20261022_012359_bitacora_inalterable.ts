import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * La bitácora es inalterable también dentro de la base, no solo en la aplicación: quien consiga la
 * credencial de la app no puede reescribir ni borrar el rastro de quién vio qué (RF-12).
 * Un disparador rechaza UPDATE, DELETE y TRUNCATE sobre `bitacora`.
 *
 * Para depurar la bitácora algún día (retención, docs/09), se hace con una migración nueva que
 * quite el disparador a propósito y lo ponga de vuelta: nunca a mano.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE FUNCTION bitacora_es_inalterable() RETURNS trigger
   LANGUAGE plpgsql AS $$
   BEGIN
     RAISE EXCEPTION 'La bitácora es de solo escritura: no se puede % una entrada.', lower(TG_OP)
       USING ERRCODE = 'insufficient_privilege';
   END $$;

   CREATE TRIGGER bitacora_sin_cambios
     BEFORE UPDATE OR DELETE ON bitacora
     FOR EACH ROW EXECUTE FUNCTION bitacora_es_inalterable();

   CREATE TRIGGER bitacora_sin_vaciar
     BEFORE TRUNCATE ON bitacora
     FOR EACH STATEMENT EXECUTE FUNCTION bitacora_es_inalterable();`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TRIGGER IF EXISTS bitacora_sin_vaciar ON bitacora;
   DROP TRIGGER IF EXISTS bitacora_sin_cambios ON bitacora;
   DROP FUNCTION IF EXISTS bitacora_es_inalterable();`)
}
