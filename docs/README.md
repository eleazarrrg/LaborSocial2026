# Documentación — Portal Fundación REFUVA

Todo lo que sostiene el proyecto: de dónde salió cada requisito, qué se decidió, qué falta y quién
lo debe. Empieza por aquí.

## Cómo leerla

Si tienes **cinco minutos**, lee `00-fuentes/hechos-verificados.md`. Es lo que Edwin dijo, destilado.

Si vas a **construir algo**, lee `../CLAUDE.md` y luego `01-srs.md`.

Si vas a **hablar con Edwin**, lee `06-inventario-contenido.md` y `05-stack-y-presupuesto.md`.

## El estado de cada documento

| # | Documento | Qué responde | Estado |
|---|---|---|---|
| — | [`00-fuentes/`](./00-fuentes/) | El material original sin tocar. Protegido por un hook: no se edita. | ✅ |
| — | [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md) | **Qué dijo Edwin.** Fuente de verdad de los requisitos. | ✅ |
| 01 | [`01-srs.md`](./01-srs.md) | Qué hace el sistema. Alcance, módulos, RF-01 a RF-15. | ✅ |
| 02 | [`02-historias-usuario.md`](./02-historias-usuario.md) | Qué necesita cada tipo de persona, con criterios verificables. | ✅ |
| 03 | [`03-arquitectura-informacion.md`](./03-arquitectura-informacion.md) | Cómo se organiza el sitio: mapa, plantillas, navegación. | ✅ |
| 04 | [`04-requisitos-no-funcionales.md`](./04-requisitos-no-funcionales.md) | Seguridad, privacidad, accesibilidad, rendimiento, contenido sensible. | ✅ |
| 05 | [`05-stack-y-presupuesto.md`](./05-stack-y-presupuesto.md) | Con qué se construye y **cuánto paga Edwin al mes**. | ✅ |
| 06 | [`06-inventario-contenido.md`](./06-inventario-contenido.md) | Qué le falta entregar a Edwin, con responsable y estado. | ✅ |
| 07 | [`07-modelo-datos.md`](./07-modelo-datos.md) | Tablas, RLS, retención. | ✅ |
| 08 | [`08-plan-de-trabajo.md`](./08-plan-de-trabajo.md) | Fases, hitos y las fechas que no se mueven. | ✅ |
| 09 | [`09-operacion-y-traspaso.md`](./09-operacion-y-traspaso.md) | Qué pasa cuando nos vamos. | ✅ |
| — | [`adr/`](./adr/) | Decisiones de arquitectura, una por archivo, con la alternativa que se descartó. | ✅ |
| — | [`anexos/`](./anexos/) | Evidencia cruda de la investigación técnica. | ✅ |

## Los cinco documentos que Edwin tiene que ver

No todos. Estos cinco, en este orden, y ninguno más:

1. **`06-inventario-contenido.md`** — lo que necesitamos de él. Es lo que desbloquea todo.
2. **`05-stack-y-presupuesto.md`** — el presupuesto mensual que pidió dos veces en la reunión.
3. **`03-arquitectura-informacion.md`** — el mapa del sitio, para que decida el orden del Inicio.
4. **`08-plan-de-trabajo.md`** — cuándo ve el prototipo y cuándo se capacita.
5. **`09-operacion-y-traspaso.md`** — qué queda a su nombre y qué se renueva cada año.

El resto es documentación de ingeniería. Mandársela completa sería enterrarlo.

## Reglas de esta carpeta

- **`00-fuentes/` no se edita.** Un hook de Claude Code lo bloquea. La única excepción es
  `hechos-verificados.md`, que es interpretación nuestra y sí se corrige.
- **Todo requisito cita su origen.** Si un RF no se puede rastrear a un hecho de
  `hechos-verificados.md` o a un insumo de Edwin, es una suposición nuestra y va marcada como tal.
- **Un dato, un lugar.** Los precios viven en `05`; el esquema vive en `07`; las fechas viven en
  `08`. Los demás documentos enlazan, no copian.
- **Lo que no sabemos se escribe.** Un `🔴 Pendiente` honesto vale más que un dato inventado.
