/* Correr con `npm test` (Vitest). */

import { assert, test, vi } from 'vitest';

import { filtrarCatalogo, gruposDelCatalogo, plegar, type EjercicioCatalogo } from './catalogo';
import {
  borradorNuevo,
  diasParaGuardar,
  ejercicioNuevo,
  firma,
  MAX_DIAS,
  problemas,
  reducerBorrador,
  type Borrador,
} from './constructor';

vi.mock('./supabase', () => ({ supabase: {} }));

const FUERZA = { weight: true, reps: true, duration: false, distance: false };
const PLANCHA = { weight: true, reps: false, duration: true, distance: false };
const CORRER = { weight: false, reps: false, duration: true, distance: true };

const pecho = { slug: 'pecho', name: 'Pecho', position: 0 };
const core = { slug: 'core', name: 'Core', position: 6 };

const banca: EjercicioCatalogo = { id: 'e1', name: 'Press de banca con barra', nameEn: 'Barbell bench press', equipment: 'barra', primario: pecho, secundarios: [], kind: 'fuerza', tracks: FUERZA };
const plancha: EjercicioCatalogo = { id: 'e2', name: 'Plancha', nameEn: 'Plank', equipment: 'peso corporal', primario: core, secundarios: [], kind: 'isometrico', tracks: PLANCHA };
const cinta: EjercicioCatalogo = { id: 'e3', name: 'Cinta de correr', nameEn: 'Treadmill', equipment: 'cinta', primario: null, secundarios: [], kind: 'cardio', tracks: CORRER };

function conDosDias(): Borrador {
  let b = borradorNuevo();
  b = reducerBorrador(b, { tipo: 'nombre', valor: 'Push Pull' });
  b = reducerBorrador(b, { tipo: 'agregarDia' });
  b = reducerBorrador(b, { tipo: 'agregarEjercicio', dia: b.dias[0].uid, ejercicio: ejercicioNuevo(banca, 'rir') });
  b = reducerBorrador(b, { tipo: 'agregarEjercicio', dia: b.dias[0].uid, ejercicio: ejercicioNuevo(plancha, 'rir') });
  return b;
}

test('valores de arranque segun el tipo', () => {
  const f = ejercicioNuevo(banca, 'rir');
  assert.deepInclude(f, { sets: 3, reps: 10, intensityKind: 'rir', intensityValue: 2, restSeconds: 120 });
  assert.equal(ejercicioNuevo(banca, 'rpe').intensityValue, 8);

  const p = ejercicioNuevo(plancha, 'rir');
  assert.deepInclude(p, { sets: 3, reps: null, durationSeconds: 30, intensityKind: null, restSeconds: 60 });

  const c = ejercicioNuevo(cinta, 'rir');
  assert.deepInclude(c, { sets: 1, durationSeconds: 1800, distanceM: null, intensityKind: null, restSeconds: null });
});

test('rutina nueva: un dia vacio y no se puede guardar', () => {
  const b = borradorNuevo();
  assert.equal(b.dias.length, 1);
  assert.equal(b.dias[0].name, 'Día 1');
  assert.deepEqual(problemas(b), ['nombre', 'vacia']);
});

test('dias: agregar hasta siete, nunca menos de uno', () => {
  let b = borradorNuevo();
  for (let i = 0; i < 10; i++) b = reducerBorrador(b, { tipo: 'agregarDia' });
  assert.equal(b.dias.length, MAX_DIAS);
  assert.equal(b.dias[6].name, 'Día 7');
  for (const d of b.dias.slice()) b = reducerBorrador(b, { tipo: 'quitarDia', dia: d.uid });
  assert.equal(b.dias.length, 1);
});

test('dias de la semana: se alternan y quedan ordenados', () => {
  let b = borradorNuevo();
  const dia = b.dias[0].uid;
  for (const w of [4, 0, 2]) b = reducerBorrador(b, { tipo: 'semana', dia, weekday: w });
  assert.deepEqual(b.dias[0].weekdays, [0, 2, 4]);
  b = reducerBorrador(b, { tipo: 'semana', dia, weekday: 2 });
  assert.deepEqual(b.dias[0].weekdays, [0, 4]);
});

test('mover un ejercicio dentro del dia y a otro dia', () => {
  let b = conDosDias();
  const [primero, segundo] = b.dias[0].ejercicios;
  b = reducerBorrador(b, { tipo: 'moverEjercicio', uid: primero.uid, dia: b.dias[0].uid, indice: 1 });
  assert.deepEqual(b.dias[0].ejercicios.map((e) => e.uid), [segundo.uid, primero.uid]);

  b = reducerBorrador(b, { tipo: 'moverEjercicio', uid: segundo.uid, dia: b.dias[1].uid, indice: 0 });
  assert.deepEqual(b.dias[0].ejercicios.map((e) => e.uid), [primero.uid]);
  assert.deepEqual(b.dias[1].ejercicios.map((e) => e.uid), [segundo.uid]);
});

test('mover un dia y duplicarlo sin sus dias de la semana', () => {
  let b = conDosDias();
  const [a, z] = b.dias;
  b = reducerBorrador(b, { tipo: 'semana', dia: a.uid, weekday: 0 });
  b = reducerBorrador(b, { tipo: 'moverDia', dia: a.uid, indice: 1 });
  assert.deepEqual(b.dias.map((d) => d.uid), [z.uid, a.uid]);

  b = reducerBorrador(b, { tipo: 'duplicarDia', dia: a.uid });
  const copia = b.dias[2];
  assert.equal(copia.name, 'Día 1 (copia)');
  assert.equal(copia.id, null);
  assert.deepEqual(copia.weekdays, []);
  assert.equal(copia.ejercicios.length, 2);
  assert.notEqual(copia.ejercicios[0].uid, b.dias[1].ejercicios[0].uid);
});

test('guardar: el tiempo es obligatorio en isometricos y cardio', () => {
  let b = conDosDias();
  assert.deepEqual(problemas(b), []);
  const plancha = b.dias[0].ejercicios[1];
  b = reducerBorrador(b, { tipo: 'configurar', uid: plancha.uid, cambios: { durationSeconds: null } });
  assert.deepEqual(problemas(b), ['tiempo']);
});

test('lo que se guarda: solo los datos que el ejercicio registra', () => {
  let b = conDosDias();
  b = reducerBorrador(b, { tipo: 'agregarEjercicio', dia: b.dias[1].uid, ejercicio: ejercicioNuevo(cinta, 'rir') });
  // Aunque el estado tenga un descanso, el cardio va sin descanso y en una serie.
  const correr = b.dias[1].ejercicios[0];
  b = reducerBorrador(b, { tipo: 'configurar', uid: correr.uid, cambios: { restSeconds: 90, sets: 3, distanceM: 5000 } });
  b = reducerBorrador(b, { tipo: 'nombreDia', dia: b.dias[1].uid, valor: '   ' });

  const [push, cardio] = diasParaGuardar(b);
  assert.equal(cardio.name, 'Día 2');
  assert.deepEqual(push.exercises[0], {
    exercise_id: 'e1', sets: 3, reps: 10, duration_seconds: null, distance_m: null, weight_kg: null,
    intensity_kind: 'rir', intensity_value: 2, rest_seconds: 120,
  });
  assert.deepEqual(push.exercises[1], {
    exercise_id: 'e2', sets: 3, reps: null, duration_seconds: 30, distance_m: null, weight_kg: null,
    intensity_kind: null, intensity_value: null, rest_seconds: 60,
  });
  assert.deepEqual(cardio.exercises[0], {
    exercise_id: 'e3', sets: 1, reps: null, duration_seconds: 1800, distance_m: 5000, weight_kg: null,
    intensity_kind: null, intensity_value: null, rest_seconds: null,
  });
});

test('firma: ignora los uid y nota los cambios', () => {
  const b = conDosDias();
  const mismo = { ...b, dias: b.dias.map((d) => ({ ...d, uid: 'otro', ejercicios: d.ejercicios.map((e) => ({ ...e, uid: 'x' })) })) };
  assert.equal(firma(b), firma(mismo));
  assert.notEqual(firma(b), firma(reducerBorrador(b, { tipo: 'nombre', valor: 'Otra' })));
});

test('catalogo: busca sin acentos, en ingles y filtra por tipo y grupo', () => {
  const lista = [banca, plancha, cinta];
  assert.equal(plegar('  Máquina '), 'maquina');
  assert.deepEqual(filtrarCatalogo(lista, { busqueda: 'BANCA', tipo: 'todos', grupo: 'todos' }).map((e) => e.id), ['e1']);
  assert.deepEqual(filtrarCatalogo(lista, { busqueda: 'plank', tipo: 'todos', grupo: 'todos' }).map((e) => e.id), ['e2']);
  assert.deepEqual(filtrarCatalogo(lista, { busqueda: '', tipo: 'cardio', grupo: 'todos' }).map((e) => e.id), ['e3']);
  assert.deepEqual(filtrarCatalogo(lista, { busqueda: '', tipo: 'todos', grupo: 'core' }).map((e) => e.id), ['e2']);
  assert.deepEqual(gruposDelCatalogo(lista).map((g) => g.slug), ['pecho', 'core']);
});
