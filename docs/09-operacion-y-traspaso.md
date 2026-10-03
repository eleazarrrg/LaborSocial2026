# Operación y traspaso — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Estado** | Borrador para validación con Edwin Quintero |
| **Responde a** | R-04 (capacitación), R-06 (almacenamiento), R-08 (redes), C-08 (prueba piloto), C-10 (dos personas), X-01 (el equipo se retira) |
| **Documentos relacionados** | [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md) (umbrales: RNF-16, RNF-38, RNF-44, RNF-48), [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md) (precios), [`07-modelo-datos.md`](./07-modelo-datos.md) (esquema y retención), [`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md) (fechas) |

> **Estados usados en este documento**, iguales a los de [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md):
> ✅ **Confirmado** · 🟡 **Inferido** (se deduce, hay que confirmarlo) · 🔴 **Pendiente** (nos falta el dato).

---

# 1. El problema, dicho sin rodeos

Los proyectos de servicio social universitario no mueren el día de la entrega. Mueren entre ocho y
veinte meses después, y casi siempre por la misma secuencia:

1. Un estudiante registra el dominio con su Gmail personal porque era el correo que tenía a mano.
2. El equipo entrega, presenta, se gradúa y desaparece. Nadie hace nada malo; simplemente se van.
3. A los once meses llega el aviso de renovación del dominio a un buzón que ya nadie revisa.
4. El dominio caduca. Con él se cae el sitio **y el correo institucional al mismo tiempo**, porque
   los dos cuelgan del mismo nombre.
5. La fundación no sabe a quién llamar, no sabe qué se venció, no tiene la contraseña de nada, y
   vuelve a WhatsApp.

Aquí eso está en el peor escenario posible: REFUVA la opera **una sola persona** (O-02), esa persona
**no es técnica** (X-03) y **no hay a quién delegar todavía** (O-03). Y el equipo entrega y se retira
por definición (X-01). No es un riesgo hipotético: es el desenlace por defecto si no se hace nada.

Este documento es lo que se hace en vez de nada. Se apoya en cinco decisiones:

| # | Decisión | Contra qué protege |
|---|---|---|
| D-1 | **Toda cuenta a nombre de la fundación**, con correo institucional compartido. Ninguna al correo de un estudiante ni al Gmail personal de Edwin. | El punto 1 de la lista de arriba. Es el nudo del que cuelga todo lo demás. |
| D-2 | **Dos administradores desde el día del lanzamiento** (C-10, RF-04), no uno con la promesa de buscar un segundo. | Que perder un teléfono equivalga a perder el sitio. |
| D-3 | **Cero secretos que caduquen sin renovación automática** (X-01), con el inventario contra el que comprobarlo en §2.5. Por eso Behold y no la API de Meta a mano; por eso nada de trabajos programados en GitHub Actions. | Que algo se apague solo a los 60 días de silencio del repositorio. |
| D-4 | **Un solo vencimiento real en todo el sistema: el dominio.** Todo lo demás es plan gratuito sin fecha de corte. | Que haya cinco cosas que recordar. Hay una. |
| D-5 | **Procedimientos escritos paso a paso, no recomendaciones.** «Guarden bien las contraseñas» no es un procedimiento. §4.3 sí lo es. | Que el conocimiento viva solo en la cabeza de quien se va. |

---

# 2. Inventario de cuentas y activos

**La regla, sin excepciones: el titular es la Fundación REFUVA y el correo de la cuenta es el buzón
institucional compartido.** Ninguna cuenta se abre con `@gmail.com` de un estudiante ni con el correo
personal de nadie. Si al terminar el traspaso una sola cuenta sigue a nombre de una persona del
equipo, el traspaso no está terminado (AC-10).

## 2.1 El correo que sostiene todo lo demás

Hay un huevo y una gallina que conviene resolver antes de abrir cuentas:

- El buzón institucional (`@refuva.org`) necesita el dominio.
- El dominio se registra desde alguna cuenta, y esa cuenta necesita un correo.

**Orden correcto:**

1. Se registra el dominio usando el **Gmail actual de la fundación** que ya usa Edwin (no el de un
   estudiante). Es temporal y está bien que lo sea.
2. Se activa Google Workspace for Nonprofits (§9.1) y se crean los buzones.
3. Se crea **`sistemas@refuva.org`** como buzón compartido, leído por los dos administradores.
4. Se **cambia el correo de contacto de todas las cuentas** —empezando por el registrador del
   dominio— a `sistemas@refuva.org`, y se verifica el cambio abriendo el correo de confirmación.
5. El Gmail personal deja de ser el correo de ninguna cuenta de servicio.

El paso 4 es el que se olvida. Va en la lista de verificación de §10.

## 2.2 La tabla de cuentas

| Servicio | Para qué sirve | Titular que DEBE quedar | Quién tiene acceso hoy | Segundo factor | Dónde vive la credencial |
|---|---|---|---|---|---|
| **Dominio `refuva.org`** | El nombre. De él cuelgan el sitio y el correo. | Fundación REFUVA · `sistemas@refuva.org` | 🔴 Sin registrar todavía | Obligatorio en el registrador | Bóveda compartida (§4) |
| **DNS (Cloudflare)** | Apunta el dominio al sitio y al correo. Es donde viven los registros MX, SPF, DKIM y DMARC. | Fundación REFUVA · `sistemas@refuva.org` | 🔴 Sin crear | Obligatorio | Bóveda compartida |
| **Hosting (Vercel)** | Sirve el sitio público y el panel. | Fundación REFUVA · `sistemas@refuva.org` | 🔴 Sin crear | Obligatorio | Bóveda compartida |
| **Supabase** | Base de datos, autenticación del panel y archivos. **Es la fuente de verdad.** | Fundación REFUVA · `sistemas@refuva.org` | 🔴 Sin crear | Obligatorio | Bóveda compartida |
| **Resend** | Envía los correos automáticos del sitio. Solo envía; no es un buzón. | Fundación REFUVA · `sistemas@refuva.org` | 🔴 Sin crear | Obligatorio | Bóveda compartida |
| **n8n** | Automatizaciones: avisos, exportaciones, tareas programadas. | Fundación REFUVA | 🔴 Sin definir. **Ver §2.4 — es el punto más frágil del inventario.** | Obligatorio | Bóveda compartida |
| **Behold.so** | Lee el Instagram y le entrega el feed al sitio sin que nadie renueve tokens de Meta. | Fundación REFUVA · `sistemas@refuva.org` | 🔴 Sin crear | 🟡 Verificar si lo ofrece | Bóveda compartida |
| **Google Workspace for Nonprofits** | Buzones `@refuva.org`, Drive de la fundación, calendario. Sustituye al Gmail personal y al OneDrive de pago. | Fundación REFUVA | 🔴 Sin solicitar | Obligatorio en las dos cuentas de administrador | Bóveda compartida + códigos impresos |
| **Instagram de la fundación** | Canal vivo de la fundación y fuente del feed del sitio. | Fundación REFUVA | ✅ Edwin (S-08). Octavio ya lo compartió con el equipo. | Obligatorio | Bóveda compartida |
| **Repositorio de código (GitHub)** | El código del portal. Sin él no se puede corregir nada nunca más. | **Organización de GitHub propiedad de la fundación**, no una cuenta personal | 🔴 Por crear | Obligatorio | Bóveda compartida |
| **Yappy Comercial** | Recibe donaciones. Alias y QR. | Fundación REFUVA, atado a la **cuenta comercial en Banco General a nombre de la fundación** | 🔴 Bloqueado: falta confirmar la cuenta comercial (A-02) | Lo impone el banco | Nunca en la bóveda del sitio. Ver §2.3 |

## 2.3 Tres cuentas que se tratan distinto

**Yappy Comercial y la banca en línea no entran en la misma bóveda que el resto.** Son dinero y son
del banco, no del portal. Sus credenciales las custodia Edwin bajo las reglas del banco y **el equipo
de desarrollo nunca las ve, nunca las pide y nunca las guarda**. Lo único que el sitio conoce de
Yappy es el **alias público** y el **QR**, que son datos publicables y se editan desde el panel
(RF-09). Los términos de Yappy Comercial exigen además que el alias sea de la fundación como persona
jurídica y no de una cuenta personal ✅, así que el alias de Edwin a título propio no sirve.

**Instagram es la única cuenta que ya existe y ya tiene historia.** No se recrea. Lo que hay que
hacer es asegurarla: segundo factor activo, correo de recuperación apuntando a `sistemas@refuva.org`
y códigos de respaldo guardados. Si Instagram se pierde, se pierde el feed del sitio y el archivo
visual de la fundación.

**El repositorio se crea dentro de una organización de GitHub de la fundación desde el primer
commit**, no en la cuenta personal de un estudiante «y después lo movemos». Después no se mueve:
después nadie se acuerda. GitHub tiene un programa gratuito para organizaciones sin fines de lucro
que se solicita en `nonprofits.github.com` ✅.

## 2.4 El punto frágil: dónde vive n8n 🔴

El stack fija n8n como capa de automatización y lo presupuesta en **B/.0.00 autohospedado**
([`01-srs.md`](./01-srs.md) §5.1). «Autohospedado» no dice **dónde**, y ahí hay un problema serio con
X-01: si n8n corre en la infraestructura que el equipo opera hoy, se apaga cuando el equipo se retire
—o cuando alguien deje de pagar el servidor— y arrastra consigo los correos de confirmación, las
exportaciones y el ping que evita que Supabase se pause.

**Está pendiente decidir y dejar por escrito:** en qué servidor corre n8n, a nombre de quién está
ese servidor, cuánto cuesta al mes y quién lo paga. **Lo debe Rafael Gómez, antes de la entrega**, y
es el único dueño de este pendiente: si aparece atribuido a alguien más en cualquier otro documento,
manda esta línea. No se entrega con esto abierto.

**Y que quede claro qué está decidido y qué no.** Decidido está que n8n es la capa de automatización
y que no es el backend del sitio ([`../CLAUDE.md`](../CLAUDE.md) §4). **Dónde vive la instancia
después de la entrega no está decidido**: es un pendiente abierto, no un detalle de configuración.
Mientras siga abierto, el alojamiento se trata como lo que es —un servicio que alguien va a pagar
todos los meses—, así que va como **línea del presupuesto con su costo** en
[`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md) y como **trámite con fecha** en
[`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md), junto a los demás trámites que no son código.

La salida de emergencia ya está escrita en [`../CLAUDE.md`](../CLAUDE.md) §4 y sigue siendo válida:
si n8n no queda en un lugar que sobreviva al equipo, sus funciones se reimplementan como Route
Handlers de Next.js más Resend, ejecutados por un disparador programado externo al repositorio. La
arquitectura no depende de n8n. Lo que no se permite es entregar con una pieza cuya vida útil sea la
del interés del equipo.

## 2.5 Inventario de secretos

La tabla de §2.2 dice **de quién es cada cuenta**. Esta dice **qué claves tienen que existir para que
el sitio funcione**, y es contra la que se comprueba RNF-44: *ninguna fila con fecha de vencimiento
manual*. Sin esta tabla esa verificación no se puede hacer, porque no habría lista que revisar.

**Aquí no va ningún valor.** Ni en este documento, ni en el repositorio, ni en un correo. Aquí va el
mapa: qué es cada secreto, para qué sirve, de quién es, dónde vive y si caduca.

| Secreto | Para qué sirve | Propietario | Dónde se guarda | ¿Caduca? |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Identifican el proyecto de Supabase desde el navegador. Son públicas por diseño: lo que protege el dato es RLS, no el secreto. | Fundación REFUVA | Variables de entorno del hosting | **No** |
| `SUPABASE_SERVICE_ROLE_KEY` | Se salta RLS. La usan los Route Handlers, las Server Actions y las automatizaciones. Es la llave maestra de la base. | Fundación REFUVA | Variables de entorno del hosting y bóveda del equipo técnico. **Nunca en el cliente ni en la bóveda de Edwin** (§4.1) | **No.** Se rota a mano solo si se filtra |
| Clave de la API de **Resend** | Enviar los correos que salen del sitio. | Fundación REFUVA | Variables de entorno del hosting | **No** |
| **URL del webhook de n8n** y la cabecera con que se autentica | Que la base de datos despierte a la automatización cuando se guarda una solicitud. | Fundación REFUVA | Configuración de Supabase y de n8n | **No** 🟡. Cambia si n8n se muda de servidor (§2.4) |
| **Identificador del feed de Behold** | Leer el Instagram sin que el sitio guarde ningún token de Meta. | Fundación REFUVA | Variables de entorno del hosting | **No.** El token de Meta, que sí caduca a los 60 días, lo renueva Behold en su infraestructura ✅ |
| **Credencial de escritura del repositorio privado de respaldos** | Que el volcado semanal llegue a un repositorio de la fundación (RF-15, [`07-modelo-datos.md`](./07-modelo-datos.md) §8). | Fundación REFUVA | Configuración de n8n | 🔴 **La única fila que hoy puede incumplir RNF-44**: los tokens de GitHub se emiten con fecha de vencimiento. Hay que emitirla sin caducidad o con renovación automática, y dejarlo escrito aquí. **Lo debe Rafael Gómez, antes de la entrega** |
| **Contraseñas y segundos factores** de las cuentas de §2.2 | Entrar a cada servicio. | Fundación REFUVA | Bóveda compartida (§4.1) y códigos de respaldo impresos (§4.2) | **No.** Ninguna cuenta se configura con caducidad obligatoria de contraseña |

**Cómo se verifica RNF-44, en un minuto:** se lee la última columna de arriba abajo. Toda fila tiene
que decir **No**; la que no lo diga, o se arregla antes de la entrega o queda escrito quién la
renueva y cada cuánto. Se revisa entrando a los paneles en la sesión 3 de capacitación (§6.2) y otra
vez en la rutina anual de §3.5.

**Si alguna vez se filtra un secreto:** se rota primero y se investiga después. Generar el valor
nuevo en el panel del proveedor, reemplazarlo en las variables de entorno del hosting, volver a
desplegar, comprobar que el sitio y los correos siguen funcionando, y anotar la fecha en la nota de
la bóveda. Antes de la entrega lo hace **Rafael Gómez**; después, quien opere el sitio, con esta
tabla en la mano.

---

# 3. Calendario de renovaciones

## 3.1 Lo que vence de verdad

| Qué | Cuándo vence | Cuánto cuesta | Quién lo renueva | Qué pasa si no se renueva |
|---|---|---|---|---|
| **Dominio `refuva.org`** | Cada 12 meses desde la fecha de registro. 🔴 Fecha exacta pendiente: aún no está registrado. | ≈B/.12.00 al año. **Cifra exacta y fuente en [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md).** | Edwin Quintero, con la tarjeta de la fundación | **El sitio y el correo mueren juntos.** Ver §3.2. |

Eso es todo lo que se paga. Un solo vencimiento, una vez al año, por menos de lo que cuesta una
consulta psicológica. Fue una decisión de diseño, no una casualidad: todo lo demás del stack está en
planes gratuitos sin fecha de corte ([`01-srs.md`](./01-srs.md) §5.1).

Pero el calendario tiene una segunda entrada que no cuesta dinero y sí tiene fecha: la
**revalidación semestral de los números de crisis** (§3.6). Es la única de todo este documento cuyo
incumplimiento se paga en personas.

## 3.2 Por qué el dominio es el crítico

Del dominio cuelgan **dos cosas a la vez**:

- El **sitio**: el registro que apunta `refuva.org` al hosting.
- El **correo**: los registros MX que llevan el correo de `@refuva.org` a Google Workspace, más el
  SPF y el DKIM del subdominio `notificaciones.refuva.org` desde el que Resend envía ✅.

Si el dominio caduca, no se cae «la página web». Se cae la página **y** deja de llegar el correo de
la fundación **y** dejan de salir las confirmaciones de las solicitudes de cita. Y a diferencia de
casi todo lo demás, no se arregla apretando un botón: un dominio vencido entra en periodo de gracia,
después en redención con recargo, y después se libera para que lo compre cualquiera. Recuperarlo
entonces cuesta mucho más que doce dólares, si es que se puede.

## 3.3 Las cuatro defensas del dominio

No basta con anotar la fecha. Se ponen las cuatro, y se verifican en §10:

1. **Renovación automática activada** en el registrador, comprobada abriendo la configuración de la
   cuenta y viendo que dice que está activa.
2. **Registrado a 3 años vista**, no a uno. Triplica el margen de error por unos B/.24.00 adicionales
   de una sola vez.
3. **Tarjeta de la fundación, no de una persona**, y **revisión de la fecha de vencimiento de esa
   tarjeta**. La causa número uno de dominios perdidos no es el olvido: es una tarjeta vencida contra
   la que la renovación automática falla en silencio.
4. **Dos avisos de calendario** en el calendario de Google de la fundación, con invitación a los dos
   administradores: uno a **60 días** y otro a **15 días** antes de la fecha de renovación. Título
   literal sugerido: «Revisar que refuva.org se renovó y que la tarjeta sigue vigente».

## 3.4 Lo que no vence pero sí se puede apagar solo

Estas no son renovaciones. Son cosas que se pausan por inactividad o por consumo y hay que saber que
existen, porque el síntoma se parece a «el sitio se rompió».

| Qué | Se apaga cuando | Cuánto cuesta reactivarlo | Quién lo hace | Detalle |
|---|---|---|---|---|
| **Proyecto de Supabase** | 7 días sin actividad de base de datos en el plan Free ✅ | B/.0.00 y de 2 a 3 minutos | Edwin, solo, desde el panel | Runbook §5.7. No se pierden datos ✅. Hay dos capas de defensa: el tráfico real cuenta como actividad, y el ping diario programado (RF-15). |
| **Feed de Behold** | Al superar 1.200 vistas al mes en el plan gratuito; la cuenta se pausa hasta el mes siguiente ✅ | B/.0.00, esperar al mes siguiente | Nadie | El sitio lee el feed una vez al día desde el servidor, no una vez por visitante: el consumo estimado es de unas 30 vistas al mes. Si el feed desaparece, la sección se oculta sola (RF-05); el sitio no muestra un hueco. |
| **Envío de correo (Resend)** | Al pasar de 100 correos en un día o 3.000 en el mes, plan gratuito ✅ | B/.0.00, esperar al día siguiente | Nadie | Muerde solo en campaña navideña. La difusión masiva **no sale del sitio**: se exporta a CSV y se envía desde el buzón institucional ([`01-srs.md`](./01-srs.md) §5.4). |
| **Verificación de Google for Nonprofits** | 🟡 Puede exigir re-verificación periódica con Goodstack. **Confirmarlo al activar la cuenta.** | B/.0.00 | Edwin | Si se pierde, el buzón institucional pasa a plan de pago. Conviene revisarlo una vez al año junto con el dominio. |

## 3.5 Rutina anual, en una línea

**Una vez al año, en la semana del aviso de 60 días:** confirmar que el dominio se renovó, que la
tarjeta de la fundación sigue vigente, que los dos administradores siguen activos y con segundo
factor, que el último respaldo tiene menos de un mes (§5.11), y que ninguna fila del inventario de
secretos de §2.5 empezó a caducar.

## 3.6 Revalidación semestral de los números de crisis

Esta fila no cuesta un balboa y no la cobra nadie. Es, aun así, **la única del calendario donde no
renovar tiene consecuencias sobre personas**: un número que dejó de contestar, publicado en una
página de prevención del suicidio, hace más daño que no publicar ninguno.

| Qué | Cada cuánto | Qué hay que hacer | Quién lo hace | Qué pasa si no se hace |
|---|---|---|---|---|
| **Revalidación de los números de crisis** (RF-11, RNF-06) | **Cada 6 meses.** La tarea programada de 190 días manda el recordatorio (RF-15); el recordatorio avisa, no verifica nada por sí solo | **Volver a llamar al 911 y a la Línea 147 del MIDES**, probar el WhatsApp **6694-2747**, anotar la fecha de verificación de cada número en el panel, y **decidir si la 169 del MINSA y los números del INSAM ya se pueden publicar** | **Edwin Quintero**, con la segunda persona administradora como suplente. La **primera** verificación, antes del lanzamiento, la hace **Juan Zhu** (tarea T-09 de [`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md)) | Alguien en crisis marca un número que ya no existe o que no contesta a esa hora. No hay forma de enterarse después de que eso pasó |

**Cómo se anota, en tres pasos:** panel → **Ajustes** → textos del bloque de crisis; escribir la
fecha de verificación al lado de cada número; guardar. El panel muestra esa fecha junto al número
para que se vea de un vistazo cuál lleva demasiado tiempo sin comprobarse (RF-11).

**Y las dos reglas que no cambian**, de [`../CLAUDE.md`](../CLAUDE.md) §5.1:

- **Un número que no se pudo verificar no se publica.** Ni «por si acaso», ni «mientras tanto». Por
  eso la 169 del MINSA y el INSAM siguen fuera: están en conflicto entre fuentes.
- **Si al llamar algo cambió, el texto se corrige ese mismo día**, no en la revisión siguiente. Es
  el único punto de este documento donde esperar a la próxima ronda no es una opción.

---

# 4. Gestión de contraseñas y segundo factor

## 4.1 Cómo se guardan

Las credenciales de los servicios del portal viven en **una bóveda compartida de un gestor de
contraseñas**, propiedad de la fundación, con los dos administradores dentro. No en un cuaderno, no
en las notas del teléfono, no en un WhatsApp a uno mismo, y no en un archivo llamado `claves.docx`
en el Drive.

- **Herramienta concreta y límites de su plan gratuito: 🔴 Pendiente.** No hay dato verificado en
  [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md) sobre
  gestores de contraseñas; la investigación registra el vacío pero no lo llenó. **Lo debe el equipo
  técnico (Rafael), antes de la sesión 1 de capacitación**, con dos requisitos duros: que permita una
  bóveda compartida entre dos personas en plan gratuito, y que tenga interfaz en español.
- Lo que sí se puede fijar hoy, independientemente de la herramienta que se elija:
  - **Una contraseña distinta por servicio**, generada por el gestor, nunca reutilizada.
  - **La contraseña maestra la sabe Edwin y solo Edwin**, y no está guardada en ningún lado digital.
  - Las claves técnicas del proyecto (`SUPABASE_SERVICE_ROLE_KEY`, clave de la API de Resend) **no se
    guardan en la bóveda de Edwin**: viven como variables de entorno en el hosting y en la bóveda del
    equipo técnico. Edwin no las necesita nunca y no debería poder filtrarlas sin querer.

## 4.2 Segundo factor: qué se activa y qué se guarda

Segundo factor **obligatorio** en las dos cuentas de administrador del panel (RF-04) y en todas las
cuentas de servicio del inventario de §2.2.

Y aquí está la parte que casi nadie hace: **cada vez que se activa un segundo factor, el servicio
entrega entre 8 y 10 códigos de respaldo de un solo uso.** Esos códigos son la diferencia entre
«perdí el teléfono» y «perdí la cuenta».

Procedimiento, en el momento de activar el segundo factor de cada servicio:

1. Activar el segundo factor con la aplicación de autenticación en el teléfono de Edwin.
2. Activarlo **también** en el teléfono de la segunda persona administradora, escaneando el mismo
   código QR antes de cerrar la pantalla. Un código QR se puede escanear con dos teléfonos; después
   ya no se puede volver a ver.
3. Descargar los códigos de respaldo.
4. **Imprimirlos en papel.** Dos copias.
5. Copia 1: sobre cerrado, guardado físicamente donde la fundación guarda sus documentos legales.
6. Copia 2: en poder de la segunda persona administradora.
7. Guardar además los códigos en la bóveda compartida, en una nota separada de la contraseña.
8. Anotar en esa nota la fecha en que se generaron.

El papel parece anticuado. Es exactamente por eso que funciona: no se pausa, no caduca, no depende de
que alguien pague nada y sobrevive al robo del teléfono, que es el escenario del que estamos
hablando.

## 4.3 Procedimiento: Edwin pierde el teléfono

No es una recomendación. Es lo que se hace, en este orden, el mismo día.

**Paso 0 — antes de que pase (se hace en la capacitación, no después).**
Tienen que ser ciertas estas tres cosas, o el procedimiento no funciona: existe una segunda persona
administradora activa con su propio segundo factor (C-10); existen los códigos de respaldo impresos
de §4.2; y el correo de recuperación de todas las cuentas es `sistemas@refuva.org`, que la segunda
persona también puede abrir.

**Paso 1 — cortar el acceso del teléfono perdido (primeras horas).**
Desde cualquier computadora, entrar a la cuenta de Google de la fundación y cerrar la sesión de ese
dispositivo. Hacer lo mismo en Instagram y en WhatsApp Business. Esto no recupera nada; impide que
quien tenga el teléfono entre.

**Paso 2 — recuperar el acceso al panel del sitio.**
Edwin entra al panel desde otra computadora. Cuando le pida el segundo factor, usa uno de los
**códigos de respaldo impresos**. Cada código sirve una sola vez: se tacha del papel al usarlo.

**Paso 3 — si no aparecen los códigos impresos.**
La **segunda persona administradora** entra al panel con su propia cuenta, va a **Usuarios** en el
menú lateral (`/panel/usuarios`, módulo 3.2.8), **desactiva** la cuenta de Edwin y la **vuelve a
invitar** con el mismo correo. Edwin
recibe una invitación nueva y configura el segundo factor desde cero en su teléfono nuevo. Es la
razón concreta y práctica por la que C-10 no es una cortesía: sin segunda persona, este paso no
existe y hay que escribirle a un proveedor y esperar.

**Paso 4 — recuperar el correo institucional.**
La segunda persona administradora, si tiene rol de administrador en Google Workspace, restablece la
verificación en dos pasos de la cuenta de Edwin desde la consola de administración. 🟡 **Inferido:
confirmar en la consola durante la sesión 3 de capacitación que la segunda cuenta tiene ese permiso
y probarlo con una cuenta de prueba.** Si no lo tiene, se usa el flujo de recuperación de Google con
el correo de recuperación de la cuenta.

**Paso 5 — rehacer los segundos factores en el teléfono nuevo.**
Uno por uno, con la tabla de §2.2 en la mano, marcando cada servicio a medida que se hace. Se
generan **códigos de respaldo nuevos** para cada uno y se repite el procedimiento de §4.2 completo.
Los códigos viejos se destruyen: ya no valen y confunden.

**Paso 6 — cambiar las contraseñas de los servicios cuya sesión quedó abierta en el teléfono
perdido**, empezando por el correo institucional.

**Paso 7 — anotar la fecha en la nota de la bóveda.** El próximo que lea esto necesita saber cuándo
fue la última vez.

## 4.4 Cuando se va una persona

Cuando alguien deja de colaborar con la fundación —o cuando el equipo de desarrollo se retira—:
desactivar su usuario del panel (§5.6), quitarlo de la bóveda compartida, quitarlo de la organización
de GitHub, y **cambiar la contraseña de toda cuenta compartida que esa persona haya visto**. Quitar a
alguien de una bóveda no cambia lo que ya se llevó en la cabeza o en el portapapeles.

---

# 5. Runbook de operación

Doce procedimientos. Cada uno paso a paso y en lenguaje llano, porque el panel lo va a usar alguien
que entra cada dos semanas y no recuerda dónde estaba nada (X-03).

> Todos empiezan igual: entrar a `refuva.org/panel`, iniciar sesión con el correo institucional y
> aprobar el segundo factor en el teléfono.

## 5.1 Publicar una noticia

1. Menú lateral → **Contenido** → **Noticias**.
2. Botón **Nueva noticia**.
3. Escribir el **título**. Es lo que va a aparecer en Google y en WhatsApp cuando alguien la comparta.
4. Elegir el **proyecto o la campaña** al que pertenece. Si es de la fundación en general, dejarlo
   sin proyecto.
5. Escribir el texto. La barra de arriba tiene negrita, cursiva, títulos, listas y enlaces.
6. Subir la **imagen de portada**. El panel la comprime solo; no hace falta prepararla antes.
7. **Escribir el texto alternativo de la imagen.** Es obligatorio y sin él el botón de publicar no se
   activa (RF-01). Se describe lo que se ve, en una frase: «Voluntarios entregando raciones de comida
   en la vía España, de noche».
8. Botón **Vista previa** para ver cómo queda.
9. Botón **Publicar**.
10. Abrir `refuva.org/noticias` en el teléfono y confirmar que aparece.

**Si la noticia toca salud mental o suicidio**, antes de publicar hay que releer la guía de mensajes
seguros que el panel muestra al lado del editor: nunca métodos, nunca lugares, nunca «cometió
suicidio» —se dice «murió por suicidio» o «se quitó la vida»— y siempre cerrar con recursos de ayuda
y un mensaje de esperanza ([`../CLAUDE.md`](../CLAUDE.md) §5.1).

**Para guardar sin publicar:** botón **Guardar borrador**. Queda solo para los administradores.

## 5.2 Ocultar un evento que ya pasó

Casi nunca hace falta: **el sitio lo hace solo**. Al pasar la fecha de fin del evento deja de
listarse entre los próximos sin borrarse, porque **la consulta que arma el listado filtra por fecha**
(RF-01); no hay ninguna tarea programada que lo apague. Esto es para cuando hay que ocultar algo
antes de tiempo —un evento que se canceló, o una publicación que hay que bajar ya—.

1. **Contenido** → **Eventos**.
2. Buscar el evento en la lista.
3. Botón **Dejar de mostrar**.
4. Confirmar.

El evento **no se borra**: queda archivado, con sus fotos y su texto, y se puede volver a publicar
con el botón **Publicar** (C-06). Esto es a propósito: la evidencia de lo que la fundación ha hecho
sirve para pedir patrocinio (O-07) y no se tira.

**Borrar** existe y es otro botón, en rojo, con una confirmación distinta. Borrar es definitivo. La
regla práctica: **si dudas, deja de mostrar**.

## 5.3 Abrir y cerrar una convocatoria

Una convocatoria es un periodo de inscripción abierto. Mientras está abierta, su formulario acepta
envíos; cerrada, no (RF-13). La navideña son dos: comunidades y padrinos (P-02).

**Para abrir:**

1. Menú lateral → **Convocatorias**.
2. Botón **Nueva convocatoria**, o abrir una existente y **Reabrir**.
3. Elegir el **proyecto** y el **tipo** (padrinos, comunidades, voluntariado).
4. Poner la **fecha de apertura** y la **fecha de cierre**.
5. Revisar el **texto de requisitos**. En la de comunidades tiene que decir con claridad qué se
   entiende por comunidad en vulnerabilidad real, porque ese texto se muestra **antes** del
   formulario, no después (RF-07).
6. Botón **Abrir convocatoria**.
7. Verificar en el sitio público que el formulario aparece y acepta un envío de prueba.

**Para cerrar:** normalmente no hay que hacer nada — **se cierra sola en la fecha de cierre**. Para
cerrarla antes: abrirla en el panel y botón **Cerrar ahora**. El formulario deja de aceptar envíos y
en su lugar el sitio explica que la convocatoria cerró.

**Lo que sí hay que revisar al cerrar:** el texto de «cuándo vuelve a abrir». Si dice «vuelve en
2026» y ya estamos en 2027, hay que cambiarlo.

## 5.4 Cambiar los datos bancarios o el alias de Yappy

Estos datos **no están escritos en el código**: se editan desde el panel, precisamente para que
cambiarlos no dependa de nosotros (RF-09).

1. Menú lateral → **Ajustes** → **Donaciones**.
2. Editar lo que corresponda:
   - **Alias de Yappy** (por ejemplo `@refuva`).
   - **Imagen del código QR** de Yappy: se sube como imagen.
   - **Banco**, **tipo de cuenta**, **número de cuenta** y **titular**.
3. El **titular se escribe exactamente como aparece en el estado de cuenta del banco**, letra por
   letra. Si en el banco dice «FUNDACION REFUVA» sin tilde, en el sitio va sin tilde. Un donante que
   escriba el nombre distinto puede ver rechazada la transferencia.
4. Botón **Guardar**.
5. **Verificación obligatoria:** abrir `refuva.org/donar` en el teléfono, tocar el botón de copiar del
   número de cuenta, pegarlo en las notas y compararlo carácter por carácter con el estado de cuenta.
6. Hacer **una transferencia real de B/.1.00** siguiendo lo que dice el sitio, como lo haría un
   donante, y confirmar que llegó.

El paso 6 no es exageración. Un número de cuenta con un dígito cambiado no da error: manda el dinero
a otro lado o lo rechaza sin decir por qué, y la fundación se entera semanas después.

**Lo que nunca se hace aquí:** poner el alias de Yappy personal de Edwin. Los términos de Yappy
Comercial prohíben usar la cuenta comercial para pagos personales y exigen que el comercio afiliado
sea la persona jurídica ✅. Y **no se agrega ninguna casilla de «cubro la comisión»**: los términos
prohíben trasladar la comisión al donante ✅.

## 5.5 Exportar la lista de padrinos

1. Menú lateral → **Solicitudes** → pestaña **Padrinos y madrinas**.
2. Filtrar por **programa** (`navidad`) y por el **año** que interese.
3. Botón **Exportar a CSV**.
4. Se descarga un archivo. Abrirlo con Excel o subirlo al Drive de la fundación.

El archivo sale en UTF-8 con BOM para que Excel en español no rompa las tildes (RF-03). Si al abrirlo
aparecen símbolos raros en vez de tildes, es que se abrió mal, no que se exportó mal.

**Dos cosas que hay que tener presentes:**

- El archivo contiene **datos personales de gente que confió en la fundación**. Va al Drive de la
  fundación, no a WhatsApp, no a un correo personal, no a una memoria USB que se presta.
- **No hay ningún dato de niños en ese archivo, y no lo va a haber.** El emparejamiento padrino↔niño
  ocurre fuera del sistema, a propósito (X-06).

## 5.6 Invitar a un segundo administrador y quitarle el acceso a alguien

**Para invitar:**

1. Menú lateral → **Usuarios**.
2. Botón **Invitar administrador**.
3. Escribir su **correo**. Preferiblemente uno `@refuva.org`.
4. Botón **Enviar invitación**.
5. La persona recibe un correo, entra por el enlace y pone su contraseña.
6. **El sistema le va a exigir configurar el segundo factor antes de dejarla entrar.** No es
   opcional (RF-04).
7. **Hacer con ella el procedimiento de códigos de respaldo de §4.2 el mismo día.** Si se deja para
   después, no se hace.
8. Confirmar en la lista de usuarios que aparece como **activa**.

**Para quitar el acceso:**

1. Menú lateral → **Usuarios**.
2. Buscar la persona → botón **Desactivar**.
3. Confirmar.
4. Sus sesiones abiertas se cierran. Deja de poder entrar de inmediato.
5. Lo que esa persona publicó **no se borra**: la bitácora conserva quién hizo cada cosa y cuándo
   (RF-04).
6. Completar lo de §4.4: bóveda, GitHub y contraseñas compartidas.

**Nunca deben quedar menos de dos administradores activos.** Si hay que desactivar a uno y solo
quedaría uno, primero se invita al reemplazo.

## 5.7 Reactivar el proyecto de Supabase si se pausó

**El síntoma:** el sitio carga, pero las noticias no aparecen, los formularios dan error al enviar o
el panel no deja iniciar sesión.

**La causa:** el plan gratuito de Supabase pausa un proyecto tras **7 días sin actividad de base de
datos** ✅. El diseño lo evita por dos vías —el tráfico real cuenta como actividad y hay un ping
diario programado (RF-15)—, así que esto solo debería pasar si el sitio estuvo caído o sin visitas
una semana entera.

**Lo primero, y es importante: no se perdió nada.** Los datos y la configuración quedan intactos ✅.

1. Entrar a `supabase.com` e iniciar sesión con `sistemas@refuva.org`.
2. Seleccionar la **organización** de la fundación.
3. En la lista de proyectos, el del portal aparece marcado como **pausado**.
4. Botón **Resume project** (Reanudar proyecto).
5. Confirmar.
6. **Esperar de 2 a 3 minutos sin tocar nada** ✅. Durante ese rato el sitio puede seguir dando
   errores o mostrar listas vacías. **Eso es normal y no significa que se hayan borrado los datos.**
7. Recargar `refuva.org` y confirmar que las noticias volvieron.
8. Entrar al panel y confirmar que las solicitudes están todas.
9. **Avisar al contacto del equipo** (§7). Que el proyecto se haya pausado significa que el ping
   diario no está corriendo, y eso hay que arreglarlo o volverá a pasar cada semana.

**Una advertencia que sí importa:** no dejar un proyecto pausado más de **tres meses**. La
documentación de Supabase y su propio anuncio de cambios se contradicen sobre la ventana de
restauración —una fuente dice un año, otra dice 90 días 🟡—, así que se asume el escenario malo. Si
por lo que sea la fundación va a estar inactiva un trimestre, se reactiva el proyecto igual y se
descarga un respaldo (§5.11).

## 5.8 Qué hacer si el sitio no carga

En orden. No saltarse pasos: los primeros son gratis y descartan la mitad de los casos.

1. **¿Es solo tu conexión?** Apagar el WiFi, entrar con datos móviles y probar de nuevo. Si con datos
   sí carga, el problema es la red de donde estabas.
2. **¿Es solo tu computadora?** Probar en el teléfono de otra persona.
3. **¿Qué dice exactamente la pantalla?** No es lo mismo:
   - *«No se puede acceder a este sitio» / «Servidor no encontrado»* → problema de dominio o de DNS.
     Ir al paso 4.
   - *Una página de error del hosting con un código* → el sitio está vivo pero algo falló dentro.
     Ir al paso 5.
   - *La página carga pero sin noticias* → probablemente Supabase pausado. Ir a §5.7.
   - *«Tu conexión no es privada» / advertencia de certificado* → casi siempre el dominio venció.
     Ir al paso 4.
4. **Revisar el dominio.** Buscar en el buzón `sistemas@refuva.org` correos del registrador con
   asunto de renovación o de expiración, incluida la carpeta de spam. Entrar al registrador y ver la
   fecha de expiración. **Si venció, renovarlo inmediatamente**: cada día cuenta y el recargo sube.
5. **Revisar el estado del hosting.** Entrar a la cuenta de Vercel y ver si el último despliegue está
   marcado como correcto. Si el proveedor tiene una incidencia general, no hay nada que hacer más que
   esperar; suele durar minutos.
6. **Avisar al contacto del equipo** (§7) con la información de §7.2. Nunca «no funciona»: siempre
   qué pantalla exacta salió, a qué hora, desde qué dispositivo y en qué dirección.

**Lo que no hay que hacer:** cambiar registros de DNS «a ver si se arregla», borrar y volver a crear
el proyecto en el hosting, o borrar el proyecto de Supabase. Ninguna de esas cosas arregla nada y las
tres pueden convertir una caída de una hora en una pérdida permanente.

## 5.9 Qué hacer si dejan de llegar los correos

**Primero, lo que hay que entender para no entrar en pánico:** el correo **no es** donde se guardan
las solicitudes. La solicitud se guarda en la base de datos **antes** de que salga ningún correo
([`../CLAUDE.md`](../CLAUDE.md) §4). Si no llega el correo, **la solicitud está igual en la bandeja
del panel**. Nadie se quedó sin ser atendido: solo no llegó el aviso.

1. **Entrar al panel → Solicitudes** y confirmar que las solicitudes sí están entrando. Si están,
   el problema es solo de aviso y no es urgente.
2. **Revisar la carpeta de spam** del buzón institucional. Es la causa más común.
3. **¿Cuántos correos salieron hoy?** El plan gratuito de Resend tiene un tope de **100 al día** y
   3.000 al mes ✅. En campaña navideña se puede tocar. Entrar a la cuenta de Resend y ver el
   contador del día. Si es eso: se resuelve solo mañana, y la difusión masiva no debe salir del
   sitio sino exportando a CSV y enviando desde el buzón institucional.
4. **Revisar el panel de Resend** por correos marcados como rebotados o fallidos, y por avisos sobre
   la verificación del dominio de envío. El sitio envía desde el subdominio
   `notificaciones.refuva.org` ✅; si esa verificación se cayó, deja de salir todo.
5. **Revisar que las automatizaciones estén corriendo** (§2.4). El panel muestra la fecha de última
   ejecución de cada tarea programada (RF-15). Si la última es de hace días, ese es el problema.
6. **Avisar al contacto del equipo** (§7).

Mientras se arregla: la bandeja del panel funciona perfectamente como fuente de trabajo. Las
solicitudes de cita se ordenan por antigüedad y la más vieja aparece destacada (RF-12), así que se
puede atender sin depender del correo.

## 5.10 Revisar que nadie lleve días esperando

No es una emergencia, es la rutina que sostiene el punto 2 de por qué existe el portal.

1. Entrar al panel. El contador de pendientes está visible al entrar (RF-12).
2. **Solicitudes** → pestaña **Citas psicológicas**. Vienen ordenadas por antigüedad, con la más vieja
   destacada.
3. Atender de arriba hacia abajo y cambiar el estado: `pendiente` → `en gestión` → `atendida`.
4. Dejar una nota interna corta en cada una: qué se hizo y cuándo.

El sistema envía un aviso semanal si algo lleva más de 7 días sin atender (RF-15), pero el aviso es
la red de seguridad, no el proceso.

## 5.11 Cómo verificar que el respaldo existe y sirve

Esto hay que hacerlo, porque **el plan gratuito de Supabase no incluye ningún respaldo automático** ✅.
El respaldo semanal del proyecto es una tarea programada nuestra (RF-15), no un servicio del
proveedor. Y un respaldo que nadie ha probado a restaurar no es un respaldo: es una carpeta.

**Cada mes, Edwin (5 minutos):**

1. Entrar al panel → **Tareas programadas** (`/panel/tareas`).
2. Buscar **Respaldo de la base de datos** y mirar la **fecha de última ejecución correcta**.
3. Si tiene más de 8 días, algo se rompió: avisar al contacto del equipo (§7).
4. Abrir el destino del respaldo y confirmar que **el archivo más reciente existe y no pesa cero**.
5. Descargar además el volcado desde el panel de Supabase, que son dos clics, y guardarlo en la
   carpeta **Respaldos** del Drive de la fundación con el nombre `refuva-AAAA-MM-DD.sql`.
6. Borrar los que tengan más de un año.

**Cada año, el equipo técnico o quien lo sustituya (1 hora):** hacer la prueba de verdad. Tomar el
último respaldo, levantarlo en un proyecto local (`npx supabase db reset` sobre el volcado) y
comprobar tres cosas: que las noticias publicadas están, que las solicitudes están, y que la cantidad
de filas de cada tabla se parece a la del sitio en vivo. Si no se puede restaurar, no hay respaldo, y
hay que arreglarlo ese día.

**Además del volcado de la base:** el contenido del panel —noticias y eventos— se exporta a JSON
versionado en el repositorio ✅. Eso hace que el contenido sobreviva incluso a la pérdida total del
proveedor de base de datos. Es la copia que salva el trabajo de años de Edwin.

## 5.12 Borrar los datos de una persona que lo pide

Alguien escribe y dice «quiero que borren mis datos». Es un derecho suyo y se ejecuta: no se discute,
no se pide explicación y no se demora (RNF-16). **Responsable: Edwin Quintero**, con la segunda
persona administradora como suplente. **Umbral: se completa en menos de 10 minutos, sin llamar a
nadie del equipo de desarrollo.** Un derecho que solo sabe ejecutar quien ya se fue no existe.

**Paso 1 — encontrar el registro.** Menú lateral → **Solicitudes**, y abrir la bandeja de lo que esa
persona llenó. Si no dice cuál, se buscan por su correo o su teléfono en las seis:

| Lo que la persona envió | Dónde se busca |
|---|---|
| Solicitud de cita psicológica | **Solicitudes → Citas psicológicas** |
| Inscripción de voluntariado | **Solicitudes → Voluntarios** |
| Inscripción de padrino o madrina | **Solicitudes → Padrinos y madrinas** |
| Postulación de comunidad | **Solicitudes → Comunidades** |
| Solicitud de alianza | **Solicitudes → Alianzas** |
| Mensaje de contacto | **Solicitudes → Contacto** |

Una misma persona puede estar en más de una bandeja —se apuntó de voluntaria y además escribió por
contacto—. **Se revisan todas antes de contestarle**, porque decirle «ya está borrado» y que un mes
después le llegue un correo del sitio es peor que no haberle contestado.

**Paso 2 — confirmar que quien pide es quien dice ser.** No se borra a ciegas: borrar la fila
equivocada destruye la solicitud de otra persona, y no hay deshacer.

- Si la petición llega **desde el mismo correo o el mismo número** que figura en el registro, con eso
  basta. Es el caso normal.
- Si llega desde otro lado, **no se pide cédula, ni foto, ni ningún documento**: eso sería recoger
  más datos de los que se van a borrar, justo al revés de la minimización (RNF-09). Se responde **al
  contacto que sí está en el registro** pidiendo que confirme desde ahí. Si de ese contacto no
  contesta nadie, no se borra y se explica por qué.
- Si no aparece en ninguna bandeja, se le contesta eso mismo: que no hay nada suyo guardado. Puede
  ser que ya venció el plazo de retención y se borró solo ([`07-modelo-datos.md`](./07-modelo-datos.md) §5.1).

**Paso 3 — borrar.** Abrir el registro y usar el botón rojo **Borrar definitivamente**, escribir la
palabra que pide la confirmación y aceptar. Se borra la fila entera y con ella sus notas internas.
Es un borrado de verdad, no una marca de «oculto»: la fila deja de existir.

> 🟡 Esto amplía el módulo 3.2.4 del SRS, que hoy solo contempla ver, filtrar y cambiar el estado. El
> botón hay que construirlo: sin él, este procedimiento no se puede completar en diez minutos y
> RNF-16 no se cumple. **Lo debe Rafael Gómez, antes de la entrega.**

**Paso 4 — qué queda y qué no.** En la bitácora queda constancia de **que se borró**: la fecha, qué
administrador lo hizo, de qué bandeja y el identificador interno de la fila. **No queda su nombre, ni
su correo, ni su teléfono, ni una línea de lo que escribió.** La bitácora sirve para demostrar que el
borrado ocurrió, no para reconstruir a quién se le borró.

**Paso 5 — los respaldos, dicho con honestidad.** La fila sigue existiendo en los volcados hechos
antes de hoy, y desaparece del todo cuando esos respaldos caducan: **90 días como máximo**
([`07-modelo-datos.md`](./07-modelo-datos.md) §8). Los respaldos **no se editan a mano** para sacar
una fila; eso rompe el respaldo y no se puede comprobar. Se dice el plazo y se cumple.

**Paso 6 — responder.** El mismo día o el siguiente, desde el buzón institucional, en dos líneas y
sin lenguaje legal:

> «Confirmamos que ya borramos de nuestros sistemas lo que nos envió el [fecha] por el formulario de
> [lo que llenó]. No conservamos su nombre ni su contacto. Solo queda un registro interno de que el
> borrado se hizo, sin sus datos. Las copias de seguridad se renuevan y esa información desaparece
> por completo en un plazo máximo de 90 días.»

**Paso 7 — si lo que pide borrar es una foto.** Si la petición es sobre una imagen de la galería de
evidencia —suya o de un menor a su cargo—, no está en ninguna bandeja: se quita desde **Proyectos** →
el proyecto correspondiente → su galería. Al quitarla se borra la fila y el archivo del
almacenamiento, y se retira también el consentimiento firmado que la respaldaba. **Una imagen cuyo
consentimiento se revoca sale del sitio el mismo día**, sin esperar a nada.

---

# 6. Plan de capacitación

Responde a R-04 y a C-10. Es la última fase de la secuencia que Jeremy fijó en la reunión:
documentación → presupuesto → prototipado → validación → desarrollo → **capacitación** (C-09).

## 6.1 Quién asiste

| Persona | Rol | Asistencia |
|---|---|---|
| **Edwin Quintero** | Administrador principal | Todas las sesiones. No delegable. |
| **Segunda persona administradora** | Administradora de respaldo | Todas las sesiones. 🔴 **Quién es: pendiente. Lo debe Edwin.** Es la pregunta abierta número 3 de [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md). |
| **Jeremy Martínez** | Conduce las sesiones | Todas |
| **Rafael Gómez** | Traspaso técnico y de cuentas | Sesiones 1 y 3 |
| **Octavio Frauca** | Canal de contacto y frente de redes (C-01, C-12) | Sesión 3 |
| **Juan Zhu** | Graba y edita el video | Todas |

*El reparto entre el equipo es una propuesta nuestra, a confirmar en la reunión de arranque de la
fase.*

**Sin la segunda persona presente, la capacitación no se da por completa.** No es una formalidad:
Edwin lo aceptó en la reunión ✅ y sin ella el procedimiento de §4.3 no existe. Si el día de la
sesión no aparece nadie, se dicta igual con Edwin y se agenda una sesión de recuperación solo para
la segunda persona, y eso queda anotado como riesgo abierto en la lista de §10.

## 6.2 Las cuatro sesiones

Cuatro sesiones de una hora, en semanas distintas. No una sola de cuatro horas: nadie retiene cuatro
horas de panel seguidas, y la separación permite que entre una sesión y la siguiente Edwin practique
solo, que es donde de verdad se aprende. Las fechas concretas se fijan en
[`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md).

### Sesión 1 — Publicar y ocultar (60 min)

Es la sesión que responde a R-02 con las palabras exactas de Edwin: agregar una noticia, ocultar un
evento que ya pasó.

- Entrar al panel: correo, contraseña, segundo factor. Se hace tres veces hasta que sale solo.
- Publicar una noticia de principio a fin (§5.1), incluido el texto alternativo de la imagen y por
  qué es obligatorio.
- Guardar un borrador y publicarlo al día siguiente.
- Ocultar un evento y volver a publicarlo. La diferencia entre **dejar de mostrar** y **borrar** (§5.2).
- La guía de mensajes seguros sobre suicidio, con ejemplos de frases correctas e incorrectas.
- **Tarea entre sesiones:** que Edwin publique una noticia real, solo, sin nosotros conectados.

### Sesión 2 — Las solicitudes y las convocatorias (60 min)

- La bandeja: filtros, estados, notas internas (§5.10).
- Por qué las citas psicológicas se ordenan por antigüedad y qué significa la que está destacada.
- Abrir y cerrar una convocatoria (§5.3), con la navideña como ejemplo real.
- Exportar padrinos a CSV, abrirlo en Excel, y las dos reglas de custodia de §5.5.
- Editar los datos de donaciones y la verificación de B/.1.00 (§5.4).
- **Borrar los datos de una persona que lo pide** (§5.12), ensayado de verdad sobre un registro de
  prueba y **cronometrado**: buscarlo en la bandeja, confirmar la identidad de quien lo pide,
  borrarlo, ver qué quedó en la bitácora y escribir la respuesta. Si pasa de diez minutos, el
  defecto es del panel o del manual, no de Edwin, y se corrige antes de la entrega (RNF-16).

### Sesión 3 — Las cuentas, las contraseñas y el traspaso (60 min)

La sesión menos vistosa y la más importante para que esto siga vivo en dos años.

- Recorrer la tabla de §2.2 **entrando a cada cuenta en vivo**, confirmando que el titular es la
  fundación y que el correo de contacto es `sistemas@refuva.org`.
- Montar la bóveda de contraseñas y meter las credenciales, con Edwin escribiendo, no nosotros.
- Activar el segundo factor donde falte e **imprimir los códigos de respaldo en la sesión** (§4.2).
  Se sale de esta sesión con papeles en la mano o no se sale.
- Invitar a la segunda persona como administradora y verla entrar (§5.6).
- **Ensayar §4.3 de mentira:** apagar el teléfono de Edwin, que use un código impreso, y que la
  segunda persona lo reinvite. Un procedimiento que nunca se ensayó no sirve.
- Explicar el calendario de renovaciones y crear los dos avisos de §3.3 delante de él.

### Sesión 4 — Qué hacer cuando algo se rompe (60 min)

- Recorrer §5.7, §5.8, §5.9 y §5.11 **provocando los fallos de mentira** en un entorno de prueba:
  pausar el proyecto de Supabase y que Edwin lo reactive solo; apagar los correos y que él confirme
  en la bandeja que las solicitudes siguen entrando.
- A quién llamar, en qué orden y con qué información (§7).
- De dónde llega el aviso de que el sitio se cayó, cómo se ve ese correo y qué se hace al recibirlo
  (§7.3).
- Repaso libre: lo que Edwin pregunte, con el manual abierto para que aprenda a buscar en él.

## 6.3 La prueba piloto (C-08)

Es el criterio de aceptación AC-04 y no se negocia. **Antes de la entrega final, Edwin agrega y quita
una noticia él mismo.**

Cómo se hace:

1. Se agenda una sesión aparte, después de la sesión 2.
2. **Compartimos pantalla pero no hablamos.** Edwin conduce.
3. Se le da una consigna concreta: «publique una noticia sobre la jornada de alimentación del mes
   pasado, con una foto, y después ocúltela».
4. Se cronometra y se anota **cada punto donde duda o se detiene**. Esos puntos no son culpa de Edwin:
   son defectos del panel o del manual, y se corrigen antes de la entrega.
5. La prueba se aprueba solo si Edwin la completa **sin que nadie le diga dónde hacer clic**. Si
   necesitó ayuda, se arregla lo que la causó y se repite.

Un panel que solo funciona cuando estamos nosotros al lado no está terminado.

## 6.4 Entregables

| Entregable | Qué es | Responsable |
|---|---|---|
| **Manual de operación en español, con capturas** | Los doce procedimientos de §5, uno por página, con la captura real de cada pantalla del panel y flechas donde hay que hacer clic. En PDF, en el Drive de la fundación **y impreso**. | Rafael Gómez |
| **Video de la capacitación** | Las cuatro sesiones grabadas y separadas por tema, cada una con su título. Además, un video corto de 10 minutos con lo esencial: entrar, publicar una noticia, ocultar un evento. En el Drive de la fundación, no en un canal de YouTube de un estudiante. | Juan Zhu |
| **Ficha de una página** | Una hoja imprimible que se pega en la pared: las direcciones del sitio y del panel, la fecha de renovación del dominio, los tres pasos de «el sitio no carga» y a quién escribir. | Jeremy Martínez |
| **Este documento** | Actualizado con las cuentas reales, los titulares reales y la fecha real de renovación del dominio, sin ningún 🔴 pendiente que dependa del equipo. | Rafael Gómez |

El manual se escribe **con capturas del panel real**, no del prototipo. Un manual con pantallas que
ya no existen es peor que no tener manual, porque hace dudar de todo lo demás.

---

# 7. Qué pasa cuando algo se rompe y no estamos

## 7.1 A quién acudir, en este orden

| Orden | A quién | Para qué | Cuándo |
|---|---|---|---|
| 1 | **Este documento, §5** | Casi todo lo que se rompe está aquí y lo resuelve Edwin solo en minutos. | Siempre primero |
| 2 | **La segunda persona administradora** | Un segundo par de ojos y las manos que hacen falta si el problema es de acceso (§4.3). | Antes de escribir afuera |
| 3 | **Octavio Frauca**, canal de contacto del equipo (C-12) | Lo que el runbook no cubre. Es el único canal; no se escribe a cuatro personas a la vez. | 🔴 **Hasta qué fecha se sostiene este canal: pendiente. Lo debe el equipo, y hay que decírselo a Edwin con una fecha concreta, no con un «cuando puedas».** |
| 4 | **Un desarrollador nuevo** | Cambios reales al código, o problemas que sobreviven al periodo de acompañamiento. | Con la información de §7.2 y el paquete de §8 |
| 5 | **El soporte del proveedor** | Solo cuando el problema es claramente de ellos: el registrador para el dominio, el banco para Yappy. | Con el correo institucional, nunca con uno personal |

**Sinceridad sobre el paso 3:** un canal de contacto sin fecha de caducidad escrita es un canal que
se apaga sin avisar y deja a Edwin creyendo que todavía existe. Es preferible decirle «te acompañamos
hasta tal fecha, y después esto es tuyo» que dejarlo abierto y desaparecer. Poner esa fecha es parte
de la entrega.

## 7.2 Qué información hay que dar

Un desarrollador que no conoce el proyecto puede ayudar en una tarde **si recibe esto**. Sin esto,
empieza preguntando y se pierde una semana.

**Lo que se manda al pedir ayuda, siempre:**

1. **Qué se estaba haciendo**, en una frase. «Estaba publicando una noticia y al darle Publicar salió
   un error.»
2. **La dirección exacta** donde pasó (`refuva.org/panel/contenido/nuevo`).
3. **Una captura de pantalla completa**, con la barra de dirección visible.
4. **El texto exacto del error**, copiado. No «salió un error»: el texto.
5. **Fecha y hora aproximada**, y desde qué dispositivo y navegador.
6. **Si pasa siempre o pasó una vez**, y si le pasa también a la segunda persona.
7. **Qué se intentó ya** de §5.

**Lo que se le entrega a un desarrollador nuevo para que pueda trabajar:**

- El enlace al repositorio y acceso de lectura a la organización de GitHub de la fundación.
- Este documento y [`README.md`](./README.md).
- **Nunca las contraseñas por adelantado.** Primero se define qué va a hacer, después se le da el
  acceso mínimo que necesita, y cuando termina se le quita (§4.4).

## 7.3 Monitoreo: quién se entera de que el sitio se cayó 🔴

Hoy, nadie. El primero en enterarse de una caída es la persona que entró a pedir una cita y no pudo
enviarla, que es exactamente a quien no se le puede pedir que avise. RNF-38 fija el umbral —99 %
mensual, comprobación externa cada 5 minutos— y remite a este documento por el responsable y el
canal. Aquí están, con lo que ya está decidido separado de lo que todavía no.

**Lo que ya está decidido:**

- **Qué se vigila:** dos direcciones, no el sitio entero. El **Inicio** (`refuva.org`) y la **página
  de citas** (`refuva.org/agendar-cita`). Si esas dos responden, lo que importa está en pie; la de
  citas está en la lista porque es la que no puede fallar en silencio.
- **Cada cuánto:** una comprobación **cada 5 minutos**, hecha desde fuera del hosting (RNF-38).
- **A qué canal llega el aviso:** al buzón compartido **`sistemas@refuva.org`**, que leen los dos
  administradores, y mientras siga abierto también al canal de contacto del equipo (§7.1). **Nunca al
  correo personal de un estudiante:** un aviso que llega a alguien que ya se fue no es un aviso
  (X-01).
- **Qué tiene que decir el aviso:** qué dirección no responde y desde cuándo. Con eso, quien lo
  reciba empieza por §5.8.
- **Quién atiende el aviso después de la entrega: Edwin Quintero**, con §5.8 en la mano, y la segunda
  persona administradora como suplente.

**Lo que falta, y no se inventa aquí:**

- **Con qué herramienta. 🔴 Pendiente.** No hay ningún servicio de monitoreo verificado en
  [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md), así
  que no se escribe aquí un nombre ni un precio que no podamos sostener. Requisitos duros para
  elegirla: comprobación cada 5 minutos en su plan gratuito, aviso por correo a una dirección que no
  sea de una persona, cuenta a nombre de la fundación (§2.2) y que **no viva en el repositorio ni
  dependa de él** (RNF-45).
- **Quién decide: Rafael Gómez, antes de la entrega.** Deja la herramienta elegida, configurada
  sobre esas dos direcciones, **probada provocando una caída y viendo llegar el correo**, y anotada
  en el inventario de §2.2. Se enseña en la sesión 4 de capacitación, junto con los demás fallos
  ensayados.

Mientras esta sección tenga un 🔴, el aviso de caída es que alguien abra el sitio y mire. Es mejor
decirlo que dejar creer que hay una alarma que nadie configuró.

---

# 8. Cómo entra un equipo nuevo

Si dentro de dos años otro grupo de servicio social retoma el proyecto, esto es lo que hace en su
primer día. La ruta está pensada para que en tres horas sepan lo que a nosotros nos costó semanas.

## 8.1 Qué leer, en este orden

| # | Documento | Por qué está en esta posición |
|---|---|---|
| 1 | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) | Lo que dijo Edwin, destilado. Es la fuente de verdad. Cinco minutos y ya se sabe de qué va la fundación. |
| 2 | [`../CLAUDE.md`](../CLAUDE.md) | Las decisiones ya tomadas y las reglas que no se negocian: dónde va n8n y dónde no, cómo se habla de suicidio, qué se hace con los datos. Contradecirlas por desconocimiento es el error caro. |
| 3 | [`01-srs.md`](./01-srs.md) | Qué hace el sistema. RF-01 a RF-15 y qué está deliberadamente fuera del alcance. |
| 4 | **Este documento** | Qué cuentas existen, quién las tiene y qué se rompe con qué frecuencia. |
| 5 | [`07-modelo-datos.md`](./07-modelo-datos.md) | El esquema, las políticas RLS y la retención. Antes de tocar una tabla. |
| 6 | [`03-arquitectura-informacion.md`](./03-arquitectura-informacion.md) y [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md) | El mapa del sitio y los requisitos de accesibilidad, privacidad y rendimiento. |
| 7 | [`adr/`](./adr/) | Por qué se descartó cada alternativa. Se lee **antes** de proponer cambiar algo, no después. |

Lo que **no** hay que leer entero: [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md).
Son 240 KB de evidencia con fuentes. Se busca dentro cuando hace falta un precio o un límite; no se
lee de corrido.

## 8.2 Levantar el proyecto en local

Necesitan Node y **Docker corriendo** antes de empezar; sin Docker, `supabase start` falla.

```bash
git clone <repositorio de la organización de la fundación>
cd refuva-portal
npm install

cp .env.example .env.local   # pedir los valores a quien custodie la bóveda del equipo

npx supabase start           # PostgreSQL + Auth + Storage locales (requiere Docker)
npx supabase db reset        # aplica supabase/migrations/ y las semillas

npm run dev                  # http://localhost:3000
```

Antes de dar cualquier cosa por terminada:

```bash
npm run build                # sin errores y sin advertencias de tipos
```

**Reglas que no se descubren solas y por eso van aquí:**

- **Nunca se apunta el entorno local a la base de datos de producción.** Se trabaja contra la local y
  se prueba con las semillas. Las solicitudes de producción son de gente pidiendo ayuda psicológica.
- **Las migraciones van hacia adelante y no se editan después de aplicarse.** Si algo salió mal, se
  escribe una migración nueva que lo corrija.
- **Toda tabla nueva nace con RLS habilitado**, y su política se prueba con un usuario que **no**
  debería ver el dato. Una tabla sin RLS en Supabase es legible desde cualquier navegador con la
  clave pública.
- **`SUPABASE_SERVICE_ROLE_KEY` nunca en el cliente.** Solo en Route Handlers y Server Actions.
- **Si tocan contenido de salud mental**, [`../CLAUDE.md`](../CLAUDE.md) §5.1 aplica palabra por
  palabra.

## 8.3 La pregunta que hay que hacerse antes de cerrar cualquier tarea

**¿Se puede editar desde el panel, o acabas de crear algo que solo tú sabes cambiar?**

Es la pregunta que gobierna todo este proyecto. Si la respuesta es la segunda, el trabajo no está
terminado por bien que funcione.

---

# 9. Las dos preguntas de Edwin que no son de software

Edwin las hizo en la reunión, son legítimas, y no responderlas porque «no son de programación» sería
quedarnos con la parte fácil. Las dos tienen respuesta y las dos ahorran dinero o trabajo real.

## 9.1 R-06 — Cómo dejar de pagar OneDrive de su bolsillo

**La situación.** Edwin paga almacenamiento en OneDrive con su dinero para no perder la evidencia
fotográfica y documental de las actividades ✅. Esa evidencia no es un archivo sentimental: es lo que
la fundación enseña cuando busca patrocinio institucional (O-07). Y hay un detalle que él contó y que
importa: parte del gasto fue para que **no se le saturara el correo y dejara de llegarle la solicitud
de ayuda de alguien** ✅. Está pagando por no perder mensajes de gente que lo necesita.

**La respuesta corta: no tiene que seguir pagando, y la alternativa no es un plan más barato, es una
gratuita y mejor.**

**Google Workspace for Nonprofits** es gratuito para organizaciones sin fines de lucro elegibles, con
límite de hasta 2.000 usuarios ✅, e incluye **100 TB de almacenamiento compartido** ✅ y correo con
dominio propio. **Panamá aparece explícitamente en la lista oficial de países elegibles de Google** ✅,
y entre las figuras nombradas están las fundaciones de interés privado y las asociaciones sin fines
de lucro ✅. Cien terabytes contra los pocos cientos de gigas que Edwin está pagando, por B/.0.00.

Resuelve tres cosas de una vez: el OneDrive de pago, el Gmail personal que a Edwin le parece poco
formal frente a otras fundaciones (R-07), y el buzón que se llenaba.

**Cómo se hace, en orden:**

1. **Reunir los documentos.** Certificado de personería jurídica del Registro Público, resolución de
   reconocimiento como entidad sin fines de lucro, estatutos y un estado de cuenta bancario a nombre
   de la fundación, todos en PDF original y legible ✅. 🔴 **Pendiente: confirmar que REFUVA los tiene
   (O-09, O-10). Lo debe Edwin, y bloquea también Yappy Comercial.**
2. **Confirmar con el asesor legal de la fundación bajo qué figura exacta está registrada REFUVA**, y
   declararla **escrita igual** que en el documento. El motivo de rechazo más común es que el nombre
   o la figura no coinciden letra por letra ✅.
3. **Registrar el dominio** (§2.1). Sin dominio propio no hay solicitud posible ✅.
4. **Solicitar la verificación** desde `google.com/nonprofits`. El validador es **Goodstack** ✅.
5. **Esperar de 3 a 5 días hábiles** ✅ y **revisar la carpeta de spam**: los correos llegan desde
   `verifications@mail.goodstack.org` ✅.
6. **Al aprobarse, crear los buzones** (`edwin@`, `info@`, `citas@`, `donaciones@`, `sistemas@`) y
   cambiar los registros MX del dominio a Google Workspace.
7. **Migrar los archivos de OneDrive al Drive de la fundación**, en carpetas por proyecto y por año.
8. **Dejar la suscripción de OneDrive activa un mes más**, verificar que en el Drive está todo, y
   **recién entonces cancelarla.** Cancelar antes de verificar es cómo se pierde la evidencia.

**Dos avisos honestos.** El primero: la misma verificación con Goodstack abre también **Canva for
Nonprofits**, que es gratuito ✅ y responde directamente a la petición de Edwin de ayuda con el diseño
de publicaciones y reels (R-05). Se solicita en el mismo trámite, así que no hacerlo sería
desperdiciarlo. El segundo: **si REFUVA no tiene la personería jurídica en regla, nada de esto
procede** —ni Workspace, ni Canva, ni Yappy Comercial—. Es la conversación que hay que tener con
Edwin antes que ninguna otra.

## 9.2 R-08 — Publicar en todas las redes a la vez, y qué es pagar por promocionar

Edwin preguntó dos cosas en la misma frase y en la reunión se respondieron mezcladas. Son distintas y
la diferencia es dinero.

### Publicar ≠ promocionar

| | **Publicar** | **Promocionar** |
|---|---|---|
| Qué es | Que un mismo contenido aparezca en varias redes a la vez | Pagar para que ese contenido lo vea gente que no te sigue |
| Cuánto cuesta | **B/.0.00** | Se paga por presupuesto diario y por los días que dure |
| Qué se necesita | Una herramienta que conecte las cuentas y programe la publicación | Una cuenta de anuncios y un método de pago |
| Qué se consigue | Ahorrar tiempo. Publicar una vez en lugar de tres | Alcance. Nada más |
| Cuándo tiene sentido | **Siempre** | Solo alrededor de un evento con fecha, y con un objetivo concreto |

Lo que se dijo en la reunión sobre que hay que pagar por día para llegar a más gente **es correcto,
pero solo describe la segunda columna** ✅. La primera es gratis y es la que Edwin usa todas las
semanas.

### Publicar en varias redes a la vez

Se hace con un **programador de contenido**: una herramienta donde se conectan las cuentas de la
fundación, se escribe la publicación una vez, se suben las imágenes, se eligen las redes y se
programa la fecha y la hora. La herramienta publica sola.

Lo que eso le da a Edwin, que opera la fundación solo (O-02, O-03): **sentarse una vez al mes** a
dejar programadas las publicaciones del mes, en lugar de acordarse cada día de publicar en tres
lugares. Es la diferencia entre una cuenta viva y una cuenta que se apaga cuando hay mucho trabajo.

- **Herramienta concreta recomendada: 🟡 Inferido / 🔴 Pendiente de verificar.** Para Instagram y
  Facebook lo natural es el programador gratuito de la propia Meta, y hay varias herramientas con
  plan gratuito que además cubren TikTok. **Ninguna está verificada en
  [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md)**, así
  que aquí no se pone un nombre ni un límite que no podamos sostener. **Lo debe el frente de
  marketing (Octavio, C-01): comparar dos o tres opciones gratuitas, verificar qué redes cubre cada
  una en su plan gratuito y cuántas publicaciones al mes permite, y dejar la elegida configurada y
  enseñada antes de la entrega.**
- Lo que **sí** está verificado y hay que decirle a Edwin desde ya: **las herramientas de recaudación
  de Facebook e Instagram solo funcionan para organizaciones con sede en Australia, Canadá, Reino
  Unido y Estados Unidos** ✅. REFUVA **no** va a tener botón de donar dentro de Instagram. Todo el
  tráfico de redes tiene que ir a la página de donaciones del portal. Es una razón más para que esa
  página exista y cargue rápido en un teléfono modesto.

### Promocionar pagando

Tres cosas que Edwin debe saber antes de gastar el primer balboa:

1. **Se paga por presupuesto diario, no por resultado.** Se fija cuánto se está dispuesto a gastar
   por día y cuántos días dura. El dinero se gasta aunque nadie haga clic. 🔴 **Montos mínimos y
   costos por día en Panamá: pendiente. Lo debe el frente de marketing (Octavio).**
2. **Promocionar sirve para eventos con fecha, no como rutina.** La campaña del 10 de septiembre y la
   convocatoria navideña son los dos casos donde tiene sentido. Promocionar «la fundación» en general
   y todo el año es la forma más común de quemar presupuesto sin resultado.
3. **Hay una alternativa gratuita mucho más grande que cualquier promoción que REFUVA pueda pagar:**
   **Google Ad Grants** da hasta **USD 10.000 al mes** en anuncios de búsqueda donados a
   organizaciones sin fines de lucro elegibles ✅. Es el mismo trámite de Goodstack de §9.1. Para
   alguien que busca «ayuda psicológica Panamá» eso vale más que cualquier publicación promocionada.

**Y la advertencia que hay que dar con la misma claridad:** Ad Grants **no es dinero regalado, es un
compromiso operativo permanente** ✅. Exige mantener un 5% de clics mensual o la cuenta se desactiva a
los dos meses de incumplimiento; prohíbe palabras clave de una sola palabra y las genéricas; obliga a
tener seguimiento de conversiones; exige al menos dos grupos de anuncios y dos enlaces de sitio por
campaña, segmentación geográfica concreta y una encuesta anual ✅. Son **al menos dos horas al mes de
alguien que sepa lo que hace**, para siempre.

**Nuestra recomendación, con el criterio de X-01 por delante:** solicitar Ad Grants **solo si aparece
esa persona**. Si hoy no hay ni quien lleve las redes (O-03), pedirlo y perderlo a los dos meses es
peor que no pedirlo: quema la solicitud y desmoraliza. Se deja documentado, se hace la solicitud
cuando exista quien la sostenga, y mientras tanto la energía va a la primera columna de la tabla, que
es gratis y no exige mantenimiento.

---

# 10. Lista de verificación de traspaso

Nada de esto es opcional. **Mientras haya una casilla sin marcar, el equipo no se retira.** Marca los
criterios AC-09, AC-10 y AC-11 de [`01-srs.md`](./01-srs.md) §7.

## Cuentas y propiedad

- [ ] El dominio `refuva.org` está registrado **a nombre de la Fundación REFUVA**.
- [ ] Ninguna cuenta del inventario de §2.2 está a nombre de un estudiante ni usa su correo. **Se
      verificó entrando a cada una, una por una.** (AC-10)
- [ ] El correo de contacto de todas las cuentas es `sistemas@refuva.org`, y ese buzón lo pueden abrir
      los dos administradores.
- [ ] El repositorio vive en una organización de GitHub **propiedad de la fundación**, no en una
      cuenta personal.
- [ ] Google Workspace for Nonprofits está aprobado y los buzones creados.
- [ ] La suscripción de OneDrive de Edwin está cancelada **y los archivos verificados en el Drive de
      la fundación**.
- [ ] Está escrito **dónde corre n8n, a nombre de quién y quién lo paga** (§2.4), o sus funciones se
      reimplementaron sin él.

## Accesos y seguridad

- [ ] Hay **dos administradores activos** en el panel, ambos con segundo factor. (AC-09, C-10)
- [ ] Existe la bóveda de contraseñas, con la herramienta ya decidida, y las dos personas dentro.
- [ ] Los **códigos de respaldo están impresos**, en dos copias, en los dos lugares de §4.2.
- [ ] El procedimiento de teléfono perdido (§4.3) **se ensayó de verdad** en la sesión 3, no solo se
      leyó.
- [ ] El equipo de desarrollo **ya no tiene acceso** a producción: ni al panel, ni a Supabase, ni al
      hosting, ni a la bóveda de la fundación.
- [ ] Ninguna tabla con datos de personas está sin RLS. (AC-06)
- [ ] El **inventario de secretos de §2.5 está completo** y se leyó fila por fila: **ninguna tiene
      fecha de vencimiento manual**, incluida la credencial del repositorio de respaldos. (RNF-44)

## Renovaciones

- [ ] La **renovación automática del dominio está activada** y verificada en pantalla.
- [ ] El dominio está pagado **al menos a 3 años**.
- [ ] La tarjeta asociada es **de la fundación** y su fecha de vencimiento está anotada.
- [ ] Existen los **dos avisos de calendario** (60 y 15 días), con los dos administradores invitados.
- [ ] La fecha exacta de renovación está escrita en §3.1 de este documento, sin 🔴.
- [ ] La **revalidación semestral de los números de crisis** (§3.6) está agendada cada 6 meses, con
      la primera llamada hecha y **la fecha de verificación anotada en el panel**. (RF-11, RNF-06)

## Operación

- [ ] Las tareas programadas corren y **muestran su última ejecución en el panel**. (AC-12)
- [ ] El **respaldo semanal existe**, y se restauró una vez con éxito para comprobar que sirve (§5.11).
- [ ] El contenido del panel se exporta a JSON versionado en el repositorio.
- [ ] Se **probó cortar la automatización** y la solicitud se guardó igual. (AC-03)
- [ ] El **monitoreo está elegido y configurado** sobre el Inicio y la página de citas, y su aviso
      llegó a `sistemas@refuva.org` en una caída provocada a propósito. (RNF-38, §7.3)
- [ ] El procedimiento de **borrado a petición** (§5.12) **se ensayó sobre un registro de prueba** y
      Edwin lo completó solo en **menos de 10 minutos**. (RNF-16)
- [ ] El bloque de crisis está publicado con los datos verificados: **911** y **Línea 147 del MIDES**,
      WhatsApp **6694-2747**. (AC-05)

## Capacitación

- [ ] Las cuatro sesiones se dieron, **con la segunda persona presente**.
- [ ] **Edwin publicó y ocultó una noticia él solo, sin ayuda.** (AC-04, C-08)
- [ ] El manual en español con capturas del panel real está en el Drive **y también impreso**. (AC-11)
- [ ] Los videos están en el Drive de la fundación, no en una cuenta personal. (AC-11)
- [ ] La ficha de una página está impresa y pegada donde Edwin trabaja.
- [ ] Edwin sabe **hasta qué fecha** puede escribirle a Octavio, con la fecha dicha en voz alta y
      escrita en §7.1.

---

## Pendientes de este documento

Lo que falta, quién lo debe y qué bloquea. Nada de esto se resuelve solo.

| # | Qué falta | Quién lo debe | Qué bloquea |
|---|---|---|---|
| 1 | Quién es la **segunda persona administradora** | Edwin | C-10, AC-09 y el procedimiento de §4.3 completo |
| 2 | **Dónde corre n8n**, a nombre de quién y quién lo paga | **Rafael Gómez** (dueño único) | X-01. Es el riesgo abierto más serio del traspaso. Arrastra la línea del presupuesto de [`05`](./05-stack-y-presupuesto.md) y el trámite de [`08`](./08-plan-de-trabajo.md) |
| 3 | **Gestor de contraseñas** concreto y límites de su plan gratuito | **Rafael Gómez** | La sesión 3 de capacitación |
| 4 | **Documentos de personería jurídica** (O-09, O-10) | Edwin, con su asesor legal | Google Workspace, Canva, Ad Grants y Yappy Comercial |
| 5 | **Cuenta comercial en Banco General** a nombre de la fundación | Edwin | Yappy Comercial. Es el camino crítico de las donaciones |
| 6 | **Fecha de registro y de renovación** del dominio | Equipo técnico | §3.1 y los avisos de calendario |
| 7 | **Programador de contenido** gratuito, verificado y configurado | Frente de marketing (Octavio) | R-08 |
| 8 | **Hasta qué fecha** se sostiene el canal de contacto post-entrega | Todo el equipo | §7.1. Hay que decírselo a Edwin con una fecha |
| 9 | Confirmar si Google for Nonprofits exige **re-verificación periódica** | Equipo técnico, al activar la cuenta | §3.4 |
| 10 | Confirmar que la segunda cuenta puede **restablecer el segundo factor** de Edwin en Workspace | Equipo técnico, en la sesión 3 | §4.3 paso 4 |
| 11 | **Herramienta de monitoreo** del sitio: cuál, configurada y probada | **Rafael Gómez** | RNF-38 y §7.3. Sin ella nadie se entera de una caída |
| 12 | **Credencial de escritura del repositorio de respaldos sin fecha de vencimiento** | **Rafael Gómez** | RNF-44 y §2.5. Es la única fila del inventario de secretos que hoy puede caducar |
| 13 | **Botón de borrado a petición** en la bandeja de solicitudes (amplía el módulo 3.2.4) | **Rafael Gómez** | RNF-16 y §5.12. Sin él, el borrado no se completa en diez minutos |
