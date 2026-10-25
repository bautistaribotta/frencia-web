// Frencia Web · 8 Rutina compartida: /r/:codigo, pública y responsive.

function Autor() {
  return <div className="row g3"><Avatar s={36} /><div className="col"><span className="t-bodysm semi c-pri">Bautista Ribotta</span><span className="t-label c-ter">Te compartió esta rutina</span></div></div>;
}
function CabezaPublica({ movil, sesion }) {
  return (
    <header className={`w-publica__cabeza${movil ? ' w-publica__cabeza--movil' : ''}`}>
      <Marca />
      {movil ? <Boton t="sm" v="secondary" icoDer="arrow-up-right">Abrir en la app</Boton>
        : sesion ? <div className="row g3"><Boton v="ghost" ico="layers">Mis rutinas</Boton><Avatar s={32} /></div>
          : <div className="row g3"><Boton v="ghost">Entrar</Boton><Boton v="secondary">Crear cuenta</Boton></div>}
    </header>
  );
}
function DiasPublicos({ movil }) {
  return (
    <div className={movil ? 'col g3' : 'w-tres'}>
      {RUTINA.dias.map((d, i) => (
        <div key={d.n} className="w-tarjeta col g4">
          {movil ? (
            <div className="row entre"><div className="col g1"><span className="t-subtitle">{d.n}</span><span className="t-label c-ter">{d.ej.length} ejercicios</span></div><Ico n={i === 0 ? 'chevron-up' : 'chevron-down'} s={18} c="c-ter" /></div>
          ) : (
            <div className="col g3"><div className="row entre"><span className="t-subtitle">{d.n}</span><span className="t-label c-ter">{d.ej.length} ejercicios</span></div><Semana on={d.sem} /></div>
          )}
          {movil && i > 0 ? null : <div className="col">{d.ej.map((e, k) => <div key={e.n} className="w-ej-fila"><span className="w-ej__n">{String(k + 1).padStart(2, '0')}</span><div className="col g1 f1"><span className="t-bodysm semi una-linea">{e.n}</span><Res vol={e.vol} int={e.int} desc={e.desc} /></div></div>)}</div>}
        </div>
      ))}
    </div>
  );
}
function Tiendas() {
  return <div className="row g3"><Boton v="secondary" t="sm" ico="smartphone" className="f1">App Store</Boton><Boton v="secondary" t="sm" ico="smartphone" className="f1">Google Play</Boton></div>;
}
function Publica({ sesion, vinculada }) {
  return (
    <div className="w-publica">
      <CabezaPublica sesion={sesion} />
      <div className="w-publica__cuerpo">
        <div className="col g7">
          <Autor />
          <div className="col g4 items-inicio">
            <Badge ico={vinculada ? 'link' : 'copy'}>{vinculada ? 'Vinculada' : 'Copia'}</Badge>
            <span className="w-nombre-rutina">Push Pull Legs</span>
            <span className="t-data c-sec">3 días · 18 ejercicios</span>
          </div>
          {vinculada ? <div className="w-aviso-vinculo"><Ico n="link" s={18} /><span className="t-bodysm c-sec"><span className="c-pri semi">Bautista la actualiza.</span> Vas a ver sus cambios apenas los haga. La entrenás y registrás tus series, pero no la podés editar.</span></div> : null}
          <DiasPublicos />
        </div>
        <aside className="w-tarjeta w-tarjeta--elevada col g5 w-publica__cta">
          {sesion ? (
            <>
              <span className="t-subtitle">Agregala a tus rutinas</span>
              <div className="row g4"><div className="col g1 f1"><span className="t-bodysm semi">Ponerla en curso</span><span className="t-bodysm c-ter">Tu rutina actual, Fuerza 4 días, pasa a Anteriores.</span></div><Switch on /></div>
              <Boton t="lg" ancho ico="plus">Agregar a mis rutinas</Boton>
            </>
          ) : (
            <>
              <span className="t-subtitle">Entrenala con Frencia</span>
              <span className="t-bodysm c-sec">Creá tu cuenta gratis para agregar esta rutina y registrar cada serie desde el celular.</span>
              <Boton t="lg" ancho icoDer="arrow-right">Crear cuenta y agregarla</Boton>
              <Boton v="ghost" ancho>Ya tengo cuenta</Boton>
              <div className="w-divisor"><i></i><span className="t-label c-ter">bajá la app</span><i></i></div>
              <Tiendas />
            </>
          )}
          <span className="row g2 t-label c-ter"><Ico n="clock" s={14} />El link vence el 31 de octubre</span>
        </aside>
      </div>
    </div>
  );
}
function PublicaMovil({ vencido }) {
  return (
    <div className="w-publica w-publica--movil">
      <CabezaPublica movil />
      {vencido ? (
        <div className="col g5 w-publica__movil-cuerpo w-publica__vencido">
          <div className="w-tarjeta w-tarjeta--punteada col g4 centro">
            <Ico n="link-2-off" s={26} c="c-ter" />
            <span className="t-subtitle">Este link ya no funciona</span>
            <span className="t-bodysm c-sec">Venció o quien te lo mandó dejó de compartir la rutina. Pedile uno nuevo.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="col g6 w-publica__movil-cuerpo">
            <Autor />
            <div className="col g3 items-inicio"><Badge ico="copy">Copia</Badge><span className="w-nombre-rutina w-nombre-rutina--movil">Push Pull Legs</span><span className="t-data c-sec">3 días · 18 ejercicios</span></div>
            <DiasPublicos movil />
          </div>
          <div className="w-publica__pie-movil">
            <Boton t="lg" ancho icoDer="arrow-up-right">Abrir en Frencia</Boton>
            <span className="t-bodysm c-sec">¿No tenés la app? <span className="c-acc semi">Descargala</span></span>
          </div>
        </>
      )}
    </div>
  );
}
function PublicaVencida() {
  return (
    <div className="w-publica">
      <CabezaPublica />
      <div className="w-centrada">
        <div className="w-tarjeta w-tarjeta--punteada col g5 centro w-publica__vencida">
          <Ico n="link-2-off" s={28} c="c-ter" />
          <span className="t-title">Este link ya no funciona</span>
          <span className="t-bodysm c-sec">Venció o quien te lo mandó dejó de compartir la rutina. Pedile uno nuevo.</span>
          <Boton v="secondary">Conocé Frencia</Boton>
        </div>
      </div>
    </div>
  );
}

function AppWeb() {
  return (
    <Lienzo titulo="Rutina compartida" bajada="La página pública de un link de compartir. No necesita sesión para verse y se rearma para el celular, porque la abre quien recibe el link por WhatsApp. En escritorio va con fondo flanco (la luz detrás de la tarjeta de acción); en el celular, cumbre.">
      <Seccion titulo="Escritorio" nota="/r/:codigo — los días completos a la izquierda y la acción en una tarjeta fija a la derecha.">
        <Mesa nombre="Sin sesión" nota="La acción principal crea la cuenta y vuelve acá con la rutina lista para agregar." ruta="/r/:codigo" fondo="flanco" url="frencia.app/r/K7Q2-PX9A"><Publica /></Mesa>
        <Mesa nombre="Con sesión · vinculada" nota="Con sesión iniciada se agrega en un clic; si es la original, se avisa antes que la edita otra persona." ruta="/r/:codigo" fondo="flanco" url="frencia.app/r/K7Q2-PX9A"><Publica sesion vinculada /></Mesa>
        <Mesa nombre="Link vencido o revocado" ruta="/r/:codigo" fondo="centro" url="frencia.app/r/K7Q2-PX9A"><PublicaVencida /></Mesa>
      </Seccion>
      <Seccion titulo="Celular" nota="Debajo de 768 px la página pasa a una columna con la acción fija abajo. Abrir en Frencia intenta el enlace universal de la app; si no está instalada, lleva a la tienda.">
        <Mesa nombre="Vista previa en el celular" movil ancho={390} alto={844} ruta="/r/:codigo · móvil" fondo="cumbre" url="frencia.app/r/K7Q2-PX9A"><PublicaMovil /></Mesa>
        <Mesa nombre="Vencido en el celular" movil ancho={390} alto={844} ruta="/r/:codigo · móvil" fondo="cumbre" url="frencia.app/r/K7Q2-PX9A"><PublicaMovil vencido /></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
