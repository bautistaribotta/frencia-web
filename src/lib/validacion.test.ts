/* Correr con `npm test` (Vitest). */

import { assert, test } from 'vitest';

import { esCursorValido, esUuid } from './validacion';

test('esUuid acepta UUIDs canonicos y rechaza textos invalidos', () => {
  assert.strictEqual(esUuid('1a2b3c4d-5e6f-4a1b-8c2d-0123456789ab'), true);
  assert.strictEqual(esUuid('1A2B3C4D-5E6F-4A1B-8C2D-0123456789AB'), true);
  assert.strictEqual(esUuid('no-es-uuid'), false);
  assert.strictEqual(esUuid(''), false);
});

test('esCursorValido exige UUID e ISO timestamp valido', () => {
  const id = '1a2b3c4d-5e6f-4a1b-8c2d-0123456789ab';
  assert.strictEqual(esCursorValido(id, '2026-10-21T12:46:51.123456Z'), true);
  assert.strictEqual(esCursorValido(id, '2026-10-21T09:46:51-03:00'), true);
  assert.strictEqual(esCursorValido('invalido', '2026-10-21T12:46:51Z'), false);
  assert.strictEqual(esCursorValido(id, '2026-99-99T12:46:51Z'), false);
  assert.strictEqual(esCursorValido(id, '2026-10-21'), false);
});
