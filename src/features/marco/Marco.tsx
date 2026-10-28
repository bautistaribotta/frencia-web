/* Marco de la app con sesion: la navegacion lateral y, al lado, la pagina
   de la ruta (o lo que se le pase, como la 404). Aplica el tema guardado en
   la cuenta. El fondo de luces lo
   pone cada pagina, porque cada ruta tiene su posicion (ver la tabla del
   kit web). En el teléfono la navegacion es la barra inferior y arriba del
   contenido va el aviso de la app (kit web, «Tablet y teléfono»). */

import type { ReactNode } from 'react';
import { Outlet } from 'react-router';

import { useTemaDeCuenta } from '@/lib/perfil';
import { AvisoApp } from './AvisoApp';
import { BarraMovil } from './BarraMovil';
import styles from './Marco.module.css';
import { Navegacion } from './Navegacion';

export function Marco({ children }: { children?: ReactNode }) {
  useTemaDeCuenta();

  return (
    <div className={styles.marco}>
      <Navegacion />
      <main className={styles.principal}>
        <AvisoApp />
        {children ?? <Outlet />}
      </main>
      <BarraMovil />
    </div>
  );
}
