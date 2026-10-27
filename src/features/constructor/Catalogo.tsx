/* Catalogo del constructor (kit web, Web · 5, .w-catalogo): busqueda, chips
   por tipo, selector de grupo muscular y la lista. Cada ejercicio es un
   origen de copia: se arrastra a un dia sin salir de la lista, o se agrega
   con + al dia elegido. Mientras se arrastra una tarjeta de un dia, todo el
   catalogo es la zona para quitarla (la unica en carmin). */

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ChevronsUpDown, Dumbbell, Footprints, GripVertical, HeartPulse, PanelLeftClose, Plus, RotateCw, Search, Target, Timer, Trash2, X } from 'lucide-react';
import { memo, useMemo, useState, type PointerEventHandler, type Ref } from 'react';

import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { Tipo } from '@/design/components/datos';
import { Icono, IconosQuietos } from '@/design/components/Icono';
import { Chip, Esqueleto, Kbd } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { detalleCatalogo, filtrarCatalogo, gruposDelCatalogo, type EjercicioCatalogo } from '@/lib/catalogo';
import type { TipoEjercicio } from '@/lib/ejercicios';
import styles from './Catalogo.module.css';

const TIPOS: { valor: TipoEjercicio | 'todos'; etiqueta: string; icono?: typeof Dumbbell }[] = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'fuerza', etiqueta: 'Fuerza', icono: Dumbbell },
  { valor: 'isometrico', etiqueta: 'Isométrico', icono: Timer },
  { valor: 'cardio', etiqueta: 'Cardio', icono: HeartPulse },
  { valor: 'hibrido', etiqueta: 'Híbrido', icono: Footprints },
];

interface Props {
  catalogo: EjercicioCatalogo[] | undefined;
  cargando: boolean;
  error: boolean;
  onReintentar: () => void;
  onAgregar: (e: EjercicioCatalogo) => void;
  /** Nombre del dia al que va el +. */
  diaElegido: string;
  onOcultar: () => void;
  /** Mientras se arrastra una tarjeta de un dia, el nombre de ese dia. */
  quitarDe: string | null;
  /** Lo arrastrado esta sobre la zona para quitar. */
  sobreQuitar: boolean;
  busquedaRef: Ref<HTMLInputElement>;
}

export function Catalogo({ catalogo, cargando, error, onReintentar, onAgregar, diaElegido, onOcultar, quitarDe, sobreQuitar, busquedaRef }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<TipoEjercicio | 'todos'>('todos');
  const [grupo, setGrupo] = useState('todos');
  const { setNodeRef } = useDroppable({ id: 'quitar', data: { tipo: 'quitar' }, disabled: quitarDe === null });

  const grupos = useMemo(() => gruposDelCatalogo(catalogo ?? []), [catalogo]);
  const lista = useMemo(() => filtrarCatalogo(catalogo ?? [], { busqueda, tipo, grupo }), [catalogo, busqueda, tipo, grupo]);
  const total = catalogo?.length ?? 0;
  const filtrado = busqueda.trim() !== '' || tipo !== 'todos' || grupo !== 'todos';

  return (
    <aside ref={setNodeRef} className={styles.catalogo} aria-label="Catálogo de ejercicios">
      <div className={styles.cabeza}>
        <div className={styles.fila}>
          <span className={`${texto.label} ${texto.terciario}`}>
            Catálogo · {filtrado ? `${lista.length} de ${total}` : total} ejercicios
          </span>
          <BotonIcono icono={PanelLeftClose} tamano="sm" etiqueta="Ocultar catálogo  [" onClick={onOcultar} />
        </div>
        <div className={styles.busqueda}>
          <IconosQuietos>
            <Icono icono={Search} tamano={18} className={styles.lupa} />
            <input
              ref={busquedaRef}
              type="search"
              className={styles.campo}
              placeholder="Buscar ejercicio"
              aria-label="Buscar ejercicio"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              onKeyDown={(evento) => {
                if (evento.key === 'Escape' && busqueda) {
                  evento.stopPropagation();
                  setBusqueda('');
                }
              }}
            />
            {busqueda ? <BotonIcono icono={X} tamano="sm" etiqueta="Borrar búsqueda" onClick={() => setBusqueda('')} /> : <Kbd>/</Kbd>}
          </IconosQuietos>
        </div>
        <div className={styles.chips} role="group" aria-label="Filtrar por tipo">
          {TIPOS.map((t) => (
            <Chip key={t.valor} elegido={tipo === t.valor} icono={t.icono} onClick={() => setTipo(t.valor)}>
              {t.etiqueta}
            </Chip>
          ))}
        </div>
        <label className={styles.selector}>
          <Icono icono={Target} tamano={18} className={styles.lupa} />
          <select value={grupo} onChange={(evento) => setGrupo(evento.target.value)} aria-label="Grupo muscular" className={styles.select}>
            <option value="todos">Todos los grupos musculares</option>
            {grupos.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
          <Icono icono={ChevronsUpDown} tamano={16} className={styles.flechas} />
        </label>
      </div>

      <div className={styles.lista}>
        {cargando ? (
          Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={styles.esqItem}>
              <Esqueleto className={styles.esqTipo} />
              <div className={styles.textos}>
                <Esqueleto className={styles.esqNombre} />
                <Esqueleto className={styles.esqDetalle} />
              </div>
            </div>
          ))
        ) : error ? (
          <div className={styles.vacio}>
            <span className={`${texto.bodySm} ${texto.secundario}`}>No pudimos cargar el catálogo.</span>
            <Boton variante="soft" tamano="sm" icono={RotateCw} onClick={onReintentar}>
              Reintentar
            </Boton>
          </div>
        ) : lista.length === 0 ? (
          <div className={styles.vacio}>
            <span className={`${texto.bodySm} ${texto.secundario}`}>Ningún ejercicio coincide con la búsqueda.</span>
          </div>
        ) : (
          lista.map((e) => <ItemCatalogo key={e.id} ejercicio={e} diaElegido={diaElegido} onAgregar={onAgregar} />)
        )}
      </div>

      {quitarDe !== null && sobreQuitar ? (
        <div className={styles.zonaQuitar}>
          <Icono icono={Trash2} tamano={28} />
          <span className={texto.subtitle}>Soltá para quitar de {quitarDe}</span>
          <span className={texto.bodySm}>Se puede deshacer desde el aviso.</span>
        </div>
      ) : null}
    </aside>
  );
}

const ItemCatalogo = memo(function ItemCatalogo({
  ejercicio,
  diaElegido,
  onAgregar,
}: {
  ejercicio: EjercicioCatalogo;
  diaElegido: string;
  onAgregar: (e: EjercicioCatalogo) => void;
}) {
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: `cat:${ejercicio.id}`, data: { tipo: 'cat', ejercicio } });
  return (
    // Solo el puntero arrastra desde el catalogo; con teclado se agrega con +.
    <div ref={setNodeRef} onPointerDown={listeners?.onPointerDown as PointerEventHandler<HTMLDivElement> | undefined} className={`${styles.item} ${isDragging ? styles.arrastrado : ''}`}>
      <CuerpoItem ejercicio={ejercicio} diaElegido={diaElegido} onAgregar={onAgregar} />
    </div>
  );
});

// Aparte y con memo: useDraggable vuelve a dibujar cada item cada vez que
// cambia lo que esta debajo de lo arrastrado, y con cientos de items (cada uno
// con su icono animado) el arrastre se traba.
const CuerpoItem = memo(function CuerpoItem({
  ejercicio,
  diaElegido,
  onAgregar,
}: {
  ejercicio: EjercicioCatalogo;
  diaElegido: string;
  onAgregar: (e: EjercicioCatalogo) => void;
}) {
  return (
    <>
      <FilaCatalogo ejercicio={ejercicio} />
      <BotonIcono icono={Plus} tamano="sm" etiqueta={`Agregar ${ejercicio.name} a ${diaElegido}`} className={styles.mas} onClick={() => onAgregar(ejercicio)} />
    </>
  );
});

/** El contenido de un item, tambien para la copia que se levanta. */
export function FilaCatalogo({ ejercicio }: { ejercicio: EjercicioCatalogo }) {
  return (
    <>
      <span className={styles.agarre} aria-hidden="true">
        <Icono icono={GripVertical} tamano={16} />
      </span>
      <Tipo tipo={ejercicio.kind} grande />
      <div className={styles.textos}>
        <span className={`${texto.bodySm} ${texto.semi} ${texto.primario} ${styles.unaLinea}`}>{ejercicio.name}</span>
        <span className={`${texto.label} ${texto.terciario} ${styles.unaLinea}`}>{detalleCatalogo(ejercicio)}</span>
      </div>
    </>
  );
}

/** La copia del item que sigue al puntero (DragOverlay). */
export function ItemLevantado({ ejercicio, invalido }: { ejercicio: EjercicioCatalogo; invalido: boolean }) {
  return (
    <div className={`${styles.item} ${styles.levantado} ${invalido ? styles.invalido : ''}`}>
      <FilaCatalogo ejercicio={ejercicio} />
    </div>
  );
}
