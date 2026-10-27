/* Piezas de datos del kit web: la metrica grande (.w-metrica), el resumen de
   un ejercicio (.w-res), el icono de su tipo (.w-tipo), el numero de serie
   (.w-serie-n) y la tabla (.w-tabla), que se exporta como clases porque
   cada pantalla arma sus propias columnas. */

import { Dumbbell, Footprints, HeartPulse, Timer } from 'lucide-react';
import type { ReactNode } from 'react';

import type { TipoEjercicio } from '@/lib/ejercicios';
import texto from '../texto.module.css';
import styles from './datos.module.css';
import { Icono } from './Icono';

// eslint-disable-next-line react-refresh/only-export-components
export { styles as tabla };

export function Metrica({ rotulo, valor, unidad }: { rotulo: string; valor: ReactNode; unidad?: string }) {
  return (
    <div className={styles.metrica}>
      <span className={`${texto.label} ${texto.terciario}`}>{rotulo}</span>
      <span className={styles.metricaValor}>
        {valor}
        {unidad ? <small>{unidad}</small> : null}
      </span>
    </div>
  );
}

/** "4×8 · RIR 2 · ⏱ 2:00": la intensidad en tinta de esfuerzo. */
export function Resumen({ volumen, intensidad, descanso }: { volumen: string; intensidad?: string | null; descanso?: string | null }) {
  return (
    <span className={styles.resumen}>
      <span>{volumen}</span>
      {intensidad ? (
        <>
          <i>·</i>
          <b>{intensidad}</b>
        </>
      ) : null}
      {descanso ? (
        <>
          <i>·</i>
          <Icono icono={Timer} tamano={12} />
          {descanso}
        </>
      ) : null}
    </span>
  );
}

const ICONO_TIPO = { fuerza: Dumbbell, isometrico: Timer, cardio: HeartPulse, hibrido: Footprints };
const NOMBRE_TIPO = { fuerza: 'Fuerza', isometrico: 'Isométrico', cardio: 'Cardio', hibrido: 'Híbrido' };

/** El tipo de ejercicio en un cuadrado de vidrio hundido, sin color propio.
 *  Grande en el catalogo del constructor (.w-tipo); chico en las tarjetas. */
export function Tipo({ tipo, grande = false }: { tipo: TipoEjercicio; grande?: boolean }) {
  return (
    <span className={`${styles.tipo} ${grande ? styles.tipoGrande : ''}`} title={NOMBRE_TIPO[tipo]}>
      <Icono icono={ICONO_TIPO[tipo]} tamano={grande ? 18 : 16} />
    </span>
  );
}

export function NumeroSerie({ n }: { n: number }) {
  return <span className={styles.serieN}>{n}</span>;
}
