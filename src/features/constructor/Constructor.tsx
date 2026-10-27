/* Constructor de rutinas (/rutinas/nueva y /rutinas/:id/editar; kit web,
   Web · 5). Pantalla completa, sin la navegacion lateral: barra arriba,
   catalogo a la izquierda y un dia por columna. Cada ejercicio se configura
   en un modal centrado. Fondo: velada.

   Arrastrar y soltar con dnd-kit:
   - El catalogo es un origen de copia (useDraggable). Mientras se arrastra,
     el ejercicio abre un hueco en el dia de abajo (UID_ARRASTRE).
   - Cada dia es un SortableContext vertical y los dias, uno horizontal.
   - Mientras dura el arrastre se trabaja sobre una copia del borrador
     (vista); al soltar, el resultado entra al borrador como un solo cambio.
   - El catalogo es ademas la zona para quitar lo que viene de un dia.
   - Sin dia bajo el puntero, la zona es invalida y soltar cancela.

   Los cambios viven en un borrador local hasta Guardar o Ctrl S, que escribe
   todo en una transaccion (guardar_rutina_completa). Salir con cambios pide
   confirmar. */

import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRightLeft, Ban, Check, CircleCheck, CloudOff, CornerDownRight, Keyboard, Move, PanelLeftOpen, Pencil, RotateCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker, useLocation, useNavigate, useParams } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Modal } from '@/design/components/Modal';
import { Ruedita } from '@/design/components/Ruedita';
import { Esqueleto, Kbd, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { detalleCatalogo, useCatalogo, type EjercicioCatalogo } from '@/lib/catalogo';
import {
  borradorDeRutina,
  borradorNuevo,
  contarEjercicios,
  diasParaGuardar,
  ejercicioNuevo,
  ordinal,
  problemas,
  reducerBorrador,
  ubicar,
  type Borrador,
  type DiaBorrador,
  type Problema,
} from '@/lib/constructor';
import type { Medidor } from '@/lib/ejercicios';
import type { UnidadDistancia } from '@/lib/distancia';
import { usePerfil, useTemaDeCuenta } from '@/lib/perfil';
import type { UnidadPeso } from '@/lib/peso';
import { cargarRutina, cargarRutinas, guardarRutinaCompleta, type RutinaDetalle } from '@/lib/rutinas';
import { Catalogo, ItemLevantado } from './Catalogo';
import styles from './Constructor.module.css';
import { PanelEjercicio } from './PanelEjercicio';
import { AgregarDia, ContextoDias, Dia, DiaLevantado, TarjetaLevantada, UID_ARRASTRE, type EstadoDia, type Unidades } from './Tablero';
import { borrarBorradorGuardado, useBorrador, type Foto } from './useBorrador';

export function Constructor() {
  const { id } = useParams();
  const navegar = useNavigate();
  useTemaDeCuenta();
  const routineId = id ?? null;
  const rutina = useQuery({
    queryKey: ['rutina', routineId],
    queryFn: () => cargarRutina(routineId!),
    enabled: routineId !== null,
    // Lo que se edita no cambia por volver a la pestaña.
    refetchOnWindowFocus: false,
  });

  if (routineId === null) return <Editor key="nueva" routineId={null} rutina={null} />;

  let aviso;
  if (rutina.isPending) return <Cargando />;
  if (rutina.isError)
    aviso = (
      <>
        <span className={texto.subtitle}>No pudimos cargar la rutina</span>
        <span className={`${texto.bodySm} ${texto.secundario}`}>Revisá tu conexión y probá de nuevo.</span>
        <Boton variante="secondary" icono={RotateCw} onClick={() => void rutina.refetch()}>
          Reintentar
        </Boton>
      </>
    );
  else if (!rutina.data)
    aviso = (
      <>
        <span className={texto.subtitle}>No encontramos esta rutina</span>
        <span className={`${texto.bodySm} ${texto.secundario}`}>Puede que se haya eliminado o que no sea tuya.</span>
        <Boton variante="secondary" icono={ArrowLeft} onClick={() => navegar('/rutinas')}>
          Ir a Rutinas
        </Boton>
      </>
    );
  if (aviso)
    return (
      <>
        <Fondo posicion="velada" />
        <div className={styles.avisoPantalla}>{aviso}</div>
      </>
    );
  return <Editor key={routineId} routineId={routineId} rutina={rutina.data!} />;
}

type Arrastre = { tipo: 'cat'; ejercicio: EjercicioCatalogo } | { tipo: 'ej'; uid: string; origenDia: string; origenIndice: number } | { tipo: 'dia'; uid: string };

type Sobre = 'dia' | 'quitar' | 'nada';

type DatosSobre = { tipo: 'ej'; uid: string; dia: string } | { tipo: 'dia'; dia: string } | { tipo: 'quitar' };

/** Donde queda lo que se suelta. Sobre otra tarjeta de su mismo dia toma
 *  el lugar de esa tarjeta, como muestra el SortableContext al correr las
 *  demas; si no, se queda donde ya esta en la vista. */
function indiceAlSoltar(pos: { dia: DiaBorrador; indice: number }, sobre: DatosSobre | null | undefined, movido: string): number {
  if (sobre?.tipo !== 'ej' || sobre.uid === movido || sobre.dia !== pos.dia.uid) return pos.indice;
  const indice = pos.dia.ejercicios.findIndex((e) => e.uid === sobre.uid);
  return indice < 0 ? pos.indice : indice;
}

type EstadoGuardado = 'reposo' | 'guardando' | 'recien' | 'error';

const MENSAJE_PROBLEMA: Record<Problema, string> = {
  nombre: 'Poné un nombre a la rutina para guardarla.',
  vacia: 'Agregá al menos un ejercicio para guardar la rutina.',
  tiempo: 'Falta el tiempo de un ejercicio de cardio o isométrico.',
};

const CLAVE_CATALOGO_OCULTO = 'frencia:constructor:catalogo-oculto';

function leerOculto(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_CATALOGO_OCULTO) === '1';
  } catch {
    return false;
  }
}

/** Colisiones del constructor. Un dia se reordena contra los otros dias. Un
 *  ejercicio cae en el dia que esta bajo el puntero, junto a la tarjeta mas
 *  cercana; sobre el catalogo, en la zona para quitar; fuera de todo, en
 *  ningun lado (zona invalida). Con teclado no hay puntero: cuenta el
 *  rectangulo de lo que se mueve. */
const deteccion: CollisionDetection = (args) => {
  const tipo = args.active.data.current?.tipo;
  const contenedores = args.droppableContainers;
  const datos = (id: string | number) => contenedores.find((c) => c.id === id)?.data.current;
  if (tipo === 'dia') return closestCenter({ ...args, droppableContainers: contenedores.filter((c) => c.data.current?.tipo === 'dia') });

  const bajo = args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args);
  if (tipo === 'ej') {
    const quitar = bajo.find((c) => c.id === 'quitar');
    if (quitar) return [quitar];
  }
  const columna = bajo.find((c) => datos(c.id)?.tipo === 'dia');
  if (!columna) return [];
  const dia = datos(columna.id)?.dia;
  const tarjetas = contenedores.filter((c) => c.data.current?.tipo === 'ej' && c.data.current.dia === dia);
  if (tarjetas.length === 0) return [columna];
  return closestCorners({ ...args, droppableContainers: tarjetas });
};

function Editor({ routineId, rutina }: { routineId: string | null; rutina: RutinaDetalle | null }) {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const avisar = useAvisos();
  const cliente = useQueryClient();
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const perfil = usePerfil().data;
  const medidor: Medidor = perfil?.medidor_esfuerzo === 'rpe' ? 'rpe' : 'rir';
  const unidades = useMemo<Unidades>(
    () => ({ peso: (perfil?.unidad_peso ?? 'kg') as UnidadPeso, distancia: (perfil?.unidad_distancia ?? 'km') as UnidadDistancia }),
    [perfil?.unidad_peso, perfil?.unidad_distancia],
  );
  const catalogo = useCatalogo();
  const porId = useMemo(() => new Map((catalogo.data ?? []).map((e) => [e.id, e])), [catalogo.data]);

  const [base, setBase] = useState<Borrador>(() => (rutina ? borradorDeRutina(rutina) : borradorNuevo()));
  const { borrador, cambios, foto, despachar, restaurar, reiniciar, recuperado } = useBorrador(routineId, base);

  const [elegido, setElegido] = useState<string>(() => borrador.dias[0].uid);
  const diaElegido = borrador.dias.find((d) => d.uid === elegido) ?? borrador.dias[0];
  const [seleccion, setSeleccion] = useState<{ uid: string; teclado: boolean } | null>(null);
  const [nuevo, setNuevo] = useState<string | null>(null);
  const [oculto, setOculto] = useState(leerOculto);
  const [atajos, setAtajos] = useState(false);
  const [preguntaActivar, setPreguntaActivar] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>(() => ((ubicacion.state as { recien?: boolean } | null)?.recien ? 'recien' : 'reposo'));
  const busqueda = useRef<HTMLInputElement>(null);
  const nombre = useRef<HTMLInputElement>(null);
  // Salir sin preguntar: despues de guardar o descartar a proposito.
  const permitirSalida = useRef(false);
  const alGuardarSalir = useRef<(() => void) | null>(null);

  // Arrastre en curso: que se mueve, la copia de trabajo y donde esta.
  const [arrastre, setArrastre] = useState<Arrastre | null>(null);
  const [vista, setVista] = useState<Borrador | null>(null);
  const [sobre, setSobre] = useState<Sobre>('nada');
  // Los datos de la tarjeta o el dia bajo lo que se arrastra.
  const [sobreDatos, setSobreDatos] = useState<DatosSobre | null>(null);
  // Lo ultimo que aviso onDragOver. Con teclado, si se suelta enseguida de
  // mover, el over que trae onDragEnd puede ser todavia el anterior.
  const ultimoSobre = useRef<DragOverEvent['over']>(null);
  const [conTeclado, setConTeclado] = useState(false);
  const fotoInicio = useRef<Foto>(foto);
  // El clic que cierra un arrastre no abre la configuracion.
  const soltadoEl = useRef(0);
  const mostrado = vista ?? borrador;
  const vistaRef = useRef(mostrado);
  vistaRef.current = mostrado;

  const problemasActuales = problemas(borrador);
  const puedeGuardar = cambios > 0 && problemasActuales.length === 0 && estadoGuardado !== 'guardando';

  // El borrador recuperado de una carga anterior se avisa una sola vez.
  const recuperoAvisado = useRef(false);
  useEffect(() => {
    if (!recuperado || recuperoAvisado.current) return;
    recuperoAvisado.current = true;
    avisar('Recuperamos los cambios que no habías guardado.', 'info', { etiqueta: 'Descartar', alHacer: () => restaurar({ borrador: base, cambios: 0 }) });
  }, [recuperado, avisar, restaurar, base]);

  // "Guardado recien" dura un momento.
  useEffect(() => {
    if (estadoGuardado !== 'recien') return;
    const t = window.setTimeout(() => setEstadoGuardado('reposo'), 3000);
    return () => window.clearTimeout(t);
  }, [estadoGuardado]);

  // Lo recien agregado lleva el borde de lume hasta el proximo clic.
  useEffect(() => {
    if (!nuevo) return;
    const limpiar = () => setNuevo(null);
    document.addEventListener('pointerdown', limpiar, { once: true });
    return () => document.removeEventListener('pointerdown', limpiar);
  }, [nuevo]);

  // Si se va la tarjeta que se configura, el modal se cierra.
  const enPanel = seleccion ? ubicar(borrador, seleccion.uid) : null;

  // Salir con cambios: el modal propio dentro de la app y el del navegador al
  // cerrar o recargar la pestaña.
  const bloqueo = useBlocker(({ currentLocation, nextLocation }) => !permitirSalida.current && cambios > 0 && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (cambios === 0) return;
    const antes = (evento: BeforeUnloadEvent) => evento.preventDefault();
    window.addEventListener('beforeunload', antes);
    return () => window.removeEventListener('beforeunload', antes);
  }, [cambios]);

  const alternarCatalogo = useCallback((valor?: boolean) => {
    setOculto((actual) => {
      const siguiente = valor ?? !actual;
      try {
        window.localStorage.setItem(CLAVE_CATALOGO_OCULTO, siguiente ? '1' : '0');
      } catch {
        // Sin almacenamiento la preferencia dura lo que la pestaña.
      }
      return siguiente;
    });
  }, []);

  const enfocarBusqueda = useCallback(() => {
    alternarCatalogo(false);
    window.requestAnimationFrame(() => busqueda.current?.focus());
  }, [alternarCatalogo]);

  // --- Acciones con aviso y Deshacer -----------------------------------------

  const agregar = useCallback(
    (e: EjercicioCatalogo) => {
      const antes = foto;
      const ejercicio = ejercicioNuevo(e, medidor);
      despachar({ tipo: 'agregarEjercicio', dia: diaElegido.uid, ejercicio });
      setNuevo(ejercicio.uid);
      // Lo recien agregado abre su configuracion para cargarle los datos.
      setSeleccion({ uid: ejercicio.uid, teclado: false });
      avisar(`${e.name} agregado a ${diaElegido.name || 'el día'}`, 'info', { etiqueta: 'Deshacer', alHacer: () => restaurar(antes) });
    },
    [foto, medidor, despachar, diaElegido, avisar, restaurar],
  );

  const quitarEjercicio = useCallback(
    (uid: string) => {
      const pos = ubicar(borrador, uid);
      if (!pos) return;
      const antes = foto;
      despachar({ tipo: 'quitarEjercicio', uid });
      if (seleccion?.uid === uid) setSeleccion(null);
      avisar(`${pos.dia.ejercicios[pos.indice].name} quitado de ${pos.dia.name || 'el día'}`, 'info', { etiqueta: 'Deshacer', alHacer: () => restaurar(antes) });
    },
    [borrador, foto, despachar, seleccion, avisar, restaurar],
  );

  const quitarDia = useCallback(
    (dia: DiaBorrador) => {
      const antes = foto;
      despachar({ tipo: 'quitarDia', dia: dia.uid });
      avisar(`${dia.name || 'Día'} eliminado`, 'info', { etiqueta: 'Deshacer', alHacer: () => restaurar(antes) });
    },
    [foto, despachar, avisar, restaurar],
  );

  const descartar = useCallback(() => {
    const antes = foto;
    restaurar({ borrador: base, cambios: 0 });
    setSeleccion(null);
    avisar('Descartaste los cambios.', 'info', { etiqueta: 'Deshacer', alHacer: () => restaurar(antes) });
  }, [foto, base, restaurar, avisar]);

  const abrir = useCallback((uid: string) => {
    if (Date.now() - soltadoEl.current < 300) return;
    setSeleccion((actual) => (actual?.uid === uid ? actual : { uid, teclado: false }));
  }, []);
  const abrirConTeclado = useCallback((uid: string) => setSeleccion({ uid, teclado: true }), []);

  const agregarEjercicioADia = useCallback(
    (dia: string) => {
      setElegido(dia);
      enfocarBusqueda();
    },
    [enfocarBusqueda],
  );

  // --- Guardar --------------------------------------------------------------

  async function guardar(activar?: boolean) {
    const fallas = problemas(borrador);
    if (fallas.length > 0) {
      avisar(MENSAJE_PROBLEMA[fallas[0]], 'error');
      if (fallas[0] === 'nombre') nombre.current?.focus();
      alGuardarSalir.current = null;
      return;
    }
    if (routineId === null && activar === undefined) {
      // Si ya hay una en curso, se pregunta si la nueva la reemplaza.
      const lista = await cliente.fetchQuery({ queryKey: ['rutinas', userId], queryFn: () => cargarRutinas(userId) }).catch(() => null);
      if (lista?.activa) {
        setPreguntaActivar(true);
        return;
      }
      activar = true;
    }
    setEstadoGuardado('guardando');
    try {
      const id = await guardarRutinaCompleta(routineId, borrador.name, diasParaGuardar(borrador), activar ?? false);
      borrarBorradorGuardado(routineId);
      await Promise.all(['rutinas', 'rutina', 'rutina-activa'].map((clave) => cliente.invalidateQueries({ queryKey: [clave] })));
      avisar('Rutina guardada');
      const salir = alGuardarSalir.current;
      alGuardarSalir.current = null;
      if (salir) {
        permitirSalida.current = true;
        salir();
        return;
      }
      if (routineId === null) {
        permitirSalida.current = true;
        navegar(`/rutinas/${id}/editar`, { replace: true, state: { recien: true } });
        return;
      }
      // Lo guardado pasa a ser la base, con los ids de los dias nuevos.
      const fresca = await cliente.fetchQuery({ queryKey: ['rutina', id], queryFn: () => cargarRutina(id) }).catch(() => null);
      if (fresca) {
        const b = borradorDeRutina(fresca);
        setBase(b);
        reiniciar(b);
        setSeleccion(null);
        setElegido(b.dias[0].uid);
      }
      setEstadoGuardado('recien');
    } catch {
      setEstadoGuardado('error');
      alGuardarSalir.current = null;
      avisar('No pudimos guardar. Tus cambios siguen acá.', 'error', { etiqueta: 'Reintentar', alHacer: () => void guardar(activar) });
    }
  }
  const guardarRef = useRef(guardar);
  guardarRef.current = guardar;

  // --- Atajos ---------------------------------------------------------------

  useEffect(() => {
    function alTeclear(evento: KeyboardEvent) {
      if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === 's') {
        evento.preventDefault();
        if (!arrastre) void guardarRef.current();
        return;
      }
      if (arrastre || document.querySelector('dialog[open]')) return;
      if (evento.key === 'Escape' && seleccion) {
        setSeleccion(null);
        return;
      }
      const destino = evento.target as HTMLElement | null;
      if (evento.ctrlKey || evento.metaKey || evento.altKey || destino?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (evento.key === '/') {
        evento.preventDefault();
        enfocarBusqueda();
      } else if (evento.key === '?') {
        setAtajos(true);
      } else if (evento.key === '[') {
        alternarCatalogo();
      }
    }
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [arrastre, seleccion, enfocarBusqueda, alternarCatalogo]);

  // --- Arrastrar y soltar ---------------------------------------------------

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space', 'Enter'] },
    }),
  );

  function terminar() {
    soltadoEl.current = Date.now();
    setSobreDatos(null);
    setArrastre(null);
    setVista(null);
    setSobre('nada');
    setConTeclado(false);
  }

  function alEmpezar({ active, activatorEvent }: DragStartEvent) {
    const datos = active.data.current;
    fotoInicio.current = foto;
    ultimoSobre.current = null;
    setConTeclado(activatorEvent instanceof KeyboardEvent);
    setSobre('nada');
    if (datos?.tipo === 'cat') {
      setArrastre({ tipo: 'cat', ejercicio: datos.ejercicio });
      setVista(borrador);
    } else if (datos?.tipo === 'ej') {
      const pos = ubicar(borrador, datos.uid);
      if (!pos) return;
      setArrastre({ tipo: 'ej', uid: datos.uid, origenDia: pos.dia.uid, origenIndice: pos.indice });
      setVista(borrador);
      setSobre('dia');
    } else if (datos?.tipo === 'dia') {
      setArrastre({ tipo: 'dia', uid: datos.dia });
    }
  }

  function alPasar({ active, over }: DragOverEvent) {
    const datos = active.data.current;
    if (!datos || datos.tipo === 'dia') return;
    const movido: string = datos.tipo === 'cat' ? UID_ARRASTRE : datos.uid;
    const destino = over?.data.current;
    ultimoSobre.current = over;
    setSobreDatos((destino as DatosSobre | undefined) ?? null);

    if (!over || !destino) {
      setSobre('nada');
      // Fuera de los dias: lo del catalogo cierra su hueco y la tarjeta vuelve
      // a su lugar hasta que se suelte o vuelva a entrar.
      setVista(datos.tipo === 'cat' ? (v) => (v ? reducerBorrador(v, { tipo: 'quitarEjercicio', uid: UID_ARRASTRE }) : v) : borrador);
      return;
    }
    if (destino.tipo === 'quitar') {
      setSobre('quitar');
      setVista(borrador);
      return;
    }
    setSobre('dia');
    const dia: string = destino.dia;
    setVista((v) => {
      const actual = v ?? borrador;
      const pos = ubicar(actual, movido);
      const columna = actual.dias.find((d) => d.uid === dia);
      if (!columna) return actual;
      let indice = columna.ejercicios.length;
      if (destino.tipo === 'ej') {
        if (destino.uid === movido) return actual;
        // Dentro de su mismo dia, la tarjeta la reordena el SortableContext.
        if (datos.tipo === 'ej' && pos?.dia.uid === dia) return actual;
        indice = columna.ejercicios.findIndex((e) => e.uid === destino.uid);
        const levantada = active.rect.current.translated;
        const centro = levantada ? levantada.top + levantada.height / 2 : 0;
        if (centro > over.rect.top + over.rect.height / 2) indice += 1;
        if (pos && pos.dia.uid === dia && pos.indice < indice) indice -= 1;
      } else if (pos?.dia.uid === dia) {
        return actual;
      }
      if (!pos) {
        const hueco = { ...ejercicioNuevo(datos.ejercicio, medidor), uid: UID_ARRASTRE };
        return reducerBorrador(actual, { tipo: 'agregarEjercicio', dia, ejercicio: hueco, indice });
      }
      if (pos.dia.uid === dia && pos.indice === indice) return actual;
      return reducerBorrador(actual, { tipo: 'moverEjercicio', uid: movido, dia, indice });
    });
  }

  function alSoltar({ active, over: overEvento }: DragEndEvent) {
    const over = overEvento && overEvento.id === active.id && ultimoSobre.current ? ultimoSobre.current : overEvento;
    ultimoSobre.current = null;
    const datos = active.data.current;
    const actual = arrastre;
    const final = vista;
    terminar();
    if (!datos || !actual) return;

    if (actual.tipo === 'dia') {
      if (!over || over.id === active.id) return;
      const indice = borrador.dias.findIndex((d) => `dia:${d.uid}` === over.id);
      if (indice >= 0) despachar({ tipo: 'moverDia', dia: actual.uid, indice });
      return;
    }
    if (!over || !final) return;
    if (over.data.current?.tipo === 'quitar' && actual.tipo === 'ej') {
      quitarEjercicio(actual.uid);
      return;
    }

    let resultado = final;
    const movido = actual.tipo === 'cat' ? UID_ARRASTRE : actual.uid;
    const pos = ubicar(resultado, movido);
    if (!pos) return;
    const indice = indiceAlSoltar(pos, over.data.current as DatosSobre | undefined, movido);
    if (indice !== pos.indice) resultado = reducerBorrador(resultado, { tipo: 'moverEjercicio', uid: movido, dia: pos.dia.uid, indice });

    if (actual.tipo === 'cat') {
      const ejercicio = ejercicioNuevo(actual.ejercicio, medidor);
      resultado = {
        ...resultado,
        dias: resultado.dias.map((d) => ({ ...d, ejercicios: d.ejercicios.map((e) => (e.uid === UID_ARRASTRE ? ejercicio : e)) })),
      };
      const antes = fotoInicio.current;
      despachar({ tipo: 'restaurar', borrador: resultado });
      setNuevo(ejercicio.uid);
      setElegido(pos.dia.uid);
      setSeleccion({ uid: ejercicio.uid, teclado: false });
      avisar(`${ejercicio.name} agregado a ${pos.dia.name || 'el día'}`, 'info', { etiqueta: 'Deshacer', alHacer: () => restaurar(antes) });
      return;
    }
    despachar({ tipo: 'restaurar', borrador: resultado });
  }

  // Lo que se lee mientras se arrastra: el dia y la posicion de lo movido.
  const movido = arrastre?.tipo === 'cat' ? UID_ARRASTRE : arrastre?.tipo === 'ej' ? arrastre.uid : null;
  const ubicado = movido ? ubicar(mostrado, movido) : null;
  const posMovido = ubicado && movido ? { dia: ubicado.dia, indice: indiceAlSoltar(ubicado, sobreDatos, movido) } : null;
  const invalido = arrastre !== null && arrastre.tipo !== 'dia' && (sobre === 'nada' || !posMovido);

  function estadoDia(dia: DiaBorrador): EstadoDia {
    if (!arrastre || arrastre.tipo === 'dia' || sobre !== 'dia' || !posMovido) return null;
    return posMovido.dia.uid === dia.uid ? 'destino' : 'atenuado';
  }

  let sello: { icono: typeof Ban; texto: string; tono?: 'tinta' } | null = null;
  if (arrastre && arrastre.tipo !== 'dia') {
    if (invalido) sello = { icono: Ban, texto: 'Soltá dentro de un día', tono: 'tinta' };
    else if (sobre === 'dia' && posMovido && arrastre.tipo === 'cat') sello = { icono: CornerDownRight, texto: `Agregar a ${posMovido.dia.name || 'el día'} · ${ordinal(posMovido.indice + 1)}` };
    else if (sobre === 'dia' && posMovido && arrastre.tipo === 'ej' && posMovido.dia.uid !== arrastre.origenDia)
      sello = { icono: ArrowRightLeft, texto: `Mover a ${posMovido.dia.name || 'el día'} · ${ordinal(posMovido.indice + 1)}` };
  }

  const nombreDe = (uid: string) => {
    const pos = ubicar(vistaRef.current, uid);
    return pos ? pos.dia.ejercicios[pos.indice].name : 'Ejercicio';
  };
  const anuncios: Announcements = {
    onDragStart: ({ active }) => {
      const d = active.data.current;
      if (d?.tipo === 'dia') return `${vistaRef.current.dias.find((x) => x.uid === d.dia)?.name ?? 'Día'} levantado`;
      if (d?.tipo === 'cat') return `${d.ejercicio.name} levantado del catálogo`;
      const pos = d ? ubicar(vistaRef.current, d.uid) : null;
      return pos ? `${nombreDe(d!.uid)} levantado · ${pos.indice + 1} de ${pos.dia.ejercicios.length} en ${pos.dia.name}` : 'Levantado';
    },
    onDragOver: ({ active, over }) => {
      const d = active.data.current;
      if (!over) return 'Fuera de los días';
      if (over.id === 'quitar') return 'Sobre el catálogo: al soltar se quita del día';
      const uid = d?.tipo === 'cat' ? UID_ARRASTRE : d?.uid;
      const pos = uid ? ubicar(vistaRef.current, uid) : null;
      return pos ? `Movido a ${pos.dia.name}, posición ${pos.indice + 1}` : undefined;
    },
    onDragEnd: ({ over }) => (over ? 'Soltado' : 'Cancelado: fuera de los días no se puede soltar'),
    onDragCancel: ({ active }) => {
      const d = active.data.current;
      const pos = d?.tipo === 'ej' ? ubicar(borrador, d.uid) : null;
      return pos ? `Cancelado: vuelve a ${pos.dia.name}, posición ${pos.indice + 1}` : 'Cancelado';
    },
  };

  // --- Partes -----------------------------------------------------------------

  const enArrastreEj = arrastre?.tipo === 'ej' ? arrastre : null;
  const levantado = enArrastreEj ? ubicar(mostrado, enArrastreEj.uid) : null;
  const diaLevantado = arrastre?.tipo === 'dia' ? borrador.dias.find((d) => d.uid === arrastre.uid) : null;

  let panel = null;
  if (enPanel && seleccion) {
    const { dia, indice } = enPanel;
    const ejercicio = dia.ejercicios[indice];
    const cat = porId.get(ejercicio.exerciseId);
    panel = (
      <PanelEjercicio
        key={ejercicio.uid}
        ejercicio={ejercicio}
        rotulo={`${dia.name || 'Día'} · ejercicio ${indice + 1} de ${dia.ejercicios.length}`}
        detalle={cat ? detalleCatalogo(cat) || null : null}
        unidades={unidades}
        despachar={despachar}
        onCerrar={() => setSeleccion(null)}
        onQuitar={() => quitarEjercicio(ejercicio.uid)}
      />
    );
  }

  const textoCambios = cambios === 1 ? 'el cambio' : `los ${cambios} cambios`;

  return (
    <>
      <Fondo posicion="velada" />
      <div className={styles.pantalla}>
        <Barra
          nombre={borrador.name}
          nombreRef={nombre}
          nueva={routineId === null}
          cambios={cambios}
          estado={estadoGuardado}
          puedeGuardar={puedeGuardar}
          motivo={problemasActuales.length > 0 ? MENSAJE_PROBLEMA[problemasActuales[0]] : null}
          catalogoOculto={oculto}
          onNombre={(valor) => despachar({ tipo: 'nombre', valor })}
          onVolver={() => navegar(routineId ? `/rutinas/${routineId}` : '/rutinas')}
          onMostrarCatalogo={() => alternarCatalogo(false)}
          onAtajos={() => setAtajos(true)}
          onDescartar={descartar}
          onGuardar={() => void guardar()}
        />
        <DndContext
          sensors={sensores}
          collisionDetection={deteccion}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          accessibility={{
            announcements: anuncios,
            screenReaderInstructions: {
              draggable: 'Espacio levanta el ejercicio. Las flechas lo mueven; izquierda y derecha lo llevan a otro día. Espacio lo suelta y Escape cancela.',
            },
          }}
          onDragStart={alEmpezar}
          onDragOver={alPasar}
          onDragEnd={alSoltar}
          onDragCancel={terminar}
        >
          <div className={`${styles.cuerpo} ${oculto ? styles.sinCatalogo : ''}`}>
            {oculto ? null : (
              <Catalogo
                catalogo={catalogo.data}
                cargando={catalogo.isPending}
                error={catalogo.isError}
                onReintentar={() => void catalogo.refetch()}
                onAgregar={agregar}
                diaElegido={diaElegido.name || 'el día'}
                onOcultar={() => alternarCatalogo(true)}
                quitarDe={enArrastreEj ? (borrador.dias.find((d) => d.uid === enArrastreEj.origenDia)?.name ?? 'el día') : null}
                sobreQuitar={sobre === 'quitar'}
                busquedaRef={busqueda}
              />
            )}
            <div className={styles.tablero} data-arrastrando={arrastre ? '' : undefined}>
              <ContextoDias dias={mostrado.dias}>
                {mostrado.dias.map((d, i) => (
                  <Dia
                    key={d.uid}
                    dia={d}
                    indice={i}
                    total={mostrado.dias.length}
                    estado={estadoDia(d)}
                    seleccion={seleccion?.uid ?? null}
                    nuevo={nuevo}
                    hueco={movido}
                    origen={enArrastreEj && posMovido && posMovido.dia.uid !== d.uid && enArrastreEj.origenDia === d.uid ? enArrastreEj.origenIndice : null}
                    unidades={unidades}
                    despachar={despachar}
                    onElegir={setElegido}
                    onAbrir={abrir}
                    onAbrirTeclado={abrirConTeclado}
                    onAgregarEjercicio={agregarEjercicioADia}
                    onQuitarDia={quitarDia}
                  />
                ))}
              </ContextoDias>
              <AgregarDia total={borrador.dias.length} onAgregar={() => despachar({ tipo: 'agregarDia' })} />
              {contarEjercicios(borrador) === 0 ? (
                <Tarjeta className={styles.pista}>
                  <span className={`${texto.label} ${texto.acento}`}>Cómo se arma</span>
                  <span className={`${texto.bodySm} ${texto.primario}`}>Arrastrá ejercicios del catálogo a un día, o elegí un día y tocá + en el ejercicio.</span>
                  <span className={`${texto.bodySm} ${texto.secundario}`}>
                    Cada ejercicio se configura en el modal que se abre al agregarlo o al hacer clic. Guardar se habilita con un nombre y al menos un ejercicio.
                  </span>
                </Tarjeta>
              ) : null}
            </div>
            {panel}
            {conTeclado && levantado ? (
              <div className={styles.anuncio} aria-hidden="true">
                <Icono icono={Move} tamano={18} className={texto.acento} />
                <span className={`${texto.bodySm} ${texto.primario}`}>
                  <span className={texto.semi}>{levantado.dia.ejercicios[levantado.indice].name}</span> levantado · {levantado.indice + 1} de {levantado.dia.ejercicios.length} en {levantado.dia.name}
                </span>
                <span className={`${texto.bodySm} ${texto.terciario} ${styles.teclas}`}>
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> mover <Kbd>←</Kbd>
                  <Kbd>→</Kbd> otro día <Kbd>Espacio</Kbd> soltar <Kbd>Esc</Kbd> cancelar
                </span>
              </div>
            ) : null}
          </div>
          <DragOverlay dropAnimation={null}>
            {arrastre?.tipo === 'cat' ? (
              <div className={styles.flotaCatalogo}>
                <ItemLevantado ejercicio={arrastre.ejercicio} invalido={invalido} />
                <Sello sello={sello} />
              </div>
            ) : levantado && enArrastreEj ? (
              <div className={styles.flota}>
                <TarjetaLevantada
                  ejercicio={levantado.dia.ejercicios[levantado.indice]}
                  numero={levantado.indice + 1}
                  unidades={unidades}
                  estado={sobre === 'quitar' ? 'quitar' : invalido ? 'invalida' : 'ok'}
                />
                <Sello sello={sello} />
              </div>
            ) : diaLevantado ? (
              <DiaLevantado dia={diaLevantado} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Modal
        abierto={bloqueo.state === 'blocked' && !preguntaActivar}
        titulo="Tenés cambios sin guardar"
        texto={`Si salís ahora, se pierden ${textoCambios} que hiciste en ${borrador.name.trim() || 'la rutina nueva'}.`}
        onCerrar={() => bloqueo.reset?.()}
        pie={
          <>
            <Boton
              icono={Check}
              data-foco-inicial
              cargando={estadoGuardado === 'guardando'}
              onClick={() => {
                alGuardarSalir.current = () => bloqueo.proceed?.();
                void guardar();
              }}
            >
              Guardar y salir
            </Boton>
            <Boton
              variante="danger"
              onClick={() => {
                borrarBorradorGuardado(routineId);
                permitirSalida.current = true;
                bloqueo.proceed?.();
              }}
            >
              Descartar
            </Boton>
            <Boton variante="ghost" onClick={() => bloqueo.reset?.()}>
              Seguir editando
            </Boton>
          </>
        }
      />

      <Modal
        abierto={preguntaActivar}
        chico
        titulo="¿La ponés en curso?"
        texto="Ya tenés una rutina en curso. Si ponés esta en su lugar, la actual pasa a Anteriores con su historial."
        onCerrar={() => {
          setPreguntaActivar(false);
          alGuardarSalir.current = null;
          bloqueo.reset?.();
        }}
        pie={
          <>
            <Boton
              icono={Check}
              data-foco-inicial
              onClick={() => {
                setPreguntaActivar(false);
                void guardar(true);
              }}
            >
              Ponerla en curso
            </Boton>
            <Boton
              variante="ghost"
              onClick={() => {
                setPreguntaActivar(false);
                void guardar(false);
              }}
            >
              Guardarla sin activar
            </Boton>
          </>
        }
      />

      <Modal abierto={atajos} chico titulo="Atajos de teclado" onCerrar={() => setAtajos(false)}>
        <dl className={styles.atajos}>
          {[
            [['Ctrl', 'S'], 'Guardar'],
            [['/'], 'Buscar en el catálogo'],
            [['['], 'Mostrar u ocultar el catálogo'],
            [['Espacio'], 'Sobre el agarre, levantar o soltar el ejercicio'],
            [['←', '→'], 'Con una tarjeta levantada, cambiarla de día'],
            [['Enter'], 'Configurar la tarjeta enfocada'],
            [['Esc'], 'Cancelar el arrastre o cerrar el modal'],
            [['?'], 'Ver estos atajos'],
          ].map(([teclas, que]) => (
            <div key={que as string} className={styles.atajo}>
              <dt className={styles.teclas}>
                {(teclas as string[]).map((t) => (
                  <Kbd key={t}>{t}</Kbd>
                ))}
              </dt>
              <dd className={`${texto.bodySm} ${texto.secundario}`}>{que as string}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    </>
  );
}

function Sello({ sello }: { sello: { icono: typeof Ban; texto: string; tono?: 'tinta' } | null }) {
  if (!sello) return null;
  return (
    <span className={`${styles.sello} ${sello.tono === 'tinta' ? styles.selloTinta : ''}`}>
      <Icono icono={sello.icono} tamano={14} />
      {sello.texto}
    </span>
  );
}

interface PropsBarra {
  nombre: string;
  nombreRef: React.RefObject<HTMLInputElement | null>;
  nueva: boolean;
  cambios: number;
  estado: EstadoGuardado;
  puedeGuardar: boolean;
  motivo: string | null;
  catalogoOculto: boolean;
  onNombre: (valor: string) => void;
  onVolver: () => void;
  onMostrarCatalogo: () => void;
  onAtajos: () => void;
  onDescartar: () => void;
  onGuardar: () => void;
}

function Barra({ nombre, nombreRef, nueva, cambios, estado, puedeGuardar, motivo, catalogoOculto, onNombre, onVolver, onMostrarCatalogo, onAtajos, onDescartar, onGuardar }: PropsBarra) {
  let estadoTexto;
  if (estado === 'guardando')
    estadoTexto = (
      <>
        <Ruedita />
        Guardando…
      </>
    );
  else if (estado === 'error')
    estadoTexto = (
      <span className={styles.estadoError}>
        <Icono icono={CloudOff} tamano={16} />
        No se guardó
      </span>
    );
  else if (cambios > 0)
    estadoTexto = (
      <>
        <span className={styles.punto} />
        Cambios sin guardar · {cambios}
      </>
    );
  else if (estado === 'recien')
    estadoTexto = (
      <>
        <Icono icono={Check} tamano={16} className={texto.acento} disparo={estado} />
        Guardado recién
      </>
    );
  else if (nueva) estadoTexto = <>Rutina nueva · sin guardar</>;
  else
    estadoTexto = (
      <>
        <Icono icono={CircleCheck} tamano={16} />
        Guardado
      </>
    );

  return (
    <header className={styles.barra}>
      <BotonIcono icono={ArrowLeft} etiqueta={nueva ? 'Volver a Rutinas' : 'Volver a la rutina'} onClick={onVolver} />
      <label className={styles.nombre}>
        <input
          ref={nombreRef}
          className={styles.nombreCampo}
          value={nombre}
          placeholder="Nombre de la rutina"
          aria-label="Nombre de la rutina"
          maxLength={60}
          autoFocus={nueva}
          onChange={(evento) => onNombre(evento.target.value)}
        />
        <Icono icono={Pencil} tamano={14} className={texto.terciario} />
      </label>
      <span className={styles.estado} role="status">
        {estadoTexto}
      </span>
      <span className={styles.crece} />
      {catalogoOculto ? <BotonIcono icono={PanelLeftOpen} etiqueta="Mostrar catálogo  [" onClick={onMostrarCatalogo} /> : null}
      <BotonIcono icono={Keyboard} etiqueta="Atajos de teclado  ?" onClick={onAtajos} />
      {cambios > 0 || estado === 'error' ? (
        <Boton variante="ghost" onClick={onDescartar} disabled={estado === 'guardando'}>
          Descartar
        </Boton>
      ) : null}
      <Boton
        icono={Check}
        cargando={estado === 'guardando'}
        aria-disabled={!puedeGuardar || undefined}
        className={puedeGuardar ? '' : styles.guardarOff}
        title={motivo ?? (cambios === 0 ? 'No hay cambios para guardar' : 'Guardar (Ctrl S)')}
        onClick={() => {
          if (puedeGuardar || estado === 'error' || motivo) onGuardar();
        }}
      >
        {estado === 'guardando' ? 'Guardando…' : 'Guardar'}
      </Boton>
      <span className={styles.atajoGuardar} aria-hidden="true">
        <Kbd>Ctrl</Kbd>
        <Kbd>S</Kbd>
      </span>
    </header>
  );
}

function Cargando() {
  return (
    <>
      <Fondo posicion="velada" />
      <div className={styles.pantalla} aria-busy="true">
        <header className={styles.barra}>
          <Esqueleto className={styles.esqNombre} />
        </header>
        <div className={styles.cuerpo}>
          <div className={styles.esqCatalogo} />
          <div className={styles.tablero}>
            {[0, 1, 2].map((i) => (
              <Tarjeta key={i} className={styles.esqDia}>
                <Esqueleto className={styles.esqTitulo} />
                <Esqueleto />
                <Esqueleto className={styles.esqTarjeta} />
                <Esqueleto className={styles.esqTarjeta} />
              </Tarjeta>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
