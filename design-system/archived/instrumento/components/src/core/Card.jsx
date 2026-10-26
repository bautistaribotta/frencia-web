import React from 'react';

const CSS = `
.frencia-card {
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--pad-card);
  transition: background var(--dur-base) var(--ease-out),
              border-color var(--dur-base) var(--ease-out),
              transform var(--dur-fast) var(--ease-out);
}
.frencia-card--hairline { border-color: var(--border-default); }
.frencia-card--elevated { background: var(--surface-card-elevated); box-shadow: var(--shadow-md); }
.frencia-card--inset { background: var(--surface-inset); }
.frencia-card--signal { background: var(--surface-signal-soft); border-color: var(--surface-signal-line); }
.frencia-card--intensity { background: var(--surface-intensity-soft); border-color: var(--surface-intensity-line); }
.frencia-card--interactive { cursor: pointer; }
.frencia-card--interactive:active { transform: scale(0.995); }
.frencia-card--interactive:hover { border-color: var(--border-default); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-card-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-card-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const ALIAS = { green: 'signal', orange: 'intensity' };

/** Superficie base: tarjeta plana con hairline. Las variantes marcan estado, no decoran. */
export function Card({
  variant = 'default',
  hairline = false,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const v = ALIAS[variant] || variant;
  const cls = [
    'frencia-card',
    v !== 'default' ? `frencia-card--${v}` : '',
    hairline ? 'frencia-card--hairline' : '',
    interactive ? 'frencia-card--interactive' : '',
    className,
  ].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}
