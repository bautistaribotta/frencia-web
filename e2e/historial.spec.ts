/* Historial (/historial): capturas a 1440×900 en oscuro y claro, la primera
   pagina con los ultimos tres meses y el scroll infinito hasta el principio. */

import { expect, test, type Page } from '@playwright/test';

import { conSesion, USUARIO } from './simulacion';

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
  let guardadas = [...SESIONES];
  const pedidas: number[] = [];
  await page.route('**/rest/v1/workout_sessions**', (ruta) => {
    const url = new URL(ruta.request().url());
    const p = url.searchParams;
    if (ruta.request().method() === 'DELETE') {
      expect(p.get('user_id')).toBe(`eq.${USUARIO.id}`);
      expect(p.get('finished_at')).toBe('not.is.null');
      const id = p.get('id')?.slice(3);
      const borradas = guardadas.filter((s) => s.id === id);
      guardadas = guardadas.filter((s) => s.id !== id);
      return ruta.fulfill({ json: borradas.map((s) => ({ id: s.id })) });
    }
    if (p.has('id')) return ruta.fulfill({ json: guardadas.find((s) => `eq.${s.id}` === p.get('id')) ?? null });
    let filas = guardadas;
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

for (const tema of ['dark', 'light'] as const) {
  test(`eliminar: confirmación y totales en ${tema}`, async ({ page }) => {
    await page.clock.setFixedTime(AHORA);
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conSesion(page);
    await conSesiones(page);
    await page.goto('/historial');
    const nueva = page.getByRole('button', { name: 'Nueva rutina', exact: true });
    await expect(nueva).toHaveAttribute('aria-disabled', 'true');
    await nueva.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/historial$/);
    await nueva.hover();
    await page.screenshot({ path: `capturas/nueva-rutina-${tema}.png` });
    const borrar = page.getByRole('button', { name: /^Eliminar Push del/ }).first();
    await borrar.hover();
    await borrar.click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('button', { name: 'Cancelar' })).toBeFocused();
    await page.screenshot({ path: `capturas/eliminar-sesion-${tema}.png` });
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
    await borrar.click();
    await modal.getByRole('button', { name: 'Eliminar', exact: true }).click();
    await expect(page.getByText('Entrenamiento eliminado.', { exact: true })).toBeVisible();
    await expect(page.getByText('59', { exact: true })).toBeVisible();
    await expect(page.getByText('59h', { exact: true })).toBeVisible();
    await expect(page.locator(`a[href="/historial/${SESIONES[0].id}"]`)).toHaveCount(0);
  });
}

test('eliminar: error, carga y reintento desde el detalle', async ({ page }) => {
  await conSesion(page);
  await conSesiones(page);
  let intentos = 0;
  let liberar: () => void = () => {};
  await page.route('**/rest/v1/workout_sessions**', async (ruta) => {
    if (ruta.request().method() !== 'DELETE') return ruta.fallback();
    intentos++;
    if (intentos === 1) return ruta.fulfill({ status: 500, json: { message: 'Error simulado' } });
    await new Promise<void>((resolve) => { liberar = resolve; });
    return ruta.fallback();
  });
  await page.goto(`/historial/${SESIONES[0].id}`);
  await page.getByRole('button', { name: 'Eliminar entrenamiento', exact: true }).click();
  const modal = page.getByRole('dialog');
  await modal.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await expect(modal.getByRole('alert')).toBeVisible();
  await page.screenshot({ path: 'capturas/eliminar-error.png' });
  await modal.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await expect(modal.getByRole('button', { name: 'Eliminar', exact: true })).toHaveAttribute('aria-busy', 'true');
  await expect(modal.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(modal).toBeVisible();
  await page.screenshot({ path: 'capturas/eliminar-cargando.png' });
  await expect.poll(() => intentos).toBe(2);
  liberar();
  await expect(page).toHaveURL(/historial$/);
});

test('historial vacío', async ({ page }) => {
  await conSesion(page);
  await page.goto('/historial');
  await expect(page.getByText('Todavía no hay sesiones')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Eliminar/ })).toHaveCount(0);
  await page.screenshot({ path: 'capturas/historial-vacio.png' });
});
