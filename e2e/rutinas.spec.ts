/* Rutinas (/rutinas): capturas a 1440×900 en oscuro y claro, con una rutina
   en curso y una anterior; el menu ⋯ de una fila (poner en curso, editar,
   eliminar), el limite de rutinas y el detalle de una archivada. */

import { expect, test, type Page } from '@playwright/test';

import { conSesion } from './simulacion';

const dia = (id: string, name: string, position: number, weekdays: number[], ejercicios: number, sesiones: number) => ({
  id,
  name,
  position,
  training_day_weekdays: weekdays.map((weekday) => ({ weekday })),
  training_day_exercises: [{ count: ejercicios }],
  workout_sessions: [{ count: sesiones }],
});

const EN_CURSO = {
  id: '00000000-0000-0000-0000-0000000000a1',
  name: 'Push Pull Legs',
  archived_at: null,
  created_at: '2026-09-01T12:00:00Z',
  training_days: [dia('d1', 'Push', 0, [0, 3], 6, 8), dia('d2', 'Pull', 1, [1, 4], 6, 8), dia('d3', 'Legs', 2, [2, 5], 6, 8)],
};
const FULL_BODY = {
  id: '00000000-0000-0000-0000-0000000000a2',
  name: 'Full body',
  archived_at: '2026-08-31T12:00:00Z',
  created_at: '2026-06-10T15:00:00Z',
  training_days: [dia('d4', 'Día A', 0, [0, 2, 4], 7, 30)],
};
const RUTINAS = [EN_CURSO, FULL_BODY];

/** Las llamadas que cambian rutinas: activar_rutina y el DELETE. */
async function conAcciones(page: Page, rutinas: unknown[] = RUTINAS) {
  await conSesion(page, { tablas: { routines: rutinas } });
  const activadas: string[] = [];
  const eliminadas: string[] = [];
  await page.route('**/rest/v1/rpc/activar_rutina', async (ruta) => {
    activadas.push(ruta.request().postDataJSON().p_routine_id);
    await ruta.fulfill({ status: 204, body: '' });
  });
  await page.route('**/rest/v1/routines?*', async (ruta) => {
    if (ruta.request().method() !== 'DELETE') return ruta.fallback();
    eliminadas.push(new URL(ruta.request().url()).searchParams.get('id') ?? '');
    await ruta.fulfill({ status: 204, headers: { 'content-range': '*/1' }, body: '' });
  });
  return { activadas, eliminadas };
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`rutinas en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conAcciones(page);
    await page.goto('/rutinas');
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { name: 'Todas las rutinas' })).toBeVisible();
    await expect(main.getByText('Una en curso, al poner otra en curso, la actual se archiva.')).toBeVisible();
    // Nueva rutina vive solo en la navegacion; sin orden a elegir.
    await expect(main.getByRole('button', { name: 'Nueva rutina' })).toHaveCount(0);
    await expect(main.getByRole('radiogroup')).toHaveCount(0);
    await expect(main.getByText('2 de 5 rutinas')).toBeVisible();
    await expect(main.getByRole('columnheader', { name: 'Fecha de creación' })).toBeVisible();
    await expect(main.getByRole('cell', { name: '10 JUN 2026' })).toBeVisible();
    await expect(main.getByText(/Archivada el/)).toHaveCount(0);

    const nueva = page.getByRole('navigation', { name: 'Principal' }).getByRole('button', { name: 'Nueva rutina' });
    await nueva.hover();
    await expect(nueva).toHaveCSS('cursor', 'pointer');
    await page.screenshot({ path: `capturas/rutinas-${nombre}.png` });

    await main.getByRole('button', { name: 'Más acciones de Full body' }).click();
    const menu = page.getByRole('menu', { name: 'Más acciones de Full body' });
    await expect(menu.getByRole('menuitem', { name: 'Poner en curso' })).toBeFocused();
    await expect(menu.getByRole('menuitem', { name: 'Duplicar' })).toBeEnabled();
    await expect(menu.getByRole('menuitem', { name: 'Compartir' })).toBeDisabled();
    await expect(menu.getByRole('menuitem', { name: /Eliminar/ })).toBeEnabled();
    await page.screenshot({ path: `capturas/rutinas-menu-${nombre}.png` });
  });
}

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`en curso con 4 días y nombres largos, en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    const larga = {
      ...EN_CURSO,
      name: 'Torso-Piernas 3 dias',
      training_days: [
        dia('d1', 'Lunes - Torso', 0, [0], 3, 3),
        dia('d2', 'Miercoles - Piernas/Hombros', 1, [2], 3, 3),
        dia('d3', 'Viernes - Torso', 2, [4], 3, 2),
        dia('d4', 'Día 4', 3, [], 3, 0),
      ],
    };
    await conAcciones(page, [larga, FULL_BODY]);
    await page.goto('/rutinas');
    const tarjeta = page.getByRole('link', { name: /Torso-Piernas 3 dias/ });
    await expect(tarjeta.getByText('Miercoles - Piernas/Hombros')).toBeVisible();
    // Una fila por dia, todas dentro de la tarjeta.
    const caja = (await tarjeta.boundingBox())!;
    for (const nombreDia of ['Lunes - Torso', 'Miercoles - Piernas/Hombros', 'Viernes - Torso', 'Día 4']) {
      const b = (await tarjeta.getByText(nombreDia, { exact: true }).boundingBox())!;
      expect(b.x + b.width).toBeLessThanOrEqual(caja.x + caja.width);
      expect(b.y + b.height).toBeLessThanOrEqual(caja.y + caja.height);
    }
    const ys = await Promise.all(['Lunes - Torso', 'Viernes - Torso', 'Día 4'].map(async (n) => (await tarjeta.getByText(n, { exact: true }).boundingBox())!.y));
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
    await expect(tarjeta.getByText('3 ejercicios')).toHaveCount(4);
    await page.screenshot({ path: `capturas/rutinas-en-curso-4-dias-${nombre}.png` });
  });
}

test('menu: poner en curso con deshacer y editar una archivada', async ({ page }) => {
  const { activadas } = await conAcciones(page);
  await page.goto('/rutinas');
  const fila = page.getByRole('row', { name: /Full body/ });
  // Clic derecho sobre la fila abre su menu.
  await fila.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Poner en curso' }).click();
  await expect(page.getByText('Full body está en curso')).toBeVisible();
  expect(activadas).toEqual([FULL_BODY.id]);
  await page.getByRole('button', { name: 'Deshacer' }).click();
  await expect.poll(() => activadas).toEqual([FULL_BODY.id, EN_CURSO.id]);

  await page.getByRole('button', { name: 'Más acciones de Full body' }).click();
  await page.getByRole('menuitem', { name: 'Editar' }).click();
  await expect(page).toHaveURL(new RegExp(`rutinas/${FULL_BODY.id}/editar$`));
});

test('eliminar desde la lista: confirmación con Supr y desde el menú', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { eliminadas } = await conAcciones(page);
  await page.goto('/rutinas');
  await page.getByRole('link', { name: 'Full body' }).focus();
  await page.keyboard.press('Delete');
  const modal = page.getByRole('dialog', { name: 'Eliminar Full body' });
  await expect(modal).toContainText('Se borra la rutina con su día y los ejercicios');
  const cancelar = modal.getByRole('button', { name: 'Cancelar' });
  const eliminar = modal.getByRole('button', { name: 'Eliminar' });
  await expect(cancelar).toBeFocused();
  // Lo que borra va a la derecha.
  expect((await cancelar.boundingBox())!.x).toBeLessThan((await eliminar.boundingBox())!.x);
  await page.screenshot({ path: 'capturas/rutinas-eliminar.png' });
  await cancelar.click();
  await expect(modal).toBeHidden();
  expect(eliminadas).toEqual([]);

  await page.getByRole('button', { name: 'Más acciones de Full body' }).click();
  await page.getByRole('menuitem', { name: /Eliminar/ }).click();
  await modal.getByRole('button', { name: 'Eliminar' }).click();
  await expect(page.getByText('Full body eliminada.')).toBeVisible();
  expect(eliminadas).toEqual([`eq.${FULL_BODY.id}`]);
});

test('con 5 rutinas, Nueva rutina y N abren el aviso del límite', async ({ page }) => {
  const cinco = [EN_CURSO, ...[1, 2, 3, 4].map((i) => ({ ...FULL_BODY, id: `00000000-0000-0000-0000-0000000000b${i}`, name: `Vieja ${i}` }))];
  await conAcciones(page, cinco);
  await page.goto('/rutinas');
  await expect(page.getByText('5 de 5 rutinas')).toBeVisible();
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('button', { name: 'Nueva rutina' }).click();
  const aviso = page.getByRole('dialog', { name: 'Llegaste a 5 rutinas' });
  await expect(aviso.getByRole('button', { name: 'Entendido' })).toBeFocused();
  await page.screenshot({ path: 'capturas/rutinas-limite.png' });
  await aviso.getByRole('button', { name: 'Entendido' }).click();
  await expect(aviso).toBeHidden();
  await expect(page).toHaveURL(/\/rutinas$/);
  await page.keyboard.press('n');
  await expect(aviso).toBeVisible();
});

test('detalle de una archivada: editar y poner en curso', async ({ page }) => {
  const archivada = { ...FULL_BODY, training_days: [{ ...FULL_BODY.training_days[0], training_day_exercises: [] }] };
  const { activadas } = await conAcciones(page, [archivada]);
  await page.goto(`/rutinas/${FULL_BODY.id}`);
  const editar = page.getByRole('button', { name: 'Editar rutina' });
  const poner = page.getByRole('button', { name: 'Poner en curso' });
  await expect(editar).toBeEnabled();
  expect((await editar.boundingBox())!.x).toBeLessThan((await poner.boundingBox())!.x);
  await page.screenshot({ path: 'capturas/rutina-archivada.png' });
  await poner.click();
  await expect(page.getByText('Full body está en curso')).toBeVisible();
  expect(activadas).toEqual([FULL_BODY.id]);
  await editar.click();
  await expect(page).toHaveURL(new RegExp(`rutinas/${FULL_BODY.id}/editar$`));
});

test('duplicar: copia archivada con nombre al estilo de Windows, desde la lista y el detalle', async ({ page }) => {
  const plan = (exercise_id: string) => ({
    position: 0,
    exercise_id,
    sets: 4,
    reps: 8,
    duration_seconds: null,
    distance_m: null,
    weight_kg: null,
    intensity_kind: 'rir',
    intensity_value: 2,
    rest_seconds: 120,
    exercises: { name: 'Press de banca', kind: 'fuerza', tracks_weight: true, tracks_reps: true, tracks_duration: false, tracks_distance: false },
  });
  const conPlan = { ...FULL_BODY, training_days: [{ ...FULL_BODY.training_days[0], training_day_exercises: [plan('e1')] }] };
  const copia = { ...FULL_BODY, id: '00000000-0000-0000-0000-0000000000a3', name: 'Full body - copia' };
  await conAcciones(page, [EN_CURSO, conPlan, copia]);
  // El detalle pide una sola rutina por id.
  await page.route('**/rest/v1/routines?*', async (ruta) => {
    const id = new URL(ruta.request().url()).searchParams.get('id');
    if (ruta.request().method() !== 'GET' || !id) return ruta.fallback();
    await ruta.fulfill({ json: [EN_CURSO, conPlan, copia].filter((r) => `eq.${r.id}` === id) });
  });
  const guardados: { p_routine_id: string | null; p_name: string; p_activar: boolean; p_dias: { id: string | null; name: string; weekdays: number[]; exercises: unknown[] }[] }[] = [];
  await page.route('**/rest/v1/rpc/guardar_rutina_completa', async (ruta) => {
    guardados.push(ruta.request().postDataJSON());
    await ruta.fulfill({ json: '00000000-0000-0000-0000-0000000000a4' });
  });

  await page.goto('/rutinas');
  await page.getByRole('button', { name: 'Más acciones de Full body', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Duplicar' }).click();
  await expect(page.getByText('Creaste Full body - copia (2)')).toBeVisible();
  expect(guardados[0].p_routine_id).toBeNull();
  expect(guardados[0].p_name).toBe('Full body - copia (2)');
  expect(guardados[0].p_activar).toBe(false);
  expect(guardados[0].p_dias).toEqual([
    {
      id: null,
      name: 'Día A',
      weekdays: [0, 2, 4],
      exercises: [expect.objectContaining({ exercise_id: 'e1', sets: 4, reps: 8, intensity_kind: 'rir', intensity_value: 2, rest_seconds: 120 })],
    },
  ]);
  await page.getByRole('button', { name: 'Editar' }).click();
  await expect(page).toHaveURL(/\/rutinas\/00000000-0000-0000-0000-0000000000a4\/editar$/);

  // Desde el detalle: el menu ⋯ ya no esta desactivado.
  await page.goto(`/rutinas/${EN_CURSO.id}`);
  await page.getByRole('button', { name: 'Más acciones de Push Pull Legs' }).click();
  await page.screenshot({ path: 'capturas/rutina-detalle-menu.png' });
  await page.getByRole('menuitem', { name: 'Duplicar' }).click();
  await expect(page.getByText('Creaste Push Pull Legs - copia')).toBeVisible();
  expect(guardados[1].p_name).toBe('Push Pull Legs - copia');
});

test('duplicar con 5 rutinas abre el aviso del límite', async ({ page }) => {
  const cinco = [EN_CURSO, ...[2, 3, 4, 5].map((n) => ({ ...FULL_BODY, id: `00000000-0000-0000-0000-0000000000b${n}`, name: `Rutina ${n}` }))];
  await conAcciones(page, cinco);
  let guardo = false;
  await page.route('**/rest/v1/rpc/guardar_rutina_completa', async (ruta) => {
    guardo = true;
    await ruta.fulfill({ json: 'x' });
  });
  await page.goto('/rutinas');
  await page.getByRole('button', { name: 'Más acciones de Rutina 2' }).click();
  await page.getByRole('menuitem', { name: 'Duplicar' }).click();
  await expect(page.getByRole('dialog', { name: 'Llegaste a 5 rutinas' })).toBeVisible();
  expect(guardo).toBe(false);
});
