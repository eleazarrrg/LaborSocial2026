import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_noticias_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__noticias_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__noticias_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_eventos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__eventos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__eventos_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_proyectos_tipo" AS ENUM('proyecto', 'campana');
  CREATE TYPE "public"."enum__proyectos_v_version_tipo" AS ENUM('proyecto', 'campana');
  CREATE TABLE "noticias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"portada_id" integer,
  	"proyecto_id" integer,
  	"destacado" boolean DEFAULT false,
  	"publicado_en" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_noticias_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "noticias_locales" (
  	"titulo" varchar,
  	"resumen" varchar,
  	"cuerpo" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_noticias_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_portada_id" integer,
  	"version_proyecto_id" integer,
  	"version_destacado" boolean DEFAULT false,
  	"version_publicado_en" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__noticias_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__noticias_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_noticias_v_locales" (
  	"version_titulo" varchar,
  	"version_resumen" varchar,
  	"version_cuerpo" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "eventos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"portada_id" integer,
  	"proyecto_id" integer,
  	"destacado" boolean DEFAULT false,
  	"publicado_en" timestamp(3) with time zone,
  	"fecha_inicio" timestamp(3) with time zone,
  	"fecha_fin" timestamp(3) with time zone,
  	"inscripcion_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_eventos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "eventos_locales" (
  	"titulo" varchar,
  	"resumen" varchar,
  	"cuerpo" jsonb,
  	"lugar" varchar,
  	"direccion" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_eventos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_portada_id" integer,
  	"version_proyecto_id" integer,
  	"version_destacado" boolean DEFAULT false,
  	"version_publicado_en" timestamp(3) with time zone,
  	"version_fecha_inicio" timestamp(3) with time zone,
  	"version_fecha_fin" timestamp(3) with time zone,
  	"version_inscripcion_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__eventos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__eventos_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_eventos_v_locales" (
  	"version_titulo" varchar,
  	"version_resumen" varchar,
  	"version_cuerpo" jsonb,
  	"version_lugar" varchar,
  	"version_direccion" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "proyectos_requisitos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tipo" "enum_proyectos_tipo" DEFAULT 'proyecto' NOT NULL,
  	"codigo" varchar NOT NULL,
  	"cifra_valor" varchar,
  	"accion_href" varchar,
  	"logo_id" integer,
  	"logo_fondo" varchar,
  	"bloque_crisis" boolean DEFAULT false,
  	"orden" numeric DEFAULT 100,
  	"activo" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "proyectos_locales" (
  	"nombre" varchar NOT NULL,
  	"nombre_corto" varchar NOT NULL,
  	"resumen" varchar NOT NULL,
  	"historia" jsonb,
  	"en_honor_a" varchar,
  	"poblacion" varchar,
  	"cuando" varchar,
  	"cifra_pie" varchar,
  	"accion_etiqueta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_proyectos_v_version_requisitos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_proyectos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tipo" "enum__proyectos_v_version_tipo" DEFAULT 'proyecto' NOT NULL,
  	"version_codigo" varchar NOT NULL,
  	"version_cifra_valor" varchar,
  	"version_accion_href" varchar,
  	"version_logo_id" integer,
  	"version_logo_fondo" varchar,
  	"version_bloque_crisis" boolean DEFAULT false,
  	"version_orden" numeric DEFAULT 100,
  	"version_activo" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_proyectos_v_locales" (
  	"version_nombre" varchar NOT NULL,
  	"version_nombre_corto" varchar NOT NULL,
  	"version_resumen" varchar NOT NULL,
  	"version_historia" jsonb,
  	"version_en_honor_a" varchar,
  	"version_poblacion" varchar,
  	"version_cuando" varchar,
  	"version_cifra_pie" varchar,
  	"version_accion_etiqueta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "medios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"requiere_consentimiento" boolean DEFAULT false,
  	"consentimiento_registrado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_miniatura_url" varchar,
  	"sizes_miniatura_width" numeric,
  	"sizes_miniatura_height" numeric,
  	"sizes_miniatura_mime_type" varchar,
  	"sizes_miniatura_filesize" numeric,
  	"sizes_miniatura_filename" varchar,
  	"sizes_portada_url" varchar,
  	"sizes_portada_width" numeric,
  	"sizes_portada_height" numeric,
  	"sizes_portada_mime_type" varchar,
  	"sizes_portada_filesize" numeric,
  	"sizes_portada_filename" varchar
  );
  
  CREATE TABLE "medios_locales" (
  	"alt" varchar NOT NULL,
  	"pie" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "noticias_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "eventos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "proyectos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "medios_id" integer;
  ALTER TABLE "noticias" ADD CONSTRAINT "noticias_portada_id_medios_id_fk" FOREIGN KEY ("portada_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "noticias" ADD CONSTRAINT "noticias_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "noticias_locales" ADD CONSTRAINT "noticias_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_parent_id_noticias_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."noticias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_portada_id_medios_id_fk" FOREIGN KEY ("version_portada_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_proyecto_id_proyectos_id_fk" FOREIGN KEY ("version_proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v_locales" ADD CONSTRAINT "_noticias_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_noticias_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "eventos" ADD CONSTRAINT "eventos_portada_id_medios_id_fk" FOREIGN KEY ("portada_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "eventos" ADD CONSTRAINT "eventos_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "eventos_locales" ADD CONSTRAINT "eventos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_parent_id_eventos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_version_portada_id_medios_id_fk" FOREIGN KEY ("version_portada_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_version_proyecto_id_proyectos_id_fk" FOREIGN KEY ("version_proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventos_v_locales" ADD CONSTRAINT "_eventos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_eventos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_requisitos" ADD CONSTRAINT "proyectos_requisitos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_logo_id_medios_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos_locales" ADD CONSTRAINT "proyectos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_requisitos" ADD CONSTRAINT "_proyectos_v_version_requisitos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_parent_id_proyectos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_version_logo_id_medios_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v_locales" ADD CONSTRAINT "_proyectos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medios_locales" ADD CONSTRAINT "medios_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."medios"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "noticias_slug_idx" ON "noticias" USING btree ("slug");
  CREATE INDEX "noticias_portada_idx" ON "noticias" USING btree ("portada_id");
  CREATE INDEX "noticias_proyecto_idx" ON "noticias" USING btree ("proyecto_id");
  CREATE INDEX "noticias_updated_at_idx" ON "noticias" USING btree ("updated_at");
  CREATE INDEX "noticias_created_at_idx" ON "noticias" USING btree ("created_at");
  CREATE INDEX "noticias_deleted_at_idx" ON "noticias" USING btree ("deleted_at");
  CREATE INDEX "noticias__status_idx" ON "noticias" USING btree ("_status");
  CREATE UNIQUE INDEX "noticias_locales_locale_parent_id_unique" ON "noticias_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_noticias_v_parent_idx" ON "_noticias_v" USING btree ("parent_id");
  CREATE INDEX "_noticias_v_version_version_slug_idx" ON "_noticias_v" USING btree ("version_slug");
  CREATE INDEX "_noticias_v_version_version_portada_idx" ON "_noticias_v" USING btree ("version_portada_id");
  CREATE INDEX "_noticias_v_version_version_proyecto_idx" ON "_noticias_v" USING btree ("version_proyecto_id");
  CREATE INDEX "_noticias_v_version_version_updated_at_idx" ON "_noticias_v" USING btree ("version_updated_at");
  CREATE INDEX "_noticias_v_version_version_created_at_idx" ON "_noticias_v" USING btree ("version_created_at");
  CREATE INDEX "_noticias_v_version_version_deleted_at_idx" ON "_noticias_v" USING btree ("version_deleted_at");
  CREATE INDEX "_noticias_v_version_version__status_idx" ON "_noticias_v" USING btree ("version__status");
  CREATE INDEX "_noticias_v_created_at_idx" ON "_noticias_v" USING btree ("created_at");
  CREATE INDEX "_noticias_v_updated_at_idx" ON "_noticias_v" USING btree ("updated_at");
  CREATE INDEX "_noticias_v_snapshot_idx" ON "_noticias_v" USING btree ("snapshot");
  CREATE INDEX "_noticias_v_published_locale_idx" ON "_noticias_v" USING btree ("published_locale");
  CREATE INDEX "_noticias_v_latest_idx" ON "_noticias_v" USING btree ("latest");
  CREATE INDEX "_noticias_v_autosave_idx" ON "_noticias_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_noticias_v_locales_locale_parent_id_unique" ON "_noticias_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "eventos_slug_idx" ON "eventos" USING btree ("slug");
  CREATE INDEX "eventos_portada_idx" ON "eventos" USING btree ("portada_id");
  CREATE INDEX "eventos_proyecto_idx" ON "eventos" USING btree ("proyecto_id");
  CREATE INDEX "eventos_updated_at_idx" ON "eventos" USING btree ("updated_at");
  CREATE INDEX "eventos_created_at_idx" ON "eventos" USING btree ("created_at");
  CREATE INDEX "eventos_deleted_at_idx" ON "eventos" USING btree ("deleted_at");
  CREATE INDEX "eventos__status_idx" ON "eventos" USING btree ("_status");
  CREATE UNIQUE INDEX "eventos_locales_locale_parent_id_unique" ON "eventos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_eventos_v_parent_idx" ON "_eventos_v" USING btree ("parent_id");
  CREATE INDEX "_eventos_v_version_version_slug_idx" ON "_eventos_v" USING btree ("version_slug");
  CREATE INDEX "_eventos_v_version_version_portada_idx" ON "_eventos_v" USING btree ("version_portada_id");
  CREATE INDEX "_eventos_v_version_version_proyecto_idx" ON "_eventos_v" USING btree ("version_proyecto_id");
  CREATE INDEX "_eventos_v_version_version_updated_at_idx" ON "_eventos_v" USING btree ("version_updated_at");
  CREATE INDEX "_eventos_v_version_version_created_at_idx" ON "_eventos_v" USING btree ("version_created_at");
  CREATE INDEX "_eventos_v_version_version_deleted_at_idx" ON "_eventos_v" USING btree ("version_deleted_at");
  CREATE INDEX "_eventos_v_version_version__status_idx" ON "_eventos_v" USING btree ("version__status");
  CREATE INDEX "_eventos_v_created_at_idx" ON "_eventos_v" USING btree ("created_at");
  CREATE INDEX "_eventos_v_updated_at_idx" ON "_eventos_v" USING btree ("updated_at");
  CREATE INDEX "_eventos_v_snapshot_idx" ON "_eventos_v" USING btree ("snapshot");
  CREATE INDEX "_eventos_v_published_locale_idx" ON "_eventos_v" USING btree ("published_locale");
  CREATE INDEX "_eventos_v_latest_idx" ON "_eventos_v" USING btree ("latest");
  CREATE INDEX "_eventos_v_autosave_idx" ON "_eventos_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_eventos_v_locales_locale_parent_id_unique" ON "_eventos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_requisitos_order_idx" ON "proyectos_requisitos" USING btree ("_order");
  CREATE INDEX "proyectos_requisitos_parent_id_idx" ON "proyectos_requisitos" USING btree ("_parent_id");
  CREATE INDEX "proyectos_requisitos_locale_idx" ON "proyectos_requisitos" USING btree ("_locale");
  CREATE UNIQUE INDEX "proyectos_codigo_idx" ON "proyectos" USING btree ("codigo");
  CREATE INDEX "proyectos_logo_idx" ON "proyectos" USING btree ("logo_id");
  CREATE INDEX "proyectos_updated_at_idx" ON "proyectos" USING btree ("updated_at");
  CREATE INDEX "proyectos_created_at_idx" ON "proyectos" USING btree ("created_at");
  CREATE UNIQUE INDEX "proyectos_locales_locale_parent_id_unique" ON "proyectos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_proyectos_v_version_requisitos_order_idx" ON "_proyectos_v_version_requisitos" USING btree ("_order");
  CREATE INDEX "_proyectos_v_version_requisitos_parent_id_idx" ON "_proyectos_v_version_requisitos" USING btree ("_parent_id");
  CREATE INDEX "_proyectos_v_version_requisitos_locale_idx" ON "_proyectos_v_version_requisitos" USING btree ("_locale");
  CREATE INDEX "_proyectos_v_parent_idx" ON "_proyectos_v" USING btree ("parent_id");
  CREATE INDEX "_proyectos_v_version_version_codigo_idx" ON "_proyectos_v" USING btree ("version_codigo");
  CREATE INDEX "_proyectos_v_version_version_logo_idx" ON "_proyectos_v" USING btree ("version_logo_id");
  CREATE INDEX "_proyectos_v_version_version_updated_at_idx" ON "_proyectos_v" USING btree ("version_updated_at");
  CREATE INDEX "_proyectos_v_version_version_created_at_idx" ON "_proyectos_v" USING btree ("version_created_at");
  CREATE INDEX "_proyectos_v_created_at_idx" ON "_proyectos_v" USING btree ("created_at");
  CREATE INDEX "_proyectos_v_updated_at_idx" ON "_proyectos_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_proyectos_v_locales_locale_parent_id_unique" ON "_proyectos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "medios_updated_at_idx" ON "medios" USING btree ("updated_at");
  CREATE INDEX "medios_created_at_idx" ON "medios" USING btree ("created_at");
  CREATE UNIQUE INDEX "medios_filename_idx" ON "medios" USING btree ("filename");
  CREATE INDEX "medios_sizes_miniatura_sizes_miniatura_filename_idx" ON "medios" USING btree ("sizes_miniatura_filename");
  CREATE INDEX "medios_sizes_portada_sizes_portada_filename_idx" ON "medios" USING btree ("sizes_portada_filename");
  CREATE UNIQUE INDEX "medios_locales_locale_parent_id_unique" ON "medios_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_noticias_fk" FOREIGN KEY ("noticias_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_eventos_fk" FOREIGN KEY ("eventos_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proyectos_fk" FOREIGN KEY ("proyectos_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_medios_fk" FOREIGN KEY ("medios_id") REFERENCES "public"."medios"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_noticias_id_idx" ON "payload_locked_documents_rels" USING btree ("noticias_id");
  CREATE INDEX "payload_locked_documents_rels_eventos_id_idx" ON "payload_locked_documents_rels" USING btree ("eventos_id");
  CREATE INDEX "payload_locked_documents_rels_proyectos_id_idx" ON "payload_locked_documents_rels" USING btree ("proyectos_id");
  CREATE INDEX "payload_locked_documents_rels_medios_id_idx" ON "payload_locked_documents_rels" USING btree ("medios_id");`)

  // Segunda línea de defensa (CLAUDE.md §5.2): RLS activo y sin políticas en toda tabla, también en
  // las nuevas. La aplicación es dueña de las tablas y no se ve afectada; cualquier otro rol de base
  // que se cree en el futuro no ve nada. Toda migración que cree tablas repite este bloque.
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
   ALTER TABLE "noticias" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "noticias_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_noticias_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_noticias_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "eventos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "eventos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_eventos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_eventos_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_requisitos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_version_requisitos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "medios" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "medios_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "noticias" CASCADE;
  DROP TABLE "noticias_locales" CASCADE;
  DROP TABLE "_noticias_v" CASCADE;
  DROP TABLE "_noticias_v_locales" CASCADE;
  DROP TABLE "eventos" CASCADE;
  DROP TABLE "eventos_locales" CASCADE;
  DROP TABLE "_eventos_v" CASCADE;
  DROP TABLE "_eventos_v_locales" CASCADE;
  DROP TABLE "proyectos_requisitos" CASCADE;
  DROP TABLE "proyectos" CASCADE;
  DROP TABLE "proyectos_locales" CASCADE;
  DROP TABLE "_proyectos_v_version_requisitos" CASCADE;
  DROP TABLE "_proyectos_v" CASCADE;
  DROP TABLE "_proyectos_v_locales" CASCADE;
  DROP TABLE "medios" CASCADE;
  DROP TABLE "medios_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_noticias_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_eventos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_proyectos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_medios_fk";
  
  DROP INDEX "payload_locked_documents_rels_noticias_id_idx";
  DROP INDEX "payload_locked_documents_rels_eventos_id_idx";
  DROP INDEX "payload_locked_documents_rels_proyectos_id_idx";
  DROP INDEX "payload_locked_documents_rels_medios_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "noticias_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "eventos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "proyectos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "medios_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_noticias_status";
  DROP TYPE "public"."enum__noticias_v_version_status";
  DROP TYPE "public"."enum__noticias_v_published_locale";
  DROP TYPE "public"."enum_eventos_status";
  DROP TYPE "public"."enum__eventos_v_version_status";
  DROP TYPE "public"."enum__eventos_v_published_locale";
  DROP TYPE "public"."enum_proyectos_tipo";
  DROP TYPE "public"."enum__proyectos_v_version_tipo";`)
}
