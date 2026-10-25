// Frencia Web · 2 Componentes: cada pieza con sus estados.

const ESTADOS = [['', 'Reposo'], ['hover', 'Hover'], ['foco', 'Foco de teclado'], ['press', 'Presionado'], ['off', 'Deshabilitado'], ['cargando', 'Cargando']];

function Matriz({ cols, filas, n = 6 }) {
  return (
    <div className={`k-estados${n === 5 ? ' k-estados--5' : n === 4 ? ' k-estados--4' : ''}`}>
      <span></span>{cols.map((c) => <span key={c} className="k-estados__cab">{c}</span>)}
      {filas.map(([rot, celdas]) => (
        <React.Fragment key={rot}>
          <span className="t-bodysm semi c-pri">{rot}</span>
          {celdas.map((c, i) => <div key={i} className="k-celda">{c}</div>)}
        </React.Fragment>
      ))}
    </div>
  );
}

function FichaAcciones() {
  const variantes = [['primary', 'Primario', 'Guardar', 'check'], ['secondary', 'Secundario', 'Compartir', 'share'], ['ghost', 'Fantasma', 'Cancelar', null], ['soft', 'Suave', 'Deshacer', 'rotate-ccw'], ['danger', 'Peligro', 'Eliminar', 'trash-2']];
  return (
    <div className="k-ficha">
      <div className="k-ficha__bloque">
        <span className="t-label c-ter">Botón · Button</span>
        <Matriz cols={ESTADOS.map((e) => e[1])} filas={variantes.map(([v, l, txt, ico]) => [l, ESTADOS.map(([e]) => <Boton v={v} ico={ico} estado={e || undefined}>{txt}</Boton>)])} />
      </div>
      <div className="k-ficha__bloque">
        <span className="t-label c-ter">Tamaños · sm 36 · md 44 · lg 54</span>
        <div className="row g4"><Boton t="sm" ico="plus">Agregar</Boton><Boton ico="plus">Agregar</Boton><Boton t="lg" ico="plus">Agregar</Boton><Boton v="secondary" t="sm" icoDer="arrow-right">Ver todo</Boton></div>
      </div>
      <div className="k-ficha__bloque">
        <span className="t-label c-ter">Botón de icono · IconButton, con tooltip</span>
        <Matriz n={5} cols={['Reposo', 'Hover + tooltip', 'Foco de teclado', 'Deshabilitado', 'Destructivo · hover']} filas={[
          ['Fantasma', [<BotonIco ico="pencil" tip="Editar" />, <BotonIco ico="pencil" tip="Editar" estado="hover" />, <BotonIco ico="pencil" estado="foco" />, <BotonIco ico="pencil" estado="off" />, <BotonIco ico="trash-2" dang estado="hover" tip="Eliminar" />]],
          ['Vidrio', [<BotonIco ico="share" v="surface" />, <BotonIco ico="share" v="surface" tip="Compartir" estado="hover" />, <BotonIco ico="share" v="surface" estado="foco" />, <BotonIco ico="share" v="surface" estado="off" />, <span className="t-bodysm c-ter">—</span>]],
        ]} />
        <span className="t-bodysm c-sec">El tooltip aparece a los 400 ms de hover o enseguida con el foco de teclado; lleva el atajo si existe. Todo botón de icono tiene aria-label.</span>
      </div>
      <div className="k-ficha__bloque">
        <span className="t-label c-ter">Atajo · Kbd</span>
        <div className="row g3"><Kbd>N</Kbd><Kbd>/</Kbd><span className="row g1"><Kbd>Ctrl</Kbd><Kbd>S</Kbd></span><Kbd>Esc</Kbd><span className="row g1"><Kbd>G</Kbd><Kbd>R</Kbd></span></div>
      </div>
    </div>
  );
}

function FichaCampos() {
  return (
    <div className="k-ficha">
      <div className="k-ficha__bloque">
        <span className="t-label c-ter">Campo de texto · Field</span>
        <Matriz n={5} cols={['Reposo', 'Hover', 'Foco de teclado', 'Error', 'Deshabilitado']} filas={[
          ['Con valor', [<Campo ico="mail" valor="bauti@correo.com" />, <Campo ico="mail" valor="bauti@correo.com" estado="hover" />, <Campo ico="mail" valor="bauti@correo" estado="foco" />, <Campo ico="mail" valor="bauti@correo" error="Revisá el correo." />, <Campo ico="mail" valor="bauti@correo.com" estado="off" />]],
          ['Vacío', [<Campo ico="search" ph="Buscar ejercicio" md />, <Campo ico="search" ph="Buscar ejercicio" md estado="hover" />, <Campo ico="search" ph="Buscar ejercicio" md estado="foco" />, <Campo ico="lock" ph="Contraseña" md error="Mínimo 6 caracteres." />, <Campo ico="search" ph="Buscar ejercicio" md estado="off" />]],
        ]} />
      </div>
      <div className="row g9 items-inicio">
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Número con pasos · NumberField</span>
          <div className="col g4">
            <Numero rotulo="Series" valor="4" />
            <Numero rotulo="Reps" valor="8" estado="foco" />
            <Numero rotulo="Peso" extra="opcional" valor={null} unidad="kg" />
            <Numero rotulo="Descanso" valor="2:00" estado="off" />
          </div>
          <span className="t-bodysm c-sec">Se escribe directo; ↑ ↓ suman o restan un paso, Shift ×10. Los botones repiten si se mantienen apretados.</span>
        </div>
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Selector y menú · Select, Menu</span>
          <Selector rotulo="Grupo muscular" ico="target" valor="Pecho" estado="foco" abierto>
            <Menu>
              <MenuItem ico="layers" sel>Todos</MenuItem>
              <MenuItem ico="target" estado="hover">Pecho</MenuItem>
              <MenuItem ico="target" estado="foco">Espalda</MenuItem>
              <MenuItem ico="target">Cuádriceps</MenuItem>
              <MenuItem ico="target" estado="off">Antebrazo · sin ejercicios</MenuItem>
              <MenuSep />
              <MenuItem ico="trash-2" dang kbd="Supr">Quitar filtro</MenuItem>
            </Menu>
          </Selector>
        </div>
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Segmentado · SegmentedControl</span>
          <Seg ops={[['system', 'Sistema', 'monitor'], ['dark', 'Oscuro', 'moon'], ['light', 'Claro', 'sun']]} sel="system" estados={{ dark: 'hover' }} />
          <Seg ops={[['kg', 'kg'], ['lb', 'lb']]} sel="kg" acento estados={{ lb: 'foco' }} />
          <Seg ops={[['rir', 'RIR'], ['rpe', 'RPE'], ['no', 'Sin intensidad']]} sel="rir" estados={{ no: 'off' }} />
          <span className="t-label c-ter">Interruptor, casilla</span>
          <Matriz n={4} cols={['Apagado', 'Encendido', 'Foco', 'Deshab.']} filas={[
            ['Switch', [<Switch />, <Switch on />, <Switch on estado="foco" />, <Switch estado="off" />]],
            ['Casilla', [<Check />, <Check on />, <Check estado="foco" />, <Check estado="off" />]],
          ]} />
        </div>
      </div>
      <div className="row g9 items-inicio">
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Opción con radio · Option</span>
          <Opcion titulo="Una copia" texto="Recibe la rutina como está hoy." ico="copy" sel />
          <Opcion titulo="La original" texto="Queda vinculada a la tuya." ico="link" estado="hover" />
          <Opcion titulo="Masculino" estado="foco" />
        </div>
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Chip de filtro · FilterChip</span>
          <div className="row g3 wrap"><Chip sel n={124}>Todos</Chip><Chip n={18} estado="hover">Pecho</Chip><Chip n={21} estado="foco">Espalda</Chip><Chip n={0} estado="off">Antebrazo</Chip></div>
          <div className="row g3 wrap"><Chip ico="dumbbell">Fuerza</Chip><Chip ico="timer" sel>Isométrico</Chip><Chip ico="heart-pulse">Cardio</Chip><Chip ico="footprints">Híbrido</Chip></div>
          <span className="t-label c-ter">Badge</span>
          <div className="row g3 wrap"><Badge tono="signal">En curso</Badge><Badge>Archivada</Badge><Badge ico="link">Vinculada</Badge><Badge tono="intensity" ico="flame">12 días</Badge><Badge tono="danger">Se elimina en 30 días</Badge></div>
        </div>
      </div>
    </div>
  );
}

function FichaSuperficies() {
  return (
    <div className="k-ficha">
      <div className="k-ficha__bloque">
        <span className="t-label c-ter">Tarjeta navegable · Card · y fila de lista · Row</span>
        <div className="row g5 items-inicio">
          {[['', 'Reposo'], ['hover', 'Hover'], ['foco', 'Foco de teclado']].map(([e, l]) => (
            <div key={l} className={`w-tarjeta w-tarjeta--link f1 col g3${est(e)}`}><span className="t-label c-ter">{l}</span><span className="t-subtitle">Push Pull Legs</span><span className="t-bodysm c-sec">3 días · 18 ejercicios</span></div>
          ))}
        </div>
        <div className="w-lista">
          <div className="w-fila w-fila--link"><span className="t-bodysm semi f1">Fila en reposo</span><Ico n="chevron-right" s={18} c="c-ter" /></div>
          <div className="w-fila w-fila--link is-hover"><span className="t-bodysm semi f1">Fila con hover: el fondo sube a chip</span><Ico n="chevron-right" s={18} c="c-ter" /></div>
          <div className="w-fila w-fila--link is-foco"><span className="t-bodysm semi f1">Fila con foco de teclado</span><Ico n="chevron-right" s={18} c="c-ter" /></div>
        </div>
      </div>
      <div className="row g9 items-inicio">
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Carga · Skeleton, Spinner</span>
          <div className="w-tarjeta col g4">
            <span className="w-esqueleto k-esq k-esq--rotulo"></span>
            <span className="w-esqueleto k-esq k-esq--titulo"></span>
            <span className="w-esqueleto k-esq k-esq--linea"></span>
          </div>
          <div className="row g5"><Ruedita /><Ruedita lg /><span className="t-bodysm c-sec">Cargando rutinas…</span></div>
          <span className="t-bodysm c-sec">Primera carga de una página: esqueletos con la forma del contenido. Acción en curso: la ruedita dentro del botón. Nunca las dos juntas.</span>
        </div>
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Avisos · Toast (abajo a la derecha)</span>
          <Toast texto="Rutina guardada" confirma />
          <Toast texto="Ejercicio quitado de Push" tipo="info" accion="Deshacer" />
          <Toast texto="No pudimos guardar. Revisá tu conexión." tipo="error" accion="Reintentar" />
        </div>
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Vacío y error</span>
          <div className="w-tarjeta w-tarjeta--punteada col g4 centro">
            <Ico n="layers" s={26} c="c-ter" /><span className="t-subtitle">Todavía no tenés rutinas</span>
            <span className="t-bodysm c-sec">Armala acá con el catálogo al lado.</span>
            <Boton ico="plus">Crear rutina</Boton>
          </div>
          <div className="w-tarjeta col g3 centro"><span className="t-bodysm">No pudimos cargar tu historial.</span><Boton v="secondary" t="sm" ico="rotate-ccw">Reintentar</Boton></div>
        </div>
      </div>
    </div>
  );
}

function FichaMedidas() {
  return (
    <div className="k-ficha">
      <div className="row g9 items-inicio">
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Rueda de edad → Fecha de nacimiento · DateField</span>
          <Fecha d="14" m="03" a="2001" />
          <Fecha d="14" m="03" a="20" foco="a" />
          <span className="t-bodysm c-sec">La cuenta guarda fecha_nacimiento; la edad se calcula. Se escribe de corrido: al completar el día salta al mes. ↑ ↓ cambian el segmento en foco.</span>
        </div>
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Regla de altura → Regla web · RulerSlider</span>
          <Regla valor={175} unidad="cm" estado="foco" n={30} />
          <AyudaTeclado items={[[['←', '→'], '±1 cm'], [['Shift'], '±10'], [['clic'], 'en el número para escribir']]} />
        </div>
      </div>
      <div className="row g9 items-inicio">
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Regla curva de peso → Arco web · ArcSlider</span>
          <Arco valor={72.5} />
          <AyudaTeclado items={[[['←', '→'], '±0,5 kg'], [['Shift'], '±5'], [['rueda'], 'del mouse ±0,5']]} />
        </div>
        <div className="k-ficha__bloque f1">
          <span className="t-label c-ter">Lectura editándose</span>
          <Regla valor={182} unidad="cm" edita n={30} />
          <span className="t-bodysm c-sec">Clic o Enter sobre el número lo vuelve un campo; Enter confirma, Esc vuelve al valor anterior. Fuera de rango (100–250 cm / 30–300 kg) no confirma y avisa en tinta.</span>
        </div>
      </div>
    </div>
  );
}

function FondoPagina({ capa }) {
  return (
    <div className="w-app"><Nav activo="routines" /><main className="w-main"><Pagina>
      <Encabezado rotulo="Rutinas" titulo="Push Pull Legs" sub="3 días · 18 ejercicios" acciones={<><Boton v="secondary" ico="share">Compartir</Boton><Boton ico="pencil">Editar</Boton></>} />
      <div className="row g5 items-inicio">{RUTINA.dias.map((d) => <div key={d.n} className="w-tarjeta f1 col g3"><span className="t-subtitle">{d.n}</span><Semana on={d.sem} /></div>)}</div>
    </Pagina></main>{capa || null}</div>
  );
}

function AppWeb() {
  const eqs = [
    ['Hoja inferior de acciones (menú)', 'Menú contextual anclado al botón ⋯ o al clic derecho', 'Menu'],
    ['Hoja inferior con decisión (compartir, foto)', 'Modal centrado de 440–560 px, Esc y clic afuera cierran', 'Modal'],
    ['Hoja con un formulario largo (configurar ejercicio)', 'Panel lateral de 400 px, no modal: se puede seguir trabajando detrás', 'Panel'],
    ['Alerta de confirmación', 'Modal chico; el foco arranca en Cancelar si la acción es destructiva', 'Modal sm'],
    ['Rueda de edad', 'Campo de fecha de nacimiento en tres segmentos', 'DateField'],
    ['Regla de altura', 'Lectura editable + regla arrastrable, rueda del mouse y flechas', 'RulerSlider'],
    ['Regla curva de peso', 'La misma lectura sobre la banda en arco, arrastrable y con teclado', 'ArcSlider'],
    ['Deslizar una fila (eliminar, poner en curso)', 'Botón ⋯ visible al hover y menú; Supr sobre la fila enfocada', 'Menu'],
    ['Mantener apretado para reordenar', 'Agarre visible al hover, arrastrar con dnd-kit o Espacio + flechas', 'Sortable'],
    ['Toast arriba', 'Toast abajo a la derecha, apilado, con acción opcional', 'Toast'],
  ];
  const anim = [
    ['Hover y foco del control', 'plus (Nueva rutina), share (Compartir), pencil (Editar), search (Buscar), settings, rotate-ccw (Reintentar), copy', 'Una vez por entrada del puntero o del foco; no en bucle.'],
    ['Al confirmar una acción', 'check (Guardado, Agregado), copy → check (Link copiado), trash-2 (Quitado, en el toast)', 'Una vez, en el icono del toast o del botón que confirmó.'],
    ['Siempre quietos', 'Navegación lateral, chevrons, iconos de tipo de ejercicio, flame, iconos dentro de campos, agarre', 'Son señalización: moverlos distrae.'],
    ['Reducir movimiento', 'Todos', 'Con prefers-reduced-motion se usa lucide-react estático.'],
  ];
  return (
    <Lienzo titulo="Componentes" bajada="Los componentes de la app con sus estados de escritorio. Cada uno se dibuja con la pseudoclase real y con una clase is-* para verlo quieto acá. Lo que no existía en el sistema (tooltip, menú, panel lateral, chip de filtro, regla web, arco, fecha, kbd) se suma como componente nuevo.">
      <Seccion titulo="Acciones">
        <Mesa nombre="Botones y botones de icono" alto={1100} fondo="velada" ruta="ui/Button · ui/IconButton · ui/Tooltip · ui/Kbd"><FichaAcciones /></Mesa>
      </Seccion>
      <Seccion titulo="Campos y selección">
        <Mesa nombre="Campos, número, selector, segmentado, opciones y chips" alto={1240} fondo="velada" ruta="ui/Field · ui/NumberField · ui/Select · ui/Menu · ui/SegmentedControl · ui/Switch · ui/Checkbox · ui/Option · ui/FilterChip · ui/Badge"><FichaCampos /></Mesa>
      </Seccion>
      <Seccion titulo="Superficies, carga y avisos">
        <Mesa nombre="Tarjetas, filas, carga, toasts, vacío y error" alto={900} fondo="velada" ruta="ui/Card · ui/Row · ui/Skeleton · ui/Spinner · ui/Toast"><FichaSuperficies /></Mesa>
      </Seccion>
      <Seccion titulo="Equivalentes de las piezas táctiles" nota="La rueda, la regla y la regla curva del setup pasan a controles para mouse y teclado; conservan la lectura grande condensada y la aguja de lume. La hoja inferior se divide en tres según lo que contiene.">
        <Mesa nombre="Fecha, regla y arco" alto={980} fondo="centro" ruta="ui/DateField · ui/RulerSlider · ui/ArcSlider"><FichaMedidas /></Mesa>
        <div className="k-doc">
          <table className="k-tabla"><thead><tr><th>En la app</th><th>En la web</th><th>Componente</th></tr></thead>
            <tbody>{eqs.map(([a, b, c]) => <tr key={a}><td>{a}</td><td>{b}</td><td><code>{c}</code></td></tr>)}</tbody></table>
        </div>
        <Mesa nombre="Modal (reemplaza la hoja con una decisión)" ruta="ui/Modal" url="frencia.app/rutinas/push-pull-legs">
          <FondoPagina capa={<Modal chico titulo="Eliminar Push Pull Legs" texto="Se borra la rutina con sus 3 días y los ejercicios de cada uno. Tu historial de sesiones no se toca. No se puede deshacer." pie={<><Boton v="secondary" estado="foco">Cancelar</Boton><Boton v="danger" ico="trash-2">Eliminar</Boton></>} />} />
        </Mesa>
      </Seccion>
      <Seccion titulo="Iconos animados" nota="Lucide con trazo 1.75. Los que existen en @animateicons/react/lucide se usan en su versión animada solo en estos casos; el resto, lucide-react estático.">
        <div className="k-doc">
          <table className="k-tabla"><thead><tr><th>Cuándo</th><th>Iconos</th><th>Regla</th></tr></thead>
            <tbody>{anim.map(([a, b, c]) => <tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>
          <div className="row g4"><Boton v="secondary" ico="share" anima>Pasá el mouse: Compartir</Boton><Boton v="secondary" ico="search" anima>Buscar</Boton><Boton ico="check" confirma>Guardado</Boton></div>
        </div>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
