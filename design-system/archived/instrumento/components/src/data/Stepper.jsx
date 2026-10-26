import React from 'react';

const CSS = `
.frencia-stepper { display: inline-flex; flex-direction: column; gap: 8px; }
.frencia-stepper__label {
  font: var(--text-label); letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--text-tertiary);
}
.frencia-stepper__row {
  display: inline-flex; align-items: stretch;
  background: var(--surface-inset); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md); overflow: hidden;
}
.frencia-stepper__btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; border: none; background: transparent; padding: 0;
  color: var(--text-primary); cursor: pointer; flex-shrink: 0;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.frencia-stepper__btn:first-child { border-right: 1px solid var(--border-subtle); }
.frencia-stepper__btn:last-child { border-left: 1px solid var(--border-subtle); }
.frencia-stepper__btn:hover:not(:disabled) { background: var(--surface-chip); }
.frencia-stepper__btn:active:not(:disabled) { background: var(--surface-card-elevated); }
.frencia-stepper__btn:disabled { color: var(--text-disabled); cursor: not-allowed; }
.frencia-stepper__btn svg { width: 18px; height: 18px; stroke-width: 1.75; }
.frencia-stepper__val {
  min-width: 72px; display: flex; align-items: center; justify-content: center; gap: 4px;
  font-family: var(--font-sans); font-weight: var(--fw-medium); font-size: 24px; letter-spacing: -0.02em;
  font-variation-settings: var(--vs-condensed);
  color: var(--text-primary); font-variant-numeric: tabular-nums;
}
.frencia-stepper__unit { font-size: 12px; color: var(--text-tertiary); font-weight: var(--fw-medium); letter-spacing: 0; font-variation-settings: var(--vs-normal); }
.frencia-stepper--lg .frencia-stepper__val { font-size: 30px; min-width: 88px; }
.frencia-stepper--lg .frencia-stepper__btn { height: 58px; width: 58px; }
.frencia-stepper--full { display: flex; width: 100%; }
.frencia-stepper--full .frencia-stepper__row { display: flex; width: 100%; }
.frencia-stepper--full .frencia-stepper__val { flex: 1; min-width: 0; }
.frencia-stepper--full .frencia-stepper__btn { width: 44px; flex-shrink: 0; }
.frencia-stepper--full.frencia-stepper--lg .frencia-stepper__btn { width: 52px; }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-stepper-css-v3')) {
  const s = document.createElement('style');
  s.id = 'frencia-stepper-css-v3'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Paso numerico para reps y carga: valor condensado y tabular entre - y +. */
export function Stepper({ label, value, onChange, step = 1, min = 0, max = Infinity, unit, size = 'md', precision = 0, format, fullWidth = false, className = '', ...rest }) {
  const set = (next) => {
    const clamped = Math.max(min, Math.min(max, next));
    onChange && onChange(Number(clamped.toFixed(precision)));
  };
  const shown = format ? format(value) : value;
  const cls = ['frencia-stepper', `frencia-stepper--${size}`, fullWidth ? 'frencia-stepper--full' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {label ? <span className="frencia-stepper__label">{label}</span> : null}
      <div className="frencia-stepper__row">
        <button className="frencia-stepper__btn" onClick={() => set(value - step)} disabled={value <= min} aria-label="menos">
          <i data-lucide="minus"></i>
        </button>
        <span className="frencia-stepper__val" aria-live="polite">{shown}{unit ? <span className="frencia-stepper__unit">{unit}</span> : null}</span>
        <button className="frencia-stepper__btn" onClick={() => set(value + step)} disabled={value >= max} aria-label="más">
          <i data-lucide="plus"></i>
        </button>
      </div>
    </div>
  );
}
