/* Constructor de rutinas (/rutinas/nueva y /rutinas/:id/editar): capturas a
   1440×900 en oscuro y claro, arrastrar del catalogo y desde el agarre,
   reordenar con teclado,
   quitar, configurar, guardar y salir con cambios. */

import { expect, test, type Locator, type Page } from '@playwright/test';

import { conSesion } from './simulacion';

const grupo = (slug: string, name: string, position: number) => ({ is_primary: true, muscle_groups: { slug, name, position } });
const fuerza = { kind: 'fuerza', tracks_weight: true, tracks_reps: true, tracks_duration: false, tracks_distance: false };

const CATALOGO = [
  { id: 'e1', name: 'Press de banca con barra', name_en: 'Barbell bench press', equipment: 'barra', ...fuerza, exercise_muscles: [grupo('pecho', 'Pecho', 0)] },
  { id: 'e2', name: 'Press inclinado con mancuernas', name_en: 'Incline dumbbell press', equipment: 'mancuernas', ...fuerza, exercise_muscles: [grupo('pecho', 'Pecho', 0)] },
  { id: 'e3', name: 'Remo con barra', name_en: 'Barbell row', equipment: 'barra', ...fuerza, exercise_muscles: [grupo('espalda', 'Espalda', 1)] },
  { id: 'e4', name: 'Sentadilla con barra', name_en: 'Back squat', equipment: 'barra', ...fuerza, exercise_muscles: [grupo('cuadriceps', 'Cuádriceps', 4)] },
  { id: 'e5', name: 'Plancha', name_en: 'Plank', equipment: 'peso corporal', kind: 'isometrico', tracks_weight: true, tracks_reps: false, tracks_duration: true, tracks_distance: false, exercise_muscles: [grupo('core', 'Core', 6)] },
  { id: 'e6', name: 'Cinta de correr', name_en: 'Treadmill', equipment: 'cinta', kind: 'cardio', tracks_weight: false, tracks_reps: false, tracks_duration: true, tracks_distance: true, exercise_muscles: [] },
];

const plan = (position: number, e: (typeof CATALOGO)[number], reps = 8) => ({
  position,
  exercise_id: e.id,
  sets: 4,
  reps,
  duration_seconds: null,
  distance_m: null,
  weight_kg: null,
  intensity_kind: 'rir',
  intensity_value: 2,
  rest_seconds: 120,
  exercises: { name: e.name, kind: e.kind, tracks_weight: e.tracks_weight, tracks_reps: e.tracks_reps, tracks_duration: e.tracks_duration, tracks_distance: e.tracks_distance },
});

const RUTINA = {
  id: '00000000-0000-0000-0000-0000000000a1',
  name: 'Push Pull',
  archived_at: null,
  created_at: '2026-09-01T12:00:00Z',
  training_days: [
    { id: '00000000-0000-0000-0000-0000000000d1', name: 'Push', position: 0, training_day_weekdays: [{ weekday: 0 }, { weekday: 3 }], workout_sessions: [{ count: 4 }], training_day_exercises: [plan(0, CATALOGO[0]), plan(1, CATALOGO[1], 10)] },
    { id: '00000000-0000-0000-0000-0000000000d2', name: 'Pull', position: 1, training_day_weekdays: [{ weekday: 1 }], workout_sessions: [{ count: 4 }], training_day_exercises: [plan(0, CATALOGO[2])] },
  ],
};

interface Guardado {
  p_routine_id: string | null;
  p_name: string;
  p_activar: boolean;
  p_dias: { id: string | null; name: string; weekdays: number[]; exercises: Record<string, unknown>[] }[];
}

/** Catalogo, rutinas y la RPC de guardado. Devuelve lo que se mando a guardar. */
async function conDatos(page: Page, { rutinas = [RUTINA], fallaGuardar = false }: { rutinas?: unknown[]; fallaGuardar?: boolean } = {}) {
  await conSesion(page, { tablas: { exercises: CATALOGO, routines: rutinas } });
  const guardados: Guardado[] = [];
  await page.route('**/rest/v1/rpc/guardar_rutina_completa', async (ruta) => {
    guardados.push(ruta.request().postDataJSON());
    if (fallaGuardar) return ruta.fulfill({ status: 500, json: { message: 'Error simulado' } });
    return ruta.fulfill({ json: RUTINA.id });
  });
  return guardados;
}

/** Arrastra con el mouse en pasos, como lo haria una persona. */
async function arrastrar(page: Page, desde: Locator, hasta: Locator, { abajo = false } = {}) {
  const a = (await desde.boundingBox())!;
  const b = (await hasta.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 4 });
  const y = abajo ? b.y + b.height - 6 : b.y + b.height / 2;
  await page.mouse.move(b.x + b.width / 2, y, { steps: 16 });
  await page.mouse.move(b.x + b.width / 2 + 2, y + 2, { steps: 2 });
}

const dia = (page: Page, nombre: string) => page.getByRole('region', { name: nombre, exact: true });
const tarjetas = (zona: Locator) => zona.locator('ol > li:has([aria-roledescription="ejercicio arrastrable"])');
/** Los seis puntos de la derecha: lo unico que arrastra una tarjeta. */
const agarre = (tarjeta: Locator) => tarjeta.getByRole('button', { name: /^Mover / });

for (const [tema, nombre] of [
  ['dark', 'oscuro'],
  ['light', 'claro'],
] as const) {
  test(`rutina nueva en ${nombre}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conDatos(page, { rutinas: [] });
    await page.goto('/rutinas/nueva');
    await expect(page.getByRole('textbox', { name: 'Nombre de la rutina' })).toBeFocused();
    await expect(page.getByText('Rutina nueva · sin guardar')).toBeVisible();
    await expect(page.getByText('Catálogo · 6 ejercicios')).toBeVisible();
    await expect(page.getByText('Cómo se arma')).toBeVisible();
    await page.screenshot({ path: `capturas/constructor-nueva-${nombre}.png` });
  });

  test(`editando en ${nombre}, con el modal de configurar abierto`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await conDatos(page);
    await page.goto(`/rutinas/${RUTINA.id}/editar`);
    await expect(tarjetas(dia(page, 'Push'))).toHaveCount(2);
    // Al hover la tarjeta se vela y queda solo Editar.
    const primera = tarjetas(dia(page, 'Push')).first();
    await expect(primera.getByText('Editar')).toHaveCSS('opacity', '0');
    await primera.hover();
    await expect(primera.getByText('Editar')).toHaveCSS('opacity', '1');
    await expect(primera.getByRole('button', { name: /^Editar / })).toHaveCSS('cursor', 'pointer');
    // Sobre el agarre no hay velo: el cursor es el de arrastrar.
    await agarre(primera).hover();
    await expect(primera.getByText('Editar')).toHaveCSS('opacity', '0');
    await expect(agarre(primera)).toHaveCSS('cursor', 'grab');
    await primera.hover();
    await page.screenshot({ path: `capturas/constructor-hover-${nombre}.png` });
    await primera.click();
    const modal = page.getByRole('dialog', { name: 'Press de banca con barra' });
    await expect(modal).toBeVisible();
    // Sin la nota de fuerza ni los atajos; el foco arranca en el primer campo.
    await expect(modal.getByText('Sin peso en el plan')).toHaveCount(0);
    await expect(modal.getByText('cambian el valor')).toHaveCount(0);
    await expect(modal.getByRole('spinbutton', { name: 'Series' })).toBeFocused();
    // Solo Guardar a la izquierda y Quitar ejercicio a la derecha; sin Siguiente.
    await expect(modal.getByRole('button', { name: 'Siguiente' })).toHaveCount(0);
    const guardar = (await modal.getByRole('button', { name: 'Guardar', exact: true }).boundingBox())!;
    const quitar = (await modal.getByRole('button', { name: 'Quitar ejercicio' }).boundingBox())!;
    expect(guardar.x).toBeLessThan(quitar.x);
    await page.screenshot({ path: `capturas/constructor-editar-${nombre}.png` });
  });
}

test('nueva: del catalogo a un dia, configurar y guardar en curso', async ({ page }) => {
  const guardados = await conDatos(page, { rutinas: [] });
  await page.goto('/rutinas/nueva');
  const guardar = page.getByRole('button', { name: 'Guardar', exact: true });
  await expect(guardar).toHaveAttribute('aria-disabled', 'true');

  await page.getByRole('textbox', { name: 'Nombre de la rutina' }).fill('Fuerza 3 días');
  const dia1 = dia(page, 'Día 1');
  await arrastrar(page, page.getByText('Sentadilla con barra'), dia1);
  await expect(dia1.getByText('Agregar a Día 1 · 1º')).toHaveCount(0);
  await expect(page.getByText('Agregar a Día 1 · 1º')).toBeVisible();
  await page.screenshot({ path: 'capturas/constructor-arrastrando.png' });
  await page.mouse.up();
  await expect(tarjetas(dia1)).toHaveCount(1);
  await expect(page.getByText('Sentadilla con barra agregado a Día 1')).toBeVisible();
  // Al soltarlo se abre su configuracion, con el foco en el primer campo.
  const sentadilla = page.getByRole('dialog', { name: 'Sentadilla con barra' });
  await expect(sentadilla.getByRole('spinbutton', { name: 'Series' })).toBeFocused();
  await page.screenshot({ path: 'capturas/constructor-agregado.png' });
  await sentadilla.getByRole('spinbutton', { name: 'Repeticiones' }).fill('5');
  await sentadilla.getByRole('spinbutton', { name: 'Repeticiones' }).press('Enter');
  await sentadilla.getByRole('spinbutton', { name: 'Series' }).press('ArrowUp');
  await sentadilla.getByText('Al fallo').click();
  // Hasta Guardar, la tarjeta no cambia.
  await expect(tarjetas(dia1).first()).not.toContainText('4×5');
  await sentadilla.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect(sentadilla).toHaveCount(0);
  await expect(tarjetas(dia1).first()).toContainText('4×5');
  await expect(tarjetas(dia1).first()).toContainText('Al fallo');
  // El catalogo no pierde el ejercicio: es una copia.
  await expect(page.getByLabel('Catálogo de ejercicios').getByText('Sentadilla con barra')).toBeVisible();

  // Con + va al dia elegido y tambien abre su configuracion.
  await page.getByLabel('Catálogo de ejercicios').getByText('Plancha').hover();
  await page.getByRole('button', { name: 'Agregar Plancha a Día 1' }).click();
  await expect(tarjetas(dia1)).toHaveCount(2);
  const plancha = page.getByRole('dialog', { name: 'Plancha' });
  await expect(plancha).toBeVisible();
  // Esc cierra sin aplicar: la plancha queda con sus 3 series por defecto.
  await plancha.getByRole('spinbutton', { name: 'Series' }).press('ArrowUp');
  await page.keyboard.press('Escape');
  await expect(plancha).toHaveCount(0);

  await page.getByRole('button', { name: 'martes', exact: true }).click();
  await expect(page.getByText(/Cambios sin guardar · \d/)).toBeVisible();
  await page.keyboard.press('Control+s');
  await expect.poll(() => guardados.length).toBe(1);
  expect(guardados[0]).toEqual({
    p_routine_id: null,
    p_name: 'Fuerza 3 días',
    p_activar: true,
    p_dias: [
      {
        id: null,
        name: 'Día 1',
        weekdays: [1],
        exercises: [
          { exercise_id: 'e4', sets: 4, reps: 5, duration_seconds: null, distance_m: null, weight_kg: null, intensity_kind: 'rir', intensity_value: -1, rest_seconds: 120 },
          { exercise_id: 'e5', sets: 3, reps: null, duration_seconds: 30, distance_m: null, weight_kg: null, intensity_kind: null, intensity_value: null, rest_seconds: 60 },
        ],
      },
    ],
  });
  await expect(page).toHaveURL(new RegExp(`/rutinas/${RUTINA.id}/editar$`));
  await expect(page.getByText('Rutina guardada')).toBeVisible();
});

test('nueva con una rutina en curso: pregunta si la reemplaza', async ({ page }) => {
  const guardados = await conDatos(page);
  await page.goto('/rutinas/nueva');
  await page.getByRole('textbox', { name: 'Nombre de la rutina' }).fill('Otra');
  await page.getByLabel('Catálogo de ejercicios').getByText('Remo con barra').hover();
  await page.getByRole('button', { name: 'Agregar Remo con barra a Día 1' }).click();
  await page.getByRole('dialog', { name: 'Remo con barra' }).getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  const modal = page.getByRole('dialog', { name: '¿La ponés en curso?' });
  await expect(modal.getByRole('button', { name: 'Ponerla en curso' })).toBeFocused();
  await page.screenshot({ path: 'capturas/constructor-activar.png' });
  await modal.getByRole('button', { name: 'Guardarla sin activar' }).click();
  await expect.poll(() => guardados.length).toBe(1);
  expect(guardados[0].p_activar).toBe(false);
});

test('editar: mover entre dias, reordenar con teclado, quitar y deshacer', async ({ page }) => {
  const guardados = await conDatos(page);
  await page.goto(`/rutinas/${RUTINA.id}/editar`);
  const push = dia(page, 'Push');
  const pull = dia(page, 'Pull');
  await expect(tarjetas(push)).toHaveCount(2);
  await expect(page.getByText('Guardado', { exact: true })).toBeVisible();

  // Del Push al Pull, abajo del remo.
  await arrastrar(page, agarre(tarjetas(push).nth(1)), pull.getByRole('button', { name: 'Agregar ejercicio' }));
  await expect(page.getByText('Mover a Pull · 2º')).toBeVisible();
  await page.screenshot({ path: 'capturas/constructor-entre-dias.png' });
  await page.mouse.up();
  await expect(tarjetas(push)).toHaveCount(1);
  await expect(tarjetas(pull)).toHaveText([/Remo con barra/, /Press inclinado/]);

  // Con teclado: Espacio levanta, flecha arriba, Espacio suelta.
  await agarre(tarjetas(pull).nth(1)).focus();
  await page.keyboard.press('Space');
  await expect(page.getByText('levantado · 2 de 2 en Pull')).toBeVisible();
  // Entre tecla y tecla una persona tarda mas que esto; sin pausa, con la
  // maquina cargada, la flecha puede llegar antes de que el sensor de dnd-kit
  // escuche, y Espacio antes de que procese la flecha.
  await page.waitForTimeout(150);
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(150);
  await page.keyboard.press('Space');
  await expect(tarjetas(pull)).toHaveText([/Press inclinado/, /Remo con barra/]);

  // Al catalogo para quitar, con Deshacer en el aviso.
  await arrastrar(page, agarre(tarjetas(pull).first()), page.getByRole('searchbox', { name: 'Buscar ejercicio' }));
  await expect(page.getByText('Soltá para quitar de Pull')).toBeVisible();
  await page.screenshot({ path: 'capturas/constructor-quitar.png' });
  await page.mouse.up();
  await expect(tarjetas(pull)).toHaveCount(1);
  await page.getByRole('button', { name: 'Deshacer' }).click();
  await expect(tarjetas(pull)).toHaveCount(2);

  // Fuera de los dias no se suelta: vuelve a su lugar.
  await arrastrar(page, agarre(tarjetas(push).first()), page.getByRole('button', { name: 'Agregar día' }), { abajo: true });
  await page.mouse.move(1400, 880, { steps: 6 });
  await expect(page.getByText('Soltá dentro de un día')).toBeVisible();
  await page.mouse.up();
  await expect(tarjetas(push)).toHaveCount(1);

  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect.poll(() => guardados.length).toBe(1);
  const [dPush, dPull] = guardados[0].p_dias;
  expect(guardados[0].p_routine_id).toBe(RUTINA.id);
  expect(dPush.id).toBe(RUTINA.training_days[0].id);
  expect(dPush.weekdays).toEqual([0, 3]);
  expect(dPush.exercises.map((e) => e.exercise_id)).toEqual(['e1']);
  expect(dPull.exercises.map((e) => e.exercise_id)).toEqual(['e2', 'e3']);
});

test('dias: agregar, renombrar y eliminar con deshacer', async ({ page }) => {
  await conDatos(page);
  await page.goto(`/rutinas/${RUTINA.id}/editar`);
  await page.getByRole('button', { name: 'Agregar día' }).click();
  const nuevo = dia(page, 'Día 3');
  await expect(nuevo.getByText('Arrastrá ejercicios del catálogo o tocá + en uno')).toBeVisible();
  await nuevo.getByRole('textbox', { name: 'Nombre del día' }).fill('Legs');
  await dia(page, 'Legs').getByRole('button', { name: 'Acciones de Legs' }).click();
  await page.getByRole('menuitem', { name: 'Eliminar día' }).click();
  await expect(dia(page, 'Legs')).toHaveCount(0);
  await page.getByRole('button', { name: 'Deshacer' }).click();
  await expect(dia(page, 'Legs')).toHaveCount(1);
});

test('buscar con / y filtrar por tipo', async ({ page }) => {
  await conDatos(page);
  await page.goto(`/rutinas/${RUTINA.id}/editar`);
  await expect(page.getByText('Catálogo · 6 ejercicios')).toBeVisible();
  await page.keyboard.press('/');
  await expect(page.getByRole('searchbox', { name: 'Buscar ejercicio' })).toBeFocused();
  await page.keyboard.type('press');
  await expect(page.getByText('Catálogo · 2 de 6 ejercicios')).toBeVisible();
  await page.getByRole('button', { name: 'Borrar búsqueda' }).click();
  await page.getByRole('button', { name: 'Cardio', exact: true }).click();
  await expect(page.getByText('Catálogo · 1 de 6 ejercicios')).toBeVisible();
});

test('salir con cambios pide confirmar; el borrador sobrevive a recargar', async ({ page }) => {
  await conDatos(page);
  await page.goto(`/rutinas/${RUTINA.id}/editar`);
  await page.getByRole('textbox', { name: 'Nombre de la rutina' }).fill('Push Pull 2');
  await expect(page.getByText('Cambios sin guardar · 1')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Nombre de la rutina' })).toHaveValue('Push Pull 2');
  await expect(page.getByText('Recuperamos los cambios que no habías guardado.')).toBeVisible();

  await page.getByRole('button', { name: 'Volver a la rutina' }).click();
  const modal = page.getByRole('dialog', { name: 'Tenés cambios sin guardar' });
  await expect(modal.getByRole('button', { name: 'Guardar y salir' })).toBeFocused();
  // Guardar y salir a la izquierda, Descartar en el medio y Seguir editando a
  // la derecha del todo.
  const xs = await Promise.all(['Guardar y salir', 'Descartar', 'Seguir editando'].map(async (n) => (await modal.getByRole('button', { name: n }).boundingBox())!.x));
  expect(xs).toEqual([...xs].sort((a, b) => a - b));
  // Los tres botones del pie entran en el modal, sin salirse por la izquierda.
  const caja = (await modal.boundingBox())!;
  for (const boton of await modal.getByRole('button').all()) {
    const b = (await boton.boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(caja.x);
    expect(b.x + b.width).toBeLessThanOrEqual(caja.x + caja.width);
  }
  await page.screenshot({ path: 'capturas/constructor-salir.png' });
  await modal.getByRole('button', { name: 'Seguir editando' }).click();
  await expect(page).toHaveURL(/editar$/);
  await page.getByRole('button', { name: 'Volver a la rutina' }).click();
  await modal.getByRole('button', { name: 'Descartar' }).click();
  await expect(page).toHaveURL(new RegExp(`/rutinas/${RUTINA.id}$`));
  expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('frencia:borrador')))).toEqual([]);
});

test('error al guardar: los cambios quedan y se puede reintentar', async ({ page }) => {
  const guardados = await conDatos(page, { fallaGuardar: true });
  await page.goto(`/rutinas/${RUTINA.id}/editar`);
  await page.getByRole('textbox', { name: 'Nombre de la rutina' }).fill('Push Pull 2');
  await page.keyboard.press('Control+s');
  await expect(page.getByText('No se guardó')).toBeVisible();
  await expect(page.getByText('No pudimos guardar. Tus cambios siguen acá.')).toBeVisible();
  await page.screenshot({ path: 'capturas/constructor-error.png' });
  await page.getByRole('button', { name: 'Reintentar' }).click();
  await expect.poll(() => guardados.length).toBe(2);
});

test('nueva rutina desde la navegacion y desde Rutinas', async ({ page }) => {
  await conDatos(page);
  await page.goto('/rutinas');
  await page.getByRole('main').getByRole('button', { name: 'Nueva rutina' }).click();
  await expect(page).toHaveURL(/rutinas\/nueva$/);
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await page.keyboard.press('n');
  await expect(page).toHaveURL(/rutinas\/nueva$/);
  await page.goto(`/rutinas/${RUTINA.id}`);
  await page.getByRole('button', { name: 'Editar rutina' }).click();
  await expect(page).toHaveURL(/editar$/);
});
