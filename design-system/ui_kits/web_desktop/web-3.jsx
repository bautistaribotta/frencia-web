// Frencia Web · 3 Acceso y primer ingreso.

function LogoGoogle() {
  return (
    <svg className="w-logo" viewBox="0 0 24 24" aria-hidden="true">
      <path className="g-a" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path className="g-v" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path className="g-m" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path className="g-r" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
function LogoApple() {
  return <svg className="w-logo w-logo--apple" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.21 1.11-.05 1.53-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.15.85-1.23 1.19-2.43 1.21-2.49-.03-.01-2.31-.89-2.34-3.53zM14.19 6.14c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.55.64-1.05 1.69-.92 2.68.98.08 1.97-.49 2.58-1.23z" /></svg>;
}
/* Apple y Google. Al tocar uno, ese muestra la ruedita en lugar del logo y el otro queda
   apagado hasta que el navegador sale hacia el proveedor. */
function Sociales({ cargando }) {
  const boton = (id, Logo, nombre) => {
    const carga = cargando === id;
    return (
      <button className={`w-btn w-btn--secondary w-btn--md f1${carga ? ' is-cargando' : ''}`} disabled={!!cargando && !carga} aria-busy={carga || undefined}>
        {carga ? <Ruedita /> : <Logo />}<span>{nombre}</span>
      </button>
    );
  };
  return (
    <>
      <div className="w-divisor"><i></i><span className="t-label c-ter">o continuá con</span><i></i></div>
      <div className="row g3">{boton('apple', LogoApple, 'Apple')}{boton('google', LogoGoogle, 'Google')}</div>
    </>
  );
}

/* Esqueleto del acceso: formulario en vidrio a la izquierda, el lema grande
   sobre la luz a la derecha (fondo flanco, anima). */
/* Variante billete: la foto grabada en líneas (talla dulce + guilloché) a la
   derecha, en un marco con microtexto, número de serie y sello, como un billete. */
const MICRO = 'CADA SERIE CUENTA · FRENCIA · REGISTRÁ CADA SERIE · RIR · RPE · AMRAP · 1RM · TONELAJE · '.repeat(8);
function Billete() {
  return (
    <div className="w-billete" aria-hidden="true">
      <div className="w-billete__img"></div>
      <span className="w-billete__micro w-billete__micro--arriba">{MICRO}</span>
      <span className="w-billete__micro w-billete__micro--abajo">{MICRO}</span>
      <div className="w-billete__serie"><span>Nº FR 0001240</span><span>SERIE A</span></div>
      <div className="w-billete__cartela">
        <Marca />
        <span className="w-billete__sello">PESO MUERTO · 140 KG × 5 · RIR 2</span>
      </div>
      <span className="w-billete__credito">Foto: Serjan Midili · Unsplash</span>
    </div>
  );
}

/* Switch de tema del acceso: sol, interruptor y luna. Encendido = oscuro.
   En la variante billete reemplaza a la marca arriba, del lado del formulario
   (la marca pasa a la cartela del billete). */
/* Propuestas para cambiar el tema en el acceso (forma):
   - 'boton': un boton de icono en vidrio con el icono del tema actual (luna en
     oscuro, sol en claro). Un clic alterna; el tooltip dice a que modo pasa.
   - 'seg': segmentado chico de solo iconos, Sistema · Oscuro · Claro, el
     mismo modelo que Configuracion (vuelve a seguir a la compu con Sistema).
   Sin forma: el switch actual. */
function SwitchTema({ forma, estado }) {
  const oscuro = React.useContext(TemaCtx) === 'dark';
  if (forma === 'boton') {
    return (
      <div className="w-acceso__tema">
        <BotonIco ico={oscuro ? 'moon' : 'sun'} v="surface" anima estado={estado} tip={oscuro ? 'Pasar a modo claro' : 'Pasar a modo oscuro'} tipLado="abajo" label={oscuro ? 'Pasar a modo claro' : 'Pasar a modo oscuro'} />
      </div>
    );
  }
  if (forma === 'seg') {
    return (
      <div className="w-acceso__tema">
        <Seg ops={[['system', '', 'monitor'], ['dark', '', 'moon'], ['light', '', 'sun']]} sel={oscuro ? 'dark' : 'light'} estados={estado === 'hover' ? { system: 'hover' } : {}} />
      </div>
    );
  }
  return (
    <div className="w-acceso__tema">
      <span className={oscuro ? 'c-ter' : 'c-pri'}><Ico n="sun" s={18} /></span>
      <Switch on={oscuro} />
      <span className={oscuro ? 'c-pri' : 'c-ter'}><Ico n="moon" s={18} /></span>
    </div>
  );
}

function Acceso({ children, lema = true, variante, tema, temaEstado }) {
  if (variante === 'billete' || variante === 'billete-izq') {
    // Signup: formulario a la izquierda y billete a la derecha.
    // Login ("al revés"): billete a la izquierda y formulario a la derecha.
    const izq = variante === 'billete-izq';
    const form = (
      <div className="w-acceso__izq">
        <SwitchTema forma={tema} estado={temaEstado} />
        <div className="w-acceso__form w-tarjeta">{children}</div>
        <span className="t-bodysm c-ter">Al continuar, aceptás los <span className="c-acc semi">Términos y condiciones</span> y la <span className="c-acc semi">Política de privacidad</span>.</span>
      </div>
    );
    return (
      <div className={`w-acceso w-acceso--billete${izq ? ' w-acceso--billete-izq' : ''}`}>
        {izq ? <><Billete />{form}</> : <>{form}<Billete /></>}
      </div>
    );
  }
  return (
    <div className="w-acceso">
      <div className="w-acceso__izq">
        <Marca />
        <div className="w-acceso__form w-tarjeta">{children}</div>
        <span className="t-bodysm c-ter">Al continuar, aceptás los <span className="c-acc semi">Términos y condiciones</span> y la <span className="c-acc semi">Política de privacidad</span>.</span>
      </div>
      {lema ? (
        <div className="w-acceso__der">
          <span className="w-lema">Cada serie<br />cuenta.</span>
          <span className="t-body c-sec w-lema__sub">Planificá tus rutinas en la pantalla grande y revisá todo lo que hiciste. El entrenamiento se registra en el celular.</span>
        </div>
      ) : null}
    </div>
  );
}

function Login({ email, pass, foco, error, enviando, variante, tema, temaEstado, social }) {
  const listo = email && pass;
  return (
    <Acceso variante={variante} tema={tema} temaEstado={temaEstado}>
      <div className="col g2"><span className="t-title">Entrá a tu cuenta</span><span className="t-bodysm c-sec">Seguí donde la dejaste.</span></div>
      <div className="col g4">
        <Campo flotante rotulo="Correo electrónico" ico="mail" valor={email} estado={foco === 'mail' ? 'foco' : enviando ? 'off' : undefined} />
        <Campo flotante rotulo="Contraseña" extra="¿La olvidaste?" ico="lock" valor={pass} estado={foco === 'pass' ? 'foco' : enviando ? 'off' : undefined} error={error} final={<BotonIco ico="eye" t="sm" label="Mostrar contraseña" />} />
      </div>
      <Boton t="lg" ancho icoDer={enviando ? undefined : 'arrow-right'} estado={enviando ? 'cargando' : listo ? (foco === 'pass' ? undefined : undefined) : 'off'}>{enviando ? 'Ingresando…' : 'Ingresar'}</Boton>
      {foco === 'pass' ? <span className="row centro g2 t-bodysm c-ter"><Kbd>Enter</Kbd>para ingresar</span> : null}
      <Sociales cargando={social} />
      <span className="t-bodysm c-sec w-acceso__pie">¿No tenés cuenta? <span className="c-acc semi">Creá una</span></span>
    </Acceso>
  );
}
function Signup({ caso, variante }) {
  return (
    <Acceso variante={variante}>
      <div className="col g2"><span className="t-title">Creá tu cuenta</span><span className="t-bodysm c-sec">Empezá a registrar cada serie desde hoy.</span></div>
      <div className="col g4">
        <div className="row g3"><Campo flotante className="f1" rotulo="Nombre" ico="user" valor={caso === 'vacio' ? '' : 'Bautista'} estado={caso === 'vacio' ? 'foco' : undefined} /><Campo flotante className="f1" rotulo="Apellido" ico="user" valor={caso === 'vacio' ? '' : 'Ribotta'} /></div>
        <Campo flotante rotulo="Correo electrónico" ico="mail" valor={caso === 'vacio' ? '' : 'bauti@correo.com'} error={caso === 'tomado' ? 'Este correo ya tiene una cuenta.' : null} />
        <Campo flotante rotulo="Contraseña" ico="lock" valor={caso === 'vacio' ? '' : '••••••••'} ayuda="6 caracteres o más." />
        <Campo flotante rotulo="Repetí la contraseña" ico="lock" valor={caso === 'vacio' ? '' : caso === 'distintas' ? '•••••••' : '••••••••'} estado={caso === 'distintas' ? 'foco' : undefined} error={caso === 'distintas' ? 'Las contraseñas no coinciden.' : null} />
      </div>
      {caso === 'tomado' ? <span className="t-bodysm c-sec">¿Es tuya? <span className="c-acc semi">Entrá</span> o <span className="c-acc semi">recuperá la contraseña</span>.</span> : null}
      <Boton t="lg" ancho icoDer="arrow-right" estado={caso === 'distintas' || caso === 'vacio' ? 'off' : undefined}>Crear cuenta</Boton>
      <Sociales />
      <span className="t-bodysm c-sec w-acceso__pie">¿Ya tenés cuenta? <span className="c-acc semi">Iniciá sesión</span></span>
    </Acceso>
  );
}
function Recuperar({ enviado }) {
  return (
    <Acceso variante="billete-izq">
      <Boton v="ghost" t="sm" ico="arrow-left" className="w-alinear-izq">Volver a iniciar sesión</Boton>
      <span className="w-sello-ico"><Ico n={enviado ? 'mail-check' : 'key-round'} s={26} confirma={enviado} /></span>
      {enviado ? (
        <>
          <div className="col g3"><span className="t-title">Revisá tu correo</span><span className="t-bodysm c-sec">Te mandamos un enlace a <span className="c-pri semi">bauti@correo.com</span> para elegir una contraseña nueva. Si no lo ves, mirá en spam.</span></div>
          <Boton v="secondary" t="lg" ancho ico="rotate-ccw" anima>Reenviar en 0:42</Boton>
        </>
      ) : (
        <>
          <div className="col g3"><span className="t-title">Recuperá tu contraseña</span><span className="t-bodysm c-sec">Escribí tu correo y te mandamos un enlace para elegir una nueva.</span></div>
          <Campo flotante rotulo="Correo electrónico" ico="mail" valor="bauti@correo.com" estado="foco" />
          <Boton t="lg" ancho icoDer="arrow-right">Enviar enlace</Boton>
        </>
      )}
    </Acceso>
  );
}
function NuevaContrasena({ caso }) {
  if (caso === 'vencido') {
    return (
      <Acceso variante="billete-izq">
        <span className="w-sello-ico"><Ico n="link-2-off" s={26} /></span>
        <div className="col g3"><span className="t-title">El enlace venció</span><span className="t-bodysm c-sec">Los enlaces para cambiar la contraseña duran una hora y sirven una sola vez. Pedí uno nuevo.</span></div>
        <Boton t="lg" ancho icoDer="arrow-right">Pedir otro enlace</Boton>
      </Acceso>
    );
  }
  const req = [['6 caracteres o más', true], ['Las dos coinciden', caso !== 'distintas']];
  return (
    <Acceso variante="billete-izq">
      <div className="col g2"><span className="t-title">Elegí una contraseña nueva</span><span className="t-bodysm c-sec">Para bauti@correo.com</span></div>
      <div className="col g4">
        <Campo flotante rotulo="Contraseña nueva" ico="lock" valor="••••••••" final={<BotonIco ico="eye" t="sm" label="Mostrar contraseña" />} />
        <Campo flotante rotulo="Repetila" ico="lock" valor="••••••••" estado={caso === 'guardando' ? 'off' : 'foco'} error={caso === 'igual' ? 'Tiene que ser distinta de la que tenías.' : undefined} />
      </div>
      <div className="col g2">{req.map(([t, ok]) => <span key={t} className={`row g2 t-bodysm ${ok ? 'c-pri' : 'c-ter'}`}><Ico n={ok ? 'check' : 'circle'} s={16} c={ok ? 'c-acc' : ''} />{t}</span>)}</div>
      <Boton t="lg" ancho ico={caso === 'guardando' ? undefined : 'check'} estado={caso === 'guardando' ? 'cargando' : undefined}>{caso === 'guardando' ? 'Guardando…' : 'Guardar y entrar'}</Boton>
    </Acceso>
  );
}

/* Términos y privacidad: el gate antes de la app */
function Consentimiento({ leidos = [] }) {
  const docs = [['t', 'Términos y condiciones'], ['p', 'Política de privacidad']];
  const ambos = leidos.length === 2;
  return (
    <div className="w-centrada">
      <div className="w-tarjeta w-centrada__caja col g7">
        <Marca />
        <div className="col g3"><span className="t-label c-ter">Antes de empezar</span><span className="t-display">Términos y privacidad</span><span className="t-bodysm c-sec">Para usar Frencia necesitás leer y aceptar los dos documentos. Cada uno se marca al llegar al final.</span></div>
        <div className="w-lista">
          {docs.map(([id, t], i) => {
            const ok = leidos.includes(id);
            return (
              <div key={id} className={`w-fila w-fila--link${!ok && i === leidos.length ? ' is-hover' : ''}`}>
                <Check on={ok} />
                <div className="col g1 f1"><span className="t-bodysm semi c-pri">{t}</span><span className={`t-label ${ok ? 'c-acc' : 'c-ter'}`}>{ok ? 'Leído' : 'Vigente desde el 30 de septiembre de 2026'}</span></div>
                <Boton v="ghost" t="sm" icoDer="arrow-up-right">{ok ? 'Volver a leer' : 'Leer'}</Boton>
              </div>
            );
          })}
        </div>
        <div className="row entre g4">
          <Boton v="ghost" t="sm" ico="log-out">Cerrar sesión</Boton>
          <Boton t="lg" ico="check" estado={ambos ? undefined : 'off'}>Aceptar y continuar</Boton>
        </div>
      </div>
    </div>
  );
}
function DocumentoLegal() {
  return (
    <>
      <Consentimiento leidos={[]} />
      <div className="w-velo">
        <div className="w-modal w-modal--doc" role="dialog" aria-modal="true">
          <div className="w-modal__cabeza"><div className="col g2 f1"><span className="t-title">Términos y condiciones</span><span className="t-label c-ter">Última actualización · 30 de septiembre de 2026</span></div><BotonIco ico="x" label="Cerrar" /></div>
          <div className="w-doc">
            <span className="t-subtitle">1. Aceptación</span>
            <span className="t-body c-sec">Estos Términos y condiciones regulan el uso de Frencia, en la app y en la web. Para usar Frencia tenés que aceptarlos de forma expresa, junto con la Política de privacidad.</span>
            <span className="t-subtitle">3. Qué es Frencia</span>
            <span className="t-body c-sec">Frencia es una herramienta para registrar entrenamientos de fuerza, de cardio e isométricos. Te permite cargar y organizar tus rutinas, consultar tu historial, tu racha y tu progreso, y consultar un catálogo de ejercicios.</span>
            <span className="t-subtitle">4. Tu cuenta</span>
            <span className="t-body c-sec">La cuenta es personal. Sos responsable de mantener la confidencialidad de tu contraseña y de la actividad que ocurra con ella.</span>
          </div>
          <div className="row entre g4"><div className="w-progreso-lectura"><span></span></div><span className="t-label c-ter">Leído 64 %</span></div>
        </div>
      </div>
    </>
  );
}

/* Textos legales publicos: /terminos y /privacidad, sin sesion, para los links de Google,
   Apple y las tiendas. Mismo texto que el modal de lectura. */
const LEGAL = {
  t: ['Términos y condiciones', [
    ['1. Aceptación', ['Estos Términos y condiciones regulan el uso de Frencia, en la app y en la web. Para usar Frencia tenés que aceptarlos de forma expresa, junto con la Política de privacidad.']],
    ['3. Qué es Frencia', ['Frencia es una herramienta para registrar entrenamientos de fuerza, de cardio e isométricos. Te permite cargar y organizar tus rutinas, consultar tu historial, tu racha y tu progreso, y consultar un catálogo de ejercicios.']],
    ['4. Tu cuenta', ['La cuenta es personal. Sos responsable de mantener la confidencialidad de tu contraseña y de la actividad que ocurra con ella.']],
  ]],
  p: ['Política de privacidad', [
    ['1. Quién es responsable de tus datos', ['El responsable de la base de datos y del tratamiento de tus datos personales es Bautista Ribotta, con domicilio en la ciudad de Córdoba, República Argentina.']],
    ['2. Qué datos recolectamos', ['Datos de tu cuenta:', ['Nombre y apellido.', 'Correo electrónico.', 'Contraseña, que se guarda cifrada.']]],
  ]],
};
function CabezaLegal({ sesion, movil }) {
  return (
    <header className={`w-publica__cabeza${movil ? ' w-publica__cabeza--movil' : ''}`}>
      <Marca />
      {sesion
        ? <Boton v="secondary" t={movil ? 'sm' : 'md'} icoDer="arrow-right">Ir a Frencia</Boton>
        : movil ? <Boton v="ghost" t="sm">Entrar</Boton> : <div className="row g3"><Boton v="ghost">Entrar</Boton><Boton v="secondary">Crear cuenta</Boton></div>}
    </header>
  );
}
function LegalPublica({ doc = 't', sesion, movil }) {
  const [titulo, secciones] = LEGAL[doc];
  return (
    <div className="w-publica">
      <CabezaLegal sesion={sesion} movil={movil} />
      <main className={`w-legal${movil ? ' w-legal--movil' : ''}`}>
        <Seg ops={[['t', 'Términos'], ['p', 'Privacidad']]} sel={doc} ancho={movil} />
        <div className="w-legal__cabeza">
          <span className="t-display">{titulo}</span>
          <span className="t-label c-ter">Última actualización · 30 de septiembre de 2026</span>
        </div>
        <div className="w-tarjeta w-legal__doc">
          {secciones.map(([s, bloques]) => (
            <div key={s} className="w-legal__seccion">
              <span className="t-subtitle">{s}</span>
              {bloques.map((b, i) => Array.isArray(b)
                ? <ul key={i} className="w-legal__lista">{b.map((li) => <li key={li} className="t-body c-sec">{li}</li>)}</ul>
                : <span key={i} className="t-body c-sec">{b}</span>)}
            </div>
          ))}
        </div>
        <span className="t-bodysm c-ter w-legal__pie">¿Dudas? Escribinos a <a href="#">bautistaribotta@hotmail.com</a></span>
      </main>
    </div>
  );
}

/* Setup del perfil: un dato por paso, en una tarjeta centrada */
const PASOS = [
  ['Tu perfil · Sexo', '¿Con qué sexo te identificás?', 'Afina los cálculos de progreso.'],
  ['Tu perfil · Fecha de nacimiento', '¿Cuándo naciste?', 'Calculamos tu edad a partir de esta fecha. No se muestra a nadie.'],
  ['Tu perfil · Altura', '¿Cuál es tu altura?', 'Arrastrá la regla, usá las flechas o escribí el número. Se guarda en centímetros.'],
  ['Tu perfil · Peso', '¿Cuál es tu peso?', 'Lo podés cambiar desde tu perfil cuando quieras.'],
];
function Setup({ paso, unidad }) {
  const [rot, preg, ayuda] = PASOS[paso];
  const ultimo = paso === 3;
  let control;
  if (paso === 0) control = <div className="col g3"><Opcion titulo="Masculino" sel /><Opcion titulo="Femenino" estado="hover" /><Opcion titulo="Otro" /></div>;
  else if (paso === 1) control = <div className="row centro"><Fecha d="14" m="03" a="20" foco="a" /></div>;
  else if (paso === 2) control = <div className="col g5 centro"><Seg ops={[['cm', 'cm'], ['ft', 'ft']]} sel={unidad || 'cm'} acento /><Regla valor={175} unidad="cm" estado="foco" n={36} /><AyudaTeclado items={[[['←', '→'], '±1 cm'], [['Shift'], '±10']]} /></div>;
  else control = <div className="col g5 centro"><Seg ops={[['kg', 'kg'], ['lb', 'lb']]} sel="kg" acento /><Arco valor={72.5} /><AyudaTeclado items={[[['←', '→'], '±0,5 kg'], [['Shift'], '±5']]} /></div>;
  return (
    <div className="w-centrada">
      <div className="w-tarjeta w-paso col">
        <div className="w-paso__barra">
          <Boton v="ghost" t="sm" ico={paso === 0 ? 'x' : 'chevron-left'} estado={paso === 0 ? 'off' : undefined}>{paso === 0 ? 'Salir' : 'Atrás'}</Boton>
          <span className="w-paso__contador">{String(paso + 1).padStart(2, '0')}<span> / 04</span></span>
          <Boton v="ghost" t="sm">Saltar</Boton>
        </div>
        <Escala total={4} actual={paso} />
        <div className="col g3 w-paso__enunciado"><span className="t-label c-acc">{rot}</span><span className="t-display">{preg}</span><span className="t-bodysm c-sec">{ayuda}</span></div>
        <div className="w-paso__control">{control}</div>
        <div className="row entre g4 w-paso__pie">
          <span className="row g2 t-bodysm c-ter"><Kbd>Enter</Kbd>{ultimo ? 'para terminar' : 'para continuar'}</span>
          <Boton t="lg" icoDer={ultimo ? undefined : 'arrow-right'} ico={ultimo ? 'check' : undefined}>{ultimo ? 'Finalizar' : 'Continuar'}</Boton>
        </div>
      </div>
    </div>
  );
}

/* Cuenta con la baja pedida: la única pantalla mientras dura el período de gracia */
function CuentaEnBaja({ recuperando }) {
  return (
    <div className="w-centrada">
      <div className="w-tarjeta w-centrada__caja col g7">
        <Marca />
        <span className="w-sello-ico"><Ico n="life-buoy" s={26} /></span>
        <div className="col g3"><span className="t-label c-ter">Cuenta en baja</span><span className="t-display">Tu cuenta se elimina el 26 de noviembre de 2026</span><span className="t-bodysm c-sec">Pediste eliminar tu cuenta y la solicitud sigue vigente. Si la recuperás ahora, todo queda como lo dejaste: rutinas, sesiones e historial.</span></div>
        <div className="row g3"><Badge tono="danger">Se elimina en 30 días</Badge></div>
        <div className="row entre g4">
          <Boton v="ghost" t="sm" ico="log-out" estado={recuperando ? 'off' : undefined}>Cerrar sesión</Boton>
          <Boton t="lg" ico={recuperando ? undefined : 'rotate-ccw'} estado={recuperando ? 'cargando' : 'foco'}>{recuperando ? 'Recuperando…' : 'Recuperar cuenta'}</Boton>
        </div>
      </div>
    </div>
  );
}

function EstadosFlotante() {
  const est_ = [
    ['Vacío', <Campo flotante rotulo="Correo electrónico" ico="mail" />],
    ['Hover', <Campo flotante rotulo="Correo electrónico" ico="mail" estado="hover" />],
    ['Foco, vacío', <Campo flotante rotulo="Correo electrónico" ico="mail" estado="foco" />],
    ['Foco, escribiendo', <Campo flotante rotulo="Correo electrónico" ico="mail" valor="bauti@corr" estado="foco" />],
    ['Con valor', <Campo flotante rotulo="Correo electrónico" ico="mail" valor="bauti@correo.com" />],
    ['Error', <Campo flotante rotulo="Correo electrónico" ico="mail" valor="bauti@correo" error="Revisá el correo." />],
    ['Con enlace', <Campo flotante rotulo="Contraseña" ico="lock" extra="¿La olvidaste?" final={<BotonIco ico="eye" t="sm" label="Mostrar contraseña" />} />],
    ['Deshabilitado', <Campo flotante rotulo="Correo electrónico" ico="mail" valor="bauti@correo.com" estado="off" />],
  ];
  return (
    <div className="k-ficha">
      <div className="w-flot-grilla">{est_.map(([t, c]) => <div key={t} className="col g3"><span className="k-estados__cab">{t}</span>{c}</div>)}</div>
    </div>
  );
}

function AppWeb() {
  return (
    <Lienzo titulo="Acceso y primer ingreso" bajada="Sin sesión, la pantalla se parte: el formulario en vidrio a la izquierda y el lema grande sobre la luz a la derecha. Las luces derivan despacio en todo el onboarding (acceso, legales y setup), como en la app. Enter envía siempre el formulario.">
      <Seccion titulo="Iniciar sesión" nota="(auth)/login — fondo flanco: la luz entra por el borde derecho, detrás del lema; el texto chico queda en la columna oscura de la izquierda.">
        <Mesa nombre="Login · vacío" nota="Ingresar queda deshabilitado hasta tener correo y contraseña. Términos y condiciones y Política de privacidad, abajo de la tarjeta, abren el documento en el modal de lectura sin salir del acceso." ruta="(auth)/login" fondo="flanco" animado url="frencia.app/login"><Login /></Mesa>
        <Mesa nombre="Login · escribiendo" nota="El campo en foco toma el borde de lume con su halo. Debajo del botón, centrado, se recuerda que Enter envía." ruta="(auth)/login" fondo="flanco" animado url="frencia.app/login"><Login email="bauti@correo.com" pass="••••••" foco="pass" /></Mesa>
        <Mesa nombre="Login · credenciales inválidas" ruta="(auth)/login" fondo="flanco" animado url="frencia.app/login"><Login email="bauti@correo.com" pass="••••••••" error="Correo o contraseña incorrectos." /></Mesa>
        <Mesa nombre="Login · ingresando" nota="Los campos se bloquean y el botón muestra la ruedita sin cambiar de ancho." ruta="(auth)/login" fondo="flanco" animado url="frencia.app/login"><Login email="bauti@correo.com" pass="••••••••" enviando /></Mesa>
        <Mesa nombre="Login · entrando con Google" nota="Al tocar Google o Apple, ese botón cambia el logo por la ruedita y el otro queda apagado; enseguida el navegador sale a la pantalla del proveedor. Si se vuelve con la flecha del navegador, los dos quedan como antes." ruta="(auth)/login" fondo="flanco" animado url="frencia.app/login"><Login social="google" /></Mesa>
        <Mesa nombre="Login · volvió sin entrar" nota="Si la persona cancela en Google o Apple, vuelve al login con un aviso informativo («Cancelaste el ingreso con Google.»). Si falla el proveedor o la red, el aviso es de error («No pudimos entrar con Google. Probá de nuevo.»). El formulario queda como estaba y la URL se limpia." ruta="(auth)/login" fondo="flanco" animado url="frencia.app/login"><><Login /><Toasts><Toast tipo="info" texto="Cancelaste el ingreso con Google." /></Toasts></></Mesa>
      </Seccion>
      <Seccion titulo="Campos con etiqueta flotante" nota="Los campos del acceso no llevan placeholder: el rótulo va adentro mientras el campo está vacío y, al hacer clic o al tener texto, sube al borde de arriba de la caja (al 75 %, 180 ms ease-out) y deja lugar para escribir. En foco el rótulo toma el color de señal; con error, el carmín de texto. ¿La olvidaste? baja a la línea de debajo del campo.">
        <Mesa nombre="Estados del campo" alto={420} ruta="ui/FloatingField" fondo="cumbre" url="frencia.app/login"><EstadosFlotante /></Mesa>
      </Seccion>
      <Seccion titulo="Variante: billete grabado" nota="Propuesta. La foto pasa a un grabado de líneas como el de un billete (talla dulce con tramado cruzado en las sombras y guilloché en las luces) y va enmarcada a la derecha con microtexto, número de serie y una cartela con la marca FRENCIA. El switch de tema va arriba, del lado del formulario, donde antes estaba la marca. La tarjeta y los textos van centrados en su columna. En oscuro la línea es la luz (marfil sobre grafito); en claro, la sombra (tinta sobre marfil). Las placas pasan a lume como único color, igual que el tejado naranja de la referencia. Fondo cumbre: la luz queda detrás del billete y el formulario en la zona oscura.">
        <Mesa nombre="Login · billete a la izquierda" nota="Iniciar sesión espeja al registro: el billete pasa a la izquierda y el formulario a la derecha. Al ir de una pantalla a la otra, el billete y el formulario cruzan de lado con un fundido de 420 ms." ruta="(auth)/login · variante" fondo="cumbre" animado url="frencia.app/login"><Login email="bauti@correo.com" pass="••••••" foco="pass" variante="billete-izq" /></Mesa>
        <Mesa nombre="Login · billete, vacío" nota="Sin texto, cada rótulo está adentro de su campo." ruta="(auth)/login · variante" fondo="cumbre" animado url="frencia.app/login"><Login variante="billete-izq" /></Mesa>
        <Mesa nombre="Signup · billete, vacío" nota="Al hacer clic en Nombre, el rótulo sube y aparece el cursor; los demás siguen con el rótulo adentro." ruta="/signup · variante" fondo="cumbre" animado url="frencia.app/signup"><Signup caso="vacio" variante="billete" /></Mesa>
        <Mesa nombre="Signup · billete a la derecha" nota="Crear cuenta: formulario a la izquierda y billete a la derecha. Debajo de Crear cuenta, Apple y Google, igual que en el login: si la cuenta no existe la crean, y después pasan por términos y el setup del perfil como el alta con correo." ruta="/signup · variante" fondo="cumbre" animado url="frencia.app/signup"><Signup caso="distintas" variante="billete" /></Mesa>
      </Seccion>
      <Seccion titulo="Cambiar el tema en el acceso (propuestas)" nota="Dos formas de reemplazar el switch de sol y luna, arriba del lado del formulario. Sin sesión la elección se guarda en el navegador; con sesión manda profiles.tema. Recomendada: A, el botón de icono, porque el acceso tiene una sola tarea y el cambio de tema es secundario; B suma Sistema para volver a seguir a la compu, igual que Configuración.">
        <Mesa nombre="A · Botón de icono" nota="Un botón en vidrio con el icono del tema actual. Un clic alterna oscuro y claro y el icono anima al cambiar; el tooltip dice a qué modo pasa." ruta="(auth)/login · tema" fondo="cumbre" animado url="frencia.app/login"><Login variante="billete-izq" tema="boton" /></Mesa>
        <Mesa nombre="A · Botón de icono, hover" nota="Con el puntero encima: el fondo sube a vidrio elevado y aparece el tooltip debajo." ruta="(auth)/login · tema" fondo="cumbre" animado url="frencia.app/login"><Login variante="billete-izq" tema="boton" temaEstado="hover" /></Mesa>
        <Mesa nombre="B · Segmentado Sistema · Oscuro · Claro" nota="Tres opciones de solo icono, el mismo modelo que Configuración. Cada una lleva su nombre en el tooltip y en aria-label." ruta="(auth)/login · tema" fondo="cumbre" animado url="frencia.app/login"><Login variante="billete-izq" tema="seg" /></Mesa>
      </Seccion>
      <Seccion titulo="Signup" nota="/signup — mismo esqueleto; nombre y apellido comparten fila.">
        <Mesa nombre="Contraseñas distintas" ruta="/signup" fondo="flanco" animado url="frencia.app/signup"><Signup caso="distintas" /></Mesa>
        <Mesa nombre="Correo ya registrado" nota="Ofrece entrar o recuperar la contraseña en el mismo lugar." ruta="/signup" fondo="flanco" animado url="frencia.app/signup"><Signup caso="tomado" /></Mesa>
      </Seccion>
      <Seccion titulo="Recuperar y nueva contraseña" nota="(auth)/forgot-password y (auth)/reset-password — el enlace del correo abre la web en /nueva-contrasena con el código de Supabase. Mismo marco que el login: el billete a la izquierda y la tarjeta a la derecha, así no cambia de lugar al ir y volver.">
        <Mesa nombre="Pedir el enlace" ruta="(auth)/forgot-password" fondo="flanco" animado url="frencia.app/recuperar"><Recuperar /></Mesa>
        <Mesa nombre="Enlace enviado" nota="El icono del sello se anima una vez al confirmar. Reenviar espera un minuto." ruta="(auth)/forgot-password" fondo="flanco" animado url="frencia.app/recuperar"><Recuperar enviado /></Mesa>
        <Mesa nombre="Nueva contraseña" nota="Los requisitos se tachan en vivo, en tinta y con check: largo y que las dos coincidan. Que sea distinta de la anterior solo lo sabe el servidor: si la rechaza, el error va en el campo." ruta="(auth)/reset-password" fondo="flanco" animado url="frencia.app/nueva-contrasena"><NuevaContrasena /></Mesa>
        <Mesa nombre="Nueva contraseña · guardando" ruta="(auth)/reset-password" fondo="flanco" animado url="frencia.app/nueva-contrasena"><NuevaContrasena caso="guardando" /></Mesa>
        <Mesa nombre="Nueva contraseña · igual a la anterior" ruta="(auth)/reset-password" fondo="flanco" animado url="frencia.app/nueva-contrasena"><NuevaContrasena caso="igual" /></Mesa>
        <Mesa nombre="Enlace vencido" nota="También si el enlace se abre en otro navegador que el que lo pidió: el código solo se canjea donde se pidió." ruta="(auth)/reset-password" fondo="flanco" animado url="frencia.app/nueva-contrasena"><NuevaContrasena caso="vencido" /></Mesa>
      </Seccion>
      <Seccion titulo="Términos y privacidad" nota="legal-consent — tarjeta centrada; fondo cumbre (la luz arriba a la derecha queda lejos del texto chico). El documento se abre en un modal de lectura y se marca al llegar al final.">
        <Mesa nombre="Ninguno leído" nota="La próxima fila a leer se adelanta con el hover." ruta="legal-consent" fondo="cumbre" animado url="frencia.app/bienvenida"><Consentimiento /></Mesa>
        <Mesa nombre="Leyendo un documento" nota="La barra de abajo avanza con el scroll; al 100 % se marca y vuelve a la lista." ruta="legal-consent · terms" fondo="cumbre" animado url="frencia.app/bienvenida"><DocumentoLegal /></Mesa>
        <Mesa nombre="Los dos leídos" ruta="legal-consent" fondo="cumbre" animado url="frencia.app/bienvenida"><Consentimiento leidos={['t', 'p']} /></Mesa>
      </Seccion>
      <Seccion titulo="Términos y privacidad públicos" nota="/terminos y /privacidad — las mismas secciones del modal de lectura en una página que se abre sin sesión: son los links que piden Google, Apple y las tiendas. Van afuera de las puertas: con sesión no redirigen y la cabecera ofrece Ir a Frencia; sin sesión, Entrar y Crear cuenta. El segmentado pasa de un documento al otro (cambia la URL). Columna de lectura de 760 px en una tarjeta; fondo velada, como las pantallas de mucho texto. El título de la pestaña es el del documento.">
        <Mesa nombre="Términos · sin sesión" ruta="/terminos" fondo="velada" url="frencia.fit/terminos"><LegalPublica doc="t" /></Mesa>
        <Mesa nombre="Privacidad · con sesión" nota="Llega desde un link con la sesión abierta: no se cierra la sesión ni se pasa por el inicio." ruta="/privacidad" fondo="velada" url="frencia.fit/privacidad"><LegalPublica doc="p" sesion /></Mesa>
        <Mesa nombre="Privacidad en el celular" nota="Cabecera chica con Entrar; el segmentado va a lo ancho y la tarjeta baja su relleno a space-6." movil ancho={390} alto={844} ruta="/privacidad · móvil" fondo="velada" url="frencia.fit/privacidad"><LegalPublica doc="p" movil /></Mesa>
      </Seccion>
      <Seccion titulo="Setup del perfil" nota="setup — el mismo marco de wizard de la app (barra, contador, escala, enunciado, control, pie) en una tarjeta de 640 px. Sexo va con fondo cumbre; fecha, altura y peso con fondo centro: el control protagonista queda sobre la luz, en vidrio.">
        <Mesa nombre="Paso 1 · Sexo" ruta="setup" fondo="cumbre" animado url="frencia.app/bienvenida/perfil"><Setup paso={0} /></Mesa>
        <Mesa nombre="Paso 2 · Fecha de nacimiento" nota="Reemplaza la rueda de edad: la cuenta guarda fecha_nacimiento." ruta="setup" fondo="centro" animado url="frencia.app/bienvenida/perfil"><Setup paso={1} /></Mesa>
        <Mesa nombre="Paso 3 · Altura" ruta="setup" fondo="centro" animado url="frencia.app/bienvenida/perfil"><Setup paso={2} /></Mesa>
        <Mesa nombre="Paso 4 · Peso" ruta="setup" fondo="centro" animado url="frencia.app/bienvenida/perfil"><Setup paso={3} /></Mesa>
      </Seccion>
      <Seccion titulo="Cuenta con la baja pedida" nota="account-recovery — mientras dura el período de gracia es la única pantalla, se entre por donde se entre. Misma tarjeta centrada que los términos: Cerrar sesión a la izquierda y Recuperar cuenta a la derecha, con el foco. Al recuperar, la cuenta queda como estaba y sigue el ingreso normal (términos y setup, si faltan).">
        <Mesa nombre="Recuperar la cuenta" ruta="account-recovery" fondo="cumbre" animado url="frencia.app/cuenta-en-baja"><CuentaEnBaja /></Mesa>
        <Mesa nombre="Recuperando" ruta="account-recovery" fondo="cumbre" animado url="frencia.app/cuenta-en-baja"><CuentaEnBaja recuperando /></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
