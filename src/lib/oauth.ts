/* Ingreso con Apple y Google (OAuth con PKCE). El navegador sale de la web
   hacia el proveedor y vuelve a la misma pantalla con ?code=, que supabase-js
   canjea solo (detectSessionInUrl). Lo que hay que recordar del otro lado del
   viaje (con que proveedor se fue y a donde se queria ir) va en
   sessionStorage, porque el state del router se pierde al salir. */

import { supabase } from './supabase';

export type Proveedor = 'google' | 'apple';

export const NOMBRE_PROVEEDOR: Record<Proveedor, string> = { google: 'Google', apple: 'Apple' };

/** Los que se ofrecen en el acceso, en orden. Apple vuelve cuando haya
 *  cuenta de Apple Developer y este habilitado en Supabase. */
export const PROVEEDORES_ACTIVOS: Proveedor[] = ['google'];

const CLAVE = 'frencia.oauth';

interface Intento {
  proveedor: Proveedor;
  desde?: string;
}

export function leerIntento(): Intento | null {
  try {
    const crudo = sessionStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Intento) : null;
  } catch {
    return null;
  }
}

export function borrarIntento() {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    // Sin storage no hay nada que borrar.
  }
}

/** Sale hacia el proveedor. Si devuelve un error, el navegador no se fue. */
export async function entrarCon(proveedor: Proveedor, desde?: string) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify({ proveedor, desde } satisfies Intento));
  } catch {
    // Sin storage se entra igual; solo se pierde a donde se queria ir.
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: proveedor,
    // Vuelve a la misma pantalla (login o signup): si algo falla, el aviso
    // aparece donde se toco el boton.
    options: { redirectTo: window.location.origin + window.location.pathname },
  });
  if (error) borrarIntento();
  return { error };
}

/** El error con el que volvio el proveedor, si volvio con uno. Supabase lo
 *  manda en la query o en el fragmento. */
export function errorDeVuelta(url: string): { cancelado: boolean } | null {
  const { search, hash } = new URL(url);
  const params = new URLSearchParams(search);
  new URLSearchParams(hash.slice(1)).forEach((valor, clave) => params.set(clave, valor));
  const error = params.get('error');
  if (!error) return null;
  const descripcion = params.get('error_description') ?? '';
  return { cancelado: error === 'access_denied' || /cancel/i.test(descripcion) };
}
