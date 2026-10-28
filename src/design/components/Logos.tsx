/* Logos de marcas ajenas, tal cual los pide cada marca: la manzana de Apple
   en la tinta del texto y el triangulo de Google Play con sus cuatro colores.
   Van dentro de botones (ingresar con Apple, bajar la app de cada tienda). */

import styles from './Logos.module.css';

export function LogoApple() {
  return (
    <svg className={`${styles.logo} ${styles.apple}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.21 1.11-.05 1.53-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.15.85-1.23 1.19-2.43 1.21-2.49-.03-.01-2.31-.89-2.34-3.53zM14.19 6.14c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.55.64-1.05 1.69-.92 2.68.98.08 1.97-.49 2.58-1.23z" />
    </svg>
  );
}

export function LogoGooglePlay() {
  return (
    <svg className={styles.logo} viewBox="0 0 24 24" aria-hidden="true">
      <path className={styles.playAzul} d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1z" />
      <path className={styles.playVerde} d="M3.6 1.8 13.8 12l3-3L5.2 2c-.6-.4-1.2-.4-1.6-.2z" />
      <path className={styles.playRojo} d="M3.6 22.2 13.8 12l3 3-11.6 7c-.6.4-1.2.4-1.6.2z" />
      <path className={styles.playAmarillo} d="m16.8 9 3.6 2.1c.7.4.7 1.4 0 1.8L16.8 15l-3-3z" />
    </svg>
  );
}
