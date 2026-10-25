/* La tira "Esta semana" del inicio: los siete dias de la semana en curso
   (lunes a domingo) con lo que la rutina activa planifica cada uno y si se
   cumplio. Modulo puro, como streak.ts, para poder probarlo. */

import { fechaLocal } from './streak';

export type EstadoDia = 'hecho' | 'hoy' | 'salteado' | 'pendiente' | 'libre';

export interface DiaSemana {
  fecha: Date;
  /** Nombre del dia de la rutina que toca, o null si es descanso. */
  plan: string | null;
  estado: EstadoDia;
}

export interface Semana {
  dias: DiaSemana[];
  planificados: number;
  cumplidos: number;
}

/**
 * - hecho: hay una sesion terminada esa fecha (planificada o no).
 * - hoy: hoy toca y todavia no se entreno.
 * - salteado: tocaba un dia que ya paso y no se entreno.
 * - pendiente: toca un dia que todavia no llego.
 * - libre: descanso.
 * Si dos dias de la rutina caen el mismo weekday se muestra el primero.
 */
export function semanaActual(
  dias: { name: string; weekdays: number[] }[],
  fechasEntrenadas: Iterable<string>,
  ahora: Date,
): Semana {
  const entrenadas = new Set(fechasEntrenadas);
  const hoy = fechaLocal(ahora.getTime());
  const indiceHoy = (ahora.getDay() + 6) % 7;
  const plan = new Map<number, string>();
  for (const d of dias) for (const w of d.weekdays) if (!plan.has(w)) plan.set(w, d.name);

  let planificados = 0;
  let cumplidos = 0;
  const lista: DiaSemana[] = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - indiceHoy + i);
    const clave = fechaLocal(fecha.getTime());
    const toca = plan.get(i) ?? null;
    const entreno = entrenadas.has(clave);
    if (toca) planificados += 1;
    if (toca && entreno) cumplidos += 1;

    let estado: EstadoDia;
    if (entreno) estado = 'hecho';
    else if (!toca) estado = 'libre';
    else if (clave === hoy) estado = 'hoy';
    else if (clave < hoy) estado = 'salteado';
    else estado = 'pendiente';
    lista.push({ fecha, plan: toca, estado });
  }
  return { dias: lista, planificados, cumplidos };
}
