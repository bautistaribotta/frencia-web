import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `default` plana con hairline, `elevated` flotante con sombra, `inset` pozo, `signal`/`intensity` estado. `green`/`orange` siguen como alias. */
  variant?: 'default' | 'elevated' | 'inset' | 'signal' | 'intensity';
  /** Add a subtle hairline border. */
  hairline?: boolean;
  /** Press/hover affordance for tappable cards. */
  interactive?: boolean;
  children?: React.ReactNode;
}

/** Surface container. Steps by lightness; reserve `elevated` shadow for floating content. */
export function Card(props: CardProps): React.ReactElement;
