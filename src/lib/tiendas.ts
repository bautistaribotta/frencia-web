/* Las tiendas de la app movil. Mientras la app no este publicada los enlaces
   quedan vacios y los botones dicen «Pronto», desactivados (README del kit,
   «Tablet y teléfono»). Al publicarla, alcanza con completarlos aca. */

export type Tienda = 'appStore' | 'googlePlay';

export const TIENDAS: Record<Tienda, { nombre: string; enlace: string }> = {
  appStore: { nombre: 'App Store', enlace: '' },
  googlePlay: { nombre: 'Google Play', enlace: '' },
};

/** La tienda del sistema: App Store en iPhone y iPad (que se presenta como
 *  Mac con pantalla tactil), Google Play en el resto. */
export function tiendaDelSistema(agente = navigator.userAgent, toques = navigator.maxTouchPoints): Tienda {
  if (/iPhone|iPad|iPod/i.test(agente)) return 'appStore';
  if (/Macintosh/i.test(agente) && toques > 1) return 'appStore';
  return 'googlePlay';
}
