-- Qué cambia: tabla `bitacora`, el registro de auditoría de solo escritura.
-- Por qué: quién abrió qué solicitud y quién le cambió el estado tiene que quedar, y nadie (ni
--          siquiera la clave secret) puede editar o borrar lo escrito.
-- Responde a: RNF de trazabilidad (docs/04), docs/07 §3.16.

create table public.bitacora (
  id            uuid        primary key default gen_random_uuid(),
  ocurrido_en   timestamptz not null default now(),
  -- El autor lo pone la base desde el token, nunca el navegador: la columna no se concede.
  actor_id      uuid        default auth.uid(),
  actor_correo  text        default (auth.jwt() ->> 'email'),
  accion        text        not null
                            check (accion in ('crear', 'editar', 'publicar', 'despublicar',
                                              'archivar', 'eliminar', 'restaurar',
                                              'ver_solicitud', 'cambiar_estado', 'exportar',
                                              'iniciar_sesion', 'cerrar_sesion',
                                              'purgar', 'tarea_programada')),
  entidad       text        not null,
  entidad_id    uuid,
  resumen       text        not null check (length(btrim(resumen)) > 0),
  -- Nunca datos de personas aquí: solo nombres de campo o estados.
  datos         jsonb       not null default '{}'::jsonb
);

create index bitacora_reciente_idx    on public.bitacora (ocurrido_en desc);
create index bitacora_por_entidad_idx on public.bitacora (entidad, entidad_id, ocurrido_en desc);
create index bitacora_por_actor_idx   on public.bitacora (actor_id, ocurrido_en desc);

alter table public.bitacora enable row level security;

-- Inmutable de verdad: el disparador detiene incluso a la clave secret, que se salta la RLS.
create or replace function privado.bitacora_es_inmutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'La bitácora es de solo escritura: no se puede % una entrada.', lower(tg_op);
end;
$$;

create trigger bitacora_sin_cambios
  before update or delete on public.bitacora
  for each row execute function privado.bitacora_es_inmutable();

-- ── Políticas y permisos ─────────────────────────────────────────────────────
create policy "bitacora_la_lee_un_administrador"
  on public.bitacora for select to authenticated
  using ((select privado.es_admin()));

-- Desde el panel solo se escribe «abrí esta solicitud». El cambio de estado lo escribe un
-- disparador en la misma transacción (migración de formularios), así que no puede faltar.
create policy "bitacora_registra_lo_que_ve_un_administrador"
  on public.bitacora for insert to authenticated
  with check ((select privado.es_admin()) and accion = 'ver_solicitud');

grant select on public.bitacora to authenticated;
-- Solo estas columnas: actor_id, actor_correo y ocurrido_en no se pueden falsificar.
grant insert (accion, entidad, entidad_id, resumen, datos) on public.bitacora to authenticated;
