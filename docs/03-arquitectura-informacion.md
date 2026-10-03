# Arquitectura de información — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Estado** | Borrador para validación con Edwin Quintero |
| **Deriva de** | [`01-srs.md`](./01-srs.md) §3.1 y §3.2 (módulos 3.1.1–3.1.10 y 3.2.1–3.2.10), RF-01 a RF-15 |
| **Fuente de requisitos** | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) |

> **Para qué sirve este documento.** Es el mapa del sitio: qué páginas existen, en qué URL viven,
> cómo se llega a cada una y qué va en cada plantilla. Es también el documento donde Edwin decide
> **el orden del Inicio** (C-11: «usted es el dueño de su página»). La §5 marca explícitamente qué
> bloques puede mover y cuáles no.
>
> Estados usados, igual que en `hechos-verificados.md`:
> ✅ **Confirmado** · 🟡 **Inferido** (se deduce, hay que confirmarlo) · 🔴 **Pendiente** (falta el dato).

---

# 1. Principio rector: la arquitectura es el argumento

El sitio existe para desmentir que REFUVA es solo salud mental (**O-04**, el requisito raíz; **RF-06**).
Eso no se resuelve escribiendo «también hacemos otras cosas» en un párrafo: se resuelve con la forma
del sitio. Un visitante lee la estructura antes de leer el texto —ve el menú, ve cuántas tarjetas
hay, ve de qué cuelga cada cosa— y de ahí saca su conclusión. Por eso la arquitectura de este portal
toma seis decisiones que sostienen O-04 aunque el contenido todavía no esté escrito: **(a)** los
proyectos son **hermanos**, todos al mismo nivel bajo `/proyectos/`, sin proyecto padre ni sección de
«otros»; **(b)** ninguna URL contiene un prefijo `/salud-mental/`, porque la jerarquía de la URL es
una afirmación sobre quién manda; **(c)** el Inicio los muestra **todos**, no una selección ni un
carrusel que esconda la mayoría; **(d)** todos comparten la misma plantilla, el mismo peso visual y la
**misma prioridad de sitemap**, de modo que ni el sitio ni el buscador las ordenan por importancia;
**(e)** los recursos de crisis —obligatorios por **RF-11**— se resuelven en **dos niveles**: una banda
de una línea en el armazón de **todas** las páginas, y un **bloque completo** únicamente en la lista
cerrada de páginas que lo necesitan por su contenido (**§4.5**). El bloque completo no va en cada
pantalla, porque repetir un bloque grande de salud mental en todo el sitio reconstruiría exactamente
la percepción que queremos romper; la banda, que es una línea, no la reconstruye —y por eso sí va en
todas partes. Y **(f)** el `<title>` del Inicio nombra frentes distintos a salud mental, para que
el desmentido ocurra en el resultado de búsqueda, antes de que la persona entre. La consecuencia
práctica: si alguien borrara todos los textos del sitio y dejara solo la navegación, el mensaje de
O-04 seguiría llegando.

---

# 2. Mapa del sitio

## 2.1 Reglas de URL

- Español, minúsculas, palabras separadas por guiones. Nada de guiones bajos ni de `?id=7` (**RF-14**).
- **Slugs sin tildes y sin ñ.** Se transliteran: `fiesta-navidena-2026`, no `fiesta-navideña-2026`.
  Un carácter acentuado en la URL se codifica en porcentaje y llega ilegible al pegarse en WhatsApp.
- **Sin barra final.** `/proyectos/psicoeducativo/` redirige a `/proyectos/psicoeducativo` con 301.
- La URL de un proyecto es su código de [`../CLAUDE.md`](../CLAUDE.md) §2. Es el mismo identificador
  en la base de datos, en el filtro de noticias y en la exportación por programa (**RF-03**). Un
  proyecto, un identificador, en todo el sistema.
- Palabras reservadas que ningún contenido puede tomar como slug: `panel`, `api`, `noticias`,
  `eventos`, `proyectos`, `donar`, `contacto`, `privacidad`, `terminos`.

## 2.2 El árbol completo

```
/                                        Inicio
│
├── /nosotros                            Misión, visión, valores, trayectoria, evidencia
│
├── /proyectos                           Índice: una tarjeta por proyecto, sin jerarquía
│   ├── /proyectos/psicoeducativo             Proyecto Psicoeducativo REFUVA
│   ├── /proyectos/psicoempresarial           Proyecto Psicoempresarial REFUVA
│   ├── /proyectos/rompiendo-el-circulo       Rompiendo el Círculo
│   ├── /proyectos/historias-que-sanan        Historias que Sanan
│   ├── /proyectos/grupo-un-solo-corazon      Grupo Un Solo Corazón
│   ├── /proyectos/una-estrella-otiliana      Una Estrella Otiliana
│   ├── /proyectos/comida-en-la-calle         Comida en la Calle, Esperanza en el Corazón
│   └── /proyectos/angelitos-de-la-calle      Angelitos de la Calle
│
├── /campanas                            Índice de campañas, colección aparte
│   ├── /campanas/hablame-panama              Háblame Panamá
│   └── /campanas/escuchame-panama            #EscúchamePanamá
│
├── /agendar-cita                        Formulario de solicitud de cita psicológica
├── /ayuda-en-crisis                     Recursos de crisis, permanentes y verificados
│
├── /participar                          Concentrador: las cuatro formas de sumarse
│   ├── /voluntariado                         Formulario de voluntariado
│   ├── /apadrinar                            Formulario de padrino / madrina
│   ├── /postular-comunidad                   Postulación de comunidad a la convocatoria navideña
│   └── /alianzas                             Solicitud de alianza institucional
│
├── /donar                               Yappy, transferencia, comprobante
│
├── /noticias                            Listado de publicaciones
│   └── /noticias/{slug}                      Artículo
│
├── /eventos                             Próximos y pasados
│   ├── /eventos/dia-prevencion-suicidio-2026
│   ├── /eventos/fiesta-navidena-2026
│   └── /eventos/{slug}-{año}                 Una página por edición (RF-14)
│
├── /contacto                            Formulario general y canales directos
│
├── /privacidad                          Política de privacidad
├── /terminos                            Términos de uso + aviso de que no es canal de emergencia
│
├── /sitemap.xml                         Generado
├── /robots.txt                          Generado
│
└── /panel                               Panel administrativo — privado, noindex
    ├── /panel/entrar                         Inicio de sesión (RF-04)
    ├── /panel/recuperar                      Recuperación de contraseña
    ├── /panel/contenido                      Noticias y eventos (RF-01)
    │   ├── /panel/contenido/nuevo
    │   └── /panel/contenido/{id}
    ├── /panel/proyectos                      Texto, galería y acción del catálogo (RF-06)
    │   └── /panel/proyectos/{codigo}
    ├── /panel/solicitudes                    Bandeja general con contadores (RF-12)
    │   ├── /panel/solicitudes/citas               Ordenada por antigüedad, la más vieja destacada
    │   ├── /panel/solicitudes/voluntarios
    │   ├── /panel/solicitudes/padrinos
    │   ├── /panel/solicitudes/comunidades
    │   ├── /panel/solicitudes/alianzas
    │   └── /panel/solicitudes/contacto
    ├── /panel/convocatorias                  Abrir y cerrar, con fechas (RF-13)
    ├── /panel/instagram                      Ocultar publicaciones concretas (RF-05)
    ├── /panel/ajustes                        Contacto, cuentas, alias Yappy, textos de crisis (RF-11)
    ├── /panel/usuarios                       Invitar y desactivar administradores (RF-04)
    └── /panel/tareas                         Última ejecución de cada tarea programada (RF-15)
```

**Lo que deliberadamente no existe en v1:**

| No existe | Por qué |
|---|---|
| Buscador interno | Con ~25 páginas públicas, el menú y los índices resuelven mejor. Un buscador vacío o con malos resultados destruye confianza. |
| Páginas `/gracias/...` | La confirmación reemplaza al formulario en la misma URL. La métrica de conversión sale de la bandeja en la base de datos, que es exacta, no de contar visitas a una página de gracias. |
| Sección de blog por categorías con sus propias URL | Las noticias se filtran por proyecto dentro de `/noticias`. Crear `/noticias/categoria/...` duplica rutas sin aportar. |
| Página de «equipo» | Hoy la fundación la opera una sola persona (**O-02**). Se abre cuando haya a quién listar. |
| Versión en inglés | Fuera de alcance (SRS §8, V2-07). |

---

# 3. Tabla de rutas

**Sobre la columna de prioridad:** es el valor `<priority>` del `sitemap.xml`. Los buscadores
modernos la ignoran casi por completo; la mantenemos porque documenta el orden de importancia
editorial del sitio y porque cuesta cero. La decisión que sí importa está en la fila de los
proyectos: **todos comparten el mismo valor**. Ninguno es más que otro (O-04).

**Sobre la columna «Módulo SRS»:** cierra la trazabilidad por los dos lados. El SRS ([`01-srs.md`](./01-srs.md)
§3.1 y §3.2) dice qué módulos existen; esta tabla dice en qué URL vive cada uno. Ninguna ruta puede
quedar sin módulo y ningún módulo sin ruta —la comprobación está en la **§3.3**—, y este documento es
el dueño del mapa: si una URL discrepa en otro documento, se corrige allá, no aquí.

## 3.1 Sitio público

| URL | Plantilla | Módulo SRS | Qué hace | Acceso | Prioridad |
|---|---|---|---|---|---|
| `/` | Inicio (única) | 3.1.1 | Entiende en 10 segundos que son ocho proyectos y dos campañas; ofrece los cuatro CTA. HU-01, HU-02 | Pública | 1.0 |
| `/nosotros` | Contenido editorial | 3.1.2 | Misión, visión, valores, trayectoria y evidencia para patrocinadores. HU-04, HU-05 | Pública | 0.8 |
| `/proyectos` | Índice | 3.1.3 | Una tarjeta por proyecto, sin orden de importancia. HU-06 | Pública | 0.9 |
| `/proyectos/psicoeducativo` | Proyecto | 3.1.3 | Historia, población, evidencia, solicitud de alianza. PR-01 | Pública | 0.9 |
| `/proyectos/psicoempresarial` | Proyecto | 3.1.3 | Emprendimiento y liderazgo. PR-02 | Pública | 0.9 |
| `/proyectos/rompiendo-el-circulo` | Proyecto | 3.1.3 | Personas en riesgo social. PR-03 (ver conflicto C-3) | Pública | 0.9 |
| `/proyectos/historias-que-sanan` | Proyecto | 3.1.3 | Escritura terapéutica. PR-04 | Pública | 0.9 |
| `/proyectos/grupo-un-solo-corazon` | Proyecto | 3.1.3 | Bolsas de comida a familias; nació en la pandemia. PR-05 | Pública | 0.9 |
| `/proyectos/una-estrella-otiliana` | Proyecto | 3.1.3 | Las dos convocatorias: padrinos y comunidades. PR-06 | Pública | 0.9 |
| `/proyectos/comida-en-la-calle` | Proyecto | 3.1.3 | Raciones en calle, frecuencia, meta del refugio. PR-07 | Pública | 0.9 |
| `/proyectos/angelitos-de-la-calle` | Proyecto | 3.1.3 | Perros y gatos de calle, meta de refugio con adopción. PR-08 | Pública | 0.9 |
| `/campanas` | Índice | 3.1.3 | Las campañas, en colección aparte. HU-06 | Pública | 0.9 |
| `/campanas/hablame-panama` | Campaña | 3.1.3 | Prevención del suicidio. Cierra con bloque de crisis (§4.5). CA-01 | Pública | 0.9 |
| `/campanas/escuchame-panama` | Campaña | 3.1.3 | Sensibilización en salud mental. Cierra con bloque de crisis (§4.5). CA-02 | Pública | 0.9 |
| `/agendar-cita` | Formulario | 3.1.4 | Solicita cita psicológica. Abre con bloque de crisis. RF-02, RF-11 | Pública | 0.9 |
| `/ayuda-en-crisis` | Contenido editorial | 3.1.10 | Recursos verificados, permanentes. Destino de la banda de crisis. RF-11 | Pública | 0.9 |
| `/participar` | Índice | 3.1.5 | Concentrador de las cuatro formas de sumarse | Pública | 0.7 |
| `/voluntariado` | Formulario | 3.1.5 | Inscripción con áreas de interés. RF-03, HU-12 | Pública | 0.7 |
| `/apadrinar` | Formulario | 3.1.5 | Inscripción de padrino/madrina. RF-03, HU-13 | Pública | 0.7 |
| `/postular-comunidad` | Formulario | 3.1.5 | Postulación de comunidad. Requisitos antes del formulario. RF-07 | Pública | 0.7 |
| `/alianzas` | Formulario | 3.1.3 | Solicitud institucional, separada del contacto general. Su interlocutor es una escuela: pertenece a Proyectos, no a Contacto. RF-08 | Pública | 0.6 |
| `/donar` | Contenido editorial | 3.1.6 | Alias y QR de Yappy, datos de ACH copiables. Sin muro. RF-09 | Pública | 0.9 |
| `/noticias` | Índice | 3.1.7 | Listado con fecha, imagen y resumen. Filtro por proyecto. RF-01, HU-17 | Pública | 0.7 |
| `/noticias/{slug}` | Artículo | 3.1.7 | Una publicación. RF-01 | Pública | 0.6 |
| `/eventos` | Índice | 3.1.7 | Próximos arriba, pasados abajo. Los vencidos salen solos. RF-01 | Pública | 0.7 |
| `/eventos/{slug}-{año}` | Artículo | 3.1.7 | Una edición del evento, con su propia URL. RF-14 | Pública | 0.6 |
| `/contacto` | Formulario | 3.1.8 | Mensaje general y canales directos. RF-10 | Pública | 0.5 |
| `/privacidad` | Contenido editorial | 3.1.9 | Qué se guarda, cuánto tiempo y quién lo ve | Pública | 0.3 |
| `/terminos` | Contenido editorial | 3.1.9 | Uso del sitio; el portal no presta atención en línea ni es canal de emergencia | Pública | 0.3 |
| `/sitemap.xml` | — | — (RF-14) | Generado a partir del contenido publicado. No es una página: ver §3.3 | Pública | — |
| `/robots.txt` | — | — (RF-14) | Permite todo lo público, prohíbe `/panel`. No es una página: ver §3.3 | Pública | — |

## 3.2 Panel administrativo

Ninguna ruta del panel entra al `sitemap.xml`, todas llevan `noindex` y todas quedan bloqueadas en
`robots.txt`. `/panel/entrar` es la única accesible sin sesión.

| URL | Plantilla | Módulo SRS | Qué hace | Acceso |
|---|---|---|---|---|
| `/panel` | Panel — tablero | 3.2.4 + 3.2.10 | Contadores de pendientes por bandeja y últimas tareas ejecutadas. Es el resumen de ambos módulos, no un módulo aparte | Privada |
| `/panel/entrar` | Panel — acceso | 3.2.1 | Inicio de sesión con segundo factor. RF-04 | Pública sin sesión |
| `/panel/recuperar` | Panel — acceso | 3.2.1 | Recuperación de contraseña | Pública sin sesión |
| `/panel/contenido` | Panel — listado | 3.2.2 | Noticias y eventos, con estado `borrador`/`publicado`/`archivado`. RF-01 | Privada |
| `/panel/contenido/nuevo` | Panel — editor | 3.2.2 | Crear con formato enriquecido; texto alternativo obligatorio | Privada |
| `/panel/contenido/{id}` | Panel — editor | 3.2.2 | Editar, publicar, **dejar de mostrar (ocultar)** y archivar. C-06 | Privada |
| `/panel/proyectos` | Panel — listado | 3.2.3 | El catálogo entero | Privada |
| `/panel/proyectos/{codigo}` | Panel — editor | 3.2.3 | Texto, galería y acción del proyecto. RF-06 | Privada |
| `/panel/solicitudes` | Panel — listado | 3.2.4 | Todas las bandejas con su contador. RF-12 | Privada |
| `/panel/solicitudes/{tipo}` | Panel — bandeja | 3.2.4 + 3.2.6 | Filtrar, cambiar estado, nota interna, exportar CSV. RF-12 | Privada |
| `/panel/convocatorias` | Panel — listado | 3.2.5 | Abrir y cerrar con fechas. RF-13 | Privada |
| `/panel/instagram` | Panel — listado | 3.2.9 | Ocultar una publicación concreta. RF-05 | Privada |
| `/panel/ajustes` | Panel — formulario | 3.2.7 | Contacto, cuentas, alias, textos de crisis y su fecha de verificación | Privada |
| `/panel/usuarios` | Panel — listado | 3.2.8 | Invitar y desactivar administradores. RF-04 | Privada |
| `/panel/tareas` | Panel — listado | 3.2.10 | Última ejecución de cada tarea programada. RF-15 | Privada |

## 3.3 Cierre de trazabilidad: ninguna ruta huérfana, ningún módulo sin casa

La columna «Módulo SRS» resuelve el sentido **ruta → módulo**. Este apartado cierra el sentido
contrario, **módulo → ruta**, sin repetir el mapa: los módulos 3.1.1 a 3.1.10 y 3.2.1 a 3.2.10 del
SRS aparecen todos en las dos tablas de arriba, y la comprobación se reduce a dejar por escrito las
**dos excepciones** —que son las únicas y están justificadas—, más una nota sobre los dos módulos que
el SRS acaba de añadir. Nada más queda suelto:

| Caso | Qué pasa | Por qué está bien |
|---|---|---|
| `/sitemap.xml` y `/robots.txt` — rutas sin módulo | Son artefactos generados por el servidor, no páginas con contenido editable | No pertenecen a ningún módulo funcional; responden a **RF-14** (URL y compartición). Ningún módulo del SRS los reclama y ninguno queda cojo por ello |
| **3.2.6 Exportación** — módulo sin ruta propia | Vive dentro de `/panel/solicitudes/{tipo}` como un botón «Exportar CSV» | Exportar es una acción sobre la bandeja que se está mirando, no un destino. Una pantalla `/panel/exportar` obligaría a volver a elegir bandeja y filtros que ya están puestos. **Es la única salida de datos que existe en el sistema**: CSV bajo demanda desde el panel, y ninguna hoja de cálculo (RF-03) |
| **3.1.10 Ayuda en crisis**, **3.2.9 Feed de Instagram** y **3.2.10 Tareas programadas** — módulos recién añadidos al SRS. **3.1.7** pasa a llamarse «Noticias y eventos» | No son excepción: ya tienen ruta —`/ayuda-en-crisis`, `/panel/instagram` y `/panel/tareas`—, y `/eventos` deja de estar huérfano con el nuevo nombre de 3.1.7 | Existían como pantallas en este documento antes de existir como módulo en el SRS. El SRS se amplió para alcanzarlas; el mapa no cambió |

Fuera de la tabla quedan tres pantallas que **no son rutas** y por eso no llevan módulo: la
confirmación de un formulario (reemplaza al formulario en su misma URL, §6.3), el 404 y el 500 (§9).

---

# 4. Navegación

## 4.1 Menú principal — seis entradas

| Orden | Entrada | Destino | Por qué se gana el espacio |
|---|---|---|---|
| 1 | **Proyectos** | `/proyectos` | Es el requisito raíz (O-04, RF-06). Va primero porque es lo que hay que desmentir. |
| 2 | **Nosotros** | `/nosotros` | Es lo que mira un patrocinador antes de decidir (O-07, HU-05) y lo que mira un donante antes de confiar. |
| 3 | **Participar** | `/participar` | Cubre de un golpe voluntariado, apadrinamiento, postulación de comunidad y alianzas: cuatro destinos, un espacio de menú. |
| 4 | **Noticias** | `/noticias` | Sin una entrada visible, el panel no sirve de nada: Edwin publica y nadie lo ve. Sostiene AC-04 y C-02. |
| 5 | **Agendar cita** | `/agendar-cita` | El motivo original del proyecto: sacar las consultas de WhatsApp (S-04, R-03). |
| 6 | **Donar** | `/donar` | Único con tratamiento visual de botón. Es la acción que financia todo lo demás (RF-09). |

**Lo que se quedó fuera, y por qué.** *Contacto* es el clásico séptimo elemento y se queda fuera a
propósito: es el requisito de menor prioridad del SRS (RF-10, **Baja**), quien lo busca lo encuentra
en el pie —donde todo el mundo lo busca— y ese espacio rinde mucho más ocupado por *Participar*, que
sirve a tres requisitos de prioridad alta (RF-03, RF-07 y RF-08). *Eventos* tampoco entra: el bloque
de próximos eventos vive en el Inicio, que es donde C-02 pide que estén —«accesibles sin buscarlos»—
y además se enlaza desde `/noticias` y desde el pie.

**Sobre `/participar` como página real y no como menú desplegable.** Un desplegable es incómodo en
pantalla táctil, exige lógica de teclado y foco que se rompe con facilidad, y esconde sus opciones
hasta que alguien lo abre. La alternativa cuesta un clic extra, y ese clic no lo paga casi nadie: los
cuatro CTA del Inicio llevan directo a `/voluntariado` y `/apadrinar` (HU-02), y cada página de
proyecto enlaza directo a su formulario. `/participar` es el camino secundario, para quien llegó por
el menú sin saber todavía qué quiere hacer.

## 4.2 El armazón: lo que aparece en todas las páginas

```
┌──────────────────────────────────────────────────────────┐
│ BANDA DE CRISIS  ¿Necesitas ayuda ahora? 911 · Línea 147 │  ← no se mueve, no es fija al hacer scroll
├──────────────────────────────────────────────────────────┤
│ Logo REFUVA        Proyectos Nosotros Participar         │
│                    Noticias  Agendar cita   [ Donar ]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                  contenido de la página                  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ PIE                                                      │
└──────────────────────────────────────────────────────────┘
```

La banda de crisis va **antes** del encabezado, en una sola línea, con los recursos verificados
—911 y Línea 147 del MIDES— y un enlace a `/ayuda-en-crisis` (**RF-11**). Es lo primero que lee un
lector de pantalla y lo primero que ve quien llega en mal momento. **No se fija a la pantalla al
hacer scroll**: un elemento pegajoso puede tapar por completo el campo que tiene el foco del
teclado, que es justo lo que prohíbe el criterio de foco no oscurecido de WCAG 2.2, y en un
formulario de solicitud de ayuda ese fallo es inaceptable. Antes del encabezado va también el enlace
«saltar al contenido».

## 4.3 El pie

Cuatro columnas. El pie es el mapa del sitio completo: todo lo que no está en el menú tiene que estar aquí.

| Columna | Contenido |
|---|---|
| **La fundación** | Nosotros · Proyectos (listados uno por uno) · Campañas · Noticias · Eventos · Contacto |
| **Participar** | Ser voluntario · Ser padrino o madrina · Postular mi comunidad · Alianzas institucionales · Donar |
| **Si necesitas ayuda** | Agendar cita · Ayuda en crisis · 911 · Línea 147 y su WhatsApp · la frase «este sitio no es un canal de emergencia» |
| **Legales y redes** | Política de privacidad · Términos de uso · Instagram · correo institucional · WhatsApp |

Los proyectos se listan **uno por uno** en el pie, no como un solo enlace «Proyectos». Es la
repetición barata del argumento de O-04: aparece en todas las páginas del sitio sin ocupar nada
por encima del pliegue.

**El pie no enlaza al panel.** No es un secreto —está en el manual de traspaso— pero un enlace
«Entrar» en el pie público solo consigue dos cosas: confundir a visitantes que creen que tienen que
registrarse, y atraer intentos automatizados de inicio de sesión. El panel es una herramienta de
trabajo para dos personas, no un destino del sitio. Se llega escribiendo `/panel` o desde un marcador
(**X-03**, **9. Operación y traspaso**).

## 4.4 Lo que solo se alcanza desde dentro

| Destino | Desde dónde se llega | Por qué no está en la navegación |
|---|---|---|
| `/eventos/{slug}-{año}` | Inicio, `/eventos`, `/noticias`, página del proyecto | Son piezas de contenido, no secciones. Cada edición nace y caduca. |
| `/noticias/{slug}` | `/noticias`, Inicio, página del proyecto | Ídem. |
| `/postular-comunidad` | `/proyectos/una-estrella-otiliana`, `/participar`, pie | Su público llega por la convocatoria, no explorando el menú. Y solo tiene sentido con la convocatoria abierta (RF-13). |
| `/alianzas` | `/proyectos/psicoeducativo`, `/participar`, pie | Es un canal institucional, no de público general (RF-08). |
| `/ayuda-en-crisis` | Banda de crisis (todas las páginas), `/agendar-cita`, proyecto de prevención | Está en todas partes por la banda; meterla también al menú la volvería la cara del sitio y contradiría O-04. |
| Confirmación de formulario | Solo tras enviar | Reemplaza al formulario en la misma URL. |
| `/panel/*` | URL directa o marcador | Ver §4.3. |

## 4.5 Dónde aparecen los recursos de crisis — lista canónica

Esta es **la única lista** de dónde van los recursos de crisis (**RF-11**, CLAUDE.md §5.1). El resto
del proyecto se corrige contra ella; no se repite en otro documento ni se amplía por costumbre. Son
dos piezas distintas, con alcance distinto, y confundirlas es lo que produjo la contradicción que
esta versión cierra.

**Pieza 1 — La banda de crisis: en TODAS las páginas, sin excepción.** Una sola línea en el armazón
(§4.2), antes del encabezado, con 911, la Línea 147 del MIDES y el enlace a `/ayuda-en-crisis`. No
se mueve, no se oculta, no se apaga en ninguna página. Una línea no le cambia el tema al sitio.

**Pieza 2 — El bloque de crisis completo: solo en estas páginas.** Números, qué esperar de cada uno,
qué hacer mientras llega la ayuda y el mensaje de esperanza (CLAUDE.md §5.1). La lista es cerrada:

| Dónde va el bloque completo | Por qué |
|---|---|
| `/agendar-cita` | **Antes del primer campo**, junto al aviso de que no es canal de emergencia (§6.3). Quien llena este formulario puede no poder esperar la cita |
| `/ayuda-en-crisis` | La página **es** el bloque, desarrollado, con la fecha de última verificación de cada número (§6.5) |
| `/campanas/hablame-panama` · `/campanas/escuchame-panama` · `/proyectos/psicoeducativo` · `/proyectos/rompiendo-el-circulo` · `/proyectos/historias-que-sanan` | Son las entradas cuyo contenido toca salud mental; `catalogo.ts` las marca con `bloqueCrisis: true`. Cierra la página (zona 10 de §6.1). Las demás llevan solo la banda |
| Noticias y eventos **etiquetados con uno de esos cuatro proyectos** | La etiqueta de proyecto es obligatoria (§6.2, zona 4), así que la regla se resuelve sola: no hace falta que Edwin decida nada al publicar |

**El Inicio lleva banda sola.** No lleva bloque completo. Es la página que tiene que demostrar en
diez segundos que REFUVA es mucho más que salud mental (**O-04**), y un bloque grande del tema sobre el
pliegue afirma justo lo contrario. Quien necesite más que la banda tiene el enlace a
`/ayuda-en-crisis` dentro de ella, a un clic. Lo mismo vale para `/nosotros`, `/donar`, `/participar`,
los índices, las páginas legales y el 404: **banda sí, bloque no**.

La única salida que sí lleva los números completos sin estar en esta lista es la página de error 500
(§9): si el sitio se cae, la banda puede no renderizarse, y ahí el 911 y el 147 tienen que estar
impresos en la propia página de error.

---

# 5. Anatomía del Inicio

**Esta es la sección que Edwin decide** (C-11). El orden de abajo es nuestra recomendación, no una
imposición. Cada bloque dice qué decisión del visitante habilita, y la última columna dice si se
puede mover.

| # | Bloque | Para qué está | ¿Qué decisión habilita? | ¿Reordenable? |
|---|---|---|---|---|
| 1 | **Banda de crisis** | Recursos verificados en una línea, en todas las páginas. **Solo la banda: el Inicio no lleva bloque completo** (§4.5). RF-11 | «Necesito ayuda ahora mismo» → llama al 911 o al 147, o entra a `/ayuda-en-crisis` | **NO** |
| 2 | **Hero** | Titular y subtítulo que nombran al menos dos frentes distintos a salud mental. HU-01, RF-06 | «Esto no es lo que yo creía» → sigo leyendo | **NO** |
| 3 | **Las cuatro acciones** | Donar · Agendar cita · Ser padrino · Ser voluntario, juntos y visibles sin desplazarse. HU-02 | «Ya sé a qué vine» → va directo a su formulario | **NO** (pegado al hero) |
| 4 | **El catálogo** | Una tarjeta igual por entrada: logo, nombre, una frase. RF-06 | «Hay uno que me toca» → entra a esa página de proyecto | Sí, con reparo |
| 5 | **Quiénes somos, en corto** | Tres frases y la trayectoria en cifras verificables: tercer año de campaña navideña y de prevención (P-02, P-05), de 50 a más de 100 raciones (P-03), más de 30 escuelas en lista (P-01). Enlaza a `/nosotros` | «Son serios y llevan años» → confía lo suficiente para donar o pedir cita | Sí |
| 6 | **Próximos eventos y convocatorias abiertas** | Lo que está pasando ahora. Los vencidos desaparecen solos (RF-01). C-02 | «Esto es en dos semanas y puedo ir» → se inscribe o postula | Sí |
| 7 | **Últimas noticias** | Tres publicaciones con fecha, imagen y resumen. RF-01 | «Hay actividad reciente» → lee, o comparte | Sí |
| 8 | **Instagram** | Hasta seis publicaciones leídas desde el servidor. RF-05, HU-03 | «Los sigo» → va a la cuenta | Sí. Y desaparece sola si no hay datos (§9) |
| 9 | **Banda de donación** | Cierre con el alias de Yappy y enlace a `/donar`. RF-09 | «Voy a dar algo» → dona | Sí |
| 10 | **Pie** | Mapa completo del sitio. §4.3 | Cualquiera que no encontró antes | **NO** |

## 5.1 Los tres bloques que no se mueven, y por qué

**La banda de crisis (1).** No es una decisión de diseño, es una de seguridad. Una persona en crisis
que abre esta página no va a desplazarse buscando un número: o lo ve en la primera línea o no lo ve.
Además tiene que estar en el mismo lugar en todas las páginas, siempre; un elemento que cambia de
sitio según la página deja de funcionar como recurso de emergencia. Se puede editar su texto desde
`/panel/ajustes` (3.2.7). No se puede mover, ni ocultar, ni quitar.

Y es **solo la banda**: el Inicio no lleva el bloque de crisis completo. Esa no es una preferencia
de orden y por eso no está entre lo que Edwin reordena —la lista de dónde va cada pieza es la de
**§4.5**—. Un bloque grande de salud mental en la portada le da la razón a la percepción que este
sitio existe para desmentir (**O-04**); la banda, que es una línea, no.

**El hero (2).** Es el bloque que hace el trabajo de O-04. Si algo se pone antes, el visitante ya se
formó una idea de qué es REFUVA con otra cosa —una noticia, una foto, un evento— y el titular llega
tarde a corregirla. El hero puede cambiar de texto, de foto y de tono cuantas veces Edwin quiera:
lo que no puede es dejar de ser lo primero que se lee después de la banda.

**Las cuatro acciones (3).** Van pegadas al hero porque HU-02 exige que se vean sin desplazarse, en
escritorio y en móvil. Separarlas del hero rompe ese criterio de aceptación.

## 5.2 El reparo del bloque 4

Los bloques 4 a 9 son de Edwin. Lo decimos sin letra chica: si quiere las noticias antes que las
tarjetas del catálogo, o Instagram antes que los eventos, se hace. El único movimiento sobre el que
dejamos constancia es bajar mucho el bloque 4: el hero **afirma** que son muchos frentes y las tarjetas lo
**demuestran**; cuanto más lejos queden una de otra, más se parece la afirmación a una frase de
folleto. Nuestra recomendación es que las tarjetas queden en la primera pantalla siguiente al hero.
Si Edwin decide otra cosa, va como él diga, y esta nota queda aquí como lo que es: una opinión
técnica, no un veto.

---

# 6. Plantillas del sitio

Cinco plantillas cubren el sitio público entero. Aquí se describen sus **zonas** y su orden. Nada de
esto es diseño visual ni implementación.

## 6.1 Plantilla A — Página de proyecto

Siete instancias, una por línea de acción, **idénticas en estructura**. Que compartan plantilla es
en sí una decisión de arquitectura: ninguna se ve como la principal.

```
Miga de pan:  Inicio › Proyectos › {Proyecto}
─────────────────────────────────────────────
1. Identidad         logo propio del proyecto (O-05), nombre, una frase de qué es
2. La historia       de dónde nació y en honor a quién (O-06). Va ARRIBA, antes de los
                     datos operativos: es lo que distingue a REFUVA de una ONG genérica
3. Qué hace hoy      actividad concreta, frecuencia, alcance
4. A quién sirve     población objetivo
5. Requisitos        condiciones de participación, si el proyecto las tiene.
                     Siempre ANTES del formulario o del botón, nunca después (RF-07)
6. Convocatoria      estado abierto/cerrado con fechas, solo si el proyecto tiene una (RF-13)
7. Evidencia         galería de fotos, con texto alternativo obligatorio
8. La acción         UNA acción primaria, propia de este proyecto (ver §7.3)
9. Relacionado       hasta tres noticias etiquetadas con este proyecto
10. Crisis           bloque de crisis completo, solo en las cuatro páginas de proyecto
                     que nombra la lista canónica de §4.5. En las otras tres, la banda
                     del armazón es todo lo que va
```

`navidad` es la única excepción a «una acción»: tiene **dos convocatorias con públicos que no se
solapan** (P-02). Se presentan como dos tarjetas separadas —«Apadrina a un niño» y «Postula a mi
comunidad»— con su propia explicación cada una, no como dos botones en fila compitiendo.

## 6.2 Plantilla B — Artículo (noticia y evento)

```
Miga de pan:  Inicio › Noticias › {titular} | Inicio › Eventos › {evento}
─────────────────────────────────────────────
1. Titular
2. Datos            fecha de publicación; en eventos, además fecha_inicio y fecha_fin (RF-01)
3. Imagen           destacada, con texto alternativo obligatorio para poder publicar (RF-01)
4. Etiqueta         a qué proyecto pertenece. OBLIGATORIA: una noticia sin proyecto no se
                    puede relacionar, no aparece en la página del proyecto y no suma a O-04
5. Cuerpo           formato enriquecido: títulos, listas, enlaces, imágenes
6. Crisis           bloque completo si la etiqueta de la zona 4 es uno de los cuatro
                    proyectos de salud mental de §4.5. Lo decide la etiqueta, no un
                    criterio a mano al publicar (CLAUDE.md §5.1)
7. Acción           la del proyecto etiquetado, no una genérica
8. Relacionadas     tres del mismo proyecto
```

Un evento vencido conserva su página y su URL para siempre; lo que hace es dejar de listarse entre
los próximos (RF-01). Cada edición anual es una página distinta (RF-14): la fiesta navideña de 2026
no es la de 2025.

## 6.3 Plantilla C — Página de formulario

Seis instancias: `/agendar-cita`, `/voluntariado`, `/apadrinar`, `/postular-comunidad`, `/alianzas`,
`/contacto`. El orden de las zonas **no varía entre instancias**, porque es el que protege al
solicitante.

```
Miga de pan
─────────────────────────────────────────────
1. Título y promesa      qué es esto y qué pasa después de enviar
2. ZONA DE ADVERTENCIA   cambia según el formulario, y siempre va ANTES del primer campo:
                         · /agendar-cita        → bloque de crisis completo + «esto no es un
                                                  canal de emergencia» (§4.5, RF-11,
                                                  CLAUDE.md §5.1)
                         · /postular-comunidad  → los requisitos de vulnerabilidad (RF-07)
                         · /apadrinar           → estado de la convocatoria (RF-13)
3. Qué pedimos y por qué una línea. Y cuánto tarda de llenar
4. Campos                una sola columna, un solo bloque, sin pasos ni asistentes
5. Consentimiento        casilla activa, NUNCA premarcada, en lenguaje llano,
                         con enlace a /privacidad
6. Envío                 un único botón primario
7. Alternativa           botón a WhatsApp. Convive con el formulario, no lo reemplaza (RF-02)
8. Confirmación          reemplaza al formulario en la misma URL; el foco se mueve al mensaje
```

**Zona prohibida.** Ninguna página de formulario de ayuda —`/agendar-cita` sobre todo— lleva llamada
a donar, ni en el cuerpo ni en banda de cierre. Pedirle dinero a alguien que está pidiendo ayuda
psicológica es una falta de criterio, y además choca con S-03: Edwin sabe que hay gente que no tiene
esos quince balboas. El enlace a `/donar` del pie es suficiente y es lo único que aparece.

## 6.4 Plantilla D — Índice

Cuatro instancias: `/proyectos`, `/participar`, `/noticias`, `/eventos`.

```
Miga de pan (solo en /noticias y /eventos)
─────────────────────────────────────────────
1. Título y una frase de qué se lista
2. Filtro          solo en /noticias, y solo por proyecto. Con «todas» seleccionado por defecto
3. Rejilla         tarjetas homogéneas
4. Paginación      en /noticias y /eventos
5. Estado vacío    ver §9
```

Anatomía de la tarjeta: imagen de **proporción fija** —para que el texto no salte cuando cargue—,
etiqueta de proyecto, título, fecha, resumen de dos líneas. **La tarjeta entera es el enlace**, con
un solo destino: nada de un «leer más» que obligue al lector de pantalla a oír dos enlaces al mismo
sitio.

Reglas propias de cada índice:

- **`/proyectos` no pagina, no filtra y no lleva carrusel.** Siempre todos, siempre visibles a la
  vez. Un carrusel esconde todos menos uno y deshace en un componente todo el argumento de O-04.
- **`/noticias` y `/eventos` paginan; no llevan desplazamiento infinito.** El desplazamiento infinito
  vuelve inalcanzable el pie —que en este sitio es el mapa completo—, rompe el botón «atrás» y hace
  imposible navegar con teclado hasta el final de la lista.
- **`/eventos` se parte en dos:** próximos primero, ordenados por fecha ascendente; pasados después.
  El corte lo hace el sistema por fecha (RF-01), sin que Edwin tenga que archivar nada.

## 6.5 Plantilla E — Contenido editorial

`/nosotros`, `/donar`, `/ayuda-en-crisis`, `/privacidad`, `/terminos`. Una columna, ancho de lectura
cómodo, índice lateral de secciones solo si el documento es largo, sin barra lateral de promociones.

Dos notas por su peso específico: `/donar` no exige registro ni formulario para ver los datos
(**RF-09**, «sin muro»), y cada dato bancario tiene su propio botón de copiar, porque el caso real
es alguien tecleando un número de cuenta en la aplicación del banco desde el teléfono.
`/ayuda-en-crisis` muestra al pie la **fecha de última verificación** de cada número.

---

# 7. Jerarquía de llamadas a la acción

## 7.1 Los cuatro CTA

| CTA | Destino | A quién le habla | Prioridad |
|---|---|---|---|
| **Donar** | `/donar` | Donante individual e institucional | Alta |
| **Agendar cita** | `/agendar-cita` | Persona que necesita apoyo psicológico | Alta |
| **Ser padrino o madrina** | `/apadrinar` | Quien quiere regalar en Navidad | Alta, estacional |
| **Ser voluntario** | `/voluntariado` | Quien ofrece tiempo u oficio | Media |

## 7.2 La regla que evita que compitan

**Una sola acción primaria por pantalla.** Los cuatro CTA aparecen juntos y como iguales **en un solo
lugar del sitio**: el bloque 3 del Inicio (HU-02). En cualquier otra página hay exactamente una
acción primaria, y es la que corresponde al propósito de esa página. Las demás bajan a enlace de
texto o desaparecen.

| Dónde | Acción primaria | Acciones secundarias | Ausentes a propósito |
|---|---|---|---|
| Inicio, bloque 3 | Las cuatro, como iguales | — | — |
| Inicio, banda de cierre | Donar | — | — |
| `/proyectos` | Ninguna: la acción es entrar a un proyecto | — | Las cuatro |
| Página de proyecto | La propia del proyecto (§7.3) | Donar, como enlace de texto | Las otras dos |
| `/agendar-cita` | Enviar la solicitud | WhatsApp | **Donar**, y las otras dos |
| `/apadrinar`, `/voluntariado`, `/postular-comunidad`, `/alianzas` | Enviar el formulario | — | Las otras tres |
| `/donar` | Copiar el dato o abrir Yappy | — | Las otras tres |
| Artículo | La del proyecto etiquetado | — | Las otras tres |
| `/nosotros` | Donar | Ver proyectos | Las otras dos |
| Pie, en todas las páginas | Ninguna: son enlaces de texto | Los cuatro | — |

Dicho al revés: **si en una pantalla hay dos botones que se ven igual de importantes, la
arquitectura está mal**. El pie es la única excepción y no cuenta, porque llega cuando la persona ya
terminó de leer y ningún enlace del pie compite visualmente con nada.

## 7.3 La acción propia de cada proyecto

🟡 **Inferido.** Lo confirma Edwin junto con el resto de la ficha de cada proyecto (**P-08**, pendiente).

| Proyecto | Acción primaria | Razón |
|---|---|---|
| `psicoeducativo` | Solicitar alianza (`/alianzas`) | Su interlocutor es una escuela, no una persona (P-01, RF-08) |
| `navidad` | Apadrinar **y** postular comunidad | Dos convocatorias, dos públicos (P-02) |
| `alimentacion` | Ser voluntario | Hacen falta manos y transporte en cada salida (P-03) |
| `animales` | Donar | Lo que hace falta es comida, y eso se compra (P-04) |
| `hablame-panama` · `escuchame-panama` | Agendar cita / pedir ayuda | **Nunca donar.** Ver §6.3 |
| `rompiendo-el-circulo` | Ser voluntario | Trabajo de campo en barrios y escuelas (P-06) |
| `historias-que-sanan` | Ser voluntario | Busca escritores y facilitadores (P-07) |

---

# 8. Comportamiento en móvil

El público incluye a gente en pobreza, en crisis y con teléfonos modestos (**CLAUDE.md** §5.4). La
arquitectura se diseña para la pantalla chica primero y se expande hacia el escritorio, no al revés.
🟡 *Que la mayoría del tráfico sea móvil es un supuesto razonable —el canal actual de la fundación es
WhatsApp e Instagram (S-04, S-08)— pero no está medido. Se confirmará con Cloudflare Web Analytics
tras el lanzamiento.*

## 8.1 Qué se colapsa

| Elemento | En móvil |
|---|---|
| Menú principal | Botón de menú. Al abrirse, las seis entradas en lista vertical, cada una de ancho completo |
| Las tarjetas del catálogo | Una columna, todas apiladas. **Nunca un carrusel** (§6.4) |
| Las cuatro acciones del Inicio | Cuatro botones de ancho completo, apilados, en el mismo orden |
| Columnas del pie | Cuatro secciones apiladas, plegables, con «Si necesitas ayuda» desplegada por defecto |
| Tablas de requisitos | Lista vertical de puntos. Ninguna tabla obliga a desplazarse en horizontal |
| Galería de evidencia | Cuatro fotos y un «ver todas», en vez de la rejilla completa |
| Miga de pan | Solo el padre inmediato: «‹ Proyectos» en vez de la ruta entera. La ruta completa sigue en los datos estructurados |

## 8.2 Qué se prioriza

- El **texto del hero va antes que su imagen** en el orden del documento. El titular es lo que hace el
  trabajo de O-04 y tiene que poder leerse mientras la foto todavía carga (HU-01).
- La **banda de crisis** no se toca: misma línea, mismo lugar, primera posición.
- Los **números de teléfono** son objetivos táctiles cómodos y son a la vez texto seleccionable y
  enlace `tel:` (RF-11). El mínimo de área táctil de WCAG 2.2 —24×24 px CSS— es un piso, no una meta;
  en móvil van como botones de ancho completo.
- Los **formularios**, en una sola columna, con teclado apropiado por tipo de campo y sin campos que
  desaparezcan al enfocar otro.
- Las **imágenes** siempre con dimensiones declaradas, para que nada salte mientras carga.

## 8.3 Qué desaparece

| Elemento | Por qué |
|---|---|
| Imágenes decorativas de fondo y adornos del hero | Peso puro. No comunican nada que el texto no diga |
| Mapa embebido de `/contacto` | Solo carga tras un clic explícito, y en móvil se sustituye por un enlace «Abrir en mapas» (RF-10). Además evita arrastrar cookies de terceros |
| Contadores animados y transiciones largas | Consumen batería y procesador en teléfonos viejos, y no aportan información |
| Elementos fijos flotantes de cualquier tipo | Ningún botón flotante de WhatsApp, ni banda pegajosa, ni ventana emergente de donación. Tapan contenido, tapan el foco del teclado y empujan el diseño mientras carga |
| Publicaciones de Instagram, de seis a tres | Menos peso, menos desplazamiento (RF-05) |

---

# 9. Estados vacíos y de error

Regla general: **nunca un hueco en blanco y nunca un mensaje técnico.** Todo estado vacío dice qué
pasa, por qué, y ofrece una salida. Ninguno culpa al visitante.

| Listado | Cuando está vacío | Cuando falla |
|---|---|---|
| **`/noticias`** | «Todavía no hay publicaciones. Mientras tanto, síguenos en Instagram» + enlace a `/proyectos` | Mensaje de que no se pudo cargar el listado y enlace a `/proyectos` y al Inicio. La página se sirve igual |
| **`/noticias` con filtro por proyecto** | «Aún no hay noticias de {proyecto}» + botón «Ver todas las noticias» + enlace a la página del proyecto | — |
| **`/eventos`, sección próximos** | «No hay eventos programados por ahora. Las convocatorias se anuncian aquí y en Instagram». Los eventos pasados siguen mostrándose debajo: son la evidencia de trayectoria (O-07) | Ídem noticias |
| **`/eventos`, sin ningún evento** | Se explica que la agenda se está armando y se enlaza a `/proyectos` | — |
| **`/proyectos`** | No puede estar vacío: el catálogo es fijo. Si un proyecto no tiene texto todavía, su tarjeta se muestra igual con el nombre y el logo, y su página dice «Estamos preparando esta información» sin dejar de mostrar la acción | — |
| **Galería de un proyecto** | La sección entera desaparece. No se muestra un marco vacío ni una foto genérica de banco de imágenes | — |
| **Convocatoria cerrada** (`/apadrinar`, `/postular-comunidad`) | La página existe siempre y se puede compartir. En vez del formulario: qué convocatoria es, **cuándo vuelve a abrir** si la fecha está definida —o «se anuncia en Instagram» si no—, y una salida alternativa: ser voluntario o donar. El formulario deja de aceptar envíos también en el servidor, no solo se oculta (RF-13) | — |
| **Feed de Instagram** | Si no hay ninguna publicación cacheada, **la sección entera desaparece del Inicio** (RF-05). No se muestra un hueco, ni un icono roto, ni «error al cargar» | Si la fuente no responde, se muestra **la última copia buena** de la base de datos, sin avisar al visitante. Si tampoco hay copia, desaparece. El fallo queda registrado y visible en `/panel/tareas` (RF-15) |
| **Bandeja del panel vacía** | «No hay solicitudes de este tipo todavía». Distinto de «no hay resultados con estos filtros», que además ofrece limpiar los filtros | Mensaje explícito. Nunca una lista vacía que parezca normal |
| **Página no encontrada (404)** | Explica que la página no existe o fue archivada, y ofrece: Inicio, el catálogo, `/noticias` y `/contacto`. Devuelve código 404 de verdad, no 200 | — |
| **Error del servidor (500)** | Mensaje corto y humano, más los canales que no dependen del sitio: WhatsApp, correo y la banda de crisis. Si el sitio se cae, el 911 y el 147 siguen impresos en esa página | — |
| **Envío de formulario fallido** | El texto que la persona escribió **no se pierde**: el formulario se vuelve a mostrar completo, con el error arriba, junto al botón, y con la alternativa por WhatsApp | Si la solicitud se guardó pero el correo falló, al visitante se le confirma igual —su solicitud existe— y el reintento queda encolado (RF-02, RF-15). Nunca se le dice a alguien que falló algo que en realidad se guardó |

---

# 10. Migas de pan y títulos

## 10.1 Migas de pan

Se muestran en todas las páginas de segundo nivel y en todo artículo. **No** en el Inicio ni en las
páginas de primer nivel, donde el único padre es el Inicio y la miga sería ruido.

```
Proyecto      Inicio › Proyectos › Fiesta navideña
Noticia       Inicio › Noticias › {titular, recortado}
Evento        Inicio › Eventos › Fiesta navideña 2026
Formulario    Inicio › Participar › Ser padrino o madrina
              Inicio › Agendar cita          (sin miga: es de primer nivel)
Legal         Inicio › Política de privacidad  (sin miga: es de primer nivel)
Panel         sin migas; el panel usa su propia navegación lateral
```

El último elemento es el nombre de la página actual y **no es un enlace**. Toda miga se acompaña de
datos estructurados `BreadcrumbList`, que sustituyen la URL cruda en el resultado de búsqueda. En
móvil se recorta al padre inmediato (§8.1), pero los datos estructurados conservan la ruta completa.

## 10.2 Fórmula del `<title>`

Sufijo común: ` | Fundación REFUVA` — diecinueve caracteres. Regla práctica del equipo, no dato
verificado: que el título completo quepa en unos 60 caracteres, porque el buscador recorta los
largos y lo primero que se pierde es el final.

| Tipo de página | Fórmula | Ejemplo |
|---|---|---|
| Inicio | `Fundación REFUVA \| {lema}` | 🔴 **Pendiente**. Propuesta 🟡: `Fundación REFUVA \| Salud mental, alimentación y Navidad en Panamá`. Depende de O-08 (misión, visión y valores oficiales). Lo aprueba Edwin |
| Índice de proyectos | `{Sección} \| Fundación REFUVA` | `Nuestros proyectos \| Fundación REFUVA` |
| Proyecto | `{Nombre del proyecto} \| Fundación REFUVA` | `Historias que Sanan \| Fundación REFUVA` |
| Noticia | `{Titular} \| Fundación REFUVA` | `Tercer año de la campaña de prevención \| Fundación REFUVA` |
| Evento | `{Nombre del evento} {año} \| Fundación REFUVA` | `Fiesta navideña 2026 \| Fundación REFUVA` |
| Formulario | `{Acción, en infinitivo} \| Fundación REFUVA` | `Agendar cita \| Fundación REFUVA` |
| Editorial y legal | `{Nombre de la página} \| Fundación REFUVA` | `Cómo donar \| Fundación REFUVA` |
| Crisis | `Ayuda en crisis \| Fundación REFUVA` | — |
| 404 | `Página no encontrada \| Fundación REFUVA` | — |
| Panel | `{Sección} — Panel REFUVA` | `Ajustes — Panel REFUVA` |
| Panel, bandeja con pendientes | `({n}) {Bandeja} — Panel REFUVA` | `(3) Solicitudes de cita — Panel REFUVA` |

El contador en el título de la bandeja no es un adorno: es para X-03, un administrador que entra cada
varias semanas y ve el pendiente desde la pestaña del navegador, sin abrir nada (RF-12).

## 10.3 Descripción y tarjeta social

- **Una descripción propia por página.** Ninguna repetida, ninguna autogenerada cortando el primer
  párrafo. Las que faltan quedan en el inventario de contenido, no se inventan.
- Toda página lleva imagen de tarjeta social: la del contenido si la tiene, y si no la institucional.
  Una noticia compartida por WhatsApp tiene que verse bien (**RF-14**); ese es el canal real por el
  que circula el contenido de esta fundación.
- Datos estructurados por tipo: `NGO` en el Inicio, `BreadcrumbList` en toda página interna, `Event`
  por edición, `Article` en noticias, y `DonateAction` apuntando a `/donar`.
- Todo `/panel/*` va con `noindex` y bloqueado en `robots.txt`.

---

# 11. Lo que este documento deja pendiente

| # | Qué falta | Estado | Quién lo debe |
|---|---|---|---|
| AI-01 | Confirmación del orden del Inicio (§5) | 🔴 | **Edwin** — es su decisión (C-11) |
| AI-02 | Lema del Inicio y `<title>` de la portada (§10.2) | 🔴 | **Edwin**, junto con misión y visión (O-08) |
| AI-03 | Acción primaria de cada proyecto (§7.3) | 🟡 | **Edwin**, con la ficha de cada línea (P-08) |
| AI-04 | Nombre público exacto de cada proyecto para el menú y las tarjetas | 🔴 | **Edwin** (P-08) |
| AI-05 | Si `/contacto` lleva mapa: depende de si hay dirección publicable | 🔴 | **Edwin** (S-05) |
| AI-06 | Si `/nosotros` publica los documentos de personería jurídica | 🔴 | **Edwin** (O-09) |
| AI-07 | Si `/proyectos/psicoeducativo` lista las más de 30 escuelas o las mantiene privadas | 🔴 | **Edwin** |
| AI-08 | Si los padrinos se listan públicamente o quedan anónimos: define si existe una sección de reconocimiento en `/proyectos/una-estrella-otiliana` | 🔴 | **Edwin** |
| AI-09 | Fechas de apertura y cierre de la convocatoria navideña 2026, para los estados de §9 | 🔴 | **Edwin** (RF-13) |
| AI-10 | Verificación telefónica de la 169 del MINSA y de los números del INSAM antes de considerarlos para `/ayuda-en-crisis` | 🔴 | **El equipo** — hay que llamar y anotar qué contesta |
| AI-11 | Cuota de tráfico móvil real, para revisar §8 | 🔴 | Se mide después del lanzamiento |

---

## Documentos relacionados

- [`../CLAUDE.md`](../CLAUDE.md) — decisiones del proyecto, §2 los códigos de proyecto y §5 las reglas de contenido sensible.
- [`01-srs.md`](./01-srs.md) — módulos 3.1.x y requisitos RF-01 a RF-15.
- [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) — origen de todo código O-, P-, S-, R-, C- y X- citado aquí.
- [`02-historias-usuario.md`](./02-historias-usuario.md) — las historias HU- y sus criterios de aceptación.
- [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md) — accesibilidad, rendimiento y contenido sensible en detalle.
- [`06-inventario-contenido.md`](./06-inventario-contenido.md) — donde viven los pendientes de la §11.
- [`07-modelo-datos.md`](./07-modelo-datos.md) — tablas que alimentan cada listado.
