/* Recuperar la contraseña (/recuperar). Mismo marco que el login (la
   tarjeta del acceso). Pide el correo y Supabase manda
   un enlace que vuelve a /nueva-contrasena. Siempre confirma "Revisá tu
   correo", exista o no la cuenta, para no revelar que correos estan
   registrados. Reenviar espera un minuto. */

import { ArrowLeft, ArrowRight, KeyRound, Mail, MailCheck, RotateCcw } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { Campo } from '@/design/components/Campo';
import { Icono } from '@/design/components/Icono';
import texto from '@/design/texto.module.css';
import { supabase } from '@/lib/supabase';
import { Acceso } from './Acceso';
import styles from './Acceso.module.css';

const ESPERA_REENVIO = 60;

export function Recuperar() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState((state as { email?: string } | null)?.email ?? '');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [espera, setEspera] = useState(0);

  useEffect(() => {
    if (espera <= 0) return;
    const t = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [espera]);

  const correo = email.trim();
  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  async function enviar(evento?: FormEvent<HTMLFormElement>) {
    evento?.preventDefault();
    if (enviando) return;
    if (!valido) {
      setError('Escribí un correo válido.');
      return;
    }
    setEnviando(true);
    setError(null);
    const { error: fallo } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: `${window.location.origin}/nueva-contrasena`,
    });
    setEnviando(false);
    if (fallo) {
      setError(
        fallo.status === 429
          ? 'Pediste varios enlaces seguidos. Esperá un rato y probá de nuevo.'
          : 'No pudimos mandar el enlace. Probá de nuevo en unos segundos.',
      );
      return;
    }
    setEnviado(correo);
    setEspera(ESPERA_REENVIO);
  }

  const volver = (
    <Boton variante="ghost" tamano="sm" icono={ArrowLeft} className={styles.volver} onClick={() => navegar('/login', { viewTransition: true })}>
      Volver a iniciar sesión
    </Boton>
  );

  if (enviado)
    return (
      <Acceso
       
        titulo="Revisá tu correo"
        bajada={
          <>
            Te mandamos un enlace a <span className={`${texto.primario} ${texto.semi}`}>{enviado}</span> para elegir una
            contraseña nueva. Si no lo ves, mirá en spam.
          </>
        }
        cabeza={
          <>
            {volver}
            <span className={styles.sello}>
              <Icono icono={MailCheck} tamano={26} />
            </span>
          </>
        }
      >
        <Boton variante="secondary" tamano="lg" ancho icono={RotateCcw} disabled={espera > 0} cargando={enviando} onClick={() => void enviar()}>
          {espera > 0 ? `Reenviar en 0:${String(espera).padStart(2, '0')}` : 'Reenviar enlace'}
        </Boton>
        {error ? (
          <span role="alert" className={`${texto.bodySm} ${styles.alPie}`}>
            {error}
          </span>
        ) : null}
      </Acceso>
    );

  return (
    <Acceso
     
      titulo="Recuperá tu contraseña"
      bajada="Escribí tu correo y te mandamos un enlace para elegir una nueva."
      onSubmit={enviar}
      cabeza={
        <>
          {volver}
          <span className={styles.sello}>
            <Icono icono={KeyRound} tamano={26} />
          </span>
        </>
      }
    >
      <Campo
        rotulo="Correo electrónico"
        icono={Mail}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null);
        }}
        disabled={enviando}
        error={error}
        autoFocus
      />
      <Boton type="submit" tamano="lg" ancho iconoDer={ArrowRight} disabled={correo.length === 0} cargando={enviando}>
        {enviando ? 'Enviando…' : 'Enviar enlace'}
      </Boton>
    </Acceso>
  );
}
