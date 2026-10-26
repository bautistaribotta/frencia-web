import * as React from 'react';

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Checked state (controlled). */
  checked?: boolean;
  /** Toggle handler. Omit it to render a static indicator that the parent marks. */
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

/**
 * Casilla cuadrada de Frencia. Marcada = relleno de tinta (accent) con el check
 * en text-on-accent; vacia = borde border-strong (3:1). Sin onChange es un
 * indicador estatico.
 */
export function Checkbox(props: CheckboxProps): React.ReactElement;
