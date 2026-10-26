import React from 'react';

const CSS = `
.frencia-iso{display:flex;flex-direction:column;gap:18px;padding:20px;border-radius:var(--radius-xl);background:var(--surface-card);border:1px solid var(--glass-line);box-shadow:var(--shadow-glass);-webkit-backdrop-filter:blur(var(--blur-glass)) saturate(1.5);backdrop-filter:blur(var(--blur-glass)) saturate(1.5);transition:border-color var(--dur-base) var(--ease-out)}
.frencia-iso--running{border-color:var(--surface-intensity-line)}
.frencia-iso__top{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.frencia-iso__cap{font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:11px;font-variation-settings:var(--vs-semi);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-tertiary);display:inline-flex;align-items:center;gap:8px}
.frencia-iso--running .frencia-iso__cap{color:var(--intensity-text)}
.frencia-iso__live{width:6px;height:6px;border-radius:50%;background:var(--intensity);animation:frencia-iso-pulse 1.2s ease-in-out infinite}
@keyframes frencia-iso-pulse{50%{opacity:.3}}
.frencia-iso__target{white-space:nowrap;font-family:var(--font-sans);font-size:13px;color:var(--text-tertiary)}
.frencia-iso__target b{color:var(--text-primary);font-weight:var(--fw-semibold);font-variant-numeric:tabular-nums}
.frencia-iso__digits{font-family:var(--font-sans);font-weight:var(--fw-medium);font-variation-settings:var(--vs-condensed);letter-spacing:-0.02em;font-variant-numeric:tabular-nums;font-size:80px;line-height:.92;letter-spacing:-0.04em;color:var(--text-primary)}
.frencia-iso--idle .frencia-iso__digits{color:var(--text-disabled)}
.frencia-iso__bar{position:relative;height:4px;border-radius:var(--radius-xs);background:var(--data-track);overflow:visible;margin-top:6px}
.frencia-iso__fill{position:absolute;left:0;top:0;bottom:0;border-radius:var(--radius-xs);background:var(--intensity)}
.frencia-iso__tick{position:absolute;top:-7px;bottom:-7px;width:1px;background:var(--text-primary)}
.frencia-iso__tick::after{content:'';position:absolute;top:-4px;left:-3px;width:7px;height:4px;background:var(--text-primary);clip-path:polygon(0 0,100% 0,50% 100%)}
.frencia-iso__note{font-family:var(--font-sans);font-size:13px;color:var(--text-secondary);min-height:18px;font-variant-numeric:tabular-nums}
.frencia-iso__note--over{color:var(--intensity-text)}
.frencia-iso__btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:54px;border:1px solid transparent;border-radius:var(--radius-lg);cursor:pointer;font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:16px;-webkit-tap-highlight-color:transparent;transition:transform var(--dur-fast) var(--ease-out),background-color var(--dur-fast) var(--ease-out)}
.frencia-iso__btn:active{transform:scale(var(--press-scale))}
.frencia-iso__btn svg{width:18px;height:18px;stroke-width:2}
.frencia-iso__btn--go{background:var(--accent);color:var(--text-on-accent);box-shadow:var(--halo-accent)}
.frencia-iso__btn--go:hover{background:var(--accent-hover)}
.frencia-iso__btn--stop{background:var(--intensity);color:var(--text-on-intensity)}
.frencia-iso__row{display:flex;gap:10px;align-items:center;justify-content:space-between}
.frencia-iso__link{border:none;background:transparent;color:var(--signal-text);font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:14px;cursor:pointer;padding:10px 4px;display:inline-flex;align-items:center;gap:6px}
.frencia-iso__link svg{width:16px;height:16px;stroke-width:1.75}
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-iso-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-iso-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const pad = (n) => String(n).padStart(2, '0');
const clock = (sec) => {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};
const Ic = ({ name }) => <span key={name} style={{ display: 'inline-flex' }}><i data-lucide={name}></i></span>;

/**
 * Cronómetro de esfuerzo para isométricos. Cuenta hacia arriba contra el
 * objetivo del plan; al frenar completa la duración de la serie, que queda
 * editable. Opuesto visual al RestRing: barra y no anillo, sube y no baja,
 * tinta (esfuerzo) y no lume (pausa).
 */
export function IsoTimer({ target, value, onChange, initialPhase = 'idle', initialElapsed = 0, className = '', ...rest }) {
  const [phase, setPhase] = React.useState(initialPhase);
  const [elapsed, setElapsed] = React.useState(initialElapsed * 1000);
  const startRef = React.useRef(Date.now() - initialElapsed * 1000);
  const [loaded, setLoaded] = React.useState(value != null ? value : (initialPhase === 'done' ? initialElapsed : null));
  const set = (sec) => { setLoaded(sec); onChange && onChange(sec); };

  React.useEffect(() => {
    if (phase !== 'running') return undefined;
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 100);
    return () => clearInterval(id);
  }, [phase]);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); }, [phase]);

  const start = () => { startRef.current = Date.now(); setElapsed(0); setPhase('running'); };
  const stop = () => {
    const sec = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    setElapsed(sec * 1000); setPhase('done');
    set(sec);
  };

  const DurationField = (window.FrenciaDesignSystem_377129 || {}).DurationField;
  const sec = elapsed / 1000;
  const scale = target ? Math.max(target * 1.2, sec) : 0;
  const fillPct = target ? Math.min(100, (sec / scale) * 100) : 0;
  const tickPct = target ? (target / scale) * 100 : 0;
  const over = target && sec >= target;

  let note = '';
  if (phase === 'running' && target) note = over ? `+${clock(sec - target)} sobre el objetivo` : `Faltan ${clock(Math.ceil(target - sec))}`;
  if (phase === 'idle') note = 'Arrancá cuando estés en posición.';

  const cls = ['frencia-iso', `frencia-iso--${phase}`, className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="frencia-iso__top">
        <span className="frencia-iso__cap">{phase === 'running' ? <span className="frencia-iso__live"></span> : null}{phase === 'running' ? 'Esfuerzo · contando' : phase === 'done' ? 'Esfuerzo · registrado' : 'Esfuerzo'}</span>
        <span className="frencia-iso__target">Objetivo <b>{target ? clock(target) : '—'}</b></span>
      </div>

      {phase === 'done' && DurationField ? (
        <DurationField label="Duración de la serie" value={value != null ? value : loaded} onChange={set} step={5} size="lg" fullWidth />
      ) : (
        <>
          <span className="frencia-iso__digits" aria-live="off">{clock(sec)}</span>
          {target ? (
            <div className="frencia-iso__bar" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.floor(sec)}>
              <span className="frencia-iso__fill" style={{ width: fillPct + '%' }}></span>
              <span className="frencia-iso__tick" style={{ left: tickPct + '%' }}></span>
            </div>
          ) : null}
          <span className={'frencia-iso__note' + (over && phase === 'running' ? ' frencia-iso__note--over' : '')}>{note}</span>
        </>
      )}

      {phase === 'idle' ? (
        <button type="button" className="frencia-iso__btn frencia-iso__btn--go" onClick={start}><Ic name="play" />Empezar</button>
      ) : phase === 'running' ? (
        <button type="button" className="frencia-iso__btn frencia-iso__btn--stop" onClick={stop}><Ic name="square" />Frenar</button>
      ) : (
        <div className="frencia-iso__row">
          <span className="frencia-iso__note">Corregilo si hace falta.</span>
          <button type="button" className="frencia-iso__link" onClick={start}><Ic name="rotate-ccw" />Volver a medir</button>
        </div>
      )}
    </div>
  );
}
