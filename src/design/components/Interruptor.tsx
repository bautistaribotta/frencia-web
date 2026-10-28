/* Interruptor de encendido y apagado sobre el Switch de shadcn/ui
   (role="switch"). */

import { Switch } from '@/components/ui/switch';

interface Props {
  encendido: boolean;
  onChange: (encendido: boolean) => void;
  etiqueta: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Interruptor({ encendido, onChange, etiqueta, disabled, className, id }: Props) {
  return <Switch id={id} checked={encendido} onCheckedChange={(valor) => onChange(valor)} aria-label={etiqueta} disabled={disabled} className={className} />;
}
