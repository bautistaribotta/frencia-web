import * as React from 'react';

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rotulo en mayusculas arriba del numero. */
  label?: string;
  /** The headline number (string or node). */
  value: React.ReactNode;
  /** Trailing unit (e.g. "kg", "min"). */
  unit?: string;
  /** Optional change indicator value (e.g. "+5"). */
  delta?: React.ReactNode;
  /** Direction of the delta arrow/color. */
  deltaDir?: 'up' | 'down';
  /** Numeral scale. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color del numero: `signal` (acero) o `intensity` (ambar). `green`/`orange` siguen como alias. */
  tone?: 'default' | 'signal' | 'intensity';
  children?: React.ReactNode;
}

/**
 * El numero como mensaje: cifras condensadas y tabulares bajo un rotulo,
 * with an optional progression delta.
 */
export function StatTile(props: StatTileProps): React.ReactElement;
