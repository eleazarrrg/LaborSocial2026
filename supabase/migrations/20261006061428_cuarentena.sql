-- Qué cambia: tabla `envios_en_cuarentena`, donde caen los envíos que activan el campo trampa.
-- Por qué: nada se descarta en silencio (RNF-22). Un envío sospechoso no entra a la bandeja,
--          pero queda guardado para que alguien lo revise: si era legítimo, se recupera.
-- Responde a: RNF-22, docs/07 §3.19.

create table public.envios_en_cuarentena (
  id                 uuid        primary key default gen_random_uuid(),
  formulario         text        not null
                                 check (formulario in ('solicitudes_cita',
                                                       'inscripciones_voluntariado',
                                                       'inscripciones_padrinos',
                                                       'mensajes_contacto')),
  motivo_rechazo     text        not null
                                 check (motivo_rechazo in ('campo_trampa',
                                                           'limite_de_frecuencia',
                                                           'validacion_fallida',
                                                           'convocatoria_cerrada')),
  detalle            text,
  -- Solo los campos conocidos del formulario, ya recortados a su longitud máxima. Nunca el
  -- FormData crudo: un bot puede mandar cualquier cosa.
  carga              jsonb       not null,

  revisado           boolean     not null default false,
  revisado_por       uuid        references public.perfiles (id) on delete set null,
  revisado_en        timestamptz,
  resultado_revision text        check (resultado_revision in ('era_spam',
                                                               'era_legitimo_recuperado')),

  creado_en          timestamptz not null default now(),

  constraint si_esta_revisado_hay_veredicto
    check (not revisado or (revisado_en is not null and resultado_revision is not null))
);

-- Lo que el panel muestra: lo que nadie ha mirado todavía, lo más viejo primero.
create index cuarentena_sin_revisar_idx
  on public.envios_en_cuarentena (creado_en)
  where not revisado;

alter table public.envios_en_cuarentena enable row level security;

create policy "cuarentena_solo_la_ve_un_administrador"
  on public.envios_en_cuarentena for select to authenticated
  using ((select privado.es_admin()));

-- La escribe el servidor; la lee la administración. Marcar como revisado llega con la purga
-- de retención (docs/09): hasta entonces la cuarentena guarda datos sin fecha de borrado.
grant insert on public.envios_en_cuarentena to service_role;
grant select on public.envios_en_cuarentena to authenticated;
