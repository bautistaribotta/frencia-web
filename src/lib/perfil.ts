/* El perfil de la cuenta (profiles), compartido por toda la app con sesion:
   el saludo del inicio, el pie de la navegacion, Perfil y Configuracion.
   Se lee una vez con React Query; los cambios de Configuracion se aplican en
   el acto y se revierten si la base no los acepta, como en la app. */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useSesion } from '@/contexts/sesion';
import type { Tables, TablesUpdate } from './database.types';
import { supabase } from './supabase';

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
>;

const COLUMNAS =
  'name, surname, avatar_path, avatar_seed, sexo, fecha_nacimiento, altura, peso, medidor_esfuerzo, unidad_peso, unidad_altura, unidad_distancia, tema, created_at';

/** Lo que Configuracion puede cambiar sin pasar por Editar perfil. */
export type CambioPreferencias = Pick<
  TablesUpdate<'profiles'>,
  'medidor_esfuerzo' | 'unidad_peso' | 'unidad_altura' | 'unidad_distancia' | 'tema'
>;

const clave = (userId: string | undefined) => ['perfil', userId];

async function cargarPerfil(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase.from('profiles').select(COLUMNAS).eq('id', userId).maybeSingle();
  if (error) throw error;
  return data;
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
