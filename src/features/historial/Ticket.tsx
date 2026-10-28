/* Ticket de una sesion (kit web, Web · 6, .w-ticket): el pase con la marca,
   la duracion y el tonelaje grandes, la perforacion con una muesca a cada
   lado, los conteos, una fila por ejercicio con su mejor serie y el codigo de
   barras que sale del id. Va en el vidrio opaco para verse igual en pantalla
   y en la imagen que se descarga o se copia (lib/imagenTicket.ts). */

import { useLayoutEffect, useRef, useState, type CSSProperties, type Ref } from 'react';

import { Metrica } from '@/design/components/datos';
import { Marca } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import type { UnidadDistancia } from '@/lib/distancia';
import { tonelajeKg, type SesionDetalle } from '@/lib/historial';
import { miles } from '@/lib/numeros';
import { mostrarPeso, type UnidadPeso } from '@/lib/peso';
import { barrasTicket, codigoTicket, fechaTicket, mejorMarcaSesion, mejorSerie, numeroTicket } from '@/lib/ticket';
import { reloj } from '@/lib/tiempo';
import styles from './Ticket.module.css';

// El codigo se repite hasta cubrir el ancho; lo que sobra lo corta la caja.
const REPETICIONES_BARRAS = 3;

interface Props {
  sesion: SesionDetalle;
  unidadPeso: UnidadPeso;
  unidadDistancia: UnidadDistancia;
  ref?: Ref<HTMLDivElement>;
}

export function Ticket({ sesion, unidadPeso, unidadDistancia, ref }: Props) {
  const perforacion = useRef<HTMLDivElement>(null);
  // Las muescas van a la altura de la perforacion, que depende del texto.
  const [yMuesca, setYMuesca] = useState(168);
  useLayoutEffect(() => {
    if (perforacion.current) setYMuesca(perforacion.current.offsetTop);
  }, [sesion]);

  const series = sesion.ejercicios.flatMap((e) => e.series);
  const tonelaje = tonelajeKg(series.map((s) => ({ weight_kg: s.weightKg, reps: s.reps })));
  const mejor = mejorMarcaSesion(sesion.ejercicios, unidadPeso);
  const barras = barrasTicket(sesion.id);

  return (
    <div
      ref={ref}
      className={styles.ticket}
      // La altura de las muescas se mide recien al dibujar.
      style={{ '--y-muesca': `${yMuesca}px` } as CSSProperties}
      role="img"
      aria-label={`Ticket de ${sesion.dayName ?? 'la sesión'}, ${fechaTicket(sesion.startedAt)}`}
    >
      <div className={styles.cabeza}>
        <div className={styles.marca}>
          <Marca />
          <span className={`${texto.meta} ${texto.terciario}`}>Nº {numeroTicket(sesion.id)}</span>
        </div>
        <span className={texto.title}>Sesión completa</span>
        <span className={`${texto.meta} ${texto.terciario}`}>
          {sesion.dayName ?? 'Día eliminado'} · {fechaTicket(sesion.startedAt)}
        </span>
      </div>
      <div className={styles.grandes}>
        <Metrica rotulo="Duración" valor={reloj(Math.max(0, Math.round((sesion.finishedAt - sesion.startedAt) / 1000)))} />
        <i />
        <Metrica rotulo={`Tonelaje · ${unidadPeso}`} valor={tonelaje === null ? '—' : miles(mostrarPeso(tonelaje, unidadPeso))} />
      </div>
      <div ref={perforacion} className={styles.perforacion} />
      <div className={styles.conteos}>
        <Conteo rotulo="Ejercicios" valor={String(sesion.ejercicios.length)} />
        <Conteo rotulo="Series" valor={String(series.length)} />
        <Conteo rotulo="Mejor marca" valor={mejor ?? '—'} />
      </div>
      {sesion.ejercicios.length > 0 ? (
        <div className={styles.filas}>
          {sesion.ejercicios.map((e) => (
            <div key={e.exerciseId} className={styles.fila}>
              <span className={styles.filaIzq}>
                <span className={texto.terciario}>{e.series.length}×</span>
                <span className={styles.unaLinea}>{e.name}</span>
              </span>
              <span className={texto.semi}>{mejorSerie(e, unidadPeso, unidadDistancia)}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className={styles.codigo} aria-hidden="true">
        <div className={styles.barras}>
          {Array.from({ length: REPETICIONES_BARRAS }).flatMap((_, r) =>
            barras.map((b, i) => (
              // El ancho de cada barra sale del id de la sesion.
              <i key={`${r}-${i}`} style={{ width: b.barra, marginRight: b.espacio }} />
            )),
          )}
        </div>
        <span className={`${texto.meta} ${texto.terciario}`}>{codigoTicket(sesion.id)}</span>
      </div>
    </div>
  );
}

function Conteo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className={styles.conteo}>
      <span className={`${texto.label} ${texto.terciario}`}>{rotulo}</span>
      <span className={texto.subtitle}>{valor}</span>
    </div>
  );
}
