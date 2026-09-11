# Portal Fundación REFUVA — instrucciones del proyecto

> Léelo antes de tocar nada. Aquí está lo que el proyecto es, lo que ya se decidió y por qué,
> y las reglas que no se negocian. Lo que no esté aquí, está en `docs/`.

## 1. Qué estamos construyendo

Un **portal web público + panel administrativo** para la **Fundación REFUVA**, una fundación
panameña sin fines de lucro que dirige el psicólogo **Edwin Quintero**.

El proyecto lo ejecuta un equipo de **servicio social universitario** (Octavio Frauca, Jeremy
Martínez, Rafael Gómez, Juan Zhu). Levantamiento hecho el **20 de agosto de 2026**.

**El requisito raíz, con las palabras de Edwin:** la gente cree que REFUVA «solo ve el tema de
salud mental». No es cierto — son **siete líneas de acción**. El portal existe para desmentir eso.
Toda decisión de diseño se juzga contra ese objetivo.

Los cinco trabajos que el sitio tiene que hacer bien:

1. Que en 10 segundos se entienda que REFUVA es siete proyectos, no uno.
2. Sacar las **solicitudes de cita psicológica** de WhatsApp y meterlas en un flujo con registro y correo.
3. Captar **padrinos, madrinas y voluntarios** sin que Edwin los atienda uno por uno por chat.
4. Recibir **donaciones** con confianza y sin fricción.
5. Que **Edwin publique y oculte contenido sin nosotros** — porque nos vamos.

## 2. Las siete líneas de acción

Nómbralas siempre así. No inventes nombres ni los traduzcas.

| Código | Proyecto | Nota |
|---|---|---|
| `psicoeducativo` | **Proyecto Psicoeducativo REFUVA** | El fundacional. +30 escuelas en lista; el grueso en la Escuela Jerónimo de la Osa. |
| `navidad` | **Fiesta navideña** para niños que nunca han vivido la Navidad | 3.er año. Dos convocatorias: comunidades y padrinos/madrinas. El monto del regalo **no lo fija REFUVA**. |
| `alimentacion` | **Alimentación a personas en situación de calle** | Empezó con 50 raciones, hoy +100. «El hambre no es un solo día». |
| `animales` | **Alimentación a animales callejeros** | Va junto con `alimentacion`. Meta: refugio con adopción. |
| `prevencion-suicidio` | **Campaña del Día Mundial para la Prevención del Suicidio** | Del 10 de agosto al **10 de septiembre**. Terapia gratuita en la calle y abrazos. |
| `rompiendo-el-circulo` | **Rompiendo el Círculo** | Barrios y escuelas de área roja. Abrió las cárceles: capacitación a privados de libertad. |
| `historias-que-sanan` | **Historias que Sanan** | Escritura terapéutica, liderada por escritores publicados. |

Cada proyecto **tiene logo propio** y **nació de una historia, en honor a alguien**. Eso es material
narrativo del sitio, no adorno: es lo que distingue a REFUVA de una ONG genérica.

## 3. El stack, y por qué

Decidido el 6 de septiembre de 2026. La justificación larga, con precios y fuentes, está en
`docs/05-stack-y-presupuesto.md`. Aquí va lo corto.

| Capa | Elección | Razón de una línea |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | Un solo framework para el sitio público, el panel y los endpoints de servidor. El equipo ya sabe React. |
| Estilos | **Tailwind CSS + shadcn/ui** | Rápido de mover y accesible por defecto. Los componentes viven en el repo, no en un paquete que caduque. |
| Base de datos, Auth, Storage | **Supabase** (Postgres) | Lo pidió el equipo y encaja. Postgres de verdad, RLS, y auth resuelto para 2–3 administradores. |
| Automatizaciones | **n8n** | Correos, avisos y trabajos programados. **No es el backend del sitio** — ver §4. |
| Correo transaccional | **Resend** | 3.000/mes gratis, tope de **100/día**. Ese tope muerde en la campaña navideña: ver §7. |
| Hosting | **Vercel** (Hobby para empezar) | Alternativa real: autohospedar en el Coolify que el equipo ya opera. Comparadas en `docs/05`. |
| Analítica | **Cloudflare Web Analytics** | Sin cookies ⇒ sin banner de consentimiento. GA4 solo si se aprueba Google Ad Grants. |
| Dominio | **refuva.org** (~USD 12/año) | El `.org.pa` cuesta el doble, obliga a 2 años por adelantado y exige revisión documental. |
| Feed de Instagram | **Behold.so** (gratis), leído desde el servidor | Behold renueva el token de Meta. Nosotros no dejamos ningún secreto que caduque. |

**Correr el proyecto en local** — sí, es Node, y sí, es `npm run dev`:

```bash
npm install
npm run dev            # Next.js en http://localhost:3000
npx supabase start     # Postgres + Auth + Storage locales (necesita Docker)
npx supabase db reset  # aplica supabase/migrations/ y las semillas
```

## 4. Dónde va n8n, y dónde no

Esta es la regla de arquitectura más importante del proyecto. **n8n es la capa de automatización,
no el backend de petición-respuesta.**

```
Navegador
   │  POST (Server Action / Route Handler)
   ▼
Next.js ──── valida con Zod ────► Supabase (Postgres)   ◄── la escritura ocurre AQUÍ, y es lo único crítico
   │                                    │
   │                                    │ Database Webhook (pg_net, con reintentos)
   │                                    ▼
   │                                  n8n ──► Resend (confirmación al solicitante)
   │                                      ──► aviso a la administración: tipo, programa,
   │                                          fecha y enlace al panel — nunca el contenido
   ▼
Next.js lee Supabase directamente para renderizar las páginas (SSR/ISR)
```

**Por qué así, y no con el formulario apuntando directo a un webhook de n8n:** el formulario de
cita lo llena alguien pidiendo ayuda psicológica. Si n8n está caído, pausado o el webhook cambió
de URL, ese mensaje **se pierde en silencio**. Con este orden, el dato queda guardado en Postgres
antes de que ninguna automatización corra; si n8n falla, la solicitud sigue ahí y se puede reprocesar.

**n8n sí se encarga de:**
- Correo de confirmación al solicitante y aviso a Edwin (RF-02). El aviso lleva tipo, programa, fecha
  y un enlace al panel autenticado — **nunca el contenido del formulario**. Los datos se leen dentro
  del panel, no en un buzón de Gmail.
- Clasificar voluntarios y padrinos por programa (RF-03). **Nada de hojas de cálculo compartidas**:
  la exportación es a CSV, bajo demanda y desde el panel.
- **Ping programado a Supabase** para que el proyecto Free no se pause a los 7 días.
- Refresco diario del feed de Instagram hacia la caché en Supabase.
- Aviso de convocatorias vencidas (RF-13). Ojo: un evento vencido deja de listarse porque **la
  consulta filtra por fecha**, no porque un trabajo programado lo apague. La tarea solo avisa.
- Respaldo semanal de la base y recordatorio semestral de revalidar los números de crisis.

**n8n nunca:**
- Sirve contenido de páginas públicas. Eso mata el SEO y agrega un punto de fallo donde no hace falta.
- Es el destino directo de un `<form>`.
- Guarda el registro de verdad. Postgres es la fuente de verdad; n8n solo reacciona.
- Autentica a nadie. Eso es Supabase Auth.

Si n8n no está disponible cuando toque implementar, un Route Handler de Next.js + Resend cubre lo
mismo. La arquitectura no depende de n8n; n8n es una comodidad de mantenimiento.

## 5. Reglas que no se negocian

### 5.1 Este sitio habla de suicidio

No es contenido neutro y **no se escribe a ojo**.

- **Nunca**: métodos, lugares, descripciones detalladas, cifras sensacionalistas, fotos del duelo,
  ni las expresiones «cometió suicidio», «suicidio exitoso» o «suicidio fallido». Se dice
  **«murió por suicidio»** o **«se quitó la vida»**.
- **Siempre**: toda página que toque el tema cierra con recursos de ayuda y un mensaje de esperanza.
- **Bloque de crisis visible y permanente**, con solo lo verificado:
  - **911** — emergencia con riesgo vital inminente.
  - **Línea 147 (MIDES)** — gratuita, confidencial, 24/7/365. WhatsApp **6694-2747**.
  - La **169 del MINSA** y los números del **INSAM** **NO se publican**: están sin verificar y en
    conflicto entre fuentes. Alguien del equipo tiene que **llamar** y anotar qué contesta antes de
    ponerlos. Un número equivocado en una página de prevención del suicidio hace daño real.
- El formulario de cita **abre** con el bloque de crisis y con «esto no es un canal de emergencia»,
  antes del primer campo. No al final en letra chica.

### 5.2 Minimización de datos

- El formulario público **no pide** diagnóstico, síntomas, medicación ni relato clínico. Nombre,
  contacto, motivo opcional en una línea, modalidad y disponibilidad. Nada más.
- **Datos de menores: no entran al sistema en v1.** Ni por formulario ni en columnas de texto —
  nombre, edad, escuela, comunidad, lista nominal. Los padrinos se registran; el emparejamiento
  padrino↔niño ocurre fuera de línea. No hay tabla de niños. Un conteo agregado («20 niños en la
  comunidad») no es un dato de un niño y sí se puede guardar.
  **Única excepción:** imágenes de menores en la galería de evidencia, y solo con consentimiento
  firmado registrado. Sin ese consentimiento, la foto no se publica.
- Consentimiento con casilla **activa, nunca premarcada**, en lenguaje llano y con enlace a una
  política de privacidad legible.
- Retención definida por tabla, y borrado real cuando vence.
- Nadie más que los administradores autenticados ve una solicitud. RLS activo en toda tabla con
  datos de personas — sin excepción y sin «lo arreglamos después».

### 5.3 Nada que dependa de nosotros después de la entrega

El equipo entrega y se retira. Por lo tanto:

- Cero secretos que caduquen sin renovación automática (por eso Behold y no la API de Meta a mano).
- Cero trabajos programados en GitHub Actions: se apagan solos a los 60 días sin actividad del repo,
  que es exactamente el escenario post-entrega.
- Cuentas a nombre de **la fundación**, jamás al Gmail de un estudiante.
- Todo proceso operativo queda en `docs/09-operacion-y-traspaso.md` con **responsable con nombre**.

### 5.4 Accesibilidad y rendimiento

- **WCAG 2.2 nivel AA.** El público incluye a gente en pobreza, en crisis y con teléfonos viejos.
  La legibilidad aquí es un requisito de seguridad, no de estilo.
- Contraste 4.5:1 en texto normal, área táctil mínima 24×24 px, todo operable por teclado, foco visible.
- **Core Web Vitals**: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 en el percentil 75.
- Imágenes siempre por `next/image` con `width`/`height` — el sitio va lleno de fotos de evidencia
  y el CLS es el riesgo obvio.

### 5.5 Pagos

- El sitio **no procesa, no transmite y no almacena datos de tarjeta**. Nunca. Se redirige a un
  checkout alojado del proveedor.
- **v1 no cobra la consulta de B/.15.00 en línea.** Eso saca al proyecto del alcance PCI y de la
  zona gris del uso comercial en el hosting gratuito.
- Donaciones v1: alias y QR de **Yappy Comercial** (1% + ITBMS, comisión máxima B/.10.70) más los
  datos de **ACH** en texto copiable. Es lo que ya hacen las fundaciones panameñas reales.
- El Botón de Pago Yappy V2 (que sí exige backend, con IPN y HMAC-SHA256) queda para v2.
- **Bloqueante externo**: Yappy Comercial exige cuenta comercial en Banco General **a nombre de la
  fundación** y Banca en Línea Comercial activa. Ese trámite es el camino crítico; hay que empezarlo
  antes que el código.

## 6. Convenciones de código

- **TypeScript estricto.** Nada de `any`. Si no sabes el tipo, modela lo desconocido con `unknown` y
  estréchalo.
- **Validación con Zod en el borde**, y el mismo esquema en cliente y servidor. Los tipos se derivan
  con `z.infer`; no se escriben dos veces.
- **Server Components por defecto.** `'use client'` solo cuando hay estado o eventos, y lo más abajo
  posible en el árbol.
- **Nunca `SUPABASE_SERVICE_ROLE_KEY` en el cliente.** Solo en Route Handlers y Server Actions.
- **Migraciones en `supabase/migrations/`**, numeradas, hacia adelante, nunca editadas después de
  aplicarse. Toda tabla nueva nace con RLS habilitado.
- **Contenido en español de Panamá.** Moneda escrita a mano como `B/.15.00`; no confíes en `Intl`
  para el balboa. Fechas en `America/Panama`.
- **Sin fallos silenciosos.** Un `catch` que solo hace `console.error` y sigue es un bug. Si algo
  falla en el camino de una solicitud de ayuda, tiene que verse.
- Commits en formato convencional y en español: `feat(citas): ...`, `fix(cms): ...`.

## 7. Cosas que se dijeron en la reunión y son incorrectas

Están corregidas en `docs/`, pero repítelas cuando surjan, porque quedaron en la grabación:

| Se dijo | Realidad |
|---|---|
| «Resend recibe correos y reemplaza el Gmail» | Resend **solo envía**. No es un buzón. El buzón sale de Google Workspace for Nonprofits. |
| «Google Analytics tiene pago mensual» | **GA4 estándar es gratuito.** Lo que se paga es Google Ads. |
| «Supabase Pro es casi ilimitado» | Tiene cuotas y cobra el excedente. Y el plan Free **pausa el proyecto a los 7 días sin actividad**. |
| «Habría que mudarse a SQL Server» | Innecesario. Postgres cubre de sobra el crecimiento previsible. |
| Stripe como opción de pago | **Stripe no opera en Panamá.** En Latinoamérica solo Brasil y México. |
| El nombre «RECUBA» / «Reflua» / «Taster» | Es ruido del transcriptor. Es **REFUVA**, siempre. |

Además, Edwin **paga OneDrive de su bolsillo** para guardar la evidencia de las actividades.
Google Workspace for Nonprofits es gratuito y Panamá es país elegible. Resolverlo es de las cosas de
mayor valor y menor esfuerzo del proyecto — y no es código.

## 8. Mapa de `docs/`

| Archivo | Qué contiene |
|---|---|
| `docs/00-fuentes/` | Material original intacto: transcripción, los dos REFUVA v1.0 y los binarios. **No se edita.** |
| `docs/00-fuentes/hechos-verificados.md` | Lo que Edwin afirmó, destilado. **Fuente de verdad de los requisitos.** |
| `docs/01-srs.md` | El SRS que las historias citaban y no existía. RF-01 a RF-15 y el alcance. |
| `docs/02-historias-usuario.md` | Las 21 historias v1.0 ampliadas y con trazabilidad. |
| `docs/03-arquitectura-informacion.md` | Mapa del sitio, plantillas y jerarquía de navegación. |
| `docs/04-requisitos-no-funcionales.md` | Seguridad, privacidad, accesibilidad, rendimiento, contenido sensible. |
| `docs/05-stack-y-presupuesto.md` | Decisiones técnicas con precios verificados y el presupuesto que Edwin pidió. |
| `docs/06-inventario-contenido.md` | Qué le falta entregar a Edwin, con responsable y estado. |
| `docs/07-modelo-datos.md` | Esquema de Postgres, políticas RLS y retención. |
| `docs/08-plan-de-trabajo.md` | Fases, hitos y las fechas duras (10 de septiembre, Navidad). |
| `docs/09-operacion-y-traspaso.md` | Capacitación, manual, calendario de renovaciones y responsables. |
| `docs/adr/` | Decisiones de arquitectura, una por archivo, con su alternativa descartada. |

## 9. Antes de dar algo por terminado

- ¿Corre `npm run build` sin errores ni advertencias de tipos?
- ¿Toda tabla nueva tiene RLS y una política probada con un usuario que **no** debería ver el dato?
- ¿La pantalla funciona con teclado, tiene foco visible y pasa contraste AA?
- ¿Hay algún `catch` que se traga un error en el camino de una solicitud de ayuda?
- Si toca contenido de salud mental: ¿cumple §5.1?
- ¿Se puede editar desde el panel, o acabas de crear algo que solo nosotros sabemos cambiar?

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
