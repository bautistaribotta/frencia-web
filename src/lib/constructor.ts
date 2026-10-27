/* Constructor de rutinas: el borrador que se edita en memoria, sus acciones y
   lo que se manda a guardar_rutina_completa. Modulo puro (salvo los uid),
   para poder probarlo.

   Las reglas de cada tipo son las de la base (triggers de
   training_day_exercises) y las del configurador de la app movil
   (src/lib/config-ejercicio.ts y src/lib/dia.ts del repo mobile):
   - Fuerza e hibrido: series, reps si las registra, intensidad obligatoria
     (RIR con "al fallo" = -1, o RPE) y descanso.
   - Isometrico: series, tiempo por serie obligatorio, peso opcional si lo
     registra, RPE opcional y descanso.
   - Cardio: una sola serie continua sin descanso; tiempo obligatorio,
     distancia y RPE opcionales. */

import type { EjercicioCatalogo } from './catalogo';
import type { DatosRegistrados, Medidor, TipoEjercicio } from './ejercicios';
import type { EjercicioPlan, RutinaDetalle } from './rutinas';

export const MAX_DIAS = 7;

export interface EjercicioBorrador extends EjercicioPlan {
  /** Identidad de la tarjeta, estable aunque se mueva o se repita el
   *  ejercicio: el indice no sirve de key mientras se arrastra. */
  uid: string;
  exerciseId: string;
}

export interface DiaBorrador {
  uid: string;
  /** null = dia nuevo, todavia no guardado. */
  id: string | null;
  name: string;
  /** 0 = lunes ... 6 = domingo, ordenados. */
  weekdays: number[];
  ejercicios: EjercicioBorrador[];
}

export interface Borrador {
  name: string;
  dias: DiaBorrador[];
}

let secuencia = 0;
export function nuevoUid(prefijo: string): string {
  secuencia += 1;
  return `${prefijo}-${secuencia}`;
}

// Valores de arranque, los mismos de la app: dos minutos de descanso en
// fuerza, una plancha de 30 s con un minuto de descanso y 30 min de cardio.
export const DESCANSO_POR_DEFECTO = 120;
const DESCANSO_ISOMETRICO = 60;
const TIEMPO_ISOMETRICO = 30;
const TIEMPO_CARDIO = 30 * 60;
const REPS_POR_DEFECTO = 10;
const SERIES_POR_DEFECTO = 3;

/** El descanso se elige cada 5 s hasta 10:55, como en la app. */
export const DESCANSO_MAXIMO = 10 * 60 + 55;

/** Cardio: una sola serie continua, sin descanso. */
export function esSerieUnica(kind: TipoEjercicio): boolean {
  return kind === 'cardio';
}

/** Cardio e isometricos miden el esfuerzo solo con RPE, y es opcional. */
export function esRpeOpcional(kind: TipoEjercicio): boolean {
  return kind === 'cardio' || kind === 'isometrico';
}

/** El plan prescribe peso solo en isometricos que lo registran. */
export function planificaPeso(kind: TipoEjercicio, tracks: DatosRegistrados): boolean {
  return kind === 'isometrico' && tracks.weight;
}

/** En cardio e isometricos el tiempo es lo unico obligatorio del plan. */
export function pideTiempo(kind: TipoEjercicio, tracks: DatosRegistrados): boolean {
  return (kind === 'cardio' || kind === 'isometrico') && tracks.duration;
}

/** Rango de la intensidad: en RIR el minimo es "al fallo" (-1). */
export function rangoIntensidad(medidor: Medidor): { min: number; max: number } {
  return medidor === 'rir' ? { min: -1, max: 5 } : { min: 1, max: 10 };
}

export function intensidadPorDefecto(medidor: Medidor, kind: TipoEjercicio = 'fuerza'): number {
  if (kind === 'cardio') return 6;
  return medidor === 'rir' ? 2 : 8;
}

/** Un ejercicio del catalogo recien agregado a un dia, con los valores de
 *  siempre para su tipo. `medidor` es la preferencia del perfil. */
export function ejercicioNuevo(e: Pick<EjercicioCatalogo, 'id' | 'name' | 'kind' | 'tracks'>, medidor: Medidor): EjercicioBorrador {
  const base = {
    uid: nuevoUid('ej'),
    exerciseId: e.id,
    name: e.name,
    kind: e.kind,
    tracks: e.tracks,
    reps: null,
    durationSeconds: null,
    distanceM: null,
    weightKg: null,
  };
  if (esSerieUnica(e.kind)) {
    return {
      ...base,
      sets: 1,
      durationSeconds: e.tracks.duration ? TIEMPO_CARDIO : null,
      intensityKind: null,
      intensityValue: null,
      restSeconds: null,
    };
  }
  if (e.kind === 'isometrico') {
    return {
      ...base,
      sets: SERIES_POR_DEFECTO,
      durationSeconds: e.tracks.duration ? TIEMPO_ISOMETRICO : null,
      intensityKind: null,
      intensityValue: null,
      restSeconds: DESCANSO_ISOMETRICO,
    };
  }
  return {
    ...base,
    sets: SERIES_POR_DEFECTO,
    reps: e.tracks.reps ? REPS_POR_DEFECTO : null,
    intensityKind: medidor,
    intensityValue: intensidadPorDefecto(medidor),
    restSeconds: DESCANSO_POR_DEFECTO,
  };
}

export function diaNuevo(n: number): DiaBorrador {
  return { uid: nuevoUid('dia'), id: null, name: `Día ${n}`, weekdays: [], ejercicios: [] };
}

/** Rutina nueva: sin nombre y con un solo dia vacio. */
export function borradorNuevo(): Borrador {
  return { name: '', dias: [diaNuevo(1)] };
}

/** La rutina guardada, lista para editar. */
export function borradorDeRutina(r: RutinaDetalle): Borrador {
  return {
    name: r.name,
    dias: r.dias.map((d) => ({
      uid: nuevoUid('dia'),
      id: d.id,
      name: d.name,
      weekdays: d.weekdays.slice(),
      ejercicios: d.plan.map((p) => ({ ...p, uid: nuevoUid('ej') })),
    })),
  };
}

export type Accion =
  | { tipo: 'nombre'; valor: string }
  | { tipo: 'agregarDia' }
  | { tipo: 'quitarDia'; dia: string }
  | { tipo: 'duplicarDia'; dia: string }
  | { tipo: 'nombreDia'; dia: string; valor: string }
  | { tipo: 'semana'; dia: string; weekday: number }
  | { tipo: 'moverDia'; dia: string; indice: number }
  | { tipo: 'agregarEjercicio'; dia: string; ejercicio: EjercicioBorrador; indice?: number }
  | { tipo: 'moverEjercicio'; uid: string; dia: string; indice: number }
  | { tipo: 'quitarEjercicio'; uid: string }
  | { tipo: 'configurar'; uid: string; cambios: Partial<EjercicioPlan> }
  | { tipo: 'restaurar'; borrador: Borrador };

function conDia(b: Borrador, uid: string, cambio: (d: DiaBorrador) => DiaBorrador): Borrador {
  return { ...b, dias: b.dias.map((d) => (d.uid === uid ? cambio(d) : d)) };
}

function mover<T>(lista: T[], desde: number, hasta: number): T[] {
  const copia = lista.slice();
  const [item] = copia.splice(desde, 1);
  copia.splice(hasta, 0, item);
  return copia;
}

const acotar = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function reducerBorrador(b: Borrador, a: Accion): Borrador {
  switch (a.tipo) {
    case 'nombre':
      return { ...b, name: a.valor };
    case 'agregarDia':
      if (b.dias.length >= MAX_DIAS) return b;
      return { ...b, dias: [...b.dias, diaNuevo(b.dias.length + 1)] };
    case 'quitarDia':
      // Siempre queda al menos un dia.
      if (b.dias.length <= 1) return b;
      return { ...b, dias: b.dias.filter((d) => d.uid !== a.dia) };
    case 'duplicarDia': {
      if (b.dias.length >= MAX_DIAS) return b;
      const i = b.dias.findIndex((d) => d.uid === a.dia);
      if (i < 0) return b;
      const original = b.dias[i];
      const copia: DiaBorrador = {
        uid: nuevoUid('dia'),
        id: null,
        name: `${original.name} (copia)`,
        // Los dias de la semana no se copian: dos dias el mismo lunes no
        // suelen ser lo que se quiere.
        weekdays: [],
        ejercicios: original.ejercicios.map((e) => ({ ...e, uid: nuevoUid('ej') })),
      };
      const dias = b.dias.slice();
      dias.splice(i + 1, 0, copia);
      return { ...b, dias };
    }
    case 'nombreDia':
      return conDia(b, a.dia, (d) => ({ ...d, name: a.valor }));
    case 'semana':
      return conDia(b, a.dia, (d) => ({
        ...d,
        weekdays: d.weekdays.includes(a.weekday)
          ? d.weekdays.filter((w) => w !== a.weekday)
          : [...d.weekdays, a.weekday].sort((x, y) => x - y),
      }));
    case 'moverDia': {
      const desde = b.dias.findIndex((d) => d.uid === a.dia);
      if (desde < 0) return b;
      const hasta = acotar(a.indice, 0, b.dias.length - 1);
      return desde === hasta ? b : { ...b, dias: mover(b.dias, desde, hasta) };
    }
    case 'agregarEjercicio':
      return conDia(b, a.dia, (d) => {
        const ejercicios = d.ejercicios.slice();
        ejercicios.splice(acotar(a.indice ?? ejercicios.length, 0, ejercicios.length), 0, a.ejercicio);
        return { ...d, ejercicios };
      });
    case 'moverEjercicio': {
      const origen = b.dias.find((d) => d.ejercicios.some((e) => e.uid === a.uid));
      const destino = b.dias.find((d) => d.uid === a.dia);
      if (!origen || !destino) return b;
      const ejercicio = origen.ejercicios.find((e) => e.uid === a.uid)!;
      if (origen === destino) {
        const desde = origen.ejercicios.indexOf(ejercicio);
        const hasta = acotar(a.indice, 0, origen.ejercicios.length - 1);
        if (desde === hasta) return b;
        return conDia(b, origen.uid, (d) => ({ ...d, ejercicios: mover(d.ejercicios, desde, hasta) }));
      }
      const sinEl = conDia(b, origen.uid, (d) => ({ ...d, ejercicios: d.ejercicios.filter((e) => e.uid !== a.uid) }));
      return reducerBorrador(sinEl, { tipo: 'agregarEjercicio', dia: destino.uid, ejercicio, indice: a.indice });
    }
    case 'quitarEjercicio':
      return { ...b, dias: b.dias.map((d) => ({ ...d, ejercicios: d.ejercicios.filter((e) => e.uid !== a.uid) })) };
    case 'configurar':
      return {
        ...b,
        dias: b.dias.map((d) => ({ ...d, ejercicios: d.ejercicios.map((e) => (e.uid === a.uid ? { ...e, ...a.cambios } : e)) })),
      };
    case 'restaurar':
      return a.borrador;
  }
}

/** Donde esta un ejercicio: su dia y su posicion. */
export function ubicar(b: Borrador, uid: string): { dia: DiaBorrador; indice: number } | null {
  for (const dia of b.dias) {
    const indice = dia.ejercicios.findIndex((e) => e.uid === uid);
    if (indice >= 0) return { dia, indice };
  }
  return null;
}

export function contarEjercicios(b: Borrador): number {
  return b.dias.reduce((total, d) => total + d.ejercicios.length, 0);
}

export type Problema = 'nombre' | 'vacia' | 'tiempo';

/** Lo que impide guardar. Guardar se habilita con un nombre, al menos un
 *  ejercicio y el tiempo de cada cardio e isometrico. */
export function problemas(b: Borrador): Problema[] {
  const lista: Problema[] = [];
  if (!b.name.trim()) lista.push('nombre');
  if (contarEjercicios(b) === 0) lista.push('vacia');
  const sinTiempo = b.dias.some((d) => d.ejercicios.some((e) => pideTiempo(e.kind, e.tracks) && !e.durationSeconds));
  if (sinTiempo) lista.push('tiempo');
  return lista;
}

/** Fila de training_day_exercises para la RPC. Lo que el ejercicio no
 *  registra va en null: el trigger de la tabla rechaza cualquier dato de mas. */
export function filaEjercicio(e: EjercicioBorrador) {
  const unica = esSerieUnica(e.kind);
  const tiempo = e.tracks.duration && (unica || e.kind === 'isometrico');
  return {
    exercise_id: e.exerciseId,
    sets: unica ? 1 : e.sets,
    reps: e.tracks.reps && !unica && e.kind !== 'isometrico' ? e.reps : null,
    duration_seconds: tiempo ? e.durationSeconds : null,
    distance_m: unica && e.tracks.distance ? e.distanceM : null,
    weight_kg: planificaPeso(e.kind, e.tracks) ? e.weightKg : null,
    intensity_kind: e.intensityKind,
    intensity_value: e.intensityKind === null ? null : e.intensityValue,
    rest_seconds: unica ? null : e.restSeconds,
  };
}

/** p_dias de guardar_rutina_completa: el orden final completo. */
export function diasParaGuardar(b: Borrador) {
  return b.dias.map((d, i) => ({
    id: d.id,
    name: d.name.trim() || `Día ${i + 1}`,
    weekdays: d.weekdays,
    exercises: d.ejercicios.map(filaEjercicio),
  }));
}

/** Lo que se guarda, sin los uid: dos borradores con la misma firma son la
 *  misma rutina. Sirve para saber si hay cambios sin guardar. */
export function firma(b: Borrador): string {
  return JSON.stringify({ name: b.name.trim(), dias: diasParaGuardar(b) });
}

/** "1º", "2º"... para el sello del arrastre. */
export function ordinal(n: number): string {
  return `${n}º`;
}
