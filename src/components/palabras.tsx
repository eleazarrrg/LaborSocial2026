/**
 * Un título cuyas palabras se arman una a una al entrar en pantalla (clase `.palabra` en
 * globals.css, CSS puro y apagado con reduced-motion). El texto es el mismo para el lector de
 * pantalla: son <span> en línea separados por espacios normales. Sin JavaScript.
 */
export function Palabras({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(" ").map((palabra, i) => (
        <span key={`${i}-${palabra}`}>
          <span className="palabra" style={{ "--i": i } as React.CSSProperties}>
            {palabra}
          </span>{" "}
        </span>
      ))}
    </>
  );
}
