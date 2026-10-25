/* Marco de la app con sesion: la navegacion lateral y, al lado, la pagina
   de la ruta. Aplica el tema guardado en la cuenta. El fondo de luces lo
   pone cada pagina, porque cada ruta tiene su posicion (ver la tabla del
   kit web). */

import { useEffect } from 'react';
import { Outlet } from 'react-router';

import { aplicarPreferencia, preferenciaDePerfil } from '@/design/tema';
import { usePerfil } from '@/lib/perfil';
import styles from './Marco.module.css';
import { Navegacion } from './Navegacion';

export function Marco() {
  // Con sesion manda el tema de la cuenta (profiles.tema), igual que en la app.
  const tema = usePerfil().data?.tema;
  useEffect(() => {
    if (tema) aplicarPreferencia(preferenciaDePerfil(tema));
  }, [tema]);

  return (
    <div className={styles.marco}>
      <Navegacion />
      <main className={styles.principal}>
        <Outlet />
      </main>
    </div>
  );
}
