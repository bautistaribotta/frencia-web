/* Menu de acciones (kit web, .w-menu): reemplaza a la hoja de acciones de la
   app. Se abre con el boton ⋯; las flechas recorren las opciones, Enter
   elige y Esc o un clic afuera lo cierran y devuelven el foco al boton. */

import { Ellipsis, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { BotonIcono } from './BotonIcono';
import { Icono } from './Icono';
import styles from './Menu.module.css';

export interface OpcionMenu {
  etiqueta: string;
  icono: LucideIcon;
  alElegir: () => void;
  peligro?: boolean;
  disabled?: boolean;
}

interface Props {
  etiqueta: string;
  opciones: OpcionMenu[];
  className?: string;
}

export function Menu({ etiqueta, opciones, className = '' }: Props) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const id = useId();

  const items = () => [...(caja.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])];
  const cerrar = (devolverFoco: boolean) => {
    setAbierto(false);
    if (devolverFoco) caja.current?.querySelector<HTMLButtonElement>('[aria-haspopup]')?.focus();
  };

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
        tamano="sm"
        etiqueta={etiqueta}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? id : undefined}
        onClick={() => setAbierto((a) => !a)}
      />
      {abierto ? (
        <div id={id} role="menu" aria-label={etiqueta} className={styles.menu}>
          {opciones.map((o) => (
            <button
              key={o.etiqueta}
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
              <span>{o.etiqueta}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
