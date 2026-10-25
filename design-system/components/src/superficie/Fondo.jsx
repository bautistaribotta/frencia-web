import React from 'react';

// Fondo de luces de Frencia. Tres luces radiales (a: lume, b: profundidad,
// c: acero) sobre bg-app, un velo arriba y abajo y grano. Cada pantalla elige
// una posicion que deja libre de luz la zona donde vive su contenido.
// Mismos datos que project/entrega/fondos.json (la app usa degradados
// radiales de react-native-svg; aca son radial-gradient).

// [luz, x %, y %, radio % del ancho, alfa]
export const POSICIONES = {
  cumbre: { uso: 'Luz arriba a la derecha. Pestañas, listas y formularios que arrancan debajo del título.', luces: [['a', 92, 2, 95, 0.5], ['b', 8, 62, 115, 0.9], ['c', 96, 94, 70, 0.22]] },
  centro: { uso: 'Luz detrás del centro. Un control protagonista en vidrio: rueda, regla, esfera del descanso, ticket.', luces: [['a', 56, 54, 92, 0.42], ['b', 4, 14, 95, 0.85], ['c', 100, 96, 72, 0.2]] },
  flanco: { uso: 'Luz en el borde derecho, a media altura. Formularios alineados a la izquierda: acceso, nombre de rutina.', luces: [['a', 112, 42, 88, 0.5], ['b', -2, 82, 115, 0.9], ['c', -6, -2, 62, 0.2]] },
  base: { uso: 'Luz que sube desde abajo a la izquierda. Pantallas con el contenido arriba y aire abajo: días de la rutina, menú.', luces: [['a', -4, 86, 90, 0.42], ['b', 100, 18, 110, 0.9], ['c', 70, 104, 60, 0.18]] },
  velada: { uso: 'Luz solo en los bordes: entra por abajo a la derecha (detrás del botón o la barra de pestañas) y por arriba a la izquierda. Pantallas densas en datos: la serie, el historial, el catálogo.', luces: [['a', 102, 104, 82, 0.4], ['b', 12, 58, 110, 0.85], ['c', -6, -4, 62, 0.22]] },
};
// Orden del onboarding animado: cada paso se desliza hacia la siguiente posicion.
export const RECORRIDO = ['flanco', 'cumbre', 'centro', 'centro'];
const SUAVE = { a: 0.8, b: 0.95, c: 0.8 };

const CSS = `
.frencia-fondo { position: absolute; inset: 0; overflow: hidden; background: var(--bg-app); z-index: 0; pointer-events: none; container-type: size; }
.frencia-fondo__luz { position: absolute; inset: 0; transition: background var(--dur-slow) var(--ease-out); }
.frencia-fondo--animado .frencia-fondo__luz { animation: frencia-deriva 20s ease-in-out infinite alternate; }
.frencia-fondo--animado .frencia-fondo__luz:nth-child(2) { animation-duration: 26s; animation-delay: -7s; }
.frencia-fondo--animado .frencia-fondo__luz:nth-child(3) { animation-duration: 31s; animation-delay: -13s; }
@keyframes frencia-deriva { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(5%, -4%) scale(1.08); } 100% { transform: translate(-4%, 5%) scale(0.96); } }
.frencia-fondo__grano { position: absolute; inset: 0; opacity: 0.2; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.frencia-fondo__velo { position: absolute; inset: 0; background: linear-gradient(180deg, var(--velo-top) 0%, transparent 30%, transparent 64%, var(--velo-bottom) 100%); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-fondo-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-fondo-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

function luz([k, x, y, r, alfa], suave) {
  const a = Math.min(1, alfa * (suave ? SUAVE[k] : 1));
  const pct = Math.round(a * 100);
  const mid = Math.round(a * 45);
  // --fondo-ganancia sube las luces en el tema claro, donde el lume pálido sobre marfil casi no se ve.
  const col = (p) => `color-mix(in srgb, var(--glow-${k}) min(100%, calc(${p}% * var(--fondo-ganancia, 1))), transparent)`;
  return `radial-gradient(circle ${r}cqw at ${x}% ${y}%, ${col(pct)} 0%, ${col(mid)} 42%, transparent 100%)`;
}

/**
 * Fondo de luces. posicion: cumbre | centro | flanco | base | velada.
 * intensidad: pleno | suave (pantallas de datos). animado: solo onboarding.
 */
export function Fondo({ posicion = 'cumbre', intensidad = 'pleno', animado = false, grano = true, className = '', style, ...rest }) {
  const p = POSICIONES[posicion] || POSICIONES.cumbre;
  const suave = intensidad === 'suave';
  const cls = ['frencia-fondo', animado ? 'frencia-fondo--animado' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style} aria-hidden="true" data-posicion={posicion} {...rest}>
      {p.luces.map((l, i) => <div key={i} className="frencia-fondo__luz" style={{ background: luz(l, suave) }} />)}
      {grano ? <div className="frencia-fondo__grano" /> : null}
      <div className="frencia-fondo__velo" />
    </div>
  );
}
Fondo.POSICIONES = POSICIONES;
Fondo.RECORRIDO = RECORRIDO;
