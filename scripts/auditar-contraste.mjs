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

import { readFileSync } from "node:fs";

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

console.log(`
${RAYA}`);
if (fallos === 0) {
  console.log(
    `  Las ${TEMAS.length * PAREJAS.length + parejasCatalogo} comprobaciones pasan en los dos temas.`,
  );
} else {
  console.log(`  ${fallos} comprobaciones POR DEBAJO del umbral.`);
}
process.exit(fallos === 0 ? 0 : 1);
