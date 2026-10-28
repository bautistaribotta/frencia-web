/* Correr con `npm test` (Vitest). */

import { expect, test } from 'vitest';

import { destinoDe, registrar, rutaAnterior } from './volver';

test('volver recuerda de donde se llego, tambien tras reemplazar y al ir y volver', () => {
  registrar('inicio', 'POP', '/');
  registrar('detalle', 'PUSH', '/rutinas/r1');
  expect(rutaAnterior('detalle')).toBe('/');
  // El doble render de React no cambia nada.
  registrar('detalle', 'PUSH', '/rutinas/r1');
  expect(rutaAnterior('detalle')).toBe('/');

  registrar('editar', 'PUSH', '/rutinas/r1/editar');
  expect(rutaAnterior('editar')).toBe('/rutinas/r1');
  // Guardar vuelve un paso: el detalle sigue sabiendo que se vino de Inicio.
  registrar('detalle', 'POP', '/rutinas/r1');
  expect(rutaAnterior('detalle')).toBe('/');

  // Reemplazar hereda el paso anterior: /rutinas/nueva pasa a ser la rutina.
  registrar('nueva', 'PUSH', '/rutinas/nueva');
  registrar('creada', 'REPLACE', '/rutinas/r2');
  expect(rutaAnterior('creada')).toBe('/rutinas/r1');

  // Entrar directo por la URL: no hay de donde.
  registrar('directa', 'POP', '/historial/s1');
  expect(rutaAnterior('directa')).toBeNull();
});

test('el texto dice a donde se vuelve', () => {
  expect(destinoDe('/')).toEqual({ corta: 'Inicio', larga: 'Volver a Inicio' });
  expect(destinoDe('/rutinas?orden=az')?.corta).toBe('Rutinas');
  expect(destinoDe('/rutinas/r1')?.larga).toBe('Volver a la rutina');
  expect(destinoDe('/historial/s1')?.larga).toBe('Volver a la sesión');
  expect(destinoDe('/historial/s1/ticket')?.corta).toBe('Ticket');
  expect(destinoDe('/perfil/editar')?.corta).toBe('Editar perfil');
  // A estas no se vuelve: el boton usa su respaldo.
  expect(destinoDe('/rutinas/nueva')).toBeNull();
  expect(destinoDe('/rutinas/r1/editar')).toBeNull();
  expect(destinoDe('/login')).toBeNull();
});
