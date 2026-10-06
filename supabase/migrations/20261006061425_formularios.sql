-- Qué cambia: las cuatro tablas de los formularios públicos: cita, voluntariado, padrinos, contacto.
-- Por qué: hasta hoy los formularios validaban y no guardaban nada. La escritura en Postgres es lo
--          único crítico (CLAUDE.md §4); toda automatización reacciona después.
-- Responde a: RF-02, RF-03, RF-07, RF-10, RF-12; docs/07 §3.6 a §3.12, alineado con src/lib/esquemas.ts.

-- Quién puede hacer qué (igual en las cuatro):
--   · insertar:  solo service_role, desde una Server Action que valida con Zod. Nadie más.
--   · leer:      solo una administradora con el segundo factor verificado (privado.es_admin()).
--   · cambiar:   solo la columna `estado`; quién y cuándo lo pone el disparador, no el navegador.
-- Los correos se guardan en minúscula: el CHECK lo garantiza y hace correcta la clase [a-z].

-- ── Solicitud de cita psicológica (el dato más sensible del sitio) ──────────
-- Sin diagnóstico, síntomas, medicación ni relato clínico (CLAUDE.md §5.2).
create table public.solicitudes_cita (
  id                  uuid        primary key default gen_random_uuid(),

  nombre              text        not null check (length(btrim(nombre)) between 2 and 120),
  correo              text        check (correo = lower(correo)
                                         and correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono            text        check (length(btrim(telefono)) between 6 and 25),
  contacto_preferido  text        not null
                                  check (contacto_preferido in ('correo', 'telefono', 'whatsapp')),

  motivo              text        check (motivo is null
                                         or length(btrim(motivo)) between 5 and 280),
  modalidad           text        not null
                                  check (modalidad in ('virtual', 'presencial', 'cualquiera')),
  -- Opcional a propósito: a quien pide ayuda no se le pone fricción (docs/07 decía obligatorio).
  disponibilidad      text        check (disponibilidad is null
                                         or length(btrim(disponibilidad)) between 3 and 200),
  atencion_pronto     boolean     not null default false,

  consentimiento_en   timestamptz not null,
  politica_version    text        not null,

  estado              text        not null default 'pendiente'
                                  check (estado in ('pendiente', 'en_gestion',
                                                    'atendida', 'cerrada_sin_atender')),
  atendida_por        uuid        references public.perfiles (id) on delete set null,
  atendida_en         timestamptz,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now(),

  constraint hay_forma_de_responder
    check (correo is not null or telefono is not null),
  constraint el_canal_elegido_tiene_dato
    check (
      (contacto_preferido = 'correo' and correo is not null)
      or (contacto_preferido in ('telefono', 'whatsapp') and telefono is not null)
    )
);

alter table public.solicitudes_cita enable row level security;

-- ── Voluntariado ────────────────────────────────────────────────────────────
create table public.inscripciones_voluntariado (
  id                 uuid        primary key default gen_random_uuid(),

  nombre             text        not null check (length(btrim(nombre)) between 2 and 120),
  -- Obligatorio aquí, a diferencia de la cita: la logística de una jornada se coordina por correo,
  -- y quien se ofrece a ayudar no está en crisis (decisión deliberada de docs/07 §3.8).
  correo             text        not null
                                 check (correo = lower(correo)
                                        and correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono           text        check (length(btrim(telefono)) between 6 and 25),

  areas_interes      text[]      not null
                                 check (cardinality(areas_interes) between 1 and 8)
                                 check (areas_interes <@ array[
                                   'redes-sociales', 'diseno', 'logistica', 'psicologia',
                                   'escritura', 'transporte', 'cocina', 'otra'
                                 ]::text[]),
  otra_area          text        check (otra_area is null
                                        or length(btrim(otra_area)) between 2 and 80),
  disponibilidad     text        check (disponibilidad is null
                                        or length(btrim(disponibilidad)) between 3 and 200),
  experiencia        text        check (experiencia is null or length(btrim(experiencia)) <= 500),

  consentimiento_en  timestamptz not null,
  politica_version   text        not null,

  estado             text        not null default 'pendiente'
                                 check (estado in ('pendiente', 'en_gestion',
                                                   'atendida', 'cerrada_sin_atender')),
  atendida_por       uuid        references public.perfiles (id) on delete set null,
  atendida_en        timestamptz,
  creado_en          timestamptz not null default now(),
  actualizado_en     timestamptz not null default now(),

  constraint si_marca_otra_lo_explica
    check (not ('otra' = any (areas_interes)) or otra_area is not null)
);

alter table public.inscripciones_voluntariado enable row level security;

-- ── Padrinos y madrinas (Una Estrella Otiliana) ─────────────────────────────
-- Sin ningún dato del niño o la niña: el emparejamiento ocurre fuera de línea (CLAUDE.md §5.2).
create table public.inscripciones_padrinos (
  id                 uuid        primary key default gen_random_uuid(),
  convocatoria_id    uuid        not null references public.convocatorias (id) on delete restrict,

  nombre             text        not null check (length(btrim(nombre)) between 2 and 120),
  correo             text        not null
                                 check (correo = lower(correo)
                                        and correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono           text        not null check (length(btrim(telefono)) between 6 and 25),

  cantidad_ninos     smallint    not null default 1 check (cantidad_ninos between 1 and 10),
  forma_entrega      text        not null check (forma_entrega in ('llevo', 'coordinar', 'asisto')),
  comentario         text        check (comentario is null or length(btrim(comentario)) <= 400),

  consentimiento_en  timestamptz not null,
  politica_version   text        not null,

  estado             text        not null default 'pendiente'
                                 check (estado in ('pendiente', 'en_gestion',
                                                   'atendida', 'cerrada_sin_atender')),
  atendida_por       uuid        references public.perfiles (id) on delete set null,
  atendida_en        timestamptz,
  creado_en          timestamptz not null default now(),
  actualizado_en     timestamptz not null default now()
);

alter table public.inscripciones_padrinos enable row level security;

-- Una persona, una inscripción por convocatoria. El correo ya viene en minúscula.
create unique index padrinos_sin_duplicados_idx
  on public.inscripciones_padrinos (convocatoria_id, correo);

-- Segunda línea de defensa: aunque el código fallara, no entra una inscripción a una convocatoria
-- cerrada o de otro tipo.
create or replace function privado.exigir_convocatoria_de_padrinos_abierta()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.convocatorias c
    where c.id = new.convocatoria_id
      and c.tipo = 'padrinos'
      and not c.cerrada_manualmente
      and now() >= c.abre_en
      and now() <  c.cierra_en
  ) then
    raise exception 'La convocatoria de padrinos no está abierta.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger padrinos_exigen_convocatoria_abierta
  before insert on public.inscripciones_padrinos
  for each row execute function privado.exigir_convocatoria_de_padrinos_abierta();

-- ── Contacto general (también recibe las alianzas hasta que tengan su formulario) ─
create table public.mensajes_contacto (
  id                 uuid        primary key default gen_random_uuid(),

  nombre             text        not null check (length(btrim(nombre)) between 2 and 120),
  correo             text        check (correo = lower(correo)
                                        and correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono           text        check (length(btrim(telefono)) between 6 and 25),
  asunto             text        not null check (length(btrim(asunto)) between 3 and 140),
  mensaje            text        not null check (length(btrim(mensaje)) between 10 and 2000),

  consentimiento_en  timestamptz not null,
  politica_version   text        not null,

  estado             text        not null default 'pendiente'
                                 check (estado in ('pendiente', 'en_gestion',
                                                   'atendida', 'cerrada_sin_atender')),
  atendida_por       uuid        references public.perfiles (id) on delete set null,
  atendida_en        timestamptz,
  creado_en          timestamptz not null default now(),
  actualizado_en     timestamptz not null default now(),

  constraint hay_forma_de_responder
    check (correo is not null or telefono is not null)
);

alter table public.mensajes_contacto enable row level security;

-- ── Cambio de estado: quién, cuándo y la bitácora, en la misma transacción ──
-- SECURITY DEFINER: escribe en la bitácora aunque la administradora solo pueda insertar ahí
-- «ver_solicitud». Si la bitácora fallara, el cambio de estado también: nunca uno sin el otro.
create or replace function privado.al_cambiar_estado()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.estado is distinct from old.estado then
    new.atendida_por := (select auth.uid());
    new.atendida_en  := case when new.estado in ('atendida', 'cerrada_sin_atender')
                             then now() else null end;

    insert into public.bitacora (actor_id, actor_correo, accion, entidad, entidad_id, resumen, datos)
    values (
      (select auth.uid()),
      (select auth.jwt() ->> 'email'),
      'cambiar_estado',
      tg_table_name,
      new.id,
      'Estado: ' || old.estado || ' → ' || new.estado,
      jsonb_build_object('de', old.estado, 'a', new.estado)
    );
  end if;
  return new;
end;
$$;

-- ── Lo común a las cuatro: índices, disparadores, RLS, políticas y permisos ─
do $$
declare
  t text;
begin
  foreach t in array array[
    'solicitudes_cita', 'inscripciones_voluntariado',
    'inscripciones_padrinos', 'mensajes_contacto'
  ]
  loop
    -- La bandeja: pendientes, la más vieja primero (RF-12).
    execute format(
      'create index %I on public.%I (creado_en) where estado in (''pendiente'', ''en_gestion'')',
      t || '_pendientes_idx', t);

    execute format(
      'create trigger %I before update on public.%I
         for each row execute function privado.tocar_actualizado_en()',
      t || '_tocar', t);

    execute format(
      'create trigger %I before update of estado on public.%I
         for each row execute function privado.al_cambiar_estado()',
      t || '_al_cambiar_estado', t);

    execute format(
      'create policy %I on public.%I for select to authenticated
         using ((select privado.es_admin()))',
      t || '_solo_admin_lee', t);

    execute format(
      'create policy %I on public.%I for update to authenticated
         using ((select privado.es_admin())) with check ((select privado.es_admin()))',
      t || '_solo_admin_gestiona', t);

    -- Insertar: solo el servidor. Leer y cambiar el estado: la administración (vía RLS).
    execute format('grant insert on public.%I to service_role', t);
    execute format('grant select on public.%I to authenticated', t);
    execute format('grant update (estado) on public.%I to authenticated', t);
  end loop;
end;
$$;
