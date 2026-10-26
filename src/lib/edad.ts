/* Frencia · Conversion entre edad (anios) y fecha_nacimiento.
   La tabla profiles guarda fecha_nacimiento (date); el front trabaja con la
   edad en anios (ruedas del setup y del perfil). Convertimos en el borde con
   la DB: al guardar pasamos edad -> fecha aproximada (1 de enero del anio de
   nacimiento), al leer calculamos la edad cumplida desde esa fecha. */

// Edad en anios -> fecha_nacimiento (formato YYYY-MM-DD) para persistir.
// Usamos el 1 de enero porque solo conocemos el anio; basta para recuperar la
// edad y respeta el rango permitido por la tabla (1900-2099).
export function edadAFechaNacimiento(edad: number): string | null {
  if (!Number.isInteger(edad) || edad < 0 || edad > 150) return null;
  const anio = new Date().getFullYear() - edad;
  if (anio < 1900 || anio > 2099) return null;
  return `${anio}-01-01`;
}

// fecha_nacimiento (YYYY-MM-DD) -> edad cumplida en anios.
// Se construye en hora local, como en streak.ts: `new Date('YYYY-MM-DD')` la
// lee en UTC y al oeste de Greenwich cae el dia anterior (el 1 de enero pasa a
// ser el 31 de diciembre y la edad sale un anio mas alta).
export function fechaNacimientoAEdad(fecha: string | null): number | null {
  if (!fecha) return null;
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!partes) return null;
  const nacimiento = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  if (Number.isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumpleEsteAnio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());
  if (!cumpleEsteAnio) edad -= 1;
  return edad >= 0 ? edad : null;
}

/** Edad admitida al cargar la fecha de nacimiento: el rango de la rueda de
 *  edad de la app. */
export const EDAD_MINIMA = 13;
export const EDAD_MAXIMA = 99;

export type LecturaFecha =
  | { estado: 'vacia' }
  | { estado: 'incompleta' }
  | { estado: 'inexistente' }
  | { estado: 'fuera'; edad: number | null }
  | { estado: 'ok'; fecha: string; edad: number };

/** Mientras se escribe la fecha: deja solo los numeros y pone las barras,
 *  `14032001` pasa a `14/03/2001`. Borrar una barra borra el numero de antes. */
export function formatearFecha(escrito: string): string {
  const n = escrito.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

/** Lee la fecha de nacimiento escrita como DD/MM/AAAA y devuelve la fecha
 *  para guardar (YYYY-MM-DD) con la edad, o por que no sirve. */
export function leerFechaNacimiento(escrito: string, hoy = new Date()): LecturaFecha {
  if (!escrito.trim()) return { estado: 'vacia' };
  const partes = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(escrito.trim());
  if (!partes) return { estado: 'incompleta' };
  const [dia, mes, anio] = [Number(partes[1]), Number(partes[2]), Number(partes[3])];
  const fecha = new Date(anio, mes - 1, dia);
  // new Date acarrea los desbordes (31/02 pasa a marzo): si cambio, no existe.
  if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) return { estado: 'inexistente' };
  if (fecha > hoy) return { estado: 'fuera', edad: null };
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() < mes - 1 || (hoy.getMonth() === mes - 1 && hoy.getDate() < dia)) edad -= 1;
  if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA) return { estado: 'fuera', edad };
  return { estado: 'ok', fecha: `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`, edad };
}
