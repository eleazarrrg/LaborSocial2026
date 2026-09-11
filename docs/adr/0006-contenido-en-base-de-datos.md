# ADR-0006: El contenido vive en la base de datos, no en Markdown dentro del repositorio

Estado: Aceptada | Fecha: 6 de septiembre de 2026 | Decide: equipo de desarrollo

## Contexto

R-02 es una de las peticiones más claras de la reunión: Edwin quiere **poder editar la página él
mismo** —agregar una noticia, ocultar un evento que ya pasó— sin llamar al equipo. C-06 y C-08 lo
concretan: ocultar además de borrar, y una prueba piloto en la que él mismo agregue y quite una
noticia antes de la entrega. AC-04 lo convierte en criterio de aceptación: si Edwin no publica y
oculta solo, el proyecto no está entregado.

La investigación técnica recomendaba la solución clásica de un sitio de contenido: **Sveltia CMS
sobre git**, con las noticias y los eventos como archivos Markdown dentro del repositorio, generados
en tiempo de compilación. Es una recomendación buena y su argumento principal es fuerte: los archivos
de texto sobreviven a cualquier proveedor.

Pero el propio anexo registra la contradicción en su crítica de completitud, y la llama la más grave:
si el contenido es Markdown compilado, **el tráfico real nunca toca la base de datos** y el proyecto
gratuito de Supabase se pausa igual a los siete días.

## Decisión

**El contenido editorial —noticias, eventos y los textos de las siete líneas de acción— vive en
PostgreSQL y se consulta en tiempo de ejecución.** Se edita desde el panel administrativo propio
(módulos 3.2.2 y 3.2.3), en español, contra las mismas tablas y las mismas políticas RLS que el resto
del sistema.

Tres argumentos, en orden de peso:

1. **Edwin no usa git y no debería tener que aprenderlo.** Un CMS sobre git le pide entender
   commits, ramas y despliegues para publicar una noticia. El perfil es una persona no técnica que
   entra una vez cada dos semanas y no recuerda dónde estaba nada (X-03). El panel tiene que
   parecerse a un formulario, no a un flujo de trabajo de desarrollo.
2. **El tráfico real cuenta como actividad y evita la pausa por inactividad.** Supabase pausa los
   proyectos Free tras una semana sin actividad de base de datos, y su documentación confirma que
   «unas pocas peticiones a la base cada día durante la semana previa» bastan para evitarlo.
   Consultar el contenido en tiempo de ejecución convierte las visitas del sitio en el mecanismo
   principal de mantenimiento vivo; el ping programado de RF-15 queda como red de seguridad, no como
   única defensa.
3. **Publicar no puede exigir un despliegue.** Con Markdown en el repositorio, cada edición dispara
   una compilación: si la compilación falla, Edwin ve un error de un sistema que no entiende y no
   tiene a quién llamar. Con la base de datos, publicar es guardar una fila.

## Alternativas consideradas

| Opción | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **CMS sobre git: Sveltia** | Licencia MIT, gratis para siempre, sin servidor y sin base de datos. Desarrollo activo en 2026. **El contenido queda como archivos de texto que sobreviven a cualquier CMS**, que es la propiedad más valiosa de esta familia. | Publicar exige git y despliegue. Lo mantiene un equipo muy pequeño, y **no está confirmado que su interfaz esté traducida al español** — requisito bloqueante para Edwin. Y deja a Supabase sin tráfico. | Los tres argumentos de la decisión apuntan en su contra a la vez. Es la alternativa que más duele descartar y por eso se paga el precio explícito de abajo. |
| **CMS sobre git: Decap** | Sí tiene interfaz en español. Compatible con la configuración de Sveltia. | Prácticamente estancado: solo lanzamientos ocasionales desde su renombrado en febrero de 2023. Mismos problemas de git, despliegue y pausa. | Elegir hoy una herramienta estancada para un sitio que nadie va a mantener en tres años suma riesgo sin resolver nada. |
| **CMS sobre git: Tina** | Plan gratuito con documentos ilimitados y experiencia de edición moderna. | El plan gratuito son 2 editores, y C-10 exige capacitar a más de una persona con margen de crecer. El tercer usuario cuesta 24 USD al mes, unos 864 USD a tres años. Ata el proyecto a TinaCloud. | Un techo de dos editores choca de frente con el plan de traspaso, y el salto de precio es inasumible (X-02). |
| **Payload 3** | MIT, gratuito, autoalojado, panel traducido a más de 30 idiomas incluido el español, y corre dentro de la misma aplicación Next.js. | Exige Next.js 16.2.6 o superior, y **Payload 4 está en pre-alfa**: hay una migración mayor en el horizonte de 12 a 24 meses. Después de la entrega no habrá quien la haga. | Es una fecha de caducidad conocida en un proyecto cuya restricción central es que nadie lo va a mantener (X-01). |
| **Strapi 5 Community** | MIT, gratis para siempre autoalojado, con roles, permisos e i18n sin límite. | Es un segundo servicio con su propia base de datos, su propio panel y su propio ciclo de parches. Duplica el lugar donde vive el esquema y donde vive la autenticación. | Duplicar infraestructura para lo que el panel propio ya tiene que construir de todas formas para las bandejas de solicitudes. |
| **Sanity** | El plan gratuito alcanza de sobra en volumen: 20 asientos y 10.000 documentos. | Solo tiene dos roles, Administrador y Visor: Edwin tendría que ser Administrador y podría romper el esquema sin querer. Y **sus datasets gratuitos son públicos**, lo que impide guardar cualquier dato sensible. | Sin barandas para un editor no técnico, y con datasets públicos en un sistema que maneja solicitudes de atención psicológica. Descartado. |
| **WordPress** | Edwin podría editar desde el primer día, y cualquier persona en Panamá sabe usarlo. | Cerca del 90% de los ataques entran por plugins o temas desactualizados. El mantenimiento profesional se cotiza entre 50 y 170 EUR al mes: la opción más cara a tres años pese a ser «gratis». | Un WordPress sin nadie que aplique parches se compromete, y ese es literalmente el escenario post-entrega. |

## Consecuencias

**Lo que ganamos**

- Edwin publica, oculta y archiva desde un panel en español, sin git, sin despliegue y sin nosotros
  (AC-04, RF-01).
- El tráfico orgánico mantiene el proyecto Supabase despierto. La pausa por inactividad deja de ser
  el riesgo principal.
- Un solo lugar para todo: contenido, solicitudes, ajustes y sesiones, con las mismas políticas RLS y
  el mismo inicio de sesión. Un panel, un secreto, un respaldo.
- El sitio queda extensible como pidió C-07: una sección nueva es una tabla y una pantalla, no un
  cambio de herramienta.
- Ocultar y borrar son operaciones distintas y ambas existen, que es exactamente lo que se comprometió
  en la reunión (C-06).

**Lo que aceptamos**

Hay que decirlo sin adornos: **con Markdown en el repositorio, el contenido de REFUVA sobreviviría a
cualquier proveedor.** Si Sveltia muriera, los archivos se abren con un editor de texto y ya. Al
poner el contenido en una base de datos alojada, esa propiedad se pierde: si el proyecto de Supabase
se borra, se pausa más allá de su ventana de restauración o la cuenta se pierde, **el contenido se va
con él.**

Por eso la consecuencia aceptada es concreta y no opcional:

- **El respaldo periódico de la base de datos (RF-15) deja de ser una buena práctica y pasa a ser
  parte del diseño.** Semanal automatizado, disparado por algo que no dependa del repositorio de
  GitHub, más un volcado manual mensual que Edwin sabe hacer y que está documentado en el manual.
- Se exporta además el contenido a un formato versionado y legible fuera del sistema, para que
  noticias y eventos sobrevivan incluso a la pérdida total del proveedor.
- 🔴 **Pendiente:** el nombre de la persona responsable de verificar que el respaldo corrió. Va en
  [`../09-operacion-y-traspaso.md`](../09-operacion-y-traspaso.md). Un respaldo sin dueño es un
  respaldo que nadie descubre roto hasta que hace falta.
- Cada tarea programada deja registro de su última ejecución, visible en el panel, para que el fallo
  se pueda ver sin entrar a un log (RF-15).
- Se acepta también el costo de construir el editor: pantallas de contenido con borrador, publicado y
  archivado, subida de imágenes con texto alternativo obligatorio y validación en español. La
  investigación lo estima entre dos y cuatro semanas de trabajo estudiantil.

## Cuándo reconsiderar esta decisión

- **Si en la revisión de traspaso no hay una persona con nombre a cargo de verificar el respaldo.**
  Ese es el disparador exacto: sin ese nombre, la consecuencia aceptada arriba no se sostiene y el
  contenido en Markdown dentro del repositorio vuelve a ser la opción correcta, aunque cueste que
  Edwin dependa de alguien para publicar.
- **Si Supabase deja de ofrecer un plan gratuito viable** para la fundación, o si la ventana de
  restauración de un proyecto pausado se acorta de forma que un trimestre sin actividad ponga el
  contenido en riesgo.
- **Si a los seis meses de la entrega Edwin no ha publicado nada.** Si el contenido resulta ser
  esencialmente inmutable, el argumento de «publicar sin desplegar» pierde su fuerza y la portabilidad
  del texto plano pasa a valer más.
