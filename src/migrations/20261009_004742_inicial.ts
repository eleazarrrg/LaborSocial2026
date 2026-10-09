import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_solicitudes_cita_contacto_preferido" AS ENUM('whatsapp', 'telefono', 'correo');
  CREATE TYPE "public"."enum_solicitudes_cita_modalidad" AS ENUM('cualquiera', 'virtual', 'presencial');
  CREATE TYPE "public"."enum_solicitudes_cita_estado" AS ENUM('pendiente', 'en_gestion', 'atendida', 'cerrada_sin_atender');
  CREATE TYPE "public"."enum_inscripciones_voluntariado_areas_interes" AS ENUM('redes-sociales', 'diseno', 'logistica', 'psicologia', 'escritura', 'transporte', 'cocina', 'otra');
  CREATE TYPE "public"."enum_inscripciones_voluntariado_estado" AS ENUM('pendiente', 'en_gestion', 'atendida', 'cerrada_sin_atender');
  CREATE TYPE "public"."enum_inscripciones_padrinos_forma_entrega" AS ENUM('llevo', 'coordinar', 'asisto');
  CREATE TYPE "public"."enum_inscripciones_padrinos_estado" AS ENUM('pendiente', 'en_gestion', 'atendida', 'cerrada_sin_atender');
  CREATE TYPE "public"."enum_mensajes_contacto_estado" AS ENUM('pendiente', 'en_gestion', 'atendida', 'cerrada_sin_atender');
  CREATE TYPE "public"."enum_cuarentena_formulario" AS ENUM('solicitudes-cita', 'inscripciones-voluntariado', 'inscripciones-padrinos', 'mensajes-contacto');
  CREATE TYPE "public"."enum_cuarentena_motivo" AS ENUM('campo_trampa');
  CREATE TYPE "public"."enum_cuarentena_veredicto" AS ENUM('robot', 'persona');
  CREATE TYPE "public"."enum_convocatorias_tipo" AS ENUM('padrinos');
  CREATE TYPE "public"."enum_usuarios_rol" AS ENUM('administrador', 'editor');
  CREATE TYPE "public"."enum_bitacora_accion" AS ENUM('ver_solicitud', 'ver_lista', 'cambiar_estado', 'borrar_solicitud');
  CREATE TABLE "solicitudes_cita_notas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL,
  	"autor_id" integer,
  	"fecha" timestamp(3) with time zone
  );
  
  CREATE TABLE "solicitudes_cita" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"correo" varchar,
  	"telefono" varchar,
  	"contacto_preferido" "enum_solicitudes_cita_contacto_preferido" NOT NULL,
  	"motivo" varchar,
  	"modalidad" "enum_solicitudes_cita_modalidad" NOT NULL,
  	"disponibilidad" varchar,
  	"atencion_pronto" boolean,
  	"consentimiento_en" timestamp(3) with time zone NOT NULL,
  	"politica_version" varchar NOT NULL,
  	"estado" "enum_solicitudes_cita_estado" DEFAULT 'pendiente' NOT NULL,
  	"atendida_por_id" integer,
  	"atendida_en" timestamp(3) with time zone,
  	"aviso_enviado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inscripciones_voluntariado_areas_interes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_inscripciones_voluntariado_areas_interes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "inscripciones_voluntariado_notas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL,
  	"autor_id" integer,
  	"fecha" timestamp(3) with time zone
  );
  
  CREATE TABLE "inscripciones_voluntariado" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"correo" varchar NOT NULL,
  	"telefono" varchar,
  	"otra_area" varchar,
  	"disponibilidad" varchar,
  	"experiencia" varchar,
  	"consentimiento_en" timestamp(3) with time zone NOT NULL,
  	"politica_version" varchar NOT NULL,
  	"estado" "enum_inscripciones_voluntariado_estado" DEFAULT 'pendiente' NOT NULL,
  	"atendida_por_id" integer,
  	"atendida_en" timestamp(3) with time zone,
  	"aviso_enviado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inscripciones_padrinos_notas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL,
  	"autor_id" integer,
  	"fecha" timestamp(3) with time zone
  );
  
  CREATE TABLE "inscripciones_padrinos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"convocatoria_id" integer NOT NULL,
  	"nombre" varchar NOT NULL,
  	"correo" varchar NOT NULL,
  	"telefono" varchar NOT NULL,
  	"cantidad_ninos" numeric NOT NULL,
  	"forma_entrega" "enum_inscripciones_padrinos_forma_entrega" NOT NULL,
  	"comentario" varchar,
  	"consentimiento_en" timestamp(3) with time zone NOT NULL,
  	"politica_version" varchar NOT NULL,
  	"estado" "enum_inscripciones_padrinos_estado" DEFAULT 'pendiente' NOT NULL,
  	"atendida_por_id" integer,
  	"atendida_en" timestamp(3) with time zone,
  	"aviso_enviado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mensajes_contacto_notas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL,
  	"autor_id" integer,
  	"fecha" timestamp(3) with time zone
  );
  
  CREATE TABLE "mensajes_contacto" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"correo" varchar,
  	"telefono" varchar,
  	"asunto" varchar NOT NULL,
  	"mensaje" varchar NOT NULL,
  	"consentimiento_en" timestamp(3) with time zone NOT NULL,
  	"politica_version" varchar NOT NULL,
  	"estado" "enum_mensajes_contacto_estado" DEFAULT 'pendiente' NOT NULL,
  	"atendida_por_id" integer,
  	"atendida_en" timestamp(3) with time zone,
  	"aviso_enviado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cuarentena" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"formulario" "enum_cuarentena_formulario" NOT NULL,
  	"motivo" "enum_cuarentena_motivo" DEFAULT 'campo_trampa' NOT NULL,
  	"carga" jsonb NOT NULL,
  	"revisado" boolean DEFAULT false,
  	"veredicto" "enum_cuarentena_veredicto",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "convocatorias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"proyecto_slug" varchar DEFAULT 'una-estrella-otiliana' NOT NULL,
  	"tipo" "enum_convocatorias_tipo" DEFAULT 'padrinos' NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar,
  	"texto_si_cerrada" varchar NOT NULL,
  	"abre_en" timestamp(3) with time zone NOT NULL,
  	"cierra_en" timestamp(3) with time zone NOT NULL,
  	"cerrada_manualmente" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"rol" "enum_usuarios_rol" DEFAULT 'editor' NOT NULL,
  	"activo" boolean DEFAULT false,
  	"totp_secret" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "bitacora" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"accion" "enum_bitacora_accion" NOT NULL,
  	"coleccion" varchar NOT NULL,
  	"documento" varchar NOT NULL,
  	"usuario_id" integer,
  	"correo" varchar,
  	"resumen" varchar NOT NULL,
  	"datos" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "totp_attempts" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"solicitudes_cita_id" integer,
  	"inscripciones_voluntariado_id" integer,
  	"inscripciones_padrinos_id" integer,
  	"mensajes_contacto_id" integer,
  	"cuarentena_id" integer,
  	"convocatorias_id" integer,
  	"usuarios_id" integer,
  	"bitacora_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "solicitudes_cita_notas" ADD CONSTRAINT "solicitudes_cita_notas_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solicitudes_cita_notas" ADD CONSTRAINT "solicitudes_cita_notas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solicitudes_cita"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solicitudes_cita" ADD CONSTRAINT "solicitudes_cita_atendida_por_id_usuarios_id_fk" FOREIGN KEY ("atendida_por_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inscripciones_voluntariado_areas_interes" ADD CONSTRAINT "inscripciones_voluntariado_areas_interes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inscripciones_voluntariado"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inscripciones_voluntariado_notas" ADD CONSTRAINT "inscripciones_voluntariado_notas_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inscripciones_voluntariado_notas" ADD CONSTRAINT "inscripciones_voluntariado_notas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inscripciones_voluntariado"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inscripciones_voluntariado" ADD CONSTRAINT "inscripciones_voluntariado_atendida_por_id_usuarios_id_fk" FOREIGN KEY ("atendida_por_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inscripciones_padrinos_notas" ADD CONSTRAINT "inscripciones_padrinos_notas_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inscripciones_padrinos_notas" ADD CONSTRAINT "inscripciones_padrinos_notas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inscripciones_padrinos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inscripciones_padrinos" ADD CONSTRAINT "inscripciones_padrinos_convocatoria_id_convocatorias_id_fk" FOREIGN KEY ("convocatoria_id") REFERENCES "public"."convocatorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inscripciones_padrinos" ADD CONSTRAINT "inscripciones_padrinos_atendida_por_id_usuarios_id_fk" FOREIGN KEY ("atendida_por_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mensajes_contacto_notas" ADD CONSTRAINT "mensajes_contacto_notas_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mensajes_contacto_notas" ADD CONSTRAINT "mensajes_contacto_notas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mensajes_contacto"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mensajes_contacto" ADD CONSTRAINT "mensajes_contacto_atendida_por_id_usuarios_id_fk" FOREIGN KEY ("atendida_por_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solicitudes_cita_fk" FOREIGN KEY ("solicitudes_cita_id") REFERENCES "public"."solicitudes_cita"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inscripciones_voluntariado_fk" FOREIGN KEY ("inscripciones_voluntariado_id") REFERENCES "public"."inscripciones_voluntariado"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inscripciones_padrinos_fk" FOREIGN KEY ("inscripciones_padrinos_id") REFERENCES "public"."inscripciones_padrinos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensajes_contacto_fk" FOREIGN KEY ("mensajes_contacto_id") REFERENCES "public"."mensajes_contacto"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cuarentena_fk" FOREIGN KEY ("cuarentena_id") REFERENCES "public"."cuarentena"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_convocatorias_fk" FOREIGN KEY ("convocatorias_id") REFERENCES "public"."convocatorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bitacora_fk" FOREIGN KEY ("bitacora_id") REFERENCES "public"."bitacora"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solicitudes_cita_notas_order_idx" ON "solicitudes_cita_notas" USING btree ("_order");
  CREATE INDEX "solicitudes_cita_notas_parent_id_idx" ON "solicitudes_cita_notas" USING btree ("_parent_id");
  CREATE INDEX "solicitudes_cita_notas_autor_idx" ON "solicitudes_cita_notas" USING btree ("autor_id");
  CREATE INDEX "solicitudes_cita_estado_idx" ON "solicitudes_cita" USING btree ("estado");
  CREATE INDEX "solicitudes_cita_atendida_por_idx" ON "solicitudes_cita" USING btree ("atendida_por_id");
  CREATE INDEX "solicitudes_cita_updated_at_idx" ON "solicitudes_cita" USING btree ("updated_at");
  CREATE INDEX "solicitudes_cita_created_at_idx" ON "solicitudes_cita" USING btree ("created_at");
  CREATE INDEX "inscripciones_voluntariado_areas_interes_order_idx" ON "inscripciones_voluntariado_areas_interes" USING btree ("order");
  CREATE INDEX "inscripciones_voluntariado_areas_interes_parent_idx" ON "inscripciones_voluntariado_areas_interes" USING btree ("parent_id");
  CREATE INDEX "inscripciones_voluntariado_notas_order_idx" ON "inscripciones_voluntariado_notas" USING btree ("_order");
  CREATE INDEX "inscripciones_voluntariado_notas_parent_id_idx" ON "inscripciones_voluntariado_notas" USING btree ("_parent_id");
  CREATE INDEX "inscripciones_voluntariado_notas_autor_idx" ON "inscripciones_voluntariado_notas" USING btree ("autor_id");
  CREATE INDEX "inscripciones_voluntariado_estado_idx" ON "inscripciones_voluntariado" USING btree ("estado");
  CREATE INDEX "inscripciones_voluntariado_atendida_por_idx" ON "inscripciones_voluntariado" USING btree ("atendida_por_id");
  CREATE INDEX "inscripciones_voluntariado_updated_at_idx" ON "inscripciones_voluntariado" USING btree ("updated_at");
  CREATE INDEX "inscripciones_voluntariado_created_at_idx" ON "inscripciones_voluntariado" USING btree ("created_at");
  CREATE INDEX "inscripciones_padrinos_notas_order_idx" ON "inscripciones_padrinos_notas" USING btree ("_order");
  CREATE INDEX "inscripciones_padrinos_notas_parent_id_idx" ON "inscripciones_padrinos_notas" USING btree ("_parent_id");
  CREATE INDEX "inscripciones_padrinos_notas_autor_idx" ON "inscripciones_padrinos_notas" USING btree ("autor_id");
  CREATE INDEX "inscripciones_padrinos_convocatoria_idx" ON "inscripciones_padrinos" USING btree ("convocatoria_id");
  CREATE INDEX "inscripciones_padrinos_estado_idx" ON "inscripciones_padrinos" USING btree ("estado");
  CREATE INDEX "inscripciones_padrinos_atendida_por_idx" ON "inscripciones_padrinos" USING btree ("atendida_por_id");
  CREATE INDEX "inscripciones_padrinos_updated_at_idx" ON "inscripciones_padrinos" USING btree ("updated_at");
  CREATE INDEX "inscripciones_padrinos_created_at_idx" ON "inscripciones_padrinos" USING btree ("created_at");
  CREATE UNIQUE INDEX "convocatoria_correo_idx" ON "inscripciones_padrinos" USING btree ("convocatoria_id","correo");
  CREATE INDEX "mensajes_contacto_notas_order_idx" ON "mensajes_contacto_notas" USING btree ("_order");
  CREATE INDEX "mensajes_contacto_notas_parent_id_idx" ON "mensajes_contacto_notas" USING btree ("_parent_id");
  CREATE INDEX "mensajes_contacto_notas_autor_idx" ON "mensajes_contacto_notas" USING btree ("autor_id");
  CREATE INDEX "mensajes_contacto_estado_idx" ON "mensajes_contacto" USING btree ("estado");
  CREATE INDEX "mensajes_contacto_atendida_por_idx" ON "mensajes_contacto" USING btree ("atendida_por_id");
  CREATE INDEX "mensajes_contacto_updated_at_idx" ON "mensajes_contacto" USING btree ("updated_at");
  CREATE INDEX "mensajes_contacto_created_at_idx" ON "mensajes_contacto" USING btree ("created_at");
  CREATE INDEX "cuarentena_updated_at_idx" ON "cuarentena" USING btree ("updated_at");
  CREATE INDEX "cuarentena_created_at_idx" ON "cuarentena" USING btree ("created_at");
  CREATE INDEX "convocatorias_updated_at_idx" ON "convocatorias" USING btree ("updated_at");
  CREATE INDEX "convocatorias_created_at_idx" ON "convocatorias" USING btree ("created_at");
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE INDEX "bitacora_usuario_idx" ON "bitacora" USING btree ("usuario_id");
  CREATE INDEX "bitacora_updated_at_idx" ON "bitacora" USING btree ("updated_at");
  CREATE INDEX "bitacora_created_at_idx" ON "bitacora" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_solicitudes_cita_id_idx" ON "payload_locked_documents_rels" USING btree ("solicitudes_cita_id");
  CREATE INDEX "payload_locked_documents_rels_inscripciones_voluntariado_idx" ON "payload_locked_documents_rels" USING btree ("inscripciones_voluntariado_id");
  CREATE INDEX "payload_locked_documents_rels_inscripciones_padrinos_id_idx" ON "payload_locked_documents_rels" USING btree ("inscripciones_padrinos_id");
  CREATE INDEX "payload_locked_documents_rels_mensajes_contacto_id_idx" ON "payload_locked_documents_rels" USING btree ("mensajes_contacto_id");
  CREATE INDEX "payload_locked_documents_rels_cuarentena_id_idx" ON "payload_locked_documents_rels" USING btree ("cuarentena_id");
  CREATE INDEX "payload_locked_documents_rels_convocatorias_id_idx" ON "payload_locked_documents_rels" USING btree ("convocatorias_id");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_locked_documents_rels_bitacora_id_idx" ON "payload_locked_documents_rels" USING btree ("bitacora_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)

  // Segunda línea de defensa (CLAUDE.md §5.2): RLS activo y sin políticas en todas las tablas.
  // La aplicación es dueña de las tablas y no se ve afectada; cualquier otro rol de base que
  // alguien cree en el futuro (por ejemplo, uno de solo lectura para reportes) no ve nada.
  // Las migraciones futuras que creen tablas deben repetir este bloque.
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
   DROP TABLE "solicitudes_cita_notas" CASCADE;
  DROP TABLE "solicitudes_cita" CASCADE;
  DROP TABLE "inscripciones_voluntariado_areas_interes" CASCADE;
  DROP TABLE "inscripciones_voluntariado_notas" CASCADE;
  DROP TABLE "inscripciones_voluntariado" CASCADE;
  DROP TABLE "inscripciones_padrinos_notas" CASCADE;
  DROP TABLE "inscripciones_padrinos" CASCADE;
  DROP TABLE "mensajes_contacto_notas" CASCADE;
  DROP TABLE "mensajes_contacto" CASCADE;
  DROP TABLE "cuarentena" CASCADE;
  DROP TABLE "convocatorias" CASCADE;
  DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "bitacora" CASCADE;
  DROP TABLE "totp_attempts" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_solicitudes_cita_contacto_preferido";
  DROP TYPE "public"."enum_solicitudes_cita_modalidad";
  DROP TYPE "public"."enum_solicitudes_cita_estado";
  DROP TYPE "public"."enum_inscripciones_voluntariado_areas_interes";
  DROP TYPE "public"."enum_inscripciones_voluntariado_estado";
  DROP TYPE "public"."enum_inscripciones_padrinos_forma_entrega";
  DROP TYPE "public"."enum_inscripciones_padrinos_estado";
  DROP TYPE "public"."enum_mensajes_contacto_estado";
  DROP TYPE "public"."enum_cuarentena_formulario";
  DROP TYPE "public"."enum_cuarentena_motivo";
  DROP TYPE "public"."enum_cuarentena_veredicto";
  DROP TYPE "public"."enum_convocatorias_tipo";
  DROP TYPE "public"."enum_usuarios_rol";
  DROP TYPE "public"."enum_bitacora_accion";`)
}
