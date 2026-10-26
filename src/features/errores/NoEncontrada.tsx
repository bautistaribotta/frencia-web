/* Pagina no encontrada (ruta *, kit web, Web · 9). Va afuera de las puertas
   de sesion: con sesion se muestra dentro del marco, con la navegacion, para
   seguir desde ahi; sin sesion (un link viejo que llega de afuera), con la
   cabecera publica en vez de mandar al login. */

import { useSesion } from '@/contexts/sesion';
import { Marco } from '@/features/marco/Marco';
import { PantallaError } from './PantallaError';

export function NoEncontrada() {
  const { session, iniciando } = useSesion();
  if (iniciando) return null;
  if (!session) return <PantallaError tipo="404" publica />;
  return (
    <Marco>
      <PantallaError tipo="404" />
    </Marco>
  );
}
