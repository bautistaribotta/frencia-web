// Frencia · Pantallas - 7 Entrenamiento: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, Badge } = DS;

/* ---------- src/app/session-history.tsx ---------- */
function Ejercicio({ nombre, series, children }) {
  return (
    <div className="ejercicio-bloque">
      <div className="ejercicio-cabeza"><span className="t-subtitle una-linea ejercicio-cabeza__nombre">{nombre}</span><span className="t-label c-sec">{series} series</span></div>
      {children}
    </div>
  );
}
/* ---- Series realizadas: datos de ejemplo ---- */
const SERIES_HIST = [
  { nombre: 'Press de banca con barra', cols: [{ u: 'kg', l: 'Peso' }, { u: 'reps', l: 'Reps' }], esf: 'RIR',
    filas: [['80', '8', '3'], ['82.5', '8', '2'], ['82.5', '7', '1'], ['82.5', '6', 'Al fallo']] },
  { nombre: 'Plancha', cols: [{ u: '', l: 'Tiempo' }], esf: 'RPE', filas: [['1:00', '7'], ['0:55', '8'], ['0:50', '9']] },
  { nombre: 'Cinta de correr', cols: [{ u: '', l: 'Tiempo' }, { u: 'km', l: 'Distancia' }], esf: 'RPE', filas: [['30:15', '5.10', '7']] },
];
const esfTexto = (ej, v) => (v === 'Al fallo' ? 'Al fallo' : `${ej.esf} ${v}`);

/* Filas en vidrio: cada serie en su propia fila con el numero en un circulo,
   peso x reps en una sola linea a un mismo tamano (unidades chicas en
   terciario), el esfuerzo en una pildora con la llama y el check en lume. */
function SeriesFilas({ ej }) {
  const n = ej.cols.length;
  return (
    <div className="sf-lista">
      {ej.filas.map((f, i) => (
        <div key={i} className="sf-fila">
          <span className="sf-idx">{i + 1}</span>
          <span className="sf-datos">
            {f.slice(0, n).map((v, k) => (
              <React.Fragment key={k}>
                {k > 0 ? <span className="sf-sep">{n === 2 && ej.cols[1].u === 'reps' ? '×' : '·'}</span> : null}
                <span className="sf-valor">{v}</span>{ej.cols[k].u ? <span className="sf-unidad">{ej.cols[k].u}</span> : null}
              </React.Fragment>
            ))}
          </span>
          <span className="sf-esf"><Ico n="flame" s={13} />{esfTexto(ej, f[n])}</span>
          <Ico n="check" s={18} c="c-acc-fill" />
        </div>
      ))}
    </div>
  );
}

function SeriesEjercicio({ ej }) {
  return <SeriesFilas ej={ej} />;
}

function Detalle({ abajo }) {
  return (
    <>
      <Volver />
      <div className="pad f1 detalle-hist">
        <div className={`col detalle-hist__contenido${abajo ? ' detalle-hist__contenido--abajo' : ''}`}>
          <div className="col g7 detalle-hist__intro">
            <div className="col g4 items-inicio">
              <Badge tone="signal">Completada</Badge>
              <span className="rutina-nombre">Push</span>
              <span className="t-data c-sec">viernes, 9 de octubre de 2026</span>
            </div>
            <div className="resumen-metricas">
              <div className="metrica metrica--doble"><span className="t-label c-sec">Duración</span><span className="metrica__valor">58 min</span></div>
              <div className="metrica"><span className="t-label c-sec">Series</span><span className="metrica__valor">15</span></div>
              <div className="metrica"><span className="t-label c-sec">Ejercicios</span><span className="metrica__valor">5</span></div>
            </div>
            <span className="t-label c-sec">Series realizadas</span>
          </div>
          {SERIES_HIST.map((ej) => (
            <Ejercicio key={ej.nombre} nombre={ej.nombre} series={ej.filas.length}>
              <SeriesEjercicio ej={ej} />
            </Ejercicio>
          ))}
          <div className="row hist-acciones">
            <Button variant="secondary" size="lg" icon="ticket" className="frencia-btn--flex">Ver ticket</Button>
            <Button variant="primary" size="lg" icon="share" className="frencia-btn--flex">Compartir</Button>
          </div>
        </div>
      </div>
    </>
  );
}
function SinSeries() {
  return (
    <>
      <Volver />
      <div className="pad col g7 detalle-hist">
        <div className="col g7">
          <div className="col g4 items-inicio">
            <Badge tone="signal">Completada</Badge>
            <span className="rutina-nombre">Pull</span>
            <span className="t-data c-sec">martes, 29 de septiembre de 2026</span>
          </div>
          <div className="resumen-metricas">
            <div className="metrica metrica--doble"><span className="t-label c-sec">Duración</span><span className="metrica__valor">4 min</span></div>
            <div className="metrica"><span className="t-label c-sec">Series</span><span className="metrica__valor">0</span></div>
            <div className="metrica"><span className="t-label c-sec">Ejercicios</span><span className="metrica__valor">0</span></div>
          </div>
        </div>
        <div className="tarjeta--punteada col items-centro g5 vacio-series">
          <Ico n="list" s={24} c="c-sec" />
          <span className="t-subtitle center">Sin series registradas</span>
          <span className="t-bodysm c-sec center">Este entrenamiento se completó sin guardar ninguna serie.</span>
        </div>
      </div>
    </>
  );
}
function Estado({ tipo }) {
  return (
    <>
      <Volver />
      {tipo === 'carga' ? (
        <div className="carga"><span className="ruedita"></span><span className="t-bodysm c-sec">Cargando entrenamiento…</span></div>
      ) : (
        <div className="carga pad">
          <span className="t-subtitle center">{tipo === 'error' ? 'No pudimos cargar el entrenamiento' : 'No encontramos este entrenamiento'}</span>
          <span className="t-bodysm c-sec center">{tipo === 'error' ? 'Revisá tu conexión y probá de nuevo.' : 'Puede que ya no esté disponible en tu historial.'}</span>
          {tipo === 'error' ? <Button variant="secondary">Reintentar</Button> : null}
        </div>
      )}
    </>
  );
}

/* ---------- src/app/session-ticket.tsx ---------- */
function TicketHistorial({ abajo }) {
  return (
    <div className="marco">
      <div className="row pad barra-ticket"><Button variant="ghost" size="sm" icon="chevron-left">Atrás</Button></div>
      <div className={`marco__scroll${abajo ? ' marco__scroll--abajo' : ''}`}>
        <Ticket {...TICKET_DEMO} />
        <div className="marco__fundido-arriba"></div>
        <div className="marco__fundido-abajo"></div>
      </div>
      <div className="marco__acciones">
        <Button variant="primary" size="lg" icon="share" className="frencia-btn--flex">Compartir</Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Lienzo titulo="Detalle de un entrenamiento" bajada="Lo que quedó guardado en una sesión terminada, sin reconstruirlo desde el plan actual ni ofrecer controles que cambien un registro histórico. Al pie: ver la sesión como ticket o compartirla como imagen.">
      <Seccion titulo="Series realizadas" nota="src/app/session-history.tsx — cada serie en su fila de vidrio: el número en un círculo, peso × reps en una sola línea al mismo tamaño, el esfuerzo en una píldora con la llama y el check en lume.">
        <Mesa nombre="Detalle" nota="Peso × reps se lee como producto; tiempo y distancia, separados por un punto. Los valores van todos al mismo tamaño y las unidades en chico, sobre la misma línea." ruta="session-history"><Detalle /></Mesa>
        <Mesa nombre="Final del scroll" nota="Ver ticket y Compartir cierran la lista." ruta="session-history"><Detalle abajo /></Mesa>
        <Mesa nombre="Sin series" ruta="session-history"><SinSeries /></Mesa>
        <Mesa nombre="Cargando" ruta="session-history"><Estado tipo="carga" /></Mesa>
        <Mesa nombre="Error" ruta="session-history"><Estado tipo="error" /></Mesa>
        <Mesa nombre="No encontrado" ruta="session-history"><Estado tipo="nada" /></Mesa>
      </Seccion>
      <Seccion titulo="Ticket del historial" nota="src/app/session-ticket.tsx — el mismo ticket del resumen, armado con lo que quedó guardado.">
        <Mesa nombre="Ticket" ruta="session-ticket"><TicketHistorial /></Mesa>
        <Mesa nombre="Ticket · final del scroll" ruta="session-ticket"><TicketHistorial abajo /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
