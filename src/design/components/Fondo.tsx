/* Fondo vivo (prueba): el mismo gradiente animado del hero de la landing
   (GradienteVivo.astro de frencia-landing). Manchas de verde Lume que derivan
   despacio sobre bg-app, un abanico conico que gira, el grano y el velo. Por
   ahora es igual en todas las pantallas: la posicion queda solo como dato. */

import styles from './Fondo.module.css';

export type PosicionFondo = 'cumbre' | 'centro' | 'flanco' | 'base' | 'velada';

interface Props {
  posicion: PosicionFondo;
  /** Sin efecto en el fondo vivo: siempre se mueve. */
  animado?: boolean;
}

export function Fondo({ posicion }: Props) {
  return (
    <div className={styles.fondo} aria-hidden="true" data-posicion={posicion}>
      <div className={`${styles.mancha} ${styles.manchaA}`} />
      <div className={`${styles.mancha} ${styles.manchaB}`} />
      <div className={`${styles.mancha} ${styles.manchaC}`} />
      <div className={`${styles.mancha} ${styles.manchaD}`} />
      <div className={`${styles.mancha} ${styles.manchaE}`} />
      <div className={`${styles.mancha} ${styles.manchaF}`} />
      <div className={styles.aurora} />
      <div className={styles.grano} />
      <div className={styles.velo} />
    </div>
  );
}
