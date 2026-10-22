import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fondos_portada_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum_fondos_ayuda_dificil_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum_fondos_ayuda_cita_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum_fondos_ayuda_participar_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum_fondos_declaracion_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum__fondos_v_version_portada_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum__fondos_v_version_ayuda_dificil_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum__fondos_v_version_ayuda_cita_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum__fondos_v_version_ayuda_participar_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum__fondos_v_version_declaracion_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TABLE "fondos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"portada_imagen_id" integer,
  	"portada_tinte" "enum_fondos_portada_tinte" DEFAULT 'turquesa' NOT NULL,
  	"ayuda_dificil_imagen_id" integer,
  	"ayuda_dificil_tinte" "enum_fondos_ayuda_dificil_tinte" DEFAULT 'naranja' NOT NULL,
  	"ayuda_cita_imagen_id" integer,
  	"ayuda_cita_tinte" "enum_fondos_ayuda_cita_tinte" DEFAULT 'turquesa' NOT NULL,
  	"ayuda_participar_imagen_id" integer,
  	"ayuda_participar_tinte" "enum_fondos_ayuda_participar_tinte" DEFAULT 'marron' NOT NULL,
  	"declaracion_imagen_id" integer,
  	"declaracion_tinte" "enum_fondos_declaracion_tinte" DEFAULT 'turquesa' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_fondos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_portada_imagen_id" integer,
  	"version_portada_tinte" "enum__fondos_v_version_portada_tinte" DEFAULT 'turquesa' NOT NULL,
  	"version_ayuda_dificil_imagen_id" integer,
  	"version_ayuda_dificil_tinte" "enum__fondos_v_version_ayuda_dificil_tinte" DEFAULT 'naranja' NOT NULL,
  	"version_ayuda_cita_imagen_id" integer,
  	"version_ayuda_cita_tinte" "enum__fondos_v_version_ayuda_cita_tinte" DEFAULT 'turquesa' NOT NULL,
  	"version_ayuda_participar_imagen_id" integer,
  	"version_ayuda_participar_tinte" "enum__fondos_v_version_ayuda_participar_tinte" DEFAULT 'marron' NOT NULL,
  	"version_declaracion_imagen_id" integer,
  	"version_declaracion_tinte" "enum__fondos_v_version_declaracion_tinte" DEFAULT 'turquesa' NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "medios" ADD COLUMN "provisional" boolean DEFAULT false;
  ALTER TABLE "medios" ADD COLUMN "autor" varchar;
  ALTER TABLE "medios" ADD COLUMN "fuente" varchar;
  ALTER TABLE "medios" ADD COLUMN "licencia" varchar;
  ALTER TABLE "fondos" ADD CONSTRAINT "fondos_portada_imagen_id_medios_id_fk" FOREIGN KEY ("portada_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fondos" ADD CONSTRAINT "fondos_ayuda_dificil_imagen_id_medios_id_fk" FOREIGN KEY ("ayuda_dificil_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fondos" ADD CONSTRAINT "fondos_ayuda_cita_imagen_id_medios_id_fk" FOREIGN KEY ("ayuda_cita_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fondos" ADD CONSTRAINT "fondos_ayuda_participar_imagen_id_medios_id_fk" FOREIGN KEY ("ayuda_participar_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fondos" ADD CONSTRAINT "fondos_declaracion_imagen_id_medios_id_fk" FOREIGN KEY ("declaracion_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fondos_v" ADD CONSTRAINT "_fondos_v_version_portada_imagen_id_medios_id_fk" FOREIGN KEY ("version_portada_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fondos_v" ADD CONSTRAINT "_fondos_v_version_ayuda_dificil_imagen_id_medios_id_fk" FOREIGN KEY ("version_ayuda_dificil_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fondos_v" ADD CONSTRAINT "_fondos_v_version_ayuda_cita_imagen_id_medios_id_fk" FOREIGN KEY ("version_ayuda_cita_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fondos_v" ADD CONSTRAINT "_fondos_v_version_ayuda_participar_imagen_id_medios_id_fk" FOREIGN KEY ("version_ayuda_participar_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fondos_v" ADD CONSTRAINT "_fondos_v_version_declaracion_imagen_id_medios_id_fk" FOREIGN KEY ("version_declaracion_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "fondos_portada_portada_imagen_idx" ON "fondos" USING btree ("portada_imagen_id");
  CREATE INDEX "fondos_ayuda_dificil_ayuda_dificil_imagen_idx" ON "fondos" USING btree ("ayuda_dificil_imagen_id");
  CREATE INDEX "fondos_ayuda_cita_ayuda_cita_imagen_idx" ON "fondos" USING btree ("ayuda_cita_imagen_id");
  CREATE INDEX "fondos_ayuda_participar_ayuda_participar_imagen_idx" ON "fondos" USING btree ("ayuda_participar_imagen_id");
  CREATE INDEX "fondos_declaracion_declaracion_imagen_idx" ON "fondos" USING btree ("declaracion_imagen_id");
  CREATE INDEX "_fondos_v_version_portada_version_portada_imagen_idx" ON "_fondos_v" USING btree ("version_portada_imagen_id");
  CREATE INDEX "_fondos_v_version_ayuda_dificil_version_ayuda_dificil_im_idx" ON "_fondos_v" USING btree ("version_ayuda_dificil_imagen_id");
  CREATE INDEX "_fondos_v_version_ayuda_cita_version_ayuda_cita_imagen_idx" ON "_fondos_v" USING btree ("version_ayuda_cita_imagen_id");
  CREATE INDEX "_fondos_v_version_ayuda_participar_version_ayuda_partici_idx" ON "_fondos_v" USING btree ("version_ayuda_participar_imagen_id");
  CREATE INDEX "_fondos_v_version_declaracion_version_declaracion_imagen_idx" ON "_fondos_v" USING btree ("version_declaracion_imagen_id");
  CREATE INDEX "_fondos_v_created_at_idx" ON "_fondos_v" USING btree ("created_at");
  CREATE INDEX "_fondos_v_updated_at_idx" ON "_fondos_v" USING btree ("updated_at");`)

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
   DROP TABLE "fondos" CASCADE;
  DROP TABLE "_fondos_v" CASCADE;
  ALTER TABLE "medios" DROP COLUMN "provisional";
  ALTER TABLE "medios" DROP COLUMN "autor";
  ALTER TABLE "medios" DROP COLUMN "fuente";
  ALTER TABLE "medios" DROP COLUMN "licencia";
  DROP TYPE "public"."enum_fondos_portada_tinte";
  DROP TYPE "public"."enum_fondos_ayuda_dificil_tinte";
  DROP TYPE "public"."enum_fondos_ayuda_cita_tinte";
  DROP TYPE "public"."enum_fondos_ayuda_participar_tinte";
  DROP TYPE "public"."enum_fondos_declaracion_tinte";
  DROP TYPE "public"."enum__fondos_v_version_portada_tinte";
  DROP TYPE "public"."enum__fondos_v_version_ayuda_dificil_tinte";
  DROP TYPE "public"."enum__fondos_v_version_ayuda_cita_tinte";
  DROP TYPE "public"."enum__fondos_v_version_ayuda_participar_tinte";
  DROP TYPE "public"."enum__fondos_v_version_declaracion_tinte";`)
}
