import { useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './Billete.module.css';

const FRASE = 'CADA SERIE CUENTA · FRENCIA · ';
/** Distancia del borde al centro de la franja del microtexto. */
const MARGEN = 7;

interface Contorno {
  d: string;
  largo: number;
  veces: number;
}

/** La imagen del acceso. Es decorativa: el lector de pantalla la saltea. */
export function Billete() {
  const caja = useRef<HTMLDivElement>(null);
  const muestra = useRef<SVGTextElement>(null);
  const id = useId();
  const [contorno, setContorno] = useState<Contorno | null>(null);

  // La frase da la vuelta entera al marco: arranca en la esquina superior
  // izquierda y va en sentido horario. El camino se arma con el tamaño real
  // del billete y la frase se repite las veces que entra completa; el resto se
  // reparte como espacio entre letras, asi cierra justo donde empezo.
  useLayoutEffect(() => {
    const el = caja.current!;
    const medir = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      const m = MARGEN;
      const r = Math.max(0, parseFloat(getComputedStyle(el).borderTopLeftRadius) - m);
      const d =
        `M ${m + r} ${m} H ${w - m - r} A ${r} ${r} 0 0 1 ${w - m} ${m + r} ` +
        `V ${h - m - r} A ${r} ${r} 0 0 1 ${w - m - r} ${h - m} ` +
        `H ${m + r} A ${r} ${r} 0 0 1 ${m} ${h - m - r} ` +
        `V ${m + r} A ${r} ${r} 0 0 1 ${m + r} ${m} Z`;
      const largo = 2 * (w + h - 4 * m) - (8 - 2 * Math.PI) * r;
      const unidad = muestra.current!.getComputedTextLength();
      setContorno({ d, largo, veces: Math.max(1, Math.floor(largo / unidad)) });
    };
    medir();
    // La fuente mono puede llegar despues: con ella cambia el ancho de la frase.
    document.fonts.ready.then(medir);
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={caja} className={styles.billete} aria-hidden="true">
      <div className={styles.imagen} />
      <svg className={styles.contorno}>
        <text ref={muestra} className={styles.micro} visibility="hidden">
          {FRASE}
        </text>
        {contorno && (
          <>
            <path id={id} d={contorno.d} className={styles.franja} />
            <text className={styles.micro} dominantBaseline="central">
              <textPath href={`#${id}`} textLength={contorno.largo} lengthAdjust="spacing">
                {FRASE.repeat(contorno.veces)}
              </textPath>
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
