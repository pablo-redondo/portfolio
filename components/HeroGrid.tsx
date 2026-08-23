/**
 * Fondo del hero: una retícula técnica con pulsos de luz recorriendo sus
 * líneas, como paquetes viajando por un cableado — que es de donde viene
 * el ángulo de infraestructura del sitio.
 *
 * Todo el movimiento vive en CSS: cero JavaScript, cero descargas y, al
 * ser decorativo, `aria-hidden` para que no aparezca en el árbol de
 * accesibilidad. La posición y el ritmo de cada pulso están en la hoja de
 * estilos por nth-child, así que aquí no hay estilos en línea.
 */
export function HeroGrid() {
  return (
    <div className="hero-grid" aria-hidden>
      <span className="grid-beam" />
      <span className="grid-beam" />
      <span className="grid-beam" />
      <span className="grid-beam" />
      <span className="grid-beam grid-beam-h" />
      <span className="grid-beam grid-beam-h" />
    </div>
  );
}
