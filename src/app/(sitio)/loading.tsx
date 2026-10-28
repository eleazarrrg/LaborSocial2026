/**
 * Lo que se ve mientras llega la página siguiente. Las páginas leen del CMS en cada visita, así que
 * sin esto un clic parecería no hacer nada durante un instante. El esqueleto copia la forma de una
 * página interior (título, texto, bloques) y «respira» con una pulsación suave, que sí comunica
 * algo: está cargando. Con `prefers-reduced-motion` queda quieto.
 */
export default function Cargando() {
  return (
    <div role="status" aria-label="Cargando la página" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="esqueleto h-12 w-3/4 max-w-xl rounded-xl bg-papel-alto sm:h-16" />
      <div className="esqueleto mt-6 h-5 w-full max-w-2xl rounded-lg bg-papel-alto" />
      <div className="esqueleto mt-3 h-5 w-5/6 max-w-xl rounded-lg bg-papel-alto" />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="esqueleto h-56 rounded-2xl bg-papel-alto" />
        <div className="esqueleto h-56 rounded-2xl bg-papel-alto" />
      </div>
    </div>
  );
}
