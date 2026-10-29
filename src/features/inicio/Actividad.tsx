/* Actividad (kit web, Web · 4 y README «Inicio»): los dias entrenados, como
   el cuadro de contribuciones de GitHub. Una columna por semana, de lunes a
   domingo, y la mas reciente a la derecha: el ultimo año en escritorio, 6
   meses en la tablet y 5 semanas en el telefono. Un solo tono para el dia con
   sesion. Solo informativo: no se hace clic; el tooltip dice el dia. */

import type { CSSProperties } from 'react';

import { Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { armarActividad, SEMANAS, type Celda, type SesionHecha } from '@/lib/actividad';
import { useEsTabletOMenos, useEsTelefono } from '@/lib/tamano';
import { indiceSemanaLunes, MESES_CORTO } from '@/lib/tiempo';
import styles from './Actividad.module.css';

const DIAS_CORTO = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Como en GitHub, solo algunos rotulos: lunes, miercoles y viernes.
const ROTULOS = ['L', '', 'X', '', 'V', '', ''];

/** "Mar 28 oct · Push · 15 series", o "Mar 28 oct · Sin entrenar". */
function detalle(celda: Celda): string {
  const fecha = `${DIAS_CORTO[indiceSemanaLunes(celda.fecha)]} ${celda.fecha.getDate()} ${MESES_CORTO[celda.fecha.getMonth()]}`;
  if (celda.sesiones.length === 0) return `${fecha} · Sin entrenar`;
  const nombres = celda.sesiones.map((s) => s.diaNombre ?? 'Sesión').join(' y ');
  const series = celda.sesiones.reduce((suma, s) => suma + s.series, 0);
  return `${fecha} · ${nombres} · ${series} ${series === 1 ? 'serie' : 'series'}`;
}

export function Actividad({ sesiones }: { sesiones: SesionHecha[] }) {
  const telefono = useEsTelefono();
  const tablet = useEsTabletOMenos();
  const semanas = telefono ? SEMANAS.telefono : tablet ? SEMANAS.tablet : SEMANAS.escritorio;
  const rango = telefono ? 'las últimas 5 semanas' : tablet ? 'los últimos 6 meses' : 'el último año';
  const { semanas: columnas, meses, total } = armarActividad(sesiones, new Date(), semanas);
  const resumen = `${total} ${total === 1 ? 'sesión' : 'sesiones'} en ${rango}`;

  return (
    <Tarjeta className={styles.tarjeta}>
      <div className={styles.cabeza}>
        <span className={`${texto.label} ${texto.terciario}`}>Actividad</span>
        <span className={`${texto.bodySm} ${texto.secundario}`}>{resumen}</span>
      </div>
      {/* La cantidad de semanas se conoce recien al renderizar. */}
      <div className={styles.cuadro} role="img" aria-label={resumen} style={{ '--semanas': semanas } as CSSProperties}>
        <div className={styles.meses} aria-hidden="true">
          {meses.map((m) => (
            <span key={m.columna} className={styles.mes} style={{ '--columna': m.columna + 1 } as CSSProperties}>
              {MESES_CORTO[m.mes]}
            </span>
          ))}
        </div>
        <div className={styles.rotulos} aria-hidden="true">
          {ROTULOS.map((r, i) => (
            <span key={i}>{r}</span>
          ))}
        </div>
        <div className={styles.grilla}>
          {columnas.flat().map((c) => (
            <span
              key={c.fecha.getTime()}
              className={`${styles.celda} ${c.sesiones.length > 0 ? styles.on : ''} ${c.hoy ? styles.hoy : ''} ${c.futuro ? styles.futuro : ''}`}
              title={c.futuro ? undefined : detalle(c)}
            />
          ))}
        </div>
      </div>
    </Tarjeta>
  );
}
