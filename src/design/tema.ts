/* ============================================================
   Frencia · Tema activo
   El tema se pinta con el atributo data-theme de <html>: dark o light
   lo fuerzan; system (o sin atributo) sigue al sistema. La eleccion
   se guarda en este navegador para pintar bien desde la primera carga.
   Con sesion manda la preferencia de la cuenta (profiles.tema, que
   guarda 'sistema' | 'oscuro' | 'claro'): el marco la aplica al
   leer el perfil y Configuracion la cambia.
   ============================================================ */

import { useCallback, useSyncExternalStore } from 'react';

export type ModoTema = 'dark' | 'light';
export type PreferenciaTema = 'system' | ModoTema;

const CLAVE = 'frencia:tema';
const consultaClaro = () => window.matchMedia('(prefers-color-scheme: light)');

const DE_PERFIL: Record<string, PreferenciaTema> = { sistema: 'system', oscuro: 'dark', claro: 'light' };
const A_PERFIL: Record<PreferenciaTema, string> = { system: 'sistema', dark: 'oscuro', light: 'claro' };

/** profiles.tema a la preferencia de la web. Un valor desconocido sigue al sistema. */
export function preferenciaDePerfil(tema: string | null | undefined): PreferenciaTema {
  return (tema && DE_PERFIL[tema]) || 'system';
}

/** La preferencia de la web al valor de profiles.tema. */
export function preferenciaAPerfil(preferencia: PreferenciaTema): string {
  return A_PERFIL[preferencia];
}

function leerGuardado(): PreferenciaTema | null {
  try {
    const valor = window.localStorage.getItem(CLAVE);
    return valor === 'dark' || valor === 'light' || valor === 'system' ? valor : null;
  } catch {
    return null;
  }
}

function preferenciaActual(): PreferenciaTema {
  const forzado = document.documentElement.dataset.theme;
  return forzado === 'dark' || forzado === 'light' ? forzado : 'system';
}

/** Lo que se esta pintando: el tema forzado o, si no hay, el del sistema. */
function modoEfectivo(): ModoTema {
  const preferencia = preferenciaActual();
  if (preferencia !== 'system') return preferencia;
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

/** Pinta la preferencia y la guarda en el navegador. */
export function aplicarPreferencia(preferencia: PreferenciaTema) {
  document.documentElement.dataset.theme = preferencia;
  try {
    window.localStorage.setItem(CLAVE, preferencia);
  } catch {
    // Sin almacenamiento (navegacion privada): el tema vale hasta recargar.
  }
  avisar();
}

/** El modo que se ve (para el switch del acceso, que alterna oscuro y claro). */
export function useTema(): [ModoTema, (modo: ModoTema) => void] {
  const modo = useSyncExternalStore(suscribir, modoEfectivo);
  const elegir = useCallback((nuevo: ModoTema) => aplicarPreferencia(nuevo), []);
  return [modo, elegir];
}

/** La preferencia elegida, con Sistema incluido (para Configuracion). */
export function usePreferenciaTema(): PreferenciaTema {
  return useSyncExternalStore(suscribir, preferenciaActual);
}
