# Plan de trabajo — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 1.0 |
| **Fecha de corte** | 6 de septiembre de 2026 |
| **Estado** | Borrador para validación con Edwin Quintero |
| **Responsable del documento** | Jeremy Martínez (C-09) |
| **Secuencia que se respeta** | documentación → presupuesto → prototipado → validación de Edwin → desarrollo → capacitación (C-09) |

> **Cómo leer las fechas.** Solo hay tres fechas duras reales en este proyecto: hoy, el **10 de
> septiembre de 2026** y **diciembre de 2026**. Todo lo demás se cuenta en semanas. La **semana 1**
> es la que arranca inmediatamente después del 6 de septiembre. No se inventan fechas de calendario
> porque el equipo no puede comprometerlas todavía: ver los pendientes de la §1.3.

Estados, igual que en [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md):
✅ Confirmado · 🟡 Inferido (hay que confirmarlo) · 🔴 Pendiente (falta el dato).

---

# 1. Estado actual — 6 de septiembre de 2026

## 1.1 Lo que ya está hecho

| Trabajo | Resultado | Estado |
|---|---|---|
| Levantamiento de requisitos | Reunión del 20 de agosto de 2026, 37 minutos, con Edwin Quintero. Transcripción normalizada y depurada del ruido del transcriptor (O-01). | ✅ |
| Destilado de la fuente de verdad | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md): 7 líneas de acción, 10 peticiones de Edwin, 12 compromisos del equipo, 7 restricciones. | ✅ |
| Investigación técnica | [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md): ocho frentes con precios verificados y fuente por afirmación. Corrigió seis cosas que se dieron por buenas en la reunión (Resend, GA4, Supabase, SQL Server, Stripe, publicidad multi-red). | ✅ |
| SRS | [`01-srs.md`](./01-srs.md) v2.0. RF-01 a RF-15, módulos 3.1.x y 3.2.x, alcance explícito de lo que queda fuera. | ✅ Redactado, sin validar |
| Historias de usuario | [`02-historias-usuario.md`](./02-historias-usuario.md), las 21 originales ampliadas y trazadas a los RF. | ✅ Redactado, sin validar |
| Arquitectura de información | [`03-arquitectura-informacion.md`](./03-arquitectura-informacion.md): mapa del sitio y plantillas. | ✅ Redactado, sin validar |
| Requisitos no funcionales | [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md): accesibilidad, rendimiento, privacidad, contenido sensible. | ✅ Redactado, sin validar |
| Presupuesto | [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md). Es lo que Edwin pidió dos veces (R-09). | ✅ Redactado, sin presentar |
| Inventario de contenido | [`06-inventario-contenido.md`](./06-inventario-contenido.md): lo que Edwin tiene que entregar, con responsable. | ✅ Redactado, sin entregar |
| Modelo de datos | [`07-modelo-datos.md`](./07-modelo-datos.md): tablas, RLS y retención. | ✅ Redactado, sin validar |

**Traducción sin rodeos:** la fase de documentación de C-09 está terminada. La fase de presupuesto
está redactada pero **Edwin todavía no la ha visto**. Ese es el siguiente paso, y no es código.

## 1.2 Lo que sigue, en orden

1. Presentarle a Edwin los cinco documentos que le tocan (§6, hito **H1**).
2. Arrancar los trámites externos, que no dependen de nosotros y son el camino crítico (§5).
3. Prototipar y que Edwin dé el GO (§3, fases 2 y 3).
4. Construir en dos olas alrededor de la campaña navideña (§4).
5. Capacitar a dos personas y traspasar (§6, hitos **H6** y **H7**).

## 1.3 Lo que no sabemos y condiciona todo el plan

Estos tres pendientes pueden invalidar el calendario entero. Van primero para que nadie los lea al final.

| # | Pendiente | Quién lo debe | Por qué importa | Estado |
|---|---|---|---|---|
| PL-01 | **Fecha en que vence el periodo de servicio social de cada integrante.** | Jeremy Martínez, con el coordinador de servicio social | Si el periodo cierra antes de diciembre, el plan no cabe y hay que recortar la ola 2 hoy, no en noviembre. | 🔴 |
| PL-02 | **Horas semanales reales que cada uno puede dedicar.** El plan supone entre 8 y 12 horas por persona, unas 40 horas de equipo por semana. | Jeremy Martínez | Es el supuesto del que cuelgan todas las duraciones de la §3. Si son 20 horas de equipo, todo se duplica. | 🟡 |
| PL-03 | **Calendario académico: parciales, finales y semanas de entrega.** | Jeremy Martínez | Ver riesgo **R-03**. Se necesita para colocar los hitos de validación fuera de esas semanas. | 🔴 |

---

# 2. Las fechas que no se mueven

X-07 lo dice: el calendario del proyecto se ordena alrededor de las fechas de la fundación, no al revés.

## 2.1 10 de septiembre de 2026 — cierre de la campaña de prevención del suicidio

Está a **cuatro días**. La campaña arrancó el 10 de agosto y cierra ese día (P-05).

**No va a haber portal el 10 de septiembre.** Es imposible y hay que decírselo a Edwin hoy, no el 9.
Cuatro días no alcanzan ni para registrar el dominio, propagar el DNS y publicar una página con el
bloque de crisis verificado — y el bloque de crisis es bloqueante para lanzar (RF-11). Publicar
deprisa una página que habla de suicidio, sin revisión de mensajes seguros y con un número de
teléfono sin verificar, sería el peor error posible de este proyecto. Ver [`../CLAUDE.md`](../CLAUDE.md) §5.1.

**Lo que sí se puede hacer esta semana, y vale la pena:**

| Qué | Quién | Por qué sirve |
|---|---|---|
| Pieza de cierre para Instagram con el balance de la campaña. | Octavio (C-01, R-05) | Es el frente de marketing, no el de software. Sale el 10 sin depender de nada nuestro. |
| **Recoger y archivar la evidencia de la campaña completa** (10 de agosto a 10 de septiembre): fotos, cuántas personas se atendieron, en qué puntos, qué se repartió. Carpetas por fecha. | Octavio, con Edwin | Es el insumo exacto de la futura página de `prevencion-suicidio` (P-08) y lo que pide un patrocinador (O-07). En seis semanas nadie va a recordar cuánta gente hizo fila. |
| **Verificar por teléfono la 169 del MINSA y los números del INSAM.** Llamar, anotar qué contesta y quién contesta, con fecha. | Juan | Desbloquea RF-11 y no requiere una sola línea de código. Hoy están en conflicto entre fuentes y por eso **no se publican**. Ver [`../CLAUDE.md`](../CLAUDE.md) §5.1. |
| Confirmar la línea 147 del MIDES y el WhatsApp 6694-2747 de la misma llamada. | Juan | Es lo único verificado que hoy se puede publicar. Conviene revalidarlo antes de ponerlo en producción. |

La campaña de 2027 sí va a salir en el portal, con página propia: RF-14 exige que cada edición de un
evento recurrente tenga su propia URL.

## 2.2 Diciembre de 2026 — la fiesta navideña

**Esta es la fecha que de verdad manda sobre el alcance de v1.**

La fiesta navideña va por su tercer año (P-02) y funciona con dos convocatorias: comunidades que se
postulan y padrinos que apadrinan. Edwin dijo en agosto que la convocatoria de padrinos **estaba por
abrirse**. Es decir: **ya debería estar abierta**, y el portal no va a existir a tiempo para abrirla.

De ahí salen dos decisiones del plan:

1. **La convocatoria navideña se abre esta semana, sin portal.** Instagram, WhatsApp y un formulario
   provisional. El portal la hereda cuando esté listo, no la estrena. Es la **ola 0** de la §4.
2. **La ola 1 del portal se define por lo que la campaña navideña necesita**, no por el orden de
   prioridad del SRS. Un padrino que llegue en noviembre tiene que encontrar dónde inscribirse y
   dónde donar. Todo lo demás puede esperar a la ola 2.

**Contar hacia atrás desde diciembre** deja unas doce semanas de trabajo. No son doce semanas de
equipo a tiempo completo: son doce semanas de cuatro estudiantes de servicio social con clases
(PL-02). El plan de la §3 está dimensionado con esa realidad, no con la que nos gustaría.

## 2.3 Lo que estas dos fechas no cambian

Ninguna fecha justifica saltarse esto:

- El bloque de crisis con datos verificados (RF-11, bloqueante para lanzar).
- RLS en toda tabla con datos de personas (RF-04, AC-06).
- Accesibilidad AA y Core Web Vitals (AC-07, AC-08).
- Cuentas a nombre de la fundación (AC-10).

Si la fecha aprieta, **se recorta alcance, no calidad**. Es la única forma honesta de apretar.

---

# 3. Fases

## 3.1 Resumen

| Fase | Semanas | Objetivo | Responsable | Depende de |
|---|---|---|---|---|
| **F0 — Documentación** | Hecha | Requisitos, presupuesto y modelo de datos escritos. | Jeremy | — |
| **F1 — Presentación y arranque de trámites** | 1–2 | Edwin ve el presupuesto, responde el inventario y arrancan los trámites externos. | Octavio | F0 |
| **F2 — Prototipado** | 2–3 | Un prototipo navegable que Edwin pueda juzgar. | Jeremy | F1 (parcial: no espera a los trámites) |
| **F3 — Validación de Edwin** | 4 | GO o NO-GO sobre el prototipo y el orden del Inicio. | Jeremy + Octavio | F2 |
| **F4 — Cimientos técnicos** | 4–5 | Repositorio, esquema, autenticación y despliegue en pruebas. | Rafael | F1 (dominio). **No espera a F3.** |
| **F5 — Desarrollo ola 1** | 5–8 | El portal mínimo que la campaña navideña necesita. | Rafael (panel) + Juan (público) | F3, F4 |
| **F6 — Lanzamiento ola 1 + prueba piloto** | 9 | Sitio vivo. Edwin publica y oculta una noticia solo (C-08). | Rafael | F5 |
| **F7 — Desarrollo ola 2** | 9–11 | El resto del alcance de v1, con RF-02 a la cabeza. | Rafael + Juan | F6 |
| **F8 — Capacitación** | 12 | Dos personas capaces de operar el sitio sin nosotros (C-10). | Jeremy + Octavio | F7 |
| **F9 — Traspaso y cierre** | 13 | Cuentas, manual, calendario de renovaciones. | Todos | F8 |

**La dependencia que importa:** F4 arranca en paralelo a F3. El esquema de base de datos, la
autenticación y el despliegue no dependen de si a Edwin le gusta el color del hero. Esperar el GO
para tocar la infraestructura desperdiciaría una semana entera que no sobra.

**La dependencia que puede romper el plan:** F5 no puede cerrar RF-09 sin el trámite bancario (§5).
Si el banco se atrasa, la ola 1 se lanza con datos de transferencia y sin Yappy, y Yappy se agrega
después sin volver a desplegar — porque los datos de pago son editables desde el panel (RF-09, módulo 3.2.7).

## 3.2 Detalle por fase

### F1 — Presentación y arranque de trámites · semanas 1–2 · Octavio

Edwin no ha visto nada todavía. Esta fase existe para eso, y para que los trámites que no controlamos
empiecen a correr cuanto antes.

**Entregables**

- Reunión con Edwin y entrega de los cinco documentos que le tocan, en el orden de
  [`README.md`](./README.md): inventario, presupuesto, arquitectura de información, este plan y traspaso.
- Correcciones habladas de la reunión: Resend **no** es un buzón, GA4 **sí** es gratis, Supabase Pro
  **no** es ilimitado, Stripe **no** opera en Panamá ([`../CLAUDE.md`](../CLAUDE.md) §7).
- Ola 0 en marcha: convocatoria navideña abierta por los canales actuales (§4.1).
- Solicitud formal de los documentos legales de la fundación (O-08, O-09, O-10).
- Trámites iniciados según §5.

**Criterio de salida**

- Edwin aprobó el presupuesto o pidió cambios concretos.
- Está respondida la pregunta que bloquea tres decisiones a la vez: **bajo qué figura legal está
  registrada REFUVA y si la personería está al día** (O-10, supuesto A-01).
- El inventario de contenido tiene responsable y fecha comprometida por cada fila pendiente.

---

### F2 — Prototipado · semanas 2–3 · Jeremy

C-09 lo puso antes del desarrollo y así se queda. Prototipo navegable, no capturas sueltas.

**Entregables**

- Inicio, un proyecto de ejemplo, la página de donaciones y una pantalla del panel.
- Dos variantes del orden del Inicio, para que Edwin elija: misión primero, o publicaciones primero.
  Jeremy fue explícito en la reunión: «usted es el dueño de su página» (C-11).
- El hero nombrando **al menos dos frentes distintos a salud mental** (RF-06, O-04). Es el requisito
  raíz y tiene que verse en el prototipo, no explicarse.
- Textos reales donde existan; marcados como provisionales donde no. Sin *lorem ipsum* en lo que
  Edwin va a juzgar.

**Criterio de salida**

- El prototipo es navegable en un teléfono, que es donde va a entrar la mayoría del público.
- Un tercero que no conoce REFUVA identifica las siete líneas de acción en menos de diez segundos.

---

### F3 — Validación de Edwin · semana 4 · Jeremy y Octavio

**Es una puerta, no un trámite.** Sin GO no arranca F5.

**Entregables**

- Sesión de revisión con Edwin, con el prototipo en pantalla.
- Acta corta: qué aprobó, qué pidió cambiar, qué decidió sobre el orden del Inicio (C-11).

**Criterio de salida**

- GO escrito. Si es NO-GO, se itera el prototipo una semana y se repite. **Una sola iteración**; una
  segunda ronda de rediseño se come la campaña navideña y hay que decírselo.

---

### F4 — Cimientos técnicos · semanas 4–5 · Rafael

**Entregables**

- Repositorio en una organización de GitHub **de la fundación**, no de un estudiante (X-01, AC-10).
- Proyecto Next.js con TypeScript estricto, Tailwind y shadcn/ui ([`../CLAUDE.md`](../CLAUDE.md) §3).
- Migraciones iniciales de [`07-modelo-datos.md`](./07-modelo-datos.md), **con RLS habilitado desde
  la primera migración**. No se habilita después.
- Supabase Auth con segundo factor y **dos cuentas administradoras** (RF-04, C-10).
- Despliegue de pruebas funcionando, con dominio propio y DNS en Cloudflare.
- Ping diario de actividad contra Supabase (RF-15). Sin esto el proyecto se pausa a los siete días
  y el sitio se cae solo, sin que nadie lo toque.

**Criterio de salida**

- `npm run build` limpio, sin errores ni advertencias de tipos.
- Consulta al catálogo de Postgres: **ninguna** tabla con datos de personas sin RLS (AC-06).
- Cada política probada con un usuario que **no** debería ver el dato. Una política que nadie intentó
  romper no está probada.

---

### F5 — Desarrollo ola 1 · semanas 5–8 · Rafael (panel) y Juan (público)

El alcance exacto está en §4.2. C-05 lo dijo: doble desarrollo, sitio público y panel en paralelo.

**Entregables**

- Sitio público de la ola 1, con las siete líneas de acción y el bloque de crisis.
- Panel con contenido, bandeja mínima y ajustes.
- Formularios de padrino, voluntario y postulación de comunidad, escribiendo en Postgres antes de
  disparar cualquier correo ([`../CLAUDE.md`](../CLAUDE.md) §4).
- Automatizaciones de n8n para los correos de confirmación y aviso.

**Criterio de salida**

- Cumple la definición de terminado de §8 para cada tipo de trabajo.
- **Prueba de fallo inducido:** con la automatización apagada, una inscripción de padrino **se guarda
  igual** y queda marcada como pendiente de notificar (AC-03).

---

### F6 — Lanzamiento ola 1 y prueba piloto · semana 9 · Rafael

**Entregables**

- Sitio en producción, en el dominio definitivo.
- **Prueba piloto C-08:** Edwin agrega una noticia y oculta un evento, **sin ayuda del equipo**, con
  alguien mirando en silencio y tomando nota de dónde se traba (§6, hito **H5**).
- Analítica sin cookies activa y verificada.

**Criterio de salida**

- AC-04 cumplido: Edwin publicó y ocultó contenido por su cuenta.
- **Rendimiento verificado en dos niveles (AC-08).** Lighthouse por sí solo **no es evidencia de
  cumplimiento**, porque mide un laboratorio y el público de este sitio entra con teléfonos viejos:
  - **Antes de entregar:** Lighthouse en móvil **con limitación de red**, sobre el sitio en producción.
    LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Esta es la comprobación que cierra la fase.
  - **A los 28 días del lanzamiento:** informe de **Core Web Vitals de Search Console**, con **datos de
    campo en el percentil 75**, dentro de los mismos umbrales. Este es el que confirma el cumplimiento
    y queda como compromiso posterior a la entrega (§9).
- Auditoría de accesibilidad sin errores de nivel AA (AC-07).

---

### F7 — Desarrollo ola 2 · semanas 9–11 · Rafael y Juan

**Entregable principal: RF-02, la solicitud de cita psicológica.** Es el que saca las consultas de
WhatsApp (S-04, R-03, C-03) y el que más cuidado exige, porque lo llena alguien pidiendo ayuda.

**Criterio de salida**

- AC-02: una solicitud se guarda, confirma al solicitante y avisa a la administración en menos de un minuto.
- Revisión de contenido sensible aprobada por dos personas del equipo, contra
  [`../CLAUDE.md`](../CLAUDE.md) §5.1. Ninguna página que hable de suicidio se publica con una sola revisión.

---

### F8 — Capacitación · semana 12 · Jeremy y Octavio

Detalle completo en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).

**Entregables**

- Sesión con **Edwin y una segunda persona** (C-10, R-04). Grabada, en español, sobre el sitio real.
- Manual con capturas: publicar una noticia, ocultar un evento, leer la bandeja, exportar padrinos,
  cambiar los datos de donación, recuperar el segundo factor.
- Cada asistente hace los ejercicios él mismo. No se demuestra: se practica.

**Criterio de salida**

- AC-11: existe el manual y está grabada la sesión.
- Las dos personas completaron los ejercicios sin que nadie tocara su teclado.

---

### F9 — Traspaso y cierre · semana 13 · todos

**Entregables**

- Traspaso de todas las cuentas a correos de la fundación (AC-10).
- Calendario de renovaciones: dominio y lo que corresponda, con quién paga y cuándo.
- Acta de recepción firmada por Edwin.

**Criterio de salida**

- No queda ninguna credencial en manos de un estudiante.
- No queda ningún proceso que solo el equipo sepa correr (X-01).
- Los compromisos recurrentes de la §9 están en el calendario de
  [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md), cada uno con responsable con nombre.

---

# 4. Alcance en olas

## 4.1 Ola 0 — sin código, semana 1

**Nada de esto necesita el portal.** Existe porque la campaña navideña no puede esperar doce semanas.

| Qué | Quién | Origen |
|---|---|---|
| Abrir la convocatoria de padrinos y madrinas por Instagram y WhatsApp, con un formulario provisional enlazado desde la biografía. | Octavio, con Edwin | P-02 |
| Abrir la convocatoria de comunidades con **los requisitos de vulnerabilidad listados antes del formulario**, tal como exigirá RF-07. Escribirlos ahora ahorra escribirlos dos veces. | Octavio | P-02, RF-07 |
| Publicar el alias de Yappy y los datos de transferencia en Instagram, en cuanto existan. | Edwin | S-06, RF-09 |
| Archivar la evidencia de la campaña de prevención (§2.1). | Octavio | O-07, P-08 |

**Sin monto sugerido para el regalo.** REFUVA no fija monto (P-02) y eso vale también fuera del portal.

**Cuando llegue la ola 1, las inscripciones del formulario provisional se importan a la base de
datos.** Es una migración pequeña y prevista, no un accidente.

## 4.2 Ola 1 — el portal mínimo vivo · objetivo semana 9

**Criterio de la ola:** entra lo que la campaña navideña necesita, más lo que es bloqueante para
lanzar cualquier cosa. Nada más.

| RF | Qué | Por qué entra |
|---|---|---|
| **RF-06** | Las siete líneas de acción, cada una con página propia. | Es **el requisito raíz** (O-04). Sin esto el sitio no tiene motivo de existir. |
| **RF-11** | Bloque de recursos de crisis. | **Bloqueante para lanzar.** El sitio habla de suicidio desde la primera página de proyecto. |
| **RF-04** | Autenticación del panel, con segundo factor y dos administradores. | Prerrequisito de todo lo demás del panel. |
| **RF-01** | Crear, editar, publicar, ocultar y archivar noticias y eventos. | R-02, C-06 y C-08. Es el cuarto de los cinco trabajos del sitio: que Edwin publique sin nosotros. |
| **RF-13** *(mínima)* | `/panel/convocatorias`: crear la convocatoria con sus fechas y cerrarla con `cerrada_manualmente`. | Las postulaciones de comunidad y las inscripciones de padrinos cuelgan por clave foránea de `convocatorias` ([`07-modelo-datos.md`](./07-modelo-datos.md)): sin esa fila no hay dónde guardarlas. |
| **RF-07** | Postulación de comunidad a la convocatoria navideña. | Fecha dura. Es el motivo de la ola. |
| **RF-03** | Inscripción de padrinos y voluntarios, clasificada por programa, con exportación a CSV. | Fecha dura. El emparejamiento padrino↔niño ocurre fuera de línea (X-06) y para eso Edwin necesita la lista exportada. |
| **RF-09** | Información de donaciones: Yappy y transferencia, editables desde el panel. | El tráfico navideño es cuando más gente quiere donar. Si el banco no llegó, se lanza solo con transferencia. |
| **RF-12** *(mínima)* | Bandeja: listar, filtrar por tipo y cambiar el estado de una solicitud. | Sin bandeja, las inscripciones de padrinos se acumulan sin que nadie las gestione. |
| **RF-15** | Ping diario, reintento de correos fallidos y respaldo semanal. | Sin el ping, Supabase pausa el proyecto a los siete días. No es opcional. |
| **RF-14** *(parcial)* | URLs legibles en español, `sitemap.xml`, `robots.txt`, metadatos y tarjeta social por página. | Barato si se hace desde el primer día; carísimo de retrofit. Y una convocatoria compartida por WhatsApp tiene que verse bien. |

## 4.3 Ola 2 — el resto de v1 · objetivo semana 11

| RF | Qué |
|---|---|
| **RF-02** | Solicitud de cita psicológica, con confirmación por correo y aviso a la administración. |
| **RF-13** *(completa)* | Gestión de convocatorias con fechas y **aviso automático de cierre**. La versión mínima —crear la convocatoria con sus fechas y cerrarla con `cerrada_manualmente`— ya entró en la ola 1 (§4.2); aquí se completa la pantalla. No existe ningún interruptor en Ajustes: una convocatoria es una fila de `convocatorias`, no una clave de configuración. |
| **RF-12** *(completa)* | Notas internas, búsqueda, y **las solicitudes de cita ordenadas por antigüedad con la más vieja destacada**. Esta regla solo tiene sentido cuando existe RF-02. |
| **RF-05** | Feed de Instagram, leído desde el servidor, con la posibilidad de ocultar una publicación concreta. |
| **RF-08** | Solicitud de alianza institucional desde la página del proyecto psicoeducativo. |
| **RF-10** | Contacto general. |
| **RF-14** *(completa)* | Datos estructurados `NGO`, `Event` y `Article`. |

## 4.4 Después de v1

Ya está registrado en [`01-srs.md`](./01-srs.md) §8 (V2-01 a V2-07). No se repite aquí.

## 4.5 La decisión que hay que defender: RF-02 en la ola 2

RF-02 es de prioridad **Alta** en el SRS y aquí queda en la segunda ola. Es una desviación
deliberada y estas son las tres razones:

1. **La campaña navideña tiene fecha dura y la solicitud de cita no.** Un padrino que llegue en
   diciembre y no encuentre dónde inscribirse es una oportunidad perdida para siempre. Alguien que
   quiere una cita en octubre sigue teniendo el WhatsApp, que es exactamente lo que tiene hoy (S-04).
   El servicio no se degrada; solo no mejora todavía.
2. **RF-02 es lo más delicado del proyecto y es lo último que conviene apurar.** Lo llena alguien
   que puede estar en crisis. Exige el bloque de crisis antes del primer campo, minimización de
   datos (X-05), correo transaccional funcionando, reintento de correos fallidos y revisión de
   mensajes seguros. Hacerlo con prisa por llegar a una fecha de Navidad sería exactamente el error
   que [`../CLAUDE.md`](../CLAUDE.md) §5.1 existe para prevenir.
3. **RF-11 sí entra en la ola 1.** El bloque de crisis está vivo desde el primer día, aunque el
   formulario todavía no exista. Quien llegue al sitio buscando ayuda encuentra el 911 y la línea
   147 en la ola 1. Eso es lo que no se puede posponer, y no se pospone.

Sigue habiendo espacio para cumplir el criterio AC-02 del SRS antes de la entrega final: RF-02 se
termina en la semana 11 y la capacitación es en la 12.

**Si Edwin no está de acuerdo, la decisión es suya**, y entonces se invierte: RF-02 sube a la ola 1
y bajan RF-03 y RF-07 a la ola 2. Lo que no se puede es tener las dos cosas en la ola 1 con cuatro
estudiantes a tiempo parcial.

---

# 5. Trámites externos y camino crítico

**Todos empiezan antes que el código.** Ninguno depende de nosotros, y por eso son el mayor riesgo
de calendario del proyecto. Los costos están en [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md);
aquí solo van tiempos y responsables.

| # | Trámite | Quién lo hace | Requiere antes | Duración estimada | Qué bloquea |
|---|---|---|---|---|---|
| T-01 | **Confirmar figura legal y personería jurídica al día** (resolución del Ministerio de Gobierno, estatutos inscritos en el Registro Público, cédula del representante legal). | Edwin Quintero | — | 🔴 Desconocida. Si los documentos existen, es buscarlos. Si no, es un trámite legal largo. | T-02, T-05. Y con ellos, medio presupuesto. |
| T-02 | **Cuenta comercial en Banco General a nombre de la fundación** + Banca en Línea Comercial activa. | Edwin Quintero | T-01 | 🔴 La fija el banco, no nosotros. | Yappy Comercial → RF-09 completo. |
| T-03 | **Alta en Yappy Comercial**, reserva del alias y generación del QR (Administración → Yappy). | Edwin Quintero | T-02 | Días, una vez existe T-02. | RF-09 completo. |
| T-04 | **Registro del dominio `refuva.org`** y DNS en Cloudflare. | Rafael Gómez, con la tarjeta y a nombre de la fundación | Decidir quién paga (§5.2) | Minutos. Propagación de DNS, horas. | F4, correo, despliegue, todo. |
| T-05 | **Google for Nonprofits vía Goodstack** (Workspace gratuito: buzón institucional y almacenamiento que reemplaza el OneDrive de pago). | Octavio Frauca, con los documentos de T-01 | T-01, T-04 | «Unos pocos días hábiles» según Google; la investigación estima 1–2 semanas. | Buzón definitivo (R-07) y el ahorro de OneDrive (R-06). |
| T-06 | **Cloudflare Email Routing** provisional: `info@refuva.org` reenviando al Gmail actual. | Rafael Gómez | T-04 | Minutos. | Nada. Es el puente mientras Goodstack valida: el día de la aprobación solo se cambian los MX. |
| T-07 | **Convertir el Instagram de REFUVA a cuenta profesional** (Business o Creator). Gratuito y reversible desde la app. | Edwin Quintero, acompañado por Octavio Frauca | — | Minutos. | RF-05. Las cuentas personales ya no son leíbles por ninguna vía. |
| T-08 | **Alta en Behold.so** y conexión de la cuenta. | Rafael Gómez | T-07 | Minutos. | RF-05. |
| T-09 | **Verificación telefónica de las líneas de crisis** (§2.1). | Juan Zhu | — | Una tarde. | RF-11 con datos completos. |
| T-10 | **Alojamiento definitivo de n8n**: levantar o contratar la instancia **a nombre de la fundación**, con su costo como línea del presupuesto ([`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md)). Hoy n8n no vive en ningún sitio que sobreviva al equipo: es el punto más frágil del traspaso ([`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) §2.4). | Rafael Gómez | T-01 (la cuenta va a nombre de la fundación) | Horas de instalación. Lo que no está resuelto es **dónde vive tras la entrega**: PL-08. | Los correos de confirmación y las tareas programadas de RF-15. Si en la semana 8 no hay un alojamiento que sobreviva al equipo, esas funciones se reimplementan como Route Handlers de Next.js + Resend ([`../CLAUDE.md`](../CLAUDE.md) §4). |

## 5.1 El camino crítico

```
T-01 personería  ──►  T-02 cuenta comercial BG  ──►  T-03 Yappy  ──►  RF-09 completo
      │
      └──►  T-05 Google for Nonprofits  ──►  buzón institucional
```

**T-01 es la raíz de todo.** Bloquea el banco, bloquea Google y bloquea cualquier variante de dominio
panameño. Es la primera pregunta de la reunión de F1 y no puede quedarse sin respuesta.

**T-02 es el eslabón cuya duración no controlamos.** Ningún trámite bancario tiene plazo garantizado.
Por eso RF-09 se diseña para lanzar sin Yappy: los datos de pago son editables desde el panel
(módulo 3.2.7), así que el día que Yappy exista, Edwin agrega el alias él mismo y no hace falta
volver a desplegar.

**T-04 no depende de nadie y es lo más barato que desbloquea más cosas.** Debería estar hecho en la
semana 1, aunque el resto siga trabado.

## 5.2 Pendientes de esta sección

| # | Pendiente | Quién lo debe | Estado |
|---|---|---|---|
| PL-04 | **Quién paga el dominio y con qué tarjeta.** Tiene que quedar a nombre de la fundación (AC-10), no al de un estudiante. | Edwin Quintero, con Rafael Gómez (T-04) | 🔴 |
| PL-05 | Si REFUVA está autorizada por la DGI para emitir donaciones deducibles. Decide si la página de donaciones pide datos fiscales. | Edwin | 🔴 |
| PL-06 | Quién tiene acceso administrador al Instagram de la fundación hoy. | Edwin | 🔴 |
| PL-07 | Si existe una segunda persona identificada para la capacitación (C-10). Edwin aceptó llevar acompañante pero no dio nombre (O-03). | Edwin | 🔴 |
| PL-08 | **Dónde vive n8n después de la entrega**: en qué servidor corre, a nombre de quién está la cuenta y quién la paga (T-10). Mientras siga abierto, se entrega con una pieza cuya vida útil es la del equipo, que es exactamente lo que X-01 prohíbe. | Rafael Gómez | 🔴 |

---

# 6. Hitos de validación con Edwin

Esto es lo que Edwin quiere saber al abrir este documento: **cuándo ve algo y cuándo se capacita.**

| Hito | Cuándo | Qué pasa | Quién lo convoca | Estado esperado al terminar |
|---|---|---|---|---|
| **H1 — Presupuesto e inventario** | Semana 1 | Edwin recibe los cinco documentos y ve el presupuesto mensual que pidió dos veces (R-09). Se le hacen las correcciones de [`../CLAUDE.md`](../CLAUDE.md) §7 y se le entrega la lista de lo que tiene que mandar. | Octavio (C-12) | Presupuesto aprobado. T-01 respondido. |
| **H2 — Primer vistazo al prototipo** | Semana 3 | Edwin ve el prototipo navegable y **decide el orden del Inicio** (C-11). Sin acta formal; es para reaccionar en caliente. | Jeremy | Comentarios recogidos. |
| **H3 — Validación formal del prototipo** | Semana 4 | **GO o NO-GO.** Es la puerta de C-09: sin GO no arranca el desarrollo del sitio público. | Jeremy y Octavio | GO por escrito. |
| **H4 — Primera entrada al panel** | Semana 7 | Edwin entra al panel en el entorno de pruebas, acompañado, y da una vuelta. Es un ensayo, no un examen: sirve para encontrar lo que no se entiende **mientras todavía se puede cambiar**. | Rafael | Lista de fricciones, priorizada. |
| **H5 — Prueba piloto (C-08)** | Semana 9 | **Edwin agrega una noticia y oculta un evento, en producción, sin ayuda.** Nadie le toca el teclado. Alguien mira y anota dónde se traba. | Rafael | AC-04 cumplido. Si no lo logra solo, no se cierra la ola 1: se arregla el panel. |
| **H6 — Capacitación (C-10)** | Semana 12 | Sesión con **Edwin y una segunda persona**, en español, sobre el sitio real, grabada. Cada uno practica los ejercicios él mismo. | Jeremy y Octavio | AC-11 y AC-09 cumplidos. |
| **H7 — Traspaso y acta** | Semana 13 | Entrega de cuentas, manual y calendario de renovaciones. Firma de recepción. | Todos | AC-10 cumplido. |

**Sobre H5.** Edwin lo pidió explícitamente (R-04) y Rafael lo comprometió (C-08). Es el criterio de
aceptación más importante del proyecto, porque el quinto trabajo del sitio es que Edwin publique sin
nosotros. Si en H5 hace falta ayudarlo, **el panel está mal**, no Edwin.

**Sobre H6.** C-10 dice más de una persona y O-03 dice que hoy no hay a quién delegar. PL-07 sigue
abierto. Si en la semana 12 no hay segunda persona, el traspaso queda en un solo punto de fallo: es
el supuesto A-04 del SRS y es un riesgo asumido, no un olvido.

---

# 7. Riesgos

| # | Riesgo | Prob. | Impacto | Responsable | Señal de alerta temprana | Mitigación |
|---|---|---|---|---|---|---|
| **R-01** | **Edwin no entrega el contenido a tiempo.** Es una sola persona operando toda la fundación (O-02, O-03) y el inventario le pide mucho: textos de los siete proyectos, logos, fotos, misión y visión (P-08, O-08). | **Alta** | **Alto.** El sitio se lanza con vacíos o con relleno — justo lo que el inventario existe para evitar (supuesto A-03). | Octavio Frauca | En la semana 3 no ha llegado ni el primer bloque de material. | El inventario se entrega por bloques pequeños con fecha, no como una lista de veinte cosas. Octavio hace seguimiento semanal en un solo canal (C-12). Cada página lleva un texto mínimo aceptable escrito por nosotros y marcado como provisional, para que la ausencia de material no bloquee el desarrollo. **Ninguna foto de niños ni de personas en situación de calle se publica sin consentimiento firmado**, y eso no se negocia por prisa. |
| **R-02** | **El trámite bancario se atrasa** o resulta que REFUVA no tiene cuenta comercial en Banco General (T-02, supuesto A-02). | **Alta** | **Medio.** Se cae Yappy Comercial y las donaciones quedan solo en transferencia. | Octavio Frauca, con Edwin Quintero | Semana 3 sin respuesta del banco, o Edwin no sabe si la cuenta está a nombre de la fundación. | RF-09 se diseña desde el inicio para funcionar solo con ACH. Los datos de pago son editables desde el panel (3.2.7), así que agregar Yappy después no requiere despliegue ni al equipo. Preguntarlo en H1, no en octubre. |
| **R-03** | **El equipo estudiantil tiene parciales y finales.** Son cuatro estudiantes de servicio social, no un equipo a tiempo completo (X-01). | **Alta** | **Alto.** Dos semanas de examen borran el colchón entero del plan. | Jeremy Martínez | PL-03 sigue sin respuesta pasada la semana 1. | Levantar el calendario académico en la semana 1 y colocar H3, H5 y H6 fuera de esas semanas. Ninguna fase depende de una sola persona: el par panel/público (C-05) se cubre entre Rafael y Juan. Si una semana se pierde, se recorta la **ola 2**, nunca la calidad de la ola 1 (§2.3). |
| **R-04** | **Se descubre que no hay personería jurídica al día** o que la figura legal no es la que se supone (O-09, O-10, T-01). | **Media** | **Alto.** Se caen Google for Nonprofits, Yappy Comercial y cualquier dominio `.pa`. El presupuesto de [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md) se apoya en programas para organizaciones sin fines de lucro. | Octavio Frauca | Edwin no encuentra los documentos, o los tiene pero vencidos o sin inscribir. | Preguntarlo en H1 y pedir copia de los documentos, no una afirmación verbal. Si no están al día: el portal se construye igual, el correo queda en Cloudflare Email Routing sobre el Gmail actual (T-06), las donaciones quedan en transferencia, y se le explica a Edwin qué desbloquea regularizarlo. La regularización es asunto del asesor legal de la fundación, no nuestro. |
| **R-05** | **El alcance crece.** C-07 pide un sitio extensible y Edwin ya mencionó ideas nuevas — «registro de muchachos», por ejemplo. Cada idea suena barata en una reunión. | **Alta** | **Alto.** Es la forma más común de que un proyecto estudiantil no llegue a entregarse. | Jeremy Martínez | Aparece un requisito nuevo que no está en el SRS y alguien dice «eso es rapidito». | Todo lo nuevo entra al backlog de v2 de [`01-srs.md`](./01-srs.md) §8, no a la ola en curso. La respuesta por defecto es «sí, en v2», no «no». Jeremy es el único que puede mover algo entre olas, y solo con una fase que ceda a cambio. La ola 2 es el amortiguador; la ola 1 no se toca. |
| **R-06** | **Los números de crisis siguen sin verificar** en el momento de lanzar (RF-11, T-09). | Media | **Crítico.** Un número equivocado en una página de prevención del suicidio hace daño real. | Juan Zhu | La semana 4 llega y nadie ha llamado. | RF-11 es **bloqueante para lanzar**. Se publican solo el 911 y la línea 147 del MIDES, que sí están verificados; la 169 del MINSA y el INSAM se quedan fuera hasta que alguien llame y anote la fecha. T-09 se hace esta semana porque no depende de nada. |
| **R-07** | **El tope de 100 correos al día de Resend** se rompe en el pico de la campaña navideña (supuesto A-05). | Media | Medio. Confirmaciones de padrino que no salen. | Rafael Gómez | Más de 60 inscripciones en un día. | Los correos transaccionales caben de sobra en el tope. **La difusión masiva no sale del sitio**: se exporta a CSV (RF-03) y se envía desde el buzón institucional. Los correos fallidos se reintentan cada hora (RF-15) y ninguna solicitud se queda sin avisar en silencio. |
| **R-08** | **La fundación entera depende de una persona** (O-02, O-03). Si Edwin se ausenta, no hay quién decida ni quién opere el panel. | Media | Alto. | Jeremy Martínez | PL-07 sigue abierto en la semana 8. | Insistir en la segunda persona desde H1, no desde H6. Dos administradores activos con segundo factor desde el día del lanzamiento (RF-04, AC-09). El manual y la grabación de H6 sirven para alguien que no estuvo en la sesión. |
| **R-09** | **El proyecto queda huérfano tras la entrega**: algo caduca, se pausa o deja de funcionar y no hay quién lo arregle (X-01). | Media | Alto. | Rafael Gómez | Aparece cualquier propuesta que dependa de un token que alguien deba renovar a mano. | Es la regla de [`../CLAUDE.md`](../CLAUDE.md) §5.3 y se revisa en cada entregable: cero secretos que caduquen sin renovación automática, cero trabajos programados en GitHub Actions, cuentas a nombre de la fundación. El calendario de renovaciones queda en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) con responsable con nombre. |
| **R-10** | **No hay protocolo clínico escrito para riesgo inminente** en el momento de lanzar. El formulario no pide relato clínico (X-05), pero una solicitud de cita puede llegar igual con una señal de riesgo en la línea del motivo, o entrar alguien en crisis por el contacto general. Hoy nadie ha escrito qué hace la persona que abre la bandeja y la lee. | Media | **Alto. Bloqueante para publicar RF-02.** | **Edwin Quintero** (es clínico, no técnico; solo él puede escribirlo). Seguimiento semanal: Jeremy Martínez. | Llega la semana 9 y no existe el documento de una página que diga qué se hace, a quién se llama y en cuánto tiempo. | Se pide en H1, no en la semana 11. El protocolo lo escribe Edwin y queda en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) con responsable con nombre, apoyado en el bloque de crisis verificado (RF-11) como primera respuesta. **Sin protocolo escrito no se publica el formulario de cita:** se lanza el resto del sitio y RF-02 espera. Un formulario que recoge una señal de riesgo que nadie sabe atender es peor que no tenerlo. |
| **R-11** | **La instancia de n8n queda a nombre de un estudiante después de la entrega** (T-10, PL-08, X-01). Es la única pieza del stack que hoy no tiene dueño, y de ella cuelgan los correos de confirmación y las tareas programadas de RF-15. | **Alta** mientras PL-08 siga abierto | **Alto.** Se apaga sola cuando el equipo se retire, y nadie se entera hasta que una solicitud se queda sin avisar. | **Rafael Gómez** | Semana 8: n8n sigue corriendo en infraestructura del equipo, sin línea en el presupuesto y sin cuenta de la fundación. | T-10 resuelve el alojamiento y lo mete en el presupuesto con su costo. Si en la semana 8 no hay un lugar que sobreviva al equipo, las funciones de n8n se reimplementan como Route Handlers de Next.js + Resend, que es la salida ya prevista en [`../CLAUDE.md`](../CLAUDE.md) §4. **No se entrega con una pieza cuya vida útil sea la del equipo.** |

---

# 8. Definición de terminado

«Terminado» no es «se ve bien en mi computadora». Por tipo de trabajo:

## 8.1 Una página pública

- [ ] El contenido es real y aprobado, o está marcado explícitamente como provisional.
- [ ] Funciona completa con teclado, con foco visible en cada elemento interactivo.
- [ ] Contraste 4,5:1 en texto normal; área táctil mínima de 24×24 px.
- [ ] `axe` sin errores de nivel AA.
- [ ] Toda imagen pasa por `next/image` con `width` y `height`, y tiene texto alternativo escrito por
      una persona. «imagen1.jpg» no es texto alternativo.
- [ ] LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en móvil, medidos con Lighthouse **con limitación de red**.
      La confirmación con datos de campo llega después, en el informe de Search Console (§3.2, F6).
- [ ] Título, descripción y tarjeta social propios. Compartida por WhatsApp, se ve bien.
- [ ] URL legible en español (`/proyectos/historias-que-sanan`, no `/p?id=7`).
- [ ] Se ve correctamente en un teléfono de 360 px de ancho.
- [ ] **Si toca salud mental o suicidio:** revisada por dos personas contra
      [`../CLAUDE.md`](../CLAUDE.md) §5.1, y cierra con recursos de ayuda y un mensaje de esperanza.
- [ ] Lo que Edwin va a querer cambiar, se puede cambiar desde el panel. Si hay que tocar código para
      corregir un número de teléfono, la página no está terminada.

## 8.2 Una pantalla del panel

- [ ] Está en español, con el vocabulario de Edwin. Se dice «panel», nunca «CMS»; el término de
      interfaz es «Dejar de mostrar», nunca «Despublicar».
- [ ] Una persona que entra cada dos semanas y no recuerda nada la entiende sin manual (X-03).
- [ ] Toda acción destructiva pide confirmación y dice **qué** se va a borrar, con su nombre.
- [ ] **Ocultar y borrar son dos operaciones distintas y ambas existen** (C-06).
- [ ] Los errores dicen qué pasó y qué hacer, en español y junto al campo. Nunca un código.
- [ ] Ningún fallo silencioso: un `catch` que solo hace `console.error` y sigue es un bug.
- [ ] Requiere sesión iniciada. Probado entrando por URL directa sin sesión.
- [ ] Las tablas que toca tienen RLS, probada con un usuario que **no** debería ver el dato.
- [ ] Quedó registrado en el manual de [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md),
      con captura.
- [ ] **Alguien que no la programó la usó sin instrucciones y logró lo que quería.**

## 8.3 Una migración de base de datos

- [ ] Vive en `supabase/migrations/`, numerada, hacia adelante. **Nunca se edita después de aplicarse.**
- [ ] Toda tabla nueva **nace con RLS habilitado**. No se habilita en una migración posterior.
- [ ] Cada política probada con un usuario que no debería ver el dato. Sin esa prueba, la política no existe.
- [ ] Corre limpia sobre una base vacía con `npx supabase db reset`.
- [ ] Si la tabla guarda datos de personas, tiene su política de retención escrita en
      [`07-modelo-datos.md`](./07-modelo-datos.md) y un borrado real cuando vence.
- [ ] **Ningún campo con datos identificables de menores** (X-06).
- [ ] Ninguna columna guarda diagnóstico, síntomas, medicación ni relato clínico (X-05).
- [ ] Los datos de prueba de las semillas son ficticios. Nunca datos de una persona real.

## 8.4 Un documento

- [ ] Cada afirmación se puede rastrear a un código de origen (O-04, P-02, S-01, R-09, C-06, X-01,
      RF-07, HU-13…) o a un insumo de Edwin.
- [ ] Lo que no se sabe está escrito como 🔴 **Pendiente**, con quién lo debe. Nunca inventado.
- [ ] **Un dato, un lugar**: los precios están en `05`, el esquema en `07`, las fechas en `08`. Los
      demás documentos enlazan, no copian la cifra.
- [ ] Enlaces relativos que funcionan.
- [ ] Español de Panamá, con tildes. Moneda escrita a mano como `B/.15.00`.
- [ ] No dice «RECUBA», «Reflua» ni «Taster» (O-01).
- [ ] No cita leyes nacionales de protección de datos: la privacidad se sostiene como ética
      profesional y buena práctica de ingeniería, y lo legal se deriva al asesor legal de la fundación.
- [ ] Si es uno de los cinco que Edwin lee, está escrito para él, no para nosotros.

---

# 9. Compromisos recurrentes después de la entrega

El plan no termina en la semana 13. Hay dos cosas que siguen venciendo cuando el equipo ya no está, y
ninguna se queda sin nombre: **cero procesos sin responsable con nombre**. Aquí queda el compromiso y
su periodicidad; el detalle operativo —quién, con qué cuenta y con qué guion— vive en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) y no se copia aquí.

| Compromiso | Cada cuánto | Cómo se dispara | Detalle y responsable |
|---|---|---|---|
| **Revalidar los números de crisis.** Llamar al 911 y a la línea 147 del MIDES —y a los que se hayan verificado para entonces—, anotar quién contesta y con qué fecha. Un número que dejó de existir en una página de prevención del suicidio hace el mismo daño que uno equivocado. | **Semestral: tarea programada cada 190 días** desde la última revalidación registrada. | Tarea programada de RF-15. **Solo avisa al buzón institucional**; no cambia nada por su cuenta. El bloque de crisis se edita después de la llamada, nunca antes. | [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md), con responsable con nombre. |
| **Informe de campo de Core Web Vitals** de Search Console, percentil 75, dentro de los umbrales de AC-08. Lighthouse por sí solo no es evidencia de cumplimiento (§3.2, F6). | **A los 28 días del lanzamiento**, y después en la revisión anual. | Revisión manual del informe en Search Console. Si el percentil 75 se sale de los umbrales, se abre trabajo correctivo. | [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md), con responsable con nombre. |

**Por qué está aquí y no solo en `09`.** Porque son compromisos con fecha, y las fechas de este
proyecto se deciden en este documento. Lo que `09` guarda es el nombre de quien los ejecuta.
