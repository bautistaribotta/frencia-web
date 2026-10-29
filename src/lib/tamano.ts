/* Tamaños de pantalla (README del kit, «Tablet y teléfono»). Se decide por
   ancho, no por dispositivo: el teléfono es por debajo de 768 px. Lo que solo
   cambia el aspecto va en CSS con @media (max-width: 767px); este hook es
   para lo que cambia que se renderiza, como el constructor bloqueado. */

import { useSyncExternalStore } from 'react';

export const CONSULTA_TELEFONO = '(max-width: 767px)';
/** Tablet o telefono: por debajo de 1024 px. */
export const CONSULTA_TABLET = '(max-width: 1023px)';

function useCoincide(consulta: string) {
  return useSyncExternalStore(
    (aviso) => {
      const medio = window.matchMedia(consulta);
      medio.addEventListener('change', aviso);
      return () => medio.removeEventListener('change', aviso);
    },
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}

export function useEsTelefono() {
  return useCoincide(CONSULTA_TELEFONO);
}

/** Verdadero en la tablet y en el telefono. */
export function useEsTabletOMenos() {
  return useCoincide(CONSULTA_TABLET);
}
