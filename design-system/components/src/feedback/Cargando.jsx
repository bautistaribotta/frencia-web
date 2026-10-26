import React from 'react';

const CSS = `
.frencia-carga { display: inline-flex; flex-direction: column; align-items: center; gap: var(--space-4); }
.frencia-carga__texto { font: var(--text-body-sm); color: var(--text-secondary); }
.frencia-carga__circulo { display: block; border-radius: 50%; border-style: solid; border-color: var(--data-track); border-top-color: var(--text-primary);
  animation: frencia-giro 1.2s linear infinite; }
.frencia-carga--sm .frencia-carga__circulo { width: 16px; height: 16px; border-width: 1.5px; }
.frencia-carga--md .frencia-carga__circulo { width: 20px; height: 20px; border-width: 1.5px; }
.frencia-carga--lg .frencia-carga__circulo { width: 28px; height: 28px; border-width: 2px; }
@keyframes frencia-giro { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .frencia-carga__circulo { animation-duration: 3.6s !important; animation-iteration-count: infinite !important; }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-carga-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-carga-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Indicador de carga: el anillo clasico. Pista en data-track y un tramo en
 * tinta que gira, una vuelta cada 1,2 s. `texto` opcional debajo.
 */
export function Cargando({ tam = 'md', texto, className = '', ...rest }) {
  const cls = ['frencia-carga', `frencia-carga--${tam}`, className].filter(Boolean).join(' ');
  return (
    <div className={cls} role="progressbar" aria-busy="true" aria-label={texto || 'Cargando'} {...rest}>
      <span className="frencia-carga__circulo"></span>
      {texto ? <span className="frencia-carga__texto">{texto}</span> : null}
    </div>
  );
}
