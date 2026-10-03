# Historias de usuario — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Estado** | Borrador para validación con Edwin Quintero |
| **Sustituye a** | [`00-fuentes/refuva-historias-usuario-v1.0.md`](./00-fuentes/refuva-historias-usuario-v1.0.md) (24 de febrero de 2026) |
| **Deriva de** | [`01-srs.md`](./01-srs.md) — módulos 3.1.x y 3.2.x, RF-01 a RF-15 |
| **Fuente de requisitos** | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) |

---

## 1. Qué cambió frente a la v1.0, y por qué

La v1.0 tenía 21 historias derivadas de un SRS que se citaba pero no existía como documento. Ese SRS
ya existe ([`01-srs.md`](./01-srs.md)) y creció de cinco requisitos funcionales a quince. Esta versión
conserva **HU-01 a HU-21 con su número y su tema**, corrige lo que quedó mal y agrega **HU-22 a
HU-38** para cubrir el resto del SRS.

Lo que se corrigió:

| Historia | Cambio | Por qué |
|---|---|---|
| HU-09 | El formulario se recorta: nombre, contacto, motivo en una línea **(opcional)**, modalidad, disponibilidad y consentimiento. Nada de diagnóstico, síntomas, medicación ni relato clínico. | X-05 y RNF-09. Lo que no se recoge no se puede filtrar. |
| HU-09 | El bloque de crisis pasa a ir **antes del primer campo**, no al final. | RF-11, X-04. |
| HU-11 | «Bandeja de consultas del CMS» se precisa: la solicitud de cita más antigua se destaca. | RF-12. |
| HU-13 | Se elimina cualquier monto sugerido para el regalo. | P-02: REFUVA no fija monto. |
| HU-12, HU-13 | Ningún dato del niño apadrinado entra al sistema. | X-06. |
| HU-14 | La exportación sale en CSV UTF-8 **con BOM**. | Excel en español rompe las tildes sin él. |
| HU-16 | Sale del alcance de v1. Ver §6. | §6.3 del SRS. |
| HU-17 | Sube de Baja a **Alta**, la misma prioridad que RF-01 tiene en el SRS. | Es donde Edwin comprueba que publicó (AC-04) y donde aterriza lo que se comparte por WhatsApp (RF-14). Si el blog no está, RF-01 no se puede dar por cumplido. |
| HU-18 | «Caducidad automática» se separa en dos operaciones distintas: **ocultar** y **borrar**, ambas existen. | C-06. Edwin pidió ocultar, no borrar. |
| HU-19 | Se traslada del módulo de Blog al módulo 3.2.1 Acceso, donde le corresponde, y se le añade segundo factor obligatorio. | RF-04. En la v1.0 estaba mal ubicada. |
| HU-21 | El mapa embebido queda condicionado a que exista dirección publicable, y se carga con clic previo. | S-05 sigue pendiente; RF-10. |
| Todas | Los criterios que decían «fácil», «claro» o «rápido» se sustituyeron por umbrales medibles. | Un criterio que se discute no es un criterio. |

Lo que se agregó: los proyectos como iguales y la historia de cada uno (HU-22), la
postulación de comunidad (HU-23), el bloque de crisis (HU-24), la bandeja (HU-25), las convocatorias
(HU-26), buscadores y compartir por WhatsApp (HU-27), las tareas programadas (HU-28), las historias
de Edwin como administrador (HU-29, HU-30, HU-32, HU-33, HU-38), los textos legales (HU-31), el
donante y el patrocinador (HU-34, HU-35), la accesibilidad real (HU-36) y la persona que llega en
crisis de madrugada (HU-37).

---

## 2. Leyenda de prioridad

| Prioridad | Qué significa **en este proyecto** |
|---|---|
| **Alta** | Sin esto el portal no cumple el motivo por el que existe (O-04) o deja a alguien sin ayuda. No se entrega el sitio sin ella. |
| **Media** | Mejora real y esperada por Edwin. El sitio puede salir sin ella una semana; no un trimestre. |
| **Baja** | Deseable. Entra si sobra tiempo antes de la entrega, o queda escrita para quien continúe. |

Una sola historia lleva la marca **Alta — bloqueante**: HU-24. No se publica el sitio sin ella, ni
siquiera para pruebas con público real.

## 3. Cómo leer cada historia

Cada historia trae su prioridad, el requisito funcional que la implementa, y el origen del requisito
con el código de [`hechos-verificados.md`](./00-fuentes/hechos-verificados.md) (`O-`, `P-`, `S-`,
`R-`, `C-`, `X-`). Los criterios de aceptación son casillas: se marcan cumplido o no cumplido, sin
que haga falta discutirlo.

Donde falta un dato de Edwin, el criterio dice **PENDIENTE** y nombra a quién le toca. Un criterio
pendiente no se marca como cumplido «porque ya casi».

---

# 4. Módulo 3.1.1 — Inicio

### HU-01 — Entender REFUVA en diez segundos

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-06, RF-14 |
| Origen | **O-04**, R-01, C-04 |

**Como** visitante que llega por primera vez, **quiero** entender en menos de diez segundos que
REFUVA no se limita a salud mental, **para** decidir si exploro más, pido ayuda o dono.

**Criterios de aceptación**

- [ ] El hero muestra un titular y un subtítulo, y el subtítulo nombra **al menos dos frentes de
      acción distintos a salud mental** (por ejemplo alimentación en calle y fiesta navideña).
- [ ] Con el viewport en **375×667 px**, el titular y el subtítulo se leen completos sin hacer scroll.
- [ ] **Todas** las entradas del catálogo están presentes en el Inicio. No una muestra, no «las principales».
- [ ] Ninguna se presenta visualmente como subordinada a otra: mismo tipo de tarjeta,
      mismo tamaño, misma jerarquía tipográfica.
- [ ] El nombre de cada línea es exactamente el de la tabla de [`../CLAUDE.md`](../CLAUDE.md) §2.
- [ ] El orden de los bloques del Inicio es configurable y lo decide Edwin (C-11), no el equipo.

---

### HU-02 — Actuar de inmediato desde la portada

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-02, RF-03, RF-09 |
| Origen | C-02, C-03 |

**Como** visitante, **quiero** ver botones claros de Donar, Agendar cita, Ser padrino y Ser
voluntario en la pantalla principal, **para** actuar sin tener que buscar dónde.

**Criterios de aceptación**

- [ ] Los **cuatro** CTA están visibles sin hacer scroll con el viewport en **375×667 px**, y también
      en escritorio a 1366×768 px.
- [ ] Cada CTA llega a su formulario o sección **en un solo clic**, sin pasar por una página
      intermedia.
- [ ] Cada CTA tiene un área táctil de al menos **24×24 px CSS** y contraste **≥ 4.5:1** contra su
      fondo.
- [ ] Los cuatro son alcanzables por teclado en orden lógico, con foco visible y sin que ningún
      elemento fijo lo tape (WCAG 2.2, 2.4.11).
- [ ] El texto de cada botón dice el verbo y el objeto («Agendar una cita»), nunca «Clic aquí» ni
      «Más información».

---

### HU-03 — Ver la actividad reciente sin salir del sitio

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-05 |
| Origen | S-08, R-08 |

**Como** visitante recurrente, **quiero** ver publicaciones recientes de Instagram en el Inicio,
**para** saber qué está haciendo la fundación ahora mismo.

**Criterios de aceptación**

- [ ] Se muestran **mínimo tres** publicaciones, cada una enlazada a la original en Instagram.
- [ ] El navegador **no hace ninguna petición a un dominio de terceros** para pintar el feed:
      verificable en la pestaña de red con el filtro por dominio.
- [ ] No se instala ninguna cookie de terceros. El sitio no necesita banner de consentimiento.
- [ ] Si la fuente falla, se muestra la última copia buena guardada. Si no hay ninguna, la sección
      **desaparece**: no queda hueco, ni esqueleto, ni mensaje de error.
- [ ] Cada imagen lleva `width` y `height`; el bloque no desplaza el contenido al cargar (CLS ≤ 0.1).
- [ ] **Un administrador puede ocultar una publicación concreta desde el panel**, y al ocultarla
      desaparece del Inicio en la siguiente carga. Es control de contenido, no comodidad: el sitio
      habla de suicidio y no puede haber material sin revisar en portada.
- [ ] Ningún token de Meta queda a cargo del equipo (X-01).

---

# 5. Módulo 3.1.2 — Nosotros

### HU-04 — Saber quién es REFUVA antes de confiarle algo

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-06 |
| Origen | O-08, C-04 |

**Como** visitante, **quiero** leer la misión, la visión y los valores de REFUVA, **para** confiar en
la seriedad de la fundación antes de donar o de pedir ayuda.

**Criterios de aceptación**

- [ ] La página muestra misión, visión y valores en secciones diferenciadas y con encabezados
      reales (`<h2>`), no en un párrafo corrido.
- [ ] El texto proviene del material oficial que entregue Edwin, no de relleno. Cero *lorem ipsum*
      y cero texto redactado por el equipo sin aprobación.
- [ ] La reseña histórica menciona los años de trayectoria de los proyectos recurrentes con el dato
      que Edwin confirme.
- [ ] **PENDIENTE (O-08): Edwin** debe entregar misión, visión, valores y logo oficial. Sin eso la
      página no se publica; queda en borrador. Pedido en [`06-inventario-contenido.md`](./06-inventario-contenido.md).

---

### HU-05 — Evaluar la trayectoria antes de patrocinar

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-06 |
| Origen | O-07, O-09 |

**Como** institución donante o patrocinadora, **quiero** ver evidencia de trayectoria y de
transparencia, **para** decidir si financio a la fundación.

**Criterios de aceptación**

- [ ] La página lista los proyectos recurrentes con su antigüedad declarada (la fiesta navideña y la
      campaña de prevención del suicidio van por su tercer año, P-02 y P-05).
- [ ] Hay al menos una galería de evidencia fotográfica por línea de acción.
- [ ] **Ninguna foto de un niño beneficiario ni de una persona en situación de calle se publica sin
      consentimiento firmado.** Si no consta el consentimiento, la foto no entra, aunque esté en el
      Instagram de la fundación.
- [ ] Los documentos de personería jurídica se muestran **solo si Edwin decide publicarlos**. Si
      decide que no, la página dice que están disponibles a solicitud y da el canal.
- [ ] **PENDIENTE (O-09, O-10): Edwin** debe decir bajo qué figura legal está registrada la fundación
      y si los documentos se publican o solo se mencionan.

---

### HU-35 — Contactar como patrocinador institucional

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-08, RF-06 |
| Origen | O-07 |

**Como** empresa o institución que evalúa financiar a REFUVA, **quiero** ver qué hace cada proyecto y
tener un canal propio para proponer un patrocinio, **para** no perderme entre los mensajes generales
de contacto.

**Criterios de aceptación**

- [ ] Existe un formulario de alianza o patrocinio distinto del contacto general (RF-10), alcanzable
      desde Nosotros y desde la página de cada proyecto.
- [ ] Campos, y solo estos: institución, tipo de institución, cargo del solicitante, contacto,
      proyecto de interés, población estimada y mensaje. Son los mismos de HU-08 y de RF-08: la
      alianza institucional y el patrocinio entran por **un único formulario**, no por dos.
- [ ] La solicitud llega a la bandeja etiquetada como `alianza`. No se mezcla con `contacto`.
- [ ] Cada página de proyecto expone al menos una cifra de alcance verificada por Edwin (por ejemplo:
      «empezamos con 50 raciones, hoy repartimos más de 100», P-03).
- [ ] Toda cifra que aparezca en el sitio se puede rastrear a un hecho de
      [`hechos-verificados.md`](./00-fuentes/hechos-verificados.md) o a un insumo firmado por Edwin.
      Una cifra sin origen no se publica.

---

# 6. Módulo 3.1.3 — Proyectos

### HU-06 — Recorrer el catálogo desde un índice

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-06 |
| Origen | **O-04**, O-05 |

**Como** visitante, **quiero** navegar los proyectos y las campañas desde una página índice,
**para** encontrar el que me interesa apoyar.

**Criterios de aceptación**

- [ ] El índice muestra **una tarjeta por entrada**, cada una con nombre, logo o imagen propia y una
      descripción de una o dos frases.
- [ ] Cada tarjeta enlaza a su página de detalle con una URL legible en español
      (`/proyectos/historias-que-sanan`), nunca `/p?id=7`.
- [ ] Todas las tarjetas tienen el mismo peso visual. Ninguna aparece como categoría contenedora de
      las demás.
- [ ] El índice es navegable por teclado y cada tarjeta es un único destino de foco.
- [ ] **PENDIENTE (P-08): Edwin** debe entregar descripción, población objetivo, requisitos de
      participación, fotos y logo de cada proyecto.

---

### HU-22 — Conocer la historia detrás de cada proyecto

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-06 |
| Origen | **O-04**, O-05, **O-06** |

**Como** visitante, **quiero** leer por qué nació cada proyecto y en honor a quién, **para** entender
que detrás de REFUVA hay historias reales y no una lista de servicios.

**Criterios de aceptación**

- [ ] Cada página de proyecto contiene, en este orden: nombre, logo propio, **su
      historia de origen y en honor a quién nació**, qué hace, a quién sirve, requisitos de
      participación, galería de evidencia y su propia acción (donar, postular, ser voluntario o
      solicitar alianza).
- [ ] La sección de historia de origen **no es opcional en el panel**: una página de proyecto sin ese
      campo no se puede pasar a estado `publicado`.
- [ ] La historia se cuenta en primera persona de la fundación y sin lenguaje clínico.
- [ ] En las páginas de `campanas/hablame-panama`, `campanas/escuchame-panama`, `psicoeducativo`
      e `historias-que-sanan` se aplica la
      guía de mensajes seguros de [`../CLAUDE.md`](../CLAUDE.md) §5.1: cero métodos, cero lugares,
      cero cifras sensacionalistas, y las expresiones «cometió suicidio», «suicidio exitoso» y
      «suicidio fallido» no aparecen en ninguna página del sitio.
- [ ] Toda página etiquetada como salud mental cierra con el bloque de crisis (HU-24) y con un
      mensaje de esperanza.
- [ ] Cada imagen de la galería tiene texto alternativo. **Sin texto alternativo no se puede
      publicar** (RF-01).
- [ ] **PENDIENTE (O-06, P-08): Edwin** debe entregar la historia de origen de cada entrada.
      Tres están confirmadas: Otilia, Jessica y la pandemia.
      Es el material que más diferencia al sitio y es el que no podemos escribir por él.

---

### HU-07 — Saber si mi comunidad puede aplicar a la convocatoria navideña

| | |
|---|---|
| Prioridad | **Alta** (estacional) |
| Implementa | RF-07, RF-13 |
| Origen | P-02 |

**Como** miembro de una comunidad vulnerable, **quiero** ver los requisitos de la convocatoria
navideña antes de llenar nada, **para** saber si tiene sentido postular.

**Criterios de aceptación**

- [ ] Los requisitos de vulnerabilidad se listan **explícitamente y por encima del formulario**, no
      después ni en un enlace aparte.
- [ ] La página indica el estado de la convocatoria: **abierta** o **cerrada**, con la fecha de
      cierre visible cuando está abierta.
- [ ] Si está cerrada, no se muestra el formulario. Se explica cuándo vuelve a abrir y se ofrece un
      canal para avisar.
- [ ] El texto de los requisitos es editable desde el panel (3.2.5). No está quemado en el código.
- [ ] El nivel de lectura del texto de requisitos es de escuela primaria alta: frases cortas, voz
      activa, sin siglas sin explicar.
- [ ] **PENDIENTE (P-02): Edwin** debe entregar la lista literal de requisitos. Lo que sabemos hoy es
      el criterio de fondo —«un lugar en estado de vulnerabilidad real donde los niños nunca han
      vivido esa magia»— pero no la lista formal.

---

### HU-08 — Solicitar alianza desde la página del proyecto

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-08 |
| Origen | P-01 |

**Como** escuela interesada en el Proyecto Psicoeducativo REFUVA, **quiero** solicitar la alianza
desde la página del proyecto, **para** iniciar contacto formal sin escribir a un WhatsApp personal.

**Criterios de aceptación**

- [ ] La página del proyecto tiene su propio formulario o botón de alianza, distinto del contacto
      general (RF-10).
- [ ] Es **el mismo formulario de alianza de HU-35**, alcanzable desde la página del proyecto y con el
      proyecto de interés ya preseleccionado. Los campos se definen en HU-35 y no se repiten aquí.
- [ ] La solicitud entra a la bandeja etiquetada como `alianza` y con el proyecto asociado.
- [ ] El listado de las más de 30 escuelas en espera (P-01) **no se publica** mientras Edwin no
      confirme que puede hacerse público.
- [ ] **PENDIENTE:** Edwin decide si esa lista es pública o privada.

---

# 7. Módulo 3.1.4 — Agendamiento de citas

> Este módulo se lee de arriba abajo en el mismo orden en que se construye la pantalla: primero el
> bloque de crisis, después el formulario. No al revés.

### HU-24 — Encontrar ayuda inmediata, antes que cualquier formulario

| | |
|---|---|
| Prioridad | **Alta — bloqueante para lanzar** |
| Implementa | RF-11 |
| Origen | **X-04**, P-05 |

**Como** persona en riesgo, o alguien que acompaña a una persona en riesgo, **quiero** ver de
inmediato a quién llamar ahora mismo, **para** no tener que leer, decidir ni llenar nada antes de
recibir ayuda.

Es la historia más importante de este documento. Todas las demás se pueden aplazar. Esta no.

**Criterios de aceptación**

- [ ] El bloque muestra **exactamente estos dos recursos y ninguno más**:
      - **911** — emergencia con riesgo vital inminente.
      - **Línea 147 del MIDES** — gratuita, confidencial, 24 horas los 365 días. WhatsApp **6694-2747**.
- [ ] **La 169 del MINSA y los números del INSAM no aparecen.** Buscar «169» e «INSAM» en el HTML
      servido de todo el sitio devuelve cero resultados. Están en conflicto entre fuentes y sin
      verificar; un número equivocado en una página de prevención del suicidio hace daño real.
- [ ] Cada número es **texto real seleccionable y además enlace**: `tel:911`, `tel:147` y
      `https://wa.me/50766942747` (507 + 6694-2747). Ningún número dentro de una imagen: una imagen
      no la lee un lector de pantalla y no se puede tocar.
      **Nota:** el número **6694-2747 está verificado**; lo que falta comprobar es **la forma del
      enlace**. Antes de publicar hay que abrir `https://wa.me/50766942747` en Android y en iOS y ver
      que cae en el chat correcto de la Línea 147.
- [ ] El bloque se renderiza en el HTML que devuelve el servidor y **sigue siendo legible y clicable
      con JavaScript desactivado**.
- [ ] En el formulario de cita, el bloque aparece **antes del primer campo**. Con el viewport en
      **375×667 px** y sin hacer scroll se leen el 911 y el 147.
- [ ] En la misma vista, y sin scroll, aparece la frase «Este formulario no es un canal de
      emergencia».
- [ ] **Banda de una línea** —911, 147 y enlace al bloque completo— en el armazón de **todas** las
      páginas del sitio. El Inicio lleva la banda, **no** el bloque completo.
- [ ] **Bloque completo** en: `/agendar-cita`, `/ayuda-en-crisis`, y las páginas de proyecto y las
      entradas de noticias **etiquetadas como salud mental** (`hablame-panama`, `escuchame-panama`, `psicoeducativo`,
      `rompiendo-el-circulo`, `historias-que-sanan`). El sistema lo inserta por etiqueta, de modo que
      Edwin no pueda olvidarlo al publicar. Esta lista es la única: no se agregan ubicaciones sueltas
      ni se quita ninguna sin cambiar esta historia.
- [ ] Contraste **≥ 4.5:1** en el texto y **≥ 3:1** en los bordes de los enlaces. Área táctil
      **≥ 24×24 px CSS** en cada uno.
- [ ] El texto es legible sin hacer zoom, y con zoom al 200% no se pierde contenido ni aparece scroll
      horizontal.
- [ ] El contenido del bloque es editable desde Ajustes (3.2.7) y el panel muestra la **fecha de
      última verificación** de cada número.
- [ ] Si un administrador vacía el contenido del bloque, el sitio muestra el texto por defecto
      verificado. **Nunca se sirve un bloque de crisis vacío.**
- [ ] Queda registrado en el repositorio en qué fecha se verificó cada número, con un recordatorio de
      revalidación semestral en [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).

---

### HU-37 — Llegar en crisis a las dos de la mañana

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-11, RF-02 |
| Origen | **X-04**, P-05, S-03 |

**Como** persona en crisis a las dos de la mañana, cuando no hay a quién llamar y el sitio de REFUVA
es lo único que está abierto, **quiero** encontrar en la primera pantalla algo que pueda hacer ahora,
**para** no quedarme sola con la sensación de que tampoco aquí hay nadie.

**Criterios de aceptación**

- [ ] Ninguna página de salud mental responde con un horario de atención como única salida. El bloque
      de crisis declara literalmente que el 147 y el 911 atienden **24 horas, todos los días**.
- [ ] Desde cualquier página del sitio, el bloque de crisis se alcanza **con un solo toque** desde la
      banda persistente del armazón (HU-24). En el Inicio la banda está por encima del pliegue; en el
      formulario de cita y en la página de `campanas/hablame-panama` lo está el bloque completo, en
      375×667 px.
- [ ] La página de crisis carga y es usable **con JavaScript desactivado**. Se verifica desactivando
      JS en el navegador y comprobando que los enlaces `tel:` y `wa.me` funcionan.
- [ ] El formulario de cita muestra el **plazo real de respuesta** y dice **qué días no se revisa**.
      No se promete una respuesta que no se va a cumplir a esa hora.
- [ ] Existe una casilla opcional «Necesito atención pronto» que marca el asunto del correo a la
      administración, **sin prometer respuesta inmediata**.
- [ ] **No hay chatbot ni autorespuesta que simule contención emocional.** Un mensaje automático que
      finge escuchar es peor que ninguno.
- [ ] El precio de **B/.15.00** (S-01) va acompañado, en la misma vista, de la aclaración de que el
      147 y el 911 son gratuitos y de que el dinero nunca debe frenar a alguien en crisis (S-03).
- [ ] El mensaje de confirmación en pantalla, tras enviar, repite el bloque de crisis. La persona no
      queda en una pantalla vacía que solo dice «gracias».
- [ ] **PENDIENTE (S-05): Edwin** debe fijar el plazo de respuesta, los días sin revisión, y el
      protocolo interno de qué se hace cuando llega una solicitud con riesgo declarado.

---

### HU-09 — Solicitar una cita sin depender de WhatsApp

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-02 |
| Origen | S-04, R-03, C-03 |

**Como** persona que necesita apoyo psicológico, **quiero** llenar un formulario con mis datos,
motivo, horario y modalidad, **para** solicitar una cita sin depender únicamente de WhatsApp.

**Criterios de aceptación**

- [ ] Campos, y solo estos: nombre o seudónimo, forma de contacto preferida, correo, teléfono,
      **motivo de consulta en una línea (opcional)**, modalidad (virtual o presencial), disponibilidad
      horaria y consentimiento.
- [ ] El **motivo de consulta es opcional**, y su etiqueta lo dice con esa palabra. La solicitud se
      envía y se guarda con el campo vacío; ninguna validación lo exige, ni en cliente ni en servidor.
      Manda la minimización de datos (RNF-09 de
      [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md)): nadie tiene que
      explicar por qué necesita ayuda para poder pedirla.
- [ ] **No se pide** diagnóstico, síntomas, medicación ni relato clínico (X-05). El campo de motivo
      está rotulado de forma explícita para que no se incluyan detalles médicos.
- [ ] Cada campo tiene **etiqueta visible permanente**, no solo texto de marcador que desaparece al
      escribir (WCAG 2.2, 3.3.2).
- [ ] La validación corre en cliente y en servidor **con el mismo esquema**. Los mensajes de error
      están en español, junto al campo, y dicen qué hacer.
- [ ] Al enviar, la solicitud se **guarda en la base de datos antes** de disparar cualquier correo.
      Si el correo falla, la solicitud existe igual y queda marcada para reintento.
- [ ] Se comprueba cortando la automatización: la solicitud se guarda y queda como pendiente de
      notificar (AC-03 del SRS).
- [ ] La casilla de consentimiento está **sin premarcar**, en lenguaje llano, con enlace a la
      política de privacidad (HU-31).
- [ ] Convive un **botón directo a WhatsApp**, que complementa el formulario y no lo reemplaza.
- [ ] La protección contra envíos automatizados **no usa CAPTCHA visual**. Alguien en crisis no
      debería descifrar imágenes para pedir ayuda (WCAG 2.2, 3.3.8).
- [ ] La solicitud nace con estado `pendiente` en la bandeja (HU-25).
- [ ] El formulario **no reserva un horario**. La pantalla dice que es una solicitud y que REFUVA
      confirma después. Ver [`adr/0004-agendamiento-por-solicitud.md`](./adr/0004-agendamiento-por-solicitud.md).
- [ ] **PENDIENTE (S-05, S-07): Edwin** debe confirmar modalidad ofrecida, horarios, dirección
      publicable y el número de WhatsApp empresarial que se publica.

---

### HU-10 — Tener certeza de que la solicitud llegó

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-02 |
| Origen | R-03, C-03 |

**Como** persona que acaba de enviar una solicitud, **quiero** recibir un correo de confirmación,
**para** saber que mi mensaje no se perdió.

**Criterios de aceptación**

- [ ] El correo de confirmación sale al solicitante en **menos de un minuto** desde el envío.
- [ ] El correo contiene: confirmación de recibido, plazo estimado de respuesta, el recordatorio de
      que no es un canal de emergencia y **el bloque de crisis con el 911 y el 147**.
- [ ] El correo **sí puede devolverle a la persona lo que ella misma escribió** —motivo, modalidad y
      disponibilidad—, porque es su propio dato y va a su propio buzón (RNF-14). El que **nunca**
      lleva el contenido del formulario es el aviso a la administración (HU-11).
- [ ] La pantalla de confirmación dice lo mismo que el correo, para quien no dio correo o no lo
      revisa.
- [ ] Si el envío del correo falla, el sistema lo reintenta (RF-15) y la solicitud queda marcada en
      el panel como **pendiente de notificar**. Nunca falla en silencio.
- [ ] El remitente es el dominio de la fundación, no un Gmail personal. Ver
      [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md).
- [ ] **PENDIENTE: Edwin** debe fijar el plazo de respuesta que se promete en ese correo.

---

### HU-11 — Recibir cada solicitud en el correo institucional

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-02, RF-12 |
| Origen | S-04, R-03 |

**Como** Edwin o quien administre las consultas, **quiero** que cada solicitud me llegue por correo
y quede registrada, **para** darle seguimiento sin depender de mi chat personal.

**Criterios de aceptación**

- [ ] Toda solicitud dispara un correo a la administración en **menos de un minuto**.
- [ ] El correo avisa de que hay una solicitud nueva y **enlaza al panel autenticado**. Los datos
      completos se leen en el panel, no en el cuerpo del correo.
- [ ] La solicitud aparece en la bandeja con estado `pendiente` y con la fecha y hora de recepción en
      zona horaria `America/Panama`.
- [ ] Si la automatización de correo está caída, la solicitud sigue visible en la bandeja y marcada
      como pendiente de notificar.
- [ ] El envío respeta el tope diario del proveedor de correo; al acercarse al límite, la
      notificación a la administración tiene prioridad sobre cualquier otro envío. Límites en
      [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md).

---

# 8. Módulo 3.1.5 — Voluntariado y apadrinamiento

### HU-12 — Ofrecerse como voluntario indicando en qué se puede ayudar

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-03 |
| Origen | O-03, C-03, R-05 |

**Como** persona que quiere ayudar, **quiero** inscribirme como voluntario indicando mi área,
**para** que la fundación sepa exactamente cómo puedo servir.

**Criterios de aceptación**

- [ ] El formulario ofrece **áreas de interés en selección múltiple**: redes sociales, diseño,
      logística, psicología, escritura, transporte, cocina y «otra» con campo de texto.
- [ ] El registro queda clasificado automáticamente por área y por programa, sin que nadie lo
      etiquete a mano.
- [ ] Campos además del área: nombre, contacto, disponibilidad y consentimiento sin premarcar.
- [ ] No se piden documentos de identidad, dirección ni datos de terceros.
- [ ] El área «redes sociales» existe de forma explícita, porque es la ayuda que Edwin lleva tiempo
      buscando sin encontrar (O-03).

---

### HU-13 — Apadrinar a un niño para la fiesta navideña

| | |
|---|---|
| Prioridad | **Alta** (estacional) |
| Implementa | RF-03, RF-13 |
| Origen | P-02 |

**Como** persona interesada, **quiero** inscribirme como padrino o madrina, **para** participar en la
campaña navideña sin escribirle directamente a Edwin.

**Criterios de aceptación**

- [ ] Campos: datos de contacto, disponibilidad, cómo entregará el regalo y consentimiento.
- [ ] El registro se clasifica bajo el programa `navidad`.
- [ ] **No se muestra ningún monto sugerido, mínimo ni rango.** El texto dice que el regalo es
      «conforme a lo que salga de su corazón» (P-02). REFUVA no fija monto.
- [ ] **No se recoge ningún dato del niño apadrinado** (X-06). No existe tabla de niños. El
      emparejamiento ocurre fuera de línea. Verificable contra el esquema de
      [`07-modelo-datos.md`](./07-modelo-datos.md).
- [ ] El formulario solo acepta envíos si la convocatoria está abierta (HU-26).
- [ ] Los padrinos **no se listan públicamente** mientras Edwin no lo autorice por escrito.
- [ ] **PENDIENTE: Edwin** debe decidir si quiere reconocer públicamente a los padrinos o mantenerlos
      anónimos.

---

### HU-23 — Postular a mi comunidad a la convocatoria navideña

| | |
|---|---|
| Prioridad | **Alta** (estacional) |
| Implementa | RF-07 |
| Origen | P-02 |

**Como** persona que vive en una comunidad donde los niños nunca han vivido la Navidad, **quiero**
postular a mi comunidad, **para** que REFUVA la considere para la fiesta de este año.

**Criterios de aceptación**

- [ ] Los requisitos (HU-07) se leen **antes** del primer campo. El formulario está debajo, no
      arriba.
- [ ] Campos: quién postula, su relación con la comunidad, ubicación, **número aproximado de niños**,
      por qué cumple los requisitos y contacto.
- [ ] El campo de cantidad acepta un **número aproximado**. No hay lista nominal de niños, ni nombres,
      ni edades individuales, ni fotos (X-06).
- [ ] El formulario se muestra solo si la convocatoria está abierta. Cerrada, se explica cuándo
      vuelve a abrir.
- [ ] La postulación entra a la bandeja etiquetada como `postulacion-comunidad`, separada de
      voluntarios y padrinos.
- [ ] El postulante recibe confirmación por correo con el plazo en que se le responderá.
- [ ] El texto explica **qué pasa después**: quién revisa, en cuánto tiempo y qué significa que la
      comunidad sea seleccionada. Postular no equivale a ser elegido, y eso se dice.

---

### HU-14 — Exportar voluntarios y padrinos por programa

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-03 |
| Origen | P-02, C-03 |

**Como** Edwin, **quiero** exportar la lista de voluntarios y padrinos segmentada por programa,
**para** organizar la logística de cada campaña con una hoja de cálculo.

**Criterios de aceptación**

- [ ] Se puede exportar filtrando por programa (`una-estrella-otiliana`, `comida-en-la-calle`,
      `psicoeducativo`, y el resto del catálogo) y por rango de fechas.
- [ ] El archivo sale en **CSV con codificación UTF-8 y BOM**, de modo que Excel en español abra las
      tildes y la ñ correctamente sin configurar nada.
- [ ] La descarga exige sesión iniciada. Un enlace de exportación abierto en una ventana sin sesión
      devuelve error, no el archivo.
- [ ] Cada exportación queda en la bitácora: quién la hizo, cuándo, qué filtro usó y cuántas filas
      salieron.
- [ ] La exportación **no incluye ninguna columna con datos de menores**, porque no existen.
- [ ] Edwin logra exportar por su cuenta durante la capacitación, sin ayuda del equipo.

---

# 9. Módulo 3.1.6 — Donaciones

### HU-15 — Donar sin fricción y sin registrarse

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-09 |
| Origen | S-06 |

**Como** donante, **quiero** ver el Yappy y las cuentas bancarias de la fundación, **para** donar por
transferencia ahora mismo desde el teléfono.

**Criterios de aceptación**

- [ ] El alias de Yappy Comercial y su **código QR** están visibles, y el QR se puede descargar.
- [ ] Los datos de transferencia aparecen completos —banco, tipo de cuenta, número y titular
      exactamente como figura en el banco— y **cada uno tiene botón de copiar**.
- [ ] Al tocar «copiar» aparece una confirmación visible; también funciona con teclado.
- [ ] **Nada de esto exige formulario, registro ni correo.** Se llega a los datos sin escribir una
      sola letra.
- [ ] Hay un canal declarado para enviar el comprobante y pedir recibo.
- [ ] Los datos bancarios **no están quemados en el código**: se leen de Ajustes (HU-29).
- [ ] El sitio **no procesa, no transmite y no almacena ningún dato de tarjeta**. Verificable: no
      existe campo de tarjeta en ningún formulario del sitio.
- [ ] **PENDIENTE (S-06, A-02): Edwin** debe entregar las cuentas y confirmar si existe cuenta
      comercial en Banco General a nombre de la fundación con Banca en Línea Comercial activa. Sin
      eso no hay Yappy Comercial y la página sale solo con transferencia.

---

### HU-34 — Saber en qué se convierte lo que dono

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-09, RF-06 |
| Origen | O-07, C-02 |

**Como** donante individual que no conoce la fundación, **quiero** ver qué hace REFUVA con el dinero
y qué logra cada aporte, **para** donar con confianza en vez de con duda.

**Criterios de aceptación**

- [ ] La página de donaciones explica a qué se destina el dinero, por línea de acción, con texto
      aprobado por Edwin.
- [ ] Si se muestran equivalencias de impacto («con X se cubre una ración»), cada una está respaldada
      por un dato que Edwin confirme. **Si no hay dato confirmado, no se muestra la equivalencia.**
- [ ] Hay al menos un enlace desde donaciones a la evidencia fotográfica de actividades ya
      realizadas.
- [ ] La página nombra todos los proyectos y permite dirigir la donación mencionando el proyecto en el
      mensaje de la transferencia.
- [ ] No se usa lenguaje de culpa ni imágenes de sufrimiento explícito para presionar. La invitación
      se hace desde lo que la fundación logra, no desde el dolor de un beneficiario.
- [ ] **PENDIENTE: Edwin** debe aprobar el texto de destino de fondos y decidir si publica cifras.

---

# 10. Módulo 3.1.7 — Blog y noticias

### HU-17 — Leer noticias y contenido psicoeducativo

| | |
|---|---|
| Prioridad | **Alta** *(sube de Baja en la v1.0)* |
| Implementa | RF-01, RF-14 |
| Origen | R-02, C-02 |

**Como** visitante, **quiero** leer publicaciones psicoeducativas y noticias de actividades, **para**
mantenerme informado sin depender solo de Instagram.

**Criterios de aceptación**

- [ ] El listado muestra fecha, imagen y resumen de cada publicación.
- [ ] Las publicaciones se pueden filtrar por proyecto usando los códigos del catálogo.
- [ ] Cada artículo tiene URL propia y legible en español.
- [ ] Toda imagen lleva `width`, `height` y texto alternativo.
- [ ] Los eventos vencidos no aparecen entre los próximos, pero **siguen siendo accesibles** por su
      URL y desde el archivo (RF-01). Ocultar no es borrar.
- [ ] Toda entrada etiquetada como salud mental muestra el bloque de crisis (HU-24) y cierra con un
      mensaje de esperanza.
- [ ] Un artículo se lee completo con el texto ampliado al 200%, sin scroll horizontal.

---

# 11. Módulo 3.1.8 — Contacto

### HU-20 — Escribir un mensaje general

| | |
|---|---|
| Prioridad | **Baja** |
| Implementa | RF-10 |
| Origen | Módulo 3.1.8 |

**Como** visitante, **quiero** enviar un mensaje general a la fundación, **para** preguntar lo que no
encuentro en el sitio.

**Criterios de aceptación**

- [ ] El mensaje llega al correo institucional **y** queda guardado en la bandeja. El correo puede
      perderse; la base de datos no.
- [ ] Campos: nombre, correo o teléfono, asunto, mensaje y consentimiento sin premarcar.
- [ ] El formulario avisa de forma visible que **no es el canal para pedir una cita ni para una
      emergencia**, y enlaza a HU-09 y al bloque de crisis.
- [ ] La confirmación en pantalla indica el plazo de respuesta.
- [ ] Entra a la bandeja etiquetado como `contacto`, separado de citas, alianzas y postulaciones.

---

### HU-21 — Elegir el canal de contacto que prefiero

| | |
|---|---|
| Prioridad | **Baja** |
| Implementa | RF-10 |
| Origen | S-07, S-08 |

**Como** visitante, **quiero** ver los accesos directos a los canales de mensajería y, si existe, la
ubicación física, **para** contactar por donde me resulta cómodo.

**Criterios de aceptación**

- [ ] Botones directos a WhatsApp e Instagram, con el número y el usuario visibles como texto además
      del enlace.
- [ ] El correo institucional aparece como texto seleccionable y como enlace `mailto:`.
- [ ] El **mapa embebido se muestra solo si hay dirección publicable**. Si no la hay, no se muestra
      un mapa genérico ni un marcador aproximado.
- [ ] Si se embebe el mapa, se carga **con clic previo**: hasta que el visitante lo pide, no se
      contacta a ningún dominio de terceros ni se instala ninguna cookie.
- [ ] **PENDIENTE (S-05, S-07): Edwin** debe confirmar si hay dirección física publicable y cuál es
      el número de WhatsApp empresarial.

---

# 12. Módulo 3.1.9 — Legales

### HU-31 — Entender qué hacen con mis datos antes de darlos

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | Módulo 3.1.9, §6.2 del SRS |
| Origen | X-05, X-04 |

**Como** persona que va a escribir su nombre, su teléfono y el motivo por el que necesita ayuda,
**quiero** saber en lenguaje llano qué se guarda, quién lo ve y cuánto tiempo se conserva, **para**
decidir con información si envío el formulario.

**Criterios de aceptación**

- [ ] Existe una política de privacidad enlazada desde **cada** casilla de consentimiento del sitio.
- [ ] La política dice, sin tecnicismos: qué datos se recogen, para qué, quién los ve, cuánto tiempo
      se conservan y cómo pedir que se borren. Los plazos de conservación son los de
      [`07-modelo-datos.md`](./07-modelo-datos.md); aquí no se repiten cifras, se enlazan.
- [ ] La política declara que **nadie fuera de los administradores autenticados ve una solicitud**.
- [ ] Los términos de uso declaran de forma explícita que **el portal no presta atención psicológica
      en línea y no es un canal de emergencia**, con el bloque de crisis al lado.
- [ ] El texto se lee al nivel de escuela primaria alta: frases cortas, voz activa, cero
      «notificamos al titular del tratamiento».
- [ ] Ninguna página del sitio cita leyes nacionales de protección de datos. El encuadre es de ética
      profesional y buena práctica de ingeniería.
- [ ] **PENDIENTE: el asesor legal de la fundación** debe revisar y aprobar el texto antes de
      publicarlo. El equipo redacta el borrador técnico; no da asesoría jurídica.

---

# 13. Módulo 3.2.1 — Acceso al panel

### HU-19 — Entrar al panel con credenciales protegidas

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-04 |
| Origen | R-04, C-10 |

**Como** administrador, **quiero** entrar al panel con mis credenciales, **para** que solo personal
autorizado edite el contenido y vea las solicitudes.

**Criterios de aceptación**

- [ ] El panel **exige autenticación antes de mostrar cualquier función de edición**. Abrir una URL
      del panel sin sesión redirige al acceso, no muestra la pantalla ni por un instante.
- [ ] Soporta **más de un administrador con acceso independiente**. Nadie comparte una cuenta.
- [ ] Las contraseñas se guardan con hash y sal del proveedor de identidad. Nunca en claro, nunca en
      un correo.
- [ ] **Segundo factor obligatorio** para toda cuenta administradora.
- [ ] El acceso **no exige resolver acertijos ni CAPTCHA cognitivo** (WCAG 2.2, 3.3.8).
- [ ] La sesión expira y existe un botón de cerrar sesión visible en toda pantalla del panel.
- [ ] **Row Level Security activa en toda tabla con datos de personas.** Se prueba con un usuario que
      *no* debería ver el dato y se comprueba que no lo ve.
- [ ] Queda bitácora de accesos y de cambios de contenido, con usuario y fecha.
- [ ] El panel está **en español**, sin términos técnicos sin explicar. «CMS» no aparece en la
      interfaz; se llama «panel».

---

### HU-32 — Recuperar el acceso si pierdo el teléfono

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-04 |
| Origen | X-01, X-03, C-10 |

**Como** Edwin, **quiero** poder recuperar el acceso al panel si pierdo o me roban el teléfono con el
segundo factor, **para** no quedarme fuera de mi propio sitio cuando el equipo ya no esté.

**Criterios de aceptación**

- [ ] Al activar el segundo factor, el sistema entrega **códigos de respaldo de un solo uso** y
      obliga a confirmar que se guardaron antes de continuar.
- [ ] Existe un procedimiento escrito de recuperación en
      [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md), en español, paso a paso, que
      Edwin pueda seguir solo.
- [ ] El procedimiento **no depende de escribirle a ningún estudiante del equipo** (X-01).
- [ ] Hay **al menos dos administradores activos** desde el lanzamiento, de modo que uno pueda
      reponer el acceso del otro (C-10).
- [ ] La cuenta de correo asociada al panel es del dominio de la fundación, no un Gmail personal.
- [ ] La recuperación queda en la bitácora: quién la solicitó, quién la aprobó y cuándo.
- [ ] Edwin **ejecuta el procedimiento completo durante la capacitación**, con el teléfono apagado.
      No se da por bueno leyéndolo.

---

### HU-33 — Ver al entrar qué necesita mi atención

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-12, RF-04 |
| Origen | X-03, R-02 |

**Como** Edwin, que entro al panel cada dos o tres semanas y no recuerdo dónde estaba nada, **quiero**
que la primera pantalla me diga qué está esperando por mí, **para** no tener que recorrer menús para
descubrirlo.

**Criterios de aceptación**

- [ ] La primera pantalla tras iniciar sesión muestra, sin hacer scroll en un portátil de 1366×768 px:
      el número de **solicitudes de cita pendientes**, el de voluntarios, padrinos, postulaciones y
      mensajes nuevos, y el estado de las convocatorias abiertas.
- [ ] La **solicitud de cita pendiente más antigua** se muestra destacada, con los días que lleva
      esperando.
- [ ] Cada contador es un enlace que lleva a su bandeja ya filtrada.
- [ ] Si hay tareas programadas que fallaron (RF-15), se avisa aquí, no en un registro escondido.
- [ ] Si hay solicitudes pendientes de notificar por fallo de correo, se avisa aquí.
- [ ] Cada acción principal del panel es alcanzable desde esta pantalla en **un máximo de dos clics**.
- [ ] Edwin encuentra por su cuenta, sin ayuda, dónde se agrega una noticia y dónde se ve una
      solicitud, durante la prueba piloto (C-08).

---

# 14. Módulo 3.2.2 — Contenido

### HU-18 — Publicar y ocultar contenido sin llamar al equipo

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-01 |
| Origen | R-02, **C-06**, C-08 |

**Como** administrador, **quiero** crear, editar, publicar, ocultar y archivar una noticia o un
evento, **para** mantener la web actualizada sin depender del equipo de desarrollo.

**Criterios de aceptación**

- [ ] Un contenido tiene estado `borrador`, `publicado` o `archivado`, y el estado se ve en el
      listado sin abrir el elemento.
- [ ] **Ocultar y borrar son operaciones distintas y ambas existen.** Ocultar deja el contenido
      recuperable; borrar pide confirmación explícita y dice que no hay vuelta atrás.
- [ ] Un evento tiene `fecha_inicio` y opcionalmente `fecha_fin`. Al pasar la fecha deja de listarse
      entre los próximos **sin borrarse ni requerir que nadie entre a apagarlo**.
- [ ] El editor permite negrita, cursiva, títulos, listas, enlaces e imágenes.
- [ ] **El texto alternativo de cada imagen es obligatorio para publicar.** Sin él, el botón de
      publicar no se activa y se explica por qué.
- [ ] Cada publicación registra quién la hizo y cuándo.
- [ ] Las imágenes se comprimen y redimensionan al subirlas, para no agotar el almacenamiento.
      Límites en [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md).
- [ ] Al etiquetar una entrada como salud mental, el bloque de crisis se inserta automáticamente y el
      administrador **no puede quitarlo**.
- [ ] **Prueba de aceptación (AC-04 del SRS, C-08): Edwin agrega una noticia y luego la oculta, él
      solo, sin que nadie del equipo toque el teclado ni le dicte los pasos.** Si necesita ayuda, el
      criterio no está cumplido y se rediseña la pantalla.

---

# 15. Módulo 3.2.3 — Proyectos

### HU-38 — Editar la página de un proyecto

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-06 |
| Origen | O-05, O-06, C-07 |

**Como** administrador, **quiero** editar el texto, la galería y la acción de cada entrada del
catálogo, **para** que un proyecto que cambia no obligue a llamar a un programador.

**Criterios de aceptación**

- [ ] Se pueden editar, por proyecto: nombre visible, descripción corta, historia de origen, texto
      largo, población objetivo, requisitos de participación, logo, galería y la acción principal.
- [ ] Se puede reordenar la galería y quitar una foto sin borrarla del almacenamiento.
- [ ] La acción principal se elige de una lista (donar, ser voluntario, apadrinar, postular
      comunidad, solicitar alianza), no se escribe una URL a mano.
- [ ] **No se puede eliminar una entrada del catálogo desde el panel.** Se puede dejar de mostrar.
      Borrarla por accidente rompería el requisito raíz (O-04).
- [ ] Al dejar de mostrar un proyecto, el Inicio deja de enlazarlo pero el sitio **avisa en el panel**
      de que ya no se muestra el catálogo completo.
- [ ] Los cambios se ven en el sitio público sin necesidad de un despliegue.
- [ ] Cada cambio queda en la bitácora con autor y fecha.

---

# 16. Módulo 3.2.4 — Bandeja de solicitudes

### HU-25 — Trabajar la bandeja sin que nadie se quede atrás

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-12 |
| Origen | C-03, R-03, S-04 |

**Como** administrador, **quiero** ver, filtrar y cambiar el estado de todo lo que entra por
formularios, **para** que ninguna persona quede sin respuesta.

**Criterios de aceptación**

- [ ] Hay una bandeja por tipo: citas, voluntarios, padrinos, postulaciones de comunidad, alianzas y
      contacto. Cada una con su **contador de pendientes visible al entrar**.
- [ ] Estados disponibles: `pendiente` → `en gestión` → `atendida` / `cerrada sin atender`. El cambio
      de estado se hace en un clic desde el listado.
- [ ] **Las solicitudes de cita se ordenan por antigüedad y la más antigua aparece destacada**, con
      los días que lleva esperando. Alguien pidiendo ayuda psicológica no puede quedar sepultado bajo
      inscripciones de voluntariado.
- [ ] Filtros por estado, por programa y por rango de fechas. Búsqueda por nombre o contacto.
- [ ] Cada solicitud admite una **nota interna** con autor y fecha.
- [ ] Cada apertura de una solicitud queda en la bitácora: quién la vio y cuándo.
- [ ] Ninguna solicitud es visible sin sesión iniciada. Se prueba con un usuario sin permiso y se
      comprueba que la consulta devuelve cero filas (RLS, AC-06).
- [ ] Al vencer el plazo de conservación de una solicitud, se borra de verdad. Plazos en
      [`07-modelo-datos.md`](./07-modelo-datos.md).
- [ ] Semanalmente llega un aviso si alguna solicitud lleva más de siete días en `pendiente` (RF-15).

---

# 17. Módulo 3.2.5 — Convocatorias

### HU-26 — Abrir y cerrar una convocatoria

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-13 |
| Origen | P-02, C-07 |

**Como** administrador, **quiero** abrir y cerrar convocatorias con sus fechas, **para** que el sitio
deje de recibir inscripciones cuando corresponde sin que yo tenga que acordarme.

**Criterios de aceptación**

- [ ] Una convocatoria pertenece a un proyecto y tiene fecha de apertura, fecha de cierre y estado.
- [ ] Al abrirla, el formulario asociado aparece en el sitio público en la siguiente carga.
- [ ] Al cerrarla, el formulario **deja de aceptar envíos** y en su lugar se explica por qué está
      cerrada y cuándo vuelve a abrir.
- [ ] El **cierre por fecha ocurre solo**, sin que nadie entre a apagarlo (RF-15).
- [ ] Un envío que llegue después del cierre se rechaza en el servidor, no solo en el navegador.
- [ ] Las convocatorias cerradas se conservan con sus inscripciones. Cerrar no borra.
- [ ] Puede haber dos convocatorias abiertas a la vez para el mismo proyecto: la fiesta navideña
      tiene la de comunidades y la de padrinos, y son independientes (P-02).
- [ ] Edwin abre y cierra una convocatoria de prueba por su cuenta durante la capacitación.

---

# 18. Módulo 3.2.6 — Exportación

Cubierto por **HU-14** (ver §8). No hay historia adicional: la exportación existe para las bandejas
de voluntarios y padrinos, y el mismo criterio de CSV UTF-8 con BOM y de sesión obligatoria aplica a
cualquier otra bandeja que se exporte.

---

# 19. Módulo 3.2.7 — Ajustes

### HU-29 — Cambiar los datos bancarios sin llamar a nadie

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-09, RF-11 |
| Origen | S-06, X-01, R-02 |

**Como** Edwin, **quiero** cambiar yo mismo la cuenta bancaria, el alias de Yappy, el WhatsApp y los
textos del bloque de crisis, **para** que un cambio de banco no deje el sitio con datos equivocados
después de que el equipo se haya ido.

**Criterios de aceptación**

- [ ] Desde Ajustes se editan: banco, tipo de cuenta, número, titular, alias de Yappy, imagen del QR,
      correo institucional, WhatsApp, Instagram, dirección (si existe) y los textos del bloque de
      crisis.
- [ ] **Ninguno de esos valores está escrito en el código.** Se comprueba buscando el número de
      cuenta en el repositorio: cero resultados.
- [ ] Al guardar, el cambio se refleja en el sitio público sin necesidad de un despliegue.
- [ ] Antes de guardar, el panel **muestra una vista previa** de cómo quedará el bloque de datos
      bancarios y pide confirmación. Un dígito equivocado en un número de cuenta envía dinero a otra
      persona.
- [ ] Cada cambio queda en la bitácora con el valor anterior, el nuevo, el autor y la fecha.
- [ ] Los números del bloque de crisis muestran su **fecha de última verificación** y un aviso cuando
      pasan seis meses sin revalidarse.
- [ ] Vaciar un campo del bloque de crisis no deja el sitio sin recursos: se sirve el texto por
      defecto verificado (HU-24).
- [ ] Edwin cambia un dato de contacto por su cuenta durante la capacitación.

---

# 20. Módulo 3.2.8 — Usuarios

### HU-30 — Invitar a un segundo administrador

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-04 |
| Origen | O-03, C-10, X-01 |

**Como** Edwin, **quiero** invitar a otra persona al panel y quitarle el acceso si deja la fundación,
**para** no ser el único punto de fallo cuando la fundación crezca.

**Criterios de aceptación**

- [ ] Desde el panel se invita a un administrador por correo, y la invitación caduca si no se usa.
- [ ] La persona invitada **debe activar el segundo factor antes de poder entrar** (RF-04).
- [ ] Se puede **desactivar** una cuenta sin borrar el historial de lo que esa persona publicó.
- [ ] Ninguna contraseña viaja por correo, ni en la invitación ni en la recuperación.
- [ ] El panel muestra en todo momento cuántos administradores activos hay. Si queda uno solo, avisa.
- [ ] **Hay al menos dos administradores activos el día del lanzamiento** (AC-09 del SRS).
- [ ] Los roles permiten que quien edita noticias no vea las solicitudes de cita, si Edwin así lo
      decide.
- [ ] **PENDIENTE (O-03): Edwin** debe nombrar a la segunda persona que recibirá la capacitación
      (C-10). Sin ella el traspaso queda en un único punto de fallo, y así queda registrado en
      [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).

---

# 21. Transversales

### HU-27 — Que me encuentren en Google y que el enlace se vea bien en WhatsApp

| | |
|---|---|
| Prioridad | **Media** |
| Implementa | RF-14 |
| Origen | R-01, C-02 |

**Como** persona que busca «ayuda psicológica en Panamá» o que recibe un enlace de REFUVA por
WhatsApp, **quiero** encontrar el sitio y ver de qué trata antes de abrirlo, **para** llegar a la
fundación sin conocerla de antes.

**Criterios de aceptación**

- [ ] Las URL son legibles en español: `/proyectos/historias-que-sanan`, nunca `/p?id=7`.
- [ ] El contenido de cada página está en el HTML que devuelve el servidor. Con «ver código fuente»
      se lee el texto principal sin ejecutar JavaScript.
- [ ] Cada página tiene título y descripción propios. Ninguna repite el título del Inicio.
- [ ] Existen `sitemap.xml` y `robots.txt` generados automáticamente, y el sitemap incluye toda página
      publicada.
- [ ] **Al pegar cualquier URL del sitio en WhatsApp aparece vista previa con imagen, título y
      descripción de esa página**, no del Inicio. Se prueba pegando al menos: el Inicio, una página de
      proyecto, una noticia y la página de donaciones.
- [ ] La imagen de la tarjeta social existe para cada tipo de página y no se sirve recortada de forma
      que corte texto.
- [ ] Hay datos estructurados `NGO` para la fundación, `Event` para eventos y `Article` para noticias,
      y validan sin errores.
- [ ] **Cada edición de un evento recurrente tiene su propia página.** La fiesta navideña de 2026 no
      es la misma URL que la de 2025.
- [ ] No se invierte esfuerzo en marcado `FAQPage`: Google retiró ese resultado enriquecido en mayo
      de 2026.
- [ ] El sitio está verificado en Search Console con registro DNS, y el sitemap enviado.

---

### HU-36 — Usar el sitio con conexión lenta y un teléfono viejo

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | Sin RF propio — ver [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md) |
| Origen | X-04, S-03, C-02 |

**Como** persona con un teléfono de gama baja, datos limitados y señal irregular —que es exactamente
el público al que REFUVA sirve—, **quiero** que el sitio cargue y se pueda usar, **para** que la
diferencia entre pedir ayuda y no pedirla no dependa de mi equipo.

**Criterios de aceptación**

- [ ] El **bloque de crisis y el CTA de cita están en el HTML que devuelve el servidor** y funcionan
      con JavaScript desactivado. Se verifica desactivando JS y comprobando que los enlaces `tel:` y
      `wa.me` responden.
- [ ] Toda etiqueta `<img>` lleva `width` y `height`. La imagen principal **no** usa
      `loading="lazy"`.
- [ ] El navegador no carga ningún script de terceros para pintar el Inicio.
- [ ] Umbrales en móvil, al percentil 75 de visitas reales: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**.
      Se miden con datos de campo en Search Console, no con la nota de Lighthouse en el portátil de
      un estudiante.
- [ ] El sitio se prueba antes de la entrega con red móvil lenta emulada y CPU cuatro veces más
      lenta, y sigue siendo usable.
- [ ] Con el texto ampliado al **200%** no se pierde contenido ni funcionalidad, y no aparece scroll
      horizontal.
- [ ] Contraste **≥ 4.5:1** en texto normal y **≥ 3:1** en bordes de campos e indicador de foco.
- [ ] Área táctil **≥ 24×24 px CSS** en todo elemento interactivo.
- [ ] Todo es operable por teclado, con foco visible y sin que un encabezado fijo lo tape.
- [ ] Hay enlace «saltar al contenido» y el documento declara `lang="es"`.
- [ ] **Sin CAPTCHA visual en ningún formulario público.**
- [ ] Auditoría con axe y revisión con teclado **sin errores de nivel AA** antes de la entrega
      (AC-07 del SRS).

---

### HU-28 — Que el sitio siga vivo después de que el equipo se vaya

| | |
|---|---|
| Prioridad | **Alta** |
| Implementa | RF-15 |
| Origen | **X-01** |

**Como** Edwin, **quiero** que las tareas que mantienen el sitio funcionando corran solas, **para**
que nada se apague porque nadie se acordó de correrlo.

**Criterios de aceptación**

- [ ] Corren automáticamente, con la frecuencia definida en RF-15: ping de actividad a la base de
      datos, refresco del feed de Instagram, cierre de convocatorias vencidas, respaldo de la base,
      reintento de correos fallidos y aviso de solicitudes sin atender.
- [ ] Cada tarea deja registro de su **última ejecución y su resultado**, visible en el panel
      (AC-12 del SRS).
- [ ] Si una tarea falla, se avisa en la primera pantalla del panel (HU-33). No falla en silencio.
- [ ] **Ninguna tarea se implementa con GitHub Actions programadas**: se desactivan solas tras 60 días
      sin actividad del repositorio, que es exactamente el escenario posterior a la entrega.
- [ ] Ningún secreto usado por estas tareas caduca sin renovación automática.
- [ ] Todas las cuentas de servicio están a nombre de la fundación, ninguna al correo de un
      estudiante (AC-10 del SRS).
- [ ] El proyecto **no se pausa por inactividad**: se comprueba dejando pasar más de siete días sin
      tráfico manual y verificando que sigue en línea.
- [ ] El calendario de renovaciones —dominio, cuentas, revalidación de los números de crisis— está en
      [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) con responsable con nombre.

---

# 22. Historias descartadas de la v1.0

### HU-16 — Donar con tarjeta a través de una pasarela

**Estado: fuera del alcance de v1. Pasa a v2 como RF-16 / V2-01.**

La v1.0 la traía con prioridad Media y un criterio que citaba «certificación PCI-DSS Nivel 1,
sección 6 del SRS». Dos cosas hay que aclarar:

1. Esa certificación es **del proveedor de pago**, no de REFUVA. La fundación nunca necesita
   certificarse si nunca toca una tarjeta.
2. Cobrar con tarjeta en v1 obliga a montar un backend de pago con confirmación firmada, mete al
   proyecto en la zona gris del uso comercial del hosting gratuito y le deja a Edwin un endpoint que
   mantener. Contradice X-01 y X-02.

Por §6.3 del SRS, **v1 no cobra en línea**. Las donaciones se reciben por Yappy Comercial y
transferencia (HU-15), que es lo que ya hacen las fundaciones panameñas. Cuando llegue v2, el cobro
será por **redirección a un checkout alojado del proveedor**, nunca por formulario propio ni iframe.

Nada de lo que se construya en v1 impide agregarlo después: la página de donaciones queda preparada
para recibir un botón adicional.

### Lo que no se descarta, pero queda condicionado

| Historia | Parte condicionada | De qué depende |
|---|---|---|
| HU-05 | Publicar los documentos de personería jurídica | Que Edwin decida publicarlos (O-09) |
| HU-08 | Publicar el listado de las más de 30 escuelas | Que Edwin confirme que es público (P-01) |
| HU-13 | Listar a los padrinos públicamente | Autorización escrita de Edwin |
| HU-15 | El bloque de Yappy Comercial | Cuenta comercial en Banco General a nombre de la fundación (A-02, S-06) |
| HU-21 | El mapa embebido | Que exista dirección física publicable (S-05) |
| HU-34 | Las equivalencias de impacto por monto | Datos confirmados por Edwin |

Ninguna de estas condiciones se resuelve inventando el dato. Si no llega, la sección no se publica.

---

# 23. Trazabilidad

| HU | Tema | RF | Módulo | Prioridad |
|---|---|---|---|---|
| HU-01 | Entender REFUVA en diez segundos | RF-06, RF-14 | 3.1.1 | Alta |
| HU-02 | Los cuatro CTA en portada | RF-02, RF-03, RF-09 | 3.1.1 | Alta |
| HU-03 | Feed de Instagram | RF-05 | 3.1.1 | Media |
| HU-04 | Misión, visión y valores | RF-06 | 3.1.2 | Media |
| HU-05 | Trayectoria y transparencia | RF-06 | 3.1.2 | Media |
| HU-06 | Índice del catálogo | RF-06 | 3.1.3 | Alta |
| HU-07 | Requisitos de la convocatoria navideña | RF-07, RF-13 | 3.1.3 | Alta |
| HU-08 | Alianza desde la página del proyecto | RF-08 | 3.1.3 | Media |
| HU-09 | Solicitud de cita | RF-02 | 3.1.4 | Alta |
| HU-10 | Correo de confirmación al solicitante | RF-02 | 3.1.4 | Alta |
| HU-11 | Aviso de solicitud a la administración | RF-02, RF-12 | 3.1.4 | Alta |
| HU-12 | Inscripción de voluntario por área | RF-03 | 3.1.5 | Media |
| HU-13 | Inscripción de padrino o madrina | RF-03, RF-13 | 3.1.5 | Alta |
| HU-14 | Exportación por programa | RF-03 | 3.1.5, 3.2.6 | Media |
| HU-15 | Yappy y datos bancarios | RF-09 | 3.1.6 | Alta |
| **HU-16** | **Donar con tarjeta** | **RF-16 (v2)** | **—** | **Descartada de v1** |
| HU-17 | Blog y noticias | RF-01, RF-14 | 3.1.7 | Alta |
| HU-18 | Publicar y ocultar contenido | RF-01 | 3.2.2 | Alta |
| HU-19 | Acceso autenticado al panel | RF-04 | 3.2.1 | Alta |
| HU-20 | Mensaje general de contacto | RF-10 | 3.1.8 | Baja |
| HU-21 | Canales directos y mapa | RF-10 | 3.1.8 | Baja |
| HU-22 | Historia de cada proyecto | RF-06 | 3.1.3 | Alta |
| HU-23 | Postulación de comunidad | RF-07 | 3.1.5 | Alta |
| **HU-24** | **Bloque de recursos de crisis** | **RF-11** | **Todo el público (banda), 3.1.4, 3.1.7, 3.2.7** | **Alta — bloqueante** |
| HU-25 | Bandeja de solicitudes | RF-12 | 3.2.4 | Alta |
| HU-26 | Abrir y cerrar convocatorias | RF-13 | 3.2.5 | Media |
| HU-27 | Buscadores y vista previa en WhatsApp | RF-14 | Todo el público | Media |
| HU-28 | Tareas programadas | RF-15 | Infraestructura | Alta |
| HU-29 | Editar datos bancarios y de crisis | RF-09, RF-11 | 3.2.7 | Alta |
| HU-30 | Invitar a un segundo administrador | RF-04 | 3.2.8 | Alta |
| HU-31 | Privacidad y términos en lenguaje llano | §6.2 del SRS | 3.1.9 | Alta |
| HU-32 | Recuperar el acceso sin el teléfono | RF-04 | 3.2.1 | Alta |
| HU-33 | Primera pantalla del panel | RF-12, RF-04 | 3.2.1, 3.2.4 | Alta |
| HU-34 | En qué se convierte la donación | RF-09, RF-06 | 3.1.6 | Media |
| HU-35 | Patrocinio institucional | RF-08, RF-06 | 3.1.2, 3.1.3 | Media |
| HU-36 | Conexión lenta y teléfono viejo | RNF ([`04`](./04-requisitos-no-funcionales.md)) | Todo el público | Alta |
| HU-37 | Crisis a las dos de la mañana | RF-11, RF-02 | 3.1.4 | Alta |
| HU-38 | Editar la página de un proyecto | RF-06 | 3.2.3 | Media |

## Cobertura de requisitos

Los quince requisitos funcionales del SRS tienen al menos una historia. Ninguna historia queda sin
requisito, salvo HU-36, que responde a los requisitos no funcionales, y HU-31, que responde a §6.2.

| RF | Historias |
|---|---|
| RF-01 | HU-17, HU-18 |
| RF-02 | HU-02, HU-09, HU-10, HU-11, HU-37 |
| RF-03 | HU-02, HU-12, HU-13, HU-14 |
| RF-04 | HU-19, HU-30, HU-32, HU-33 |
| RF-05 | HU-03 |
| RF-06 | HU-01, HU-04, HU-05, HU-06, HU-22, HU-34, HU-35, HU-38 |
| RF-07 | HU-07, HU-23 |
| RF-08 | HU-08, HU-35 |
| RF-09 | HU-02, HU-15, HU-29, HU-34 |
| RF-10 | HU-20, HU-21 |
| RF-11 | HU-24, HU-29, HU-37 |
| RF-12 | HU-11, HU-25, HU-33 |
| RF-13 | HU-07, HU-13, HU-26 |
| RF-14 | HU-01, HU-17, HU-27 |
| RF-15 | HU-28 |
