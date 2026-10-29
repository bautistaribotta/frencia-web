/* Actividad del inicio: los dias entrenados, como el cuadro de contribuciones
   de GitHub (README del kit, «Inicio»), y el dia de la rutina que toca.
   La consulta trae las sesiones terminadas del ultimo año; el resto es puro
   para poder probarlo. Las fechas van en hora local, como la racha. */

import type { DiaResumen } from './inicio';
import { fechaLocal } from './streak';
import { supabase } from './supabase';
import { indiceSemanaLunes } from './tiempo';

/** Una sesion terminada, reducida a lo que usan Actividad y la racha. */
export interface SesionHecha {
  /** Fecha local "YYYY-MM-DD" en que termino. */
  fecha: string;
  /** El dia de la rutina, o null si se borro (la sesion sobrevive). */
  diaId: string | null;
  diaNombre: string | null;
  series: number;
}

/** Semanas que se muestran: el año en escritorio, 6 meses en la tablet y 5
 *  semanas (unos 30 dias) en el telefono. */
export const SEMANAS = { escritorio: 53, tablet: 26, telefono: 5 } as const;

/** Las sesiones terminadas de las ultimas 53 semanas, de la mas nueva a la
 *  mas vieja. Tira si falla. */
export async function cargarActividad(userId: string): Promise<SesionHecha[]> {
  const desde = new Date();
  desde.setDate(desde.getDate() - SEMANAS.escritorio * 7);
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('finished_at, training_day_id, training_days(name), session_sets(count)')
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
    .gte('finished_at', desde.toISOString())
    .order('finished_at', { ascending: false });
  if (error) throw error;
  return data.map((fila) => ({
    fecha: fechaLocal(Date.parse(fila.finished_at as string)),
    diaId: fila.training_day_id,
    diaNombre: fila.training_days?.name ?? null,
    series: fila.session_sets?.[0]?.count ?? 0,
  }));
}

export interface Celda {
  fecha: Date;
  sesiones: SesionHecha[];
  hoy: boolean;
  /** Todavia no llego: ocupa su lugar pero no se dibuja. */
  futuro: boolean;
}

export interface Actividad {
  /** Una columna por semana, de la mas vieja a la mas nueva; cada una de lunes a domingo. */
  semanas: Celda[][];
  /** Donde empieza cada mes: la columna y su indice (0 = enero). */
  meses: { columna: number; mes: number }[];
  /** Sesiones dentro de lo que se muestra. */
  total: number;
}

/** Arma las `semanas` columnas que terminan en la semana de `hoy`. */
export function armarActividad(sesiones: SesionHecha[], hoy: Date, semanas: number): Actividad {
  const porFecha = new Map<string, SesionHecha[]>();
  for (const s of sesiones) porFecha.set(s.fecha, [...(porFecha.get(s.fecha) ?? []), s]);

  const claveHoy = fechaLocal(hoy.getTime());
  const primerLunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - indiceSemanaLunes(hoy) - (semanas - 1) * 7);
  const columnas: Celda[][] = [];
  const meses: Actividad['meses'] = [];
  let total = 0;
  for (let c = 0; c < semanas; c++) {
    const columna: Celda[] = [];
    for (let f = 0; f < 7; f++) {
      const fecha = new Date(primerLunes.getFullYear(), primerLunes.getMonth(), primerLunes.getDate() + c * 7 + f);
      const clave = fechaLocal(fecha.getTime());
      const futuro = clave > claveHoy;
      const delDia = futuro ? [] : (porFecha.get(clave) ?? []);
      total += delDia.length;
      columna.push({ fecha, sesiones: delDia, hoy: clave === claveHoy, futuro });
    }
    // El mes va en la columna donde cambia; no en las dos ultimas, donde no entra.
    const mes = columna[0].fecha.getMonth();
    const anterior = c === 0 ? -1 : columnas[c - 1][0].fecha.getMonth();
    if (mes !== anterior && c < semanas - 2) meses.push({ columna: c, mes });
    columnas.push(columna);
  }
  // Si el primer mes queda pegado al segundo, se saca: se pisarian.
  if (meses.length > 1 && meses[1].columna - meses[0].columna < 3) meses.shift();
  return { semanas: columnas, meses, total };
}

export type DiaQueToca = { id: string; cuando: 'hoy' } | { id: string; cuando: 'proximo'; weekday: number | null };

/**
 * El dia de la rutina que toca: hoy, si hoy es dia de entrenar y todavia no
 * hay sesion terminada hoy; si no, el proximo dia de la semana con un dia
 * asignado. Si dos dias caen el mismo dia de la semana, gana el primero. Sin
 * dias de la semana asignados, el que sigue al ultimo que se entreno.
 *
 * @param sesiones las sesiones terminadas, de la mas nueva a la mas vieja.
 */
export function diaQueToca(dias: DiaResumen[], sesiones: SesionHecha[], hoy: Date): DiaQueToca | null {
  if (dias.length === 0) return null;
  const weekdayHoy = indiceSemanaLunes(hoy);
  const conDias = dias.some((d) => d.weekdays.length > 0);

  if (conDias) {
    const entrenoHoy = sesiones.some((s) => s.fecha === fechaLocal(hoy.getTime()));
    const deHoy = dias.find((d) => d.weekdays.includes(weekdayHoy));
    if (deHoy && !entrenoHoy) return { id: deHoy.id, cuando: 'hoy' };
    for (let i = 1; i <= 7; i++) {
      const weekday = (weekdayHoy + i) % 7;
      const dia = dias.find((d) => d.weekdays.includes(weekday));
      if (dia) return { id: dia.id, cuando: 'proximo', weekday };
    }
  }

  // Sin calendario: en orden, el que sigue al ultimo entrenado de esta rutina.
  const ultima = sesiones.find((s) => dias.some((d) => d.id === s.diaId));
  const indice = ultima ? dias.findIndex((d) => d.id === ultima.diaId) : -1;
  return { id: dias[(indice + 1) % dias.length].id, cuando: 'proximo', weekday: null };
}
