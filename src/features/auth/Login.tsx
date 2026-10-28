/* Iniciar sesion (/login), en la tarjeta del acceso. Ingresar queda
   deshabilitado hasta tener correo y contraseña; Enter envia siempre el formulario.
   Tras un ingreso exitoso no se navega a mano: la puerta SoloInvitado ve la
   sesion nueva y lleva al inicio, como el gate de la app. */

import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

import { supabase } from '@/lib/supabase';

import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { Campo } from '@/design/components/Campo';
import { Kbd } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { Acceso } from './Acceso';
import styles from './Acceso.module.css';
import { Sociales } from './Sociales';

export function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [enFocoContrasena, setEnFocoContrasena] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = email.trim().length > 0 && contrasena.length > 0;

  async function ingresar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!listo || enviando) return;
    setEnviando(true);
    setError(null);

    const { error: fallo } = await supabase.auth.signInWithPassword({ email: email.trim(), password: contrasena });
    if (!fallo) return;

    // El servidor puede fallar por credenciales (400) o por un problema
    // temporal (500, timeout, proyecto despertando de una pausa). En ese
    // segundo caso el SDK a veces deja la sesion creada igual: se confirma
    // antes de culpar a la contraseña, como en la app.
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) return;

    const credencialesInvalidas = fallo.status === 400 || /invalid login credentials/i.test(fallo.message);
    setError(
      credencialesInvalidas
        ? 'Correo o contraseña incorrectos.'
        : 'No pudimos conectar con el servidor. Probá de nuevo en unos segundos.',
    );
    setEnviando(false);
  }

  return (
    <Acceso titulo="Entrá a tu cuenta" bajada="Seguí donde la dejaste." onSubmit={ingresar}>
      <div className={styles.campos}>
        <Campo
          rotulo="Correo electrónico"
          icono={Mail}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          disabled={enviando}
          autoFocus
        />
        <Campo
          rotulo="Contraseña"
          extra={
            <Link to="/recuperar" state={{ email: email.trim() }} className={styles.enlace} viewTransition>
              ¿La olvidaste?
            </Link>
          }
          icono={Lock}
          type={mostrar ? 'text' : 'password'}
          autoComplete="current-password"
          value={contrasena}
          onChange={(e) => { setContrasena(e.target.value); setError(null); }}
          disabled={enviando}
          error={error}
          onFocus={() => setEnFocoContrasena(true)}
          onBlur={() => setEnFocoContrasena(false)}
          final={
            <BotonIcono
              icono={mostrar ? EyeOff : Eye}
              etiqueta={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tamano="sm"
              onClick={() => setMostrar((m) => !m)}
            />
          }
        />
      </div>
      <Boton type="submit" tamano="lg" ancho iconoDer={ArrowRight} disabled={!listo} cargando={enviando}>
        {enviando ? 'Ingresando…' : 'Ingresar'}
      </Boton>
      {/* Su lugar queda reservado aunque no se vea: si apareciera y
          desapareciera, al salir de la contraseña todo lo de abajo saltaria y
          el clic en un enlace del pie caeria en el vacio. */}
      <span
        className={`${styles.pista} ${enFocoContrasena ? '' : styles.oculta} ${texto.bodySm} ${texto.terciario}`}
        aria-hidden={!enFocoContrasena}
      >
        <Kbd>Enter</Kbd>para ingresar
      </span>
      <Sociales />
      <span className={`${texto.bodySm} ${texto.secundario} ${styles.alPie}`}>
        ¿No tenés cuenta?{' '}
        <Link to="/signup" className={styles.enlace} viewTransition>
          Creá una
        </Link>
      </span>
    </Acceso>
  );
}
