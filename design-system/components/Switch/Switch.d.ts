import * as React from 'react';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** On/off state (controlled). */
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

/** Interruptor iOS: pista de tinta encendido, pulgar en text-on-accent. */
export function Switch(props: SwitchProps): React.ReactElement;
