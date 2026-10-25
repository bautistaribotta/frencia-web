/* Correr con `npm test` (Vitest). */

import { assert, test, vi } from 'vitest';

import { cuentaRutina, resumenEjercicio, type EjercicioPlan } from './rutinas';

// Solo se prueban funciones puras: sin cliente real, que pide el .env.local.
vi.mock('./supabase', () => ({ supabase: {} }));

const fuerza: EjercicioPlan = {
  name: 'Press de banca con barra',
  kind: 'fuerza',
  tracks: { weight: true, reps: true, duration: false, distance: false },
  sets: 4,
  reps: 8,
  durationSeconds: null,
  distanceM: null,
  weightKg: null,
  intensityKind: 'rir',
  intensityValue: 2,
  restSeconds: 120,
};

test('la fuerza se resume como series por reps, intensidad y descanso en reloj', () => {
  assert.deepEqual(resumenEjercicio(fuerza, 'kg', 'km'), { volumen: '4×8', intensidad: 'RIR 2', descanso: '2:00' });
});

test('RIR -1 se lee como al fallo y sin descanso no se muestra', () => {
  const r = resumenEjercicio({ ...fuerza, intensityValue: -1, restSeconds: null }, 'kg', 'km');
  assert.strictEqual(r.intensidad, 'Al fallo');
  assert.strictEqual(r.descanso, null);
});

test('el cardio de una sola serie no lleva prefijo ni descanso', () => {
  const cardio: EjercicioPlan = {
    ...fuerza,
    kind: 'cardio',
    tracks: { weight: false, reps: false, duration: true, distance: true },
    sets: 1,
    reps: null,
    durationSeconds: 1800,
    distanceM: 5000,
    intensityKind: null,
    intensityValue: null,
  };
  assert.deepEqual(resumenEjercicio(cardio, 'kg', 'km'), { volumen: '30 min · 5 km', intensidad: null, descanso: null });
});

test('el isometrico con peso lo suma en la unidad del usuario', () => {
  const plancha: EjercicioPlan = {
    ...fuerza,
    kind: 'isometrico',
    tracks: { weight: true, reps: false, duration: true, distance: false },
    sets: 3,
    reps: null,
    durationSeconds: 45,
    weightKg: 10,
    intensityKind: 'rpe',
    intensityValue: 8,
    restSeconds: 60,
  };
  assert.deepEqual(resumenEjercicio(plancha, 'lb', 'km'), { volumen: '3×45 s · 22 lb', intensidad: 'RPE 8', descanso: '1:00' });
});

test('la cuenta de la rutina respeta el singular', () => {
  const dia = { id: 'd', name: 'Push', weekdays: [], ejercicios: 1 };
  assert.strictEqual(cuentaRutina({ dias: [dia], ejercicios: 1, sesiones: 1 }), '1 día · 1 ejercicio · 1 sesión');
  assert.strictEqual(cuentaRutina({ dias: [dia, dia, dia], ejercicios: 18, sesiones: 24 }), '3 días · 18 ejercicios · 24 sesiones');
});
