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

/* Editar perfil (web): una sola columna, como en el teléfono, pero con campos
   de texto comunes en lugar de rueda, regla y arco. Mismos campos flotantes
   que el acceso. Se guarda en profiles: name, surname, sexo, fecha_nacimiento,
   altura (cm) y peso (kg); la unidad que se ve sale de Configuración. */
function EditarPerfil({ caso }) {
  const sucio = caso === 'editando' || caso === 'error';
  const imperial = caso === 'imperial';
  const sufijo = (t) => <span className="w-campo__sufijo">{t}</span>;
  return (
    <App activo="profile">
      <Pagina>
        <div className="w-perfil-form">
          <div className="w-migas"><Boton v="ghost" t="sm" ico="chevron-left">Perfil</Boton></div>
          <div className="col g2"><span className="t-display">Editar perfil</span><span className="t-bodysm c-sec">Ningún dato es obligatorio. Las unidades se cambian en Configuración.</span></div>
          <div className="w-tarjeta col g5">
            <Campo flotante rotulo="Nombre" ico="user" valor="Bautista" />
            <Campo flotante rotulo="Apellido" ico="user" valor="Ribotta" />
            <div className="col g3"><span className="t-label c-ter">Sexo</span><Seg ancho ops={[['m', 'Masculino'], ['f', 'Femenino'], ['o', 'Otro']]} sel="m" /></div>
            <Campo flotante rotulo="Fecha de nacimiento" ico="calendar" valor="14/03/2001" ayuda="Tenés 25 años. Se escribe como día/mes/año." />
            {imperial ? (
              <div className="row g3 items-inicio">
                <Campo flotante className="f1" rotulo="Altura · pies" ico="ruler" valor="5" final={sufijo('ft')} />
                <Campo flotante className="f1" rotulo="Pulgadas" valor="10" final={sufijo('in')} />
              </div>
            ) : (
              <Campo flotante rotulo="Altura" ico="ruler" valor={caso === 'editando' ? '17' : '178'} estado={caso === 'editando' ? 'foco' : undefined} final={sufijo('cm')} ayuda={caso === 'editando' ? 'Entre 100 y 250 cm.' : undefined} />
            )}
            <Campo flotante rotulo="Peso" ico="weight" valor={caso === 'error' ? '725' : imperial ? '160' : '72.5'} final={sufijo(imperial ? 'lb' : 'kg')} error={caso === 'error' ? 'El peso tiene que estar entre 30 y 300 kg.' : undefined} />
          </div>
          <div className="col g3">
            <Boton t="lg" ancho ico="check" estado={caso === 'editando' ? undefined : 'off'}>Guardar</Boton>
            <Boton v="ghost" t="lg" ancho>Cancelar</Boton>
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
      <Seccion titulo="Editar perfil" nota="edit-profile — una sola columna, como en el teléfono, con campos de texto comunes: nombre, apellido, fecha de nacimiento, altura y peso se escriben; sexo queda como selector de tres opciones. La unidad (cm o ft, kg o lb) sale de Configuración y va como sufijo adentro del campo. Guardar abajo, a lo ancho.">
        <Mesa nombre="Sin cambios" nota="Guardar se habilita cuando algo cambió." ruta="edit-profile" url="frencia.app/perfil/editar"><EditarPerfil /></Mesa>
        <Mesa nombre="Escribiendo la altura" nota="Solo números; el rango se muestra debajo mientras el campo tiene foco." ruta="edit-profile" url="frencia.app/perfil/editar"><EditarPerfil caso="editando" /></Mesa>
        <Mesa nombre="Valor fuera de rango" nota="El error va debajo del campo en el carmín de texto y Guardar no deja confirmar." ruta="edit-profile" url="frencia.app/perfil/editar"><EditarPerfil caso="error" /></Mesa>
        <Mesa nombre="En pies y libras" nota="Con altura en ft, el campo se parte en pies y pulgadas en la misma fila. Siempre se guarda en cm y kg." ruta="edit-profile" url="frencia.app/perfil/editar"><EditarPerfil caso="imperial" /></Mesa>
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
