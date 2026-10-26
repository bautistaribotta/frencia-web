/* Historial (/historial): capturas a 1440×900 en oscuro y claro, la primera
   pagina con los ultimos tres meses y el scroll infinito hasta el principio. */

import { expect, test, type Page } from '@playwright/test';

import { conSesion } from './simulacion';

const AHORA = new Date('2026-10-26T12:00:00-03:00');
const DIA = 24 * 60 * 60 * 1000;

// Una sesion cada cuatro dias durante ocho meses, de una hora.
const SESIONES = Array.from({ length: 60 }, (_, i) => {
  const fin = new Date(AHORA.getTime() - (i + 1) * 4 * DIA);
  return {
    id: `00000000-0000-0000-0000-${String(1000 + i).padStart(12, '0')}`,
    started_at: new Date(fin.getTime() - 60 * 60 * 1000).toISOString(),
    finished_at: fin.toISOString(),
    training_days: { name: ['Push', 'Pull', 'Legs'][i % 3], routines: { name: 'Push Pull Legs' } },
    session_sets: [{ count: 15 }],
  };
});

/** Responde workout_sessions como PostgREST: filtros por fecha, cursor,
 *  limite y desplazamiento. Lleva la cuenta de cuantas filas trajo cada
 *  pagina de la lista. */
async function conSesiones(page: Page) {
  const pedidas: number[] = [];
  await page.route('**/rest/v1/workout_sessions**', (ruta) => {
    const url = new URL(ruta.request().url());
    const p = url.searchParams;
    let filas = SESIONES;
    for (const filtro of p.getAll('finished_at')) {
      const [op, valor] = [filtro.slice(0, filtro.indexOf('.')), filtro.slice(filtro.indexOf('.') + 1)];
      const t = Date.parse(valor);
      if (op === 'gte') filas = filas.filter((f) => Date.parse(f.finished_at) >= t);
      if (op === 'lte') filas = filas.filter((f) => Date.parse(f.finished_at) <= t);
    }
    const o = p.get('or')?.match(/finished_at\.lt\.([^,]+),and\(finished_at\.eq\.[^,]+,id\.lt\.([^)]+)\)/);
    if (o) {
      const t = Date.parse(o[1]);
      filas = filas.filter((f) => Date.parse(f.finished_at) < t || (Date.parse(f.finished_at) === t && f.id < o[2]));
    }
    filas = filas.slice(Number(p.get('offset') ?? 0));
    if (p.get('limit')) filas = filas.slice(0, Number(p.get('limit')));
    if (p.get('select')?.includes('training_days')) pedidas.push(filas.length);
    return ruta.fulfill({ json: filas });
  });
  return pedidas;
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`historial en ${nombre}`, async ({ page }) => {
    await page.clock.setFixedTime(AHORA);
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conSesion(page);
    await conSesiones(page);
    await page.goto('/historial');
    await expect(page.getByText('Octubre', { exact: true })).toBeVisible();
    await expect(page.getByText('60', { exact: true })).toBeVisible();
    await page.screenshot({ path: `capturas/historial-${nombre}.png` });
  });
}

test('historial: sin filtro, tres meses primero y despues scroll infinito', async ({ page }) => {
  await page.clock.setFixedTime(AHORA);
  await conSesion(page);
  const pedidas = await conSesiones(page);
  await page.goto('/historial');

  // Solo sesiones y tiempo total arriba; sin tonelaje, racha ni periodo.
  await expect(page.getByText('Sesiones', { exact: true })).toBeVisible();
  await expect(page.getByText('Tiempo total')).toBeVisible();
  await expect(page.getByText('Tonelaje')).toHaveCount(0);
  await expect(page.getByText('Racha')).toHaveCount(0);
  await expect(page.getByRole('radiogroup')).toHaveCount(0);

  // La primera pagina: las de los ultimos tres meses (22 de 60).
  const filas = page.locator('tbody tr');
  await expect(filas.first()).toBeVisible();
  const enTresMeses = SESIONES.filter((s) => Date.parse(s.finished_at) >= new Date('2026-07-26T12:00:00-03:00').getTime()).length;
  expect(pedidas[0]).toBe(enTresMeses);

  // Al bajar se traen las mas viejas hasta el principio.
  for (let i = 0; i < 10 && (await filas.count()) < SESIONES.length; i++) {
    await page.mouse.wheel(0, 20000);
    await page.waitForTimeout(300);
  }
  await expect(filas).toHaveCount(SESIONES.length);
  await expect(page.getByRole('status')).toHaveCount(0);
});
