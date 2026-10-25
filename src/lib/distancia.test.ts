/* Correr con `npm test` (Vitest). */

import { assert, test } from 'vitest';

import {
  distanciaACanonico,
  distanciaCompacta,
  distanciaTabla,
  mostrarDistancia,
} from './distancia';

test('5 km se guardan como 5000 m y vuelven a mostrarse iguales', () => {
  const metros = distanciaACanonico(5, 'km');
  assert.strictEqual(metros, 5000);
  assert.strictEqual(mostrarDistancia(metros, 'km'), 5);
});

test('lo escrito en millas vuelve a mostrarse igual en millas', () => {
  const metros = distanciaACanonico(3.1, 'mi');
  assert.strictEqual(metros, 4989);
  assert.strictEqual(mostrarDistancia(metros, 'mi'), 3.1);
});

test('en grillas la distancia lleva siempre dos decimales, aunque sea chica', () => {
  assert.strictEqual(distanciaTabla(4820, 'km'), '4.82');
  assert.strictEqual(distanciaTabla(5000, 'km'), '5.00');
  assert.strictEqual(distanciaTabla(800, 'km'), '0.80');
});

test('en resumenes se recortan los ceros y va la unidad', () => {
  assert.strictEqual(distanciaCompacta(5000, 'km'), '5 km');
  assert.strictEqual(distanciaCompacta(4820, 'km'), '4.82 km');
  assert.strictEqual(distanciaCompacta(8047, 'mi'), '5 mi');
});
