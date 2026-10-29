/* Configuracion (/configuracion): la seccion Preferencias y el aviso que
   confirma cada cambio guardado; si la base no lo acepta, el aviso es de
   error. Capturas en oscuro y claro. */

import { expect, test } from '@playwright/test';

import { conSesion } from './simulacion';

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`preferencias: cada cambio se confirma con un aviso en ${nombre}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conSesion(page);
    await page.goto('/configuracion');
    await expect(page.getByText('Preferencias', { exact: true })).toBeVisible();

    await page.getByRole('radiogroup', { name: 'Unidad de peso' }).getByRole('radio', { name: 'lb' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'El peso ahora va en libras' })).toBeVisible();
    await page.getByRole('radiogroup', { name: 'Medir el esfuerzo con' }).getByRole('radio', { name: 'RPE' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'El esfuerzo ahora se mide con RPE' })).toBeVisible();
    await page.screenshot({ path: `capturas/configuracion-preferencias-${nombre}.png` });
  });
}

test('preferencias: si no se guarda, el aviso es de error', async ({ page }) => {
  await conSesion(page);
  await page.route('**/rest/v1/profiles?*', (ruta) =>
    ruta.request().method() === 'PATCH' ? ruta.fulfill({ status: 500, json: { message: 'Error simulado' } }) : ruta.fallback(),
  );
  await page.goto('/configuracion');
  await page.getByRole('radiogroup', { name: 'Unidad de distancia' }).getByRole('radio', { name: 'mi' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'No pudimos guardar el ajuste' })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'millas' })).toHaveCount(0);
});

test('el aviso entra desde la derecha y sale hacia la derecha', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await conSesion(page);
  await page.goto('/configuracion');
  await page.getByRole('radiogroup', { name: 'Unidad de altura' }).getByRole('radio', { name: 'ft' }).click();
  const aviso = page.getByRole('status').filter({ hasText: 'La altura ahora va en pies' });
  const nombres = () => aviso.evaluate((n) => n.getAnimations().map((a) => (a as CSSAnimation).animationName));
  await expect.poll(nombres).toEqual([expect.stringMatching(/entra/)]);
  await aviso.getByRole('button', { name: 'Cerrar aviso' }).click();
  await expect.poll(nombres).toEqual([expect.stringMatching(/sale/)]);
  await expect(aviso).toHaveCount(0);
});
