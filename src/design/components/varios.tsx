import type { HTMLAttributes, ReactNode } from 'react';

import texto from '../texto.module.css';
import styles from './varios.module.css';

/** El nombre FRENCIA. en Instrument Sans condensada y negrita. Una sola tinta. */
export function Marca({ grande = false, className = '' }: { grande?: boolean; className?: string }) {
  return (
    <span className={`${styles.marca} ${grande ? styles.marcaGrande : ''} ${className}`} aria-label="Frencia">
      FRENCIA.
    </span>
  );
}

interface PropsTarjeta extends HTMLAttributes<HTMLDivElement> {
  elevada?: boolean;
}

/** Panel de vidrio: todo lo que agrupa contenido. */
export function Tarjeta({ elevada = false, className = '', ...resto }: PropsTarjeta) {
  return <div {...resto} className={`${styles.tarjeta} ${elevada ? styles.tarjetaElevada : ''} ${className}`} />;
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className={styles.kbd}>{children}</kbd>;
}

/** Linea con un rotulo al centro: "o continuá con". */
export function Divisor({ children }: { children: ReactNode }) {
  return (
    <div className={styles.divisor}>
      <span className={`${texto.label} ${texto.terciario}`}>{children}</span>
    </div>
  );
}
