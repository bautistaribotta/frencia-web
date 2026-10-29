/* Ingreso con Apple y Google desde el login y el signup: la salida al
   proveedor (con PKCE y vuelta a la misma pantalla), la ruedita en el boton
   tocado, Apple oculto hasta tener la cuenta de Apple Developer, y la vuelta con un error (cancelado o proveedor
   caido), que se avisa y limpia la URL. Nada sale a la red: la pantalla del
   proveedor se simula. */

import { expect, test, type Page } from '@playwright/test';

/** Sin sesion. La salida a /authorize queda colgada hasta que se suelte, para
 *  poder ver el estado de carga; devuelve la URL pedida y como soltarla. */
async function sinSesion(page: Page) {
  let pedida = '';
  let soltar: () => void = () => {};
  const soltada = new Promise<void>((resolver) => (soltar = resolver));
  await page.route('**/rest/v1/**', (ruta) => ruta.fulfill({ json: [] }));
  await page.route('**/auth/v1/**', async (ruta) => {
    if (!ruta.request().url().includes('/authorize')) return ruta.fulfill({ json: {} });
    pedida = ruta.request().url();
    await soltada;
    await ruta.fulfill({ contentType: 'text/html', body: '<title>Proveedor</title><h1>Pantalla del proveedor</h1>' });
  });
  return { pedida: () => pedida, soltar };
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`login: entrando con Google en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    const proveedor = await sinSesion(page);
    await page.goto('/login');
    // Mientras la salida esta retenida, Playwright espera a que termine la
    // navegacion antes de mirar la pagina: el estado de los botones lo
    // anota la propia pagina en la consola apenas cambia.
    const estados: string[] = [];
    page.on('console', (m) => {
      if (m.text().startsWith('botones ')) estados.push(m.text().slice(8));
    });
    await page.evaluate(() => {
      new MutationObserver(() => {
        const botones = [...document.querySelectorAll('button')].filter((b) => b.textContent?.trim() === 'Google');
        console.log('botones ' + botones.map((b) => `${b.textContent?.trim()}:${b.getAttribute('aria-busy') ?? '-'}:${b.disabled ? 'apagado' : 'activo'}`).join(' '));
      }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-busy', 'disabled'] });
    });
    const saliendo = page.waitForRequest(/auth[/]v1[/]authorize/);
    const clic = page.getByRole('button', { name: 'Google' }).click();
    await saliendo;
    // El tocado carga mientras el navegador sale.
    expect(estados).toContain('Google:true:apagado');

    proveedor.soltar();
    await clic;
    await expect(page.getByRole('heading', { name: 'Pantalla del proveedor' })).toBeVisible();
    const url = new URL(proveedor.pedida());
    expect(url.searchParams.get('provider')).toBe('google');
    expect(url.searchParams.get('redirect_to')).toMatch(/\/login$/);
    expect(url.searchParams.get('code_challenge')).toBeTruthy();
  });
}

test('signup: Google vuelve al signup y Apple no se ofrece', async ({ page }) => {
  const proveedor = await sinSesion(page);
  proveedor.soltar();
  await page.goto('/signup');
  await expect(page.getByRole('button', { name: 'Apple' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Google' }).click();
  await expect(page.getByRole('heading', { name: 'Pantalla del proveedor' })).toBeVisible();
  const url = new URL(proveedor.pedida());
  expect(url.searchParams.get('provider')).toBe('google');
  expect(url.searchParams.get('redirect_to')).toMatch(/\/signup$/);
});

test('volver cancelado: aviso informativo y URL limpia', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page);
  await page.addInitScript(() => sessionStorage.setItem('frencia.oauth', JSON.stringify({ proveedor: 'google' })));
  await page.goto('/login?error=access_denied&error_description=The+user+denied+the+request');
  await expect(page.getByText('Cancelaste el ingreso con Google.')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  await page.screenshot({ path: 'capturas/sociales-cancelado-oscuro.png' });
});

test('volver con el proveedor caido: aviso de error', async ({ page }) => {
  await sinSesion(page);
  await page.addInitScript(() => sessionStorage.setItem('frencia.oauth', JSON.stringify({ proveedor: 'google' })));
  await page.goto('/signup#error=server_error&error_description=Unable+to+exchange+external+code');
  await expect(page.getByText('No pudimos entrar con Google. Probá de nuevo.')).toBeVisible();
  await expect(page).toHaveURL(/\/signup$/);
});

test('telefono: Google a lo ancho', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page);
  await page.goto('/login');
  await page.getByRole('button', { name: 'Google' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
  await page.screenshot({ path: 'capturas/sociales-telefono.png' });
});

test('tablet: el acceso con Google', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await sinSesion(page);
  await page.goto('/signup');
  await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
  await page.screenshot({ path: 'capturas/sociales-tablet.png' });
});
