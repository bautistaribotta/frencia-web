/* Formatos de los totales de entrenamiento. */

import { miles } from './numeros';
import { mostrarPeso, type UnidadPeso } from './peso';

/** Tonelaje en la unidad del usuario: toneladas si es kg, libras si es lb. */
export function textoTonelaje(kg: number, unidad: UnidadPeso): { valor: string; unidad: string } {
  if (unidad === 'lb') return { valor: miles(mostrarPeso(kg, 'lb')), unidad: 'lb' };
  return { valor: (Math.round(kg / 100) / 10).toFixed(1), unidad: 't' };
}
