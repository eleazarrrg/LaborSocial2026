# Modelo de datos — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Motor** | PostgreSQL 15+ sobre Supabase |
| **Alcance** | Esquema, políticas de acceso, retención, migraciones, semillas y respaldo |
| **Fuente de requisitos** | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) y [`01-srs.md`](./01-srs.md) |

> **Este documento es el único lugar donde vive el esquema.** Los precios están en
> [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md); las fechas del proyecto, en
> [`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md). Si necesitas una cifra de allá, enlázala.
>
> Estado de cada afirmación, igual que en `hechos-verificados.md`:
> ✅ **Confirmado** · 🟡 **Inferido** (se deduce, hay que confirmarlo) · 🔴 **Pendiente** (falta el dato).

---

# 1. Principios del modelo

Cinco reglas. Todo lo demás se deriva de ellas.

1. **RLS habilitado en toda tabla, sin excepción.** No solo en las que tienen datos de personas: en
   todas. Una tabla sin RLS en Supabase es legible desde cualquier navegador que tenga la clave
   pública, que es una clave que por diseño está en el HTML. Origen: RF-04, AC-06, §6.1 del SRS.
2. **Ningún dato identificable de menores.** No hay tabla de niños, no hay columna con el nombre, la
   edad, la escuela ni la comunidad de un niño, y no hay lista nominal en ninguna parte del esquema.
   El emparejamiento padrino↔niño de la fiesta navideña ocurre fuera de línea. Las dos únicas
   columnas que mencionan niños —`cantidad_ninos` y `ninos_aproximado`— son **conteos agregados**:
   dicen cuántos, nunca quiénes. La única excepción escrita a esta regla son las **imágenes de
   menores en la galería de evidencia**, y solo con consentimiento firmado registrado (§3.4).
   Origen: X-06, P-02.
3. **Minimización: lo que no se recoge no se puede filtrar.** El formulario de cita no pide
   diagnóstico, síntomas, medicación ni relato clínico, y el esquema no tiene dónde ponerlos aunque
   alguien quisiera. Tampoco se guarda dirección IP ni cadena de navegador. Origen: X-05, RF-02.
4. **Retención explícita por tabla.** Cada dato de una persona tiene un plazo escrito (§5) y una
   función que lo borra sola. Un plazo que solo existe en la política de privacidad no es una
   política de retención: es una intención.
5. **Borrado lógico para contenido, borrado real para datos personales.** Una noticia archivada se
   conserva —es memoria institucional y Edwin pidió *ocultar*, no borrar (C-06)—. Una solicitud de
   cita vencida se borra con `DELETE`, de verdad, y desaparece también de los respaldos dentro del
   plazo definido en §8.

Y una consecuencia de la regla 4 que conviene decir aparte, porque cambia el diseño:

> **La vigencia se calcula en la consulta, no la fija un trabajo programado.** Un evento vencido deja
> de listarse porque la consulta filtra por fecha, no porque un cron le haya cambiado el estado. Una
> convocatoria cerrada rechaza envíos porque su ventana de fechas ya pasó, no porque alguien apretó
> un botón. El equipo se retira (X-01): si la corrección de un dato depende de que un job haya
> corrido, el día que el job falle el sitio miente. Los trabajos programados de RF-15 existen para
> *avisar* y para *limpiar*, nunca para que el sitio diga la verdad.

## 1.1 Convenciones técnicas

| Regla | Detalle |
|---|---|
| Identificadores | Minúsculas y guion bajo. Nombres en español: `solicitudes_cita`, no `appointment_requests`. |
| Clave primaria | `uuid primary key default gen_random_uuid()`. Disponible en el núcleo de PostgreSQL 13+; no hace falta habilitar `pgcrypto`. |
| Fechas y horas | **`timestamptz` siempre.** Nunca `timestamp`. Se almacena en UTC y se presenta con `at time zone 'America/Panama'`. Panamá es UTC−5 fijo, sin horario de verano. |
| Marcas de tiempo | Toda tabla lleva `creado_en`; las editables llevan además `actualizado_en`, mantenida por disparador. |
| Estados | `text` con `CHECK`, no tipos `enum`. Cambiar un `CHECK` es un `ALTER TABLE` normal dentro de una transacción; a un `enum` se le puede **añadir** un valor pero no quitarlo sin reescribir la tabla. Con un solo administrador no técnico, gana lo que se puede deshacer. |
| Textos vacíos | Se prohíben con `CHECK (length(btrim(campo)) > 0)` donde el campo es obligatorio. `''` no es un valor, es un descuido. |
| Booleanos | Nombre afirmativo (`activo`, `oculto`, `destacado`). Nunca `no_activo`. |
| Dinero | No hay ninguna columna de dinero en el esquema. El precio de la consulta y los datos bancarios viven en `ajustes` como texto, escritos a mano en formato `B/.15.00`. |
| Esquema | Todo en `public`. Las funciones auxiliares declaran `set search_path = ''` y califican cada objeto. |

---

# 2. Diagrama de entidades

```
                          ┌────────────────────────┐
                          │      auth.users        │   Supabase Auth (no la tocamos)
                          └───────────┬────────────┘
                                      │ 1:1
                          ┌───────────▼────────────┐
                          │       perfiles         │  rol: administrador | editor
                          └───────────┬────────────┘
                                      │ autor / responsable de casi todo
      ┌───────────────────────────────┼───────────────────────────────┐
      │                               │                               │
┌─────▼──────┐               ┌────────▼─────────┐            ┌────────▼─────────┐
│ proyectos  │               │    contenidos    │            │    bitacora      │
│ (las 7     │◄──── 0..1 ────│ noticia | evento │            │  solo inserción  │
│  líneas)   │               │ borrador/public. │            └──────────────────┘
└─┬───┬──────┘               │ /archivado       │
  │   │                      └────────┬─────────┘
  │   │                               │ 0..N
  │   │                      ┌────────▼─────────┐
  │   └───────── 0..N ───────│ galeria_imagenes │  (evidencia; alt obligatorio)
  │                          └──────────────────┘
  │ 1:N
┌─▼──────────────┐
│ convocatorias  │  tipo: padrinos | comunidades | voluntariado | general
│ abre_en …      │  ventana de fechas; sin solapamiento por proyecto+tipo
│ … cierra_en    │
└─┬────────────┬─┘
  │ 1:N        │ 1:N
  │            │
┌─▼──────────────────────┐   ┌─────────────────────────┐
│ inscripciones_padrinos │   │ postulaciones_comunidad │   ← NINGUNA guarda datos
│  (sin datos del niño)  │   │  (solo número aprox.)   │      de menores (X-06)
└────────────────────────┘   └─────────────────────────┘

    Formularios que NO dependen de una convocatoria:

┌──────────────────┐  ┌───────────────────────────┐  ┌─────────────────────┐  ┌───────────────────┐
│ solicitudes_cita │  │ inscripciones_voluntariado│  │ solicitudes_alianza │  │ mensajes_contacto │
│  (el dato más    │  │  areas_interes text[]     │  │  (institucional)    │  │                   │
│   sensible)      │  │                           │  │  ──► proyectos      │  │                   │
└────────┬─────────┘  └─────────────┬─────────────┘  └──────────┬──────────┘  └─────────┬─────────┘
         │                          │                           │                       │
         └──────────────┬───────────┴───────────────────────────┴───────────────────────┘
                        │  (entidad, entidad_id) — relación polimórfica, sin FK
             ┌──────────▼───────────┐        ┌──────────────────────────┐
             │    notas_internas    │        │ notificaciones_pendientes│──► n8n ──► Resend
             │  (solo el equipo)    │        │  cola durable, reintentos│
             └──────────────────────┘        └──────────────────────────┘

    Tablas de configuración y operación (sin relaciones):

┌────────────────────────┐  ┌────────────────────┐  ┌──────────────────────┐
│        ajustes         │  │  instagram_posts   │  │  tareas_programadas  │
│ clave → valor jsonb    │  │ caché del feed +   │  │ última ejecución de  │
│ datos bancarios, Yappy,│  │ bandera `oculto`   │  │ cada job de RF-15    │
│ bloque de crisis       │  │                    │  │                      │
└────────────────────────┘  └────────────────────┘  └──────────────────────┘

    Lo que el filtro anti-spam aparta, para que nada se descarte en silencio (RNF-22):

┌──────────────────────────┐
│  envios_en_cuarentena    │  carga del envío rechazado + motivo del rechazo
│  solo administrador      │  revisión manual; 90 días y se borra
└──────────────────────────┘
```

**Lo que el diagrama dice y hay que leer dos veces:**

- De `inscripciones_padrinos` y de `postulaciones_comunidad` **no sale ninguna flecha hacia un niño**.
  No hay tabla, no hay columna, no hay lista nominal. Es el diseño, no un olvido (X-06).
- `notas_internas` y `notificaciones_pendientes` cuelgan de cualquier formulario por `(entidad,
  entidad_id)`, sin llave foránea. El precio de esa flexibilidad es que **las funciones de purga
  tienen que borrarlas a mano** cuando borran el registro padre; está resuelto en §5.
- `bitacora` no tiene flechas de salida porque nadie la modifica. Guarda el correo del actor como
  copia, para que la entrada siga siendo legible aunque el perfil se elimine después.
- `envios_en_cuarentena` tampoco tiene flechas: no cuelga de ningún formulario, porque su fila
  **nunca llegó a ser un registro**. Guarda el envío que el filtro anti-spam rechazó, con su motivo,
  para que un administrador lo revise. Es lo que impide que un descarte automático se lleve por
  delante una solicitud de ayuda legítima (RNF-22).

---

# 3. Las tablas

## 3.0 Tipos, funciones auxiliares y disparadores comunes

Va primero porque todo lo demás lo usa.

```sql
-- ---------------------------------------------------------------------------
-- 3.0.1  Marca de última modificación
-- ---------------------------------------------------------------------------
create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3.0.2  ¿Quién está pidiendo esto?
--
-- SECURITY DEFINER por dos razones:
--   (a) evita la recursión infinita de una política sobre `perfiles` que
--       necesite consultar `perfiles`;
--   (b) permite revocar el acceso directo a `perfiles` y aun así poder
--       preguntar por el rol.
-- `select auth.uid()` va envuelto en subconsulta a propósito: PostgreSQL la
-- evalúa una sola vez por consulta en lugar de una vez por fila. Con pocas
-- filas da igual; con la bandeja llena, no.
-- ---------------------------------------------------------------------------
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.perfiles p
    where p.id = (select auth.uid())
      and p.activo
      and p.rol = 'administrador'
  );
$$;

create or replace function public.es_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.perfiles p
    where p.id = (select auth.uid())
      and p.activo
      and p.rol in ('administrador', 'editor')
  );
$$;

revoke all on function public.es_admin()  from public, anon;
revoke all on function public.es_editor() from public, anon;
grant execute on function public.es_admin()  to authenticated;
grant execute on function public.es_editor() to authenticated;
```

**Por qué hay dos roles y no uno.** Quien edita noticias no tiene por qué leer una solicitud de cita
psicológica. Es el control de acceso más barato del proyecto y el que más daño evita: el día que
Edwin le dé acceso a alguien de redes sociales (O-03, que lleva meses buscándolo), esa persona podrá
publicar sin ver a quién está pidiendo ayuda. Origen: RF-04 y la recomendación de roles separados del
[anexo de investigación](./anexos/investigacion-tecnica-2026-09-06.md).

```sql
-- ---------------------------------------------------------------------------
-- 3.0.3  Punto de partida de permisos: quitar lo que Supabase regala
--
-- Supabase concede por defecto privilegios amplios a `anon` y `authenticated`
-- sobre el esquema `public`. RLS los filtra, pero el principio correcto es al
-- revés: primero se quita todo, después se concede lo justo. Así, un fallo en
-- una política no deja una tabla abierta — deja un error de permisos.
-- ---------------------------------------------------------------------------
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon;

alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
```

Este bloque va en la **primera migración**, antes de crear ninguna tabla. Los dos `revoke all` no
hacen nada sobre un esquema vacío; los que trabajan son los `alter default privileges`, que aplican a
todo lo que se cree después. Las concesiones puntuales se hacen tabla por tabla en §4.2.

**El anónimo nunca escribe en la base.** Ninguna tabla concede `insert` a `anon`. Los formularios
públicos no llegan a PostgREST: llegan a un Server Action de Next.js que valida con Zod y escribe con
la clave de servicio ([`../CLAUDE.md`](../CLAUDE.md) §6). Consecuencia práctica: aunque alguien saque
la clave pública del HTML —cosa que puede hacer cualquiera, porque para eso está—, no puede insertar
una sola fila. La prueba negativa de §4 lo verifica tabla por tabla.

---

## 3.1 `perfiles`

**Para qué existe.** Guarda el rol y el estado de cada persona con acceso al panel. Supabase Auth
guarda la identidad (correo, contraseña con hash, segundo factor); lo que Auth no sabe es si esta
persona es administradora o editora, ni si sigue trabajando con la fundación.

```sql
create table public.perfiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  correo            text        not null,
  nombre            text        not null check (length(btrim(nombre)) > 1),
  rol               text        not null default 'editor'
                                check (rol in ('administrador', 'editor')),
  activo            boolean     not null default false,
  ultimo_acceso_en  timestamptz,
  creado_en         timestamptz not null default now(),
  actualizado_en    timestamptz not null default now()
);

create unique index perfiles_correo_unico_idx on public.perfiles (lower(correo));
create index perfiles_activos_idx on public.perfiles (rol) where activo;

create trigger perfiles_tocar
  before update on public.perfiles
  for each row execute function public.tocar_actualizado_en();

alter table public.perfiles enable row level security;
```

**Campos que no se explican solos:**

- `activo` nace en **`false`**. Una cuenta recién creada no puede hacer nada hasta que un
  administrador la active. Si alguien logra registrarse por un descuido de configuración de Auth,
  entra a un panel vacío.
- `correo` está duplicado respecto de `auth.users`. Es a propósito: las políticas RLS y la bitácora
  no deben tener que leer el esquema `auth`, y el correo tiene que seguir siendo legible en una
  entrada de auditoría de hace un año aunque la cuenta ya no exista.
- `ultimo_acceso_en` es lo que permite detectar la cuenta olvidada. En el traspaso
  ([`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md)) hay una revisión anual: quien no
  entra en un año se desactiva.

```sql
-- Perfil automático al crearse un usuario de Auth: inactivo y sin permisos.
create or replace function public.crear_perfil_para_usuario_nuevo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, correo, nombre, rol, activo)
  values (
    new.id,
    new.email,
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
  for each row execute function public.crear_perfil_para_usuario_nuevo();
```

> **Configuración de Supabase Auth, no de SQL:** el registro público se deshabilita
> (*Authentication → Providers → Email → Disable signup*). Las cuentas se crean por invitación. El
> segundo factor obligatorio (RF-04) también se configura ahí, no aquí.

---

## 3.2 `proyectos`

**Para qué existe.** El catálogo entero: los proyectos y las campañas. Es la tabla que sostiene el
requisito raíz (O-04) — la fundación no es solo salud mental, y el sitio tiene que poder demostrarlo
con páginas iguales en jerarquía.

**Una tabla, dos colecciones.** Las campañas no tienen tabla propia: las distingue la columna `tipo`,
y de ella salen las dos rutas (`/proyectos/{slug}` y `/campanas/{slug}`). Partirla en dos duplicaría
las cinco claves foráneas que apuntan a `proyectos.id` y sus políticas RLS, a cambio de nada. El
porqué de la separación está en
[`10-migracion-catalogo-2026-10.md`](./10-migracion-catalogo-2026-10.md).

```sql
create table public.proyectos (
  id                       uuid        primary key default gen_random_uuid(),
  slug                     text        not null unique
                                       check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tipo                     text        not null default 'proyecto'
                                       check (tipo in ('proyecto', 'campana')),
  nombre                   text        not null check (length(btrim(nombre)) > 2),
  nombre_corto             text        not null check (length(btrim(nombre_corto)) > 2),
  resumen                  text        not null check (length(btrim(resumen)) between 20 and 240),
  historia                 text,
  en_honor_a               text,
  poblacion_objetivo       text,
  requisitos_participacion text,
  logo_url                 text,
  logo_alt                 text,
  logo_fondo               text        check (logo_fondo ~ '^#[0-9a-f]{6}$'),
  imagen_portada_url       text,
  imagen_portada_alt       text,
  color_acento             text        check (color_acento ~ '^#[0-9a-f]{6}$'),
  color_marca              text        check (color_marca ~ '^#[0-9a-f]{6}$'),
  accion_etiqueta          text,
  accion_url               text,
  bloque_crisis            boolean     not null default false,
  orden                    smallint    not null default 100,
  activo                   boolean     not null default true,
  creado_en                timestamptz not null default now(),
  actualizado_en           timestamptz not null default now(),

  constraint proyectos_alt_del_logo check (logo_url is null or logo_alt is not null),
  constraint proyectos_alt_de_portada
    check (imagen_portada_url is null or imagen_portada_alt is not null)
);

create index proyectos_publicos_idx on public.proyectos (tipo, orden, nombre) where activo;

create trigger proyectos_tocar
  before update on public.proyectos
  for each row execute function public.tocar_actualizado_en();

alter table public.proyectos enable row level security;
```

**Campos que no se explican solos:**

- `slug` es la URL en español que exige RF-14 (`/proyectos/historias-que-sanan`). El `CHECK` impide
  mayúsculas, tildes y espacios, que son las tres formas habituales de romper una URL.
- **No hay `CHECK` que limite `slug` al catálogo actual.** Es deliberado: C-07 pide que el sitio sea
  extensible y que Edwin pueda abrir una sección nueva. El noveno proyecto se agrega desde el panel,
  no con una migración — y hay una tercera campaña en camino, esperando su logo.
- `tipo` decide la colección y, con ella, la URL: `proyecto` sirve en `/proyectos/{slug}` y `campana`
  en `/campanas/{slug}`. El `slug` es único **en toda la tabla**, no por tipo, así que una entrada no
  puede cambiar de colección y colisionar con otra.
- `logo_fondo` es el color de fondo **medido del propio archivo del logo**. De los once logos de la
  fundación, solo el institucional tiene transparencia; los demás son PNG con el fondo horneado, y
  distinto cada uno. La placa que los enmarca usa este color, de modo que el borde del PNG desaparece
  contra ella. Cuando lleguen los logos vectoriales o con alfa (pendiente con Edwin), la columna
  queda en `null` y la placa cae al color de superficie.
- `color_marca` es el color **real** del logo, para mostrarlo tal cual. `color_acento` es el mismo
  matiz ya **oscurecido hasta pasar 4.5:1** sobre los dos papeles, y es el único que se usa para
  texto o para trazos. Separarlos evita la tentación recurrente de usar el color de marca crudo: el
  turquesa `#007878` se queda en 4,32:1 y el naranja `#f07800` en 2,59:1. Ninguno llega a AA.
- `bloque_crisis` en `true` obliga a que la página cierre con el bloque completo de recursos
  (RF-11, CLAUDE.md §5.1). Hoy lo llevan `psicoeducativo`, `rompiendo-el-circulo`,
  `historias-que-sanan` y las dos campañas. Es un control de seguridad, no una preferencia: el panel
  lo deja activar libremente, pero **desactivarlo pide confirmación explícita**.
- `historia` y `en_honor_a` no son adorno. O-06: cada proyecto nació de una historia y va en honor a
  alguien; es lo que distingue a REFUVA de una ONG genérica. Están separados del `resumen` porque el
  índice de proyectos muestra el resumen y la página de detalle muestra la historia completa.
- `nombre_corto` existe porque «Campaña del Día Mundial para la Prevención del Suicidio» no cabe en
  una tarjeta ni en un menú, y truncar con puntos suspensivos el nombre de una campaña a veces cambia
  el sentido.
- `orden` decide la posición en el Inicio. Edwin decide ese orden (C-11: «usted es el dueño de su
  página»), así que es un campo editable y no una constante en el código. Las semillas usan saltos de
  10 para poder meter uno en medio sin renumerar todo.
- `accion_etiqueta` y `accion_url` son la acción propia de cada entrada que pide RF-06: en
  `una-estrella-otiliana` apuntan al formulario de padrinos; en `psicoeducativo`, al de alianza
  institucional.
- `activo` en `false` **oculta el proyecto del sitio público sin borrarlo** (C-06 aplicado a
  proyectos, no solo a eventos).

🔴 **Pendiente:** el texto de `historia`, `poblacion_objetivo`, `requisitos_participacion`, las fotos
de actividad y los logos de `psicoeducativo` y `psicoempresarial` — los dos únicos que no llegaron en
el material de octubre. Los debe Edwin (P-08), pedidos en
[`06-inventario-contenido.md`](./06-inventario-contenido.md). Las semillas de §7 crean las diez filas
con el texto oficial de la fundación y el resto en `null`.

De `en_honor_a` solo hay **tres confirmados**: Otilia (la abuela de Edwin), Jessica y las familias de
la pandemia. Los otros siete están en blanco a propósito. Inventarlos sería lo peor que se le puede
hacer a este campo.

---

## 3.3 `contenidos`

**Para qué existe.** Noticias y eventos, en una sola tabla. Es la tabla de RF-01 y la que decide si
AC-04 se cumple: que Edwin publique y oculte una noticia sin nosotros.

**Por qué noticias y eventos comparten tabla.** Comparten el 90 % de los campos, el mismo editor, el
mismo flujo de estados y el mismo listado en el panel. Separarlas duplicaría la pantalla de edición y
obligaría a Edwin a aprender dos. Lo que las distingue es que un evento tiene fecha y por eso caduca.

```sql
create table public.contenidos (
  id                  uuid        primary key default gen_random_uuid(),
  tipo                text        not null check (tipo in ('noticia', 'evento')),
  estado              text        not null default 'borrador'
                                  check (estado in ('borrador', 'publicado', 'archivado')),
  titulo              text        not null check (length(btrim(titulo)) between 5 and 160),
  slug                text        not null unique
                                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  resumen             text        check (length(btrim(resumen)) between 20 and 300),
  cuerpo              text,
  imagen_portada_url  text,
  imagen_portada_alt  text,
  proyecto_id         uuid        references public.proyectos (id) on delete set null,
  destacado           boolean     not null default false,

  -- Solo para tipo = 'evento'
  fecha_inicio        timestamptz,
  fecha_fin           timestamptz,
  lugar               text,
  direccion           text,
  inscripcion_url     text,

  publicado_en        timestamptz,
  creado_por          uuid        references public.perfiles (id) on delete set null,
  actualizado_por     uuid        references public.perfiles (id) on delete set null,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now(),
  eliminado_en        timestamptz,

  constraint evento_necesita_fecha
    check (tipo <> 'evento' or fecha_inicio is not null),
  constraint noticia_sin_fechas_de_evento
    check (tipo <> 'noticia' or (fecha_inicio is null and fecha_fin is null)),
  constraint fin_despues_del_inicio
    check (fecha_fin is null or fecha_inicio is null or fecha_fin >= fecha_inicio),
  constraint publicado_necesita_resumen_y_fecha
    check (estado <> 'publicado' or (resumen is not null and publicado_en is not null)),
  constraint publicado_necesita_texto_alternativo
    check (
      estado <> 'publicado'
      or imagen_portada_url is null
      or (imagen_portada_alt is not null and length(btrim(imagen_portada_alt)) >= 5)
    )
);

-- Listado público de noticias, paginado por fecha (§9.2).
create index contenidos_noticias_publicas_idx
  on public.contenidos (publicado_en desc, id desc)
  where tipo = 'noticia' and estado = 'publicado' and eliminado_en is null;

-- Próximos eventos (§9.1). El predicado solo usa expresiones inmutables:
-- el filtro contra `now()` va en la consulta, no en el índice.
create index contenidos_eventos_publicos_idx
  on public.contenidos (fecha_inicio)
  where tipo = 'evento' and estado = 'publicado' and eliminado_en is null;

create index contenidos_por_proyecto_idx
  on public.contenidos (proyecto_id, publicado_en desc)
  where estado = 'publicado' and eliminado_en is null;

create trigger contenidos_tocar
  before update on public.contenidos
  for each row execute function public.tocar_actualizado_en();

alter table public.contenidos enable row level security;
```

**Campos que no se explican solos:**

- `estado` implementa los tres verbos que Edwin usa: *guardar sin publicar* (`borrador`), *publicar*
  (`publicado`) y *ocultar lo que ya pasó* (`archivado`). C-06 pidió ocultar además de borrar; esta
  columna es esa petición.
- `eliminado_en` es el **borrado lógico**. Borrar desde el panel marca la fecha y la fila desaparece
  del sitio y del listado, pero sobrevive por si fue un error. El contenido no es dato personal y no
  caduca (§5).
- `publicado_en` no es lo mismo que `creado_en`: una noticia escrita en borrador el lunes y publicada
  el viernes se ordena por el viernes. Es la fecha que ve el visitante.
- `constraint publicado_necesita_texto_alternativo` convierte en regla de base de datos lo que RF-01
  declara: **el texto alternativo es obligatorio para publicar**. Se puede guardar un borrador sin
  alt; no se puede publicar. Es la única forma de que la exigencia sobreviva a nuestra salida.
- `slug` es único **para siempre**, incluso para filas eliminadas. Una URL que se publicó y se
  compartió por WhatsApp no se reasigna nunca a otro contenido. RF-14 pide además que cada edición de
  un evento recurrente tenga página propia: `fiesta-navidena-2026` y `fiesta-navidena-2025` son dos
  filas, dos slugs, dos páginas.
- `proyecto_id` es opcional y `on delete set null`: si algún día se elimina un proyecto, sus noticias
  no se van con él.
- `destacado` es lo que sube una noticia al Inicio. Existe para que Edwin controle la portada sin
  pedirnos un despliegue.

---

## 3.4 `galeria_imagenes`

**Para qué existe.** La evidencia fotográfica de cada proyecto (RF-06) y de cada noticia. Es lo que
la fundación le enseña a un patrocinador (O-07) y por eso no puede vivir solo en el OneDrive que
Edwin paga de su bolsillo (R-06).

```sql
create table public.galeria_imagenes (
  id                        uuid        primary key default gen_random_uuid(),
  proyecto_id               uuid        references public.proyectos (id)  on delete cascade,
  contenido_id              uuid        references public.contenidos (id) on delete cascade,
  ruta_storage              text        not null,
  alt                       text        not null check (length(btrim(alt)) >= 5),
  pie                       text,
  ancho                     integer     check (ancho > 0),
  alto                      integer     check (alto  > 0),
  orden                     smallint    not null default 100,
  requiere_consentimiento   boolean     not null default false,
  consentimiento_registrado boolean     not null default false,
  subido_por                uuid        references public.perfiles (id) on delete set null,
  creado_en                 timestamptz not null default now(),

  constraint pertenece_a_uno_solo
    check (num_nonnulls(proyecto_id, contenido_id) = 1),
  constraint sin_consentimiento_no_se_guarda
    check (not requiere_consentimiento or consentimiento_registrado)
);

create index galeria_por_proyecto_idx  on public.galeria_imagenes (proyecto_id, orden);
create index galeria_por_contenido_idx on public.galeria_imagenes (contenido_id, orden);

alter table public.galeria_imagenes enable row level security;
```

**Campos que no se explican solos:**

- `alt` es **`not null`, siempre**, no solo al publicar. Una foto de galería sin alt no tiene ningún
  uso legítimo, y las imágenes sin texto alternativo son una de las tres fallas de accesibilidad más
  frecuentes de la web. Origen: WCAG 2.2 AA, [`../CLAUDE.md`](../CLAUDE.md) §5.4.
- `ancho` y `alto` se guardan al subir para poder renderizar con `next/image` sin salto de diseño.
  El CLS es el riesgo obvio de un sitio lleno de fotos (AC-08).
- `requiere_consentimiento` + `consentimiento_registrado`, con su `CHECK`, hacen **imposible guardar
  una foto que necesita consentimiento sin haberlo registrado**. Aplica a fotos de niños
  beneficiarios y de personas en situación de calle (§6.4 del SRS). Es una regla ética que se hace
  cumplir con una restricción, no con un recordatorio en un manual que nadie leerá en 2028.
- `ruta_storage` guarda la ruta dentro del bucket de Supabase Storage, no la URL completa. Si algún
  día se migra el almacenamiento, cambia el prefijo en un lugar y no en 400 filas.

🔴 **Pendiente:** si existe consentimiento firmado para publicar fotos de niños beneficiarios y de
personas en situación de calle. Lo debe Edwin. Mientras no exista, `requiere_consentimiento = true`
bloquea esas cargas, que es exactamente el comportamiento correcto.

---

## 3.5 `convocatorias`

**Para qué existe.** Una campaña que se abre y se cierra en fechas: los padrinos de la fiesta
navideña, las postulaciones de comunidades, una llamada puntual de voluntarios. RF-13 y RF-07.

```sql
-- Requiere la extensión btree_gist para la restricción de solapamiento.
-- Se habilita desde el panel de Supabase (Database → Extensions → btree_gist).
create extension if not exists btree_gist;

create table public.convocatorias (
  id                   uuid        primary key default gen_random_uuid(),
  proyecto_id          uuid        not null references public.proyectos (id) on delete restrict,
  tipo                 text        not null
                                   check (tipo in ('padrinos', 'comunidades',
                                                   'voluntariado', 'general')),
  titulo               text        not null check (length(btrim(titulo)) between 5 and 160),
  descripcion          text,
  requisitos           text,
  texto_si_cerrada     text,
  abre_en              timestamptz not null,
  cierra_en            timestamptz not null,
  cerrada_manualmente  boolean     not null default false,
  cerrada_en           timestamptz,
  cupo_maximo          integer     check (cupo_maximo is null or cupo_maximo > 0),
  creado_por           uuid        references public.perfiles (id) on delete set null,
  creado_en            timestamptz not null default now(),
  actualizado_en       timestamptz not null default now(),

  constraint cierra_despues_de_abrir check (cierra_en > abre_en),
  constraint sin_convocatorias_solapadas
    exclude using gist (
      proyecto_id with =,
      tipo        with =,
      tstzrange(abre_en, cierra_en) with &&
    )
);

create index convocatorias_por_ventana_idx
  on public.convocatorias (proyecto_id, tipo, abre_en desc);

create trigger convocatorias_tocar
  before update on public.convocatorias
  for each row execute function public.tocar_actualizado_en();

alter table public.convocatorias enable row level security;

-- La única definición de «está abierta». La usan el sitio y el panel.
create or replace function public.convocatoria_abierta(p_convocatoria_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.convocatorias c
    where c.id = p_convocatoria_id
      and not c.cerrada_manualmente
      and now() >= c.abre_en
      and now() <  c.cierra_en
  );
$$;
```

**Campos que no se explican solos:**

- **No hay columna `estado`.** Estar abierta es una función de la hora actual y de las dos fechas.
  Si `estado` fuera una columna, el sitio diría la verdad solo mientras un cron siguiera corriendo —
  y el equipo se retira (X-01). `cerrada_manualmente` es la única forma de cerrar antes de tiempo, y
  es una decisión humana explícita, no un estado que se desincroniza.
- `cerrada_en` **no cierra nada**: es el registro de cuándo el trabajo programado detectó el cierre y
  envió el aviso (RF-15). Sirve para auditar, no para decidir.
- `texto_si_cerrada` es lo que ve quien llega tarde. RF-07 exige que, con la convocatoria cerrada, se
  explique cuándo vuelve a abrir. Ese texto lo escribe Edwin; no está en el código.
- `on delete restrict` en `proyecto_id`: no se borra un proyecto con convocatorias e inscripciones
  colgando. Falla ruidosamente, que es lo correcto.
- `sin_convocatorias_solapadas` impide dos convocatorias de padrinos del mismo proyecto abiertas a la
  vez. Sin ella, un envío no sabría a cuál pertenece. Si `btree_gist` no estuviera disponible, la
  alternativa es validarlo en el Server Action; la restricción de base de datos es mejor porque no se
  olvida.
- `cupo_maximo` es opcional y **no se usa en la fiesta navideña**: REFUVA no rechaza padrinos. Existe
  por si alguna jornada tiene aforo real. 🟡 Inferido; confirmar con Edwin. Es el pendiente 12 de §10.

---

## 3.6 Lo que comparten todas las tablas de formulario

Las seis tablas siguientes reciben datos de personas. Todas repiten la misma estructura, y conviene
decirla una vez:

| Columna | Por qué está en todas |
|---|---|
| `estado` | `pendiente` → `en_gestion` → `atendida` \| `cerrada_sin_atender`. Los cuatro estados de RF-12. |
| `consentimiento_en timestamptz not null` | No hay booleano de consentimiento: hay **fecha**. Una casilla marcada sin cuándo no prueba nada. Y al ser `not null`, **una fila sin consentimiento no puede existir**. Casilla activa, nunca premarcada (§6.2 del SRS). |
| `politica_version text not null` | Qué versión de la política de privacidad aceptó esta persona. Cuando el texto cambie, se sabrá quién aceptó cuál. |
| `atendida_por`, `atendida_en` | Quién la gestionó y cuándo. Alimenta la bitácora y el aviso de solicitudes sin atender. |
| `creado_en`, `actualizado_en` | Antigüedad para el orden de la bandeja y para la purga por retención. |

Y lo que **no** está en ninguna, que importa más:

- **No se guarda la dirección IP ni la cadena del navegador.** No hacen falta para atender a nadie y
  son dato personal. La protección contra envíos automatizados se resuelve con campo trampa y
  limitación de frecuencia en el borde, no con CAPTCHA visual: alguien en crisis no debería tener que
  descifrar imágenes para pedir ayuda (§6.5 del SRS).
- **No hay columna de diagnóstico, síntomas, medicación ni relato clínico** (X-05, RF-02).
- **No hay ningún dato de un menor de edad** (X-06).
- **No hay columna de monto** en padrinos. REFUVA no fija monto (P-02).

---

## 3.7 `solicitudes_cita`

**Para qué existe.** Sacar las consultas de WhatsApp (S-04, R-03, C-03). Es **el dato más sensible
del sistema**: lo escribe alguien que está pidiendo ayuda psicológica y puede estar en crisis.

```sql
create table public.solicitudes_cita (
  id                  uuid        primary key default gen_random_uuid(),

  nombre              text        not null check (length(btrim(nombre)) between 2 and 120),
  correo              text        check (correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono            text        check (length(btrim(telefono)) between 6 and 25),
  contacto_preferido  text        not null
                                  check (contacto_preferido in ('correo', 'telefono', 'whatsapp')),

  motivo              text        check (motivo is null
                                         or length(btrim(motivo)) between 5 and 280),
  modalidad           text        not null
                                  check (modalidad in ('virtual', 'presencial', 'cualquiera')),
  disponibilidad      text        not null check (length(btrim(disponibilidad)) between 3 and 200),
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
      (contacto_preferido = 'correo'                  and correo   is not null)
      or (contacto_preferido in ('telefono','whatsapp') and telefono is not null)
    )
);

-- La bandeja: pendientes, la más vieja primero (RF-12, §9.3).
create index solicitudes_cita_pendientes_idx
  on public.solicitudes_cita (creado_en)
  where estado in ('pendiente', 'en_gestion');

-- Purga por retención (§5).
create index solicitudes_cita_creado_en_idx on public.solicitudes_cita (creado_en);

create trigger solicitudes_cita_tocar
  before update on public.solicitudes_cita
  for each row execute function public.tocar_actualizado_en();

alter table public.solicitudes_cita enable row level security;
```

**Campos que no se explican solos:**

- `motivo` es **opcional** y está limitado a **280 caracteres**. Opcional porque manda la
  minimización (RNF-09 de [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md)):
  quien está pidiendo ayuda no tiene que justificarse por escrito para conseguir una cita, y un campo
  obligatorio en ese lugar es una barrera. Si decide escribirlo, la restricción exige entre 5 y 280
  caracteres tras recortar espacios: ni un `''` disfrazado de respuesta ni un relato clínico que
  nadie tiene capacidad de custodiar. RF-02 pide «motivo de consulta **en una línea**»; el formulario
  muestra el contador. Si la persona necesita contar más, lo contará en la sesión, que es donde
  corresponde.
- `atencion_pronto` es la casilla opcional «necesito que me contacten pronto» que pide HU-37. No
  cambia el orden de la bandeja —eso lo decide la antigüedad (§9.3)— pero **marca el asunto del aviso
  a la administración**, que es lo único que se ve sin abrir el panel. Es booleana, `not null` y nace
  en `false`: una casilla que nadie marcó no es una urgencia, y el `default` evita que un envío viejo
  quede en un tercer estado ambiguo.
- `contacto_preferido` existe porque no todo el mundo tiene correo, y el sitio no puede exigirlo. Si
  la persona elige WhatsApp, el correo de confirmación de RF-02 simplemente no se envía y la
  administración la contacta por su canal. El `CHECK` garantiza que siempre haya *alguna* forma de
  responder: una solicitud a la que no se puede contestar es peor que ninguna.
- `disponibilidad` es texto libre a propósito («mañanas entre semana», «después de las 5»). v1 **no
  reserva horarios** (RF-02, ADR-0004): esto es una solicitud, no una reserva. Un selector de
  calendario prometería una disponibilidad que la fundación no puede garantizar hoy.
- `modalidad` incluye `cualquiera` porque hay gente a la que le da igual con tal de ser atendida.
  🔴 Las modalidades que REFUVA ofrece de verdad (virtual, presencial o ambas) son un pendiente de
  Edwin (S-05); si resulta que solo hay una, el formulario deja de preguntar y el campo se llena
  desde `ajustes`.
- El índice de pendientes incluye `en_gestion` a propósito: una solicitud que alguien abrió y dejó a
  medias sigue siendo alguien esperando.

> **El contenido de este formulario nunca viaja en el correo a la administración.** Ese aviso lleva
> el tipo de solicitud, el programa, la fecha y un enlace al panel autenticado. Nada más. Si el
> cuerpo llevara el motivo de consulta, ese texto quedaría replicado para siempre en un buzón
> personal, fuera de todo control y fuera de esta política de retención. La **confirmación al
> solicitante** es otra cosa y sí puede devolverle lo que escribió: va a su propio buzón y el dato es
> suyo. Origen: RNF-14 de [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md) y el
> [anexo de investigación](./anexos/investigacion-tecnica-2026-09-06.md); se implementa en §3.17.

---

## 3.8 `inscripciones_voluntariado`

**Para qué existe.** Que alguien ofrezca su tiempo o su oficio sin escribirle a Edwin por chat
(RF-03, HU-12). La clasificación por área es lo que convierte una lista de nombres en algo usable.

```sql
create table public.inscripciones_voluntariado (
  id                 uuid        primary key default gen_random_uuid(),

  nombre             text        not null check (length(btrim(nombre)) between 2 and 120),
  correo             text        not null
                                 check (correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono           text        check (length(btrim(telefono)) between 6 and 25),

  areas_interes      text[]      not null
                                 check (cardinality(areas_interes) between 1 and 8)
                                 check (areas_interes <@ array[
                                   'redes-sociales', 'diseno', 'logistica', 'psicologia',
                                   'escritura', 'transporte', 'cocina', 'otra'
                                 ]::text[]),
  otra_area          text,
  proyecto_id        uuid        references public.proyectos (id) on delete set null,
  disponibilidad     text        not null check (length(btrim(disponibilidad)) between 3 and 200),
  experiencia        text        check (length(btrim(experiencia)) <= 500),

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

-- Filtro por área en la bandeja y en la exportación (RF-03, 3.2.6).
create index voluntariado_areas_idx on public.inscripciones_voluntariado using gin (areas_interes);
create index voluntariado_pendientes_idx
  on public.inscripciones_voluntariado (creado_en)
  where estado in ('pendiente', 'en_gestion');

create trigger voluntariado_tocar
  before update on public.inscripciones_voluntariado
  for each row execute function public.tocar_actualizado_en();

alter table public.inscripciones_voluntariado enable row level security;
```

**Campos que no se explican solos:**

- `areas_interes` es un `text[]` porque la selección es múltiple (RF-03). Las ocho opciones son
  exactamente las que enumera RF-03. El `CHECK` con `<@` garantiza que nadie meta un valor que la
  interfaz no ofrece, y el índice **GIN** hace que `where areas_interes @> array['diseno']` sea
  instantáneo, que es la consulta real de la exportación.
- **Se guarda el arreglo, no una tabla de unión.** Con decenas o cientos de filas y ocho valores
  fijos, una tabla `voluntario_areas` añadiría un join a cada consulta sin ganar nada.
- `otra_area` con su `CHECK`: si alguien marca «otra», tiene que decir cuál. Una fila con «otra» y
  nada más no le sirve a nadie.
- `proyecto_id` es la **preferencia** de proyecto, no una asignación. Puede ser `null`: hay gente que
  quiere ayudar en lo que haga falta.
- `experiencia` está limitado a 500 caracteres. Es un campo opcional y descriptivo; no es un currículo
  ni un espacio para datos que no pedimos.
- `correo` es obligatorio aquí y no lo era en `solicitudes_cita`. Es una decisión deliberada: para
  organizar la logística de una jornada hay que poder escribirle a la gente en lote, y quien se ofrece
  a ayudar no está en crisis. Quien pide ayuda, sí puede no tener correo.

---

## 3.9 `inscripciones_padrinos`

**Para qué existe.** La convocatoria de padrinos y madrinas de la fiesta navideña (P-02, RF-03,
HU-13). Es la tabla que más disciplina exige, porque **toca a menores sin guardar un solo dato de un
menor**.

```sql
create table public.inscripciones_padrinos (
  id                 uuid        primary key default gen_random_uuid(),
  convocatoria_id    uuid        not null references public.convocatorias (id) on delete restrict,

  nombre             text        not null check (length(btrim(nombre)) between 2 and 120),
  correo             text        not null
                                 check (correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono           text        not null check (length(btrim(telefono)) between 6 and 25),

  cantidad_ninos     smallint    not null default 1
                                 check (cantidad_ninos between 1 and 10),
  forma_entrega      text        not null check (length(btrim(forma_entrega)) between 3 and 300),
  disponibilidad     text        check (length(btrim(disponibilidad)) <= 200),
  comentario         text        check (length(btrim(comentario)) <= 500),

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

create index padrinos_por_convocatoria_idx
  on public.inscripciones_padrinos (convocatoria_id, creado_en);
create index padrinos_pendientes_idx
  on public.inscripciones_padrinos (creado_en)
  where estado in ('pendiente', 'en_gestion');
create unique index padrinos_sin_duplicados_idx
  on public.inscripciones_padrinos (convocatoria_id, lower(correo));

create trigger padrinos_tocar
  before update on public.inscripciones_padrinos
  for each row execute function public.tocar_actualizado_en();

alter table public.inscripciones_padrinos enable row level security;
```

**Lo que hay que leer dos veces:**

- **No existe `nombre_del_nino`, ni `edad_del_nino`, ni `escuela`, ni `nino_id`.** No hay tabla de
  niños en ninguna parte del esquema. El emparejamiento padrino↔niño ocurre fuera de línea (X-06).
  Si en una revisión futura alguien propone añadir una de estas columnas, la respuesta está aquí y es
  no: haría falta antes una política escrita de datos de menores, y eso es V2-04 del SRS.
- **No existe columna de monto ni de valor del regalo.** El regalo es «conforme a lo que salga de su
  corazón» y **REFUVA no fija monto** (P-02). Una columna de monto crearía un mínimo implícito.
- `convocatoria_id` es `not null`: no se apadrina fuera de una convocatoria. Es lo que hace que el
  registro quede clasificado bajo el programa `navidad` sin necesitar una columna de texto que
  alguien pueda escribir mal (RF-03).
- `forma_entrega` es **texto libre**. 🔴 La lista cerrada de opciones (llevarlo al evento, entregarlo
  antes, coordinar con la fundación) es un pendiente de Edwin —el 6 de §10—; hasta que la defina, no
  la inventamos.
- **`cantidad_ninos` es un conteo agregado, nunca un dato de un niño.** Dice a cuántos quiere
  apadrinar esta persona; no dice quiénes son, ni su edad, ni su escuela, ni su comunidad. Un número
  sin nombre no identifica a nadie, y por eso esta columna no contradice el principio 2 de §1. Si
  alguien propone acompañarla de una columna con el nombre del niño, la respuesta está en §3.9 y es
  no.
- `cantidad_ninos` permite apadrinar a más de uno. 🟡 Inferido: Edwin habló de apadrinar «a un niño».
  El tope de 10 es una defensa contra el dedo pegado en el teclado, no una regla de la fundación.
  Confirmar el máximo real con Edwin: es el pendiente 7 de §10.
- `padrinos_sin_duplicados_idx` impide que la misma persona se inscriba dos veces en la misma
  convocatoria. Sin él, un doble clic en un teléfono lento crea dos padrinos y descuadra la logística.

---

## 3.10 `postulaciones_comunidad`

**Para qué existe.** Que alguien postule a su comunidad a la convocatoria navideña (P-02, RF-07,
HU-07). El requisito explícito es que sea un lugar en vulnerabilidad real donde los niños nunca han
vivido «esa magia».

```sql
create table public.postulaciones_comunidad (
  id                     uuid        primary key default gen_random_uuid(),
  convocatoria_id        uuid        not null references public.convocatorias (id) on delete restrict,

  nombre_postulante      text        not null check (length(btrim(nombre_postulante)) between 2 and 120),
  relacion_con_comunidad text        not null check (length(btrim(relacion_con_comunidad)) between 3 and 200),
  correo                 text        check (correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono               text        not null check (length(btrim(telefono)) between 6 and 25),

  comunidad_nombre       text        not null check (length(btrim(comunidad_nombre)) between 2 and 160),
  provincia              text        not null,
  distrito               text,
  corregimiento          text,
  referencia_ubicacion   text        check (length(btrim(referencia_ubicacion)) <= 300),

  ninos_aproximado       integer     not null check (ninos_aproximado between 1 and 1000),
  justificacion          text        not null check (length(btrim(justificacion)) between 20 and 1500),

  consentimiento_en      timestamptz not null,
  politica_version       text        not null,

  estado                 text        not null default 'pendiente'
                                     check (estado in ('pendiente', 'en_gestion',
                                                       'atendida', 'cerrada_sin_atender')),
  atendida_por           uuid        references public.perfiles (id) on delete set null,
  atendida_en            timestamptz,

  creado_en              timestamptz not null default now(),
  actualizado_en         timestamptz not null default now()
);

create index postulaciones_por_convocatoria_idx
  on public.postulaciones_comunidad (convocatoria_id, creado_en);
create index postulaciones_pendientes_idx
  on public.postulaciones_comunidad (creado_en)
  where estado in ('pendiente', 'en_gestion');

create trigger postulaciones_tocar
  before update on public.postulaciones_comunidad
  for each row execute function public.tocar_actualizado_en();

alter table public.postulaciones_comunidad enable row level security;
```

**Lo que hay que leer dos veces:**

- `ninos_aproximado` es un **entero**, y es lo único que se pregunta sobre los niños. Es un **conteo
  agregado, nunca un dato identificable de un niño**: dice cuántos hay en la comunidad, no quiénes
  son. RF-07 lo dice con todas las letras: número aproximado, **nunca lista nominal**. La columna se
  llama así para que quede claro en el propio esquema que es una estimación, no un censo.
- `justificacion` es donde el postulante explica por qué su comunidad cumple los requisitos. Los
  requisitos se muestran **antes** del formulario (RF-07), no después, y salen de
  `convocatorias.requisitos`.
- `provincia` es texto obligatorio, sin lista cerrada. 🟡 Las opciones exactas (provincias y comarcas
  de Panamá) las fija la interfaz; no se codifican en un `CHECK` porque una división administrativa
  mal transcrita en la base es más difícil de corregir que en un desplegable.
- `correo` es opcional aquí: quien postula a su comunidad puede perfectamente no tener uno. El
  teléfono sí es obligatorio, porque es cómo se le va a contestar.
- No hay campo de fotos de la comunidad. Se piden por el canal directo, si hacen falta, después de
  que la fundación decida hacer contacto.

---

## 3.11 `solicitudes_alianza`

**Para qué existe.** Que una escuela o una institución pida alianza desde la página del proyecto que
le interesa, por un canal **distinto** del contacto general (RF-08, HU-08). Hay más de 30 escuelas
en lista de espera del proyecto psicoeducativo (P-01); esta tabla es el embudo de esa lista.

```sql
create table public.solicitudes_alianza (
  id                  uuid        primary key default gen_random_uuid(),

  institucion         text        not null check (length(btrim(institucion)) between 2 and 200),
  tipo_institucion    text        not null
                                  check (tipo_institucion in ('escuela', 'empresa', 'ong',
                                                              'entidad-publica', 'otra')),
  nombre_contacto     text        not null check (length(btrim(nombre_contacto)) between 2 and 120),
  cargo               text        not null check (length(btrim(cargo)) between 2 and 120),
  correo              text        not null
                                  check (correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono            text        check (length(btrim(telefono)) between 6 and 25),

  proyecto_id         uuid        references public.proyectos (id) on delete set null,
  poblacion_estimada  integer     check (poblacion_estimada is null or poblacion_estimada > 0),
  mensaje             text        not null check (length(btrim(mensaje)) between 20 and 2000),

  consentimiento_en   timestamptz not null,
  politica_version    text        not null,

  estado              text        not null default 'pendiente'
                                  check (estado in ('pendiente', 'en_gestion',
                                                    'atendida', 'cerrada_sin_atender')),
  atendida_por        uuid        references public.perfiles (id) on delete set null,
  atendida_en         timestamptz,

  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now()
);

create index alianzas_pendientes_idx
  on public.solicitudes_alianza (creado_en)
  where estado in ('pendiente', 'en_gestion');
create index alianzas_por_proyecto_idx on public.solicitudes_alianza (proyecto_id, creado_en desc);

create trigger alianzas_tocar
  before update on public.solicitudes_alianza
  for each row execute function public.tocar_actualizado_en();

alter table public.solicitudes_alianza enable row level security;
```

**Campos que no se explican solos:**

- `cargo` es obligatorio porque una alianza institucional la firma alguien con capacidad de hacerlo.
  Sin cargo, la solicitud no se puede evaluar.
- `poblacion_estimada` es cuánta gente atendería la alianza (RF-08). Es el dato que permite priorizar
  entre 30 escuelas con un solo psicólogo.
- Aquí hay datos de una persona (nombre, cargo, correo) además de los de la institución. Por eso la
  tabla lleva RLS y retención igual que las demás, aunque el contenido sea menos sensible.

---

## 3.12 `mensajes_contacto`

**Para qué existe.** El formulario general (RF-10). Prioridad baja, pero se guarda en la base además
de enviarse por correo, porque **el correo se puede perder y la base de datos no**.

```sql
create table public.mensajes_contacto (
  id                 uuid        primary key default gen_random_uuid(),

  nombre             text        not null check (length(btrim(nombre)) between 2 and 120),
  correo             text        check (correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  telefono           text        check (length(btrim(telefono)) between 6 and 25),
  asunto             text        not null check (length(btrim(asunto)) between 3 and 160),
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

create index contacto_pendientes_idx
  on public.mensajes_contacto (creado_en)
  where estado in ('pendiente', 'en_gestion');

create trigger contacto_tocar
  before update on public.mensajes_contacto
  for each row execute function public.tocar_actualizado_en();

alter table public.mensajes_contacto enable row level security;
```

**Campos que no se explican solos:**

- `correo` **no es obligatorio**, y el `CHECK` de tabla `hay_forma_de_responder` exige a cambio que
  haya correo **o** teléfono. Es el mismo criterio que ya aplican `solicitudes_cita` (§3.7) y
  `postulaciones_comunidad` (§3.10), y por la misma razón: no todo el mundo tiene correo, y este
  formulario es justamente el que recibe a quien no encontró otra puerta. Lo que no se puede es dejar
  un mensaje al que nadie pueda contestar.

**Una advertencia de diseño de producto, no de base de datos.** Este formulario va a recibir
solicitudes de ayuda psicológica, porque la gente escribe donde ve un campo de texto. La bandeja de
contacto del panel debe mostrar el mismo aviso que el formulario de cita y permitir **mover un
mensaje a la bandeja de citas** con un clic. Sin eso, alguien pidiendo ayuda queda sepultado entre
consultas administrativas — que es exactamente lo que RF-12 quiere evitar.

---

## 3.13 `notas_internas`

**Para qué existe.** La nota interna por solicitud con autor y fecha que pide RF-12. Es la memoria
de la gestión: «la llamé el martes, no contestó».

```sql
create table public.notas_internas (
  id           uuid        primary key default gen_random_uuid(),
  entidad      text        not null
                           check (entidad in ('solicitudes_cita', 'inscripciones_voluntariado',
                                              'inscripciones_padrinos', 'postulaciones_comunidad',
                                              'solicitudes_alianza', 'mensajes_contacto')),
  entidad_id   uuid        not null,
  autor_id     uuid        references public.perfiles (id) on delete set null,
  autor_correo text        not null,
  texto        text        not null check (length(btrim(texto)) between 1 and 2000),
  creado_en    timestamptz not null default now()
);

create index notas_por_entidad_idx
  on public.notas_internas (entidad, entidad_id, creado_en desc);

alter table public.notas_internas enable row level security;
```

**Lo que hay que leer dos veces:**

- La relación es **polimórfica** (`entidad` + `entidad_id`) y por lo tanto **no hay llave foránea**.
  Es el precio de no crear seis tablas de notas idénticas. La consecuencia es real y hay que
  recordarla: **PostgreSQL no borrará estas notas en cascada**. Las funciones de purga de §5 borran
  las notas junto con su fila padre, y esa es la única garantía. Si alguien añade una tabla de
  formulario nueva, tiene que ampliar el `CHECK` de `entidad` **y** la purga.
- `autor_correo` se copia igual que en la bitácora: la nota tiene que seguir siendo legible aunque el
  perfil de quien la escribió se elimine.
- Estas notas contienen apreciaciones sobre personas. Las ve **solo un administrador**, nunca un
  editor, y nunca salen en ninguna exportación.

---

## 3.14 `ajustes`

**Para qué existe.** Todo lo que Edwin tiene que poder cambiar sin llamarnos: los datos bancarios, el
alias de Yappy, el número de WhatsApp, el precio de la consulta y **los textos del bloque de crisis**.
RF-09 lo dice sin rodeos: un número de cuenta quemado en el código es un error de diseño. Y RF-11
exige que el bloque de crisis sea editable y muestre su fecha de verificación.

```sql
create table public.ajustes (
  clave            text        primary key
                               check (clave ~ '^[a-z0-9]+(\.[a-z0-9_]+)+$'),
  valor            jsonb       not null,
  tipo             text        not null
                               check (tipo in ('texto', 'texto_largo', 'numero',
                                               'booleano', 'lista', 'enlace', 'archivo')),
  etiqueta         text        not null,
  ayuda            text,
  grupo            text        not null,
  orden            smallint    not null default 100,
  publico          boolean     not null default false,
  verificado_en    timestamptz,
  verificado_por   uuid        references public.perfiles (id) on delete set null,
  actualizado_por  uuid        references public.perfiles (id) on delete set null,
  actualizado_en   timestamptz not null default now()
);

create index ajustes_publicos_idx on public.ajustes (grupo, orden) where publico;

create trigger ajustes_tocar
  before update on public.ajustes
  for each row execute function public.tocar_actualizado_en();

alter table public.ajustes enable row level security;
```

**Campos que no se explican solos:**

- `clave` con puntos (`crisis.linea_147`, `donaciones.yappy_alias`) agrupa sin necesitar una tabla de
  categorías. El `CHECK` obliga a que haya al menos un punto: así nadie crea una clave suelta.
- `valor` es `jsonb` y no `text` porque el bloque de crisis es una **lista de recursos**, cada uno con
  nombre, número, descripción y enlace `tel:`. Un `text` obligaría a inventar un separador, y los
  separadores inventados siempre terminan apareciendo dentro del dato.
- **`publico` es una columna de seguridad, no de presentación.** Decide si el visitante anónimo puede
  leer la clave. El alias de Yappy y el bloque de crisis son públicos; el correo interno al que llegan
  los avisos, no. La política RLS de §4 se apoya exactamente en esta columna.
- `etiqueta` y `ayuda` son lo que ve Edwin en el panel. Sin ellas, la pantalla de ajustes sería una
  lista de claves técnicas — y el administrador es una persona no técnica que entra cada varias
  semanas y no recuerda dónde estaba nada (X-03). El texto de ayuda vive **en la base**, no en el
  código, para que se pueda corregir sin desplegar.
- `verificado_en` existe solo por RF-11: los números de crisis se muestran al administrador con la
  fecha en que alguien los comprobó por teléfono. Un número de una línea de prevención del suicidio
  que ya no contesta hace daño real, y un dato sin fecha de verificación envejece en silencio.

> **La 169 del MINSA y los números del INSAM no se siembran.** Están en conflicto entre fuentes y sin
> verificar. Alguien del equipo tiene que llamar y anotar qué contesta antes de crear esas claves
> ([`../CLAUDE.md`](../CLAUDE.md) §5.1). Las semillas de §7 solo incluyen 911 y la Línea 147.

---

## 3.15 `instagram_posts`

**Para qué existe.** La caché del feed de Instagram (RF-05). El navegador **nunca** llama a un
tercero: el servidor lee el feed una vez al día, lo guarda aquí y el sitio lo sirve desde aquí. Eso
elimina scripts externos, cookies de terceros y, con ellos, el banner de consentimiento.

```sql
create table public.instagram_posts (
  id                      uuid        primary key default gen_random_uuid(),
  id_externo              text        not null unique,
  permalink               text        not null,
  tipo_medio              text        not null
                                      check (tipo_medio in ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')),
  url_imagen              text,
  url_miniatura           text,
  texto                   text,
  publicado_en            timestamptz not null,

  oculto                  boolean     not null default false,
  oculto_por              uuid        references public.perfiles (id) on delete set null,
  oculto_en               timestamptz,
  motivo_oculto           text,

  sincronizado_en         timestamptz not null default now(),
  visto_en_el_feed_en     timestamptz not null default now(),

  constraint si_esta_oculto_hay_registro
    check (not oculto or (oculto_en is not null))
);

create index instagram_visibles_idx
  on public.instagram_posts (publicado_en desc)
  where not oculto;

alter table public.instagram_posts enable row level security;
```

**Lo que hay que leer dos veces:**

- **`oculto` es un requisito de seguridad de contenido, no una comodidad** (RF-05). El sitio habla de
  suicidio; no puede haber en portada una publicación de terceros que nadie revisó. Por eso existe el
  botón de ocultar en el panel, y por eso la restricción exige registrar cuándo se ocultó.
- **La sincronización diaria no puede pisar `oculto`.** Es el detalle que rompería el requisito
  anterior sin que nadie se dé cuenta. El `upsert` es explícito:

```sql
insert into public.instagram_posts as ip
  (id_externo, permalink, tipo_medio, url_imagen, url_miniatura, texto, publicado_en)
values (...)
on conflict (id_externo) do update set
  permalink           = excluded.permalink,
  url_imagen          = excluded.url_imagen,
  url_miniatura       = excluded.url_miniatura,
  texto               = excluded.texto,
  sincronizado_en     = now(),
  visto_en_el_feed_en = now();
  -- `oculto`, `oculto_por`, `oculto_en` y `motivo_oculto` NO se tocan nunca.
  -- Lo que un administrador ocultó, se queda oculto para siempre.
```

- `visto_en_el_feed_en` es la última vez que la publicación apareció en el feed de origen. Sirve para
  purgar la caché sin perder el registro de lo que se ocultó (§5).
- `texto` guarda el pie de la publicación. Es de los pocos campos del esquema con contenido que
  nosotros no escribimos, y por eso es justamente el que puede necesitar ocultarse.
- **No hay ningún token de Meta en esta tabla ni en ninguna otra.** El feed se lee del JSON de
  Behold, que gestiona la renovación del token en su infraestructura. Un token de larga duración de
  Meta muere a los 60 días sin refrescar y no se puede recuperar: el feed se apagaría en silencio
  unas ocho semanas después de que el equipo se retire (X-01). Detalle en
  [`adr/0003-feed-instagram.md`](./adr/0003-feed-instagram.md).
- Si el feed falla, el sitio muestra la última copia buena; si no hay ninguna, **la sección
  desaparece** — nunca un hueco ni un mensaje de error (RF-05). Eso se resuelve en el componente, no
  aquí; la tabla solo garantiza que la última copia buena exista.

---

## 3.16 `bitacora`

**Para qué existe.** Auditoría. Quién publicó qué, quién abrió una solicitud de cita, quién exportó
una lista, qué borró la purga. RF-04 pide bitácora de accesos y cambios; §6.2 del SRS pide además
bitácora de **todo acceso a datos de solicitudes**, no solo de las modificaciones.

```sql
create table public.bitacora (
  id            uuid        primary key default gen_random_uuid(),
  secuencia     bigint      generated always as identity,
  ocurrido_en   timestamptz not null default now(),
  actor_id      uuid,
  actor_correo  text,
  accion        text        not null
                            check (accion in ('crear', 'editar', 'publicar', 'despublicar',
                                              'archivar', 'eliminar', 'restaurar',
                                              'ver_solicitud', 'cambiar_estado', 'exportar',
                                              'iniciar_sesion', 'cerrar_sesion',
                                              'purgar', 'tarea_programada')),
  entidad       text        not null,
  entidad_id    uuid,
  resumen       text        not null check (length(btrim(resumen)) > 0),
  datos         jsonb       not null default '{}'::jsonb
);

create index bitacora_reciente_idx  on public.bitacora (ocurrido_en desc);
create index bitacora_por_entidad_idx on public.bitacora (entidad, entidad_id, ocurrido_en desc);
create index bitacora_por_actor_idx   on public.bitacora (actor_id, ocurrido_en desc);

alter table public.bitacora enable row level security;

-- Inmutable de verdad: el disparador detiene incluso a la clave de servicio,
-- que sí se salta las políticas RLS.
create or replace function public.bitacora_es_inmutable()
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
  for each row execute function public.bitacora_es_inmutable();
```

**Lo que hay que leer dos veces:**

- **`secuencia` además de `id`.** El `uuid` identifica; el `bigint` ordena. Un hueco en la secuencia
  es la señal de que alguien borró una entrada saltándose el disparador, cosa que solo puede hacer
  quien tenga acceso directo a la consola de PostgreSQL. Un `uuid` aleatorio no permite detectar eso.
- **`actor_id` no tiene llave foránea a `perfiles`.** Es deliberado: si se elimina un perfil, sus
  entradas de auditoría no pueden desaparecer ni quedar en `null`. Por eso también se copia
  `actor_correo`. Una bitácora que se borra con el usuario no es una bitácora.
- `actor_id` puede ser `null`: las tareas programadas y las purgas actúan sin persona detrás.
- **`datos` no lleva datos personales.** Guarda qué campos cambiaron, no qué decían. `{"campos":
  ["estado","atendida_por"]}`, nunca `{"motivo": "..."}`. Esto **no se puede imponer con una
  restricción SQL**; es una regla de revisión de código, y va escrita aquí para que la revisión
  tenga dónde apoyarse.
- `accion = 'ver_solicitud'` es la que cumple §6.2 y la que más volumen genera. Se registra desde el
  panel al abrir el detalle de una solicitud, no al listar la bandeja.

---

## 3.17 `notificaciones_pendientes`

**Para qué existe.** Es la pieza que hace cierto el criterio AC-03: *cortando la automatización, la
solicitud se guarda igual y queda marcada como pendiente de notificar*. Es una cola durable dentro de
PostgreSQL. RF-02 y RF-15.

```sql
create table public.notificaciones_pendientes (
  id                 uuid        primary key default gen_random_uuid(),
  tipo               text        not null
                                 check (tipo in ('confirmacion_solicitante',
                                                 'aviso_administracion',
                                                 'aviso_solicitudes_sin_atender',
                                                 'aviso_convocatoria_cerrada')),
  entidad            text        not null,
  entidad_id         uuid,
  destinatario       text        not null,
  datos              jsonb       not null default '{}'::jsonb,

  estado             text        not null default 'pendiente'
                                 check (estado in ('pendiente', 'enviando', 'enviada', 'fallida')),
  intentos           smallint    not null default 0 check (intentos >= 0),
  max_intentos       smallint    not null default 5 check (max_intentos > 0),
  proximo_intento_en timestamptz not null default now(),
  ultimo_error       text,
  enviada_en         timestamptz,

  creado_en          timestamptz not null default now(),
  actualizado_en     timestamptz not null default now(),

  constraint si_esta_enviada_tiene_fecha
    check (estado <> 'enviada' or enviada_en is not null)
);

-- Lo que el reintento horario consulta. Índice pequeño: solo lo que falta por enviar.
create index notificaciones_por_enviar_idx
  on public.notificaciones_pendientes (proximo_intento_en)
  where estado in ('pendiente', 'fallida');

create index notificaciones_agotadas_idx
  on public.notificaciones_pendientes (creado_en)
  where estado = 'fallida';

create trigger notificaciones_tocar
  before update on public.notificaciones_pendientes
  for each row execute function public.tocar_actualizado_en();

alter table public.notificaciones_pendientes enable row level security;
```

**Cómo entra una notificación en la cola.** Con un disparador en SQL puro. Sin red, sin HTTP, sin
nada que pueda fallar: si la fila de la solicitud se guardó, la notificación está encolada. El
webhook que despierta a n8n es una optimización encima de esto; si el webhook falla, el reintento
horario de RF-15 recoge la fila igual.

```sql
create or replace function public.encolar_avisos_de_solicitud_cita()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_correo_admin text;
begin
  -- Confirmación al solicitante, solo si dejó correo.
  if new.correo is not null then
    insert into public.notificaciones_pendientes (tipo, entidad, entidad_id, destinatario, datos)
    values (
      'confirmacion_solicitante',
      'solicitudes_cita',
      new.id,
      new.correo,
      jsonb_build_object('nombre_pila', split_part(btrim(new.nombre), ' ', 1))
    );
  end if;

  -- Aviso a la administración: SIN el contenido del formulario.
  select a.valor #>> '{}' into v_correo_admin
  from public.ajustes a
  where a.clave = 'notificaciones.correo_administracion';

  if v_correo_admin is not null then
    insert into public.notificaciones_pendientes (tipo, entidad, entidad_id, destinatario, datos)
    values (
      'aviso_administracion',
      'solicitudes_cita',
      new.id,
      v_correo_admin,
      jsonb_build_object(
        'ruta_panel',      '/panel/solicitudes/citas/' || new.id::text,
        'atencion_pronto', new.atencion_pronto
      )
    );
  end if;

  return new;
end;
$$;

create trigger al_crear_solicitud_cita_encolar
  after insert on public.solicitudes_cita
  for each row execute function public.encolar_avisos_de_solicitud_cita();
```

**Lo que hay que leer dos veces:**

- **`datos` contiene el nombre de pila, una ruta y una bandera. Nada más.** No lleva el motivo de
  consulta, ni el teléfono, ni la disponibilidad. El correo a la administración dice «tienes una
  nueva solicitud», la fecha y el programa, y enlaza al panel autenticado (`/panel/solicitudes/citas/…`,
  la ruta de [`03-arquitectura-informacion.md`](./03-arquitectura-informacion.md)). Si el motivo
  viajara en el cuerpo del correo, quedaría replicado para siempre en un buzón fuera de esta política
  de retención — y ese buzón hoy es un Gmail personal (R-07). Es la regla más importante de esta
  tabla.
- `atencion_pronto` viaja en `datos` porque es **lo único que cambia el asunto del correo** (HU-37):
  el aviso llega como «Nueva solicitud de cita — piden atención pronto» en vez de «Nueva solicitud de
  cita». Es una bandera de prioridad, no contenido del formulario: dice que alguien marcó una
  casilla, no qué escribió. La distinción es la que mantiene en pie la regla anterior.
- La **confirmación al solicitante sí puede devolverle lo que escribió** (RNF-14): es suyo, va a su
  propio buzón y es lo que le permite comprobar que la solicitud salió como quería. Ese texto **no se
  copia en `datos`**: quien envía lee la fila con la clave de servicio en el momento del envío, para
  que el contenido no quede duplicado en una cola que dura 30 días. Lo que nunca sale hacia
  **terceros** es el contenido del formulario, y la administración es un tercero.
- **`destinatario` es un correo de una persona real**, así que esta tabla es tabla de datos
  personales: RLS y retención igual que las demás (§5).
- Reintento con espera creciente: `proximo_intento_en = now() + interval '1 minute' * power(4,
  intentos)`. Da 1, 4, 16, 64 y 256 minutos — algo más de cuatro horas de margen antes de rendirse.
  Suficiente para una caída de n8n o de Resend; corto para que una solicitud de ayuda no espere un día.
- `estado = 'fallida'` con `intentos >= max_intentos` es lo que **tiene que ser visible en el panel**.
  Un fallo silencioso en el camino de una solicitud de ayuda es un bug ([`../CLAUDE.md`](../CLAUDE.md)
  §6). El panel muestra un contador rojo y el aviso semanal lo repite.
- Hay disparadores equivalentes para las demás tablas de formulario. Se omiten aquí porque son el
  mismo patrón cambiando el nombre de la entidad.

> **El límite que muerde.** Resend gratuito tope 100 correos al día
> ([`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md)). Esta cola **no** es el canal de
> difusión masiva de la campaña navideña: eso se exporta a CSV y sale del buzón institucional. Si la
> cola supera los 100 pendientes en un día, es señal de que alguien intentó usarla para eso.

---

## 3.18 `tareas_programadas`

**Para qué existe.** RF-15 pide que cada tarea deje registro de su última ejecución, visible en el
panel. Esta tabla es ese registro — y sobre todo, es **cómo Edwin se entera de que algo dejó de
correr** cuando ya no estemos.

```sql
create table public.tareas_programadas (
  nombre                    text        primary key
                                        check (nombre ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  descripcion               text        not null,
  frecuencia                text        not null,
  requisito                 text,
  activa                    boolean     not null default true,

  ultima_ejecucion_en       timestamptz,
  ultimo_estado             text        not null default 'nunca'
                                        check (ultimo_estado in ('nunca', 'ok', 'error')),
  ultimo_detalle            text,
  duracion_ms               integer     check (duracion_ms is null or duracion_ms >= 0),
  fallos_consecutivos       smallint    not null default 0 check (fallos_consecutivos >= 0),
  tolerancia                interval    not null default interval '36 hours',

  creado_en                 timestamptz not null default now(),
  actualizado_en            timestamptz not null default now()
);

create trigger tareas_tocar
  before update on public.tareas_programadas
  for each row execute function public.tocar_actualizado_en();

alter table public.tareas_programadas enable row level security;

-- Lo que llama cada job al terminar.
create or replace function public.registrar_tarea(
  p_nombre      text,
  p_estado      text,
  p_detalle     text default null,
  p_duracion_ms integer default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.tareas_programadas
     set ultima_ejecucion_en = now(),
         ultimo_estado       = p_estado,
         ultimo_detalle      = p_detalle,
         duracion_ms         = p_duracion_ms,
         fallos_consecutivos = case when p_estado = 'ok' then 0
                                    else fallos_consecutivos + 1 end
   where nombre = p_nombre;

  if not found then
    raise exception 'Tarea programada desconocida: %', p_nombre;
  end if;
end;
$$;

-- Lo que el panel pinta en rojo. Detecta el silencio, que es el fallo real.
create or replace view public.tareas_en_alerta
with (security_invoker = on) as
  select nombre,
         descripcion,
         frecuencia,
         ultima_ejecucion_en,
         ultimo_estado,
         ultimo_detalle,
         fallos_consecutivos,
         (ultima_ejecucion_en is null
          or ultima_ejecucion_en < now() - tolerancia) as lleva_demasiado_sin_correr
    from public.tareas_programadas
   where activa
     and (ultimo_estado = 'error'
          or ultima_ejecucion_en is null
          or ultima_ejecucion_en < now() - tolerancia);
```

**Lo que hay que leer dos veces:**

- **`tolerancia` es el campo importante.** Sin él, una tarea que dejó de ejecutarse hace tres semanas
  se ve idéntica a una que corrió ayer bien: `ultimo_estado = 'ok'`. El fallo que de verdad ocurre
  cuando un equipo se retira no es que la tarea falle, es que **deje de correr sin avisar**. La vista
  compara la última ejecución contra la tolerancia y por eso lo detecta.
- `with (security_invoker = on)` en la vista: sin eso, una vista de PostgreSQL se ejecuta con los
  permisos de quien la creó y se saltaría el RLS de la tabla de abajo. Supabase lo señala como
  hallazgo de seguridad. Toda vista de este esquema lo lleva.
- `registrar_tarea` **falla ruidosamente** si el nombre no existe. Una tarea que reporta a un nombre
  mal escrito reportaría a nadie, y el panel diría que todo está bien.
- Las tareas programadas se siembran en §7.4, cada una con su requisito de origen. Quién las dispara —n8n, según
  [`../CLAUDE.md`](../CLAUDE.md) §4, con `pg_cron` para las que son SQL puro— se decide en
  [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md) y se documenta en
  [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md). Aquí solo vive el registro.

> 🟡 **Inferido y hay que probarlo:** no está verificado si un job de `pg_cron` corriendo dentro de la
> propia base cuenta como «actividad» para efectos de la pausa a los 7 días del plan gratuito de
> Supabase. Hay reportes contradictorios. Por eso el ping de actividad de RF-15 es **externo** y no un
> `pg_cron`: un ping externo es actividad sin discusión.

---

## 3.19 `envios_en_cuarentena`

**Para qué existe.** RNF-22 no admite matices: **nada se descarta en silencio**. El campo trampa y la
limitación de frecuencia de §3.6 protegen los formularios, y como toda heurística, se equivocan. El
día que se equivoquen, lo que se pierde puede ser una solicitud de ayuda psicológica. Esta tabla es
el lugar donde cae lo que el filtro rechazó, para que una persona lo mire.

```sql
create table public.envios_en_cuarentena (
  id                 uuid        primary key default gen_random_uuid(),
  formulario         text        not null
                                 check (formulario in ('solicitudes_cita',
                                                       'inscripciones_voluntariado',
                                                       'inscripciones_padrinos',
                                                       'postulaciones_comunidad',
                                                       'solicitudes_alianza',
                                                       'mensajes_contacto')),
  motivo_rechazo     text        not null
                                 check (motivo_rechazo in ('campo_trampa',
                                                           'limite_de_frecuencia',
                                                           'envio_demasiado_rapido',
                                                           'validacion_fallida',
                                                           'convocatoria_cerrada')),
  detalle            text,
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

-- Purga por retención (§5).
create index cuarentena_creado_en_idx on public.envios_en_cuarentena (creado_en);

alter table public.envios_en_cuarentena enable row level security;
```

**Lo que hay que leer dos veces:**

- **`carga` guarda el envío entero, tal como llegó.** Es la única forma de poder recuperarlo si
  resulta legítimo: un rechazo del que solo se guarda el motivo no se puede deshacer. Y por eso mismo
  esta tabla es **la más restringida del esquema**: solo administrador, nunca editor, nunca
  exportación, y 90 días de vida (§5).
- **No se guarda dirección IP ni cadena de navegador**, tampoco aquí. El motivo del rechazo se
  describe con una etiqueta (`limite_de_frecuencia`), no con la huella de quien envió. La regla 3 de
  §1 no tiene excepción por conveniencia operativa.
- `resultado_revision = 'era_legitimo_recuperado'` significa que un administrador reinsertó el envío
  en su tabla real desde el panel. La fila de cuarentena **no se borra al recuperarla**: queda como
  registro de que el filtro se equivocó, que es exactamente el dato que sirve para ajustarlo.
- Un contador de envíos en cuarentena sin revisar va junto al de notificaciones fallidas (§3.17) en
  la portada del panel. Una cuarentena que nadie mira es un descarte en silencio con pasos extra.
- Las filas las escribe el Server Action con la clave de servicio, igual que las de los formularios.
  `anon` no tiene `insert` aquí tampoco.

---

# 4. Políticas RLS

## 4.1 El modelo, en tres frases

1. **Lo publicado se lee sin autenticar.** Proyectos activos, contenidos publicados, convocatorias,
   publicaciones de Instagram no ocultas y los ajustes marcados `publico`. Nada más.
2. **Los datos de personas solo los ve un administrador autenticado.** Ni el visitante, ni el editor
   de contenido, ni una clave pública filtrada.
3. **Nadie modifica la bitácora.** Ni el administrador, ni la clave de servicio; solo se inserta.

Y una cuarta que es la que sostiene a las otras tres: **el anónimo no escribe en ninguna tabla,
nunca**. Los formularios públicos entran por un Server Action que valida con Zod y escribe con la
clave de servicio. PostgREST no es una vía de escritura en este proyecto.

## 4.2 Concesiones de partida

Después del `revoke all` de §3.0.3, se concede exactamente esto:

```sql
-- Lectura pública. RLS acota después qué filas.
grant select on public.proyectos        to anon, authenticated;
grant select on public.contenidos       to anon, authenticated;
grant select on public.galeria_imagenes to anon, authenticated;
grant select on public.convocatorias    to anon, authenticated;
grant select on public.instagram_posts  to anon, authenticated;
grant select on public.ajustes          to anon, authenticated;

-- El panel. Nada de esto llega a `anon`.
grant select, insert, update, delete on public.proyectos                  to authenticated;
grant select, insert, update, delete on public.contenidos                 to authenticated;
grant select, insert, update, delete on public.galeria_imagenes           to authenticated;
grant select, insert, update, delete on public.convocatorias              to authenticated;
grant select, insert, update, delete on public.ajustes                    to authenticated;
grant select,                 update on public.instagram_posts            to authenticated;
grant select,         update         on public.solicitudes_cita           to authenticated;
grant select,         update         on public.inscripciones_voluntariado to authenticated;
grant select,         update         on public.inscripciones_padrinos     to authenticated;
grant select,         update         on public.postulaciones_comunidad    to authenticated;
grant select,         update         on public.solicitudes_alianza        to authenticated;
grant select,         update         on public.mensajes_contacto          to authenticated;
grant select, insert                 on public.notas_internas             to authenticated;
grant select,         update         on public.perfiles                   to authenticated;
grant select                         on public.bitacora                   to authenticated;
grant select                         on public.notificaciones_pendientes  to authenticated;
grant select                         on public.tareas_programadas         to authenticated;
grant select,         update         on public.envios_en_cuarentena       to authenticated;
```

**Detalles que importan:**

- **`authenticated` no tiene `insert` en ninguna tabla de formulario.** Las filas las crea el
  visitante a través del servidor; un administrador no inventa solicitudes de cita. Tampoco tiene
  `delete`: el borrado de datos personales lo hace la purga por retención (§5), no un clic.
- `instagram_posts` solo admite `update` desde el panel, y solo para ocultar. La sincronización la
  hace la clave de servicio.
- `notas_internas` no admite `update` ni `delete`. Una nota de gestión corregida a posteriori deja de
  ser un registro de lo que pasó. Si la nota está mal, se escribe otra.
- `envios_en_cuarentena` admite `update` solo para marcar la revisión (`revisado`, `revisado_por`,
  `revisado_en`, `resultado_revision`). No admite `delete`: lo que el filtro apartó lo borra la purga
  de §5 a los 90 días, no un clic que haría del descarte en silencio un procedimiento manual.

## 4.3 Las políticas, tabla por tabla

Cada bloque termina con **la prueba negativa**: la consulta que un usuario anónimo NO debe poder
ejecutar, y el resultado que debe dar. Se ejecutan con `set local role anon;` dentro de una
transacción; `reset role;` al final. Las que dicen *«permiso denegado»* fallan por el `revoke` de
privilegios; las que dicen *«0 filas»* fallan por la política.

---

### `perfiles`

```sql
create policy "perfiles_cada_quien_ve_el_suyo"
  on public.perfiles for select to authenticated
  using (id = (select auth.uid()) or public.es_admin());

create policy "perfiles_solo_el_admin_los_cambia"
  on public.perfiles for update to authenticated
  using (public.es_admin()) with check (public.es_admin());
```

Un editor se ve a sí mismo y a nadie más. Solo un administrador puede activar cuentas, cambiar roles
o desactivar a alguien (3.2.8). No hay política de `insert`: los perfiles los crea el disparador de
Auth. No hay política de `delete`: se desactiva con `activo = false`, no se borra, porque la bitácora
apunta a ese identificador.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select correo, rol from public.perfiles;
  -- ESPERADO: ERROR  permission denied for table perfiles
rollback;
```

---

### `proyectos`

```sql
create policy "proyectos_activos_los_ve_cualquiera"
  on public.proyectos for select to anon, authenticated
  using (activo);

create policy "proyectos_los_gestiona_el_equipo"
  on public.proyectos for all to authenticated
  using (public.es_editor()) with check (public.es_editor());
```

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select slug from public.proyectos where not activo;
  -- ESPERADO: 0 filas (aunque existan proyectos ocultos)

  update public.proyectos set activo = false;
  -- ESPERADO: ERROR  permission denied for table proyectos
rollback;
```

---

### `contenidos`

```sql
create policy "contenidos_publicados_los_ve_cualquiera"
  on public.contenidos for select to anon, authenticated
  using (estado = 'publicado' and eliminado_en is null);

create policy "contenidos_los_gestiona_el_equipo"
  on public.contenidos for all to authenticated
  using (public.es_editor()) with check (public.es_editor());
```

Un borrador no existe para el visitante. Un contenido archivado tampoco: es exactamente lo que Edwin
pidió con «ocultar un evento que ya pasó» (C-06). La caducidad de eventos **no** se resuelve aquí,
sino en la consulta (§9.1): un evento publicado y vencido sigue siendo legible por su URL directa —
que es lo correcto, porque esa URL se compartió— pero deja de aparecer entre los próximos.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select titulo, estado from public.contenidos where estado <> 'publicado';
  -- ESPERADO: 0 filas

  select titulo from public.contenidos where eliminado_en is not null;
  -- ESPERADO: 0 filas

  insert into public.contenidos (tipo, titulo, slug, estado)
  values ('noticia', 'Noticia falsa insertada por un anonimo', 'noticia-falsa', 'publicado');
  -- ESPERADO: ERROR  permission denied for table contenidos
rollback;
```

---

### `galeria_imagenes`

```sql
create policy "galeria_de_lo_publico_se_ve"
  on public.galeria_imagenes for select to anon, authenticated
  using (
    (proyecto_id is not null and exists (
       select 1 from public.proyectos p
        where p.id = galeria_imagenes.proyecto_id and p.activo))
    or
    (contenido_id is not null and exists (
       select 1 from public.contenidos c
        where c.id = galeria_imagenes.contenido_id
          and c.estado = 'publicado' and c.eliminado_en is null))
  );

create policy "galeria_la_gestiona_el_equipo"
  on public.galeria_imagenes for all to authenticated
  using (public.es_editor()) with check (public.es_editor());
```

La visibilidad de una foto **se hereda de su dueño**. Ocultar una noticia oculta sus fotos sin que
haya que acordarse de nada. Si esto no fuera así, archivar un evento dejaría sus imágenes de
evidencia colgando en una consulta pública.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select ruta_storage
    from public.galeria_imagenes g
    join public.contenidos c on c.id = g.contenido_id
   where c.estado = 'borrador';
  -- ESPERADO: 0 filas
rollback;
```

---

### `convocatorias`

```sql
create policy "convocatorias_de_proyectos_activos_se_ven"
  on public.convocatorias for select to anon, authenticated
  using (exists (
    select 1 from public.proyectos p
     where p.id = convocatorias.proyecto_id and p.activo
  ));

create policy "convocatorias_las_gestiona_el_equipo"
  on public.convocatorias for all to authenticated
  using (public.es_editor()) with check (public.es_editor());
```

Una convocatoria cerrada **sí** se lee sin autenticar, a propósito: RF-07 exige explicar cuándo
vuelve a abrir, y para eso el sitio necesita leer sus fechas y su `texto_si_cerrada`. Lo que impide
inscribirse es la validación del Server Action contra `convocatoria_abierta()`, no la invisibilidad
de la fila.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  update public.convocatorias set cierra_en = now() + interval '1 year';
  -- ESPERADO: ERROR  permission denied for table convocatorias
rollback;
```

---

### `solicitudes_cita`

```sql
create policy "citas_solo_las_ve_un_administrador"
  on public.solicitudes_cita for select to authenticated
  using (public.es_admin());

create policy "citas_solo_las_gestiona_un_administrador"
  on public.solicitudes_cita for update to authenticated
  using (public.es_admin()) with check (public.es_admin());
```

**Un editor no puede leer esta tabla.** Es el caso que la separación de roles existe para cubrir. No
hay política de `insert` para nadie autenticado: las filas entran por el servidor con la clave de
servicio. No hay política de `delete`: solo borra la purga por retención.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select nombre, correo, motivo from public.solicitudes_cita;
  -- ESPERADO: ERROR  permission denied for table solicitudes_cita
rollback;

-- Segunda prueba negativa, la que de verdad importa: un EDITOR autenticado.
-- Se ejecuta desde el panel con una sesión de rol 'editor'.
--   select count(*) from public.solicitudes_cita;
--   ESPERADO: 0 filas. No un error: cero filas. El editor entra, y no hay nada.
```

---

### `inscripciones_voluntariado`, `inscripciones_padrinos`, `postulaciones_comunidad`, `solicitudes_alianza`, `mensajes_contacto`

Las cinco llevan exactamente el mismo par de políticas. Se escriben una vez con un bucle para que no
se pueda olvidar ninguna al añadir la sexta:

```sql
do $$
declare
  t text;
begin
  foreach t in array array[
    'inscripciones_voluntariado', 'inscripciones_padrinos',
    'postulaciones_comunidad', 'solicitudes_alianza', 'mensajes_contacto'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.es_admin())',
      t || '_solo_admin_lee', t);
    execute format(
      'create policy %I on public.%I for update to authenticated
         using (public.es_admin()) with check (public.es_admin())',
      t || '_solo_admin_gestiona', t);
  end loop;
end;
$$;
```

```sql
-- PRUEBA NEGATIVA (una por tabla; se muestra la de padrinos, las demás son idénticas)
begin;
  set local role anon;
  select nombre, correo, telefono from public.inscripciones_padrinos;
  -- ESPERADO: ERROR  permission denied for table inscripciones_padrinos

  insert into public.inscripciones_padrinos
    (convocatoria_id, nombre, correo, telefono, forma_entrega,
     consentimiento_en, politica_version)
  values (gen_random_uuid(), 'X', 'x@example.com', '60000000', 'x', now(), 'v1');
  -- ESPERADO: ERROR  permission denied for table inscripciones_padrinos
rollback;
```

---

### `notas_internas`

```sql
create policy "notas_solo_un_administrador"
  on public.notas_internas for select to authenticated
  using (public.es_admin());

create policy "notas_las_escribe_un_administrador"
  on public.notas_internas for insert to authenticated
  with check (public.es_admin() and autor_id = (select auth.uid()));
```

El `with check` obliga a que el autor sea quien está escribiendo. Nadie firma una nota con el nombre
de otro.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select texto from public.notas_internas;
  -- ESPERADO: ERROR  permission denied for table notas_internas
rollback;
```

---

### `ajustes`

```sql
create policy "ajustes_publicos_los_lee_cualquiera"
  on public.ajustes for select to anon, authenticated
  using (publico);

create policy "ajustes_los_lee_completos_el_equipo"
  on public.ajustes for select to authenticated
  using (public.es_editor());

create policy "ajustes_los_cambia_un_administrador"
  on public.ajustes for update to authenticated
  using (public.es_admin()) with check (public.es_admin());

create policy "ajustes_los_crea_un_administrador"
  on public.ajustes for insert to authenticated
  with check (public.es_admin());
```

Los datos bancarios y el bloque de crisis son `publico = true`: tienen que verse sin iniciar sesión,
porque para eso están. El correo interno de notificaciones y cualquier clave operativa futura, no.
Cambiarlos es de administrador: el número de cuenta de la fundación no lo edita quien publica noticias.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select clave from public.ajustes where not publico;
  -- ESPERADO: 0 filas

  update public.ajustes set valor = to_jsonb('@otro-alias'::text)
   where clave = 'donaciones.yappy_alias';
  -- ESPERADO: ERROR  permission denied for table ajustes
rollback;
```

---

### `instagram_posts`

```sql
create policy "instagram_no_oculto_se_ve"
  on public.instagram_posts for select to anon, authenticated
  using (not oculto);

create policy "instagram_lo_ve_completo_el_equipo"
  on public.instagram_posts for select to authenticated
  using (public.es_editor());

create policy "instagram_lo_oculta_el_equipo"
  on public.instagram_posts for update to authenticated
  using (public.es_editor()) with check (public.es_editor());
```

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select permalink from public.instagram_posts where oculto;
  -- ESPERADO: 0 filas

  update public.instagram_posts set oculto = false;
  -- ESPERADO: ERROR  permission denied for table instagram_posts
rollback;
```

---

### `bitacora`

```sql
create policy "bitacora_la_lee_un_administrador"
  on public.bitacora for select to authenticated
  using (public.es_admin());
```

**Una sola política, y es de lectura.** No hay `insert` para `authenticated` (las entradas las escribe
el servidor con la clave de servicio), no hay `update` y no hay `delete`. Y por encima de las
políticas está el disparador de §3.16, que detiene también a la clave de servicio.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select * from public.bitacora;
  -- ESPERADO: ERROR  permission denied for table bitacora
rollback;

-- Prueba negativa adicional, con la clave de SERVICIO (que se salta el RLS):
--   delete from public.bitacora where id = '...';
--   ESPERADO: ERROR  La bitácora es de solo escritura: no se puede delete una entrada.
```

---

### `notificaciones_pendientes`

```sql
create policy "notificaciones_las_ve_un_administrador"
  on public.notificaciones_pendientes for select to authenticated
  using (public.es_admin());
```

Contiene correos de personas. Solo lectura, solo administrador. El envío y el reintento los hace la
automatización con la clave de servicio.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select destinatario, datos from public.notificaciones_pendientes;
  -- ESPERADO: ERROR  permission denied for table notificaciones_pendientes
rollback;
```

---

### `tareas_programadas`

```sql
create policy "tareas_las_ve_el_equipo"
  on public.tareas_programadas for select to authenticated
  using (public.es_editor());

create policy "tareas_las_activa_un_administrador"
  on public.tareas_programadas for update to authenticated
  using (public.es_admin()) with check (public.es_admin());
```

No hay datos de personas, pero tampoco hay razón para que el visitante sepa qué automatizaciones
corren ni cuáles están fallando. Un editor las ve para saber si el feed se actualizó; solo un
administrador puede desactivar una.

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select nombre, ultimo_estado from public.tareas_programadas;
  -- ESPERADO: ERROR  permission denied for table tareas_programadas
rollback;
```

---

### `envios_en_cuarentena`

```sql
create policy "cuarentena_solo_la_ve_un_administrador"
  on public.envios_en_cuarentena for select to authenticated
  using (public.es_admin());

create policy "cuarentena_solo_la_revisa_un_administrador"
  on public.envios_en_cuarentena for update to authenticated
  using (public.es_admin()) with check (public.es_admin());
```

**Solo administrador, y con más motivo que ninguna otra tabla.** `carga` puede contener el motivo de
consulta de alguien en crisis: es el mismo dato de `solicitudes_cita` sin haber llegado a serlo, así
que se protege igual. Un editor no la ve. No hay política de `insert`: las filas entran por el
servidor con la clave de servicio. No hay política de `delete`: solo borra la purga (§5).

```sql
-- PRUEBA NEGATIVA
begin;
  set local role anon;
  select formulario, carga from public.envios_en_cuarentena;
  -- ESPERADO: ERROR  permission denied for table envios_en_cuarentena
rollback;

-- Segunda prueba negativa, con una sesión de rol 'editor' desde el panel:
--   select count(*) from public.envios_en_cuarentena;
--   ESPERADO: 0 filas.
```

## 4.4 La comprobación que se corre antes de cada entrega

Ninguna tabla sin RLS, ninguna tabla con RLS y sin políticas. AC-06 se verifica así:

```sql
-- (1) Toda tabla de `public` con RLS habilitado. Debe devolver 0 filas.
select relname as tabla_sin_rls
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public'
   and c.relkind = 'r'
   and not c.relrowsecurity;

-- (2) Ninguna tabla con RLS pero sin una sola política (RLS que niega todo
--     también es un error: significa que alguien olvidó escribirla).
select c.relname as tabla_sin_politicas
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public'
   and c.relkind = 'r'
   and c.relrowsecurity
   and not exists (select 1 from pg_policies p
                    where p.schemaname = 'public' and p.tablename = c.relname);

-- (3) Ninguna vista con permisos del creador en vez de los del invocante.
select viewname
  from pg_views
 where schemaname = 'public'
   and viewname not in (
     select c.relname from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.reloptions::text like '%security_invoker=on%'
   );
```

Estas tres consultas van en el hook del repositorio que menciona el SRS (§6.1) y en la lista de
verificación de [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md). Una política que nadie
intentó romper no está probada: las pruebas negativas de §4.3 se ejecutan enteras antes de cada
entrega, no solo la primera vez.

---

# 5. Retención

## 5.1 La tabla de plazos

> **Esta tabla es el único lugar del proyecto donde vive un plazo de retención.** Está aquí, y no en
> [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md), porque aquí es donde vive el
> `DELETE` que los ejecuta (§5.2): un plazo escrito lejos de la función que lo aplica se desincroniza
> el primer día. El documento 04 enlaza a esta sección y no repite ninguna cifra. Si un plazo cambia,
> cambia en esta tabla y en `purgar_datos_vencidos()`, en la misma migración.

Estos plazos son **la propuesta del equipo** y están marcados 🟡: **Edwin los aprueba y el asesor
legal de la fundación los revisa antes del lanzamiento**. Lo que sí es firme es que el plazo exista,
que sea uno solo por tabla y que el borrado sea automático.

| Dato | Cuánto se guarda | Por qué ese plazo | Cómo se borra | Estado |
|---|---|---|---|---|
| `solicitudes_cita` | **24 meses** desde `creado_en` | Un solo plazo para toda la tabla, sin importar el estado. Dos plazos distintos obligaban a razonar sobre una columna que cambia a mano: la fila desaparecía antes o después según el clic de alguien, y eso no es una política, es una lotería. Veinticuatro meses cubren dos ciclos completos y permiten un seguimiento o una segunda consulta sin convertirse en un archivo clínico. | `DELETE` real, con sus notas y notificaciones | 🟡 |
| `inscripciones_voluntariado` | **24 meses** desde `creado_en`, con **revisión anual y aviso previo** | El voluntariado se convoca por campaña; dos años cubren dos ciclos completos de fiesta navideña y de jornadas. Al año se revisa la lista y se avisa a quien lleva tiempo sin participar antes de que su registro caduque: nadie desaparece de la base sin haber tenido la oportunidad de seguir. | `DELETE` real | 🟡 |
| `inscripciones_padrinos` | **24 meses** desde el `cierra_en` de su convocatoria | Permite invitar al padrino a las dos ediciones siguientes, que es lo que la fundación hace de verdad. Más allá de eso, se vuelve a convocar en abierto. | `DELETE` real | 🟡 |
| `postulaciones_comunidad` | **24 meses** desde el `cierra_en` de su convocatoria | Una comunidad no seleccionada este año es candidata natural de los siguientes, y la lista de espera se mueve despacio. | `DELETE` real | 🟡 |
| `solicitudes_alianza` | **24 meses** desde `creado_en` | Una alianza institucional se negocia lento y con calendario escolar. Contiene menos dato sensible: nombre, cargo y correo de trabajo. | `DELETE` real | 🟡 |
| `mensajes_contacto` | **12 meses** desde `creado_en` | Es el formulario menos crítico y el que más ruido acumula. Un año cierra cualquier conversación y evita que la bandeja general se convierta en un archivo perpetuo. | `DELETE` real | 🟡 |
| `notas_internas` | **Lo que dure su fila padre** | Una nota sobre una persona no puede sobrevivir al registro de esa persona. | `DELETE` en la misma purga que el padre | Firme |
| `envios_en_cuarentena` | **90 días** desde `creado_en` | Tiempo de sobra para que alguien revise un rechazo y lo recupere si era legítimo (§3.19). Pasado ese plazo, guardar la carga de un envío que nunca llegó a ser un registro es acumular riesgo sin ganar nada. | `DELETE` real | Firme |
| `notificaciones_pendientes` en `enviada` | **30 días** desde `enviada_en` | Ya cumplió su función; solo queda como evidencia corta de que el aviso salió. Contiene un correo personal. | `DELETE` real | Firme |
| `notificaciones_pendientes` en `fallida` | **90 días** desde `creado_en` | Un fallo tiene que seguir visible el tiempo suficiente para que alguien lo vea y reaccione. | `DELETE` real | 🟡 |
| `bitacora` | **24 meses** desde `ocurrido_en` | Dos años permiten reconstruir qué pasó en dos campañas navideñas completas. No contiene contenido de formularios, solo identificadores. | `DELETE` real por la purga | 🟡 |
| `instagram_posts` no ocultos | **90 días** sin aparecer en el feed | Es caché. Si la publicación ya no está en el feed de origen, la copia local no aporta nada. | `DELETE` real | Firme |
| `instagram_posts` ocultos | **No se borran** | Si se borrara, una publicación ocultada por su contenido podría volver a entrar en la siguiente sincronización y reaparecer en portada. | — | Firme |
| `contenidos` con `eliminado_en` **no nulo** | **30 días** desde `eliminado_en` | Es la papelera de RNF-51: un mes para deshacer un borrado accidental. Pasado ese plazo la fila se va de verdad, porque una papelera que no se vacía nunca es solo una tabla que crece. | `DELETE` real por la purga; la galería del contenido cae en cascada | Firme |
| `contenidos` con `eliminado_en` nulo | **Sin caducidad** | Es memoria institucional y evidencia para patrocinadores (O-07). No es dato personal. | Borrado lógico (`eliminado_en`), que inicia los 30 días de la fila anterior | Firme |
| `proyectos`, `convocatorias`, `ajustes`, `tareas_programadas` | **Sin caducidad** | Configuración e historia de la fundación. | — | Firme |
| `perfiles` | **12 meses** desde la desactivación | Un perfil desactivado sigue haciendo legible la bitácora. Al año se elimina de Auth y el perfil cae en cascada. | Manual, en la revisión anual de traspaso | 🟡 |
| `galeria_imagenes` | **Sin caducidad**, salvo revocación de consentimiento | Es la evidencia de la fundación. Si alguien retira su consentimiento, se borra la fila y el objeto de Storage. | Manual, a petición | Firme |

**Dos consecuencias que no se pueden pasar por alto:**

1. **El plazo también aplica a los respaldos.** Una fila borrada el martes sigue existiendo en el
   volcado del domingo anterior. Por eso la retención de respaldos de §8 está acotada: un dato
   purgado desaparece por completo dentro de los 90 días siguientes a la purga.
2. **Los plazos van escritos en la política de privacidad**, en lenguaje llano, porque la persona que
   marca la casilla de consentimiento tiene derecho a saber cuánto tiempo se guarda lo que escribió.
   Esa página es el módulo 3.1.9 del SRS.

## 5.2 La función que borra

Una sola función, transaccional, que devuelve qué borró y deja constancia en la bitácora.

```sql
create or replace function public.purgar_datos_vencidos()
returns table (tabla text, filas_borradas integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_n     integer;
  v_total integer := 0;
begin
  ---------------------------------------------------------------------------
  -- 1. Notas internas y notificaciones huérfanas se borran ANTES que su
  --    padre, porque la relación es polimórfica y no hay cascada.
  ---------------------------------------------------------------------------
  delete from public.notas_internas n
   where n.entidad = 'solicitudes_cita'
     and exists (
       select 1 from public.solicitudes_cita s
        where s.id = n.entidad_id
          and s.creado_en < now() - interval '24 months'
     );

  delete from public.notificaciones_pendientes np
   where np.entidad = 'solicitudes_cita'
     and not exists (select 1 from public.solicitudes_cita s where s.id = np.entidad_id);

  ---------------------------------------------------------------------------
  -- 2. Solicitudes de cita: 24 meses desde creado_en, sin mirar el estado.
  --    El dato más sensible del sistema: se borra de verdad.
  ---------------------------------------------------------------------------
  delete from public.solicitudes_cita s
   where s.creado_en < now() - interval '24 months';
  get diagnostics v_n = row_count;
  v_total := v_total + v_n;
  tabla := 'solicitudes_cita'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 3. Voluntariado: 24 meses.
  ---------------------------------------------------------------------------
  delete from public.notas_internas n
   where n.entidad = 'inscripciones_voluntariado'
     and exists (select 1 from public.inscripciones_voluntariado v
                  where v.id = n.entidad_id
                    and v.creado_en < now() - interval '24 months');

  delete from public.inscripciones_voluntariado v
   where v.creado_en < now() - interval '24 months';
  get diagnostics v_n = row_count;
  v_total := v_total + v_n;
  tabla := 'inscripciones_voluntariado'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 4. Padrinos y postulaciones: 24 meses desde el cierre de SU convocatoria.
  ---------------------------------------------------------------------------
  delete from public.inscripciones_padrinos p
   using public.convocatorias c
   where c.id = p.convocatoria_id
     and c.cierra_en < now() - interval '24 months';
  get diagnostics v_n = row_count;
  v_total := v_total + v_n;
  tabla := 'inscripciones_padrinos'; filas_borradas := v_n; return next;

  delete from public.postulaciones_comunidad pc
   using public.convocatorias c
   where c.id = pc.convocatoria_id
     and c.cierra_en < now() - interval '24 months';
  get diagnostics v_n = row_count;
  v_total := v_total + v_n;
  tabla := 'postulaciones_comunidad'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 5. Alianzas (24 meses) y contacto general (12 meses).
  ---------------------------------------------------------------------------
  delete from public.solicitudes_alianza a
   where a.creado_en < now() - interval '24 months';
  get diagnostics v_n = row_count;
  v_total := v_total + v_n;
  tabla := 'solicitudes_alianza'; filas_borradas := v_n; return next;

  delete from public.mensajes_contacto m
   where m.creado_en < now() - interval '12 months';
  get diagnostics v_n = row_count;
  v_total := v_total + v_n;
  tabla := 'mensajes_contacto'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 6. Notas huérfanas que hayan quedado de cualquier borrado anterior.
  ---------------------------------------------------------------------------
  delete from public.notas_internas n
   where not exists (
     select 1 from public.solicitudes_cita           x where x.id = n.entidad_id
     union all
     select 1 from public.inscripciones_voluntariado x where x.id = n.entidad_id
     union all
     select 1 from public.inscripciones_padrinos     x where x.id = n.entidad_id
     union all
     select 1 from public.postulaciones_comunidad    x where x.id = n.entidad_id
     union all
     select 1 from public.solicitudes_alianza        x where x.id = n.entidad_id
     union all
     select 1 from public.mensajes_contacto          x where x.id = n.entidad_id
   );
  get diagnostics v_n = row_count;
  tabla := 'notas_internas'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 7. Cola de correo y caché del feed.
  ---------------------------------------------------------------------------
  delete from public.notificaciones_pendientes
   where (estado = 'enviada' and enviada_en < now() - interval '30 days')
      or (estado = 'fallida' and creado_en  < now() - interval '90 days');
  get diagnostics v_n = row_count;
  tabla := 'notificaciones_pendientes'; filas_borradas := v_n; return next;

  delete from public.instagram_posts
   where not oculto
     and visto_en_el_feed_en < now() - interval '90 days';
  get diagnostics v_n = row_count;
  tabla := 'instagram_posts'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 8. Envíos en cuarentena: 90 días. La carga de un envío rechazado es dato
  --    personal aunque nunca llegara a ser un registro, así que cuenta en el
  --    total y se borra con la misma severidad que lo demás.
  ---------------------------------------------------------------------------
  delete from public.envios_en_cuarentena q
   where q.creado_en < now() - interval '90 days';
  get diagnostics v_n = row_count;
  v_total := v_total + v_n;
  tabla := 'envios_en_cuarentena'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 9. Papelera de contenidos: 30 días desde eliminado_en (RNF-51). No es
  --    dato personal, así que NO suma a v_total; se informa aparte. La
  --    galería del contenido cae en cascada por su llave foránea.
  ---------------------------------------------------------------------------
  delete from public.contenidos c
   where c.eliminado_en is not null
     and c.eliminado_en < now() - interval '30 days';
  get diagnostics v_n = row_count;
  tabla := 'contenidos_en_papelera'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 10. Bitácora: 24 meses. Se borra con SQL directo porque el disparador de
  --     inmutabilidad bloquea DELETE. Se desactiva solo aquí y solo para esto.
  ---------------------------------------------------------------------------
  alter table public.bitacora disable trigger bitacora_sin_cambios;
  delete from public.bitacora where ocurrido_en < now() - interval '24 months';
  get diagnostics v_n = row_count;
  alter table public.bitacora enable trigger bitacora_sin_cambios;
  tabla := 'bitacora'; filas_borradas := v_n; return next;

  ---------------------------------------------------------------------------
  -- 11. Constancia. Cuenta agregada, sin una sola identidad.
  ---------------------------------------------------------------------------
  insert into public.bitacora (accion, entidad, resumen, datos)
  values ('purgar', 'retencion',
          format('Purga por retención: %s filas de datos personales borradas.', v_total),
          jsonb_build_object('filas_totales', v_total));

  return;
end;
$$;

revoke all on function public.purgar_datos_vencidos() from public, anon, authenticated;
grant execute on function public.purgar_datos_vencidos() to service_role;
```

**Detalles del borrado que hay que entender:**

- **Es `DELETE`, no una marca.** Nada de `anonimizado = true` ni `eliminado_en`. Los datos personales
  vencidos dejan de existir. El borrado lógico es solo para contenido (principio 5 de §1).
- La purga **no guarda quién era nadie**. La bitácora recibe una cuenta agregada. Si alguna vez hace
  falta la estadística de cuántas solicitudes llegaron por mes, se calcula antes de purgar y se
  guarda como número, nunca como fila con nombre.
- **La papelera del paso 9 es la única vez que la purga toca contenido.** Un contenido con
  `eliminado_en` es una noticia que alguien mandó a la papelera desde el panel; a los 30 días se va de
  verdad (RNF-51). No suma al total de datos personales borrados, porque no lo es, y por eso se
  informa con su propia etiqueta (`contenidos_en_papelera`).
- `disable trigger` en el paso 10 es la única excepción al disparador de inmutabilidad, está dentro de
  la misma transacción y solo la puede ejecutar `service_role`. Si la función falla a mitad, la
  transacción revierte y el disparador vuelve solo.
- **Se ejecuta a diario**, de madrugada en Panamá. Quién la dispara —n8n según
  [`../CLAUDE.md`](../CLAUDE.md) §4, o `pg_cron` si se prefiere que viva dentro de la base— se
  registra en `tareas_programadas` con el nombre `purga-retencion`, y su silencio se detecta con la
  vista `tareas_en_alerta` de §3.18.

```sql
-- Si se programa dentro de la base con pg_cron (07:15 UTC = 02:15 en Panamá):
select cron.schedule('purga-retencion', '15 7 * * *',
  'select public.purgar_datos_vencidos()');
```

---

# 6. Estrategia de migraciones

## 6.1 Numeración y forma

- Los archivos viven en `supabase/migrations/` y los crea la CLI:
  `npx supabase migration new agregar_convocatorias`.
- El nombre es `<AAAAMMDDHHMMSS>_descripcion_en_snake_case.sql`, con la marca de tiempo **en UTC**
  que genera la propia CLI. No se inventa a mano: dos personas escribiendo el mismo número el mismo
  día es un conflicto que no se detecta hasta producción.
- Una migración = un cambio con sentido. «Agregar tabla de convocatorias con sus políticas» es una;
  «cambios varios» no es ninguna.
- **Toda migración que crea una tabla habilita RLS en la misma migración.** No en la siguiente, no
  «después». Un hook del repositorio rechaza el `commit` si encuentra un `create table` en `public`
  sin su `enable row level security` ([`../CLAUDE.md`](../CLAUDE.md) §6, AC-06).
- Cada migración empieza con un comentario de tres líneas: qué cambia, por qué, y a qué requisito
  responde (RF-xx / HU-xx). Dentro de dos años, ese comentario será lo único que quede.

## 6.2 Una migración aplicada no se edita. Nunca.

Supabase guarda las migraciones ya aplicadas en `supabase_migrations.schema_migrations`. Si se edita
el archivo de una que ya corrió, **no se vuelve a ejecutar**: la versión sigue registrada. El
resultado es una base local que no coincide con la de producción y nadie sabe cuál está bien, hasta
que un despliegue falla por una columna que en un sitio existe y en el otro no.

La regla, entonces:

- ¿La migración **todavía no se aplicó en ningún sitio, ni siquiera en local**? Se puede editar.
- ¿Se aplicó en local pero no en producción? `npx supabase db reset` y se reescribe.
- ¿Se aplicó en producción? **Se escribe otra migración encima.** Siempre hacia adelante.

Deshacer un cambio es una migración nueva que lo revierte, con su propio número y su propio
comentario. No hay `down`. Un `down` que nadie ha probado es una promesa falsa, y en un proyecto que
se entrega y se abandona, las promesas falsas son las que rompen.

## 6.3 Migraciones destructivas, sin perder datos

Toda operación que puede perder datos —quitar una columna, renombrarla, cambiar su tipo, dividir una
tabla— se hace en **cuatro migraciones separadas y cuatro despliegues**, nunca en uno. El patrón se
llama expandir y contraer, y el motivo es simple: entre que se aplica la migración y que termina de
desplegarse el código nuevo, hay minutos en los que **la base nueva convive con el código viejo**.

Ejemplo real: separar `disponibilidad` (texto libre) en `dias_disponibles` y `franja_horaria`.

| Paso | Migración | Código | Qué pasa si algo falla |
|---|---|---|---|
| **1. Expandir** | Agregar `dias_disponibles` y `franja_horaria`, **nullable**, sin tocar `disponibilidad`. | Sin cambios. | Nada. Las columnas nuevas están vacías y nadie las mira. |
| **2. Rellenar** | Migración de datos que rellena las columnas nuevas a partir de la vieja. Se ejecuta **después** de verificar el respaldo (§8). | Sin cambios. | Se corrige y se vuelve a ejecutar. El dato original sigue intacto. |
| **3. Cambiar el código** | Ninguna. | El código escribe en las tres columnas y **lee de las nuevas**. Se despliega y se observa varios días. | Se revierte el despliegue. La columna vieja sigue completa y al día. |
| **4. Contraer** | `alter table ... drop column disponibilidad;` en una migración **aparte**, semanas después, con respaldo verificado del día. | Deja de escribir en la vieja. | Aquí ya no hay vuelta atrás sin restaurar. Por eso es un paso solo. |

Reglas que salen de ahí:

- **Nunca `alter table ... rename column`.** Un `rename` rompe el código viejo en el instante en que
  se aplica; no hay ventana de convivencia. Es agregar, rellenar, cambiar el código y quitar.
- **Nunca `drop column` en la misma migración que agrega su reemplazo.** Si están juntas, el paso 4
  ocurre a la vez que el paso 1 y se pierde la red.
- **Nunca `drop table` sin un respaldo verificado del mismo día**, y el volcado se guarda con el
  número de la migración en el nombre.
- Cambiar el tipo de una columna es lo mismo: columna nueva, rellenar, cambiar el código, quitar la
  vieja.
- Añadir una columna `not null` a una tabla con filas se hace en dos pasos: primero `null` con
  `default`, luego rellenar, luego `set not null`. En una sola sentencia falla o bloquea la tabla.
- Añadir un valor a un `CHECK` de estado es un `drop constraint` + `add constraint` en una sola
  transacción, sin ventana de inconsistencia. **Esta es la razón por la que §1.1 eligió `CHECK` y no
  tipos `enum`**: al `enum` se le puede añadir un valor, pero quitarlo obliga a reescribir la tabla.

## 6.4 Antes de aplicar en producción

```bash
npx supabase db reset          # aplica todo desde cero sobre la base local
npm run build                  # los tipos generados tienen que seguir compilando
npx supabase db diff --linked  # ¿queda alguna diferencia sin migrar?
npx supabase db push           # aplica en el proyecto remoto
```

Y después, siempre: correr las pruebas negativas de §4.3 contra el entorno remoto. Una migración que
crea una tabla y olvida su política deja un agujero que ninguna prueba funcional detecta, porque el
sitio sigue funcionando perfectamente. Solo lo ve quien lo busca.

---

# 7. Semillas

## 7.1 Dónde van, y por qué no en `seed.sql`

`supabase/seed.sql` solo se ejecuta con `npx supabase db reset` **en local**. Nunca corre en
producción. El catálogo y los ajustes iniciales no son datos de prueba: son el
contenido real de la fundación, y tienen que existir en el proyecto remoto desde el primer despliegue.

Por eso van en una **migración numerada**, con `on conflict do nothing` para que sea segura al
reaplicarse. `seed.sql` se reserva para lo que solo tiene sentido en local: dos noticias de ejemplo,
un evento pasado y otro futuro para probar el filtro de caducidad, y una solicitud de cita de mentira
para ver la bandeja llena.

## 7.2 El catálogo

Los `slug` son los de [`../CLAUDE.md`](../CLAUDE.md) §2 y **no se cambian**: son las URL públicas
(RF-14) y cualquier cambio posterior rompe enlaces ya compartidos. El `orden` lleva saltos de 10 para
poder intercalar sin renumerar; Edwin lo reordena desde el panel cuando quiera (C-11).

> **La copia canónica es [`src/lib/catalogo.ts`](../src/lib/catalogo.ts).** Mientras no exista la base
> de datos, el sitio lee de ahí. Cuando se escriba esta migración, se genera desde ese archivo — no se
> teclea. Dos copias a mano de diez textos en español divergen a la primera corrección de Edwin.

```sql
insert into public.proyectos
  (slug, tipo, nombre, nombre_corto, resumen, en_honor_a,
   color_acento, color_marca, logo_fondo, bloque_crisis, orden, activo) values

  -- ── Proyectos ───────────────────────────────────────────────────────
  ('psicoeducativo', 'proyecto',
   'Proyecto Psicoeducativo REFUVA', 'Psicoeducativo',
   'Orientación y acompañamiento para toda la comunidad educativa, no solo para los estudiantes.',
   null, '#903000', null, null, true, 10, true),

  ('psicoempresarial', 'proyecto',
   'Proyecto Psicoempresarial REFUVA', 'Psicoempresarial',
   'Formación y acompañamiento para convertir ideas en oportunidades y sueños en proyectos sostenibles.',
   null, '#903000', null, null, false, 20, true),

  ('rompiendo-el-circulo', 'proyecto',
   'Rompiendo el Círculo', 'Rompiendo el Círculo',
   'Acompañamiento a personas en riesgo social. Ninguna persona queda definida por sus circunstancias.',
   null, '#846000', '#c09000', '#ffffff', true, 30, true),

  ('historias-que-sanan', 'proyecto',
   'Historias que Sanan', 'Historias que Sanan',
   'Escritura terapéutica. Algunas historias necesitan ser contadas para comenzar a sanar.',
   null, '#9a3246', '#f0d8d8', '#ffffff', true, 40, true),

  ('grupo-un-solo-corazon', 'proyecto',
   'Grupo Un Solo Corazón', 'Un Solo Corazón',
   'Nació en la pandemia llevando bolsas de comida a familias. Sigue hasta hoy.',
   'Las familias que sostuvieron la pandemia sin soltarse',
   '#b81c00', '#d80000', '#cdcdcb', false, 50, true),

  ('una-estrella-otiliana', 'proyecto',
   'Una Estrella Otiliana', 'Una Estrella Otiliana',
   'El proyecto navideño. Nace en honor a Otilia, la abuela de Edwin.',
   'Otilia, la abuela de Edwin',
   '#806300', '#f0c000', '#ffffff', false, 60, true),

  ('comida-en-la-calle', 'proyecto',
   'Comida en la Calle, Esperanza en el Corazón', 'Comida en la Calle',
   'Alimento al cuerpo y esperanza al corazón, para personas en situación de calle.',
   null, '#903000', null, '#f6f6f6', false, 70, true),

  ('angelitos-de-la-calle', 'proyecto',
   'Angelitos de la Calle', 'Angelitos de la Calle',
   'Alimento para perritos y gatitos sin hogar. Ayudar a un animalito también transforma una vida.',
   null, '#006b6b', '#90c0c0', '#f5f5f5', false, 80, true),

  -- ── Campañas ────────────────────────────────────────────────────────
  -- Los colores de marca NO se tocan: el ámbar es el lazo internacional de
  -- prevención del suicidio y el verde el de salud mental.
  ('hablame-panama', 'campana',
   'Háblame Panamá', 'Háblame Panamá',
   'Campaña de prevención del suicidio. Nace en honor a Jessica.',
   'Jessica', '#8a6000', '#f0a800', '#fdfdfd', true, 10, true),

  ('escuchame-panama', 'campana',
   '#EscúchamePanamá', '#EscúchamePanamá',
   'Campaña de sensibilización en salud mental. Pedir ayuda es un acto de fortaleza.',
   null, '#006018', '#006018', '#fefefe', true, 20, true)

on conflict (slug) do nothing;
```

🔴 **Lo que estas filas no traen, y hay que pedirle a Edwin (P-08):** `historia`,
`poblacion_objetivo`, `requisitos_participacion`, `logo_url` e `imagen_portada_url`. Cada entrada
**nació de una historia y va en honor a alguien** (O-06); ese texto es lo que distingue al sitio de un
folleto y no lo podemos escribir nosotros. De `en_honor_a` solo hay tres confirmados y los otros
siete quedan en `null` — inventarlos sería peor que dejarlos vacíos. Está pedido en
[`06-inventario-contenido.md`](./06-inventario-contenido.md).

## 7.3 Ajustes iniciales

```sql
insert into public.ajustes (clave, valor, tipo, etiqueta, ayuda, grupo, orden, publico) values

  -- ---------------------------------------------------------------------
  -- BLOQUE DE CRISIS (RF-11). Es lo más delicado del sitio.
  -- Solo van los recursos VERIFICADOS. La 169 del MINSA y los números del
  -- INSAM NO se siembran: están en conflicto entre fuentes y sin confirmar.
  -- ---------------------------------------------------------------------
  ('crisis.titulo',
   to_jsonb('Si estás en peligro ahora mismo'::text),
   'texto', 'Título del bloque de crisis',
   'Encabezado que aparece antes del formulario de cita y en las páginas de salud mental.',
   'Crisis', 10, true),

  ('crisis.introduccion',
   to_jsonb('Este sitio no es un canal de emergencia. Si tu vida o la de otra persona está en riesgo, llama ahora.'::text),
   'texto_largo', 'Texto de introducción del bloque de crisis',
   'Va antes del primer campo del formulario, nunca al final en letra chica.',
   'Crisis', 20, true),

  ('crisis.recursos',
   '[
     {
       "nombre": "911",
       "numero": "911",
       "tel": "tel:911",
       "descripcion": "Emergencia con riesgo vital inminente. Atiende las 24 horas."
     },
     {
       "nombre": "Línea 147 (MIDES)",
       "numero": "147",
       "tel": "tel:147",
       "whatsapp": "6694-2747",
       "descripcion": "Línea de apoyo emocional gratuita y confidencial. 24 horas, todos los días del año."
     }
   ]'::jsonb,
   'lista', 'Recursos de crisis',
   'Cada recurso se muestra como texto seleccionable y como enlace para llamar. Verifica los números por teléfono antes de agregar uno nuevo.',
   'Crisis', 30, true),

  ('crisis.mensaje_de_esperanza',
   to_jsonb('Pedir ayuda es un acto de valentía. No estás solo.'::text),
   'texto', 'Mensaje de cierre',
   'Toda página que trate el tema cierra con recursos de ayuda y un mensaje de esperanza.',
   'Crisis', 40, true),

  -- ---------------------------------------------------------------------
  -- ATENCIÓN PSICOLÓGICA (S-01, S-03, S-05)
  -- ---------------------------------------------------------------------
  ('cita.precio_texto',
   to_jsonb('B/.15.00'::text),
   'texto', 'Precio de la consulta',
   'Escríbelo a mano y con este formato exacto. El balboa está a la par con el dólar.',
   'Citas', 10, true),

  ('cita.nota_jornadas_gratuitas',
   to_jsonb('También realizamos jornadas gratuitas. Si no puedes cubrir el costo, escríbenos igual: buscamos la forma.'::text),
   'texto_largo', 'Nota sobre jornadas gratuitas',
   'El precio no puede leerse como una barrera dura. Hay gente que no tiene esos B/.15.00.',
   'Citas', 20, true),

  ('cita.aviso_no_emergencia',
   to_jsonb('Esta solicitud no es un canal de emergencia y no se atiende en tiempo real.'::text),
   'texto', 'Aviso de que no es canal de emergencia',
   'Se muestra antes del primer campo del formulario.',
   'Citas', 30, true),

  ('cita.tiempo_de_respuesta',
   'null'::jsonb,
   'texto', 'Tiempo estimado de respuesta',
   'Ejemplo: «Te contestamos en un máximo de 48 horas». PENDIENTE: lo define Edwin.',
   'Citas', 40, true),

  ('cita.modalidades',
   'null'::jsonb,
   'lista', 'Modalidades de atención',
   'Virtual, presencial o ambas. PENDIENTE: lo define Edwin (S-05).',
   'Citas', 50, true),

  -- ---------------------------------------------------------------------
  -- DONACIONES (RF-09, S-06). Todo PENDIENTE hasta que Edwin lo entregue.
  -- ---------------------------------------------------------------------
  ('donaciones.yappy_alias',
   'null'::jsonb, 'texto', 'Alias de Yappy Comercial',
   'PENDIENTE (S-06). Requiere cuenta comercial en Banco General a nombre de la fundación.',
   'Donaciones', 10, true),

  ('donaciones.yappy_qr_ruta',
   'null'::jsonb, 'archivo', 'Código QR de Yappy',
   'PENDIENTE (S-06). Imagen descargable del QR.',
   'Donaciones', 20, true),

  ('donaciones.cuentas_bancarias',
   '[]'::jsonb, 'lista', 'Cuentas bancarias',
   'PENDIENTE (S-06). Banco, tipo de cuenta, número y titular exactamente como figura en el banco. Cada dato lleva botón de copiar.',
   'Donaciones', 30, true),

  ('donaciones.canal_comprobante',
   'null'::jsonb, 'texto', 'Dónde enviar el comprobante',
   'PENDIENTE. Correo o WhatsApp para enviar el comprobante y pedir recibo.',
   'Donaciones', 40, true),

  -- ---------------------------------------------------------------------
  -- CONTACTO (S-05, S-07, R-07)
  -- ---------------------------------------------------------------------
  ('contacto.whatsapp',
   'null'::jsonb, 'texto', 'WhatsApp de la fundación',
   'PENDIENTE (S-07). Número que se publicará en el sitio.',
   'Contacto', 10, true),

  ('contacto.correo_publico',
   'null'::jsonb, 'texto', 'Correo institucional',
   'PENDIENTE (R-07). El del dominio propio, no un Gmail personal.',
   'Contacto', 20, true),

  ('contacto.instagram_url',
   'null'::jsonb, 'enlace', 'Instagram de la fundación',
   'Octavio ya lo compartió con el equipo (S-08); falta pegarlo aquí.',
   'Contacto', 30, true),

  ('contacto.direccion',
   'null'::jsonb, 'texto_largo', 'Dirección física',
   'PENDIENTE (S-05). Solo si hay dirección publicable. Si está vacía, el mapa no se muestra.',
   'Contacto', 40, true),

  -- ---------------------------------------------------------------------
  -- OPERACIÓN. Estos NO son públicos.
  -- ---------------------------------------------------------------------
  ('notificaciones.correo_administracion',
   'null'::jsonb, 'texto', 'Correo que recibe los avisos de solicitudes',
   'PENDIENTE. Buzón institucional al que llega «tienes una nueva solicitud». Nunca lleva el contenido del formulario.',
   'Operación', 10, false),

  ('privacidad.version_vigente',
   to_jsonb('2026-09-v1'::text),
   'texto', 'Versión vigente de la política de privacidad',
   'Se guarda con cada envío de formulario. Cámbiala cada vez que el texto de la política cambie.',
   'Operación', 20, false),

  ('sitio.nombre',
   to_jsonb('Fundación REFUVA'::text),
   'texto', 'Nombre de la fundación',
   'Se usa en los metadatos, en los correos y en los datos estructurados.',
   'Operación', 30, true)

on conflict (clave) do nothing;
```

**Sobre los `null`.** `'null'::jsonb` es un nulo **de JSON**, no un `NULL` de SQL: la columna sigue
siendo `not null` y la fila existe con su etiqueta y su texto de ayuda, para que Edwin la vea en el
panel y sepa qué le falta llenar. Leído con `valor #>> '{}'` devuelve `NULL`, así que el código lo
trata como ausente sin ningún caso especial: el bloque de WhatsApp no se pinta, el mapa no se embebe
y el aviso a la administración no se encola.

🔴 **Todo lo marcado PENDIENTE en este bloque lo debe Edwin.** Está consolidado, con responsable, en
[`06-inventario-contenido.md`](./06-inventario-contenido.md). El sitio arranca sin ellos y esas
secciones simplemente no se muestran; ninguna pantalla queda rota por un dato que falta.

## 7.4 Las tareas programadas de RF-15

```sql
insert into public.tareas_programadas (nombre, descripcion, frecuencia, requisito, tolerancia) values
  ('ping-actividad',
   'Consulta trivial contra la base para que el plan gratuito no pause el proyecto a los 7 días.',
   'Diaria', 'RF-15', interval '36 hours'),

  ('sincronizar-instagram',
   'Lee el feed de Behold y actualiza la caché de instagram_posts sin tocar la bandera oculto.',
   'Diaria', 'RF-05, RF-15', interval '48 hours'),

  ('cerrar-convocatorias',
   'Marca cerrada_en y avisa de las convocatorias cuya ventana ya pasó.',
   'Diaria', 'RF-13, RF-15', interval '36 hours'),

  ('purga-retencion',
   'Ejecuta purgar_datos_vencidos() y borra los datos personales que cumplieron su plazo.',
   'Diaria', 'RF-15, §5', interval '36 hours'),

  ('respaldo-base-de-datos',
   'Volcado completo con supabase db dump hacia el destino externo definido en §8.',
   'Semanal', 'RF-15, §8', interval '9 days'),

  ('reintento-correos',
   'Reenvía las notificaciones pendientes o fallidas cuyo próximo intento ya venció.',
   'Cada hora', 'RF-02, RF-15', interval '3 hours'),

  ('aviso-solicitudes-sin-atender',
   'Avisa si alguna solicitud lleva más de 7 días en la bandeja sin gestionar.',
   'Semanal', 'RF-12, RF-15', interval '9 days'),

  ('revalidar-numeros-crisis',
   'Avisa que hay que volver a llamar al 911 y al 147 y anotar la fecha de verificación.',
   'Semestral', 'RF-11, RNF-06', interval '190 days')

on conflict (nombre) do nothing;
```

La `tolerancia` de cada una es holgada a propósito: una tarea diaria con 36 horas de margen no dispara
alarma por un retraso de un par de horas, pero sí por un día entero de silencio. Es el equilibrio que
hace que la alerta signifique algo cuando Edwin la vea.

**`revalidar-numeros-crisis` es la única tarea que no automatiza nada: le recuerda a una persona que
levante el teléfono.** Cada seis meses avisa de que hay que volver a llamar al 911 y a la Línea 147,
comprobar qué contestan y anotar la fecha en `ajustes.verificado_en` (RF-11). Un número de una línea
de prevención del suicidio que dejó de responder hace daño real, y un dato sin fecha de verificación
envejece en silencio. Los 190 días de tolerancia dan un mes de margen sobre el semestre: si nadie la
ejecuta, la vista `tareas_en_alerta` la pinta en rojo. El **responsable con nombre** está en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md); una tarea de recordatorio sin dueño no
la hace nadie.

## 7.5 El primer administrador

No se siembra por SQL. Se crea invitando el correo institucional desde *Authentication → Users* en el
panel de Supabase, y después:

```sql
update public.perfiles
   set rol = 'administrador', activo = true
 where lower(correo) = lower('CORREO_INSTITUCIONAL_DE_LA_FUNDACION');
```

**Va a nombre de la fundación, nunca al Gmail de un estudiante** ([`../CLAUDE.md`](../CLAUDE.md) §5.3,
AC-10). Y desde el día del lanzamiento tiene que haber **al menos dos administradores activos, ambos
con segundo factor** (RF-04, C-10, AC-09). 🔴 Quién es la segunda persona sigue pendiente de Edwin.

---

# 8. Respaldo y restauración

## 8.1 El hecho incómodo

**El plan gratuito de Supabase no incluye ningún respaldo automático.** La documentación oficial lo
dice sin rodeos: recomienda que los proyectos del plan gratuito exporten sus datos con regularidad
usando `supabase db dump` y mantengan respaldos externos. Los respaldos diarios automáticos empiezan
en el plan Pro, con 7 días de retención; la recuperación a un punto en el tiempo es un complemento de
pago que además exige un complemento de cómputo, y queda fuera de este presupuesto
([`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md)).

Traducido: **si nadie hace el respaldo, no hay respaldo.** Y el equipo se retira (X-01). Por eso esta
sección no es una recomendación, es un procedimiento con responsable.

## 8.2 Qué se respalda

Cuatro cosas, y las cuatro hacen falta. Con tres de ellas no se reconstruye el sitio.

| Qué | Dónde vive | Cómo se respalda | Frecuencia |
|---|---|---|---|
| **Esquema y datos** | PostgreSQL en Supabase | `supabase db dump`, comprimido | Semanal, automático |
| **Imágenes** | Supabase Storage | Sincronización del bucket a la carpeta de la fundación | Mensual, y tras cada carga grande |
| **Contenido del panel en JSON** | Se genera de `contenidos`, `proyectos` y `ajustes` | Exportación versionada en el repositorio | Semanal, automático |
| **Migraciones y código** | Git | Ya está versionado; basta con que el repositorio tenga más de un dueño | Continuo |

El tercero merece una explicación, porque es el que la gente omite. El volcado SQL sirve para
restaurar en Supabase. El **JSON versionado del contenido** sirve para algo distinto: sobrevivir a la
pérdida total del proveedor. Si un día no hay Supabase, con ese JSON el contenido de la fundación
—las historias del catálogo, las noticias, las fotos con su texto alternativo— se puede volver a publicar en
cualquier cosa. Es barato, cabe en el repositorio y es el único respaldo que no depende de nadie.

## 8.3 Con qué frecuencia, y dónde se guarda

| Copia | Cuándo | Dónde | Quién responde |
|---|---|---|---|
| Semanal automática | Domingos de madrugada | Repositorio privado de respaldos **de la fundación** | Automatización (`respaldo-base-de-datos`) |
| Mensual manual | Primer lunes del mes | Carpeta de la fundación en su nube institucional | Edwin, con el manual delante |
| Previa a migración destructiva | Antes del paso 4 de §6.3 | Junto al número de la migración | Quien aplique la migración |

**Dos copias en dos lugares distintos, siempre.** Y ninguna en una cuenta personal de un estudiante:
las cuentas van a nombre de la fundación ([`../CLAUDE.md`](../CLAUDE.md) §5.3).

**La copia mensual manual de Edwin no es redundancia burocrática.** Es la que sigue existiendo el día
que la automatización se rompa y nadie se dé cuenta. Son dos clics en el panel de Supabase y están
documentados con capturas en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).

## 8.4 Los comandos

```bash
# Volcado completo: esquema + datos + roles.
supabase db dump --db-url "$DATABASE_URL" --file "refuva-$(date +%Y-%m-%d).sql"

# Solo datos, útil para recargar sobre un esquema ya migrado.
supabase db dump --db-url "$DATABASE_URL" --data-only \
  --file "refuva-datos-$(date +%Y-%m-%d).sql"

gzip "refuva-$(date +%Y-%m-%d).sql"
```

Una base por debajo de 500 MB —y esta será mucho menor, porque las imágenes van a Storage y no a la
base— se exporta en segundos, y el archivo comprimido pesa unos pocos megabytes.

```bash
# Restauración sobre una base local limpia, para probar.
npx supabase start
gunzip -c refuva-2026-09-06.sql.gz | psql "postgresql://postgres:postgres@localhost:54322/postgres"
```

## 8.5 Retención de los respaldos

| Copia | Cuántas se guardan | Por qué |
|---|---|---|
| Semanales | Las **12 últimas** (unos 3 meses) | Cubre el plazo de purga más corto: un dato borrado por retención desaparece de todos los respaldos como máximo 90 días después. |
| Mensuales | Las **12 últimas** (un año) | Para recuperar un contenido borrado por error hace meses. Se conserva **solo el volcado de contenido**, no el de datos personales. |
| Previas a migración | Hasta que la migración lleve un mes estable | Su única función es poder revertir. |

> **Esto es lo que hace honesta la política de retención de §5.** No sirve de nada borrar una
> solicitud de cita a los 90 días si el volcado del año pasado la sigue teniendo. El volcado mensual
> de largo plazo se genera **con `--exclude-table` sobre las tablas de formulario**, precisamente
> para que la memoria institucional se pueda guardar años sin arrastrar datos de personas.

```bash
# Volcado mensual de largo plazo: contenido sí, personas no.
supabase db dump --db-url "$DATABASE_URL" \
  --exclude-table 'public.solicitudes_cita' \
  --exclude-table 'public.inscripciones_voluntariado' \
  --exclude-table 'public.inscripciones_padrinos' \
  --exclude-table 'public.postulaciones_comunidad' \
  --exclude-table 'public.solicitudes_alianza' \
  --exclude-table 'public.mensajes_contacto' \
  --exclude-table 'public.notas_internas' \
  --exclude-table 'public.notificaciones_pendientes' \
  --exclude-table 'public.envios_en_cuarentena' \
  --file "refuva-contenido-$(date +%Y-%m).sql"
```

## 8.6 Cómo se prueba que la restauración funciona

Un respaldo que nunca se ha restaurado no es un respaldo: es un archivo. La prueba se hace
**trimestralmente** y también **el día de la capacitación**, con Edwin mirando, para que sepa que
existe y a quién llamar.

Procedimiento, unos 20 minutos:

1. `npx supabase start` — base local limpia.
2. Restaurar el volcado semanal más reciente.
3. Correr la comprobación de abajo y comparar contra los mismos números en producción.
4. `npm run dev` y abrir el sitio contra la base restaurada: Inicio, un proyecto, una noticia, el
   panel.
5. Anotar el resultado en `tareas_programadas` (`registrar_tarea('respaldo-base-de-datos', ...)`) y
   en la bitácora de operación.

```sql
-- Comprobación de integridad tras restaurar. Se compara con producción.
select 'proyectos'        as tabla, count(*) from public.proyectos        union all
select 'contenidos',            count(*) from public.contenidos           union all
select 'contenidos_publicados', count(*) from public.contenidos
                                          where estado = 'publicado'      union all
select 'convocatorias',         count(*) from public.convocatorias        union all
select 'ajustes',               count(*) from public.ajustes              union all
select 'solicitudes_cita',      count(*) from public.solicitudes_cita     union all
select 'padrinos',              count(*) from public.inscripciones_padrinos union all
select 'bitacora',              count(*) from public.bitacora;

-- Y lo que de verdad se olvida al restaurar: las políticas.
select count(*) as politicas_rls from pg_policies where schemaname = 'public';
```

El último punto es el que suele fallar. Un volcado restaurado con las tablas pero sin las políticas
RLS deja la base abierta y el sitio funcionando **perfectamente**, así que nadie lo nota. Por eso el
recuento de políticas está en la lista de verificación, y por eso las pruebas negativas de §4.3 se
corren también después de cada restauración.

## 8.7 Si el proyecto se pausa

El plan gratuito pausa los proyectos tras 7 días sin actividad. Contra eso hay dos capas: que el
contenido se consulte en tiempo de ejecución —para que el tráfico real cuente como actividad— y el
ping diario de RF-15.

Si aun así se pausa, se reactiva desde el panel de Supabase. 🟡 **Hay una contradicción sin resolver en
la ventana de restauración**: la documentación vigente habla de restaurar hasta un año después de la
pausa, pero un anuncio oficial de 2024 fijó 90 días, tras los cuales solo queda descargar el último
respaldo lógico y los objetos de Storage. **Asumimos el escenario conservador: 90 días.** Un proyecto
pausado no se deja más de un trimestre. Va en el calendario de renovaciones de
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).

---

# 9. Consultas frecuentes

Todas presentan las fechas en `America/Panama`. **Se almacena en UTC y se convierte al mostrar**,
nunca al revés. Panamá es UTC−5 fijo, sin horario de verano, pero eso no es motivo para guardar hora
local: el día que alguien consulte el sitio desde otro huso, la conversión tiene que existir.

## 9.1 Próximos eventos (Inicio)

RF-01: un evento vencido deja de listarse **sin borrarse**. Nótese que la caducidad la aplica el
`where`, no un trabajo programado.

```sql
select
  c.id,
  c.titulo,
  c.slug,
  c.resumen,
  c.lugar,
  c.imagen_portada_url,
  c.imagen_portada_alt,
  p.nombre_corto                                   as proyecto,
  p.slug                                           as proyecto_slug,
  c.fecha_inicio at time zone 'America/Panama'     as inicia,
  c.fecha_fin    at time zone 'America/Panama'     as termina
from public.contenidos c
left join public.proyectos p on p.id = c.proyecto_id
where c.tipo         = 'evento'
  and c.estado       = 'publicado'
  and c.eliminado_en is null
  and coalesce(c.fecha_fin, c.fecha_inicio) >= now()
order by c.fecha_inicio asc
limit 6;
```

`coalesce(fecha_fin, fecha_inicio)` es la clave: un evento de un solo día vence al pasar su fecha de
inicio; uno de varios días sigue vigente hasta su fecha de fin. Sin el `coalesce`, una campaña de un
mes desaparecería del sitio el segundo día.

## 9.2 Noticias publicadas, paginadas

```sql
-- Primera página.
select id, titulo, slug, resumen, imagen_portada_url, imagen_portada_alt,
       publicado_en at time zone 'America/Panama' as publicado
from public.contenidos
where tipo = 'noticia' and estado = 'publicado' and eliminado_en is null
order by publicado_en desc, id desc
limit 10;

-- Páginas siguientes: paginación por cursor, no por OFFSET.
select id, titulo, slug, resumen, imagen_portada_url, imagen_portada_alt,
       publicado_en at time zone 'America/Panama' as publicado
from public.contenidos
where tipo = 'noticia' and estado = 'publicado' and eliminado_en is null
  and (publicado_en, id) < ($1::timestamptz, $2::uuid)   -- último de la página anterior
order by publicado_en desc, id desc
limit 10;
```

**Por qué cursor y no `offset`.** Con `offset 40`, PostgreSQL lee y descarta 40 filas antes de
devolver nada, y el costo crece con la página. Peor: si se publica una noticia mientras alguien está
en la página 3, las filas se corren y el visitante ve una repetida. La comparación de tuplas
`(publicado_en, id) < (...)` usa directamente el índice `contenidos_noticias_publicas_idx` y no se
desordena. El `id` desempata cuando dos noticias comparten fecha exacta.

## 9.3 Solicitudes pendientes, la más vieja primero

RF-12: *«las solicitudes de cita se ordenan por antigüedad y la más vieja se destaca. Alguien
pidiendo ayuda psicológica no puede quedar sepultado bajo inscripciones de voluntariado.»*

```sql
select
  s.id,
  s.nombre,
  s.contacto_preferido,
  s.modalidad,
  s.estado,
  s.creado_en at time zone 'America/Panama'          as recibida,
  extract(day from now() - s.creado_en)::int         as dias_esperando,
  (now() - s.creado_en > interval '7 days')          as lleva_mas_de_una_semana
from public.solicitudes_cita s
where s.estado in ('pendiente', 'en_gestion')
order by s.creado_en asc
limit 50;
```

**El `motivo` no está en el listado a propósito.** La bandeja muestra quién espera y desde cuándo; el
motivo de consulta se lee al abrir el detalle, y ese acceso queda registrado en la bitácora
(`accion = 'ver_solicitud'`, §3.16). Ver una lista no debería exponer el motivo de consulta de treinta
personas de un vistazo, con el panel abierto en un escritorio compartido.

`dias_esperando` y `lleva_mas_de_una_semana` son lo que el panel pinta en rojo y lo que alimenta el
aviso semanal de RF-15.

## 9.4 Contadores de la bandeja

Lo primero que ve un administrador al entrar (RF-12). Una sola consulta, no seis.

```sql
select 'Citas'          as bandeja, count(*) from public.solicitudes_cita
        where estado = 'pendiente'                                   union all
select 'Padrinos',            count(*) from public.inscripciones_padrinos
        where estado = 'pendiente'                                   union all
select 'Comunidades',         count(*) from public.postulaciones_comunidad
        where estado = 'pendiente'                                   union all
select 'Voluntarios',         count(*) from public.inscripciones_voluntariado
        where estado = 'pendiente'                                   union all
select 'Alianzas',            count(*) from public.solicitudes_alianza
        where estado = 'pendiente'                                   union all
select 'Contacto',            count(*) from public.mensajes_contacto
        where estado = 'pendiente';
```

## 9.5 Exportación de padrinos por programa

RF-03 y 3.2.6: descargar en CSV cualquier bandeja, filtrada por programa.

```sql
select
  ip.nombre                                       as "Nombre",
  ip.correo                                       as "Correo",
  ip.telefono                                     as "Teléfono",
  ip.cantidad_ninos                               as "Niños a apadrinar",
  ip.forma_entrega                                as "Cómo entrega el regalo",
  coalesce(ip.disponibilidad, '')                 as "Disponibilidad",
  ip.estado                                       as "Estado",
  to_char(ip.creado_en at time zone 'America/Panama', 'DD/MM/YYYY HH24:MI')
                                                  as "Fecha de inscripción",
  c.titulo                                        as "Convocatoria",
  p.nombre                                        as "Programa"
from public.inscripciones_padrinos ip
join public.convocatorias c on c.id = ip.convocatoria_id
join public.proyectos     p on p.id = c.proyecto_id
where p.slug = 'navidad'                     -- el programa que se exporta
  and c.cierra_en > now() - interval '1 year'
order by ip.creado_en asc;
```

**Tres cosas sobre la exportación:**

- El CSV se genera **desde el panel**, con la sesión del administrador, y el acto queda en la
  bitácora (`accion = 'exportar'`). No se exporta desde `psql` con la clave de servicio: eso saca
  datos personales sin dejar rastro de quién lo hizo.
- **UTF-8 con BOM.** Sin el BOM, Excel en español abre el archivo en la codificación del sistema y
  «Martínez» sale como «MartÃ­nez». Es un detalle de tres bytes que decide si el archivo es usable
  (RF-03).
- Las **notas internas nunca salen** en una exportación. Contienen apreciaciones del equipo sobre
  personas y su destino no es un archivo que circula por WhatsApp.

## 9.6 Página de un proyecto, con su galería y su convocatoria

```sql
-- Los datos del proyecto y su convocatoria abierta, si la hay.
select
  p.*,
  c.id                                          as convocatoria_id,
  c.titulo                                      as convocatoria_titulo,
  c.requisitos                                  as convocatoria_requisitos,
  c.texto_si_cerrada,
  c.cierra_en at time zone 'America/Panama'     as convocatoria_cierra,
  public.convocatoria_abierta(c.id)             as puede_inscribirse
from public.proyectos p
left join lateral (
  select * from public.convocatorias cc
   where cc.proyecto_id = p.id
   order by cc.abre_en desc
   limit 1
) c on true
where p.slug = $1 and p.activo;

-- Su galería de evidencia.
select ruta_storage, alt, pie, ancho, alto
from public.galeria_imagenes
where proyecto_id = $1
order by orden, creado_en;
```

El `left join lateral` trae la convocatoria más reciente del proyecto, esté abierta o cerrada. Es lo
que permite que la página muestre «cierra el 30 de noviembre» o «volvemos a abrir en agosto» según
corresponda, sin dos consultas y sin que el sitio tenga que adivinar (RF-07, RF-13).

---

# 10. Lo que este documento deja pendiente

| # | Qué falta | Quién lo debe | Qué bloquea |
|---|---|---|---|
| 1 | Aprobar los plazos de retención de §5 | Edwin, con el asesor legal de la fundación | El texto de la política de privacidad y la casilla de consentimiento |
| 2 | Textos del catálogo: historia, en honor a quién, población, requisitos, logos y fotos (P-08) | Edwin | Las semillas quedan a medias y las páginas de proyecto, vacías |
| 3 | Alias de Yappy, cuentas bancarias y canal de comprobante (S-06) | Edwin | La página de donaciones (RF-09) |
| 4 | WhatsApp institucional y correo del dominio propio (S-07, R-07) | Edwin | El aviso a la administración y los canales de contacto |
| 5 | Modalidad de atención y tiempo de respuesta (S-05) | Edwin | Campos del formulario de cita |
| 6 | Lista cerrada de formas de entrega del regalo | Edwin | `inscripciones_padrinos.forma_entrega` sigue siendo texto libre |
| 7 | Confirmar si se apadrina a uno o a varios niños | Edwin | `cantidad_ninos` es 🟡 |
| 8 | Verificar por teléfono la 169 del MINSA y los números del INSAM | Equipo (una llamada) | No se siembran hasta entonces (RF-11) |
| 9 | Consentimiento firmado para publicar fotos de niños y de personas en situación de calle | Edwin | `requiere_consentimiento` bloquea esas cargas |
| 10 | Segunda persona administradora (C-10) | Edwin | AC-09 y el traspaso |
| 11 | Confirmar si `pg_cron` cuenta como actividad frente a la pausa de Supabase | Equipo (prueba) | Nada: el ping externo ya lo cubre. Es una duda a cerrar, no un bloqueo |
| 12 | Confirmar si alguna convocatoria tiene aforo real y cuál es | Edwin | `convocatorias.cupo_maximo` es 🟡: existe la columna, pero nadie ha confirmado que se use |
| 13 | **Tabla de donaciones**, condicionada al **Formulario 61 de la DGI** (nombre, RUC o cédula, fecha y monto del donante) | Edwin, confirmando si la fundación tiene la autorización de la DGI | La tabla **no se diseña hasta que Edwin confirme**. Si la fundación está autorizada para emitir el certificado de donación deducible, hará falta guardar esos cuatro campos y tratarlos como dato personal con su propio plazo de retención en §5.1; si no lo está, no se guarda nada y las donaciones siguen siendo Yappy y ACH sin registro en la base (§5.5 de [`../CLAUDE.md`](../CLAUDE.md)) |
