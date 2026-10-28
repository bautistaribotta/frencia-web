/* Memoria de la navegacion para los botones de volver: de cada entrada del
   historial (location.key de React Router) se guarda su ruta y la entrada
   desde la que se llego. Asi Volver lleva a la pantalla de la que se vino
   (Inicio, Rutinas, la sesion) y no a un padre fijo, y su texto dice a donde.
   Se guarda en sessionStorage para que sobreviva a recargar la pestaña.
   MemoriaNavegacion (marco/Volver.tsx) anota cada pantalla. */

import { useLocation, useNavigate } from 'react-router';

export type Accion = 'PUSH' | 'REPLACE' | 'POP';

interface Entrada {
  ruta: string;
  anterior: string | null;
}

export interface Destino {
  /** Para las migas: "Inicio", "Rutina". */
  corta: string;
  /** Para un boton o un tooltip: "Volver a Inicio", "Volver a la rutina". */
  larga: string;
}

const CLAVE = 'frencia:volver';
// Lo que se recuerda; con eso alcanza para cualquier recorrido real.
const MAXIMO = 100;

const entradas = new Map<string, Entrada>(leer());
const actual = { key: null as string | null };

function leer(): [string, Entrada][] {
  try {
    const crudo = sessionStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as [string, Entrada][]) : [];
  } catch {
    return [];
  }
}

function guardar() {
  while (entradas.size > MAXIMO) entradas.delete(entradas.keys().next().value!);
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify([...entradas]));
  } catch {
    // Sin almacenamiento se recuerda solo mientras la pestaña siga abierta.
  }
}

/** Anota la entrada a la que se acaba de llegar. Se puede llamar mas de una
 *  vez con la misma (el doble render de React): solo cuenta la primera. */
export function registrar(key: string, accion: Accion, ruta: string) {
  if (key !== actual.key && !entradas.has(key)) {
    if (accion === 'PUSH' && actual.key) entradas.set(key, { ruta, anterior: actual.key });
    // Reemplazar no suma un paso: hereda de donde se habia llegado.
    else if (accion === 'REPLACE' && actual.key) entradas.set(key, { ruta, anterior: entradas.get(actual.key)?.anterior ?? null });
    else entradas.set(key, { ruta, anterior: null });
    guardar();
  }
  actual.key = key;
}

/** La ruta de la pantalla desde la que se llego a esta entrada, si se sabe. */
export function rutaAnterior(key: string): string | null {
  const anterior = entradas.get(key)?.anterior;
  return anterior ? (entradas.get(anterior)?.ruta ?? null) : null;
}

/** A donde lleva volver a esta ruta, o null si no es una pantalla a la que
 *  se vuelve (el constructor, el acceso, las fases de la cuenta). */
export function destinoDe(ruta: string): Destino | null {
  const camino = ruta.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  if (camino === '/') return { corta: 'Inicio', larga: 'Volver a Inicio' };
  if (camino === '/rutinas') return { corta: 'Rutinas', larga: 'Volver a Rutinas' };
  if (/^\/rutinas\/(?!nueva$)[^/]+$/.test(camino)) return { corta: 'Rutina', larga: 'Volver a la rutina' };
  if (camino === '/historial') return { corta: 'Historial', larga: 'Volver a Historial' };
  if (/^\/historial\/[^/]+$/.test(camino)) return { corta: 'Sesión', larga: 'Volver a la sesión' };
  if (/^\/historial\/[^/]+\/ticket$/.test(camino)) return { corta: 'Ticket', larga: 'Volver al ticket' };
  if (camino === '/perfil') return { corta: 'Perfil', larga: 'Volver a Perfil' };
  if (camino === '/perfil/editar') return { corta: 'Editar perfil', larga: 'Volver a Editar perfil' };
  if (camino === '/configuracion') return { corta: 'Configuración', larga: 'Volver a Configuración' };
  return null;
}

/** El destino de un boton de volver: la pantalla de la que se vino, con su
 *  nombre, o el respaldo si se entro directo por la URL o se vino de una
 *  pantalla a la que no se vuelve (el constructor, el login).
 *  @param respaldo la ruta a la que volver si no se sabe de donde se vino. */
export function useVolver(respaldo: string): Destino & { volver: () => void } {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const anterior = rutaAnterior(ubicacion.key);
  const destino = anterior ? destinoDe(anterior) : null;
  // Con memoria se va un paso atras en el historial, igual que el navegador.
  if (destino) return { ...destino, volver: () => void navegar(-1) };
  return { ...(destinoDe(respaldo) ?? { corta: 'Volver', larga: 'Volver' }), volver: () => void navegar(respaldo) };
}
