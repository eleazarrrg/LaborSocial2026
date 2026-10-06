-- Prueba de RLS y permisos. Se pega entero en el SQL Editor de Supabase y se ejecuta.
--
--   · Si todo está bien:   «Success. No rows returned».
--   · Si algo está mal:    un error que empieza con «FALLA», que dice qué y con quién.
--
-- Corre dentro de una transacción que termina en ROLLBACK: no deja usuarios, filas ni
-- bitácora de prueba. Simula a cada persona con `set local role` y sus claims del JWT, que
-- es exactamente lo que hace PostgREST con cada petición.

begin;

-- ── Datos de prueba ─────────────────────────────────────────────────────────
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-4000-8000-0000000000a1', 'admin.prueba@refuva.test', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-0000000000a2', 'inactiva.prueba@refuva.test', 'authenticated', 'authenticated');

-- El disparador ya creó los dos perfiles: editor e inactivo. Solo la primera se activa.
update public.perfiles set activo = true, rol = 'administrador'
 where id = '00000000-0000-4000-8000-0000000000a1';

insert into public.solicitudes_cita
  (nombre, telefono, contacto_preferido, modalidad, consentimiento_en, politica_version)
values ('Prueba RLS', '6694-2747', 'whatsapp', 'virtual', now(), 'prueba');

insert into public.inscripciones_voluntariado
  (nombre, correo, areas_interes, consentimiento_en, politica_version)
values ('Prueba RLS', 'voluntaria.prueba@refuva.test', array['cocina'], now(), 'prueba');

insert into public.inscripciones_padrinos
  (convocatoria_id, nombre, correo, telefono, forma_entrega, consentimiento_en, politica_version)
select id, 'Prueba RLS', 'padrino.prueba@refuva.test', '6694-2747', 'llevo', now(), 'prueba'
  from public.convocatorias
 where tipo = 'padrinos' and not cerrada_manualmente and now() >= abre_en and now() < cierra_en
 limit 1;

insert into public.mensajes_contacto
  (nombre, telefono, asunto, mensaje, consentimiento_en, politica_version)
values ('Prueba RLS', '6694-2747', 'Prueba', 'Mensaje de prueba de RLS', now(), 'prueba');

insert into public.envios_en_cuarentena (formulario, motivo_rechazo, carga)
values ('mensajes_contacto', 'campo_trampa', '{}'::jsonb);

-- ── 1. Anónimo: ni siquiera tiene permiso sobre las tablas ──────────────────
do $$
declare
  t text;
  n bigint;
begin
  set local role anon;
  foreach t in array array['solicitudes_cita', 'inscripciones_voluntariado',
                           'inscripciones_padrinos', 'mensajes_contacto',
                           'envios_en_cuarentena', 'bitacora', 'perfiles']
  loop
    begin
      execute format('select count(*) from public.%I', t) into n;
      raise exception 'FALLA anónimo: pudo leer % (% filas)', t, n;
    exception when insufficient_privilege then null;
    end;
  end loop;

  -- Lo único público: las convocatorias.
  perform 1 from public.convocatorias limit 1;
  reset role;
end $$;

-- ── 2. Cuentas que NO deben ver nada: inactiva con aal2, y administradora en aal1 ─
do $$
declare
  caso record;
  t text;
  n bigint;
begin
  for caso in
    select * from (values
      ('inactiva con segundo factor', '00000000-0000-4000-8000-0000000000a2', 'aal2'),
      ('administradora sin segundo factor', '00000000-0000-4000-8000-0000000000a1', 'aal1')
    ) as v(quien, id, aal)
  loop
    perform set_config('request.jwt.claims',
      json_build_object('sub', caso.id, 'role', 'authenticated', 'aal', caso.aal)::text, true);
    set local role authenticated;

    foreach t in array array['solicitudes_cita', 'inscripciones_voluntariado',
                             'inscripciones_padrinos', 'mensajes_contacto',
                             'envios_en_cuarentena', 'bitacora']
    loop
      execute format('select count(*) from public.%I', t) into n;
      if n <> 0 then
        raise exception 'FALLA %: ve % filas de %', caso.quien, n, t;
      end if;
    end loop;

    -- Su propio perfil sí, y solo ese.
    select count(*) into n from public.perfiles;
    if n <> 1 then
      raise exception 'FALLA %: ve % perfiles (debía ver solo el suyo)', caso.quien, n;
    end if;

    reset role;
  end loop;
end $$;

-- ── 3. Administradora con segundo factor: ve, gestiona y deja rastro ────────
do $$
declare
  t text;
  n bigint;
  antes bigint;
begin
  perform set_config('request.jwt.claims',
    json_build_object('sub', '00000000-0000-4000-8000-0000000000a1', 'role', 'authenticated',
                      'aal', 'aal2', 'email', 'admin.prueba@refuva.test')::text, true);
  set local role authenticated;

  foreach t in array array['solicitudes_cita', 'inscripciones_voluntariado',
                           'inscripciones_padrinos', 'mensajes_contacto', 'envios_en_cuarentena']
  loop
    execute format('select count(*) from public.%I', t) into n;
    if n = 0 then
      raise exception 'FALLA administradora aal2: no ve ninguna fila de %', t;
    end if;
  end loop;

  -- Cambiar el estado: sí. Y queda en la bitácora con su autoría.
  select count(*) into antes from public.bitacora where accion = 'cambiar_estado';
  update public.mensajes_contacto set estado = 'en_gestion' where nombre = 'Prueba RLS';
  select count(*) into n from public.bitacora
   where accion = 'cambiar_estado' and actor_id = '00000000-0000-4000-8000-0000000000a1';
  if n <= antes then
    raise exception 'FALLA administradora aal2: el cambio de estado no quedó en la bitácora';
  end if;

  -- Cambiar cualquier otra columna: no.
  begin
    update public.mensajes_contacto set nombre = 'Otro' where nombre = 'Prueba RLS';
    raise exception 'FALLA administradora aal2: pudo cambiar el nombre de una solicitud';
  exception when insufficient_privilege then null;
  end;

  -- Insertar una solicitud: no (solo el servidor, con service_role).
  begin
    insert into public.solicitudes_cita
      (nombre, telefono, contacto_preferido, modalidad, consentimiento_en, politica_version)
    values ('Intrusa', '6694-2747', 'telefono', 'virtual', now(), 'prueba');
    raise exception 'FALLA administradora aal2: pudo insertar una solicitud';
  exception when insufficient_privilege then null;
  end;

  -- Bitácora: registra lo que ve; no puede inventar otra cosa ni borrar.
  insert into public.bitacora (accion, entidad, resumen)
  values ('ver_solicitud', 'mensajes_contacto', 'Prueba');
  begin
    insert into public.bitacora (accion, entidad, resumen)
    values ('eliminar', 'mensajes_contacto', 'Prueba');
    raise exception 'FALLA administradora aal2: pudo escribir en la bitácora una acción distinta de ver_solicitud';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.bitacora;
    raise exception 'FALLA administradora aal2: pudo borrar la bitácora';
  exception when insufficient_privilege then null;
  end;

  reset role;
end $$;

-- ── 4. service_role: inserta, pero no lee ninguna solicitud ─────────────────
do $$
declare
  n bigint;
begin
  set local role service_role;
  insert into public.mensajes_contacto
    (nombre, telefono, asunto, mensaje, consentimiento_en, politica_version)
  values ('Servidor', '6694-2747', 'Prueba', 'Inserción del servidor', now(), 'prueba');
  begin
    select count(*) into n from public.mensajes_contacto;
    raise exception 'FALLA service_role: pudo leer mensajes_contacto (% filas)', n;
  exception when insufficient_privilege then null;
  end;
  reset role;
end $$;

rollback;
