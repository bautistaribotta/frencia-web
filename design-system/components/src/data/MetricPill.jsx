import React from 'react';

const CSS = `
.frencia-metricpill {
  display: inline-flex; align-items: center; gap: 10px;
  height: 44px; padding: 0 14px; border-radius: var(--radius-md);
  background: var(--surface-card); border: 1px solid var(--glass-line); -webkit-backdrop-filter: blur(var(--blur-glass)) saturate(1.5); backdrop-filter: blur(var(--blur-glass)) saturate(1.5);
}
.frencia-metricpill svg { width: 16px; height: 16px; stroke-width: 1.75; color: var(--text-tertiary); }
.frencia-metricpill__body { display: flex; flex-direction: column; gap: 3px; line-height: 1; }
.frencia-metricpill__label {
  font: var(--text-label); font-size: 9.5px; font-variation-settings: var(--vs-semi);
  letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--text-tertiary);
}
.frencia-metricpill__value { font-family: var(--font-sans); font-weight: var(--fw-semibold); font-size: 15px; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.frencia-metricpill--inline { height: 34px; padding: 0 12px; }
.frencia-metricpill--inline .frencia-metricpill__body { flex-direction: row; align-items: baseline; gap: 6px; }
.frencia-metricpill--signal { background: var(--surface-signal-soft); border-color: var(--surface-signal-line); }
.frencia-metricpill--signal svg, .frencia-metricpill--signal .frencia-metricpill__value { color: var(--signal-text); }
.frencia-metricpill--intensity { background: var(--surface-intensity-soft); border-color: var(--surface-intensity-line); }
.frencia-metricpill--intensity svg, .frencia-metricpill--intensity .frencia-metricpill__value { color: var(--intensity-text); }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-metricpill-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-metricpill-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const ALIAS = { green: 'signal', orange: 'intensity' };

/** Chip de metrica: icono + rotulo + valor. Descanso, RIR, ritmo. */
export function MetricPill({ icon, label, value, tone = 'neutral', layout = 'stack', className = '', ...rest }) {
  const t = ALIAS[tone] || tone;
  const cls = ['frencia-metricpill', t !== 'neutral' ? `frencia-metricpill--${t}` : '', layout === 'inline' ? 'frencia-metricpill--inline' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {icon ? <i data-lucide={icon}></i> : null}
      <span className="frencia-metricpill__body">
        {label ? <span className="frencia-metricpill__label">{label}</span> : null}
        <span className="frencia-metricpill__value">{value}</span>
      </span>
    </span>
  );
}
