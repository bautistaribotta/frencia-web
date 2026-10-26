import * as React from 'react';
import type { Exercise, ExercisePlan, UnitPrefs, IntensityScale } from '../ExerciseMetrics/ExerciseMetrics';

export interface SerieValues { peso?: number | null; reps?: number | null; tiempo?: number | null; distancia?: number | null; intensityValue?: number | null; }

export interface SerieComparativaProps extends React.HTMLAttributes<HTMLDivElement> {
  exercise: Exercise;
  /** Plan de la serie. El peso se ignora: el plan nunca lo prescribe. */
  plan?: ExercisePlan;
  /** Misma serie en la sesión anterior. null/undefined → "—". */
  previous?: SerieValues | null;
  /** Valores cargados hoy (en vivo). Lo que falta → "—". */
  today?: SerieValues;
  /** Escala de intensidad. Default plan.intensity. null = sin columna. */
  intensity?: IntensityScale | null;
  prefs?: UnitPrefs;
  /** Celda de "Hoy" que se está editando (subrayado de acero). */
  activeKey?: string;
  /** Rotulo arriba ("Serie 2 de 3"). */
  title?: string;
}

/** Grilla Plan / Anterior / Hoy con columnas dinámicas según los datos del ejercicio. */
export function SerieComparativa(props: SerieComparativaProps): React.ReactElement;
