/* Correr con `npm test` (Vitest). */

import { assert, test } from 'vitest';

import { mostrarPeso, pesoACanonico } from './peso';

test('100 kg registrados se muestran como 220.5 lb al cambiar la preferencia', () => {
  assert.strictEqual(mostrarPeso(100, 'kg'), 100);
  assert.strictEqual(mostrarPeso(100, 'lb'), 220.5);
});

test('lo escrito en libras vuelve a mostrarse igual en libras', () => {
  const kg = pesoACanonico(225, 'lb');
  assert.strictEqual(kg, 102.06);
  assert.strictEqual(mostrarPeso(kg, 'lb'), 225);
});

test('en kilos no hay conversion, solo redondeo', () => {
  assert.strictEqual(pesoACanonico(82.5, 'kg'), 82.5);
  assert.strictEqual(mostrarPeso(82.5, 'kg'), 82.5);
});
