// Frencia · Pantallas - 1 Acceso: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button } = DS;

/* La marca es el icono de la app tal cual, en su version clara u oscura */
function Marca() {
  return (
    <div className="marca">
      <IconoApp size={64} />
      <span className="t-label marca__lema">Cada serie cuenta</span>
    </div>
  );
}

function AvisoTerminos() {
  return (
    <p className="t-bodysm c-ter center">
      Al continuar, aceptás los <span className="semi c-acc">Términos y Condiciones</span> y la{' '}
      <span className="semi c-acc">Política de Privacidad</span> de Frencia.
    </p>
  );
}

function Ojo() { return <Ico n="eye" c="c-ter" />; }

function Login({ email, pass, foco, error }) {
  const listo = email && pass;
  return (
    <div className="auth">
      <Marca />
      <div className="form">
        <span className="t-title form__titulo">Entrá a tu cuenta</span>
        <span className="t-bodysm c-sec">Seguí registrando cada serie donde la dejaste.</span>
        <div className="form__campos">
          <Campo icono="mail" ph="Correo electrónico" texto={email} foco={foco === 'mail'} />
          <Campo icono="lock" ph="Contraseña" texto={pass} foco={foco === 'pass'} final={<Ojo />} />
        </div>
        <span className="t-bodysm c-acc form__olvido">¿Olvidaste tu contraseña?</span>
        <Button variant="primary" size="lg" fullWidth iconRight="arrow-right" disabled={!listo}>Ingresar</Button>
        {error ? <span className="t-bodysm c-dang">{error}</span> : null}
        <div className="divisor"><div className="divisor__linea"></div><span className="t-label c-ter">o continuá con</span><div className="divisor__linea"></div></div>
        <div className="social"><BotonSocial proveedor="apple" /><BotonSocial proveedor="google" /></div>
        <AvisoTerminos />
      </div>
      <div className="pie-enlace"><span className="t-bodysm c-sec">¿No tenés cuenta?&nbsp;</span><span className="t-bodysm semi c-acc">Creá una</span></div>
    </div>
  );
}

function Registro({ lleno, noCoinciden, tomado }) {
  return (
    <div className="auth">
      <Marca />
      <div className="form">
        <span className="t-title form__titulo">Creá tu cuenta</span>
        <span className="t-bodysm c-sec">Empezá a registrar cada serie desde hoy.</span>
        <div className="form__campos">
          <Campo icono="user" ph="Nombre" texto={lleno ? 'Bautista' : ''} />
          <Campo icono="mail" ph="Correo electrónico" texto={lleno ? 'bauti@correo.com' : ''} />
          <Campo icono="lock" ph="Contraseña" texto={lleno ? '••••••••' : ''} final={<Ojo />} />
          <Campo icono="lock" ph="Repetí la contraseña" texto={lleno ? (noCoinciden ? '•••••••' : '••••••••') : ''} foco={noCoinciden} />
        </div>
        {noCoinciden ? <span className="t-bodysm c-dang">Las contraseñas no coinciden.</span> : null}
        {tomado ? <span className="t-bodysm c-dang">Email ya registrado.</span> : null}
        {tomado ? <span className="t-bodysm c-acc">¿Olvidaste tu contraseña?</span> : null}
        <Button variant="primary" size="lg" fullWidth iconRight="arrow-right" disabled={!lleno || noCoinciden}>Crear cuenta</Button>
        <div className="divisor"><div className="divisor__linea"></div><span className="t-label c-ter">o registrate con</span><div className="divisor__linea"></div></div>
        <div className="social"><BotonSocial proveedor="apple" /><BotonSocial proveedor="google" /></div>
        <AvisoTerminos />
      </div>
      <div className="pie-enlace"><span className="t-bodysm c-sec">¿Ya tenés cuenta?&nbsp;</span><span className="t-bodysm semi c-acc">Iniciá sesión</span></div>
    </div>
  );
}

function Recuperar({ enviado }) {
  return (
    <div className="auth relativo">
      <div className="olvido-atras"><Button variant="ghost" size="sm" icon="chevron-left">Atrás</Button></div>
      <div className="row"><div className="marca__sello"><Ico n={enviado ? 'mail-check' : 'key-round'} s={26} /></div></div>
      {enviado ? (
        <div className="form">
          <span className="t-title form__titulo">Revisá tu correo</span>
          <span className="t-bodysm c-sec">
            Te enviamos un enlace a <span className="semi c-pri">bauti@correo.com</span> para que elijas una contraseña nueva. Si no lo ves, mirá en spam.
          </span>
          <Button variant="primary" size="lg" fullWidth iconRight="arrow-right">Volver al inicio de sesión</Button>
          <div className="pie-enlace"><span className="t-bodysm c-sec">¿No te llegó?&nbsp;</span><span className="t-bodysm semi c-acc">Reenviar</span></div>
        </div>
      ) : (
        <div className="form">
          <span className="t-title form__titulo">Recuperá tu contraseña</span>
          <span className="t-bodysm c-sec">Escribí tu correo y te enviamos un enlace para elegir una nueva.</span>
          <div className="form__campos"><Campo icono="mail" ph="Correo electrónico" texto="bauti@correo.com" foco /></div>
          <Button variant="primary" size="lg" fullWidth iconRight="arrow-right">Enviar enlace</Button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Lienzo titulo="Acceso" bajada="Las tres pantallas sin sesión. Mismo esqueleto: el icono de la app como marca, el formulario alineado a la izquierda, el campo en foco con borde de acero y Apple / Google como secundarios delineados.">
      <Seccion titulo="Login" nota="src/app/(auth)/login.tsx">
        <Mesa nombre="Login · vacío" nota="Ingresar queda deshabilitado hasta tener correo y una contraseña de 6 o más." ruta="(auth)/login"><Login /></Mesa>
        <Mesa nombre="Login · escribiendo" nota="El campo enfocado toma el borde de acero; nada más cambia de color." ruta="(auth)/login"><Login email="bauti@correo.com" pass="••••••" foco="pass" /></Mesa>
        <Mesa nombre="Login · credenciales inválidas" nota="El error va debajo del botón, en el carmín de texto." ruta="(auth)/login"><Login email="bauti@correo.com" pass="••••••••" error="Correo o contraseña incorrectos." /></Mesa>
      </Seccion>
      <Seccion titulo="Registro" nota="src/app/(auth)/register.tsx — espeja el login">
        <Mesa nombre="Registro · vacío" ruta="(auth)/register"><Registro /></Mesa>
        <Mesa nombre="Registro · contraseñas distintas" ruta="(auth)/register"><Registro lleno noCoinciden /></Mesa>
        <Mesa nombre="Registro · email ya registrado" nota="Ofrece recuperar la contraseña en el mismo lugar." ruta="(auth)/register"><Registro lleno tomado /></Mesa>
      </Seccion>
      <Seccion titulo="Recuperar contraseña" nota="src/app/(auth)/forgot-password.tsx">
        <Mesa nombre="Pedir el enlace" ruta="(auth)/forgot-password"><Recuperar /></Mesa>
        <Mesa nombre="Enlace enviado" nota="El formulario se reemplaza por el aviso; el icono del sello pasa a correo enviado." ruta="(auth)/forgot-password"><Recuperar enviado /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
