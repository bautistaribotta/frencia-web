/* Opciones grandes con radio (kit web, .w-opcion): una tarjeta de vidrio por
   opcion, la elegida con borde de acento y el punto lleno. Es un radiogroup
   real: las flechas mueven la eleccion y Tab entra solo a la elegida. */

import type { LucideIcon } from 'lucide-react';
import { useRef, type KeyboardEvent } from 'react';

import { Icono } from './Icono';
import styles from './Opciones.module.css';

export interface Opcion<T extends string> {
  valor: T;
  titulo: string;
  texto?: string;
  icono?: LucideIcon;
}

interface Props<T extends string> {
  etiqueta: string;
  opciones: Opcion<T>[];
  valor: T | null;
  onChange: (valor: T) => void;
  autoFocus?: boolean;
}

export function Opciones<T extends string>({ etiqueta, opciones, valor, onChange, autoFocus = false }: Props<T>) {
  const grupo = useRef<HTMLDivElement>(null);
  const elegida = opciones.findIndex((o) => o.valor === valor);

  function alTeclear(e: KeyboardEvent<HTMLDivElement>) {
    const paso = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!paso) return;
    e.preventDefault();
    const siguiente = (Math.max(elegida, 0) + paso + opciones.length) % opciones.length;
    onChange(opciones[siguiente].valor);
    grupo.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[siguiente]?.focus();
  }

  return (
    <div ref={grupo} className={styles.grupo} role="radiogroup" aria-label={etiqueta} onKeyDown={alTeclear}>
      {opciones.map((o, i) => {
        const sel = o.valor === valor;
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={sel}
            tabIndex={sel || (elegida < 0 && i === 0) ? 0 : -1}
            autoFocus={autoFocus && (sel || (elegida < 0 && i === 0))}
            className={`${styles.opcion} ${sel ? styles.sel : ''}`}
            onClick={() => onChange(o.valor)}
          >
            {o.icono ? (
              <span className={styles.icono}>
                <Icono icono={o.icono} tamano={20} />
              </span>
            ) : null}
            <span className={styles.textos}>
              <span>{o.titulo}</span>
              {o.texto ? <span className={styles.texto}>{o.texto}</span> : null}
            </span>
            <span className={styles.radio} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
