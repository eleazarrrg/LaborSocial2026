# Portal Fundación REFUVA

Sitio público y panel administrativo de la **Fundación REFUVA** (Panamá).
Proyecto de servicio social universitario. Levantamiento del 20 de agosto de 2026.

> **Antes de tocar código, lee [`CLAUDE.md`](./CLAUDE.md).** Ahí están las decisiones ya tomadas y
> las reglas que no se negocian — en particular las de contenido sobre suicidio y datos personales.
> Para cualquier cosa de color, tipografía o temas, lee [`DESIGN.md`](./DESIGN.md).
> La documentación completa está en [`docs/`](./docs/README.md).

## Correrlo en local

Necesitas Node 20 o superior. Nada más para el prototipo.

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros comandos:

```bash
npm run build      # verificación obligatoria antes de entregar
npm run typecheck  # tsc --noEmit
npm run lint
npm run contraste  # audita el contraste WCAG de la paleta en ambos temas
```

Cuando entre la base de datos hará falta Docker, solo para levantar Supabase local:

```bash
npx supabase start
npx supabase db reset
```

## Estado: prototipo para validación

Sirve para que Edwin vea la dirección y la apruebe (compromiso C-09 de la reunión). No está
conectado a nada y no se indexa en buscadores.

**25 páginas, todas construidas y verificadas:**

| Ruta | Qué es |
|---|---|
| `/` | Inicio. El catálogo entero como índice numerado. |
| `/ayuda-en-crisis` | Recursos verificados. La página más importante del sitio. |
| `/proyectos` · `/proyectos/[codigo]` | Índice y una página de detalle por proyecto. |
| `/campanas` · `/campanas/[codigo]` | Las campañas, en colección aparte. |
| `/agendar-cita` | Solicitud de cita, con el bloque de crisis antes del primer campo. |
| `/donar` | Yappy y transferencia. Sin formularios y sin registro. |
| `/participar` · `/participar/apadrinar` · `/participar/voluntariado` | Formas de ayudar. |
| `/alianzas` | Solicitud de alianza institucional. |
| `/nosotros` · `/contacto` · `/noticias` | Institucional. |
| `/privacidad` · `/terminos` | Legales, en borrador. |

**Verificado en la última compilación:** 0 enlaces rotos, 0 problemas de estructura (un solo `<h1>`
por página, `lang="es-PA"`, el 911 y la Línea 147 presentes en todas, ninguna imagen sin `alt`,
ninguna mención publicada de la 169 ni del INSAM). `npm run build`, `lint` y `typecheck` en verde.

Pendiente, en orden:

1. Base de datos en Supabase y conexión de los formularios.
2. Panel administrativo.
3. Feed de Instagram.
4. Contenido y fotografías reales ([`docs/06-inventario-contenido.md`](./docs/06-inventario-contenido.md)).

## Cómo está organizado

```
src/
  app/
    layout.tsx            armazón: banda de crisis, encabezado, pie
    page.tsx              Inicio
    actions.ts            Server Actions de los formularios (validación con Zod)
    <ruta>/page.tsx       una carpeta por ruta, en español
  components/
    ui.tsx                Boton, Dato, Marco, Nota, Placa, TituloPagina
    banda-crisis.tsx      banda y bloque de crisis
    indice-catalogo.tsx   el índice numerado — la pieza que define el sitio
    ficha-entrada.tsx     plantilla de detalle, compartida por proyectos y campañas
    formulario.tsx        primitivas de formulario accesibles
    formularios/          un componente por formulario
  lib/
    crisis.ts             SOLO recursos verificados. Ver la advertencia del archivo.
    catalogo.ts           ocho proyectos y dos campañas. La fuente de verdad
                          del catálogo. Semilla; luego vive en Supabase.
    esquemas.ts           validación con Zod — SERVIDOR ÚNICAMENTE
    opciones.ts           listas de los formularios, sin dependencias
    contacto.ts           datos de contacto y donación, hoy pendientes
docs/                     requisitos, arquitectura, presupuesto, plan y traspaso
.claude/                  agentes, reglas, skills y hooks del proyecto
```

## Tres decisiones de ingeniería que conviene no deshacer

**Zod nunca llega al navegador.** Las listas de opciones viven en `lib/opciones.ts`, sin
dependencias, y los esquemas en `lib/esquemas.ts`. Si un componente de cliente importa de
`esquemas.ts`, arrastra Zod entero al bundle: son 87 KB comprimidos que el público de esta
fundación paga en datos móviles. Ya pasó una vez y se corrigió.

**Los formularios no mienten.** Mientras no exista la base de datos, validan y dicen que no han
guardado nada. Un formulario que responde «recibido» sin haber recibido nada es grave en cualquier
sitio; en uno donde alguien pide ayuda psicológica, hace daño.

**Sin librería de formularios.** Validación en el servidor con Server Actions. Menos JavaScript,
y el formulario sigue funcionando si el JavaScript falla.

## Dos advertencias que no son opcionales

**Los números de crisis.** `src/lib/crisis.ts` contiene solo lo verificado: 911 y la Línea 147 del
MIDES. La 169 del MINSA y los números del INSAM **no se publican** mientras nadie los haya llamado y
anotado qué contesta. Un número equivocado en una página de prevención del suicidio hace daño real.

**Los datos de las personas.** Cuando entre la base de datos, toda tabla con datos de personas nace
con Row Level Security. Un hook del repositorio corta la migración si falta. No se desactiva.
