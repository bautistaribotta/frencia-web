// Frencia · Pantallas - 7 Entrenamiento: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, Badge } = DS;

/* ---------- src/app/session-history.tsx ---------- */
function FilaSerie({ i, datos, sep = ' × ', esfuerzo }) {
  return (
    <div className="sesion-fila">
      <span className="sesion-fila__idx">{i}</span>
      <div className="sesion-fila__datos">
        <span className="peso-reps">
          {datos.map((d, k) => (
            <React.Fragment key={k}>
              {k > 0 ? <span className="peso-reps__sep">{sep}</span> : null}
              {d[0]}{d[1] ? <span className="peso-reps__unidad"> {d[1]}</span> : null}
            </React.Fragment>
          ))}
        </span>
        {esfuerzo ? <span className="t-label esfuerzo">{esfuerzo}</span> : null}
      </div>
      <Ico n="check" s={18} c="c-ter" />
    </div>
  );
}
function Ejercicio({ nombre, series, children }) {
  return (
    <div className="ejercicio-bloque">
      <div className="ejercicio-cabeza"><span className="t-subtitle una-linea ejercicio-cabeza__nombre">{nombre}</span><span className="t-label c-sec">{series} series</span></div>
      {children}
    </div>
  );
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
          <Ejercicio nombre="Press de banca con barra" series={4}>
            <FilaSerie i={1} datos={[['80', 'kg'], ['8', 'reps']]} esfuerzo="RIR 3" />
            <FilaSerie i={2} datos={[['82.5', 'kg'], ['8', 'reps']]} esfuerzo="RIR 2" />
            <FilaSerie i={3} datos={[['82.5', 'kg'], ['7', 'reps']]} esfuerzo="RIR 1" />
            <FilaSerie i={4} datos={[['82.5', 'kg'], ['6', 'reps']]} esfuerzo="Al fallo" />
          </Ejercicio>
          <Ejercicio nombre="Plancha" series={3}>
            <FilaSerie i={1} sep=" · " datos={[['1:00']]} esfuerzo="RPE 7" />
            <FilaSerie i={2} sep=" · " datos={[['0:55']]} esfuerzo="RPE 8" />
            <FilaSerie i={3} sep=" · " datos={[['0:50']]} esfuerzo="RPE 9" />
          </Ejercicio>
          <Ejercicio nombre="Cinta de correr" series={1}>
            <FilaSerie i={1} sep=" · " datos={[['30:15'], ['5.10', 'km']]} esfuerzo="RPE 7" />
          </Ejercicio>
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
      <Seccion titulo="Series realizadas" nota="src/app/session-history.tsx — cada serie en una fila con hairline, el número a la izquierda; la intensidad en ámbar.">
        <Mesa nombre="Detalle" nota="Peso por reps se lee como producto; tiempo y distancia, uno al lado del otro." ruta="session-history"><Detalle /></Mesa>
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
