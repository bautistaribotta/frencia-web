/* Correr con `npm test` (Vitest). 2026-10-24 es sabado. */

import { assert, test } from 'vitest';

import { semanaActual } from './semana';

const PPL = [
  { name: 'Push', weekdays: [0, 3] },
  { name: 'Pull', weekdays: [1, 4] },
  { name: 'Legs', weekdays: [2, 5] },
];
const SABADO = new Date(2026, 9, 24, 10);

test('la semana va de lunes a domingo', () => {
  const { dias } = semanaActual(PPL, [], SABADO);
  assert.strictEqual(dias.length, 7);
  assert.strictEqual(dias[0].fecha.getDate(), 19);
  assert.strictEqual(dias[6].fecha.getDate(), 25);
});

test('marca hecho, salteado, hoy y descanso', () => {
  const fechas = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'];
  const { dias, planificados, cumplidos } = semanaActual(PPL, fechas, SABADO);
  assert.deepEqual(
    dias.map((d) => d.estado),
    ['hecho', 'hecho', 'hecho', 'hecho', 'salteado', 'hoy', 'libre'],
  );
  assert.strictEqual(dias[5].plan, 'Legs');
  assert.strictEqual(dias[6].plan, null);
  assert.strictEqual(planificados, 6);
  assert.strictEqual(cumplidos, 4);
});

test('lo que todavia no llego queda pendiente', () => {
  const miercoles = new Date(2026, 9, 21, 10);
  const { dias } = semanaActual(PPL, [], miercoles);
  assert.deepEqual(
    dias.map((d) => d.estado),
    ['salteado', 'salteado', 'hoy', 'pendiente', 'pendiente', 'pendiente', 'libre'],
  );
});

test('entrenar un dia de descanso cuenta como hecho, pero no suma al plan', () => {
  const { dias, cumplidos } = semanaActual(PPL, ['2026-10-25'], new Date(2026, 9, 25, 10));
  assert.strictEqual(dias[6].estado, 'hecho');
  assert.strictEqual(cumplidos, 0);
});
