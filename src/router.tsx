/* Frencia · Rutas de la web.
   - /login y /signup: solo sin sesion (SoloInvitado).
   - /, /rutinas, /historial, /perfil y /configuracion, con sus detalles y
     editar perfil: dentro del marco con la navegacion lateral (ConSesion).
   - /rutinas/nueva y /rutinas/:id/editar: el constructor, con sesion pero
     a pantalla completa, sin la navegacion lateral.
   - * : la 404, afuera de las puertas (con sesion, dentro del marco).
   Si una pagina falla, ErrorRuta muestra el 500 o el sin conexion: dentro de
   la app en el lugar de la pagina, con la navegacion; afuera, en la raiz.
   - /recuperar: con las de invitado. /nueva-contrasena, afuera de las
     puertas: el enlace del correo llega con una sesion de recuperacion.
   - /cuenta-en-baja, /bienvenida y /bienvenida/perfil: las fases de la
     cuenta, con sesion pero sin la navegacion; ConSesion decide cual.
   Falta del kit /r/:codigo, la rutina compartida. */

import { createBrowserRouter, Navigate } from 'react-router';

import { Login } from '@/features/auth/Login';
import { NuevaContrasena } from '@/features/auth/NuevaContrasena';
import { Recuperar } from '@/features/auth/Recuperar';
import { Signup } from '@/features/auth/Signup';
import { Configuracion } from '@/features/configuracion/Configuracion';
import { Consentimiento } from '@/features/bienvenida/Consentimiento';
import { CuentaEnBaja } from '@/features/bienvenida/CuentaEnBaja';
import { Setup } from '@/features/bienvenida/Setup';
import { Constructor } from '@/features/constructor/Constructor';
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
          { path: '/recuperar', element: <Recuperar /> },
          // La direccion vieja del registro, por si quedo guardada en el navegador.
          { path: '/registro', element: <Navigate to="/signup" replace /> },
        ],
      },
      {
        element: <ConSesion />,
        children: [
          { path: '/cuenta-en-baja', element: <CuentaEnBaja /> },
          { path: '/bienvenida', element: <Consentimiento /> },
          { path: '/bienvenida/perfil', element: <Setup /> },
          { path: '/rutinas/nueva', element: <Constructor /> },
          { path: '/rutinas/:id/editar', element: <Constructor /> },
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
      { path: '/nueva-contrasena', element: <NuevaContrasena /> },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
]);
