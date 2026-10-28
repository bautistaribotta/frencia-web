/* Boton sobre el Button de shadcn/ui. Conserva la API de la app:
   primary (default), secondary (outline), ghost, soft (ghost con el texto en
   foreground) y danger (destructive), en sm (32 px), md (36 px) y lg (40 px).
   Los iconos siguen animando (Icono). Cargando: la ruedita reemplaza al
   icono y el texto queda, para que no salte el ancho. */

import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icono } from './Icono';
import { Ruedita } from './Ruedita';

export type VarianteBoton = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  tamano?: 'sm' | 'md' | 'lg';
  icono?: LucideIcon;
  iconoDer?: LucideIcon;
  ancho?: boolean;
  cargando?: boolean;
}

const VARIANTE = {
  primary: 'default',
  secondary: 'outline',
  ghost: 'ghost',
  soft: 'ghost',
  danger: 'destructive',
} as const;

const TAMANO = {
  sm: 'h-8 gap-1.5 px-3 text-[13px]',
  md: 'h-9 gap-2 px-4',
  lg: 'h-10 gap-2 px-5',
};

export function Boton({
  variante = 'primary',
  tamano = 'md',
  icono,
  iconoDer,
  ancho = false,
  cargando = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...resto
}: Props) {
  const tamanoIcono = tamano === 'sm' ? 16 : 16;
  return (
    <Button
      {...resto}
      type={type}
      variant={VARIANTE[variante]}
      className={cn(TAMANO[tamano], ancho && 'w-full', cargando && 'cursor-progress', className)}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
    >
      {cargando ? <Ruedita /> : icono ? <Icono icono={icono} tamano={tamanoIcono} /> : null}
      {children ? <span>{children}</span> : null}
      {iconoDer && !cargando ? <Icono icono={iconoDer} tamano={tamanoIcono} /> : null}
    </Button>
  );
}
