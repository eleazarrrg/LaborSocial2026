import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_preguntas_tema" AS ENUM('general', 'cita', 'donar', 'voluntariado', 'padrinos', 'alianzas');
  CREATE TABLE "preguntas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pregunta" varchar NOT NULL,
  	"respuesta" varchar NOT NULL,
  	"tema" "enum_preguntas_tema" DEFAULT 'general' NOT NULL,
  	"orden" numeric DEFAULT 100 NOT NULL,
  	"activo" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "preguntas_id" integer;
  CREATE INDEX "preguntas_updated_at_idx" ON "preguntas" USING btree ("updated_at");
  CREATE INDEX "preguntas_created_at_idx" ON "preguntas" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_preguntas_fk" FOREIGN KEY ("preguntas_id") REFERENCES "public"."preguntas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_preguntas_id_idx" ON "payload_locked_documents_rels" USING btree ("preguntas_id");`)

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
   ALTER TABLE "preguntas" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "preguntas" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_preguntas_fk";
  
  DROP INDEX "payload_locked_documents_rels_preguntas_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "preguntas_id";
  DROP TYPE "public"."enum_preguntas_tema";`)
}
