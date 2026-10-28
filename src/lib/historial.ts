/* Historial: consulta y eliminación de sesiones terminadas. Las consultas son las de
   src/lib/history.ts y session-history.ts del repo mobile con lo que suma el
   escritorio: la rutina y la cantidad de series de cada sesion en la tabla,
   y los totales de todo el historial arriba.
   La lista no se filtra: la primera pagina trae los ultimos tres meses y
   las siguientes, de a HISTORIAL_PAGINA hacia atras, hasta el principio. */

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

/** Cuanto trae la primera pagina: los ultimos tres meses. */
export const MESES_PRIMERA_PAGINA = 3;
/** Tope de la primera pagina, por si alguien entrena varias veces por dia. */
export const PRIMERA_PAGINA_MAX = 100;

/** Desde cuando cuenta la primera pagina. */
export function inicioPrimeraPagina(ahora = new Date()): string {
  const desde = new Date(ahora);
  desde.setMonth(desde.getMonth() - MESES_PRIMERA_PAGINA);
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
}

export const HISTORIAL_PAGINA = 20;

// El menor UUID posible: un cursor en el corte de la primera pagina deja
// afuera lo que termino justo en esa fecha, que ya entro en ella.
const UUID_MINIMO = '00000000-0000-0000-0000-000000000000';

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

const COLUMNAS_LISTA = 'id, started_at, finished_at, training_days(name, routines(name)), session_sets(count)';

/** Los dias de una rutina, para filtrar por ella: una sesion apunta a su
 *  dia, no a la rutina. null = sin filtro. Las sesiones cuyo dia se borro
 *  quedan sin rutina y solo aparecen con todas. */
async function diasDeRutina(rutinaId: string | null, signal?: AbortSignal): Promise<string[] | null> {
  if (rutinaId === null) return null;
  if (!esUuid(rutinaId)) return [];
  const consulta = supabase.from('training_days').select('id').eq('routine_id', rutinaId);
  if (signal) consulta.abortSignal(signal);
  const { data, error } = await consulta;
  if (error) throw error;
  return data.map((d) => d.id);
}

function consultaLista(userId: string, limite: number, dias: string[] | null, signal?: AbortSignal) {
  const consulta = supabase
    .from('workout_sessions')
    .select(COLUMNAS_LISTA)
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
    .order('finished_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limite + 1);
  if (dias) consulta.in('training_day_id', dias);
  if (signal) consulta.abortSignal(signal);
  return consulta;
}

const PAGINA_VACIA: PaginaHistorial = { sesiones: [], siguiente: null, proximaFecha: null };

type FilaLista = NonNullable<Awaited<ReturnType<typeof consultaLista>>['data']>[number];

/** Arma la pagina con el registro extra, que dice si quedan mas. */
function aPagina(data: FilaLista[], limite: number): PaginaHistorial {
  const visibles = data.slice(0, limite);
  const extra = data[limite];
  const ultima = visibles[visibles.length - 1];
  return {
    sesiones: visibles.map((fila) => ({
      id: fila.id,
      dayName: fila.training_days?.name ?? null,
      rutina: fila.training_days?.routines?.name ?? null,
      startedAt: Date.parse(fila.started_at),
      finishedAt: Date.parse(fila.finished_at as string),
      series: fila.session_sets?.[0]?.count ?? 0,
    })),
    siguiente: extra && ultima ? { id: ultima.id, finishedAt: ultima.finished_at as string } : null,
    proximaFecha: extra ? Date.parse(extra.finished_at as string) : null,
  };
}

/** Una pagina, sin OFFSET ni COUNT: el registro extra dice si quedan mas.
 *  Sin cursor es la primera: los ultimos tres meses (con tope). Si ahi no
 *  hay nada, sigue con las anteriores para no mostrar un vacio que no es.
 *  Con `rutinaId`, solo las sesiones de los dias de esa rutina. */
export async function cargarPaginaHistorial(
  userId: string,
  cursor: CursorHistorial | null,
  signal?: AbortSignal,
  rutinaId: string | null = null,
  ahora = new Date(),
): Promise<PaginaHistorial> {
  const dias = await diasDeRutina(rutinaId, signal);
  if (dias?.length === 0) return PAGINA_VACIA;
  return paginaHistorial(userId, cursor, dias, signal, ahora);
}

async function paginaHistorial(
  userId: string,
  cursor: CursorHistorial | null,
  dias: string[] | null,
  signal: AbortSignal | undefined,
  ahora: Date,
): Promise<PaginaHistorial> {
  if (!cursor) {
    const desde = inicioPrimeraPagina(ahora);
    const { data, error } = await consultaLista(userId, PRIMERA_PAGINA_MAX, dias, signal).gte('finished_at', desde);
    if (error) throw error;
    if (data.length === 0) return paginaHistorial(userId, { id: UUID_MINIMO, finishedAt: desde }, dias, signal, ahora);
    const pagina = aPagina(data, PRIMERA_PAGINA_MAX);
    if (pagina.siguiente) return pagina;
    // Entro todo el periodo: lo que sigue es lo anterior a esa fecha, si hay.
    // El mes del corte puede tener mas sesiones, por eso no se da por completo.
    return { ...pagina, siguiente: { id: UUID_MINIMO, finishedAt: desde }, proximaFecha: Date.parse(desde) };
  }

  // Los valores se interpolan en sintaxis PostgREST; validar antes de usar.
  if (!esCursorValido(cursor.id, cursor.finishedAt)) throw new Error('cursor invalido');
  const { data, error } = await consultaLista(userId, HISTORIAL_PAGINA, dias, signal)
    .lte('finished_at', cursor.finishedAt)
    .or(`finished_at.lt.${cursor.finishedAt},and(finished_at.eq.${cursor.finishedAt},id.lt.${cursor.id})`);
  if (error) throw error;
  return aPagina(data, HISTORIAL_PAGINA);
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

export interface TotalesHistorial {
  sesiones: number;
  segundos: number;
}

const TOTALES_PAGINA = 1000;

/** Sesiones y tiempo de todo el historial, o de una rutina. Lee solo inicio
 *  y fin de cada sesion, de a mil: sin series, cada pedido es liviano. */
export async function cargarTotales(userId: string, rutinaId: string | null = null): Promise<TotalesHistorial> {
  const totales: TotalesHistorial = { sesiones: 0, segundos: 0 };
  const dias = await diasDeRutina(rutinaId);
  if (dias?.length === 0) return totales;
  for (let pagina = 0; ; pagina += TOTALES_PAGINA) {
    const consulta = supabase
      .from('workout_sessions')
      .select('started_at, finished_at')
      .eq('user_id', userId)
      .not('finished_at', 'is', null)
      .order('finished_at', { ascending: false })
      .order('id', { ascending: false })
      .range(pagina, pagina + TOTALES_PAGINA - 1);
    if (dias) consulta.in('training_day_id', dias);
    const { data, error } = await consulta;
    if (error) throw error;
    for (const fila of data) {
      totales.sesiones += 1;
      totales.segundos += Math.max(0, (Date.parse(fila.finished_at as string) - Date.parse(fila.started_at)) / 1000);
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

/** La base elimina sus series en cascada; nunca se modifica el plan del dia. */
export async function eliminarSesion(userId: string, sessionId: string): Promise<void> {
  if (!esUuid(userId) || !esUuid(sessionId)) throw new Error('Sesión inválida');
  const { data, error } = await supabase
    .from('workout_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
    .select('id');
  if (error) throw error;
  if (data?.length !== 1) throw new Error('No se eliminó la sesión');
}
