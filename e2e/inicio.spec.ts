/* Inicio sin rutinas (kit web, Web · 4 y «Inicio sin rutinas»): la tarjeta
   de la primera rutina y los tres pasos, los tres punteados y del mismo alto;
   el primero se distingue por el numero relleno. Capturas en oscuro y claro. */

import { expect, test } from '@playwright/test';

import { conSesion } from './simulacion';

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`inicio sin rutinas en ${nombre}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conSesion(page, { tablas: { routines: [], workout_sessions: [] } });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Crear primera rutina' })).toBeVisible();

    const pasos = page.locator('div', { has: page.getByText('Revisá tu progreso', { exact: true }) }).last().locator('..').locator('> div');
    await expect(pasos).toHaveCount(3);
    const estilos = await pasos.evaluateAll((cajas) => cajas.map((c) => ({ borde: getComputedStyle(c).borderStyle, alto: c.getBoundingClientRect().height })));
    expect(estilos.map((e) => e.borde)).toEqual(['dashed', 'dashed', 'dashed']);
    expect(new Set(estilos.map((e) => Math.round(e.alto))).size).toBe(1);
    await expect(page.getByText('Historial y mejores marcas, en la pantalla grande.')).toBeVisible();
    await page.screenshot({ path: `capturas/inicio-vacio-${nombre}.png` });
  });
}
