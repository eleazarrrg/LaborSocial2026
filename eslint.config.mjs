import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Ignorados por defecto de eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Herramientas de Claude Code: agentes, reglas, skills y hooks. No son
    // código de la aplicación y varios vienen de otros proyectos con su propio
    // estilo, así que no se lintean con las reglas de este.
    ".claude/**",
    // Documentación: solo markdown, nada que lintear.
    "docs/**",
    // Generados por Payload (migraciones, tipos e importMap): se regeneran, no se editan a mano.
    "src/migrations/**",
    "src/payload-types.ts",
    "src/app/(payload)/admin/importMap.js",
  ]),
]);

export default eslintConfig;
