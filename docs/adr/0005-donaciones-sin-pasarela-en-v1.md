# ADR-0005: Donaciones sin pasarela de pago en v1

Estado: Aceptada | Fecha: 6 de septiembre de 2026 | Decide: equipo de desarrollo

## Contexto

Recibir donaciones con confianza y sin fricción es uno de los cinco trabajos del sitio. RF-09 exige
mostrar cómo donar **sin formulario y sin registro**: nada de muros antes de dar dinero.

La pregunta abierta es si el portal procesa el pago o solo informa cómo pagar.

Dos restricciones acotan la respuesta antes de mirar precios. La primera: el sitio **no procesa, no
transmite y no almacena datos de tarjeta**, nunca (CLAUDE.md §5.5). La segunda: el objetivo de costo
recurrente es B/.0.00 y Edwin ya paga cosas de su bolsillo (X-02).

Hay además un bloqueante que no depende de nosotros. Cualquier cobro por Yappy exige **cuenta
comercial en Banco General a nombre de la fundación y Banca en Línea Comercial activa**. Ese trámite
depende de la figura legal y la personería jurídica, que son 🔴 Pendiente (O-10, A-01, A-02, S-06).

Y una corrección de la reunión que conviene repetir: **Stripe no opera en Panamá.** En Latinoamérica
solo soporta Brasil y México. La vía de constituir una LLC en Estados Unidos es inviable e
inconveniente para una fundación panameña.

## Decisión

**v1 no lleva pasarela de pago en el sitio.** La página de donaciones muestra:

- El **alias de Yappy Comercial** y su **código QR**, descargable.
- Los **datos de transferencia** completos —banco, tipo de cuenta, número y titular exactamente como
  figura en el banco— cada uno con botón de copiar. Por ACH el costo de recibir es B/.0.00, y ACH
  Xpress acredita en tiempo real hasta B/.5,000.00 sin comisión.
- Un canal para enviar el comprobante y pedir recibo.

Todo eso es **editable desde el panel** (módulo 3.2.7). Un número de cuenta quemado en el código es
un error de diseño.

Es el patrón que ya usan las fundaciones panameñas reales: Fundación Ayudinga y FUNDASIS publican sus
datos bancarios completos junto a su alias de Yappy.

**El sitio nunca toca datos de tarjeta.** Cuando llegue v2, el cobro será por redirección a un
checkout alojado del proveedor, nunca por formulario propio ni por iframe.

## Alternativas consideradas

> Las comisiones de esta tabla salen de
> [`../anexos/investigacion-tecnica-2026-09-06.md`](../anexos/investigacion-tecnica-2026-09-06.md),
> frente `pagos-panama`, verificadas el 6 de septiembre de 2026. El presupuesto vive en
> [`../05-stack-y-presupuesto.md`](../05-stack-y-presupuesto.md).

| Opción | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Botón de Pago Yappy V2** | La mejor tarifa del mercado panameño: 1% + ITBMS, mínimo B/.0.02, sin mensualidad ni costo de afiliación. Sobre una donación de B/.15.00 son B/.0.16. Como mueve fondos entre cuentas por la app del banco, no hay tarjeta: saca a REFUVA del alcance PCI por completo en ese canal. Documentación pública y ambiente de pruebas. | Exige backend propio: llamadas de servidor a `payments/validate/merchant` y `/payments/payment-wc`, más un endpoint IPN que valide HMAC-SHA256, con la clave secreta atada a un dominio declarado. Y el Botón de Pago **está en proceso de descontinuación y migración**; el área comercial de Yappy muestra un aviso fijo de ese proceso. | No se descarta por malo: se **aplaza**. Es la primera opción de v2 (V2-01). Hoy no hay cuenta comercial confirmada, no hay quien mantenga el endpoint IPN después de la entrega, y la versión está en migración. |
| **PagueloFacil** | Opera en Panamá, sin cuota de afiliación ni mensualidad. Tiene un «Plan Personalizado» explícitamente para ONG y fundaciones, con tarifas negociables. | Plan estándar: 3.5% + B/.0.50 por transacción aprobada, B/.0.35 por transacción rechazada, B/.1.00 por retiro. Sobre B/.15.00 son B/.1.03, casi siete veces Yappy. Contracargo B/.60.00 + ITBMS. | Es tarjeta: agrega cumplimiento, conciliación y comisiones altas para el ticket típico de esta fundación. Si algún día se abre el canal de tarjeta, se pide cotización por el Plan Personalizado, nunca el estándar. |
| **Tilopay** | Facilitador que opera en Panamá sin mensualidad, y deja elegir a qué banco se depositan los fondos. Revende el Botón de Pago Yappy. Alta declarada en menos de cinco minutos. | Por Yappy vía Tilopay la comisión total es 2% (1% suyo más 1% de Yappy, más ITBMS), con mínimo de B/.0.30: sobre B/.15.00 cuesta casi el doble que Yappy directo. Y de todas formas exige cuenta comercial en Banco General y credenciales de Yappy Comercial. | Añade un intermediario y duplica la comisión sin quitar el requisito que hoy bloquea. |
| **PayPal (botón Donar alojado)** | Funciona en Panamá. El botón en sí es gratuito, sin mensualidad ni configuración. Sirve para donantes de la diáspora. | Es la opción más cara: 5.40% + B/.0.30, o sea B/.1.11 sobre una donación de B/.15.00. El golpe real es el retiro: mínimo USD 15.00 o 1%, el que sea mayor. **PayPal Giving Fund no aplica a Panamá**: solo opera en EE. UU., Reino Unido, Canadá, Irlanda y Australia. | Sobre donaciones pequeñas y frecuentes —el perfil real de esta fundación— la comisión más el retiro se comen una parte que importa. |
| **Comercio Electrónico BG (Banco General)** | Sin costo de inscripción, sin mensualidad y sin contracargos. Ofrece «Secure Acceptance», formularios de pago alojados que cumplen PCI, con 3DS 2.0 y ambiente de pruebas. REFUVA ya sería cliente del banco. | Es integración de tarjeta sobre Cybersource: más piezas, conciliación y un ambiente de producción que alguien tiene que sostener. Y arranca del mismo requisito: cuenta comercial. | Aplazado igual que el Botón de Pago. Es la primera opción del día que se abra el canal de tarjeta, por costo fijo cero y por checkout alojado. |
| **Stripe** | — | **No opera en Panamá.** | Vía muerta. Se deja escrito para que nadie del equipo pierda semanas en ella. |

## Consecuencias

**Lo que ganamos**

- **REFUVA queda en el escenario PCI más simple.** Al no procesar, transmitir ni almacenar datos de
  tarjeta, aplica SAQ A —unos 24 requisitos— en lugar de SAQ A-EP, que ronda los 140 y es imposible
  de sostener para un equipo estudiantil. Por el canal Yappy no hay tarjeta en ningún momento, así
  que ese canal queda fuera del alcance PCI por completo.
- Beneficio colateral que no es menor: **una brecha del panel nunca sería una brecha de datos
  financieros.**
- **Se evita la zona gris del uso comercial en el hosting gratuito.** Vercel Hobby dice literalmente
  que pedir donaciones no es uso comercial, pero también lista como comercial «cualquier método de
  solicitar o procesar pagos de los visitantes». Al no cobrar nada dentro del portal, el sitio se
  queda del lado seguro de esa línea (SRS §5.4).
- Se puede lanzar la página de donaciones en la semana uno, sin escribir una línea de código de pago.
- Costo: B/.0.00 fijos al mes. Solo comisión variable, y por ACH ni eso.

**Lo que aceptamos**

- **Fricción.** El donante sale del sitio, abre su app y escribe el monto. Se compensa con el QR, el
  alias visible y el botón de copiar en cada dato.
- **Sin conciliación automática.** No hay forma de saber desde el sitio quién donó ni cuánto. El
  seguimiento se hace en la banca en línea y por el comprobante que envíe el donante.
- **Sin tarjeta**, y por lo tanto sin la diáspora ni los donantes internacionales que no tienen
  Yappy.
- **No se puede trasladar la comisión al donante.** Los términos de Yappy lo prohíben expresamente.
  Nada de la casilla «agrego para cubrir la comisión» que se ve en plantillas extranjeras.
- 🔴 **Bloqueante externo:** cuenta comercial en Banco General a nombre de la fundación con Banca en
  Línea Comercial activa. **Es el camino crítico y hay que empezarlo antes que el código.** Sin eso
  no hay alias de Yappy y la página de donaciones se lanza solo con transferencia.
- 🟡 **Inferido:** si REFUVA está autorizada por la DGI para emitir donaciones deducibles, hay que
  capturar desde el día uno nombre, RUC o cédula, fecha y monto de cada donante, que son los campos
  del Formulario 61. Eso condiciona la tabla de donaciones cuando exista; se anota en
  [`../07-modelo-datos.md`](../07-modelo-datos.md) para no pagar una migración después.

## Cuándo reconsiderar esta decisión

- **Cuando se cumplan las tres condiciones a la vez:** cuenta comercial activa, volumen de donaciones
  que justifique la integración, y una persona con nombre responsable de mantener el endpoint IPN.
  Falta una de las tres y la decisión sigue en pie.
- **Cuando aparezca una campaña con donantes fuera de Panamá** —diáspora o patrocinador
  internacional— que no puedan usar Yappy ni ACH. Ahí el canal de tarjeta deja de ser un lujo.
- **Cuando Yappy cierre la migración del Botón de Pago.** Hoy la versión está en transición y no
  conviene integrarse contra un blanco móvil. Consulta a `botondepagoyappy@bgeneral.com`.
