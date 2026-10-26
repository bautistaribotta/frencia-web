import * as React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (or, when `segments` set, number of filled segments). */
  value?: number;
  /** Max for continuous mode. Default 100. */
  max?: number;
  /** Rotulo en mayusculas arriba de la pista. */
  label?: string;
  /** Show the % (or n/total) on the right. */
  showValue?: boolean;
  /** Relleno: `accent` (tinta, por defecto), `signal` o `intensity`. `green`/`orange` siguen como alias. */
  tone?: 'accent' | 'signal' | 'intensity';
  size?: 'sm' | 'md' | 'lg';
  /** Render as N discrete segments (e.g. sets completed) instead of a bar. */
  segments?: number;
}

/** Progress / completion bar — continuous or segmented (sets done). */
export function ProgressBar(props: ProgressBarProps): React.ReactElement;
