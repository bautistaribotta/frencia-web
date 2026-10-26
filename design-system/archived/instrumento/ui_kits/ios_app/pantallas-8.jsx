// Frencia · Pantallas - 8 Perfil: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, Switch, SegmentedControl } = DS;

/* ---------- src/app/(main)/profile.tsx ---------- */
function Ajuste({ titulo, sub, on }) {
  return (
    <div className="lista__fila">
      <div className="col g1 f1"><span className="t-bodysm semi c-pri">{titulo}</span><span className="t-bodysm t-sub c-ter">{sub}</span></div>
      <Switch checked={on} />
    </div>
  );
}
function Perfil({ rpe, lb, ft, mi, tema = 'system', abajo, ocupado }) {
  const subTema = { system: 'Sigue al tema del teléfono', dark: 'Siempre oscuro', light: 'Siempre claro' }[tema];
  return (
    <div className="tab-scroll">
      <div className={`col g7${abajo ? ' perfil--abajo' : ''}`}>
        <div className="titulo-fila"><span className="t-title">Perfil</span></div>
        <div className="tarjeta tarjeta--usuario row g4">
          <div className="avatar-wrap">
            <AvatarBeam size={64} ring />
            <span className="avatar-badge"><Ico n="camera" s={13} /></span>
          </div>
          <div className="col g1 f1">
            <span className="t-subtitle">Bautista Ribotta</span>
            <span className="t-label c-ter">{ocupado ? 'Actualizando avatar...' : 'Tocá la foto para cambiarla'}</span>
          </div>
        </div>
        <Button variant="secondary" size="lg" icon="user" fullWidth>Editar perfil</Button>
        <div className="col g4">
          <span className="t-label c-ter etiqueta-bloque">Ajustes básicos</span>
          <div className="lista">
            <Ajuste titulo="Usar RIR / RPE" sub={rpe ? 'Midiendo con RPE' : 'Midiendo con RIR'} on={rpe} />
            <Ajuste titulo="Unidad de peso kg/lb" sub={lb ? 'En libras (lb)' : 'En kilogramos (kg)'} on={lb} />
            <Ajuste titulo="Unidad de altura cm/ft" sub={ft ? 'En pies y pulgadas (ft)' : 'En centímetros (cm)'} on={ft} />
            <Ajuste titulo="Unidad de distancia km/mi" sub={mi ? 'En millas (mi)' : 'En kilómetros (km)'} on={mi} />
            <div className="lista__fila lista__fila--apilada">
              <div className="col g1"><span className="t-bodysm semi c-pri">Tema</span><span className="t-bodysm t-sub c-ter">{subTema}</span></div>
              <SegmentedControl fullWidth value={tema} options={[{ value: 'system', label: 'Sistema' }, { value: 'dark', label: 'Oscuro' }, { value: 'light', label: 'Claro' }]} />
            </div>
          </div>
        </div>
        <div className="lista"><div className="lista__fila"><div className="row g4"><Ico n="settings" c="c-pri" /><span className="t-bodysm semi c-pri">Configuración</span></div><Ico n="chevron-right" c="c-ter" /></div></div>
        <div className="lista"><div className="lista__fila"><div className="row g4"><Ico n="log-out" c="c-dang" /><span className="t-bodysm semi c-dang">Cerrar sesión</span></div></div></div>
      </div>
    </div>
  );
}
function HojaFoto({ conFoto }) {
  return (
    <Hoja>
      <div className="hoja__vista"><AvatarBeam size={120} ring /></div>
      <span className="t-subtitle hoja__titulo">Foto de perfil</span>
      <Button variant="primary" size="lg" icon="repeat" fullWidth>Generar nuevo avatar</Button>
      <Button variant="secondary" size="lg" icon="camera" fullWidth>Subir una foto</Button>
      {conFoto ? <Button variant="ghost" size="lg" icon="x" fullWidth>Eliminar foto</Button> : null}
      <Button variant="ghost" size="md" fullWidth>Cancelar</Button>
    </Hoja>
  );
}

/* ---------- src/app/edit-profile.tsx ---------- */
function EditarPerfil({ sucio }) {
  return (
    <>
      <Volver cls="barra-volver--edit" />
      <div className="pad f1 editar-perfil">
        <div className="form">
          <span className="t-title form__titulo">Editar perfil</span>
          <span className="t-bodysm c-sec">Cambiá los datos de los campos para actualizarlos.</span>
          <div className="form__campos">
            <div className="col g3"><span className="t-label c-ter">Nombre</span><Campo icono="user" texto="Bautista" /></div>
            <div className="col g3"><span className="t-label c-ter">Apellido</span><Campo icono="user" texto="Ribotta" /></div>
            <div className="col g3">
              <span className="t-label c-ter">Sexo</span>
              <SegmentedControl fullWidth value="m" options={[{ value: 'm', label: 'Masculino' }, { value: 'f', label: 'Femenino' }, { value: 'o', label: 'Otro' }]} />
            </div>
            <CampoSelector label="Edad" icono="calendar" valor="25 años" />
            <CampoSelector label="Altura" icono="trending-up" valor="178 cm" />
            <CampoSelector label="Peso" icono="target" valor={sucio ? '74.5 kg' : '72.5 kg'} />
          </div>
          <Button variant="primary" size="lg" fullWidth iconRight="arrow-right" disabled={!sucio}>Guardar</Button>
          <Button variant="secondary" size="lg" fullWidth icon="x" className="editar-perfil__cancelar">Cancelar</Button>
        </div>
      </div>
    </>
  );
}
function HojaRueda({ tipo = 'peso' }) {
  const titulo = { edad: 'Tu edad', altura: 'Tu altura', peso: 'Tu peso' }[tipo];
  return (
    <Hoja cls="hoja--rueda">
      <span className="t-title center">{titulo}</span>
      <Medida tipo={tipo} />
      <Button variant="primary" size="lg" fullWidth>Listo</Button>
    </Hoja>
  );
}

/* ---------- src/app/settings.tsx ---------- */
function Configuracion() {
  return (
    <>
      <Volver cls="barra-volver--alta" />
      <div className="col g7 pad config-lista">
        <div className="titulo-fila"><span className="t-title">Configuración</span></div>
        <div className="col g3">
          <span className="t-label c-ter">Legal</span>
          <div className="lista">
            <div className="lista__fila"><div className="row g4"><Ico n="file-text" c="c-sec" /><span className="t-bodysm semi">Términos y Condiciones</span></div><Ico n="chevron-right" c="c-ter" /></div>
            <div className="lista__divisor"></div>
            <div className="lista__fila lista__fila--sin-borde"><div className="row g4"><Ico n="shield" c="c-sec" /><span className="t-bodysm semi">Política de Privacidad</span></div><Ico n="chevron-right" c="c-ter" /></div>
          </div>
        </div>
        <div className="lista"><div className="lista__fila"><div className="row g4"><Ico n="trash-2" c="c-dang" /><span className="t-bodysm semi c-dang">Eliminación de cuenta</span></div><Ico n="chevron-right" c="c-ter" /></div></div>
      </div>
    </>
  );
}
function AlertaEliminar({ paso }) {
  return paso === 2 ? (
    <Dialogo titulo="Cuenta programada para eliminarse" mensaje="Tu cuenta se eliminará el 10 de noviembre de 2026. Si cambiás de idea, iniciá sesión antes de esa fecha y vas a poder recuperarla con todos tus datos.">
      <Button variant="primary" size="lg" fullWidth>Entendido</Button>
    </Dialogo>
  ) : (
    <Dialogo titulo="Eliminar cuenta" mensaje="Tu cuenta y todos tus datos (rutinas, sesiones e historial) se eliminarán en 30 días. Hasta entonces podés recuperarla iniciando sesión. Después de esa fecha los datos no se pueden recuperar.">
      <Button variant="danger" size="lg" fullWidth>Eliminar cuenta</Button>
      <Button variant="secondary" size="lg" fullWidth>Cancelar</Button>
    </Dialogo>
  );
}

function App() {
  return (
    <Lienzo titulo="Perfil y configuración" bajada="El perfil es una pestaña: se llega desde la barra o tocando el saludo de Inicio. RIR / RPE, unidades y tema se guardan en la cuenta y se aplican en vivo en toda la app.">
      <Seccion titulo="Perfil" nota="src/app/(main)/profile.tsx — Configuración y Cerrar sesión en recuadros propios, el destructivo en carmín.">
        <Mesa nombre="Perfil" ruta="(main)/profile" tab="profile"><Perfil /></Mesa>
        <Mesa nombre="Ajustes activados" nota="RPE, libras y tema oscuro fijo." ruta="(main)/profile" tab="profile"><Perfil rpe lb mi tema="dark" /></Mesa>
        <Mesa nombre="Final del scroll" ruta="(main)/profile" tab="profile"><Perfil abajo /></Mesa>
        <Mesa nombre="Foto de perfil" nota="Sin foto, el avatar es generativo con la paleta de la app." ruta="(main)/profile" tab="profile" capa={<HojaFoto />}><Perfil /></Mesa>
      </Seccion>
      <Seccion titulo="Editar perfil" nota="src/app/edit-profile.tsx — ningún campo es obligatorio; edad, altura y peso abren la misma rueda del setup.">
        <Mesa nombre="Sin cambios" nota="Guardar se habilita solo cuando algo cambió." ruta="edit-profile"><EditarPerfil /></Mesa>
        <Mesa nombre="Rueda de peso" ruta="edit-profile · MeasurePicker" capa={<HojaRueda />}><EditarPerfil /></Mesa>
        <Mesa nombre="Con cambios" ruta="edit-profile"><EditarPerfil sucio /></Mesa>
        <Mesa nombre="Guardado" ruta="edit-profile · toast" capa={<Toast texto="Perfil actualizado" />}><Perfil /></Mesa>
      </Seccion>
      <Seccion titulo="Configuración" nota="src/app/settings.tsx — textos legales y eliminación de cuenta con dos confirmaciones y 30 días de gracia.">
        <Mesa nombre="Configuración" ruta="settings"><Configuracion /></Mesa>
        <Mesa nombre="Eliminar cuenta · confirmar" ruta="settings · alerta" capa={<AlertaEliminar />}><Configuracion /></Mesa>
        <Mesa nombre="Eliminar cuenta · programada" nota="No se puede descartar: al tocar Entendido se cierra la sesión." ruta="settings · alerta" capa={<AlertaEliminar paso={2} />}><Configuracion /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
