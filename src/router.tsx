/* Frencia · Rutas de la web.
   - /login y /signup: solo sin sesion (SoloInvitado).
   - /, /rutinas, /historial, /perfil y /configuracion, con sus detalles y
     editar perfil: dentro del marco con la navegacion lateral (ConSesion).
   - * : la 404, afuera de las puertas (con sesion, dentro del marco).
   Si una pagina falla, ErrorRuta muestra el 500 o el sin conexion: dentro de
   la app en el lugar de la pagina, con la navegacion; afuera, en la raiz.
   Las demas rutas del kit (recuperar, nueva contraseña, bienvenida,
   constructor, ticket y /r/:codigo) y las fases de legal y
   setup se suman en las etapas siguientes. */

import { createBrowserRouter, Navigate } from 'react-router';

import { Login } from '@/features/auth/Login';
import { Signup } from '@/features/auth/Signup';
import { Configuracion } from '@/features/configuracion/Configuracion';
import { ErrorRuta } from '@/features/errores/ErrorRuta';
import { NoEncontrada } from '@/features/errores/NoEncontrada';
import { DetalleSesion } from '@/features/historial/DetalleSesion';
import { Historial } from '@/features/historial/Historial';
import { Inicio } from '@/features/inicio/Inicio';
import { Marco } from '@/features/marco/Marco';
import { ConSesion, SoloInvitado } from '@/features/marco/Puertas';
import { EditarPerfil } from '@/features/perfil/EditarPerfil';
import { Perfil } from '@/features/perfil/Perfil';
import { DetalleRutina } from '@/features/rutinas/DetalleRutina';
import { Rutinas } from '@/features/rutinas/Rutinas';

export const router = createBrowserRouter([
  {
    errorElement: <ErrorRuta />,
    children: [
      {
        element: <SoloInvitado />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/signup', element: <Signup /> },
          // La direccion vieja del registro, por si quedo guardada en el navegador.
          { path: '/registro', element: <Navigate to="/signup" replace /> },
        ],
      },
      {
        element: <ConSesion />,
        children: [
          {
            element: <Marco />,
            children: [
              {
                errorElement: <ErrorRuta />,
                children: [
                  { path: '/', element: <Inicio /> },
                  { path: '/rutinas', element: <Rutinas /> },
                  { path: '/rutinas/:id', element: <DetalleRutina /> },
                  { path: '/historial', element: <Historial /> },
                  { path: '/historial/:id', element: <DetalleSesion /> },
                  { path: '/perfil', element: <Perfil /> },
                  { path: '/perfil/editar', element: <EditarPerfil /> },
                  { path: '/configuracion', element: <Configuracion /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
]);
