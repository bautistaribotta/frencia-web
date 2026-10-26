// Frencia · Pantallas - 6 Sesion: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, IconButton, ProgressBar, DurationField, DistanceField, IsoTimer, MarqueeText } = DS;

/* ---------- Esqueleto: src/app/session.tsx ----------
   Arriba: salir · contador de ejercicio · menu, y la escala de la sesion
   con un corte entre ejercicio y ejercicio. Abajo: Anterior como icono y
   la accion principal ancha, siempre en el mismo lugar. */
const CORTES = [8, 14, 20, 26];
function Sesion({ paso, de = 30, nro, nombre, debajo, anclado, ultimo, accion, siguienteOff, children }) {
  return (
    <div className="sesion">
      <div className="sesion__cabeza">
        <IconButton icon="x" variant="ghost" size="md" aria-label="Salir" />
        <div className="sesion__contador">
          <span className="paso__contador">Push<span>· {nro} / 5</span></span>
        </div>
        <IconButton icon="ellipsis" variant="ghost" size="md" aria-label="Menú del ejercicio" />
      </div>
      <div className="sesion__escala"><Escala total={de} actual={paso - 1} cortes={CORTES} /></div>
      <div className={`sesion__scroll${anclado ? ' sesion__scroll--anclado' : ''}`}>
        <div className="col g3">
          <span className="t-label c-ter">Ejercicio {nro} de 5</span>
          <span className="t-title una-linea">{nombre}</span>
          {debajo ? <span className="t-bodysm c-sec">{debajo}</span> : null}
        </div>
        {children}
      </div>
      <div className="sesion__nav">
        <IconButton icon="chevron-left" variant="surface" size="lg" disabled={paso === 1} aria-label="Anterior" />
        <Button variant="primary" size="lg" iconRight={ultimo ? undefined : 'arrow-right'} icon={ultimo ? 'check' : undefined} className="frencia-btn--flex" disabled={siguienteOff}>{accion || (ultimo ? 'Terminar' : 'Siguiente')}</Button>
      </div>
    </div>
  );
}

/* Marcas de las series del ejercicio: hechas en tinta, la actual en senal */
function PuntosSerie({ total, actual }) {
  return (
    <span className="puntos-serie" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => <span key={i} className={'puntos-serie__p' + (i < actual ? ' puntos-serie__p--hecha' : i === actual ? ' puntos-serie__p--actual' : '')}></span>)}
    </span>
  );
}

/* Fuerza: la serie baja a la zona del pulgar y se completa en la fila Hoy */
function SerieFuerza({ hoy = {}, foco, vacia, completa, ultimo }) {
  const falta = [];
  if (!hoy.peso) falta.push('el peso');
  if (!hoy.reps) falta.push('las reps');
  if (!hoy.rir) falta.push('el RIR');
  const enumerar = (xs) => xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`;
  return (
    <Sesion paso={ultimo ? 30 : 3} nro={ultimo ? 5 : 1} nombre={ultimo ? 'Elevaciones laterales' : 'Press de banca con barra'} anclado ultimo={ultimo}
      accion={ultimo ? null : 'Registrar serie'} siguienteOff={falta.length > 0}>
      <div className="col g5">
        <div className="serie-cabeza">
          <div className="row"><span className="t-subtitle">{ultimo ? 'Serie 2 de 2' : 'Serie 2 de 4'}</span><PuntosSerie total={ultimo ? 2 : 4} actual={1} /></div>
          {vacia ? <Button variant="soft" size="sm" icon="skip-forward">{ultimo ? 'Saltar y terminar' : 'Saltar serie'}</Button> : null}
        </div>
        <Grilla amplia cuando="hace 3 días" columnas={ultimo ? [
          { label: 'kg', plan: null, ant: '12.5', hoy: hoy.peso },
          { label: 'Reps', plan: '12', ant: '12', hoy: hoy.reps },
          { label: 'RIR', plan: '1', ant: '2', hoy: hoy.rir },
        ] : [
          { label: 'kg', plan: null, ant: '80', hoy: hoy.peso, foco: foco === 'peso' },
          { label: 'Reps', plan: '8', ant: '8', hoy: hoy.reps, foco: foco === 'reps' },
          { label: 'RIR', plan: '2', ant: '2', hoy: hoy.rir, foco: foco === 'rir' },
        ]} />
        {!vacia && !completa && falta.length ? <span className="aviso"><Ico n="circle-alert" s={16} />Falta cargar {enumerar(falta)}.</span> : null}
      </div>
    </Sesion>
  );
}

function Descanso({ restante }) {
  const fin = restante === 0;
  return (
    <Sesion paso={4} nro={1} nombre="Press de banca con barra" debajo="2 de 4 series hechas" accion={fin ? 'Siguiente serie' : 'Saltar descanso'}>
      <div className="descanso">
        <Aro total={120} restante={restante}>
          <span className={`t-label ${fin ? 'c-acc' : 'c-ter'}`}>{fin ? 'Listo' : 'Descanso'}</span>
          <span className={`reloj${fin ? ' reloj--fin' : ''}`}>{fin ? '0:00' : '1:24'}</span>
          <span className="t-bodysm t-sub c-ter">de 2:00</span>
        </Aro>
        <div className="row g3">
          <Button variant="secondary" size="sm" icon="minus" disabled={fin}>10 s</Button>
          <Button variant="secondary" size="sm" icon="plus">10 s</Button>
        </div>
        <div className="siguiente">
          <div className="col g1 f1">
            <span className="t-label c-ter">A continuación · Serie 3 de 4</span>
            <span className="t-data">80 kg <span className="c-ter">×</span> 8 <span className="c-ter">·</span> <span className="c-int">RIR 2</span></span>
          </div>
          <Ico n="chevron-right" s={18} c="c-ter" />
        </div>
      </div>
    </Sesion>
  );
}

function Cardio({ cargado }) {
  return (
    <Sesion paso={26} nro={4} nombre="Cinta de correr" siguienteOff={!cargado}>
      <div className="col g7">
        <div className="serie-cabeza"><span className="t-subtitle">Serie única</span></div>
        <Grilla hoy={false} cuando="hace 3 días" columnas={[
          { label: 'Tiempo', plan: '30:00', ant: '28:40' },
          { label: 'km', plan: '5.00', ant: '4.80' },
          { label: 'RPE', plan: '6', ant: '7' },
        ]} />
        <div className="col g6">
          <div className="col g4">
            <DurationField label="Tiempo" value={cargado ? 1815 : null} step={60} allowHours size="lg" fullWidth />
            {!cargado ? <span className="aviso"><Ico n="circle-alert" s={16} />Cargá el tiempo para seguir.</span> : null}
          </div>
          <DistanceField label="Distancia" value={cargado ? 5.1 : null} unit="km" size="lg" fullWidth />
          <CampoNumero label="RPE · qué tan duro fue" formato="1–10" valor={cargado ? 7 : null} />
        </div>
      </div>
    </Sesion>
  );
}

function Isometrico({ fase = 'running' }) {
  return (
    <Sesion paso={18} nro={3} nombre="Plancha" siguienteOff={fase !== 'done'}>
      <div className="col g7">
        <div className="serie-cabeza"><div className="row"><span className="t-subtitle">Serie 2 de 3</span><PuntosSerie total={3} actual={1} /></div></div>
        <Grilla hoy={false} cuando="hace 3 días" columnas={[
          { label: 'Tiempo', plan: '1:00', ant: '0:55' },
          { label: 'RPE', plan: '7', ant: '8' },
        ]} />
        <div className="col g6">
          <IsoTimer target={60} initialPhase={fase} initialElapsed={fase === 'done' ? 62 : 34} value={fase === 'done' ? 62 : null} />
          <CampoNumero label="RPE · qué tan duro fue" formato="1–10" valor={fase === 'done' ? 8 : null} />
        </div>
      </div>
    </Sesion>
  );
}

function Menu() {
  return (
    <Hoja cls="hoja--menu">
      <span className="t-label c-ter">Press de banca con barra</span>
      <div className="col">
        <div className="menu-fila"><Ico n="plus" s={20} />Sumar una serie</div>
        <div className="menu-fila"><Ico n="skip-forward" s={20} />Saltar serie</div>
        <div className="menu-fila"><Ico n="check" s={20} />Terminar este ejercicio</div>
        <div className="menu-fila"><Ico n="flag" s={20} />Terminar la sesión</div>
      </div>
      <Button variant="secondary" size="lg" fullWidth>Cancelar</Button>
    </Hoja>
  );
}

function Conflicto() {
  return (
    <div className="carga pad g5">
      <div className="icono-caja"><Ico n="triangle-alert" s={24} c="c-int" /></div>
      <span className="t-title center">Tenés una sesión sin terminar</span>
      <span className="t-bodysm c-sec center">Quedó abierta en Pull. Solo puede haber una sesión a la vez, así que hay que cerrarla antes de empezar esta.</span>
      <Button variant="primary" size="lg" icon="play" fullWidth>Retomar la anterior</Button>
      <Button variant="danger" size="lg" icon="trash-2" fullWidth>Descartarla y empezar esta</Button>
      <Button variant="ghost" size="lg" fullWidth>Volver</Button>
    </div>
  );
}
function SinEjercicios() {
  return (
    <div className="carga pad g5">
      <Ico n="dumbbell" s={28} c="c-ter" />
      <span className="t-bodysm c-ter center">Legs no tiene ejercicios cargados.</span>
      <Button variant="secondary" size="lg" fullWidth>Volver</Button>
    </div>
  );
}

/* Resumen: src/components/ResumenSesion.tsx + MarcoTicket */
function Resumen_({ abajo }) {
  return (
    <div className="marco">
      <div className="row pad barra-ticket"><Button variant="ghost" size="sm" icon="chevron-left">Volver a la sesión</Button></div>
      <div className={`marco__scroll${abajo ? ' marco__scroll--abajo' : ''}`}>
        <Ticket {...TICKET_DEMO} />
        <div className="marco__fundido-arriba"></div>
        <div className="marco__fundido-abajo"></div>
      </div>
      <div className="marco__acciones">
        <Button variant="secondary" size="lg" icon="share" className="frencia-btn--flex">Compartir</Button>
        <Button variant="primary" size="lg" icon="check" className="frencia-btn--flex">Hecho</Button>
      </div>
    </div>
  );
}

function AlertaVacia() {
  return (
    <Dialogo titulo="No registraste ninguna serie" mensaje="Una sesión vacía no se guarda en el historial. ¿La descartamos?">
      <Button variant="danger" size="lg" fullWidth>Descartar</Button>
      <Button variant="secondary" size="lg" fullWidth>Seguir entrenando</Button>
    </Dialogo>
  );
}

function App() {
  return (
    <Lienzo titulo="Wizard de sesión" bajada="Un paso por pantalla, generado del plan del día: una serie, su descanso, la siguiente serie. Se mira de a segundos entre serie y serie, con una mano; cada serie se guarda al pasar al paso siguiente.">
      <Seccion titulo="Serie de fuerza" nota="Rutina / Última / Hoy en una tabla con hairlines; lo de hoy se escribe en las celdas de vidrio de abajo. El plan nunca prescribe peso: esa celda vacía es a propósito. Registrar serie no avanza con la serie incompleta; para no hacerla está Saltar serie.">
        <Mesa nombre="Serie vacía" nota="Saltar va en el título de la serie, lejos de la barra que se toca de memoria. Anterior queda como icono: la acción ancha es la que avanza." ruta="session"><SerieFuerza vacia /></Mesa>
        <Mesa nombre="Cargando" nota="La celda en foco toma el borde de lume con su resplandor; lo que falta se avisa en tinta, con icono." ruta="session"><SerieFuerza hoy={{ peso: '82.5', reps: '8' }} foco="reps" /></Mesa>
        <Mesa nombre="Serie completa" ruta="session"><SerieFuerza hoy={{ peso: '82.5', reps: '8', rir: '2' }} completa /></Mesa>
        <Mesa nombre="Último paso" nota="Registrar serie pasa a Terminar y Saltar, a Saltar y terminar." ruta="session"><SerieFuerza vacia ultimo /></Mesa>
      </Seccion>
      <Seccion titulo="Descanso" nota="Una esfera de 60 marcas en un disco de vidrio, con el arco de lume: la única animación continua fuera del onboarding. ±10 s ajustan solo este descanso. Debajo, lo que viene, para llegar a la barra sabiendo qué cargar.">
        <Mesa nombre="Descanso corriendo" nota="La acción ancha es Saltar descanso mientras corre." ruta="session · RestRing"><Descanso restante={84} /></Mesa>
        <Mesa nombre="Descanso finalizado" nota="Al llegar a cero vibra tres veces; restar se deshabilita y la acción pasa a Siguiente serie." ruta="session · RestRing"><Descanso restante={0} /></Mesa>
      </Seccion>
      <Seccion titulo="Cardio e isométricos" nota="La grilla queda como referencia y lo de hoy se carga en sus campos, debajo.">
        <Mesa nombre="Cardio · sin cargar" nota="El tiempo es obligatorio; distancia y RPE, opcionales." ruta="session"><Cardio /></Mesa>
        <Mesa nombre="Cardio · cargado" ruta="session"><Cardio cargado /></Mesa>
        <Mesa nombre="Isométrico · midiendo" nota="Cronómetro de esfuerzo con barra en tinta y marca de objetivo; Frenar es el único relleno de tinta de la pantalla." ruta="session · IsoTimer"><Isometrico /></Mesa>
        <Mesa nombre="Isométrico · medido" nota="Al frenar, el tiempo queda cargado y editable." ruta="session · IsoTimer"><Isometrico fase="done" /></Mesa>
      </Seccion>
      <Seccion titulo="Acciones y casos de borde">
        <Mesa nombre="Menú del ejercicio" nota="Lista de acciones con icono en lugar de una pila de botones: ninguna compite con la otra." ruta="session" capa={<Menu />}><SerieFuerza hoy={{ peso: '82.5' }} /></Mesa>
        <Mesa nombre="Serie salteada" nota="Se puede deshacer desde el aviso, por si fue un toque sin querer." ruta="session · toast" capa={<Toast tipo="info" texto="Serie salteada" accion="Deshacer" />}><SerieFuerza vacia /></Mesa>
        <Mesa nombre="Sesión sin series" ruta="session · alerta" capa={<AlertaVacia />}><SerieFuerza vacia ultimo /></Mesa>
        <Mesa nombre="Otra sesión abierta" nota="Solo puede haber una sesión a la vez. Retomar es la acción principal; descartar va delineado en carmín." ruta="session" fondo="cumbre"><Conflicto /></Mesa>
        <Mesa nombre="Día sin ejercicios" ruta="session" fondo="cumbre"><SinEjercicios /></Mesa>
      </Seccion>
      <Seccion titulo="Resumen" nota="src/components/ResumenSesion.tsx — el último paso del wizard: el ticket se muestra antes de cerrar la sesión; Hecho la guarda.">
        <Mesa nombre="Ticket de la sesión" nota="Papel con muescas laterales y perforación, borde inferior recto. El código de barras sale del id de la sesión." ruta="session · TicketSesion"><Resumen_ /></Mesa>
        <Mesa nombre="Ticket · final del scroll" nota="Conteos, cada ejercicio con su mejor marca y el código; los dos bordes del scroll se funden contra el fondo." ruta="session · TicketSesion"><Resumen_ abajo /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
