import { describe, expect, it, vi } from 'vitest';

import { armarActividad, diaQueToca, type SesionHecha } from './actividad';
import type { DiaResumen } from './inicio';

// Lo que se prueba es puro: el cliente real pide las variables del .env.local,
// que en CI no estan.
vi.mock('./supabase', () => ({ supabase: { from: vi.fn() } }));

const sesion = (fecha: string, diaId: string | null = 'd1', series = 15): SesionHecha => ({ fecha, diaId, diaNombre: 'Push', series });
// Jueves 29 de octubre de 2026.
const JUEVES = new Date(2026, 9, 29);

describe('armarActividad', () => {
  it('arma columnas de lunes a domingo que terminan en la semana de hoy', () => {
    const a = armarActividad([], JUEVES, 5);
    expect(a.semanas).toHaveLength(5);
    expect(a.semanas.every((s) => s.length === 7)).toBe(true);
    // Primera columna: lunes 28 de septiembre; ultima: lunes 26 de octubre.
    expect(a.semanas[0][0].fecha).toEqual(new Date(2026, 8, 28));
    expect(a.semanas[4][0].fecha).toEqual(new Date(2026, 9, 26));
  });

  it('marca hoy y deja como futuros los dias que no llegaron', () => {
    const ultima = armarActividad([], JUEVES, 5).semanas[4];
    expect(ultima.map((c) => c.hoy)).toEqual([false, false, false, true, false, false, false]);
    expect(ultima.map((c) => c.futuro)).toEqual([false, false, false, false, true, true, true]);
  });

  it('agrupa las sesiones por dia y cuenta solo las que se ven', () => {
    const a = armarActividad([sesion('2026-10-29'), sesion('2026-10-29', 'd2'), sesion('2026-10-26'), sesion('2026-01-05')], JUEVES, 5);
    expect(a.semanas[4][3].sesiones).toHaveLength(2);
    expect(a.semanas[4][0].sesiones).toHaveLength(1);
    expect(a.total).toBe(3);
  });

  it('pone cada mes donde empieza, sin pisar el primero', () => {
    const a = armarActividad([], JUEVES, 53);
    // Octubre empieza en la columna del lunes 5.
    expect(a.meses.at(-1)).toEqual({ columna: 49, mes: 9 });
    const columnas = a.meses.map((m) => m.columna);
    expect(columnas.every((c, i) => i === 0 || c - columnas[i - 1] >= 3)).toBe(true);
  });
});

const dia = (id: string, weekdays: number[]): DiaResumen => ({ id, name: id, weekdays, ejercicios: 5 });
// Lunes, miercoles y viernes.
const LXV = [dia('torso', [0]), dia('piernas', [2]), dia('full', [4])];

describe('diaQueToca', () => {
  it('un jueves sin entrenamiento marca el viernes', () => {
    expect(diaQueToca(LXV, [], JUEVES)).toEqual({ id: 'full', cuando: 'proximo', weekday: 4 });
  });

  it('un viernes sin sesion marca hoy; con sesion, el lunes', () => {
    const viernes = new Date(2026, 9, 30);
    expect(diaQueToca(LXV, [], viernes)).toEqual({ id: 'full', cuando: 'hoy' });
    expect(diaQueToca(LXV, [sesion('2026-10-30', 'full')], viernes)).toEqual({ id: 'torso', cuando: 'proximo', weekday: 0 });
  });

  it('si dos dias caen el mismo dia de la semana, gana el primero', () => {
    expect(diaQueToca([dia('a', [4]), dia('b', [4])], [], JUEVES)).toEqual({ id: 'a', cuando: 'proximo', weekday: 4 });
  });

  it('sin dias de la semana, el que sigue al ultimo entrenado', () => {
    const sinCalendario = [dia('push', []), dia('pull', []), dia('legs', [])];
    expect(diaQueToca(sinCalendario, [], JUEVES)).toEqual({ id: 'push', cuando: 'proximo', weekday: null });
    expect(diaQueToca(sinCalendario, [sesion('2026-10-28', 'pull'), sesion('2026-10-27', 'push')], JUEVES)).toEqual({
      id: 'legs',
      cuando: 'proximo',
      weekday: null,
    });
    expect(diaQueToca(sinCalendario, [sesion('2026-10-28', 'legs')], JUEVES)).toEqual({ id: 'push', cuando: 'proximo', weekday: null });
  });
});
