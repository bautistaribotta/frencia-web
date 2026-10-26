// Frencia · Pantallas - 4 Crear rutina: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, Stepper, Tag, SegmentedControl, DurationField, DistanceField, ExerciseTypeTag } = DS;

/* ---------- Wizard: src/app/create-routine.tsx ----------
   Mismo marco que el setup: contador y escala arriba, pregunta a altura
   fija, una sola accion abajo. Salir en el primer paso, Atras despues. */
function Wizard({ paso, total = 5, etiqueta, pregunta, hint, siguienteOff, ultimo, children }) {
  return (
    <Paso actual={paso} total={total} volver={paso === 0 ? 'Salir' : 'Atrás'} rotulo={`Rutina nueva · ${etiqueta}`} pregunta={pregunta} ayuda={hint}
      pie={<Button variant="primary" size="lg" fullWidth iconRight={ultimo ? undefined : 'arrow-right'} icon={ultimo ? 'check' : undefined} disabled={siguienteOff}>{ultimo ? 'Finalizar rutina' : 'Siguiente'}</Button>}>
      {children}
    </Paso>
  );
}

const SUGERIDOS = ['Push Pull Legs', 'Torso / Pierna', 'Full body', 'Fuerza 4 días'];
function PasoNombre({ nombre }) {
  return (
    <Wizard paso={0} etiqueta="Nombre" pregunta="¿Cómo se llama tu rutina?" hint="Un nombre que reconozcas de un vistazo." siguienteOff={!nombre}>
      <div className="col g6">
        <Linea texto={nombre} ph="Nombre de la rutina" foco pie={<><span className="t-label">{nombre ? '' : 'Obligatorio'}</span><span className="t-label">{(nombre || '').length} / 40</span></>} />
        {!nombre ? <div className="sugerencias">{SUGERIDOS.map((t) => <Tag key={t} selectable>{t}</Tag>)}</div> : null}
      </div>
    </Wizard>
  );
}
function PasoDias({ dias = 3 }) {
  return (
    <Wizard paso={1} etiqueta="Días" pregunta="¿Cuántos días tiene?" hint="Después armás cada uno. Podés sumar o quitar días más adelante.">
      <div className="col g7">
        <div className="selector-dias" role="radiogroup">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => <div key={n} className={`selector-dias__n${n === dias ? ' selector-dias__n--sel' : ''}`} role="radio" aria-checked={n === dias}>{n}</div>)}
        </div>
        <div className="dias-previa">
          {Array.from({ length: dias }, (_, i) => (
            <div key={i} className="dias-previa__fila">
              <span className="dias-previa__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="t-bodysm c-sec f1">Día {i + 1}</span>
              <span className="t-label c-dis">Paso {i + 3}</span>
            </div>
          ))}
        </div>
      </div>
    </Wizard>
  );
}

/* src/components/DayEditor.tsx — tambien lo usa Editar dia */
const EJERCICIOS_PUSH = [
  { t: 'Press de banca con barra', vol: '4x8', int: 'RIR 2', desc: '2:00' },
  { t: 'Press inclinado con mancuernas', vol: '3x10', int: 'RIR 2', desc: '1:30' },
  { t: 'Fondos en paralelas', vol: '3x12', int: 'RIR 1', desc: '1:30' },
  { t: 'Plancha', vol: '3x1:00', int: null, desc: '1:00' },
];
function EditorDia({ nombre, ph = 'Día 1', semana = [], ejercicios = [], levantar }) {
  return (
    <div className="col g7">
      <Linea chica texto={nombre} ph={ph} />
      <div className="col g3">
        <span className="t-label c-ter">Cuándo lo entrenás</span>
        <Semana editor on={semana} />
      </div>
      <div className="col g3">
        <div className="row entre"><span className="t-label c-ter">Ejercicios</span><span className="t-label c-ter">{ejercicios.length}</span></div>
        {ejercicios.length === 0 ? (
          <div className="tarjeta--punteada-fina vacio-dia col items-centro g3">
            <Ico n="dumbbell" s={22} c="c-ter" />
            <span className="t-bodysm c-ter center">Todavía no agregaste ejercicios.</span>
          </div>
        ) : (
          <div className="lista-filas">
            {ejercicios.map((e, i) => <FilaArrastre key={e.t} n={i + 1} titulo={e.t} detalle={<Resumen {...e} />} levantada={levantar === i} />)}
          </div>
        )}
        {ejercicios.length > 1 ? <span className="t-bodysm t-sub c-ter">Tocá un ejercicio para editarlo. Mantenelo apretado para cambiar el orden.</span> : null}
      </div>
      <div className="boton-agregar"><Ico n="plus" s={18} />{ejercicios.length === 0 ? 'Agregar ejercicio' : 'Agregar otro ejercicio'}</div>
    </div>
  );
}
function PasoDia({ vacio, levantar }) {
  return vacio ? (
    <Wizard paso={2} etiqueta="Día 1 de 3" pregunta="¿Qué entrenás el día 1?" hint="Nombre, días de la semana y ejercicios.">
      <EditorDia />
    </Wizard>
  ) : (
    <Wizard paso={4} etiqueta="Día 3 de 3" pregunta="¿Qué entrenás el Push?" hint="Nombre, días de la semana y ejercicios." ultimo>
      <EditorDia nombre="Push" ph="Día 3" semana={[0, 3]} ejercicios={EJERCICIOS_PUSH} levantar={levantar} />
    </Wizard>
  );
}

/* src/components/ArchiveRoutineDialog.tsx */
function DialogoArchivar() {
  return (
    <Dialogo titulo={'¿Qué hacemos con "Push Pull Legs"?'} mensaje="Solo podés tener una rutina activa. La nueva puede reemplazarla, o quedar guardada en tus rutinas para activarla cuando quieras.">
      <Button variant="primary" size="lg" fullWidth>Reemplazarla con la nueva</Button>
      <Button variant="secondary" size="lg" fullWidth>Seguir con esta, guardar la nueva</Button>
      <Button variant="ghost" size="lg" fullWidth>Cancelar</Button>
    </Dialogo>
  );
}

/* ---------- Selector: src/components/ExercisePickerModal.tsx ---------- */
const CATALOGO = [
  { n: 'Press de banca con barra', m: 'Pecho', abierta: true, sec: ['Tríceps', 'Hombros'], eq: 'Barra' },
  { n: 'Press inclinado con mancuernas', m: 'Pecho' },
  { n: 'Aperturas en polea', m: 'Pecho' },
  { n: 'Cinta de correr', m: 'Cardio', tipo: { kind: 'cardio', metrics: ['tiempo', 'distancia'] } },
  { n: 'Plancha', m: 'Abdomen', tipo: { kind: 'isometrico', metrics: ['tiempo', 'peso'] } },
  { n: 'Fondos en paralelas', m: 'Tríceps' },
  { n: 'Press militar con barra', m: 'Hombros' },
  { n: 'Remo con barra', m: 'Espalda' },
  { n: 'Dominadas', m: 'Espalda' },
];
function FilaCatalogo({ e, abierta }) {
  return (
    <div className={`cat-fila${abierta ? ' cat-fila--abierta' : ''}`}>
      <div className="cat-fila__cabeza">
        <div className="col f1 cat-fila__principal">
          <span className={`cat-fila__nombre${abierta ? '' : ' una-linea'}`}>{e.n}</span>
          {e.tipo && !abierta ? <ExerciseTypeTag exercise={{ name: e.n, ...e.tipo }} /> : null}
        </div>
        {!abierta ? <span className="cat-fila__musculo una-linea">{e.m}</span> : null}
        <Ico n={abierta ? 'chevron-up' : 'chevron-down'} s={18} />
      </div>
      {abierta ? (
        <div className="col g5">
          <div className="row g4">
            <div className="row wrap g3 f1"><Tag dot>{e.m}</Tag>{e.sec.map((s) => <Tag key={s}>{s}</Tag>)}</div>
            <span className="t-bodysm c-ter">{e.eq}</span>
          </div>
          <Button variant="primary" size="md" icon="plus" fullWidth>Añadir</Button>
        </div>
      ) : null}
    </div>
  );
}
function Buscar({ abierta, filtro }) {
  const chips = [
    { l: 'Todos', c: 198, sel: !filtro },
    { l: 'Cardio', c: 12, icono: 'heart-pulse', sel: filtro === 'Cardio' },
    { l: 'Isométrico', c: 9, icono: 'timer' },
    { l: 'Híbrido', c: 6, icono: 'shuffle' },
    { l: 'Pecho', c: 24 },
    { l: 'Espalda', c: 31 },
  ];
  const lista = filtro === 'Cardio'
    ? [{ n: 'Cinta de correr', m: 'Cardio', tipo: { kind: 'cardio', metrics: ['tiempo', 'distancia'] } },
       { n: 'Bicicleta fija', m: 'Cardio', tipo: { kind: 'cardio', metrics: ['tiempo', 'distancia'] } },
       { n: 'Remo ergómetro', m: 'Cardio', tipo: { kind: 'cardio', metrics: ['tiempo', 'distancia'] } },
       { n: 'Soga', m: 'Cardio', tipo: { kind: 'cardio', metrics: ['tiempo'] } },
       { n: 'Escaladora', m: 'Cardio', tipo: { kind: 'cardio', metrics: ['tiempo'] } }]
    : CATALOGO;
  return (
    <div className="modal">
      <div className="row titulo-fila"><Button variant="ghost" size="sm" icon="x">Cerrar</Button></div>
      <div className="col g5 buscar-cabeza">
        <span className="t-title">Agregar ejercicio</span>
        <Campo inset icono="search" iconoTam={18} ph="Buscá por nombre o músculo" />
        <div className="chips">
          {chips.map((c) => (
            <Tag key={c.l} selectable selected={c.sel}>
              {c.icono ? <Ico n={c.sel ? 'check' : c.icono} s={14} /> : null}{c.l} <span className="chip-conteo">{c.c}</span>
            </Tag>
          ))}
        </div>
        <span className="t-label c-ter">{filtro ? `12 ejercicios · ${filtro}` : '198 ejercicios'}</span>
      </div>
      <div className="catalogo">
        {lista.map((e) => <FilaCatalogo key={e.n} e={e} abierta={abierta && e.abierta} />)}
        <div className="fundido-arriba"></div>
      </div>
    </div>
  );
}

function Configurar({ tipo, editar }) {
  const titulo = editar ? 'Editar ejercicio' : 'Configurar';
  let elegido, campos;
  if (tipo === 'cardio') {
    elegido = { n: 'Cinta de correr', icono: 'heart-pulse', tag: { kind: 'cardio', metrics: ['tiempo', 'distancia'] } };
    campos = (
      <>
        <div className="col g5">
          <DurationField label="Tiempo" value={1800} step={60} allowHours size="lg" fullWidth />
          <DistanceField label="Distancia" value={5} unit="km" size="lg" fullWidth />
        </div>
        <BloqueRpe con={false} />
      </>
    );
  } else if (tipo === 'isometrico') {
    elegido = { n: 'Plancha', icono: 'timer', tag: { kind: 'isometrico', metrics: ['tiempo', 'peso'] } };
    campos = (
      <>
        <Stepper label="Series" value={3} min={1} max={20} size="lg" fullWidth />
        <DurationField label="Tiempo por serie" value={60} step={5} size="lg" fullWidth />
        <div className="campo-bloque">
          <div className="row row--base entre"><span className="t-label c-ter">Peso por serie</span><span className="t-label c-dis">opcional</span></div>
          <CampoNumero valor={null} unidad="kg" paso="2.5" />
          <span className="t-bodysm c-ter">Sin peso en el plan, en la sesión es opcional.</span>
        </div>
        <BloqueRpe con />
        <BloqueDescanso valor="1:00" />
      </>
    );
  } else {
    elegido = { n: 'Press de banca con barra', icono: 'dumbbell' };
    campos = (
      <>
        <div className="par">
          <Stepper label="Series" value={4} min={1} max={20} size="lg" fullWidth />
          <Stepper label="Repeticiones" value={8} min={1} max={50} size="lg" fullWidth />
        </div>
        <Stepper label="Esfuerzo · RIR" value={2} min={-1} max={5} size="lg" fullWidth />
        <BloqueDescanso valor="2:00" />
      </>
    );
  }
  return (
    <>
      <div className="modal">
        <div className="row titulo-fila">
          <Button variant="ghost" size="sm" icon={editar ? 'x' : 'chevron-left'}>{editar ? 'Cerrar' : 'Atrás'}</Button>
        </div>
        <div className="col g8 config-cuerpo">
          <span className="t-title">{titulo}</span>
          <div className="elegido">
            <Ico n={elegido.icono} s={20} />
            <div className="col g3 f1">
              <span className="t-subtitle c-pri una-linea">{elegido.n}</span>
              {elegido.tag ? <ExerciseTypeTag exercise={{ name: elegido.n, ...elegido.tag }} /> : null}
            </div>
          </div>
          {campos}
        </div>
      </div>
      <div className="wizard__nav">
        <Button variant="primary" size="lg" fullWidth icon="check">{editar ? 'Guardar cambios' : 'Guardar ejercicio'}</Button>
      </div>
    </>
  );
}
function BloqueRpe({ con }) {
  return (
    <div className="campo-bloque">
      <div className="row row--base entre"><span className="t-label c-ter">Intensidad</span><span className="t-label c-dis">opcional</span></div>
      <SegmentedControl fullWidth value={con ? 'rpe' : 'none'} options={[{ value: 'none', label: 'Sin RPE' }, { value: 'rpe', label: 'RPE' }]} />
      {con ? <div className="rpe-stepper"><Stepper label="RPE objetivo" value={7} min={1} max={10} size="lg" fullWidth /></div> : null}
    </div>
  );
}
function BloqueDescanso({ valor }) {
  return (
    <div className="campo-bloque">
      <span className="t-label c-ter">Descanso entre series</span>
      <div className="campo-toque">
        <Ico n="timer" s={20} />
        <span className="campo-toque__valor">{valor}</span>
        <Ico n="chevron-right" s={18} />
      </div>
    </div>
  );
}
function HojaDescanso() {
  return (
    <Hoja cls="hoja--rueda">
      <div className="col g3">
        <span className="t-title center">Descanso entre series</span>
        <span className="t-bodysm c-ter center">En 0:00 queda sin descanso.</span>
      </div>
      <Medida tipo="descanso" />
      <Button variant="primary" size="lg" fullWidth>Listo</Button>
    </Hoja>
  );
}

function App() {
  return (
    <Lienzo titulo="Wizard crear rutina" bajada="Dos pasos fijos y uno por cada día. Todo se arma en memoria y se guarda de una al finalizar, así cancelar no deja basura. El armado de un día es la misma vista que Editar día.">
      <Seccion titulo="Pasos del wizard" nota="src/app/create-routine.tsx — el marco común de los wizards: contador y escala arriba, una pregunta por pantalla a altura fija y una sola acción abajo. Sin opción de saltar.">
        <Mesa nombre="Paso 1 · Nombre vacío" nota="El nombre se escribe grande sobre una línea. Las sugerencias completan el campo con un toque; desaparecen apenas hay texto." ruta="create-routine"><PasoNombre /></Mesa>
        <Mesa nombre="Paso 1 · Escribiendo" nota="Siguiente se habilita con un nombre." ruta="create-routine"><PasoNombre nombre="Push Pull Legs" /></Mesa>
        <Mesa nombre="Rutina activa existente" nota="Al entrar, si ya hay una rutina en curso, se decide qué hacer con ella." ruta="create-routine · ArchiveRoutineDialog" capa={<DialogoArchivar />}><PasoNombre /></Mesa>
        <Mesa nombre="Paso 2 · Cantidad de días" nota="Siete números en vez de un stepper: se elige con un toque. Debajo, los días que se van a armar y en qué paso." ruta="create-routine"><PasoDias /></Mesa>
        <Mesa nombre="Paso 3 · Día vacío" nota="Agregar ejercicio va en un recuadro punteado: es la acción del paso, pero no la que avanza." ruta="create-routine · DayEditor"><PasoDia vacio /></Mesa>
        <Mesa nombre="Último día armado" nota="Ejercicios numerados en el orden de la sesión. El último paso cambia Siguiente por Finalizar rutina." ruta="create-routine · DayEditor"><PasoDia /></Mesa>
        <Mesa nombre="Reordenar ejercicios" nota="Mantener apretada una fila la levanta: sombra y superficie elevada." ruta="create-routine · DraggableRowList"><PasoDia levantar={1} /></Mesa>
      </Seccion>
      <Seccion titulo="Selector de ejercicios" nota="src/components/ExercisePickerModal.tsx — dos caras: el catálogo con buscador y filtros, y el configurador del ejercicio elegido.">
        <Mesa nombre="Catálogo" nota="Filtro por tipo o grupo muscular, uno a la vez. Los tipos llevan su icono." ruta="ExercisePickerModal"><Buscar /></Mesa>
        <Mesa nombre="Fila desplegada" nota="Tocar una fila muestra músculos y equipamiento; Añadir pasa a configurarlo." ruta="ExercisePickerModal"><Buscar abierta /></Mesa>
        <Mesa nombre="Filtrado por tipo" nota="El chip elegido pasa a tinta y su icono a check: la selección no depende solo del color." ruta="ExercisePickerModal"><Buscar filtro="Cardio" /></Mesa>
        <Mesa nombre="Configurar · fuerza" nota="Series y reps de a par, esfuerzo con la escala del perfil, descanso en ruedas." ruta="ExercisePickerModal"><Configurar /></Mesa>
        <Mesa nombre="Configurar · cardio" nota="Una sola serie continua: tiempo, distancia y RPE opcional; sin series ni descanso." ruta="ExercisePickerModal"><Configurar tipo="cardio" /></Mesa>
        <Mesa nombre="Configurar · isométrico" nota="Series, tiempo sostenido, peso opcional, RPE y descanso." ruta="ExercisePickerModal"><Configurar tipo="isometrico" /></Mesa>
        <Mesa nombre="Editar un ejercicio" nota="Abre directo en el configurador; la única salida es cerrar." ruta="ExercisePickerModal"><Configurar editar /></Mesa>
        <Mesa nombre="Hoja de descanso" nota="Minutos y segundos de a 5, hasta 10:55; 0:00 deja sin descanso." ruta="ExercisePickerModal · MeasurePicker" capa={<HojaDescanso />}><Configurar /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
