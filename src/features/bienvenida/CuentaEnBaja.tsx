/* Cuenta con la baja pedida (/cuenta-en-baja), la unica pantalla mientras
   dura el periodo de gracia, se entre por donde se entre (kit web, Web · 3).
   Recuperar cuenta cancela la solicitud y sigue el ingreso normal; la otra
   salida es cerrar sesion. Port de account-recovery del repo mobile.
   Fondo: cumbre, anima. */

import { useQueryClient } from '@tanstack/react-query';
import { LifeBuoy, LogOut, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Insignia, Marca, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { cancelarEliminacionCuenta, fechaLarga, fechaPurga } from '@/lib/cuenta';
import { usePerfil } from '@/lib/perfil';
import { supabase } from '@/lib/supabase';
import styles from './Bienvenida.module.css';

const DIA_MS = 24 * 60 * 60 * 1000;

export function CuentaEnBaja() {
  const { user } = useSesion();
  const perfil = usePerfil().data;
  const cliente = useQueryClient();
  const avisar = useAvisos();
  const [recuperando, setRecuperando] = useState(false);

  // La puerta solo trae aca con la fecha cargada; el resto es por tipado.
  const purga = perfil?.deletion_requested_at ? fechaPurga(new Date(perfil.deletion_requested_at)) : null;
  // eslint-disable-next-line react-hooks/purity
  const dias = purga ? Math.max(0, Math.ceil((purga.getTime() - Date.now()) / DIA_MS)) : null;

  async function recuperar() {
    setRecuperando(true);
    const ok = await cancelarEliminacionCuenta();
    if (!ok) {
      setRecuperando(false);
      avisar('No pudimos recuperar la cuenta. Probá de nuevo.', 'error');
      return;
    }
    avisar('Cuenta recuperada');
    // Sin la baja pedida la puerta sigue con el ingreso normal.
    await cliente.invalidateQueries({ queryKey: ['perfil', user?.id] });
  }

  return (
    <>
      <Fondo posicion="cumbre" animado />
      <main className={styles.centrada}>
        <Tarjeta className={styles.caja}>
          <Marca />
          <span className={styles.sello}>
            <Icono icono={LifeBuoy} tamano={26} />
          </span>
          <div className={styles.textos}>
            <span className={`${texto.label} ${texto.terciario}`}>Cuenta en baja</span>
            <h1 className={texto.display}>{purga ? `Tu cuenta se elimina el ${fechaLarga(purga)}` : 'Tu cuenta está por eliminarse'}</h1>
            <span className={`${texto.bodySm} ${texto.secundario}`}>
              Pediste eliminar tu cuenta y la solicitud sigue vigente. Si la recuperás ahora, todo queda como lo dejaste: rutinas,
              sesiones e historial.
            </span>
          </div>
          {dias !== null ? (
            <div>
              <Insignia tono="danger">{dias === 0 ? 'Se elimina hoy' : `Se elimina en ${dias} ${dias === 1 ? 'día' : 'días'}`}</Insignia>
            </div>
          ) : null}
          <div className={styles.pie}>
            <Boton variante="ghost" tamano="sm" icono={LogOut} className={styles.volverIzq} disabled={recuperando} onClick={() => void supabase.auth.signOut()}>
              Cerrar sesión
            </Boton>
            <Boton tamano="lg" icono={RotateCcw} cargando={recuperando} autoFocus onClick={() => void recuperar()}>
              {recuperando ? 'Recuperando…' : 'Recuperar cuenta'}
            </Boton>
          </div>
        </Tarjeta>
      </main>
    </>
  );
}
