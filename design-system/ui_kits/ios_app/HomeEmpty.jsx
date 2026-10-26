// Estado vacío de "Hoy" — cuenta recién creada, sin rutinas ni historial.
// Onboarding editorial: placeholder de sesión + primeros pasos.
function HomeEmpty({ onCreate }) {
  const { Avatar, Badge, Button } = window.FrenciaDesignSystem_377129;
  const d = window.FRENCIA_DATA;
  const first = d.user.name.split(' ')[0];

  const steps = [
    { n: 1, title: 'Creá tu primera rutina', sub: 'Ejercicios, series y repeticiones', icon: 'list-plus', state: 'active' },
    { n: 2, title: 'Registrá una sesión', sub: 'Peso, reps y RIR mientras entrenás', icon: 'pencil-line', state: 'locked' },
    { n: 3, title: 'Seguí tu progreso', sub: 'PR, volumen semanal y 1RM estimado', icon: 'trending-up', state: 'locked' },
  ];

  return (
    <div style={{ padding: '56px 20px 120px', display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Saludo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={d.user.name} size="md" ring />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: 'var(--text-subtitle)', color: 'var(--text-primary)' }}>Hola, {first}</span>
            <span className="frencia-label">Jueves · 12 jun</span>
          </div>
        </div>
        <Badge tone="neutral">Día 1</Badge>
      </div>

      {/* Placeholder de la sesión de hoy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', background: 'var(--surface-card)',
          padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="frencia-label">Tu sesión de hoy</span>
            <div style={{ font: 'var(--text-display)', fontSize: 32, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Empezá por tu rutina.</div>
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-secondary)', margin: 0, maxWidth: 280, textWrap: 'pretty' }}>
              Todavía no tenés rutinas. Cargá la que ya usás y registrá cada serie a tu manera.
            </p>
          </div>
          <Button variant="primary" size="lg" icon="plus" fullWidth onClick={onCreate}>Crear primera rutina</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7 }}>
          <i data-lucide="calendar-off" style={{ width: 13, height: 13, color: 'var(--text-tertiary)' }}></i>
          <span className="frencia-label">Sin sesiones programadas</span>
        </div>
      </div>

      {/* Primeros pasos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 2px' }}>
          <span className="frencia-label">Primeros pasos</span>
          <span style={{ font: 'var(--text-data-label)', color: 'var(--text-tertiary)' }}>0 / 3</span>
        </div>

        <div style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)', overflow: 'hidden',
        }}>
          {steps.map((s, i) => {
            const active = s.state === 'active';
            return (
              <div key={s.n} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 16px',
                borderTop: i === 0 ? 'none' : '1px solid var(--divider)',
                cursor: active ? 'pointer' : 'default',
                opacity: active ? 1 : 0.62,
              }} onClick={active ? onCreate : undefined}>
                <div style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  background: active ? 'var(--accent)' : 'transparent',
                  border: active ? 'none' : '1px solid var(--border-strong)',
                  color: active ? 'var(--text-on-accent)' : 'var(--text-tertiary)',
                  font: 'var(--fw-semibold) 12px var(--font-sans)',
                }}>
                  {s.n}
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: 'var(--fw-semibold) 15px var(--font-sans)', color: 'var(--text-primary)' }}>{s.title}</span>
                  <span style={{ font: 'var(--text-body-sm)', fontSize: 12.5, color: 'var(--text-tertiary)' }}>{s.sub}</span>
                </div>
                <i data-lucide={active ? 'chevron-right' : 'lock'} style={{ width: 17, height: 17, color: active ? 'var(--signal-text)' : 'var(--text-disabled)', flexShrink: 0 }}></i>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
window.HomeEmpty = HomeEmpty;
