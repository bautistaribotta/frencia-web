/* Frencia · Rutas de la web.
   - /login y /registro: solo sin sesion (SoloInvitado).
   - /, /perfil y /configuracion: dentro del marco con la navegacion
     lateral (ConSesion).
   Las demas rutas del kit (recuperar, nueva contraseña, bienvenida,
   rutinas, constructor, historial, editar perfil y /r/:codigo) y
   las fases de legal y setup se suman en las etapas siguientes. */

import { createBrowserRouter } from 'react-router';

import { Login } from '@/features/auth/Login';
import { Registro } from '@/features/auth/Registro';
import { Configuracion } from '@/features/configuracion/Configuracion';
import { Inicio } from '@/features/inicio/Inicio';
import { NoEncontrada } from '@/features/inicio/NoEncontrada';
import { Marco } from '@/features/marco/Marco';
import { ConSesion, SoloInvitado } from '@/features/marco/Puertas';
import { Perfil } from '@/features/perfil/Perfil';

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
          { path: '/perfil', element: <Perfil /> },
          { path: '/configuracion', element: <Configuracion /> },
        ],
      },
    ],
  },
  { path: '*', element: <NoEncontrada /> },
]);
