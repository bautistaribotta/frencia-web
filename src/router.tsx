/* Frencia · Rutas de la web.
   - /login y /registro: solo sin sesion (SoloInvitado).
   - /, /rutinas, /historial, /perfil y /configuracion, con sus detalles:
     dentro del marco con la navegacion lateral (ConSesion).
   Las demas rutas del kit (recuperar, nueva contraseña, bienvenida,
   constructor, ticket, editar perfil y /r/:codigo) y las fases de legal y
   setup se suman en las etapas siguientes. */

import { createBrowserRouter } from 'react-router';

import { Login } from '@/features/auth/Login';
import { Registro } from '@/features/auth/Registro';
import { Configuracion } from '@/features/configuracion/Configuracion';
import { DetalleSesion } from '@/features/historial/DetalleSesion';
import { Historial } from '@/features/historial/Historial';
import { Inicio } from '@/features/inicio/Inicio';
import { NoEncontrada } from '@/features/inicio/NoEncontrada';
import { Marco } from '@/features/marco/Marco';
import { ConSesion, SoloInvitado } from '@/features/marco/Puertas';
import { Perfil } from '@/features/perfil/Perfil';
import { DetalleRutina } from '@/features/rutinas/DetalleRutina';
import { Rutinas } from '@/features/rutinas/Rutinas';

export const router = createBrowserRouter([
  {
    element: <SoloInvitado />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/registro', element: <Registro /> },
    ],
  },
  {
    element: <ConSesion />,
    children: [
      {
        element: <Marco />,
        children: [
          { path: '/', element: <Inicio /> },
          { path: '/rutinas', element: <Rutinas /> },
          { path: '/rutinas/:id', element: <DetalleRutina /> },
          { path: '/historial', element: <Historial /> },
          { path: '/historial/:id', element: <DetalleSesion /> },
          { path: '/perfil', element: <Perfil /> },
          { path: '/configuracion', element: <Configuracion /> },
        ],
      },
    ],
  },
  { path: '*', element: <NoEncontrada /> },
]);
