import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

import '@/design/global.css';
import { aplicarTemaGuardado } from '@/design/tema';
import { router } from '@/router';

aplicarTemaGuardado();

// Solo en desarrollo: ?tema=claro u ?tema=oscuro fuerza el tema de esa carga
// para revisar las pantallas, por encima de lo que guardo el switch.
if (import.meta.env.DEV) {
  const tema = new URLSearchParams(window.location.search).get('tema');
  if (tema === 'claro') document.documentElement.dataset.theme = 'light';
  if (tema === 'oscuro') document.documentElement.dataset.theme = 'dark';
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
