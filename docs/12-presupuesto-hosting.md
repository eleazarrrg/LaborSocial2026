# Presupuesto de alojamiento — Portal de la Fundación REFUVA

| | |
|---|---|
| **Para** | Edwin Quintero, Fundación REFUVA |
| **De** | Equipo de servicio social: Octavio Frauca, Jeremy Martínez, Rafael Gómez y Juan Zhu |
| **Fecha** | 8 de octubre de 2026 |
| **Proveedor recomendado** | DigitalOcean (servidor y base de datos) + Cloudflare (seguridad y dominio) |

> El balboa está a la par con el dólar: los precios de DigitalOcean, que cobra en USD, se escriben
> aquí en balboas sin conversión. Los precios son los publicados en octubre de 2026 y se confirman al
> crear la cuenta.

---

## 1. En una frase

**El portal cuesta entre B/.20.15 y B/.32.15 al mes, más el dominio (B/.11.84 al año).** El desarrollo
no cuesta nada: es servicio social. Si DigitalOcean aprueba sus créditos para organizaciones sin fines
de lucro, el alojamiento puede quedar cubierto durante años.

---

## 2. Qué se paga, en palabras simples

Piense en el sitio como un local:

- el **servidor** es el local donde atiende el sitio;
- la **base de datos** es el archivador con llave donde se guardan las solicitudes de cita, los
  padrinos y los voluntarios;
- el **almacenamiento** es la bodega de las fotos;
- **Cloudflare** es el guardia de la puerta.

| Qué es | Para qué sirve | Costo mensual |
|---|---|---|
| **Servidor** (DigitalOcean App Platform) | Que el sitio y el panel de administración estén encendidos día y noche. DigitalOcean le aplica las actualizaciones de seguridad: nadie de la fundación tiene que hacerlo. | **B/.5.00** (si el sitio necesita más memoria: B/.12.00) |
| **Base de datos** (DigitalOcean Managed PostgreSQL) | Guardar las solicitudes. Está **encerrada en una red privada**: solo el sitio puede abrirla, nadie desde internet. Hace **copia de seguridad todos los días** y permite volver a cualquier momento de los últimos 7 días. | **B/.15.15** |
| **Almacenamiento de fotos** (DigitalOcean Spaces) | Guardar las fotos que la fundación suba desde el panel: noticias, proyectos, evidencia. Hasta 250 GB. | **B/.5.00** (empieza cuando esté listo el editor de contenido) |
| **Seguridad y dominio** (Cloudflare) | Bloquea ataques y robots, y limita los intentos de adivinar contraseñas. | **B/.0.00** |
| **Correos automáticos** (Resend) | La confirmación a quien pide una cita y el aviso a la fundación. Hasta 3,000 correos al mes y 100 al día. | **B/.0.00** |
| **Dominio** `refuva.org` | El nombre del sitio. | **B/.11.84 al año** (menos de B/.1.00 al mes) |

---

## 3. Totales

| Etapa | Mensual | Al año (con dominio) |
|---|---|---|
| **Etapa 1 — Formularios y bandeja** (desde ya) | **B/.20.15** | **B/.253.64** |
| Etapa 1, si el servidor necesita más memoria | B/.27.15 | B/.337.64 |
| **Etapa 2 — Con el editor de contenido y las fotos** | **B/.25.15 a B/.32.15** | **B/.313.64 a B/.397.64** |

**Por qué un rango.** El servidor de B/.5.00 tiene la memoria justa. Lo vamos a medir la primera
semana: si alcanza, se queda así; si no, se sube a B/.12.00 con un clic, sin tocar el sitio.

**Cobros a tener en cuenta:**
- DigitalOcean cobra mensualmente a una tarjeta, en dólares. Algunos bancos panameños cobran una
  comisión por compras en el extranjero: conviene preguntarlo al banco de la tarjeta de la fundación.
- Se configura una **alerta de facturación**: si el gasto pasa del monto acordado, llega un correo a la
  fundación antes de que se cobre.

---

## 4. Por qué cambió respecto al presupuesto anterior

En septiembre presentamos un costo de casi B/.0.00 (`docs/05-stack-y-presupuesto.md`). Al prepararnos
para publicar, encontramos tres razones para cambiarlo:

1. **El plan gratuito del alojamiento anterior (Vercel) prohíbe pedir donaciones.** Sus condiciones
   tratan las donaciones como uso comercial, y eso obliga al plan de pago (B/.20.00 al mes). Es decir,
   el sitio no podía ser gratis con un botón de donar.
2. **La base de datos gratuita (Supabase Free) se apaga sola** tras 7 días sin uso, y no hace copias
   de seguridad que la fundación pueda recuperar. Para un lugar donde se guardan solicitudes de ayuda
   psicológica, eso no es aceptable.
3. **La fundación pidió todo en un solo lugar**, con un solo proveedor y una sola factura. Con
   DigitalOcean el servidor, la base de datos y las fotos están en la misma cuenta.

---

## 5. Por qué DigitalOcean

- **Seguridad sin necesitar a un técnico.** DigitalOcean mantiene el servidor y la base de datos
  actualizados. Un servidor propio sería más barato, pero alguien tendría que mantenerlo cada semana, y
  cuando el equipo de servicio social se retire no habrá quien lo haga. Un servidor sin mantenimiento
  es la forma más común en que se hackea el sitio de una fundación.
- **Copias de seguridad automáticas** todos los días, y la posibilidad de volver a cualquier momento de
  la última semana si algo se borra por error.
- **Los datos de las personas nunca quedan expuestos a internet**: la base de datos solo acepta
  conexiones del propio sitio.
- **Se puede administrar con ayuda de inteligencia artificial** (Claude), para revisar el estado del
  sitio o hacer cambios de configuración en lenguaje normal.
- **Programa para organizaciones sin fines de lucro:** DigitalOcean ofrece hasta **B/.2,500.00 en
  créditos** a fundaciones. A B/.20.00–32.00 al mes, eso cubriría varios años. 🟡 Falta confirmar que
  Panamá califica y si los créditos vencen: se solicita al crear la cuenta.

---

## 6. Qué necesitamos de la fundación

1. **Un correo de la fundación** para abrir las cuentas (por ejemplo `sistemas@refuva.org`). No puede
   ser el correo personal de un estudiante: las cuentas tienen que quedar a nombre de la fundación.
2. **Una tarjeta de la fundación** para DigitalOcean.
3. **Media hora con nosotros** para crear la cuenta juntos, activar la verificación en dos pasos en el
   teléfono y solicitar los créditos para organizaciones sin fines de lucro.
4. **Acceso al dominio** `refuva.org`, o comprarlo juntos si todavía no existe.

---

## 7. Lo que la fundación recibe

- El sitio publicado en `refuva.org`, con certificado de seguridad (el candado del navegador).
- Los formularios de cita, voluntariado, padrinos y contacto guardando de verdad, con aviso por correo.
- El panel de administración con verificación en dos pasos, donde se leen y atienden las solicitudes.
- Después: el editor de contenido para cambiar textos, fotos, proyectos y noticias sin depender de
  nadie.
- Un manual en lenguaje simple y una capacitación grabada.
