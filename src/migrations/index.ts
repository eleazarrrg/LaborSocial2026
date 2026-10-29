import * as migration_20261009_004742_inicial from './20261009_004742_inicial';
import * as migration_20261022_012359_bitacora_inalterable from './20261022_012359_bitacora_inalterable';
import * as migration_20261022_014329_contenido_cms from './20261022_014329_contenido_cms';
import * as migration_20261022_022909_fondos_con_foto from './20261022_022909_fondos_con_foto';
import * as migration_20261022_025936_fotos_provisionales_y_fondos from './20261022_025936_fotos_provisionales_y_fondos';
import * as migration_20261028_033409_objectkey_medios from './20261028_033409_objectkey_medios';
import * as migration_20261028_033635_bitacora_search_path from './20261028_033635_bitacora_search_path';
import * as migration_20261029_023836_preguntas_frecuentes from './20261029_023836_preguntas_frecuentes';

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
    name: '20261022_014329_contenido_cms',
  },
  {
    up: migration_20261022_022909_fondos_con_foto.up,
    down: migration_20261022_022909_fondos_con_foto.down,
    name: '20261022_022909_fondos_con_foto',
  },
  {
    up: migration_20261022_025936_fotos_provisionales_y_fondos.up,
    down: migration_20261022_025936_fotos_provisionales_y_fondos.down,
    name: '20261022_025936_fotos_provisionales_y_fondos',
  },
  {
    up: migration_20261028_033409_objectkey_medios.up,
    down: migration_20261028_033409_objectkey_medios.down,
    name: '20261028_033409_objectkey_medios',
  },
  {
    up: migration_20261028_033635_bitacora_search_path.up,
    down: migration_20261028_033635_bitacora_search_path.down,
    name: '20261028_033635_bitacora_search_path',
  },
  {
    up: migration_20261029_023836_preguntas_frecuentes.up,
    down: migration_20261029_023836_preguntas_frecuentes.down,
    name: '20261029_023836_preguntas_frecuentes'
  },
];
