import { APIError, type FieldHook } from "payload";

/**
 * La guía de mensajes seguros sobre suicidio (CLAUDE.md §5.1) hecha validación: al guardar, se
 * rechazan las expresiones que la guía prohíbe. No es un filtro de moderación completo (no puede
 * saberlo todo): es la red que evita el error más común de quien escribe con buena intención.
 *
 * Lo que sí se dice: «murió por suicidio» y «se quitó la vida».
 */
const PROHIBIDAS: { patron: RegExp; alternativa: string }[] = [
  { patron: /comet(?:i[óo]|e|er|ieron|ido)\s+(?:un\s+)?suicidio/i, alternativa: "«murió por suicidio» o «se quitó la vida»" },
  { patron: /suicidio\s+(?:exitoso|fallido|consumado\s+con\s+éxito)/i, alternativa: "«murió por suicidio» o «intentó quitarse la vida»" },
  { patron: /intento\s+(?:fallido|exitoso)\s+de\s+suicidio/i, alternativa: "«intentó quitarse la vida»" },
];

type NodoLexical = { text?: string; children?: NodoLexical[]; root?: NodoLexical };

/** El texto plano de un valor que puede ser texto o un árbol de Lexical (texto enriquecido). */
export function textoPlano(valor: unknown): string {
  if (typeof valor === "string") return valor;
  if (!valor || typeof valor !== "object") return "";
  const nodo = valor as NodoLexical;
  const hijos = nodo.root ? [nodo.root] : (nodo.children ?? []);
  return [nodo.text ?? "", ...hijos.map(textoPlano)].join(" ");
}

/** Lanza un error visible para la persona que escribe, con la alternativa correcta. */
export function exigirLenguajeSeguro(valor: unknown): void {
  const texto = textoPlano(valor);
  for (const { patron, alternativa } of PROHIBIDAS) {
    const encontrada = texto.match(patron);
    if (encontrada) {
      throw new APIError(
        `La guía de salud mental pide no escribir «${encontrada[0]}». Di ${alternativa}.`,
        400,
        undefined,
        true,
      );
    }
  }
}

/** Gancho de campo: revisa el valor antes de guardarlo. */
export const lenguajeSeguro: FieldHook = ({ value }) => {
  exigirLenguajeSeguro(value);
  return value;
};
