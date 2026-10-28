"use client";

import { useEffect, useRef } from "react";

/**
 * Una cifra real que cuenta hasta su valor cuando entra en pantalla.
 *
 * El servidor escribe el valor FINAL: sin JavaScript, o con «reducir movimiento», se ve el número
 * correcto y nada parpadea ni se desajusta al hidratar. Solo si el navegador permite movimiento, y
 * solo cuando la cifra aparece en pantalla, se reinicia en `desde` y cuenta (una vez). Sin librería:
 * un IntersectionObserver y requestAnimationFrame.
 */
export function Contador({
  hasta,
  desde = 0,
  duracion = 1400,
  sufijo = "",
}: {
  hasta: number;
  desde?: number;
  duracion?: number;
  sufijo?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cuadro = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        const inicio = performance.now();
        const paso = (ahora: number) => {
          const t = Math.min(1, (ahora - inicio) / duracion);
          const suave = 1 - Math.pow(1 - t, 3);
          el.textContent = `${Math.round(desde + (hasta - desde) * suave)}${sufijo}`;
          if (t < 1) cuadro = requestAnimationFrame(paso);
        };
        el.textContent = `${desde}${sufijo}`;
        cuadro = requestAnimationFrame(paso);
      },
      { threshold: 0.6 },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(cuadro);
    };
  }, [hasta, desde, duracion, sufijo]);

  return (
    <span ref={ref} className="tabular-nums">
      {hasta}
      {sufijo}
    </span>
  );
}
