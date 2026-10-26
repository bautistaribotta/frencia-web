import React from 'react';

const CSS = `
.frencia-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-3);
  font-family: var(--font-sans); font-weight: var(--fw-semibold); letter-spacing: -0.005em;
  border: 1px solid transparent; border-radius: var(--radius-lg);
  cursor: pointer; white-space: nowrap; text-decoration: none;
  transition: transform var(--dur-fast) var(--ease-out),
              background-color var(--dur-base) var(--ease-out),
              color var(--dur-base) var(--ease-out),
              box-shadow var(--dur-base) var(--ease-out),
              border-color var(--dur-base) var(--ease-out);
  -webkit-tap-highlight-color: transparent; user-select: none;
}
.frencia-btn:active:not(:disabled) { transform: scale(var(--press-scale)); }
.frencia-btn:disabled { cursor: not-allowed; }
.frencia-btn svg { width: 1.1em; height: 1.1em; stroke-width: 1.75; }

/* tamanios */
.frencia-btn--sm { height: var(--control-h-sm); padding: 0 14px; font-size: 14px; gap: 6px; }
.frencia-btn--md { height: var(--control-h-md); padding: 0 20px; font-size: 15px; }
.frencia-btn--lg { height: var(--control-h-lg); padding: 0 24px; font-size: 16px; }
.frencia-btn--full { width: 100%; }

/* primary: lume en oscuro, tinta en claro, con su resplandor. */
.frencia-btn--primary { background: var(--accent); color: var(--text-on-accent); box-shadow: var(--halo-accent); }
.frencia-btn--primary:hover:not(:disabled) { background: var(--accent-hover); }
.frencia-btn--primary:active:not(:disabled) { background: var(--accent-press); }
.frencia-btn--primary:disabled { background: var(--surface-chip); color: var(--text-disabled); box-shadow: none; }

/* intensity: el esfuerzo en tinta (Frenar, Nuevo PR) */
.frencia-btn--intensity { background: var(--intensity); color: var(--text-on-intensity); }
.frencia-btn--intensity:hover:not(:disabled) { background: var(--intensity-hover); box-shadow: var(--halo-intensity); }
.frencia-btn--intensity:active:not(:disabled) { background: var(--intensity-press); }
.frencia-btn--intensity:disabled { background: var(--surface-chip); color: var(--text-disabled); }

/* secondary: vidrio */
.frencia-btn--secondary { background: var(--surface-card); color: var(--text-primary); border-color: var(--glass-line); box-shadow: var(--shadow-glass); -webkit-backdrop-filter: blur(var(--blur-glass)) saturate(1.5); backdrop-filter: blur(var(--blur-glass)) saturate(1.5); }
.frencia-btn--secondary:hover:not(:disabled) { background: var(--surface-card-elevated); }
.frencia-btn--secondary:disabled { color: var(--text-disabled); border-color: var(--border-subtle); }

/* ghost: solo texto */
.frencia-btn--ghost { background: transparent; color: var(--text-secondary); }
.frencia-btn--ghost:hover:not(:disabled) { background: var(--surface-chip); color: var(--text-primary); }
.frencia-btn--ghost:disabled { color: var(--text-disabled); }

/* soft: texto en lume / oliva (Saltar serie, Deshacer) */
.frencia-btn--soft { background: transparent; color: var(--signal-text); }
.frencia-btn--soft:hover:not(:disabled) { background: var(--surface-signal-soft); }
.frencia-btn--soft:disabled { color: var(--text-disabled); }

/* danger: carmin delineado */
.frencia-btn--danger { background: transparent; color: var(--danger-text); border-color: var(--danger); }
.frencia-btn--danger:hover:not(:disabled) { background: var(--danger); color: var(--ivory-0); }
.frencia-btn--danger:disabled { color: var(--text-disabled); border-color: var(--border-subtle); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-btn-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-btn-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Boton de Frencia. primary es lume en oscuro y tinta en claro, con resplandor;
 * secondary es vidrio sobre el Fondo.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconRight,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'frencia-btn',
    `frencia-btn--${variant}`,
    `frencia-btn--${size}`,
    fullWidth ? 'frencia-btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} disabled={disabled} {...rest}>
      {icon ? <i data-lucide={icon}></i> : null}
      {children ? <span>{children}</span> : null}
      {iconRight ? <i data-lucide={iconRight}></i> : null}
    </button>
  );
}
