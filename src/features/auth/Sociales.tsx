/* Ingreso con Apple y Google, debajo del formulario. Los logos son los de
   cada marca: el de Google lleva sus cuatro colores, el de Apple la tinta. */

import { Boton } from '@/design/components/Boton';
import { Divisor } from '@/design/components/varios';
import styles from './Acceso.module.css';

function LogoGoogle() {
  return (
    <svg className={styles.logo} viewBox="0 0 24 24" aria-hidden="true">
      <path className={styles.googleAzul} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path className={styles.googleVerde} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path className={styles.googleAmarillo} d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path className={styles.googleRojo} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function LogoApple() {
  return (
    <svg className={`${styles.logo} ${styles.logoApple}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.21 1.11-.05 1.53-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.15.85-1.23 1.19-2.43 1.21-2.49-.03-.01-2.31-.89-2.34-3.53zM14.19 6.14c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.55.64-1.05 1.69-.92 2.68.98.08 1.97-.49 2.58-1.23z" />
    </svg>
  );
}

interface Props {
  deshabilitado?: boolean;
}

export function Sociales({ deshabilitado = false }: Props) {
  return (
    <>
      <Divisor>o continuá con</Divisor>
      <div className={styles.fila}>
        <Boton variante="secondary" disabled={deshabilitado}>
          <span className={styles.conLogo}>
            <LogoApple />
            Apple
          </span>
        </Boton>
        <Boton variante="secondary" disabled={deshabilitado}>
          <span className={styles.conLogo}>
            <LogoGoogle />
            Google
          </span>
        </Boton>
      </div>
    </>
  );
}
