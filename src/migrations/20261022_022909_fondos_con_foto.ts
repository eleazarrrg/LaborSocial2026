import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_proyectos_fondo_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  CREATE TYPE "public"."enum__proyectos_v_version_fondo_tinte" AS ENUM('turquesa', 'naranja', 'marron', 'noche');
  ALTER TABLE "proyectos" ADD COLUMN "fondo_imagen_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN "fondo_tinte" "enum_proyectos_fondo_tinte" DEFAULT 'turquesa' NOT NULL;
  ALTER TABLE "_proyectos_v" ADD COLUMN "version_fondo_imagen_id" integer;
  ALTER TABLE "_proyectos_v" ADD COLUMN "version_fondo_tinte" "enum__proyectos_v_version_fondo_tinte" DEFAULT 'turquesa' NOT NULL;
  ALTER TABLE "medios" ADD COLUMN "sizes_panoramica_url" varchar;
  ALTER TABLE "medios" ADD COLUMN "sizes_panoramica_width" numeric;
  ALTER TABLE "medios" ADD COLUMN "sizes_panoramica_height" numeric;
  ALTER TABLE "medios" ADD COLUMN "sizes_panoramica_mime_type" varchar;
  ALTER TABLE "medios" ADD COLUMN "sizes_panoramica_filesize" numeric;
  ALTER TABLE "medios" ADD COLUMN "sizes_panoramica_filename" varchar;
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_fondo_imagen_id_medios_id_fk" FOREIGN KEY ("fondo_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_version_fondo_imagen_id_medios_id_fk" FOREIGN KEY ("version_fondo_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "proyectos_fondo_fondo_imagen_idx" ON "proyectos" USING btree ("fondo_imagen_id");
  CREATE INDEX "_proyectos_v_version_fondo_version_fondo_imagen_idx" ON "_proyectos_v" USING btree ("version_fondo_imagen_id");
  CREATE INDEX "medios_sizes_panoramica_sizes_panoramica_filename_idx" ON "medios" USING btree ("sizes_panoramica_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proyectos" DROP CONSTRAINT "proyectos_fondo_imagen_id_medios_id_fk";
  
  ALTER TABLE "_proyectos_v" DROP CONSTRAINT "_proyectos_v_version_fondo_imagen_id_medios_id_fk";
  
  DROP INDEX "proyectos_fondo_fondo_imagen_idx";
  DROP INDEX "_proyectos_v_version_fondo_version_fondo_imagen_idx";
  DROP INDEX "medios_sizes_panoramica_sizes_panoramica_filename_idx";
  ALTER TABLE "proyectos" DROP COLUMN "fondo_imagen_id";
  ALTER TABLE "proyectos" DROP COLUMN "fondo_tinte";
  ALTER TABLE "_proyectos_v" DROP COLUMN "version_fondo_imagen_id";
  ALTER TABLE "_proyectos_v" DROP COLUMN "version_fondo_tinte";
  ALTER TABLE "medios" DROP COLUMN "sizes_panoramica_url";
  ALTER TABLE "medios" DROP COLUMN "sizes_panoramica_width";
  ALTER TABLE "medios" DROP COLUMN "sizes_panoramica_height";
  ALTER TABLE "medios" DROP COLUMN "sizes_panoramica_mime_type";
  ALTER TABLE "medios" DROP COLUMN "sizes_panoramica_filesize";
  ALTER TABLE "medios" DROP COLUMN "sizes_panoramica_filename";
  DROP TYPE "public"."enum_proyectos_fondo_tinte";
  DROP TYPE "public"."enum__proyectos_v_version_fondo_tinte";`)
}
