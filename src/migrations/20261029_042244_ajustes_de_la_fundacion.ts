import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ajustes_cuenta_tipo" AS ENUM('Ahorros', 'Corriente');
  CREATE TYPE "public"."enum__ajustes_v_version_cuenta_tipo" AS ENUM('Ahorros', 'Corriente');
  ALTER TYPE "public"."enum_bitacora_accion" ADD VALUE 'cambiar_ajustes';
  CREATE TABLE "ajustes_otras_redes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "ajustes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp" varchar,
  	"correo" varchar,
  	"instagram" varchar,
  	"direccion" varchar,
  	"horario" varchar,
  	"yappy" varchar,
  	"cuenta_banco" varchar,
  	"cuenta_tipo" "enum_ajustes_cuenta_tipo",
  	"cuenta_numero" varchar,
  	"cuenta_titular" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_ajustes_v_version_otras_redes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ajustes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_whatsapp" varchar,
  	"version_correo" varchar,
  	"version_instagram" varchar,
  	"version_direccion" varchar,
  	"version_horario" varchar,
  	"version_yappy" varchar,
  	"version_cuenta_banco" varchar,
  	"version_cuenta_tipo" "enum__ajustes_v_version_cuenta_tipo",
  	"version_cuenta_numero" varchar,
  	"version_cuenta_titular" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "ajustes_otras_redes" ADD CONSTRAINT "ajustes_otras_redes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ajustes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ajustes_v_version_otras_redes" ADD CONSTRAINT "_ajustes_v_version_otras_redes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ajustes_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "ajustes_otras_redes_order_idx" ON "ajustes_otras_redes" USING btree ("_order");
  CREATE INDEX "ajustes_otras_redes_parent_id_idx" ON "ajustes_otras_redes" USING btree ("_parent_id");
  CREATE INDEX "_ajustes_v_version_otras_redes_order_idx" ON "_ajustes_v_version_otras_redes" USING btree ("_order");
  CREATE INDEX "_ajustes_v_version_otras_redes_parent_id_idx" ON "_ajustes_v_version_otras_redes" USING btree ("_parent_id");
  CREATE INDEX "_ajustes_v_created_at_idx" ON "_ajustes_v" USING btree ("created_at");
  CREATE INDEX "_ajustes_v_updated_at_idx" ON "_ajustes_v" USING btree ("updated_at");`)

  // Segunda línea de defensa (CLAUDE.md §5.2): RLS activo y sin políticas en toda tabla, también en
  // las nuevas. Toda migración que cree tablas repite este bloque.
  await db.execute(sql`
   DO $$
   DECLARE t text;
   BEGIN
     FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
       EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
     END LOOP;
   END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ajustes_otras_redes" CASCADE;
  DROP TABLE "ajustes" CASCADE;
  DROP TABLE "_ajustes_v_version_otras_redes" CASCADE;
  DROP TABLE "_ajustes_v" CASCADE;
  ALTER TABLE "bitacora" ALTER COLUMN "accion" SET DATA TYPE text;
  DROP TYPE "public"."enum_bitacora_accion";
  CREATE TYPE "public"."enum_bitacora_accion" AS ENUM('ver_solicitud', 'ver_lista', 'cambiar_estado', 'borrar_solicitud');
  ALTER TABLE "bitacora" ALTER COLUMN "accion" SET DATA TYPE "public"."enum_bitacora_accion" USING "accion"::"public"."enum_bitacora_accion";
  DROP TYPE "public"."enum_ajustes_cuenta_tipo";
  DROP TYPE "public"."enum__ajustes_v_version_cuenta_tipo";`)
}
