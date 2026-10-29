/* Cinta: texto de una linea que, si no entra, se desplaza (como MarqueeText
   de la app). Si entra, queda quieto. Si no, se mueve lento de derecha a
   izquierda: dos copias seguidas con un espacio entre ellas, asi cuando la
   primera sale por la izquierda la segunda ya ocupa su lugar y el reinicio
   no se nota. Cada vuelta arranca quieta un rato para leer el comienzo.
   Con "reducir movimiento", o con quieta (la copia que se arrastra), no se
   mueve y se corta con puntos suspensivos. */

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';

import styles from './Cinta.module.css';

// Pixeles por segundo: tiene que poder leerse en movimiento.
const VELOCIDAD = 28;
// Pausa al comienzo de cada vuelta, con el texto en su posicion inicial.
const PAUSA_MS = 2000;
// Espacio entre el final del texto y la copia que lo sigue (gap en el CSS).
const SEPARACION = 40;

const CONSULTA = '(prefers-reduced-motion: reduce)';
function suscribir(aviso: () => void) {
  const consulta = window.matchMedia(CONSULTA);
  consulta.addEventListener('change', aviso);
  return () => consulta.removeEventListener('change', aviso);
}
const reducido = () => window.matchMedia(CONSULTA).matches;

export function Cinta({ children, className = '', quieta = false }: { children: string; className?: string; quieta?: boolean }) {
  const caja = useRef<HTMLSpanElement>(null);
  const cinta = useRef<HTMLSpanElement>(null);
  const original = useRef<HTMLSpanElement>(null);
  const [recorrido, setRecorrido] = useState(0);
  const sinMovimiento = useSyncExternalStore(suscribir, reducido, () => true);
  const animar = recorrido > 0 && !quieta && !sinMovimiento;

  // Mide si el texto entra; vuelve a medir si la caja cambia de ancho.
  useLayoutEffect(() => {
    const c = caja.current;
    const t = original.current;
    if (!c || !t) return;
    const medir = () => {
      // Medio pixel de tolerancia para un nombre que entra justo.
      const ancho = t.getBoundingClientRect().width;
      setRecorrido(ancho > c.clientWidth + 0.5 ? ancho + SEPARACION : 0);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(c);
    return () => observador.disconnect();
  }, [children]);

  useEffect(() => {
    const c = cinta.current;
    if (!animar || !c) return;
    const viaje = (recorrido / VELOCIDAD) * 1000;
    const pausa = PAUSA_MS / (PAUSA_MS + viaje);
    const animacion = c.animate(
      [
        { transform: 'translateX(0)', offset: 0 },
        { transform: 'translateX(0)', offset: pausa },
        { transform: `translateX(-${recorrido}px)`, offset: 1 },
      ],
      { duration: PAUSA_MS + viaje, iterations: Infinity, easing: 'linear' },
    );
    return () => animacion.cancel();
  }, [animar, recorrido]);

  return (
    <span ref={caja} className={`${styles.caja} ${animar ? '' : styles.cortada} ${className}`}>
      <span ref={cinta} className={styles.cinta}>
        <span ref={original} className={styles.texto}>
          {children}
        </span>
        {animar ? (
          <span className={styles.texto} aria-hidden="true">
            {children}
          </span>
        ) : null}
      </span>
    </span>
  );
}
