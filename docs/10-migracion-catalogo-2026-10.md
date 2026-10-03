# Migración del catálogo — octubre de 2026

Qué cambió, por qué, y a dónde fue a parar cada cosa. Este documento existe para que dentro de un
año, quien encuentre `prevencion-suicidio` en un commit, sepa qué pasó con él.

## Qué pasó

El 1 de octubre de 2026 la fundación entregó su material oficial (`Refuva.zip`, archivado en
[`00-fuentes/material-fundacion-2026-10/`](./00-fuentes/material-fundacion-2026-10/)). Ese material
**desmintió la estructura** sobre la que estaba construido el sitio.

Hasta entonces trabajábamos con «siete líneas de acción», inferidas de la reunión del 20 de agosto.
El material oficial dice otra cosa: son **ocho proyectos**, y las campañas son una categoría aparte
— la fundación las separa ella misma, bajo el encabezado literal «Campañas memorables de Refuva».

Aparecieron dos proyectos que **nunca se mencionaron en la reunión**, y cinco tenían un nombre real
distinto del que habíamos inferido.

## Tabla de migración

| Slug viejo | Slug nuevo | Ruta | Operación |
|---|---|---|---|
| `psicoeducativo` | `psicoeducativo` | `/proyectos/psicoeducativo` | **se conserva** · el alcance crece: ya no es «estudiantes en riesgo social» sino toda la comunidad educativa |
| — | `psicoempresarial` | `/proyectos/psicoempresarial` | **alta nueva** · emprendimiento y liderazgo |
| `rompiendo-el-circulo` | `rompiendo-el-circulo` | igual | **se conserva** · ver conflicto C-3 |
| `historias-que-sanan` | `historias-que-sanan` | igual | **se conserva** |
| — | `grupo-un-solo-corazon` | `/proyectos/grupo-un-solo-corazon` | **alta nueva** · nace en la pandemia, bolsas de comida a familias. **No es `alimentacion`** |
| `navidad` | `una-estrella-otiliana` | `/proyectos/una-estrella-otiliana` | **renombrado** · en honor a Otilia, la abuela de Edwin |
| `alimentacion` | `comida-en-la-calle` | `/proyectos/comida-en-la-calle` | **renombrado** · «Comida en la Calle, Esperanza en el Corazón» |
| `animales` | `angelitos-de-la-calle` | `/proyectos/angelitos-de-la-calle` | **renombrado** |
| `prevencion-suicidio` | `hablame-panama` | **`/campanas/hablame-panama`** | **reclasificado** · deja de ser proyecto. En honor a Jessica |
| — | `escuchame-panama` | **`/campanas/escuchame-panama`** | **alta nueva** · `#EscúchamePanamá` |
| — | *(reservada)* | `/campanas/{pendiente}` | tercera campaña, bloqueada por su logo |

**No se escribieron redirecciones 301.** El sitio nunca se publicó, está en `noindex` y sin dominio:
nadie tuvo esas URLs. Esto deja de ser cierto el día del despliegue — desde ahí, todo cambio de slug
paga su redirección.

## Códigos: lo viejo no se borra

Los códigos `P-01`…`P-07` de [`00-fuentes/hechos-verificados.md`](./00-fuentes/hechos-verificados.md)
**siguen significando lo que Edwin dijo el 20 de agosto**. Eso es un hecho histórico y no cambia
porque llegara material nuevo. Las 11 000 líneas de documentos que los citan siguen resolviendo.

Lo que se añade es una capa nueva: `PR-01`…`PR-08` para los ocho proyectos oficiales y `CA-01`…`CA-02`
para las campañas.

| Nuevo | Entidad | Equivale a |
|---|---|---|
| `PR-01` | Proyecto Psicoeducativo REFUVA | `P-01` |
| `PR-02` | Proyecto Psicoempresarial REFUVA | — (nuevo) |
| `PR-03` | Rompiendo el Círculo | `P-06` |
| `PR-04` | Historias que Sanan | `P-07` |
| `PR-05` | Grupo Un Solo Corazón | — (nuevo) |
| `PR-06` | Una Estrella Otiliana | `P-02` |
| `PR-07` | Comida en la Calle, Esperanza en el Corazón | `P-03` |
| `PR-08` | Angelitos de la Calle | `P-04` |
| `CA-01` | Háblame Panamá | `P-05` |
| `CA-02` | #EscúchamePanamá | — (nuevo) |

**Los números de RF y de módulo no se renumeran.** `RF-06` cambia de texto, no de número, porque lo
citan HU-06, HU-22, HU-38 y la matriz de trazabilidad. El módulo `3.1.3` **se amplía** a «Proyectos y
campañas»; no se parte, porque partirlo dejaría a cinco historias apuntando a un módulo que ya solo
cubriría la mitad de lo que prometían.

## Por qué las campañas van aparte

No es taxonomía por gusto. Si las diez entradas fueran una sola lista, **cinco de diez serían salud
mental**: media lista dándole la razón a la percepción que el sitio existe para desmentir (O-04).

Separadas, los ocho proyectos los dominan la comida, los animales, la Navidad, las familias y el
emprendimiento — y la salud mental queda donde debe, con su propia sección honesta y etiquetada. Con
la tercera campaña en camino, juntarlas sería seis de once.

Una tabla, dos colecciones: `proyectos.tipo` con `'proyecto' | 'campana'`. Partirla en dos tablas
duplicaría las cinco claves foráneas que apuntan a `proyectos.id` y sus políticas RLS, a cambio de
nada.

## La regla que esto dejó

**El conteo nunca se escribe a mano.** Ni «siete», ni «ocho», ni «diez». Se deriva de
`src/lib/catalogo.ts` con `PROYECTOS.length` y `enPalabras()`.

Que el número estuviera quemado en 27 archivos es exactamente lo que hizo caro este cambio. Viene una
tercera campaña y Edwin puede abrir el noveno proyecto desde el panel; no se paga esta factura otra
vez. Verificable: `grep -ri "siete" src/` debe devolver cero.

## Tres conflictos abiertos con Edwin

El texto oficial es más genérico que la reunión, y lo que se pierde es justo lo que convence a un
patrocinador.

- **C-1 · Psicoeducativo.** El texto oficial dice «comunidad educativa en general». En la reunión
  Edwin dijo «estudiantes en riesgo social», «más de 30 escuelas en lista», «Escuela Jerónimo de la
  Osa». ¿El proyecto creció, o el texto oficial es el resumen formal de lo mismo?
- **C-2 · Comida en la Calle contra Grupo Un Solo Corazón.** Dos proyectos distintos con la misma
  materia prima. ¿Siguen ambos activos, o Un Solo Corazón es historia de la pandemia?
- **C-3 · Rompiendo el Círculo.** El texto oficial **no menciona cárceles ni área roja**. En la
  reunión, «este proyecto le abrió a REFUVA las puertas de las cárceles» fue uno de los datos más
  fuertes de los 37 minutos. ¿Se omitió por acuerdo con la institución penitenciaria, o solo no cabía
  en el párrafo? Mientras no se aclare, **no se publica**.
