/* El perfil de la cuenta (profiles), compartido por toda la app con sesion:
   el saludo del inicio, el pie de la navegacion, Perfil y Configuracion.
   Se lee una vez con React Query; los cambios de Configuracion se aplican en
   el acto y se revierten si la base no los acepta, como en la app. */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { useSesion } from '@/contexts/sesion';
import { aplicarPreferencia, preferenciaDePerfil } from '@/design/tema';
import type { Tables, TablesUpdate } from './database.types';
import { PRIVACIDAD_VERSION } from './privacidad';
import { supabase } from './supabase';
import { TERMINOS_VERSION } from './terminos';

export type Perfil = Pick<
  Tables<'profiles'>,
  | 'name'
  | 'surname'
  | 'avatar_path'
  | 'avatar_seed'
  | 'sexo'
  | 'fecha_nacimiento'
  | 'altura'
  | 'peso'
  | 'medidor_esfuerzo'
  | 'unidad_peso'
  | 'unidad_altura'
  | 'unidad_distancia'
  | 'tema'
  | 'created_at'
  | 'deletion_requested_at'
  | 'onboarding_completed'
> & {
  /** La ultima aceptacion de los textos legales (como mucho una). */
  aceptaciones_legales: Pick<Tables<'aceptaciones_legales'>, 'version_terminos' | 'version_privacidad'>[];
};

const COLUMNAS =
  'name, surname, avatar_path, avatar_seed, sexo, fecha_nacimiento, altura, peso, medidor_esfuerzo, unidad_peso, unidad_altura, unidad_distancia, tema, created_at, deletion_requested_at, onboarding_completed, aceptaciones_legales(version_terminos, version_privacidad)';

/** Lo que Configuracion puede cambiar sin pasar por Editar perfil. */
export type CambioPreferencias = Pick<
  TablesUpdate<'profiles'>,
  'medidor_esfuerzo' | 'unidad_peso' | 'unidad_altura' | 'unidad_distancia' | 'tema'
>;

const clave = (userId: string | undefined) => ['perfil', userId];

async function cargarPerfil(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(COLUMNAS)
    .eq('id', userId)
    // De las aceptaciones solo importa la ultima.
    .order('aceptada_el', { referencedTable: 'aceptaciones_legales', ascending: false })
    .limit(1, { referencedTable: 'aceptaciones_legales' })
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Fase de la cuenta antes de la app, en el orden del gate de la app movil
 *  (README del kit, "Fases de la cuenta"). Sin fila de perfil es un primer
 *  ingreso: faltan los textos legales y el setup. */
export type FaseCuenta = 'baja' | 'legal' | 'setup' | 'adentro';

export function faseCuenta(perfil: Perfil | null): FaseCuenta {
  if (perfil?.deletion_requested_at) return 'baja';
  const ultima = perfil?.aceptaciones_legales?.[0];
  if (ultima?.version_terminos !== TERMINOS_VERSION || ultima.version_privacidad !== PRIVACIDAD_VERSION) return 'legal';
  if (!perfil?.onboarding_completed) return 'setup';
  return 'adentro';
}

export function usePerfil() {
  const { user } = useSesion();
  return useQuery({
    queryKey: clave(user?.id),
    queryFn: () => cargarPerfil(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/** Nombre para mostrar, nombre completo y semilla del avatar. Sin nombre
 *  cargado, "Atleta", como en la app. */
/** Con sesion manda el tema de la cuenta (profiles.tema), igual que en la
 *  app. Lo usan el marco y las pantallas completas, como el constructor. */
export function useTemaDeCuenta() {
  const tema = usePerfil().data?.tema;
  useEffect(() => {
    if (tema) aplicarPreferencia(preferenciaDePerfil(tema));
  }, [tema]);
}

export function useNombre(): { nombre: string; completo: string; semilla: string } {
  const { data } = usePerfil();
  const nombre = data?.name?.trim() || 'Atleta';
  const apellido = data?.surname?.trim();
  const completo = apellido ? `${nombre} ${apellido}` : nombre;
  // Sin semilla guardada, el nombre: es lo que usa la app para dibujarlo.
  return { nombre, completo, semilla: data?.avatar_seed ?? nombre };
}

/** Aplica en la cache un cambio que ya se guardo por otro lado (la foto o el
 *  avatar, que pasan por Storage). */
export function useParchePerfil() {
  const { user } = useSesion();
  const cliente = useQueryClient();
  return useCallback(
    (cambio: Partial<Perfil>) =>
      cliente.setQueryData<Perfil | null>(clave(user?.id), (anterior) => (anterior ? { ...anterior, ...cambio } : anterior)),
    [cliente, user?.id],
  );
}

/** Lo que se cambia en Editar perfil, ya en las unidades de la base (cm, kg). */
export type DatosPersonales = Pick<Perfil, 'name' | 'surname' | 'sexo' | 'fecha_nacimiento' | 'altura' | 'peso'>;

/** Guarda los datos de Editar perfil y, si la base los acepta, los deja en la
 *  cache para que Perfil los muestre sin volver a pedirlos. */
export function useGuardarDatosPersonales() {
  const { user } = useSesion();
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: async (datos: DatosPersonales) => {
      // Con select se confirma que se escribio: un update que no encuentra la
      // fila no da error.
      const { data, error } = await supabase.from('profiles').update(datos).eq('id', user!.id).select('id').maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('No se encontró el perfil.');
    },
    onSuccess: (_resultado, datos) => {
      cliente.setQueryData<Perfil | null>(clave(user?.id), (anterior) => (anterior ? { ...anterior, ...datos } : anterior));
    },
  });
}

/** Guarda preferencias con actualizacion optimista: si la base las rechaza,
 *  vuelve a lo anterior y el error queda en la mutacion. */
export function useGuardarPreferencias() {
  const { user } = useSesion();
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: async (cambio: CambioPreferencias) => {
      const { error } = await supabase.from('profiles').update(cambio).eq('id', user!.id);
      if (error) throw error;
    },
    onMutate: async (cambio) => {
      await cliente.cancelQueries({ queryKey: clave(user?.id) });
      const anterior = cliente.getQueryData<Perfil | null>(clave(user?.id));
      if (anterior) cliente.setQueryData<Perfil>(clave(user?.id), { ...anterior, ...cambio });
      return { anterior };
    },
    onError: (_error, _cambio, contexto) => {
      if (contexto?.anterior) cliente.setQueryData(clave(user?.id), contexto.anterior);
    },
  });
}

/** URL firmada de la foto de perfil: el bucket avatars es privado. Si falla,
 *  queda el avatar generativo; quedarse sin foto es un problema chico. */
export function useFotoPerfil(path: string | null | undefined) {
  return useQuery({
    queryKey: ['foto-perfil', path],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('avatars').createSignedUrl(path!, 60 * 60);
      if (error) throw error;
      return data.signedUrl;
    },
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
    retry: false,
  });
}
