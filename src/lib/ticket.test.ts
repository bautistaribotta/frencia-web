/* Correr con `npm test` (Vitest). */

import { expect, test } from 'vitest';

import type { EjercicioRealizado, SerieRealizada } from './historial';
import { archivoTicket, barrasTicket, codigoTicket, fechaTicket, mejorMarcaSesion, mejorSerie, numeroTicket } from './ticket';

const ID = '7c1e2a9b-4f3d-4e21-9a0b-5d8c3e1f6a72';

const serie = (s: Partial<SerieRealizada>): SerieRealizada => ({
  id: 's',
  setIndex: 0,
  weightKg: null,
  reps: null,
  durationSeconds: null,
  distanceM: null,
  intensityKind: null,
  intensityValue: null,
  completedAt: 0,
  ...s,
});
const fuerza = { weight: true, reps: true, duration: false, distance: false };

test('numero, codigo y barras salen del id y siempre son los mismos', () => {
  expect(numeroTicket(ID)).toBe('7C1E2A');
  expect(codigoTicket(ID)).toBe('FRENCIA-7C1E-2A9B4F3');
  const barras = barrasTicket(ID);
  expect(barras).toHaveLength(32);
  expect(barras[0]).toEqual({ barra: 2, espacio: 2 });
  expect(barrasTicket(ID)).toEqual(barras);
});

test('fecha corta del ticket', () => {
  expect(fechaTicket(new Date(2026, 9, 9, 7, 42).getTime())).toBe('9 OCT 2026 · 07:42');
});

test('mejor serie: peso, reps sin carga, tiempo y distancia', () => {
  const banca: EjercicioRealizado = { exerciseId: 'e1', name: 'Press', kind: 'fuerza', tracks: fuerza, series: [serie({ weightKg: 80, reps: 8 }), serie({ weightKg: 82.5, reps: 6 })] };
  expect(mejorSerie(banca, 'kg', 'km')).toBe('82.5 kg');
  const fondos: EjercicioRealizado = { ...banca, series: [serie({ weightKg: 0, reps: 12 }), serie({ weightKg: 0, reps: 10 })] };
  expect(mejorSerie(fondos, 'kg', 'km')).toBe('12 reps');
  const plancha: EjercicioRealizado = { ...banca, kind: 'isometrico', tracks: { weight: true, reps: false, duration: true, distance: false }, series: [serie({ durationSeconds: 55 }), serie({ durationSeconds: 60 })] };
  expect(mejorSerie(plancha, 'kg', 'km')).toBe('1:00');
  const cinta: EjercicioRealizado = { ...banca, kind: 'cardio', tracks: { weight: false, reps: false, duration: true, distance: true }, series: [serie({ durationSeconds: 1800, distanceM: 5100 })] };
  expect(mejorSerie(cinta, 'kg', 'km')).toBe('5.1 km');
});

test('mejor marca de la sesion: el peso mas alto, o nada sin peso', () => {
  const banca: EjercicioRealizado = { exerciseId: 'e1', name: 'Press', kind: 'fuerza', tracks: fuerza, series: [serie({ weightKg: 82.5, reps: 6 })] };
  const remo: EjercicioRealizado = { ...banca, exerciseId: 'e2', series: [serie({ weightKg: 90, reps: 8 })] };
  expect(mejorMarcaSesion([banca, remo], 'kg')).toBe('90 kg');
  expect(mejorMarcaSesion([{ ...banca, series: [serie({ weightKg: 0, reps: 10 })] }], 'kg')).toBeNull();
});

test('nombre del archivo, sin tildes ni espacios', () => {
  expect(archivoTicket('Pierna & glúteo', new Date(2026, 9, 9).getTime())).toBe('frencia-pierna-gluteo-2026-10-09.png');
  expect(archivoTicket(null, new Date(2026, 0, 2).getTime())).toBe('frencia-sesion-2026-01-02.png');
});
