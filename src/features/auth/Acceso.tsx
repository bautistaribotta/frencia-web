/* Marco comun de login y registro: el fondo de luces (cumbre, anima, como
   todo el onboarding), el switch de tema arriba del lado del formulario, el
   formulario en vidrio y el billete, que lleva la marca. */

import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router';

import { Fondo } from '@/design/components/Fondo';
import { SwitchTema } from '@/design/components/SwitchTema';
import { Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import styles from './Acceso.module.css';
import { Billete } from './Billete';
import './transicion.css';

interface Props {
  /** Login lleva el billete a la izquierda; el registro, a la derecha. */
  billete: 'izquierda' | 'derecha';
  titulo: string;
  bajada: string;
  onSubmit: (evento: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function Acceso({ billete, titulo, bajada, onSubmit, children }: Props) {
  const izquierda = billete === 'izquierda';

  const columna = (
    <div className={styles.columna}>
      <SwitchTema className={styles.tema} />
      <Tarjeta className={styles.tarjeta}>
        <form className={styles.formulario} onSubmit={onSubmit} noValidate>
          <div className={styles.encabezado}>
            <h1 className={texto.title}>{titulo}</h1>
            <span className={`${texto.bodySm} ${texto.secundario}`}>{bajada}</span>
          </div>
          {children}
        </form>
      </Tarjeta>
      <span className={`${texto.bodySm} ${texto.terciario} ${styles.legal}`}>
        Al continuar, aceptás los{' '}
        <Link to="/terminos" className={styles.enlace}>
          Términos y Condiciones
        </Link>{' '}
        y la{' '}
        <Link to="/privacidad" className={styles.enlace}>
          Política de Privacidad
        </Link>
        .
      </span>
    </div>
  );

  return (
    <>
      <Fondo posicion="cumbre" animado />
      <main className={`${styles.acceso} ${izquierda ? styles.billeteIzq : ''}`}>
        {izquierda ? (
          <>
            <Billete />
            {columna}
          </>
        ) : (
          <>
            {columna}
            <Billete />
          </>
        )}
      </main>
    </>
  );
}
