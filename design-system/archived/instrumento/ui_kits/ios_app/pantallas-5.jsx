// Frencia · Pantallas - 5 Rutina: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, Badge } = DS;

/* ---------- Detalle: src/app/routine.tsx ---------- */
const DIAS = [
  { n: 'Push', d: '6 ejercicios · Lun, Jue' },
  { n: 'Pull', d: '5 ejercicios · Mar, Vie' },
  { n: 'Legs', d: '7 ejercicios · Mié, Sáb' },
];
function Detalle({ archivada }) {
  return (
    <>
      <Volver />
      <div className="col g7 pad detalle-scroll f1">
        <div className="col g4 items-inicio">
          <Badge tone={archivada ? 'neutral' : 'green'}>{archivada ? 'Archivada' : 'En curso'}</Badge>
          <span className="rutina-nombre">{archivada ? 'Fuerza 4 días' : 'Push Pull Legs'}</span>
          <span className="t-data c-sec">{archivada ? '4 días · 12 MAY 2026' : '3 días · 29 JUL 2026'}</span>
        </div>
        <div className="col g4">
          <span className="t-label c-ter">Días de entrenamiento</span>
          <div>
            {DIAS.map((d) => (
              <div key={d.n} className="fila-dia">
                <div className="col g1 f1"><span className="t-bodysm semi c-pri">{d.n}</span><span className="t-label c-ter">{d.d}</span></div>
                <Ico n="pencil" s={17} c="c-ter" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pie-acciones">
        <Button variant="secondary" size="lg" icon="pencil" fullWidth>Editar rutina</Button>
        <Button variant="danger" size="lg" icon="trash-2" fullWidth>Eliminar rutina</Button>
      </div>
    </>
  );
}

/* ---------- Editar rutina: src/app/edit-routine.tsx ---------- */
function EditarRutina({ sucio }) {
  const filas = [
    { t: 'Push', d: '6 ejercicios · Lun, Jue' },
    { t: 'Pull', d: '5 ejercicios · Mar, Vie' },
    { t: 'Legs', d: '7 ejercicios · Mié, Sáb' },
  ];
  if (sucio) filas.push({ t: 'Día 4', d: 'Nuevo · se completa después' });
  return (
    <>
      <div className="wizard">
        <div className="row"><Button variant="ghost" size="sm" icon="chevron-left">Atrás</Button></div>
        <div className="col g8 editar-scroll">
          <div className="control">
            <span className="t-label c-acc">Editar rutina</span>
            <span className="t-subtitle">Push Pull Legs</span>
            <span className="t-bodysm c-sec control__hint">Cambiá el nombre y qué días la componen. Los ejercicios de cada día se editan entrando al día.</span>
            <Campo lg icono="list" iconoAcento texto="Push Pull Legs" />
          </div>
          <div className="control">
            <div className="row entre"><span className="t-label c-ter">Días de entrenamiento</span><span className="t-label c-ter">{filas.length} de 7</span></div>
            <span className="t-label c-ter">Mantené un día apretado para cambiarlo de orden</span>
            <div className="lista-filas">{filas.map((f) => <FilaArrastre key={f.t} titulo={f.t} detalle={f.d} />)}</div>
            <Button variant="secondary" size="md" icon="plus" fullWidth>Agregar día</Button>
          </div>
        </div>
      </div>
      <div className="wizard__nav">
        <Button variant="primary" size="lg" fullWidth icon="check" disabled={!sucio}>Guardar cambios</Button>
      </div>
    </>
  );
}

/* ---------- Editar dia: src/app/edit-day.tsx (usa DayEditor) ---------- */
const EJERCICIOS = [
  { t: 'Press de banca con barra', vol: '4x8', int: 'RIR 2', desc: '2:00' },
  { t: 'Press inclinado con mancuernas', vol: '3x10', int: 'RIR 2', desc: '1:30' },
  { t: 'Fondos en paralelas', vol: '3x12', int: 'RIR 1', desc: '1:30' },
];
function EditarDia({ sucio, abajo }) {
  return (
    <>
      <div className="wizard">
        <div className="row"><Button variant="ghost" size="sm" icon="chevron-left">Atrás</Button></div>
        <div className="relativo f1 editar-dia">
          <div className={`col g3 editar-dia__scroll${abajo ? ' editar-dia__scroll--abajo' : ''}`}>
            <span className="t-label c-acc">Editar día · Push Pull Legs</span>
            <span className="t-subtitle">Push</span>
            <span className="t-bodysm c-sec control__hint">Cambiá el nombre, cuándo lo entrenás y sus ejercicios.</span>
            <div className="col g5">
              <Campo lg icono="calendar" iconoAcento texto="Push" />
              <Semana editor on={sucio ? [0, 3, 5] : [0, 3]} />
              <div className="col g4">
                <span className="t-label c-ter">Tocá un ejercicio para editarlo · mantenelo apretado para cambiarlo de orden</span>
                <div className="lista-filas">{EJERCICIOS.map((e) => <FilaArrastre key={e.t} titulo={e.t} detalle={<Resumen {...e} />} />)}</div>
              </div>
              <Button variant="secondary" size="lg" icon="plus" fullWidth>Agregar otro ejercicio</Button>
            </div>
            <div className="zona-eliminar"><Button variant="danger" size="lg" fullWidth icon="trash-2">Eliminar día</Button></div>
          </div>
          <div className="fundido-abajo"></div>
        </div>
      </div>
      <div className="wizard__nav">
        <Button variant="primary" size="lg" fullWidth icon="check" disabled={!sucio}>Guardar cambios</Button>
        <Button variant="secondary" size="lg" fullWidth icon="x">Cancelar</Button>
      </div>
    </>
  );
}

function Alerta({ titulo, mensaje, accion, cancelar = 'Cancelar' }) {
  return (
    <Dialogo titulo={titulo} mensaje={mensaje}>
      <Button variant="danger" size="lg" fullWidth>{accion}</Button>
      <Button variant="secondary" size="lg" fullWidth>{cancelar}</Button>
    </Dialogo>
  );
}

function App() {
  return (
    <Lienzo titulo="Rutina y edición" bajada="El detalle de una rutina mantiene el idioma de la lista: nombre grande en la sans, datos tabulares y días como filas al hilo. Empezar se hace desde Inicio; acá se mira y se corrige el plan. Nada se guarda hasta tocar Guardar.">
      <Seccion titulo="Detalle de la rutina" nota="src/app/routine.tsx — Editar arriba y Eliminar al fondo, la acción irreversible más lejos del pulgar.">
        <Mesa nombre="Rutina en curso" ruta="routine"><Detalle /></Mesa>
        <Mesa nombre="Rutina archivada" ruta="routine"><Detalle archivada /></Mesa>
        <Mesa nombre="Confirmar eliminación" nota="El modal de alerta de la app: destructivo delineado en carmín, Cancelar al final." ruta="routine · alerta" capa={<Alerta titulo="Eliminar Push Pull Legs" mensaje="Se va a borrar la rutina con sus 3 días y los ejercicios de cada uno. No se puede deshacer." accion="Eliminar" />}><Detalle /></Mesa>
      </Seccion>
      <Seccion titulo="Editar rutina" nota="src/app/edit-routine.tsx — no es un wizard: nombre y días en una sola pantalla.">
        <Mesa nombre="Sin cambios" nota="Guardar cambios se habilita cuando algo cambió." ruta="edit-routine"><EditarRutina /></Mesa>
        <Mesa nombre="Con un día nuevo" nota="El día nuevo se carga después, entrando a él desde el detalle." ruta="edit-routine"><EditarRutina sucio /></Mesa>
        <Mesa nombre="Salir con cambios" nota="Atrás, Cancelar o el gesto piden confirmar antes de descartar." ruta="edit-routine · useDescartarAlSalir" capa={<Alerta titulo="Descartar cambios" mensaje="Lo que editaste en esta rutina se va a perder." accion="Descartar" cancelar="Seguir editando" />}><EditarRutina sucio /></Mesa>
      </Seccion>
      <Seccion titulo="Editar día" nota="src/app/edit-day.tsx — la misma vista que el paso de cada día del wizard (DayEditor), con Guardar y Cancelar abajo.">
        <Mesa nombre="Editando" nota="El contenido se funde contra el fondo antes de los botones." ruta="edit-day"><EditarDia sucio /></Mesa>
        <Mesa nombre="Eliminar al final del scroll" nota="Destructivo y poco frecuente: se llega a propósito." ruta="edit-day"><EditarDia abajo /></Mesa>
        <Mesa nombre="Guardado" nota="Toast de éxito al volver." ruta="edit-day · toast" capa={<Toast texto="Día actualizado" />}><EditarDia /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
