/* Puertas del router: deciden entre el acceso y la app segun haya sesion.
   - SoloInvitado: login y registro. Con sesion lleva al inicio (o a donde
     se queria ir antes de que pidiera entrar; si se entro con Apple o
     Google, eso viajo en sessionStorage, ver lib/oauth.ts).
   - ConSesion: todo lo de adentro. Sin sesion lleva al login y recuerda la
     ruta pedida.
   Mientras se resuelve la sesion inicial no se muestra nada: asi no parpadea
   el login cuando ya habia sesion guardada.
   - Con sesion, antes de la app, el perfil decide la fase (README del kit,
     "Fases de la cuenta"): la baja pedida lleva a /cuenta-en-baja, los
     textos legales sin aceptar a /bienvenida y el setup sin terminar a
     /bienvenida/perfil, recordando a donde se queria ir. Mientras se lee el
     perfil no se muestra nada; si no se puede leer, la pantalla de sin
     conexion (nunca el setup: una lectura fallida no es una cuenta nueva). */

import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { PantallaError } from '@/features/errores/PantallaError';
import { borrarIntento, leerIntento } from '@/lib/oauth';
import { faseCuenta, usePerfil, type FaseCuenta } from '@/lib/perfil';

/** La pantalla de cada fase antes de la app. */
const RUTA_FASE: Record<Exclude<FaseCuenta, 'adentro'>, string> = {
  baja: '/cuenta-en-baja',
  legal: '/bienvenida',
  setup: '/bienvenida/perfil',
};
const RUTAS_FASE = Object.values(RUTA_FASE);

interface EstadoDesde {
  desde?: string;
}

export function SoloInvitado() {
  const { session, iniciando } = useSesion();
  const { state } = useLocation();
  // El intento de Apple o Google ya cumplio al haber sesion.
  useEffect(() => {
    if (session) borrarIntento();
  }, [session]);
  if (iniciando) return null;
  if (session) return <Navigate to={(state as EstadoDesde | null)?.desde ?? leerIntento()?.desde ?? '/'} replace />;
  return <Outlet />;
}

export function ConSesion() {
  const { session, iniciando, salio } = useSesion();
  const { pathname, search } = useLocation();
  if (iniciando) return null;
  if (!session) {
    // Tras cerrar sesion no se recuerda la ruta: al volver se arranca por el inicio.
    const desde = pathname === '/' || salio ? undefined : pathname + search;
    return <Navigate to="/login" replace state={{ desde }} />;
  }
  return <FasesCuenta />;
}

function FasesCuenta() {
  const perfil = usePerfil();
  const { pathname, search, state } = useLocation();
  if (perfil.isPending) return null;
  if (perfil.isError) return <PantallaError tipo="red" />;

  const fase = faseCuenta(perfil.data);
  const enFase = RUTAS_FASE.includes(pathname);
  // Lo que se pidio antes de la fase, para volver ahi al terminar.
  const desde = (state as { desde?: string } | null)?.desde ?? (enFase || pathname === '/' ? undefined : pathname + search);

  if (fase !== 'adentro') {
    const destino = RUTA_FASE[fase];
    if (pathname !== destino) return <Navigate to={destino} replace state={{ desde }} />;
    return <Outlet />;
  }
  // Adentro, las pantallas de las fases ya no tienen nada que hacer.
  if (enFase) return <Navigate to={desde ?? '/'} replace />;
  return <Outlet />;
}
