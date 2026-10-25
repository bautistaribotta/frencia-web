/* Frencia · Contexto de sesion.
   Fuente unica de la sesion de Supabase para toda la web. Escucha los cambios
   de auth (login, logout, refresh de token) y los expone a las puertas del
   router para decidir entre el acceso y la app. Igual que en la app. */

import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { supabase } from '@/lib/supabase';

interface ValorSesion {
  session: Session | null;
  user: User | null;
  // Mientras se resuelve la sesion inicial no se decide ninguna ruta.
  iniciando: boolean;
  // La sesion se cerro en esta pestaña (Cerrar sesion, eliminar la cuenta):
  // no es un enlace que pide entrar, asi que no hay ruta que recordar.
  salio: boolean;
}

const ContextoSesion = createContext<ValorSesion>({ session: null, user: null, iniciando: true, salio: false });

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [iniciando, setIniciando] = useState(true);
  const [salio, setSalio] = useState(false);

  useEffect(() => {
    let activo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!activo) return;
      setSession(data.session);
      setIniciando(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, siguiente) => {
      if (!activo) return;
      setSession(siguiente);
      if (evento === 'SIGNED_OUT') setSalio(true);
      if (evento === 'SIGNED_IN') setSalio(false);
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ContextoSesion.Provider value={{ session, user: session?.user ?? null, iniciando, salio }}>
      {children}
    </ContextoSesion.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSesion(): ValorSesion {
  return useContext(ContextoSesion);
}
