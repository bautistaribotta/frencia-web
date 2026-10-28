/* Modal sobre el Dialog de shadcn/ui (Base UI): atrapa el foco, Esc cierra y
   el resto de la pagina queda inerte. El foco arranca en el control marcado
   con data-foco-inicial (en lo destructivo, Cancelar). Sin onCerrar no se
   puede descartar: ni Esc, ni la cruz, ni el clic afuera.
   Con `documento` toma el alto fijo de la lectura, la bajada pasa a rotulo
   (la fecha de vigencia) y el contenido scrollea adentro (DocumentoLegal).
   En el teléfono es una hoja pegada abajo, a todo el ancho. */

import { X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';

import { Dialog, DialogDescription, DialogPortal, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { BotonIcono } from './BotonIcono';

interface Props {
  abierto: boolean;
  titulo: string;
  texto?: string;
  chico?: boolean;
  documento?: boolean;
  onCerrar?: () => void;
  pie?: ReactNode;
  children?: ReactNode;
}

export function Modal({ abierto, titulo, texto: bajada, chico = false, documento = false, onCerrar, pie, children }: Props) {
  const popup = useRef<HTMLDivElement>(null);

  // El foco arranca en lo que ya se enfoco adentro (un autoFocus), si no en
  // lo marcado con data-foco-inicial (si es un bloque, su primer campo o
  // boton) y, si no hay, en el modal.
  function focoInicial(): HTMLElement | true {
    const caja = popup.current;
    if (!caja) return true;
    const activo = document.activeElement;
    if (activo instanceof HTMLElement && activo !== caja && caja.contains(activo)) return activo;
    const marcado = caja.querySelector<HTMLElement>('[data-foco-inicial]');
    if (!marcado) return true;
    if (marcado.matches('input, button, select, textarea, a[href]')) return marcado;
    return marcado.querySelector<HTMLElement>('input') ?? marcado.querySelector<HTMLElement>('button') ?? true;
  }

  return (
    <Dialog
      open={abierto}
      disablePointerDismissal={!onCerrar}
      onOpenChange={(abrir) => {
        if (!abrir) onCerrar?.();
      }}
    >
      <DialogPortal>
        <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/50 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none" />
        <DialogPrimitive.Popup
          ref={popup}
          initialFocus={focoInicial}
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-4rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-xl border bg-background p-6 text-foreground shadow-lg outline-none duration-100',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            chico ? 'max-w-[425px]' : 'max-w-lg',
            documento && 'h-[min(640px,calc(100dvh-4rem))] max-w-[720px] overflow-hidden',
            'max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:max-h-[calc(100dvh-2.5rem)] max-md:w-full max-md:max-w-full max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none max-md:rounded-t-xl max-md:border-x-0 max-md:border-b-0 max-md:pb-[calc(2rem+env(safe-area-inset-bottom))]',
            'max-md:data-open:slide-in-from-bottom-10 max-md:data-open:zoom-in-100',
            'motion-reduce:data-open:animate-none motion-reduce:data-closed:animate-none',
            documento && 'max-md:h-[calc(100dvh-2.5rem)]',
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <DialogTitle className="text-lg leading-tight font-semibold">{titulo}</DialogTitle>
              {bajada ? (
                <DialogDescription className={documento ? 'text-xs font-medium' : undefined}>{bajada}</DialogDescription>
              ) : null}
            </div>
            {onCerrar ? <BotonIcono icono={X} etiqueta="Cerrar" tamano="sm" className="-mt-1 -mr-2" onClick={onCerrar} /> : null}
          </div>
          {children}
          {pie ? <div className="flex flex-wrap justify-end gap-2">{pie}</div> : null}
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
