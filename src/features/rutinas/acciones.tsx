/* Acciones sobre las rutinas que comparten la lista, el detalle y la
   navegacion (kit web, Web · 4 y README del kit, "Rutinas"):
   - Poner en curso: archiva la actual y avisa con Deshacer, que vuelve a
     poner en curso la anterior.
   - Eliminar: modal chico con Cancelar a la izquierda (foco inicial) y
     Eliminar a la derecha. Las sesiones quedan en el historial.
   - Nueva rutina: con el limite de rutinas alcanzado abre el aviso en lugar
     del constructor.
   - Duplicar: crea una copia archivada con el nombre al estilo de Windows
     ("Lunes - copia", "Lunes - copia (2)") y avisa con Editar. Copia los dias,
     sus dias de la semana y los ejercicios con su configuracion; no el
     historial. Con el limite alcanzado abre el mismo aviso. */

import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { Modal } from '@/design/components/Modal';
import texto from '@/design/texto.module.css';
import { borradorDeRutina, diasParaGuardar } from '@/lib/constructor';
import {
  activarRutina,
  cargarRutina,
  cargarRutinas,
  eliminarRutina,
  guardarRutinaCompleta,
  MAXIMO_RUTINAS,
  nombreCopia,
  totalRutinas,
  type RutinaResumen,
} from '@/lib/rutinas';

/** Lo que muestra rutinas o sesiones con el nombre de su dia. */
const CLAVES = ['rutinas', 'rutina', 'rutina-activa', 'historial', 'historial-totales', 'actividad', 'ultimas-sesiones'];

function refrescar(cliente: QueryClient) {
  return Promise.all(CLAVES.map((clave) => cliente.invalidateQueries({ queryKey: [clave] })));
}

/** Pone en curso una rutina archivada. */
// eslint-disable-next-line react-refresh/only-export-components
export function usePonerEnCurso() {
  const { user } = useSesion();
  const cliente = useQueryClient();
  const avisar = useAvisos();
  return useCallback(
    async (rutina: Pick<RutinaResumen, 'id' | 'name'>) => {
      const userId = user?.id ?? '';
      const lista = await cliente.fetchQuery({ queryKey: ['rutinas', userId], queryFn: () => cargarRutinas(userId) }).catch(() => null);
      const anterior = lista?.activa && lista.activa.id !== rutina.id ? lista.activa : null;
      try {
        await activarRutina(rutina.id);
      } catch {
        avisar(`No pudimos poner en curso ${rutina.name}.`, 'error');
        return;
      }
      await refrescar(cliente);
      const deshacer = anterior
        ? {
            etiqueta: 'Deshacer',
            alHacer: () =>
              void activarRutina(anterior.id)
                .then(() => refrescar(cliente))
                .catch(() => avisar(`No pudimos volver a poner en curso ${anterior.name}.`, 'error')),
          }
        : undefined;
      avisar(`${rutina.name} está en curso`, 'ok', deshacer);
    },
    [user, cliente, avisar],
  );
}

/** Confirmacion para eliminar una rutina. `rutina` null la deja cerrada. */
export function EliminarRutina({ rutina, onCerrar, alEliminar }: { rutina: RutinaResumen | null; onCerrar: () => void; alEliminar?: () => void }) {
  const cliente = useQueryClient();
  const avisar = useAvisos();
  const borrado = useMutation({
    mutationFn: (id: string) => eliminarRutina(id),
    onSuccess: async () => {
      avisar(`${rutina?.name ?? 'Rutina'} eliminada.`);
      onCerrar();
      alEliminar?.();
      await refrescar(cliente);
    },
  });
  const dias = rutina?.dias.length === 1 ? 'su día' : `sus ${rutina?.dias.length ?? 0} días`;
  const cerrar = () => {
    borrado.reset();
    onCerrar();
  };
  return (
    <Modal
      abierto={rutina !== null}
      chico
      titulo={`Eliminar ${rutina?.name ?? ''}`}
      texto={`Se borra la rutina con ${dias} y los ejercicios de cada uno. Tu historial de sesiones no se toca. No se puede deshacer.`}
      onCerrar={borrado.isPending ? undefined : cerrar}
      pie={
        <>
          <Boton variante="secondary" data-foco-inicial disabled={borrado.isPending} onClick={cerrar}>
            Cancelar
          </Boton>
          <Boton variante="danger" icono={Trash2} cargando={borrado.isPending} onClick={() => rutina && borrado.mutate(rutina.id)}>
            Eliminar
          </Boton>
        </>
      }
    >
      {borrado.isError ? (
        <p role="alert" className={texto.bodySm}>
          No pudimos eliminar la rutina. Probá de nuevo.
        </p>
      ) : null}
    </Modal>
  );
}

/** Abrir el constructor de una rutina nueva, o el aviso si ya hay
 *  MAXIMO_RUTINAS. Sin la lista todavia, abre el constructor: guardar vuelve
 *  a mirar el limite. */
// eslint-disable-next-line react-refresh/only-export-components
export function useNuevaRutina() {
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const navegar = useNavigate();
  const lista = useQuery({ queryKey: ['rutinas', userId], queryFn: () => cargarRutinas(userId), enabled: !!userId });
  const [aviso, setAviso] = useState(false);
  const lleno = lista.data ? totalRutinas(lista.data) >= MAXIMO_RUTINAS : false;

  const abrir = useCallback(() => {
    if (lleno) setAviso(true);
    else navegar('/rutinas/nueva');
  }, [lleno, navegar]);

  return { abrir, modal: <AvisoLimite abierto={aviso} onCerrar={() => setAviso(false)} /> };
}

/** El aviso de que se llego al limite de rutinas. */
function AvisoLimite({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  return (
    <Modal
      abierto={abierto}
      chico
      titulo={`Llegaste a ${MAXIMO_RUTINAS} rutinas`}
      texto={`Por ahora podés tener hasta ${MAXIMO_RUTINAS}, contando la en curso y las archivadas. Eliminá una para crear otra.`}
      onCerrar={onCerrar}
      pie={
        <Boton data-foco-inicial onClick={onCerrar}>
          Entendido
        </Boton>
      }
    />
  );
}

/** Duplica una rutina. `duplicando` es el id de la que se esta copiando. */
// eslint-disable-next-line react-refresh/only-export-components
export function useDuplicarRutina() {
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const cliente = useQueryClient();
  const avisar = useAvisos();
  const navegar = useNavigate();
  const [aviso, setAviso] = useState(false);
  const [duplicando, setDuplicando] = useState<string | null>(null);

  const duplicar = useCallback(
    async (rutina: Pick<RutinaResumen, 'id' | 'name'>) => {
      setDuplicando(rutina.id);
      try {
        // La lista al dia: el limite y los nombres que ya existen.
        const lista = await cliente.fetchQuery({ queryKey: ['rutinas', userId], queryFn: () => cargarRutinas(userId), staleTime: 0 });
        if (totalRutinas(lista) >= MAXIMO_RUTINAS) {
          setAviso(true);
          return;
        }
        const detalle = await cargarRutina(rutina.id);
        if (!detalle) throw new Error('La rutina no existe');
        const nombres = [...(lista.activa ? [lista.activa.name] : []), ...lista.anteriores.map((r) => r.name)];
        const nombre = nombreCopia(detalle.name, nombres);
        // Sin ids: los dias se crean de nuevo y quedan de la copia.
        const dias = diasParaGuardar(borradorDeRutina(detalle)).map((d) => ({ ...d, id: null }));
        const id = await guardarRutinaCompleta(null, nombre, dias, false);
        await refrescar(cliente);
        avisar(`Creaste ${nombre}`, 'ok', { etiqueta: 'Editar', alHacer: () => navegar(`/rutinas/${id}/editar`) });
      } catch {
        avisar(`No pudimos duplicar ${rutina.name}. Probá de nuevo.`, 'error');
      } finally {
        setDuplicando(null);
      }
    },
    [userId, cliente, avisar, navegar],
  );

  return { duplicar, duplicando, modal: <AvisoLimite abierto={aviso} onCerrar={() => setAviso(false)} /> };
}
