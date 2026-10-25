/* Icono de Lucide con el trazo del sistema (1.75) y el color del texto.
   Tamaños: 16 en linea, 18-20 en controles, 24 en navegacion. */

import type { LucideIcon } from 'lucide-react';

interface Props {
  icono: LucideIcon;
  tamano?: 14 | 16 | 18 | 20 | 24 | 26 | 28 | 32;
  className?: string;
}

export function Icono({ icono: Componente, tamano = 20, className }: Props) {
  return <Componente size={tamano} strokeWidth={1.75} className={className} aria-hidden="true" focusable="false" />;
}
