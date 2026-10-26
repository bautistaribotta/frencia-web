import React from 'react';

const CSS = `
.frencia-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: var(--font-sans); font-weight: var(--fw-semibold);
  font-variation-settings: var(--vs-semi);
  font-size: 10.5px; letter-spacing: var(--ls-wider); text-transform: uppercase;
  height: 22px; padding: 0 8px; border-radius: var(--radius-sm);
  border: 1px solid transparent; line-height: 1; white-space: nowrap;
}
.frencia-badge svg { width: 12px; height: 12px; stroke-width: 2; }
.frencia-badge--neutral { background: transparent; color: var(--text-secondary); border-color: var(--border-default); }
.frencia-badge--signal { background: var(--surface-signal-soft); color: var(--signal-text); border-color: var(--surface-signal-line); }
.frencia-badge--accent-solid { background: var(--accent); color: var(--text-on-accent); }
.frencia-badge--intensity { background: var(--surface-intensity-soft); color: var(--intensity-text); border-color: var(--surface-intensity-line); }
.frencia-badge--intensity-solid { background: var(--intensity); color: var(--text-on-intensity); }
.frencia-badge--danger { background: transparent; color: var(--danger-text); border-color: var(--danger); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-badge-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-badge-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const ALIAS = { green: 'signal', 'green-solid': 'accent-solid', orange: 'intensity', 'orange-solid': 'intensity-solid' };

/** Marca de estado compacta: RIR, PR, tipo de serie. Sans en mayusculas, ancho semi. */
export function Badge({ tone = 'neutral', icon, children, className = '', ...rest }) {
  const t = ALIAS[tone] || tone;
  const cls = ['frencia-badge', `frencia-badge--${t}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {icon ? <i data-lucide={icon}></i> : null}
      {children}
    </span>
  );
}
