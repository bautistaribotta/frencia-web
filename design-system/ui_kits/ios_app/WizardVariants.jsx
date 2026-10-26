// Wizard de sesión para isométricos y cardio: variantes de ubicación de "Saltar serie".
// Estructura tomada de src/app/session.tsx (header Salir · progreso · menú; bloque; serie; barra Anterior/Siguiente).
const WZ = (() => {
  const NS = () => window.FrenciaDesignSystem_377129;
  const D = () => window.FRENCIA_TIPOS;
  const pad = (n) => String(n).padStart(2, '0');
  const clock = (s) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return h ? `${h}:${pad(m)}:${pad(x)}` : `${m}:${pad(x)}`; };
  const Ic = ({ name, size = 18 }) => <span key={name} style={{ display: 'inline-flex', width: size, height: size }}><i data-lucide={name} style={{ width: size, height: size }}></i></span>;

  const DATA = () => ({
    plancha: { ex: D().exercises.plancha, plan: { ...D().plans.plancha, intensity: 'RPE', intensityValue: 8 }, prev: { tiempo: 42, intensityValue: 8 }, cuando: 'hace 4 días', serie: 2, idx: 5, progress: [9, 14] },
    cinta: { ex: D().exercises.cinta, plan: D().plans.cinta, prev: D().session.cinta.previous, cuando: 'hace 6 días', serie: 1, idx: 7, progress: [13, 14] },
    press: { ex: D().exercises.press, plan: D().plans.press, prev: { peso: 82.5, reps: 10, intensityValue: 2 }, cuando: 'hace 4 días', serie: 2, idx: 1, progress: [3, 14] },
  });

  function Soft({ children, onClick, size = 'sm' }) {
    return (
      <button type="button" onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h-md)', padding: '0 12px', margin: '0 -12px 0 0', border: 'none', background: 'transparent', color: 'var(--signal-text)', font: `var(--fw-semibold) ${size === 'sm' ? 14 : 16}px var(--font-sans)`, borderRadius: 'var(--radius-md)', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: size === 'md' ? 'center' : undefined }}>
        <Ic name="skip-forward" size={16} />{children}
      </button>
    );
  }

  // Escala de la sesion: una marca por paso, la actual en senal.
  function Escala({ value, max }) {
    return (
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: max }, (_, i) => <span key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < value - 1 ? 'var(--text-primary)' : i === value - 1 ? 'var(--signal)' : 'var(--data-track)', boxShadow: i === value - 1 ? 'var(--halo-signal)' : 'none' }}></span>)}
      </div>
    );
  }

  function Shell({ d, children, nav, anchored, toast }) {
    const { IconButton } = NS();
    return (
      <div style={{ height: 768, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', padding: '4px 14px 0' }}>
          <IconButton icon="x" variant="ghost" size="md" aria-label="Salir" />
          <span style={{ justifySelf: 'center', font: 'var(--fw-semibold) 13px var(--font-sans)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>Día 1 <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>· {d.idx} / 7</span></span>
          <IconButton icon="ellipsis" variant="ghost" size="md" aria-label="Opciones del ejercicio" />
        </div>
        <div style={{ padding: '12px 24px 0' }}><Escala value={d.progress[0]} max={d.progress[1]} /></div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '28px 24px 16px', display: 'flex', flexDirection: 'column', gap: 24, justifyContent: anchored ? 'space-between' : 'flex-start' }}>
          {children}
        </div>
        {toast ? <div style={{ position: 'absolute', left: 24, right: 24, bottom: 96, padding: '14px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card-elevated)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)', font: 'var(--fw-medium) 14px var(--font-sans)', display: 'flex', justifyContent: 'space-between' }}><span>Serie salteada</span><b style={{ color: 'var(--signal-text)' }}>Deshacer</b></div> : null}
        <div style={{ display: 'flex', gap: 12, padding: '12px 24px 24px' }}>{nav}</div>
      </div>
    );
  }

  function Bloque({ d }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="frencia-label">Ejercicio {d.idx} de 7</span>
        <div style={{ font: 'var(--text-title)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-primary)' }}>{d.ex.name}</div>
      </div>
    );
  }

  function SerieHead({ d, skip, onSkip }) {
    const t = d.plan.sets === 1 ? 'Serie única' : `Serie ${d.serie} de ${d.plan.sets}`;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
        <span style={{ font: 'var(--text-subtitle)', letterSpacing: '-0.012em', color: 'var(--text-primary)' }}>{t}</span>
        {skip ? <Soft onClick={onSkip}>{d.plan.sets === 1 ? 'Saltar y terminar' : 'Saltar serie'}</Soft> : null}
      </div>
    );
  }

  // Plan / Anterior, sin fila Hoy (cardio e isométricos cargan en sus campos).
  function PlanGrid({ d, compact }) {
    const M = NS().ExerciseMetrics;
    const cols = M.columns(d.ex, D().prefs, d.plan.intensity);
    const rows = [['Plan', d.plan], ['Anterior', d.prev]];
    if (compact) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
          {rows.map(([l, r]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 10, font: 'var(--fw-medium) 14px var(--font-sans)', color: 'var(--text-secondary)' }}>
              <span className="frencia-label" style={{ width: 70 }}>{l}</span>
              {cols.map((c) => <span key={c.key} style={{ color: c.key === 'int' ? 'var(--intensity-text)' : undefined }}>{M.value(c.key, c.key === 'int' ? r.intensityValue : r[c.key], d.ex, D().prefs, 'table')}{c.key === 'int' ? ' RPE' : c.unit ? ' ' + c.unit : ''}</span>)}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="frencia-sc">
        <div className="frencia-sc__title"><span className="frencia-sc__t"></span><span className="frencia-sc__t" style={{ textTransform: 'none', letterSpacing: 0 }}>Anterior: {d.cuando}</span></div>
        <div className="frencia-sc__grid" style={{ gridTemplateColumns: `minmax(62px,auto) repeat(${cols.length}, minmax(0,1fr))` }}>
          <span className="frencia-sc__h"></span>
          {cols.map((c) => <span key={c.key} className="frencia-sc__h">{c.label}{c.unit ? <small>{c.unit}</small> : null}</span>)}
          {rows.map(([l, r]) => (
            <React.Fragment key={l}>
              <span className="frencia-sc__rl">{l}</span>
              {cols.map((c) => { const t = M.value(c.key, c.key === 'int' ? r.intensityValue : r[c.key], d.ex, D().prefs, 'table'); return <span key={c.key} className={'frencia-sc__c' + (t === M.DASH ? ' frencia-sc__c--dash' : c.key === 'int' ? ' frencia-sc__c--int' : '')}>{t}</span>; })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  const Rpe = ({ v, set }) => <NS_Stepper label="RPE · qué tan duro fue" value={v || 0} onChange={(x) => set(x || null)} min={0} max={10} format={(x) => (x ? String(x) : '—')} size="lg" fullWidth />;
  function NS_Stepper(p) { const { Stepper } = NS(); return <Stepper {...p} />; }

  function Nav({ first, primary, onPrimary, disabled, primaryIcon = 'arrow-right', dark }) {
    const { Button, IconButton } = NS();
    return (
      <>
        <IconButton icon="chevron-left" variant="surface" size="lg" disabled={first} aria-label="Anterior" />
        {dark ? (
          <Button key="stop" variant="intensity" size="lg" icon="square" onClick={onPrimary} style={{ flex: 1 }}>Frenar</Button>
        ) : (
          <Button key={primary} variant="primary" size="lg" iconRight={primaryIcon === 'play' ? undefined : primaryIcon} icon={primaryIcon === 'play' ? 'play' : undefined} disabled={disabled} onClick={onPrimary} style={{ flex: 1 }}>{primary}</Button>
        )}
      </>
    );
  }

  const useIcons = () => React.useEffect(() => { window.lucide && lucide.createIcons(); });
  const useSkip = () => { const [t, setT] = React.useState(false); return [t, () => { setT(true); setTimeout(() => setT(false), 2200); }]; };

  // Cronómetro que sube, controlado desde afuera (la barra de abajo).
  function useChrono(initialPhase = 'idle', initialElapsed = 0) {
    const [phase, setPhase] = React.useState(initialPhase);
    const [ms, setMs] = React.useState(initialElapsed * 1000);
    const t0 = React.useRef(Date.now() - initialElapsed * 1000);
    React.useEffect(() => { if (phase !== 'running') return undefined; const id = setInterval(() => setMs(Date.now() - t0.current), 200); return () => clearInterval(id); }, [phase]);
    return { phase, sec: ms / 1000, start: () => { t0.current = Date.now(); setMs(0); setPhase('running'); }, stop: () => { const s = Math.max(1, Math.round((Date.now() - t0.current) / 1000)); setMs(s * 1000); setPhase('done'); return s; }, reset: () => { setPhase('idle'); setMs(0); }, manual: () => setPhase('done') };
  }

  function BigClock({ sec, target, phase, size = 76 }) {
    const scale = Math.max(target * 1.2, sec);
    const over = sec >= target;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="frencia-label" style={{ color: phase === 'running' ? 'var(--intensity-text)' : undefined, display: 'inline-flex', gap: 7, alignItems: 'center' }}>{phase === 'running' ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--intensity)' }}></span> : null}{phase === 'running' ? 'Esfuerzo · contando' : 'Esfuerzo'}</span>
          <span style={{ font: '12px var(--font-sans)', color: 'var(--text-tertiary)' }}>Objetivo <b style={{ color: 'var(--text-secondary)' }}>{clock(target)}</b></span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.04em', fontVariationSettings: 'var(--vs-condensed)', fontSize: size, lineHeight: 0.9, color: phase === 'idle' ? 'var(--text-disabled)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{clock(sec)}</span>
        <div style={{ position: 'relative', height: 4, borderRadius: 2, background: 'var(--data-track)', marginTop: 4 }}>
          <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, (sec / scale) * 100) + '%', borderRadius: 2, background: 'var(--intensity)' }}></span>
          <span style={{ position: 'absolute', top: -7, bottom: -7, width: 1, left: (target / scale) * 100 + '%', background: 'var(--text-primary)' }}></span>
        </div>
        <span style={{ font: '12px var(--font-sans)', color: over && phase === 'running' ? 'var(--intensity-text)' : 'var(--text-secondary)', minHeight: 16 }}>{phase === 'idle' ? 'Arrancá cuando estés en posición.' : over ? `+${clock(sec - target)} sobre el objetivo` : `Faltan ${clock(Math.ceil(target - sec))}`}</span>
      </div>
    );
  }

  // ---------- Referencias del repo ----------
  function FuerzaActual() {
    useIcons();
    const d = DATA().press; const { SerieComparativa } = NS();
    const [t, skip] = useSkip();
    return (
      <Shell d={d} anchored toast={t} nav={<Nav first primary="Siguiente" disabled />}>
        <Bloque d={d} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SerieHead d={d} skip onSkip={skip} />
          <SerieComparativa exercise={d.ex} plan={d.plan} previous={d.prev} today={{}} prefs={D().prefs} activeKey="peso" />
        </div>
      </Shell>
    );
  }

  function IsoActual() {
    useIcons();
    const d = DATA().plancha; const { IsoTimer } = NS();
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const vacia = v.tiempo == null && v.rpe == null;
    return (
      <Shell d={d} toast={t} nav={<Nav primary="Siguiente" />}>
        <Bloque d={d} />
        <SerieHead d={d} />
        <PlanGrid d={d} />
        <IsoTimer target={d.plan.tiempo} value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x })} />
        <Rpe v={v.rpe} set={(x) => setV({ ...v, rpe: x })} />
        {vacia ? <Soft size="md" onClick={skip}>Saltar serie</Soft> : null}
      </Shell>
    );
  }

  function CardioActual() {
    useIcons();
    const d = DATA().cinta; const { DurationField, DistanceField } = NS();
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const vacia = v.tiempo == null && v.dist == null && v.rpe == null;
    return (
      <Shell d={d} toast={t} nav={<Nav primary="Terminar" primaryIcon={null} disabled={!v.tiempo} />}>
        <Bloque d={d} />
        <SerieHead d={d} />
        <PlanGrid d={d} />
        <DurationField label="Tiempo" value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x > 0 ? x : null })} step={60} allowHours size="lg" fullWidth />
        <DistanceField label="Distancia" value={v.dist} onChange={(x) => setV({ ...v, dist: x })} unit="km" size="lg" fullWidth />
        <Rpe v={v.rpe} set={(x) => setV({ ...v, rpe: x })} />
        {vacia ? <Soft size="md" onClick={skip}>Saltar y terminar</Soft> : null}
      </Shell>
    );
  }

  // ---------- Isométricos ----------
  // A · Mínimo cambio: mismo layout actual, Saltar sube al título de la serie.
  function IsoA() {
    useIcons();
    const d = DATA().plancha; const { IsoTimer } = NS();
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const vacia = v.tiempo == null && v.rpe == null;
    return (
      <Shell d={d} toast={t} nav={<Nav primary="Siguiente" />}>
        <Bloque d={d} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SerieHead d={d} skip={vacia} onSkip={skip} />
          <PlanGrid d={d} />
        </div>
        <IsoTimer target={d.plan.tiempo} value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x })} />
        <Rpe v={v.rpe} set={(x) => setV({ ...v, rpe: x })} />
      </Shell>
    );
  }

  // B · Anclado como fuerza: el cronómetro baja a la zona del pulgar y Empezar/Frenar vive en la barra.
  function IsoB({ initialPhase = 'idle', initialElapsed = 0 }) {
    useIcons();
    const d = DATA().plancha; const { DurationField } = NS();
    const c = useChrono(initialPhase, initialElapsed);
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const vacia = c.phase === 'idle' && v.rpe == null;
    const nav = c.phase === 'idle' ? <Nav primary="Empezar" primaryIcon="play" onPrimary={c.start} />
      : c.phase === 'running' ? <Nav dark onPrimary={() => setV({ ...v, tiempo: c.stop() })} />
      : <Nav primary="Siguiente" />;
    return (
      <Shell d={d} anchored toast={t} nav={nav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Bloque d={d} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SerieHead d={d} skip={vacia} onSkip={skip} />
            <PlanGrid d={d} />
          </div>
        </div>
        {c.phase === 'done' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DurationField label="Duración de la serie" value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x })} step={5} size="lg" fullWidth />
            <Rpe v={v.rpe} set={(x) => setV({ ...v, rpe: x })} />
            <button type="button" onClick={c.reset} style={{ alignSelf: 'flex-start', display: 'inline-flex', gap: 6, alignItems: 'center', border: 'none', background: 'transparent', color: 'var(--signal-text)', font: 'var(--fw-semibold) 14px var(--font-sans)', padding: '8px 0', cursor: 'pointer' }}><Ic name="rotate-ccw" size={16} />Volver a medir</button>
          </div>
        ) : (
          <div style={{ padding: 20, borderRadius: 'var(--radius-xl)', background: 'var(--surface-card-elevated)', border: '1px solid ' + (c.phase === 'running' ? 'var(--surface-intensity-line)' : 'var(--border-subtle)') }}>
            <BigClock sec={c.sec} target={d.plan.tiempo} phase={c.phase} />
          </div>
        )}
      </Shell>
    );
  }

  // C · Foco en el esfuerzo: referencia en dos líneas, reloj grande al centro, RPE de un toque al frenar.
  function IsoC({ initialPhase = 'idle', initialElapsed = 0 }) {
    useIcons();
    const d = DATA().plancha; const { DurationField } = NS();
    const c = useChrono(initialPhase, initialElapsed);
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const vacia = c.phase === 'idle';
    const nav = c.phase === 'idle' ? <Nav primary="Empezar" primaryIcon="play" onPrimary={c.start} />
      : c.phase === 'running' ? <Nav dark onPrimary={() => setV({ ...v, tiempo: c.stop() })} />
      : <Nav primary="Siguiente" />;
    return (
      <Shell d={d} toast={t} nav={nav}>
        <Bloque d={d} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SerieHead d={d} skip={vacia} onSkip={skip} />
          <PlanGrid d={d} compact />
        </div>
        {c.phase !== 'done' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <BigClock sec={c.sec} target={d.plan.tiempo} phase={c.phase} size={120} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <DurationField label="Duración de la serie" value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x })} step={5} size="lg" fullWidth />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="frencia-label">RPE · qué tan duro fue <span style={{ color: 'var(--text-disabled)' }}>· opcional</span></span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                  const on = v.rpe === n;
                  return <button key={n} type="button" onClick={() => setV({ ...v, rpe: on ? null : n })} style={{ height: 48, borderRadius: 'var(--radius-md)', border: '1px solid ' + (on ? 'var(--surface-intensity-line)' : 'var(--border-subtle)'), background: on ? 'var(--surface-intensity-soft)' : 'var(--surface-card)', color: on ? 'var(--intensity-text)' : 'var(--text-secondary)', font: 'var(--fw-bold) 16px var(--font-sans)', cursor: 'pointer' }}>{n}</button>;
                })}
              </div>
            </div>
          </div>
        )}
      </Shell>
    );
  }

  // ---------- Cardio ----------
  // A · Mínimo cambio: mismos campos, Saltar sube al título de la serie.
  function CardioA() {
    useIcons();
    const d = DATA().cinta; const { DurationField, DistanceField } = NS();
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const vacia = v.tiempo == null && v.dist == null && v.rpe == null;
    return (
      <Shell d={d} toast={t} nav={<Nav primary="Terminar" primaryIcon={null} disabled={!v.tiempo} />}>
        <Bloque d={d} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SerieHead d={d} skip={vacia} onSkip={skip} />
          <PlanGrid d={d} />
        </div>
        <DurationField label="Tiempo" value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x > 0 ? x : null })} step={60} allowHours size="lg" fullWidth />
        <DistanceField label="Distancia" value={v.dist} onChange={(x) => setV({ ...v, dist: x })} unit="km" size="lg" fullWidth />
        <Rpe v={v.rpe} set={(x) => setV({ ...v, rpe: x })} />
      </Shell>
    );
  }

  // B · Hoy en la grilla, como fuerza: la fila Hoy vuelve, se toca una celda y abajo aparece solo ese campo.
  function CardioB() {
    useIcons();
    const d = DATA().cinta; const { DurationField, DistanceField, SerieComparativa } = NS();
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const [act, setAct] = React.useState('tiempo');
    const vacia = v.tiempo == null && v.distancia == null && v.intensityValue == null;
    const tabs = [['tiempo', 'Tiempo'], ['distancia', 'Distancia'], ['int', 'RPE']];
    return (
      <Shell d={d} anchored toast={t} nav={<Nav primary="Terminar" primaryIcon={null} disabled={!v.tiempo} />}>
        <Bloque d={d} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SerieHead d={d} skip={vacia} onSkip={skip} />
          <SerieComparativa exercise={d.ex} plan={d.plan} previous={d.prev} today={v} prefs={D().prefs} activeKey={act} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 4, borderRadius: 'var(--radius-md)', background: 'var(--surface-chip)' }}>
            {tabs.map(([k, l]) => <button key={k} type="button" onClick={() => setAct(k)} style={{ height: 36, border: 'none', borderRadius: 'var(--radius-sm)', background: act === k ? 'var(--surface-card-elevated)' : 'transparent', color: act === k ? 'var(--text-primary)' : 'var(--text-secondary)', font: 'var(--fw-semibold) 13px var(--font-sans)', cursor: 'pointer' }}>{l}</button>)}
          </div>
          {act === 'tiempo' ? <DurationField key="t" label="Tiempo" value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x > 0 ? x : null })} step={60} allowHours size="lg" fullWidth />
            : act === 'distancia' ? <DistanceField key="d" label="Distancia" value={v.distancia} onChange={(x) => setV({ ...v, distancia: x })} unit="km" size="lg" fullWidth />
            : <Rpe key="r" v={v.intensityValue} set={(x) => setV({ ...v, intensityValue: x })} />}
        </div>
      </Shell>
    );
  }

  // C · Cronómetro en vivo: como el isométrico B, Empezar/Frenar en la barra; distancia y RPE al terminar.
  function CardioC({ initialPhase = 'idle', initialElapsed = 0 }) {
    useIcons();
    const d = DATA().cinta; const { DurationField, DistanceField } = NS();
    const c = useChrono(initialPhase, initialElapsed);
    const [v, setV] = React.useState({}); const [t, skip] = useSkip();
    const vacia = c.phase === 'idle';
    const target = d.plan.tiempo;
    const nav = c.phase === 'idle' ? <Nav primary="Empezar" primaryIcon="play" onPrimary={c.start} />
      : c.phase === 'running' ? <Nav dark onPrimary={() => setV({ ...v, tiempo: c.stop() })} />
      : <Nav primary="Terminar" primaryIcon={null} disabled={!v.tiempo} />;
    return (
      <Shell d={d} anchored toast={t} nav={nav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Bloque d={d} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SerieHead d={d} skip={vacia} onSkip={skip} />
            <PlanGrid d={d} />
          </div>
        </div>
        {c.phase === 'done' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DurationField label="Tiempo" value={v.tiempo} onChange={(x) => setV({ ...v, tiempo: x > 0 ? x : null })} step={60} allowHours size="lg" fullWidth />
            <DistanceField label="Distancia · de la máquina" value={v.dist} onChange={(x) => setV({ ...v, dist: x })} unit="km" size="lg" fullWidth />
            <Rpe v={v.rpe} set={(x) => setV({ ...v, rpe: x })} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {c.phase === 'idle' ? <span style={{ font: 'var(--text-body-sm)', color: 'var(--text-secondary)' }}>Medí con el teléfono o cargá lo que marca la máquina al final.</span> : null}
            <div style={{ padding: 20, borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)', border: '1px solid ' + (c.phase === 'running' ? 'var(--surface-signal-line)' : 'var(--border-subtle)'), display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="frencia-label" style={{ color: c.phase === 'running' ? 'var(--signal-text)' : undefined }}>{c.phase === 'running' ? 'Corriendo' : 'Tiempo'}</span>
                <span style={{ font: '12px var(--font-sans)', color: 'var(--text-tertiary)' }}>Plan <b style={{ color: 'var(--text-secondary)' }}>{clock(target)}</b></span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.04em', fontVariationSettings: 'var(--vs-condensed)', fontSize: 76, lineHeight: 0.9, color: c.phase === 'idle' ? 'var(--text-disabled)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{clock(c.sec)}</span>
              <div style={{ position: 'relative', height: 4, borderRadius: 2, background: 'var(--data-track)', marginTop: 4 }}>
                <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, (c.sec / target) * 100) + '%', borderRadius: 2, background: 'var(--signal)' }}></span>
              </div>
            </div>
            {c.phase === 'idle' ? <button type="button" onClick={c.manual} style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', color: 'var(--signal-text)', font: 'var(--fw-semibold) 14px var(--font-sans)', padding: '6px 0', cursor: 'pointer', display: 'inline-flex', gap: 6, alignItems: 'center' }}><Ic name="pencil" size={15} />Cargar a mano</button> : null}
          </div>
        )}
      </Shell>
    );
  }

  return { FuerzaActual, IsoActual, CardioActual, IsoA, IsoB, IsoC, CardioA, CardioB, CardioC };
})();
window.WZ = WZ;
