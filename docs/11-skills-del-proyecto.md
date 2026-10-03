# Skills del proyecto

Cómo reproducir el entorno de Claude Code que usamos, y por qué está montado así.

## El problema que esto resuelve

Las skills se habían copiado a mano desde el proyecto LexCore. Funcionaban, pero **no se podían
actualizar**: nadie sabía de qué repositorio venía cada una ni qué versión era. Una skill copiada es
una foto; lo que hace falta es una suscripción.

Se verificó una por una. De las 67 que había, **solo 34 eran de ECC** — las otras 33 venían de seis
fuentes distintas, y el `skills-lock.json` de LexCore solo documentaba 13.

Y peor: las copias estaban **truncadas**. `ui-ux-pro-max` tenía 46 archivos; el repo real publica
**73 en esa skill y otras seis más** —`design`, `design-system`, `ui-styling`, `banner-design`,
`brand` y `slides`—, 260 archivos y 10,5 MB en total. Faltaban `reasoning_contract.py`, los JSON de
procedencia, las licencias de fuentes y toda la suite de fixtures. Copiar una carpeta a mano no
instala una skill: instala un recorte de una skill.

## Reproducir el entorno

Tres marketplaces y un comando. Quien clone el repositorio ejecuta esto una vez:

```bash
claude plugin marketplace add affaan-m/ECC
claude plugin marketplace add anthropics/skills
claude plugin marketplace add DietrichGebert/ponytail

claude plugin install ecc@ecc                              # 293 skills
claude plugin install example-skills@anthropic-agent-skills # 19 oficiales
claude plugin install ponytail@ponytail                     # anti-sobreingeniería

npx skills@latest add supabase/agent-skills emilkowalski/skills mattpocock/skills --global
npx skills@latest add nextlevelbuilder/ui-ux-pro-max-skill --global
npx skills@latest add vercel-labs/agent-browser vercel-labs/agent-skills obra/superpowers --global
```

Resultado: **293 skills del plugin ECC + 97 globales**, todas con procedencia y actualizables.

## Qué aporta cada fuente

| Fuente | Qué trae | Licencia | Por qué está |
|---|---|---|---|
| [`affaan-m/ECC`](https://github.com/affaan-m/ECC) v2.2.2 | 293 skills, 68 agentes, hooks | MIT | «Everything Claude Code». Es el origen de la mayoría de lo que ya usábamos. |
| [`anthropics/skills`](https://github.com/anthropics/skills) | 19 oficiales: `frontend-design`, `skill-creator`, `webapp-testing`… | Apache 2.0 (la mayoría) | La fuente de máxima confianza. Nuestra propia `frontend-design-direction` dice que `frontend-design` se instale de aquí. |
| [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail) v4.10.0 | Disciplina anti-sobreingeniería | MIT | **Es la que más protege a este proyecto.** El equipo entrega y se retira (X-01): lo último que necesita quien herede es una dependencia de más. |
| [`supabase/agent-skills`](https://github.com/supabase/agent-skills) | `supabase`, `supabase-postgres-best-practices` | MIT | Supabase entra en la fase de base de datos. Mantenida por el propio vendor. |
| [`emilkowalski/skills`](https://github.com/emilkowalski/skills) | `animate`, `apple-design`, `mobile-native`, `improve-animations`… | MIT | Movimiento y pulido de interfaz. El sitio es editorial y se lee en teléfonos. |
| [`mattpocock/skills`](https://github.com/mattpocock/skills) | `codebase-design`, `domain-modeling`, `prototype`, `research`… | MIT | TypeScript y diseño de módulos. |
| [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | **Siete skills**: `ui-ux-pro-max`, `design`, `design-system`, `ui-styling`, `banner-design`, `brand`, `slides`. 79 estilos, 192 paletas, 74 pairings, 119 guías UX, 22 stacks | MIT | Es la base del trabajo de diseño del portal. |
| [`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills) | `web-design-guidelines`, `writing-guidelines`, `vercel-optimize`, `vercel-composition-patterns`… | README dice MIT, **sin archivo LICENSE** | Las guías de interfaz y de prosa encajan con WCAG y con el tono del sitio. |
| [`vercel-labs/agent-browser`](https://github.com/vercel-labs/agent-browser) | `agent-browser`, `deploy-to-vercel` | MIT | Automatización de navegador para QA del sitio. |
| [`obra/superpowers`](https://github.com/obra/superpowers) | `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`… | MIT | Donde vivían de verdad tres de las huérfanas. **No colisiona con ECC**: se comprobó. |

> **Una corrección sobre la investigación previa:** se descartó `mattpocock/skills` por supuestas
> colisiones de nombre con ECC. Se comprobó y **no colisiona ninguna**: `code-review`, `tdd`,
> `diagnosing-bugs` e `implement` no existen en ECC. La objeción era una suposición.

## Las 8 huérfanas que quedan

Viven en `.claude/skills/` (230 KB en total) y **no tienen origen conocido**. No están en ECC, ni en
el marketplace de Anthropic, ni en ninguna de las instalaciones globales, ni aparecían en el
`skills-lock.json` de LexCore.

```
git-commit   gsap-frameworks   gsap-utils   interface-design
mcp-client   motion-ui         responsive-design   sop-creator
```

Las de GSAP dicen en su cabecera «Official GSAP skill», pero `greensock/skills` no existe como
repositorio. Las otras seis no dan ninguna pista de procedencia.

**Si alguien identifica el repositorio de alguna, lo correcto es instalarla por el gestor y retirar
la copia**, para que vuelva a ser actualizable. Lo que se retiró de aquí quedó en el scratchpad de
la sesión, no se borró.

## Por qué `.claude/skills/` no se versiona

Son código de terceros con sus propias licencias, y las 67 originales pesaban 3,6 MB. Lo que se
versiona es **este documento**: el manifiesto que permite reconstruir el entorno con los comandos de
arriba. Es lo que de verdad hereda el equipo siguiente.

## Seguridad

Las skills de proyecto **se ejecutan con permisos completos** y, según la documentación de Anthropic,
su campo `allowed-tools` **no lo bloquea el workspace trust**. Quien clone el repositorio ejecuta lo
que haya en `.claude/skills/`.

Antes de cada entrega:

```bash
/security-scan                                     # AgentShield sobre .claude/
grep -rln "allowed-tools" .claude/skills/*/SKILL.md
grep -rn  "^hooks:"       .claude/skills/*/SKILL.md
```

Hoy declaran uno u otro campo: `agent-browser` y `git-commit`. Si en algún momento ninguna skill
necesita ejecutar shell, el interruptor documentado es `"disableSkillShellExecution": true` en
`.claude/settings.json`.
