import React from 'react';

const CSS = `
.frencia-iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid transparent; cursor: pointer; padding: 0;
  border-radius: var(--radius-lg);
  transition: transform var(--dur-fast) var(--ease-out),
              background var(--dur-base) var(--ease-out),
              border-color var(--dur-base) var(--ease-out),
              color var(--dur-base) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.frencia-iconbtn:active:not(:disabled) { transform: scale(var(--press-scale)); }
.frencia-iconbtn:disabled { color: var(--text-disabled); cursor: not-allowed; }
.frencia-iconbtn svg { stroke-width: 1.75; }
.frencia-iconbtn--round { border-radius: var(--radius-circle); }

.frencia-iconbtn--sm { width: 36px; height: 36px; }
.frencia-iconbtn--sm svg { width: 18px; height: 18px; }
.frencia-iconbtn--md { width: 44px; height: 44px; }
.frencia-iconbtn--md svg { width: 20px; height: 20px; }
.frencia-iconbtn--lg { width: 54px; height: 54px; }
.frencia-iconbtn--lg svg { width: 22px; height: 22px; }

.frencia-iconbtn--primary { background: var(--accent); color: var(--text-on-accent); box-shadow: var(--halo-accent); }
.frencia-iconbtn--primary:hover:not(:disabled) { background: var(--accent-hover); }
.frencia-iconbtn--primary:disabled { background: var(--surface-chip); }
.frencia-iconbtn--surface { background: var(--surface-card); color: var(--text-primary); border-color: var(--glass-line); box-shadow: var(--shadow-glass); -webkit-backdrop-filter: blur(var(--blur-glass)) saturate(1.5); backdrop-filter: blur(var(--blur-glass)) saturate(1.5); }
.frencia-iconbtn--surface:hover:not(:disabled) { background: var(--surface-card-elevated); }
.frencia-iconbtn--ghost { background: transparent; color: var(--text-secondary); }
.frencia-iconbtn--ghost:hover:not(:disabled) { background: var(--surface-chip); color: var(--text-primary); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-iconbtn-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-iconbtn-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Boton de solo icono, cuadrado o redondo. */
export function IconButton({
  icon,
  variant = 'surface',
  size = 'md',
  round = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const cls = [
    'frencia-iconbtn',
    `frencia-iconbtn--${variant}`,
    `frencia-iconbtn--${size}`,
    round ? 'frencia-iconbtn--round' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} disabled={disabled} {...rest}>
      <i data-lucide={icon}></i>
    </button>
  );
}
