/* Interruptor de encendido y apagado (role="switch"). */

import type { ButtonHTMLAttributes } from 'react';

import styles from './Interruptor.module.css';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'role'> {
  encendido: boolean;
  onChange: (encendido: boolean) => void;
  etiqueta: string;
}

export function Interruptor({ encendido, onChange, etiqueta, className = '', ...resto }: Props) {
  return (
    <button
      {...resto}
      type="button"
      role="switch"
      aria-checked={encendido}
      aria-label={etiqueta}
      className={`${styles.interruptor} ${className}`}
      onClick={() => onChange(!encendido)}
    />
  );
}
