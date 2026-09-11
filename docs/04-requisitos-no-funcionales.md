# Requisitos no funcionales — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Desarrolla** | [`01-srs.md`](./01-srs.md) §6 y [`../CLAUDE.md`](../CLAUDE.md) §5 |
| **Fuente de requisitos** | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) y [`anexos/investigacion-tecnica-2026-09-06.md`](./anexos/investigacion-tecnica-2026-09-06.md), frente `salud-mental-contenido` |

> **Para qué sirve este documento.** Un requisito no funcional que no se puede medir no es un
> requisito: es una intención. Cada RNF de aquí tiene un **umbral**, una **forma de verificarlo** y
> un **responsable**. Lo que no se puede verificar, no se escribió.
>
> Estado de cada dato, igual que en `hechos-verificados.md`:
> ✅ **Confirmado** · 🟡 **Inferido**, hay que confirmarlo · 🔴 **Pendiente**, nos falta el dato.

**El orden de las secciones no es arbitrario.** La sección 1 va primera porque es la única cuyo
incumplimiento puede hacer daño a una persona. Todo lo demás es ingeniería.

---

# 1. Contenido sensible y mensajes seguros

Origen: **X-04**, **P-05**, **RF-11**, [`../CLAUDE.md`](../CLAUDE.md) §5.1.

El sitio habla de suicidio. La evidencia de la OMS y la IASP documenta dos efectos opuestos y
medibles: el **efecto Werther** —contagio, cuando se detallan métodos, lugares o se usa lenguaje
sensacionalista— y el **efecto Papageno** —protección, cuando se narran historias de personas que
atravesaron una crisis y salieron—. Escribir mal aquí no es un error de estilo.

## RNF-01 — Léxico obligatorio en español

**Ningún texto publicado en el sitio, el panel, los correos automáticos o los pies de foto usa un
término de la columna izquierda.** Umbral: cero ocurrencias.

| No se escribe | Se escribe | Por qué |
|---|---|---|
| «cometió suicidio» | **«murió por suicidio»** o **«se quitó la vida»** | «Cometer» implica delito y aumenta el estigma de quien perdió a alguien. Literal OPS/OMS. |
| «suicidio exitoso», «se logró suicidar» | «murió por suicidio» | Implica que la muerte es un resultado aconsejable. Literal OPS/OMS. |
| «suicidio fallido», «suicidio infructuoso», «intento fallido» | **«comportamiento suicida no mortal»**, «intento de suicidio» | Mismo motivo. Literal OPS/OMS. |
| «epidemia de suicidios», «ola de suicidios» | «aumento de las tasas de suicidio» | Sensacionaliza y normaliza. Literal OPS/OMS. |
| «suicidio político», «suicidio económico» | Reformular sin la palabra | Uso metafórico fuera de contexto. Literal OPS/OMS. |
| «se quitó la vida con…», «se lanzó desde…» | Omitir método y lugar por completo | Es el detonante documentado del contagio. |
| «ideación autolítica», «conducta parasuicida» | «pensamientos de quitarse la vida», «hacerse daño a sí mismo» | Tecnicismo clínico ilegible para el público del sitio. Ver §9. 🟡 derivada |
| «víctima de suicidio» | «persona que murió por suicidio» | Coherente con la regla de no criminalizar. 🟡 derivada |

Las seis primeras filas son **cita literal** de la traducción oficial de la OPS/OMS. Las dos últimas
se derivan del mismo principio y quedan marcadas como tales.

**Se verifica:** validación blanda en el editor del panel que avisa al guardar si el texto contiene
un término prohibido (no bloquea, avisa y propone el reemplazo), más revisión humana antes de
publicar (RNF-08).

## RNF-02 — Lo que nunca aparece en el sitio

**Las seis prohibiciones de la OMS/IASP son reglas del producto, no recomendaciones.** Umbral: cero
excepciones, en noticias, testimonios de *Historias que Sanan*, pies de foto, correos automáticos y
cualquier contenido de terceros que el sitio muestre.

1. No destacar ni repetir innecesariamente las noticias sobre suicidios.
2. No usar lenguaje sensacionalista ni que normalice el suicidio, ni presentarlo como una solución
   constructiva a problemas.
3. No describir explícitamente el método utilizado.
4. No facilitar detalles acerca del sitio ni de la ubicación.
5. No usar titulares sensacionales.
6. No usar fotografías, material de video ni enlaces a redes sociales asociados al hecho.

Añadidos de la AFSP, del mismo cuerpo de evidencia: **no se publica el contenido de notas
póstumas**; no se atribuye una muerte a una causa única —un despido, una ruptura— sino a una
combinación de factores; no se entrevista a familiares en duelo reciente.

**Cifras.** Si alguna vez se publica un dato estadístico, solo la **tasa** —nunca casos crudos ni
comparaciones dramáticas— y siempre acompañada del mensaje de prevención. Las cifras disponibles
hoy (≈150 casos anuales en Panamá, tasa de 3 a 4 por cada 100.000 habitantes, mayor incidencia
entre los 15 y los 39 años) provienen de una nota que cita la Resolución N.° 099 del MINSA del 11
de febrero de 2026 y **no están confirmadas contra una publicación estadística oficial del MINSA o
del INEC**. 🔴 Pendiente: confirmarlas o no publicarlas.

## RNF-03 — Lo que siempre aparece

**Toda página, artículo o testimonio que toque salud mental o suicidio cierra con recursos de ayuda
y con un mensaje de recuperación posible.** Umbral: 100 % de las piezas etiquetadas con el tema.

Las seis obligaciones de la OMS/IASP:

1. Suministrar información exacta acerca de dónde buscar ayuda.
2. Educar al público sobre los datos del suicidio y su prevención, sin difundir mitos.
3. Informar sobre maneras de hacer frente a los estresantes de la vida o a los pensamientos
   suicidas, y sobre cómo obtener ayuda.
4. Tener mucho cuidado al informar sobre suicidios de personas conocidas.
5. Tener cuidado al entrevistar a familiares o amigos en duelo.
6. Reconocer que quien produce el contenido también se ve afectado por él.

La sexta aplica directamente al equipo estudiantil y a los voluntarios que moderen contenido: se
enuncia en el manual de operación ([`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md)) y
no se trata como un detalle.

**Para *Historias que Sanan* (P-07) la regla es más estricta:** un testimonio de escritura
terapéutica muestra el **trayecto y el afrontamiento**, no el episodio agudo. En palabras de la
AFSP, la historia no debe limitarse a expresar dolor; la oportunidad es educar e inspirar
esperanza. Ningún testimonio se publica sin lectura previa por un revisor de contenido.

## RNF-04 — Bloque de crisis: contenido exacto

**El bloque de crisis contiene únicamente estos dos recursos, verificados el 6 de septiembre de
2026.** Umbral: ningún otro número aparece en el sitio como vía de auxilio.

| Recurso | Cuándo | Datos exactos publicables |
|---|---|---|
| **911 — SUME 911** | Emergencia con **riesgo vital inminente** | Marcar **911**. Gratuito, 24 horas, cobertura nacional. Número único nacional de emergencia. ✅ |
| **Línea 147 — MIDES** | Contención en crisis, ideación suicida, duelo, adicciones | Marcar **147**. WhatsApp **6694-2747**. Gratuita, confidencial, **24 horas, todos los días del año**. Atendida por psicólogos y trabajadores sociales capacitados en contención de crisis. ✅ |

La Línea 147 fue reinaugurada el 17 de septiembre de 2024 y su número de WhatsApp aparece idéntico
en tres publicaciones oficiales distintas de `mides.gob.pa` (enero y septiembre de 2025). Esa
triple coincidencia es la razón por la que se publica.

**Texto de referencia del bloque**, para que no se reinvente en cada página:

> **Si estás en peligro ahora mismo, llama al 911.**
> Si necesitas hablar con alguien ya, la **Línea 147** te atiende gratis, en confianza, las 24 horas
> de todos los días. Llama al **147** o escribe por WhatsApp al **6694-2747**.

## RNF-05 — Bloque de crisis: cómo se construye y dónde aparece

**Existe un solo componente de crisis en todo el código, con dos presentaciones, y el panel lo
inserta automáticamente por etiqueta.** Umbral: cero páginas sin la banda; cero páginas de la lista
canónica de más abajo sin el bloque completo; cero copias del texto pegadas a mano.

Comportamiento obligatorio del componente:

- Aparece **antes del primer campo** del formulario de cita, no como letra pequeña al final
  (RF-11, [`../CLAUDE.md`](../CLAUDE.md) §5.1).
- Los teléfonos son **texto real seleccionable** y a la vez enlace `tel:` y `wa.me`. **Jamás dentro
  de una imagen**: una imagen con el 147 es invisible para un lector de pantalla y no es clicable.
- Área táctil mínima **24×24 px CSS** (RNF-29) y contraste mínimo **4.5:1** (RNF-25).
- **Funciona sin JavaScript** y sin esperar a que carguen fuentes ni imágenes (RNF-43).
- Está **por encima del pliegue** en la página de la campaña de prevención del suicidio y en el
  formulario de cita.
- Se inserta automáticamente en toda pieza etiquetada como salud mental, **para que Edwin no pueda
  olvidarlo al publicar** (X-03).

**Dónde aparece: dos niveles, y esta es la lista canónica.** Este documento es su dueño; ningún otro
la reescribe ni la amplía por su cuenta. Las rutas son las de
[`03-arquitectura-informacion.md`](./03-arquitectura-informacion.md).

| Nivel | Qué es | Dónde aparece |
|---|---|---|
| **Banda de una línea** | Una sola línea con el **911** y el **147**, y un enlace a `/ayuda-en-crisis`. Vive en el armazón del sitio, no en cada página. | **Todas las páginas del sitio público, sin excepción.** |
| **Bloque completo** | El texto de referencia de RNF-04 entero, con los dos recursos, `tel:` y `wa.me`. | `/agendar-cita` · `/ayuda-en-crisis` · las páginas de proyecto etiquetadas como salud mental: `prevencion-suicidio`, `psicoeducativo`, `rompiendo-el-circulo`, `historias-que-sanan` · toda noticia o testimonio etiquetado con el tema. |

**El Inicio lleva banda, no bloque completo.** Es deliberado y contradice lo que parece intuitivo:
el requisito raíz del proyecto es desmentir que REFUVA «solo ve el tema de salud mental»
([`../CLAUDE.md`](../CLAUDE.md) §1), y un bloque de crisis a pantalla completa en la portada dice
exactamente lo contrario de las siete líneas de acción. La banda garantiza que el número esté en
todas partes; el bloque se reserva para donde la persona ya llegó buscando ese tema.

El formulario de cita, además del bloque, declara: **«Este formulario no es un canal de
emergencia»**, el **plazo real de respuesta** —con los días en que nadie revisa—, y el costo de
**B/.15.00** aclarando que el 147 y el 911 son gratuitos y que el dinero nunca debe frenar a
alguien en crisis (S-01, S-03). Nunca se usa un chatbot ni un autorespondedor que simule
contención.

## RNF-06 — Números sin verificar no se publican, y se revalidan cada seis meses

**La Línea 169 del MINSA y los números atribuidos al INSAM no aparecen en el sitio hasta que
alguien del equipo llame y anote qué contesta.** Umbral: cero números publicados sin fecha de
verificación registrada.

Por qué, con el detalle:

- **169 (MINSA).** Existe y es real, pero la confirmación oficial más reciente localizada es de
  abril de 2020 (lanzamiento) y septiembre de 2021. La página oficial del Programa de Salud Mental
  del MINSA, consultada el 6 de septiembre de 2026, **no la lista**: solo muestra el conmutador
  general 512-9200, que no es una línea de crisis. El horario de 7:00 a. m. a 10:00 p. m. y el menú
  de opciones que circula en fuentes secundarias no están confirmados. Publicar «marca 169 opción
  4» y que el menú haya cambiado envía a una persona en crisis a un menú equivocado. 🔴
- **INSAM.** Tres números en conflicto: **523-6800** (nota oficial del MINSA, septiembre de 2021),
  **512-6800** (Panamá América, enero de 2021) y **512-9200** (conmutador general del MINSA, que no
  es línea de crisis). Los dos primeros difieren en un solo dígito: patrón típico de error de
  transcripción propagado. 🔴
- **El 524-0100 de SUME 911 nunca se publica.** Es la oficina administrativa, no una vía de
  auxilio. ✅

**Procedimiento obligatorio antes del lanzamiento:** llamar al 147, al 169 y a los números del
INSAM; anotar qué contesta, en qué horario y cuál es el menú real; publicar únicamente lo escuchado.
El registro de verificación vive en el repositorio y en el panel, con la fecha visible para el
administrador (RF-11).

**Y después del lanzamiento no se deja de comprobar.** La revalidación es una **tarea programada
semestral, cada 190 días** —el margen sobre los 180 es deliberado: evita que la alerta salte por un
retraso de una semana y siga significando algo cuando salte—. Corre con las demás tareas de RF-15
([`07-modelo-datos.md`](./07-modelo-datos.md) §7.4) y deja registro de su última ejecución visible
en el panel (RNF-45). Lo que la tarea hace es **avisar a una persona**, no verificar nada sola: la
comprobación es una llamada telefónica. Esa persona tiene nombre en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md), como todo proceso operativo (RNF-48).
Un número de crisis correcto en septiembre puede estar muerto en marzo, y nadie se entera hasta que
alguien lo marca en el peor momento posible.

## RNF-07 — Contenido de terceros fuera de las páginas de salud mental

**El feed automático de Instagram no aparece en ninguna página del ámbito de salud mental.**
Umbral: cero apariciones en la página de `prevencion-suicidio`, en `historias-que-sanan`, en el
formulario de cita ni en artículos etiquetados con el tema.

La OMS desaconseja expresamente los enlaces a redes sociales en contenido sobre suicidio, y un
widget que renderiza los últimos posts puede traer a portada contenido de la campaña sin su marco
de seguridad. La decisión del proyecto (RF-05) mantiene el feed en el Inicio, leído desde el
servidor, **con capacidad de ocultar una publicación concreta desde el panel**; esa capacidad es un
control de seguridad de contenido, no una comodidad. En las páginas de salud mental se usa, en su
lugar, una **galería curada manualmente**. En ningún caso se renderizan comentarios de terceros.

## RNF-08 — Lista de verificación de contenido antes de publicar

**Ninguna pieza que toque salud mental se publica sin que alguien recorra esta lista.** Umbral:
lista completada y firmada —nombre y fecha— en la nota interna de la pieza.

La lista vive **junto al editor del panel**, no en un PDF que nadie abre.

1. ¿El texto contiene alguno de los términos prohibidos de RNF-01? Si el panel avisó, ¿se corrigió?
2. ¿Describe un método? ¿Menciona un lugar concreto? Si la respuesta es sí a cualquiera, se quita.
3. ¿El titular es sensacionalista? Léelo en voz alta: si suena a titular de nota roja, se reescribe.
4. ¿Atribuye la muerte a una causa única? Se reformula como combinación de factores.
5. ¿Incluye contenido de una nota póstuma? Se elimina.
6. ¿Cierra con el bloque de crisis y con un mensaje de que se puede pedir ayuda y salir adelante?
7. ¿Hay fotos de beneficiarios? ¿Existe consentimiento firmado por escrito? Si no, no se publican
   (RNF-13).
8. ¿Toda imagen tiene texto alternativo que describe lo que se ve, sin nombrar a un menor?
9. ¿Los enlaces externos funcionan? **Ojo:** `reportingonsuicide.org/recommendations` devuelve 404
   desde 2026 y redirige a `save.org`. Un enlace roto en una página de prevención del suicidio es
   un fallo, no un detalle. Enlazar preferentemente al recurso en español de la OPS/OMS.
10. ¿Si es un testimonio, muestra el afrontamiento y no el episodio agudo?
11. ¿Alguien distinto de quien lo escribió lo leyó completo?

---

# 2. Privacidad y minimización de datos

Origen: **X-05**, **X-06**, **RF-02**, **RF-03**, **RF-07**, [`01-srs.md`](./01-srs.md) §6.2,
[`../CLAUDE.md`](../CLAUDE.md) §5.2.

El principio operativo es uno solo: **lo que no se recoge no se puede filtrar, no se respalda por
error y no aparece en el correo personal de nadie.** El fundamento es ético y de ingeniería
profesional. El marco legal aplicable en Panamá lo debe confirmar el asesor legal de la fundación;
este documento no es asesoría jurídica.

## RNF-09 — Minimización por formulario

**Cada formulario recoge exactamente los campos de esta tabla y ninguno más.** Umbral: cero campos
fuera de la lista; cualquier campo nuevo exige una decisión escrita.

Esta lista es la real: cada campo de aquí existe como columna en
[`07-modelo-datos.md`](./07-modelo-datos.md) §3.7 a §3.12, y ninguna columna de aquellas tablas
queda fuera de aquí. Los campos marcados *(opcional)* pueden llegar vacíos y el registro se guarda
igual.

| Formulario | Se recoge | Nunca se recoge |
|---|---|---|
| **Cita psicológica** (RF-02) | Nombre o seudónimo · correo **y/o** teléfono · canal de contacto preferido · **motivo general en una línea, *opcional*, máx. 280 caracteres** · modalidad · disponibilidad horaria · consentimiento | Diagnóstico · síntomas · medicación · relato clínico · cédula · dirección · fecha de nacimiento exacta |
| **Voluntariado** (RF-03) | Nombre · correo · teléfono *(opcional)* · áreas de interés (selección múltiple de lista cerrada) y su aclaración si marca «otra» · **preferencia de proyecto *(opcional)*** · disponibilidad · **experiencia previa *(opcional)*, máx. 500 caracteres** · consentimiento | Cédula · dirección exacta · datos de salud · currículo adjunto |
| **Apadrinamiento** (RF-03) | Nombre · correo · teléfono · **cantidad de niños a apadrinar** (conteo agregado, 1 a 10 — RNF-12) · forma de entrega del regalo · disponibilidad *(opcional)* · **comentario *(opcional)*, máx. 500 caracteres** · consentimiento | **Cualquier dato de un niño apadrinado** (X-06) · monto (REFUVA no fija monto, P-02) · cédula |
| **Postulación de comunidad** (RF-07) | Quién postula · su relación con la comunidad · correo *(opcional)* y teléfono · nombre de la comunidad · provincia, distrito y corregimiento · referencia de ubicación *(opcional)* · **número aproximado de niños** · justificación de por qué cumple los requisitos · consentimiento | **Lista nominal de niños** (X-06) · fotos de menores adjuntas · datos de salud |
| **Alianza institucional** (RF-08) | Institución · **tipo de institución** (lista cerrada: escuela, empresa, ONG, entidad pública, otra) · nombre y cargo del contacto · correo · teléfono *(opcional)* · proyecto de interés *(opcional)* · población estimada *(opcional)* · **mensaje, máx. 2.000 caracteres** · consentimiento | Datos personales de los estudiantes · matrícula · datos de menores |
| **Contacto general** (RF-10) | Nombre · correo · teléfono *(opcional)* · **asunto** · mensaje, máx. 2.000 caracteres · consentimiento | Nada más |

**El motivo de la consulta es opcional, y esa es la decisión.** Manda la minimización de este
requisito: un campo obligatorio empuja a la persona a escribir algo, y lo que escribe de más en un
formulario web público es exactamente lo que este documento existe para no recoger. Es preferible
una bandeja con menos contexto que un relato clínico guardado donde no debe estar. La columna
`motivo` de [`07-modelo-datos.md`](./07-modelo-datos.md) §3.7 admite nulo en consecuencia.

El campo libre del formulario de cita se rotula de forma explícita: **«Motivo general de la consulta
(opcional). No escribas detalles médicos.»** Un formulario web público no es un entorno clínico y
no puede sostener la confidencialidad de un relato clínico.

Los campos añadidos a esta lista frente a la primera versión —`asunto` en contacto,
`tipo_institucion` y `mensaje` en alianza, `experiencia` y preferencia de proyecto en voluntariado,
`comentario` en padrinos— **tienen justificación operativa y están todos acotados en longitud**: sin
asunto la bandeja de contacto no se puede triar; sin tipo de institución no se puede encaminar la
alianza al proyecto correcto; sin experiencia ni preferencia, la clasificación de voluntarios de
RF-03 no clasifica nada y vuelve a ser una lista de nombres. El umbral se mantiene igual de duro
—**cero campos fuera de esta tabla**—; lo que cambió es que la tabla ahora es la real.

> 🟡 **Punto abierto.** El anexo de investigación recomienda pedir además un **rango de edad** —
> nunca la fecha exacta — para saber si quien escribe es menor de edad y activar el consentimiento
> de padre, madre o tutor. [`../CLAUDE.md`](../CLAUDE.md) §5.2 cierra la lista de campos con un
> «nada más», así que **no se añade**. Consecuencia: el sitio no puede saber si el solicitante es
> menor, y la página de citas debe decir por escrito que las personas menores de edad deben ser
> acompañadas por su padre, madre o tutor, resolviéndose por el canal de la fundación. Requiere
> decisión de Edwin y está anotado en
> [`06-inventario-contenido.md`](./06-inventario-contenido.md).

## RNF-10 — Consentimiento

**Casilla activa, nunca premarcada, en lenguaje llano, en todo formulario que recoja datos de una
persona.** Umbral: ningún formulario envía sin la casilla marcada por el usuario; cero casillas con
`checked` por defecto.

El texto junto a la casilla dice, sin remitir a un documento para entenderse:

- **quién** recibe los datos — Fundación REFUVA y el psicólogo Edwin Quintero;
- **para qué** — agendar la cita y ponerse en contacto, nada más;
- **cuánto tiempo** se conservan (RNF-11);
- **cómo pedir el borrado** — una dirección de correo institucional, **nunca un Gmail personal**.

Un enlace a la política de privacidad completa acompaña al texto, pero el texto se sostiene solo.

## RNF-11 — Retención y borrado real

**Cada dato tiene un plazo, y al vencer se borra de verdad, de forma automatizada.** Umbral: cero
tablas con datos de personas sin plazo declarado y sin trabajo de borrado que lo ejecute.

**Los plazos concretos no se escriben aquí.** Viven, tabla por tabla, en
[`07-modelo-datos.md`](./07-modelo-datos.md) §5.1, **porque ahí vive el `DELETE` que los cumple**.
Un plazo escrito lejos de la consulta que borra se desincroniza en la primera migración, y entonces
hay dos verdades y ninguna manda. Este RNF fija el principio; 07 §5.1 fija el número.

Lo que este requisito sí sostiene:

- **Toda tabla con datos de personas tiene su fila en 07 §5.1.** Ninguna se queda fuera, y ninguna
  se queda sin trabajo programado que la purgue (RF-15).
- **Quien aprueba los plazos es Edwin Quintero**, con revisión del asesor legal de la fundación
  antes del lanzamiento. Mientras eso no ocurra siguen marcados 🟡 en 07 §5.1. Lo que no está en
  discusión es que el plazo exista y que el borrado sea automático.
- **Borrar significa borrar:** no marcar como oculto, no mover a otra tabla, no dejarlo vivo en un
  respaldo eterno. La única demora admitida es la papelera de contenido de RNF-51, que tiene su
  propia fila y su propio plazo en esa misma tabla de 07 §5.1.
- **No hay copias fuera del sistema.** Las solicitudes no se guardan en hojas de cálculo
  compartidas ni en el OneDrive general de la fundación (R-06). Lo único que existe es la
  **exportación a CSV bajo demanda** desde el panel (RF-03), y esa descarga queda registrada en la
  bitácora (RNF-23).
- **Los plazos se cuentan en la política de privacidad** (RNF-15), en lenguaje llano, porque quien
  marca la casilla tiene derecho a saber cuánto tiempo se guarda lo que escribió.

El único plazo que el sistema no controla, y por eso se anota aquí: el registro del correo
transaccional en **Resend se conserva 30 días**, que es la retención del plan Free. ✅ Verificado.

## RNF-12 — Datos personales de menores: ninguno

**En v1 no entra al sistema ningún dato personal de un menor de edad capturado por un formulario ni
almacenado en una columna de texto.** Umbral: cero campos de formulario y cero columnas de texto que
admitan el nombre, la edad, la escuela, la comunidad de residencia o una lista nominal de un menor
(X-06).

Así se acota la prohibición, para que no se lea de más ni de menos:

- No existe tabla de niños. El emparejamiento padrino↔niño ocurre **fuera de línea**.
- La postulación de comunidad pide `ninos_aproximado`, un **número aproximado**, nunca lista nominal
  (RF-07, [`07-modelo-datos.md`](./07-modelo-datos.md) §3.10).
- **`cantidad_ninos` sí está permitido y no es una excepción.** Es un **conteo agregado** —cuántos
  regalos ofrece cubrir un padrino, de 1 a 10— en `inscripciones_padrinos` (07 §3.9). Un número no
  identifica a nadie: no dice quién, ni dónde, ni de qué edad. Lo que la regla prohíbe es el dato de
  **un** niño, no la aritmética de la campaña.
- Si un mensaje llega con el nombre de un menor escrito en un campo libre, el administrador lo
  edita o borra el registro, y la acción queda en la bitácora. El procedimiento va en el manual.
- Ningún nombre de menor aparece en texto alternativo, pie de foto ni nombre de archivo de imagen.

**Única excepción escrita, y no hay más:** las **imágenes de menores en la galería de evidencia**.
Se publican **solo con consentimiento firmado y registrado** en el inventario de consentimientos, en
las condiciones exactas de RNF-13 —sin nombre en el `alt`, sin pie de foto que identifique, sin
metadatos EXIF—. Sin ese respaldo documental, la foto no se publica. Cualquier otro uso de datos de
menores exige una decisión escrita de Edwin y una modificación de este requisito.

## RNF-13 — Fotos de beneficiarios

**No se publica ninguna foto de un niño beneficiario ni de una persona en situación de calle sin
consentimiento firmado.** Umbral: cero fotos publicadas sin respaldo documental registrado.

- El consentimiento firmado es 🔴 **Pendiente**: lo debe Edwin, y está anotado en
  [`06-inventario-contenido.md`](./06-inventario-contenido.md).
- Mientras no exista, la evidencia se publica con fotos donde las personas **no son
  identificables**: planos generales, de espaldas, manos, materiales, el equipo trabajando.
- Al subir una imagen, el sistema **elimina los metadatos EXIF**, incluida la ubicación GPS. Una
  foto tomada en el barrio de un beneficiario puede llevar sus coordenadas dentro.
- El texto alternativo describe la escena, no identifica a la persona.

## RNF-14 — El correo no transporta el contenido del formulario

**El aviso a la administración lleva lo mínimo para actuar y un enlace al panel autenticado; nunca
el contenido del formulario.** Umbral: cero correos salientes que incluyan el motivo de consulta o
los datos de contacto completos.

El correo dice: hay una nueva solicitud, de qué tipo, de qué programa, cuándo entró, y un enlace.
Nada más. La razón es concreta: el correo queda replicado para siempre en el buzón personal, fuera
de todo control de retención y de acceso.

> ⚠️ **Esto manda sobre RF-02, y RF-02 ya lo recoge así:** para el aviso a la administración,
> **enlace sí, datos no.** Ver [`01-srs.md`](./01-srs.md) RF-02.

**La regla no es simétrica, y este RNF es el dueño de esa asimetría.** El correo de confirmación
**al solicitante** sí lleva lo que él mismo escribió —es suyo, y va a su propio buzón— más el plazo
de respuesta, el recordatorio de que no es un canal de emergencia y el bloque de crisis (RF-02,
RNF-05). Lo que nunca sale es el contenido del formulario **hacia un tercero**, y la administración
es un tercero.

## RNF-15 — Política de privacidad legible

**La política de privacidad se entiende en una sola lectura.** Umbral: la persona que la lea puede
responder sin releer quién guarda sus datos, para qué, cuánto tiempo y cómo pedir que los borren.

Se escribe con las reglas de la §9 de este documento. No es un texto legal traducido: es la
explicación honesta de lo que hace el sistema. La revisión jurídica corresponde al asesor legal de
la fundación.

## RNF-16 — El borrado a petición se puede ejecutar

**Existe un procedimiento escrito y probado para borrar los datos de una persona que lo pida.**
Umbral: un administrador lo completa en menos de 10 minutos sin ayuda del equipo de desarrollo.

Incluye: dónde buscar el registro, cómo confirmar la identidad de quien pide, qué se borra, qué
queda en la bitácora y cómo se responde. Va en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) con responsable con nombre. Un derecho
que nadie sabe ejecutar no existe.

---

# 3. Seguridad de la aplicación

Origen: **RF-04**, [`01-srs.md`](./01-srs.md) §6.1 y §6.5, [`../CLAUDE.md`](../CLAUDE.md) §5.2 y §6.

## RNF-17 — Row Level Security en toda tabla con datos de personas

**Ninguna tabla con datos de personas existe sin RLS habilitado y con al menos una política
probada en negativo.** Umbral: cero filas en la consulta de control.

Una tabla sin RLS en Supabase es legible desde cualquier navegador con la clave pública. No es una
mala práctica: es una filtración esperando ocurrir.

- Toda tabla **nace** con RLS habilitado en su migración. No se habilita después.
- Cada política se prueba con un usuario que **no** debería ver el dato. Una política que nadie
  intentó romper no está probada.
- La clave `SUPABASE_SERVICE_ROLE_KEY` vive solo en Route Handlers y Server Actions. Nunca en el
  navegador, nunca en el repositorio, nunca en un `.env` versionado.

**Se verifica:** consulta al catálogo de PostgreSQL que lista las tablas con `relrowsecurity =
false`, ejecutada por un hook del repositorio y otra vez antes de cada entrega, más una prueba
automatizada de acceso denegado por cada tabla sensible (AC-06).

## RNF-18 — Roles separados dentro del panel

**Quien edita noticias y eventos no puede leer las solicitudes de cita psicológica.** Umbral: un
usuario con rol de editor recibe acceso denegado al abrir la bandeja de citas.

Dos roles como mínimo: **editor de contenido** (3.2.2, 3.2.3) y **gestor de solicitudes** (3.2.4,
3.2.6). Edwin tiene ambos. La segunda persona capacitada (C-10) puede tener solo el primero, y esa
es precisamente la razón de que la separación exista: permite delegar la publicación sin entregar
el dato más sensible del sistema.

El módulo 3.2.8 de [`01-srs.md`](./01-srs.md) ya contempla los dos roles además del administrador,
y [`07-modelo-datos.md`](./07-modelo-datos.md) §3.1 y §4.3 los implementan en `perfiles.rol` y en
las políticas RLS. Los tres documentos dicen lo mismo: **editor de contenido**, **gestor de
solicitudes** y **administrador**.

## RNF-19 — Gestión de secretos

**Ningún secreto vive en el repositorio, y ningún secreto caduca sin renovación automática.**
Umbral: cero secretos en el historial de Git; cero secretos con fecha de vencimiento en el
inventario.

- Los secretos se configuran en el panel del proveedor de hosting, por entorno.
- Existe un **inventario de secretos** con propietario, para qué sirve y si caduca, en
  [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).
- El feed de Instagram usa Behold precisamente porque él renueva el token de Meta; el sitio no
  guarda ningún token que expire (X-01, RF-05).
- Si un secreto se filtra alguna vez, el procedimiento de rotación está escrito antes de
  necesitarse.

**Se verifica:** análisis del historial del repositorio en busca de credenciales antes de la
entrega, y revisión del inventario.

## RNF-20 — HTTPS y cabeceras de seguridad

**Todo el sitio se sirve por HTTPS con las cabeceras configuradas.** Umbral: `curl -I` sobre la
raíz devuelve las cinco cabeceras; HTTP redirige a HTTPS con 301.

| Cabecera | Valor |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | Restrictiva, sin `unsafe-inline` en scripts, con `frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Cámara, micrófono y geolocalización denegados |

Certificado gratuito del proveedor de hosting. Cifrado en reposo por defecto del proveedor
gestionado.

**Se verifica:** revisión de cabeceras en la integración continua y una comprobación manual antes
de la entrega.

## RNF-21 — Validación en el servidor

**Toda entrada se valida en el servidor con el mismo esquema Zod que en el cliente.** Umbral: cero
endpoints que escriban en la base de datos sin validar; una prueba por formulario que envía datos
inválidos saltándose el cliente y recibe rechazo.

- La validación de cliente es comodidad; la de servidor es la que cuenta.
- Límite de longitud por campo, y límite de caracteres explícito en los campos libres.
- Las imágenes solo se suben desde el panel autenticado, con validación de tipo y tamaño, y se
  reescriben a **WebP con ancho máximo de 1600 px** antes de guardarse (protege el 1 GB de Storage y
  el rendimiento).
- Los errores se muestran en español, junto al campo, diciendo qué corregir.

## RNF-22 — Protección anti-spam sin CAPTCHA visual

**Los formularios públicos se protegen sin ningún acertijo visual ni cognitivo.** Umbral: cero
CAPTCHAs de imágenes o texto distorsionado en el sitio y en el panel.

**Por qué.** Dos razones que apuntan al mismo sitio. La primera es humana: alguien en crisis no
debería tener que descifrar imágenes borrosas para pedir ayuda; cada segundo de fricción ahí es una
persona que se va. La segunda es normativa: el criterio **3.3.8 Autenticación accesible (mínimo)**
de WCAG 2.2 prohíbe exigir pruebas cognitivas para iniciar sesión, y la misma lógica aplica al
formulario público.

Mecanismos, en este orden:

1. **Campo trampa (*honeypot*)** oculto visualmente y marcado `aria-hidden` con `tabindex="-1"`,
   invisible para personas y para lectores de pantalla, visible para un robot que rellena todo.
2. **Trampa de tiempo**: un envío en menos de 3 segundos desde que se pintó el formulario es un
   robot. 🟡 umbral propuesto por el equipo, a ajustar con datos reales.
3. **Límite de tasa en el servidor**: máximo 5 envíos por hora por dirección IP y 3 por dirección de
   correo. 🟡 umbral propuesto por el equipo.
4. **Verificación del origen** de la petición.
5. Si aparece abuso real, escalada a un verificador **invisible** tipo Cloudflare Turnstile en modo
   sin interacción. 🟡 Sin verificar en el anexo de investigación; comprobar costo y comportamiento
   antes de adoptarlo.

**Regla que no se negocia: nada se descarta en silencio.** Un falso positivo en el formulario de
cita es una persona que no recibió ayuda. Todo envío rechazado por el filtro se guarda en una tabla
de cuarentena que el administrador puede revisar, y la persona ve un mensaje que le ofrece la
alternativa por WhatsApp. Coherente con [`../CLAUDE.md`](../CLAUDE.md) §6: un `catch` que se traga
un error en el camino de una solicitud de ayuda es un bug.

## RNF-23 — Bitácora

**Queda registro de quién entró, qué leyó y qué cambió.** Umbral: toda lectura de una bandeja de
solicitudes, toda exportación y todo cambio de contenido tienen autor y fecha consultables.

- Inicios de sesión, con fecha y hora en `America/Panama`.
- Accesos y exportaciones de solicitudes: quién, cuándo, qué filtro.
- Cambios de contenido: quién publicó, quién dejó de mostrar y quién borró, y cuándo (RF-01).
- **La bitácora no se puede borrar desde el panel.** Su plazo de retención es el de
  [`07-modelo-datos.md`](./07-modelo-datos.md) §5.1, igual que el de cualquier otra tabla; este
  documento no lo repite (RNF-11).

## RNF-24 — Dependencias auditadas

**No se entrega con vulnerabilidades conocidas de severidad alta o crítica.** Umbral: `npm audit`
sin hallazgos altos ni críticos; `package-lock.json` versionado; `npm run build` sin errores ni
advertencias de tipos (AC previo de [`../CLAUDE.md`](../CLAUDE.md) §9).

---

# 4. Accesibilidad WCAG 2.2 nivel AA

Origen: **X-04**, [`../CLAUDE.md`](../CLAUDE.md) §5.4, **AC-07**.

El público del sitio incluye a personas en pobreza, en crisis y con teléfonos viejos. Aquí la
accesibilidad **no es cumplimiento**: es la diferencia entre que alguien encuentre el número de la
147 y que no lo encuentre.

**El dato que ordena las prioridades.** El informe WebAIM Million de febrero de 2026, sobre el
millón de portadas más visitadas, encontró fallas WCAG detectables en el **95,9 %** de las páginas,
con **56,1 errores por página** en promedio (un 10,1 % más que los 51 de 2025). Seis fallas
concentran casi todo:

| Falla | Frecuencia | RNF que la ataca |
|---|---|---|
| Texto de bajo contraste | 83,9 % | RNF-25 |
| Imágenes sin texto alternativo | 53,1 % | RNF-26 |
| Campos de formulario sin etiqueta | 51,0 % | RNF-27 |
| Enlaces vacíos | 46,3 % | RNF-28 |
| Botones vacíos | 30,6 % | RNF-28 |
| Idioma del documento ausente | 13,5 % | RNF-28 |

Las tres primeras golpean exactamente este producto: el bloque de crisis necesita contraste, la
evidencia fotográfica necesita alternativas y el formulario de cita es justo donde «campo sin
etiqueta» rompe la tarea. Corregirlo no cuesta dinero; cuesta revisión.

## RNF-25 — Contraste (1.4.3 y 1.4.11)

**Umbral exacto:** texto normal **4.5:1**; texto grande **3:1**; componentes de interfaz y objetos
gráficos **3:1** frente al color adyacente —lo que incluye **el borde de cada campo del formulario y
el indicador de foco**.

**Se verifica:** axe DevTools sobre las rutas críticas, más comprobación manual de cada pareja de
colores de la paleta antes de fijarla en el sistema de diseño. El bloque de crisis se comprueba
siempre, en las dos combinaciones en que aparezca.

## RNF-26 — Texto alternativo (1.1.1)

**Toda imagen informativa tiene texto alternativo; las decorativas llevan `alt=""`.** Umbral: cero
imágenes sin atributo `alt`.

- **El texto alternativo es obligatorio para publicar** desde el panel (RF-01). El editor no deja
  guardar sin él. No es una recomendación.
- Describe lo que se ve y por qué importa, no repite el pie de foto.
- No nombra a menores (RNF-12).

## RNF-27 — Etiquetas de formulario (3.3.2 y 4.1.2)

**Cada campo tiene una etiqueta visible y permanente, asociada programáticamente.** Umbral: cero
campos cuya única indicación sea el `placeholder`.

Un `placeholder` desaparece al escribir; quien se distrae —y alguien en crisis se distrae— ya no
sabe qué iba en ese campo. Los mensajes de error se asocian al campo con `aria-describedby` y se
anuncian.

## RNF-28 — Enlaces, botones e idioma del documento

**Todo enlace y todo botón tienen nombre accesible; el documento declara su idioma.** Umbral: cero
enlaces vacíos, cero botones vacíos, `<html lang="es">` presente en toda página.

Un icono solo —el de WhatsApp, el de copiar el número de cuenta, el de cerrar— lleva su texto
accesible. «Leer más» repetido siete veces no es un nombre útil: se escribe «Leer más sobre
Historias que Sanan».

## RNF-29 — Objetivo táctil y foco (2.5.8, 2.4.11, foco visible)

**Umbrales exactos:** área táctil mínima **24×24 px CSS** (2.5.8, nuevo en WCAG 2.2). Indicador de
foco siempre visible, con contraste 3:1. **Foco no oscurecido (2.4.11, nuevo en 2.2):** cuando un
componente recibe el foco de teclado, no queda **completamente oculto** por contenido creado por el
sitio.

Los dos casos concretos que fallan aquí: los botones de llamar al 147 y al 911 en un teléfono, y un
encabezado pegajoso que tapa el campo enfocado al tabular por el formulario de cita.

**Se verifica:** recorrido completo con teclado en un móvil real y en escritorio, midiendo el área
de los botones críticos con las herramientas del navegador.

## RNF-30 — Teclado, saltar al contenido y arrastre (2.1.1, 2.4.1, 2.5.7)

**Todo se opera con teclado, sin trampas de foco, y existe un enlace «saltar al contenido».**
Umbral: la tarea completa —llegar al formulario de cita, llenarlo y enviarlo— se hace sin ratón.
**Ninguna acción depende exclusivamente del arrastre** (2.5.7, nuevo en 2.2): si algo se reordena
arrastrando en el panel, existen también botones de subir y bajar.

## RNF-31 — Zoom y reflujo (1.4.4)

**El texto se amplía hasta el 200 % sin pérdida de contenido ni de funcionalidad.** Umbral:
navegación, formulario y bloque de crisis siguen siendo usables al 200 %.

Nunca se fijan tamaños en píxeles absolutos que impidan el zoom, y no se usa `user-scalable=no`.

## RNF-32 — Autenticación accesible (3.3.8) y auditoría sin errores de nivel AA

**Iniciar sesión en el panel no exige resolver acertijos ni recordar nada más allá de la
contraseña y el segundo factor.** Umbral: cero pruebas cognitivas; el gestor de contraseñas puede
rellenar los campos (`autocomplete` correcto); el código del segundo factor se puede pegar.

**Y el umbral global de la sección:** una auditoría con axe sobre las rutas críticas —Inicio,
índice de Proyectos, una página de proyecto, Agendamiento de citas, Donaciones, un artículo,
Contacto, acceso al panel y bandeja de solicitudes— **devuelve cero errores de nivel AA** (AC-07).
Se complementa con recorrido de teclado y una revisión puntual con lector de pantalla.

---

# 5. Rendimiento

Origen: [`../CLAUDE.md`](../CLAUDE.md) §5.4, **AC-08**.

**El contexto manda.** El público de REFUVA entra desde teléfonos modestos y con datos móviles
caros. Cada 100 KB que el sitio no envía es dinero que la persona no gasta. Y el sitio va a estar
lleno de fotos de evidencia, porque esa evidencia es el argumento ante los patrocinadores (O-07).
Esas dos cosas están en tensión, y esta sección es cómo se resuelve.

## RNF-33 — Core Web Vitals

**Umbrales exactos, medidos al percentil 75 de visitas reales, segmentando móvil y escritorio:**

| Métrica | Umbral |
|---|---|
| **LCP** — Largest Contentful Paint | **≤ 2,5 s** |
| **INP** — Interaction to Next Paint | **≤ 200 ms** |
| **CLS** — Cumulative Layout Shift | **≤ 0,1** |

Estos umbrales no cambiaron en 2026. FID fue retirado; INP lo sustituyó como métrica estable
en 2024.

**Reparto ideal del LCP**, útil para saber dónde mirar cuando falla: TTFB ≈ 40 %, retraso de carga
del recurso < 10 %, duración de carga del recurso ≈ 40 %, retraso de renderizado del elemento
< 10 %.

**Se verifica:** el informe de Core Web Vitals de Google Search Console, que usa datos de campo de
CrUX —exactamente el percentil 75 que Google evalúa—. Lighthouse en móvil con limitación de red
sirve como comprobación previa durante el desarrollo, **no como evidencia de cumplimiento**: la
nota de Lighthouse en el portátil de un estudiante no es lo que mide Google.

## RNF-34 — Presupuesto de peso de página

**Umbral por tipo de página, en el primer acceso, con la caché vacía:**

| Página | Peso total transferido | JavaScript comprimido |
|---|---|---|
| Inicio | ≤ 1.000 KB | ≤ 150 KB |
| Página de proyecto o artículo | ≤ 700 KB | ≤ 120 KB |
| **Agendamiento de citas** | **≤ 400 KB** y usable sin JavaScript | ≤ 80 KB |
| Imagen individual publicada | ≤ 150 KB | — |
| Imagen del hero | ≤ 200 KB | — |
| Fuentes web | Máximo 2 familias, 2 pesos cada una, subconjunto latino | — |

> 🟡 **Estas cifras son una decisión del equipo, no un dato verificado.** No salen del anexo de
> investigación: se fijan aquí para que exista un límite que se pueda incumplir. Se revisan con
> datos reales de campo después del lanzamiento.

La página de citas es la más ligera a propósito. Es la que abre alguien que necesita ayuda, muchas
veces con mala señal.

**Se verifica:** comprobación de tamaño en la integración continua que falla el build si se excede
el presupuesto, más revisión en el panel de red del navegador con limitación a 3G lento.

## RNF-35 — Imágenes: las tres causas típicas y su arreglo

**Reglas de revisión de código, no sugerencias.** Umbral: cero incumplimientos en revisión.

1. **La imagen del LCP nunca se carga con retraso.** Cita literal de la guía de referencia: *nunca
   apliques carga diferida a tu imagen de LCP, porque siempre provoca un retraso innecesario de
   carga del recurso*. Arreglo: la foto principal va en el HTML inicial, con `fetchpriority="high"`
   y, si hace falta, `<link rel="preload" as="image">`. Nada de carruseles que la inserten con
   JavaScript.
2. **Toda `<img>` lleva `width` y `height`** (o `aspect-ratio`), más `img { height: auto; width:
   100% }` en CSS. Sin eso el texto salta cuando la foto carga, y el CLS se rompe. `next/image` con
   dimensiones explícitas resuelve las dos cosas ([`../CLAUDE.md`](../CLAUDE.md) §5.4).
3. **Formato moderno y tamaños responsivos:** AVIF o WebP, `srcset` y `sizes`, CDN y `cache-control`
   agresivo. Todo lo que se sube por el panel se convierte a WebP con ancho máximo de 1600 px
   (RNF-21).

## RNF-36 — Terceros y fuentes: las otras dos causas

4. **Todo contenido que carga tarde tiene su espacio reservado.** El feed de Instagram, un mapa
   embebido, el botón flotante de WhatsApp y cualquier banner llevan `min-height` o `aspect-ratio`
   en su contenedor, se colocan por debajo del pliegue y, si son de terceros, se cargan con
   **fachada de clic previo**: una miniatura estática que solo inserta el iframe cuando el visitante
   lo pide. Eso elimina de paso las cookies de terceros y el banner de consentimiento
   ([`../CLAUDE.md`](../CLAUDE.md) §3, RF-10).
5. **Fuentes web y recursos bloqueantes:** `font-display: optional`, ajuste de métricas en
   `@font-face` (`size-adjust`, `ascent-override`, `descent-override`), precarga de la fuente
   crítica, CSS crítico en línea y JavaScript no crítico diferido.

## RNF-37 — Galerías: el riesgo de INP

**Una galería de evidencia no infla el DOM sin control.** Umbral: INP ≤ 200 ms también en la página
de proyecto con más fotos.

Cientos de imágenes en una sola página alargan las tareas del hilo principal. Arreglo:
`content-visibility`, paginación o carga por lotes, y evitar el *layout thrashing* —no leer estilos
inmediatamente después de escribirlos.

---

# 6. Disponibilidad y degradación

Origen: [`../CLAUDE.md`](../CLAUDE.md) §4, **RF-02**, **RF-05**, **RF-15**, **AC-03**.

La arquitectura ya está diseñada para esto: **la escritura en PostgreSQL ocurre primero y de forma
síncrona; la automatización reacciona después.** Esta sección dice qué ve el usuario en cada caída,
y qué no puede pasar nunca.

## RNF-38 — Objetivo de disponibilidad y monitoreo 🔴 Pendiente

**Hay objetivo; no hay todavía con qué medirlo.** Este requisito se declara **Pendiente** a
propósito, en vez de escribir un umbral que nadie puede comprobar.

**Objetivo propuesto: 99 % mensual del sitio público**, sobre el Inicio y sobre la página de citas.
Es lo que sostiene de forma realista una infraestructura de plan gratuito, y se declara para que
exista un número contra el que fallar, no para prometer más de lo que hay.

**Lo que falta, y por qué esto no está cerrado:**

- **La herramienta de comprobación externa está sin decidir.** Aquí no se nombra ningún servicio ni
  ningún precio, porque ninguno se ha evaluado y ninguno está en
  [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md). Escribir un nombre inventado sería
  peor que dejar el hueco: daría por resuelto un costo que nadie aprobó.
- **La frecuencia de sondeo depende de esa decisión.** Sin herramienta elegida, «cada 5 minutos» no
  es un umbral, es un deseo.
- **El dueño de la decisión es el equipo**, no Edwin: es una elección técnica y de presupuesto.
  Hasta que se tome, no hay responsable ni canal que asignar en
  [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md), y por eso ese documento no lo lista.

**Lo único firme mientras tanto:** cuando la herramienta exista, el aviso tiene que llegar a un
canal que **no dependa del equipo estudiantil** después de la entrega (X-01), y la cuenta del
servicio debe quedar a nombre de la fundación (RNF-46). Entre tanto, el respaldo real es el
contador de pendientes del panel (RNF-40) y el registro de última ejecución de cada tarea
programada (RNF-45), que sí están dentro del sistema y sí se entregan.

## RNF-39 — Si cae Supabase o el proyecto se pausa

El plan Free **pausa el proyecto tras 7 días sin actividad de base de datos**. No se pierden datos y
un administrador lo reactiva desde el panel de Supabase en dos o tres minutos. Prevención: ping
diario (RF-15) más el tráfico real, porque el contenido se consulta en tiempo de ejecución.

| | |
|---|---|
| **Qué ve el usuario** | Las páginas públicas se sirven desde la última copia buena. Los formularios muestran, **solo ellos**, un aviso claro: «Ahora mismo no podemos recibir tu solicitud», con el botón de WhatsApp y el bloque de crisis intactos. |
| **Qué no puede pasar nunca** | Que un formulario diga «enviado» sin haber guardado. Que el bloque de crisis desaparezca por una caída de base de datos —sus textos se sirven también desde el código como respaldo—. Que la página quede en blanco. |

**Se verifica:** prueba de fallo inducido cortando la conexión a la base de datos.

## RNF-40 — Si cae n8n

| | |
|---|---|
| **Qué ve el usuario** | Nada distinto. Su solicitud se guardó en PostgreSQL antes de que ninguna automatización corriera, y ve la confirmación normal. |
| **Qué pasa por dentro** | El registro queda marcado como pendiente de notificar. La tarea horaria de reintento (RF-15) lo recoge cuando n8n vuelve. |
| **Qué no puede pasar nunca** | Que una solicitud quede sin avisar **y nadie lo sepa**. El panel muestra un contador visible de «pendientes de notificar»; si ese número crece, algo está roto y se ve. |

Esta es la razón entera de la regla de arquitectura de [`../CLAUDE.md`](../CLAUDE.md) §4. El
formulario de cita lo llena alguien pidiendo ayuda psicológica: si apuntara directo a un webhook,
un n8n pausado perdería ese mensaje en silencio.

**Se verifica:** AC-03 — se corta la automatización, se envía una solicitud, se comprueba que está
guardada y marcada.

## RNF-41 — Si cae Resend o se agota su tope diario

El plan Free tiene un tope de **100 correos al día** y 3.000 al mes. El tope diario es el que muerde
primero.

| | |
|---|---|
| **Qué ve el usuario** | Su confirmación en pantalla, siempre. El estado del correo no cambia lo que ve, porque su dato ya está guardado. |
| **Qué pasa por dentro** | El correo se encola y se reintenta cada hora (RF-15). El aviso a la administración tiene además la bandeja del panel como canal que no depende del correo. |
| **Qué no puede pasar nunca** | Que el usuario vea un error porque falló un correo, cuando su solicitud ya está a salvo. Que la difusión masiva de la campaña navideña se intente enviar desde el sitio: eso se exporta a CSV y sale desde el buzón institucional ([`01-srs.md`](./01-srs.md) §5.4). |

## RNF-42 — Si cae el feed de Instagram

| | |
|---|---|
| **Qué ve el usuario** | La última copia buena cacheada en la base de datos. Si no hay ninguna, **la sección desaparece por completo** (RF-05). |
| **Qué no puede pasar nunca** | Un hueco. Un esqueleto de carga permanente. Un mensaje de error. Un salto de maquetación. Y en ningún caso el navegador llama a un tercero: el feed se lee desde el servidor. |

## RNF-43 — El camino crítico funciona sin JavaScript

**El bloque de crisis y el formulario de cita funcionan con JavaScript deshabilitado o fallido.**
Umbral: con JS desactivado, los números son visibles y clicables, y el formulario se envía y se
guarda.

Es mejora progresiva sobre `<form>` nativo. Contempla conexiones lentas, equipos antiguos y el caso
frecuente de que el script simplemente no llegue a cargar.

---

# 7. Mantenibilidad

Origen: **X-01**, [`../CLAUDE.md`](../CLAUDE.md) §5.3.

El equipo entrega y se retira. Todo lo de esta sección se deduce de esa sola frase.

## RNF-44 — Cero secretos que caduquen sin renovación automática

**Umbral: el inventario de secretos no tiene ninguna fila con fecha de vencimiento manual.**

El caso concreto es el token de Meta para el feed de Instagram, que caduca cada 60 días. Por eso se
usa Behold: él lo renueva en su infraestructura y el sitio no guarda ningún secreto que expire
(RF-05).

## RNF-45 — Cero tareas programadas en GitHub Actions

**Umbral: cero workflows con `schedule` en el repositorio.**

Los workflows programados de GitHub Actions **se desactivan solos tras 60 días sin actividad del
repositorio**, que es exactamente el escenario del equipo que ya se fue. Las tareas de RF-15 corren
en n8n, con un disparador programado externo e independiente del repositorio como respaldo. Cada
tarea deja registro de su última ejecución, **visible en el panel** (AC-12): un trabajo programado
que nadie puede comprobar es un trabajo que se apagará sin que nadie lo note.

## RNF-46 — Todas las cuentas a nombre de la fundación

**Umbral: cero cuentas registradas al correo personal de un estudiante** (AC-10).

Aplica a todas: dominio, hosting, base de datos, correo transaccional, automatizaciones, analítica,
Behold, y la cuenta de Instagram vinculada. El correo de registro es el institucional de la
fundación. La lista completa, con propietario y fecha de renovación, vive en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).

## RNF-47 — El contenido sobrevive a la pérdida del proveedor

**Umbral: existe un respaldo con menos de 7 días de antigüedad, restaurable, y probado al menos una
vez antes de la entrega.**

- Volcado semanal automatizado de la base de datos hacia un repositorio privado (RF-15).
- Exportación del contenido del panel —noticias y eventos— a JSON versionado en el repositorio.
- Volcado manual mensual que Edwin puede hacer en dos clics, con el procedimiento escrito en el
  manual.
- **Un respaldo que nunca se restauró no es un respaldo.** La prueba de restauración es parte de la
  entrega.

## RNF-48 — Nada de conocimiento tácito

**Umbral: cero procesos operativos sin responsable con nombre en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md).**

Incluye: reactivar Supabase si se pausa, revalidar los números de crisis cada 190 días (RNF-06),
renovar el dominio, restaurar un respaldo, borrar los datos de quien lo pida (RNF-16), rotar un
secreto, dar de alta a un administrador nuevo. Cada uno con su procedimiento paso a paso, en
español, escrito para alguien que no estuvo en el proyecto.

---

# 8. Usabilidad del panel para un administrador no técnico

Origen: **X-03**, **R-02**, **R-04**, **C-06**, **C-07**, **C-08**, **AC-04**.

El panel se diseña para **una persona que entra una vez cada dos semanas y no recuerda dónde estaba
nada**. Ese es el usuario real, no un editor profesional.

## RNF-49 — El panel habla en español, no en jerga

**Umbral: cero anglicismos y cero términos técnicos en la interfaz.** Se verifica leyendo cada
pantalla en voz alta a alguien ajeno al proyecto.

| En vez de | El panel dice |
|---|---|
| Draft / Published / Archived | Borrador · Publicado · Archivado |
| Toggle status | Publicar · Dejar de mostrar |
| Slug | Dirección de la página |
| Alt text | Descripción de la imagen para quien no puede verla |
| Upload | Subir foto |
| Submissions / leads | Solicitudes |
| Export CSV | Descargar la lista para Excel |
| 2FA / MFA | Código de seguridad de tu teléfono |
| CMS | El panel |
| Deploy | (no aparece: Edwin no despliega nada) |

## RNF-50 — Confirmaciones destructivas que explican qué se pierde

**Umbral: ninguna acción irreversible ocurre con un solo clic.**

- Borrar exige un segundo paso deliberado —escribir el nombre del elemento o confirmar en un
  diálogo que **nombra el elemento concreto**, no «este ítem».
- El diálogo dice **qué se pierde** y **cuál es la alternativa**: «Si solo quieres que deje de
  verse, usa *Dejar de mostrar*. Podrás volver a publicarlo cuando quieras.» Esa alternativa existe
  porque Edwin la pidió por su nombre (C-06).
- **Ocultar nunca pide confirmación.** Es reversible, y pedir confirmación para lo reversible
  entrena a la gente a confirmar sin leer.

## RNF-51 — Se puede deshacer

**Umbral: toda eliminación de contenido es recuperable durante 30 días.** Plazo confirmado, no
propuesto.

Lo borrado va a una papelera visible desde el panel, con quién lo borró y cuándo. El borrado real
ocurre al vaciarla a mano o al vencer los 30 días, lo que pase primero.

**Esto no contradice RNF-11; es una fila suya.** La papelera aplica solo a **contenido** —noticias,
eventos, fotos—, nunca a los datos personales de las solicitudes, que se borran de verdad cuando
vence su retención y no pasan por ninguna papelera. Su plazo tiene fila propia en
[`07-modelo-datos.md`](./07-modelo-datos.md) §5.1 —`contenidos` con `eliminado_en` no nulo, 30
días—, que es donde vive el `DELETE` que la vacía y donde se comprueba que se cumple.

Además, **los borradores se autoguardan**. Nadie pierde media hora de texto por un fallo de red.

## RNF-52 — Los mensajes de error dicen qué hacer

**Umbral: cero mensajes que muestren un código, una excepción o la palabra «error» sin más.** Cada
mensaje tiene tres partes: qué pasó, qué hacer ahora, y a quién escribir si sigue pasando.

| En vez de | El panel dice |
|---|---|
| «Error 500» | «No pudimos guardar los cambios. Tu texto no se perdió: sigue en la pantalla. Intenta de nuevo en un minuto. Si vuelve a pasar, escribe a [contacto de soporte].» |
| «Validation failed: alt_text required» | «Falta la descripción de la foto. Escribe en una línea qué se ve en ella; sirve para las personas que no pueden verla.» |
| «Upload failed: file too large» | «Esta foto pesa demasiado. Súbela de nuevo con menos resolución, o usa otra.» |
| «Session expired» | «Se cerró tu sesión por seguridad. Vuelve a entrar; lo que escribiste quedó guardado como borrador.» |

## RNF-53 — El panel abre en lo urgente

**Umbral: al iniciar sesión, el contador de solicitudes pendientes es visible sin desplazarse, y la
solicitud de cita más antigua aparece destacada** (RF-12).

Alguien pidiendo ayuda psicológica no puede quedar sepultado bajo inscripciones de voluntariado.
Las solicitudes de cita se ordenan por antigüedad y la más vieja se marca. Si alguna lleva más de 7
días sin atender, la tarea semanal de RF-15 lo avisa.

🟡 **El panel debe ser usable desde el teléfono.** Se infiere del hecho de que hoy Edwin opera todo
por WhatsApp desde el celular (S-04); hay que confirmarlo con él.

## RNF-54 — La prueba que decide si el panel sirve

**Umbral: Edwin agrega y oculta una noticia, sin ayuda del equipo, sin abrir el manual, en menos de
10 minutos.** 🟡 El límite de 10 minutos es del equipo; el resto es AC-04 y C-08.

Es una prueba piloto con él antes de la entrega, no una demostración. Quien la conduce se calla y
observa. Si Edwin se traba, el que falló es el panel.

---

# 9. Lenguaje claro

Origen: **X-03**, **X-04**, **S-03**, [`../CLAUDE.md`](../CLAUDE.md) §5.4.

**Por qué es un requisito de seguridad y no de estilo.** El público de estas páginas incluye a
personas en crisis y a personas en pobreza. En crisis, la capacidad de leer y procesar cae: una
frase larga se relee, y releer cansa, y quien se cansa cierra la página. Si alguien no entiende
dónde está el número, no llama. La legibilidad aquí es el último tramo del camino entre una persona
y la Línea 147. Todo lo demás del sitio puede ser mejorable; esto no.

## RNF-55 — Nivel de lectura objetivo

**Umbral operativo, en las páginas de crisis, el formulario de cita y la política de privacidad:**

- Longitud media de frase **≤ 20 palabras**, y ninguna frase por encima de 30.
- **Voz activa.** «Te contestamos en 48 horas», no «su solicitud será atendida».
- **Cero siglas sin explicar** la primera vez: MIDES, MINSA, INSAM, CSS, ACH, ITBMS.
- **Cero tecnicismos clínicos.** «Pensamientos de quitarse la vida», no «ideación autolítica».
- Una idea por párrafo.

El objetivo declarado es un nivel de lectura de **escuela primaria alta**. 🟡 Existen índices de
legibilidad para el español —Fernández Huerta, INFLESZ— que podrían usarse como medida
complementaria, pero no están verificados en el anexo de investigación; el umbral que se exige es
el de longitud de frase, que cualquiera puede medir.

**Se verifica:** alguien ajeno al proyecto lee la página en voz alta. Donde tropieza, se reescribe.
Tres personas distintas antes del lanzamiento.

## RNF-56 — Texto real, nunca dentro de una imagen

**Umbral: cero números de teléfono, direcciones o datos bancarios dentro de una imagen.**

Un teléfono dentro de una imagen no se puede seleccionar, no se puede copiar, no es clicable, no lo
lee un lector de pantalla y desaparece si la imagen no carga. El número de crisis, además, es
**legible sin hacer zoom** y está **por encima del pliegue** en las páginas donde importa (RNF-05).

Lo mismo para los datos de la cuenta bancaria y el alias de Yappy: texto copiable con botón de
copiar (RF-09).

## RNF-57 — Los botones dicen la acción

**Umbral: ningún botón etiquetado solo «Enviar», «Aceptar» o «Continuar».**

Se escribe «Enviar mi solicitud de cita», «Quiero ser padrino o madrina», «Copiar el número de
cuenta». La persona debe saber qué va a pasar **antes** de pulsar, no después.

---

# 10. Tabla de verificación

Quién verifica cada cosa. El reparto definitivo vive en
[`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md); esta es la propuesta.

| Rol | Persona | Estado |
|---|---|---|
| **Contenido y mensajes seguros** | Edwin Quintero escribe; **Octavio Frauca** revisa antes de publicar | 🟡 Inferido de C-01 y C-12 |
| **Sitio público y formularios** | **Jeremy Martínez** | 🟡 Inferido de C-02 y C-03 |
| **Panel administrativo** | **Rafael Gómez** | 🟡 Inferido de C-04, C-06, C-07 y C-08 |
| **Datos, seguridad e infraestructura** | **Juan Zhu** | 🔴 Sin respaldo en las fuentes; hay que asignarlo |
| **Aceptación final** | **Edwin Quintero** | ✅ C-11 |

| RNF | Umbral | Cómo se verifica | Quién |
|---|---|---|---|
| RNF-01 | Cero términos prohibidos publicados | Aviso del editor al guardar + revisión humana | Contenido |
| RNF-02 | Cero excepciones a las seis prohibiciones OMS/IASP | Lista de RNF-08 firmada por pieza | Contenido |
| RNF-03 | 100 % de piezas del tema cierran con recursos y esperanza | Lista de RNF-08 | Contenido |
| RNF-04 | Solo 911 y Línea 147 (147 / WhatsApp 6694-2747) | Revisión de contenido + registro de verificación | Contenido |
| RNF-05 | Banda en **todas** las páginas; bloque completo en la lista canónica de RNF-05; cero copias a mano | Búsqueda en el código + recorrido del armazón y de las páginas de la lista | Panel |
| RNF-06 | Cero números publicados sin fecha de verificación | Llamada telefónica documentada; tarea programada de revalidación cada 190 días | Contenido |
| RNF-07 | Cero apariciones del feed en páginas de salud mental | Recorrido de las páginas del ámbito | Sitio público |
| RNF-08 | Lista completada con nombre y fecha por pieza | Nota interna en el panel | Contenido |
| RNF-09 | Cero campos fuera de la tabla; el motivo de consulta es opcional | Revisión de los esquemas Zod contra la tabla y contra las columnas de 07 §3.7–§3.12 | Sitio público |
| RNF-10 | Cero casillas premarcadas | Revisión de código + prueba de envío sin marcar | Sitio público |
| RNF-11 | Cero tablas de personas sin plazo en [`07-modelo-datos.md`](./07-modelo-datos.md) §5.1 y sin borrado automatizado | Consulta al esquema contra 07 §5.1 + prueba del trabajo de borrado | Datos |
| RNF-12 | Cero campos de formulario y cero columnas de texto con datos personales de un menor; imágenes solo con consentimiento firmado | Revisión del esquema y de los formularios + inventario de consentimientos | Datos |
| RNF-13 | Cero fotos sin consentimiento firmado registrado | Lista de RNF-08 punto 7 + inventario de consentimientos | Contenido |
| RNF-14 | Cero correos **a la administración** con el contenido del formulario (el de confirmación al solicitante sí lo lleva) | Inspección de las plantillas de correo | Datos |
| RNF-15 | Se responde sin releer quién, para qué, cuánto y cómo borrar | Lectura por tres personas ajenas | Contenido |
| RNF-16 | Un administrador lo completa en < 10 min sin ayuda | Ensayo con el procedimiento escrito | Panel |
| RNF-17 | Cero tablas de personas sin RLS; política probada en negativo | Consulta al catálogo + hook + prueba de acceso denegado (AC-06) | Datos |
| RNF-18 | Un editor recibe acceso denegado a la bandeja de citas | Prueba con cuenta de rol editor | Datos |
| RNF-19 | Cero secretos en el repositorio; cero secretos que caduquen | Análisis del historial + inventario de secretos | Datos |
| RNF-20 | Las cinco cabeceras presentes; HTTP redirige con 301 | `curl -I` + comprobación en integración continua | Datos |
| RNF-21 | Cero escrituras sin validación de servidor | Prueba por formulario saltándose el cliente | Sitio público |
| RNF-22 | Cero CAPTCHAs visuales; cero descartes silenciosos | Revisión de los formularios + prueba de envío rechazado en cuarentena | Sitio público |
| RNF-23 | Accesos, exportaciones y cambios con autor y fecha | Revisión de la bitácora tras una sesión de prueba | Datos |
| RNF-24 | `npm audit` sin altos ni críticos; `npm run build` limpio | Ejecución antes de la entrega | Datos |
| RNF-25 | 4.5:1 texto normal · 3:1 texto grande · 3:1 no textual | axe DevTools + comprobación de la paleta | Sitio público |
| RNF-26 | Cero imágenes sin `alt`; el panel no publica sin él | axe + intento de publicar sin descripción | Panel |
| RNF-27 | Cero campos con solo `placeholder` | axe + revisión manual del formulario de cita | Sitio público |
| RNF-28 | Cero enlaces/botones vacíos; `lang="es"` en toda página | axe | Sitio público |
| RNF-29 | 24×24 px CSS; foco visible y no oscurecido | Recorrido con teclado en móvil real + medición en el navegador | Sitio público |
| RNF-30 | Tarea completa sin ratón; nada solo por arrastre | Recorrido con teclado de extremo a extremo | Sitio público |
| RNF-31 | Usable al 200 % de zoom | Prueba manual de zoom | Sitio público |
| RNF-32 | Cero pruebas cognitivas; **cero errores AA en rutas críticas** | axe sobre las nueve rutas + teclado + lector de pantalla (AC-07) | Sitio público |
| RNF-33 | LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 al percentil 75 | Informe de Core Web Vitals de Search Console (datos de campo) | Sitio público |
| RNF-34 | Inicio ≤ 1.000 KB · contenido ≤ 700 KB · citas ≤ 400 KB | Comprobación de tamaño en integración continua | Sitio público |
| RNF-35 | Hero sin carga diferida; toda `<img>` con dimensiones; WebP/AVIF | Revisión de código + panel de red del navegador | Sitio público |
| RNF-36 | Espacio reservado en todo lo que carga tarde; fachada de clic previo | Medición de CLS con contenido de terceros activo | Sitio público |
| RNF-37 | INP ≤ 200 ms en la galería más grande | Medición en la página de proyecto con más fotos | Sitio público |
| RNF-38 | 🔴 **Pendiente.** 99 % mensual propuesto; herramienta de comprobación **sin decidir** | No verificable todavía: falta elegir herramienta y presupuestarla. Decisión del equipo | Infraestructura |
| RNF-39 | Nunca «enviado» sin guardar; el bloque de crisis nunca desaparece | Prueba de fallo inducido cortando la base de datos | Datos |
| RNF-40 | La solicitud se guarda igual y queda marcada | Prueba de fallo inducido con la automatización apagada (AC-03) | Datos |
| RNF-41 | El usuario nunca ve un error por un fallo de correo | Prueba con envío de correo forzado a fallar | Datos |
| RNF-42 | Copia buena o sección ausente; nunca hueco ni error | Prueba con la fuente del feed apagada | Sitio público |
| RNF-43 | Crisis y formulario de cita funcionan sin JavaScript | Prueba con JavaScript desactivado en el navegador | Sitio público |
| RNF-44 | Cero secretos con vencimiento manual | Revisión del inventario de secretos | Infraestructura |
| RNF-45 | Cero workflows con `schedule` en el repositorio | Búsqueda en el repositorio + registro de ejecución visible (AC-12) | Infraestructura |
| RNF-46 | Cero cuentas al correo de un estudiante | Revisión de traspaso cuenta por cuenta (AC-10) | Infraestructura |
| RNF-47 | Respaldo < 7 días, restaurado y probado una vez | Ensayo de restauración antes de la entrega | Infraestructura |
| RNF-48 | Cero procesos sin responsable con nombre | Revisión de `09-operacion-y-traspaso.md` | Aceptación |
| RNF-49 | Cero anglicismos y tecnicismos en la interfaz | Lectura en voz alta de cada pantalla por alguien ajeno | Panel |
| RNF-50 | Ninguna acción irreversible con un solo clic | Recorrido de las acciones destructivas del panel | Panel |
| RNF-51 | Toda eliminación de contenido recuperable 30 días (fila propia en 07 §5.1) | Prueba de borrado y recuperación + prueba de la purga a los 30 días | Panel |
| RNF-52 | Cero mensajes con código o excepción a la vista | Inventario de mensajes de error del panel | Panel |
| RNF-53 | Contador de pendientes visible al entrar; la más vieja destacada | Revisión del panel tras iniciar sesión | Panel |
| RNF-54 | **Edwin publica y oculta una noticia solo, en < 10 min** | Prueba piloto con Edwin (AC-04, C-08) | Aceptación |
| RNF-55 | Frase media ≤ 20 palabras; cero siglas sin explicar | Lectura en voz alta por tres personas ajenas | Contenido |
| RNF-56 | Cero teléfonos o datos bancarios dentro de una imagen | Revisión de las páginas de crisis, citas y donaciones | Contenido |
| RNF-57 | Ningún botón etiquetado solo «Enviar» | Inventario de botones del sitio | Sitio público |

---

## Lo que este documento deja pendiente

| # | Qué falta | Quién lo debe |
|---|---|---|
| 1 | Llamar al **147**, al **169** y a los números del **INSAM**, y anotar qué contesta cada uno (RNF-06). No se puede sustituir por búsquedas web. | Equipo, antes del lanzamiento |
| 2 | Aprobar los **plazos de retención**, hoy propuestos. Están en [`07-modelo-datos.md`](./07-modelo-datos.md) §5.1, no en este documento (RNF-11). | Edwin Quintero |
| 3 | El **consentimiento firmado** para publicar fotos de niños y de personas en situación de calle (RNF-13). | Edwin Quintero |
| 4 | El **protocolo clínico** para cuando llegue por el formulario una persona en riesgo inminente: quién lo detecta, en cuánto tiempo, con qué guion y con qué respaldo profesional. **El sitio no debería lanzarse sin esto**, y no es una decisión del equipo técnico. | Edwin Quintero |
| 5 | El **plazo real de respuesta** a una solicitud de cita y los días en que nadie revisa (RNF-05). | Edwin Quintero |
| 6 | Decidir si se pide **rango de edad** en el formulario de cita, con la consecuencia descrita en RNF-09. | Edwin Quintero |
| 7 | Confirmar si el **panel se usará desde el teléfono** (RNF-53). | Edwin Quintero |
| 8 | Asignar el rol de **datos, seguridad e infraestructura** de la tabla de verificación. | Equipo |
| 9 | Elegir la **herramienta de monitoreo de disponibilidad** de RNF-38, con su costo, su canal de aviso y su responsable. Sin eso, RNF-38 no es verificable. | Equipo |
| 10 | Descargar el PDF de la actualización 2023 del recurso OMS/OPS en español y adjuntarlo a la guía de estilo del panel. | Equipo |
