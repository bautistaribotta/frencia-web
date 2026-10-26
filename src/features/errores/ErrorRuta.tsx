/* Lo que muestra el router cuando una pagina falla al renderizar o al cargar
   (errorElement, kit web, Web · 9). Dentro de la app reemplaza solo a la
   pagina y deja la navegacion; afuera, va solo, con la cabecera publica si no
   hay sesion.
   - Sin conexion: el navegador dice que no hay red, o fallo bajar un pedazo
     de la app. Al volver la señal se recarga sola.
   - Cualquier otro error: el 500, con un codigo corto para soporte que
     tambien queda en la consola junto al error.
   Un 404 que llegue como respuesta del router se muestra como la 404. */

import { useEffect, useState } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { PantallaError, type TipoError } from './PantallaError';

/** FR-500-7C1E2A9B: ocho caracteres al azar para ubicar el error. */
function codigoSoporte(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `FR-500-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function esDeRed(error: unknown): boolean {
  if (!navigator.onLine) return true;
  // fetch y los import() dinamicos fallan con TypeError cuando no hay red.
  return error instanceof TypeError && /fetch|network|import|module/i.test(error.message);
}

export function ErrorRuta() {
  const error = useRouteError();
  const { session } = useSesion();
  const [codigo] = useState(codigoSoporte);
  const tipo: TipoError = isRouteErrorResponse(error) && error.status === 404 ? '404' : esDeRed(error) ? 'red' : '500';

  useEffect(() => {
    if (tipo === '500') console.error(`[${codigo}]`, error);
  }, [tipo, codigo, error]);

  // Lo que se estaba viendo vuelve apenas hay señal.
  useEffect(() => {
    if (tipo !== 'red') return;
    const alVolver = () => window.location.reload();
    window.addEventListener('online', alVolver);
    return () => window.removeEventListener('online', alVolver);
  }, [tipo]);

  return <PantallaError tipo={tipo} publica={!session} codigo={codigo} />;
}
