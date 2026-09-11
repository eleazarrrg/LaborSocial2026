#!/usr/bin/env node
// PreToolUse (Write|Edit|NotebookEdit): protege el material original del proyecto.
//
// `docs/00-fuentes/` es la evidencia de lo que Edwin dijo y de lo que se entregó.
// Si se edita, dejamos de poder rastrear un requisito hasta su origen. El único
// archivo escribible ahí es `hechos-verificados.md`, que es interpretación nuestra.
//
// Salida: exit 2 + mensaje en stderr => Claude Code bloquea la herramienta y le
// entrega el mensaje al modelo para que corrija el rumbo.

import { readFileSync } from 'node:fs';

/** @returns {string} */
function leerStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

const crudo = leerStdin();
if (!crudo.trim()) process.exit(0);

let evento;
try {
  evento = JSON.parse(crudo);
} catch {
  // Si el payload no es JSON no es asunto nuestro: no bloqueamos por un fallo propio.
  process.exit(0);
}

const ruta = evento?.tool_input?.file_path ?? evento?.tool_input?.notebook_path ?? '';
if (!ruta) process.exit(0);

const normalizada = String(ruta).replace(/\\/g, '/');

const enFuentes = normalizada.includes('/docs/00-fuentes/');

// Dos excepciones, y ninguna es material original:
//   hechos-verificados.md  es interpretación nuestra y se corrige.
//   README.md              explica la carpeta; no es una fuente.
const esEscribible =
  normalizada.endsWith('/docs/00-fuentes/hechos-verificados.md') ||
  normalizada.endsWith('/docs/00-fuentes/README.md');

if (enFuentes && !esEscribible) {
  process.stderr.write(
    [
      `BLOQUEADO: ${normalizada}`,
      '',
      'docs/00-fuentes/ guarda el material original sin tocar — la transcripción de la reunión,',
      'los dos REFUVA v1.0 y los binarios. Es la evidencia que permite rastrear cada requisito',
      'hasta su origen; si se edita, esa cadena se rompe.',
      '',
      'Qué hacer en su lugar:',
      '  - ¿Corregir un dato mal transcrito? Va en docs/00-fuentes/hechos-verificados.md.',
      '  - ¿Ampliar o mejorar un requisito? Va en docs/01-srs.md o docs/02-historias-usuario.md.',
      '  - ¿Material nuevo que envió Edwin? Agrégalo como archivo nuevo, no sobreescribas uno existente.',
    ].join('\n'),
  );
  process.exit(2);
}

process.exit(0);
