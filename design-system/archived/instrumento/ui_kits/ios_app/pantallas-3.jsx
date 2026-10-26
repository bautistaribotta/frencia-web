// Frencia · Pantallas - 3 Pestanias: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, Badge, IconButton, MetricPill } = DS;

/* ---------- Inicio: src/app/(main)/home.tsx ---------- */
function Saludo({ racha, pendiente }) {
  return (
    <div className="row entre">
      <div className="row g4">
        <AvatarBeam size={44} ring />
        <div className="col">
          <span className="t-subtitle">Hola, Bautista</span>
          <span className="t-label c-ter">Domingo · 11 oct</span>
        </div>
      </div>
      {racha ? <Badge tone={pendiente ? 'neutral' : 'intensity'} icon="flame">{racha} días</Badge> : null}
    </div>
  );
}

const DIAS = [
  { nombre: 'Push', ejercicios: 6, dias: [0, 3], texto: 'Lun, Jue' },
  { nombre: 'Pull', ejercicios: 5, dias: [1, 4], texto: 'Mar, Vie' },
  { nombre: 'Legs', ejercicios: 7, dias: [2, 5], texto: 'Mié, Sáb' },
];

function InicioConRutina({ racha = 12, pendiente }) {
  return (
    <div className="tab-scroll tab-scroll--g7">
      <Saludo racha={racha} pendiente={pendiente} />
      <div className="col g4">
        <div className="row row--base entre g4 encabezado-bloque">
          <span className="t-subtitle una-linea">Push Pull Legs</span>
          <span className="t-label c-ter fnone">3 días</span>
        </div>
        {DIAS.map((d) => (
          <div key={d.nombre} className="tarjeta col g4">
            <div className="row g3">
              <div className="col g1 f1">
                <span className="t-subtitle una-linea">{d.nombre}</span>
                <span className="t-label c-ter">{d.ejercicios} ejercicios · {d.texto}</span>
              </div>
              <IconButton icon="pencil" variant="ghost" size="sm" />
            </div>
            <Semana on={d.dias} />
            <Button variant="primary" size="lg" icon="play" fullWidth>Empezar</Button>
          </div>
        ))}
        <div className="col g3">
          <Button variant="secondary" size="lg" icon="plus" fullWidth>Crear rutina nueva</Button>
          <span className="t-label c-ter center">Podés reemplazar la actual o guardarla</span>
        </div>
      </div>
    </div>
  );
}

function InicioVacio() {
  const pasos = [
    { n: 1, t: 'Creá tu primera rutina', s: 'Ejercicios, series y repeticiones', on: true },
    { n: 2, t: 'Registrá una sesión', s: 'Peso, reps y RIR mientras entrenás' },
    { n: 3, t: 'Seguí tu progreso', s: 'PR, volumen semanal y 1RM estimado' },
  ];
  return (
    <div className="tab-scroll tab-scroll--g7">
      <Saludo />
      <div className="col g4">
        <div className="hero">
          <div className="col g4">
            <span className="t-label c-ter">Tu sesión de hoy</span>
            <span className="t-display hero__titulo">Empezá por tu rutina.</span>
            <span className="t-bodysm c-sec hero__parrafo">Todavía no tenés rutinas. Cargá la que ya usás y registrá cada serie a tu manera.</span>
          </div>
          <Button variant="primary" size="lg" icon="plus" fullWidth>Crear primera rutina</Button>
        </div>
        <div className="row centrar g3 c-ter"><Ico n="calendar-off" s={13} /><span className="t-label">Sin sesiones programadas</span></div>
      </div>
      <div className="col g4">
        <div className="row row--base entre encabezado-bloque"><span className="t-label c-ter">Primeros pasos</span><span className="t-label c-ter">0 / 3</span></div>
        <div className="lista">
          {pasos.map((p) => (
            <div key={p.n} className={`pasos__fila${p.on ? '' : ' pasos__fila--bloqueada'}`}>
              <div className={`pasos__num ${p.on ? 'pasos__num--on' : 'pasos__num--off'}`}>{p.n}</div>
              <div className="col g1 f1"><span className="t-bodysm semi c-pri">{p.t}</span><span className="t-bodysm t-sub c-ter">{p.s}</span></div>
              <Ico n={p.on ? 'chevron-right' : 'lock'} s={17} c={p.on ? 'c-pri' : 'c-dis'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Rutinas: src/app/(main)/routines.tsx ---------- */
function TarjetaRutina({ nombre, datos, activa, desliza }) {
  const frente = (
    <div className={`tarjeta tarjeta--lg row g4${activa ? ' tarjeta--activa' : ''}`}>
      <div className="col g3 f1">
        <span className="t-subtitle una-linea">{nombre}</span>
        <span className={`t-label ${activa ? 'c-acc' : 'c-ter'}`}>{activa ? `En curso · ${datos}` : datos}</span>
      </div>
      <Ico n="chevron-right" s={18} c="c-ter" />
    </div>
  );
  if (!desliza) return frente;
  return (
    <div className="deslizable">
      <div className={`deslizable__accion deslizable__accion--${desliza === 'izq' ? 'der' : 'izq'}`}><Ico n={desliza === 'izq' ? 'trash-2' : 'play'} s={22} /></div>
      <div className={`deslizable__frente deslizable__frente--${desliza}`}>{frente}</div>
    </div>
  );
}
const ANTERIORES = [
  { nombre: 'Fuerza 4 días', datos: '4 días · 12 MAY 2026' },
  { nombre: 'Full body', datos: '3 días · 2 FEB 2026' },
  { nombre: 'Torso / pierna', datos: '4 días · 8 NOV 2025' },
];
function Rutinas({ deslizaActiva, deslizaAnterior, sinActiva }) {
  return (
    <div className="tab-scroll">
      <div className="col g6">
        <span className="t-label c-ter">Rutinas</span>
        {sinActiva ? (
          <div className="tarjeta--punteada-fina col items-inicio g5 pad-card-fina">
            <span className="t-bodysm c-sec">No tenés ninguna rutina en curso.</span>
            <Button variant="secondary" size="md" icon="plus">Crear rutina</Button>
          </div>
        ) : (
          <TarjetaRutina nombre="Push Pull Legs" datos="3 días · 29 JUL 2026" activa desliza={deslizaActiva} />
        )}
        <div className="row entre encabezado-bloque"><span className="t-label c-ter">Anteriores</span><span className="t-label c-ter">3</span></div>
      </div>
      <div className="col g3 lista-sep">
        {ANTERIORES.map((r, i) => <TarjetaRutina key={r.nombre} {...r} desliza={i === 0 ? deslizaAnterior : undefined} />)}
      </div>
    </div>
  );
}
function VacioTab({ icono, titulo, texto, boton }) {
  return (
    <div className="tarjeta--punteada col items-centro g5">
      <Ico n={icono} s={26} c="c-ter" />
      <span className="t-subtitle center">{titulo}</span>
      <span className="t-bodysm c-sec center vacio-parrafo">{texto}</span>
      {boton || null}
    </div>
  );
}
function RutinasVacia() {
  return (
    <div className="tab-scroll">
      <div className="col g6">
        <span className="t-label c-ter">Rutinas</span>
        <VacioTab icono="layers" titulo="Todavía no tenés rutinas" texto="Cuando crees una, va a aparecer acá junto con las que archives más adelante."
          boton={<Button variant="primary" size="lg" icon="plus">Crear rutina</Button>} />
      </div>
    </div>
  );
}
function Cargando({ titulo, texto }) {
  return (
    <>
      <div className="pad tab-titulo"><span className="t-label c-ter">{titulo}</span></div>
      <div className="carga"><span className="ruedita"></span><span className="t-bodysm c-sec">{texto}</span></div>
    </>
  );
}
function ErrorCarga({ titulo, que }) {
  return (
    <div className="tab-scroll">
      <div className="col g6">
        <span className="t-label c-ter">{titulo}</span>
        <div className="tarjeta col items-centro g5">
          <span className="t-bodysm center">No pudimos cargar {que}.</span>
          <span className="t-bodysm c-sec center">Revisá tu conexión y probá de nuevo.</span>
          <Button variant="secondary">Reintentar</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Historial: src/app/(main)/history.tsx ---------- */
function TarjetaSesion({ nombre, fecha, duracion, desliza }) {
  const frente = (
    <div className="tarjeta col g4">
      <div className="row g3">
        <div className="col g1 f1"><span className="t-subtitle una-linea">{nombre}</span><span className="t-label c-ter">{fecha}</span></div>
        <div className="icono-verde icono-verde--32"><Ico n="check" s={16} /></div>
      </div>
      <div className="row entre wrap g3">
        <MetricPill icon="timer" label="Duración" value={duracion} />
        <div className="row g1"><span className="t-bodysm c-sec">Ver series</span><Ico n="chevron-right" s={18} c="c-ter" /></div>
      </div>
    </div>
  );
  if (!desliza) return frente;
  return (
    <div className="deslizable deslizable--xl">
      <div className="deslizable__accion deslizable__accion--der"><Ico n="trash-2" s={22} /></div>
      <div className="deslizable__frente deslizable__frente--izq">{frente}</div>
    </div>
  );
}
function Historial({ desliza }) {
  return (
    <div className="tab-scroll">
      <div className="encabezado-bloque hist-titulo"><span className="t-label c-ter">Historial</span></div>
      <div className="mes"><span className="t-subtitle">Octubre</span></div>
      <div className="lista-sesiones">
        <TarjetaSesion nombre="Push" fecha="Vie 9 oct · hace 2 días" duracion="58 min" desliza={desliza} />
        <TarjetaSesion nombre="Legs" fecha="Mié 7 oct · hace 4 días" duracion="1 h 12 min" />
      </div>
      <div className="mes mes--separado"><span className="t-subtitle">Septiembre</span><span className="t-label c-ter">14 sesiones</span></div>
      <div className="lista-sesiones">
        <TarjetaSesion nombre="Pull" fecha="Mar 29 sep · hace 12 días" duracion="49 min" />
      </div>
    </div>
  );
}
function HistorialVacio() {
  return (
    <div className="tab-scroll">
      <div className="encabezado-bloque hist-titulo"><span className="t-label c-ter">Historial</span></div>
      <VacioTab icono="history" titulo="Todavía no hay sesiones" texto="Cuando termines tu primer entrenamiento va a aparecer acá, con las series que hiciste y el peso que levantaste." />
    </div>
  );
}

function App() {
  return (
    <Lienzo titulo="Inicio, Rutinas e Historial" bajada="Las pestañas de primer nivel. La barra vive en el layout y el botón central abre el wizard de crear rutina. Inicio responde qué entreno hoy; Rutinas, qué planes tuve; Historial, qué ya hice.">
      <Seccion titulo="Inicio" nota="src/app/(main)/home.tsx — la racha va arriba a la derecha: ámbar con la racha viva, neutra si hoy toca y todavía no entrenaste.">
        <Mesa nombre="Con rutina activa" nota="Cada día es una tarjeta con su tira de semana y Empezar. El lápiz edita ese día." ruta="(main)/home" tab="home"><InicioConRutina /></Mesa>
        <Mesa nombre="Racha pendiente hoy" nota="La racha pasa a neutra hasta que se entrena." ruta="(main)/home" tab="home"><InicioConRutina racha={12} pendiente /></Mesa>
        <Mesa nombre="Cuenta nueva" nota="Una frase y una acción; los primeros pasos se desbloquean en orden." ruta="(main)/home" tab="home"><InicioVacio /></Mesa>
      </Seccion>
      <Seccion titulo="Rutinas" nota="src/app/(main)/routines.tsx — todas las rutinas ocupan la misma tarjeta; la en curso lleva un filo de acero a la izquierda y lo dice en texto.">
        <Mesa nombre="Lista" ruta="(main)/routines" tab="routines"><Rutinas /></Mesa>
        <Mesa nombre="Deslizar: eliminar o poner en curso" nota="Hacia la izquierda asoma Eliminar (carmín); hacia la derecha, en las anteriores, Poner en curso (tinta)." ruta="(main)/routines" tab="routines"><Rutinas deslizaActiva="izq" deslizaAnterior="der" /></Mesa>
        <Mesa nombre="Sin rutina en curso" ruta="(main)/routines" tab="routines"><Rutinas sinActiva /></Mesa>
        <Mesa nombre="Vacía" ruta="(main)/routines" tab="routines"><RutinasVacia /></Mesa>
        <Mesa nombre="Cargando" nota="CargaCentrada: ruedita de tinta y leyenda." ruta="(main)/routines" tab="routines"><Cargando titulo="Rutinas" texto="Cargando rutinas…" /></Mesa>
        <Mesa nombre="Error de carga" ruta="(main)/routines" tab="routines"><ErrorCarga titulo="Rutinas" que="tus rutinas" /></Mesa>
      </Seccion>
      <Seccion titulo="Historial" nota="src/app/(main)/history.tsx — sesiones terminadas agrupadas por mes; el total del mes aparece cuando ya no quedan páginas por traer.">
        <Mesa nombre="Lista" ruta="(main)/history" tab="history"><Historial /></Mesa>
        <Mesa nombre="Deslizar para eliminar" ruta="(main)/history" tab="history"><Historial desliza="izq" /></Mesa>
        <Mesa nombre="Vacío" ruta="(main)/history" tab="history"><HistorialVacio /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
