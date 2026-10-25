/* ============================================================
   Frencia · Reducir transparencia
   Superficies opacas y luces mas bajas (tokens.css). No esta en
   profiles: se guarda en este navegador y, mientras no se toque,
   sigue al sistema (prefers-reduced-transparency). Se pinta con
   data-transparencia en <html>: "reducida" la fuerza y "normal" la
   apaga aunque el sistema la pida.
   ============================================================ */

import { useCallback, useSyncExternalStore } from 'react';

const CLAVE = 'frencia:transparencia';
const consultaSistema = () => window.matchMedia('(prefers-reduced-transparency: reduce)');

/** Aplica la eleccion guardada antes del primer render. */
export function aplicarTransparenciaGuardada() {
  try {
    const valor = window.localStorage.getItem(CLAVE);
    if (valor === 'reducida' || valor === 'normal') document.documentElement.dataset.transparencia = valor;
  } catch {
    // Sin almacenamiento: sigue al sistema.
  }
}

function reducidaActual(): boolean {
  const forzada = document.documentElement.dataset.transparencia;
  if (forzada === 'reducida') return true;
  if (forzada === 'normal') return false;
  return consultaSistema().matches;
}

const oyentes = new Set<() => void>();

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  const sistema = consultaSistema();
  sistema.addEventListener('change', oyente);
  return () => {
    oyentes.delete(oyente);
    sistema.removeEventListener('change', oyente);
  };
}

export function useTransparenciaReducida(): [boolean, (reducida: boolean) => void] {
  const reducida = useSyncExternalStore(suscribir, reducidaActual);
  const elegir = useCallback((nueva: boolean) => {
    const valor = nueva ? 'reducida' : 'normal';
    document.documentElement.dataset.transparencia = valor;
    try {
      window.localStorage.setItem(CLAVE, valor);
    } catch {
      // Sin almacenamiento: vale hasta recargar.
    }
    oyentes.forEach((oyente) => oyente());
  }, []);
  return [reducida, elegir];
}
