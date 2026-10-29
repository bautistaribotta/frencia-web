import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { Modal } from '@/design/components/Modal';
import texto from '@/design/texto.module.css';
import { eliminarSesion } from '@/lib/historial';
import { fechaSesion } from '@/lib/tiempo';

export function EliminarSesion({ id, nombre, fecha, detalle = false }: { id: string; nombre: string | null; fecha: number; detalle?: boolean }) {
  const [abierto, abrir] = useState(false);
  const { user } = useSesion();
  const cliente = useQueryClient();
  const avisar = useAvisos();
  const navegar = useNavigate();
  const borrado = useMutation({
    mutationFn: () => eliminarSesion(user?.id ?? '', id),
    onSuccess: async () => {
      await cliente.cancelQueries({ queryKey: ['sesion', user?.id, id] });
      cliente.setQueryData(['sesion', user?.id, id], null);
      avisar('Entrenamiento eliminado.');
      if (detalle) navegar('/historial', { replace: true });
      abrir(false);
      await Promise.all(['historial', 'historial-totales', 'actividad', 'ultimas-sesiones', 'rutinas', 'rutina', 'rutina-activa'].map(
        (clave) => cliente.invalidateQueries({ queryKey: clave === 'rutina' ? [clave] : [clave, user?.id] }),
      ));
    },
  });
  function mostrar() {
    borrado.reset();
    abrir(true);
  }
  return (
    <span onClick={(evento) => evento.stopPropagation()}>
      {detalle ? (
        <Boton variante="danger" tamano="sm" icono={Trash2} onClick={mostrar}>Eliminar entrenamiento</Boton>
      ) : (
        <BotonIcono icono={Trash2} tamano="sm" etiqueta={`Eliminar ${nombre ?? 'entrenamiento'} del ${fechaSesion(fecha)}`} onClick={mostrar} />
      )}
      <Modal
        abierto={abierto}
        chico
        titulo="Eliminar este entrenamiento"
        texto={`${nombre ?? 'Día eliminado'} · ${fechaSesion(fecha)}. Se borran esta sesión y sus series del historial. Tu rutina no cambia. No se puede deshacer.`}
        onCerrar={borrado.isPending ? undefined : () => abrir(false)}
        pie={<>
          <Boton variante="secondary" data-foco-inicial disabled={borrado.isPending} onClick={() => abrir(false)}>Cancelar</Boton>
          <Boton variante="danger" icono={Trash2} cargando={borrado.isPending} onClick={() => borrado.mutate()}>Eliminar</Boton>
        </>}
      >
        {borrado.isError ? <p role="alert" className={texto.bodySm}>No pudimos eliminar el entrenamiento. Probá de nuevo.</p> : null}
      </Modal>
    </span>
  );
}
