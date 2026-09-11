# ADR-0003: Feed de Instagram con Behold.so, leído desde el servidor

Estado: Aceptada | Fecha: 6 de septiembre de 2026 | Decide: equipo de desarrollo

## Contexto

Instagram es hoy la única vitrina de REFUVA y la fuente de las fotos y del tono de comunicación
(S-08). RF-05 pide que el Inicio muestre publicaciones recientes, actualizadas solas, **sin
credenciales que el equipo tenga que renovar a mano** (X-01).

El estado real de las APIs de Meta, verificado el 6 de septiembre de 2026 en
[`../anexos/investigacion-tecnica-2026-09-06.md`](../anexos/investigacion-tecnica-2026-09-06.md):

- La **Instagram Basic Display API** —la que leía el feed de una cuenta personal— fue **apagada el 4
  de diciembre de 2024**. No está obsoleta pero funcionando: está muerta. Cualquier tutorial anterior
  a 2025 induce a error.
- El reemplazo es la **Instagram API with Instagram Login**, que exige cuenta Profesional (Business o
  Creator) y funciona con tokens de larga duración de **60 días**.
- Cita textual de la documentación de Meta: un token de larga duración que no se refresca en 60 días
  «expirará y ya no podrá ser refrescado». **Muere de forma irreversible.** Recuperarlo exige rehacer
  el flujo OAuth completo desde Meta for Developers, con acceso de administrador a la app y al
  `client_secret`.

Y hay un segundo asunto, que no es técnico. El sitio habla de suicidio. La crítica de completitud del
anexo registra que el frente de contenido de salud mental desaconsejaba un feed automático y pedía
galería curada a mano. Esa preocupación es legítima: en la portada de un sitio de prevención no puede
aparecer contenido que nadie revisó (SRS §6.4).

## Decisión

**Behold.so en plan gratuito, leído desde el servidor y cacheado en la base de datos, con capacidad
de ocultar publicaciones desde el panel.**

En concreto:

- La cuenta de Instagram de REFUVA se convierte a Profesional (gratis y reversible desde la app).
- Se conecta en el panel de Behold **con el correo institucional de la fundación**, nunca con el
  Gmail de un estudiante (CLAUDE.md §5.3). Behold es quien mantiene el token de Meta; nosotros no
  dejamos ningún secreto que caduque.
- Una tarea programada diaria (RF-15) lee el JSON de Behold **desde el servidor** y guarda el
  resultado en Supabase. El navegador del visitante nunca llama a un tercero: sin scripts externos,
  sin cookies de terceros, sin banner de consentimiento.
- El panel muestra las publicaciones cacheadas con un interruptor por publicación. **Ocultar una es
  un requisito de seguridad de contenido, no una comodidad.**
- Si la fuente falla, se muestra la última copia buena. Si no hay ninguna, la sección desaparece. No
  se deja un hueco ni un mensaje de error en la portada de la fundación.

Esto resuelve la contradicción registrada en el anexo: **feed automático, sí; sin revisión, no.**

## Alternativas consideradas

| Opción | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Instagram API with Instagram Login directamente** | Sin intermediarios, sin tope de vistas, control total del formato. Suena como el trabajo «bien hecho» para un proyecto universitario. | El token de 60 días muere irreversiblemente si nadie lo refresca. El cron de refresco necesita además almacenamiento persistente donde guardar el token rotado, y hay que vigilar que ese cron no falle. El límite de uso se calcula como 4800 × impresiones en 24 horas, lo que castiga a las cuentas pequeñas. La App Review de Meta puede tomar de 2 a 4 semanas. | **Argumento decisivo: el equipo se va (X-01).** El feed se apagaría en silencio unas ocho semanas después de la entrega y Edwin no tendría cómo arreglarlo sin contratar a alguien. Es deuda técnica con fecha de detonación conocida. |
| **Widget embebido en el navegador** (Behold, SnapWidget, Elfsight, Curator) | Se instala pegando una etiqueta `<script>`. Cero backend. | Carga JavaScript de terceros y arrastra cookies de terceros, lo que obliga a banner de consentimiento — precisamente lo que la analítica sin cookies evita. Retrasa el LCP y provoca desplazamiento de diseño cuando el widget llega tarde. Y el contenido entra directo a la portada sin pasar por nadie. | Rompe tres cosas a la vez: rendimiento (AC-08), privacidad del visitante y control editorial (RF-05). |
| **Galería manual curada desde el panel** | Control editorial absoluto. Cero dependencias. Es lo que pedía el frente de salud mental. | Es trabajo recurrente para la única persona que opera la fundación (O-02, O-03). Si Edwin no lo hace, la portada envejece y transmite abandono. | Se descarta como mecanismo principal, pero **se conserva como respaldo**: si el feed externo cae, la sección muestra la última copia guardada. |
| **LightWidget Upgraded, pago único** | Es la única opción del mercado sin suscripción recurrente. Un solo pago por widget, instalable en páginas ilimitadas. | Es un widget de navegador, con los mismos problemas de cookies y rendimiento. El plan gratuito ni siquiera soporta HTTPS. Y cuesta dinero, cuando el objetivo es B/.0.00 recurrente (X-02). | Sigue siendo el plan B documentado si Behold cambia de política, pero no gana hoy. |

## Consecuencias

**Lo que ganamos**

- **Cero secretos que caduquen del lado de REFUVA.** El token de Meta vive en la infraestructura de
  Behold. Es la condición que impone X-01.
- Cero JavaScript de terceros en el navegador, cero cookies de terceros, cero banner de
  consentimiento, y ningún dominio externo retrasando el LCP.
- Control editorial real: ninguna publicación aparece en portada sin que Edwin pueda quitarla en dos
  clics.
- El sitio degrada con elegancia. Nunca hay un hueco blanco donde debería ir el feed.
- B/.0.00 al mes.

**Lo que aceptamos**

- Dependencia de un proveedor pequeño. Se mitiga porque el feed está cacheado en nuestra base: si
  Behold desaparece mañana, el sitio sigue mostrando la última copia mientras se cambia de fuente.
- El plan gratuito da **hasta 6 publicaciones, 1 fuente y refresco diario**, y al agotar su tope de
  vistas mensuales la cuenta se pausa. RF-05 pide un mínimo de tres publicaciones, así que cabe con
  holgura; y al leer desde el servidor una vez al día, el consumo es de unas 30 lecturas al mes.
- El feed muestra lo de ayer, no lo de hace cinco minutos. Para esta fundación no importa.
- 🔴 **Pendiente:** confirmar por escrito con `hello@behold.so` si las peticiones al JSON cuentan
  como «vistas» contra el tope del plan gratuito. La documentación define vista como carga de página
  con widget, lo que sugiere que no. Hay que preguntarlo antes de comprometerse, aunque la estrategia
  aguanta igual porque solo se hacen una o dos peticiones diarias.
- 🔴 **Pendiente:** convertir la cuenta a Profesional y dar de alta Behold con el correo
  institucional. Responsable: Octavio, que es el canal con Edwin (C-12). Va al inventario de
  contenido.
- 🟡 **Inferido:** que leer solo el feed propio no exige App Review de Meta. Como con Behold el que
  llama a la API es Behold y no nosotros, deja de ser un riesgo del proyecto.

## Cuándo reconsiderar esta decisión

- **Si Behold cambia su plan gratuito o pausa la cuenta por exceso de vistas.** El disparador es
  concreto: la primera vez que la tarea diaria registre una respuesta de cuota agotada. Plan B,
  LightWidget con pago único; plan C, Curator.io gratuito, que no publica tope de vistas a cambio de
  mostrar su marca.
- **Si aparece alguien que se haga cargo del mantenimiento** de forma sostenida y con nombre. Solo
  entonces la API directa de Meta vuelve a la mesa, porque el único argumento en su contra es que
  nadie va a refrescar el token.
- **Si Meta vuelve a cambiar de API.** Ya lo hizo el 4 de diciembre de 2024 y el 27 de enero de 2025
  con los scopes. La ventaja de Behold es que absorbe ese cambio; si un día no lo absorbe, esta
  decisión se cae con él.
