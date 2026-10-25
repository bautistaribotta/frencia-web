/* Validaciones de entrada antes de armar consultas. Copia de la parte que usa
   la web de src/lib/validacion.ts del repo mobile. */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|[+-]\d{2}:\d{2})$/;

/** Verifica si una cadena tiene formato UUID canonico. */
export function esUuid(valor: string): boolean {
  return UUID_REGEX.test(valor);
}

/** Valida los campos de un cursor (id UUID + timestamp ISO) antes de interpolarlos en PostgREST. */
export function esCursorValido(id: string, fechaIso: string): boolean {
  return esUuid(id) && ISO_TIMESTAMP_REGEX.test(fechaIso) && Number.isFinite(Date.parse(fechaIso));
}
