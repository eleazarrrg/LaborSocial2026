import * as migration_20261009_004742_inicial from './20261009_004742_inicial';
import * as migration_20261022_012359_bitacora_inalterable from './20261022_012359_bitacora_inalterable';
import * as migration_20261022_014329_contenido_cms from './20261022_014329_contenido_cms';

export const migrations = [
  {
    up: migration_20261009_004742_inicial.up,
    down: migration_20261009_004742_inicial.down,
    name: '20261009_004742_inicial',
  },
  {
    up: migration_20261022_012359_bitacora_inalterable.up,
    down: migration_20261022_012359_bitacora_inalterable.down,
    name: '20261022_012359_bitacora_inalterable',
  },
  {
    up: migration_20261022_014329_contenido_cms.up,
    down: migration_20261022_014329_contenido_cms.down,
    name: '20261022_014329_contenido_cms'
  },
];
