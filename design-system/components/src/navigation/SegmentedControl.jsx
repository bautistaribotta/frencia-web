import React from 'react';

const CSS = `
.frencia-seg {
  display: inline-flex; padding: 3px; gap: 2px;
  background: var(--surface-card); border-radius: var(--radius-md);
  border: 1px solid var(--glass-line); -webkit-backdrop-filter: blur(var(--blur-glass)) saturate(1.5); backdrop-filter: blur(var(--blur-glass)) saturate(1.5);
}
.frencia-seg--full { display: flex; width: 100%; }
.frencia-seg__opt {
  flex: 1; border: 1px solid transparent; cursor: pointer; white-space: nowrap;
  height: 36px; padding: 0 14px; border-radius: 11px;
  font-family: var(--font-sans); font-weight: var(--fw-semibold); font-size: 14px;
  background: transparent; color: var(--text-tertiary);
  transition: background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
  -webkit-tap-highlight-color: transparent; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}
.frencia-seg__opt svg { width: 16px; height: 16px; stroke-width: 1.75; }
.frencia-seg__opt:hover { color: var(--text-secondary); }
.frencia-seg__opt--active, .frencia-seg__opt--active:hover { background: var(--surface-card-elevated); color: var(--text-primary); border-color: var(--glass-line); box-shadow: var(--shadow-glass); }
.frencia-seg--accent .frencia-seg__opt--active { background: var(--accent); color: var(--text-on-accent); border-color: var(--accent); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-seg-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-seg-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Control segmentado iOS. accent = la opcion elegida en tinta. */
export function SegmentedControl({ options = [], value, onChange, fullWidth = false, accent = false, className = '', ...rest }) {
  const cls = ['frencia-seg', fullWidth ? 'frencia-seg--full' : '', accent ? 'frencia-seg--accent' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} role="tablist" {...rest}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        const icon = typeof opt === 'string' ? null : opt.icon;
        return (
          <button
            key={val}
            role="tab"
            aria-selected={val === value}
            className={`frencia-seg__opt ${val === value ? 'frencia-seg__opt--active' : ''}`}
            onClick={() => onChange && onChange(val)}
          >
            {icon ? <i data-lucide={icon}></i> : null}{lbl}
          </button>
        );
      })}
    </div>
  );
}
