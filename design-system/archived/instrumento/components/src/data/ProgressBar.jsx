import React from 'react';

const CSS = `
.frencia-progress { display: flex; flex-direction: column; gap: 8px; }
.frencia-progress__head { display: flex; justify-content: space-between; align-items: baseline; }
.frencia-progress__label {
  font: var(--text-label); letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--text-tertiary);
}
.frencia-progress__val { font-family: var(--font-sans); font-weight: var(--fw-semibold); font-size: 12px; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.frencia-progress__track {
  position: relative; height: var(--h); background: var(--data-track); border-radius: var(--radius-xs); overflow: hidden;
}
.frencia-progress__fill {
  height: 100%; border-radius: var(--radius-xs);
  background: var(--fill); transition: width var(--dur-slow) var(--ease-out);
}
/* Segmentado: una marca por unidad, como una escala */
.frencia-progress--segmented .frencia-progress__track { display: flex; gap: 3px; background: transparent; border-radius: 0; overflow: visible; }
.frencia-progress__seg { flex: 1; height: 100%; border-radius: var(--radius-xs); background: var(--data-track); }
.frencia-progress__seg--on { background: var(--fill); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-progress-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-progress-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const FILL = { accent: 'var(--accent)', signal: 'var(--signal)', intensity: 'var(--intensity)', green: 'var(--accent)', orange: 'var(--intensity)' };

/** Barra de avance: continua o segmentada (series hechas). Por defecto en tinta. */
export function ProgressBar({ value = 0, max = 100, label, showValue = false, tone = 'accent', size = 'md', segments, className = '', ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = size === 'sm' ? '3px' : size === 'lg' ? '8px' : '4px';
  const cls = ['frencia-progress', segments ? 'frencia-progress--segmented' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ '--h': h, '--fill': FILL[tone] || FILL.accent }} {...rest}>
      {(label || showValue) ? (
        <div className="frencia-progress__head">
          {label ? <span className="frencia-progress__label">{label}</span> : <span></span>}
          {showValue ? <span className="frencia-progress__val">{segments ? `${value}/${segments}` : `${Math.round(pct)}%`}</span> : null}
        </div>
      ) : null}
      <div className="frencia-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={segments || max} aria-valuenow={value}>
        {segments
          ? Array.from({ length: segments }).map((_, i) => (
              <div key={i} className={`frencia-progress__seg ${i < value ? 'frencia-progress__seg--on' : ''}`}></div>
            ))
          : <div className="frencia-progress__fill" style={{ width: `${pct}%` }}></div>}
      </div>
    </div>
  );
}
