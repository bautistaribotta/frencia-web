/* Formato de numeros grandes, como en la app (resumen-sesion.ts). */

/** Miles separados con espacio duro, como en el design system: "12 480". */
export function miles(valor: number): string {
  return String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
