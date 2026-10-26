import React from 'react';

const CSS = `
.frencia-sc{display:flex;flex-direction:column;gap:8px}
.frencia-sc__title{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:0 2px}
.frencia-sc__t{font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:11px;font-variation-settings:var(--vs-semi);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-tertiary)}
.frencia-sc__grid{display:grid;align-items:center;column-gap:0;border-radius:var(--radius-lg);background:var(--surface-card);border:1px solid var(--border-subtle);padding:4px 6px 6px}
.frencia-sc__h{font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:11px;font-variation-settings:var(--vs-semi);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-tertiary);font-size:10px;padding:10px 8px 8px;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-bottom:1px solid var(--divider)}
.frencia-sc__h small{font-size:10px;color:var(--text-disabled);margin-left:3px;letter-spacing:0;text-transform:none;font-weight:var(--fw-medium)}
.frencia-sc__rl{font-family:var(--font-sans);font-weight:var(--fw-medium);font-size:12px;color:var(--text-tertiary);padding:0 8px;white-space:nowrap}
.frencia-sc__c{font-family:var(--font-sans);font-weight:var(--fw-medium);font-size:15px;color:var(--text-secondary);font-variant-numeric:tabular-nums;text-align:right;padding:11px 8px;white-space:nowrap;border-radius:var(--radius-xs)}
.frencia-sc__c--dash{color:var(--text-disabled)}
.frencia-sc__c--int{color:var(--intensity-text)}
.frencia-sc__band{grid-column:1 / -1;display:contents}
.frencia-sc__today{background:var(--surface-inset)}
.frencia-sc__today.frencia-sc__rl{color:var(--signal-text);font-weight:var(--fw-semibold);border-radius:var(--radius-sm) 0 0 var(--radius-sm);align-self:stretch;display:flex;align-items:center}
.frencia-sc__today.frencia-sc__c{font-family:var(--font-sans);font-weight:var(--fw-medium);font-variation-settings:var(--vs-condensed);letter-spacing:-0.02em;font-variant-numeric:tabular-nums;font-size:20px;color:var(--text-primary);border-radius:0}
.frencia-sc__today.frencia-sc__c--last{border-radius:0 var(--radius-sm) var(--radius-sm) 0}
.frencia-sc__today.frencia-sc__c--dash{color:var(--text-disabled)}
.frencia-sc__today.frencia-sc__c--int{color:var(--intensity-text)}
.frencia-sc__c--active{box-shadow:inset 0 -2px 0 var(--signal)}
.frencia-sc--dense .frencia-sc__c{font-size:14px;padding:10px 4px}
.frencia-sc--dense .frencia-sc__today.frencia-sc__c{font-size:17px}
.frencia-sc--dense .frencia-sc__h{padding:10px 4px 8px}
.frencia-sc--dense .frencia-sc__rl{padding:0 4px}
.frencia-sc--dense .frencia-sc__h small{display:block;margin:2px 0 0}
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-sc-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-sc-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Grilla Plan / Anterior / Hoy de una serie. Las columnas salen de los datos
 * que registra el ejercicio (2 a 4 + intensidad); las unidades van en el
 * encabezado para que las celdas entren en 375 px. El plan nunca trae peso.
 */
export function SerieComparativa({ exercise, plan = {}, previous, today = {}, intensity, prefs, activeKey, title, className = '', ...rest }) {
  const M = (window.FrenciaDesignSystem_377129 || {}).ExerciseMetrics;
  if (!M) return null;
  const scale = intensity !== undefined ? intensity : plan.intensity;
  const cols = M.columns(exercise, prefs, scale);
  const pick = (row, k) => (row ? (k === 'int' ? row.intensityValue : row[k]) : null);
  const rows = [
    { key: 'plan', label: 'Plan', data: plan, planRow: true },
    { key: 'prev', label: 'Anterior', data: previous },
    { key: 'today', label: 'Hoy', data: today },
  ];
  const cls = ['frencia-sc', cols.length >= 4 ? 'frencia-sc--dense' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {title ? <div className="frencia-sc__title"><span className="frencia-sc__t">{title}</span></div> : null}
      <div className="frencia-sc__grid" style={{ gridTemplateColumns: `minmax(62px,auto) repeat(${cols.length}, minmax(0,1fr))` }}>
        <span className="frencia-sc__h" style={{ textAlign: 'left' }}></span>
        {cols.map((c) => <span key={c.key} className="frencia-sc__h">{c.label}{c.unit ? <small>{c.unit}</small> : null}</span>)}
        {rows.map((r) => {
          const t = r.key === 'today' ? ' frencia-sc__today' : '';
          return (
            <React.Fragment key={r.key}>
              <span className={'frencia-sc__rl' + t}>{r.label}</span>
              {cols.map((c, i) => {
                const raw = r.planRow && c.key === 'peso' ? null : pick(r.data, c.key);
                const txt = M.value(c.key, raw, exercise, prefs, 'table');
                const dash = txt === M.DASH;
                const k = ['frencia-sc__c', t, dash ? ' frencia-sc__c--dash' : '', !dash && c.key === 'int' ? ' frencia-sc__c--int' : '',
                  i === cols.length - 1 ? ' frencia-sc__c--last' : '', r.key === 'today' && activeKey === c.key ? ' frencia-sc__c--active' : ''].join('');
                return <span key={c.key} className={k}>{txt}</span>;
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
