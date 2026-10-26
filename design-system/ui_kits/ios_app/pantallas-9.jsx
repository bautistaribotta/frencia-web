// Frencia · Pantallas - 9 Compartir: compartir una rutina por link, sobre pantallas-base.jsx.
// Todavia no hay codigo: las rutas propuestas son routine · ShareSheet y shared/[codigo].
const { Button, Badge, IconButton } = DS;

const RUTINA = { nombre: 'Push Pull Legs', datos: '3 días · 18 ejercicios' };
const DIAS_R = [
  { n: 'Push', d: '6 ejercicios · Lun, Jue' },
  { n: 'Pull', d: '5 ejercicios · Mar, Vie' },
  { n: 'Legs', d: '7 ejercicios · Mié, Sáb' },
];

/* ---------- Barra del detalle con Compartir a la derecha ---------- */
function BarraDetalle({ compartir = true }) {
  return (
    <Volver>
      <span className="f1"></span>
      {compartir ? <IconButton icon="share" variant="ghost" size="md" aria-label="Compartir rutina" /> : null}
    </Volver>
  );
}

function ListaDias({ editable = true }) {
  return (
    <div className="col g4">
      <span className="t-label c-ter">Días de entrenamiento</span>
      <div>
        {DIAS_R.map((d) => (
          <div key={d.n} className="fila-dia">
            <div className="col g1 f1"><span className="t-bodysm semi c-pri">{d.n}</span><span className="t-label c-ter">{d.d}</span></div>
            {editable ? <Ico n="pencil" s={17} c="c-ter" /> : <Ico n="chevron-right" s={17} c="c-ter" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Fila "Compartida con N" que ve el dueno en el detalle */
function FilaCompartida({ n = 3 }) {
  return (
    <div className="compartida">
      <div className="avatares">
        {Array.from({ length: Math.min(n, 3) }, (_, i) => <AvatarBeam key={i} size={26} ring />)}
      </div>
      <div className="col g1 f1">
        <span className="t-bodysm semi c-pri">Compartida con {n} personas</span>
        <span className="t-label c-ter">Vinculada · tus cambios les llegan</span>
      </div>
      <Ico n="chevron-right" s={17} c="c-ter" />
    </div>
  );
}

/* ---------- Detalle del dueno: src/app/routine.tsx + Compartir ---------- */
function DetalleDueno({ archivada, compartida }) {
  return (
    <>
      <BarraDetalle />
      <div className="col g7 pad detalle-scroll f1">
        <div className="col g4 items-inicio">
          <Badge tone={archivada ? 'neutral' : 'signal'}>{archivada ? 'Archivada' : 'En curso'}</Badge>
          <span className="rutina-nombre">{archivada ? 'Fuerza 4 días' : RUTINA.nombre}</span>
          <span className="t-data c-sec">{archivada ? '4 días · 12 MAY 2026' : '3 días · 29 JUL 2026'}</span>
        </div>
        {compartida ? <FilaCompartida /> : null}
        <ListaDias />
      </div>
      <div className="pie-acciones">
        <Button variant="secondary" size="lg" icon="pencil" fullWidth>Editar rutina</Button>
        <Button variant="danger" size="lg" icon="trash-2" fullWidth>Eliminar rutina</Button>
      </div>
    </>
  );
}

/* ---------- Hoja de compartir · paso 1: como compartir ---------- */
const MODOS = [
  {
    id: 'copia', icono: 'copy', titulo: 'Una copia',
    texto: 'Recibe la rutina como está hoy. Después es suya: la puede editar y tus cambios no le llegan.',
  },
  {
    id: 'original', icono: 'link', titulo: 'La original',
    texto: 'Queda vinculada a la tuya. Cuando la edites, se actualiza también para quien la recibió. Esa persona no la puede editar.',
  },
];
function Modos({ sel }) {
  return (
    <div className="col g3" role="radiogroup">
      {MODOS.map((m) => (
        <div key={m.id} className={`modo${m.id === sel ? ' modo--sel' : ''}`} role="radio" aria-checked={m.id === sel}>
          <div className="modo__ico"><Ico n={m.icono} s={20} /></div>
          <div className="col g1 f1">
            <span className="modo__titulo">{m.titulo}</span>
            <span className="t-bodysm c-sec">{m.texto}</span>
          </div>
          <span className="modo__radio"></span>
        </div>
      ))}
    </div>
  );
}
function HojaModo({ sel = 'copia' }) {
  return (
    <Hoja cls="hoja--compartir">
      <div className="col g2">
        <span className="t-label c-ter">Compartir rutina</span>
        <span className="t-subtitle">{RUTINA.nombre}</span>
        <span className="t-bodysm c-sec">Elegí qué recibe la otra persona.</span>
      </div>
      <Modos sel={sel} />
      <div className="hoja__pie">
        <Button variant="primary" size="lg" icon="link" fullWidth>Crear link</Button>
      </div>
    </Hoja>
  );
}

/* ---------- Hoja de compartir · paso 2: link listo ---------- */
function Previa() {
  return (
    <div className="previa">
      <div className="col g1">
        <span className="t-subtitle una-linea">{RUTINA.nombre}</span>
        <span className="t-label c-ter">{RUTINA.datos}</span>
      </div>
      <div className="chips-dias">{DIAS_R.map((d) => <span key={d.n} className="chip-dia">{d.n}</span>)}</div>
    </div>
  );
}
function HojaLink({ modo = 'copia' }) {
  const original = modo === 'original';
  return (
    <Hoja cls="hoja--compartir">
      <div className="row g2 hoja__cabeza">
        <Button variant="ghost" size="sm" icon="chevron-left">Atrás</Button>
        <span className="f1"></span>
        <Badge tone="neutral" icon={original ? 'link' : 'copy'}>{original ? 'Original' : 'Copia'}</Badge>
      </div>
      <div className="col g2">
        <span className="t-subtitle">Link listo</span>
        <span className="t-bodysm c-sec">
          {original
            ? 'Quien lo abra va a seguir tu rutina. Lo que cambies le llega solo.'
            : 'Quien lo abra se lleva una copia de la rutina tal como está ahora.'}
        </span>
      </div>
      <Previa />
      <div className="link-caja">
        <Ico n="link-2" s={18} c="c-ter" />
        <span className="link-caja__texto una-linea">frencia.app/r/K7Q2-PX9A</span>
        <span className="link-caja__copiar"><Ico n="copy" s={16} />Copiar</span>
      </div>
      <div className="row g2 c-ter aviso-link">
        <Ico n={original ? 'users' : 'clock'} s={14} />
        <span className="t-label">{original ? 'Sirve hasta que dejes de compartirla' : 'Vence en 7 días · se puede usar varias veces'}</span>
      </div>
      <div className="hoja__pie">
        <Button variant="primary" size="lg" icon="message-circle" fullWidth>Enviar por WhatsApp</Button>
        <Button variant="secondary" size="lg" icon="share" fullWidth>Otras apps</Button>
      </div>
    </Hoja>
  );
}

/* ---------- Quien recibe: shared/[codigo] ---------- */
function Autor({ texto = 'Te compartió esta rutina' }) {
  return (
    <div className="row g3">
      <AvatarBeam size={36} ring />
      <div className="col">
        <span className="t-bodysm semi c-pri">Bautista Ribotta</span>
        <span className="t-label c-ter">{texto}</span>
      </div>
    </div>
  );
}
function Recibir({ modo = 'copia', enCurso = true }) {
  const original = modo === 'original';
  return (
    <>
      <Volver texto="Cerrar" icono="x" />
      <div className="col g7 pad detalle-scroll f1">
        <Autor />
        <div className="col g4 items-inicio">
          <Badge tone="neutral" icon={original ? 'link' : 'copy'}>{original ? 'Vinculada' : 'Copia'}</Badge>
          <span className="rutina-nombre">{RUTINA.nombre}</span>
          <span className="t-data c-sec">{RUTINA.datos}</span>
        </div>
        {original ? (
          <div className="aviso-vinculo">
            <Ico n="link" s={18} c="c-pri" />
            <span className="t-bodysm c-sec f1"><span className="c-pri semi">Bautista la actualiza.</span> Vas a ver sus cambios apenas los haga. Vos la entrenás y registrás tus series, pero no la podés editar.</span>
          </div>
        ) : null}
        <ListaDias editable={false} />
      </div>
      <div className="pie-acciones">
        <div className="fila-switch">
          <div className="col g1 f1">
            <span className="t-bodysm semi c-pri">Ponerla en curso</span>
            <span className="t-label c-ter">Va a aparecer en Inicio</span>
          </div>
          <DS.Switch checked={enCurso} />
        </div>
        <Button variant="primary" size="lg" icon="plus" fullWidth>Agregar a mis rutinas</Button>
      </div>
    </>
  );
}
function DialogoReemplazar() {
  return (
    <Dialogo titulo="Ya tenés una rutina en curso" mensaje="Fuerza 4 días pasa a Anteriores y Push Pull Legs queda en curso. Tu historial no cambia.">
      <Button variant="primary" size="lg" fullWidth>Poner en curso</Button>
      <Button variant="secondary" size="lg" fullWidth>Agregar sin ponerla en curso</Button>
    </Dialogo>
  );
}
function LinkCaido() {
  return (
    <>
      <Volver texto="Cerrar" icono="x" />
      <div className="col pad f1 link-caido">
        <div className="tarjeta--punteada col items-centro g5">
          <Ico n="link-2-off" s={26} c="c-ter" />
          <span className="t-subtitle center">Este link ya no funciona</span>
          <span className="t-bodysm c-sec center vacio-parrafo">Venció o quien te lo mandó dejó de compartir la rutina. Pedile uno nuevo.</span>
          <Button variant="secondary" size="lg">Ir a Inicio</Button>
        </div>
      </div>
    </>
  );
}

/* ---------- Rutina vinculada, del lado de quien la recibio ---------- */
function DetalleVinculada({ novedad }) {
  return (
    <>
      <BarraDetalle compartir={false} />
      <div className="col g7 pad detalle-scroll f1">
        <div className="col g4 items-inicio">
          <div className="row g2">
            <Badge tone="signal">En curso</Badge>
            <Badge tone="neutral" icon="link">Vinculada</Badge>
          </div>
          <span className="rutina-nombre">{RUTINA.nombre}</span>
          <div className="row g2">
            <AvatarBeam size={20} />
            <span className="t-label c-ter">La actualiza Bautista · cambió hace 2 días</span>
          </div>
        </div>
        {novedad ? (
          <div className="tarjeta tarjeta--activa col g3">
            <span className="t-label c-acc">Novedades · 21 oct</span>
            <span className="t-bodysm c-pri">Bautista cambió la rutina.</span>
            <div className="col g1">
              <span className="t-bodysm c-sec">Push · suma Fondos en paralelas</span>
              <span className="t-bodysm c-sec">Legs · el descanso pasa a 2:30</span>
            </div>
          </div>
        ) : null}
        <ListaDias editable={false} />
      </div>
      <div className="pie-acciones">
        <Button variant="secondary" size="lg" icon="copy" fullWidth>Hacer una copia editable</Button>
        <Button variant="danger" size="lg" icon="unlink" fullWidth>Dejar de seguirla</Button>
      </div>
    </>
  );
}

/* ---------- Dueno: con quien la compartio ---------- */
const PERSONAS = [
  { n: 'Lucía Ferreyra', d: 'Desde 12 oct · entrenó ayer' },
  { n: 'Martín Gómez', d: 'Desde 3 oct' },
  { n: 'Sofía Paz', d: 'Desde 28 sep' },
];
function HojaPersonas() {
  return (
    <Hoja cls="hoja--compartir">
      <div className="col g2">
        <span className="t-label c-ter">Original · vinculada</span>
        <span className="t-subtitle">Compartida con 3 personas</span>
        <span className="t-bodysm c-sec">Si dejás de compartirla con alguien, se queda con una copia de cómo estaba ese día.</span>
      </div>
      <div className="lista">
        {PERSONAS.map((p) => (
          <div key={p.n} className="lista__fila">
            <div className="row g3 f1">
              <AvatarBeam size={36} ring />
              <div className="col g1 f1"><span className="t-bodysm semi c-pri una-linea">{p.n}</span><span className="t-label c-ter">{p.d}</span></div>
            </div>
            <IconButton icon="x" variant="ghost" size="sm" aria-label={`Dejar de compartir con ${p.n}`} />
          </div>
        ))}
      </div>
      <div className="hoja__pie">
        <Button variant="secondary" size="lg" icon="link" fullWidth>Copiar el link otra vez</Button>
        <Button variant="danger" size="lg" icon="link-2-off" fullWidth>Dejar de compartir con todos</Button>
      </div>
    </Hoja>
  );
}

function App() {
  return (
    <Lienzo titulo="Compartir una rutina" bajada="Se comparte desde el detalle de cualquier rutina, en curso o archivada, con el icono de compartir arriba a la derecha. No es un wizard de pantalla completa: es una hoja de dos pasos (qué se comparte y el link) para no perder de vista la rutina. El link se manda por WhatsApp o cualquier otra app.">
      <Seccion titulo="Dónde está" nota="src/app/routine.tsx — Compartir vive en la barra del detalle, lejos de Editar y de Eliminar. Es el mismo lugar para la rutina en curso y para las archivadas.">
        <Mesa nombre="Rutina en curso" nota="El icono de compartir en la barra, a la derecha de Atrás." ruta="routine"><DetalleDueno /></Mesa>
        <Mesa nombre="Rutina archivada" nota="Igual que la en curso: compartir no depende del estado." ruta="routine"><DetalleDueno archivada /></Mesa>
      </Seccion>
      <Seccion titulo="La hoja de compartir" nota="routine · ShareSheet — dos pasos en la misma hoja. El primero arranca en Una copia: es la opción que no compromete a nadie. El link se crea recién al tocar Crear link.">
        <Mesa nombre="1 · Una copia" nota="Cada modo explica qué pasa después, no cómo funciona por dentro." ruta="routine · ShareSheet" capa={<HojaModo sel="copia" />}><DetalleDueno /></Mesa>
        <Mesa nombre="1 · La original" nota="Para el entrenador que ajusta el plan de su alumno: edita la suya y le llega al otro." ruta="routine · ShareSheet" capa={<HojaModo sel="original" />}><DetalleDueno /></Mesa>
        <Mesa nombre="2 · Link de una copia" nota="Vista previa de lo que se manda, el link para copiar y WhatsApp como acción principal. Otras apps abre la hoja nativa del sistema." ruta="routine · ShareSheet" capa={<HojaLink modo="copia" />}><DetalleDueno /></Mesa>
        <Mesa nombre="2 · Link de la original" nota="El rótulo arriba a la derecha recuerda qué se está compartiendo antes de mandarlo." ruta="routine · ShareSheet" capa={<HojaLink modo="original" />}><DetalleDueno /></Mesa>
        <Mesa nombre="Link copiado" ruta="routine · toast" capa={<><HojaLink modo="copia" /><Toast texto="Link copiado" /></>}><DetalleDueno /></Mesa>
      </Seccion>
      <Seccion titulo="Quien recibe el link" nota="shared/[codigo] — el link abre la app en esta vista previa (sin app, la web manda a la tienda y vuelve acá después de entrar). Nada se agrega hasta tocar Agregar a mis rutinas.">
        <Mesa nombre="Vista previa · copia" nota="Quién la manda, qué es y sus días. Ponerla en curso viene prendido si no tiene ninguna en curso." ruta="shared/[codigo]" intensidad="pleno"><Recibir modo="copia" /></Mesa>
        <Mesa nombre="Vista previa · vinculada" nota="Se avisa antes de aceptar que la va a editar otra persona." ruta="shared/[codigo]" intensidad="pleno"><Recibir modo="original" /></Mesa>
        <Mesa nombre="Ya tiene una en curso" nota="No es destructivo: la actual pasa a Anteriores con su historial. Por eso la acción va en primario, no en carmín." ruta="shared/[codigo] · alerta" intensidad="pleno" capa={<DialogoReemplazar />}><Recibir modo="copia" /></Mesa>
        <Mesa nombre="Link vencido o revocado" ruta="shared/[codigo]" intensidad="pleno"><LinkCaido /></Mesa>
      </Seccion>
      <Seccion titulo="Rutina vinculada" nota="routine — lo que ve quien sigue una original. Entrena y registra como siempre; lo único que no puede es editar el plan. Una sesión que ya empezó sigue con la versión con la que arrancó.">
        <Mesa nombre="Detalle de una vinculada" nota="Sin Editar ni Compartir. Hacer una copia editable la desvincula y la vuelve suya." ruta="routine"><DetalleVinculada /></Mesa>
        <Mesa nombre="Con cambios nuevos" nota="La primera vez que entra después de un cambio, una tarjeta con filo de lume dice qué cambió." ruta="routine"><DetalleVinculada novedad /></Mesa>
      </Seccion>
      <Seccion titulo="Quien comparte la original" nota="routine — el dueño ve con quién la comparte y puede cortar el vínculo de a uno o con todos.">
        <Mesa nombre="Detalle compartido" nota="Una fila bajo el nombre dice con cuántos está vinculada." ruta="routine"><DetalleDueno compartida /></Mesa>
        <Mesa nombre="Con quién la compartiste" nota="Al quitar a alguien, esa persona no pierde la rutina: se queda con una copia." ruta="routine · ShareSheet" capa={<HojaPersonas />}><DetalleDueno compartida /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
