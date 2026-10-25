/* Correr con `npm test` (Vitest). */

import { assert, test } from 'vitest';

import { cmAPiesPulgadas, mostrarAltura, piesPulgadasACm } from './altura';

test('cm a pies y pulgadas redondea a la pulgada entera', () => {
  assert.deepEqual(cmAPiesPulgadas(175), { pies: 5, pulgadas: 9 });
  assert.deepEqual(cmAPiesPulgadas(180), { pies: 5, pulgadas: 11 });
});

test('las pulgadas que redondean a 12 pasan al pie siguiente', () => {
  // 182.88 cm son exactamente 72 in: 6' 0", nunca 5' 12".
  assert.deepEqual(cmAPiesPulgadas(182.88), { pies: 6, pulgadas: 0 });
  assert.deepEqual(cmAPiesPulgadas(182.5), { pies: 6, pulgadas: 0 });
});

test('ida y vuelta conserva el valor de la rueda', () => {
  assert.strictEqual(piesPulgadasACm(5, 10), 178);
  assert.deepEqual(cmAPiesPulgadas(178), { pies: 5, pulgadas: 10 });
});

test('mostrarAltura respeta la unidad elegida', () => {
  assert.strictEqual(mostrarAltura(175, 'cm'), '175 cm');
  assert.strictEqual(mostrarAltura(175, 'ft'), `5' 9"`);
});
