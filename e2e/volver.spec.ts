/* Volver con memoria: el boton de volver lleva a la pantalla de la que se
   vino, con su nombre, y sin memoria (entrar por la URL) a la de arriba. */

import { expect, test } from '@playwright/test';

import { conSesion } from './simulacion';

const RUTINA = {
  id: '00000000-0000-0000-0000-0000000000a1',
  name: 'Push Pull Legs',
  archived_at: null,
  created_at: '2026-09-01T12:00:00Z',
  training_days: [
    {
      id: 'd1',
      name: 'Push',
      position: 0,
      training_day_weekdays: [{ weekday: 0 }],
      training_day_exercises: [],
      workout_sessions: [{ count: 0 }],
    },
  ],
};

test('desde Inicio, ver la rutina y volver a Inicio; el constructor vuelve a la rutina', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await conSesion(page, { tablas: { routines: [RUTINA] } });
  await page.goto('/');
  await page.getByRole('link', { name: 'Ver rutina' }).click();
  await expect(page).toHaveURL(new RegExp(`/rutinas/${RUTINA.id}$`));
  const volver = page.getByRole('button', { name: 'Inicio', exact: true });
  await expect(volver).toBeVisible();
  await page.screenshot({ path: 'capturas/volver-inicio.png' });

  // Ida y vuelta al constructor: el detalle sigue sabiendo que se vino de Inicio.
  await page.getByRole('button', { name: /Editar/ }).first().click();
  await expect(page).toHaveURL(new RegExp(`/rutinas/${RUTINA.id}/editar$`));
  await page.getByRole('button', { name: 'Volver a la rutina' }).click();
  await expect(page).toHaveURL(new RegExp(`/rutinas/${RUTINA.id}$`));

  await page.getByRole('button', { name: 'Inicio', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('desde Rutinas vuelve a Rutinas, y entrando por la URL tambien', async ({ page }) => {
  await conSesion(page, { tablas: { routines: [RUTINA] } });
  await page.goto('/rutinas');
  await page.getByText('Push Pull Legs').first().click();
  await expect(page).toHaveURL(new RegExp(`/rutinas/${RUTINA.id}$`));
  await page.getByRole('button', { name: 'Rutinas', exact: true }).click();
  await expect(page).toHaveURL(/\/rutinas$/);

  await page.goto(`/rutinas/${RUTINA.id}`);
  await page.getByRole('button', { name: 'Rutinas', exact: true }).click();
  await expect(page).toHaveURL(/\/rutinas$/);
});
