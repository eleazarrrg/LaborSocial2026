# Skills del proyecto

Cómo reproducir el entorno de Claude Code que usamos, y por qué está montado así.

## El problema que esto resuelve

Las skills se habían copiado a mano desde el proyecto LexCore. Funcionaban, pero **no se podían
actualizar**: nadie sabía de qué repositorio venía cada una ni qué versión era. Una skill copiada es
una foto; lo que hace falta es una suscripción.

Se verificó una por una. De las 67 que había, **solo 34 eran de ECC** — las otras 33 venían de seis
fuentes distintas, y el `skills-lock.json` de LexCore solo documentaba 13.

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
```

## Qué aporta cada fuente

| Fuente | Qué trae | Licencia | Por qué está |
|---|---|---|---|
| [`affaan-m/ECC`](https://github.com/affaan-m/ECC) v2.2.2 | 293 skills, 68 agentes, hooks | MIT | «Everything Claude Code». Es el origen de la mayoría de lo que ya usábamos. |
| [`anthropics/skills`](https://github.com/anthropics/skills) | 19 oficiales: `frontend-design`, `skill-creator`, `webapp-testing`… | Apache 2.0 (la mayoría) | La fuente de máxima confianza. Nuestra propia `frontend-design-direction` dice que `frontend-design` se instale de aquí. |
| [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail) v4.10.0 | Disciplina anti-sobreingeniería | MIT | **Es la que más protege a este proyecto.** El equipo entrega y se retira (X-01): lo último que necesita quien herede es una dependencia de más. |
| [`supabase/agent-skills`](https://github.com/supabase/agent-skills) | `supabase`, `supabase-postgres-best-practices` | MIT | Supabase entra en la fase de base de datos. Mantenida por el propio vendor. |
| [`emilkowalski/skills`](https://github.com/emilkowalski/skills) | `animate`, `apple-design`, `mobile-native`, `improve-animations`… | MIT | Movimiento y pulido de interfaz. El sitio es editorial y se lee en teléfonos. |
| [`mattpocock/skills`](https://github.com/mattpocock/skills) | `codebase-design`, `domain-modeling`, `prototype`, `research`… | MIT | TypeScript y diseño de módulos. |

> **Una corrección sobre la investigación previa:** se descartó `mattpocock/skills` por supuestas
> colisiones de nombre con ECC. Se comprobó y **no colisiona ninguna**: `code-review`, `tdd`,
> `diagnosing-bugs` e `implement` no existen en ECC. La objeción era una suposición.

## Las 14 huérfanas

Viven en `.claude/skills/` y **no tienen origen conocido**. No están en ECC, ni en el marketplace de
Anthropic, ni en las instalaciones globales, ni aparecían en el `skills-lock.json` de LexCore.

```
agent-browser   brainstorming   git-commit     gsap-frameworks   gsap-utils
interface-design   mcp-client   motion-ui      responsive-design  sop-creator
subagent-driven-development     ui-ux-pro-max  vercel-react-best-practices
writing-plans
```

Algunas se pueden rastrear por el contenido —`brainstorming`, `writing-plans` y
`subagent-driven-development` parecen de `obra/superpowers`; las de GSAP, del repositorio oficial de
GSAP— pero no está confirmado. **Si alguien identifica el repositorio de alguna, lo correcto es
instalarla por el gestor y borrar la copia**, para que vuelva a ser actualizable.

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
