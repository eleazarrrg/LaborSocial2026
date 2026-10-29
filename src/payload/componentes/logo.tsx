/**
 * La marca de la fundación en el panel: el logo grande de la pantalla de entrada y el ícono del menú.
 * Usa la imagen institucional que ya está en el sitio (`public/marca/`).
 */

const IMAGEN = "/marca/institucional-recortado.png";

export function Logo() {
  return (
    <span className="logo-panel">
      {/* eslint-disable-next-line @next/next/no-img-element -- Payload carga este componente fuera de next/image */}
      <img src={IMAGEN} alt="" width={64} height={64} />
      <span className="logo-panel__texto">
        <strong>Fundación REFUVA</strong>
        <small>Panel de la fundación</small>
      </span>
    </span>
  );
}

export function Icono() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ver arriba
    <img src={IMAGEN} alt="Fundación REFUVA" width={28} height={28} />
  );
}
