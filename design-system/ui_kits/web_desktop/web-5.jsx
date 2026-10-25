// Frencia Web · 5 Constructor de rutinas: catálogo + rutina, arrastrar y soltar.
// Implementación: dnd-kit (DndContext + SortableContext por día + DragOverlay).
// El catálogo es un origen de copia; cada día es un contenedor ordenable.

const DIAS_B = [
  { n: 'Push', sem: [0, 3], ej: RUTINA.dias[0].ej },
  { n: 'Pull', sem: [1, 4], ej: RUTINA.dias[1].ej },
  { n: 'Legs', sem: [2, 5], ej: RUTINA.dias[2].ej },
];

function ItemCatalogo({ e, estado, flota }) {
  return (
    <div className={`w-cat-item${estado ? ' is-' + estado : ''}${flota ? ' is-levantada ' + flota : ''}`}>
      <span className="w-agarre"><Ico n="grip-vertical" s={16} /></span>
      <span className="w-tipo"><Ico n={TIPO_ICO[e.k]} s={18} /></span>
      <div className="col g1 f1"><span className="t-bodysm semi c-pri una-linea">{e.n}</span><span className="t-label c-ter una-linea">{e.g} · {e.eq}</span></div>
      {flota ? null : <BotonIco ico="plus" t="sm" label={`Agregar ${e.n} al día elegido`} estado={estado === 'hover' ? 'hover' : undefined} tip={estado === 'hover' ? 'Agregar a Push' : undefined} />}
    </div>
  );
}
function Catalogo({ estado, quitar, tipo = 'todos', busqueda }) {
  const lista = busqueda ? CATALOGO.filter((e) => /press|fondos/i.test(e.n)) : CATALOGO;
  return (
    <div className="w-catalogo">
      <div className="w-catalogo__cabeza">
        <div className="row entre"><span className="t-label c-ter">Catálogo · {busqueda ? '3 de 124' : '124'} ejercicios</span><BotonIco ico="panel-left-close" t="sm" label="Ocultar catálogo" /></div>
        <Campo md ico="search" ph="Buscar ejercicio" valor={busqueda} estado={busqueda ? 'foco' : undefined} final={busqueda ? <BotonIco ico="x" t="sm" label="Borrar búsqueda" /> : <Kbd>/</Kbd>} />
        <div className="w-catalogo__chips">
          <Chip sel={tipo === 'todos'}>Todos</Chip><Chip ico="dumbbell" sel={tipo === 'fuerza'}>Fuerza</Chip><Chip ico="timer">Isométrico</Chip><Chip ico="heart-pulse">Cardio</Chip><Chip ico="footprints">Híbrido</Chip>
        </div>
        <Selector md ico="target" valor="Todos los grupos musculares" />
      </div>
      <div className="w-catalogo__lista">
        {lista.map((e, i) => <ItemCatalogo key={e.id} e={e} estado={estado === 'hover' && i === 1 ? 'hover' : estado === 'foco' && i === 0 ? 'foco' : undefined} />)}
      </div>
      {quitar ? (
        <div className="w-zona-quitar">
          <div className="k-flota k-flota--quitar"><TarjetaEj e={RUTINA.dias[0].ej[3]} i={3} estado="levantada quitar" /></div>
          <Ico n="trash-2" s={28} />
          <span className="t-subtitle">Soltá para quitar de Push</span>
          <span className="t-bodysm">Se puede deshacer desde el aviso.</span>
        </div>
      ) : null}
    </div>
  );
}

function TarjetaEj({ e, i, estado }) {
  return (
    <div className={`w-ej${estado ? ' ' + estado.split(' ').map((x) => 'is-' + x).join(' ') : ''}`} tabIndex={0}>
      <span className="w-ej__n">{String(i + 1).padStart(2, '0')}</span>
      <span className="w-tipo w-tipo--sm"><Ico n={TIPO_ICO[e.k]} s={16} /></span>
      <div className="col g1 f1"><span className="t-bodysm semi c-pri una-linea">{e.n}</span><Res vol={e.vol} int={e.int} desc={e.desc} /></div>
      <span className="w-agarre"><Ico n="grip-vertical" s={16} /></span>
    </div>
  );
}
/* items: lista ya armada con marcadores { hueco } / { origen } / { flota } */
function Dia({ d, items, estado, foco }) {
  let n = 0;
  return (
    <div className={`w-dia${estado ? ' is-' + estado : ''}${foco ? ' is-foco' : ''}`}>
      <div className="w-dia__cabeza">
        <div className="row entre g3"><span className="t-subtitle">{d.n}</span><div className="row g1"><span className="t-label c-ter">{d.ej.length}</span><BotonIco ico="ellipsis" t="sm" label={`Acciones de ${d.n}`} /></div></div>
        <Semana on={d.sem} edit />
      </div>
      <div className="w-dia__lista">
        {items.length === 0 ? <div className="w-dia__vacio"><Ico n="mouse-pointer-2" s={16} />Arrastrá ejercicios del catálogo o tocá + en uno</div> : null}
        {items.map((it, k) => {
          if (it.hueco) return <div key={'h' + k} className="w-hueco" aria-hidden="true"></div>;
          if (it.flota) return <div key={'f' + k} className="k-flota-ancla">{it.flota}</div>;
          const idx = n++;
          return <TarjetaEj key={it.e.n + k} e={it.e} i={idx} estado={it.estado} />;
        })}
      </div>
      <button className="w-btn w-btn--ghost w-btn--sm w-dia__agregar"><Ico n="plus" s={16} /><span>Agregar ejercicio</span></button>
    </div>
  );
}
const lista = (ej, mods = {}) => {
  const out = ej.map((e, i) => ({ e, estado: mods.estados && mods.estados[i] }));
  (mods.insertar || []).sort((a, b) => b[0] - a[0]).forEach(([pos, x]) => out.splice(pos, 0, x));
  return out;
};

function Barra({ nombre = 'Push Pull Legs', guardado = 'guardado', nombreFoco }) {
  const txt = { guardado: <><Ico n="circle-check" s={16} />Guardado</>, recien: <><Ico n="check" s={16} confirma c="c-acc" />Guardado recién</>, sucio: <><span className="w-punto"></span>Cambios sin guardar · 2</>, guardando: <><Ruedita />Guardando…</>, error: <><Ico n="cloud-off" s={16} c="c-dang" /><span className="c-dang">No se guardó</span></>, nueva: <>Rutina nueva · sin guardar</> }[guardado];
  const puede = guardado === 'sucio' || guardado === 'error';
  return (
    <div className="w-builder__barra">
      <BotonIco ico="arrow-left" tip="Volver a la rutina" label="Volver" />
      <div className="w-linea w-builder__nombre"><span className={`w-linea__texto${nombre ? '' : ' c-ter'}`}>{nombre || 'Nombre de la rutina'}{nombreFoco ? <span className="w-cursor"></span> : null}</span><Ico n="pencil" s={14} c="c-ter" /></div>
      <span className="w-estado-guardado" role="status">{txt}</span>
      <span className="f1"></span>
      <BotonIco ico="keyboard" tip="Atajos  ?" label="Atajos de teclado" />
      {puede ? <Boton v="ghost">Descartar</Boton> : null}
      <Boton ico={guardado === 'guardando' ? undefined : 'check'} estado={guardado === 'guardando' ? 'cargando' : puede ? undefined : 'off'}>{guardado === 'guardando' ? 'Guardando…' : 'Guardar'}</Boton>
      <span className="row g1 c-ter t-bodysm w-builder__atajo"><Kbd>Ctrl</Kbd><Kbd>S</Kbd></span>
    </div>
  );
}

function Constructor({ caso, capa, panel, rail }) {
  const C = { e: CATALOGO[2] };
  let cat = {}, dias = DIAS_B.map((d) => ({ d, items: lista(d.ej), estado: null, foco: false })), extraTablero = null, guardado = 'guardado', toast = null, nombre, nombreFoco;
  if (caso === 'hover') { cat = { estado: 'hover' }; dias[0].items = lista(DIAS_B[0].ej, { estados: { 1: 'hover' } }); }
  if (caso === 'drag-cat') {
    cat = { estado: 'drag' };
    dias[1].estado = 'destino';
    dias[1].items = lista(DIAS_B[1].ej, { insertar: [[2, { hueco: true }], [2, { flota: <><ItemCatalogo e={C.e} flota="k-flota k-flota--cat" /><span className="w-sello-arrastre k-sello k-sello--cat"><Ico n="corner-down-right" s={14} />Agregar a Pull · 3º</span></> }]] });
    dias[0].estado = 'atenuado'; dias[2].estado = 'atenuado';
  }
  if (caso === 'reorden') {
    const ej = DIAS_B[0].ej;
    dias[0].estado = 'destino';
    dias[0].items = [{ hueco: true }, { flota: <TarjetaEj e={ej[2]} i={0} estado="levantada" /> }, { e: ej[0] }, { e: ej[1] }, { e: ej[3] }];
    dias[0].items[1].flota = <div className="k-flota k-flota--reorden"><TarjetaEj e={ej[2]} i={0} estado="levantada" /></div>;
  }
  if (caso === 'entre') {
    const ej = DIAS_B[0].ej;
    dias[0].items = [{ e: ej[0] }, { e: ej[1], estado: 'origen' }, { e: ej[2] }, { e: ej[3] }];
    dias[2].estado = 'destino';
    dias[2].items = lista(DIAS_B[2].ej, { insertar: [[1, { hueco: true }], [1, { flota: <><div className="k-flota k-flota--entre"><TarjetaEj e={ej[1]} i={1} estado="levantada" /></div><span className="w-sello-arrastre k-sello k-sello--entre"><Ico n="arrow-right-left" s={14} />Mover a Legs · 2º</span></> }]] });
  }
  if (caso === 'invalida') {
    const ej = DIAS_B[0].ej;
    dias[0].items = [{ e: ej[0] }, { e: ej[1], estado: 'origen' }, { e: ej[2] }, { e: ej[3] }];
    extraTablero = <><div className="k-flota k-flota--invalida"><TarjetaEj e={ej[1]} i={1} estado="levantada invalida" /></div><span className="w-sello-arrastre k-sello k-sello--invalida"><Ico n="ban" s={14} />Soltá dentro de un día</span></>;
  }
  if (caso === 'quitar') {
    const ej = DIAS_B[0].ej;
    cat = { quitar: true };
    dias[0].items = [{ e: ej[0] }, { e: ej[1] }, { e: ej[2] }, { e: ej[3], estado: 'origen' }];
    extraTablero = null;
  }
  if (caso === 'teclado') {
    const ej = DIAS_B[0].ej;
    dias[0].estado = 'destino';
    dias[0].items = [{ e: ej[0] }, { e: ej[2] }, { e: ej[1], estado: 'levantada-fija' }, { e: ej[3] }];
  }
  if (caso === 'sucio' || caso === 'error' || caso === 'guardando') {
    guardado = caso === 'sucio' ? 'sucio' : caso;
    dias[1].items = lista([...DIAS_B[1].ej.slice(0, 2), C.e && { n: 'Fondos en paralelas', k: 'fuerza', vol: '3×10', int: 'RIR 2', desc: '1:30' }, DIAS_B[1].ej[2]], { estados: { 2: caso === 'sucio' ? 'nuevo' : undefined } });
    if (caso === 'sucio') toast = <Toast texto="Fondos en paralelas agregado a Pull" tipo="info" accion="Deshacer" />;
    if (caso === 'error') toast = <Toast texto="No pudimos guardar. Tus cambios siguen acá." tipo="error" accion="Reintentar" />;
  }
  if (caso === 'guardado') { guardado = 'recien'; toast = <Toast texto="Rutina guardada" confirma />; }
  if (caso === 'vacia') {
    guardado = 'nueva'; nombre = ''; nombreFoco = true;
    dias = [{ d: { n: 'Día 1', sem: [], ej: [] }, items: [], estado: null }];
  }
  if (caso === 'busqueda') cat = { busqueda: 'press' };
  if (panel) {
    const di = panel === 'iso' || panel === 'cardio' ? 2 : 0, ii = panel === 'iso' ? 1 : panel === 'cardio' ? 2 : 0;
    dias[di].items = lista(DIAS_B[di].ej, { estados: { [ii]: 'sel' } });
  }
  return (
    <div className="w-builder">
      <Barra guardado={guardado} nombre={nombre} nombreFoco={nombreFoco} />
      <div className={`w-builder__cuerpo${rail ? ' w-builder__cuerpo--mediana' : ''}`}>
        <Catalogo {...cat} />
        <div className="w-tablero">
          {dias.map((x) => <Dia key={x.d.n} d={x.d} items={x.items} estado={x.estado} />)}
          <div className="w-dia w-dia--nuevo"><Ico n="plus" s={22} /><span className="t-bodysm semi">Agregar día</span><span className="t-label c-ter">{dias.length} de 7</span></div>
          {caso === 'vacia' ? <div className="w-tarjeta w-pista col g3"><span className="t-label c-acc">Cómo se arma</span><span className="t-bodysm c-pri">Arrastrá ejercicios del catálogo a un día, o elegí un día y tocá + en el ejercicio.</span><span className="t-bodysm c-sec">Cada ejercicio se configura en el panel que se abre al hacer clic. Guardar se habilita con un nombre y al menos un ejercicio.</span></div> : null}
          {extraTablero}
        </div>
        {panel ? <PanelEjercicio tipo={panel} /> : null}
        {caso === 'teclado' ? <div className="w-anuncio" role="status" aria-live="assertive"><Ico n="move" s={18} c="c-acc" /><span className="t-bodysm c-pri"><span className="semi">Press inclinado con mancuernas</span> levantado · 3 de 4 en Push</span><span className="row g1 t-bodysm c-ter"><Kbd>↑</Kbd><Kbd>↓</Kbd>mover <Kbd>←</Kbd><Kbd>→</Kbd>otro día <Kbd>Espacio</Kbd>soltar <Kbd>Esc</Kbd>cancelar</span></div> : null}
      </div>
      {toast ? <Toasts>{toast}</Toasts> : null}
      {capa || null}
    </div>
  );
}

/* ---------- Panel de configuración de un ejercicio ----------
   Campos según lo que registra el ejercicio (exercises.tracks_*). Los cambios
   van al borrador de la rutina en vivo; se guardan con Guardar arriba. */
function PanelEjercicio({ tipo }) {
  if (tipo === 'iso') {
    return (
      <Panel rotulo="Legs · ejercicio 2 de 3" titulo="Sentadilla isométrica con barra" extra={<div className="row g3"><Badge ico="timer">Isométrico</Badge><span className="t-label c-ter">Cuádriceps · Barra</span></div>}
        pie={<><Boton v="danger" t="sm" ico="trash-2">Quitar del día</Boton><span className="f1"></span><Boton v="secondary" t="sm" icoDer="arrow-down">Siguiente</Boton></>}>
        <div className="w-panel__grilla"><Numero rotulo="Series" valor="4" /><Numero rotulo="Tiempo por serie" extra="mm:ss" valor="0:30" estado="foco" /></div>
        <Numero rotulo="Peso objetivo" extra="opcional" valor="60" unidad="kg" />
        <span className="t-bodysm c-sec w-panel__nota">Solo los isométricos que registran peso aceptan un peso objetivo. Si lo dejás vacío, se carga al entrenar.</span>
        <div className="col g3"><span className="t-label c-ter">Intensidad</span><Seg ops={[['rir', 'RIR'], ['rpe', 'RPE']]} sel="rir" ancho /><Numero valor="2" /></div>
        <div className="col g3"><div className="row entre"><span className="t-label c-ter">Descanso entre series</span><Switch on /></div><Numero valor="2:00" /></div>
      </Panel>
    );
  }
  if (tipo === 'cardio') {
    return (
      <Panel rotulo="Legs · ejercicio 3 de 3" titulo="Cinta de correr" extra={<div className="row g3"><Badge ico="heart-pulse">Cardio</Badge><span className="t-label c-ter">Cardio · Máquina</span></div>}
        pie={<><Boton v="danger" t="sm" ico="trash-2">Quitar del día</Boton><span className="f1"></span><Boton v="secondary" t="sm" icoDer="arrow-down" estado="off">Siguiente</Boton></>}>
        <div className="w-panel__grilla"><Numero rotulo="Tiempo" extra="h:mm:ss" valor="30:00" /><Numero rotulo="Distancia" valor="5.00" unidad="km" /></div>
        <Numero rotulo="Series" valor="1" />
        <div className="col g3"><span className="t-label c-ter">Intensidad</span><Seg ops={[['rir', 'RIR'], ['rpe', 'RPE'], ['no', 'Sin intensidad']]} sel="rpe" ancho /><Numero valor="6" /></div>
        <div className="col g3"><div className="row entre"><span className="t-label c-ter">Descanso entre series</span><Switch /></div><span className="t-bodysm c-ter">Sin temporizador.</span></div>
        <span className="w-aviso"><Ico n="circle-alert" s={16} />Con una sola serie el descanso no se usa.</span>
      </Panel>
    );
  }
  return (
    <Panel rotulo="Push · ejercicio 1 de 4" titulo="Press de banca con barra" extra={<div className="row g3"><Badge ico="dumbbell">Fuerza</Badge><span className="t-label c-ter">Pecho · Barra</span></div>}
      pie={<><Boton v="danger" t="sm" ico="trash-2">Quitar del día</Boton><span className="f1"></span><Boton v="secondary" t="sm" icoDer="arrow-down">Siguiente</Boton></>}>
      <div className="w-panel__grilla"><Numero rotulo="Series" valor="4" /><Numero rotulo="Repeticiones" valor="8" estado="foco" /></div>
      <div className="col g3"><span className="t-label c-ter">Intensidad</span><Seg ops={[['rir', 'RIR'], ['rpe', 'RPE']]} sel="rir" ancho /><div className="row g4"><div className="f1"><Numero valor="2" /></div><label className="row g3 t-bodysm c-sec fnone"><Check />Al fallo</label></div></div>
      <div className="col g3"><div className="row entre"><span className="t-label c-ter">Descanso entre series</span><Switch on /></div><Numero valor="2:00" /></div>
      <div className="w-tarjeta w-tarjeta--punteada col g2"><span className="row g2 t-bodysm semi c-pri"><Ico n="info" s={16} />Sin peso en el plan</span><span className="t-bodysm c-sec">En fuerza el peso no se prescribe: se carga en cada serie al entrenar, con la última marca como referencia.</span></div>
      <span className="row g2 t-bodysm c-ter"><Kbd>↑</Kbd><Kbd>↓</Kbd>cambian el valor<span className="c-dis">·</span><Kbd>Esc</Kbd>cierra el panel</span>
    </Panel>
  );
}

function ModalSalir() {
  return <Modal chico titulo="Tenés cambios sin guardar" texto="Si salís ahora, se pierden los 2 cambios que hiciste en Push Pull Legs." pie={<><Boton v="ghost">Seguir editando</Boton><Boton v="danger">Descartar</Boton><Boton ico="check" estado="foco">Guardar y salir</Boton></>} />;
}

function AppWeb() {
  const u = 'frencia.app/rutinas/push-pull-legs/editar';
  return (
    <Lienzo titulo="Constructor de rutinas" bajada="Pantalla completa, sin la navegación lateral: a la izquierda el catálogo, a la derecha la rutina con un día por columna. Los ejercicios se arrastran del catálogo a un día, entre días y dentro de un día; cada uno se configura en un panel lateral que no tapa el catálogo. Fondo velada en todos los estados: es la pantalla más densa en datos.">
      <Seccion titulo="Armar" nota="create-routine / edit-routine — el mismo constructor sirve para crear y para editar.">
        <Mesa nombre="Rutina nueva" nota="El nombre arranca en foco. Un solo día vacío con la consigna, y una pista en vidrio que desaparece con el primer ejercicio." ruta="create-routine" fondo="velada" url="frencia.app/rutinas/nueva"><Constructor caso="vacia" /></Mesa>
        <Mesa nombre="Editando · hover" nota="Al pasar el mouse por un ejercicio del catálogo aparece el agarre y el + (agrega al día elegido; su tooltip dice cuál). En los días, el agarre de la tarjeta se aclara." ruta="edit-routine" fondo="velada" url={u}><Constructor caso="hover" /></Mesa>
        <Mesa nombre="Buscar y filtrar" nota="/ enfoca la búsqueda desde cualquier lugar. Busca en el nombre en español y en inglés (exercises.name_en). Los chips filtran por tipo; el selector, por grupo muscular." ruta="edit-routine" fondo="velada" url={u}><Constructor caso="busqueda" /></Mesa>
      </Seccion>
      <Seccion titulo="Arrastrar y soltar" nota="Lo que se levanta es una copia en vidrio denso con borde de lume que sigue al puntero (DragOverlay), un 2 % más grande y sin rotar. Dónde cae se marca con un hueco punteado en lume del alto de una tarjeta, en el orden real. El día que recibe se enciende; los demás bajan un poco.">
        <Mesa nombre="Del catálogo a un día" nota="El catálogo no pierde el ejercicio: es una copia. El sello debajo del puntero dice adónde y en qué posición va a caer." ruta="edit-routine · arrastrando" fondo="velada" url={u}><Constructor caso="drag-cat" /></Mesa>
        <Mesa nombre="Reordenar dentro de un día" nota="Las demás tarjetas se corren con 180 ms de ease-out para abrir el hueco." ruta="edit-routine · arrastrando" fondo="velada" url={u}><Constructor caso="reorden" /></Mesa>
        <Mesa nombre="Mover a otro día" nota="En el día de origen queda el lugar punteado hasta soltar; si se cancela con Esc, vuelve ahí." ruta="edit-routine · arrastrando" fondo="velada" url={u}><Constructor caso="entre" /></Mesa>
        <Mesa nombre="Zona inválida" nota="Fuera de un día no se puede soltar: la copia pierde el borde de lume, el cursor pasa a no permitido y el sello lo explica en tinta. Soltar acá cancela y la tarjeta vuelve a su lugar." ruta="edit-routine · arrastrando" fondo="velada" url={u}><Constructor caso="invalida" /></Mesa>
        <Mesa nombre="Arrastrar al catálogo para quitar" nota="Es la única zona en carmín: soltar ahí quita el ejercicio del día. El aviso trae Deshacer." ruta="edit-routine · arrastrando" fondo="velada" url={u}><Constructor caso="quitar" /></Mesa>
        <Mesa nombre="Con teclado" nota="Espacio levanta la tarjeta enfocada, las flechas la mueven (← → cambian de día) y Espacio la suelta. Cada movimiento se anuncia por aria-live y en este aviso." ruta="edit-routine · KeyboardSensor" fondo="velada" url={u}><Constructor caso="teclado" /></Mesa>
      </Seccion>
      <Seccion titulo="Configurar un ejercicio" nota="Clic en una tarjeta abre el panel lateral de 400 px; no es modal: se puede seguir arrastrando y elegir otra tarjeta con el panel abierto. Los campos salen de lo que registra el ejercicio (tracks_weight, tracks_reps, tracks_duration, tracks_distance).">
        <Mesa nombre="Fuerza" nota="Series, reps, intensidad (RIR con al fallo o RPE) y descanso. Sin campo de peso: el plan no lo prescribe." ruta="edit-routine · panel" fondo="velada" url={u}><Constructor panel="fuerza" /></Mesa>
        <Mesa nombre="Isométrico con peso" nota="Tiempo por serie y, solo acá, peso objetivo opcional (training_day_exercises.weight_kg)." ruta="edit-routine · panel" fondo="velada" url={u}><Constructor panel="iso" /></Mesa>
        <Mesa nombre="Cardio" nota="Tiempo y distancia; es el único tipo que admite Sin intensidad. Las incoherencias se avisan en tinta, sin bloquear." ruta="edit-routine · panel" fondo="velada" url={u}><Constructor panel="cardio" /></Mesa>
      </Seccion>
      <Seccion titulo="Guardar" nota="Los cambios viven en un borrador local hasta Guardar (o Ctrl + S). El borrador sobrevive a recargar la pestaña. Salir con cambios pide confirmar.">
        <Mesa nombre="Cambios sin guardar" nota="El estado de arriba cuenta los cambios, con un punto en tinta. Lo recién agregado se marca con el borde de lume hasta el próximo clic." ruta="edit-routine" fondo="velada" url={u}><Constructor caso="sucio" /></Mesa>
        <Mesa nombre="Guardando" ruta="edit-routine" fondo="velada" url={u}><Constructor caso="guardando" /></Mesa>
        <Mesa nombre="Guardado" nota="El check se anima una vez en el estado y en el aviso." ruta="edit-routine" fondo="velada" url={u}><Constructor caso="guardado" /></Mesa>
        <Mesa nombre="Error al guardar" nota="Nada se pierde: el borrador sigue y Reintentar está en el aviso y en Guardar." ruta="edit-routine" fondo="velada" url={u}><Constructor caso="error" /></Mesa>
        <Mesa nombre="Salir con cambios" nota="Guardar y salir es la acción principal y arranca con el foco." ruta="edit-routine · alerta" fondo="velada" url={u}><Constructor caso="sucio" capa={<ModalSalir />} /></Mesa>
      </Seccion>
      <Seccion titulo="Pantalla mediana" nota="Entre 1024 y 1279 px el catálogo baja a 296 px y los días se desplazan de costado con los bordes fundidos. El catálogo se puede ocultar ([) para ganar una columna.">
        <Mesa nombre="1180 px con el panel abierto" ancho={1180} alto={760} ruta="edit-routine · mediana" fondo="velada" url={u}><Constructor panel="fuerza" rail /></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
