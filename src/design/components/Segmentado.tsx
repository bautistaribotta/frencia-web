/* Selector segmentado (kit web, .w-seg): una opcion entre pocas, como un
   grupo de radios. Las flechas mueven la eleccion, como en un radiogroup. */

import type { LucideIcon } from 'lucide-react';
import { useRef, type KeyboardEvent } from 'react';

import { Icono } from './Icono';
import styles from './Segmentado.module.css';

export interface OpcionSegmentado<T extends string> {
  valor: T;
  etiqueta: string;
  icono?: LucideIcon;
}

interface Props<T extends string> {
  opciones: OpcionSegmentado<T>[];
  valor: T;
  onChange: (valor: T) => void;
  etiqueta: string;
  ancho?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Segmentado<T extends string>({ opciones, valor, onChange, etiqueta, ancho = false, disabled = false, className = '' }: Props<T>) {
  const grupo = useRef<HTMLDivElement>(null);

  function alTeclear(evento: KeyboardEvent<HTMLDivElement>) {
    const paso = evento.key === 'ArrowRight' || evento.key === 'ArrowDown' ? 1 : evento.key === 'ArrowLeft' || evento.key === 'ArrowUp' ? -1 : 0;
    if (!paso) return;
    evento.preventDefault();
    const actual = opciones.findIndex((o) => o.valor === valor);
    const siguiente = (actual + paso + opciones.length) % opciones.length;
    onChange(opciones[siguiente].valor);
    grupo.current?.querySelectorAll<HTMLButtonElement>('button')[siguiente]?.focus();
  }

  return (
    <div
      ref={grupo}
      role="radiogroup"
      aria-label={etiqueta}
      className={`${styles.seg} ${ancho ? styles.ancho : ''} ${className}`}
      onKeyDown={alTeclear}
    >
      {opciones.map((o) => {
        const elegida = o.valor === valor;
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={elegida}
            tabIndex={elegida ? 0 : -1}
            disabled={disabled}
            className={`${styles.opcion} ${elegida ? styles.elegida : ''}`}
            onClick={() => onChange(o.valor)}
          >
            {o.icono ? <Icono icono={o.icono} tamano={16} /> : null}
            {o.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
