import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

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

/** Avance de un paso a paso (kit web, .w-escala): lo hecho en tinta, el
 *  paso actual en lume. */
export function Escala({ total, actual }: { total: number; actual: number }) {
  return (
    <div className={styles.escala} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={actual + 1} aria-label={`Paso ${actual + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < actual ? styles.escalaHecha : i === actual ? styles.escalaActual : ''} />
      ))}
    </div>
  );
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
  tono?: 'signal' | 'intensity' | 'danger';
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

const SEMANA_NOMBRES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

/** La tira de siete dias para elegir (kit web, .w-semana--edit): cada dia es
 *  un boton que se prende en accent. */
export function SemanaEditable({ marcados, onAlternar, etiqueta }: { marcados: number[]; onAlternar: (dia: number) => void; etiqueta: string }) {
  return (
    <div className={`${styles.semana} ${styles.semanaEditable}`} role="group" aria-label={etiqueta}>
      {SEMANA.map((d, i) => (
        <button
          key={d}
          type="button"
          aria-pressed={marcados.includes(i)}
          aria-label={SEMANA_NOMBRES[i]}
          className={marcados.includes(i) ? styles.semanaOn : ''}
          onClick={() => onAlternar(i)}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

interface PropsChip extends ButtonHTMLAttributes<HTMLButtonElement> {
  elegido: boolean;
  icono?: LucideIcon;
}

/** Filtro en pildora (kit web, .w-chip); elegido va en accent. */
export function Chip({ elegido, icono, className = '', children, type = 'button', ...resto }: PropsChip) {
  return (
    <button {...resto} type={type} aria-pressed={elegido} className={`${styles.chip} ${elegido ? styles.chipElegido : ''} ${className}`}>
      {icono ? <Icono icono={icono} tamano={14} /> : null}
      {children}
    </button>
  );
}

/** Casilla de verificacion (kit web, .w-check) con su texto al lado. */
export function Casilla({ marcada, onChange, children }: { marcada: boolean; onChange: (marcada: boolean) => void; children: ReactNode }) {
  return (
    <label className={styles.casilla}>
      <input type="checkbox" checked={marcada} onChange={(evento) => onChange(evento.target.checked)} className={styles.casillaNativa} />
      <span className={styles.casillaCaja} aria-hidden="true">
        {marcada ? <Check size={14} strokeWidth={2.25} /> : null}
      </span>
      {children}
    </label>
  );
}

/** Bloque gris que brilla mientras carga, con la forma del contenido. */
export function Esqueleto({ className = '' }: { className?: string }) {
  return <span className={`${styles.esqueleto} ${className}`} aria-hidden="true" />;
}
