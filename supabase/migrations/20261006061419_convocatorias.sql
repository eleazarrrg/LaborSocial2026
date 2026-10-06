-- Qué cambia: tabla `convocatorias` (ventanas de inscripción con fecha de apertura y cierre).
-- Por qué: la inscripción de padrinos solo se acepta con una convocatoria abierta. Un evento
--          vencido deja de aceptar inscripciones por la fecha, no porque un trabajo programado lo cierre.
-- Responde a: RF-07, RF-13, docs/07 §3.5.

create table public.convocatorias (
  id                   uuid        primary key default gen_random_uuid(),
  -- Slug de src/lib/catalogo.ts. La clave foránea a `proyectos` entra cuando exista esa tabla.
  proyecto_slug        text        not null check (proyecto_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tipo                 text        not null
                                   check (tipo in ('padrinos', 'comunidades',
                                                   'voluntariado', 'general')),
  titulo               text        not null check (length(btrim(titulo)) between 5 and 160),
  descripcion          text,
  texto_si_cerrada     text,
  abre_en              timestamptz not null,
  cierra_en            timestamptz not null,
  cerrada_manualmente  boolean     not null default false,
  cerrada_en           timestamptz,
  cupo_maximo          integer     check (cupo_maximo is null or cupo_maximo > 0),
  creado_en            timestamptz not null default now(),
  actualizado_en       timestamptz not null default now(),

  constraint cierra_despues_de_abrir check (cierra_en > abre_en),
  -- Nunca dos convocatorias del mismo tipo y proyecto abiertas a la vez.
  constraint sin_convocatorias_solapadas
    exclude using gist (
      proyecto_slug with =,
      tipo          with =,
      tstzrange(abre_en, cierra_en) with &&
    )
);

create index convocatorias_por_ventana_idx
  on public.convocatorias (proyecto_slug, tipo, abre_en desc);

create trigger convocatorias_tocar
  before update on public.convocatorias
  for each row execute function privado.tocar_actualizado_en();

alter table public.convocatorias enable row level security;

-- No contiene datos de personas: el sitio público la lee para decir si la convocatoria está abierta.
create policy "convocatorias_las_lee_cualquiera"
  on public.convocatorias for select to anon, authenticated, service_role
  using (true);

grant select on public.convocatorias to anon, authenticated, service_role;
