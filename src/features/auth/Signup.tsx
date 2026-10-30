/* Crear cuenta (/signup). Variante billete: el formulario a la izquierda y
   el billete a la derecha. Mismas reglas que la app: nombre de 2 letras o
   mas, contraseña de 6 o mas y repetida igual.
   Debajo de Crear cuenta, Apple y Google como en el login: si la cuenta no
   existe la crean.
   El alta con correo va contra Supabase con el nombre en los metadatos, que
   el trigger de la base copia a profiles; el apellido se guarda despues, ya
   con sesion. Sin confirmacion por correo la sesion llega en el acto y no se
   navega a mano: la puerta SoloInvitado la ve y el alta sigue por terminos y
   el setup, como con Google. Si el correo ya tiene cuenta, el error va en el
   campo y se ofrece entrar o recuperar la contraseña. */

import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import type { AuthError } from '@supabase/supabase-js';

import { useAvisos } from '@/contexts/avisos';
import { Boton } from '@/design/components/Boton';
import { Campo } from '@/design/components/Campo';
import texto from '@/design/texto.module.css';
import { supabase } from '@/lib/supabase';
import { Acceso } from './Acceso';
import styles from './Acceso.module.css';
import { Sociales } from './Sociales';

const MINIMO_CONTRASENA = 6;

/** El correo ya tiene cuenta. Supabase usa uno u otro codigo segun la version
 *  de Auth, y las mas viejas solo mandan el mensaje en ingles. */
function esCorreoTomado(error: AuthError): boolean {
  return (
    error.code === 'user_already_exists' ||
    error.code === 'email_exists' ||
    /already registered/i.test(error.message)
  );
}

/** Traduce el error de signUp, igual que la app: `error.message` llega en
 *  ingles y nunca se muestra tal cual. */
function mensajeDeAlta(error: AuthError): string {
  if (error.name === 'AuthRetryableFetchError' || error.status === 0) {
    return 'No pudimos conectarnos. Revisá tu conexión y probá de nuevo.';
  }
  if (error.status === 429 || error.code === 'over_request_rate_limit' || error.code === 'over_email_send_rate_limit') {
    return 'Hiciste muchos intentos seguidos. Esperá unos minutos y probá de nuevo.';
  }
  switch (error.code) {
    case 'weak_password':
      return 'La contraseña es muy débil. Probá con una más larga, que mezcle letras y números.';
    case 'email_address_invalid':
    case 'validation_failed':
      return 'Revisá el correo electrónico: no parece válido.';
    case 'signup_disabled':
    case 'email_provider_disabled':
      return 'Por ahora no se pueden crear cuentas con correo.';
    default:
      return 'No pudimos crear la cuenta. Probá de nuevo en unos segundos.';
  }
}

export function Signup() {
  const avisar = useAvisos();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetida, setRepetida] = useState('');
  const [repetidaTocada, setRepetidaTocada] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [tomado, setTomado] = useState(false);

  // El aviso aparece cuando ya se escribio tanto como la original o al salir
  // del campo: no mientras se esta tipeando.
  const distintas =
    repetida.length > 0 && repetida !== contrasena && (repetidaTocada || repetida.length >= contrasena.length);

  const listo =
    nombre.trim().length > 1 &&
    email.trim().length > 3 &&
    contrasena.length >= MINIMO_CONTRASENA &&
    contrasena === repetida;

  async function crearCuenta(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!listo || enviando) return;
    setEnviando(true);
    setTomado(false);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: contrasena,
      // El trigger de la base guarda este nombre en profiles.
      options: { data: { name: nombre.trim() } },
    });

    if (error) {
      setEnviando(false);
      if (esCorreoTomado(error)) setTomado(true);
      else avisar(mensajeDeAlta(error), 'error');
      return;
    }

    // Con la sesion ya creada se completa el apellido. Si falla no frena el
    // alta: se puede cargar despues desde el setup o el perfil.
    const usuario = data.session?.user;
    if (usuario && apellido.trim()) {
      await supabase.from('profiles').update({ surname: apellido.trim() }).eq('id', usuario.id);
    }
    // Queda cargando: la puerta SoloInvitado ve la sesion y sigue al alta.
    // Si el proyecto pidiera confirmar el correo, no hay sesion todavia.
    if (!data.session) {
      setEnviando(false);
      avisar('Te mandamos un correo para confirmar la cuenta.', 'info');
    }
  }

  return (
    <Acceso billete="derecha" titulo="Creá tu cuenta" bajada="Empezá a registrar cada serie desde hoy." onSubmit={crearCuenta}>
      <div className={styles.campos}>
        <div className={styles.fila}>
          <Campo
            flotante
            rotulo="Nombre"
            icono={User}
            autoComplete="given-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={enviando}
            autoFocus
          />
          <Campo
            flotante
            rotulo="Apellido"
            icono={User}
            autoComplete="family-name"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            disabled={enviando}
          />
        </div>
        <Campo
          flotante
          rotulo="Correo electrónico"
          icono={Mail}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setTomado(false);
          }}
          disabled={enviando}
          error={tomado ? 'Este correo ya tiene una cuenta.' : null}
        />
        <Campo
          flotante
          rotulo="Contraseña"
          icono={Lock}
          type="password"
          autoComplete="new-password"
          ayuda={`${MINIMO_CONTRASENA} caracteres o más.`}
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          disabled={enviando}
        />
        <Campo
          flotante
          rotulo="Repetí la contraseña"
          icono={Lock}
          type="password"
          autoComplete="new-password"
          value={repetida}
          onChange={(e) => setRepetida(e.target.value)}
          onBlur={() => setRepetidaTocada(true)}
          disabled={enviando}
          error={distintas ? 'Las contraseñas no coinciden.' : null}
        />
      </div>
      {tomado ? (
        <span className={`${texto.bodySm} ${texto.secundario}`}>
          ¿Es tuya?{' '}
          <Link to="/login" className={styles.enlace} viewTransition>
            Entrá
          </Link>{' '}
          o{' '}
          <Link to="/recuperar" state={{ email: email.trim() }} className={styles.enlace} viewTransition>
            recuperá la contraseña
          </Link>
          .
        </span>
      ) : null}
      <Boton type="submit" tamano="lg" ancho iconoDer={ArrowRight} disabled={!listo} cargando={enviando}>
        {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
      </Boton>
      <Sociales deshabilitado={enviando} />
      <span className={`${texto.bodySm} ${texto.secundario} ${styles.alPie}`}>
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className={styles.enlace} viewTransition>
          Iniciá sesión
        </Link>
      </span>
    </Acceso>
  );
}
