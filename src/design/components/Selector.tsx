/* Selector (kit web, .w-select y .w-menu): la caja mediana del campo con el
   valor elegido y las flechas, y abajo la lista en vidrio en lugar del
   desplegable del sistema. El foco queda en la caja y la opcion activa se
   marca con aria-activedescendant:
   - Cerrado: flechas, Enter o Espacio lo abren en la opcion elegida.
   - Abierto: flechas, Inicio y Fin recorren; Enter o Espacio eligen; Esc,
     Tab o un clic afuera cierran sin cambiar.
   - Una letra salta a la siguiente opcion que empieza con ella (sin tildes).
   La elegida lleva el check en signal a la derecha. */

import { Check, ChevronsUpDown, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { Icono } from './Icono';
import styles from './Selector.module.css';

export interface OpcionSelector {
  valor: string;
  etiqueta: string;
}

interface Props {
  /** Nombre para lectores de pantalla: "Grupo muscular". */
  etiqueta: string;
  icono: LucideIcon;
  valor: string;
  opciones: OpcionSelector[];
  alCambiar: (valor: string) => void;
  className?: string;
}

const sinTildes = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function Selector({ etiqueta, icono, valor, opciones, alCambiar, className = '' }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(0);
  const caja = useRef<HTMLDivElement>(null);
  const id = useId();
  const elegida = Math.max(
    0,
    opciones.findIndex((o) => o.valor === valor),
  );
  const actual = opciones[elegida];

  // Un clic afuera cierra; la opcion activa siempre queda a la vista.
  useEffect(() => {
    if (!abierto) return;
    const afuera = (evento: PointerEvent) => {
      if (!caja.current?.contains(evento.target as Node)) setAbierto(false);
    };
    document.addEventListener('pointerdown', afuera);
    return () => document.removeEventListener('pointerdown', afuera);
  }, [abierto]);
  useEffect(() => {
    if (abierto) document.getElementById(`${id}-${activa}`)?.scrollIntoView({ block: 'nearest' });
  }, [abierto, activa, id]);

  function abrir() {
    setActiva(elegida);
    setAbierto(true);
  }

  function elegir(indice: number) {
    setAbierto(false);
    const opcion = opciones[indice];
    if (opcion && opcion.valor !== valor) alCambiar(opcion.valor);
  }

  function alTeclear(evento: KeyboardEvent<HTMLButtonElement>) {
    const tecla = evento.key;
    if (!abierto) {
      if (tecla === 'ArrowDown' || tecla === 'ArrowUp' || tecla === 'Enter' || tecla === ' ') {
        evento.preventDefault();
        abrir();
      }
      return;
    }
    if (tecla === 'Escape') {
      evento.preventDefault();
      evento.stopPropagation();
      setAbierto(false);
    } else if (tecla === 'Tab') setAbierto(false);
    else if (tecla === 'Enter' || tecla === ' ') {
      evento.preventDefault();
      elegir(activa);
    } else if (tecla === 'ArrowDown' || tecla === 'ArrowUp' || tecla === 'Home' || tecla === 'End') {
      evento.preventDefault();
      const ultimo = opciones.length - 1;
      if (tecla === 'ArrowDown') setActiva((a) => Math.min(a + 1, ultimo));
      else if (tecla === 'ArrowUp') setActiva((a) => Math.max(a - 1, 0));
      else setActiva(tecla === 'Home' ? 0 : ultimo);
    } else if (tecla.length === 1 && /\p{L}|\d/u.test(tecla)) {
      // La siguiente que empieza con esa letra, dando la vuelta.
      const letra = sinTildes(tecla);
      for (let paso = 1; paso <= opciones.length; paso++) {
        const i = (activa + paso) % opciones.length;
        if (sinTildes(opciones[i].etiqueta).startsWith(letra)) {
          setActiva(i);
          break;
        }
      }
    }
  }

  return (
    <div ref={caja} className={`${styles.ancla} ${className}`}>
      <button
        type="button"
        className={`${styles.caja} ${abierto ? styles.abierto : ''}`}
        aria-label={`${etiqueta}: ${actual?.etiqueta ?? ''}`}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={abierto ? id : undefined}
        aria-activedescendant={abierto ? `${id}-${activa}` : undefined}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={alTeclear}
      >
        <Icono icono={icono} tamano={18} className={styles.icono} />
        <span className={styles.valor}>{actual?.etiqueta}</span>
        <Icono icono={ChevronsUpDown} tamano={16} className={styles.flechas} />
      </button>
      {abierto ? (
        <div id={id} role="listbox" aria-label={etiqueta} className={styles.lista}>
          {opciones.map((o, i) => (
            <div
              key={o.valor}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === elegida}
              className={`${styles.opcion} ${i === activa ? styles.activa : ''}`}
              // El foco se queda en la caja.
              onMouseDown={(evento) => evento.preventDefault()}
              onMouseMove={() => setActiva(i)}
              onClick={() => elegir(i)}
            >
              <span className={styles.etiqueta}>{o.etiqueta}</span>
              {i === elegida ? <Icono icono={Check} tamano={16} className={styles.check} /> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
