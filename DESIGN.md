# Sistema de diseño — Portal Fundación REFUVA

| | |
|---|---|
| **Versión** | 2.0 |
| **Fecha** | 2 de octubre de 2026 |
| **Estado** | Paleta **derivada de la marca real**, medida sobre los archivos de la fundación. |
| **Fuente de verdad** | [`src/app/globals.css`](./src/app/globals.css). Este documento explica; el CSS manda. |
| **Verificación** | `npm run contraste` — **84 de 84 en los dos temas** |

> **Qué cambió desde la v1.0.** La v1.0 admitía que su paleta «no son los colores de REFUVA»: era una
> propuesta derivada del significado del nombre, porque no había logo ni colores publicados en ninguna
> parte. El 1 de octubre la fundación entregó **once logos**. Esta versión sustituye la propuesta por
> la marca medida. El punto **O-08** queda cerrado.

---

## 1. La marca, medida sobre los archivos

El logo institucional es **un árbol cuyo tronco es la letra Ψ**, con un cerebro y un corazón entre las
ramas. Es la única imagen del paquete con canal alfa. Los colores no se eligieron: se contaron,
píxel a píxel, sobre el archivo.

| | Hex | Peso en el logo | Qué es |
|---|---|---|---|
| Marrón | `#903000` | 37 % | El tronco. Lo que sostiene |
| Naranja | `#f07800` | 15 % | Las hojas cálidas |
| Turquesa | `#007878` | 12 % | Las hojas frías |
| Rojo | `#d80000` | 11 % | El corazón |

**El marrón ancla y el turquesa acentúa.** Es el reparto que el propio logo propone: el color
dominante hace de voz y el complementario de contrapunto. El rojo del corazón **no entra como color
de interfaz** — vive dentro del logo y en el token de error, donde el rojo significa algo.

Esto, además, resuelve lo que la v1.0 llamaba el encargo doble. A Edwin lo describen como «fortaleza y
vulnerabilidad al mismo tiempo»: el marrón de tronco hace la fuerza, el papel cálido con grano hace la
vulnerabilidad. Un sistema que solo transmitiera fuerza fallaría la mitad del trabajo.

### Lo que la marca obligó a cambiar

Ninguno de los dos colores crudos pasa WCAG AA para texto:

| Color de marca | Sobre `papel-alto` | ¿AA? | Token derivado | Resultado |
|---|---|---|---|---|
| Turquesa `#007878` | **4.32:1** | ❌ | `valiente` `#006b6b` | 5.16:1 ✅ |
| Naranja `#f07800` | **2.59:1** | ❌ | `vivo` `#c05e00` | 3.96:1 ✅ (umbral 3:1, no es texto) |

**Se conserva el matiz, se baja la luminancia.** Un color corporativo ilegible no es fidelidad de
marca: es una barrera. El color crudo se queda donde pertenece —en los logos, en superficies
grandes— y la variante ajustada es la que toca texto.

Esto obligó a **dos tokens nuevos** que la v1.0 no tenía: `vivo` (el naranja, para acentos no
textuales) y `alerta` (el rojo, para errores de formulario).

### Lo que se descartó, y sigue descartado

| Descartado | Motivo |
|---|---|
| Azul institucional | Es el color por defecto de todo el sector salud. Lee como clínico y frío justo donde no debe. |
| Morado o violeta | Es el color de la salud mental en marketing genérico, y refuerza exactamente el malentendido que el sitio existe para desmentir. |
| Rojo de alarma en la banda de crisis | Un rojo permanente en todas las páginas se vuelve invisible por costumbre y alarma a quien no lo necesita — el sitio también lo abren patrocinadores. La contención en crisis funciona con calma, no con urgencia gritada. |
| Blanco puro de fondo | Deslumbra en la calle con el brillo al máximo y se siente a hospital. |

---

## 2. Tokens

Definidos en [`src/app/globals.css`](./src/app/globals.css) y exportados en
[`design-tokens.json`](./design-tokens.json). **Ningún componente conoce un color literal**: todos
usan estos nombres.

| Token | Claro | Oscuro | Para qué |
|---|---|---|---|
| `papel` | `#f8f4ed` | `#12100c` | Fondo de la página |
| `papel-alto` | `#efe7d9` | `#1c1915` | Bandas y secciones alternas |
| `superficie` | `#fffdf9` | `#1a1713` | Tarjetas, campos de formulario |
| `tinta` | `#16140f` | `#f3eee4` | Texto principal |
| `tinta-suave` | `#565049` | `#aba396` | Texto secundario |
| `fuerte` | `#903000` | `#ec9a6e` | Enlaces, botones, banda de crisis |
| `fuerte-tenue` | `#f6e3d8` | `#33190c` | Fondos de apoyo del marrón |
| `valiente` | `#006b6b` | `#5fc4c4` | Acentos, numerales, anillo de foco |
| `valiente-tenue` | `#dceceb` | `#0e2a2a` | Fondo de avisos |
| `vivo` | `#c05e00` | `#f0a060` | Acento no textual. **Nunca para texto normal** |
| `alerta` | `#b81c00` | `#ff9e8a` | Errores de formulario |
| `borde` | `#dfd6c6` | `#2d2822` | Separadores finos |
| `borde-fuerte` | `#c2b7a3` | `#4a4238` | Bordes visibles, anillo de las placas |
| `borde-control` | `#8e8471` | `#6e6558` | Bordes de campos — el único que debe pasar 3:1 |

El tema oscuro **no es el claro invertido**. Se diseñó aparte: el papel se vuelve tinta cálida —nunca
el gris azulado de una terminal— y el marrón y el turquesa suben de luminosidad lo justo para seguir
pasando contraste sin brillar.

> **Los dos bloques oscuros están duplicados a propósito**: uno dentro de
> `@media (prefers-color-scheme: dark)` negado con `:root:not([data-tema="claro"])`, y otro en
> `[data-tema="oscuro"]`. Al editar uno **hay que editar el otro**. Ya pasó una vez que solo se
> actualizó el primero, y la elección explícita de tema oscuro servía la paleta vieja.

---

## 3. Un color por entrada, y la regla que impide el collage

Cada proyecto y cada campaña tiene **su** color, derivado de su propio logo y verificado sobre los dos
papeles. Vive en `src/lib/catalogo.ts`, no en el CSS: es dato del catálogo, no del sistema.

**Cada entrada tiene dos colores, no uno.** Es lo mismo que se hace con los tokens del tema: mismo
matiz, luminancia distinta. Sin la variante oscura el numeral del índice daba **2.36:1** sobre el
papel oscuro — invisible. Era un fallo real del sitio, no un detalle del documento.

| Entrada | Claro | Sobre `papel` | Sobre `papel-alto` | Oscuro | Sobre papel osc. | Sobre alto osc. |
|---|---|---|---|---|---|---|
| Psicoeducativo · Psicoempresarial · Comida en la Calle | `#903000` | 7.34:1 | 6.56:1 | `#d5794b` | 6.03:1 | 5.56:1 |
| Rompiendo el Círculo | `#846000` | 5.24:1 | 4.68:1 | `#b18c29` | 6.02:1 | 5.55:1 |
| Historias que Sanan | `#9a3246` | 6.56:1 | 5.86:1 | `#d37688` | 6.08:1 | 5.60:1 |
| Grupo Un Solo Corazón | `#b81c00` | 5.98:1 | 5.34:1 | `#da7360` | 5.97:1 | 5.51:1 |
| Una Estrella Otiliana | `#806300` | 5.17:1 | 4.62:1 | `#ac8e28` | 6.02:1 | 5.55:1 |
| Angelitos de la Calle | `#006b6b` | 5.78:1 | 5.16:1 | `#27a5a5` | 6.34:1 | 5.85:1 |
| Háblame Panamá | `#8a6000` | 5.10:1 | 4.56:1 | `#b48a2a` | 5.98:1 | 5.51:1 |
| #EscúchamePanamá | `#006018` | 7.13:1 | 6.37:1 | `#27a747` | 6.07:1 | 5.59:1 |

Los dos más ajustados —Háblame Panamá y Una Estrella Otiliana sobre `papel-alto`— pasan por seis
centésimas. **`npm run contraste` lee las veinte parejas directamente de `catalogo.ts`**, así que un
retoque de color que las baje de 4.5:1, o una entrada nueva con un solo color, rompe el script antes
de llegar a producción.

**Cómo llega el color al pixel.** El componente pone las dos variantes como variables en línea sobre
un envoltorio con la clase `.tinte`, y `globals.css` resuelve cuál se pinta con los mismos tres
estados del tema. Sin JavaScript, sin fogonazo y sin que ningún componente conozca un hex:

```tsx
<div className="tinte" style={{ "--tinte-claro": e.colorAcento,
                                "--tinte-oscuro": e.colorAcentoOscuro }}>
  <span className="text-[var(--tinte)]">01</span>
```

**Los colores de las dos campañas no se tocan.** El ámbar es el lazo internacional de prevención del
suicidio y el verde el de salud mental. Son códigos que su público reconoce; cambiarlos por gusto
estético sería borrar información.

### La regla de las tres apariciones

> **El color de una entrada aparece exactamente tres veces en su página, y nunca toca el armazón.**
>
> 1. La regla de 3 px bajo su numeral en el índice.
> 2. El filo de 1 px en el borde superior de su ficha.
> 3. Las viñetas de sus requisitos de participación.
>
> Ni botones, ni fondos grandes, ni encabezado, ni pie. El armazón es siempre `fuerte` y `valiente`.

Diez colores compitiendo en bloques sólidos es un collage, y un collage dice «esto lo armó alguien
con prisa» — exactamente lo contrario de lo que el sitio tiene que demostrar.

**El índice no lleva logos, y es deliberado.** Nueve emblemas de paletas incompatibles apilados en una
columna *son* el collage. El índice es numerado y tipográfico; los logos aparecen uno por uno, en su
propia ficha, donde no compiten con nadie.

---

## 4. El componente `Placa`

De los once logos, **solo el institucional tiene transparencia**. Los otros diez son PNG con el fondo
horneado, y distinto cada uno: blanco, `#cdcdcb`, `#f6f6f6`, `#f5f5f5`…

La solución no es recortarlos. Uno tiene un degradado de 81 colores en el borde, y además son activos
de marca de un tercero: recortar a ojo el emblema de una fundación es deformarlo.

**`Placa` usa como color de fondo el fondo medido del propio archivo.** El borde del PNG desaparece
contra ella y el rectángulo deja de ser un accidente para pasar a ser el objeto: una placa con su
anillo de `borde-fuerte` y su radio. Es lo mismo que hacen las webs serias con las rejillas de logos
de aliados, y sería la decisión correcta aunque los logos llegaran con alfa.

Cuando lleguen los vectoriales —pendiente con Edwin—, `logo.fondo` queda sin valor y la placa cae al
color de superficie. Ni un componente cambia.

---

## 5. Contraste, verificado

`npm run contraste` lee los tokens **directamente de `globals.css`** —no de una copia— y calcula la
razón de WCAG 2.2 de cada pareja que el sitio usa de verdad. Si alguien cambia un color y baja del
umbral, el script falla.

**84 de 84 comprobaciones pasan en los dos temas:** 44 de los tokens del sistema, leídas de
`globals.css`, y 40 de los colores del catálogo, leídas de `catalogo.ts`. Ninguna sale de una copia.

| Pareja | Claro | Oscuro | Mínimo |
|---|---|---|---|
| Texto normal sobre papel | 16.79:1 | 16.43:1 | 4.5 |
| Texto secundario sobre papel | 7.26:1 | 7.61:1 | 4.5 |
| Enlaces y botones sobre papel | 7.34:1 | 8.52:1 | 4.5 |
| Acentos y numerales sobre papel | 5.78:1 | 9.21:1 | 4.5 |
| Texto normal sobre superficie | 18.11:1 | 15.44:1 | 4.5 |
| Enlaces sobre superficie | 7.92:1 | 8.01:1 | 4.5 |
| Enlaces sobre papel alto | 6.56:1 | 7.85:1 | 4.5 |
| Papel sobre la banda de crisis | 7.34:1 | 8.52:1 | 4.5 |
| Texto sobre fondo tenue de acento | 15.11:1 | 13.13:1 | 4.5 |
| Error de formulario sobre papel | 5.98:1 | 9.51:1 | 4.5 |
| Acento vivo sobre papel | 3.96:1 | 8.96:1 | 3.0 |
| **Borde de control sobre papel** | **3.37:1** | **3.32:1** | **3.0** |
| Anillo de foco sobre papel | 5.78:1 | 9.21:1 | 3.0 |

El más ajustado sigue siendo el borde de los campos de formulario. No es casualidad: el fondo del
campo y el de la página se diferencian en 1.03:1, así que **el borde es lo único que identifica el
control**, y WCAG 1.4.11 pide 3:1 para eso. Por eso `borde-control` existe como token aparte y es más
oscuro de lo que pediría el gusto.

La pareja que destapó el problema de la marca fue **turquesa sobre `papel-alto`**: con el valor crudo
se quedaba en 4.32:1. Se añadió al script precisamente porque faltaba, y con el token ajustado da
5.16:1.

---

## 6. Cambio de tema

Tres estados, no dos: **claro**, **oscuro** y **sistema**, que es el valor por defecto.

«Sistema» tiene que existir. Mucha gente ya tiene el teléfono en oscuro de noche, y forzarle un tema
claro a las dos de la mañana en la página de crisis es exactamente el momento en que peor sienta.

1. Sin elección del usuario no hay atributo en `<html>` y manda `prefers-color-scheme`.
2. Al elegir, se escribe `data-tema="claro"` u `"oscuro"` y se guarda en `localStorage`.
3. El bloque del sistema está negado con `:root:not([data-tema="claro"])`, así que elegir «claro» gana
   sobre un sistema en oscuro. El bloque `[data-tema="oscuro"]` va después y gana en la otra
   dirección. **La elección explícita gana siempre, en los dos sentidos.**
4. Un guion de una línea en el `<head>` aplica el atributo **antes del primer pintado**. Sin él, quien
   elige oscuro ve un fogonazo blanco en cada carga.
5. `color-scheme` acompaña al tema, para que los controles nativos y la barra de desplazamiento no se
   queden claros dentro de una página oscura.

**Sin cookie.** Solo `localStorage`. El sitio no pone ni una cookie, y así se evita el banner de
consentimiento.

El selector se lee con `useSyncExternalStore` en vez de con un efecto: es el patrón correcto para
estado externo con renderizado concurrente, y sale gratis la sincronización entre pestañas.

---

## 7. Tipografía

| | Familia | Uso |
|---|---|---|
| Display | **Fraunces**, ejes `SOFT 28`, `WONK 1`, `opsz 100` | Titulares, numerales, cifras |
| Cuerpo | **Inter** | Todo lo demás, a 17 px |

No es «poner dos fuentes de Google». Fraunces con `WONK` activado tiene terminaciones raras y curvas
blandas — cálida, con carácter, algo torcida a propósito. La tensión entre ese serif con personalidad
y el grotesco neutro de Inter es lo que sostiene la jerarquía **sin recurrir al color**, que importa
porque aquí el color es escaso y semántico.

Cuerpo a **17 px**, no 16. El público incluye a gente mayor y a gente leyendo en la calle con el sol
de frente.

Escala del display: `clamp(2.5rem, 1.2rem + 5.2vw, 5.5rem)`. Crece con el ancho, nunca por debajo de
lo legible ni por encima de lo cómodo.

---

## 8. Textura y profundidad

**Grano de papel.** Un SVG de ~200 bytes en línea con `feTurbulence`, a 3.8 % de opacidad en claro y
5.5 % en oscuro. Cero peticiones de red, que importa cuando el público navega con datos caros. Es lo
que evita que el fondo se lea como una pantalla en blanco y lo acerca a un documento impreso.

**Profundidad sin sombras genéricas.** La jerarquía se hace con tres planos de fondo —`papel`,
`papel-alto`, `superficie`— y con bordes, no con `box-shadow` en todo. Las sombras se reservan al menú
desplegable y al desplazamiento de un botón al pasar el ratón.

---

## 9. Lo que se evitó a propósito

Revisión contra los patrones prohibidos de
[`.claude/rules/web/design-quality.md`](./.claude/rules/web/design-quality.md):

| Patrón prohibido | Qué se hizo en su lugar |
|---|---|
| Cuadrícula de tarjetas uniforme | El catálogo es un **índice numerado**. Además de tener carácter, evita el problema de la rejilla: con ocho entradas cualquier cuadrícula de tres columnas deja huecos impares que sugieren que alguna sobra, y el número va a crecer. |
| Rejilla de logos | Los emblemas no se apilan: cada uno aparece solo, en su ficha, dentro de su `Placa`. Ver §3. |
| Hero centrado con degradado y CTA genérico | Titular alineado a la izquierda, a `19ch`, con las cuatro acciones en fila. Cero degradados en todo el sitio. |
| Radios, espaciados y sombras uniformes | El ritmo vertical cambia por sección: `py-14` en las densas, `py-24` en las que respiran. Los radios van de `rounded-md` a `rounded-2xl` según el peso del elemento. |
| Gris sobre blanco con un acento decorativo | Tres planos de papel cálido, y el color **solo** cuando significa algo. |
| Fuentes por defecto sin motivo | Fraunces con sus ejes variables puestos a trabajar. |
| Modo oscuro a medias | Los dos temas están diseñados y los dos están auditados. |
| Animación gratuita | Solo transiciones de estado, todas por debajo de 200 ms, todas anuladas bajo `prefers-reduced-motion`. |

---

## 10. Cómo se cambia un color sin romper nada

1. Editar el bloque `:root` de `src/app/globals.css`.
2. Editar **los dos** bloques oscuros. Son dos a propósito; ver el aviso del §2.
3. Correr `npm run contraste`. Si algo baja del umbral, ajustar la luminancia **antes** de seguir —no
   después, y no «lo vemos luego».
4. Si el color nuevo es de una entrada del catálogo, va en `src/lib/catalogo.ts`, no en el CSS, y hay
   que añadir su pareja al script de contraste.
5. Correr `npm run tokens`. **`design-tokens.json` no se edita a mano**: se genera de
   `globals.css` y `catalogo.ts`. Ya se quedó obsoleto una vez por editarlo aparte.
6. Actualizar las tablas del §2, §3 y §5 de este documento — eso sí es a mano, porque lleva el
   porqué, y el porqué no se deriva de un hex.

La regla cuando un color de marca no pasa contraste —pasa a menudo con marcas pensadas para
impresión— es la del §1: **el color de marca se conserva en logos y superficies grandes, y se ajusta
la variante que toca texto.**
