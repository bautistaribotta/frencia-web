/* Correr con `npm test` (Vitest). */

import { assert, test } from 'vitest';

import { miles } from './numeros';

test('los miles van separados con espacio duro', () => {
  assert.strictEqual(miles(950), '950');
  assert.strictEqual(miles(12480), '12 480');
  assert.strictEqual(miles(1234567.4), '1 234 567');
});
