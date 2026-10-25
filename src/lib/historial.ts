/* Historial: las sesiones terminadas, solo lectura. Las consultas son las de
   src/lib/history.ts y session-history.ts del repo mobile con lo que suma el
   escritorio: la rutina de cada sesion, sus series y su tonelaje en la
   tabla, el filtro por periodo y los totales del periodo arriba. */

import {
  COLUMNAS_TIPO,
  intensidadDeFila,
  tipoDeFila,
  type DatosRegistrados,
  type Medidor,
  type TipoEjercicio,
} from './ejercicios';
import { supabase } from './supabase';
import { esCursorValido, esUuid } from './validacion';

export type Periodo = '30' | '90' | 'todo';

/** Desde cuando se cuenta el periodo, o null para todo el historial. */
export function inicioPeriodo(periodo: Periodo, ahora = new Date()): string | null {
  if (periodo === 'todo') return null;
  const desde = new Date(ahora);
  desde.setDate(desde.getDate() - Number(periodo));
  return desde.toISOString();
}

interface SerieVolumen {
  weight_kg: number | string | null;
  reps: number | null;
}

/** Tonelaje en kg: peso por reps de las series que tienen las dos cosas, o
 *  sea la fuerza. null si ninguna entra: 0 kg diria que no se levanto nada
 *  cuando no hay nada que medir. Mismo criterio que volumenKg en la app. */
export function tonelajeKg(series: SerieVolumen[]): number | null {
  let total: number | null = null;
  for (const s of series) {
    if (s.weight_kg === null || s.reps === null) continue;
    total = (total ?? 0) + Number(s.weight_kg) * s.reps;
  }
  return total;
}

/** Una sesion terminada, resumida para la tabla. */
export interface SesionTerminada {
  id: string;
  /** Nombre del dia, o null si el dia se borro (la sesion sobrevive). */
  dayName: string | null;
  rutina: string | null;
  startedAt: number;
  finishedAt: number;
  series: number;
  tonelajeKg: number | null;
}

export const HISTORIAL_PAGINA = 20;

export interface CursorHistorial {
  id: string;
  // Conservar el timestamp de Postgres: Date pierde los microsegundos.
  finishedAt: string;
}

export interface PaginaHistorial {
  sesiones: SesionTerminada[];
  siguiente: CursorHistorial | null;
  /** Fecha de la primera sesion que queda afuera, para saber si el ultimo
   *  mes ya esta completo. */
  proximaFecha: number | null;
}

/** Una pagina, sin OFFSET ni COUNT: el registro extra dice si quedan mas. */
export async function cargarPaginaHistorial(
  userId: string,
  desde: string | null,
  cursor: CursorHistorial | null,
  signal?: AbortSignal,
): Promise<PaginaHistorial> {
  const consulta = supabase
    .from('workout_sessions')
    .select('id, started_at, finished_at, training_days(name, routines(name)), session_sets(weight_kg, reps)')
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
    .order('finished_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(HISTORIAL_PAGINA + 1);
  if (desde) consulta.gte('finished_at', desde);
  if (cursor) {
    // Los valores se interpolan en sintaxis PostgREST; validar antes de usar.
    if (!esCursorValido(cursor.id, cursor.finishedAt)) throw new Error('cursor invalido');
    consulta
      .lte('finished_at', cursor.finishedAt)
      .or(`finished_at.lt.${cursor.finishedAt},and(finished_at.eq.${cursor.finishedAt},id.lt.${cursor.id})`);
  }
  if (signal) consulta.abortSignal(signal);
  const { data, error } = await consulta;
  if (error) throw error;

  const visibles = data.slice(0, HISTORIAL_PAGINA);
  const extra = data[HISTORIAL_PAGINA];
  const ultima = visibles[visibles.length - 1];
  return {
    sesiones: visibles.map((fila) => ({
      id: fila.id,
      dayName: fila.training_days?.name ?? null,
      rutina: fila.training_days?.routines?.name ?? null,
      startedAt: Date.parse(fila.started_at),
      finishedAt: Date.parse(fila.finished_at as string),
      series: fila.session_sets?.length ?? 0,
      tonelajeKg: tonelajeKg(fila.session_sets ?? []),
    })),
    siguiente: extra && ultima ? { id: ultima.id, finishedAt: ultima.finished_at as string } : null,
    proximaFecha: extra ? Date.parse(extra.finished_at as string) : null,
  };
}

export interface MesHistorial {
  key: string;
  finishedAt: number;
  /** Ya se trajeron todas sus sesiones: recien ahi se muestra el total. */
  completo: boolean;
  sesiones: SesionTerminada[];
}

function claveMes(epochMs: number): string {
  const fecha = new Date(epochMs);
  return `${fecha.getFullYear()}-${fecha.getMonth()}`;
}

/** Agrupa por mes local, en el orden que llegan. */
export function agruparPorMes(sesiones: SesionTerminada[], proximaFecha: number | null): MesHistorial[] {
  const meses: MesHistorial[] = [];
  for (const sesion of sesiones) {
    const key = claveMes(sesion.finishedAt);
    const ultimo = meses[meses.length - 1];
    if (ultimo?.key === key) ultimo.sesiones.push(sesion);
    else meses.push({ key, finishedAt: sesion.finishedAt, completo: true, sesiones: [sesion] });
  }
  const ultimo = meses[meses.length - 1];
  if (ultimo && proximaFecha !== null && ultimo.key === claveMes(proximaFecha)) ultimo.completo = false;
  return meses;
}

export interface TotalesPeriodo {
  sesiones: number;
  segundos: number;
  tonelajeKg: number;
}

const TOTALES_PAGINA = 1000;

/** Sesiones, tiempo y tonelaje del periodo. Pagina de a mil sesiones; las
 *  series van embebidas, que no cuentan para ese limite. */
export async function cargarTotales(userId: string, desde: string | null): Promise<TotalesPeriodo> {
  const totales: TotalesPeriodo = { sesiones: 0, segundos: 0, tonelajeKg: 0 };
  for (let pagina = 0; ; pagina += TOTALES_PAGINA) {
    const consulta = supabase
      .from('workout_sessions')
      .select('started_at, finished_at, session_sets(weight_kg, reps)')
      .eq('user_id', userId)
      .not('finished_at', 'is', null)
      .order('finished_at', { ascending: false })
      .order('id', { ascending: false })
      .range(pagina, pagina + TOTALES_PAGINA - 1);
    if (desde) consulta.gte('finished_at', desde);
    const { data, error } = await consulta;
    if (error) throw error;
    for (const fila of data) {
      totales.sesiones += 1;
      totales.segundos += Math.max(0, (Date.parse(fila.finished_at as string) - Date.parse(fila.started_at)) / 1000);
      totales.tonelajeKg += tonelajeKg(fila.session_sets ?? []) ?? 0;
    }
    if (data.length < TOTALES_PAGINA) return totales;
  }
}

/** Una serie tal como se guardo. Lo que el ejercicio no registra es null. */
export interface SerieRealizada {
  id: string;
  setIndex: number;
  weightKg: number | null;
  reps: number | null;
  durationSeconds: number | null;
  distanceM: number | null;
  intensityKind: Medidor | null;
  intensityValue: number | null;
  completedAt: number;
}

export interface EjercicioRealizado {
  exerciseId: string;
  name: string;
  kind: TipoEjercicio;
  tracks: DatosRegistrados;
  series: SerieRealizada[];
}

export interface SesionDetalle {
  id: string;
  dayName: string | null;
  rutina: string | null;
  startedAt: number;
  finishedAt: number;
  ejercicios: EjercicioRealizado[];
}

const SERIES_PAGINA = 200;

/** Cabecera y series de una sesion terminada; lee lo realizado, nunca el plan
 *  actual del dia. null si no existe o no es del usuario. Tira si falla
 *  alguna pagina: no se muestra un detalle a medias. */
export async function cargarDetalleSesion(userId: string, sessionId: string): Promise<SesionDetalle | null> {
  if (!esUuid(sessionId) || !userId) return null;
  const { data: sesion, error } = await supabase
    .from('workout_sessions')
    .select('id, started_at, finished_at, training_days(name, routines(name))')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
    .maybeSingle();
  if (error) throw error;
  if (!sesion) return null;

  const grupos = new Map<string, EjercicioRealizado>();
  for (let desde = 0; ; desde += SERIES_PAGINA) {
    const { data, error: errorSeries } = await supabase
      .from('session_sets')
      .select(
        `id, exercise_id, set_index, weight_kg, reps, duration_seconds, distance_m, intensity_kind, intensity_value, completed_at, exercises(name, ${COLUMNAS_TIPO})`,
      )
      .eq('session_id', sessionId)
      .order('exercise_id')
      .order('set_index')
      .range(desde, desde + SERIES_PAGINA - 1);
    if (errorSeries) throw errorSeries;
    for (const fila of data) {
      let grupo = grupos.get(fila.exercise_id);
      if (!grupo) {
        grupo = { exerciseId: fila.exercise_id, name: fila.exercises?.name ?? 'Ejercicio', ...tipoDeFila(fila.exercises), series: [] };
        grupos.set(fila.exercise_id, grupo);
      }
      grupo.series.push({
        id: fila.id,
        setIndex: fila.set_index,
        weightKg: fila.weight_kg === null ? null : Number(fila.weight_kg),
        reps: fila.reps,
        durationSeconds: fila.duration_seconds,
        distanceM: fila.distance_m,
        ...intensidadDeFila(fila.intensity_kind, fila.intensity_value),
        completedAt: Date.parse(fila.completed_at),
      });
    }
    if (data.length < SERIES_PAGINA) break;
  }

  // Orden historico por primer registro; dentro de cada ejercicio, numero de serie.
  const primerRegistro = (e: EjercicioRealizado) => e.series.reduce((min, s) => Math.min(min, s.completedAt), Infinity);
  const ejercicios = [...grupos.values()].sort((a, b) => primerRegistro(a) - primerRegistro(b) || a.exerciseId.localeCompare(b.exerciseId));
  return {
    id: sesion.id,
    dayName: sesion.training_days?.name ?? null,
    rutina: sesion.training_days?.routines?.name ?? null,
    startedAt: Date.parse(sesion.started_at),
    finishedAt: Date.parse(sesion.finished_at as string),
    ejercicios,
  };
}
