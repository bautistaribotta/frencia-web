import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `default` vidrio, `elevated` vidrio mas opaco, `inset` pozo, `signal`/`intensity` estado. `green`/`orange` siguen como alias. */
  variant?: 'default' | 'elevated' | 'inset' | 'signal' | 'intensity';
  /** Add a subtle hairline border. */
  hairline?: boolean;
  /** Press/hover affordance for tappable cards. */
  interactive?: boolean;
  children?: React.ReactNode;
}

/** Tarjeta de vidrio sobre el Fondo. Las variantes marcan estado, no decoran. */
export function Card(props: CardProps): React.ReactElement;
