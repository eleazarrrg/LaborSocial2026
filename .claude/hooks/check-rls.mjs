#!/usr/bin/env node
// PostToolUse (Write|Edit): avisa si una migración crea una tabla sin activar RLS.
//
// El sistema guarda solicitudes de ayuda psicológica. Una tabla sin RLS en Supabase
// queda expuesta a través de la API pública con la clave anon. Es el error más caro
// que se puede cometer en este proyecto y el más fácil de cometer con prisa.
//
// Salida: exit 2 + stderr => el aviso vuelve al modelo para que lo corrija ahora,
// no en la revisión final.

import { readFileSync } from 'node:fs';

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
  process.exit(0);
}

const ruta = String(evento?.tool_input?.file_path ?? '').replace(/\\/g, '/');
if (!/\/supabase\/migrations\/.*\.sql$/i.test(ruta)) process.exit(0);

let sql = '';
try {
  sql = readFileSync(ruta, 'utf8');
} catch {
  process.exit(0);
}

const sinComentarios = sql
  .replace(/--[^\n]*/g, ' ')
  .replace(/\/\*[\s\S]*?\*\//g, ' ');

const creadas = [...sinComentarios.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?([\w".]+)/gi)]
  .map((m) => m[1].replace(/"/g, '').split('.').pop().toLowerCase());

if (creadas.length === 0) process.exit(0);

const conRls = new Set(
  [...sinComentarios.matchAll(/alter\s+table\s+([\w".]+)\s+enable\s+row\s+level\s+security/gi)].map(
    (m) => m[1].replace(/"/g, '').split('.').pop().toLowerCase(),
  ),
);

const desprotegidas = [...new Set(creadas)].filter((t) => !conRls.has(t));
if (desprotegidas.length === 0) process.exit(0);

process.stderr.write(
  [
    `RLS faltante en ${ruta}`,
    '',
    `Estas tablas se crean sin habilitar Row Level Security: ${desprotegidas.join(', ')}`,
    '',
    'En Supabase, una tabla sin RLS queda legible con la clave anon desde cualquier navegador.',
    'Este sistema guarda solicitudes de ayuda psicológica: eso sería una fuga de datos, no un bug de estilo.',
    '',
    'Agrega en la misma migración, por cada tabla:',
    '  alter table public.<tabla> enable row level security;',
    '  create policy "<nombre>" on public.<tabla> for <accion> to <rol> using (<condición>);',
    '',
    'Si la tabla es deliberadamente pública (por ejemplo, contenido ya publicado), habilita RLS igual',
    'y escribe una policy de lectura explícita. "Sin RLS" nunca es la respuesta correcta.',
  ].join('\n'),
);
process.exit(2);
