/* Volver con memoria (lib/volver.ts): MemoriaNavegacion va en la raiz de las
   rutas y anota cada pantalla antes de que se dibuje, para que useVolver ya
   sepa de donde se vino. */

import { Outlet, useLocation, useNavigationType } from 'react-router';

import { registrar } from '@/lib/volver';

export function MemoriaNavegacion() {
  const ubicacion = useLocation();
  const accion = useNavigationType();
  // Se anota durante el render para que las paginas de abajo ya lo lean; es
  // idempotente (registrar ignora la misma entrada dos veces).
  registrar(ubicacion.key, accion, ubicacion.pathname + ubicacion.search);
  return <Outlet />;
}
