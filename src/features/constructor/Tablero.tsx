/* Tablero del constructor (kit web, Web · 5, .w-tablero): un dia por
   columna, con su nombre, los dias de la semana y sus ejercicios. Los dias
   se reordenan arrastrando el agarre de la cabecera; los ejercicios, solo
   desde el agarre de la derecha (los seis puntos). El resto de la tarjeta
   abre su configuracion: al hover se vela y muestra Editar. Con teclado, Espacio
   sobre el agarre la levanta. */

import { useSortable, SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, ArrowRight, Copy, GripVertical, MousePointer2, Pencil, Plus, Trash2 } from 'lucide-react';
import { memo, type MouseEvent, type ReactNode } from 'react';

import { Boton } from '@/design/components/Boton';
import { Resumen, Tipo } from '@/design/components/datos';
import { Icono } from '@/design/components/Icono';
import { Menu } from '@/design/components/Menu';
import { SemanaEditable } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { MAX_DIAS, type Accion, type DiaBorrador, type EjercicioBorrador } from '@/lib/constructor';
import type { UnidadDistancia } from '@/lib/distancia';
import type { UnidadPeso } from '@/lib/peso';
import { resumenEjercicio } from '@/lib/rutinas';
import styles from './Tablero.module.css';

/** Uid del hueco que abre un ejercicio arrastrado desde el catalogo. */
export const UID_ARRASTRE = 'arrastre';

export interface Unidades {
  peso: UnidadPeso;
  distancia: UnidadDistancia;
}

/** Como se ve un dia mientras se arrastra algo. */
export type EstadoDia = 'destino' | 'atenuado' | null;

interface PropsDia {
  dia: DiaBorrador;
  indice: number;
  total: number;
  estado: EstadoDia;
  seleccion: string | null;
  nuevo: string | null;
  /** Uid de la tarjeta que se arrastra o del hueco de lo que entra del
   *  catalogo: en su lugar se dibuja el hueco. */
  hueco: string | null;
  /** Donde estaba la tarjeta que se lleva a otro dia, hasta soltarla. */
  origen: number | null;
  unidades: Unidades;
  despachar: (a: Accion) => void;
  onElegir: (dia: string) => void;
  onAbrir: (uid: string) => void;
  onAbrirTeclado: (uid: string) => void;
  onAgregarEjercicio: (dia: string) => void;
  onQuitarDia: (dia: DiaBorrador) => void;
}

export const Dia = memo(function Dia({
  dia,
  indice,
  total,
  estado,
  seleccion,
  nuevo,
  hueco,
  origen,
  unidades,
  despachar,
  onElegir,
  onAbrir,
  onAbrirTeclado,
  onAgregarEjercicio,
  onQuitarDia,
}: PropsDia) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `dia:${dia.uid}`,
    data: { tipo: 'dia', dia: dia.uid },
    attributes: { roleDescription: 'día arrastrable' },
  });
  const clases = [styles.dia, estado === 'destino' ? styles.destino : '', estado === 'atenuado' ? styles.atenuado : '', isDragging ? styles.diaLevantado : ''].join(' ');

  return (
    <section
      ref={setNodeRef}
      // El transform del arrastre se conoce recien al mover.
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={clases}
      aria-label={dia.name || `Día ${indice + 1}`}
      onPointerDown={() => onElegir(dia.uid)}
      onFocus={() => onElegir(dia.uid)}
    >
      <CabezaDia
        dia={dia}
        indice={indice}
        total={total}
        agarreRef={setActivatorNodeRef}
        attributes={attributes}
        listeners={listeners}
        despachar={despachar}
        onQuitarDia={onQuitarDia}
      />

      <SortableContext items={dia.ejercicios.map((e) => `ej:${e.uid}`)} strategy={verticalListSortingStrategy}>
        <ol className={styles.lista}>
          {dia.ejercicios.length === 0 ? (
            <li className={styles.vacio}>
              <Icono icono={MousePointer2} tamano={16} />
              Arrastrá ejercicios del catálogo o tocá + en uno
            </li>
          ) : null}
          {dia.ejercicios.map((e, i) => (
            <FilaLista key={e.uid} origenAntes={origen === i}>
              <TarjetaOrdenable
                ejercicio={e}
                numero={i + 1}
                dia={dia.uid}
                hueco={e.uid === hueco}
                seleccionada={e.uid === seleccion}
                nueva={e.uid === nuevo}
                unidades={unidades}
                onAbrir={onAbrir}
                onAbrirTeclado={onAbrirTeclado}
              />
            </FilaLista>
          ))}
          {origen !== null && origen >= dia.ejercicios.length ? <li className={styles.origen} aria-hidden="true" /> : null}
        </ol>
      </SortableContext>

      <AgregarEjercicio dia={dia.uid} onAgregar={onAgregarEjercicio} />
    </section>
  );
});

type Ordenable = ReturnType<typeof useSortable>;

interface PropsCabeza {
  dia: DiaBorrador;
  indice: number;
  total: number;
  agarreRef: Ordenable['setActivatorNodeRef'];
  attributes: Ordenable['attributes'];
  listeners: Ordenable['listeners'];
  despachar: (a: Accion) => void;
  onQuitarDia: (dia: DiaBorrador) => void;
}

/** La cabecera de un dia, aparte y con memo: useSortable vuelve a dibujar el
 *  dia en cada movimiento del puntero, y la cabecera no cambia mientras se
 *  arrastra. */
const CabezaDia = memo(function CabezaDia({ dia, indice, total, agarreRef, attributes, listeners, despachar, onQuitarDia }: PropsCabeza) {
  const n = dia.ejercicios.filter((e) => e.uid !== UID_ARRASTRE).length;
  return (
    <div className={styles.cabeza}>
      <div className={styles.cabezaFila}>
        <button ref={agarreRef} type="button" className={styles.agarreDia} aria-label={`Mover ${dia.name}`} {...attributes} {...listeners}>
          <Icono icono={GripVertical} tamano={16} />
        </button>
        <input
          className={`${texto.subtitle} ${styles.nombreDia}`}
          value={dia.name}
          placeholder={`Día ${indice + 1}`}
          aria-label="Nombre del día"
          maxLength={40}
          onChange={(evento) => despachar({ tipo: 'nombreDia', dia: dia.uid, valor: evento.target.value })}
        />
        <span className={`${texto.label} ${texto.terciario}`} aria-label={`${n} ejercicios`}>
          {n}
        </span>
        <Menu
          etiqueta={`Acciones de ${dia.name || `Día ${indice + 1}`}`}
          opciones={[
            { etiqueta: 'Mover a la izquierda', icono: ArrowLeft, disabled: indice === 0, alElegir: () => despachar({ tipo: 'moverDia', dia: dia.uid, indice: indice - 1 }) },
            { etiqueta: 'Mover a la derecha', icono: ArrowRight, disabled: indice === total - 1, alElegir: () => despachar({ tipo: 'moverDia', dia: dia.uid, indice: indice + 1 }) },
            { etiqueta: 'Duplicar día', icono: Copy, disabled: total >= MAX_DIAS, alElegir: () => despachar({ tipo: 'duplicarDia', dia: dia.uid }) },
            { etiqueta: 'Eliminar día', icono: Trash2, peligro: true, disabled: total <= 1, alElegir: () => onQuitarDia(dia) },
          ]}
        />
      </div>
      <SemanaEditable
        etiqueta={`Días de la semana de ${dia.name || `Día ${indice + 1}`}`}
        marcados={dia.weekdays}
        onAlternar={(weekday) => despachar({ tipo: 'semana', dia: dia.uid, weekday })}
      />
    </div>
  );
});

const AgregarEjercicio = memo(function AgregarEjercicio({ dia, onAgregar }: { dia: string; onAgregar: (dia: string) => void }) {
  return (
    <Boton variante="ghost" tamano="sm" icono={Plus} className={styles.agregar} onClick={() => onAgregar(dia)}>
      Agregar ejercicio
    </Boton>
  );
});

function FilaLista({ origenAntes, children }: { origenAntes: boolean; children: ReactNode }) {
  return (
    <>
      {origenAntes ? <li className={styles.origen} aria-hidden="true" /> : null}
      <li className={styles.item}>{children}</li>
    </>
  );
}

interface PropsTarjeta {
  ejercicio: EjercicioBorrador;
  numero: number;
  dia: string;
  hueco: boolean;
  seleccionada: boolean;
  nueva: boolean;
  unidades: Unidades;
  onAbrir: (uid: string) => void;
  onAbrirTeclado: (uid: string) => void;
}

const TarjetaOrdenable = memo(function TarjetaOrdenable({ ejercicio, numero, dia, hueco, seleccionada, nueva, unidades, onAbrir, onAbrirTeclado }: PropsTarjeta) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: `ej:${ejercicio.uid}`,
    data: { tipo: 'ej', uid: ejercicio.uid, dia },
    attributes: { roleDescription: 'ejercicio arrastrable' },
    transition: { duration: 180, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  });

  // Dos controles: la tarjeta abre la configuracion (clic, Enter o Espacio) y solo el
  // agarre de la derecha arrastra (con teclado, Espacio la levanta).
  return (
    <div
      ref={setNodeRef}
      // El transform del arrastre se conoce recien al mover.
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`${styles.tarjeta} ${hueco ? styles.hueco : ''} ${seleccionada ? styles.seleccionada : ''} ${nueva ? styles.nueva : ''}`}
    >
      <button
        type="button"
        className={styles.abrir}
        aria-label={`Editar ${ejercicio.name}, ${numero}º`}
        aria-current={seleccionada || undefined}
        onClick={(evento: MouseEvent) => {
          evento.stopPropagation();
          // Sin detalle de clic, lo activo el teclado.
          if (evento.detail === 0) onAbrirTeclado(ejercicio.uid);
          else onAbrir(ejercicio.uid);
        }}
      >
        <ContenidoTarjeta ejercicio={ejercicio} numero={numero} unidades={unidades} />
        <VeloEditar />
      </button>
      <button ref={setActivatorNodeRef} type="button" className={styles.agarre} {...attributes} {...listeners} aria-label={`Mover ${ejercicio.name}`}>
        <Icono icono={GripVertical} tamano={16} />
      </button>
    </div>
  );
});

// Con memo, como el resto de lo que va adentro de algo ordenable: useSortable
// vuelve a dibujar la tarjeta en cada movimiento del puntero.
const ContenidoTarjeta = memo(function ContenidoTarjeta({ ejercicio, numero, unidades }: { ejercicio: EjercicioBorrador; numero: number; unidades: Unidades }) {
  return (
    <>
      <span className={styles.numero}>{String(numero).padStart(2, '0')}</span>
      <Tipo tipo={ejercicio.kind} />
      <span className={styles.textos}>
        <span className={`${texto.bodySm} ${texto.semi} ${texto.primario} ${styles.unaLinea}`}>{ejercicio.name}</span>
        <Resumen {...resumenEjercicio(ejercicio, unidades.peso, unidades.distancia)} />
      </span>
    </>
  );
});

/** Lo que muestra el hover de una tarjeta de un dia, fuera del agarre: un
 *  velo que tapa el contenido y, al centro, Editar. El clic abre su configuracion. */
const VeloEditar = memo(function VeloEditar() {
  return (
    <span className={styles.editar} aria-hidden="true">
      <Icono icono={Pencil} tamano={16} />
      Editar
    </span>
  );
});

/** La copia de la tarjeta que sigue al puntero (DragOverlay). */
export function TarjetaLevantada({ ejercicio, numero, unidades, estado }: { ejercicio: EjercicioBorrador; numero: number; unidades: Unidades; estado: 'ok' | 'invalida' | 'quitar' }) {
  return (
    <div className={`${styles.tarjeta} ${styles.levantada} ${estado === 'invalida' ? styles.invalida : ''} ${estado === 'quitar' ? styles.quitar : ''}`}>
      <span className={styles.abrir}>
        <ContenidoTarjeta ejercicio={ejercicio} numero={numero} unidades={unidades} />
      </span>
      <span className={styles.agarre} aria-hidden="true">
        <Icono icono={GripVertical} tamano={16} />
      </span>
    </div>
  );
}

/** La copia de un dia que se reordena. */
export function DiaLevantado({ dia }: { dia: DiaBorrador }) {
  return (
    <div className={`${styles.dia} ${styles.levantadoDia}`}>
      <span className={texto.subtitle}>{dia.name}</span>
      <span className={`${texto.label} ${texto.terciario}`}>
        {dia.ejercicios.length} {dia.ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}
      </span>
    </div>
  );
}

export function AgregarDia({ total, onAgregar }: { total: number; onAgregar: () => void }) {
  const lleno = total >= MAX_DIAS;
  return (
    <button type="button" className={styles.diaNuevo} onClick={onAgregar} disabled={lleno} title={lleno ? 'Una rutina tiene hasta 7 días' : undefined}>
      <Icono icono={Plus} tamano={24} />
      <span className={`${texto.bodySm} ${texto.semi}`}>Agregar día</span>
      <span className={`${texto.label} ${texto.terciario}`}>
        {total} de {MAX_DIAS}
      </span>
    </button>
  );
}

/** Lista horizontal de dias, ordenable por la cabecera. */
export function ContextoDias({ dias, children }: { dias: DiaBorrador[]; children: ReactNode }) {
  return (
    <SortableContext items={dias.map((d) => `dia:${d.uid}`)} strategy={horizontalListSortingStrategy}>
      {children}
    </SortableContext>
  );
}
