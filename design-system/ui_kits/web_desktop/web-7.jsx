// Frencia Web · 7 Perfil, editar perfil y configuración.

function Perfil({ capa, toast }) {
  return (
    <App activo="profile" capa={<>{capa}{toast ? <Toasts>{toast}</Toasts> : null}</>}>
      <Pagina>
        <Encabezado rotulo="Perfil" titulo="Bautista Ribotta" acciones={<Boton v="secondary" ico="pencil" anima>Editar perfil</Boton>} />
        <div className="w-dos">
          <div className="col g6">
            <div className="w-tarjeta row g6">
              <button className="w-avatar-editar" aria-label="Cambiar foto de perfil"><Avatar s={96} /><span className="w-avatar-editar__badge"><Ico n="camera" s={14} /></span></button>
              <div className="col g2 f1"><span className="t-subtitle">Bautista Ribotta</span><span className="t-bodysm c-sec">bauti@correo.com</span><span className="t-label c-ter">Miembro desde junio de 2026</span></div>
            </div>
            <div className="w-lista">
              {[['Sexo', 'Masculino'], ['Edad', '25 años · 14/03/2001'], ['Altura', '178 cm'], ['Peso', '72.5 kg']].map(([l, v]) => <div key={l} className="w-fila"><span className="t-bodysm c-sec f1">{l}</span><span className="t-data">{v}</span></div>)}
            </div>
          </div>
          <div className="col g5">
            <div className="w-lista"><div className="w-fila w-fila--link"><Ico n="settings" s={20} c="c-sec" /><span className="t-bodysm semi f1">Configuración</span><Ico n="chevron-right" s={18} c="c-ter" /></div><div className="w-fila w-fila--link"><Ico n="log-out" s={20} c="c-dang" /><span className="t-bodysm semi c-dang f1">Cerrar sesión</span></div></div>
          </div>
        </div>
      </Pagina>
    </App>
  );
}
function ModalFoto({ conFoto }) {
  return (
    <Modal chico titulo="Foto de perfil" texto="Sin foto, Frencia dibuja un avatar con los colores de la app.">
      <div className="row centro"><Avatar s={128} /></div>
      <div className="w-soltar"><Ico n="image-up" s={22} c="c-sec" /><span className="t-bodysm c-pri">Arrastrá una imagen o <span className="c-acc semi">elegila</span></span><span className="t-label c-ter">JPG o PNG · hasta 5 MB</span></div>
      <div className="w-modal__pie w-modal__pie--ancho"><Boton>Listo</Boton><Boton v="secondary" ico="repeat" anima>Generar otro avatar</Boton>{conFoto ? <Boton v="ghost" ico="x" className="w-entero">Quitar foto</Boton> : null}</div>
    </Modal>
  );
}

function EditarPerfil({ sucio, error }) {
  return (
    <App activo="profile">
      <Pagina>
        <div className="w-migas"><Boton v="ghost" t="sm" ico="chevron-left">Perfil</Boton></div>
        <Encabezado titulo="Editar perfil" sub="Ningún dato es obligatorio. Las unidades se cambian en Configuración." acciones={<><Boton v="ghost">Cancelar</Boton><Boton ico="check" estado={sucio ? undefined : 'off'}>Guardar</Boton></>} />
        <div className="w-form-perfil">
          <div className="w-tarjeta col g6">
            <span className="t-label c-ter">Datos</span>
            <div className="row g4"><Campo className="f1" rotulo="Nombre" ico="user" valor="Bautista" /><Campo className="f1" rotulo="Apellido" valor="Ribotta" /></div>
            <div className="col g3"><span className="t-label c-ter">Sexo</span><Seg ancho ops={[['m', 'Masculino'], ['f', 'Femenino'], ['o', 'Otro']]} sel="m" /></div>
            <div className="col g3"><span className="t-label c-ter">Fecha de nacimiento</span><Fecha d="14" m="03" a="2001" /></div>
          </div>
          <div className="w-tarjeta col g7">
            <span className="t-label c-ter">Medidas</span>
            <div className="col g3"><span className="t-label c-ter">Altura</span><Regla valor={178} unidad="cm" n={30} /></div>
            <div className="col g3"><span className="t-label c-ter">Peso</span><Arco valor={sucio ? 74.5 : 72.5} estado={sucio ? 'foco' : undefined} /></div>
            {error ? <span className="w-aviso"><Ico n="circle-alert" s={16} />El peso tiene que estar entre 30 y 300 kg.</span> : null}
          </div>
        </div>
      </Pagina>
    </App>
  );
}

function Configuracion({ capa, tema = 'system' }) {
  const sub = { system: 'Sigue al tema de tu computadora', dark: 'Siempre oscuro', light: 'Siempre claro' }[tema];
  return (
    <App activo="settings" capa={capa}>
      <Pagina>
        <Encabezado rotulo="Configuración" titulo="Configuración" sub="Se guarda en tu cuenta y se aplica también en la app." />
        <div className="w-ajustes">
          <span className="t-label c-ter">Apariencia</span>
          <div className="w-lista">
            <div className="w-fila"><div className="col g1 f1"><span className="t-bodysm semi">Tema</span><span className="t-bodysm c-ter">{sub}</span></div><Seg ops={[['system', 'Sistema', 'monitor'], ['dark', 'Oscuro', 'moon'], ['light', 'Claro', 'sun']]} sel={tema} /></div>
            <div className="w-fila"><div className="col g1 f1"><span className="t-bodysm semi">Reducir transparencia</span><span className="t-bodysm c-ter">Superficies opacas y luces más bajas. Se guarda en este navegador y arranca siguiendo al sistema.</span></div><Switch /></div>
          </div>
          <span className="t-label c-ter">Unidades / medidores</span>
          <div className="w-lista">
            <div className="w-fila"><span className="t-bodysm semi f1">Peso</span><Seg ops={[['kg', 'kg'], ['lb', 'lb']]} sel="kg" parejo /></div>
            <div className="w-fila"><span className="t-bodysm semi f1">Altura</span><Seg ops={[['cm', 'cm'], ['ft', 'ft']]} sel="cm" parejo /></div>
            <div className="w-fila"><span className="t-bodysm semi f1">Distancia</span><Seg ops={[['km', 'km'], ['mi', 'mi']]} sel="km" parejo /></div>
            <div className="w-fila"><div className="col g1 f1"><span className="t-bodysm semi">Esfuerzo</span><span className="t-bodysm c-ter">Lo que se propone al armar una rutina. Cada ejercicio puede cambiarlo.</span></div><Seg ops={[['rir', 'RIR'], ['rpe', 'RPE']]} sel="rir" parejo /></div>
          </div>
          <span className="t-label c-ter">Legal</span>
          <div className="w-lista">
            <div className="w-fila w-fila--link"><Ico n="file-text" s={20} c="c-sec" /><span className="t-bodysm semi f1">Términos y condiciones</span><Ico n="arrow-up-right" s={18} c="c-ter" /></div>
            <div className="w-fila w-fila--link"><Ico n="shield" s={20} c="c-sec" /><span className="t-bodysm semi f1">Política de privacidad</span><Ico n="arrow-up-right" s={18} c="c-ter" /></div>
          </div>
          <span className="t-label c-ter">Cuenta</span>
          <div className="w-lista">
            <div className="w-fila"><div className="col g1 f1"><span className="t-bodysm semi">Eliminar cuenta</span><span className="t-bodysm c-ter">Tus datos se borran a los 30 días. Hasta entonces podés recuperarla entrando.</span></div><Boton v="danger" t="sm" ico="trash-2">Eliminar cuenta</Boton></div>
          </div>
        </div>
      </Pagina>
    </App>
  );
}

function AppWeb() {
  return (
    <Lienzo titulo="Perfil y configuración" bajada="En la web el perfil se separa en dos: Perfil muestra quién sos (lo acumulado vive en el Historial); Configuración junta tema, unidades y medidores, legales y la cuenta. Todo se guarda en profiles y se aplica en vivo en la web y en la app. Fondo cumbre en todas.">
      <Seccion titulo="Perfil" nota="(main)/profile — se llega desde el usuario al pie de la navegación.">
        <Mesa nombre="Perfil" ruta="(main)/profile" url="frencia.app/perfil"><Perfil /></Mesa>
        <Mesa nombre="Foto de perfil" nota="La hoja de la app pasa a un modal con zona para soltar una imagen. Cada acción se guarda en el momento y la vista previa la refleja; Listo solo cierra." ruta="(main)/profile · modal" url="frencia.app/perfil"><Perfil capa={<ModalFoto />} /></Mesa>
        <Mesa nombre="Foto de perfil · con foto" nota="Con foto cargada suma Quitar foto, como la hoja de la app: vuelve al avatar generado." ruta="(main)/profile · modal" url="frencia.app/perfil"><Perfil capa={<ModalFoto conFoto />} /></Mesa>
      </Seccion>
      <Seccion titulo="Editar perfil" nota="edit-profile — la rueda de la app pasa a fecha, regla y arco en la misma página; nada se abre aparte.">
        <Mesa nombre="Sin cambios" nota="Guardar se habilita cuando algo cambió." ruta="edit-profile" url="frencia.app/perfil/editar"><EditarPerfil /></Mesa>
        <Mesa nombre="Con cambios y error de rango" nota="El aviso va en tinta, con icono; Guardar no confirma un valor fuera de rango." ruta="edit-profile" url="frencia.app/perfil/editar"><EditarPerfil sucio error /></Mesa>
        <Mesa nombre="Guardado" ruta="(main)/profile · toast" url="frencia.app/perfil"><Perfil toast={<Toast texto="Perfil actualizado" confirma />} /></Mesa>
      </Seccion>
      <Seccion titulo="Configuración" nota="settings — Sistema es el valor por defecto (profiles.tema = 'sistema'): la web sigue a prefers-color-scheme. Las tres unidades y el medidor de esfuerzo van en una sola lista, con los selectores del mismo ancho. Términos y privacidad abren el documento en el modal de lectura de Web · 3.">
        <Mesa nombre="Configuración" ruta="settings" url="frencia.app/configuracion"><Configuracion /></Mesa>
        <Mesa nombre="Eliminar cuenta · confirmar" nota="Dos pasos, como en la app. El foco arranca en Cancelar." ruta="settings · alerta" url="frencia.app/configuracion"><Configuracion capa={<Modal chico titulo="Eliminar cuenta" texto="Tu cuenta y todos tus datos (rutinas, sesiones e historial) se eliminan en 30 días. Hasta entonces podés recuperarla iniciando sesión. Después no se pueden recuperar." pie={<><Boton v="secondary" estado="foco">Cancelar</Boton><Boton v="danger" ico="trash-2">Eliminar cuenta</Boton></>} />} /></Mesa>
        <Mesa nombre="Eliminar cuenta · programada" nota="No se puede descartar: Entendido cierra la sesión." ruta="settings · alerta" url="frencia.app/configuracion"><Configuracion capa={<Modal chico titulo="Cuenta programada para eliminarse" texto="Se elimina el 23 de noviembre de 2026. Si cambiás de idea, entrá antes de esa fecha y vas a poder recuperarla con todos tus datos." pie={<Boton>Entendido</Boton>} />} /></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
