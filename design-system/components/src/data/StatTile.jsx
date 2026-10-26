import React from 'react';

const CSS = `
.frencia-stat { display: flex; flex-direction: column; gap: 8px; }
.frencia-stat__label {
  font: var(--text-label); letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--text-tertiary);
}
.frencia-stat__value {
  font-family: var(--font-display); font-weight: var(--fw-medium); font-variation-settings: var(--vs-condensed);
  letter-spacing: var(--ls-display); color: var(--text-primary); font-variant-numeric: tabular-nums;
  line-height: 0.95; display: flex; align-items: baseline; gap: 6px;
}
.frencia-stat--signal .frencia-stat__value { color: var(--signal-text); }
.frencia-stat--intensity .frencia-stat__value { color: var(--intensity-text); }
.frencia-stat__unit { font-family: var(--font-sans); font-weight: var(--fw-medium); font-variation-settings: var(--vs-normal); letter-spacing: 0; color: var(--text-tertiary); }
.frencia-stat--sm .frencia-stat__value { font-size: 30px; } .frencia-stat--sm .frencia-stat__unit { font-size: 13px; }
.frencia-stat--md .frencia-stat__value { font-size: 44px; } .frencia-stat--md .frencia-stat__unit { font-size: 15px; }
.frencia-stat--lg .frencia-stat__value { font-size: 64px; } .frencia-stat--lg .frencia-stat__unit { font-size: 18px; }
.frencia-stat--xl .frencia-stat__value { font-size: 84px; } .frencia-stat--xl .frencia-stat__unit { font-size: 22px; }
.frencia-stat__delta {
  display: inline-flex; align-items: center; gap: 2px; margin-left: 4px;
  font-family: var(--font-sans); font-weight: var(--fw-semibold); font-size: 13px; letter-spacing: 0;
  font-variation-settings: var(--vs-normal);
}
.frencia-stat__delta--up { color: var(--signal-text); }
.frencia-stat__delta--down { color: var(--danger-text); }
.frencia-stat__delta svg { width: 13px; height: 13px; stroke-width: 2; }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-stat-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-stat-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const ALIAS = { green: 'signal', orange: 'intensity' };

/** El numero como mensaje: cifra condensada y tabular, rotulo en mayusculas, unidad atenuada. */
export function StatTile({ label, value, unit, delta, deltaDir, size = 'md', tone = 'default', className = '', ...rest }) {
  const t = ALIAS[tone] || tone;
  const cls = ['frencia-stat', `frencia-stat--${size}`, t !== 'default' ? `frencia-stat--${t}` : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {label ? <span className="frencia-stat__label">{label}</span> : null}
      <span className="frencia-stat__value">
        {value}{unit ? <span className="frencia-stat__unit">{unit}</span> : null}
        {delta != null ? (
          <span className={`frencia-stat__delta frencia-stat__delta--${deltaDir === 'down' ? 'down' : 'up'}`}>
            <i data-lucide={deltaDir === 'down' ? 'arrow-down-right' : 'arrow-up-right'}></i>{delta}
          </span>
        ) : null}
      </span>
    </div>
  );
}
