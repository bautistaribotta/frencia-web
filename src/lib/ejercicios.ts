/* Tipos de ejercicio: lo que registra cada uno y como se lee de la base.
   Copia de la parte de src/lib/exercises.ts del repo mobile que usan las
   rutinas y el historial; el catalogo llega con el constructor. */

/** Categoria del ejercicio (exercises.kind). */
export type TipoEjercicio = 'fuerza' | 'isometrico' | 'cardio' | 'hibrido';

/** Que datos se piden en cada serie (exercises.tracks_*). */
export interface DatosRegistrados {
  weight: boolean;
  reps: boolean;
  duration: boolean;
  distance: boolean;
}

/** Columnas de exercises que describen el tipo, para sumar a cualquier select
 *  que embeba el ejercicio. */
export const COLUMNAS_TIPO = 'kind, tracks_weight, tracks_reps, tracks_duration, tracks_distance';

export interface FilaTipo {
  kind?: string | null;
  tracks_weight?: boolean | null;
  tracks_reps?: boolean | null;
  tracks_duration?: boolean | null;
  tracks_distance?: boolean | null;
}

/** Tipo y datos registrados de una fila de exercises. Sin datos se asume
 *  fuerza, que es lo que era todo el catalogo antes de los tipos. */
export function tipoDeFila(fila: FilaTipo | null | undefined): { kind: TipoEjercicio; tracks: DatosRegistrados } {
  const kind = fila?.kind;
  return {
    kind: kind === 'isometrico' || kind === 'cardio' || kind === 'hibrido' ? kind : 'fuerza',
    tracks: {
      weight: fila?.tracks_weight ?? true,
      reps: fila?.tracks_reps ?? true,
      duration: fila?.tracks_duration ?? false,
      distance: fila?.tracks_distance ?? false,
    },
  };
}

export type Medidor = 'rir' | 'rpe';

/** Intensidad de una fila de la base. Sin medidor queda "sin intensidad". */
export function intensidadDeFila(
  kind: string | null,
  value: number | string | null,
): { intensityKind: Medidor | null; intensityValue: number | null } {
  if (kind !== 'rir' && kind !== 'rpe') return { intensityKind: null, intensityValue: null };
  return { intensityKind: kind, intensityValue: value === null ? null : Number(value) };
}

/** "RIR 2", "RPE 8" o "Al fallo" (RIR -1). */
export function textoIntensidad(kind: Medidor, value: number): string {
  if (kind === 'rir') return value < 0 ? 'Al fallo' : `RIR ${value}`;
  return `RPE ${value}`;
}
