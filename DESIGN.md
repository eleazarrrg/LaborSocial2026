---
name: Portal Fundación REFUVA
description: El estándar del sector, ejecutado sin ironía, con Mind (mind.org.uk) como vara de acabado y los colores medidos del árbol Ψ.
colors:
  papel: "#ffffff"
  papel-alto: "#e9f3f2"
  superficie: "#ffffff"
  tinta: "#101a19"
  tinta-suave: "#43504e"
  marca: "#005557"
  sobre-marca: "#ffffff"
  fuerte: "#005c5c"
  fuerte-tenue: "#d3ebe8"
  valiente: "#a34700"
  valiente-tenue: "#fde6d2"
  tronco: "#7d2b00"
  vivo: "#d46a00"
  alerta: "#b3261e"
  borde: "#d5e4e2"
  borde-fuerte: "#a9c3c0"
  borde-control: "#6d8582"
  papel-oscuro: "#0c1413"
  papel-alto-oscuro: "#13201f"
  superficie-oscuro: "#101b1a"
  tinta-oscuro: "#e7f0ee"
  tinta-suave-oscuro: "#a2b4b1"
  marca-oscuro: "#0f3836"
  sobre-marca-oscuro: "#e7f0ee"
  fuerte-oscuro: "#72d0cb"
  fuerte-tenue-oscuro: "#103634"
  valiente-oscuro: "#f2a466"
  valiente-tenue-oscuro: "#3b2412"
  tronco-oscuro: "#e39a72"
  vivo-oscuro: "#f0a060"
  alerta-oscuro: "#ff9e8a"
  borde-oscuro: "#233331"
  borde-fuerte-oscuro: "#36504d"
  borde-control-oscuro: "#5f7a77"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 2.2vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.25
rounded:
  foco: "3px"
  control: "8px"
  tarjeta: "12px"
  campo: "16px"
spacing:
  canal-movil: "16px"
  canal: "24px"
  hueco: "16px"
  seccion-movil: "56px"
  seccion: "80px"
  contenedor: "72rem"
components:
  button-primario:
    backgroundColor: "{colors.fuerte}"
    textColor: "{colors.papel}"
    rounded: "{rounded.control}"
    typography: "{typography.body}"
    padding: "12px 24px"
    height: "48px"
  button-primario-hover:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.papel}"
  button-secundario:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: "48px"
  button-secundario-hover:
    backgroundColor: "{colors.papel-alto}"
  button-sobre-fuerte:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.fuerte}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: "48px"
  button-cabecera-ayuda:
    backgroundColor: "{colors.valiente-tenue}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-cabecera-ayuda-hover:
    backgroundColor: "{colors.valiente}"
    textColor: "{colors.papel}"
  button-cabecera-donar:
    backgroundColor: "{colors.fuerte-tenue}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-cabecera-donar-hover:
    backgroundColor: "{colors.fuerte}"
    textColor: "{colors.papel}"
  franja-navegacion:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.sobre-marca}"
    padding: "16px 24px"
  banda-crisis:
    backgroundColor: "{colors.tronco}"
    textColor: "{colors.papel}"
    typography: "{typography.label}"
    padding: "10px 24px"
  tarjeta-ayuda:
    backgroundColor: "{colors.valiente-tenue}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.tarjeta}"
    padding: "24px 24px 80px"
  placa:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.tarjeta}"
    size: "112px"
  titulo-pagina:
    backgroundColor: "{colors.papel-alto}"
    textColor: "{colors.tinta}"
    typography: "{typography.headline}"
    padding: "64px 24px 56px"
---

# Design System: Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 3.0 |
| **Fecha** | 5 de octubre de 2026 |
| **Dirección** | El estándar del sector, con **Mind** (mind.org.uk) como vara de acabado. Elegida por el equipo el 5 de octubre de 2026 (contrato en `.impeccable/surfaces/src-app-page-tsx.md`, semilla 32049929). |
| **Fuente de verdad** | [`src/app/(sitio)/globals.css`](./src/app/(sitio)/globals.css). Este documento explica; el CSS manda. Los tokens de arriba son la copia legible por máquina del tema claro y del oscuro. |
| **Verificación** | `npm run contraste` — **64 de 64 en los dos temas** |
| **Complemento** | `.impeccable/design.json`: rampas tonales, movimiento, sombras, fragmentos de componente y la narrativa. |

> **Qué cambió desde la v2.0.** La v2 tenía fondo crema con grano de papel, Fraunces + Inter, el marrón
> del tronco como `fuerte` y un índice numerado 01–08. Sus colores salían del logo y aun así el sitio
> se leía **genérico**: crema + serif de alto contraste + acento terracota es, hoy, la estética que
> más repite la IA. El compromiso de marca son los colores del árbol Ψ, no el crema ni el serif. La
> v3 conserva los colores medidos y cambia el mundo que los rodea.

## Overview

**Creative North Star: "La fundación seria y cálida que atiende primero a quien llega mal"**

El sitio juega el estándar del sector **sin ironía**: blanco limpio, una sola familia tipográfica muy
legible, franjas enteras de turquesa profundo y botones grandes con borde. No intenta ser original en
la forma; intenta tener el acabado de Mind, que es la referencia de cómo se ve una organización de
salud mental en la que se puede confiar. Lo propio de REFUVA no está en la plantilla: está en los
**ocho emblemas reales**, en el árbol Ψ y en las historias de cada proyecto.

El orden de la pantalla es el orden de las prioridades. Primero la banda de crisis, en el marrón del
tronco. Después «Necesito ayuda», antes que «Donar». Después, en la primera pantalla, la prueba de
amplitud: ocho emblemas junto al titular, para que en diez segundos se vea que REFUVA no es solo
salud mental.

La densidad es baja y el cuerpo es grande (19 px). El público lee en la calle, con el sol de frente,
en teléfonos viejos y a veces en crisis. La legibilidad es un requisito de seguridad, no de estilo.

**Key Characteristics:**
- Blanco limpio de fondo; el tinte turquesa claro (`papel-alto`) hace de suelo de sección.
- El turquesa profundo es dueño de franjas enteras: navegación, declaración y pie.
- El naranja del árbol marca la acción de ayuda y el anillo de foco. El marrón del tronco, solo la crisis.
- Una sola familia: Atkinson Hyperlegible Next, titulares en 800.
- Botones con borde de 2 px y relleno; tarjetas tintadas sin sombra; iconos SVG de trazo único.
- Cero fotos fingidas: lo que no existe todavía no se pinta.

## Colors

Una paleta fría y limpia, anclada en el turquesa de las hojas del árbol Ψ, con el naranja de las hojas
como voz de la ayuda y el marrón del tronco reservado a la crisis.

### La marca, medida sobre el archivo

El logo institucional es **un árbol cuyo tronco es la letra Ψ**, con un cerebro y un corazón entre las
ramas. Los colores no se eligieron: se contaron, píxel a píxel, sobre el archivo.

| | Hex crudo | Peso en el logo | Qué es |
|---|---|---|---|
| Marrón | `#903000` | 37 % | El tronco. Lo que sostiene |
| Naranja | `#f07800` | 15 % | Las hojas cálidas |
| Turquesa | `#007878` | 12 % | Las hojas frías |
| Rojo | `#d80000` | 11 % | El corazón |

**Ningún hex crudo toca texto.** El turquesa crudo da 4.32:1 sobre un tinte claro y el naranja crudo
2.59:1: ninguno pasa AA. Se conserva el matiz y se baja la luminancia. El color crudo se queda en los
logos; la variante ajustada es la que llega a la interfaz. Un color corporativo ilegible no es
fidelidad de marca: es una barrera.

En la v2 el marrón era la voz (por ser el 37 % del logo). En la v3 la voz es el turquesa, como el azul
de Mind: un color frío y sereno que puede ocupar franjas enteras sin gritar. El marrón pasa a hacer una
sola cosa, y por eso se nota.

### Primary
- **Turquesa de franja** (`marca`): fondo de las franjas a lo ancho — navegación de escritorio, menú
  móvil desplegado, la declaración «Resiliente. Fuerte. Valiente.» y el pie. Lleva encima `sobre-marca`.
- **Turquesa de acción** (`fuerte`): enlaces, el botón primario sólido, flechas, el hover de los
  títulos del catálogo. Es el mismo matiz que `marca`, un punto más claro.
- **Turquesa tenue** (`fuerte-tenue`): relleno del botón «Donar» y de las tarjetas de ayuda que no son
  crisis; también el color de selección de texto.

### Secondary
- **Naranja de ayuda** (`valiente`): el anillo de foco de todo el sitio y el hover del botón
  «Necesito ayuda». Es el naranja de las hojas oscurecido hasta poder ser texto (6.07:1).
- **Naranja tenue** (`valiente-tenue`): relleno de «Necesito ayuda» y de la tarjeta «Estoy pasando
  por un momento difícil». Donde está este tinte, está la ayuda.

### Tertiary
- **Marrón del tronco** (`tronco`): **solo** la banda de crisis y el bloque completo de crisis. No es
  rojo de alarma: un rojo permanente en todas las páginas se vuelve invisible por costumbre y asusta a
  quien no lo necesita. Tampoco es el turquesa de la navegación: la banda tiene que leerse como algo
  aparte del sitio, no como su primera barra.
- **Naranja vivo** (`vivo`): acento no textual. **Nunca texto** (3.58:1, pasa solo el umbral de 3:1).
- **Rojo de error** (`alerta`): el rojo del corazón, oscurecido. Solo errores de formulario, donde el
  rojo significa algo.

### Neutral
- **Papel** (`papel`): blanco puro de fondo. En la v2 estaba vetado por deslumbrar; se aceptó al
  pasar a la dirección de Mind, y el deslumbramiento se compensa con el tema oscuro y con los suelos
  tintados.
- **Papel alto** (`papel-alto`): el tinte turquesa claro. Suelo del héroe, de las secciones alternas y
  de la cabecera de cada página.
- **Superficie** (`superficie`): tarjetas y campos sobre el suelo tintado.
- **Tinta / tinta suave** (`tinta`, `tinta-suave`): texto principal y secundario, con un punto de
  verde para no ser el negro de una plantilla.
- **Bordes** (`borde`, `borde-fuerte`, `borde-control`): filetes finos, anillo de las placas, y borde
  de campos de formulario.

**Por qué existe `borde-control`.** El fondo de un campo y el de la página se diferencian en casi
nada, así que **el borde es lo único que identifica el control**, y WCAG 1.4.11 pide 3:1 para eso. Es
la pareja más ajustada del sistema (3.94:1 en claro, 3.80:1 en oscuro sobre superficie) y es más
oscura de lo que pediría el gusto. A propósito.

### Tema oscuro

No es el claro invertido. El blanco se vuelve un **verde petróleo casi negro**, tinte del mismo
turquesa, y los colores suben de luminosidad lo justo para pasar contraste sin brillar. Los valores
están en los tokens `*-oscuro` de arriba. En oscuro la banda de crisis se vuelve un salmón claro con
texto oscuro; sigue siendo el marrón del tronco, ahora como superficie clara.

**Tres estados, no dos: claro, oscuro y sistema** (por defecto). Forzar el tema claro a las dos de la
mañana en la página de crisis es justo el momento en que peor sienta.

1. Sin elección no hay atributo en `<html>` y manda `prefers-color-scheme`.
2. Al elegir se escribe `data-tema="claro"` u `"oscuro"` y se guarda en `localStorage` (`refuva-tema`).
   **Sin cookie**: así no hace falta banner de consentimiento.
3. El bloque del sistema va negado con `:root:not([data-tema="claro"])`; el bloque
   `[data-tema="oscuro"]` va después. La elección explícita gana siempre, en los dos sentidos.
4. Un guion en el `<head>` aplica el atributo antes del primer pintado, sin fogonazo blanco.
5. `color-scheme` acompaña al tema, para que los controles nativos no se queden claros.
6. El selector de tema vive en el pie, no en la cabecera, donde sumaba tres botones a la primera pantalla.

> **Los dos bloques oscuros de `globals.css` están duplicados a propósito.** Al editar uno **hay que
> editar el otro**. Ya pasó una vez que solo se actualizó el primero y la elección explícita de tema
> oscuro servía la paleta vieja.

### Las entradas no tienen color propio

Lo tuvieron: un par de colores por proyecto, claro y oscuro, derivados de su logo. Tras el rediseño de
octubre solo pintaban las viñetas de requisitos, y **una sola entrada tiene requisitos**, así que la
auditoría ponytail los quitó: diez pares verificados en dos temas, un bloque CSS y 40 comprobaciones
de contraste para tres puntos de 6 px. Las viñetas usan `fuerte`. El color de cada proyecto vive en
su emblema, que es donde la gente lo reconoce, y los de las campañas —ámbar de prevención del
suicidio, verde de salud mental— siguen intactos en sus logos.

### Contraste, verificado

`npm run contraste` (`scripts/auditar-contraste.mjs`) lee los valores **directamente** de
`globals.css` —no de una copia— y falla si alguna pareja baja del umbral.

**64 de 64 pasan:** 50 parejas de tokens del sistema (25 por tema) y 14 de colores con opacidad.

**Un color con alfa no es su token: es la mezcla con lo que tenga detrás.** El script mide esas
mezclas y rastrea `src/` en busca de utilidades con alfa (`opacity-*`, `/NN`). Una que no esté medida
ni declarada decorativa **con su motivo escrito** hace salir al script con código 1; se comprobó con
una prueba negativa.

| Pareja | Claro | Oscuro | Mínimo |
|---|---|---|---|
| Texto sobre papel | 17.74:1 | 16.08:1 | 4.5 |
| Texto secundario sobre papel alto | 7.44:1 | 7.73:1 | 4.5 |
| Enlaces sobre papel alto | 6.91:1 | 9.25:1 | 4.5 |
| Texto sobre la franja de marca | 8.62:1 | 11.04:1 | 4.5 |
| Texto sobre la banda de crisis | 9.47:1 | 8.12:1 | 4.5 |
| Etiqueta de recurso de crisis al 75 % | 6.01:1 | 5.09:1 | 4.5 |
| Anillo de foco sobre papel | 6.07:1 | 9.13:1 | 3.0 |
| **Borde de control sobre superficie** | **3.94:1** | **3.80:1** | **3.0** |

### Cómo se cambia un color sin romper nada

1. Editar el bloque `:root` de `src/app/(sitio)/globals.css`.
2. Editar **los dos** bloques oscuros.
3. Correr `npm run contraste`. Si algo baja del umbral, ajustar la luminancia **antes** de seguir.
4. Actualizar los tokens del frontmatter de este documento y `.impeccable/design.json`, que es el
   traspaso de tokens a herramientas de diseño; si cambia el porqué, también la prosa.

### Named Rules

**The Raw Brand Rule.** Ningún hex crudo del logo toca texto. Se conserva el matiz, se baja la luminancia.

**The One Job Brown Rule.** El marrón del tronco es la crisis y nada más. Si aparece en otro sitio, la banda deja de leerse aparte.

**The Help Is Orange Rule.** El naranja (`valiente`, `valiente-tenue`) marca la acción de ayuda y el foco. No se usa para decorar.

## Typography

**Display Font:** Atkinson Hyperlegible Next (con `system-ui, sans-serif`)
**Body Font:** la misma. Una sola familia, como Mind.

**Character:** Una grotesca humanista diseñada por el **Braille Institute** para lectores con baja
visión: las letras que se confunden (I, l, 1; O, 0) están separadas a propósito. La jerarquía la
hacen el peso (400 / 700 / 800) y el tamaño, no un segundo tipo.

La razón es de producto, no de gusto: el público incluye gente en crisis, con teléfonos viejos y sol
de frente. Sustituye a Fraunces + Inter, la pareja más reconocible de lo que genera la IA.

Se carga con `next/font/google`, subconjunto latino, `display: swap` y
**`adjustFontFallback: false`**: Next no trae las métricas de esta familia y avisaba en cada build.
Con `swap` el texto se ve desde el primer pintado; el salto al cambiar de fuente es de unos píxeles en
el titular. Ver «Decisiones abiertas».

### Hierarchy
- **Display** (800, `clamp(2.25rem, 1.5rem + 2.2vw, 3.25rem)`, 1.06): solo el titular del Inicio, a
  19ch. Tope en 3.25rem: a 88 px el titular ocupaba el 29 % de la pantalla, y a 64 px empujaba el
  botón principal fuera de la primera pantalla a 1440×900. Las frases cortas («Y comida.») no se parten.
- **Headline** (800, 2.25rem → 3rem → 3.5rem, 1.08): el `h1` de cada página interior y de cada ficha.
- **Title** (800, 1.875rem → 2.25rem): títulos de sección (`h2`).
- **Subtitle** (800, 1.25rem → 1.5rem): nombres del catálogo, títulos de tarjeta.
- **Lead** (400, 1.125rem → 1.25rem, 1.625): entrada bajo un titular, en `tinta-suave`, a ~46ch.
- **Body** (400, 19 px, 1.55): todo lo demás. Mind usa 21. Párrafos largos a 62ch.
- **Label** (700, 14 px): nombres bajo los emblemas, la banda de crisis, metadatos de la ficha.

Los titulares llevan `letter-spacing: -0.02em` y `text-wrap: balance`; el cuerpo, `text-wrap:
pretty`. Las cifras alineadas usan numerales tabulares (`.cifras-alineadas`).

### Named Rules

**The One Family Rule.** Una sola familia. Si hace falta más jerarquía, se sube el peso o el tamaño; no se añade un serif.

**The Legibility Is Safety Rule.** Nada de cuerpo por debajo de 19 px ni de texto secundario por debajo de 4.5:1. Este público lee en la calle.

## Layout

- **Contenedor:** `max-width: 72rem`, centrado, con canal de 16 px en móvil y 24 px desde `sm`.
- **Ritmo de sección:** 56 px arriba y abajo en móvil, 80 px desde `sm`. Las secciones alternan
  `papel` y `papel-alto` a sangre para separarse sin líneas.
- **Héroe:** campo `papel-alto` a sangre. A la izquierda, una tarjeta blanca de radio 16 px con el
  titular, la entrada y «Pedir una cita»; a la derecha (desde `lg`, columnas 0.95fr / 1.05fr), una
  retícula de **4×2 placas** con los ocho emblemas, enlazadas, alineada al borde superior de la
  tarjeta. En móvil la retícula sigue siendo de 4 columnas y los nombres pasan a ser solo para lector
  de pantalla.
- **¿Cómo te podemos ayudar?:** tres tarjetas tintadas en fila desde `md`, con «Estoy pasando por un
  momento difícil» **primero**.
- **Catálogo:** filas a dos columnas desde `md`, separadas por filetes, sin contenedor de tarjeta.
  Todas iguales: ninguna entrada se presenta como subordinada.
- **Ficha:** cuerpo + columna lateral de 20rem desde `lg`, con la columna pegajosa (`top: 7rem`).
- **Cabecera:** no es fija. La banda de crisis ya está arriba y una cabecera fija de dos pisos se come
  media pantalla de un teléfono pequeño.
- **Área táctil:** 44 px mínimo en cabecera y enlaces de acción, 48 px en botones.

## Elevation & Depth

Plano. La profundidad la hacen **suelos tintados** —`papel` blanco, `papel-alto` turquesa claro y
`superficie` encima— y la tarjeta blanca sobre el campo tintado del héroe. No hay sombras en
tarjetas, botones ni placas.

### Shadow Vocabulary
- **Menú desplegado** (`box-shadow` de Tailwind `shadow-xl` al 20 % de negro): el único elemento que
  flota de verdad sobre el contenido, el menú móvil.

### Named Rules

**The Flat By Default Rule.** Ninguna superficie lleva sombra en reposo. El estado se nota en el relleno o en un anillo de 2 px en tinta, nunca en una sombra que aparece ni en un salto.

## Shapes

Esquinas suaves, en cuatro pasos según el peso del elemento: 3 px el anillo de foco, 8 px botones y
controles, 12 px tarjetas y placas, 16 px la tarjeta del héroe y la cita. Los bordes son de 2 px en
tinta en botones y de 1 px en filetes y anillos. La tarjeta de ayuda lleva una pestaña de flecha en la
esquina inferior derecha, de 56 px, que recorta las dos esquinas de la tarjeta (radio 12 px arriba a
la izquierda y abajo a la derecha): es la única silueta propia del sistema.

Los iconos son **SVG de trazo único**: 2 px, extremos redondeados, `currentColor`, siempre
`aria-hidden`. Son cuatro (`Flecha`, `Telefono`, `Menu`, `Corazon`, en `src/components/iconos.tsx`)
y no justifican una dependencia más que tenga que heredar el próximo equipo.

## Components

### Buttons
Grandes, con borde, sin trucos. El estado se nota en el relleno, no en un desplazamiento.

- **Shape:** radio suave (8 px), borde de 2 px, alto mínimo 48 px, relleno 12 px × 24 px, texto en 700.
- **Primario:** relleno sólido `fuerte` con texto `papel`; al pasar, `marca`. **Es la única
  excepción al relleno tintado**, y es deliberada: es la acción principal de la página («Pedir una
  cita») y tiene que ser lo más fuerte de la pantalla. Uno por pantalla.
- **Secundario:** `papel` con borde de `tinta`; al pasar, `papel-alto`.
- **Sobre fuerte:** para fondos turquesa: `papel` con texto `fuerte`; al pasar, transparente con texto `papel`.
- **Enlace de acción:** «Ver los proyectos →»: texto `fuerte` en 700, subrayado de 2 px que engorda a
  3 px al pasar, con la flecha SVG.
- **Foco:** anillo de 3 px en `valiente`, separado 3 px. En todo el sitio, sin excepción.
- **Transición:** solo `color`/`background-color`, 150 ms.

### Cabecera
Dos pisos, con el patrón de Mind. Arriba, en blanco: el árbol Ψ (52–56 px de alto) con «Fundación
REFUVA» y «Resiliente · Fuerte · Valiente» debajo; a la derecha, **«Necesito ayuda» primero y «Donar»
después, del mismo tamaño** (44 px, borde de 2 px en tinta). «Necesito ayuda» va en `valiente-tenue`
y se llena de `valiente` al pasar; «Donar» en `fuerte-tenue` con un corazón, y se llena de `fuerte`.
El orden es una decisión del equipo: quien llega mal desde WhatsApp tiene que sentirse reconocido
antes de que se le pida dinero. En el teléfono los dos botones ocupan su propia fila, a lo ancho.

Abajo, la **franja de navegación** en `marca` con texto `sobre-marca` en 600 y subrayado de 2 px al
pasar. En móvil, un `<details>` nativo («Menú», cero JavaScript) despliega la misma lista sobre `marca`.

### Banda de crisis
Una línea, en todas las páginas, lo primero del documento: «¿Necesitas ayuda ahora?», **911** y
**147** como enlaces `tel:` y «Más recursos». Fondo `tronco`, texto `papel`, 14 px. No es fija: taparía
contenido en pantallas pequeñas (WCAG 2.4.11). El **bloque de crisis** completo (formulario de cita,
`/ayuda-en-crisis` y fichas de salud mental) usa el mismo `tronco`, radio 12 px y los números a 60 px.
Solo 911 y Línea 147 (WhatsApp 6694-2747); nada sin verificar.

### Tarjeta de ayuda
Tintada, sin sombra, radio 12 px, mínimo 192 px de alto. Título en 800, una línea en `tinta-suave` y
una pestaña de flecha sólida en la esquina (`valiente` para la crisis, `fuerte` para cita y ayudar).
Al pasar, un anillo de 2 px en `tinta`. La tarjeta entera es el enlace.

### Placa
El contenedor de un logo. De los once logos de la fundación, **solo el institucional tiene
transparencia**; los otros diez son PNG con el fondo horneado, distinto cada uno (blanco, `#cdcdcb`,
`#f6f6f6`, `#f5f5f5`…). **`Placa` usa como fondo el fondo medido del propio archivo**: el borde del PNG
desaparece contra ella y el rectángulo pasa a ser el objeto, con su radio de 12 px y su anillo de 1 px
en `borde-fuerte`. No se recortan: uno tiene un degradado de 81 colores en el borde, y son activos de
marca de un tercero. Tamaños cerrados (56, 72, 96, 112 px) y uno fluido, cuadrado, para la retícula
del héroe. Al pasar, la placa del héroe sube 4 px (200 ms).

### Marca (árbol Ψ)
La cabecera y el pie usan `public/marca/institucional-recortado.png`: el original deja un 53 % de
margen transparente y en una caja de 48 px el árbol medía 23 px. **Solo se quitó transparencia; el
dibujo es el mismo.** En el pie va sobre una ficha `papel` de radio 12 px, porque el árbol no se lee
sobre turquesa.

### Fila del catálogo
Emblema de 72 px, nombre en 800 (`subtitle`), resumen en una línea y, si existe, «En honor a
**Otilia**» con un solo tratamiento para todas las entradas. Flecha `fuerte` que se desplaza 4 px al
pasar. La fila entera es un solo destino de foco.

### Ficha de entrada
Las diez usan la misma plantilla: si una fuera más lucida, el sitio diría que importa más. Cabecera
en `papel-alto` con miga de pan, placa de 112 px y `h1`; la dedicatoria «En honor a…» con peso de
titular; requisitos con viñetas en `fuerte`; columna lateral con «Cómo participar» en
`superficie` y el botón primario. Las cifras van **en una línea de texto**, no como número gigante.

### Título de página
Suelo `papel-alto` con filete inferior, `h1` en 800 a 36→48→56 px y entrada en `tinta-suave`. **Sin
etiqueta encima.**

### Pie
Franja entera en `marca`: marca, cuatro columnas (descripción, proyectos uno por uno y campañas,
participar, ayuda inmediata con 911 y 147 a 30 px), legales y el selector de tema en una ficha clara.
Los proyectos van uno por uno porque un solo enlace «Proyectos» escondería justo lo que el sitio existe
para demostrar.

### Nota
Aviso honesto de lo que el prototipo todavía no hace: borde discontinuo, `papel-alto` o
`valiente-tenue`, texto de 14 px en `tinta-suave`.

## Do's and Don'ts

### Do:
- **Do** poner la banda de crisis primero en todas las páginas, en `tronco`, con solo 911 y Línea 147.
- **Do** ordenar «Necesito ayuda» antes que «Donar», del mismo tamaño.
- **Do** usar `marca` para franjas enteras y `fuerte` para enlaces y el botón primario.
- **Do** mostrar los ocho emblemas reales dentro de `Placa`, con el fondo medido de cada archivo.
- **Do** derivar todo conteo de `catalogo.ts`; nunca «ocho» escrito a mano.
- **Do** correr `npm run contraste` después de tocar cualquier color, y editar los dos bloques oscuros.
- **Do** declarar con su motivo, o medir, toda utilidad con alfa nueva.
- **Do** dibujar los iconos nuevos como SVG de trazo de 2 px con `currentColor`, `aria-hidden`.
- **Do** incrustar la procedencia en todo ráster nuevo bajo `public/marca` y verificar con
  `impeccable embed-prompt --scan public/marca` (hoy: 0 sin procedencia).

### Don't:
- **Don't** poner un hex crudo del logo en texto.
- **Don't** usar el marrón del tronco fuera de la crisis, ni rojo de alarma en la banda.
- **Don't** poner una etiqueta en mayúsculas («eyebrow») encima de un titular.
- **Don't** numerar secciones ni entradas (nada de 01–08).
- **Don't** montar una franja de cifras grandes en el héroe; las cifras van en prosa.
- **Don't** usar grano con `feTurbulence` ni texturas de ruido.
- **Don't** fingir fotos con cajas vacías ni rayas repetidas: un hueco de foto no se pinta hasta que
  la foto real exista.
- **Don't** usar glifos Unicode (→, ▾, ✎) como iconos.
- **Don't** añadir un segundo tipo de letra, ni volver al crema con serif de alto contraste.
- **Don't** poner sombra a tarjetas, botones o placas, ni desplazamientos de botón al pasar.
- **Don't** recortar ni recolorear los logos de los proyectos; solo se puede quitar transparencia al institucional.

## Decisiones abiertas

- **Fotografías reales (P-08).** La sección de evidencia de cada ficha volverá cuando existan; las tomas
  que pide cada entrada están en `docs/06-inventario-contenido.md` §3. Hasta entonces no se pinta
  ningún hueco.
- **Emblemas propios para Psicoeducativo y Psicoempresarial.** Hoy usan el árbol institucional porque
  su nombre lleva «REFUVA». Si la fundación entrega emblemas, entran por `catalogo.ts` sin tocar componentes.
- **`adjustFontFallback: false`.** Puesto porque Next no trae métricas de Atkinson Hyperlegible Next.
  Revisar el CLS en campo (objetivo ≤ 0.1 en p75) cuando haya datos reales.
