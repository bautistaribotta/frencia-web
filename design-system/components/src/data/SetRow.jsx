import React from 'react';

const CSS = `
.frencia-setrow {
  display: flex; align-items: center; gap: 14px;
  min-height: 60px; padding: 0 12px 0 16px; border-radius: var(--radius-lg);
  background: var(--surface-card); border: 1px solid var(--glass-line); box-shadow: var(--shadow-glass);
  -webkit-backdrop-filter: blur(var(--blur-glass)) saturate(1.5); backdrop-filter: blur(var(--blur-glass)) saturate(1.5);
  transition: background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
}
.frencia-setrow--active { border-color: var(--surface-signal-line); background: var(--surface-card-elevated); box-shadow: var(--shadow-glass), 0 0 0 1px var(--surface-signal-line); }
.frencia-setrow__idx {
  width: 22px; flex-shrink: 0; text-align: left;
  font-family: var(--font-sans); font-weight: var(--fw-semibold); font-size: 13px;
  color: var(--text-tertiary); font-variant-numeric: tabular-nums;
}
.frencia-setrow--active .frencia-setrow__idx { color: var(--signal-text); }
.frencia-setrow__main { flex: 1; display: flex; align-items: baseline; gap: 8px; }
.frencia-setrow__load, .frencia-setrow__reps {
  font-family: var(--font-sans); font-weight: var(--fw-medium); font-size: 22px; letter-spacing: -0.02em;
  font-variation-settings: var(--vs-condensed); color: var(--text-primary); font-variant-numeric: tabular-nums;
}
.frencia-setrow__x { color: var(--text-tertiary); font-size: 14px; }
.frencia-setrow__unit { font-family: var(--font-sans); font-size: 12px; font-weight: var(--fw-medium); letter-spacing: 0; color: var(--text-tertiary); margin-left: 3px; font-variation-settings: var(--vs-normal); }
.frencia-setrow--pending .frencia-setrow__load, .frencia-setrow--pending .frencia-setrow__reps { color: var(--text-secondary); }
.frencia-setrow__meta { display: flex; align-items: center; gap: 10px; }
.frencia-setrow__rir {
  font-family: var(--font-sans); font-weight: var(--fw-semibold); font-size: 11px; font-variation-settings: var(--vs-semi);
  letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--intensity-text); white-space: nowrap;
}
.frencia-setrow__check {
  width: 36px; height: 36px; flex-shrink: 0; border-radius: var(--radius-circle);
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border-strong); background: transparent; cursor: pointer;
  color: transparent; padding: 0;
  transition: all var(--dur-base) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.frencia-setrow__check:active { transform: scale(0.95); }
.frencia-setrow__check svg { width: 18px; height: 18px; stroke-width: 2.25; }
.frencia-setrow--active .frencia-setrow__check { border-color: var(--signal); }
.frencia-setrow--done .frencia-setrow__check { background: var(--accent); border-color: var(--accent); color: var(--text-on-accent); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-setrow-css-v2')) {
  const s = document.createElement('style');
  s.id = 'frencia-setrow-css-v2'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Una serie: numero · carga × reps · RIR · marca de hecha. Hecha = circulo de tinta. */
export function SetRow({ index, load, reps, unit = 'kg', rir, state = 'pending', onToggle, className = '', ...rest }) {
  const cls = ['frencia-setrow', `frencia-setrow--${state}`, className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <span className="frencia-setrow__idx">{String(index).padStart(2, '0')}</span>
      <div className="frencia-setrow__main">
        <span className="frencia-setrow__load">{load}<span className="frencia-setrow__unit">{unit}</span></span>
        <span className="frencia-setrow__x">×</span>
        <span className="frencia-setrow__reps">{reps}<span className="frencia-setrow__unit">reps</span></span>
      </div>
      <div className="frencia-setrow__meta">
        {rir != null ? <span className="frencia-setrow__rir">RIR {rir}</span> : null}
        <button className="frencia-setrow__check" onClick={onToggle} aria-label="completar serie" aria-pressed={state === 'done'}>
          <i data-lucide="check"></i>
        </button>
      </div>
    </div>
  );
}
