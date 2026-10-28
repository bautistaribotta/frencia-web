// Frencia Web · 1 Estructura: navegación lateral, anchos y reacomodo.

function CuerpoRutinas({ compacto }) {
  const filas = [
    ['Fuerza 4 días', '4 días · 12 MAY 2026', '38 sesiones'],
    ['Full body', '3 días · 2 FEB 2026', '21 sesiones'],
    ['Torso / pierna', '4 días · 8 NOV 2025', '44 sesiones'],
  ];
  return (
    <Pagina>
      <Encabezado rotulo="Rutinas" titulo="Tus rutinas" sub="Una en curso; las demás quedan archivadas con su historial." acciones={<Boton ico="plus">Nueva rutina</Boton>} />
      <div className="w-tarjeta w-tarjeta--activa w-tarjeta--link row g6">
        <div className="col g3 f1"><span className="t-label c-acc">En curso · 3 días · desde 29 JUL 2026</span><span className="t-title">Push Pull Legs</span></div>
        {compacto ? null : <Semana on={[0, 1, 2, 3, 4, 5]} />}
        <Ico n="chevron-right" s={20} c="c-ter" />
      </div>
      <div className="w-lista">
        {filas.map(([n, d, s]) => (
          <div key={n} className="w-fila w-fila--link">
            <div className="col g1 f1"><span className="t-bodysm semi c-pri">{n}</span><span className="t-label c-ter">{d}</span></div>
            <span className="t-bodysm c-sec">{s}</span>
            <BotonIco ico="ellipsis" t="sm" label={`Más acciones de ${n}`} />
          </div>
        ))}
      </div>
    </Pagina>
  );
}

function Anatomia() {
  return (
    <div className="w-app">
      <Nav activo="routines" hover="history" />
      <main className="w-main"><CuerpoRutinas /></main>
    </div>
  );
}

const BARRA = [
  { v: 'home', l: 'Inicio', ico: 'house' },
  { v: 'routines', l: 'Rutinas', ico: 'layers' },
  { v: 'history', l: 'Historial', ico: 'history' },
  { v: 'profile', l: 'Perfil', ico: 'user-round' },
];
function BarraMovil({ activo }) {
  return (
    <nav className="w-barra-movil" aria-label="Principal">
      {BARRA.map((it) => <a key={it.v} className={`w-barra-movil__item${activo === it.v ? ' is-activo' : ''}`} aria-current={activo === it.v ? 'page' : undefined}><Ico n={it.ico} s={22} /><span>{it.l}</span></a>)}
    </nav>
  );
}
function AvisoApp() {
  return <div className="w-aviso-app"><Ico n="smartphone" s={18} /><span className="t-bodysm c-pri f1">Frencia anda mejor en la app</span><Boton v="soft" t="sm">Descargar</Boton><BotonIco ico="x" t="sm" label="Cerrar aviso" /></div>;
}
function Telefono({ activo, capa, children }) {
  return (
    <div className="w-app w-app--telefono">
      <main className="w-main"><div className="w-pagina"><AvisoApp />{children}</div></main>
      <BarraMovil activo={activo} />
      {capa || null}
    </div>
  );
}
function RutinasTelefono() {
  const dias = [['Push', [0, 3]], ['Pull', [1, 4]], ['Legs', [2, 5]]];
  return (
    <Telefono activo="routines">
      <Encabezado rotulo="Rutinas" titulo="Todas las rutinas" sub="Una en curso, al poner otra en curso, la actual se archiva." />
      <div className="w-tarjeta w-tarjeta--activa w-activa-tel">
        <div className="col g3"><span className="t-label c-acc">En curso · desde 1 SEP 2026</span><span className="t-title">Push Pull Legs</span><span className="t-bodysm c-sec">3 días · 18 ejercicios · 24 sesiones</span></div>
        <div className="col">{dias.map(([d, on]) => <div key={d} className="w-activa-tel__dia"><span className="t-bodysm semi">{d}</span><Semana on={on} /></div>)}</div>
      </div>
      <div className="col g4">
        <div className="row entre"><span className="t-label c-ter">Anteriores · 1</span><span className="t-label c-ter">2 de 5 rutinas</span></div>
        <div className="w-lista">
          <table className="w-tabla">
            <thead><tr><th>Rutina</th><th className="num">Sesiones</th><th></th></tr></thead>
            <tbody><tr><td><span className="semi">Full body</span></td><td className="num">30</td><td className="w-tabla__acc"><BotonIco ico="ellipsis" t="sm" label="Más acciones de Full body" /></td></tr></tbody>
          </table>
        </div>
      </div>
    </Telefono>
  );
}
function HistorialTelefono({ hoja }) {
  const filas = [['Jue 22', 'Push', '15'], ['Mié 21', 'Legs', '14'], ['Mar 20', 'Pull', '13'], ['Lun 19', 'Push', '15']];
  const capa = hoja ? <Modal chico titulo="Eliminar el entrenamiento del jueves 22" texto="Se borran sus 15 series. Tus mejores marcas se recalculan. No se puede deshacer." pie={<><Boton v="secondary" estado="foco">Cancelar</Boton><Boton v="danger" ico="trash-2">Eliminar</Boton></>} /> : null;
  return (
    <Telefono activo="history" capa={capa}>
      <Encabezado rotulo="Historial" titulo="Listado de los días entrenados" acciones={<Selector md ico="layers" valor="Todas las rutinas" />} />
      <div className="w-cuatro">
        {[['Sesiones', '86', ''], ['Tiempo total', '79', 'h']].map(([l, v, u]) => <div key={l} className="w-tarjeta w-metrica"><span className="t-label c-ter">{l}</span><span className="w-metrica__valor">{v}{u ? <small>{u}</small> : null}</span></div>)}
      </div>
      <div className="col g4">
        <div className="row entre"><span className="t-subtitle">Octubre</span><span className="t-label c-ter">9 sesiones</span></div>
        <div className="w-lista">
          <table className="w-tabla">
            <thead><tr><th>Fecha</th><th>Día</th><th className="num">Series</th><th></th></tr></thead>
            <tbody>{filas.map(([f, d, s]) => <tr key={f}><td className="c-sec">{f}</td><td><span className="semi">{d}</span></td><td className="num">{s}</td><td className="w-tabla__acc"><BotonIco ico="trash-2" t="sm" label="Eliminar entrenamiento" /></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </Telefono>
  );
}
function DetalleTelefono({ archivada, menu }) {
  return (
    <Telefono activo="routines">
      <div className="w-migas"><Boton v="ghost" t="sm" ico="chevron-left">Rutinas</Boton></div>
      <div className="w-encabezado">
        <div className="w-encabezado__textos">
          <div className="row g3">{archivada ? <Badge>Archivada</Badge> : <Badge tono="signal">En curso</Badge>}</div>
          <span className="w-nombre-rutina w-nombre-rutina--movil">{archivada ? 'Fuerza 4 días' : 'Push Pull Legs'}</span>
          <span className="t-data c-sec">{archivada ? '4 días · 22 ejercicios · archivada el 12 MAY 2026' : '3 días · 18 ejercicios · creada el 29 JUL 2026'}</span>
        </div>
        <div className="row g3">
          {archivada ? <><Boton ico="play">Poner en curso</Boton><BotonIco ico="pencil" v="surface" label="Editar rutina" /></> : <Boton ico="pencil">Editar</Boton>}
          <BotonIco ico="share" v="surface" estado="off" label="Compartir" />
          <span className="w-ancla">
            <BotonIco ico="ellipsis" v="surface" label="Más acciones" />
            {menu ? <Menu className="w-menu--abajo"><MenuItem ico="copy">Duplicar</MenuItem><MenuItem ico="trash-2" dang>Eliminar</MenuItem></Menu> : null}
          </span>
        </div>
      </div>
    </Telefono>
  );
}
const APPLE_D = 'M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.21 1.11-.05 1.53-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.15.85-1.23 1.19-2.43 1.21-2.49-.03-.01-2.31-.89-2.34-3.53zM14.19 6.14c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.55.64-1.05 1.69-.92 2.68.98.08 1.97-.49 2.58-1.23z';
function LogoApple() {
  return <svg className="w-logo w-logo--apple" viewBox="0 0 24 24" aria-hidden="true"><path d={APPLE_D} /></svg>;
}
function LogoGooglePlay() {
  return (
    <svg className="w-logo" viewBox="0 0 24 24" aria-hidden="true">
      <path className="w-logo__play-azul" d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1z" />
      <path className="w-logo__play-verde" d="M3.6 1.8 13.8 12l3-3L5.2 2c-.6-.4-1.2-.4-1.6-.2z" />
      <path className="w-logo__play-rojo" d="M3.6 22.2 13.8 12l3 3-11.6 7c-.6.4-1.2.4-1.6.2z" />
      <path className="w-logo__play-amarillo" d="m16.8 9 3.6 2.1c.7.4.7 1.4 0 1.8L16.8 15l-3-3z" />
    </svg>
  );
}
function ConstructorBloqueado() {
  return (
    <div className="w-app w-app--sin-nav w-app--telefono">
      <main className="w-main">
        <div className="w-bloqueo">
          <span className="w-bloqueo__ico"><Ico n="smartphone" s={28} /></span>
          <span className="t-title">Armá tus rutinas en la app o en la compu</span>
          <span className="t-bodysm c-sec">Arrastrar ejercicios y ver los días lado a lado necesita una pantalla más grande.</span>
          <div className="w-bloqueo__acciones">
            <div className="w-bloqueo__tiendas"><Boton v="secondary"><LogoApple />App Store</Boton><Boton v="secondary"><LogoGooglePlay />Google Play</Boton></div>
            <span className="t-bodysm c-ter">Las apps llegan pronto a las tiendas.</span>
            <Boton v="ghost" ico="chevron-left">Volver a la rutina</Boton>
          </div>
        </div>
      </main>
    </div>
  );
}

function Atajos() {
  const grupos = [
    ['Navegar', [[['G', 'I'], 'Ir a Inicio'], [['G', 'R'], 'Ir a Rutinas'], [['G', 'H'], 'Ir a Historial'], [['N'], 'Nueva rutina'], [['['], 'Colapsar o expandir la navegación']]],
    ['Constructor', [[['/'], 'Buscar en el catálogo'], [['Ctrl', 'S'], 'Guardar'], [['Espacio'], 'Levantar o soltar un ejercicio'], [['↑', '↓', '←', '→'], 'Mover lo levantado'], [['Esc'], 'Cancelar el arrastre o cerrar el panel']]],
  ];
  return (
    <Modal titulo="Atajos de teclado" texto="Se abre con ? desde cualquier pantalla.">
      <div className="row g8 items-inicio">
        {grupos.map(([t, items]) => (
          <div key={t} className="col g4 f1">
            <span className="t-label c-ter">{t}</span>
            {items.map(([k, d]) => <div key={d} className="row entre g4"><span className="t-bodysm c-pri">{d}</span><span className="row g1">{k.map((x) => <Kbd key={x}>{x}</Kbd>)}</span></div>)}
          </div>
        ))}
      </div>
    </Modal>
  );
}

function AppWeb() {
  return (
    <Lienzo titulo="Estructura de escritorio" bajada="La barra de pestañas de la app pasa a una navegación lateral fija. Entre 768 y 1279 la navegación se vuelve un riel de iconos y el contenido se compacta; por debajo de 768, en el teléfono, pasa a una barra inferior y la web queda en modo consulta. Todo lo demás —vidrio, luces, tipografía— es el mismo sistema.">
      <Seccion titulo="Grande · 1280 px o más" nota="Navegación expandida de 248 px en vidrio denso (surface-raised + blur-sheet), contenido centrado con un máximo de 1200 px y márgenes de 40 px. Nueva rutina reemplaza al botón central de la barra; va en secundario para dejar el lume a la acción de cada página.">
        <Mesa nombre="Anatomía · navegación expandida" nota="La pestaña activa lleva el icono en lume y una marca de 3 px pegada al borde, igual que la barra de la app. Al pasar el mouse por un ítem aparece su atajo. Abajo, el recordatorio de que se entrena desde el celular, Configuración y el usuario (lleva a Perfil)." ruta="(main)/routines · hover en Historial" url="frencia.app/rutinas"><Anatomia /></Mesa>
      </Seccion>
      <Seccion titulo="Mediana · 1024 a 1279 px" nota="La navegación pasa a un riel de 76 px con solo iconos; la etiqueta y el atajo salen en un tooltip a la derecha. El usuario también puede colapsarla en pantallas grandes con [ o el botón de la cabecera; la preferencia se guarda en el navegador.">
        <Mesa nombre="Riel con tooltip" ancho={1180} alto={760} nota="Los márgenes de página bajan a 32 px y las tiras de semana se esconden en las listas." ruta="(main)/routines · riel" url="frencia.app/rutinas"><div className="w-app w-app--rail k-pad-mediana"><Nav activo="routines" rail hover="history" /><main className="w-main"><CuerpoRutinas compacto /></main></div></Mesa>
      </Seccion>
      <Seccion titulo="Tablet · 768 a 1023 px" nota="El riel de la mediana, con márgenes de 24 px. Se usa entera, constructor incluido.">
        <Mesa nombre="Rutinas en tablet" ancho={820} alto={1000} nota="En curso con el nombre en una columna de 200 px." ruta="(main)/routines · tablet" url="frencia.app/rutinas"><div className="w-app w-app--rail k-pad-mediana"><Nav activo="routines" rail /><main className="w-main"><CuerpoRutinas compacto /></main></div></Mesa>
      </Seccion>
      <Seccion titulo="Teléfono · menos de 768 px" nota="Modo consulta: se mira y se hacen las acciones de un toque (poner en curso, duplicar, eliminar). La barra inferior reemplaza a la navegación lateral y el aviso de arriba lleva a la app. Se decide por ancho, no por dispositivo.">
        <Mesa nombre="Rutinas" movil ancho={390} alto={844} nota="En curso con los días debajo del nombre; la tabla de anteriores se queda con Rutina, Sesiones y ⋯." ruta="(main)/routines · teléfono" url="frencia.app/rutinas"><RutinasTelefono /></Mesa>
        <Mesa nombre="Historial" movil ancho={390} alto={844} nota="Totales en dos columnas; la tabla, con Fecha, Día, Series y la papelera." ruta="(main)/history · teléfono" fondo="velada" url="frencia.app/historial"><HistorialTelefono /></Mesa>
        <Mesa nombre="Modal como hoja" movil ancho={390} alto={844} nota="Los modales suben desde abajo, a lo ancho. El orden de los botones no cambia." ruta="(main)/history · alerta" fondo="velada" url="frencia.app/historial"><HistorialTelefono hoja /></Mesa>
        <Mesa nombre="Detalle de una rutina" movil ancho={390} alto={844} nota="Las acciones en una fila: Editar (sin «rutina»), Compartir solo con el icono y el ⋯ a la derecha, con su menú hacia abajo y alineado a su borde derecho, dentro de la pantalla." ruta="routine · teléfono" fondo="cumbre" url="frencia.app/rutinas/push-pull-legs"><DetalleTelefono menu /></Mesa>
        <Mesa nombre="Detalle de una archivada" movil ancho={390} alto={844} nota="Poner en curso conserva su texto; Editar pasa a ser solo el lápiz para que la fila entre." ruta="routine · teléfono" fondo="cumbre" url="frencia.app/rutinas/fuerza-4-dias"><DetalleTelefono archivada /></Mesa>
        <Mesa nombre="Constructor bloqueado" movil ancho={390} alto={844} nota="Nueva rutina y Editar rutina llegan acá. Volver tiene memoria; sin las tiendas publicadas, App Store y Google Play quedan desactivados con una nota debajo." ruta="/rutinas/:id/editar · teléfono" fondo="centro" url="frencia.app/rutinas/push-pull-legs/editar"><ConstructorBloqueado /></Mesa>
      </Seccion>
      <Seccion titulo="Teclado" nota="Todo lo que se hace con el mouse se puede hacer con el teclado. El foco visible es siempre el mismo anillo de 2 px en focus-ring (lume / oliva) con 2 px de separación.">
        <Mesa nombre="Atajos" ruta="* · modal" url="frencia.app/rutinas"><div className="w-app"><Nav activo="routines" /><main className="w-main"><CuerpoRutinas /></main><Atajos /></div></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
