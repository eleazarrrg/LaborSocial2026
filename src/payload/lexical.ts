import type { Proyecto } from "@/payload-types";

type Historia = NonNullable<Proyecto["historia"]>;

/**
 * Párrafos de texto plano → el formato del editor de texto enriquecido (Lexical). Lo usa la siembra
 * para pasar el texto oficial del catálogo (src/lib/catalogo.ts) al CMS, donde Edwin lo edita con
 * negrita, enlaces y listas. Un párrafo por cada elemento.
 */
export function parrafosALexical(parrafos: string[]): Historia {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: parrafos.map((texto) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        children: [{ type: "text", text: texto, format: 0, style: "", mode: "normal", detail: 0, version: 1 }],
      })),
    },
  };
}
