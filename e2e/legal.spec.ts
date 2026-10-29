/* Textos legales publicos (/terminos y /privacidad): capturas a 1440×900 en
   oscuro y claro, a 390×844 y a 768×1024, que se ven sin sesion y con sesion
   sin redirigir, el paso de un documento al otro y el orden de foco. */

import { expect, test, type Page } from '@playwright/test';

import { conSesion } from './simulacion';

/** Sin sesion: nada sale a la red. */
async function sinSesion(page: Page) {
  await page.route('**/rest/v1/**', (ruta) => ruta.fulfill({ json: [] }));
  await page.route('**/auth/v1/**', (ruta) => ruta.fulfill({ json: {} }));
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`terminos en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await sinSesion(page);
    await page.goto('/terminos');
    await expect(page.getByRole('heading', { level: 1, name: 'Términos y condiciones' })).toBeVisible();
    await expect(page).toHaveTitle('Términos y condiciones · Frencia');
    await page.screenshot({ path: `capturas/legal-terminos-${nombre}.png` });
  });
}

test('privacidad sin sesion: no manda al login y ofrece entrar', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page);
  await page.goto('/privacidad');
  await expect(page.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeVisible();
  await expect(page).toHaveURL(/\/privacidad$/);
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'bautistaribotta@hotmail.com' })).toHaveAttribute('href', 'mailto:bautistaribotta@hotmail.com');
  await page.screenshot({ path: 'capturas/legal-privacidad-oscuro.png', fullPage: true });
});

test('privacidad con sesion: se queda y ofrece ir a Frencia', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await conSesion(page);
  await page.goto('/privacidad');
  await expect(page.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeVisible();
  await expect(page).toHaveURL(/\/privacidad$/);
  await expect(page.getByRole('button', { name: 'Ir a Frencia' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar' })).toHaveCount(0);
});

test('el segmentado pasa de un documento al otro', async ({ page }) => {
  await sinSesion(page);
  await page.goto('/terminos');
  await page.getByRole('radio', { name: 'Privacidad' }).click();
  await expect(page).toHaveURL(/\/privacidad$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeVisible();
  // Con las flechas, como un radiogroup.
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/\/terminos$/);
  await expect(page.getByRole('radio', { name: 'Términos' })).toBeFocused();
});

test('legal: orden de foco', async ({ page }) => {
  await sinSesion(page);
  await page.goto('/terminos');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const esperado = ['Frencia, ir al inicio', 'Entrar', 'Crear cuenta', 'Términos', 'bautistaribotta@hotmail.com'];
  const vistos: string[] = [];
  for (let i = 0; i < esperado.length; i++) {
    await page.keyboard.press('Tab');
    const foco = page.locator(':focus');
    vistos.push((await foco.getAttribute('aria-label')) ?? (await foco.innerText()).trim());
    await expect(foco).toHaveCSS('outline-style', 'solid');
  }
  expect(vistos).toEqual(esperado);
});

test('privacidad en el telefono', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page);
  await page.goto('/privacidad');
  await expect(page.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Crear cuenta' })).toHaveCount(0);
  // Sin scroll horizontal.
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(390);
  await page.screenshot({ path: 'capturas/legal-privacidad-telefono.png' });
});

test('terminos en la tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page);
  await page.goto('/terminos');
  await expect(page.getByRole('heading', { level: 1, name: 'Términos y condiciones' })).toBeVisible();
  await page.screenshot({ path: 'capturas/legal-terminos-tablet.png' });
});
