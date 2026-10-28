/* El ticket de una sesion solo (/historial/:id/ticket), sin la navegacion,
   sobre la luz del centro (kit web, Web · 6): Volver a la sesion, Copiar
   imagen (al copiar, el icono pasa a check) y Descargar PNG. Si el navegador
   no deja copiar imagenes, lo avisa y ofrece descargarla.
   Fondo: centro. */

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Copy, Download, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { Fondo } from '@/design/components/Fondo';
import { Ruedita } from '@/design/components/Ruedita';
import texto from '@/design/texto.module.css';
import type { UnidadDistancia } from '@/lib/distancia';
import { cargarDetalleSesion } from '@/lib/historial';
import { copiarTicket, descargarTicket } from '@/lib/imagenTicket';
import { usePerfil } from '@/lib/perfil';
import type { UnidadPeso } from '@/lib/peso';
import { archivoTicket } from '@/lib/ticket';
import { useVolver } from '@/lib/volver';
import { Ticket } from './Ticket';
import styles from './TicketGrande.module.css';

export function TicketGrande() {
  const { id = '' } = useParams();
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const navegar = useNavigate();
  const avisar = useAvisos();
  const perfil = usePerfil().data;
  const sesion = useQuery({ queryKey: ['sesion', userId, id], queryFn: () => cargarDetalleSesion(userId, id), enabled: !!userId });
  const ticket = useRef<HTMLDivElement>(null);
  const [ocupado, setOcupado] = useState<'copiando' | 'descargando' | null>(null);
  const [copiado, setCopiado] = useState(false);

  // El check de copiado dura un momento.
  useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(false), 2000);
    return () => window.clearTimeout(t);
  }, [copiado]);

  const volver = useVolver(`/historial/${id}`);

  async function descargar() {
    if (!ticket.current || !sesion.data) return;
    setOcupado('descargando');
    try {
      await descargarTicket(ticket.current, archivoTicket(sesion.data.dayName, sesion.data.startedAt));
    } catch {
      avisar('No pudimos armar la imagen del ticket. Probá de nuevo.', 'error');
    }
    setOcupado(null);
  }

  async function copiar() {
    if (!ticket.current) return;
    setOcupado('copiando');
    try {
      await copiarTicket(ticket.current);
      setCopiado(true);
      avisar('Ticket copiado');
    } catch {
      avisar('Tu navegador no deja copiar la imagen.', 'error', { etiqueta: 'Descargar PNG', alHacer: () => void descargar() });
    }
    setOcupado(null);
  }

  let contenido;
  if (sesion.isPending) contenido = <Ruedita />;
  else if (sesion.isError || !sesion.data)
    contenido = (
      <div className={styles.aviso}>
        <span className={texto.subtitle}>{sesion.isError ? 'No pudimos cargar el ticket' : 'No encontramos este entrenamiento'}</span>
        <span className={`${texto.bodySm} ${texto.secundario}`}>
          {sesion.isError ? 'Revisá tu conexión y probá de nuevo.' : 'Puede que ya no esté disponible en tu historial.'}
        </span>
        <div className={styles.acciones}>
          <Boton variante="ghost" icono={ArrowLeft} onClick={() => navegar('/historial')}>
            Ir al historial
          </Boton>
          {sesion.isError ? (
            <Boton variante="secondary" icono={RotateCw} onClick={() => void sesion.refetch()}>
              Reintentar
            </Boton>
          ) : null}
        </div>
      </div>
    );
  else
    contenido = (
      <>
        <Ticket
          ref={ticket}
          sesion={sesion.data}
          unidadPeso={(perfil?.unidad_peso ?? 'kg') as UnidadPeso}
          unidadDistancia={(perfil?.unidad_distancia ?? 'km') as UnidadDistancia}
        />
        <div className={styles.acciones}>
          <Boton variante="ghost" icono={ArrowLeft} onClick={volver.volver}>
            {volver.larga}
          </Boton>
          <Boton variante="secondary" icono={copiado ? Check : Copy} cargando={ocupado === 'copiando'} disabled={ocupado !== null && ocupado !== 'copiando'} onClick={() => void copiar()}>
            {copiado ? 'Copiado' : 'Copiar imagen'}
          </Boton>
          <Boton icono={Download} cargando={ocupado === 'descargando'} disabled={ocupado !== null && ocupado !== 'descargando'} onClick={() => void descargar()}>
            Descargar PNG
          </Boton>
        </div>
      </>
    );

  return (
    <>
      <Fondo posicion="centro" />
      <main className={styles.centrada}>{contenido}</main>
    </>
  );
}
