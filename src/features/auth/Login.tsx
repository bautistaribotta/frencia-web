/* Iniciar sesion (/entrar). Variante billete: el billete a la izquierda y el
   formulario a la derecha. Ingresar queda deshabilitado hasta tener correo y
   contraseña; Enter envia siempre el formulario.
   Por ahora es solo la vista: el ingreso contra Supabase llega con la etapa
   de auth. */

import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

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

  const listo = email.trim().length > 0 && contrasena.length > 0;

  function ingresar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!listo) return;
    // Pendiente: supabase.auth.signInWithPassword en la etapa de auth.
  }

  return (
    <Acceso billete="izquierda" titulo="Entrá a tu cuenta" bajada="Seguí donde la dejaste." onSubmit={ingresar}>
      <div className={styles.campos}>
        <Campo
          rotulo="Correo electrónico"
          icono={Mail}
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <Campo
          rotulo="Contraseña"
          extra={
            <Link to="/recuperar" className={styles.enlace}>
              ¿La olvidaste?
            </Link>
          }
          icono={Lock}
          type={mostrar ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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
      <Boton type="submit" tamano="lg" ancho iconoDer={ArrowRight} disabled={!listo}>
        Ingresar
      </Boton>
      {enFocoContrasena ? (
        <span className={`${styles.pista} ${texto.bodySm} ${texto.terciario}`}>
          <Kbd>Enter</Kbd>para ingresar
        </span>
      ) : null}
      <Sociales />
      <span className={`${texto.bodySm} ${texto.secundario} ${styles.alPie}`}>
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className={styles.enlace} viewTransition>
          Creá una
        </Link>
      </span>
    </Acceso>
  );
}
