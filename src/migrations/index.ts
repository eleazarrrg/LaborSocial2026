import * as migration_20261009_004742_inicial from './20261009_004742_inicial';

export const migrations = [
  {
    up: migration_20261009_004742_inicial.up,
    down: migration_20261009_004742_inicial.down,
    name: '20261009_004742_inicial'
  },
];
