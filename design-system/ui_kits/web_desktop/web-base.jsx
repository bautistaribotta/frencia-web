// Frencia Web · piezas compartidas del kit de escritorio.
// Cada componente de este archivo es la referencia de un componente del repo
// web (src/ui/<Nombre>/<Nombre>.tsx + .module.css). En el kit los estados
// se fuerzan con `estado` ('hover' | 'foco' | 'press' | 'off' | 'cargando')
// para poder verlos quietos; en el producto salen de las pseudoclases.

const VistaCtx = React.createContext({ vista: 'ambos' });
const TemaCtx = React.createContext('dark');

/* ---------- Icono Lucide ----------
   anima: el icono tiene versión animada en @animateicons/react/lucide y se
   anima en hover/foco del control que lo contiene. confirma: se anima una
   vez al confirmar una acción (guardado, copiado, agregado). */
function Ico({ n, s = 20, c = '', anima, confirma }) {
  const cls = `w-ico w-ico--${s} ${c}${anima ? ' w-ico--anima' : ''}${confirma ? ' w-ico--confirma' : ''}`;
  return <span key={n} className={cls}><i data-lucide={n}></i></span>;
}
const est = (estado) => (estado ? ` is-${estado}` : '');

/* ---------- Página del kit ---------- */
function Lienzo({ titulo, bajada, children }) {
  const [vista, setVista] = React.useState(() => {
    try { return localStorage.getItem('frencia-web-vista') || 'ambos'; } catch (e) { return 'ambos'; }
  });
  React.useEffect(() => { try { localStorage.setItem('frencia-web-vista', vista); } catch (e) {} }, [vista]);
  React.useEffect(() => {
    const id = setInterval(() => { window.lucide && lucide.createIcons(); }, 300);
    return () => clearInterval(id);
  }, []);
  const ops = [['ambos', 'Oscuro y claro'], ['dark', 'Solo oscuro'], ['light', 'Solo claro']];
  return (
    <VistaCtx.Provider value={{ vista }}>
      <header className="k-cabecera">
        <div className="k-textos">
          <span className="t-label c-ter">Frencia Web · escritorio</span>
          <h1 className="k-titulo">{titulo}</h1>
          {bajada ? <p className="k-bajada">{bajada}</p> : null}
        </div>
        <div className="k-vista" role="group" aria-label="Temas a mostrar">
          {ops.map(([v, l]) => <button key={v} aria-pressed={vista === v} onClick={() => setVista(v)}>{l}</button>)}
        </div>
      </header>
      <div className="k-grilla-secciones">{children}</div>
    </VistaCtx.Provider>
  );
}
function Seccion({ titulo, nota, children }) {
  return (
    <section>
      <div className="k-seccion"><h2>{titulo}</h2>{nota ? <p className="k-bajada">{nota}</p> : null}</div>
      <div className="k-grilla">{children}</div>
    </section>
  );
}

/* ---------- Fondo de luces (web) ----------
   [luz, x %, y %, radio en % del ancho, alfa]. Las mismas cinco posiciones de
   la app; en una ventana apaisada los radios bajan para que la luz no lave
   todo el ancho. En el celular (página pública) se usan las de la app. */
const POS_WEB = {
  cumbre: [['a', 90, 0, 52, 0.5], ['b', 6, 74, 70, 0.9], ['c', 98, 100, 40, 0.22]],
  centro: [['a', 56, 52, 46, 0.42], ['b', 4, 8, 60, 0.85], ['c', 100, 100, 40, 0.2]],
  flanco: [['a', 104, 46, 50, 0.5], ['b', -2, 92, 70, 0.9], ['c', -4, -6, 36, 0.2]],
  base: [['a', -2, 98, 52, 0.42], ['b', 100, 10, 64, 0.9], ['c', 72, 106, 36, 0.18]],
  velada: [['a', 102, 108, 46, 0.4], ['b', 10, 60, 66, 0.85], ['c', -4, -8, 36, 0.22]],
};
const POS_MOVIL = {
  cumbre: [['a', 92, 2, 95, 0.5], ['b', 8, 62, 115, 0.9], ['c', 96, 94, 70, 0.22]],
  centro: [['a', 56, 54, 92, 0.42], ['b', 4, 14, 95, 0.85], ['c', 100, 96, 72, 0.2]],
  flanco: [['a', 112, 42, 88, 0.5], ['b', -2, 82, 115, 0.9], ['c', -6, -2, 62, 0.2]],
  base: [['a', -4, 86, 90, 0.42], ['b', 100, 18, 110, 0.9], ['c', 70, 104, 60, 0.18]],
  velada: [['a', 102, 104, 82, 0.4], ['b', 12, 58, 110, 0.85], ['c', -6, -4, 62, 0.22]],
};
function luzCss([k, x, y, r, a]) {
  const col = (p) => `color-mix(in oklch, var(--glow-${k}) min(100%, calc(${p}% * var(--fondo-ganancia, 1))), transparent)`;
  return `radial-gradient(circle ${r}cqw at ${x}% ${y}%, ${col(Math.round(a * 100))} 0%, ${col(Math.round(a * 45))} 42%, transparent 100%)`;
}
function Fondo({ posicion = 'cumbre', animado, movil }) {
  const luces = (movil ? POS_MOVIL : POS_WEB)[posicion] || POS_WEB.cumbre;
  return (
    <div className={`w-fondo${animado ? ' w-fondo--animado' : ''}`} aria-hidden="true" data-posicion={posicion}>
      {luces.map((l, i) => <div key={i} className="w-fondo__luz" style={{ background: luzCss(l) }} />)}
      <div className="w-fondo__grano" />
      <div className="w-fondo__velo" />
    </div>
  );
}

/* ---------- Mesa: una pantalla en oscuro y en claro, lado a lado ---------- */
function Ventana({ tema, ancho, alto, escala, url, movil, fondo, animado, children }) {
  const barra = movil ? 0 : 40;
  return (
    <div className={`k-marco${movil ? ' k-movil' : ''}`} data-theme={tema} style={{ width: ancho * escala, height: (alto + barra) * escala }}>
      <div className="k-escala" style={{ transform: `scale(${escala})` }}>
        <TemaCtx.Provider value={tema}>
          <div className="k-ventana" style={{ width: ancho, height: alto + barra }}>
            {movil ? null : (
              <div className="k-ventana__barra">
                <div className="k-ventana__puntos"><span></span><span></span><span></span></div>
                <div className="k-ventana__url"><Ico n="lock" s={12} />{url}</div>
                <div className="k-ventana__esp"></div>
              </div>
            )}
            <div className="k-ventana__cuerpo">
              <Fondo posicion={fondo} animado={animado} movil={movil} />
              {children}
            </div>
          </div>
        </TemaCtx.Provider>
      </div>
    </div>
  );
}
function Mesa({ nombre, nota, ruta, fondo = 'cumbre', animado, ancho = 1440, alto = 860, url = 'frencia.app', movil, children }) {
  const { vista } = React.useContext(VistaCtx);
  const temas = vista === 'ambos' ? ['dark', 'light'] : [vista];
  const escala = vista === 'ambos' ? (movil ? 0.8 : ancho > 1200 ? 0.6 : 0.72) : 1;
  return (
    <div className="k-mesa">
      <div className="k-par">
        {temas.map((t) => (
          <div key={t} className={`k-lado k-lado--${t}`}>
            <span className="k-lado__tema">{t === 'dark' ? 'Lume oscuro' : 'Lume claro'} · {ancho}×{alto}</span>
            <Ventana tema={t} ancho={ancho} alto={alto} escala={escala} url={url} movil={movil} fondo={fondo} animado={animado}>{children}</Ventana>
          </div>
        ))}
      </div>
      <div className="k-mesa__textos">
        <span className="k-nombre">{nombre}</span>
        {nota ? <span className="k-nota">{nota}</span> : null}
        <span className="k-ruta">{ruta} · fondo {fondo}{animado ? ' · anima' : ''}</span>
      </div>
    </div>
  );
}

/* ---------- Marca ---------- */
function Marca({ grande }) { return <span className={`w-marca${grande ? ' w-marca--grande' : ''}`} aria-label="Frencia">FRENCIA.</span>; }
function Avatar({ s = 36 }) {
  return (
    <span className="w-avatar" style={{ width: s, height: s }}>
      <svg viewBox="0 0 36 36" width={s} height={s} aria-hidden="true">
        <rect width="36" height="36" className="bc" />
        <rect width="36" height="36" rx="6" className="bf" transform="translate(4 4) rotate(340 18 18) scale(1.1)" />
        <g transform="translate(-4 -1) rotate(-4 18 18)">
          <path d="M15 21c2 1 4 1 6 0" strokeWidth="1.2" fill="none" strokeLinecap="round" className="br" />
          <rect x="12" y="14" width="1.5" height="2" rx="1" className="bo" />
          <rect x="22" y="14" width="1.5" height="2" rx="1" className="bo" />
        </g>
      </svg>
    </span>
  );
}

/* ---------- Controles ---------- */
function Ruedita({ lg }) { return <span className={`w-ruedita${lg ? ' w-ruedita--lg' : ''}`} aria-hidden="true"></span>; }
function Boton({ v = 'primary', t = 'md', ico, icoDer, ancho, estado, anima, confirma, children, className = '' }) {
  const cargando = estado === 'cargando';
  return (
    <button className={`w-btn w-btn--${v} w-btn--${t}${ancho ? ' w-btn--ancho' : ''}${est(estado)}${anima ? ' w-anima-hover' : ''} ${className}`}
      disabled={estado === 'off'} aria-busy={cargando || undefined}>
      {cargando ? <Ruedita /> : null}
      {ico ? <Ico n={ico} s={t === 'sm' ? 16 : 18} anima={anima} confirma={confirma} /> : null}
      {children ? <span>{children}</span> : null}
      {icoDer ? <Ico n={icoDer} s={t === 'sm' ? 16 : 18} anima={anima} /> : null}
    </button>
  );
}
function BotonIco({ ico, v = 'ghost', t = 'md', estado, tip, tipLado = 'arriba', dang, anima, label, className = '' }) {
  return (
    <button className={`w-btn-ico${v === 'surface' ? ' w-btn-ico--surface' : ''}${t === 'sm' ? ' w-btn-ico--sm' : ''}${dang ? ' w-btn-ico--dang' : ''}${est(estado)}${anima ? ' w-anima-hover' : ''} ${className}`}
      aria-label={label || tip} disabled={estado === 'off'}>
      <Ico n={ico} s={t === 'sm' ? 16 : 20} anima={anima} />
      {tip && estado === 'hover' ? <span className={`w-tooltip w-tooltip--${tipLado}`}>{tip}</span> : null}
    </button>
  );
}
function Kbd({ children }) { return <kbd className="w-kbd">{children}</kbd>; }
/* Campo con etiqueta flotante (flotante): vacío y sin foco, el rótulo va
   adentro, en el lugar del texto; con foco o con valor sube al borde de
   arriba de la caja y deja lugar para escribir. Sin placeholder: el rótulo
   es la única indicación. El enlace extra (¿La olvidaste?) baja a la línea
   de ayuda. En el producto es un <label> real; sube con :focus-within o
   :has(input:not(:placeholder-shown)). */
function CampoFlotante({ rotulo, extra, ico, valor, estado, ayuda, error, final, className = '' }) {
  const foco = estado === 'foco';
  const arriba = foco || !!valor;
  return (
    <label className={`w-campo w-campo--flotante${arriba ? ' is-arriba' : ''}${est(estado)}${error ? ' is-error' : ''} ${className}`}>
      <span className="w-campo__caja">
        {ico ? <Ico n={ico} s={20} /> : null}
        <span className="w-campo__cuerpo">
          <span className="w-campo__flota">{rotulo}</span>
          <span className="w-campo__valor">{valor}{foco ? <span className="w-cursor"></span> : null}</span>
        </span>
        {final || null}
      </span>
      {error || ayuda || extra ? (
        <span className="w-campo__pie">
          {error ? <span className="w-campo__error"><Ico n="circle-alert" s={16} />{error}</span> : ayuda ? <span className="w-campo__ayuda">{ayuda}</span> : <span></span>}
          {extra ? <span className="w-campo__extra">{extra}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
function Campo({ rotulo, extra, ico, valor, ph, estado, ayuda, error, final, md, cursor, flotante, className = '' }) {
  if (flotante) return <CampoFlotante rotulo={rotulo} extra={extra} ico={ico} valor={valor} estado={estado} ayuda={ayuda} error={error} final={final} className={className} />;
  return (
    <label className={`w-campo${md ? ' w-campo--md' : ''}${est(estado)}${error ? ' is-error' : ''} ${className}`}>
      {rotulo ? <span className="w-campo__rotulo"><span className="t-label c-ter">{rotulo}</span>{extra ? <span className="t-label c-ter">{extra}</span> : null}</span> : null}
      <span className="w-campo__caja">
        {ico ? <Ico n={ico} s={md ? 18 : 20} /> : null}
        <span className={`w-campo__valor${valor ? '' : ' w-campo__valor--ph'}`}>{valor || ph}{estado === 'foco' || cursor ? <span className="w-cursor"></span> : null}</span>
        {final || null}
      </span>
      {error ? <span className="w-campo__error"><Ico n="circle-alert" s={16} />{error}</span> : ayuda ? <span className="w-campo__ayuda">{ayuda}</span> : null}
    </label>
  );
}
function Selector({ rotulo, ico, valor, estado, md, abierto, children }) {
  return (
    <div className="w-select-wrap">
      <Campo className="w-select" rotulo={rotulo} ico={ico} valor={valor} estado={estado} md={md} final={<Ico n="chevrons-up-down" s={16} c="c-ter" />} />
      {abierto ? <div className="w-select-menu">{children}</div> : null}
    </div>
  );
}
function Menu({ children, className = '' }) { return <div className={`w-menu ${className}`} role="menu">{children}</div>; }
function MenuItem({ ico, children, kbd, estado, sel, dang }) {
  return (
    <div className={`w-menu__item${dang ? ' w-menu__item--dang' : ''}${est(estado)}${sel ? ' is-sel' : ''}`} role="menuitem">
      {ico ? <Ico n={ico} s={18} /> : null}<span className="f1">{children}</span>
      {kbd ? <Kbd>{kbd}</Kbd> : null}
      {sel ? <Ico n="check" s={16} /> : null}
    </div>
  );
}
function MenuSep() { return <div className="w-menu__sep"></div>; }
function Seg({ ops, sel, ancho, parejo, acento, estados = {} }) {
  return (
    <div className={`w-seg${ancho ? ' w-seg--ancho' : ''}${parejo ? ' w-seg--parejo' : ''}${acento ? ' w-seg--acento' : ''}`} role="radiogroup">
      {ops.map((o) => {
        const [v, l, ico] = Array.isArray(o) ? o : [o, o];
        return <button key={v} className={`w-seg__op${v === sel ? ' is-sel' : ''}${est(estados[v])}`} role="radio" aria-checked={v === sel}>{ico ? <Ico n={ico} s={16} /> : null}{l}</button>;
      })}
    </div>
  );
}
function Switch({ on, estado }) { return <span className={`w-switch${on ? ' is-on' : ''}${est(estado)}`} role="switch" aria-checked={!!on}></span>; }
function Check({ on, estado }) { return <span className={`w-check${on ? ' is-on' : ''}${est(estado)}`} role="checkbox" aria-checked={!!on}>{on ? <Ico n="check" s={14} /> : null}</span>; }
function Opcion({ titulo, texto, ico, sel, estado }) {
  return (
    <div className={`w-opcion${sel ? ' is-sel' : ''}${est(estado)}`} role="radio" aria-checked={!!sel}>
      {ico ? <span className="w-opcion__ico"><Ico n={ico} s={20} /></span> : null}
      <span className="col g1 f1"><span>{titulo}</span>{texto ? <span className="t-bodysm c-sec">{texto}</span> : null}</span>
      <span className="w-opcion__radio"></span>
    </div>
  );
}
function Badge({ tono, ico, children }) { return <span className={`w-badge${tono ? ' w-badge--' + tono : ''}`}>{ico ? <Ico n={ico} s={12} /> : null}{children}</span>; }
function Chip({ children, n, sel, estado, ico }) { return <button className={`w-chip${sel ? ' is-sel' : ''}${est(estado)}`} aria-pressed={!!sel}>{ico ? <Ico n={ico} s={14} /> : null}{children}{n != null ? <small>{n}</small> : null}</button>; }
const SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
function Semana({ on = [], edit }) { return <div className={`w-semana${edit ? ' w-semana--edit' : ''}`}>{SEMANA.map((d, i) => <span key={d} className={on.includes(i) ? 'is-on' : ''}>{d}</span>)}</div>; }
function Res({ vol, int, desc }) {
  return (
    <span className="w-res">
      <span>{vol}</span>
      {int ? <><i>·</i><b>{int}</b></> : null}
      {desc ? <><i>·</i><Ico n="timer" s={13} />{desc}</> : null}
    </span>
  );
}
function Escala({ total, actual }) {
  return <div className="w-escala" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={actual + 1}>{Array.from({ length: total }, (_, i) => <span key={i} className={i < actual ? 'is-hecha' : i === actual ? 'is-actual' : ''}></span>)}</div>;
}
function Toast({ texto, tipo = 'ok', accion, confirma }) {
  const ico = { ok: 'check', error: 'triangle-alert', info: 'info' }[tipo];
  return (
    <div className={`w-toast${tipo !== 'ok' ? ' w-toast--' + tipo : ''}`} role="status">
      <Ico n={ico} s={20} confirma={confirma} />
      <span className="t-bodysm c-pri f1">{texto}</span>
      {accion ? <Boton v="soft" t="sm">{accion}</Boton> : null}
      <BotonIco ico="x" t="sm" label="Cerrar aviso" />
    </div>
  );
}
function Toasts({ children }) { return <div className="w-toasts">{children}</div>; }
function Modal({ titulo, texto, ico, chico, children, pie }) {
  return (
    <div className="w-velo">
      <div className={`w-modal${chico ? ' w-modal--sm' : ''}`} role="dialog" aria-modal="true">
        <div className="w-modal__cabeza">
          {ico ? <span className="w-opcion__ico">{ico}</span> : null}
          <div className="col g3 f1">
            {titulo ? <span className="t-title">{titulo}</span> : null}
            {texto ? <span className="t-bodysm c-sec">{texto}</span> : null}
          </div>
          <BotonIco ico="x" label="Cerrar" />
        </div>
        {children}
        {pie ? <div className="w-modal__pie">{pie}</div> : null}
      </div>
    </div>
  );
}
function Panel({ rotulo, titulo, children, pie, extra }) {
  return (
    <aside className="w-panel" aria-label={titulo}>
      <div className="w-panel__cabeza">
        <div className="col g2 f1">{rotulo ? <span className="t-label c-ter">{rotulo}</span> : null}<span className="t-subtitle">{titulo}</span>{extra || null}</div>
        <BotonIco ico="x" label="Cerrar panel" />
      </div>
      <div className="w-panel__cuerpo">{children}</div>
      {pie ? <div className="w-panel__pie">{pie}</div> : null}
    </aside>
  );
}
function Numero({ rotulo, extra, valor, unidad, estado }) {
  return (
    <div className={`w-numero${est(estado)}`}>
      {rotulo ? <span className="w-campo__rotulo"><span className="t-label c-ter">{rotulo}</span>{extra ? <span className="t-label c-ter">{extra}</span> : null}</span> : null}
      <div className="w-numero__fila">
        <BotonIco ico="minus" t="sm" label="Restar" estado={estado === 'off' ? 'off' : undefined} />
        <span className={`w-numero__valor${valor == null ? ' w-numero__valor--vacio' : ''}`}>{valor == null ? '—' : valor}{unidad && valor != null ? <small>{unidad}</small> : null}{estado === 'foco' ? <span className="w-cursor"></span> : null}</span>
        <BotonIco ico="plus" t="sm" label="Sumar" estado={estado === 'off' ? 'off' : undefined} />
      </div>
    </div>
  );
}

/* ---------- Regla web: reemplaza la regla de altura ----------
   Lectura grande que se edita escribiendo; la regla se arrastra con el
   mouse, se clickea para saltar y responde a la rueda del mouse y al
   teclado (flechas ±paso, Shift ±10 pasos, Inicio/Fin). */
function Regla({ valor, unidad, paso = 1, mayor = 10, media = 5, decimales = 0, n = 40, estado, edita, fmt }) {
  const marcas = [], numeros = [];
  for (let i = -n; i <= n; i++) {
    const v = Math.round((valor + i * paso) * 1000) / 1000;
    const k = Math.round(v / paso);
    const M = k % mayor === 0, m = !M && k % media === 0;
    marcas.push(<span key={i} className={M ? 'M' : m ? 'm' : ''}></span>);
    if (M) numeros.push(<span key={i} style={{ left: `${((i + n) / (2 * n)) * 100}%` }}>{fmt ? fmt(v) : v.toFixed(0)}</span>);
  }
  return (
    <div className={`w-regla${est(estado)}`} role="slider" aria-valuenow={valor} tabIndex={0}>
      <span className={`w-regla__lectura${edita ? ' is-edita' : ''}`}><span className="w-regla__num">{valor.toFixed(decimales)}{edita ? <span className="w-cursor"></span> : null}</span><span className="w-regla__unidad">{unidad}</span></span>
      <div className="w-regla__pista"><div className="w-regla__marcas">{marcas}</div><div className="w-regla__numeros">{numeros}</div><span className="w-regla__aguja"></span></div>
    </div>
  );
}
/* ---------- Regla curva web: el peso ----------
   Misma lectura y la banda en arco de la app, más chica: se arrastra de
   costado, rueda del mouse y flechas (±0,5; Shift ±5). */
function Arco({ valor, unidad = 'kg', paso = 0.5, grados = 1.6, mayor = 10, media = 2, decimales = 1, estado }) {
  const W = 620, H = 120, R = 520, grosor = 64, cx = W / 2, cy = R + 6, rIn = R - grosor, rT = R - 8, rN = rT - 38, lim = 34;
  const n = Math.floor(lim / grados), base = Math.round(valor / paso);
  const marcas = [], numeros = [];
  for (let i = -n; i <= n; i++) {
    const k = base + i, a = (k * paso - valor) / paso * grados;
    if (Math.abs(a) > lim) continue;
    const M = k % mayor === 0, m = !M && k % media === 0, largo = M ? 26 : m ? 17 : 10, rad = (a - 90) * Math.PI / 180;
    marcas.push(<line key={'m' + k} className={'tick' + (M ? ' M' : m ? ' m' : '')} x1={cx + rT * Math.cos(rad)} y1={cy + rT * Math.sin(rad)} x2={cx + (rT - largo) * Math.cos(rad)} y2={cy + (rT - largo) * Math.sin(rad)} />);
    if (M) numeros.push(<text key={'n' + k} className="num" x={cx} y={cy - rN} transform={`rotate(${a} ${cx} ${cy})`} textAnchor="middle" dominantBaseline="central">{(k * paso).toFixed(0)}</text>);
  }
  const p = (r, a) => { const t = (a - 90) * Math.PI / 180; return `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`; };
  const L = lim + 3;
  const banda = `M ${p(R, -L)} A ${R} ${R} 0 0 1 ${p(R, L)} L ${p(rIn, L)} A ${rIn} ${rIn} 0 0 0 ${p(rIn, -L)} Z`;
  return (
    <div className={`w-regla${est(estado)}`} role="slider" aria-valuenow={valor} tabIndex={0}>
      <span className="w-regla__lectura"><span className="w-regla__num">{valor.toFixed(decimales)}</span><span className="w-regla__unidad">{unidad}</span></span>
      <div className="w-arco"><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <path className="banda" d={banda} />{marcas}{numeros}
        <line className="aguja" x1={cx} y1={cy - R + 2} x2={cx} y2={cy - rT + 32} />
        <path className="punta" d={`M ${cx - 5} ${cy - R + 2} L ${cx + 5} ${cy - R + 2} L ${cx} ${cy - R + 8} Z`} />
      </svg></div>
    </div>
  );
}
function AyudaTeclado({ items }) {
  return <div className="w-regla__ayuda">{items.map(([k, t]) => <span key={t}>{k.map((x) => <Kbd key={x}>{x}</Kbd>)}{t}</span>)}</div>;
}
/* ---------- Fecha de nacimiento: reemplaza la rueda de edad ----------
   profiles guarda fecha_nacimiento (la edad se calcula). Tres segmentos que
   se escriben de corrido; flechas suben/bajan el segmento en foco. */
function Fecha({ d, m, a, foco }) {
  const seg = (rot, val, ph, cls, k) => (
    <div className="w-fecha__seg"><span className={`w-fecha__caja ${cls}${foco === k ? ' is-foco' : ''}${val ? '' : ' is-ph'}`}>{val || ph}{foco === k ? <span className="w-cursor"></span> : null}</span><span className="t-label c-ter">{rot}</span></div>
  );
  return <div className="w-fecha" role="group" aria-label="Fecha de nacimiento">{seg('Día', d, 'DD', '', 'd')}<span className="w-fecha__sep">/</span>{seg('Mes', m, 'MM', '', 'm')}<span className="w-fecha__sep">/</span>{seg('Año', a, 'AAAA', 'w-fecha__caja--anio', 'a')}</div>;
}

/* ---------- Estructura: navegación lateral ---------- */
const NAV = [
  { v: 'home', l: 'Inicio', ico: 'house', k: 'G I' },
  { v: 'routines', l: 'Rutinas', ico: 'layers', k: 'G R' },
  { v: 'history', l: 'Historial', ico: 'history', k: 'G H' },
];
function Nav({ activo, rail, hover }) {
  return (
    <nav className={`w-nav${rail ? ' w-nav--rail' : ''}`} aria-label="Principal">
      <div className="w-nav__cabeza">
        <a className="w-nav__marca" href="#" aria-label="Frencia, ir al inicio" title="Inicio">{rail ? <span className="w-marca">F.</span> : <Marca />}</a>
        {rail ? null : <BotonIco ico="panel-left-close" t="sm" label="Colapsar navegación" />}
      </div>
      {rail ? <BotonIco ico="plus" v="surface" className="w-nueva-rutina" label="Nueva rutina" estado={hover === 'crear' ? 'hover' : undefined} tip="Nueva rutina  N" tipLado="der" />
        : <Boton ico="plus" ancho className="w-nueva-rutina">Nueva rutina</Boton>}
      <div className="w-nav__grupo">
        {NAV.map((it) => (
          <a key={it.v} className={`w-nav__item${activo === it.v ? ' is-activo' : ''}${hover === it.v ? ' is-hover' : ''}`} aria-current={activo === it.v ? 'page' : undefined}>
            <Ico n={it.ico} s={20} /><span>{it.l}</span><Kbd>{it.k}</Kbd>
            {rail && hover === it.v ? <span className="w-tooltip w-tooltip--der">{it.l}<Kbd>{it.k}</Kbd></span> : null}
          </a>
        ))}
      </div>
      <div className="w-nav__pie">
        <div className="w-nota-movil"><Ico n="smartphone" s={18} c="c-sec" /><span className="t-bodysm c-sec">Para entrenar, abrí Frencia en el celular. Acá se planifica y se revisa.</span></div>
        <a className={`w-nav__item${activo === 'settings' ? ' is-activo' : ''}`}><Ico n="settings" s={20} /><span>Configuración</span></a>
        <div className={`w-nav__usuario${activo === 'profile' ? ' is-activo' : ''}`}>
          <Avatar s={34} />
          <div className="col f1"><span className="t-bodysm semi c-pri una-linea">Bautista Ribotta</span><span className="t-label c-ter">Perfil</span></div>
        </div>
      </div>
    </nav>
  );
}
function App({ activo, rail, hover, children, capa }) {
  return (
    <div className={`w-app${rail ? ' w-app--rail' : ''}`}>
      <Nav activo={activo} rail={rail} hover={hover} />
      <main className="w-main">{children}</main>
      {capa || null}
    </div>
  );
}
function Pagina({ ancha, children }) { return <div className={`w-pagina${ancha ? ' w-pagina--ancha' : ''}`}>{children}</div>; }
function Encabezado({ rotulo, titulo, sub, acciones, migas }) {
  return (
    <div className="w-encabezado">
      <div className="w-encabezado__textos">
        {migas || (rotulo ? <span className="t-label c-ter">{rotulo}</span> : null)}
        <span className="t-display">{titulo}</span>
        {sub ? <span className="t-bodysm c-sec">{sub}</span> : null}
      </div>
      {acciones ? <div className="row g3 fnone">{acciones}</div> : null}
    </div>
  );
}

/* ---------- Datos de ejemplo (mismos de la app) ---------- */
const TIPO_ICO = { fuerza: 'dumbbell', isometrico: 'timer', cardio: 'heart-pulse', hibrido: 'footprints' };
const TIPO_TXT = { fuerza: 'Fuerza', isometrico: 'Isométrico', cardio: 'Cardio', hibrido: 'Híbrido' };
const CATALOGO = [
  { id: 'press', n: 'Press de banca con barra', g: 'Pecho', k: 'fuerza', eq: 'Barra' },
  { id: 'incl', n: 'Press inclinado con mancuernas', g: 'Pecho', k: 'fuerza', eq: 'Mancuernas' },
  { id: 'fondos', n: 'Fondos en paralelas', g: 'Pecho', k: 'fuerza', eq: 'Peso corporal' },
  { id: 'sentadilla', n: 'Sentadilla', g: 'Cuádriceps', k: 'fuerza', eq: 'Barra' },
  { id: 'dominadas', n: 'Dominadas', g: 'Espalda', k: 'fuerza', eq: 'Peso corporal' },
  { id: 'plancha', n: 'Plancha', g: 'Core', k: 'isometrico', eq: 'Peso corporal' },
  { id: 'sentIso', n: 'Sentadilla isométrica con barra', g: 'Cuádriceps', k: 'isometrico', eq: 'Barra' },
  { id: 'cinta', n: 'Cinta de correr', g: 'Cardio', k: 'cardio', eq: 'Máquina' },
  { id: 'remo', n: 'Remo ergómetro', g: 'Cardio', k: 'cardio', eq: 'Máquina' },
  { id: 'granjero', n: 'Paseo de granjero', g: 'Agarre · Core', k: 'hibrido', eq: 'Mancuernas' },
];
const RUTINA = {
  nombre: 'Push Pull Legs', creada: '29 JUL 2026',
  dias: [
    { n: 'Push', sem: [0, 3], ej: [
      { n: 'Press de banca con barra', k: 'fuerza', vol: '4×8', int: 'RIR 2', desc: '2:00' },
      { n: 'Press inclinado con mancuernas', k: 'fuerza', vol: '3×10', int: 'RIR 2', desc: '1:30' },
      { n: 'Fondos en paralelas', k: 'fuerza', vol: '3×12', int: 'RIR 1', desc: '1:30' },
      { n: 'Plancha', k: 'isometrico', vol: '3×0:45', int: 'RIR 1', desc: '1:00' },
    ] },
    { n: 'Pull', sem: [1, 4], ej: [
      { n: 'Dominadas', k: 'fuerza', vol: '4×6', int: 'RIR 2', desc: '2:30' },
      { n: 'Remo con barra', k: 'fuerza', vol: '4×8', int: 'RIR 2', desc: '2:00' },
      { n: 'Paseo de granjero', k: 'hibrido', vol: '3×40 m', desc: '1:30' },
    ] },
    { n: 'Legs', sem: [2, 5], ej: [
      { n: 'Sentadilla', k: 'fuerza', vol: '4×6', int: 'RIR 2', desc: '3:00' },
      { n: 'Sentadilla isométrica con barra', k: 'isometrico', vol: '4×0:30', int: 'RIR 2', desc: '2:00' },
      { n: 'Cinta de correr', k: 'cardio', vol: '30:00 · 5 km', int: 'RPE 6' },
    ] },
  ],
};
function Barras({ id }) {
  const hex = id.replace(/[^0-9a-f]/gi, '');
  const out = [];
  for (let r = 0; r < 3; r++) [...hex].forEach((ch, i) => { const v = parseInt(ch, 16); out.push(<i key={r + '-' + i} style={{ width: 1 + (v % 3), marginRight: 1 + (v >> 2) }}></i>); });
  return <div className="w-barras" aria-hidden="true">{out}</div>;
}
function Ticket() {
  const ej = [[4, 'Press de banca con barra', '82.5 kg'], [3, 'Press inclinado con mancuernas', '30 kg'], [3, 'Fondos en paralelas', '12 reps'], [3, 'Plancha', '1:00'], [2, 'Elevaciones laterales', '12.5 kg']];
  return (
    <div className="w-ticket">
      <div className="col g4">
        <div className="w-ticket__marca"><span className="w-marca">FRENCIA<span className="w-ticket__punto"></span></span><span className="t-meta c-ter">Nº 7C1E2A</span></div>
        <span className="t-title">Sesión completa</span>
        <span className="t-meta c-ter">Push · 9 OCT 2026 · 07:42</span>
      </div>
      <div className="w-ticket__grandes">
        <div className="w-metrica"><span className="t-label c-ter">Duración</span><span className="w-metrica__valor">58:14</span></div><i></i>
        <div className="w-metrica"><span className="t-label c-ter">Tonelaje · kg</span><span className="w-metrica__valor">6 390</span></div>
      </div>
      <div className="w-ticket__perf"></div>
      <div className="row entre">
        <div className="w-metrica"><span className="t-label c-ter">Ejercicios</span><span className="t-subtitle">5</span></div>
        <div className="w-metrica"><span className="t-label c-ter">Series</span><span className="t-subtitle">15</span></div>
        <div className="w-metrica"><span className="t-label c-ter">Mejor marca</span><span className="t-subtitle">82.5 kg</span></div>
      </div>
      <div className="col g3">{ej.map(([n, t, m]) => <div key={t} className="w-ticket__fila"><span className="row g3 f1"><span className="c-ter">{n}×</span><span className="una-linea">{t}</span></span><span className="semi">{m}</span></div>)}</div>
      <div className="col g2"><Barras id="7c1e2a9b4f3d4e219a0b5d8c3e1f6a72" /><span className="t-meta c-ter">FRENCIA-7C1E-2A9B4F3</span></div>
    </div>
  );
}

Object.assign(window, {
  CampoFlotante, VistaCtx, TemaCtx, Ico, Lienzo, Seccion, Fondo, POS_WEB, Mesa, Ventana, Marca, Avatar, Ruedita, Boton, BotonIco, Kbd, Campo, Selector,
  Menu, MenuItem, MenuSep, Seg, Switch, Check, Opcion, Badge, Chip, Semana, Res, Escala, Toast, Toasts, Modal, Panel, Numero, Regla, Arco,
  AyudaTeclado, Fecha, Nav, App, Pagina, Encabezado, TIPO_ICO, TIPO_TXT, CATALOGO, RUTINA, Ticket, Barras, est,
});
