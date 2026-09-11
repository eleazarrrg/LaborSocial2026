# Stack y presupuesto — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Responde a** | R-09 — «un presupuesto mensual claro: esto es lo que usted pagaría mensualmente». Edwin lo pidió dos veces. |
| **Evidencia** | [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md) — precios consultados el 6 de septiembre de 2026, con fuente. |
| **Decisiones vinculantes** | [`../CLAUDE.md`](../CLAUDE.md) §3 y §4 |

> **Este documento tiene dos lectores.** La **Parte 1** es para Edwin y está escrita sin jerga: cuánto
> se paga, qué se deja de pagar y qué se puede conseguir gratis. La **Parte 2** es para el equipo de
> desarrollo: qué se eligió, qué se descartó y por qué.
>
> Estados, igual que en [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md):
> ✅ **Confirmado** (verificado en fuente oficial) · 🟡 **Inferido** (se deduce, hay que confirmarlo)
> · 🔴 **Pendiente** (nos falta el dato).
>
> El balboa está a la par con el dólar. Todo precio en USD de una fuente extranjera se escribe aquí
> como `B/.` sin conversión.

---

# PARTE 1 — Para Edwin

## 1. Cuánto va a pagar al mes

**Cero. El único gasto recurrente del portal es el nombre del dominio: alrededor de B/.12.00 al año,
que son menos de B/.1.00 al mes.** Todo lo demás corre en planes gratuitos que no caducan y que no
piden tarjeta. Eso es cierto **con la ruta de automatizaciones que el equipo recomienda** (§7.5);
es la única partida de la tabla que todavía podría sumar algo, y por eso aparece con su costo.

| Concepto | Lo que cuesta | Estado |
|---|---|---|
| Dominio `refuva.org` (el nombre del sitio, se paga una vez al año) | **B/.11.84 al año** | ✅ |
| Alojamiento del sitio | B/.0.00 | ✅ |
| Base de datos, panel administrativo y archivos | B/.0.00 | ✅ |
| Correos automáticos que envía el sitio | B/.0.00 | ✅ |
| Buzón de correo con dominio propio (`edwin@refuva.org`) | B/.0.00 | ✅ |
| Publicaciones de Instagram en la portada | B/.0.00 | ✅ |
| Estadísticas de visitas | B/.0.00 | ✅ |
| Certificado de seguridad (el candado del navegador) | B/.0.00 | ✅ |
| Automatizaciones del sitio (los avisos por correo y las tareas programadas) | B/.0.00 con la ruta recomendada · **B/.60.00–144.00 al año** si se aloja n8n en un servidor aparte | 🟡 |
| **Total del primer año** | **B/.11.84** con la ruta recomendada de automatizaciones | |
| **Total mensual prorrateado** | **menos de B/.1.00** | |

Cuatro cosas que conviene entender de ese número:

- **El dominio se paga por adelantado y por año completo.** No hay factura mensual. La fecha de
  renovación queda anotada en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) con
  responsable con nombre. Si nadie la paga, el sitio desaparece.
- **El dominio debe registrarse a nombre de la fundación**, con la tarjeta o el correo institucional,
  nunca con el correo personal de un estudiante (X-01).
- **Recibir donaciones no tiene costo fijo**, pero sí una comisión por cada donación recibida. Sobre
  una donación de B/.15.00 por Yappy son **B/.0.16**. Por transferencia bancaria (ACH) es **B/.0.00**.
  El detalle está en §9.
- **Las automatizaciones del sitio pueden costar B/.0.00, y esa es la ruta recomendada, pero la
  decisión todavía no está cerrada.** Los avisos por correo y las tareas programadas se pueden hacer
  **dentro del propio sitio**, sin pagar nada ni añadir un servicio más, o con una herramienta aparte
  llamada n8n que necesita un servidor encendido. Hoy ese servidor lo paga un estudiante del equipo,
  no la fundación; si la fundación tuviera que asumirlo son 🟡 B/.5.00–12.00 al mes. Las dos rutas,
  con su costo y la recomendación, están en §7.5. 🔴 Pendiente a cargo de **Rafael Gómez**.

## 2. Lo que hoy paga y puede dejar de pagar

Edwin paga **OneDrive de su bolsillo** para no perder la evidencia fotográfica de las actividades
(R-06), y usa un **Gmail personal** que le parece poco formal frente a otras fundaciones (R-07).
Las dos cosas se resuelven con un mismo trámite, gratuito.

**Google Workspace for Nonprofits.** ✅ Panamá aparece explícitamente en la lista oficial de países
elegibles de Google para organizaciones sin fines de lucro. Cuesta **B/.0.00** y da:

- Correo profesional con el dominio propio: `edwin@refuva.org`, `info@refuva.org`,
  `citas@refuva.org`, `voluntarios@refuva.org`, `donaciones@refuva.org`.
- **100 TB de almacenamiento compartido** entre toda la fundación para Gmail, Drive y Fotos.
  Eso reemplaza al OneDrive de pago, con muchísimo margen.
- Google Meet hasta 150 participantes, Calendar, Docs, Sheets, Drive y Formularios.
- Hasta 2.000 usuarios.

**Qué hay que hacer.** La solicitud se hace en `google.com/nonprofits`. Quien verifica ya no es
TechSoup sino **Goodstack**, el validador oficial de Google. La revisión típica es de **3 a 5 días
hábiles** y **no cuesta nada**. ✅

**Qué documentos pide Goodstack.** Todos en PDF, en su versión original, sin tachaduras ni partes
tapadas: ✅

1. **Certificado de personería jurídica** del Registro Público.
2. **Resolución de reconocimiento** como entidad sin fines de lucro (Ministerio de Gobierno) y, si
   existe, la resolución de exoneración de la DGI.
3. **Estatutos** protocolizados e inscritos.
4. **Un documento bancario** a nombre de la fundación (estado de cuenta o carta del banco). No es
   obligatorio, pero acelera la revisión.
5. El **RUC** o número de registro de la organización.

**La advertencia importante.** Google exige que la organización esté registrada bajo una de cuatro
figuras panameñas concretas: asociación religiosa; asociación de interés público (Decreto Ejecutivo
600 de 2005); asociación de interés privado sin ánimo de lucro (Decreto Ejecutivo 524 de 2005); o
**fundación de interés privado (Ley 25 de 1995)**. Hay que declarar **exactamente** la que figura en
el documento: el motivo de rechazo más común es que el nombre o el identificador legal no coincidan
al pie de la letra. 🔴 **Pendiente: bajo cuál de esas cuatro figuras está registrada REFUVA
(hecho O-10).** Lo debe confirmar Edwin con el asesor legal de la fundación, y bloquea también el
trámite de Yappy Comercial.

**Mientras Goodstack revisa**, el correo con dominio propio puede estrenarse el mismo día con
**Cloudflare Email Routing**, que es gratuito e ilimitado en cantidad de mensajes: `info@refuva.org`
reenvía al Gmail actual sin cambiar nada de la rutina de Edwin. El día que Google apruebe, solo se
cambian dos registros técnicos del dominio. ✅

## 3. Lo que puede conseguir gratis y no sabía

Una sola verificación con Goodstack abre **tres** programas a la vez: Google, Microsoft y Canva. ✅

### 3.1 Google Ad Grants — hasta B/.10,000.00 al mes en anuncios de búsqueda

**Qué es.** Google regala presupuesto de publicidad en su buscador para que, cuando alguien en
Panamá escriba «ayuda psicológica» o «terapia gratis», aparezca REFUVA. No es dinero en efectivo:
es crédito que solo se puede gastar en anuncios de búsqueda de Google.

**Cuánto vale.** Hasta **B/.10,000.00 al mes**, es decir hasta B/.120,000.00 al año en publicidad.
No hay obligación de gastarlo y lo que no se usa no se acumula.

**Lo honesto sobre esta cifra.** 🟡 La cifra de los B/.10,000.00 aparece en la FAQ oficial del
programa, pero **la página de elegibilidad de Panamá lista los programas disponibles sin confirmar
el monto ni la disponibilidad concreta de Ad Grants para el país**. Solo se sabrá con certeza al
entrar a la cuenta de Google para ONG una vez aprobada y ver si la tarjeta de Ad Grants aparece.
No lo presentamos como un hecho: es una posibilidad muy valiosa que hay que verificar.

**Qué hay que hacer para conseguirlo, y la advertencia.** Se solicita desde la cuenta de Google para
ONG, y **solo cuando el portal ya esté publicado**, porque Google exige un sitio de calidad. Pero el
programa **no se mantiene solo**: ✅

- Al menos **5% de clics sobre impresiones (CTR)** cada mes. Dos meses seguidos por debajo y la
  cuenta se desactiva.
- **Seguimiento de conversiones obligatorio**, con al menos una conversión reportada al mes.
- Prohibidas las palabras clave de una sola palabra y las demasiado genéricas.
- Mínimo dos grupos de anuncios y dos enlaces de sitio por campaña.
- Encuesta anual del programa.

Traducido: son **unas dos horas de trabajo al mes, para siempre**. Si nadie en REFUVA puede
sostener eso después de que el equipo se retire, **es mejor no solicitarlo que solicitarlo y
perderlo**. Esta decisión es de Edwin, no del equipo técnico.

### 3.2 Canva for Nonprofits — responde a la petición R-05

**Qué es.** Canva Pro completo, gratis, para diseñar publicaciones y reels. Es exactamente lo que
Edwin pidió en la reunión (R-05) y que quedó fuera del alcance de software.

**Cuánto vale.** Canva Pro cuesta alrededor de **B/.18.00 al mes** por usuario, unos B/.216.00 al
año. Aquí es B/.0.00. ✅

**Qué hay que hacer.** Solicitarlo en `canva.com/canva-for-nonprofits`. Lo verifica el mismo
Goodstack, con decisión en hasta 7 días. Disponible en más de 190 países. 🟡 La cifra de **hasta 50
miembros de equipo** proviene de fuente secundaria; hay que confirmarla al aplicar. No califican
agencias gubernamentales, organizaciones políticas ni escuelas.

### 3.3 Microsoft 365 for Nonprofits — la alternativa, no la primera opción

**Qué es.** Hasta **300 licencias gratuitas** de Microsoft 365 Business Basic: correo con dominio
propio, Teams y las versiones web de Office. ✅ **No incluye** las aplicaciones de escritorio (Word,
Excel, Outlook instalados): Microsoft eliminó ese beneficio el 1 de julio de 2025.

**Cuánto vale.** Además de las licencias, **B/.2,000.00 al año en créditos de Azure**, renovables a
mano cada año. ✅

**Por qué no es la primera opción.** Google Workspace da más almacenamiento (100 TB frente al
estándar de 1 TB por usuario), la fundación ya vive en Gmail y la migración es trivial. Microsoft
queda como plan B si Google rechazara la solicitud.

### 3.4 GitHub for Nonprofits

**Qué es.** GitHub Team gratis: es donde vive el código del portal, con historial y respaldo.
Vale alrededor de **B/.4.00 por persona al mes**. ✅ Se solicita en `nonprofits.github.com`.
Importa sobre todo porque el repositorio debe quedar en una organización **propiedad de la
fundación**, no en la cuenta personal de un estudiante.

### 3.5 Y una mala noticia, dicha de frente

**Las herramientas de recaudación de Facebook e Instagram no están disponibles para fundaciones
panameñas.** ✅ Meta las limita a organizaciones con sede en Australia, Canadá, Reino Unido y
Estados Unidos. No habrá botón «Donar» dentro de Facebook ni sticker de donación en Instagram.
Consecuencia práctica: **todo el tráfico de redes tiene que llegar a la página de donaciones del
portal**. Es una razón más para que esa página exista y esté bien hecha.

## 4. Lo que se dijo en la reunión y hay que corregir

Cuatro cosas quedaron grabadas y no son ciertas. Están corregidas aquí porque, si Edwin decide
basándose en ellas, decide mal.

### «Resend guarda los correos y reemplaza el Gmail»

**No.** Resend es un servicio que **envía** correos automáticos: el «gracias, recibimos tu solicitud»
que sale cuando alguien llena un formulario. **No es un buzón.** No tiene bandeja de entrada, no
tiene carpetas, no se conecta al celular ni a Outlook. ✅

Sí existe una función nueva («Inbound», desde noviembre de 2025) que puede recibir correo, pero se
lo entrega a un programa, no a una persona: no hay pantalla donde leerlo y responderlo como en
Gmail. ✅

**Lo correcto:** el buzón donde Edwin lee y escribe sale de **Google Workspace for Nonprofits**
(§2). Resend solo se ocupa de los avisos automáticos del sitio. Son dos servicios distintos y hacen
falta los dos.

### «Google Analytics tiene un pago mensual»

**No.** ✅ **Google Analytics 4 en su versión estándar es gratuito de forma permanente.** Lo que se
paga es **Google Ads**, que es publicidad y es otra cosa completamente distinta. La versión de pago
de Analytics existe, se llama 360 y cuesta del orden de decenas de miles de dólares al año: REFUVA
no se va a acercar jamás a esos volúmenes.

### «Supabase Pro es casi ilimitado por 25 dólares»

**No.** ✅ El plan de B/.25.00 al mes **tiene cuotas y cobra el excedente**. Y hay algo más
importante que el precio: el plan **gratuito pausa el proyecto tras 7 días sin actividad**. Los
datos no se pierden y el propio Edwin puede reactivarlo desde el panel en dos o tres minutos, pero
mientras está pausado el formulario de citas no funciona. El portal está diseñado para que eso no
pase (§7 y §8), pero es un riesgo real que hay que conocer.

### «Stripe como pasarela de pago»

**No opera en Panamá.** ✅ En toda Latinoamérica, Stripe solo funciona en Brasil y México. La ruta
que circula en internet —abrir una empresa en Estados Unidos— es inviable para REFUVA: no se puede
vincular una cuenta bancaria panameña y añade obligaciones fiscales en otro país. Se descarta y no
se vuelve sobre ello. Lo que sí funciona en Panamá está en §9.

## 5. Lo que pasa si la fundación crece

Los planes gratuitos no son infinitos. Estos son los tres techos que se tocan primero, con el
número real y lo que costaría el escalón siguiente.

| Lo que se llena | Cuándo se llena | Qué pasa | El escalón siguiente |
|---|---|---|---|
| **La base de datos: 500 MB** | Solo guarda texto (solicitudes, noticias, eventos). Con miles de registros el consumo sigue siendo de decenas de MB. Es el techo más lejano. | El sitio deja de aceptar escrituras nuevas. | Supabase Pro: **B/.25.00 al mes**, sube a 8 GB y añade respaldo diario automático. |
| **Las fotos: 1 GB** | Es el techo que se toca primero si se sube evidencia sin comprimir. Con fotos optimizadas a 1600 px de ancho caben varios miles. | No se pueden subir fotos nuevas. | El mismo Supabase Pro sube a 100 GB. Alternativa: Cloudflare R2, 10 GB gratis, pero **exige vincular una tarjeta**. |
| **Los correos: 100 al día** | **Este es el que muerde primero.** Cada solicitud genera dos correos (confirmación al solicitante + aviso a Edwin). Una convocatoria navideña con 60 padrinos en un mismo día ya lo roza. | Los correos que pasan del número 100 **no salen ese día**. | **Brevo: 300 al día, gratis** (unos 9.000 al mes). O Resend Pro por B/.20.00 al mes. |

**La regla que hay que respetar:** el portal **nunca** se usa para envíos masivos. Los correos
automáticos (una confirmación, un aviso) caben de sobra en el plan gratuito. Una campaña a toda la
lista de voluntarios se exporta a CSV y se envía desde el buzón institucional o desde una
herramienta de boletines. Confundir las dos cosas es lo que rompe el tope de 100 al día.

**El peor escenario razonable**, si la fundación creciera mucho en los próximos tres años, sería
pagar Supabase Pro (B/.25.00) más un servicio de correo con más cupo (B/.20.00) más el dominio:
alrededor de **B/.46.00 al mes**. Sigue siendo menos de lo que cuestan tres consultas psicológicas.

Y hay una compra que, si algún día hay presupuesto, vale la pena antes que cualquier otra:
**Supabase Pro, B/.25.00 al mes.** No por la capacidad, sino porque elimina la pausa por inactividad
y añade respaldos diarios automáticos. Es el seguro contra que el portal amanezca caído sin nadie
que sepa reactivarlo.

---

# PARTE 2 — Técnica

## 6. Decisiones del stack, una por una

Cada fila registra qué se eligió, contra qué se decidió y a qué costo. La justificación larga de las
decisiones estructurales vive en [`adr/`](./adr/), una por archivo.

> **Los seis ADR estructurales ya están escritos y aceptados**: `0001` framework, `0002` n8n como
> capa de automatización, `0003` feed de Instagram, `0004` agendamiento por solicitud, `0005`
> donaciones sin pasarela en v1 y `0006` contenido en base de datos. El índice, con qué decide cada
> uno, está en [`adr/README.md`](./adr/README.md).
>
> 🔴 **Pendiente:** tres decisiones de esta sección todavía no tienen ADR propio —hosting (`0007`),
> analítica (`0008`) y dominio (`0009`)—. Esa numeración queda reservada y no se reasigna.

### 6.1 Framework — Next.js 16 (App Router) + TypeScript · B/.0.00

**Elegido.** Next.js 16, versión LTS activa, con soporte de seguridad proyectado hasta octubre de
2027. Un solo framework para el sitio público, el panel administrativo y los endpoints de servidor.
✅

**Descartado: Astro 6.** Es la opción que la investigación recomendaba en primer lugar, y con buenos
argumentos: alrededor de 9 KB de JavaScript frente a los ~463 KB de Next.js en sitios de contenido
comparables, y sin runtime de Node que parchear. ✅ Se descartó por dos razones que pesan más en
este proyecto concreto: **(a)** el panel administrativo, la autenticación y el agendamiento son
aplicación, no contenido estático, y Astro obligaría a un segundo stack para eso; **(b)** el equipo
ya sabe React y entrega en un semestre — un framework nuevo es riesgo de cronograma con fechas duras
encima ([`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md)). El costo de esa decisión es real y se
paga en disciplina: Server Components por defecto y `'use client'` lo más abajo posible en el árbol
([`../CLAUDE.md`](../CLAUDE.md) §6).

**Descartado: React + Vite (SPA sin renderizado en servidor).** Es la peor opción posible para el
objetivo declarado. El propósito del portal es aparecer cuando alguien en Panamá busca ayuda
psicológica; una SPA se indexa en una segunda pasada, más lenta e inconsistente. ✅

→ [`adr/0001-framework-nextjs.md`](./adr/0001-framework-nextjs.md)

### 6.2 Estilos — Tailwind CSS + shadcn/ui · B/.0.00

Los componentes se copian al repositorio en vez de instalarse como paquete. Consecuencia
deliberada: no hay una dependencia que se rompa en una actualización mayor cuando ya no haya nadie
para arreglarla (X-01). Accesible por defecto, que es requisito duro
([`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md)).

### 6.3 Base de datos, autenticación y archivos — Supabase, plan Free · B/.0.00

**Elegido.** PostgreSQL gestionado con Row Level Security, Auth y Storage en el mismo servicio: un
panel, un secreto, un conjunto de políticas de acceso. Para 2–3 administradores no técnicos esto
importa más que cualquier métrica de rendimiento. ✅

**Descartado: Neon Free.** Técnicamente es más resistente al abandono — nunca se pausa, solo hace
scale-to-zero a los 5 minutos y despierta sola con la primera consulta. ✅ Pero es Postgres puro:
habría que construir a mano la autenticación y el almacenamiento que Supabase ya trae, y eso
contradice el objetivo de mantenibilidad por parte de un cliente no técnico (X-03).

**Descartado: Render** (la base Postgres gratuita **expira a los 30 días** de creada ✅),
**Railway** (ya no tiene plan gratuito útil ✅), **Xata** (retiró su plan gratuito plano y cambió de
producto ✅), **Nhost** (misma pausa semanal que Supabase, con menos ecosistema ✅) y **Turso**
(el plan gratuito más generoso, pero es SQLite/libSQL, no Postgres, y no trae Auth ni Storage ✅).

**Descartado: SQL Server**, que se mencionó en la reunión. Innecesario y caro. Postgres cubre de
sobra el crecimiento previsible.

**El riesgo conocido:** el plan Free pausa el proyecto tras **7 días sin actividad de base de
datos**. ✅ Se neutraliza con dos capas, ambas gratuitas: **(1)** el contenido se consulta en tiempo
de ejecución, no en tiempo de compilación, para que el tráfico real cuente como actividad; **(2)** un
ping diario programado como red de seguridad (RF-15). **Nunca con GitHub Actions programadas**: se
desactivan solas tras 60 días sin actividad del repositorio ✅, que es exactamente el escenario
post-entrega. El esquema completo vive en [`07-modelo-datos.md`](./07-modelo-datos.md).

### 6.4 CMS — panel propio sobre Supabase · B/.0.00

**Elegido.** Tres o cuatro pantallas propias para contenido y bandejas de solicitudes, sobre la
misma base de datos y la misma sesión. Es más trabajo que instalar un CMS, pero es la única opción
que cumple C-07 (que Edwin pueda configurar secciones nuevas), C-06 (ocultar sin borrar) y X-03
(un panel diseñado para alguien que entra una vez cada dos semanas y no recuerda dónde estaba nada).

**Descartado: Sveltia CMS sobre git.** Era la recomendación principal de la investigación, y su
argumento es fuerte: el contenido queda como archivos Markdown en el repositorio y sobrevive a la
muerte de cualquier CMS. ✅ Se descartó porque **choca de frente con la mitigación de la pausa de
Supabase**: si el contenido vive en Markdown, el tráfico real nunca toca la base de datos y el
proyecto se pausa igual. Las dos recomendaciones de la investigación eran incompatibles entre sí;
la crítica de completitud del anexo lo señala como la contradicción más grave del material. ✅
Además, 🔴 **no está confirmado que la interfaz de Sveltia esté traducida al español**, que para
Edwin es bloqueante.

**Descartado: Payload 3 + Next.js 16.** Excelente producto, MIT, panel en español. ✅ Pero exige un
servidor Node y Postgres siempre encendidos (~B/.5.00–8.00 al mes 🟡) y **Payload 4 está en
pre-alfa**: hay una migración mayor en 12–24 meses que nadie va a hacer cuando el equipo se retire.
✅

**Descartados: Strapi** (MIT y sin límites, pero mismo problema de servidor propio ✅),
**Contentful** (techo duro de 25 tipos de contenido en el plan gratuito ✅), **Sanity Free** (solo
dos roles — Edwin tendría que ser Administrador y podría romper el esquema — y los datasets
gratuitos son públicos, inaceptable con datos de solicitudes ✅), **Tina** (2 editores gratis, luego
B/.24.00 al mes ✅) y **Directus** (licencia que ya no es MIT ✅).

**Descartado: WordPress.** Ver §10: es la opción más cara a tres años pese a ser «gratis», y
alrededor del 90% de los compromisos de sitios WordPress ocurren por plugins o temas
desactualizados. ✅ Un WordPress sin nadie que aplique parches se compromete, y ese es exactamente
el escenario de REFUVA después de la entrega.

→ [`adr/0006-contenido-en-base-de-datos.md`](./adr/0006-contenido-en-base-de-datos.md)

### 6.5 Autenticación — Supabase Auth · B/.0.00

**Elegido.** Incluida en el plan Free (50.000 usuarios activos mensuales ✅). Comparte las políticas
RLS con el resto del proyecto: un servicio, un panel, un secreto que rotar. Para tres
administradores, enlace mágico por correo, sin registro público. Segundo factor obligatorio
([`01-srs.md`](./01-srs.md) §6.1).

**Descartado: Auth.js / NextAuth.** Pasó a mantenimiento de solo seguridad en septiembre de 2025 y
no recibirá funciones nuevas. ✅ No aporta nada sobre Supabase Auth y suma configuración.

**Descartado: Clerk.** Plan gratuito hasta 50.000 usuarios, pero **obliga a mostrar su marca y no
incluye segundo factor** ✅ — y el segundo factor no es negociable aquí. Dependencia externa
innecesaria para tres personas.

### 6.6 Correo transaccional — Resend, plan Free · B/.0.00

**Elegido.** 3.000 correos al mes, **tope duro de 100 al día**, 3 dominios verificados, 30 días de
retención. ✅

**La arquitectura de correo, que resuelve un conflicto técnico real:** los registros MX de un
dominio solo pueden apuntar a **un** proveedor de recepción. Por eso: ✅

- **Buzón humano** en el dominio raíz `refuva.org` → MX a Google Workspace for Nonprofits.
- **Envío automático del portal** → Resend, verificando el **subdominio**
  `notificaciones.refuva.org` con sus propios SPF y DKIM, para no tocar los MX del raíz.
- Remitente `no-responder@notificaciones.refuva.org` con **Reply-To hacia `info@refuva.org`**, para
  que las respuestas humanas caigan en el buzón real.
- DMARC en `_dmarc.refuva.org` empezando con `p=none` (solo monitoreo), luego `quarantine`, luego
  `reject`.
- Si algún día hace falta **procesar** correo entrante de forma automática, va en un subdominio
  aparte (`bot.refuva.org`), **nunca** en el raíz.

**Descartado: SendGrid** (retiró su plan gratuito en 2025 ✅), **Postmark** (100 correos al **mes**,
es un tier de pruebas ✅), **Amazon SES** (el más barato a volumen, pero exige salir del sandbox y
manejar IAM: demasiada carga operativa para un equipo que entrega y se va ✅).

**Reserva planificada: Brevo.** 300 correos al día, unos 9.000 al mes, gratis para siempre, con SMTP
y API transaccional. ✅ Es la salida si el tope de 100/día muerde en la campaña navideña, y la
migración no exige rediseñar nada.

### 6.7 Buzón institucional — Google Workspace for Nonprofits · B/.0.00

Ver §2. Depende de la verificación de Goodstack, que depende del hecho O-10 (🔴 figura legal).
Plan B: Microsoft 365 Business Basic (§3.3). Plan C: Zoho Mail Forever Free — 5 usuarios y 5 GB cada
uno, pero **sin IMAP ni POP en el plan gratuito** ✅ (solo navegador), lo que es un retroceso frente
al Gmail que Edwin usa hoy. Puente de costo cero mientras tanto: Cloudflare Email Routing.

### 6.8 Feed de Instagram — Behold.so, plan Free, leído desde el servidor · B/.0.00

**El problema real no es el precio, es el token.** La Instagram Basic Display API **fue apagada por
Meta el 4 de diciembre de 2024** ✅ — no está deprecada, está muerta. Su reemplazo exige cuenta
Profesional y usa un token de larga duración que **vive 60 días y muere de forma irreversible si no
se refresca a tiempo** ✅. Construirlo a mano significa que **el feed se apaga solo unas ocho
semanas después de que el equipo se retire**, y Edwin no tendría cómo arreglarlo. Es el escenario
X-01 en su forma más pura.

**Elegido: Behold.so gratuito, consumiendo el JSON feed desde el servidor.** Behold mantiene el
token en su infraestructura: el sitio de REFUVA **no guarda ningún secreto que caduque**. ✅
Límites del plan gratuito: 1.200 vistas al mes, 1 fuente, 6 publicaciones, refresco diario. Al leer
desde el servidor una o dos veces al día en vez de una vez por visitante, el consumo estimado es de
unas **30–60 peticiones al mes** 🟡, contra un tope de 1.200. Beneficio secundario: cero JavaScript
de terceros en el navegador, que es cero CLS y mejor LCP.

**Descartado: construirlo a mano contra la API de Meta.** Token de 60 días, cron que mantener, base
donde persistir el token rotado, posible App Review de Meta de 2 a 4 semanas, y un límite de uso
calculado como `4800 × impresiones en 24 horas` que castiga precisamente a las cuentas pequeñas. ✅

**Descartados: Elfsight** (200 vistas al mes: menos de 7 cargas de página al día ✅),
**EmbedSocial** (500 vistas al mes en el gratuito ✅), **SnapWidget** (desde B/.8.00 al mes ✅).

**Plan B, si Behold cambia de política: LightWidget, B/.15.00 de pago único** por widget, con HTTPS,
CDN y refresco cada 30 minutos, instalable en páginas ilimitadas. ✅ Es la única opción del mercado
sin suscripción recurrente. **No usar su plan gratuito: no soporta HTTPS** y el navegador bloqueará
el contenido. **Plan C: Curator.io gratuito**, que no publica tope de vistas, a cambio de mostrar su
marca. ✅

**Respaldo obligatorio, sea cual sea el proveedor:** si el feed falla, se muestra la última copia
buena cacheada; si no hay ninguna, la sección **desaparece**. Nunca un hueco ni un error visible
(RF-05).

🔴 **Pendiente:** confirmar con Behold (`hello@behold.so`) si las peticiones al JSON feed cuentan
contra el tope de 1.200 vistas. La documentación define «vista» como carga de página con widget, lo
que sugiere que no — pero hay que confirmarlo antes de comprometer la arquitectura. Aunque contaran,
1–2 peticiones diarias caben.

→ [`adr/0003-feed-instagram.md`](./adr/0003-feed-instagram.md)

### 6.9 Hosting — Vercel Hobby · B/.0.00

**Elegido.** Guías de uso mensual: 100 GB de Fast Data Transfer, 1 millón de invocaciones de
función, 4 CPU-horas activas, 5.000 transformaciones de imagen. ✅ Vercel las llama «guías», no
límites duros: avisan antes de tomar acción.

**El punto delicado, dicho completo.** El plan Hobby está restringido a uso no comercial. Vercel
aclara **textualmente** que «pedir donaciones no constituye uso comercial» ✅ — el botón de donar es
legítimo. Pero la misma página lista como uso comercial «anunciar la venta de un producto o
servicio» y «cualquier método de solicitar o procesar pagos de los visitantes». 🟡 **Anunciar la
consulta de B/.15.00 con agendamiento cae en zona gris.** Por eso [`../CLAUDE.md`](../CLAUDE.md)
§5.5 decide que **v1 no cobra la consulta en línea**: eso saca al proyecto del alcance PCI y de la
zona gris a la vez. Mitigación adicional: preguntar por escrito a soporte de Vercel antes del
lanzamiento, y tener lista la salida.

**Alternativa real y preferida por la investigación: Cloudflare Pages.** 500 compilaciones al mes,
peticiones a activos estáticos «gratuitas e ilimitadas», sin cargos de egreso, **sin pausa por
consumo y sin restricción de uso comercial**. ✅ Es objetivamente más resistente al abandono. Se
mantiene documentada como la salida si Vercel marca el sitio.

**Segunda alternativa: autohospedar en el Coolify que el equipo ya opera.** Control total, y hoy
costo marginal cero **solo porque el servidor lo paga un estudiante del equipo, no la fundación**.
Si la fundación tuviera que asumirlo, son 🟡 B/.5.00–12.00 al mes. 🔴 **Pendiente a cargo de Rafael
Gómez: de quién es ese servidor y quién lo paga después de la entrega** — es el mismo pendiente que
el alojamiento de n8n (§7.5). Si es de un estudiante, muere con el traspaso y no sirve para
producción (X-01).

**Descartado: Netlify.** Su plan gratuito pasó a un modelo de 300 créditos al mes con límite duro
y, al agotarse, **pausa todos los sitios del equipo** con una página «Site not available». ✅ Unos
20 despliegues al mes ya agotan la cuota. Inaceptable para el sitio de una fundación. *(Nota de
consistencia: las dos fuentes del anexo discrepan sobre la fecha del cambio — 4 de septiembre de
2025 frente a abril de 2026 — pero coinciden en los 300 créditos y en el comportamiento de pausa,
que es lo que decide.)*

**Descartado: GitHub Pages.** Solo sirve contenido estático, sin backend: incompatible con el panel,
el login y el agendamiento. Y sus términos prohíben expresamente sitios «dirigidos principalmente a
facilitar transacciones comerciales». ✅

→ `adr/0007-hosting-vercel-hobby.md` · 🔴 pendiente de escribir

### 6.10 Analítica — Cloudflare Web Analytics · B/.0.00

**Elegido.** Cita textual del proveedor: no usa cookies ni `localStorage`, y no hace fingerprinting
por IP ni por User-Agent. ✅ Consecuencia directa: **no hace falta banner de consentimiento**, que
en un sitio donde alguien puede estar en crisis es una fricción menos entre esa persona y el bloque
de recursos de ayuda.

**Su límite, dicho de frente.** Retiene datos sin muestrear solo **7 días**; después agrega en torno
al 10%, con acceso a unos 6 meses de histórico. ✅ **Sirve para tendencias, no para contar
donaciones con precisión.** Lo que REFUVA necesita medir de verdad —solicitudes de cita enviadas,
inscripciones de padrinos, donaciones iniciadas— no se cuenta bien así.

**Complemento planificado: los eventos de negocio se cuentan en la propia base de datos.** Cada
solicitud, cada inscripción y cada postulación ya es una fila en Postgres con su fecha. Esa es la
fuente de verdad de las métricas de la fundación, no una herramienta de analítica web. Resuelve el
límite anterior sin costo ni servicio nuevo.

**Descartado, pero anotado: Umami Cloud Hobby.** Gratuito, sin cookies, con eventos personalizados y
6 meses de retención. 🟡 Sus límites (100.000 eventos al mes, 3 sitios) provienen de fuentes
secundarias porque la página oficial de precios se renderiza con JavaScript y no fue posible
verificarla. Es la primera alternativa si el conteo por base de datos resultara insuficiente.

**Descartados: Plausible** (desde B/.9.00 al mes; su descuento del 15% para ONG solo aplica al plan
Business anual ✅), **Fathom** (desde B/.15.00 al mes, sin descuentos ✅), **Vercel Web Analytics
Hobby** (sin eventos personalizados y ventana de reporte de 1 mes: inútil para comparar una fiesta
navideña con la del año anterior ✅).

**GA4 queda condicionado.** Es gratuito ✅, pero usa cookies propias `_ga` y arrastra banner de
consentimiento. Se instala **solo si se aprueba Google Ad Grants**, porque entonces hace falta
importar conversiones a Google Ads. Y si se instala, se sube la retención de 2 a 14 meses **el mismo
día**, porque el valor por defecto tira el histórico. ✅

→ `adr/0008-analitica-sin-cookies.md` · 🔴 pendiente de escribir

### 6.11 Dominio y DNS — `refuva.org` en Porkbun, DNS en Cloudflare · B/.11.84 al año

| Opción | Registro | Renovación | Fricción |
|---|---|---|---|
| **`.org` en Porkbun** ✅ | B/.11.84 (promo primer año B/.7.98) | B/.11.84/año | Ninguna. Activo en minutos. WHOIS privacy y SSL incluidos. |
| `.org` en Cloudflare Registrar 🟡 | ~B/.11.20 (modelo *at-cost*, precio por TLD no publicado) | ~B/.11.20/año | Ninguna. **No soporta el ccTLD `.pa`.** |
| `.org` en Namecheap ✅ | B/.7.24–9.98 el primer año | **~B/.15.18/año** | Trampa de primer año barato. Descartado. |
| **`.org.pa` en NIC Panamá** ✅ | **B/.50.00 mínimo (2 años obligatorios)** | B/.25.00/año | Exige adjuntar «documentación de fundación sin fines de lucro» y revisión manual. |
| `.pa` de segundo nivel ✅ | B/.200.00 por 2 años | B/.100.00/año | Descartado por precio. |

**Decisión: `refuva.org`.** Cuesta menos de la mitad que el `.org.pa` por año, no obliga a
desembolsar dos años por adelantado y no depende de una revisión documental que hoy está bloqueada
por el hecho O-10. Si más adelante la fundación quiere la identidad panameña, se registra
`refuva.org.pa` como dominio **defensivo** redirigido al `.org`, nunca como principal.

**DNS en Cloudflare desde el día uno** (gratuito), porque es donde conviven los MX de Google
Workspace, los SPF/DKIM del subdominio de Resend y el DMARC del raíz.

🔴 **Pendiente:** si Edwin ya tiene un dominio registrado o una preferencia de nombre (pregunta
abierta 9 de [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md)). Hasta
confirmarlo, `refuva.org` es una propuesta, no un hecho.

→ `adr/0009-dominio-org-sobre-org-pa.md` · 🔴 pendiente de escribir

### 6.12 Formularios — propios contra Supabase · B/.0.00

**La regla:** si el dato solo tiene que llegar a un correo y morir ahí, un servicio de terceros
sirve. Si el dato tiene ciclo de vida —una cita se solicita, se confirma, se atiende o se cancela;
un voluntario se postula y se aprueba— vive en la base de datos propia, con validación en servidor.

**Consecuencia no negociable:** los formularios de cita psicológica, voluntariado, apadrinamiento y
postulación de comunidad son **propios**. **Nunca** se ponen datos de salud mental en el plan
gratuito de un servicio de formularios de terceros (X-05).

**Descartado: Formspree.** 50 envíos al mes en **toda la cuenta**. ✅ Se agotan en días durante la
campaña navideña. **Anotado: Tally Free** (formularios y respuestas ilimitados ✅) sigue siendo
válido para el contacto general si el equipo necesitara recortar alcance — pero no para nada
sensible.

## 7. Dónde va n8n, y dónde no

Esta es la sección que más importa proteger, porque es la que un desarrollador con prisa deshace.

### 7.1 La regla

**n8n es la capa de automatización. Nunca es el backend de petición-respuesta.**

```
Navegador
   │  POST (Server Action / Route Handler)
   ▼
Next.js ── valida con Zod ──► Supabase (PostgreSQL)   ◄── la escritura ocurre AQUÍ, y es lo único crítico
                                    │
                                    │ Database Webhook (pg_net, con reintentos)
                                    ▼
                                  n8n ──► Resend (confirmación al solicitante)
                                      ──► aviso a la administración, con enlace al panel
                                      ──► etiqueta por programa, en Postgres
```

La exportación no aparece en este diagrama porque no es automática ni continua: **el único export
que existe es un CSV bajo demanda desde el panel (RF-03)**. Ninguna automatización vuelca datos de
personas a una hoja compartida — [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md)
RNF-11 lo prohíbe.

El dato se escribe **primero y de forma síncrona** en PostgreSQL. La automatización **reacciona
después**.

### 7.2 Por qué, y no al revés

El formulario de cita lo llena alguien que está pidiendo ayuda psicológica.

Si el `<form>` apunta directo a un webhook de n8n y n8n está caído, pausado o cambió de URL, ese
mensaje **se pierde en silencio**. No hay fila en ninguna tabla, no hay error que alguien vea, no
hay nada que reprocesar. La persona cree que pidió ayuda y nadie la pidió.

Con el orden correcto, el peor caso es distinto y es aceptable: la solicitud **está guardada**, lo
que falló es el aviso, y el aviso se reintenta (RF-15, «reintento de correos fallidos, cada hora»).
Nadie se queda sin ser atendido por una automatización caída.

Esto es también lo que hace cumplible la regla de
[`../CLAUDE.md`](../CLAUDE.md) §6: «sin fallos silenciosos». Un `catch` que solo hace
`console.error` en el camino de una solicitud de ayuda es un bug, no un descuido.

### 7.3 Lo que n8n sí hace, y lo que nunca hace

| n8n **sí** | n8n **nunca** |
|---|---|
| Correo de confirmación al solicitante y aviso a Edwin (RF-02). | Sirve contenido de páginas públicas. Mata el SEO y agrega un punto de fallo donde no hace falta. |
| Clasificar y etiquetar voluntarios y padrinos por programa dentro de Postgres (RF-03). | Vuelca datos de personas a una hoja de cálculo compartida. El único export es un CSV bajo demanda desde el panel (RF-03, RNF-11). |
| Ping programado a Supabase contra la pausa por inactividad (RF-15). | Guarda el registro de verdad. Postgres es la fuente de verdad; n8n solo reacciona. |
| Refresco diario del feed de Instagram hacia la caché (RF-05). | Autentica a nadie. Eso es Supabase Auth. |
| Enviar el aviso de convocatorias vencidas y registrar la fecha de cierre (RF-15). La vigencia la filtra la consulta por fecha, no un trabajo programado. | Toca datos de tarjeta. Nada los toca (§9). |
| Respaldo semanal de la base. | Es el destino directo de un `<form>`. |

### 7.4 La arquitectura NO depende de n8n

Hay que decirlo explícitamente porque es lo que hace segura la decisión: **si n8n no está
disponible cuando toque implementar, un Route Handler de Next.js llamando a Resend hace exactamente
lo mismo.** Vive en el mismo repositorio, se despliega con el mismo push, no añade infraestructura y
no añade una cuenta más que traspasar. n8n es una **comodidad de mantenimiento** —Edwin o un
sucesor puede cambiar el texto de un correo sin tocar código—, no un cimiento.

### 7.5 Las cuatro opciones, comparadas, con su costo

**El alojamiento de n8n es una línea del presupuesto (§1), no un detalle técnico.** El total anual
de B/.11.84 solo es cierto si las automatizaciones no cuestan nada, y eso todavía no está resuelto.
Estas son las rutas, con su número.

| Opción | Costo | Quién lo mantiene | Riesgo post-entrega (X-01) |
|---|---|---|---|
| **n8n autohospedado en el Coolify que el equipo ya opera** | Hoy B/.0.00 marginal **porque el servidor lo paga un estudiante del equipo, no la fundación**. Si la fundación lo asume: 🟡 **B/.5.00–12.00 al mes** (VPS de 2 GB de RAM, precio de referencia, no verificado en el anexo) = **B/.60.00–144.00 al año** | El equipo, hoy. 🔴 **Nadie, confirmado, mañana.** | **Alto.** 🔴 Pendiente a cargo de **Rafael Gómez**: de quién es el servidor, quién lo paga y quién aplica actualizaciones tras la entrega. Infraestructura de un estudiante no es infraestructura de la fundación: muere con el traspaso. |
| **n8n Cloud** | 🔴 **Pendiente** — no verificado en el anexo de investigación. No se presupuesta lo que no se ha comprobado. | El proveedor | Medio. Elimina el mantenimiento del servidor, pero introduce un costo recurrente contra X-02 y una cuenta más a nombre de la fundación. |
| **Supabase Edge Functions** | B/.0.00 — 500.000 invocaciones al mes en el plan Free; 2 millones en Pro y B/.2.00 por millón adicional ✅ | Nadie: es serverless dentro del servicio que ya se usa | **Bajo.** Cero infraestructura nueva, cero cuenta nueva. Contra: es código TypeScript, no un lienzo visual — Edwin no lo puede editar (pero tampoco tiene por qué). |
| **Route Handler de Next.js + Resend, con las tareas programadas en un Cron Trigger de Cloudflare Workers** *(la ruta recomendada)* | **B/.0.00**, y sin servidor ni cuenta nueva. El cron de Cloudflare Workers es gratuito hasta 100.000 peticiones al día ✅ | El mismo repositorio | **El más bajo.** Se despliega con el sitio, no añade factura ni pieza que traspasar. |

**Recomendación del equipo: la cuarta.** Presupuestar **B/.0.00** y tomar como ruta por defecto el
Route Handler de Next.js con Resend, y las tareas programadas en un Cron Trigger de Cloudflare
Workers. Es la única de las cuatro que no añade **ni una factura, ni un servidor, ni una cuenta más
que traspasar**, y es la que hace verdadero el total de §1. La comodidad que se pierde —que Edwin o
un sucesor cambie el texto de un correo sin tocar código— es real, pero cuesta menos que un servidor
sin dueño.

**Cuándo se queda n8n.** Se mantiene como capa de automatización según
[`../CLAUDE.md`](../CLAUDE.md) §4 **solo si, antes de la entrega, existe un servidor a nombre de la
fundación, con dueño con nombre y apellido y con su costo aprobado como línea del presupuesto**. Ese
🔴 pendiente es de **Rafael Gómez**: se cierra como responsable en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) y como **trámite** —no como tarea de
código— en [`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md).

→ [`adr/0002-n8n-como-capa-de-automatizacion.md`](./adr/0002-n8n-como-capa-de-automatizacion.md)

## 8. Límites de los planes gratuitos

| Servicio | Límite exacto | Consumo estimado de REFUVA | Margen | Qué hacer cuando se toque |
|---|---|---|---|---|
| **Supabase — base de datos** | 500 MB ✅ | Solo texto y metadatos. Miles de filas = decenas de MB 🟡 | Muy amplio | Alerta al 70%. Escalón: Pro B/.25.00/mes → 8 GB. |
| **Supabase — archivos** | 1 GB ✅ | Fotos en WebP a 1600 px, ~200 KB cada una 🟡 | Es el techo que se toca primero de los tres de Supabase | Comprimir al subir. Escalón: Pro → 100 GB, o Cloudflare R2 (10 GB gratis, **exige tarjeta** ✅). |
| **Supabase — egreso** | 5 GB + 5 GB cacheado ✅ | Sitio de bajo tráfico con imágenes servidas por `next/image` 🟡 | Amplio | Escalón: Pro → 250 GB + 250 GB. |
| **Supabase — Auth** | 50.000 usuarios activos/mes ✅ | 2–3 administradores ✅ | Enorme | No aplica. |
| **Supabase — Edge Functions** | 500.000 invocaciones/mes ✅ | 0 en v1 (las automatizaciones van por n8n) | Total | Solo si se cambia n8n por Edge Functions (§7.5). |
| **Supabase — proyectos activos** | 2 por organización ✅ | 1 en producción + 1 de pruebas | Justo | No crear un tercero. Desarrollo local con `npx supabase start`. |
| **Supabase — pausa** | **7 días sin actividad de base de datos** ✅ | Mitigado por diseño (§6.3) | — | Ping diario (RF-15) + consulta en tiempo de ejecución. Reactivación manual: 2–3 min desde el panel, sin pérdida de datos. |
| **Resend — correos** | **3.000/mes con tope duro de 100/día** ✅ | ~2 correos por solicitud 🟡. Una convocatoria de padrinos concentrada en un día lo roza | **Estrecho. Es el límite que muerde primero.** | Nunca enviar difusión masiva desde el portal: exportar a CSV. Escalón sin costo: **Brevo, 300/día** ✅. |
| **Resend — dominios** | 3 verificados ✅ | 1 (`notificaciones.refuva.org`) | Amplio | — |
| **Resend — retención** | 30 días ✅ | — | — | El registro de envíos que importa vive en Postgres, no en Resend. |
| **Vercel Hobby — transferencia** | ~100 GB/mes ✅ | Sitio de fundación, tráfico local 🟡 | Amplio | Son «guías», no cortes duros: Vercel avisa antes de actuar. |
| **Vercel Hobby — invocaciones** | ~1 millón/mes ✅ | Muy por debajo 🟡 | Amplio | — |
| **Vercel Hobby — imágenes** | 5.000 transformaciones/mes ✅ | Galerías de evidencia 🟡 | **A vigilar** — es el límite de Vercel que más probablemente se toque | Tamaños fijos y `sizes` bien puestos en `next/image`. |
| **Vercel Hobby — uso comercial** | Donaciones permitidas; vender no ✅ | Zona gris al anunciar B/.15.00 🟡 | — | v1 no cobra en línea. Salida lista: Cloudflare Pages. |
| **Behold — vistas** | 1.200/mes ✅ | ~30–60 peticiones/mes al leer desde el servidor 🟡 | Enorme | Al agotarse, la cuenta se **pausa** hasta el mes siguiente. Escalón: Starter B/.10.00/mes ✅. |
| **Behold — publicaciones** | 6, 1 fuente, refresco diario ✅ | 6 en la portada | Justo y suficiente | — |
| **Cloudflare Web Analytics** | Gratis; **7 días sin muestrear**, luego ~10% ✅ | — | — | Las métricas que importan se cuentan en Postgres (§6.10). |
| **Cloudflare — DNS y Email Routing** | Gratis; 200 direcciones, mensajes ilimitados ✅ | 5 direcciones | Amplio | — |
| **Cloudflare Workers — cron** | 100.000 peticiones/día ✅ | 1 ping diario | Enorme | Es la ruta recomendada para las tareas programadas (§7.5). Gratuito y sin servidor propio. |
| **Google Workspace for Nonprofits** | 100 TB compartidos, 2.000 usuarios ✅ | Evidencia fotográfica de la fundación | Enorme | Reemplaza al OneDrive de pago. |
| **GitHub** | Free o Team donado ✅ | 1 repositorio | Amplio | El repositorio va en una organización de **la fundación**. |

**Regla transversal:** alerta al **70%** de cualquier cuota, no al 100%. Y `n8n` **nunca** se usa
para envíos masivos: el tope de Resend se rompe por confundir correo transaccional con boletín.

## 9. Donaciones en Panamá

### 9.1 La comparativa, con números reales

Comisión sobre una donación de **B/.15.00** (el precio de una consulta, que es el anclaje narrativo
obvio para la página de donaciones) y sobre una de **B/.100.00**.

| Opción | Costo fijo mensual | Comisión sobre B/.15.00 | Neto | Comisión sobre B/.100.00 | Neto | Estado |
|---|---|---|---|---|---|---|
| **ACH / transferencia** | B/.0.00 | **B/.0.00** | **B/.15.00** | **B/.0.00** | **B/.100.00** | ✅ |
| **Yappy Comercial (directo)** | B/.0.00 | **B/.0.16** | B/.14.84 | **B/.1.07** | B/.98.93 | ✅ |
| Yappy vía Tilopay | B/.0.00 | B/.0.30 *(mínimo)* | B/.14.70 | B/.2.00 | B/.98.00 | ✅ |
| PagueloFacil (plan estándar) | B/.0.00 | B/.1.03 | B/.13.97 | B/.4.00 | B/.96.00 | ✅ |
| PayPal | B/.0.00 | B/.1.11 | B/.13.89 | B/.5.70 | B/.94.30 | ✅ |
| Comercio Electrónico BG | B/.0.00 — sin inscripción, sin mensualidad, sin contracargos ✅ | 🔴 **Pendiente** | — | 🔴 **Pendiente** | — | Porcentaje no publicado; se negocia con el banco. |
| **Stripe** | — | **No opera en Panamá** ✅ | — | — | — | Descartado. |

**Cómo se calcula Yappy.** 1% + ITBMS (7%) = **1,07% efectivo**. Comisión **mínima B/.0.02** y
comisión **máxima B/.10.70** por transacción ✅. Ese máximo importa: a partir de unos **B/.1,000.00
la comisión se aplana**, así que una donación corporativa de B/.5,000.00 cuesta B/.10.70, no
B/.53.50. Para donaciones grandes, Yappy compite de tú a tú con ACH.

**Sobre el ticket típico de REFUVA, Yappy directo cuesta unas siete veces menos que PagueloFacil o
PayPal.** ✅ En una fundación comunitaria que vive de donaciones pequeñas y frecuentes, esa
diferencia es la diferencia entre financiar una sesión de terapia o no.

**Advertencias operativas de Yappy, verificadas:** ✅

- Sus términos **prohíben trasladar la comisión al donante**. No se implementa la casilla «agrego
  B/.0.16 para cubrir la comisión» que aparece en plantillas extranjeras. La comisión sale del neto
  de la fundación.
- El alias debe ser **de la fundación**, nunca la cuenta personal de Edwin: usar Yappy Comercial
  para pagos de carácter personal está prohibido. Y una cuenta **personal** que reciba 50 o más
  pagos que sumen B/.10,000.00 o más en dos meses consecutivos empieza a pagar comisión igual.
- La comisión se calcula por transacción pero se cobra en **un solo débito diario**.
- El cliente **no paga** la comisión.

**Sobre PayPal:** funciona en Panamá pero es la opción más cara, y el golpe real no es la comisión
sino el **retiro: mínimo B/.15.00 o 1% del monto, el que sea mayor** ✅. Si se activa, es solo como
canal para diáspora y donantes internacionales, retirando en tandas grandes. 🟡 No está confirmado
si PayPal concede su tarifa reducida para organizaciones benéficas a fundaciones panameñas: hay que
planificar con la tarifa plena.

**Descartados explícitamente, para que nadie del equipo pierda semanas:** ✅

- **Stripe** — Panamá no está en su lista de países; la ruta de constituir una LLC en Estados Unidos
  es inviable y riesgosa.
- **PayPal Giving Fund** — solo opera en Estados Unidos, Reino Unido, Canadá, Irlanda y Australia.
- **Nuvei** — empresarial, sin autoservicio ni tarifas públicas.
- **BAC Credomatic directo** — setup, mensualidad y **posible depósito en garantía** según análisis
  de riesgo. 🟡 Sus cifras de terceros (B/.75.00 de setup, B/.50.00/mes) son de julio de 2023 y hay
  que tratarlas como indicativas; los requisitos sí están verificados.
- **Cuanto (cuanto.app)** — no descartado, pero 🔴 sus tarifas no están publicadas. Vale la pena
  cotizarlo: FUNDASIS lo usa en producción.

### 9.2 El bloqueante del camino crítico

> **Yappy Comercial exige cuenta comercial en Banco General a nombre de la fundación, con Banca en
> Línea Comercial activa.** ✅ Además, sus términos exigen que el comercio afiliado sea «una persona
> jurídica debidamente constituida según las leyes de la República de Panamá» y que el pacto social
> o acta fundacional no contenga ninguna disposición que limite la afiliación.
>
> **Si REFUVA no tiene esa cuenta, ese trámite bancario es el camino crítico de todo el proyecto de
> donaciones, y hay que empezarlo antes que el código.** 🔴 Pendiente (hecho S-06 y pregunta abierta
> 5 de [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md)). El calendario está
> en [`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md).

### 9.3 Lo que se implementa en v1

**Sin escribir una línea de código de pagos.** Yappy ofrece tres métodos de cobro que no requieren
programación —Directorio con alias, código QR y Link de Pago ✅— y es exactamente lo que ya hacen
las fundaciones panameñas reales: Ayudinga publica su alias `@ayudinga` y su cuenta de Banco
General; FUNDASIS publica `FUNDASIS` y su cuenta corriente. ✅

La página de donaciones de v1 lleva:

1. **Alias de Yappy** y su **QR** descargable.
2. **Datos de ACH completos** —banco, tipo de cuenta, número y titular exactamente como figura en el
   banco— con **botón de copiar**.
3. Un correo o WhatsApp para **enviar el comprobante y recibir el recibo**.

El **Botón de Pago Yappy V2** —que sí exige backend, con llamadas del lado del servidor y un
endpoint IPN que valida un hash HMAC-SHA256— queda para v2. ✅ Cuando llegue, hay que escribir a
`botondepagoyappy@bgeneral.com` **antes de integrar**: la versión anterior del botón está en proceso
de descontinuación y los tutoriales viejos apuntan a la que se retira. ✅

### 9.4 Dos reglas que ahorran retrabajo

**Regla de cumplimiento, innegociable.** El sitio y el panel **nunca** procesan, transmiten ni
almacenan número de tarjeta, fecha de vencimiento ni CVV. Todo pago con tarjeta, si algún día
existe, es por **redirección** a un checkout alojado del proveedor — nunca por iframe ni por
formulario propio. La redirección mantiene a REFUVA en el cuestionario **SAQ A (~24 requisitos)** en
vez del **SAQ A-EP (~140)**, y la exime del requisito de protección contra scripts introducido en
PCI DSS v4.0.1, que sí aplica a implementaciones embebidas. ✅ Beneficio colateral: **una brecha del
panel nunca sería una brecha de datos financieros**. El canal Yappy queda fuera del alcance PCI por
completo, porque no interviene ninguna tarjeta. ✅

**Regla de diseño de datos.** Las donaciones a instituciones de beneficencia son deducibles solo si
la institución fue previamente autorizada, y las autorizadas deben presentar el **Formulario 61**
ante la DGI antes del 31 de marzo de cada año, con **nombre, RUC o cédula del donante, fecha y
monto** de cada donación. ✅ 🔴 **Pendiente: si REFUVA está autorizada por la DGI.** Mientras no se
confirme, queda anotado en [`07-modelo-datos.md`](./07-modelo-datos.md) como **pendiente
condicionado**, no como tabla que ya exista: si la autorización resulta estar vigente, la tabla de
donaciones se crea con esos campos **antes de registrar la primera donación**; si no lo está, no se
crea. Tenerlo previsto evita una migración dolorosa después y le da a Edwin un argumento de captación
real frente a empresas padrinas.

→ [`adr/0005-donaciones-sin-pasarela-en-v1.md`](./adr/0005-donaciones-sin-pasarela-en-v1.md)

## 10. Costo total de propiedad a 3 años

Comparación con la alternativa obvia, que es la que cualquiera propondría en una reunión:
**WordPress con hosting compartido**.

| Concepto | Pila elegida | WordPress con hosting compartido |
|---|---|---|
| Dominio (3 años) | B/.35.52 ✅ | B/.35.52 ✅ |
| Hosting | B/.0.00 (Vercel Hobby) ✅ | 🟡 B/.60.00–180.00 (hosting compartido, ~B/.2.00–5.00/mes) |
| Base de datos, auth y archivos | B/.0.00 (Supabase Free) ✅ | Incluida en el hosting |
| Licencias de CMS y plugins | B/.0.00 ✅ | 🟡 B/.150.00–900.00 (plugins de pago, B/.50.00–300.00 por plugin al año) |
| Correo transaccional | B/.0.00 (Resend Free) ✅ | B/.0.00–720.00 según plugin |
| **Mantenimiento y parcheo** | B/.0.00 — nada que parchear: no hay servidor propio ni plugins de terceros | ✅ **B/.1,800.00–6,120.00** (mantenimiento profesional real, B/.50.00–170.00/mes) |
| **Total a 3 años** | **B/.35.52** | **B/.2,045.00–7,955.00** |

**Los B/.35.52 suponen la ruta recomendada de automatizaciones** —dentro del propio sitio, con el
cron gratuito de Cloudflare Workers (§7.5)—. Si la fundación acabara asumiendo un servidor propio
para n8n, hay que sumar 🟡 **B/.180.00–432.00 a tres años**, y sigue siendo un orden de magnitud
menos que WordPress mantenido.

**El número que importa no es el precio, es el riesgo.** Alrededor del **90% de los compromisos de
sitios WordPress ocurren por plugins o temas desactualizados** ✅, y WPScan registra cientos de
vulnerabilidades nuevas cada mes. Un WordPress sin nadie que aplique parches **se compromete**: no
es una posibilidad remota, es el desenlace habitual. Y ese es exactamente el escenario de REFUVA
después de que el equipo de servicio social se retire (X-01).

Sin mantenimiento pagado, WordPress no cuesta B/.35.52: cuesta el sitio de una fundación que habla
de suicidio, secuestrado o desfigurado, sin nadie que lo note.

**Otras alternativas evaluadas, a 3 años:** ✅

| Alternativa | Costo a 3 años | Por qué no |
|---|---|---|
| Payload 3 + Next.js en VPS | 🟡 B/.180.00–288.00 + migración a Payload 4 | Servidor que parchear y una migración mayor que nadie hará. |
| Tina Team (si hiciera falta un tercer editor) | B/.864.00 | El panel propio no tiene límite de editores. |
| Sanity Growth para 3 editores | B/.1,620.00 | Y el plan gratuito tiene datasets públicos. |

## 11. Riesgos del stack y su mitigación

| # | Riesgo | Probabilidad | Impacto | Mitigación | Estado |
|---|---|---|---|---|---|
| RS-01 | **Supabase pausa el proyecto** tras 7 días sin actividad y el formulario de citas deja de funcionar. | Media | Alto | Contenido consultado en tiempo de ejecución + ping diario (RF-15). Reactivación manual documentada para Edwin: 2–3 min, sin pérdida de datos. **Nunca** GitHub Actions programadas. | ✅ mitigado por diseño |
| RS-02 | **El tope de 100 correos/día de Resend** se rompe en la campaña navideña. | **Alta** | Medio | Nada de difusión masiva desde el portal; exportar a CSV. Salida sin costo: Brevo (300/día). | ✅ salida lista |
| RS-03 | **El trámite de Yappy Comercial no está hecho** y bloquea las donaciones. | 🔴 Desconocida | **Alto** | Es el camino crítico. Empezarlo antes que el código. Mientras tanto, ACH sola ya permite recibir donaciones. | 🔴 pendiente de Edwin |
| RS-04 | **La figura legal (O-10) no encaja** con las cuatro que Google exige y se cae Google Workspace. | 🔴 Desconocida | Alto | Plan B: Microsoft 365 Business Basic. Plan C: Zoho Mail. Puente: Cloudflare Email Routing (gratis, inmediato). | 🔴 pendiente de Edwin |
| RS-05 | **Vercel marca el sitio como uso comercial** por anunciar la consulta de B/.15.00. | 🟡 Baja–media | Medio | v1 no cobra en línea. Preguntar a soporte por escrito. Salida: Cloudflare Pages, sin restricción comercial. | 🟡 vigilar |
| RS-06 | **El servidor Coolify donde vive n8n muere con la entrega**, o su costo aparece sin estar presupuestado. | 🔴 Desconocida | Medio | La arquitectura no depende de n8n: Route Handler + Resend y cron en Cloudflare Workers cubren lo mismo y cuestan B/.0.00 (§7.5). El costo de la ruta alternativa está en la línea de presupuesto de §1. | 🔴 pendiente — **Rafael Gómez** |
| RS-07 | **Behold cambia de política o el plan gratuito desaparece.** | Baja | Bajo | El feed degrada a la última copia cacheada o desaparece (RF-05). Plan B: LightWidget B/.15.00 pago único. | ✅ mitigado |
| RS-08 | **Nadie renueva el dominio** y el sitio desaparece. | 🟡 Media | **Crítico** | Registro a nombre de la fundación, con correo institucional. Calendario de renovaciones con responsable con nombre en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md). | 🟡 depende del traspaso |
| RS-09 | **El almacenamiento de 1 GB se llena** con fotos de evidencia. | Media | Medio | Compresión a WebP, ancho máximo 1600 px, al momento de subir. Alerta al 70%. Escalón: Supabase Pro. | ✅ mitigado |
| RS-10 | **Ad Grants se aprueba y luego se pierde** por no cumplir el 5% de CTR. | 🟡 Media si se solicita | Bajo (no cuesta dinero) | No solicitarlo hasta que haya alguien que se comprometa a dos horas al mes. Es decisión de Edwin. | 🟡 decisión pendiente |
| RS-11 | **Los precios cambian.** Varios proveedores modificaron sus planes en 2025–2026. | Alta | Bajo | Reverificar todo este documento antes de la entrega final. La fecha de consulta (6 de septiembre de 2026) está en la cabecera. | ✅ anotado |

---

## Resumen de lo pendiente en este documento

Lo que falta y quién lo debe. Consolidado en
[`06-inventario-contenido.md`](./06-inventario-contenido.md).

| # | Qué falta | Quién lo debe | Qué bloquea |
|---|---|---|---|
| 1 | Figura legal exacta de la fundación (O-10) | **Edwin / asesor legal** | Google Workspace, Canva, Microsoft, Ad Grants, Yappy Comercial |
| 2 | Cuenta comercial en Banco General con Banca en Línea Comercial (S-06) | **Edwin** | Todas las donaciones por Yappy. **Camino crítico.** |
| 3 | Si REFUVA está autorizada por la DGI para donaciones deducibles | **Edwin** | El pendiente condicionado de la tabla de donaciones anotado en [`07-modelo-datos.md`](./07-modelo-datos.md) |
| 4 | Dominio preferido, o si ya hay uno registrado | **Edwin** | El registro del dominio y toda la configuración de correo |
| 5 | Dónde se aloja n8n tras la entrega: propiedad del servidor, quién lo paga y cuánto | **Rafael Gómez** | La línea de presupuesto de §1 y si n8n se queda o se sustituye por Route Handler + Resend (§7.5) |
| 6 | Comisión por transacción de Comercio Electrónico BG | **Equipo** — escribir a `comercioelectronico@bgeneral.com` | La comparativa de tarjeta para v2 |
| 7 | Si las peticiones al JSON feed de Behold consumen «vistas» | **Equipo** — escribir a `hello@behold.so` | Confirmar el margen del feed de Instagram |
| 8 | Disponibilidad real de Google Ad Grants en Panamá | **Equipo**, tras la aprobación de Goodstack | Si se promete o no ese beneficio a Edwin |
| 9 | Precio de n8n Cloud | **Rafael Gómez** | La comparativa completa de §7.5 |
| 10 | Escribir los tres ADR que faltan: `0007` hosting, `0008` analítica, `0009` dominio | **Equipo** | La trazabilidad de esas tres decisiones de §6. Los seis ADR estructurales ya están escritos y aceptados |
