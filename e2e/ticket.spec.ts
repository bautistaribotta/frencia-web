/* Ticket de una sesion: al costado del detalle (/historial/:id) y solo
   (/historial/:id/ticket). Capturas a 1440×900 en oscuro y claro, la
   descarga en PNG y la copia al portapapeles. */

import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

import { conSesion } from './simulacion';

const ID = '7c1e2a9b-4f3d-4e21-9a0b-5d8c3e1f6a72';
const INICIO = new Date('2026-10-09T07:42:00-03:00');
const fuerza = { kind: 'fuerza', tracks_weight: true, tracks_reps: true, tracks_duration: false, tracks_distance: false };

const serie = (i: number, ejercicio: string, nombre: string, tipo: object, datos: object) => ({
  id: `s-${ejercicio}-${i}`,
  exercise_id: ejercicio,
  set_index: i,
  weight_kg: null,
  reps: null,
  duration_seconds: null,
  distance_m: null,
  intensity_kind: null,
  intensity_value: null,
  completed_at: new Date(INICIO.getTime() + (ejercicio.charCodeAt(1) * 10 + i) * 60_000).toISOString(),
  exercises: { name: nombre, ...tipo },
  ...datos,
});

const SERIES = [
  ...[80, 82.5, 82.5, 85].map((kg, i) => serie(i, 'e1', 'Press de banca con barra', fuerza, { weight_kg: kg, reps: 8 - i, intensity_kind: 'rir', intensity_value: 2 })),
  ...[30, 30, 30].map((kg, i) => serie(i, 'e2', 'Press inclinado con mancuernas', fuerza, { weight_kg: kg, reps: 10 })),
  ...[60, 55, 50].map((s, i) =>
    serie(i, 'e3', 'Plancha', { kind: 'isometrico', tracks_weight: true, tracks_reps: false, tracks_duration: true, tracks_distance: false }, { duration_seconds: s }),
  ),
];

async function conTicket(page: Page) {
  await conSesion(page);
  await page.route('**/rest/v1/workout_sessions**', (ruta) =>
    ruta.fulfill({
      json: { id: ID, started_at: INICIO.toISOString(), finished_at: new Date(INICIO.getTime() + 58 * 60_000 + 14_000).toISOString(), training_days: { name: 'Push', routines: { name: 'Push Pull Legs' } } },
    }),
  );
  await page.route('**/rest/v1/session_sets**', (ruta) => ruta.fulfill({ json: SERIES }));
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`ticket al costado del detalle en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conTicket(page);
    await page.goto(`/historial/${ID}`);
    const ticket = page.getByRole('img', { name: /Ticket de Push/ });
    await expect(ticket).toBeVisible();
    await expect(ticket).toContainText('Nº 7C1E2A');
    await expect(ticket).toContainText('Push · 9 OCT 2026 · 07:42');
    await expect(ticket).toContainText('58:14');
    // 80×8 + 82.5×7 + 82.5×6 + 85×5 + 30×10×3 = 3 037,5
    await expect(ticket).toContainText('3 038');
    await expect(ticket).toContainText('85 kg');
    await expect(ticket).toContainText('FRENCIA-7C1E-2A9B4F3');
    await page.screenshot({ path: `capturas/ticket-detalle-${nombre}.png` });

    await page.getByRole('button', { name: 'Ver grande' }).click();
    await expect(page).toHaveURL(new RegExp(`/historial/${ID}/ticket$`));
    await expect(page.getByRole('navigation', { name: 'Principal' })).toHaveCount(0);
    await expect(page.getByRole('img', { name: /Ticket de Push/ })).toBeVisible();
    await page.screenshot({ path: `capturas/ticket-grande-${nombre}.png` });
  });
}

test('descargar el ticket en PNG desde el detalle y desde el ticket solo', async ({ page }) => {
  await conTicket(page);
  await page.goto(`/historial/${ID}`);
  await expect(page.getByRole('img', { name: /Ticket de Push/ })).toBeVisible();
  const [descarga] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Descargar', exact: true }).click()]);
  expect(descarga.suggestedFilename()).toBe('frencia-push-2026-10-09.png');
  const png = await readFile((await descarga.path())!);
  // Firma de PNG y una imagen que no esta vacia.
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect(png.length).toBeGreaterThan(5000);

  await page.goto(`/historial/${ID}/ticket`);
  const [otra] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Descargar PNG' }).click()]);
  expect(otra.suggestedFilename()).toBe('frencia-push-2026-10-09.png');
  await page.getByRole('button', { name: 'Volver a la sesión' }).click();
  await expect(page).toHaveURL(new RegExp(`/historial/${ID}$`));
});

test('copiar la imagen del ticket al portapapeles', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await conTicket(page);
  await page.goto(`/historial/${ID}/ticket`);
  await expect(page.getByRole('img', { name: /Ticket de Push/ })).toBeVisible();
  await page.getByRole('button', { name: 'Copiar imagen' }).click();
  await expect(page.getByText('Ticket copiado')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copiado' })).toBeVisible();
  const tipos = await page.evaluate(async () => (await navigator.clipboard.read()).flatMap((item) => item.types));
  expect(tipos).toContain('image/png');
});
