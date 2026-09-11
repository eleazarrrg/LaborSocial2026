# REFUVA — Historias de Usuario v1.0 (documento original, 2026-02-24)

> Conversión fiel de `REFUVA Historias Usuario Versión 1.0_0224.docx`. **No editar.**
> La versión vigente y ampliada vive en [`../02-historias-usuario.md`](../02-historias-usuario.md).

---

Historias de Usuario
historias de usuario derivadas de los módulos del portal público (sección 3.1 del SRS) y de los requisitos funcionales RF-01 a RF-05 (sección 4.1). Cada historia incluye criterios de aceptación verificables y una prioridad sugerida, para que el equipo de diseño sepa exactamente qué debe resolver cada pantalla del prototipo.
## 1. Inicio
Requisito(s) relacionado(s) del SRS: General / RF-05
HU-01  Prioridad: Alta
Como Visitante, quiero entender en menos de 10 segundos qué hace la fundación y que no se limita a salud mental, para decidir si quiero explorar más o donar.
Criterios de aceptación:
- El hero muestra un titular + subtítulo que nombra al menos 2 frentes de acción distintos a salud mental
- El titular es visible sin necesidad de hacer scroll en pantallas más pequeñas
HU-02  Prioridad: Alta
Como Visitante, quiero ver botones claros de Donar, Agendar Cita, Ser Padrino y Ser Voluntario en la pantalla principal, para actuar de inmediato sin tener que buscar.
Criterios de aceptación:
- Los 4 CTAs están visibles en el primer scroll (above the fold) en escritorio y móvil
- Cada CTA lleva a su formulario/sección correspondiente en un solo clic
HU-03  Prioridad: Media
Como Visitante recurrente, quiero ver publicaciones recientes de Instagram directamente en el Inicio, para estar al tanto de la actividad de la fundación sin salir del sitio.
Criterios de aceptación:
- Se muestran mínimo 3 publicaciones recientes, actualizadas automáticamente (RF-05)
- Cada publicación enlaza a la red social original
## 2. Nosotros
Requisito(s) relacionado(s) del SRS: General
HU-04  Prioridad: Media
Como Visitante, quiero leer la misión, visión y valores de REFUVA, para confiar en la seriedad de la fundación antes de donar o pedir ayuda.
Criterios de aceptación:
- La página muestra misión, visión y valores en secciones diferenciadas
- El texto proviene del inventario de contenido oficial, no de relleno
HU-05  Prioridad: Media
Como Institución donante o patrocinadora, quiero ver evidencia de trayectoria y transparencia (documentos, tres años de proyectos), para evaluar si patrocinar a la fundación.
Criterios de aceptación:
- Se listan al menos los documentos de personería jurídica disponibles
- Se menciona la antigüedad/trayectoria de los proyectos recurrentes
## 3. Proyectos
Requisito(s) relacionado(s) del SRS: RF-01 (parcial)
HU-06  Prioridad: Alta
Como Visitante, quiero navegar por las 7 líneas de acción desde una página índice, para encontrar el proyecto que me interesa apoyar.
Criterios de aceptación:
- La página índice muestra las 7 tarjetas de proyecto con nombre, imagen y descripción corta
- Cada tarjeta enlaza a su página de detalle
HU-07  Prioridad: Alta
Como Miembro de comunidad vulnerable, quiero ver los requisitos de la convocatoria navideña de un proyecto específico, para saber si mi comunidad puede aplicar.
Criterios de aceptación:
- Los requisitos de vulnerabilidad se listan de forma explícita en la página del proyecto
- Existe un enlace o botón para iniciar la postulación
HU-08  Prioridad: Media
Como Escuela interesada, quiero solicitar alianza para el Proyecto Psicoeducativo REFUVA desde su página, para iniciar contacto formal con la fundación.
Criterios de aceptación:
- La página del proyecto tiene un formulario o botón de contacto propio, distinto del contacto general
## 4. Agendamiento de Citas
Requisito(s) relacionado(s) del SRS: RF-02
HU-09  Prioridad: Alta
Como Persona que necesita apoyo psicológico, quiero llenar un formulario con mis datos, motivo de consulta, horario y modalidad (virtual o presencial), para solicitar una cita sin depender únicamente de WhatsApp.
Criterios de aceptación:
- El formulario valida campos obligatorios antes de enviar
- Al enviar, la solicitud se guarda en la base de datos (RF-02)
- Se ofrece un botón directo a WhatsApp como alternativa
HU-10  Prioridad: Alta
Como Persona que agenda, quiero recibir un correo de confirmación de que mi solicitud fue recibida, para tener certeza de que no se perdió mi mensaje.
Criterios de aceptación:
- El correo transaccional se envía automáticamente al solicitante en menos de 1 minuto (RF-02)
HU-11  Prioridad: Alta
Como Edwin / administración, quiero recibir automáticamente cada solicitud de cita en el correo institucional, para darle seguimiento sin depender solo de WhatsApp.
Criterios de aceptación:
- Toda solicitud dispara un correo a la administración con los datos completos (RF-02)
- La solicitud queda visible en la bandeja de consultas del CMS con estado “Pendiente”
## 5. Voluntariado y Apadrinamiento
Requisito(s) relacionado(s) del SRS: RF-03
HU-12  Prioridad: Media
Como Persona interesada, quiero inscribirme como voluntario indicando en qué área puedo apoyar (redes, diseño, logística, etc.), para que la fundación sepa cómo puedo ayudar.
Criterios de aceptación:
- El formulario clasifica automáticamente al postulante por área de interés (RF-03)
HU-13  Prioridad: Alta
Como Persona interesada, quiero inscribirme como padrino/madrina de un niño para la fiesta navideña, para participar en la campaña sin escribir directamente a Edwin.
Criterios de aceptación:
- El formulario recopila datos de contacto y disponibilidad
- El registro se clasifica bajo el programa “Navidad” (RF-03)
HU-14  Prioridad: Media
Como Edwin / administración, quiero exportar la lista de voluntarios y padrinos segmentada por programa en CSV/Excel, para organizar la logística de cada campaña.
Criterios de aceptación:
- El CMS permite exportar por programa de interés (Navidad, Alimentación, Psicoeducación)
## 6. Donaciones
Requisito(s) relacionado(s) del SRS: General
HU-15  Prioridad: Alta
Como Donante, quiero ver claramente las cuentas bancarias y el Yappy Comercial de la fundación, para donar en efectivo o transferencia con confianza.
Criterios de aceptación:
- Los datos bancarios y el Yappy están visibles sin necesidad de formulario ni registro
HU-16  Prioridad: Media
Como Donante, quiero donar con tarjeta a través de una pasarela de pago segura, para donar sin salir del sitio ni compartir datos sensibles por WhatsApp.
Criterios de aceptación:
- Ningún dato de tarjeta se almacena en servidores propios (certificación PCI-DSS Nivel 1, sección 6 del SRS)
## 7. Blog / Noticias
Requisito(s) relacionado(s) del SRS: RF-01 / RF-04
HU-17  Prioridad: Baja
Como Visitante, quiero leer publicaciones psicoeducativas y noticias de actividades, para mantenerme informado sin depender solo de Instagram.
Criterios de aceptación:
- El listado muestra fecha, imagen y resumen de cada publicación
HU-18  Prioridad: Alta
Como Administrador (Edwin o designado), quiero crear, editar o archivar una noticia con fecha de caducidad automática, para mantener la web actualizada sin depender del equipo de desarrollo.
Criterios de aceptación:
- El CMS permite formato enriquecido e imágenes (RF-01)
- Un evento vencido se oculta automáticamente sin intervención manual
HU-19  Prioridad: Alta
Como Administrador, quiero acceder al panel administrativo con credenciales cifradas, para que solo personal autorizado edite el contenido.
Criterios de aceptación:
- El CMS exige autenticación antes de mostrar cualquier función de edición (RF-04)
- Soporta más de un administrador con acceso independiente
## 8. Contacto
Requisito(s) relacionado(s) del SRS: General
HU-20  Prioridad: Baja
Como Visitante, quiero enviar un mensaje general de contacto, para comunicarme con la fundación por el canal que prefiera.
Criterios de aceptación:
- El formulario general envía el mensaje al correo institucional
HU-21  Prioridad: Baja
Como Visitante, quiero ver un mapa y accesos directos a los canales de mensajería, para elegir el medio de contacto más cómodo para mí.
Criterios de aceptación:
- Se muestra un mapa embebido y botones directos a WhatsApp/Instagram
