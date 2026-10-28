/* El ticket de una sesion (kit web, Web · 6): numero, codigo y barras que
   salen del id, la fecha corta, la mejor serie de cada ejercicio y la mejor
   marca de la sesion. Port de src/lib/resumen-sesion.ts del repo mobile. */

import { distanciaCompacta, type UnidadDistancia } from './distancia';
import type { EjercicioRealizado } from './historial';
import { mostrarPeso, type UnidadPeso } from './peso';
import { MESES_MAYUS, reloj } from './tiempo';

/** "7C1E2A": los 6 primeros del id. */
export function numeroTicket(sessionId: string): string {
  return sessionId.replace(/-/g, '').slice(0, 6).toUpperCase();
}

/** "FRENCIA-7C1E-2A9B4F3". */
export function codigoTicket(sessionId: string): string {
  const hex = sessionId.replace(/-/g, '').toUpperCase();
  return `FRENCIA-${hex.slice(0, 4)}-${hex.slice(4, 11)}`;
}

/** Anchos del codigo de barras decorativo: cada cifra hexadecimal del id da
 *  una barra de 1 a 3 px y un espacio de 1 a 4. Siempre el mismo por sesion. */
export function barrasTicket(sessionId: string): { barra: number; espacio: number }[] {
  const hex = sessionId.replace(/[^0-9a-f]/gi, '') || '0';
  return [...hex].map((c) => {
    const n = parseInt(c, 16);
    return { barra: 1 + (n % 3), espacio: 1 + (n >> 2) };
  });
}

/** "9 OCT 2026 · 07:42", armado a mano para no depender del motor. */
export function fechaTicket(epochMs: number): string {
  const d = new Date(epochMs);
  const hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${d.getDate()} ${MESES_MAYUS[d.getMonth()]} ${d.getFullYear()} · ${hora}`;
}

const maximo = (valores: (number | null)[]) => valores.reduce<number | null>((m, v) => (v !== null && (m === null || v > m) ? v : m), null);

/** La mejor serie de un ejercicio en una cifra. Fuerza: el peso mas alto, o
 *  las reps si se hizo sin carga. Isometrico: el tiempo mas largo. Cardio: la
 *  distancia, o el tiempo si no se midio. */
export function mejorSerie(ej: EjercicioRealizado, unidad: UnidadPeso, unidadDistancia: UnidadDistancia): string {
  const peso = ej.tracks.weight ? maximo(ej.series.map((s) => s.weightKg)) : null;
  const reps = ej.tracks.reps ? maximo(ej.series.map((s) => s.reps)) : null;
  const tiempo = ej.tracks.duration ? maximo(ej.series.map((s) => s.durationSeconds)) : null;
  const distancia = ej.tracks.distance ? maximo(ej.series.map((s) => s.distanceM)) : null;

  if (ej.kind === 'cardio') {
    if (distancia !== null) return distanciaCompacta(distancia, unidadDistancia);
    return tiempo !== null ? reloj(tiempo) : '';
  }
  if (ej.kind === 'isometrico') return tiempo !== null ? reloj(tiempo) : '';
  if (peso !== null && peso > 0) return `${mostrarPeso(peso, unidad)} ${unidad}`;
  if (reps !== null) return `${reps} reps`;
  return tiempo !== null ? reloj(tiempo) : '';
}

/** La mejor marca de la sesion: el peso mas alto que se levanto, o null si
 *  ninguna serie llevo peso. */
export function mejorMarcaSesion(ejercicios: EjercicioRealizado[], unidad: UnidadPeso): string | null {
  const peso = maximo(ejercicios.filter((e) => e.tracks.weight).flatMap((e) => e.series.map((s) => s.weightKg)));
  return peso !== null && peso > 0 ? `${mostrarPeso(peso, unidad)} ${unidad}` : null;
}

/** "frencia-push-2026-10-09.png". */
export function archivoTicket(nombreDia: string | null, epochMs: number): string {
  const d = new Date(epochMs);
  const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const nombre = (nombreDia ?? 'sesion')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `frencia-${nombre || 'sesion'}-${fecha}.png`;
}
