/* Boton de solo icono sobre el Button de shadcn/ui: ghost o surface
   (outline), en md (36 px) y sm (32 px). El nombre accesible va en
   `etiqueta`, que tambien es el title. */

import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icono } from './Icono';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icono: LucideIcon;
  /** Nombre accesible: el boton no tiene texto visible. */
  etiqueta: string;
  variante?: 'ghost' | 'surface';
  tamano?: 'sm' | 'md';
}

export function BotonIcono({ icono, etiqueta, variante = 'ghost', tamano = 'md', className = '', type = 'button', ...resto }: Props) {
  return (
    <Button
      {...resto}
      type={type}
      variant={variante === 'surface' ? 'outline' : 'ghost'}
      size={tamano === 'sm' ? 'icon' : 'icon-lg'}
      className={cn(variante === 'ghost' && 'text-muted-foreground hover:text-foreground', className)}
      aria-label={etiqueta}
      title={etiqueta}
    >
      <Icono icono={icono} tamano={16} />
    </Button>
  );
}
