-- Qué cambia: tabla `perfiles` (rol y estado de cada cuenta del panel) y `privado.es_admin()`.
-- Por qué: la autorización vive en una tabla, nunca en user_metadata (editable por el usuario). Y
--          es_admin() exige el segundo factor (aal2): sin MFA verificado, ninguna política da acceso.
-- Responde a: RF-04 (acceso con segundo factor), docs/07 §3.1 y §3.0.2.

create table public.perfiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  correo            text        not null,
  nombre            text        not null check (length(btrim(nombre)) > 1),
  rol               text        not null default 'editor'
                                check (rol in ('administrador', 'editor')),
  -- Toda cuenta nace INACTIVA. Se activa a mano por SQL (docs/09): nadie se da acceso a sí mismo.
  activo            boolean     not null default false,
  ultimo_acceso_en  timestamptz,
  creado_en         timestamptz not null default now(),
  actualizado_en    timestamptz not null default now()
);

create unique index perfiles_correo_unico_idx on public.perfiles (lower(correo));
create index perfiles_activos_idx on public.perfiles (rol) where activo;

create trigger perfiles_tocar
  before update on public.perfiles
  for each row execute function privado.tocar_actualizado_en();

alter table public.perfiles enable row level security;

-- Perfil automático al crearse un usuario de Auth: inactivo y sin permisos.
-- `nombre` sale de user_metadata solo como texto visible; jamás decide un permiso.
create or replace function privado.crear_perfil_para_usuario_nuevo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, correo, nombre, rol, activo)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)),
    'editor',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger al_crear_usuario_crear_perfil
  after insert on auth.users
  for each row execute function privado.crear_perfil_para_usuario_nuevo();

-- ── ¿Es administradora, con el segundo factor verificado? ─────────────────────
-- Creada DESPUÉS de la tabla: con check_function_bodies activo, una función `language sql`
-- que nombra una tabla inexistente falla al crearse (defecto de la versión de docs/07).
--
-- SECURITY DEFINER para poder leer `perfiles` desde una política sin recursión de RLS. Vive en
-- `privado`, que la API no expone. Límite conocido: si alguien pierde el factor, su token sigue
-- diciendo aal2 hasta que expira (1 h). Ver docs/09.
create or replace function privado.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (
       select 1
       from public.perfiles p
       where p.id = (select auth.uid())
         and p.activo
         and p.rol = 'administrador'
     );
$$;

revoke all on function privado.es_admin() from public, anon;
grant execute on function privado.es_admin() to authenticated;

-- ── Políticas y permisos ─────────────────────────────────────────────────────
-- Cada quien ve su propia fila (el panel la necesita para saber si falta activar el MFA);
-- la administración ve todas. Sin UPDATE: la activación es por SQL.
create policy "perfiles_cada_quien_ve_el_suyo"
  on public.perfiles for select to authenticated
  using (id = (select auth.uid()) or (select privado.es_admin()));

grant select on public.perfiles to authenticated;
