# Sistema de diseño — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 6 de septiembre de 2026 |
| **Estado** | Paleta **provisional**. Ver §1. |
| **Fuente de verdad** | [`src/app/globals.css`](./src/app/globals.css). Este documento explica; el CSS manda. |
| **Verificación** | `npm run contraste` |

---

## 1. Lo que se investigó, y lo que no se encontró

Antes de elegir un solo color se buscó la identidad visual real de la fundación. Esto es lo que hay:

**Encontrado y verificado:**

- **REFUVA viene de REsiliente, FUerte, VAliente.** Es la definición que la propia fundación da de
  su nombre.
- La fundó **Edwin Quintero a los 29 años**, convirtiendo su historia personal de lucha emocional en
  una plataforma de apoyo para otros.
- TVN lo describe como «un referente de **fortaleza y vulnerabilidad al mismo tiempo**», y fue uno de
  los siete reconocidos en **Héroes por Panamá 2025**.
- La fundación busca crear «espacios seguros donde las personas puedan **hablar de lo que duele** y
  pedir ayuda».
- Participa en la campaña **500 Voces por la Salud Emocional** junto a Plan4Kids y Fundación
  Serenamente.

**No encontrado:**

- **Logo oficial.** No está publicado en ninguna parte accesible.
- **Colores de marca.** Ninguna fuente los documenta.
- **Cuenta de Instagram de la fundación.** Instagram devuelve un muro de sesión y las búsquedas no
  dan con el usuario. Octavio la compartió con el equipo en la reunión; **hay que pedírsela**.

> **Por lo tanto, esta paleta no son los colores de REFUVA.** Es una propuesta derivada de lo que la
> fundación dice de sí misma. Inventar una paleta y presentarla como la suya habría sido peor que
> admitirlo. Sigue pendiente el punto **O-08** de
> [`docs/06-inventario-contenido.md`](./docs/06-inventario-contenido.md).

---

## 2. La paleta sale del nombre

El nombre es el brief. Cada palabra tiene un rol de color, y ese rol es lo que decide dónde se usa:

| | Rol | Qué es | Dónde se usa |
|---|---|---|---|
| **RE**siliente | `papel` | Lo que sostiene y aguanta. Fondo cálido con grano, nunca el blanco clínico de un consultorio. | Todos los fondos. |
| **FU**erte | `fuerte` | Verde profundo. Ancla, calma, cosa que crece. El color de la confianza. | Botones, enlaces, banda de crisis, cifras. |
| **VA**liente | `valiente` | Terracota cálida. El acto de hablar, de pedir ayuda. Se usa poco y por eso se nota. | Numerales, acentos, anillo de foco, errores. |

La decisión que sostiene todo esto: **un sistema que solo transmita fuerza fallaría la mitad del
encargo**. A Edwin lo describen como fortaleza *y* vulnerabilidad a la vez. El verde profundo hace la
fuerza; el papel cálido y con grano hace la vulnerabilidad. Sin el segundo, el sitio se leería como
una consultora.

**Lo que se descartó, y por qué:**

| Descartado | Motivo |
|---|---|
| Azul institucional | Es el color por defecto de todo el sector salud. Lee como clínico y frío justo donde no debe. |
| Morado/violeta | Es el color de la salud mental en marketing genérico, y refuerza exactamente el malentendido que el sitio existe para desmentir: que REFUVA es solo salud mental. |
| Rojo de alarma en la banda de crisis | Un rojo permanente en todas las páginas se vuelve invisible por costumbre y alarma a quien no lo necesita — el sitio también lo abren patrocinadores. La contención en crisis funciona con calma, no con urgencia gritada. |
| Blanco puro de fondo | Deslumbra en la calle con el brillo al máximo y se siente a hospital. |

---

## 3. Tokens

Definidos en [`src/app/globals.css`](./src/app/globals.css) y exportados en
[`design-tokens.json`](./design-tokens.json). **Ningún componente conoce un color literal**: todos
usan estos nombres. Cambiar la paleta es editar dos bloques de variables.

| Token | Claro | Oscuro | Para qué |
|---|---|---|---|
| `papel` | `#f8f4ed` | `#12100c` | Fondo de la página |
| `papel-alto` | `#efe7d9` | `#1c1915` | Bandas y secciones alternas |
| `superficie` | `#fffdf9` | `#1a1713` | Tarjetas, campos de formulario |
| `tinta` | `#16140f` | `#f3eee4` | Texto principal |
| `tinta-suave` | `#565049` | `#aba396` | Texto secundario |
| `fuerte` | `#0e4a3e` | `#78c9ac` | Enlaces, botones, banda de crisis |
| `fuerte-tenue` | `#e0ebe5` | `#16302a` | Fondos de apoyo del verde |
| `valiente` | `#af4e1b` | `#ee9256` | Acentos, numerales, foco, error |
| `valiente-tenue` | `#f8e7db` | `#2f1e11` | Fondo de avisos |
| `borde` | `#dfd6c6` | `#2d2822` | Separadores finos |
| `borde-fuerte` | `#c2b7a3` | `#4a4238` | Bordes visibles |
| `borde-control` | `#8e8471` | `#6e6558` | Bordes de campos — el único que debe pasar 3:1 |

El tema oscuro **no es el claro invertido**. Se diseñó aparte: el papel se vuelve tinta cálida —nunca
el gris azulado de una terminal— y el verde y la terracota suben de luminosidad lo justo para seguir
pasando contraste sin brillar.

---

## 4. Contraste, verificado

`npm run contraste` lee los tokens **directamente de `globals.css`** —no de una copia— y calcula la
razón de contraste de WCAG 2.2 de cada pareja que el sitio usa de verdad. Si alguien cambia un color
y baja del umbral, el script falla.

**34 de 34 comprobaciones pasan en los dos temas.**

| Pareja | Claro | Oscuro | Mínimo |
|---|---|---|---|
| Texto normal sobre papel | 16.79:1 | 16.43:1 | 4.5 |
| Texto secundario sobre papel | 7.26:1 | 7.61:1 | 4.5 |
| Enlaces y botones sobre papel | 9.26:1 | 9.73:1 | 4.5 |
| Acentos y numerales sobre papel | 4.88:1 | 8.04:1 | 4.5 |
| Texto normal sobre superficie | 18.11:1 | 15.44:1 | 4.5 |
| Enlaces sobre superficie | 10.00:1 | 9.14:1 | 4.5 |
| Papel sobre la banda de crisis | 9.26:1 | 9.73:1 | 4.5 |
| Texto sobre fondo tenue de acento | 15.29:1 | 13.81:1 | 4.5 |
| Enlaces sobre fondo tenue fuerte | 8.31:1 | 7.21:1 | 4.5 |
| **Borde de control sobre papel** | **3.37:1** | **3.32:1** | **3.0** |
| Anillo de foco sobre papel | 4.88:1 | 8.04:1 | 3.0 |

El más ajustado es el borde de los campos de formulario. No es casualidad: el fondo del campo y el de
la página se diferencian en 1.03:1, así que **el borde es lo único que identifica el control**, y
WCAG 1.4.11 pide 3:1 para eso. Por eso `borde-control` existe como token aparte y es más oscuro de lo
que pediría el gusto.

---

## 5. Cambio de tema

Tres estados, no dos: **claro**, **oscuro** y **sistema**, que es el valor por defecto.

«Sistema» tiene que existir. Mucha gente ya tiene el teléfono en oscuro de noche, y forzarle un tema
claro a las dos de la mañana en la página de crisis es exactamente el momento en que peor sienta.

**Cómo funciona:**

1. Sin elección del usuario no hay atributo en `<html>` y manda `prefers-color-scheme`.
2. Al elegir, se escribe `data-tema="claro"` o `data-tema="oscuro"` y se guarda en `localStorage`.
3. El bloque del sistema está negado con `:root:not([data-tema="claro"])`, así que elegir «claro»
   gana sobre un sistema en oscuro. El bloque `[data-tema="oscuro"]` va después y gana en la otra
   dirección. **La elección explícita gana siempre, en los dos sentidos.**
4. Un guion de una línea en el `<head>` aplica el atributo **antes del primer pintado**. Sin él,
   quien elige oscuro ve un fogonazo blanco en cada carga.
5. `color-scheme` acompaña al tema, para que los controles nativos y la barra de desplazamiento no se
   queden claros dentro de una página oscura.

**Sin cookie.** Solo `localStorage`. El sitio no pone ni una cookie, y así se evita el banner de
consentimiento.

El selector se lee con `useSyncExternalStore` en vez de con un efecto: es el patrón correcto para
estado externo con renderizado concurrente, y sale gratis la sincronización entre pestañas.

---

## 6. Tipografía

| | Familia | Uso |
|---|---|---|
| Display | **Fraunces**, ejes `SOFT 28`, `WONK 1`, `opsz 100` | Titulares, numerales, cifras |
| Cuerpo | **Inter** | Todo lo demás, a 17 px |

No es «poner dos fuentes de Google». Fraunces con `WONK` activado tiene terminaciones raras y curvas
blandas — cálida, con carácter, algo torcida a propósito. La tensión entre ese serif con personalidad
y el grotesco neutro de Inter es lo que sostiene la jerarquía **sin recurrir al color**, que importa
porque el color aquí es escaso y semántico.

Cuerpo a **17 px**, no 16. El público incluye a gente mayor y a gente leyendo en la calle con el sol
de frente.

Escala del display: `clamp(2.5rem, 1.2rem + 5.2vw, 5.5rem)`. Crece con el ancho, nunca por debajo de
lo legible ni por encima de lo cómodo.

---

## 7. Textura y profundidad

**Grano de papel.** Un SVG de ~200 bytes en línea con `feTurbulence`, a 3.8 % de opacidad en claro y
5.5 % en oscuro. Cero peticiones de red, que importa cuando el público navega con datos caros. Es lo
que evita que el fondo se lea como una pantalla en blanco y lo acerca a un documento impreso.

**Profundidad sin sombras genéricas.** La jerarquía se hace con tres planos de fondo —`papel`,
`papel-alto`, `superficie`— y con bordes, no con `box-shadow` en todo. Las sombras se reservan al
menú desplegable y al desplazamiento de un botón al pasar el ratón.

---

## 8. Lo que se evitó a propósito

Revisión contra los patrones prohibidos de
[`.claude/rules/web/design-quality.md`](./.claude/rules/web/design-quality.md):

| Patrón prohibido | Qué se hizo en su lugar |
|---|---|
| Cuadrícula de tarjetas uniforme | Las siete líneas son un **índice numerado**. Además de tener carácter, resuelve un problema real: una cuadrícula de siete deja un hueco impar que sugiere que una sobra. |
| Hero centrado con degradado y CTA genérico | Titular alineado a la izquierda, a `19ch`, con las cuatro acciones en fila. Cero degradados en todo el sitio. |
| Radios, espaciados y sombras uniformes | El ritmo vertical cambia por sección: `py-14` en las densas, `py-24` en las que respiran. Los radios van de `rounded-md` a `rounded-2xl` según el peso del elemento. |
| Gris sobre blanco con un acento decorativo | Tres planos de papel cálido, y el color **solo** cuando significa algo. |
| Fuentes por defecto sin motivo | Fraunces con sus ejes variables puestos a trabajar. |
| Modo oscuro a medias | Los dos temas están diseñados y los dos están auditados. |
| Animación gratuita | Solo transiciones de estado, todas por debajo de 200 ms, todas anuladas bajo `prefers-reduced-motion`. |

---

## 9. Cuando lleguen los colores oficiales

Es una operación de cinco minutos y no toca ni un componente:

1. Sustituir los valores del bloque `:root` en `src/app/globals.css` por los de la marca.
2. Diseñar el tema oscuro a partir de ellos —**no invertirlos**— y ponerlos en los dos bloques
   oscuros (el del sistema y el de `[data-tema="oscuro"]`, que están duplicados a propósito).
3. Correr `npm run contraste`. Si algo baja del umbral, ajustar la luminosidad **antes** de seguir.
4. Actualizar la tabla del §3 y del §4 de este documento.
5. Actualizar `design-tokens.json`.

Si la paleta de marca no pasa contraste —pasa a menudo con marcas pensadas para impresión— la regla
es: **el color de marca se conserva en logos y superficies grandes, y se ajusta la variante que se
usa para texto**. Un color corporativo ilegible no es fidelidad de marca, es una barrera.
