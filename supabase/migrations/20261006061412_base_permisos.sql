-- Qué cambia: punto de partida de permisos, el esquema `privado` y utilidades comunes.
-- Por qué: desde el 30-10-2026 Supabase ya no expone solas las tablas nuevas; partimos de CERO
--          permisos y cada migración concede exactamente lo que su tabla necesita (docs/07 §4).
-- Responde a: CLAUDE.md §5.2 (RLS sin excepción), RNF de seguridad de docs/04.

-- ── Esquema privado ──────────────────────────────────────────────────────────
-- Funciones auxiliares (es_admin, disparadores) que NO deben ser llamables por la API.
-- `public` sí está expuesto: una función SECURITY DEFINER ahí es un endpoint público.
create schema if not exists privado;
revoke all on schema privado from public;
grant usage on schema privado to authenticated, service_role;

-- ── Nada nace con permisos ───────────────────────────────────────────────────
revoke all on all tables    in schema public from anon, authenticated, service_role;
revoke all on all sequences in schema public from anon, authenticated, service_role;
revoke all on all functions in schema public from public, anon, authenticated, service_role;

alter default privileges in schema public revoke all on tables    from anon, authenticated, service_role;
alter default privileges in schema public revoke all on sequences from anon, authenticated, service_role;
alter default privileges in schema public revoke all on functions from anon, authenticated, service_role;

-- Postgres concede EXECUTE a PUBLIC en cada función nueva, y los permisos por esquema NO pueden
-- quitar lo que se concede globalmente. Por eso esta revocación va sin `in schema`: aplica a toda
-- función que cree el rol que ejecuta las migraciones.
alter default privileges revoke execute on functions from public;

-- ── Extensiones ──────────────────────────────────────────────────────────────
-- btree_gist: la restricción que impide convocatorias solapadas (migración de convocatorias).
create extension if not exists btree_gist with schema extensions;

-- ── Utilidades ───────────────────────────────────────────────────────────────
create or replace function privado.tocar_actualizado_en()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;
