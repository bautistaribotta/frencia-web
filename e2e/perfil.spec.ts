/* Perfil (/perfil): capturas a 1440×900 en oscuro y claro, el estado de
   carga y el orden de foco con Tab. */

import { expect, test } from '@playwright/test';

import { conSesion, PERFIL } from './simulacion';

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`perfil en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conSesion(page);
    await page.goto('/perfil');
    await expect(page.getByRole('heading', { name: 'Bautista Ribotta' })).toBeVisible();
    await expect(page.getByText('25 años · 14/03/2001')).toBeVisible();
    await page.screenshot({ path: `capturas/perfil-${nombre}.png` });
  });
}

test('perfil cargando', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await conSesion(page, { demoraPerfil: 60_000 });
  await page.goto('/perfil');
  await expect(page.getByText('Sexo')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bautista Ribotta' })).toHaveCount(0);
  await page.screenshot({ path: 'capturas/perfil-cargando.png' });
});

test('perfil en pies y libras', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await conSesion(page, { perfil: { ...PERFIL, unidad_altura: 'ft', unidad_peso: 'lb' } });
  await page.goto('/perfil');
  await expect(page.getByText(`5' 10"`)).toBeVisible();
  await expect(page.getByText('159.8 lb')).toBeVisible();
});

test('perfil: orden de foco', async ({ page }) => {
  await conSesion(page);
  await page.goto('/perfil');
  await expect(page.getByRole('heading', { name: 'Bautista Ribotta' })).toBeVisible();

  // Despues de la navegacion lateral, el contenido en el orden en que se ve.
  const contenido = ['Cambiar foto de perfil', 'Editar perfil', 'Configuración', 'Cerrar sesión'];
  const vistos: string[] = [];
  for (let i = 0; i < 12 && vistos.length < contenido.length; i++) {
    await page.keyboard.press('Tab');
    const foco = page.locator(':focus');
    const nombre = (await foco.getAttribute('aria-label')) ?? (await foco.innerText()).trim();
    if (vistos.length || nombre === contenido[0]) {
      vistos.push(nombre);
      await expect(foco).toHaveCSS('outline-style', 'solid');
    }
  }
  expect(vistos).toEqual(contenido);
});
