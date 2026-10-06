# SRS — Especificación de Requisitos de Software
## Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Estado** | Borrador para validación con Edwin Quintero |
| **Sustituye a** | — (la v1.0 se citaba en las historias de usuario pero nunca existió como documento) |
| **Fuente de requisitos** | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) |

> **Sobre la numeración.** El documento de historias de usuario v1.0 cita «sección 3.1 del SRS»,
> «sección 4.1», «sección 5 – Stack Tecnológico» y «sección 6». Esas referencias se conservan
> exactamente donde las historias las esperan, para que sigan siendo válidas.

---

# 1. Introducción

## 1.1 Propósito

Definir qué debe hacer el portal web y el panel administrativo de la Fundación REFUVA, con detalle
suficiente para diseñarlo, construirlo y aceptarlo sin volver a interpretar la reunión de
levantamiento.

## 1.2 Alcance

**Está dentro:**

- Un **sitio público** que presenta a la fundación, sus ocho proyectos y sus dos campañas.
- Formularios de **solicitud de cita psicológica**, **voluntariado**, **apadrinamiento**,
  **postulación de comunidad** y **contacto general**.
- Una **página de donaciones** con Yappy Comercial y transferencia bancaria.
- Un **panel administrativo** en español para que Edwin publique, edite, oculte y archive contenido,
  y consulte las solicitudes recibidas.
- Integración de **correo transaccional** y de un **feed de Instagram**.
- **Andamiaje bilingüe español/inglés** (M-13: la fundación lo pidió por escrito en octubre, «con la
  posibilidad de sumar otros idiomas»). La v1 se **publica solo en español**; el inglés queda
  preparado y vacío hasta que alguien de la fundación entregue las traducciones.
- **Capacitación y traspaso** documentados.

**Está fuera (y se dice explícitamente porque se conversó en la reunión):**

| Fuera del alcance | Por qué |
|---|---|
| Cobro en línea de la consulta de B/.15.00 | Saca al proyecto del alcance PCI y de la zona gris del hosting gratuito. Se cobra por los medios actuales. Ver §6.3. |
| Terapia, chat o videollamada dentro del portal | REFUVA atiende por sus canales. El sitio solicita citas, no las presta. |
| Expediente clínico o historia clínica digital | Dato de altísima sensibilidad, sin necesidad demostrada y sin capacidad de custodia. |
| Datos personales de menores capturados por formulario o guardados en columnas de texto | Ver §2.5 (X-06). El emparejamiento padrino↔niño ocurre fuera de línea. **Excepción única:** imágenes de menores en la galería de evidencia, solo con consentimiento firmado registrado. |
| Diseño de publicaciones y reels para redes | Edwin lo pidió (R-05) y es legítimo, pero es trabajo de marketing, no de software. Va en el frente de Octavio (C-01). |
| Publicación automática simultánea en varias redes | Se responde como asesoría en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md), no como desarrollo. |
| App móvil nativa | El sitio es responsive. No hay caso de uso que lo justifique. |
| Pasarela de tarjeta con checkout propio | Ver §6.3. En v2, y siempre con checkout alojado. |

## 1.3 Definiciones

| Término | Significado en este documento |
|---|---|
| **Visitante** | Cualquiera que entra al sitio sin autenticarse. |
| **Solicitante** | Persona que envía una solicitud de cita psicológica. |
| **Padrino / madrina** | Persona que se inscribe para regalar a un niño en la fiesta navideña. |
| **Postulante de comunidad** | Persona que propone a su comunidad para la convocatoria navideña. |
| **Administrador** | Edwin o alguien autorizado por él, con sesión iniciada en el panel. |
| **CMS / panel** | El panel administrativo. Se llama «panel» de cara a Edwin; «CMS» solo entre nosotros. |
| **Proyecto** | Cada uno de los programas permanentes de la fundación. Hoy son ocho; el catálogo vive en `src/lib/catalogo.ts`. |
| **Campaña** | Iniciativa de sensibilización con ciclo propio, en colección aparte (`/campanas`). Hoy son dos. |
| **Convocatoria** | Periodo abierto de inscripción de una campaña, con fecha de inicio y de cierre. |
| **B/.** | Balboa panameño, a la par con el dólar estadounidense. |

## 1.4 Referencias

- [`00-fuentes/transcripcion-reunion-2026-08-20.md`](./00-fuentes/transcripcion-reunion-2026-08-20.md) — la reunión.
- [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) — los hechos, destilados.
- [`02-historias-usuario.md`](./02-historias-usuario.md) — historias y criterios de aceptación.
- [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md) — RNF, en detalle.
- [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md) — decisiones técnicas y costos.
- [`07-modelo-datos.md`](./07-modelo-datos.md) — esquema y políticas de acceso.
- [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md) — evidencia.

---

# 2. Descripción general

## 2.1 El problema que resuelve

Edwin lo dijo en la primera intervención de la reunión: hay «muchas personas que tienen el
pensamiento que creen que nosotros solamente vemos el tema de salud mental». Es falso — son ocho
proyectos y dos campañas — pero la fundación no tiene dónde demostrarlo.

Hoy todo pasa por WhatsApp y por un Instagram. Eso tiene tres consecuencias medibles:

1. **Las solicitudes de ayuda se pierden.** No hay registro, no hay estado, no hay respaldo.
2. **Edwin es el cuello de botella.** Cada padrino, cada voluntario y cada consulta pasa por su chat.
3. **No hay nada que enseñarle a un patrocinador.** La evidencia vive en un OneDrive privado que
   Edwin paga de su bolsillo.

El portal ataca las tres.

## 2.2 Perfiles de usuario

| Perfil | Qué viene a hacer | Qué lo frena hoy | Prioridad |
|---|---|---|---|
| **Persona que necesita ayuda psicológica** | Pedir una cita. Puede estar en crisis. | Solo hay WhatsApp; no sabe si la leyeron; no sabe cuánto cuesta ni si hay opción gratuita. | Alta |
| **Donante individual** | Dar dinero ahora, desde el teléfono. | No encuentra los datos bancarios; no sabe si la fundación es seria. | Alta |
| **Padrino o madrina** | Apadrinar a un niño para Navidad. | Tiene que escribirle a Edwin y esperar. | Alta |
| **Voluntario** | Ofrecer su tiempo o su oficio. | No sabe qué se necesita ni cómo ofrecerse. | Media |
| **Miembro de comunidad vulnerable** | Postular a su comunidad a la convocatoria navideña. | No sabe que existe, ni cuáles son los requisitos. | Alta |
| **Escuela o institución** | Solicitar una alianza para el proyecto psicoeducativo. | No hay canal formal. | Media |
| **Patrocinador institucional** | Evaluar si financiar a REFUVA. | No hay evidencia pública ni trayectoria visible. | Media |
| **Administrador (Edwin)** | Publicar, ocultar, revisar solicitudes, exportar listas. | No existe. Depende del equipo de desarrollo. | Alta |

## 2.3 Perspectiva del producto

Dos aplicaciones sobre una misma base de datos, desplegadas juntas:

- **Sitio público** — servido desde el servidor para que Google lo indexe y cargue rápido en
  teléfonos modestos. Es la cara de la fundación.
- **Panel administrativo** — detrás de autenticación. Es la herramienta de trabajo de Edwin.

Entre ambas hay una **capa de automatización (n8n)** que se ocupa de correos, avisos y tareas
programadas. La regla que la gobierna está en [`../CLAUDE.md`](../CLAUDE.md) §4: la escritura en la
base de datos ocurre primero y de forma síncrona; la automatización reacciona después. Si la
automatización falla, el dato no se pierde.

## 2.4 Supuestos

| # | Supuesto | Si resulta falso |
|---|---|---|
| A-01 | REFUVA tiene personería jurídica inscrita y puede acreditarla. | Se cae Google for Nonprofits y se complica Yappy Comercial. Bloquea §5 y buena parte del presupuesto. |
| A-02 | REFUVA puede abrir cuenta comercial en Banco General a su nombre. | No hay Yappy Comercial. Las donaciones quedan solo en transferencia. |
| A-03 | Edwin puede dedicar tiempo a entregar contenido durante el desarrollo. | El sitio se lanza con vacíos o con texto de relleno, que es exactamente lo que el inventario busca evitar. |
| A-04 | Habrá una segunda persona para la capacitación. | El traspaso queda en un solo punto de fallo. Riesgo asumido y registrado. |
| A-05 | El volumen es bajo: decenas de solicitudes al mes, cientos en campaña navideña. | Si son miles, el tope de 100 correos/día de Resend se rompe. Mitigación en §5.4. |

## 2.5 Restricciones

Heredadas de [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) §7.

| # | Restricción |
|---|---|
| X-01 | El equipo entrega y se retira. Nada puede depender de su mantenimiento. |
| X-02 | Presupuesto objetivo: **B/.0.00 al mes** de costo recurrente, salvo el dominio. |
| X-03 | Un administrador no técnico, en español, que entra cada varias semanas. |
| X-04 | El sitio habla de suicidio. Aplica guía de mensajes seguros. |
| X-05 | Entran datos sensibles por formulario. Minimización, cifrado, acceso restringido y retención. |
| X-06 | **Ningún dato personal de menores entra al sistema en v1** por formulario ni en columnas de texto (nombre, edad, escuela, comunidad, lista nominal). Un conteo agregado no es un dato de un niño. Excepción única: imágenes de menores en la galería de evidencia, solo con consentimiento firmado registrado. |
| X-07 | Fechas duras: 10 de septiembre y la campaña navideña. |

---

# 3. Módulos del sistema

## 3.1 Módulos del portal público

*(Esta es la sección que citan las historias de usuario v1.0.)*

| # | Módulo | Contenido | Historias |
|---|---|---|---|
| **3.1.1** | **Inicio** | Hero que nombra al menos dos frentes distintos a salud mental; los cuatro CTA (Donar, Agendar cita, Ser padrino, Ser voluntario); el catálogo completo de proyectos y campañas; próximos eventos; feed de Instagram; bloque de crisis. | HU-01 a HU-03 |
| **3.1.2** | **Nosotros** | Misión, visión, valores; reseña histórica; trayectoria y evidencia; equipo (si se publica); documentos de transparencia (si se publican). | HU-04, HU-05 |
| **3.1.3** | **Proyectos y campañas** | Índice con una tarjeta por entrada + una página de detalle cada una, con su historia, población objetivo, requisitos de participación, galería de evidencia y su propia acción. Las campañas van en colección aparte, `/campanas`. Incluye la solicitud de alianza institucional. | HU-06, HU-07, HU-08, HU-22, HU-35 |
| **3.1.4** | **Agendamiento de citas** | Bloque de crisis **antes del primer campo**, aviso de que no es canal de emergencia, formulario de solicitud, alternativa por WhatsApp, información de precio y de jornadas gratuitas. | HU-24, HU-37, HU-09, HU-10, HU-11 |
| **3.1.5** | **Voluntariado y apadrinamiento** | Formulario de voluntariado con áreas de interés; formulario de padrino/madrina; formulario de postulación de comunidad; estado de la convocatoria (abierta/cerrada). | HU-12, HU-13, HU-14, HU-23 |
| **3.1.6** | **Donaciones** | Alias y QR de Yappy; datos bancarios copiables; qué logra cada monto; transparencia. | HU-15, HU-34 |
| **3.1.7** | **Noticias y eventos** | Dos tipos de contenido con listados propios: noticias (fecha, imagen y resumen) y eventos (con edición por año). Etiquetado por proyecto. | HU-17, HU-27 |
| **3.1.8** | **Contacto** | Formulario general; canales directos (WhatsApp, Instagram, correo); ubicación si aplica. | HU-20, HU-21 |
| **3.1.9** | **Legales** | Política de privacidad, términos de uso, aviso de que el portal no presta atención en línea ni es canal de emergencia. | HU-31 |
| **3.1.10** | **Ayuda en crisis** | Página propia con el bloque completo de recursos verificados, qué esperar de cada canal y qué hacer ahora mismo. Alcanzable desde la banda de crisis de cualquier página. | HU-24, HU-37 |

## 3.2 Módulos del panel administrativo

| # | Módulo | Qué permite | Historias |
|---|---|---|---|
| **3.2.1** | **Acceso** | Iniciar sesión, cerrar sesión, recuperar contraseña, segundo factor. | HU-19, HU-32, HU-33 |
| **3.2.2** | **Contenido** | Crear, editar, publicar, **dejar de mostrar** y archivar noticias y eventos, con editor de formato enriquecido e imágenes. | HU-18 |
| **3.2.3** | **Proyectos y campañas** | Editar el texto, la galería y la acción de cada entrada del catálogo. | HU-38 |
| **3.2.4** | **Bandeja de solicitudes** | Ver, filtrar y cambiar el estado de solicitudes de cita, voluntarios, padrinos, postulaciones, alianzas y mensajes de contacto. | HU-25 |
| **3.2.5** | **Convocatorias** | Crear una convocatoria con sus fechas, y cerrarla antes de tiempo. | HU-26 |
| **3.2.6** | **Exportación** | Descargar en CSV cualquier bandeja, filtrada por programa. | HU-14 |
| **3.2.7** | **Ajustes** | Datos de contacto, cuentas bancarias, alias de Yappy, textos del bloque de crisis. | HU-29 |
| **3.2.8** | **Usuarios y roles** | Invitar y desactivar personas, y asignarles rol. **Tres roles:** `administrador` (todo), `editor de contenido` (publica, pero **no puede leer solicitudes de cita**) y `gestor de solicitudes` (atiende bandejas, pero no edita el sitio). | HU-30 |
| **3.2.9** | **Feed de Instagram** | Ver las publicaciones cacheadas y **ocultar** cualquiera de ellas del sitio público. | HU-03 |
| **3.2.10** | **Tareas programadas** | Ver la última ejecución de cada tarea de RF-15 y si falló. | HU-28 |

---

# 4. Requisitos funcionales

## 4.1 Requisitos funcionales principales

*(RF-01 a RF-05 son los que citan las historias de usuario v1.0 y se conservan con su significado
original. RF-06 en adelante son la ampliación de esta versión.)*

---

### RF-01 — Gestión de contenido con caducidad automática

**El sistema debe permitir a un administrador autenticado crear, editar, publicar, dejar de mostrar y
archivar noticias y eventos, con formato enriquecido e imágenes, y debe ocultar automáticamente los
eventos vencidos sin intervención manual.**

| | |
|---|---|
| Origen | R-02, C-06, C-08 |
| Prioridad | **Alta** |
| Historias | HU-17, HU-18 |

- Un contenido tiene estado: `borrador`, `publicado` o `archivado`.
- Un evento tiene `fecha_inicio` y opcionalmente `fecha_fin`; al pasar `fecha_fin` (o `fecha_inicio`
  si no hay fin), deja de listarse entre los próximos **sin borrarse**.
- **La vigencia se calcula en la consulta, no la apaga un trabajo programado.** Un evento vencido
  desaparece de la lista porque la consulta filtra por fecha. Si el cron no corriera, el sitio
  seguiría correcto. Los trabajos de RF-15 solo avisan y registran; no son de los que, al fallar,
  dejan el sitio mostrando algo falso.
- «Ocultar» y «borrar» son operaciones distintas y ambas existen. Edwin pidió ocultar (C-06).
- El editor soporta negrita, cursiva, títulos, listas, enlaces e imágenes con texto alternativo.
- **El texto alternativo de una imagen es obligatorio para publicar.** No es una recomendación.
- Toda publicación registra quién la hizo y cuándo.

---

### RF-02 — Solicitud de cita psicológica

**El sistema debe recibir solicitudes de cita, guardarlas, confirmar al solicitante por correo y
avisar a la administración, en menos de un minuto.**

| | |
|---|---|
| Origen | S-04, R-03, C-03 |
| Prioridad | **Alta** |
| Historias | HU-09, HU-10, HU-11 |

- Campos: nombre, forma de contacto preferida, correo, teléfono, **motivo de consulta en una línea y
  opcional**, modalidad (virtual o presencial), disponibilidad horaria y consentimiento.
- **No se piden** diagnóstico, síntomas, medicación ni relato clínico (X-05).
- Validación en cliente y servidor con el mismo esquema. Errores en español y junto al campo.
- La solicitud se guarda en la base de datos **antes** de disparar cualquier correo. Si el correo
  falla, la solicitud existe igual y queda marcada para reintento.
- **Correo al solicitante**: confirmación de recibido, tiempo estimado de respuesta, recordatorio de
  que no es un canal de emergencia y el bloque de crisis. Sí puede devolverle lo que él mismo
  escribió — es suyo.
- **Correo a la administración**: tipo de solicitud, programa, fecha y enlace directo a la solicitud
  en el panel autenticado. **Nunca el motivo de consulta ni los datos de contacto** (RNF-14). Lo que
  viaja por correo queda replicado para siempre en un buzón que la fundación no controla; los datos
  se leen dentro del panel.
- La solicitud nace con estado `pendiente` en la bandeja (3.2.4).
- Un **botón directo a WhatsApp** convive con el formulario, no lo reemplaza.
- **v1 no reserva horarios.** Es una *solicitud*; Edwin confirma por su canal. No hay calendario de
  disponibilidad ni bloqueo de doble reserva. Ver [`adr/0004-agendamiento-por-solicitud.md`](./adr/0004-agendamiento-por-solicitud.md).

---

### RF-03 — Inscripción de voluntarios y padrinos, clasificada por programa

**El sistema debe recibir inscripciones de voluntariado y de apadrinamiento, clasificarlas
automáticamente por área de interés y por programa, y permitir exportarlas.**

| | |
|---|---|
| Origen | P-02, C-03 |
| Prioridad | **Alta** (padrinos) / **Media** (voluntarios) |
| Historias | HU-12, HU-13, HU-14 |

- Voluntariado: datos de contacto, **áreas de interés** en selección múltiple (redes sociales,
  diseño, logística, psicología, escritura, transporte, cocina, otra), disponibilidad y consentimiento.
- Apadrinamiento: datos de contacto, disponibilidad, cómo entregará el regalo, consentimiento. El
  registro queda clasificado bajo el programa `navidad`.
- **No se recogen datos del niño apadrinado** (X-06). El emparejamiento ocurre fuera de línea.
- **No se muestra ningún monto sugerido** — REFUVA no fija monto (P-02).
- Exportación a CSV filtrada por programa, con codificación UTF-8 con BOM para que Excel en español
  no rompa las tildes.

---

### RF-04 — Autenticación y control de acceso del panel

**El sistema debe exigir autenticación antes de mostrar cualquier función de edición, y debe
soportar más de un administrador con acceso independiente.**

| | |
|---|---|
| Origen | R-04, C-10 |
| Prioridad | **Alta** |
| Historias | HU-19 |

- Contraseñas almacenadas con hash y sal por el proveedor de identidad. Nunca en claro, nunca
  reversibles, nunca en un correo.
- **Segundo factor obligatorio** para toda cuenta administradora. Con procedimiento de recuperación
  escrito, porque Edwin puede perder el teléfono ([`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md)).
- Al menos dos administradores activos desde el día del lanzamiento (C-10).
- **Tres roles, no uno.** `administrador` puede todo; `editor de contenido` publica y edita el sitio
  pero **no puede leer una solicitud de cita**; `gestor de solicitudes` atiende las bandejas pero no
  edita el sitio. El principio: quien entra a subir una foto no necesita ver quién pidió ayuda
  psicológica esta semana. Las políticas de acceso se aplican por rol en la base de datos, no en la
  interfaz. Ver [`07-modelo-datos.md`](./07-modelo-datos.md) §4.
- Sesión con expiración y cierre de sesión visible.
- **Row Level Security activa en toda tabla con datos de personas.** Una tabla sin RLS en Supabase
  es legible desde cualquier navegador con la clave pública. Un hook del repositorio lo verifica.
- Bitácora de accesos y de cambios de contenido.

---

### RF-05 — Feed de publicaciones de Instagram

**El Inicio debe mostrar publicaciones recientes de Instagram, actualizadas automáticamente, sin
depender de credenciales que el equipo tenga que renovar a mano.**

| | |
|---|---|
| Origen | S-08, R-08 |
| Prioridad | **Media** |
| Historias | HU-03 |

- Mínimo tres publicaciones, cada una enlazada a la original.
- El feed se **lee desde el servidor** y se cachea en la base de datos. El navegador no llama a
  terceros: sin scripts externos, sin cookies de terceros, sin banner de consentimiento.
- Si la fuente falla, se muestra la última copia buena. Si no hay ninguna, la sección **desaparece**
  — no se muestra un hueco ni un mensaje de error.
- **Un administrador puede ocultar una publicación concreta** desde el panel. Es un requisito de
  seguridad de contenido, no una comodidad: el sitio habla de suicidio y no puede haber contenido
  no revisado en portada.
- Sin tokens de Meta gestionados por nosotros (X-01). Ver [`adr/0003-feed-instagram.md`](./adr/0003-feed-instagram.md).

---

### RF-06 — Presentación del catálogo de proyectos y campañas

**El sistema debe presentar los proyectos como iguales, cada uno con página propia, y las campañas
en una colección aparte.**

| | |
|---|---|
| Origen | **O-04 — el requisito raíz** |
| Prioridad | **Alta** |
| Historias | HU-06, HU-22 |

- El Inicio muestra **todas** las entradas, no una selección. El conteo se deriva de
  `src/lib/catalogo.ts`; nunca se escribe a mano.
- Ninguna se presenta como subordinada a salud mental.
- Cada página de proyecto lleva: nombre, logo propio, **su historia y en honor a quién** (O-06),
  qué hace, a quién sirve, requisitos de participación, galería de evidencia y su acción propia.
- El hero del Inicio nombra al menos **dos frentes distintos a salud mental** (HU-01).

---

### RF-07 — Postulación de comunidad a la convocatoria navideña

**El sistema debe recibir postulaciones de comunidades a la convocatoria navideña, mostrando los
requisitos de vulnerabilidad antes del formulario.**

| | |
|---|---|
| Origen | P-02 |
| Prioridad | **Alta** (estacional) |
| Historias | HU-07, HU-23 |

- Los requisitos se listan **explícitamente y antes** del formulario, no después.
- Campos: quién postula, su relación con la comunidad, ubicación, número aproximado de niños, por qué
  cumple los requisitos, contacto.
- **Número aproximado, nunca lista nominal de niños** (X-06).
- El formulario solo se muestra si la convocatoria está abierta; si está cerrada, se explica cuándo
  vuelve a abrir y se ofrece avisar.

---

### RF-08 — Solicitud de alianza institucional

**Una escuela o institución debe poder solicitar alianza desde la página del proyecto que le
interesa, por un canal distinto del contacto general.**

| | |
|---|---|
| Origen | P-01 |
| Prioridad | **Media** |
| Historias | HU-08 |

- Campos: institución, cargo del solicitante, contacto, proyecto de interés, población estimada.
- Llega a la bandeja etiquetado como `alianza`, no mezclado con el contacto general.

---

### RF-09 — Información de donaciones

**El sistema debe mostrar cómo donar sin exigir formulario ni registro.**

| | |
|---|---|
| Origen | S-06 |
| Prioridad | **Alta** |
| Historias | HU-15 |

- Alias de Yappy Comercial y su código QR, descargable.
- Datos de transferencia completos —banco, tipo de cuenta, número y titular exactamente como figura
  en el banco— cada uno con **botón de copiar**.
- Un canal para enviar el comprobante y pedir recibo.
- Editables desde el panel (3.2.7). Un número de cuenta quemado en el código es un error de diseño.
- **Sin muro:** nada de esto exige registrarse ni llenar nada.
- **Condicional:** si REFUVA resulta estar autorizada por la DGI para emitir donaciones deducibles,
  se añade un formulario **opcional** de datos fiscales para quien quiera recibo. El resto de la
  página sigue sin muro. Depende de la pregunta abierta en
  [`06-inventario-contenido.md`](./06-inventario-contenido.md); la tabla correspondiente queda
  registrada como pendiente en [`07-modelo-datos.md`](./07-modelo-datos.md).

---

### RF-10 — Contacto general

**El sistema debe recibir mensajes de contacto general y enviarlos al correo institucional.**

| | |
|---|---|
| Origen | Módulo 3.1.8 |
| Prioridad | **Baja** |
| Historias | HU-20, HU-21 |

- Se guarda además en la bandeja. El correo puede perderse; la base de datos no.
- Accesos directos a WhatsApp e Instagram.
- Mapa embebido **solo si hay dirección publicable** (S-05, pendiente). Si se embebe, se carga con
  clic previo para no arrastrar cookies de terceros.

---

### RF-11 — Bloque de recursos de crisis

**El sistema debe mostrar recursos de crisis de forma permanente y prominente en todas las páginas
que traten salud mental o suicidio.**

| | |
|---|---|
| Origen | X-04, P-05 |
| Prioridad | **Alta — bloqueante para lanzar** |
| Historias | HU-24 |

- Contenido verificado: **911** para emergencia con riesgo vital, y **Línea 147 del MIDES**
  —gratuita, confidencial, 24/7/365, WhatsApp **6694-2747**—.
- **La 169 del MINSA y los números del INSAM no se publican** mientras no se verifiquen por teléfono.
  Están en conflicto entre fuentes. Un número equivocado aquí hace daño real.
- Aparece **antes del primer campo** del formulario de cita, no al final.
- Los números son texto seleccionable y enlace `tel:` a la vez.
- Editable desde el panel, con la fecha de última verificación visible para el administrador.

---

### RF-12 — Bandeja de solicitudes

**Un administrador debe poder ver, filtrar y cambiar el estado de todo lo que entra por formularios.**

| | |
|---|---|
| Origen | C-03, R-03 |
| Prioridad | **Alta** |
| Historias | HU-25 |

- Una bandeja por tipo, con contador de pendientes visible al entrar.
- Estados: `pendiente` → `en gestión` → `atendida` / `cerrada sin atender`.
- Filtro por estado, por programa y por fecha. Búsqueda por nombre o contacto.
- Nota interna por solicitud, con autor y fecha.
- **Las solicitudes de cita se ordenan por antigüedad y la más vieja se destaca.** Alguien pidiendo
  ayuda psicológica no puede quedar sepultado bajo inscripciones de voluntariado.

---

### RF-13 — Gestión de convocatorias

**Un administrador debe poder abrir y cerrar convocatorias con fechas, y el sitio debe reflejarlo.**

| | |
|---|---|
| Origen | P-02, C-07 |
| Prioridad | **Media** |
| Historias | HU-26 |

- Una convocatoria pertenece a un proyecto y tiene apertura, cierre y estado.
- Al cerrarse, su formulario deja de aceptar envíos y se explica por qué.
- El cierre automático por fecha no exige que Edwin entre a apagarlo.

---

### RF-14 — Búsqueda y descubrimiento

**El sistema debe ser encontrable en buscadores y navegable sin saber su estructura.**

| | |
|---|---|
| Origen | R-01, C-02 |
| Prioridad | **Media** |
| Historias | HU-27 |

- URLs legibles en español: `/proyectos/historias-que-sanan`, no `/p?id=7`.
- `sitemap.xml` y `robots.txt` generados automáticamente.
- Metadatos y tarjeta social por página; una noticia compartida en WhatsApp debe verse bien.
- Datos estructurados `NGO` para la fundación, `Event` para eventos y `Article` para noticias.
- **Cada edición de un evento recurrente tiene su propia página.** La fiesta navideña de 2026 no es
  la misma página que la de 2025.
- No se invierte en marcado `FAQPage`: Google retiró ese resultado enriquecido en mayo de 2026.

---

### RF-15 — Trabajos programados

**El sistema debe ejecutar por sí solo las tareas periódicas que lo mantienen vivo.**

| | |
|---|---|
| Origen | X-01 |
| Prioridad | **Alta** |
| Historias | HU-28 |

| Tarea | Frecuencia | Por qué existe |
|---|---|---|
| Ping de actividad a la base de datos | Diaria | El plan gratuito de Supabase pausa proyectos tras 7 días sin actividad. |
| Refresco del feed de Instagram | Diaria | RF-05. |
| **Aviso** de convocatorias vencidas | Diaria | RF-13. Avisa y registra `cerrada_en`; el formulario ya deja de aceptar envíos por la fecha, no por el cron. |
| Respaldo de la base de datos | Semanal | El plan gratuito no incluye respaldo automático. |
| Reintento de correos fallidos | Cada hora | RF-02: ninguna solicitud se queda sin avisar en silencio. |
| Aviso de solicitudes sin atender | Semanal | Que nadie lleve más de 7 días esperando en la bandeja. |
| Purga de datos vencidos | Diaria | Retención de [`07-modelo-datos.md`](./07-modelo-datos.md) §5.1. |
| **Recordatorio de revalidación de los números de crisis** | Semestral | RF-11 y RNF-06. Cada 6 meses hay que volver a llamar al 911 y al 147, anotar la fecha y decidir si la 169 y el INSAM ya se pueden publicar. Es la única tarea cuyo incumplimiento afecta a personas. |

- **No se implementan con GitHub Actions.** Los workflows programados se desactivan solos tras 60
  días sin actividad del repositorio — exactamente el escenario post-entrega (X-01).
- Cada tarea deja registro de su última ejecución, visible en el panel.

## 4.2 Matriz de trazabilidad

| RF | Origen | Módulos | Historias | Prioridad |
|---|---|---|---|---|
| RF-01 | R-02, C-06, C-08 | 3.1.7, 3.2.2 | HU-17, HU-18 | Alta |
| RF-02 | S-04, R-03, C-03 | 3.1.4, 3.2.4 | HU-09, HU-10, HU-11, HU-37 | Alta |
| RF-03 | P-02, C-03 | 3.1.5, 3.2.4, 3.2.6 | HU-12, HU-13, HU-14 | Alta |
| RF-04 | R-04, C-10 | 3.2.1, 3.2.8 | HU-19, HU-30, HU-32, HU-33 | Alta |
| RF-05 | S-08, R-08 | 3.1.1, **3.2.9** | HU-03 | Media |
| RF-06 | **O-04** | 3.1.1, 3.1.3, 3.2.3 | HU-06, HU-22, HU-38 | Alta |
| RF-07 | P-02 | **3.1.3**, 3.1.5, 3.2.5 | HU-07, HU-23 | Alta |
| RF-08 | P-01 | 3.1.3, 3.2.4 | HU-08, HU-35 | Media |
| RF-09 | S-06 | 3.1.6, 3.2.7 | HU-15, HU-29, HU-34 | Alta |
| RF-10 | 3.1.8 | 3.1.8, 3.2.4 | HU-20, HU-21 | Baja |
| RF-11 | X-04, P-05 | 3.1.1, 3.1.4, **3.1.10**, 3.2.7 | HU-24, HU-37 | **Bloqueante** |
| RF-12 | C-03, R-03 | 3.2.4 | HU-25 | Alta |
| RF-13 | P-02, C-07 | 3.2.5 | HU-26 | Media |
| RF-14 | R-01, C-02 | todo el público, 3.1.7 | HU-27 | Media |
| RF-15 | X-01 | **3.2.10**, infraestructura | HU-28 | Alta |

**Historias que no implementan un RF, y por qué está bien:**

- **HU-16** (donar con tarjeta) queda **fuera del alcance de v1** por §6.3. Se conserva en el
  backlog como RF-16 de v2. No la cuentes como hueco de trazabilidad.
- **HU-31** (textos legales) implementa el módulo 3.1.9 y §6.2, no un RF numerado.
- **HU-36** (conexión lenta y teléfono viejo) responde a los requisitos no funcionales de
  accesibilidad y rendimiento, no a un RF. Ver [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md).

---

# 5. Stack tecnológico

*(Esta es la sección que citan las historias de usuario v1.0. El detalle con precios verificados,
alternativas descartadas y el presupuesto que Edwin pidió está en
[`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md).)*

## 5.1 Componentes

| Capa | Elección | Costo mensual |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | B/.0.00 |
| Estilos y componentes | Tailwind CSS + shadcn/ui | B/.0.00 |
| Base de datos, autenticación y archivos | Supabase (PostgreSQL) — plan Free | B/.0.00 |
| Automatizaciones y tareas programadas | n8n | Depende de dónde viva. Ver [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md) — es el único renglón sin cerrar del presupuesto. |
| Correo transaccional | Resend — plan Free | B/.0.00 |
| Buzón institucional | Google Workspace for Nonprofits | B/.0.00 |
| Hosting | Vercel Hobby | B/.0.00 |
| DNS | Cloudflare | B/.0.00 |
| Analítica | Cloudflare Web Analytics | B/.0.00 |
| Feed de Instagram | Behold.so — plan Free | B/.0.00 |
| Dominio `refuva.org` | Cloudflare Registrar / Porkbun | ~B/.1.00 (≈B/.12.00 al año) |
| **Total recurrente** | | **≈ B/.1.00 al mes, más lo que cueste alojar n8n** |

> El presupuesto vive en [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md), no aquí. Esta
> tabla es un resumen; si las dos difieren, manda la de 05.

## 5.2 Arquitectura

```
Navegador
   │  POST (Server Action / Route Handler)
   ▼
Next.js ──── valida con Zod ────► Supabase (PostgreSQL)
   │                                    │
   │                                    │ Database Webhook (pg_net, con reintentos)
   │                                    ▼
   │                                  n8n ──► Resend
   │                                      ──► aviso a la administración
   │                                      ──► exportaciones y tareas programadas
   ▼
Next.js lee Supabase directamente para renderizar (SSR / ISR)
```

**La regla:** la escritura en PostgreSQL es síncrona y ocurre primero. La automatización reacciona
después. Si n8n está caído, la solicitud de ayuda **no se pierde**; queda pendiente de notificar y se
reintenta (RF-15).

**El contenido se consulta en tiempo de ejecución, no en tiempo de compilación.** Además de permitir
que Edwin publique sin un despliegue, hace que el tráfico real cuente como actividad de base de
datos y evite la pausa por inactividad del plan gratuito.

## 5.3 Entorno de desarrollo

```bash
npm install
npm run dev            # Next.js en http://localhost:3000
npx supabase start     # PostgreSQL + Auth + Storage locales (requiere Docker)
npx supabase db reset  # aplica supabase/migrations/ y las semillas
npm run build          # verificación previa a cualquier entrega
```

## 5.4 Límites conocidos del stack, y qué hacer cuando se toquen

| Límite | Umbral | Mitigación |
|---|---|---|
| Correos de Resend | **100 al día** / 3.000 al mes | Los transaccionales caben. La difusión masiva de la campaña navideña **no sale del sitio**: se exporta a CSV y se envía desde el buzón institucional. |
| Base de datos Supabase | 500 MB | Solo texto y metadatos. Las imágenes van a Storage. Alerta al 70%. |
| Archivos Supabase Storage | 1 GB | Imágenes comprimidas y redimensionadas al subirlas. Alerta al 70%. |
| Pausa por inactividad | 7 días sin actividad | Ping diario (RF-15) más el tráfico real. |
| Vistas del feed de Instagram | 1.200 al mes en Behold Free | Se lee desde el servidor una vez al día, no una vez por visitante. El consumo es de ~30 al mes. |
| Uso comercial en Vercel Hobby | Pedir donaciones está permitido; vender no | Por eso v1 no cobra la consulta en línea (§6.3). Si eso cambia, se migra el hosting. |

---

# 6. Seguridad

*(Esta es la sección que citan las historias de usuario v1.0. El detalle operativo está en
[`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md).)*

## 6.1 Control de acceso

- Autenticación obligatoria antes de cualquier función de edición (RF-04).
- Segundo factor obligatorio para administradores, con recuperación documentada.
- **Row Level Security habilitada en toda tabla con datos de personas.** Sin excepciones. Cada
  política se prueba con un usuario que *no* debería ver el dato; una política que nadie intentó
  romper no está probada.
- La clave de servicio de Supabase vive solo en el servidor. Nunca en el navegador, nunca en el
  repositorio, nunca en un archivo `.env` versionado.

## 6.2 Datos personales

- **Minimización.** El formulario de cita no pide diagnóstico, síntomas, medicación ni relato
  clínico. Lo que no se recoge no se puede filtrar.
- **Ningún dato identificable de menores** (X-06).
- **Consentimiento** con casilla activa, nunca premarcada, en lenguaje llano y con enlace a una
  política de privacidad legible.
- **Cifrado** en tránsito (HTTPS obligatorio, HSTS) y en reposo (cifrado del proveedor).
- **Retención** definida por tabla, con borrado real al vencer. Detalle en
  [`07-modelo-datos.md`](./07-modelo-datos.md).
- **Bitácora** de todo acceso a datos de solicitudes.

> La figura legal de la fundación y el marco aplicable en Panamá los debe confirmar el asesor legal
> de REFUVA. Este documento fija el estándar de ingeniería, no la asesoría jurídica.

## 6.3 Pagos

- **El sitio no procesa, no transmite y no almacena datos de tarjeta.** Nunca.
- **v1 no cobra en línea.** Las donaciones se reciben por Yappy Comercial y transferencia; la
  consulta de B/.15.00 se cobra por los canales actuales de la fundación.
- Consecuencia deliberada: al no tocar datos de tarjeta, REFUVA queda en el escenario más simple de
  cumplimiento PCI DSS (SAQ A, ~24 requisitos, frente a ~140 del SAQ A-EP). Cuando llegue v2, el
  cobro será **por redirección a un checkout alojado**, nunca por formulario propio ni iframe.
- La mención de «PCI-DSS Nivel 1» en las historias v1.0 se refiere a la certificación **del
  proveedor**, no de REFUVA. REFUVA nunca necesita certificarse si nunca toca una tarjeta.

## 6.4 Contenido sensible

- Guía de mensajes seguros sobre suicidio, obligatoria y verificable en revisión
  ([`../CLAUDE.md`](../CLAUDE.md) §5.1).
- Bloque de crisis permanente (RF-11).
- **Ninguna publicación de terceros aparece en portada sin poder ser ocultada** (RF-05).
- No se publican fotos de niños beneficiarios ni de personas en situación de calle sin
  consentimiento firmado. Pendiente en [`06-inventario-contenido.md`](./06-inventario-contenido.md).

## 6.5 Aplicación

- Cabeceras de seguridad: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Strict-Transport-Security`.
- Toda entrada validada en el servidor con el mismo esquema que en el cliente. La validación de
  cliente es comodidad; la de servidor es la que cuenta.
- Protección contra envíos automatizados en formularios públicos, **sin CAPTCHA visual**: alguien en
  crisis no debería tener que descifrar imágenes para pedir ayuda.
- Dependencias auditadas antes de la entrega.

---

# 7. Criterios de aceptación del sistema

No se considera entregable hasta que **todo** esto sea cierto:

| # | Criterio | Verificación |
|---|---|---|
| AC-01 | Todos los proyectos y campañas aparecen en el Inicio, con página propia cada uno. | Revisión visual |
| AC-02 | Una solicitud de cita se guarda, confirma al solicitante y avisa a la administración en menos de un minuto. | Prueba de extremo a extremo |
| AC-03 | Cortando la automatización, la solicitud **se guarda igual** y queda marcada como pendiente de notificar. | Prueba de fallo inducido |
| AC-04 | **Edwin publica y oculta una noticia por su cuenta, sin ayuda del equipo.** | Prueba piloto con Edwin (C-08) |
| AC-05 | El bloque de crisis aparece con los datos verificados en todas las páginas que corresponden. | Revisión de contenido |
| AC-06 | Ninguna tabla con datos de personas está sin RLS. | Consulta al catálogo + hook |
| AC-07 | El sitio pasa una auditoría de accesibilidad sin errores de nivel AA. | axe + revisión con teclado |
| AC-08 | LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1 en móvil, al percentil 75. | Dos niveles: Lighthouse móvil con limitación de red **antes** de entregar, e informe de Core Web Vitals de Search Console con **datos de campo** a los 28 días del lanzamiento. La nota de Lighthouse por sí sola no es evidencia de cumplimiento (RNF-33). |
| AC-09 | Hay al menos dos administradores activos, ambos con segundo factor. | Revisión del panel |
| AC-10 | Todas las cuentas están a nombre de la fundación, ninguna al correo de un estudiante. | Revisión de traspaso |
| AC-11 | Existe el manual en español y está grabada la sesión de capacitación. | Entregable |
| AC-12 | Las tareas programadas corren y dejan registro visible. | Revisión del panel |

---

# 8. Fuera de esta versión

Registrado para que exista, no para hacerse ahora.

| # | Qué | Cuándo tendría sentido |
|---|---|---|
| V2-01 | Cobro en línea con Botón de Pago Yappy V2 (backend, IPN, HMAC-SHA256). | Cuando haya volumen que lo justifique y alguien que mantenga el endpoint. |
| V2-02 | Reserva de cita con calendario real de disponibilidad. | Cuando haya más de un profesional atendiendo. |
| V2-03 | Recordatorios de cita por WhatsApp Cloud API. | Cuando el volumen haga inviable el recordatorio manual. |
| V2-04 | Portal privado para padrinos con seguimiento de su apadrinamiento. | Solo con una política escrita de datos de menores. |
| V2-05 | Sección de transparencia con estados financieros. | Cuando la fundación los publique. |
| V2-06 | Boletín por correo. | Cuando haya quien lo escriba con regularidad. |
| V2-07 | ~~Versión en inglés.~~ **Pasó al alcance de v1 como andamiaje** (M-13, octubre de 2026): ver §1.2. Lo que sigue fuera es la *traducción*, que depende de la fundación. | Cuando la fundación entregue los textos en inglés. |
