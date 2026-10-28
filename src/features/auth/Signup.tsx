/* Crear cuenta (/signup), en la tarjeta del acceso. Mismas reglas que la app: nombre de 2 letras o
   mas, contraseña de 6 o mas y repetida igual.
   Debajo de Crear cuenta, Apple y Google como en el login: si la cuenta no
   existe la crean.
   Por ahora es solo la vista: el alta contra Supabase (con correo, Apple o
   Google) llega con la etapa de auth. Ojo: la base guarda un solo `name`; nombre y apellido se van a unir
   al enviar. */

import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { Campo } from '@/design/components/Campo';
import texto from '@/design/texto.module.css';
import { Acceso } from './Acceso';
import styles from './Acceso.module.css';
import { Sociales } from './Sociales';

const MINIMO_CONTRASENA = 6;

export function Signup() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetida, setRepetida] = useState('');
  const [repetidaTocada, setRepetidaTocada] = useState(false);

  // El aviso aparece cuando ya se escribio tanto como la original o al salir
  // del campo: no mientras se esta tipeando.
  const distintas =
    repetida.length > 0 && repetida !== contrasena && (repetidaTocada || repetida.length >= contrasena.length);

  const listo =
    nombre.trim().length > 1 &&
    email.trim().length > 3 &&
    contrasena.length >= MINIMO_CONTRASENA &&
    contrasena === repetida;

  function crearCuenta(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!listo) return;
    // Pendiente: supabase.auth.signUp en la etapa de auth.
  }

  return (
    <Acceso titulo="Creá tu cuenta" bajada="Empezá a registrar cada serie desde hoy." onSubmit={crearCuenta}>
      <div className={styles.campos}>
        <div className={styles.fila}>
          <Campo
            rotulo="Nombre"
            icono={User}
            autoComplete="given-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
          <Campo
            rotulo="Apellido"
            icono={User}
            autoComplete="family-name"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <Campo
          rotulo="Correo electrónico"
          icono={Mail}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Campo
          rotulo="Contraseña"
          icono={Lock}
          type="password"
          autoComplete="new-password"
          ayuda={`${MINIMO_CONTRASENA} caracteres o más.`}
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <Campo
          rotulo="Repetí la contraseña"
          icono={Lock}
          type="password"
          autoComplete="new-password"
          value={repetida}
          onChange={(e) => setRepetida(e.target.value)}
          onBlur={() => setRepetidaTocada(true)}
          error={distintas ? 'Las contraseñas no coinciden.' : null}
        />
      </div>
      <Boton type="submit" tamano="lg" ancho iconoDer={ArrowRight} disabled={!listo}>
        Crear cuenta
      </Boton>
      <Sociales />
      <span className={`${texto.bodySm} ${texto.secundario} ${styles.alPie}`}>
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className={styles.enlace} viewTransition>
          Iniciá sesión
        </Link>
      </span>
    </Acceso>
  );
}
