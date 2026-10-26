// Frencia Web · 4 Inicio y Rutinas.

const SEMANA_PLAN = [
  { d: 'Lun 19', n: 'Push', e: 'hecho' }, { d: 'Mar 20', n: 'Pull', e: 'hecho' }, { d: 'Mié 21', n: 'Legs', e: 'hecho' },
  { d: 'Jue 22', n: 'Push', e: 'hecho' }, { d: 'Vie 23', n: 'Pull', e: 'salteado' }, { d: 'Sáb 24', n: 'Legs', e: 'hoy' }, { d: 'Dom 25', n: null, e: 'libre' },
];
const SESIONES = [['Push', 'Jue 22 oct', '58 min', '15 series'], ['Legs', 'Mié 21 oct', '1 h 12 min', '14 series'], ['Pull', 'Mar 20 oct', '49 min', '13 series']];
const MARCAS = [['Press de banca con barra', '85 kg × 8', 'hace 2 días'], ['Sentadilla', '120 kg × 6', 'hace 3 días'], ['Dominadas', '+10 kg × 6', 'hace 4 días']];

function Semanal() {
  return (
    <div className="w-tarjeta col g5">
      <div className="row entre"><span className="t-label c-ter">Esta semana · 4 de 6</span><span className="row g2 t-bodysm c-sec"><Ico n="smartphone" s={16} />Hoy toca Legs: empezalo desde la app</span></div>
      <div className="w-semanal">
        {SEMANA_PLAN.map((x) => (
          <div key={x.d} className={`w-semanal__dia is-${x.e}`}>
            <span className="t-label c-ter">{x.d}</span>
            <span className="t-bodysm semi">{x.n || 'Descanso'}</span>
            <span className="w-semanal__estado">{x.e === 'hecho' ? <><Ico n="check" s={14} />Hecho</> : x.e === 'hoy' ? 'Hoy' : x.e === 'salteado' ? 'No entrenado' : '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function DiaTarjeta({ d, i }) {
  return (
    <div className={`w-tarjeta w-tarjeta--link col g4${i === 2 ? ' w-tarjeta--elevada' : ''}`}>
      <div className="row entre g3"><div className="col g1"><span className="t-subtitle">{d.n}</span><span className="t-label c-ter">{i === 2 ? <span className="c-acc">Hoy · </span> : null}{d.ej.length} ejercicios</span></div><BotonIco ico="pencil" t="sm" tip="Editar día" anima /></div>
      <Semana on={d.sem} />
      <div className="col g3">{d.ej.slice(0, 3).map((e) => <div key={e.n} className="row entre g3"><span className="t-bodysm c-pri una-linea f1">{e.n}</span><Res vol={e.vol} int={e.int} /></div>)}</div>
    </div>
  );
}
function Inicio() {
  return (
    <App activo="home">
      <Pagina>
        <Encabezado rotulo="Sábado 24 de octubre" titulo="Hola, Bautista" acciones={<Badge tono="intensity" ico="flame">12 días de racha</Badge>} />
        <Semanal />
        <div className="w-dos">
          <div className="col g5">
            <div className="row entre"><div className="row g4"><span className="t-subtitle">Push Pull Legs</span><Badge tono="signal">En curso</Badge></div><Boton v="ghost" t="sm" icoDer="arrow-right">Ver rutina</Boton></div>
            <div className="w-tres">{RUTINA.dias.map((d, i) => <DiaTarjeta key={d.n} d={d} i={i} />)}</div>
          </div>
          <div className="col g5">
            <div className="row entre"><span className="t-subtitle">Últimas sesiones</span><Boton v="ghost" t="sm" icoDer="arrow-right">Historial</Boton></div>
            <div className="w-lista">{SESIONES.map(([n, f, dur, s]) => <div key={f} className="w-fila w-fila--link"><div className="col g1 f1"><span className="t-bodysm semi">{n}</span><span className="t-label c-ter">{f} · {s}</span></div><span className="t-data">{dur}</span></div>)}</div>
            <span className="t-label c-ter">Mejores marcas recientes</span>
            <div className="w-lista">{MARCAS.map(([n, m, c]) => <div key={n} className="w-fila"><div className="col g1 f1"><span className="t-bodysm semi una-linea">{n}</span><span className="t-label c-ter">{c}</span></div><span className="row g2 t-data c-pri"><Ico n="flame" s={14} />{m}</span></div>)}</div>
          </div>
        </div>
      </Pagina>
    </App>
  );
}
function InicioVacio() {
  const pasos = [['1', 'Armá tu rutina acá', 'Con el catálogo al lado y arrastrando ejercicios.', true], ['2', 'Entrená con la app', 'Registrá peso, reps y RIR desde el celular.'], ['3', 'Revisá tu progreso', 'Historial, mejores marcas y tonelaje, en la pantalla grande.']];
  return (
    <App activo="home">
      <Pagina>
        <Encabezado rotulo="Sábado 24 de octubre" titulo="Hola, Bautista" />
        <div className="w-tarjeta w-hero col g6 items-inicio">
          <span className="t-label c-ter">Tu primera rutina</span>
          <span className="t-display w-hero__titulo">Traé la rutina que ya usás.</span>
          <span className="t-body c-sec w-hero__texto">Todavía no tenés rutinas. Cargala acá con el teclado y el catálogo a mano; después la entrenás desde el celular.</span>
          <Boton t="lg" ico="plus">Crear primera rutina</Boton>
        </div>
        <div className="w-tres">{pasos.map(([n, t, s, on]) => <div key={n} className={`w-tarjeta col g3${on ? '' : ' w-tarjeta--punteada'}`}><span className={`w-paso-n${on ? ' is-on' : ''}`}>{n}</span><span className="t-bodysm semi">{t}</span><span className="t-bodysm c-sec">{s}</span></div>)}</div>
      </Pagina>
    </App>
  );
}
function InicioCargando() {
  return (
    <App activo="home">
      <Pagina>
        <div className="col g3"><span className="w-esqueleto k-esq k-esq--rotulo w-esq-corto"></span><span className="w-esqueleto w-esq-titulo"></span></div>
        <div className="w-tarjeta"><span className="w-esqueleto w-esq-bloque"></span></div>
        <div className="w-dos"><div className="w-tres">{[0, 1, 2].map((i) => <div key={i} className="w-tarjeta col g4"><span className="w-esqueleto k-esq k-esq--titulo"></span><span className="w-esqueleto k-esq k-esq--linea"></span><span className="w-esqueleto k-esq"></span><span className="w-esqueleto k-esq k-esq--rotulo"></span></div>)}</div><div className="w-tarjeta col g4"><span className="w-esqueleto k-esq"></span><span className="w-esqueleto k-esq k-esq--linea"></span><span className="w-esqueleto k-esq"></span></div></div>
      </Pagina>
    </App>
  );
}

/* ---------- Rutinas ---------- */
const ANTERIORES = [['Fuerza 4 días', '4 días · 22 ejercicios', 'Archivada el 12 MAY 2026', '38'], ['Full body', '3 días · 15 ejercicios', 'Archivada el 2 FEB 2026', '21'], ['Torso / pierna', '4 días · 20 ejercicios', 'Archivada el 8 NOV 2025', '44']];
function Rutinas({ menu }) {
  return (
    <App activo="routines">
      <Pagina>
        <Encabezado rotulo="Rutinas" titulo="Tus rutinas" sub="Una en curso; al poner otra en curso, la actual pasa a Anteriores con su historial." acciones={<Boton ico="plus">Nueva rutina</Boton>} />
        <div className="w-tarjeta w-tarjeta--activa w-tarjeta--link row g7">
          <div className="col g3 f1"><span className="t-label c-acc">En curso · desde 29 JUL 2026</span><span className="t-title">Push Pull Legs</span><span className="t-bodysm c-sec">3 días · 18 ejercicios · 24 sesiones</span></div>
          <div className="row g5">{RUTINA.dias.map((d) => <div key={d.n} className="col g2"><span className="t-label c-ter">{d.n}</span><Semana on={d.sem} /></div>)}</div>
          <Ico n="chevron-right" s={20} c="c-ter" />
        </div>
        <div className="col g4">
          <div className="row entre"><span className="t-label c-ter">Anteriores · 3</span><Seg ops={[['rec', 'Recientes'], ['az', 'A–Z']]} sel="rec" /></div>
          <div className="w-lista w-lista--sin-recorte">
            <table className="w-tabla">
              <thead><tr><th>Rutina</th><th>Días</th><th>Archivada</th><th className="num">Sesiones</th><th></th></tr></thead>
              <tbody>{ANTERIORES.map(([n, d, a, s], i) => (
                <tr key={n} className={menu && i === 0 ? 'is-hover' : ''}>
                  <td><span className="semi">{n}</span></td><td className="c-sec">{d}</td><td className="c-sec">{a}</td><td className="num">{s}</td>
                  <td className="w-tabla__acc">
                    <BotonIco ico="ellipsis" t="sm" estado={menu && i === 0 ? 'foco' : undefined} label={`Más acciones de ${n}`} />
                    {menu && i === 0 ? (
                      <Menu className="w-menu--flota">
                        <MenuItem ico="play" estado="hover">Poner en curso</MenuItem>
                        <MenuItem ico="pencil">Editar</MenuItem>
                        <MenuItem ico="copy">Duplicar</MenuItem>
                        <MenuItem ico="share">Compartir</MenuItem>
                        <MenuSep />
                        <MenuItem ico="trash-2" dang kbd="Supr">Eliminar</MenuItem>
                      </Menu>
                    ) : null}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </Pagina>
    </App>
  );
}
function RutinasVacia() {
  return (
    <App activo="routines">
      <Pagina>
        <Encabezado rotulo="Rutinas" titulo="Tus rutinas" />
        <div className="w-tarjeta w-tarjeta--punteada col g5 centro w-vacio">
          <Ico n="layers" s={28} c="c-ter" />
          <span className="t-subtitle">Todavía no tenés rutinas</span>
          <span className="t-bodysm c-sec">Cuando crees una va a aparecer acá, junto con las que archives más adelante.</span>
          <div className="row g3"><Boton ico="plus">Crear rutina</Boton><span className="row g2 t-bodysm c-ter">o apretá <Kbd>N</Kbd></span></div>
        </div>
      </Pagina>
    </App>
  );
}

/* ---------- Detalle de rutina ---------- */
function Detalle({ archivada, capa }) {
  return (
    <App activo="routines" capa={capa}>
      <Pagina>
        <div className="w-migas"><Boton v="ghost" t="sm" ico="chevron-left">Rutinas</Boton></div>
        <div className="w-encabezado">
          <div className="w-encabezado__textos">
            <div className="row g3">{archivada ? <Badge>Archivada</Badge> : <Badge tono="signal">En curso</Badge>}</div>
            <span className="w-nombre-rutina">{archivada ? 'Fuerza 4 días' : 'Push Pull Legs'}</span>
            <span className="t-data c-sec">{archivada ? '4 días · 22 ejercicios · 38 sesiones · archivada el 12 MAY 2026' : '3 días · 18 ejercicios · 24 sesiones · creada el 29 JUL 2026'}</span>
          </div>
          <div className="row g3">
            <Boton v="secondary" ico="share" anima>Compartir</Boton>
            {archivada ? <Boton ico="play">Poner en curso</Boton> : <Boton ico="pencil" anima>Editar rutina</Boton>}
            <BotonIco ico="ellipsis" v="surface" label="Más acciones" />
          </div>
        </div>
        <div className="w-tres">
          {RUTINA.dias.map((d) => (
            <div key={d.n} className="w-tarjeta col g5">
              <div className="row entre"><div className="col g1"><span className="t-subtitle">{d.n}</span><span className="t-label c-ter">{d.ej.length} ejercicios</span></div><Semana on={d.sem} /></div>
              <div className="col">{d.ej.map((e, i) => (
                <div key={e.n} className="w-ej-fila">
                  <span className="w-ej__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="w-tipo w-tipo--sm"><Ico n={TIPO_ICO[e.k]} s={16} /></span>
                  <div className="col g1 f1"><span className="t-bodysm semi una-linea">{e.n}</span><Res vol={e.vol} int={e.int} desc={e.desc} /></div>
                </div>
              ))}</div>
            </div>
          ))}
        </div>
      </Pagina>
    </App>
  );
}
function ModalCompartir({ paso }) {
  if (paso === 2) {
    return (
      <Modal titulo="Link listo" texto="Quien lo abra se lleva una copia de Push Pull Legs tal como está ahora." ico={<Ico n="copy" s={20} />}>
        <div className="w-link-caja"><Ico n="link-2" s={18} c="c-ter" /><span className="w-link-caja__txt">frencia.app/r/K7Q2-PX9A</span><Badge>Copia</Badge></div>
        <span className="row g2 t-label c-ter"><Ico n="clock" s={14} />Vence en 7 días · se puede usar varias veces</span>
        <div className="w-modal__pie"><Boton v="secondary" ico="message-circle">Enviar por WhatsApp</Boton><Boton ico="copy" anima>Copiar link</Boton></div>
      </Modal>
    );
  }
  return (
    <Modal titulo="Compartir Push Pull Legs" texto="Elegí qué recibe la otra persona." pie={<><Boton v="ghost">Cancelar</Boton><Boton ico="link">Crear link</Boton></>}>
      <div className="col g3">
        <Opcion ico="copy" titulo="Una copia" texto="Recibe la rutina como está hoy. Después es suya: la puede editar y tus cambios no le llegan." sel />
        <Opcion ico="link" titulo="La original" texto="Queda vinculada a la tuya. Cuando la edites, se actualiza también para quien la recibió." estado="hover" />
      </div>
    </Modal>
  );
}

function AppWeb() {
  return (
    <Lienzo titulo="Inicio y Rutinas" bajada="Inicio responde qué toca esta semana y qué pasó; no hay Empezar, porque desde la web no se entrena. Rutinas lista los planes y el detalle muestra los días lado a lado. Fondo cumbre en todas: la luz arriba a la derecha queda detrás del encabezado y de los números grandes.">
      <Seccion titulo="Inicio" nota="(main)/home — la semana en curso arriba, la rutina con sus días y, a la derecha, lo último que pasó.">
        <Mesa nombre="Con rutina en curso" nota="La semana muestra lo hecho en tinta, hoy en lume y lo no entrenado en terciario. Solo el día de hoy sube a vidrio elevado. Las mejores marcas llevan la llama, sin color." ruta="(main)/home" url="frencia.app"><Inicio /></Mesa>
        <Mesa nombre="Cuenta nueva" ruta="(main)/home" url="frencia.app"><InicioVacio /></Mesa>
        <Mesa nombre="Primera carga" nota="Esqueletos con la forma del contenido; la navegación ya está lista." ruta="(main)/home · cargando" url="frencia.app"><InicioCargando /></Mesa>
      </Seccion>
      <Seccion titulo="Rutinas" nota="(main)/routines — la en curso lleva un borde fino de lume, parejo en todo el contorno; las anteriores son una tabla ordenable. Lo que en la app se hace deslizando, acá va en el menú ⋯ de cada fila.">
        <Mesa nombre="Lista con menú de una fila" nota="El menú se abre con clic, con el botón ⋯ o con clic derecho sobre la fila. Supr elimina la fila enfocada (pide confirmar)." ruta="(main)/routines" url="frencia.app/rutinas"><Rutinas menu /></Mesa>
        <Mesa nombre="Sin rutinas" ruta="(main)/routines" url="frencia.app/rutinas"><RutinasVacia /></Mesa>
      </Seccion>
      <Seccion titulo="Detalle de una rutina" nota="routine — los días en columnas, con cada ejercicio y su resumen (volumen · intensidad en tinta · descanso). Editar rutina abre el constructor.">
        <Mesa nombre="Rutina en curso" ruta="routine" url="frencia.app/rutinas/push-pull-legs"><Detalle /></Mesa>
        <Mesa nombre="Rutina archivada" nota="La acción principal pasa a Poner en curso." ruta="routine" url="frencia.app/rutinas/fuerza-4-dias"><Detalle archivada /></Mesa>
        <Mesa nombre="Compartir · qué se comparte" nota="La hoja de la app pasa a un modal con las mismas dos opciones." ruta="routine · ShareModal" url="frencia.app/rutinas/push-pull-legs"><Detalle capa={<ModalCompartir />} /></Mesa>
        <Mesa nombre="Compartir · link listo" nota="En escritorio la acción principal es Copiar link (al copiar, el icono pasa a check y aparece el aviso); WhatsApp abre WhatsApp Web con el mensaje armado." ruta="routine · ShareModal" url="frencia.app/rutinas/push-pull-legs"><Detalle capa={<ModalCompartir paso={2} />} /></Mesa>
        <Mesa nombre="Confirmar eliminación" nota="El foco arranca en Cancelar: Enter no borra por accidente." ruta="routine · alerta" url="frencia.app/rutinas/push-pull-legs"><Detalle capa={<Modal chico titulo="Eliminar Push Pull Legs" texto="Se borra la rutina con sus 3 días y los ejercicios de cada uno. Tu historial de sesiones no se toca. No se puede deshacer." pie={<><Boton v="secondary" estado="foco">Cancelar</Boton><Boton v="danger" ico="trash-2">Eliminar</Boton></>} />} /></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
