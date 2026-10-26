// Frencia · Pantallas - 2 Primer ingreso: pantallas de la pagina, sobre pantallas-base.jsx.
const { Button, Checkbox, SegmentedControl } = DS;

/* src/app/legal-consent.tsx */
function Consentimiento({ leidos = [] }) {
  const docs = [
    { id: 't', titulo: 'Términos y Condiciones', vigencia: '30 de septiembre de 2026' },
    { id: 'p', titulo: 'Política de Privacidad', vigencia: '30 de septiembre de 2026' },
  ];
  const ambos = leidos.length === 2;
  return (
    <>
      <div className="col f1 centrar pad g8 items-inicio" >
        <div className="col g4 lleno">
          <span className="t-label c-ter">Antes de empezar</span>
          <span className="t-title">Términos y privacidad</span>
          <span className="t-bodysm c-sec">Para usar Frencia necesitás aceptar los Términos y Condiciones y la Política de Privacidad.</span>
        </div>
        <div className="lista lleno">
          {docs.map((d, i) => {
            const leido = leidos.includes(d.id);
            return (
              <React.Fragment key={d.id}>
                {i > 0 ? <div className="lista__divisor"></div> : null}
                <div className="lista__fila lista__fila--sin-borde">
                  <Checkbox checked={leido} />
                  <div className="col g1 f1">
                    <span className="t-bodysm semi">{d.titulo}</span>
                    <span className={`t-label ${leido ? 'c-acc' : 'c-ter'}`}>{leido ? 'Leído' : `Vigente desde el ${d.vigencia}`}</span>
                  </div>
                  <Ico n="chevron-right" c="c-ter" />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="acciones-pie">
        {!ambos ? <span className="t-bodysm c-ter center">Abrí los dos documentos para poder continuar.</span> : null}
        <Button variant="primary" size="lg" fullWidth icon="check" disabled={!ambos}>Aceptar y continuar</Button>
        <Button variant="ghost" size="md" fullWidth>Cerrar sesión</Button>
        <Button variant="ghost" size="md" fullWidth>Eliminar mi cuenta</Button>
      </div>
    </>
  );
}

/* src/app/setup.tsx — un dato por pantalla. La pregunta queda siempre a la
   misma altura; Saltar va arriba a la derecha, lejos de Continuar. */
const PASOS = [
  { rotulo: 'Tu perfil · Sexo', pregunta: '¿Con qué sexo te identificás?', ayuda: 'Afina los cálculos de progreso.' },
  { rotulo: 'Tu perfil · Edad', pregunta: '¿Cuántos años tenés?', ayuda: 'Lo usamos para ajustar tus referencias.' },
  { rotulo: 'Tu perfil · Altura', pregunta: '¿Cuál es tu altura?', ayuda: 'Deslizá la regla. Se guarda siempre en centímetros.' },
  { rotulo: 'Tu perfil · Peso', pregunta: '¿Cuál es tu peso?', ayuda: 'Deslizá la regla. Lo podés cambiar desde tu perfil.' },
];
function Unidad({ opciones, valor }) {
  return <div className="row centrar"><SegmentedControl options={opciones} value={valor} className="medida__toggle" /></div>;
}
function Setup({ paso, unidad = 'metric' }) {
  const p = PASOS[paso];
  const ultimo = paso === PASOS.length - 1;
  let control;
  if (paso === 0) control = <Opciones opciones={['Masculino', 'Femenino', 'Otro']} sel="Masculino" />;
  else if (paso === 1) control = <Medida tipo="edad" />;
  else if (paso === 2) control = (
    <div className="col g8">
      <Unidad opciones={[{ value: 'metric', label: 'cm' }, { value: 'imperial', label: 'ft' }]} valor={unidad} />
      {unidad === 'metric'
        ? <Regla valor={175} unidad="cm" mayor={10} media={5} />
        : <Regla valor={69} paso={1} mayor={12} media={6} n={20} fmt={(v) => `${v / 12}′`}
            lectura={<><span className="lectura__num">5</span><span className="lectura__unidad">ft</span><span className="lectura__num">9</span><span className="lectura__unidad">in</span></>} />}
    </div>
  );
  else control = (
    <div className="col g8">
      <Unidad opciones={[{ value: 'metric', label: 'kg' }, { value: 'imperial', label: 'lb' }]} valor={unidad} />
      <Regla valor={72.5} unidad="kg" paso={0.5} mayor={10} media={2} decimales={1} />
    </div>
  );
  return (
    <Paso actual={paso} total={PASOS.length} volverOff={paso === 0} rotulo={p.rotulo} pregunta={p.pregunta} ayuda={p.ayuda}
      derecha={<BotonTexto>Saltar</BotonTexto>}
      pie={<Button variant="primary" size="lg" fullWidth iconRight={ultimo ? undefined : 'arrow-right'} icon={ultimo ? 'check' : undefined}>{ultimo ? 'Finalizar' : 'Continuar'}</Button>}>
      {control}
    </Paso>
  );
}

/* src/components/LegalDocument.tsx */
function DocumentoLegal() {
  return (
    <>
      <Volver cls="barra-volver--alta" />
      <div className="legal">
        <div className="col g3">
          <span className="t-title">Términos y Condiciones</span>
          <span className="t-label c-ter">Última actualización: 30 de septiembre de 2026</span>
        </div>
        <div className="col g4">
          <span className="t-subtitle">1. Aceptación</span>
          <span className="t-bodysm c-sec">Estos Términos y Condiciones regulan el uso de la aplicación Frencia (en adelante, "Frencia" o "la app").</span>
          <span className="t-bodysm c-sec">Para usar Frencia tenés que aceptarlos de forma expresa, junto con la Política de Privacidad.</span>
        </div>
        <div className="col g4">
          <span className="t-subtitle">3. Qué es Frencia</span>
          <span className="t-bodysm c-sec">Frencia es una herramienta para registrar entrenamientos de fuerza, de cardio e isométricos. Te permite, entre otras cosas:</span>
          <div className="col g3">
            <div className="legal__item"><span className="legal__vineta"></span><span className="t-bodysm c-sec f1">Cargar y organizar tus rutinas y días de entrenamiento.</span></div>
            <div className="legal__item"><span className="legal__vineta"></span><span className="t-bodysm c-sec f1">Consultar tu historial, tu racha y tu progreso.</span></div>
            <div className="legal__item"><span className="legal__vineta"></span><span className="t-bodysm c-sec f1">Consultar un catálogo de ejercicios con sus grupos musculares e instrucciones.</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

/* src/app/account-recovery.tsx y src/app/profile-error.tsx */
function EstadoCuenta({ tipo }) {
  const recuperar = tipo === 'recuperar';
  return (
    <>
      <div className="centrada">
        <div className="icono-caja"><Ico n={recuperar ? 'clock' : 'triangle-alert'} s={28} c={recuperar ? 'c-dang' : 'c-sec'} /></div>
        <span className={`t-label ${recuperar ? 'c-dang' : 'c-ter'}`}>{recuperar ? 'Eliminación programada' : 'Sin respuesta del servidor'}</span>
        <span className="t-title centrada__titulo">{recuperar ? 'Tu cuenta se elimina el 10 de noviembre de 2026' : 'No pudimos cargar tu cuenta'}</span>
        {recuperar ? (
          <>
            <span className="t-bodysm c-sec centrada__texto">Pediste eliminar tu cuenta y la solicitud sigue vigente. Si la recuperás ahora, todo queda como lo dejaste: rutinas, sesiones e historial.</span>
            <span className="t-bodysm c-sec centrada__texto">Pasada esa fecha, los datos se borran y no se pueden recuperar.</span>
          </>
        ) : (
          <>
            <span className="t-bodysm c-sec centrada__texto">Tus datos están a salvo: falló la lectura, no se borró nada.</span>
            <span className="t-bodysm c-sec centrada__texto">Revisá tu conexión y probá de nuevo. Si sigue igual, el problema puede ser de nuestro lado.</span>
          </>
        )}
      </div>
      <div className="acciones-pie">
        <Button variant="primary" size="lg" fullWidth icon={recuperar ? undefined : 'repeat'}>{recuperar ? 'Recuperar cuenta' : 'Reintentar'}</Button>
        <Button variant="ghost" size="md" fullWidth>{recuperar ? 'Cerrar sesión' : 'Volver al inicio de sesión'}</Button>
      </div>
    </>
  );
}

function App() {
  return (
    <Lienzo titulo="Primer ingreso" bajada="Lo que manda el gate del layout raíz antes de llegar a Inicio: aceptar los textos legales, completar el perfil de a un dato por pantalla y los dos estados de cuenta que bloquean la app.">
      <Seccion titulo="Aceptación de los textos legales" nota="src/app/legal-consent.tsx — cada checkbox se marca al volver de abrir su documento, no tocándolo.">
        <Mesa nombre="Ninguno leído" ruta="legal-consent"><Consentimiento /></Mesa>
        <Mesa nombre="Uno leído" ruta="legal-consent"><Consentimiento leidos={['t']} /></Mesa>
        <Mesa nombre="Los dos leídos" nota="Se habilita Aceptar y continuar." ruta="legal-consent"><Consentimiento leidos={['t', 'p']} /></Mesa>
        <Mesa nombre="Documento legal" nota="Términos y Política comparten esta vista de solo lectura." ruta="terms · privacy"><DocumentoLegal /></Mesa>
      </Seccion>
      <Seccion titulo="Setup del perfil" nota="src/app/setup.tsx — un dato por pantalla con el marco común de los wizards: contador 01 / 04 y escala arriba, la pregunta siempre a la misma altura, Saltar arriba a la derecha y Continuar abajo. Altura y peso guardan siempre en métrico.">
        <Mesa nombre="Paso 1 · Sexo" nota="Tres filas con radio en lugar del control segmentado: se leen enteras y se tocan con el pulgar." ruta="setup"><Setup paso={0} /></Mesa>
        <Mesa nombre="Paso 2 · Edad" nota="Rueda única en años, con la banda de selección en dos hairlines." ruta="setup"><Setup paso={1} /></Mesa>
        <Mesa nombre="Paso 3 · Altura" nota="Lectura grande y regla con aguja de acero. La unidad se elige arriba y no cambia lo que se guarda." ruta="setup"><Setup paso={2} /></Mesa>
        <Mesa nombre="Paso 3 · Altura en ft" ruta="setup"><Setup paso={2} unidad="imperial" /></Mesa>
        <Mesa nombre="Paso 4 · Peso" nota="La regla avanza de a 0,5 kg; las marcas largas caen cada 5 kg." ruta="setup"><Setup paso={3} /></Mesa>
      </Seccion>
      <Seccion titulo="Estados de cuenta" nota="Pantallas únicas: el gate no deja pasar de acá hasta resolverlas.">
        <Mesa nombre="Cuenta en eliminación" nota="El único carmín de pantalla completa: la cuenta sí corre peligro." ruta="account-recovery"><EstadoCuenta tipo="recuperar" /></Mesa>
        <Mesa nombre="No se pudo cargar la cuenta" nota="Neutro y no carmín: los datos no corren peligro." ruta="profile-error"><EstadoCuenta tipo="error" /></Mesa>
      </Seccion>
    </Lienzo>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
