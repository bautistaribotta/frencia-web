// Flujo de creacion de rutina — wizard "un dato por pantalla", interactivo.
// Mismo marco que Pantallas 2, 4 y 6: barra (volver · contador · accion),
// escala de avance, pregunta a altura fija y una sola accion abajo.
// Solo front: al terminar dispara onFinish; volver en el paso 1 dispara onExit.
function CreateRoutineWizard({ onExit, onFinish }) {
  const { Button, Tag } = window.FrenciaDesignSystem_377129;

  const STEPS = [
    { key: 'name', rotulo: 'Rutina nueva · Nombre', question: '¿Cómo se llama tu rutina?', hint: 'Un nombre que reconozcas de un vistazo.' },
    { key: 'days', rotulo: 'Rutina nueva · Días', question: '¿Cuántos días por semana?', hint: 'Después armás cada uno. Podés sumar o quitar días más adelante.' },
  ];
  const SUGERIDOS = ['Push Pull Legs', 'Torso / Pierna', 'Full body'];

  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [days, setDays] = React.useState(3);
  const [focus, setFocus] = React.useState(false);
  const inputRef = React.useRef(null);

  const total = STEPS.length;
  const current = STEPS[step];
  const isLast = step === total - 1;
  const valid = step === 0 ? name.trim().length > 0 : days >= 1 && days <= 7;

  React.useEffect(() => {
    if (current.key === 'name' && inputRef.current) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 80);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [step]);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const back = () => { step === 0 ? onExit && onExit() : setStep(step - 1); };
  const next = () => {
    if (!valid) return;
    isLast ? onFinish && onFinish({ name: name.trim(), days }) : setStep(step + 1);
  };
  const pad = (n) => String(n).padStart(2, '0');
  const label = { font: 'var(--text-label)', fontVariationSettings: 'var(--vs-semi)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-tertiary)' };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', paddingTop: 50 }}>

      {/* BARRA: volver · contador · (vacio) */}
      <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr 88px', alignItems: 'center', padding: '4px 14px 0', minHeight: 44 }}>
        <Button variant="ghost" size="sm" icon={step === 0 ? 'x' : 'chevron-left'} onClick={back}>{step === 0 ? 'Salir' : 'Atrás'}</Button>
        <span style={{ justifySelf: 'center', font: 'var(--fw-semibold) 13px var(--font-sans)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {pad(step + 1)} <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {pad(total)}</span>
        </span>
        <span />
      </div>

      {/* ESCALA */}
      <div style={{ display: 'flex', gap: 3, padding: '12px 24px 0' }}>
        {STEPS.map((s, i) => (
          <span key={s.key} style={{ flex: 1, height: 2, background: i < step ? 'var(--accent)' : i === step ? 'var(--signal)' : 'var(--data-track)', transition: 'background var(--dur-base) var(--ease-out)' }} />
        ))}
      </div>

      {/* CUERPO: arranca siempre a la misma altura */}
      <div key={current.key} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32, padding: '40px 24px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={label}>{current.rotulo}</span>
          <h1 style={{ font: 'var(--text-display)', letterSpacing: '-0.028em', color: 'var(--text-primary)', margin: 0, textWrap: 'balance' }}>{current.question}</h1>
          <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-secondary)', margin: 0, maxWidth: 320, textWrap: 'pretty' }}>{current.hint}</p>
        </div>

        {current.key === 'name' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder="Nombre de la rutina"
                maxLength={40}
                style={{
                  width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none',
                  borderBottom: `1px solid ${focus ? 'var(--signal)' : 'var(--border-strong)'}`,
                  boxShadow: focus ? '0 1px 0 0 var(--signal)' : 'none',
                  padding: '8px 0 10px', color: 'var(--text-primary)',
                  font: 'var(--fw-medium) 28px var(--font-sans)', letterSpacing: '-0.02em',
                  outline: 'none', caretColor: 'var(--signal)', borderRadius: 0,
                  transition: 'border-color var(--dur-fast) var(--ease-out)',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', ...label }}>
                <span>{name ? '' : 'Obligatorio'}</span><span>{name.length} / 40</span>
              </div>
            </div>
            {!name ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SUGERIDOS.map((t) => <Tag key={t} selectable onClick={() => setName(t)}>{t}</Tag>)}
              </div>
            ) : null}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={n === days} onClick={() => setDays(n)} style={{
                  height: 56, borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  border: `1px solid ${n === days ? 'var(--accent)' : 'var(--border-default)'}`,
                  background: n === days ? 'var(--accent)' : 'transparent',
                  color: n === days ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                  font: 'var(--fw-medium) 22px var(--font-sans)', fontVariationSettings: 'var(--vs-condensed)', fontVariantNumeric: 'tabular-nums',
                  transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
                }}>{n}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--divider)' }}>
              {Array.from({ length: days }, (_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48, borderBottom: '1px solid var(--divider)' }}>
                  <span style={{ width: 22, font: 'var(--fw-semibold) 12px var(--font-sans)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{pad(i + 1)}</span>
                  <span style={{ flex: 1, font: 'var(--text-body-sm)', color: 'var(--text-secondary)' }}>Día {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ACCION */}
      <div style={{ flexShrink: 0, padding: '12px 24px 30px' }}>
        <Button
          key={'cta-' + step}
          variant="primary" size="lg" fullWidth
          iconRight={isLast ? undefined : 'arrow-right'}
          icon={isLast ? 'check' : undefined}
          disabled={!valid}
          onClick={next}
        >
          {isLast ? 'Crear rutina' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}
window.CreateRoutineWizard = CreateRoutineWizard;
