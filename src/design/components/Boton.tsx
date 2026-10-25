import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

import styles from './Boton.module.css';
import { Icono } from './Icono';
import { Ruedita } from './Ruedita';

export type VarianteBoton = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  tamano?: 'sm' | 'md' | 'lg';
  icono?: LucideIcon;
  iconoDer?: LucideIcon;
  ancho?: boolean;
  cargando?: boolean;
}

export function Boton({
  variante = 'primary',
  tamano = 'md',
  icono,
  iconoDer,
  ancho = false,
  cargando = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...resto
}: Props) {
  const tamanoIcono = tamano === 'sm' ? 16 : 18;
  const clases = [
    styles.boton,
    styles[variante],
    tamano === 'md' ? '' : styles[tamano],
    ancho ? styles.ancho : '',
    cargando ? styles.cargando : '',
    className,
  ].join(' ');

  return (
    <button {...resto} type={type} className={clases} disabled={disabled || cargando} aria-busy={cargando || undefined}>
      {cargando ? <Ruedita /> : icono ? <Icono icono={icono} tamano={tamanoIcono} /> : null}
      {children ? <span>{children}</span> : null}
      {iconoDer && !cargando ? <Icono icono={iconoDer} tamano={tamanoIcono} /> : null}
    </button>
  );
}
