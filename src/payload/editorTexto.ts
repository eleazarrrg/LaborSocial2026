import {
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

/**
 * El editor de texto de noticias, eventos e historias de proyectos. A propósito, con pocas
 * opciones: negrita, cursiva, enlaces, listas, un subtítulo y fotos entre párrafos. Sin colores,
 * tamaños ni alineaciones: así toda noticia se ve igual de bien, la escriba quien la escriba, y
 * el contraste que auditamos no se puede romper desde el panel.
 */
export const editorTexto = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({ enabledCollections: [] }),
    UnorderedListFeature(),
    OrderedListFeature(),
    UploadFeature({
      collections: {
        medios: { fields: [] },
      },
    }),
  ],
});
