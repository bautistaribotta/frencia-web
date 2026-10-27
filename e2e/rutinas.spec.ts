/* Rutinas (/rutinas): capturas a 1440×900 en oscuro y claro, con una rutina
   en curso y una anterior. */

import { expect, test } from '@playwright/test';

import { conSesion } from './simulacion';

const dia = (id: string, name: string, position: number, weekdays: number[], ejercicios: number, sesiones: number) => ({
  id,
  name,
  position,
  training_day_weekdays: weekdays.map((weekday) => ({ weekday })),
  training_day_exercises: [{ count: ejercicios }],
  workout_sessions: [{ count: sesiones }],
});

const RUTINAS = [
  {
    id: 'r1',
    name: 'Push Pull Legs',
    archived_at: null,
    created_at: '2026-09-01T12:00:00Z',
    training_days: [dia('d1', 'Push', 0, [0, 3], 6, 8), dia('d2', 'Pull', 1, [1, 4], 6, 8), dia('d3', 'Legs', 2, [2, 5], 6, 8)],
  },
  {
    id: 'r2',
    name: 'Full body',
    archived_at: '2026-08-31T12:00:00Z',
    created_at: '2026-06-10T12:00:00Z',
    training_days: [dia('d4', 'Día A', 0, [0, 2, 4], 7, 30)],
  },
];

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`rutinas en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conSesion(page, { tablas: { routines: RUTINAS } });
    await page.goto('/rutinas');
    await expect(page.getByText('Push Pull Legs').first()).toBeVisible();
    for (const boton of await page.getByRole('button', { name: 'Nueva rutina', exact: true }).all()) {
      await boton.hover();
      await expect(boton).toHaveCSS('cursor', 'pointer');
    }
    await page.screenshot({ path: `capturas/rutinas-${nombre}.png` });
    await page.getByRole('main').getByRole('button', { name: 'Nueva rutina', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/rutinas\/nueva$/);
  });
}
