/* Menu de acciones (kit web, .w-menu): reemplaza a la hoja de acciones de la
   app. Se abre con el boton ⋯; las flechas recorren las opciones, Enter
   elige y Esc o un clic afuera lo cierran y devuelven el foco al boton.
   Una opcion puede llevar una linea arriba (separada) y su atajo a la
   derecha (como Supr en Eliminar). Si abajo no entra (el fin de la ventana
   o, en el teléfono, la barra inferior), se abre hacia arriba; si hacia la
   izquierda se sale de la pantalla, se abre hacia la derecha. */

import { Ellipsis, type LucideIcon } from 'lucide-react';
import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';

import { BotonIcono } from './BotonIcono';
import { Icono } from './Icono';
import { Kbd } from './varios';
import styles from './Menu.module.css';

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
   *  botones grandes, va en vidrio y mediano. */
  variante?: 'ghost' | 'surface';
  tamano?: 'sm' | 'md';
}

export function Menu({ etiqueta, opciones, className = '', variante = 'ghost', tamano = 'sm' }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [haciaArriba, setHaciaArriba] = useState(false);
  const [haciaDerecha, setHaciaDerecha] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  const items = () => [...(caja.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])];
  const cerrar = (devolverFoco: boolean) => {
    setAbierto(false);
    if (devolverFoco) caja.current?.querySelector<HTMLButtonElement>('[aria-haspopup]')?.focus();
  };

  // Antes de pintarlo: si abajo no entra y arriba si, se abre hacia arriba.
  useLayoutEffect(() => {
    if (!abierto || !menu.current || !caja.current) return;
    const barra = document.querySelector('[data-barra-inferior]')?.getBoundingClientRect();
    const piso = barra && barra.height > 0 ? barra.top : window.innerHeight;
    const alto = menu.current.offsetHeight + 6;
    const ancla = caja.current.getBoundingClientRect();
    setHaciaArriba(ancla.bottom + alto > piso && ancla.top - alto >= 0);
    // Se alinea al borde derecho del boton; si asi se sale por la izquierda,
    // al izquierdo.
    setHaciaDerecha(ancla.right - menu.current.offsetWidth < 0);
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    items()[0]?.focus();
    const afuera = (evento: PointerEvent) => {
      if (!caja.current?.contains(evento.target as Node)) setAbierto(false);
    };
    document.addEventListener('pointerdown', afuera);
    return () => document.removeEventListener('pointerdown', afuera);
  }, [abierto]);

  function alTeclear(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      evento.stopPropagation();
      cerrar(true);
      return;
    }
    if (evento.key !== 'ArrowDown' && evento.key !== 'ArrowUp') return;
    evento.preventDefault();
    const lista = items();
    const actual = lista.indexOf(document.activeElement as HTMLButtonElement);
    const paso = evento.key === 'ArrowDown' ? 1 : -1;
    lista[(actual + paso + lista.length) % lista.length]?.focus();
  }

  return (
    <div ref={caja} className={`${styles.ancla} ${className}`} onKeyDown={abierto ? alTeclear : undefined}>
      <BotonIcono
        icono={Ellipsis}
        variante={variante}
        tamano={tamano}
        etiqueta={etiqueta}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? id : undefined}
        onClick={() => setAbierto((a) => !a)}
      />
      {abierto ? (
        <div ref={menu} id={id} role="menu" aria-label={etiqueta} className={`${styles.menu} ${haciaArriba ? styles.arriba : ''} ${haciaDerecha ? styles.derecha : ''}`}>
          {opciones.map((o) => (
            <Fragment key={o.etiqueta}>
              {o.separada ? <div role="separator" className={styles.separador} /> : null}
              <button
                type="button"
                role="menuitem"
                disabled={o.disabled}
                className={`${styles.item} ${o.peligro ? styles.peligro : ''}`}
                onClick={() => {
                  cerrar(true);
                  o.alElegir();
                }}
              >
                <Icono icono={o.icono} tamano={18} />
                <span className={styles.etiqueta}>{o.etiqueta}</span>
                {o.atajo ? <Kbd>{o.atajo}</Kbd> : null}
              </button>
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}
