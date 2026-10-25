/* Frencia · Rutas de la web.
   Por ahora solo el acceso. Las demas rutas del kit (recuperar, nueva
   contraseña, bienvenida, inicio, rutinas, constructor, historial, perfil y
   /r/:codigo) y las puertas de entrada (invitado, legal, setup, adentro) se
   suman en las etapas siguientes. Mientras no haya app, la raiz lleva al
   login. */

import { createBrowserRouter, Navigate } from 'react-router';

import { Login } from '@/features/auth/Login';
import { Registro } from '@/features/auth/Registro';
import { NoEncontrada } from '@/features/inicio/NoEncontrada';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/entrar" replace /> },
  { path: '/entrar', element: <Login /> },
  { path: '/registro', element: <Registro /> },
  { path: '*', element: <NoEncontrada /> },
]);
