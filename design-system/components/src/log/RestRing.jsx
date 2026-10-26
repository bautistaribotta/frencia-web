import React from 'react';

const CSS = `
.frencia-rest{display:flex;align-items:center;gap:18px;padding:14px 16px 14px 14px;border-radius:var(--radius-xl);background:var(--surface-card);border:1px solid var(--glass-line);box-shadow:var(--shadow-glass);-webkit-backdrop-filter:blur(var(--blur-glass)) saturate(1.5);backdrop-filter:blur(var(--blur-glass)) saturate(1.5);}
.frencia-rest__ring{position:relative;flex-shrink:0}
.frencia-rest__ring svg{display:block}
.frencia-rest__num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.frencia-rest__digits{font-family:var(--font-sans);font-weight:var(--fw-medium);font-variation-settings:var(--vs-condensed);letter-spacing:-0.02em;font-variant-numeric:tabular-nums;font-size:26px;color:var(--text-primary)}
.frencia-rest__of{font-family:var(--font-sans);font-size:10.5px;color:var(--text-tertiary);font-variant-numeric:tabular-nums}
.frencia-rest__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}
.frencia-rest__cap{font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:11px;font-variation-settings:var(--vs-semi);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-tertiary);color:var(--signal-text)}
.frencia-rest__next{font-family:var(--font-sans);font-size:14px;color:var(--text-secondary);line-height:1.35}
.frencia-rest__acts{display:flex;flex-wrap:wrap;gap:8px}
.frencia-rest__btn{height:40px;padding:0 14px;border-radius:var(--radius-lg);border:1px solid var(--glass-line);background:var(--surface-card);color:var(--text-primary);font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:14px;white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent;font-variant-numeric:tabular-nums}
.frencia-rest__btn:hover{background:var(--surface-chip)}
.frencia-rest__btn:active{transform:scale(var(--press-scale))}
.frencia-rest__tick{stroke:var(--data-tick)}
.frencia-rest__tick--major{stroke:var(--text-tertiary)}
.frencia-rest__tick--on{stroke:var(--signal)}
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-rest-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-rest-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const pad = (n) => String(n).padStart(2, '0');
const clock = (sec) => `${Math.floor(sec / 60)}:${pad(sec % 60)}`;

/** Descanso: esfera con 60 marcas y un arco de lume que se vacia. Cuenta regresiva; no se registra como dato de la serie. */
export function RestRing({ total = 120, remaining, running = true, next, onSkip, onDone, size = 108, className = '', ...rest }) {
  const [left, setLeft] = React.useState(remaining != null ? remaining : total);
  const [tot, setTot] = React.useState(total);
  React.useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((l) => {
      if (l <= 1) { clearInterval(id); onDone && onDone(); return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running]);

  const stroke = 3, r = (size - 18) / 2, c = 2 * Math.PI * r;
  const frac = tot ? left / tot : 0;
  const cx = size / 2;
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
    const major = i % 5 === 0;
    const r1 = size / 2 - 1, r2 = r1 - (major ? 5 : 3);
    const on = i / 60 < frac;
    ticks.push(<line key={i} x1={cx + r1 * Math.cos(a)} y1={cx + r1 * Math.sin(a)} x2={cx + r2 * Math.cos(a)} y2={cx + r2 * Math.sin(a)}
      className={'frencia-rest__tick' + (on ? ' frencia-rest__tick--on' : major ? ' frencia-rest__tick--major' : '')} strokeWidth={1} />);
  }
  return (
    <div className={['frencia-rest', className].filter(Boolean).join(' ')} {...rest}>
      <div className="frencia-rest__ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} aria-hidden="true">
          {ticks}
          <circle cx={cx} cy={cx} r={r - 6} fill="none" stroke="var(--data-track)" strokeWidth={stroke} />
          <circle cx={cx} cy={cx} r={r - 6} fill="none" stroke="var(--signal)" strokeWidth={stroke} strokeLinecap="butt"
            strokeDasharray={2 * Math.PI * (r - 6)} strokeDashoffset={2 * Math.PI * (r - 6) * (1 - frac)} transform={`rotate(-90 ${cx} ${cx})`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="frencia-rest__num">
          <span className="frencia-rest__digits">{clock(left)}</span>
          <span className="frencia-rest__of">de {clock(tot)}</span>
        </div>
      </div>
      <div className="frencia-rest__body">
        <span className="frencia-rest__cap">Descanso</span>
        {next ? <span className="frencia-rest__next">{next}</span> : null}
        <div className="frencia-rest__acts">
          <button type="button" className="frencia-rest__btn" onClick={() => { setLeft((l) => l + 15); setTot((t) => t + 15); }}>+15 s</button>
          <button type="button" className="frencia-rest__btn" onClick={onSkip}>Saltar</button>
        </div>
      </div>
    </div>
  );
}
