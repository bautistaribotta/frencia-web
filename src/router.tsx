/* Frencia · Rutas de la web.
   Por ahora solo la portada provisoria de la etapa 0. Las rutas de cada
   feature (auth, inicio, rutinas, constructor, historial, perfil, legal y
   compartir) y las puertas de entrada (invitado, legal, setup, adentro) se
   suman en las etapas siguientes. */

import { createBrowserRouter } from 'react-router';

import { Portada } from '@/features/inicio/Portada';
import { NoEncontrada } from '@/features/inicio/NoEncontrada';

export const router = createBrowserRouter([
  { path: '/', element: <Portada /> },
  { path: '*', element: <NoEncontrada /> },
]);
