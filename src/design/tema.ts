/* ============================================================
   Frencia · Tema activo
   El tema se pinta con el atributo data-theme de <html> (los tokens
   leen dark o light; sin atributo siguen al sistema). La eleccion del
   switch se guarda en este navegador. Cuando haya sesion, la
   preferencia de la cuenta (profiles.tema) va a mandar sobre esto.
   ============================================================ */

import { useCallback, useSyncExternalStore } from 'react';

export type ModoTema = 'dark' | 'light';

const CLAVE = 'frencia:tema';
const consultaClaro = () => window.matchMedia('(prefers-color-scheme: light)');

function leerGuardado(): ModoTema | null {
  try {
    const valor = window.localStorage.getItem(CLAVE);
    return valor === 'dark' || valor === 'light' ? valor : null;
  } catch {
    return null;
  }
}

/** Lo que se esta pintando: el tema forzado o, si no hay, el del sistema. */
function modoEfectivo(): ModoTema {
  const forzado = document.documentElement.dataset.theme;
  if (forzado === 'dark' || forzado === 'light') return forzado;
  return consultaClaro().matches ? 'light' : 'dark';
}

/** Aplica el tema guardado antes del primer render, para que no parpadee. */
export function aplicarTemaGuardado() {
  const guardado = leerGuardado();
  if (guardado) document.documentElement.dataset.theme = guardado;
}

const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((oyente) => oyente());

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  const sistema = consultaClaro();
  sistema.addEventListener('change', oyente);
  return () => {
    oyentes.delete(oyente);
    sistema.removeEventListener('change', oyente);
  };
}

export function useTema(): [ModoTema, (modo: ModoTema) => void] {
  const modo = useSyncExternalStore(suscribir, modoEfectivo);
  const elegir = useCallback((nuevo: ModoTema) => {
    document.documentElement.dataset.theme = nuevo;
    try {
      window.localStorage.setItem(CLAVE, nuevo);
    } catch {
      // Sin almacenamiento (navegacion privada): el tema vale hasta recargar.
    }
    avisar();
  }, []);
  return [modo, elegir];
}
