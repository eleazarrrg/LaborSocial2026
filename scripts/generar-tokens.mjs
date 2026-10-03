#!/usr/bin/env node
/**
 * Genera design-tokens.json desde los archivos reales.
 *
 * Existe porque design-tokens.json ya se quedó obsoleto una vez: tenía la
 * paleta de la v1.0 mucho después de que el sitio usara la marca real. Una
 * copia a mano de catorce colores diverge; una generada, no.
 *
 * Lee los colores de donde viven de verdad:
 *   - tokens del sistema   → src/app/globals.css
 *   - colores del catálogo → src/lib/catalogo.ts
 *
 * Lo que NO se genera son las notas de criterio —tipografía, movimiento, por
 * qué el área táctil es de 44 px— porque eso es decisión escrita, no dato
 * derivable. Vive en PERSISTENTE, abajo, y se edita aquí.
 *
 *   npm run tokens
 */

import { readFileSync, writeFileSync } from "node:fs";

const raiz = (ruta) => new URL(ruta, import.meta.url);

const CSS = readFileSync(raiz("../src/app/globals.css"), "utf8");
const CATALOGO = readFileSync(raiz("../src/lib/catalogo.ts"), "utf8");

/** Extrae los tokens de color de un selector concreto, en orden de aparición. */
function tokens(selector) {
  const i = CSS.indexOf(selector);
  if (i === -1) throw new Error(`No encuentro el selector ${selector}`);
  const bloque = CSS.slice(i, CSS.indexOf("}", i));
  const mapa = {};
  for (const m of bloque.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/gi)) {
    mapa[m[1]] = m[2];
  }
  if (Object.keys(mapa).length === 0) {
    throw new Error(`El selector ${selector} no tiene ningún token de color`);
  }
  return mapa;
}

function catalogo() {
  const re =
    /codigo: "([a-z0-9-]+)",[\s\S]*?colorAcento: "(#[0-9a-f]{6})",[\s\S]*?colorAcentoOscuro: "(#[0-9a-f]{6})",/g;
  const mapa = {};
  for (const m of CATALOGO.matchAll(re)) {
    mapa[m[1]] = { claro: m[2], oscuro: m[3] };
  }
  if (Object.keys(mapa).length === 0) {
    throw new Error("No encuentro ningún colorAcento en catalogo.ts");
  }
  return mapa;
}

/** Lo que no se deriva de ningún archivo: criterio escrito. */
const PERSISTENTE = {
  tipografia: {
    display: {
      familia: "Fraunces",
      ejes: { SOFT: 28, WONK: 1, opsz: 100 },
      escala: "clamp(2.5rem, 1.2rem + 5.2vw, 5.5rem)",
    },
    cuerpo: {
      familia: "Inter",
      tamano: "17px",
      comentario:
        "17 px y no 16: el público incluye a gente mayor y a gente leyendo en la calle con el sol de frente.",
    },
  },
  espacio: {
    contenedor: "72rem",
    areaTactilMinima: "44px",
    comentario: "44px supera los 24×24 que exige WCAG 2.2 (2.5.8).",
  },
  textura: {
    grano: {
      claro: 0.038,
      oscuro: 0.055,
      tecnica: "SVG feTurbulence en línea, ~200 bytes, cero peticiones de red",
    },
  },
  movimiento: {
    duracion: "150ms",
    duracionLarga: "200ms",
    regla: "Solo transiciones de estado. Todo se anula bajo prefers-reduced-motion.",
  },
  tema: {
    estados: ["sistema", "claro", "oscuro"],
    porDefecto: "sistema",
    almacenamiento: "localStorage, llave refuva-tema",
    atributo: "data-tema en <html>",
    sinCookies: true,
    comentario:
      "La elección explícita gana sobre prefers-color-scheme en ambas direcciones. Un guion en el <head> evita el parpadeo antes del primer pintado.",
  },
};

const marca = {
  comentario:
    "Hex crudo del logo institucional, medido sobre el archivo. NINGUNO pasa 4.5:1 para texto: se usan solo en logos y superficies grandes.",
  marron: "#903000",
  naranja: "#f07800",
  turquesa: "#007878",
  rojo: "#d80000",
};

const salida = {
  $comentario:
    "GENERADO POR scripts/generar-tokens.mjs — no editar a mano. Los colores salen de src/app/globals.css y src/lib/catalogo.ts; si quieres cambiarlos, edítalos ahí y corre `npm run tokens`. Ver DESIGN.md.",
  meta: {
    proyecto: "Portal Fundación REFUVA",
    version: "2.0",
    // CLAUDE.md §6: las fechas del proyecto son de America/Panama, no UTC.
    generado: new Intl.DateTimeFormat("en-CA", { timeZone: "America/Panama" }).format(new Date()),
    estado: "derivado de la marca real",
    verificacion: "npm run contraste",
  },
  marca,
  color: {
    claro: tokens(":root {"),
    oscuro: tokens(':root[data-tema="oscuro"] {'),
    catalogo: catalogo(),
  },
  ...PERSISTENTE,
};

writeFileSync(raiz("../design-tokens.json"), JSON.stringify(salida, null, 2) + "\n", "utf8");

const n = Object.keys(salida.color.claro).length;
const m = Object.keys(salida.color.catalogo).length;
console.log(`design-tokens.json: ${n} tokens por tema + ${m} entradas del catálogo.`);
