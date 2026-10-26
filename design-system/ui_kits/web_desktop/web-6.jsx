// Frencia Web · 6 Historial: lista, detalle de una sesión y su ticket.

const MESES = [
  ['Octubre', '9 sesiones', [
    ['Jue 22', 'Push', 'Push Pull Legs', '58 min', '15'],
    ['Mié 21', 'Legs', 'Push Pull Legs', '1 h 12 min', '14'],
    ['Mar 20', 'Pull', 'Push Pull Legs', '49 min', '13'],
    ['Lun 19', 'Push', 'Push Pull Legs', '1 h 02 min', '15'],
  ]],
  ['Septiembre', '14 sesiones', [
    ['Mar 29', 'Pull', 'Push Pull Legs', '51 min', '13'],
    ['Lun 28', 'Push', 'Push Pull Legs', '55 min', '15'],
  ]],
];
function Historial({ menu, error, filtro }) {
  return (
    <App activo="history" capa={menu === 'eliminar' ? <Modal chico titulo="Eliminar el entrenamiento del jueves 22" texto="Se borran sus 15 series. Tus mejores marcas se recalculan. No se puede deshacer." pie={<><Boton v="secondary" estado="foco">Cancelar</Boton><Boton v="danger" ico="trash-2">Eliminar</Boton></>} /> : null}>
      <Pagina>
        <Encabezado rotulo="Historial" titulo="Lo que hiciste" acciones={<Selector md ico="layers" valor={filtro ? 'Push Pull Legs' : 'Todas las rutinas'} />} />
        <div className="w-cuatro">
          {[['Sesiones', '86', ''], ['Tiempo total', '79', 'h']].map(([l, v, u]) => (
            <div key={l} className="w-tarjeta w-metrica"><span className="t-label c-ter">{l}</span><span className="w-metrica__valor">{v}{u ? <small>{u}</small> : null}</span></div>
          ))}
        </div>
        {MESES.map(([m, n, filas], mi) => (
          <div key={m} className="col g4">
            <div className="row entre"><span className="t-subtitle">{m}</span>{error && mi === 1 ? null : <span className="t-label c-ter">{n}</span>}</div>
            <div className="w-lista w-lista--sin-recorte">
              <table className="w-tabla">
                <thead><tr><th>Fecha</th><th>Día</th><th>Rutina</th><th className="num">Duración</th><th className="num">Series</th><th></th></tr></thead>
                <tbody>{filas.map(([f, d, r, dur, s], i) => {
                  const abierto = menu === 'menu' && mi === 0 && i === 0;
                  return (
                    <tr key={f} className={abierto || (mi === 0 && i === 1 && !menu) ? 'is-hover' : ''}>
                      <td className="c-sec">{f}</td><td><span className="semi">{d}</span></td><td className="c-sec">{r}</td><td className="num">{dur}</td><td className="num">{s}</td>
                      <td className="w-tabla__acc">
                        {abierto ? <BotonIco ico="ellipsis" t="sm" estado="foco" label="Más acciones" /> : <BotonIco ico="trash-2" t="sm" label="Eliminar entrenamiento" />}
                        {abierto ? <Menu className="w-menu--flota"><MenuItem ico="ticket" estado="hover">Ver ticket</MenuItem><MenuItem ico="download">Descargar ticket</MenuItem><MenuSep /><MenuItem ico="trash-2" dang kbd="Supr">Eliminar</MenuItem></Menu> : null}
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        ))}
        {error ? <div className="w-aviso-pie"><span className="t-bodysm c-sec f1">No pudimos cargar más entrenamientos.</span><Boton v="soft" t="sm" ico="rotate-ccw" anima>Reintentar</Boton></div> : <div className="row centro g3 c-sec"><Ruedita /><span className="t-bodysm">Cargando agosto…</span></div>}
      </Pagina>
    </App>
  );
}
function HistorialVacio() {
  return (
    <App activo="history">
      <Pagina>
        <Encabezado rotulo="Historial" titulo="Lo que hiciste" />
        <div className="w-tarjeta w-tarjeta--punteada col g5 centro w-vacio">
          <Ico n="history" s={28} c="c-ter" />
          <span className="t-subtitle">Todavía no hay sesiones</span>
          <span className="t-bodysm c-sec">Cuando termines tu primer entrenamiento en la app, va a aparecer acá con cada serie y el peso que levantaste.</span>
        </div>
      </Pagina>
    </App>
  );
}

/* ---------- Detalle de una sesión ---------- */
const SERIES = [
  ['Press de banca con barra', ['Peso', 'Reps', 'RIR'], [['80 kg', '8', '3'], ['82.5 kg', '8', '2'], ['82.5 kg', '7', '1'], ['85 kg', '6', 'Al fallo']], 3],
  ['Press inclinado con mancuernas', ['Peso', 'Reps', 'RIR'], [['30 kg', '10', '2'], ['30 kg', '10', '2'], ['30 kg', '9', '1']]],
  ['Plancha', ['Tiempo', 'RPE'], [['1:00', '7'], ['0:55', '8'], ['0:50', '9']]],
  ['Cinta de correr', ['Tiempo', 'Distancia', 'RPE'], [['30:15', '5.10 km', '7']]],
];
function Detalle({ capa }) {
  return (
    <App activo="history" capa={capa}>
      <Pagina>
        <div className="w-migas"><Boton v="ghost" t="sm" ico="chevron-left">Historial</Boton></div>
        <div className="w-dos w-dos--ticket">
          <div className="col g7">
            <div className="col g4 items-inicio">
              <Badge tono="signal" ico="check">Completada</Badge>
              <Boton v="danger" t="sm" ico="trash-2">Eliminar entrenamiento</Boton>
              <span className="w-nombre-rutina">Push</span>
              <span className="t-data c-sec">jueves, 22 de octubre de 2026 · 07:42 · Push Pull Legs</span>
            </div>
            <div className="w-cuatro">
              {[['Duración', '58', 'min'], ['Series', '15', ''], ['Ejercicios', '5', ''], ['Tonelaje', '6 390', 'kg']].map(([l, v, u]) => <div key={l} className="w-metrica"><span className="t-label c-ter">{l}</span><span className="w-metrica__valor">{v}{u ? <small>{u}</small> : null}</span></div>)}
            </div>
            {SERIES.map(([n, cols, filas, mejor]) => (
              <div key={n} className="w-tarjeta col g4">
                <div className="row entre"><span className="t-subtitle">{n}</span><span className="t-label c-ter">{filas.length} series</span></div>
                <table className="w-tabla w-tabla--series">
                  <thead><tr><th>Serie</th>{cols.map((c) => <th key={c} className="num">{c}</th>)}<th></th></tr></thead>
                  <tbody>{filas.map((f, i) => (
                    <tr key={i}><td><span className="w-serie-n">{i + 1}</span></td>{f.map((v, k) => <td key={k} className={`num${k === f.length - 1 && cols[k] !== 'Distancia' ? ' w-esfuerzo' : ''}`}>{k === f.length - 1 && cols[k] !== 'Distancia' ? <><Ico n="flame" s={13} />{v === 'Al fallo' ? v : `${cols[k]} ${v}`}</> : v}</td>)}<td className="num">{mejor === i + 1 ? <Badge tono="intensity" ico="flame">Nuevo PR</Badge> : <Ico n="check" s={16} c="c-acc" />}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="col g5 w-ticket-lateral">
            <Ticket />
            <div className="row g3"><Boton v="secondary" ico="download" className="f1" anima>Descargar</Boton><Boton v="secondary" ico="maximize-2" className="f1">Ver grande</Boton></div>
          </div>
        </div>
      </Pagina>
    </App>
  );
}
function TicketGrande() {
  return (
    <div className="w-centrada">
      <div className="col g6 centro">
        <Ticket />
        <div className="row g3"><Boton v="ghost" ico="arrow-left">Volver a la sesión</Boton><Boton v="secondary" ico="copy" anima>Copiar imagen</Boton><Boton ico="download" anima>Descargar PNG</Boton></div>
      </div>
    </div>
  );
}

function AppWeb() {
  return (
    <Lienzo titulo="Historial" bajada="Las sesiones se registran en el celular y se revisan acá. La lista es una tabla agrupada por mes con totales arriba; el detalle pone las series en tablas y el ticket al costado. Fondo velada en lista y detalle (densas en datos); centro para el ticket solo.">
      <Seccion titulo="Lista" nota="(main)/history — sin filtro de período. Arriba, sesiones y tiempo total de todo el historial (no cambian al bajar); sin tonelaje ni racha. La lista entra con los últimos 3 meses y, al llegar al final, trae de a 20 sesiones más viejas hasta el principio; el total del mes aparece cuando ya no quedan páginas por traer.">
        <Mesa nombre="Lista con hover" nota="La fila abre el detalle; la papelera abre la confirmación sin navegar." ruta="(main)/history" fondo="velada" url="frencia.app/historial"><Historial /></Mesa>
        <Mesa nombre="Menú de una fila" nota="Clic derecho o ⋯: ver o descargar el ticket y eliminar. En la app esto era deslizar." ruta="(main)/history" fondo="velada" url="frencia.app/historial"><Historial menu="menu" /></Mesa>
        <Mesa nombre="Error al cargar más" nota="Lo cargado queda; al pie, el aviso en vidrio con Reintentar. Sin carmín: es un error de lectura." ruta="(main)/history" fondo="velada" url="frencia.app/historial"><Historial error filtro /></Mesa>
        <Mesa nombre="Vacío" ruta="(main)/history" fondo="velada" url="frencia.app/historial"><HistorialVacio /></Mesa>
      </Seccion>
      <Seccion titulo="Detalle de una sesión" nota="session-history — las series de cada ejercicio en una tabla: el esfuerzo en tinta con la llama, el check en lume y el PR como único relleno de tinta de esfuerzo.">
        <Mesa nombre="Detalle con el ticket al costado" ruta="session-history" fondo="velada" url="frencia.app/historial/7c1e2a9b"><Detalle /></Mesa>
        <Mesa nombre="Eliminar la sesión" ruta="session-history · alerta" fondo="velada" url="frencia.app/historial/7c1e2a9b"><Detalle capa={<Modal chico titulo="Eliminar este entrenamiento" texto="Se borran esta sesión y sus series del historial. Tu rutina no cambia. No se puede deshacer." pie={<><Boton v="secondary" estado="foco">Cancelar</Boton><Boton v="danger" ico="trash-2">Eliminar</Boton></>} />} /></Mesa>
      </Seccion>
      <Seccion titulo="Ticket" nota="session-ticket — el pase solo, sobre la luz del centro, para descargarlo como imagen o copiarlo al portapapeles.">
        <Mesa nombre="Ticket de la sesión" ruta="session-ticket" fondo="centro" url="frencia.app/historial/7c1e2a9b/ticket"><TicketGrande /></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
