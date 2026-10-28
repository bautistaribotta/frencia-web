/* Tamaños de pantalla (README del kit, «Tablet y teléfono»). Se decide por
   ancho, no por dispositivo: el teléfono es por debajo de 768 px. Lo que solo
   cambia el aspecto va en CSS con @media (max-width: 767px); este hook es
   para lo que cambia que se renderiza, como el constructor bloqueado. */

import { useSyncExternalStore } from 'react';

export const CONSULTA_TELEFONO = '(max-width: 767px)';

function suscribir(aviso: () => void) {
  const consulta = window.matchMedia(CONSULTA_TELEFONO);
  consulta.addEventListener('change', aviso);
  return () => consulta.removeEventListener('change', aviso);
}

export function useEsTelefono() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA_TELEFONO).matches,
    () => false,
  );
}
