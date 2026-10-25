/* Fondo de luces: la base bg-app, tres luces radiales en una de cinco
   posiciones fijas, el grano y el velo. Cada pantalla elige la posicion
   segun donde esta su contenido (ver el README del kit web). */

import styles from './Fondo.module.css';

export type PosicionFondo = 'cumbre' | 'centro' | 'flanco' | 'base' | 'velada';

interface Props {
  posicion: PosicionFondo;
  /** Las luces derivan despacio. Solo en el onboarding. */
  animado?: boolean;
}

export function Fondo({ posicion, animado = false }: Props) {
  const clases = [styles.fondo, styles[posicion], animado ? styles.animado : ''].join(' ');
  return (
    <div className={clases} aria-hidden="true" data-posicion={posicion}>
      <div className={`${styles.luz} ${styles.luzA}`} />
      <div className={`${styles.luz} ${styles.luzB}`} />
      <div className={`${styles.luz} ${styles.luzC}`} />
      <div className={styles.grano} />
      <div className={styles.velo} />
    </div>
  );
}
