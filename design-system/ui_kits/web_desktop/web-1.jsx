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

function PantallaChica() {
  return (
    <div className="w-app w-app--sin-nav">
      <main className="w-main row centro">
        <div className="w-tarjeta col g5 items-inicio k-chica">
          <Marca />
          <span className="t-title">Agrandá la ventana para usar Frencia Web</span>
          <span className="t-bodysm c-sec">Frencia Web está pensada para pantallas de 1024 px o más: planificar con el catálogo al lado necesita lugar. En el celular, usá la app.</span>
          <div className="row g3"><Boton v="secondary" ico="smartphone">Abrir la app</Boton></div>
          <span className="t-label c-ter">Ancho actual 900 px · mínimo 1024 px</span>
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
    <Lienzo titulo="Estructura de escritorio" bajada="La barra de pestañas de la app pasa a una navegación lateral fija. El ancho mínimo es 1024 px; entre 1024 y 1279 la navegación se vuelve un riel de iconos y el contenido se compacta. Todo lo demás —vidrio, luces, tipografía— es el mismo sistema.">
      <Seccion titulo="Grande · 1280 px o más" nota="Navegación expandida de 248 px en vidrio denso (surface-raised + blur-sheet), contenido centrado con un máximo de 1200 px y márgenes de 40 px. Nueva rutina reemplaza al botón central de la barra; va en secundario para dejar el lume a la acción de cada página.">
        <Mesa nombre="Anatomía · navegación expandida" nota="La pestaña activa lleva el icono en lume y una marca de 3 px pegada al borde, igual que la barra de la app. Al pasar el mouse por un ítem aparece su atajo. Abajo, el recordatorio de que se entrena desde el celular, Configuración y el usuario (lleva a Perfil)." ruta="(main)/routines · hover en Historial" url="frencia.app/rutinas"><Anatomia /></Mesa>
      </Seccion>
      <Seccion titulo="Mediana · 1024 a 1279 px" nota="La navegación pasa a un riel de 76 px con solo iconos; la etiqueta y el atajo salen en un tooltip a la derecha. El usuario también puede colapsarla en pantallas grandes con [ o el botón de la cabecera; la preferencia se guarda en el navegador.">
        <Mesa nombre="Riel con tooltip" ancho={1180} alto={760} nota="Los márgenes de página bajan a 32 px y las tiras de semana se esconden en las listas." ruta="(main)/routines · riel" url="frencia.app/rutinas"><div className="w-app w-app--rail k-pad-mediana"><Nav activo="routines" rail hover="history" /><main className="w-main"><CuerpoRutinas compacto /></main></div></Mesa>
      </Seccion>
      <Seccion titulo="Menos de 1024 px" nota="Fuera de la página pública de una rutina, la app web no se rearma para celular: muestra este aviso. Se decide por ancho, no por dispositivo.">
        <Mesa nombre="Ventana demasiado chica" ancho={900} alto={640} ruta="* · ancho < 1024" fondo="centro" url="frencia.app"><PantallaChica /></Mesa>
      </Seccion>
      <Seccion titulo="Teclado" nota="Todo lo que se hace con el mouse se puede hacer con el teclado. El foco visible es siempre el mismo anillo de 2 px en focus-ring (lume / oliva) con 2 px de separación.">
        <Mesa nombre="Atajos" ruta="* · modal" url="frencia.app/rutinas"><div className="w-app"><Nav activo="routines" /><main className="w-main"><CuerpoRutinas /></main><Atajos /></div></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
