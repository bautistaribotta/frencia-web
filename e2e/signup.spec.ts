/* Crear cuenta con correo (/signup): el alta contra Supabase con el nombre en
   los metadatos y el apellido despues, la carga mientras envia, el correo ya
   registrado (error en el campo con entrar o recuperar) y los demas errores
   como aviso. Nada sale a la red: Auth y la base se simulan. */

import { expect, test, type Page } from '@playwright/test';

import { PERFIL, USUARIO } from './simulacion';

type Respuesta = { status: number; json: unknown };

/** Sin sesion. El alta responde con `alta`; si `retener`, queda colgada hasta
 *  soltarla. Devuelve lo que se mando a Supabase. */
async function sinSesion(page: Page, alta: Respuesta, { retener = false } = {}) {
  const enviado: { alta?: Record<string, unknown>; apellido?: unknown } = {};
  let soltar: () => void = () => {};
  const soltada = retener ? new Promise<void>((resolver) => (soltar = resolver)) : Promise.resolve();
  // Cuenta recien creada: con fila en profiles (la crea el trigger) y sin
  // aceptar los terminos todavia.
  const perfil = { ...PERFIL, name: 'Bautista', surname: null, onboarding_completed: false, aceptaciones_legales: [] };
  await page.route('**/rest/v1/**', async (ruta) => {
    const url = ruta.request().url();
    if (url.includes('/rest/v1/profiles')) {
      if (ruta.request().method() === 'PATCH') {
        enviado.apellido = ruta.request().postDataJSON();
        return ruta.fulfill({ status: 204, body: '' });
      }
      return ruta.fulfill({ json: perfil });
    }
    return ruta.fulfill({ json: [] });
  });
  await page.route('**/auth/v1/**', async (ruta) => {
    if (!ruta.request().url().includes('/signup')) return ruta.fulfill({ json: {} });
    enviado.alta = ruta.request().postDataJSON();
    await soltada;
    await ruta.fulfill(alta);
  });
  return { enviado, soltar };
}

const SESION_NUEVA: Respuesta = {
  status: 200,
  json: {
    access_token: 'falso',
    refresh_token: 'falso',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { ...USUARIO, aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: { name: 'Bautista' }, created_at: '2026-10-30T12:00:00Z' },
  },
};

async function completar(page: Page) {
  await page.getByLabel('Nombre', { exact: true }).fill('Bautista');
  await page.getByLabel('Apellido', { exact: true }).fill('Ribotta');
  await page.getByLabel('Correo electrónico').fill('bauti@correo.com');
  await page.getByLabel('Contraseña', { exact: true }).fill('secreta1');
  await page.getByLabel('Repetí la contraseña').fill('secreta1');
}

test('crear cuenta: carga, da de alta y sigue a los términos', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  const { enviado, soltar } = await sinSesion(page, SESION_NUEVA, { retener: true });
  await page.goto('/signup');
  await completar(page);
  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  // Mientras Supabase responde: el boton carga y los campos quedan apagados.
  await expect(page.getByRole('button', { name: 'Creando cuenta…' })).toBeVisible();
  await expect(page.getByLabel('Correo electrónico')).toBeDisabled();
  await page.screenshot({ path: 'capturas/signup-creando-oscuro.png' });

  soltar();
  await expect(page).toHaveURL(/\/bienvenida$/);
  expect(enviado.alta).toMatchObject({ email: 'bauti@correo.com', password: 'secreta1', data: { name: 'Bautista' } });
  expect(enviado.apellido).toEqual({ surname: 'Ribotta' });
});

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`correo ya registrado en ${nombre}: error en el campo, entrar o recuperar`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await sinSesion(page, { status: 422, json: { code: 422, error_code: 'user_already_exists', msg: 'User already registered' } });
    await page.goto('/signup');
    await completar(page);
    await page.getByRole('button', { name: 'Crear cuenta' }).click();

    await expect(page.getByText('Este correo ya tiene una cuenta.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled();
    await page.screenshot({ path: `capturas/signup-tomado-${nombre}.png` });

    // Recuperar lleva el correo ya escrito.
    await page.getByRole('link', { name: 'recuperá la contraseña' }).click();
    await expect(page).toHaveURL(/\/recuperar$/);
    await expect(page.getByLabel('Correo electrónico')).toHaveValue('bauti@correo.com');
  });
}

test('cambiar el correo borra el error de correo registrado', async ({ page }) => {
  await sinSesion(page, { status: 422, json: { code: 422, error_code: 'email_exists', msg: 'Email exists' } });
  await page.goto('/signup');
  await completar(page);
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByText('Este correo ya tiene una cuenta.')).toBeVisible();
  await page.getByLabel('Correo electrónico').fill('otro@correo.com');
  await expect(page.getByText('Este correo ya tiene una cuenta.')).toHaveCount(0);
  await expect(page.getByText('¿Es tuya?')).toHaveCount(0);
});

test('demasiados intentos: aviso de error y el formulario queda como estaba', async ({ page }) => {
  await sinSesion(page, { status: 429, json: { code: 429, error_code: 'over_request_rate_limit', msg: 'Too many requests' } });
  await page.goto('/signup');
  await completar(page);
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByText('Hiciste muchos intentos seguidos. Esperá unos minutos y probá de nuevo.')).toBeVisible();
  await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('Bautista');
  await expect(page).toHaveURL(/\/signup$/);
});

test('teléfono: correo ya registrado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page, { status: 422, json: { code: 422, error_code: 'user_already_exists', msg: 'User already registered' } });
  await page.goto('/signup');
  await completar(page);
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByText('¿Es tuya?')).toBeVisible();
  await page.screenshot({ path: 'capturas/signup-tomado-telefono.png', fullPage: true });
});

test('tablet: correo ya registrado', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page, { status: 422, json: { code: 422, error_code: 'user_already_exists', msg: 'User already registered' } });
  await page.goto('/signup');
  await completar(page);
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByText('¿Es tuya?')).toBeVisible();
  await page.screenshot({ path: 'capturas/signup-tomado-tablet.png' });
});
