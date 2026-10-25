/* Correr con `npm test` (Vitest). */

import { assert, test } from 'vitest';

import { agruparPorMes, inicioPeriodo, tonelajeKg, type SesionTerminada } from './historial';

function sesion(id: string, fecha: string): SesionTerminada {
  const ms = new Date(fecha).getTime();
  return { id, dayName: 'Push', rutina: 'PPL', startedAt: ms - 3600000, finishedAt: ms, series: 15, tonelajeKg: 6000 };
}

test('el tonelaje suma peso por reps y deja afuera lo que no tiene las dos cosas', () => {
  assert.strictEqual(tonelajeKg([{ weight_kg: 80, reps: 8 }, { weight_kg: '82.5', reps: 8 }, { weight_kg: null, reps: 10 }]), 1300);
});

test('sin ninguna serie con peso y reps el tonelaje es null, no 0', () => {
  assert.strictEqual(tonelajeKg([{ weight_kg: null, reps: null }]), null);
  assert.strictEqual(tonelajeKg([]), null);
  assert.strictEqual(tonelajeKg([{ weight_kg: 0, reps: 10 }]), 0);
});

test('agrupa por mes local y marca incompleto el ultimo si sigue en la proxima pagina', () => {
  const meses = agruparPorMes(
    [sesion('a', '2026-10-22T10:00:00'), sesion('b', '2026-10-01T10:00:00'), sesion('c', '2026-09-29T10:00:00')],
    new Date('2026-09-28T10:00:00').getTime(),
  );
  assert.strictEqual(meses.length, 2);
  assert.strictEqual(meses[0].sesiones.length, 2);
  assert.strictEqual(meses[0].completo, true);
  assert.strictEqual(meses[1].completo, false);
});

test('el periodo cuenta hacia atras desde ahora y Todo no tiene inicio', () => {
  const ahora = new Date('2026-10-25T12:00:00Z');
  assert.strictEqual(inicioPeriodo('30', ahora), '2026-09-25T12:00:00.000Z');
  assert.strictEqual(inicioPeriodo('todo', ahora), null);
});
