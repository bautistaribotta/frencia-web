/* Detalle de una sesion (/historial/:id). Lee lo que se registro, nunca el
   plan actual del dia: duracion, series, ejercicios y tonelaje arriba, y las
   series de cada ejercicio en una tabla con el esfuerzo en tinta y la llama
   (kit web, Web · 6).
   Pendiente del diseño: el ticket al costado (descargar, ver grande), el
   Nuevo PR en la mejor serie y eliminar la sesion.
   Fondo: velada. */

import { useQuery } from '@tanstack/react-query';
import { Check, ChevronLeft, Flame, RotateCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { Metrica, NumeroSerie, tabla } from '@/design/components/datos';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Pagina } from '@/design/components/Pagina';
import { Esqueleto, Insignia, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { distanciaTabla, type UnidadDistancia } from '@/lib/distancia';
import { textoIntensidad } from '@/lib/ejercicios';
import { cargarDetalleSesion, tonelajeKg, type EjercicioRealizado, type SesionDetalle } from '@/lib/historial';
import { miles } from '@/lib/numeros';
import { usePerfil } from '@/lib/perfil';
import { mostrarPeso, type UnidadPeso } from '@/lib/peso';
import { fechaSesion, reloj } from '@/lib/tiempo';
import styles from './DetalleSesion.module.css';

/** "58" + "min", o "1 h 12" + "min". */
function partesDuracion(inicio: number, fin: number): { valor: string; unidad: string } {
  const minutos = Math.max(1, Math.round((fin - inicio) / 60000));
  if (minutos < 60) return { valor: String(minutos), unidad: 'min' };
  const resto = minutos % 60;
  return resto === 0 ? { valor: String(minutos / 60), unidad: 'h' } : { valor: `${Math.floor(minutos / 60)} h ${resto}`, unidad: 'min' };
}

/** "jueves, 22 de octubre de 2026 · 07:42". */
function cuando(epochMs: number): string {
  const d = new Date(epochMs);
  return `${fechaSesion(epochMs)} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function DetalleSesion() {
  const { id = '' } = useParams();
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const navegar = useNavigate();
  const sesion = useQuery({ queryKey: ['sesion', userId, id], queryFn: () => cargarDetalleSesion(userId, id), enabled: !!userId });

  let contenido;
  if (sesion.isPending) contenido = <Cargando />;
  else if (sesion.isError)
    contenido = (
      <Aviso titulo="No pudimos cargar el entrenamiento" texto="Revisá tu conexión y probá de nuevo.">
        <Boton variante="secondary" icono={RotateCw} onClick={() => void sesion.refetch()}>
          Reintentar
        </Boton>
      </Aviso>
    );
  else if (!sesion.data) contenido = <Aviso titulo="No encontramos este entrenamiento" texto="Puede que ya no esté disponible en tu historial." />;
  else contenido = <Contenido sesion={sesion.data} />;

  return (
    <>
      <Fondo posicion="velada" />
      <Pagina>
        <div className={styles.migas}>
          <Boton variante="ghost" tamano="sm" icono={ChevronLeft} onClick={() => navegar('/historial')}>
            Historial
          </Boton>
        </div>
        {contenido}
      </Pagina>
    </>
  );
}

function Contenido({ sesion }: { sesion: SesionDetalle }) {
  const perfil = usePerfil().data;
  const unidadPeso = (perfil?.unidad_peso ?? 'kg') as UnidadPeso;
  const unidadDistancia = (perfil?.unidad_distancia ?? 'km') as UnidadDistancia;
  const series = sesion.ejercicios.flatMap((e) =>
    e.series.map((s) => ({ weight_kg: s.weightKg, reps: s.reps })),
  );
  const tonelaje = tonelajeKg(series);
  const duracion = partesDuracion(sesion.startedAt, sesion.finishedAt);

  return (
    <div className={styles.columna}>
      <header className={styles.encabezado}>
        <Insignia tono="signal" icono={Check}>
          Completada
        </Insignia>
        <h1 className={styles.nombre}>{sesion.dayName ?? 'Día eliminado'}</h1>
        <span className={`${texto.data} ${texto.secundario}`}>
          {cuando(sesion.startedAt)}
          {sesion.rutina ? ` · ${sesion.rutina}` : ''}
        </span>
      </header>
      <div className={styles.cuatro}>
        <Metrica rotulo="Duración" valor={duracion.valor} unidad={duracion.unidad} />
        <Metrica rotulo="Series" valor={series.length} />
        <Metrica rotulo="Ejercicios" valor={sesion.ejercicios.length} />
        <Metrica
          rotulo="Tonelaje"
          valor={tonelaje === null ? '—' : miles(mostrarPeso(tonelaje, unidadPeso))}
          unidad={tonelaje === null ? undefined : unidadPeso}
        />
      </div>
      {sesion.ejercicios.length === 0 ? (
        <span className={`${texto.bodySm} ${texto.terciario}`}>Esta sesión terminó sin series registradas.</span>
      ) : (
        sesion.ejercicios.map((e) => <Ejercicio key={e.exerciseId} ejercicio={e} unidadPeso={unidadPeso} unidadDistancia={unidadDistancia} />)
      )}
    </div>
  );
}

function Ejercicio({
  ejercicio,
  unidadPeso,
  unidadDistancia,
}: {
  ejercicio: EjercicioRealizado;
  unidadPeso: UnidadPeso;
  unidadDistancia: UnidadDistancia;
}) {
  const { tracks, series } = ejercicio;
  const medidores = new Set(series.flatMap((s) => (s.intensityKind ? [s.intensityKind] : [])));
  const conEsfuerzo = medidores.size > 0;
  // Con un solo medidor la columna lo nombra; si se mezclaron, "Esfuerzo".
  const rotuloEsfuerzo = medidores.size === 1 ? [...medidores][0].toUpperCase() : 'Esfuerzo';
  const n = series.length;

  return (
    <Tarjeta className={styles.ejercicio}>
      <div className={styles.fila}>
        <h2 className={`${texto.subtitle} ${styles.sinMargen}`}>{ejercicio.name}</h2>
        <span className={`${texto.label} ${texto.terciario}`}>
          {n} {n === 1 ? 'serie' : 'series'}
        </span>
      </div>
      <table className={`${tabla.tabla} ${tabla.series}`}>
        <thead>
          <tr>
            <th>Serie</th>
            {tracks.weight ? <th className={tabla.num}>Peso</th> : null}
            {tracks.reps ? <th className={tabla.num}>Reps</th> : null}
            {tracks.duration ? <th className={tabla.num}>Tiempo</th> : null}
            {tracks.distance ? <th className={tabla.num}>Distancia</th> : null}
            {conEsfuerzo ? <th className={tabla.num}>{rotuloEsfuerzo}</th> : null}
            <th aria-label="Hecha" />
          </tr>
        </thead>
        <tbody>
          {series.map((s, i) => (
            <tr key={s.id}>
              <td>
                <NumeroSerie n={i + 1} />
              </td>
              {tracks.weight ? <td className={tabla.num}>{s.weightKg === null ? '—' : `${mostrarPeso(s.weightKg, unidadPeso)} ${unidadPeso}`}</td> : null}
              {tracks.reps ? <td className={tabla.num}>{s.reps ?? '—'}</td> : null}
              {tracks.duration ? <td className={tabla.num}>{s.durationSeconds === null ? '—' : reloj(s.durationSeconds)}</td> : null}
              {tracks.distance ? (
                <td className={tabla.num}>{s.distanceM === null ? '—' : `${distanciaTabla(s.distanceM, unidadDistancia)} ${unidadDistancia}`}</td>
              ) : null}
              {conEsfuerzo ? (
                <td className={tabla.num}>
                  {s.intensityKind && s.intensityValue !== null ? (
                    <span className={tabla.esfuerzo}>
                      <Icono icono={Flame} tamano={12} />
                      {textoIntensidad(s.intensityKind, s.intensityValue)}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              ) : null}
              <td className={tabla.num}>
                <Icono icono={Check} tamano={16} className={texto.acento} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  );
}

function Aviso({ titulo, texto: bajada, children }: { titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className={styles.aviso}>
      <span className={texto.subtitle}>{titulo}</span>
      <span className={`${texto.bodySm} ${texto.secundario}`}>{bajada}</span>
      {children}
    </div>
  );
}

function Cargando() {
  return (
    <div className={styles.columna}>
      <div className={styles.encabezado}>
        <Esqueleto className={styles.esqRotulo} />
        <Esqueleto className={styles.esqNombre} />
        <Esqueleto className={styles.esqLinea} />
      </div>
      {[0, 1].map((i) => (
        <Tarjeta key={i} className={styles.ejercicio}>
          <Esqueleto className={styles.esqTitulo} />
          <Esqueleto />
          <Esqueleto className={styles.esqLinea} />
        </Tarjeta>
      ))}
    </div>
  );
}
