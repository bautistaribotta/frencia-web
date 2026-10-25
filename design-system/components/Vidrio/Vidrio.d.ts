import * as React from 'react';

export interface VidrioProps extends React.HTMLAttributes<HTMLElement> {
  /** `normal` tarjeta (surface-card), `fuerte` algo mas opaco (surface-card-elevated), `denso` barras y hojas (surface-raised + blur-sheet). */
  nivel?: 'normal' | 'fuerte' | 'denso';
  /** Forma de pildora (radius-pill). */
  pill?: boolean;
  /** Elemento a renderizar. Por defecto `div`. */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/** Panel de vidrio: relleno translucido, borde glass-line, blur y brillo interior (shadow-glass). Va sobre un <Fondo>. */
export function Vidrio(props: VidrioProps): React.ReactElement;
