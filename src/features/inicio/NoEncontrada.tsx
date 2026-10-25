import { Link } from 'react-router';

import styles from './Portada.module.css';

export function NoEncontrada() {
  return (
    <main className={styles.portada}>
      <h1 className={styles.marca}>404</h1>
      <p className={styles.estado}>Esta página no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}
