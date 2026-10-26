/* Correr con `npm test` (Vitest). */

import { assert, test, vi } from 'vitest';

import {
  agruparPorMes,
  cargarPaginaHistorial,
  HISTORIAL_PAGINA,
  inicioPrimeraPagina,
  PRIMERA_PAGINA_MAX,
  tonelajeKg,
  type SesionTerminada,
} from './historial';
import { supabase } from './supabase';

// Sin cliente real, que pide el .env.local: cada prueba que consulta arma
// sus respuestas con `responder`.
vi.mock('./supabase', () => ({ supabase: { from: vi.fn() } }));

/** Cliente falso: cada consulta encadenable resuelve con la proxima respuesta
 *  y guarda los filtros que recibio. */
function responder(...respuestas: unknown[][]) {
  const consultas: { gte?: unknown[]; lte?: unknown[]; or?: unknown[]; limit?: unknown[] }[] = [];
  vi.mocked(supabase.from).mockImplementation((() => {
    const registro: (typeof consultas)[number] = {};
    consultas.push(registro);
    const datos = respuestas[consultas.length - 1] ?? [];
    const consulta: Record<string, unknown> = {
      then: (resolver: (r: unknown) => unknown) => resolver({ data: datos, error: null }),
    };
    for (const metodo of ['select', 'eq', 'not', 'order', 'abortSignal']) consulta[metodo] = () => consulta;
    for (const metodo of ['gte', 'lte', 'or', 'limit'] as const)
      consulta[metodo] = (...args: unknown[]) => {
        registro[metodo] = args;
        return consulta;
      };
    return consulta;
  }) as never);
  return consultas;
}

const fila = (id: string, finished: string) => ({
  id,
  started_at: finished,
  finished_at: finished,
  training_days: { name: 'Push', routines: { name: 'PPL' } },
  session_sets: [{ count: 12 }],
});

function sesion(id: string, fecha: string): SesionTerminada {
  const ms = new Date(fecha).getTime();
  return { id, dayName: 'Push', rutina: 'PPL', startedAt: ms - 3600000, finishedAt: ms, series: 15 };
}

test('el tonelaje suma peso por reps y deja afuera lo que no tiene las dos cosas', () => {
  assert.strictEqual(tonelajeKg([{ weight_kg: 80, reps: 8 }, { weight_kg: '82.5', reps: 8 }, { weight_kg: null, reps: 10 }]), 1300);
});

test('sin ninguna serie con peso y reps el tonelaje es null, no 0', () => {
  assert.strictEqual(tonelajeKg([{ weight_kg: null, reps: null }]), null);
  assert.strictEqual(tonelajeKg([]), null);
  assert.strictEqual(tonelajeKg([{ weight_kg: 0, reps: 10 }]), 0);
});

test('agrupa por mes local y marca incompleto el ultimo si sigue en la proxima pagina', () => {
  const meses = agruparPorMes(
    [sesion('a', '2026-10-22T10:00:00'), sesion('b', '2026-10-01T10:00:00'), sesion('c', '2026-09-29T10:00:00')],
    new Date('2026-09-28T10:00:00').getTime(),
  );
  assert.strictEqual(meses.length, 2);
  assert.strictEqual(meses[0].sesiones.length, 2);
  assert.strictEqual(meses[0].completo, true);
  assert.strictEqual(meses[1].completo, false);
});

test('la primera pagina arranca tres meses atras', () => {
  assert.match(inicioPrimeraPagina(new Date('2026-10-25T12:00:00')), /^2026-07-25T/);
});

const AHORA = new Date('2026-10-25T12:00:00Z');

test('la primera pagina trae los ultimos tres meses y deja seguir con lo anterior', async () => {
  const consultas = responder([fila('a', '2026-10-20T10:00:00+00:00'), fila('b', '2026-09-01T10:00:00+00:00')]);
  const pagina = await cargarPaginaHistorial('u', null, undefined, AHORA);
  const desde = inicioPrimeraPagina(AHORA);
  assert.deepEqual(consultas[0].gte, ['finished_at', desde]);
  assert.deepEqual(consultas[0].limit, [PRIMERA_PAGINA_MAX + 1]);
  assert.strictEqual(pagina.sesiones.length, 2);
  assert.strictEqual(pagina.sesiones[0].series, 12);
  // Lo que sigue es estrictamente anterior al corte.
  assert.deepEqual(pagina.siguiente, { id: '00000000-0000-0000-0000-000000000000', finishedAt: desde });
  assert.strictEqual(pagina.proximaFecha, Date.parse(desde));
});

test('sin sesiones en tres meses, la primera pagina sigue con las anteriores', async () => {
  const consultas = responder([], [fila('z', '2026-01-10T10:00:00+00:00')]);
  const pagina = await cargarPaginaHistorial('u', null, undefined, AHORA);
  assert.strictEqual(consultas.length, 2);
  assert.deepEqual(consultas[1].lte, ['finished_at', inicioPrimeraPagina(AHORA)]);
  assert.deepEqual(consultas[1].limit, [HISTORIAL_PAGINA + 1]);
  assert.deepEqual(pagina.sesiones.map((s) => s.id), ['z']);
  assert.strictEqual(pagina.siguiente, null);
});

test('las paginas siguientes van de a HISTORIAL_PAGINA y avisan si quedan mas', async () => {
  const filas = Array.from({ length: HISTORIAL_PAGINA + 1 }, (_, i) => fila(`s${i}`, `2026-05-${String(28 - i).padStart(2, '0')}T10:00:00+00:00`));
  responder(filas);
  const pagina = await cargarPaginaHistorial('u', { id: '11111111-1111-1111-1111-111111111111', finishedAt: '2026-06-01T10:00:00+00:00' });
  assert.strictEqual(pagina.sesiones.length, HISTORIAL_PAGINA);
  assert.strictEqual(pagina.siguiente?.id, `s${HISTORIAL_PAGINA - 1}`);
});
