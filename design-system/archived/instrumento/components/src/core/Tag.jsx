import React from 'react';

const CSS = `
.frencia-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-sans); font-weight: var(--fw-medium); font-size: 13px;
  height: 32px; padding: 0 12px; border-radius: var(--radius-sm);
  background: transparent; color: var(--text-secondary);
  border: 1px solid var(--border-default); cursor: default; line-height: 1;
  transition: background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.frencia-tag--selectable { cursor: pointer; }
.frencia-tag--selectable:hover { border-color: var(--border-strong); color: var(--text-primary); }
.frencia-tag--selected, .frencia-tag--selected:hover { background: var(--accent); color: var(--text-on-accent); border-color: var(--accent); }
.frencia-tag__dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-tag-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-tag-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Etiqueta para grupos musculares, categorias y filtros. Seleccionada = tinta. */
export function Tag({ selected = false, selectable = false, dot = false, children, className = '', ...rest }) {
  const cls = [
    'frencia-tag',
    selectable ? 'frencia-tag--selectable' : '',
    selected ? 'frencia-tag--selected' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot ? <span className="frencia-tag__dot"></span> : null}
      {children}
    </span>
  );
}
