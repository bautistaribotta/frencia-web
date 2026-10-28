/* Tablet y teléfono (kit web, «Tablet y teléfono»): a 390×844 la barra
   inferior en lugar de la navegacion lateral, el aviso de la app que se
   cierra y no vuelve, las tablas sin columnas de apoyo, el modal como hoja y
   el constructor bloqueado; a 768×1024 el riel y el constructor entero.
   Ninguna pantalla se sale a lo ancho. Capturas en oscuro y claro. */

import { expect, test, type Page } from '@playwright/test';

import { conSesion } from './simulacion';

const TELEFONO = { width: 390, height: 844 };
const TABLET = { width: 768, height: 1024 };

const dia = (id: string, name: string, position: number, weekdays: number[]) => ({
  id,
  name,
  position,
  training_day_weekdays: weekdays.map((weekday) => ({ weekday })),
  training_day_exercises: [{ count: 6 }],
  workout_sessions: [{ count: 8 }],
});
const EN_CURSO = {
  id: '00000000-0000-0000-0000-0000000000a1',
  name: 'Push Pull Legs',
  archived_at: null,
  created_at: '2026-09-01T12:00:00Z',
  training_days: [dia('d1', 'Push', 0, [0, 3]), dia('d2', 'Pull', 1, [1, 4]), dia('d3', 'Legs', 2, [2, 5])],
};
const FULL_BODY = {
  id: '00000000-0000-0000-0000-0000000000a2',
  name: 'Full body',
  archived_at: '2026-08-31T12:00:00Z',
  created_at: '2026-06-10T15:00:00Z',
  training_days: [dia('d4', 'Día A', 0, [0, 2, 4])],
};
const SESIONES = [20, 17, 14].map((d, i) => ({
  id: `00000000-0000-0000-0000-00000000100${i}`,
  started_at: new Date(Date.UTC(2026, 9, d, 12)).toISOString(),
  finished_at: new Date(Date.UTC(2026, 9, d, 13)).toISOString(),
  training_day_id: 'd1',
  training_days: { name: 'Push', routines: { name: 'Push Pull Legs' } },
  session_sets: [{ count: 15 }],
}));

/** El detalle lee los ejercicios de cada dia, no su cuenta: para abrirlo,
 *  los dias van sin ejercicios. */
const SIN_EJERCICIOS = { ...EN_CURSO, training_days: EN_CURSO.training_days.map((d) => ({ ...d, training_day_exercises: [] })) };

async function entrar(page: Page, tamano = TELEFONO, tema: 'dark' | 'light' = 'dark', rutinas: unknown[] = [EN_CURSO, FULL_BODY]) {
  await page.setViewportSize(tamano);
  await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
  await conSesion(page, { tablas: { routines: rutinas, workout_sessions: SESIONES } });
}

/** Nada se sale a lo ancho: sin scroll lateral. */
async function sinDesborde(page: Page) {
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(page.viewportSize()!.width);
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`teléfono: barra inferior y tablas en ${nombre}`, async ({ page }) => {
    await entrar(page, TELEFONO, tema);
    await page.goto('/rutinas');
    const barra = page.getByRole('navigation', { name: 'Principal' });
    await expect(barra).toHaveCount(1);
    await expect(barra.getByRole('link', { name: 'Rutinas' })).toHaveClass(/activo/);
    await expect(page.getByRole('cell', { name: 'Full body', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Días' })).toBeHidden();
    await expect(page.getByRole('columnheader', { name: 'Fecha de creación' })).toBeHidden();
    await sinDesborde(page);
    await page.screenshot({ path: `capturas/telefono-rutinas-${nombre}.png` });

    await barra.getByRole('link', { name: 'Historial' }).click();
    await expect(page).toHaveURL(/\/historial$/);
    await expect(page.getByRole('columnheader', { name: 'Rutina' })).toBeHidden();
    await expect(page.getByRole('columnheader', { name: 'Series' })).toBeVisible();
    await sinDesborde(page);
    await page.screenshot({ path: `capturas/telefono-historial-${nombre}.png` });
  });
}

test('teléfono: ninguna pantalla se sale a lo ancho', async ({ page }) => {
  await entrar(page, TELEFONO, 'dark', [SIN_EJERCICIOS]);
  for (const ruta of ['/', '/rutinas', `/rutinas/${EN_CURSO.id}`, '/historial', '/perfil', '/perfil/editar', '/configuracion']) {
    await page.goto(ruta);
    await page.waitForLoadState('networkidle');
    await sinDesborde(page);
  }
  // Configuracion se entra desde Perfil: Perfil queda activa.
  await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Perfil' })).toHaveClass(/activo/);
});

test('teléfono: las pantallas públicas entran a lo ancho', async ({ page }) => {
  await page.setViewportSize(TELEFONO);
  for (const ruta of ['/login', '/signup', '/recuperar', '/terminos', '/privacidad']) {
    await page.goto(ruta);
    await page.waitForLoadState('networkidle');
    await sinDesborde(page);
  }
  await page.goto('/login');
  await page.screenshot({ path: 'capturas/telefono-login.png' });
});

test('teléfono: el aviso de la app se cierra y no vuelve', async ({ page }) => {
  await entrar(page);
  await page.goto('/');
  const aviso = page.getByRole('complementary', { name: 'La app de Frencia' });
  await expect(aviso).toContainText('Frencia anda mejor en la app');
  // Sin la app publicada, Descargar dice Pronto y no hace nada.
  await expect(aviso.getByRole('button', { name: 'Pronto' })).toBeDisabled();
  await aviso.getByRole('button', { name: 'Cerrar aviso' }).click();
  await expect(aviso).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(aviso).toHaveCount(0);
});

test('teléfono: el modal es una hoja pegada abajo', async ({ page }) => {
  await entrar(page);
  await page.goto('/rutinas');
  await page.getByRole('button', { name: 'Más acciones de Full body' }).click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  const hoja = page.getByRole('dialog');
  await expect(hoja).toBeVisible();
  const caja = (await hoja.boundingBox())!;
  expect(caja.width).toBe(TELEFONO.width);
  expect(Math.round(caja.y + caja.height)).toBe(TELEFONO.height);
  await page.screenshot({ path: 'capturas/telefono-hoja.png' });
});

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`teléfono: el constructor bloqueado vuelve a la rutina en ${nombre}`, async ({ page }) => {
    await entrar(page, TELEFONO, tema, [SIN_EJERCICIOS]);
    await page.goto(`/rutinas/${EN_CURSO.id}`);
    await page.getByRole('button', { name: 'Editar', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/rutinas/${EN_CURSO.id}/editar$`));
    await expect(page.getByRole('heading', { name: 'Armá tus rutinas en la app o en la compu' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'App Store' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Google Play' })).toBeDisabled();
    await expect(page.getByRole('navigation', { name: 'Principal' })).toHaveCount(0);
    await page.screenshot({ path: `capturas/telefono-constructor-${nombre}.png` });
    await page.getByRole('button', { name: 'Volver a la rutina' }).click();
    await expect(page).toHaveURL(new RegExp(`/rutinas/${EN_CURSO.id}$`));
  });
}

test('tablet: riel, sin desborde y el constructor entero', async ({ page }) => {
  await entrar(page, TABLET, 'dark', [SIN_EJERCICIOS, FULL_BODY]);
  for (const ruta of ['/', '/rutinas', `/rutinas/${EN_CURSO.id}`, '/historial', '/perfil', '/configuracion']) {
    await page.goto(ruta);
    await page.waitForLoadState('networkidle');
    await sinDesborde(page);
  }
  await page.goto('/rutinas');
  await expect(page.getByRole('complementary', { name: 'La app de Frencia' })).toBeHidden();
  await expect(page.getByRole('columnheader', { name: 'Días' })).toBeVisible();
  await page.screenshot({ path: 'capturas/tablet-rutinas.png' });
  await page.goto('/rutinas/nueva');
  await expect(page.getByRole('heading', { name: 'Armá tus rutinas en la app o en la compu' })).toHaveCount(0);
  await page.screenshot({ path: 'capturas/tablet-constructor.png' });
});

test('teléfono: las acciones del detalle van en una fila y el menú no se sale', async ({ page }) => {
  const archivada = { ...SIN_EJERCICIOS, id: FULL_BODY.id, name: 'Full body', archived_at: '2026-08-31T12:00:00Z' };
  for (const [rutina, acciones] of [
    [SIN_EJERCICIOS, ['Editar', 'Compartir · Muy pronto']],
    [archivada, ['Poner en curso', 'Editar rutina', 'Compartir · Muy pronto']],
  ] as const) {
    const id = rutina.id;
    // El detalle lee una sola rutina: la simulacion devuelve solo esa.
    await entrar(page, TELEFONO, 'dark', [rutina]);
    await page.goto(`/rutinas/${id}`);
    const botones = [...acciones.map((a) => page.getByRole('button', { name: a, exact: true })), page.getByRole('button', { name: /^Más acciones/ })];
    const cajas = await Promise.all(botones.map(async (b) => (await b.boundingBox())!));
    // Misma fila, de izquierda a derecha, todo dentro de la pantalla.
    expect(new Set(cajas.map((c) => Math.round(c.y + c.height / 2))).size).toBe(1);
    expect(cajas.map((c) => c.x)).toEqual(cajas.map((c) => c.x).sort((a, b) => a - b));
    expect(cajas.at(-1)!.x + cajas.at(-1)!.width).toBeLessThanOrEqual(TELEFONO.width);
    await botones.at(-1)!.click();
    const menu = (await page.getByRole('menu').boundingBox())!;
    expect(menu.x).toBeGreaterThanOrEqual(0);
    expect(menu.x + menu.width).toBeLessThanOrEqual(TELEFONO.width);
    await page.screenshot({ path: `capturas/telefono-detalle-${id === EN_CURSO.id ? 'en-curso' : 'archivada'}.png` });
    await page.keyboard.press('Escape');
  }
});
