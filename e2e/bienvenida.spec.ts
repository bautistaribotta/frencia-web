/* Fases de la cuenta antes de la app: los terminos sin aceptar
   (/bienvenida), el setup sin terminar (/bienvenida/perfil), la cuenta con la
   baja pedida (/cuenta-en-baja) y el perfil que no se puede leer. Capturas a
   1440×900 en oscuro y claro. */

import { expect, test, type Page } from '@playwright/test';

import { ACEPTACION_VIGENTE, conSesion, PERFIL, type Perfil } from './simulacion';

/** Un perfil que cambia con lo que la app guarda: la aceptacion, el setup y
 *  la cancelacion de la baja. Devuelve lo que se mando. */
async function conPerfil(page: Page, inicial: Perfil) {
  const perfil: Perfil = { ...PERFIL, ...inicial };
  const enviado: { aceptacion?: unknown; setup?: Record<string, unknown>; cancelada?: boolean } = {};
  await conSesion(page, { perfil });
  await page.route('**/rest/v1/profiles?*', async (ruta) => {
    if (ruta.request().method() === 'PATCH') {
      enviado.setup = ruta.request().postDataJSON();
      Object.assign(perfil, enviado.setup);
      return ruta.fulfill({ status: 204, body: '' });
    }
    await ruta.fulfill({ json: perfil });
  });
  await page.route('**/rest/v1/rpc/registrar_aceptacion_legal', async (ruta) => {
    enviado.aceptacion = ruta.request().postDataJSON();
    perfil.aceptaciones_legales = ACEPTACION_VIGENTE;
    await ruta.fulfill({ status: 204, body: '' });
  });
  await page.route('**/rest/v1/rpc/cancelar_eliminacion_cuenta', async (ruta) => {
    enviado.cancelada = true;
    perfil.deletion_requested_at = null;
    await ruta.fulfill({ status: 204, body: '' });
  });
  return enviado;
}

/** Scrollea el documento abierto hasta el final. */
async function leerHastaElFinal(page: Page, titulo: string) {
  const doc = page.getByRole('dialog', { name: titulo }).getByLabel(titulo, { exact: true });
  await doc.evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`primer ingreso en ${nombre}: términos, setup y de vuelta a lo pedido`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    const enviado = await conPerfil(page, { aceptaciones_legales: [], onboarding_completed: false, sexo: null, fecha_nacimiento: null, altura: null, peso: null });
    await page.goto('/historial');
    await expect(page).toHaveURL(/\/bienvenida$/);
    const aceptar = page.getByRole('button', { name: 'Aceptar y continuar' });
    await expect(aceptar).toBeDisabled();
    await page.screenshot({ path: `capturas/bienvenida-${nombre}.png` });

    await page.getByRole('button', { name: 'Leer Términos y condiciones' }).click();
    await expect(page.getByText(/Leído \d+ %/)).toBeVisible();
    await page.screenshot({ path: `capturas/bienvenida-leyendo-${nombre}.png` });
    await leerHastaElFinal(page, 'Términos y condiciones');
    await expect(page.getByRole('dialog', { name: 'Términos y condiciones' })).toBeHidden();
    await expect(aceptar).toBeDisabled();
    await page.getByRole('button', { name: 'Leer Política de privacidad' }).click();
    await leerHastaElFinal(page, 'Política de privacidad');
    await expect(page.getByRole('dialog', { name: 'Política de privacidad' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Volver a leer Términos y condiciones' })).toBeVisible();
    await expect(aceptar).toBeEnabled();
    await page.screenshot({ path: `capturas/bienvenida-leidos-${nombre}.png` });
    await aceptar.click();
    expect(enviado.aceptacion).toEqual({ p_version_terminos: ACEPTACION_VIGENTE[0].version_terminos, p_version_privacidad: ACEPTACION_VIGENTE[0].version_privacidad });

    // Setup: sexo, fecha, altura y peso salteado.
    await expect(page).toHaveURL(/\/bienvenida\/perfil$/);
    const continuar = page.getByRole('button', { name: 'Continuar' });
    await expect(continuar).toBeDisabled();
    await page.getByRole('radio', { name: 'Femenino' }).click();
    await page.screenshot({ path: `capturas/setup-sexo-${nombre}.png` });
    await page.keyboard.press('Enter');

    await expect(page.getByRole('heading', { name: '¿Cuándo naciste?' })).toBeVisible();
    await page.keyboard.type('31022001');
    await expect(page.getByText('Esa fecha no existe.')).toBeVisible();
    await expect(continuar).toBeDisabled();
    await page.getByRole('group', { name: 'Fecha de nacimiento' }).locator('input').first().fill('14');
    await page.getByRole('group', { name: 'Fecha de nacimiento' }).locator('input').nth(1).fill('03');
    await expect(continuar).toBeEnabled();
    await page.screenshot({ path: `capturas/setup-fecha-${nombre}.png` });
    await continuar.click();

    await expect(page.getByRole('heading', { name: '¿Cuál es tu altura?' })).toBeVisible();
    const regla = page.getByRole('slider', { name: 'Altura' });
    await regla.focus();
    await page.keyboard.press('Shift+ArrowRight');
    await expect(regla).toHaveAttribute('aria-valuenow', '180');
    await page.keyboard.press('ArrowLeft');
    await expect(regla).toHaveAttribute('aria-valuenow', '179');
    await page.screenshot({ path: `capturas/setup-altura-${nombre}.png` });
    await page.keyboard.press('Enter');

    await expect(page.getByRole('heading', { name: '¿Cuál es tu peso?' })).toBeVisible();
    await page.getByRole('radio', { name: 'lb' }).click();
    await expect(page.getByRole('slider', { name: 'Peso' })).toHaveAttribute('aria-valuenow', '154');
    await page.screenshot({ path: `capturas/setup-peso-${nombre}.png` });
    await page.getByRole('button', { name: 'Saltar' }).click();

    await expect(page).toHaveURL(/\/historial$/);
    expect(enviado.setup).toEqual({
      unidad_altura: 'cm',
      unidad_peso: 'lb',
      onboarding_completed: true,
      sexo: 'femenino',
      fecha_nacimiento: '2001-03-14',
      altura: 179,
    });
  });
}

test('setup: Atrás vuelve con lo cargado y la altura en pies', async ({ page }) => {
  await conPerfil(page, { onboarding_completed: false, sexo: 'masculino', altura: 178 });
  await page.goto('/');
  await expect(page).toHaveURL(/\/bienvenida\/perfil$/);
  await expect(page.getByRole('radio', { name: 'Masculino' })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Saltar' }).click();
  await page.getByRole('radio', { name: 'ft' }).click();
  await expect(page.getByRole('slider', { name: 'Altura' })).toHaveAttribute('aria-valuetext', '5′ 10″');
  await page.getByRole('button', { name: 'Atrás' }).click();
  await expect(page.getByRole('heading', { name: '¿Cuándo naciste?' })).toBeVisible();
});

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`cuenta con la baja pedida en ${nombre}: recuperar`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    const pedida = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const enviado = await conPerfil(page, { deletion_requested_at: pedida });
    await page.goto('/rutinas');
    await expect(page).toHaveURL(/\/cuenta-en-baja$/);
    await expect(page.getByRole('heading', { name: /Tu cuenta se elimina el/ })).toBeVisible();
    await expect(page.getByText(/Se elimina en 2[67] días/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Recuperar cuenta' })).toBeFocused();
    await page.screenshot({ path: `capturas/cuenta-en-baja-${nombre}.png` });
    await page.getByRole('button', { name: 'Recuperar cuenta' }).click();
    await expect(page.getByText('Cuenta recuperada')).toBeVisible();
    await expect(page).toHaveURL(/\/rutinas$/);
    expect(enviado.cancelada).toBe(true);
  });
}

test('adentro, las pantallas de las fases llevan al inicio', async ({ page }) => {
  await conPerfil(page, {});
  await page.goto('/bienvenida');
  await expect(page).toHaveURL(/localhost:\d+\/$/);
  await page.goto('/cuenta-en-baja');
  await expect(page).toHaveURL(/localhost:\d+\/$/);
});

test('sin poder leer el perfil: sin conexión, nunca el setup', async ({ page }) => {
  await conSesion(page);
  await page.route('**/rest/v1/profiles?*', (ruta) => ruta.fulfill({ status: 500, json: { message: 'Error simulado' } }));
  await page.goto('/');
  await expect(page).not.toHaveURL(/bienvenida/);
  await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible({ timeout: 15000 });
});
