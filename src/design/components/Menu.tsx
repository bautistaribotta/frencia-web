/* Menu de acciones sobre el DropdownMenu de shadcn/ui (Base UI): se abre con
   el boton ⋯; las flechas recorren las opciones, Enter elige y Esc o un clic
   afuera lo cierran y devuelven el foco al boton. Una opcion puede llevar
   una linea arriba (separada) y su atajo a la derecha (como Supr en
   Eliminar). El posicionado da vuelta solo si no entra (abajo, arriba o a
   los costados), tambien sobre la barra inferior del teléfono. */

import { Ellipsis, type LucideIcon } from 'lucide-react';
import { Fragment, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';
import { Icono } from './Icono';

export interface OpcionMenu {
  etiqueta: string;
  icono: LucideIcon;
  alElegir: () => void;
  peligro?: boolean;
  disabled?: boolean;
  /** Linea divisoria arriba de la opcion. */
  separada?: boolean;
  atajo?: string;
}

interface Props {
  etiqueta: string;
  opciones: OpcionMenu[];
  className?: string;
  /** El boton ⋯: chico y fantasma en las filas; en un encabezado, al lado de
   *  botones grandes, va con borde y mediano. */
  variante?: 'ghost' | 'surface';
  tamano?: 'sm' | 'md';
}

export function Menu({ etiqueta, opciones, className = '', variante = 'ghost', tamano = 'sm' }: Props) {
  const lista = useRef<HTMLDivElement>(null);

  // Al abrirse (tambien con el mouse) el foco va a la primera opcion
  // habilitada, para seguir con las flechas.
  function alAbrir(abierto: boolean) {
    if (!abierto) return;
    requestAnimationFrame(() => lista.current?.querySelector<HTMLElement>('[role="menuitem"]:not([data-disabled])')?.focus());
  }

  return (
    <DropdownMenu onOpenChange={alAbrir}>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variante === 'surface' ? 'outline' : 'ghost'}
            size={tamano === 'sm' ? 'icon' : 'icon-lg'}
            className={cn(variante === 'ghost' && 'text-muted-foreground hover:text-foreground', className)}
            aria-label={etiqueta}
            title={etiqueta}
          />
        }
      >
        <Icono icono={Ellipsis} tamano={16} />
      </DropdownMenuTrigger>
      {/* Abajo deja lugar a la barra inferior del teléfono. */}
      <DropdownMenuContent
        ref={lista}
        align="end"
        collisionPadding={{ top: 8, right: 8, left: 8, bottom: 76 }}
        aria-label={etiqueta}
        className="w-auto min-w-48"
      >
        {opciones.map((o) => (
          <Fragment key={o.etiqueta}>
            {o.separada ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem variant={o.peligro ? 'destructive' : 'default'} disabled={o.disabled} onClick={o.alElegir} className="gap-2 px-2 py-1.5">
              <Icono icono={o.icono} tamano={16} className={o.peligro ? undefined : 'text-muted-foreground'} />
              <span className="flex-1">{o.etiqueta}</span>
              {o.atajo ? <Kbd className="ml-auto">{o.atajo}</Kbd> : null}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
