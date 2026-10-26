import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` = tinta (la accion principal), `intensity` = ambar (PR/esfuerzo), `secondary` = hairline, `ghost` = texto, `soft` = texto en senal, `danger` = carmin delineado. */
  variant?: 'primary' | 'intensity' | 'secondary' | 'ghost' | 'soft' | 'danger';
  /** Control height. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Lucide icon name rendered before the label (e.g. "plus", "play"). */
  icon?: string;
  /** Lucide icon name rendered after the label (e.g. "chevron-right"). */
  iconRight?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Boton de Frencia. primary es tinta: marfil en oscuro, casi negro en claro.
 * intensity (ambar) solo para PR y esfuerzo, uno por pantalla como mucho.
 */
export function Button(props: ButtonProps): React.ReactElement;
