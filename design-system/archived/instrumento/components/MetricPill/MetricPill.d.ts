import * as React from 'react';

export interface MetricPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Leading Lucide icon name. */
  icon?: string;
  /** Rotulo en mayusculas. */
  label?: string;
  /** The value (string or node). */
  value: React.ReactNode;
  /** `green`/`orange` siguen como alias de `signal`/`intensity`. */
  tone?: 'neutral' | 'signal' | 'intensity';
  /** `stack` = label over value; `inline` = side by side. */
  layout?: 'stack' | 'inline';
}

/** Compact inline metric chip — rest timer, RIR, pace, heart-rate readouts. */
export function MetricPill(props: MetricPillProps): React.ReactElement;
