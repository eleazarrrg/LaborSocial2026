# ADR-0004: Agendamiento por solicitud, no por reserva

Estado: Aceptada | Fecha: 6 de septiembre de 2026 | Decide: equipo de desarrollo

## Contexto

Hoy las consultas psicológicas entran **solo por WhatsApp** (S-04). Edwin quiere unificarlas y que
además le lleguen por correo (R-03). Jeremy lo comprometió así en la reunión: «un apartado donde la
persona solo ingresa sus datos y eso le llega directo a Edwin» (C-03).

Nadie pidió un calendario.

Tres datos delimitan el problema:

1. **Hay un solo profesional atendiendo.** Edwin es la única persona que opera la fundación: los
   siete proyectos, las redes, las consultas y la administración (O-02). No hay a quién delegar
   todavía (O-03). Un calendario de disponibilidad con bloqueo de doble reserva resuelve el problema
   de coordinar varias agendas. Aquí no hay varias agendas.
2. **Las historias de usuario v1.0 hablan de «solicitud», no de «reserva».** HU-09 a HU-11 describen
   enviar datos y recibir confirmación de recibido, no elegir un espacio en una grilla.
3. **No sabemos los horarios.** La modalidad de atención —virtual, presencial o ambas—, los horarios
   disponibles y la dirección física son 🔴 **Pendiente** (S-05). No se puede construir un calendario
   de disponibilidad sin conocer la disponibilidad. Construirlo antes de tener el dato es inventarlo.

A esto se suma que un motor de reservas es de las piezas más caras de construir y de mantener de una
aplicación: zonas horarias, duración de sesión, bloqueos, cancelación, reprogramación, recordatorios,
concurrencia entre dos personas que reservan el mismo minuto. Es mucho software para un equipo de
servicio social con plazo, y todo ese software queda huérfano el día de la entrega (X-01).

## Decisión

**v1 recibe SOLICITUDES de cita, no reservas.**

- El formulario captura nombre, forma de contacto preferida, correo, teléfono, motivo en una línea,
  modalidad, disponibilidad horaria **en texto libre** y consentimiento (RF-02).
- **No hay calendario de disponibilidad. No hay bloqueo de doble reserva. No hay reprogramación
  automática.** Edwin confirma por su canal.
- La solicitud nace con estado `pendiente` en la bandeja y avanza a `en gestión` y `atendida`
  (RF-12). Las de cita se ordenan por antigüedad y la más vieja se destaca.
- El lenguaje de la interfaz dice **«solicitud»** en todas partes. Nunca «cita confirmada», nunca
  «reservado». Una persona pidiendo ayuda no puede quedarse creyendo que tiene una cita que nadie
  confirmó.
- El bloque de crisis abre el formulario, antes del primer campo, junto con el aviso de que esto no
  es un canal de emergencia (RF-11). El botón directo a WhatsApp convive con el formulario; no lo
  reemplaza.

## Alternativas consideradas

> 🟡 **Inferido.** La crítica de completitud del anexo deja constancia de que **ningún frente de la
> investigación evaluó el motor de agendamiento**. Los descartes de esta tabla son análisis del
> equipo, no dato verificado con precios y fuentes como el resto de los ADR. Si alguna de estas
> opciones vuelve a la mesa, hay que investigarla de verdad primero.

| Opción | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Cal.com autohospedado** | Código abierto, sin costo de licencia, resuelve zonas horarias, duración, buffers y cancelación. Se puede alojar en la misma infraestructura. | Es un sistema completo que hay que desplegar, actualizar y parchear, con su propia base de datos y su propio panel. Una segunda aplicación que Edwin tendría que aprender aparte del panel. Y su modelo asume disponibilidad declarada, que es justo el dato que falta. | Más superficie de mantenimiento que la que este proyecto puede dejar en pie sin equipo (X-01). |
| **Calendly gratuito** | Cero desarrollo. Funciona el primer día. Lo entiende cualquiera. | Los datos de una solicitud de atención psicológica saldrían del sistema hacia el plan gratuito de un tercero, fuera de las políticas RLS y de la retención definida (X-05, SRS §6.2). Además el visitante recibe cookies de terceros y el flujo se va del dominio. | El dato sensible no sale del sistema. Esa regla no se negocia por comodidad. |
| **Google Calendar Appointment Schedules** | Viene incluido en Google Workspace for Nonprofits, que la fundación va a solicitar de todas formas. Edwin ya vive en el calendario. Costo B/.0.00. | Ata el agendamiento a que Workspace for Nonprofits se apruebe, y esa aprobación depende de la personería jurídica, que es 🔴 Pendiente (O-10, A-01). El formulario de reserva es de Google: no se puede anteponer el bloque de crisis ni limitar los campos que se piden. | No se puede poner un requisito bloqueante para lanzar (RF-11) dentro de un formulario que no controlamos. **Es la primera opción a revisar en v2.** |
| **Motor de reservas propio sobre Supabase** | Encaja perfecto con el resto: mismas tablas, mismo RLS, mismo panel, mismo idioma. | Es la pieza más cara de construir bien y la que más se rompe: concurrencia, zona horaria `America/Panama`, cancelaciones, reprogramación, recordatorios. Semanas de trabajo que no compran nada mientras haya un solo profesional. | Construir un motor de reservas para una agenda es sobreingeniería con costo de mantenimiento perpetuo. |

## Consecuencias

**Lo que ganamos**

- Se lanza a tiempo. El esfuerzo va a lo que sí resuelve el problema real: sacar las solicitudes de
  WhatsApp y darles registro, estado y respaldo (RF-02, RF-12).
- Cero zonas horarias, cero doble reserva, cero cancelaciones que reconciliar. Es software que no
  existe y por lo tanto no se rompe.
- El dato sensible no sale del sistema. Vive en Postgres con RLS y con retención definida
  ([`../07-modelo-datos.md`](../07-modelo-datos.md)).
- El formulario se puede diseñar entero: el bloque de crisis primero, los campos mínimos, sin pedir
  diagnóstico ni relato clínico (X-05).
- No se toca el cobro de la consulta de B/.15.00 en línea, lo que mantiene el proyecto fuera del
  alcance PCI y de la zona gris del hosting gratuito (ver [`0005-donaciones-sin-pasarela-en-v1.md`](./0005-donaciones-sin-pasarela-en-v1.md)).

**Lo que aceptamos**

- **Edwin sigue confirmando a mano.** El portal le quita el trabajo de recibir y registrar, no el de
  agendar. Eso hay que decírselo con claridad antes de que valide el prototipo (C-09).
- El solicitante no ve horarios, no elige espacio y no recibe recordatorio automático de su cita. Los
  recordatorios por WhatsApp quedan registrados como V2-03.
- Puede haber solapamiento: dos personas pidiendo el mismo horario. Con un profesional y volumen bajo
  (A-05), se resuelve conversando.
- 🔴 **Pendiente:** el **tiempo estimado de respuesta** que se le promete al solicitante en pantalla
  y en el correo de confirmación. Lo debe fijar Edwin. Sin ese número, el correo de RF-02 no se puede
  redactar. Va al inventario de contenido.
- 🔴 **Pendiente:** modalidad, horarios y dirección publicable (S-05). Sin ellos, la página 3.1.4 se
  lanza incompleta.

## Cuándo reconsiderar esta decisión

- **Cuando haya más de un profesional atendiendo.** Ese es el disparador exacto, y es el mismo que
  registra V2-02 en el SRS. Con dos agendas, coordinar a mano deja de escalar y el calendario empieza
  a pagar su costo.
- **Cuando confirmar solicitudes a mano se vuelva el cuello de botella**, medido en la bandeja: si el
  aviso semanal de solicitudes sin atender (RF-15) se dispara de forma sostenida, el problema ya no
  es el registro sino el agendamiento.
- **Cuando Google Workspace for Nonprofits esté aprobado y activo.** Entonces Appointment Schedules
  pasa a ser una opción real y barata, y merece la investigación que hoy no se hizo.
