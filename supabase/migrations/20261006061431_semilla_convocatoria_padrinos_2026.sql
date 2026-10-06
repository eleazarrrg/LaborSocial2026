-- Qué cambia: abre la convocatoria de padrinos y madrinas de Una Estrella Otiliana, Navidad 2026.
-- Por qué: el formulario de padrinos solo acepta inscripciones con una convocatoria abierta. Las
--          fechas las decidió el equipo el 5-10-2026; Edwin puede corregirlas (docs/09).
-- Responde a: RF-07, docs/07 §7.1 (los datos reales van en migración numerada, no en seed.sql).

-- Cierra al terminar el 15 de diciembre en Panamá (UTC-5, sin horario de verano).
insert into public.convocatorias
  (proyecto_slug, tipo, titulo, descripcion, texto_si_cerrada, abre_en, cierra_en)
values (
  'una-estrella-otiliana',
  'padrinos',
  'Padrinos y madrinas · Navidad 2026',
  'Apadrinas a un niño o una niña para la fiesta navideña y le haces el regalo conforme a lo que te salga del corazón. La fundación no fija ningún monto.',
  'La convocatoria de padrinos y madrinas no está abierta en este momento. Escríbenos y te avisamos cuando abra.',
  '2026-10-06 00:00-05',
  '2026-12-16 00:00-05'
)
on conflict do nothing;
