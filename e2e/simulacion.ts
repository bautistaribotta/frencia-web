/* Sesion y Supabase simulados para Playwright: ninguna prueba toca la base
   real. La sesion se deja en localStorage antes de que cargue la app y cada
   pedido a Supabase se responde aca. */

import type { Page } from '@playwright/test';

import type { Tables } from '../src/lib/database.types';

/** Las columnas de profiles que lee la app (src/lib/perfil.ts). */
type Perfil = Partial<Tables<'profiles'>>;

// supabase-js guarda la sesion en sb-<id del proyecto>-auth-token.
const CLAVE_SESION = 'sb-dcxtqxdfkbqphuoyibyt-auth-token';

export const USUARIO = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'bauti@correo.com',
};

export const PERFIL: Perfil = {
  name: 'Bautista',
  surname: 'Ribotta',
  avatar_path: null,
  avatar_seed: null,
  sexo: 'masculino',
  fecha_nacimiento: '2001-03-14',
  altura: 178,
  peso: 72.5,
  medidor_esfuerzo: 'rir',
  unidad_peso: 'kg',
  unidad_altura: 'cm',
  unidad_distancia: 'km',
  tema: 'sistema',
  created_at: '2026-06-10T12:00:00Z',
};

/** Entra con una sesion falsa y responde los pedidos a Supabase: el perfil
 *  con `perfil` (tras `demoraPerfil` ms), cada tabla de `tablas` con lo que
 *  traiga y cualquier otra, vacia. */
export async function conSesion(
  page: Page,
  { perfil = PERFIL, demoraPerfil = 0, tablas = {} }: { perfil?: Perfil; demoraPerfil?: number; tablas?: Record<string, unknown> } = {},
) {
  await page.addInitScript(
    ([clave, usuario]) => {
      const ahora = Math.floor(Date.now() / 1000);
      window.localStorage.setItem(
        clave,
        JSON.stringify({
          access_token: 'falso',
          refresh_token: 'falso',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: ahora + 36000,
          user: { ...usuario, aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-06-10T12:00:00Z' },
        }),
      );
    },
    [CLAVE_SESION, USUARIO] as const,
  );

  await page.route('**/rest/v1/**', async (ruta) => {
    if (ruta.request().url().includes('/rest/v1/profiles')) {
      if (demoraPerfil) await new Promise((listo) => setTimeout(listo, demoraPerfil));
      return ruta.fulfill({ json: perfil });
    }
    const tabla = new URL(ruta.request().url()).pathname.split('/').pop() ?? '';
    return ruta.fulfill({ json: tablas[tabla] ?? [] });
  });
  // Ni auth ni storage salen a la red.
  await page.route('**/auth/v1/**', (ruta) => ruta.fulfill({ json: {} }));
  await page.route('**/storage/v1/**', (ruta) => ruta.fulfill({ status: 404, json: {} }));
}
