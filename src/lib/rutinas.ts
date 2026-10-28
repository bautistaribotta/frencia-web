/* Rutinas del usuario: el listado, el detalle de una y las acciones de la
   lista (poner en curso, eliminar, el limite por cuenta).
   Las consultas son las de src/lib/rutinas.ts del repo mobile con dos sumas
   propias del escritorio: la cuenta de sesiones de cada rutina (por sus dias)
   y, en el detalle, los ejercicios de cada dia con su resumen.
   Las anteriores se traen todas de una vez: son pocas (hasta cinco rutinas). */

import type { QueryData } from '@supabase/supabase-js';

import { distanciaCompacta, type UnidadDistancia } from './distancia';
import {
  COLUMNAS_TIPO,
  intensidadDeFila,
  textoIntensidad,
  tipoDeFila,
  type DatosRegistrados,
  type Medidor,
  type TipoEjercicio,
} from './ejercicios';
import { mostrarPeso, type UnidadPeso } from './peso';
import { supabase } from './supabase';
import { duracionCompacta, MESES_MAYUS, reloj } from './tiempo';
import { esUuid } from './validacion';

export interface DiaRutina {
  id: string;
  name: string;
  /** Indices 0 = lunes ... 6 = domingo, ordenados. */
  weekdays: number[];
  ejercicios: number;
}

export interface RutinaResumen {
  id: string;
  name: string;
  /** Sin archivar. Solo una por usuario, forzado por indice unico parcial. */
  activa: boolean;
  creadaEl: string;
  archivadaEl: string | null;
  dias: DiaRutina[];
  ejercicios: number;
  /** Sesiones registradas en sus dias. Las de un dia borrado ya no cuentan:
   *  quedan en el historial sin dia. */
  sesiones: number;
}

export interface ListaRutinas {
  activa: RutinaResumen | null;
  anteriores: RutinaResumen[];
}

/** Un ejercicio tal como quedo planificado en el dia. */
export interface EjercicioPlan {
  name: string;
  kind: TipoEjercicio;
  tracks: DatosRegistrados;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  distanceM: number | null;
  weightKg: number | null;
  intensityKind: Medidor | null;
  intensityValue: number | null;
  restSeconds: number | null;
}

/** Un ejercicio del plan con el id del catalogo, para poder editarlo. */
export interface EjercicioDelDia extends EjercicioPlan {
  exerciseId: string;
}

export interface DiaDetalle extends DiaRutina {
  plan: EjercicioDelDia[];
}

export interface RutinaDetalle extends Omit<RutinaResumen, 'dias'> {
  dias: DiaDetalle[];
}

/** "29 JUL 2026", en fecha local. */
export function fechaCorta(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MESES_MAYUS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "3 días · 18 ejercicios · 24 sesiones". */
export function cuentaRutina(r: Pick<RutinaResumen, 'dias' | 'ejercicios' | 'sesiones'>): string {
  const n = (valor: number, uno: string, varios: string) => `${valor} ${valor === 1 ? uno : varios}`;
  return [n(r.dias.length, 'día', 'días'), n(r.ejercicios, 'ejercicio', 'ejercicios'), n(r.sesiones, 'sesión', 'sesiones')].join(' · ');
}

const COLUMNAS_LISTA =
  'id, name, archived_at, created_at, training_days(id, name, position, training_day_weekdays(weekday), training_day_exercises(count), workout_sessions(count))';

function consultaLista() {
  return supabase.from('routines').select(COLUMNAS_LISTA);
}

type FilaLista = QueryData<ReturnType<typeof consultaLista>>[number];

function aResumen(r: FilaLista): RutinaResumen {
  const dias = (r.training_days ?? []).slice().sort((a, b) => a.position - b.position);
  return {
    id: r.id,
    name: r.name,
    activa: r.archived_at === null,
    creadaEl: r.created_at,
    archivadaEl: r.archived_at,
    dias: dias.map((d) => ({
      id: d.id,
      name: d.name,
      weekdays: (d.training_day_weekdays ?? []).map((w) => w.weekday).sort((a, b) => a - b),
      ejercicios: d.training_day_exercises?.[0]?.count ?? 0,
    })),
    ejercicios: dias.reduce((total, d) => total + (d.training_day_exercises?.[0]?.count ?? 0), 0),
    sesiones: dias.reduce((total, d) => total + (d.workout_sessions?.[0]?.count ?? 0), 0),
  };
}

/** La rutina en curso y las archivadas, de la mas nueva a la mas vieja. Tira
 *  si falla, para que la pantalla no lo confunda con una cuenta sin rutinas. */
export async function cargarRutinas(userId: string): Promise<ListaRutinas> {
  const { data, error } = await consultaLista()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });
  if (error) throw error;
  const rutinas = data.map(aResumen);
  return {
    activa: rutinas.find((r) => r.activa) ?? null,
    anteriores: rutinas.filter((r) => !r.activa),
  };
}

const COLUMNAS_DETALLE = `id, name, archived_at, created_at, training_days(id, name, position, training_day_weekdays(weekday), workout_sessions(count), training_day_exercises(position, exercise_id, sets, reps, duration_seconds, distance_m, weight_kg, intensity_kind, intensity_value, rest_seconds, exercises(name, ${COLUMNAS_TIPO})))`;

function consultaDetalle() {
  return supabase.from('routines').select(COLUMNAS_DETALLE);
}

type FilaDetalle = QueryData<ReturnType<typeof consultaDetalle>>[number];
type FilaPlan = NonNullable<FilaDetalle['training_days']>[number]['training_day_exercises'][number];

function aPlan(fila: FilaPlan): EjercicioDelDia {
  const { kind, tracks } = tipoDeFila(fila.exercises);
  return {
    exerciseId: fila.exercise_id,
    name: fila.exercises?.name ?? 'Ejercicio',
    kind,
    tracks,
    sets: fila.sets ?? (kind === 'cardio' ? 1 : 3),
    reps: tracks.reps ? fila.reps : null,
    durationSeconds: fila.duration_seconds,
    distanceM: fila.distance_m,
    weightKg: fila.weight_kg === null ? null : Number(fila.weight_kg),
    ...intensidadDeFila(fila.intensity_kind, fila.intensity_value),
    restSeconds: fila.rest_seconds,
  };
}

/** Una rutina con sus dias y los ejercicios de cada uno, en orden. null si no
 *  existe o no es del usuario (lo resuelve RLS). Tira si falla la lectura. */
export async function cargarRutina(routineId: string): Promise<RutinaDetalle | null> {
  if (!esUuid(routineId)) return null;
  const { data, error } = await consultaDetalle().eq('id', routineId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const dias = (data.training_days ?? []).slice().sort((a, b) => a.position - b.position);
  const detalle = dias.map((d) => ({
    id: d.id,
    name: d.name,
    weekdays: (d.training_day_weekdays ?? []).map((w) => w.weekday).sort((a, b) => a - b),
    ejercicios: d.training_day_exercises?.length ?? 0,
    plan: (d.training_day_exercises ?? []).slice().sort((a, b) => a.position - b.position).map(aPlan),
  }));
  return {
    id: data.id,
    name: data.name,
    activa: data.archived_at === null,
    creadaEl: data.created_at,
    archivadaEl: data.archived_at,
    dias: detalle,
    ejercicios: detalle.reduce((total, d) => total + d.ejercicios, 0),
    sesiones: dias.reduce((total, d) => total + (d.workout_sessions?.[0]?.count ?? 0), 0),
  };
}

/** Partes del resumen de un ejercicio, como .w-res del kit web:
 *  "4×8 · RIR 2 · 2:00". El volumen junta lo que prescribe el plan
 *  ("30 min · 5 km"); el prefijo N× y el descanso se omiten en el cardio de
 *  una sola serie. Port de partesResumen (src/lib/dia.ts del repo mobile). */
export function resumenEjercicio(
  ex: EjercicioPlan,
  unidadPeso: UnidadPeso,
  unidadDistancia: UnidadDistancia,
): { volumen: string; intensidad: string | null; descanso: string | null } {
  const partes: string[] = [];
  if (ex.tracks.reps && ex.reps !== null) partes.push(String(ex.reps));
  if (ex.tracks.duration && ex.durationSeconds !== null) partes.push(duracionCompacta(ex.durationSeconds));
  if (ex.tracks.distance && ex.distanceM !== null) partes.push(distanciaCompacta(ex.distanceM, unidadDistancia));
  // El peso solo se planifica en isometricos (una plancha con disco).
  if (ex.kind === 'isometrico' && ex.tracks.weight && ex.weightKg !== null) {
    partes.push(`${mostrarPeso(ex.weightKg, unidadPeso)} ${unidadPeso}`);
  }

  const conSeries = !(ex.kind === 'cardio' && ex.sets === 1);
  if (conSeries && partes.length > 0) partes[0] = `${ex.sets}×${partes[0]}`;
  if (conSeries && partes.length === 0) partes.push(`${ex.sets} series`);

  return {
    volumen: partes.join(' · '),
    intensidad: ex.intensityKind === null || ex.intensityValue === null ? null : textoIntensidad(ex.intensityKind, ex.intensityValue),
    descanso: !conSeries || ex.restSeconds === null ? null : reloj(ex.restSeconds),
  };
}

export interface DiaParaGuardar {
  id: string | null;
  name: string;
  weekdays: number[];
  exercises: Record<string, unknown>[];
}

// guardar_rutina_completa todavia no esta en database.types.ts: se genera con
// npm run gen:types despues de aplicar la migracion. Hasta entonces la llamada
// va con su firma escrita a mano.
type RpcGuardarRutina = (
  fn: 'guardar_rutina_completa',
  args: { p_routine_id: string | null; p_name: string; p_dias: DiaParaGuardar[]; p_activar: boolean },
) => PromiseLike<{ data: string | null; error: unknown }>;

/**
 * Crea (`routineId` null) o reemplaza una rutina entera: nombre, dias, sus
 * dias de la semana y sus ejercicios, en una sola transaccion. Con `activar`
 * la nueva pasa a ser la rutina en curso. Devuelve el id; tira si falla.
 * Ver la migracion guardar_rutina_completa del repo mobile.
 */
export async function guardarRutinaCompleta(
  routineId: string | null,
  name: string,
  dias: DiaParaGuardar[],
  activar: boolean,
): Promise<string> {
  const rpc = supabase.rpc.bind(supabase) as unknown as RpcGuardarRutina;
  const { data, error } = await rpc('guardar_rutina_completa', {
    p_routine_id: routineId,
    p_name: name.trim(),
    p_dias: dias,
    p_activar: activar,
  });
  if (error || !data) throw error ?? new Error('La rutina no se guardó');
  return data;
}

/** Largo maximo del nombre de una rutina (el campo del constructor). */
export const LARGO_NOMBRE_RUTINA = 60;

/** El nombre de una copia, como Windows: "Lunes - copia", y si ya existe,
 *  "Lunes - copia (2)", "(3)"... Duplicar una copia no apila sufijos: sale de
 *  la misma base. Si no entra en el largo maximo, se recorta la base. */
export function nombreCopia(nombre: string, existentes: string[]): string {
  const base = nombre.trim().replace(/ - copia(?: \(\d+\))?$/, '');
  const tomados = new Set(existentes.map((n) => n.trim().toLowerCase()));
  for (let n = 1; ; n++) {
    const sufijo = n === 1 ? ' - copia' : ` - copia (${n})`;
    const candidato = base.slice(0, LARGO_NOMBRE_RUTINA - sufijo.length).trimEnd() + sufijo;
    if (!tomados.has(candidato.toLowerCase())) return candidato;
  }
}

/** Rutinas por cuenta gratuita, contando la en curso y las archivadas. La
 *  base todavia no lo fuerza: lo cuida la web. */
export const MAXIMO_RUTINAS = 5;

export function totalRutinas(lista: ListaRutinas): number {
  return (lista.activa ? 1 : 0) + lista.anteriores.length;
}

/** Pone en curso la rutina y archiva la que estaba (activar_rutina). */
export async function activarRutina(routineId: string): Promise<void> {
  const { error } = await supabase.rpc('activar_rutina', { p_routine_id: routineId });
  if (error) throw error;
}

/** Borra la rutina con sus dias y ejercicios. Las sesiones quedan en el
 *  historial, sin dia. */
export async function eliminarRutina(routineId: string): Promise<void> {
  const { error, count } = await supabase.from('routines').delete({ count: 'exact' }).eq('id', routineId);
  if (error) throw error;
  if (count === 0) throw new Error('La rutina no existe o no es tuya');
}
