/* Catalogo de ejercicios del constructor. Es chico y cambia poco: se baja
   entero una vez por sesion (paginado, para no quedar cortado en el limite
   de filas de la API) y se filtra en memoria, sin pedir nada por tecla.
   Port de src/lib/exercises.ts del repo mobile, sin el cache en disco. */

import { useQuery } from '@tanstack/react-query';

import { COLUMNAS_TIPO, tipoDeFila, type DatosRegistrados, type FilaTipo, type TipoEjercicio } from './ejercicios';
import { supabase } from './supabase';

export interface GrupoMuscular {
  slug: string;
  name: string;
  /** Orden fijo del catalogo de musculos (pecho, espalda, hombros...). */
  position: number;
}

export interface EjercicioCatalogo {
  id: string;
  name: string;
  nameEn: string | null;
  equipment: string | null;
  primario: GrupoMuscular | null;
  secundarios: GrupoMuscular[];
  kind: TipoEjercicio;
  tracks: DatosRegistrados;
}

// Tiene que coincidir con max_rows de Supabase: si fuera mayor, la API
// recortaria cada pagina y el bucle la tomaria por la ultima.
const PAGINA = 1000;

interface FilaEjercicio extends FilaTipo {
  id: string;
  name: string;
  name_en: string | null;
  equipment: string | null;
  exercise_muscles: { is_primary: boolean; muscle_groups: GrupoMuscular | null }[] | null;
}

const porPosicion = (a: GrupoMuscular, b: GrupoMuscular) => a.position - b.position;

function aEjercicio(e: FilaEjercicio): EjercicioCatalogo {
  const primarios: GrupoMuscular[] = [];
  const secundarios: GrupoMuscular[] = [];
  for (const m of e.exercise_muscles ?? []) {
    if (m.muscle_groups) (m.is_primary ? primarios : secundarios).push(m.muscle_groups);
  }
  primarios.sort(porPosicion);
  secundarios.sort(porPosicion);
  return {
    id: e.id,
    name: e.name,
    nameEn: e.name_en,
    equipment: e.equipment,
    // Cada ejercicio tiene un unico objetivo; si trajera dos, el resto pasa a
    // secundarios en vez de perderse.
    primario: primarios[0] ?? null,
    secundarios: [...primarios.slice(1), ...secundarios],
    ...tipoDeFila(e),
  };
}

/** El catalogo entero, de la A a la Z. Tira si falla cualquier pagina: un
 *  catalogo a medias no sirve para armar una rutina. */
export async function cargarCatalogo(): Promise<EjercicioCatalogo[]> {
  const todos: EjercicioCatalogo[] = [];
  for (let desde = 0; ; desde += PAGINA) {
    // El id desempata nombres repetidos para que ninguno se repita o se
    // pierda en el corte entre paginas.
    const { data, error } = await supabase
      .from('exercises')
      .select(`id, name, name_en, equipment, ${COLUMNAS_TIPO}, exercise_muscles(is_primary, muscle_groups(slug, name, position))`)
      .order('name')
      .order('id')
      .range(desde, desde + PAGINA - 1);
    if (error) throw error;
    for (const fila of data) todos.push(aEjercicio(fila));
    if (data.length < PAGINA) break;
  }
  return todos;
}

export function useCatalogo() {
  return useQuery({ queryKey: ['catalogo'], queryFn: cargarCatalogo, staleTime: 15 * 60 * 1000 });
}

/** Para comparar sin distinguir mayusculas ni acentos. */
export function plegar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

const EQUIPAMIENTO: Record<string, string> = {
  barra: 'Barra',
  cinta: 'Cinta',
  mancuernas: 'Mancuernas',
  maquina: 'Máquina',
  multipower: 'Multipower',
  polea: 'Polea',
  'peso corporal': 'Peso corporal',
};

/** Equipamiento para mostrar. Si aparece uno nuevo, sale capitalizado. */
export function equipamiento(valor: string | null): string | null {
  if (!valor) return null;
  return EQUIPAMIENTO[valor] ?? valor.charAt(0).toUpperCase() + valor.slice(1);
}

/** "Pecho · Barra": el grupo principal y el equipamiento, lo que haya. */
export function detalleCatalogo(e: EjercicioCatalogo): string {
  return [e.primario?.name, equipamiento(e.equipment)].filter(Boolean).join(' · ');
}

export interface FiltroCatalogo {
  busqueda: string;
  tipo: TipoEjercicio | 'todos';
  /** slug del grupo muscular, o 'todos'. */
  grupo: string;
}

/** Lo que pasa los tres filtros. La busqueda mira el nombre en español y en
 *  ingles; el grupo, el principal y los secundarios. */
export function filtrarCatalogo(lista: EjercicioCatalogo[], { busqueda, tipo, grupo }: FiltroCatalogo): EjercicioCatalogo[] {
  const q = plegar(busqueda);
  return lista.filter((e) => {
    if (tipo !== 'todos' && e.kind !== tipo) return false;
    if (grupo !== 'todos' && e.primario?.slug !== grupo && !e.secundarios.some((g) => g.slug === grupo)) return false;
    if (!q) return true;
    return plegar(e.name).includes(q) || (e.nameEn !== null && plegar(e.nameEn).includes(q));
  });
}

/** Los grupos musculares que aparecen en el catalogo, en su orden fijo. */
export function gruposDelCatalogo(lista: EjercicioCatalogo[]): GrupoMuscular[] {
  const vistos = new Map<string, GrupoMuscular>();
  for (const e of lista) {
    for (const g of [e.primario, ...e.secundarios]) if (g && !vistos.has(g.slug)) vistos.set(g.slug, g);
  }
  return [...vistos.values()].sort(porPosicion);
}
