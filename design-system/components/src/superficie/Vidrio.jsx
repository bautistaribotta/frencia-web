import React from 'react';

const CSS = `
.frencia-vidrio {
  background: var(--surface-card); border: 1px solid var(--glass-line);
  -webkit-backdrop-filter: blur(var(--blur-glass)) saturate(1.5); backdrop-filter: blur(var(--blur-glass)) saturate(1.5);
  box-shadow: var(--shadow-glass); border-radius: var(--radius-xl);
}
.frencia-vidrio--fuerte { background: var(--surface-card-elevated); box-shadow: var(--shadow-md); }
.frencia-vidrio--denso { background: var(--surface-raised); -webkit-backdrop-filter: blur(var(--blur-sheet)) saturate(1.5); backdrop-filter: blur(var(--blur-sheet)) saturate(1.5); }
.frencia-vidrio--pill { border-radius: var(--radius-pill); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-vidrio-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-vidrio-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Panel de vidrio esmerilado sobre el Fondo. nivel: normal | fuerte (en curso, dialogos) | denso (hojas, tab bar). */
export function Vidrio({ nivel = 'normal', pill = false, as = 'div', className = '', children, ...rest }) {
  const cls = ['frencia-vidrio', nivel !== 'normal' ? `frencia-vidrio--${nivel}` : '', pill ? 'frencia-vidrio--pill' : '', className].filter(Boolean).join(' ');
  return React.createElement(as, { className: cls, ...rest }, children);
}
