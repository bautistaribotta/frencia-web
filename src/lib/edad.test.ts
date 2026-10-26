/* Conversion entre edad y fecha_nacimiento. Correr con `npm test` (Vitest).
   El caso de ida y vuelta solo reproduce el bug viejo (leer la fecha en UTC)
   en una zona horaria al oeste de Greenwich, como la de Argentina. */

import { assert, test } from 'vitest';

import { edadAFechaNacimiento, fechaNacimientoAEdad, formatearFecha, leerFechaNacimiento } from './edad';

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

test('la fecha se formatea mientras se escribe', () => {
  assert.strictEqual(formatearFecha('14'), '14');
  assert.strictEqual(formatearFecha('140'), '14/0');
  assert.strictEqual(formatearFecha('14032001'), '14/03/2001');
  assert.strictEqual(formatearFecha('14/03/2001999'), '14/03/2001');
});

test('lee la fecha de nacimiento escrita como dia/mes/año', () => {
  const hoy = new Date(2026, 9, 26);
  assert.deepEqual(leerFechaNacimiento('', hoy), { estado: 'vacia' });
  assert.deepEqual(leerFechaNacimiento('14/03', hoy), { estado: 'incompleta' });
  assert.deepEqual(leerFechaNacimiento('14/03/200', hoy), { estado: 'incompleta' });
  assert.deepEqual(leerFechaNacimiento('31/02/2001', hoy), { estado: 'inexistente' });
  assert.deepEqual(leerFechaNacimiento('14/03/2001', hoy), { estado: 'ok', fecha: '2001-03-14', edad: 25 });
});

test('la fecha de nacimiento respeta la edad de la rueda de la app', () => {
  const hoy = new Date(2026, 9, 26);
  assert.deepEqual(leerFechaNacimiento('27/10/2013', hoy), { estado: 'fuera', edad: 12 });
  assert.deepEqual(leerFechaNacimiento('26/10/2013', hoy), { estado: 'ok', fecha: '2013-10-26', edad: 13 });
  assert.deepEqual(leerFechaNacimiento('01/01/2030', hoy), { estado: 'fuera', edad: null });
});
