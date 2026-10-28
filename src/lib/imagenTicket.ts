/* El ticket de una sesion como imagen: descargarlo en PNG o copiarlo al
   portapapeles (kit web, Web · 6). La imagen sale del ticket tal como se ve,
   con html-to-image, al doble de resolucion y con fondo transparente. */

import { toBlob } from 'html-to-image';

/** El ticket como PNG al doble de resolucion, con fondo transparente. */
async function imagenTicket(el: HTMLElement): Promise<Blob> {
  // Las fuentes tienen que estar cargadas o la imagen sale con las del sistema.
  await document.fonts.ready;
  const blob = await toBlob(el, { pixelRatio: 2, cacheBust: true });
  if (!blob) throw new Error('No se pudo armar la imagen');
  return blob;
}

/** Descarga el ticket como archivo PNG. */
export async function descargarTicket(el: HTMLElement, archivo: string): Promise<void> {
  const blob = await imagenTicket(el);
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = archivo;
  enlace.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Copia el ticket al portapapeles como imagen. Tira si el navegador no lo
 *  permite. */
export async function copiarTicket(el: HTMLElement): Promise<void> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('Sin portapapeles de imagenes');
  // La promesa va adentro del ClipboardItem: Safari pide escribir en el mismo
  // gesto del clic, antes de esperar a la imagen.
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': imagenTicket(el) })]);
}
