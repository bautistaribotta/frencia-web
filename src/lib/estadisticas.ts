/* "Desde que empezaste", en el Perfil: sesiones terminadas y tonelaje total.
   El tonelaje suma peso por reps de cada serie que tiene las dos cosas, la
   misma regla que el resumen de sesion de la app (volumenKg).
   Se calcula en el navegador, pagina por pagina: la API no suma. Si las
   cuentas crecen mucho conviene una funcion en la base que lo devuelva. */

import { supabase } from './supabase';

const PAGINA = 1000;

export async function contarSesiones(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('workout_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('finished_at', 'is', null);
  if (error) throw error;
  return count ?? 0;
}

/** Tonelaje total en kg. Las politicas de session_sets ya limitan a las
 *  series propias; el filtro por sesion terminada deja afuera una en curso. */
export async function tonelajeTotalKg(userId: string): Promise<number> {
  let total = 0;
  for (let desde = 0; ; desde += PAGINA) {
    const { data, error } = await supabase
      .from('session_sets')
      .select('id, weight_kg, reps, workout_sessions!inner(user_id, finished_at)')
      .eq('workout_sessions.user_id', userId)
      .not('workout_sessions.finished_at', 'is', null)
      .not('weight_kg', 'is', null)
      .not('reps', 'is', null)
      .order('id')
      .range(desde, desde + PAGINA - 1);
    if (error) throw error;
    for (const serie of data) total += (serie.weight_kg as number) * (serie.reps as number);
    if (data.length < PAGINA) return total;
  }
}
