/* Recuperar la contraseña (/recuperar) y elegir una nueva
   (/nueva-contrasena): capturas a 1440×900 en oscuro y claro y a 390×844
   (son pantallas publicas), el pedido del enlace, el reenvio, los requisitos
   en vivo, la contraseña igual a la anterior y el enlace vencido. */

import { expect, test, type Page } from '@playwright/test';

import { conSesion } from './simulacion';

/** Sin sesion: nada sale a la red. Devuelve los correos pedidos. */
async function sinSesion(page: Page) {
  const pedidos: string[] = [];
  await page.route('**/rest/v1/**', (ruta) => ruta.fulfill({ json: [] }));
  await page.route('**/auth/v1/**', async (ruta) => {
    if (ruta.request().url().includes('/recover')) pedidos.push(ruta.request().postDataJSON().email);
    await ruta.fulfill({ json: {} });
  });
  return pedidos;
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`recuperar en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await sinSesion(page);
    await page.goto('/recuperar');
    await expect(page.getByRole('heading', { name: 'Recuperá tu contraseña' })).toBeVisible();
    await page.screenshot({ path: `capturas/recuperar-${nombre}.png` });
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('bauti@correo.com');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Revisá tu correo' })).toBeVisible();
    await page.screenshot({ path: `capturas/recuperar-enviado-${nombre}.png` });
  });
}

test('recuperar en el celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await sinSesion(page);
  await page.goto('/recuperar');
  await expect(page.getByRole('button', { name: 'Enviar enlace' })).toBeVisible();
  await page.screenshot({ path: 'capturas/recuperar-390.png' });
});

test('desde el login: el correo pasa, se manda el enlace y reenviar espera', async ({ page }) => {
  const pedidos = await sinSesion(page);
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('bauti@correo.com');
  await page.getByRole('link', { name: '¿La olvidaste?' }).click();
  // El enlace cambia de pantalla con una transicion: hasta que termina sigue
  // a la vista el login.
  await expect(page.getByRole('heading', { name: 'Recuperá tu contraseña' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Correo electrónico' })).toHaveValue('bauti@correo.com');

  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('bauti');
  await page.getByRole('button', { name: 'Enviar enlace' }).click();
  await expect(page.getByText('Escribí un correo válido.')).toBeVisible();
  expect(pedidos).toEqual([]);

  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('bauti@correo.com');
  await page.getByRole('button', { name: 'Enviar enlace' }).click();
  await expect(page.getByText('bauti@correo.com', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Reenviar en 0:/ })).toBeDisabled();
  expect(pedidos).toEqual(['bauti@correo.com']);

  await page.getByRole('button', { name: 'Volver a iniciar sesión' }).click();
  await expect(page.getByRole('heading', { name: 'Entrá a tu cuenta' })).toBeVisible();
});

test('nueva contraseña: requisitos en vivo, igual a la anterior y guardar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await conSesion(page);
  let intentos = 0;
  await page.route('**/auth/v1/user', async (ruta) => {
    if (ruta.request().method() !== 'PUT') return ruta.fallback();
    intentos += 1;
    if (intentos === 1) return ruta.fulfill({ status: 422, json: { code: 422, error_code: 'same_password', msg: 'New password should be different from the old password.' } });
    await ruta.fulfill({ json: { id: '00000000-0000-0000-0000-000000000001', email: 'bauti@correo.com' } });
  });
  await page.goto('/nueva-contrasena');
  await expect(page.getByRole('heading', { name: 'Elegí una contraseña nueva' })).toBeVisible();
  const guardar = page.getByRole('button', { name: 'Guardar y entrar' });
  await expect(guardar).toBeDisabled();
  await page.getByRole('textbox', { name: 'Contraseña nueva' }).fill('nueva123');
  await page.getByRole('textbox', { name: 'Repetila' }).fill('nueva12');
  await expect(guardar).toBeDisabled();
  await page.getByRole('textbox', { name: 'Repetila' }).fill('nueva123');
  await expect(guardar).toBeEnabled();
  await page.screenshot({ path: 'capturas/nueva-contrasena.png' });

  await guardar.click();
  await expect(page.getByText('Tiene que ser distinta de la que tenías.')).toBeVisible();
  await page.screenshot({ path: 'capturas/nueva-contrasena-igual.png' });
  await guardar.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Contraseña actualizada')).toBeVisible();
});

test('nueva contraseña sin sesión o con error: el enlace venció', async ({ page }) => {
  await sinSesion(page);
  await page.goto('/nueva-contrasena?error=access_denied&error_code=otp_expired');
  await expect(page.getByRole('heading', { name: 'El enlace venció' })).toBeVisible();
  await page.screenshot({ path: 'capturas/nueva-contrasena-vencido.png' });
  await page.getByRole('button', { name: 'Pedir otro enlace' }).click();
  await expect(page).toHaveURL(/\/recuperar$/);
});

test('sin rutinas: crear la primera desde Inicio y desde Rutinas', async ({ page }) => {
  await conSesion(page, { tablas: { routines: [] } });
  await page.goto('/');
  await page.getByRole('button', { name: 'Crear primera rutina' }).click();
  await expect(page).toHaveURL(/\/rutinas\/nueva$/);
  await page.goto('/rutinas');
  await expect(page.getByText('Todavía no tenés rutinas')).toBeVisible();
  await page.getByRole('main').getByRole('button', { name: 'Crear rutina' }).click();
  await expect(page).toHaveURL(/\/rutinas\/nueva$/);
});
