# ADR-0002: n8n como capa de automatización, nunca como backend

Estado: Aceptada | Fecha: 6 de septiembre de 2026 | Decide: equipo de desarrollo

## Contexto

Esta es la decisión de arquitectura más importante del proyecto. De ella depende que una solicitud de
ayuda psicológica no se pierda.

El sistema tiene que hacer dos cosas distintas cuando alguien envía un formulario. Una es **guardar
el dato**: sin eso no hay nada. La otra es **avisar** — confirmar al solicitante, notificar a la
administración y clasificar por programa dentro de la misma base (RF-02, RF-03). La segunda es
cómoda; la primera es crítica. Tratarlas igual es el error.

n8n es atractivo porque resuelve la parte cómoda casi sin código y porque un flujo en un lienzo se
entiende sin ser programador. La tentación evidente es apuntar el `<form>` directamente a un webhook
de n8n y ahorrarse el backend entero.

**El escenario que eso produce, en concreto.** Una persona en un momento difícil abre
`/agendar-cita`, lee el bloque de crisis, llena su nombre, su teléfono y un motivo de una línea, y
presiona «Enviar». El navegador manda la petición al webhook de n8n. Pero la instancia de n8n está
caída, o el contenedor se reinició, o el flujo quedó desactivado tras una edición, o la URL del
webhook cambió cuando alguien lo pasó de prueba a producción. La petición falla. Puede que el sitio
muestre «gracias, te contactaremos pronto» igual, porque el manejo de errores del cliente casi nunca
distingue. **Nadie se entera nunca.** No hay fila en ninguna tabla, no hay correo, no hay bandeja con
un pendiente. Edwin no sabe que esa persona escribió, y esa persona cree que ya pidió ayuda.

Ese es un fallo silencioso en el camino de una solicitud de ayuda. Es el único fallo que este
proyecto no puede permitirse (CLAUDE.md §6, «sin fallos silenciosos»).

Se suma la restricción X-01: el equipo entrega y se retira. Nada crítico puede depender de una pieza
que alguien tenga que mantener encendida.

## Decisión

**n8n es la capa de automatización. No es el backend de petición-respuesta.**

El orden es fijo y no se negocia:

1. El navegador envía a una **Server Action o Route Handler de Next.js**.
2. Next.js valida con Zod y **escribe en PostgreSQL de forma síncrona**. Esa escritura es lo único
   crítico. Si falla, el usuario ve un error de verdad, no un «gracias».
3. La respuesta al usuario sale en cuanto el dato está guardado.
4. Postgres dispara un **Database Webhook** (`pg_net`, con reintentos) hacia n8n.
5. n8n **reacciona**: correo de confirmación por Resend, aviso a la administración, clasificación por
   programa y tareas programadas (RF-15). La exportación de datos no es una automatización: es un
   CSV bajo demanda desde el panel (RF-03).

El diagrama completo está en [`../../CLAUDE.md`](../../CLAUDE.md) §4 y en
[`../01-srs.md`](../01-srs.md) §5.2.

**n8n nunca:** sirve contenido de páginas públicas, es el destino directo de un `<form>`, guarda el
registro de verdad, ni autentica a nadie.

## Alternativas consideradas

| Opción | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **n8n como backend completo** (el `<form>` apunta al webhook) | Casi cero código propio. El flujo se ve en un lienzo y se edita sin desplegar. Rapidísimo de montar. | n8n queda como punto único de fallo en el camino de una solicitud de ayuda. No hay registro propio, no hay estado, no hay bandeja, no hay RLS, no hay validación de servidor compartida con el cliente. | Produce exactamente el fallo silencioso descrito arriba. Es incompatible con RF-02 y con el criterio AC-03. |
| **Supabase Edge Functions con Database Webhooks** | Una pieza menos que operar. Mismo proveedor, mismo panel, se despliega con el proyecto. Corre aunque nadie mantenga un servidor. | El código de correo y de clasificación hay que escribirlo y mantenerlo en Deno. Cambiar la redacción de una plantilla exige desplegar. Nadie del lado de la fundación puede tocarlo. | No es peor arquitectura: es peor traspaso (X-01, X-03). **Queda como reemplazo natural** si n8n desaparece; el orden síncrono no cambia. |
| **Route Handler llamando a Resend en la misma petición** | Lo más simple de todo. Cero infraestructura extra. Menos piezas que documentar. | El envío de correo entra en el camino de respuesta al usuario: un timeout de Resend se convierte en un error visible o, peor, en un `catch` que se traga el fallo. Los reintentos hay que escribirlos a mano. | Descartado **como diseño principal**, conservado como plan de contingencia explícito (CLAUDE.md §4). Cubre lo mismo si n8n no está disponible cuando toque implementar. |
| **Cola de trabajos propia** (tabla `outbox` + worker) | Control total, sin terceros, patrón conocido y correcto. | Hay que construir y operar el worker: reintentos, backoff, alertas, observabilidad. Es software nuevo que nadie va a mantener. | Reconstruye lo que el Database Webhook con `pg_net` y n8n ya dan hechos, y deja más código huérfano tras la entrega. |

## Consecuencias

**Lo que ganamos**

- **La arquitectura no depende de n8n.** Se puede quitar sin rehacer nada: se cambia el destino del
  Database Webhook, o se llama a Resend desde un Route Handler. Ninguna tabla, ningún formulario y
  ninguna pantalla cambian.
- AC-03 es demostrable: se corta la automatización, se envía una solicitud y la fila aparece igual,
  marcada como pendiente de notificar.
- La redacción de un correo se cambia sin desplegar el sitio.
- RF-15 vive fuera de GitHub Actions, cuyos workflows programados se desactivan solos a los 60 días
  sin actividad del repositorio — justo el escenario post-entrega.
- Postgres es la única fuente de verdad. No hay dos versiones del mismo dato.

**Lo que aceptamos**

- Dos sistemas que operar en vez de uno, y una pieza más que documentar en el traspaso.
- La notificación es «en cuanto se pueda», no instantánea garantizada. Por lo tanto **la bandeja
  (RF-12) es la fuente de verdad operativa, no el correo**. Eso hay que decírselo a Edwin en la
  capacitación con esas palabras.
- Una solicitud puede quedar guardada y sin notificar. Por eso existen el reintento cada hora y el
  aviso semanal de solicitudes sin atender (RF-15), y por eso cada fila lleva su marca de
  notificación (esquema en [`../07-modelo-datos.md`](../07-modelo-datos.md)).
- 🔴 **Pendiente abierto, y hay que decirlo así: dónde vive n8n no está resuelto.** El dueño de ese
  pendiente es **Rafael Gómez**, y abarca las tres preguntas juntas: en qué servidor se aloja la
  instancia, **quién la paga** y quién le aplica actualizaciones cuando el equipo se retire. El
  Coolify que el equipo opera hoy es infraestructura de un estudiante, no de la fundación, así que
  «ya existe un servidor» no es una respuesta. El costo de cada ruta está presupuestado en
  [`../05-stack-y-presupuesto.md`](../05-stack-y-presupuesto.md) §1 y §7.5 —donde la recomendación
  es la ruta de B/.0.00, Route Handler más cron gratuito—, y el responsable con nombre se cierra en
  [`../09-operacion-y-traspaso.md`](../09-operacion-y-traspaso.md). **Mientras ese pendiente siga
  abierto, la contingencia del Route Handler es la opción por defecto, no la de reserva.**

## Cuándo reconsiderar esta decisión

- **Si al llegar la fecha de traspaso nadie asume la instancia de n8n.** Entonces se implementa la
  contingencia: Route Handler más Resend, y las tareas programadas por Cron Trigger externo. El
  cambio afecta a una capa, no al diseño.
- **Si alguna automatización pasa al camino síncrono.** El ejemplo concreto es el cobro en línea con
  Botón de Pago Yappy V2 ([`0005-donaciones-sin-pasarela-en-v1.md`](./0005-donaciones-sin-pasarela-en-v1.md)):
  el endpoint IPN que valida HMAC-SHA256 **no va en n8n**, va en un Route Handler. Si esa pieza
  aparece, hay que revisar la frontera completa.
- **Si n8n cambia su licencia o su modelo de autohospedaje** de forma que la instancia gratuita deje
  de ser viable para la fundación.
