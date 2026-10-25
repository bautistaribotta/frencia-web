/* Puertas del router: deciden entre el acceso y la app segun haya sesion.
   - SoloInvitado: login y registro. Con sesion lleva al inicio (o a donde
     se queria ir antes de que pidiera entrar).
   - ConSesion: todo lo de adentro. Sin sesion lleva al login y recuerda la
     ruta pedida.
   Mientras se resuelve la sesion inicial no se muestra nada: asi no parpadea
   el login cuando ya habia sesion guardada.
   Pendiente: las fases de la app que van entre las dos (textos legales sin
   aceptar, setup incompleto, cuenta con baja pedida) llegan con sus
   pantallas. */

import { Navigate, Outlet, useLocation } from 'react-router';

import { useSesion } from '@/contexts/sesion';

interface EstadoDesde {
  desde?: string;
}

export function SoloInvitado() {
  const { session, iniciando } = useSesion();
  const { state } = useLocation();
  if (iniciando) return null;
  if (session) return <Navigate to={(state as EstadoDesde | null)?.desde ?? '/'} replace />;
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
  return <Outlet />;
}
