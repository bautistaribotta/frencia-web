import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';

import texto from '../texto.module.css';
import { Icono } from './Icono';
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

/** Insignia en mayusculas. signal: estado (En curso); intensity: la racha. */
export function Insignia({
  tono,
  icono,
  children,
}: {
  tono?: 'signal' | 'intensity';
  icono?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className={`${styles.insignia} ${tono ? styles[tono] : ''}`}>
      {icono ? <Icono icono={icono} tamano={12} /> : null}
      {children}
    </span>
  );
}

const SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/** Tira de siete dias con los asignados en tinta. 0 = lunes. */
export function TiraSemana({ marcados }: { marcados: number[] }) {
  return (
    <div className={styles.semana}>
      {SEMANA.map((d, i) => (
        <span key={d} className={marcados.includes(i) ? styles.semanaOn : ''}>
          {d}
        </span>
      ))}
    </div>
  );
}

/** Bloque gris que brilla mientras carga, con la forma del contenido. */
export function Esqueleto({ className = '' }: { className?: string }) {
  return <span className={`${styles.esqueleto} ${className}`} aria-hidden="true" />;
}
