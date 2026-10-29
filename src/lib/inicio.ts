/* Lecturas del inicio: la rutina activa con sus dias, la misma consulta que
   usa la app (src/lib/rutinas.ts del repo mobile), y las ultimas sesiones,
   propias del escritorio. La actividad del ultimo año, que tambien da la
   racha, vive en actividad.ts. */

import type { QueryData } from '@supabase/supabase-js';

import { supabase } from './supabase';

export interface DiaResumen {
  id: string;
  name: string;
  /** Dias de la semana asignados, 0 = lunes ... 6 = domingo. */
  weekdays: number[];
  ejercicios: number;
}

export interface RutinaDetalle {
  id: string;
  name: string;
  dias: DiaResumen[];
}

export interface SesionReciente {
  id: string;
  /** Nombre del dia, o null si el dia se borro (la sesion sobrevive). */
  dayName: string | null;
  startedAt: number;
  finishedAt: number;
  series: number;
}

const COLUMNAS_DETALLE =
  'id, name, training_days(id, name, position, training_day_weekdays(weekday), training_day_exercises(count))';

function consultaDetalle() {
  return supabase.from('routines').select(COLUMNAS_DETALLE);
}

function aDetalle(data: QueryData<ReturnType<typeof consultaDetalle>>[number]): RutinaDetalle {
  return {
    id: data.id,
    name: data.name,
    dias: (data.training_days ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((d) => ({
        id: d.id,
        name: d.name,
        weekdays: (d.training_day_weekdays ?? []).map((w) => w.weekday).sort((a, b) => a - b),
        ejercicios: d.training_day_exercises?.[0]?.count ?? 0,
      })),
  };
}

/** La rutina activa (archived_at nulo; hay una sola), con sus dias, weekdays y
 *  cuenta de ejercicios en una sola consulta. null si no hay. Tira si falla
 *  la lectura, para que el inicio no la confunda con una cuenta nueva. */
export async function cargarRutinaActiva(userId: string): Promise<RutinaDetalle | null> {
  const { data, error } = await consultaDetalle().eq('user_id', userId).is('archived_at', null).maybeSingle();
  if (error) throw error;
  return data ? aDetalle(data) : null;
}

/** Las ultimas sesiones terminadas, con la cantidad de series registradas. */
export async function cargarUltimasSesiones(userId: string, cantidad = 3): Promise<SesionReciente[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('id, started_at, finished_at, training_days(name), session_sets(count)')
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
    .order('finished_at', { ascending: false })
    .limit(cantidad);
  if (error) throw error;
  return data.map((fila) => ({
    id: fila.id,
    dayName: fila.training_days?.name ?? null,
    startedAt: Date.parse(fila.started_at),
    finishedAt: Date.parse(fila.finished_at as string),
    series: fila.session_sets?.[0]?.count ?? 0,
  }));
}
