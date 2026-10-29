/* Inicio (kit web, Web · 4, README «Inicio» e «Inicio sin rutinas»).
   - Con rutina: Actividad (el ultimo año en escritorio, 6 meses en la tablet
     y 5 semanas en el telefono), solo informativa, y el dia que toca marcado.
   - Sin rutinas: la tarjeta de la primera rutina y los tres pasos, los tres
     punteados y del mismo alto; el primero se distingue por el numero relleno.
   Capturas en oscuro y claro. */

import { expect, test, type Page } from '@playwright/test';

import { conSesion } from './simulacion';

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`inicio sin rutinas en ${nombre}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conSesion(page, { tablas: { routines: [], workout_sessions: [] } });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Crear primera rutina' })).toBeVisible();

    const pasos = page.locator('div', { has: page.getByText('Revisá tu progreso', { exact: true }) }).last().locator('..').locator('> div');
    await expect(pasos).toHaveCount(3);
    const estilos = await pasos.evaluateAll((cajas) => cajas.map((c) => ({ borde: getComputedStyle(c).borderStyle, alto: c.getBoundingClientRect().height })));
    expect(estilos.map((e) => e.borde)).toEqual(['dashed', 'dashed', 'dashed']);
    expect(new Set(estilos.map((e) => Math.round(e.alto))).size).toBe(1);
    await expect(page.getByText('Historial y mejores marcas, en la pantalla grande.')).toBeVisible();
    await page.screenshot({ path: `capturas/inicio-vacio-${nombre}.png` });
  });
}

// Rutina de lunes, miercoles y viernes; hoy es jueves 29 de octubre de 2026.
const HOY = new Date(2026, 9, 29, 12);
const dia = (id: string, name: string, position: number, weekday: number) => ({
  id,
  name,
  position,
  training_day_weekdays: [{ weekday }],
  training_day_exercises: [{ count: 6 }],
});
const RUTINA = {
  id: '00000000-0000-0000-0000-0000000000a1',
  name: 'Torso Piernas',
  training_days: [dia('d1', 'Torso', 0, 0), dia('d2', 'Piernas', 1, 2), dia('d3', 'Full body', 2, 4)],
};
/** Sesiones de lunes, miercoles y viernes durante el ultimo año, con alguna falta. */
function sesiones(hasta: Date) {
  const lista = [];
  for (let i = 1; i < 365; i++) {
    const d = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate() - i, 19);
    const weekday = (d.getDay() + 6) % 7;
    if (![0, 2, 4].includes(weekday) || i % 9 === 0) continue;
    const id = ['d1', 'd2', 'd3'][[0, 2, 4].indexOf(weekday)];
    lista.push({
      id: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
      started_at: new Date(d.getTime() - 3600_000).toISOString(),
      finished_at: d.toISOString(),
      training_day_id: id,
      training_days: { name: RUTINA.training_days.find((x) => x.id === id)!.name },
      session_sets: [{ count: 15 }],
    });
  }
  return lista;
}

async function conRutina(page: Page, hoy = HOY, extra: unknown[] = []) {
  await page.clock.setFixedTime(hoy);
  const todas = [...extra, ...sesiones(hoy)];
  await conSesion(page, { tablas: { routines: [RUTINA], workout_sessions: todas } });
  // Ultimas sesiones pide 3; la simulacion no aplica el limit.
  await page.route('**/rest/v1/workout_sessions?*limit=3*', (ruta) => ruta.fulfill({ json: todas.slice(0, 3) }));
}

/** La tarjeta de un dia de la rutina en curso. */
const tarjetaDia = (page: Page, nombre: string) => page.locator(`a[href="/rutinas/${RUTINA.id}"]`).filter({ hasText: nombre });

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`actividad del último año y el próximo día en ${nombre}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conRutina(page);
    await page.goto('/');
    const cuadro = page.getByRole('img', { name: /sesiones en el último año$/ });
    await expect(cuadro).toBeVisible();
    // Ya no esta la semana.
    await expect(page.getByText(/^Esta semana/)).toHaveCount(0);
    // 53 columnas de 7 dias; hoy con su detalle, sin entrenar.
    const celdas = cuadro.locator('[title], [class*="futuro"]');
    await expect(celdas).toHaveCount(53 * 7);
    await expect(cuadro.locator('[title="Jue 29 oct · Sin entrenar"]')).toHaveCount(1);
    await expect(cuadro.locator('[title="Mié 28 oct · Piernas · 15 series"]')).toHaveCount(1);
    // Solo informativo: nada se puede enfocar ni es un enlace.
    await expect(cuadro.locator('a, button, [tabindex]')).toHaveCount(0);
    // Jueves: toca el viernes.
    const fullBody = tarjetaDia(page, 'Full body');
    await expect(fullBody).toContainText('Próximo · Vie');
    await expect(page.getByText('Empezalo desde la app')).toHaveCount(0);
    await page.screenshot({ path: `capturas/inicio-actividad-${nombre}.png` });
  });
}

test('un viernes sin sesión marca Hoy', async ({ page }) => {
  const viernes = new Date(2026, 9, 30, 12);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await conRutina(page, viernes);
  await page.goto('/');
  const fullBody = tarjetaDia(page, 'Full body');
  await expect(fullBody).toContainText('Hoy');
  await expect(fullBody).toContainText('Empezalo desde la app');
});

test('con la sesión de hoy hecha, marca el próximo', async ({ page }) => {
  const viernes = new Date(2026, 9, 30, 20);
  const hecha = {
    id: '00000000-0000-0000-0000-00000000ffff',
    started_at: new Date(2026, 9, 30, 18).toISOString(),
    finished_at: new Date(2026, 9, 30, 19).toISOString(),
    training_day_id: 'd3',
    training_days: { name: 'Full body' },
    session_sets: [{ count: 15 }],
  };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await conRutina(page, viernes, [hecha]);
  await page.goto('/');
  await expect(tarjetaDia(page, 'Torso')).toContainText('Próximo · Lun');
  await expect(page.getByText(/^Hoy · /)).toHaveCount(0);
});

for (const [tamano, semanas, rango, archivo] of [
  [{ width: 768, height: 1024 }, 26, 'los últimos 6 meses', 'tablet'],
  [{ width: 390, height: 844 }, 5, 'las últimas 5 semanas', 'telefono'],
] as const) {
  test(`actividad en ${archivo}: ${semanas} semanas`, async ({ page }) => {
    await page.setViewportSize(tamano);
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await conRutina(page);
    await page.goto('/');
    const cuadro = page.getByRole('img', { name: new RegExp(`sesiones en ${rango}$`) });
    await expect(cuadro).toBeVisible();
    await expect(cuadro.locator('[title], [class*="futuro"]')).toHaveCount(semanas * 7);
    const caja = (await cuadro.boundingBox())!;
    expect(caja.x + caja.width).toBeLessThanOrEqual(tamano.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(tamano.width);
    await page.screenshot({ path: `capturas/${archivo}-inicio-actividad.png`, fullPage: true });
  });
}
