// Frencia · Piezas compartidas de los mockups "Pantallas - *.html".
// Cada pieza replica un componente o patron de src/ (se indica cual) con los
// tokens del design system. Las piezas que ya existen en el bundle se usan
// desde window.FrenciaDesignSystem_377129; las que el bundle no trae
// (NumberField, MeasurePicker, SerieComparativa con columnas, RestRing del
// codigo, Ticket, Dialogo, hojas) se dibujan aca.

const DS = window.FrenciaDesignSystem_377129;
const TemaCtx = React.createContext('dark');

/* ---- Icono Lucide envuelto: React maneja el span, Lucide el svg de adentro ---- */
function Ico({ n, s = 20, c = '' }) {
  return <span key={n} className={`ico ico--${s} ${c}`}><i data-lucide={n}></i></span>;
}

/* ---- Lienzo: pagina de un flujo, con el conmutador de tema ---- */
function Lienzo({ titulo, bajada, children }) {
  const [tema, setTema] = useTheme();
  React.useEffect(() => {
    const id = setInterval(() => { window.lucide && lucide.createIcons(); }, 300);
    return () => clearInterval(id);
  }, []);
  // Las mesas "final del scroll" arrancan con su contenedor bajado al fondo.
  React.useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll('[class*="--abajo"]').forEach((el) => {
        const caja = el.classList.contains('marco__scroll--abajo') ? el : el.parentElement;
        caja.scrollTop = caja.scrollHeight;
      });
    }, 400);
    return () => clearTimeout(t);
  }, [tema]);
  return (
    <TemaCtx.Provider value={tema}>
      <header className="lienzo__cabecera">
        <div className="lienzo__textos">
          <span className="t-label c-ter">Frencia · Pantallas de la app</span>
          <h1 className="lienzo__titulo">{titulo}</h1>
          {bajada ? <p className="lienzo__bajada">{bajada}</p> : null}
        </div>
        <ThemeToggle theme={tema} onChange={setTema} />
      </header>
      <div key={tema}>{children}</div>
    </TemaCtx.Provider>
  );
}

function Seccion({ titulo, nota, children }) {
  return (
    <section>
      <div className="lienzo__seccion">
        <h2 className="lienzo__seccion-titulo">{titulo}</h2>
        {nota ? <p className="lienzo__bajada">{nota}</p> : null}
      </div>
      <div className="lienzo__grilla">{children}</div>
    </section>
  );
}

/* ---- Pestanias de primer nivel: src/app/(main)/_layout.tsx ---- */
const TABS = [
  { value: 'home', label: 'Inicio', icon: 'home' },
  { value: 'routines', label: 'Rutinas', icon: 'layers' },
  { value: 'history', label: 'Historial', icon: 'history' },
  { value: 'profile', label: 'Perfil', icon: 'user' },
];

/* ---- Mesa: una pantalla dentro del marco iPhone con su rotulo ---- */
function Mesa({ nombre, nota, ruta, tab, capa, children }) {
  const tema = React.useContext(TemaCtx);
  return (
    <div className="mesa">
      <IOSDevice dark={tema === 'dark'} width={390} height={844}>
        <div className={`scr${tab ? ' scr--tabs' : ''}`}>
          {tab ? (
            <>
              <div className="scr__cuerpo">{children}</div>
              <div className="scr__tabbar">
                <DS.TabBar items={TABS} value={tab} fab={{ icon: 'plus', label: 'Crear' }} />
              </div>
            </>
          ) : children}
          {capa || null}
        </div>
      </IOSDevice>
      <div className="mesa__textos">
        <span className="mesa__nombre">{nombre}</span>
        {nota ? <span className="mesa__nota">{nota}</span> : null}
        {ruta ? <span className="mesa__ruta">{ruta}</span> : null}
      </div>
    </div>
  );
}

/* ---- Boton de volver (Button ghost sm con chevron) ---- */
function Volver({ texto = 'Atrás', icono = 'chevron-left', cls = '', children }) {
  return (
    <div className={`barra-volver ${cls}`}>
      <DS.Button variant="ghost" size="sm" icon={icono}>{texto}</DS.Button>
      {children}
    </div>
  );
}

/* ---- Campo de texto con icono: el Field de login, registro y wizard ---- */
function Campo({ icono, texto, ph, foco, final, lg, inset, iconoAcento, iconoTam = 20 }) {
  const colorIcono = foco || iconoAcento ? 'c-acc-fill' : 'c-ter';
  return (
    <div className={`campo${lg ? ' campo--lg' : ''}${inset ? ' campo--inset' : ''}${foco ? ' campo--foco' : ''}`}>
      <Ico n={icono} s={iconoTam} c={colorIcono} />
      <span className={`campo__texto${texto ? '' : ' campo__texto--ph'}`}>
        {texto || ph}{foco ? <span className="cursor"></span> : null}
      </span>
      {final || null}
    </div>
  );
}

/* ---- Campo que abre una rueda (SelectField de editar perfil) ---- */
function CampoSelector({ label, icono, valor, ph }) {
  return (
    <div className="col g3">
      <span className="t-label c-ter">{label}</span>
      <div className="campo">
        <Ico n={icono} c="c-ter" />
        <span className={`campo__valor${valor ? '' : ' c-ter'}`}>{valor || ph}</span>
        <Ico n="chevron-right" c="c-ter" />
      </div>
    </div>
  );
}

/* ---- Logos de los proveedores de login ---- */
function LogoApple() {
  return (
    <svg className="logo-apple" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.21 1.11-.05 1.53-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.15.85-1.23 1.19-2.43 1.21-2.49-.03-.01-2.31-.89-2.34-3.53zM14.19 6.14c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.55.64-1.05 1.69-.92 2.68.98.08 1.97-.49 2.58-1.23z" />
    </svg>
  );
}
function LogoGoogle() {
  return (
    <svg className="logo-g" viewBox="0 0 24 24" aria-hidden="true">
      <path className="g-azul" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path className="g-verde" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path className="g-amarillo" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path className="g-rojo" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
function BotonSocial({ proveedor }) {
  return (
    <button className="frencia-btn frencia-btn--secondary frencia-btn--lg btn-social">
      {proveedor === 'apple' ? <LogoApple /> : <LogoGoogle />}
      <span>{proveedor === 'apple' ? 'Apple' : 'Google'}</span>
    </button>
  );
}

/* ---- Avatar generativo (boring-avatars "beam" con la paleta de la app) ----
   src/design/components/Avatar.tsx. El Avatar del bundle muestra iniciales;
   la app, sin foto, dibuja esta cara. */
function AvatarBeam({ size = 44, ring = false }) {
  return (
    <span className={`avatar-beam${ring ? ' avatar-beam--ring' : ''}`} data-size={size}>
      <svg viewBox="0 0 36 36" width={size} height={size} aria-hidden="true">
        <mask id={`m${size}`} maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
          <rect width="36" height="36" rx="72" fill="white" />
        </mask>
        <g mask={`url(#m${size})`}>
          <rect width="36" height="36" className="beam-fondo" />
          <rect x="0" y="0" width="36" height="36" rx="6" className="beam-cara" transform="translate(4 4) rotate(340 18 18) scale(1.1)" />
          <g transform="translate(-4 -1) rotate(-4 18 18)">
            <path d="M15 21c2 1 4 1 6 0" strokeWidth="1.2" fill="none" strokeLinecap="round" className="beam-rasgo" />
            <rect x="12" y="14" width="1.5" height="2" rx="1" className="beam-ojo" />
            <rect x="22" y="14" width="1.5" height="2" rx="1" className="beam-ojo" />
          </g>
        </g>
      </svg>
    </span>
  );
}

/* ---- Hoja inferior y dialogo (src/components/Dialogo.tsx) ---- */
function Hoja({ cls = '', children }) {
  return <div className="velo"><div className={`hoja ${cls}`}>{children}</div></div>;
}
function Dialogo({ titulo, mensaje, children }) {
  return (
    <div className="velo velo--centro">
      <div className="dialogo">
        <div className="col g4">
          {titulo ? <span className="t-subtitle">{titulo}</span> : null}
          {mensaje ? <span className="t-bodysm c-sec">{mensaje}</span> : null}
        </div>
        <div className="col g4">{children}</div>
      </div>
    </div>
  );
}

/* ---- Toast (src/contexts/toast.tsx) ---- */
function Toast({ texto, tipo = 'success', accion }) {
  const icono = { success: 'check', error: 'triangle-alert', info: 'info' }[tipo];
  return (
    <div className="toast">
      <div className="toast__cuerpo">
        <Ico n={icono} s={20} c={`toast__ico--${tipo}`} />
        <span className="t-bodysm c-pri f1">{texto}</span>
      </div>
      {accion ? <span className="t-bodysm semi c-acc toast__accion">{accion}</span> : null}
    </div>
  );
}

/* ---- Tira de semana: home (no tocable) y editor del dia (tocable) ---- */
const SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
function Semana({ on = [], editor = false }) {
  return (
    <div className={`semana${editor ? ' semana--editor' : ''}`}>
      {SEMANA.map((d, i) => (
        <div key={d} className={`semana__dia${on.includes(i) ? ' semana__dia--on' : ''}`}>
          <span className={editor ? '' : 't-label'}>{d}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- Fila arrastrable (src/components/DraggableRowList.tsx) ---- */
function FilaArrastre({ titulo, detalle, levantada, n }) {
  return (
    <div className={`fila-arrastre${levantada ? ' fila-arrastre--levantada' : ''}`}>
      <div className="row g4 f1">
        {n != null ? <span className="fila-arrastre__n">{String(n).padStart(2, '0')}</span> : <Ico n="grip-vertical" s={18} c="c-ter" />}
        <div className="col g1 f1">
          <span className="t-bodysm c-pri una-linea">{titulo}</span>
          {typeof detalle === 'string' ? <span className="t-label c-ter">{detalle}</span> : detalle}
        </div>
      </div>
      {n != null ? <Ico n="grip-vertical" s={18} c="c-dis" /> : <Ico n="trash-2" s={18} c="c-ter" />}
    </div>
  );
}

/* ---- Resumen de un ejercicio del dia (src/design/components/ExerciseSummary.tsx) ----
   "4x10 · RIR 2 · 2:00": intensidad en ambar, descanso con reloj. */
function Resumen({ vol, int, desc }) {
  return (
    <span className="res">
      <span className="res__vol">{vol}</span>
      {int ? <><span className="res__sep">·</span><span className="res__int">{int}</span></> : null}
      {desc ? <><span className="res__sep">·</span><span className="res__desc"><Ico n="timer" s={13} />{desc}</span></> : null}
    </span>
  );
}

/* ---- Rueda (WheelPicker) y MeasurePicker ---- */
function Rueda({ valores, sel, ancho = 96, alinear = 'centro' }) {
  const items = [];
  for (let d = -3; d <= 3; d++) {
    const v = valores[sel + d];
    const cls = d === 0 ? 'rueda__item--sel' : `rueda__item--d${Math.abs(d)}`;
    items.push(<div key={d} className={`rueda__item ${cls}`}>{v === undefined ? '' : v}</div>);
  }
  return <div className={`rueda rueda--${alinear} ancho-${ancho}`}>{items}</div>;
}
const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
function Medida({ tipo, unidad = 'metric' }) {
  const toggle = tipo === 'altura' || tipo === 'peso';
  const opciones = tipo === 'altura'
    ? [{ value: 'metric', label: 'cm' }, { value: 'imperial', label: 'ft' }]
    : [{ value: 'metric', label: 'kg' }, { value: 'imperial', label: 'lb' }];
  let ruedas = null;
  let lado = null;
  if (tipo === 'edad') {
    ruedas = <Rueda valores={rango(13, 99)} sel={12} />;
    lado = 'años';
  } else if (tipo === 'altura') {
    ruedas = unidad === 'metric'
      ? <Rueda valores={rango(120, 220)} sel={50} />
      : (<><Rueda valores={rango(4, 7)} sel={1} ancho={64} alinear="der" /><span className="medida__unidad">ft</span>
          <Rueda valores={rango(0, 11)} sel={7} ancho={64} alinear="der" /><span className="medida__unidad">in</span></>);
    lado = unidad === 'metric' ? 'cm' : null;
  } else if (tipo === 'peso') {
    ruedas = (<><Rueda valores={rango(30, 200)} sel={42} ancho={112} alinear="der" /><span className="medida__punto">.</span>
      <Rueda valores={rango(0, 9)} sel={5} ancho={52} alinear="izq" /></>);
    lado = unidad === 'metric' ? 'kg' : 'lb';
  } else {
    ruedas = (<><Rueda valores={rango(0, 10)} sel={2} ancho={64} alinear="der" /><span className="medida__unidad">min</span>
      <Rueda valores={rango(0, 11).map((i) => String(i * 5).padStart(2, '0'))} sel={0} ancho={64} alinear="der" /><span className="medida__unidad">s</span></>);
  }
  return (
    <div className="medida">
      {toggle ? <DS.SegmentedControl accent options={opciones} value={unidad} className="medida__toggle" /> : null}
      <div className="medida__escenario">
        <div className="medida__resalte"></div>
        <div className="medida__ruedas">{ruedas}</div>
        {lado ? <div className="medida__unidad-lado">{lado}</div> : null}
      </div>
    </div>
  );
}

/* ---- NumberField (src/design/components/NumberField.tsx) ---- */
function CampoNumero({ label, formato, valor, unidad, paso = '1' }) {
  return (
    <div className="numero">
      {label ? (
        <div className="numero__cabeza">
          <span className="numero__label">{label}</span>
          {formato ? <span className="numero__formato">{formato}</span> : null}
        </div>
      ) : null}
      <div className="numero__fila">
        <div className="numero__btn"><Ico n="minus" s={16} /><span className="numero__paso">{paso}</span></div>
        <div className="numero__pozo">
          <span className={`numero__valor${valor == null ? ' numero__valor--vacio' : ''}`}>{valor == null ? '—' : valor}</span>
          {unidad ? <span className="numero__unidad">{unidad}</span> : null}
        </div>
        <div className="numero__btn"><Ico n="plus" s={16} /><span className="numero__paso">{paso}</span></div>
      </div>
    </div>
  );
}

/* ---- SerieComparativa del codigo: Rutina / Ultima / Hoy ---- */
function Grilla({ columnas, cuando, hoy = true, amplia = false }) {
  return (
    <div className={`grilla${amplia ? ' grilla--amplia' : ''}`}>
      <div className="grilla__fila">
        <div className="grilla__etq"></div>
        {columnas.map((c) => <div key={c.label} className="grilla__celda"><div className="t-label c-ter center">{c.label}</div></div>)}
      </div>
      <div className="grilla__fila">
        <div className="grilla__etq"><span className="t-label c-ter">Rutina</span></div>
        {columnas.map((c) => (
          <div key={c.label} className="grilla__celda">
            <div className={`grilla__ref${c.plan == null ? ' grilla__ref--vacia' : ''}`}>{c.plan == null ? '—' : c.plan}</div>
          </div>
        ))}
      </div>
      <div className="grilla__fila">
        <div className="grilla__etq">
          <span className="t-label c-ter">Última</span>
          <span className="t-label c-dis una-linea">{cuando || 'sin registro'}</span>
        </div>
        {columnas.map((c) => {
          const v = cuando ? c.ant : null;
          return (
            <div key={c.label} className="grilla__celda">
              <div className={`grilla__ref${v == null ? ' grilla__ref--vacia' : ''}`}>{v == null ? '—' : v}</div>
            </div>
          );
        })}
      </div>
      {hoy ? (
        <div className="grilla__fila grilla__fila--hoy">
          <div className="grilla__etq"><span className="t-label c-acc">Hoy</span></div>
          {columnas.map((c) => {
            const cargado = c.hoy != null && c.hoy !== '';
            const cls = c.foco ? ' grilla__caja--foco' : cargado ? ' grilla__caja--cargada' : ' grilla__caja--vacia';
            return (
              <div key={c.label} className="grilla__celda">
                <div className={`grilla__caja${cls}`}>{cargado ? c.hoy : '—'}{c.foco ? <span className="cursor"></span> : null}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* ---- Aro de descanso (src/components/RestRing.tsx) ----
   Esfera de 60 marcas con un arco de acero que se vacia. */
function Aro({ total, restante, children }) {
  const T = 240, cx = T / 2, rArco = 96;
  const c = 2 * Math.PI * rArco;
  const lleno = total > 0 ? restante / total : 0;
  const marcas = [];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
    const mayor = i % 5 === 0;
    const r1 = cx - 2, r2 = r1 - (mayor ? 9 : 5);
    const cls = i / 60 < lleno ? 'aro__marca aro__marca--on' : mayor ? 'aro__marca aro__marca--mayor' : 'aro__marca';
    marcas.push(<line key={i} x1={cx + r1 * Math.cos(a)} y1={cx + r1 * Math.sin(a)} x2={cx + r2 * Math.cos(a)} y2={cx + r2 * Math.sin(a)} className={cls} strokeWidth="1" />);
  }
  return (
    <div className="aro">
      <svg width={T} height={T} viewBox={`0 0 ${T} ${T}`} aria-hidden="true">
        {marcas}
        <circle cx={cx} cy={cx} r={rArco} className="aro__pista" strokeWidth="2" fill="none" />
        <circle cx={cx} cy={cx} r={rArco} className="aro__lleno" strokeWidth="2" fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - lleno)} transform={`rotate(-90 ${cx} ${cx})`} />
      </svg>
      <div className="aro__centro">{children}</div>
    </div>
  );
}

/* ---- Ticket de la sesion (src/components/TicketSesion.tsx) ---- */
function pathSilueta(w, h, yMuesca) {
  const R = 22, r = 10;
  const n = (v) => String(Math.round(v * 100) / 100);
  const arco = (x, y) => `A ${r} ${r} 0 0 0 ${n(x)} ${n(y)}`;
  const esquina = (x, y) => `A ${R} ${R} 0 0 1 ${n(x)} ${n(y)}`;
  return [
    `M 0 ${R}`, esquina(R, 0), `L ${n(w - R)} 0`, esquina(w, R),
    `L ${n(w)} ${n(yMuesca - r)}`, arco(w, yMuesca + r),
    `L ${n(w)} ${n(h - R)}`, esquina(w - R, h), `L ${R} ${n(h)}`, esquina(0, h - R),
    `L 0 ${n(yMuesca + r)}`, arco(0, yMuesca - r), 'Z',
  ].join(' ');
}
function Barras({ id }) {
  const hex = id.replace(/[^0-9a-f]/gi, '') || '0';
  const barras = [...hex].map((ch) => { const v = parseInt(ch, 16); return { b: 1 + (v % 3), e: 1 + (v >> 2) }; });
  const rects = [];
  let x = 0;
  for (let rep = 0; rep < 3; rep++) {
    barras.forEach((bar, i) => { rects.push(<rect key={`${rep}-${i}`} x={x} y="0" width={bar.b} height="36" />); x += bar.b + bar.e; });
  }
  return (
    <svg className="ticket__barras" viewBox="0 0 294 36" preserveAspectRatio="xMinYMid slice" aria-hidden="true">{rects}</svg>
  );
}
function Ticket({ dia, fecha, hora, duracion, volumen, unidad = 'kg', ejercicios, series, id }) {
  const ref = React.useRef(null);
  const perfRef = React.useRef(null);
  const [medidas, setMedidas] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !perfRef.current) return;
    const w = ref.current.offsetWidth, h = ref.current.offsetHeight;
    const y = perfRef.current.offsetTop + 12;
    setMedidas({ w, h, y });
  }, []);
  const codigo = `FRENCIA-${id.replace(/-/g, '').toUpperCase().slice(0, 4)}-${id.replace(/-/g, '').toUpperCase().slice(4, 11)}`;
  return (
    <div className="ticket" ref={ref}>
      {medidas ? (
        <svg className="ticket__silueta" width={medidas.w} height={medidas.h} aria-hidden="true">
          <path d={pathSilueta(medidas.w, medidas.h, medidas.y)} />
        </svg>
      ) : null}
      <div className="ticket__contenido">
        <div className="ticket__encabezado">
          <div className="ticket__marca">
            <span className="ticket__marca-texto">FRENCIA<span className="ticket__punto"></span></span>
            <span className="ticket__meta">Nº {id.replace(/-/g, '').slice(0, 6).toUpperCase()}</span>
          </div>
          <div className="ticket__completa">Sesión completa</div>
          <div className="ticket__meta">{dia} · {fecha} · {hora}</div>
        </div>
        <div className="ticket__grandes">
          <div className="ticket__grande"><span className="ticket__etq">Duración</span><span className="ticket__grande-valor">{duracion}</span></div>
          <div className="ticket__sep"></div>
          <div className="ticket__grande"><span className="ticket__etq">Tonelaje · {unidad}</span><span className="ticket__grande-valor">{volumen}</span></div>
        </div>
        <div className="ticket__perforacion" ref={perfRef}><div className="ticket__perforacion-linea"></div></div>
        <div className="ticket__conteos">
          <div className="ticket__conteo"><span className="ticket__etq">Ejercicios</span><span className="ticket__conteo-valor">{ejercicios.length}</span></div>
          <div className="ticket__conteo"><span className="ticket__etq">Series</span><span className="ticket__conteo-valor">{series}</span></div>
          <div className="ticket__conteo"><span className="ticket__etq">Mejor marca</span><span className="ticket__conteo-valor">{ejercicios[0].marca}</span></div>
        </div>
        <div className="ticket__registro">
          {ejercicios.map((e) => (
            <div key={e.nombre} className="ticket__fila">
              <div className="row f1 g3"><span className="ticket__fila-series">{e.n}×</span><span className="ticket__fila-nombre una-linea">{e.nombre}</span></div>
              <span className="ticket__fila-marca">{e.marca}</span>
            </div>
          ))}
        </div>
        <div className="ticket__codigo">
          <Barras id={id} />
          <span className="ticket__codigo-texto">{codigo}</span>
        </div>
      </div>
    </div>
  );
}

/* Datos de ejemplo del ticket, compartidos por resumen e historial */
const TICKET_DEMO = {
  dia: 'Push', fecha: '9 OCT 2026', hora: '07:42', duracion: '58:14', volumen: '6 390', series: 15,
  id: '7c1e2a9b-4f3d-4e21-9a0b-5d8c3e1f6a72',
  ejercicios: [
    { n: 4, nombre: 'Press de banca con barra', marca: '82.5 kg' },
    { n: 3, nombre: 'Press inclinado con mancuernas', marca: '30 kg' },
    { n: 3, nombre: 'Fondos en paralelas', marca: '12 reps' },
    { n: 3, nombre: 'Plancha', marca: '1:00' },
    { n: 2, nombre: 'Elevaciones laterales', marca: '12.5 kg' },
  ],
};

/* ============================================================
   Piezas comunes de los wizards (setup, crear rutina, sesion)
   ============================================================ */

/* Escala de avance: una marca por paso; cortes separa grupos (ejercicios) */
function Escala({ total, actual, cortes = [] }) {
  const out = [];
  for (let i = 0; i < total; i++) {
    const cls = i < actual ? ' escala__marca--hecha' : i === actual ? ' escala__marca--actual' : '';
    out.push(<span key={i} className={'escala__marca' + cls}></span>);
    if (cortes.includes(i) && i < total - 1) out.push(<span key={'c' + i} className="escala__corte"></span>);
  }
  return <div className="escala" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={actual + 1}>{out}</div>;
}

/* Marco de un paso: barra (volver · contador · accion), escala, enunciado, control y pie */
function Paso({ actual, total, volver = 'Atrás', volverOff, derecha, rotulo, pregunta, ayuda, pie, cortes, children }) {
  return (
    <div className="paso">
      <div className="paso__barra">
        <DS.Button variant="ghost" size="sm" icon={volver === 'Salir' ? 'x' : 'chevron-left'} disabled={volverOff}>{volver}</DS.Button>
        <span className="paso__contador">{String(actual + 1).padStart(2, '0')}<span>/ {String(total).padStart(2, '0')}</span></span>
        {derecha || <span></span>}
      </div>
      <div className="paso__escala"><Escala total={total} actual={actual} cortes={cortes} /></div>
      <div className="paso__cuerpo">
        <div className="paso__enunciado">
          {rotulo ? <span className="t-label paso__rotulo">{rotulo}</span> : null}
          <span className="t-display">{pregunta}</span>
          {ayuda ? <span className="t-bodysm paso__ayuda">{ayuda}</span> : null}
        </div>
        {children}
      </div>
      {pie ? <div className="paso__pie">{pie}</div> : null}
    </div>
  );
}

/* Boton de texto para la barra (Saltar, Omitir) */
function BotonTexto({ children, senal, off }) {
  return <button className={`boton-texto${senal ? ' boton-texto--senal' : ''}${off ? ' boton-texto--off' : ''}`}>{children}</button>;
}

/* Lista de opciones con radio */
function Opciones({ opciones, sel }) {
  return (
    <div className="opciones" role="radiogroup">
      {opciones.map((o) => (
        <div key={o} className={`opcion${o === sel ? ' opcion--sel' : ''}`} role="radio" aria-checked={o === sel}>
          <span>{o}</span><span className="opcion__radio"></span>
        </div>
      ))}
    </div>
  );
}

/* Campo de linea: texto grande sobre una hairline */
function Linea({ texto, ph, foco, chica, pie }) {
  return (
    <div className={`linea${foco ? ' linea--foco' : ''}${chica ? ' linea--chica' : ''}`}>
      <div className="linea__campo">
        <span className={`linea__texto${texto ? '' : ' linea__texto--ph'}`}>{texto || ph}{foco ? <span className="cursor"></span> : null}</span>
      </div>
      {pie ? <div className="linea__pie">{pie}</div> : null}
    </div>
  );
}

/* Regla: lectura grande y una escala horizontal con aguja de acero */
function Regla({ valor, unidad, paso = 1, n = 24, mayor = 10, media = 5, decimales = 0, fmt, lectura }) {
  const marcas = [], numeros = [];
  for (let i = -n; i <= n; i++) {
    const v = Math.round((valor + i * paso) * 1000) / 1000;
    const k = Math.round(v / paso);
    const esMayor = k % mayor === 0, esMedia = !esMayor && k % media === 0;
    marcas.push(<span key={i} className={'regla__marca' + (esMayor ? ' regla__marca--mayor' : esMedia ? ' regla__marca--media' : '')}></span>);
    if (esMayor) numeros.push(<span key={i} className="regla__numero" style={{ left: `calc(${((i + n) / (2 * n)) * 100}% )` }}>{fmt ? fmt(v) : v.toFixed(0)}</span>);
  }
  return (
    <div className="lectura">
      <div className="lectura__valor">{lectura || <><span className="lectura__num">{valor.toFixed(decimales)}</span><span className="lectura__unidad">{unidad}</span></>}</div>
      <div className="regla" aria-hidden="true">
        <div className="regla__marcas">{marcas}</div>
        <div className="regla__numeros">{numeros}</div>
        <span className="regla__aguja"></span>
        <span className="regla__fundido regla__fundido--izq"></span>
        <span className="regla__fundido regla__fundido--der"></span>
      </div>
    </div>
  );
}

/* Icono de app real de la marca, segun el tema */
function IconoApp({ size = 64 }) {
  const tema = React.useContext(TemaCtx);
  return <img className="marca__icono" style={{ width: size, height: size }} src={`../../assets/Brand/app-icon-${tema === 'dark' ? 'dark' : 'light'}.png`} alt="Frencia" />;
}

Object.assign(window, {
  DS, TemaCtx, Ico, Lienzo, Seccion, Mesa, Volver, Campo, CampoSelector, BotonSocial, AvatarBeam,
  Hoja, Dialogo, Toast, Semana, FilaArrastre, Resumen, Rueda, Medida, CampoNumero, Grilla, Aro, Ticket, TICKET_DEMO,
  Escala, Paso, BotonTexto, Opciones, Linea, Regla, IconoApp,
});
