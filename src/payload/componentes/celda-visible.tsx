/**
 * La celda «Visible en el sitio» de las listas: dice «Visible» u «Oculta» en vez de «verdadero» o
 * «falso». El estado va escrito (no solo en color) para que se entienda sin distinguir tonos.
 */
export function CeldaVisible({ cellData }: { cellData?: unknown }) {
  const oculta = cellData === false;
  return <span className={oculta ? "celda-visible celda-visible--oculta" : "celda-visible"}>{oculta ? "Oculta" : "Visible"}</span>;
}
