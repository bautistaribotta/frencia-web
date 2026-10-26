import React from 'react';

const CSS = `
.frencia-tabbar {
  display: flex; align-items: flex-start; justify-content: space-around;
  background: color-mix(in srgb, var(--bg-app) 86%, transparent);
  backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border-top: 1px solid var(--divider);
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom, 22px));
  position: relative;
}
.frencia-tab {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  border: none; background: transparent; cursor: pointer; flex: 1;
  color: var(--text-tertiary); padding: 6px 0 2px; position: relative;
  -webkit-tap-highlight-color: transparent;
  transition: color var(--dur-base) var(--ease-out);
}
.frencia-tab svg { width: 22px; height: 22px; stroke-width: 1.75; }
.frencia-tab__label { font-family: var(--font-sans); font-weight: var(--fw-medium); font-size: 10.5px; letter-spacing: 0.01em; }
.frencia-tab--active { color: var(--text-primary); }
.frencia-tab--active::before {
  content: ''; position: absolute; top: -9px; left: 50%; width: 18px; height: 2px; margin-left: -9px;
  background: var(--accent); border-radius: 0 0 2px 2px;
}
.frencia-tab--fab { flex: 0 0 auto; padding-top: 0; }
.frencia-tab--fab::before { display: none; }
.frencia-tab--fab .frencia-tab__btn {
  width: 48px; height: 48px; border-radius: var(--radius-lg); border: none; cursor: pointer; padding: 0;
  background: var(--accent); color: var(--text-on-accent);
  display: inline-flex; align-items: center; justify-content: center;
  transition: transform var(--dur-fast) var(--ease-out), background var(--dur-base) var(--ease-out);
}
.frencia-tab--fab .frencia-tab__btn:hover { background: var(--accent-hover); }
.frencia-tab--fab .frencia-tab__btn:active { transform: scale(0.96); }
.frencia-tab--fab .frencia-tab__btn svg { width: 22px; height: 22px; stroke-width: 2; }
`;

if (typeof document !== 'undefined' && !document.getElementById('frencia-tabbar-css')) {
  const s = document.createElement('style');
  s.id = 'frencia-tabbar-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

/** Barra inferior con accion central opcional. Activa = tinta y una marca arriba. */
export function TabBar({ items = [], value, onChange, fab, className = '', ...rest }) {
  const cls = ['frencia-tabbar', className].filter(Boolean).join(' ');
  const mid = Math.ceil(items.length / 2);
  const left = fab ? items.slice(0, mid) : items;
  const right = fab ? items.slice(mid) : [];

  const renderTab = (item) => (
    <button
      key={item.value}
      className={`frencia-tab ${item.value === value ? 'frencia-tab--active' : ''}`}
      onClick={() => onChange && onChange(item.value)}
      aria-current={item.value === value ? 'page' : undefined}
    >
      <i data-lucide={item.icon}></i>
      <span className="frencia-tab__label">{item.label}</span>
    </button>
  );

  return (
    <nav className={cls} {...rest}>
      {left.map(renderTab)}
      {fab ? (
        <div className="frencia-tab frencia-tab--fab">
          <button className="frencia-tab__btn" onClick={fab.onClick} aria-label={fab.label || 'acción'}>
            <i data-lucide={fab.icon || 'plus'}></i>
          </button>
        </div>
      ) : null}
      {right.map(renderTab)}
    </nav>
  );
}
