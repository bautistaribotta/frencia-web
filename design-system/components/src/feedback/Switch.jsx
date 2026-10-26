import React from 'react';

const CSS = `
.frencia-switch {
  position: relative; display: inline-flex; align-items: center;
  width: 50px; height: 30px; border-radius: var(--radius-pill);
  background: var(--surface-chip); border: 1px solid var(--border-default);
  cursor: pointer; padding: 0; flex-shrink: 0;
  transition: background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.frencia-switch__thumb {
  position: absolute; left: 3px; width: 22px; height: 22px; border-radius: 50%;
  background: var(--text-secondary); box-shadow: var(--shadow-sm);
  transition: transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out);
}
.frencia-switch--on { background: var(--accent); border-color: var(--accent); }
.frencia-switch--on .frencia-switch__thumb { transform: translateX(20px); background: var(--text-on-accent); }
.frencia-switch:disabled { cursor: not-allowed; border-color: var(--border-subtle); }
.frencia-switch:disabled .frencia-switch__thumb { background: var(--text-disabled); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-switch-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-switch-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Interruptor iOS. Encendido = pista de tinta. */
export function Switch({ checked = false, onChange, disabled = false, className = '', ...rest }) {
  const cls = ['frencia-switch', checked ? 'frencia-switch--on' : '', className].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cls}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!checked)}
      {...rest}
    >
      <span className="frencia-switch__thumb"></span>
    </button>
  );
}
