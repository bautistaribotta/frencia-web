import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

import styles from './BotonIcono.module.css';
import { Icono } from './Icono';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icono: LucideIcon;
  /** Nombre accesible: el boton no tiene texto visible. */
  etiqueta: string;
  variante?: 'ghost' | 'surface';
  tamano?: 'sm' | 'md';
}

export function BotonIcono({ icono, etiqueta, variante = 'ghost', tamano = 'md', className = '', type = 'button', ...resto }: Props) {
  const clases = [styles.botonIcono, variante === 'surface' ? styles.surface : '', tamano === 'sm' ? styles.sm : '', className].join(' ');
  return (
    <button {...resto} type={type} className={clases} aria-label={etiqueta} title={etiqueta}>
      <Icono icono={icono} tamano={tamano === 'sm' ? 16 : 20} />
    </button>
  );
}
