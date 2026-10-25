/* Conversion entre edad y fecha_nacimiento. Correr con `npm test` (Vitest).
   El caso de ida y vuelta solo reproduce el bug viejo (leer la fecha en UTC)
   en una zona horaria al oeste de Greenwich, como la de Argentina. */

import { assert, test } from 'vitest';

import { edadAFechaNacimiento, fechaNacimientoAEdad } from './edad';

test('la edad guardada se lee igual', () => {
  for (const edad of [0, 18, 26, 64]) {
    assert.strictEqual(fechaNacimientoAEdad(edadAFechaNacimiento(edad)), edad);
  }
});

test('el 1 de enero se lee en hora local, no en UTC', () => {
  const anio = new Date().getFullYear() - 26;
  assert.strictEqual(fechaNacimientoAEdad(`${anio}-01-01`), 26);
});

test('sin fecha o con formato invalido no hay edad', () => {
  assert.strictEqual(fechaNacimientoAEdad(null), null);
  assert.strictEqual(fechaNacimientoAEdad(''), null);
  assert.strictEqual(fechaNacimientoAEdad('2000-1-1'), null);
  assert.strictEqual(fechaNacimientoAEdad('no es fecha'), null);
});
