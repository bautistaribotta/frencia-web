import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color/role. Solid tones for emphatic states (e.g. NUEVO PR). */
  /** `green`, `green-solid`, `orange` y `orange-solid` siguen aceptados como alias. */
  tone?: 'neutral' | 'signal' | 'accent-solid' | 'intensity' | 'intensity-solid' | 'danger';
  /** Optional leading Lucide icon name. */
  icon?: string;
  children?: React.ReactNode;
}

/** Marca de estado compacta en mayusculas: tipo de serie, RIR/RPE, PR. */
export function Badge(props: BadgeProps): React.ReactElement;
