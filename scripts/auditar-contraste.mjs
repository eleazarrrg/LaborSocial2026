#!/usr/bin/env node
/**
 * Auditoría de contraste WCAG 2.2 de la paleta.
 *
 * Lee los tokens directamente de src/app/globals.css — no de una copia — para
 * que sea imposible que la tabla de DESIGN.md diga una cosa y el sitio haga
 * otra. Si alguien cambia un color y baja del umbral, esto falla.
 *
 *   node scripts/auditar-contraste.mjs
 *
 * Umbrales aplicados (WCAG 2.2 nivel AA):
 *   4.5:1  texto normal            (1.4.3)
 *   3.0:1  texto grande y bordes   (1.4.3 y 1.4.11)
 */

import { globSync, readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const CATALOGO = readFileSync(new URL("../src/lib/catalogo.ts", import.meta.url), "utf8");

/** Extrae el bloque de tokens de un selector concreto. */
function tokens(selector) {
  const i = CSS.indexOf(selector);
  if (i === -1) throw new Error(`No encuentro el selector ${selector}`);
  const bloque = CSS.slice(i, CSS.indexOf("}", i));
  const mapa = {};
  for (const m of bloque.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/gi)) {
    mapa[m[1]] = m[2];
  }
  return mapa;
}

/**
 * Los colores propios de cada entrada salen de catalogo.ts, no de globals.css:
 * son dato de la entrada, no del sistema. Se leen igual -- del archivo real,
 * nunca de una copia para que no puedan divergir de lo que pinta el sitio.
 */
function coloresDelCatalogo() {
  const fuera = [];
  const re =
    /codigo: "([a-z0-9-]+)",[\s\S]*?colorAcento: "(#[0-9a-f]{6})",[\s\S]*?colorAcentoOscuro: "(#[0-9a-f]{6})",/g;
  for (const m of CATALOGO.matchAll(re)) {
    fuera.push({ codigo: m[1], claro: m[2], oscuro: m[3] });
  }
  if (fuera.length === 0) {
    throw new Error("No encuentro ningun colorAcento en catalogo.ts");
  }
  return fuera;
}

function luminancia(hex) {
  const canal = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = canal(parseInt(hex.slice(1, 3), 16));
  const g = canal(parseInt(hex.slice(3, 5), 16));
  const b = canal(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function razon(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Cada pareja que el sitio usa de verdad, con su umbral. */
const PAREJAS = [
  ["Texto normal sobre el papel", "tinta", "papel", 4.5],
  ["Texto secundario sobre el papel", "tinta-suave", "papel", 4.5],
  ["Enlaces y botones sobre el papel", "fuerte", "papel", 4.5],
  ["Acentos y numerales sobre el papel", "valiente", "papel", 4.5],
  ["Texto normal sobre superficie", "tinta", "superficie", 4.5],
  ["Texto secundario sobre superficie", "tinta-suave", "superficie", 4.5],
  ["Enlaces sobre superficie", "fuerte", "superficie", 4.5],
  ["Texto normal sobre papel alto", "tinta", "papel-alto", 4.5],
  ["Texto secundario sobre papel alto", "tinta-suave", "papel-alto", 4.5],
  ["Enlaces sobre papel alto", "fuerte", "papel-alto", 4.5],
  ["Papel sobre la banda de crisis", "papel", "fuerte", 4.5],
  ["Texto sobre el fondo tenue de acento", "tinta", "valiente-tenue", 4.5],
  ["Texto sobre el fondo tenue fuerte", "tinta", "fuerte-tenue", 4.5],
  ["Enlaces sobre el fondo tenue fuerte", "fuerte", "fuerte-tenue", 4.5],
  ["Borde de control sobre el papel", "borde-control", "papel", 3],
  ["Borde de control sobre superficie", "borde-control", "superficie", 3],
  ["Anillo de foco sobre el papel", "valiente", "papel", 3],
  // Parejas que la marca real obligó a añadir.
  ["Acento vivo sobre el papel", "vivo", "papel", 3],
  ["Acento vivo sobre superficie", "vivo", "superficie", 3],
  ["Error de formulario sobre el papel", "alerta", "papel", 4.5],
  ["Error de formulario sobre superficie", "alerta", "superficie", 4.5],
  // La que faltaba, y es la que delató al turquesa crudo.
  ["Enlaces sobre papel alto", "valiente", "papel-alto", 4.5],
];

const TEMAS = [
  ["CLARO", tokens(":root {")],
  ["OSCURO", tokens(':root[data-tema="oscuro"] {')],
];

let fallos = 0;
for (const [nombre, paleta] of TEMAS) {
  console.log(`\n${"═".repeat(78)}\n  TEMA ${nombre}\n${"═".repeat(78)}`);
  for (const [etiqueta, frente, fondo, minimo] of PAREJAS) {
    const a = paleta[frente];
    const b = paleta[fondo];
    if (!a || !b) {
      console.log(`  ??  ${etiqueta} — token ausente (${frente} / ${fondo})`);
      fallos++;
      continue;
    }
    const r = razon(a, b);
    const pasa = r >= minimo;
    if (!pasa) fallos++;
    console.log(
      `  ${pasa ? "ok" : "NO"}  ${r.toFixed(2).padStart(6)}:1  (min ${minimo})  ` +
        `${etiqueta}  ${a} sobre ${b}`,
    );
  }
}

console.log(`\n${"═".repeat(78)}`);
/**
 * Cada entrada pinta su color sobre los dos papeles de cada tema. El valor
 * claro sobre el papel oscuro da 2.36:1 -- por eso existe la variante oscura, y
 * por eso esto se comprueba: una entrada nueva con un solo color falla aqui, no
 * en produccion.
 */
const CLARO = tokens(":root {");
const OSCURO = tokens(':root[data-tema="oscuro"] {');
const RAYA = "═".repeat(78);

console.log(`
${RAYA}
  COLORES DEL CATÁLOGO
${RAYA}`);
let parejasCatalogo = 0;
for (const { codigo, claro, oscuro } of coloresDelCatalogo()) {
  for (const [etiqueta, color, fondo] of [
    ["claro  sobre papel", claro, CLARO["papel"]],
    ["claro  sobre papel alto", claro, CLARO["papel-alto"]],
    ["oscuro sobre papel", oscuro, OSCURO["papel"]],
    ["oscuro sobre papel alto", oscuro, OSCURO["papel-alto"]],
  ]) {
    parejasCatalogo++;
    const r = razon(color, fondo);
    const pasa = r >= 4.5;
    if (!pasa) fallos++;
    console.log(
      `  ${pasa ? "ok" : "NO"}  ${r.toFixed(2).padStart(6)}:1  (min 4.5)  ` +
        `${codigo.padEnd(22)} ${etiqueta}  ${color} sobre ${fondo}`,
    );
  }
}

/**
 * OPACIDADES — el punto ciego que tenía esta auditoría.
 *
 * Comprobaba tokens sólidos y nada más, así que todo lo que el sitio pinta con
 * alfa (`opacity-70`, `ring-papel/35`, `placeholder:text-tinta-suave/60`) le
 * era invisible. Tres de esos valores NO pasaban AA, y uno estaba en el bloque
 * de crisis: la etiqueta «LÍNEA 147 (MIDES)» daba 4.39:1.
 *
 * Un color con alfa no es el token: es la mezcla con lo que tiene detrás. Aquí
 * se declara esa mezcla y se comprueba como cualquier otra pareja.
 */
function mezcla(frente, fondo, alfa) {
  const canal = (i) =>
    Math.round(
      parseInt(frente.slice(i, i + 2), 16) * alfa +
        parseInt(fondo.slice(i, i + 2), 16) * (1 - alfa),
    );
  const hex = (v) => v.toString(16).padStart(2, "0");
  return "#" + hex(canal(1)) + hex(canal(3)) + hex(canal(5));
}

/** [etiqueta, token de frente, token de fondo, alfa, umbral] */
const OPACIDADES = [
  ["Texto de la banda de crisis", "papel", "fuerte", 0.9, 4.5],
  ["Entrada del bloque de crisis", "papel", "fuerte", 0.85, 4.5],
  ["Etiqueta del recurso de crisis", "papel", "fuerte", 0.75, 4.5],
  ["Disponibilidad 24/7 del recurso", "papel", "fuerte", 0.75, 4.5],
  ["Fecha de verificación en el pie", "papel", "fuerte", 0.75, 4.5],
  ["Etiquetas de la caja del pie", "papel", "fuerte", 0.8, 4.5],
  ["Texto del cierre del Inicio", "papel", "fuerte", 0.85, 4.5],
  ["Anillo del botón sobre el cierre", "papel", "fuerte", 0.6, 3],
  ["Marcador de posición en formularios", "tinta-suave", "superficie", 0.8, 4.5],
];

/**
 * Valores con alfa que SÍ son decorativos y por eso no se comprueban. Si
 * aparece uno nuevo que no esté aquí ni arriba, esto falla: obliga a decidir
 * si es decorativo o si hay que medirlo.
 */
const DECORATIVOS = new Map([
  ["opacity-100", "estado hover, vuelve a opacidad plena"],
  ["opacity-50", "el separador · entre dos teléfonos"],
  ["opacity-60", "botón deshabilitado mientras se envía"],
  ["decoration-papel/30", "subrayado del número; el número va a contraste pleno"],
  ["text-valiente/25", "la comilla gigante, aria-hidden"],
  ["ring-valiente/30", "halo del campo con error; el borde sólido es el límite"],
  ["border-valiente/40", "borde del resumen de errores; lo delimita su relleno"],
  ["border-valiente/35", "borde de la nota; lo delimita su relleno"],
  ["border-fuerte/30", "borde de la tarjeta destacada; lo delimita su relleno"],
  ["bg-papel/92", "fondo del encabezado fijo, con desenfoque detrás"],
  ["bg-papel/15", "rejilla de 1px entre los recursos de crisis"],
  ["bg-papel/10", "relleno del botón al pasar el ratón"],
]);

/** Alfas ya cubiertas por OPACIDADES, en el formato que usa Tailwind. */
const MEDIDAS = new Set([
  "opacity-90", "opacity-85", "opacity-80", "opacity-75",
  "ring-papel/60", "text-tinta-suave/80",
]);

console.log(`
${RAYA}
  COLORES CON OPACIDAD
${RAYA}`);
for (const [etiqueta, frente, fondo, alfa, minimo] of OPACIDADES) {
  for (const [tema, paleta] of TEMAS) {
    const c = mezcla(paleta[frente], paleta[fondo], alfa);
    const r = razon(c, paleta[fondo]);
    const pasa = r >= minimo;
    if (!pasa) fallos++;
    console.log(
      `  ${pasa ? "ok" : "NO"}  ${r.toFixed(2).padStart(6)}:1  (min ${minimo})  ` +
        `${tema.padEnd(6)} ${etiqueta} al ${Math.round(alfa * 100)}%  ${c} sobre ${paleta[fondo]}`,
    );
  }
}

const FUENTE = globSync("src/**/*.tsx", { cwd: new URL("..", import.meta.url) })
  .map((f) => readFileSync(new URL("../" + f, import.meta.url), "utf8"))
  .join("\n");

const sinDeclarar = new Set();
for (const re of [
  new RegExp("opacity-([0-9]+)", "g"),
  new RegExp("(?:text|ring|border|bg|decoration)-[a-z-]+/([0-9]+)", "g"),
]) {
  for (const m of FUENTE.matchAll(re)) {
    const uso = m[0].replace(/^(?:hover|disabled|focus|placeholder):/, "");
    if (!MEDIDAS.has(uso) && !DECORATIVOS.has(uso)) sinDeclarar.add(uso);
  }
}
if (sinDeclarar.size > 0) {
  fallos += sinDeclarar.size;
  console.log("");
  for (const uso of [...sinDeclarar].sort()) {
    console.log(
      `  NO  ${uso} aparece en src/ y no está declarado. Decide si es decorativo` +
        ` (añádelo a DECORATIVOS con su motivo) o mídelo (añádelo a OPACIDADES).`,
    );
  }
}

console.log(`
${RAYA}`);
if (fallos === 0) {
  console.log(
    `  Las ${TEMAS.length * (PAREJAS.length + OPACIDADES.length) + parejasCatalogo} comprobaciones pasan en los dos temas.`,
  );
} else {
  console.log(`  ${fallos} comprobaciones POR DEBAJO del umbral.`);
}
process.exit(fallos === 0 ? 0 : 1);
