/* Nueva contraseña (/nueva-contrasena), donde vuelve el enlace del correo de
   recuperacion (kit web, Web · 3). El cliente de Supabase canjea el codigo
   de la URL por una sesion al iniciar; con sesion se elige la contraseña dos
   veces y Guardar y entrar lleva al inicio.
   Los requisitos se marcan en vivo: largo y que las dos coincidan. Que sea
   distinta de la anterior solo lo sabe el servidor: si la rechaza, el error
   va en el campo. Sin sesion (enlace vencido, ya usado o abierto en otro
   navegador que el que lo pidio) muestra "El enlace venció". */

import { ArrowRight, Check, Circle, Eye, EyeOff, Link2Off, Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { Campo } from '@/design/components/Campo';
import { Icono } from '@/design/components/Icono';
import texto from '@/design/texto.module.css';
import { supabase } from '@/lib/supabase';
import { Acceso } from './Acceso';
import styles from './Acceso.module.css';

const MINIMO = 6;

/** El enlace vuelve con ?error=... (o en el hash) si Supabase lo rechazo. */
function enlaceConError(): boolean {
  const buscar = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.slice(1));
  return buscar.has('error') || hash.has('error');
}

export function NuevaContrasena() {
  const { session, iniciando } = useSesion();
  const navegar = useNavigate();
  const avisar = useAvisos();
  const [contrasena, setContrasena] = useState('');
  const [repetida, setRepetida] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vencido, setVencido] = useState(enlaceConError);

  if (iniciando) return null;

  if (vencido || !session)
    return (
      <Acceso
       
        titulo="El enlace venció"
        bajada="Los enlaces para cambiar la contraseña duran una hora y sirven una sola vez, en el navegador donde los pediste. Pedí uno nuevo."
        cabeza={
          <span className={styles.sello}>
            <Icono icono={Link2Off} tamano={26} />
          </span>
        }
      >
        <Boton tamano="lg" ancho iconoDer={ArrowRight} onClick={() => navegar('/recuperar', { replace: true })}>
          Pedir otro enlace
        </Boton>
      </Acceso>
    );

  const largo = contrasena.length >= MINIMO;
  const coinciden = repetida.length > 0 && repetida === contrasena;
  const requisitos: [string, boolean][] = [
    [`${MINIMO} caracteres o más`, largo],
    ['Las dos coinciden', coinciden],
  ];

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!largo || !coinciden || guardando) return;
    setGuardando(true);
    setError(null);
    const { error: fallo } = await supabase.auth.updateUser({ password: contrasena });
    if (!fallo) {
      avisar('Contraseña actualizada');
      navegar('/', { replace: true });
      return;
    }
    setGuardando(false);
    if (fallo.code === 'same_password') setError('Tiene que ser distinta de la que tenías.');
    else if (fallo.code === 'weak_password') setError(`Usá al menos ${MINIMO} caracteres.`);
    else if (fallo.status === 401 || fallo.code === 'session_not_found') setVencido(true);
    else setError('No pudimos guardarla. Probá de nuevo en unos segundos.');
  }

  const ojo = (
    <BotonIcono icono={mostrar ? EyeOff : Eye} etiqueta={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'} tamano="sm" onClick={() => setMostrar((m) => !m)} />
  );

  return (
    <Acceso titulo="Elegí una contraseña nueva" bajada={session.user.email ? `Para ${session.user.email}` : ''} onSubmit={guardar}>
      <div className={styles.campos}>
        <Campo
          rotulo="Contraseña nueva"
          icono={Lock}
          type={mostrar ? 'text' : 'password'}
          autoComplete="new-password"
          value={contrasena}
          onChange={(e) => {
            setContrasena(e.target.value);
            setError(null);
          }}
          disabled={guardando}
          final={ojo}
          autoFocus
        />
        <Campo
          rotulo="Repetila"
          icono={Lock}
          type={mostrar ? 'text' : 'password'}
          autoComplete="new-password"
          value={repetida}
          onChange={(e) => {
            setRepetida(e.target.value);
            setError(null);
          }}
          disabled={guardando}
          error={error}
        />
      </div>
      <ul className={styles.requisitos} aria-label="Requisitos">
        {requisitos.map(([etiqueta, ok]) => (
          <li key={etiqueta} className={`${styles.requisito} ${texto.bodySm} ${ok ? texto.primario : texto.terciario}`}>
            <Icono icono={ok ? Check : Circle} tamano={16} className={ok ? texto.acento : ''} />
            {etiqueta}
          </li>
        ))}
      </ul>
      <Boton type="submit" tamano="lg" ancho icono={guardando ? undefined : Check} disabled={!largo || !coinciden} cargando={guardando}>
        {guardando ? 'Guardando…' : 'Guardar y entrar'}
      </Boton>
    </Acceso>
  );
}
