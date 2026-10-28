/* Configuracion de un ejercicio (kit web, Web · 5): un modal centrado que se
   abre con clic o Enter en una tarjeta y cada vez que se agrega un ejercicio
   a un dia. El foco arranca en el primer campo. En el pie, Guardar a la
   izquierda y Quitar ejercicio a la derecha. Los campos salen de lo que
   registra el ejercicio y de las reglas de la base:
   - Fuerza e hibrido: series, reps (si las registra), intensidad
     obligatoria (RIR con al fallo, o RPE) y descanso. Sin peso.
   - Isometrico: series, tiempo por serie, peso objetivo opcional (si lo
     registra), RPE opcional y descanso.
   - Cardio: una sola serie continua sin descanso; tiempo, distancia
     opcional y RPE opcional.
   Los cambios quedan en el modal hasta Guardar, que los pasa al borrador de
   la rutina y cierra; la cruz o Esc cierran sin aplicarlos. */

import { Check, Dumbbell, Footprints, HeartPulse, Timer, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Boton } from '@/design/components/Boton';
import { Interruptor } from '@/design/components/Interruptor';
import { Modal } from '@/design/components/Modal';
import { Numero } from '@/design/components/Numero';
import { Segmentado } from '@/design/components/Segmentado';
import { Casilla, Insignia } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import {
  DESCANSO_MAXIMO,
  DESCANSO_POR_DEFECTO,
  esSerieUnica,
  intensidadPorDefecto,
  planificaPeso,
  rangoIntensidad,
  type Accion,
  type EjercicioBorrador,
} from '@/lib/constructor';
import { distanciaACanonico, mostrarDistancia } from '@/lib/distancia';
import type { EjercicioPlan } from '@/lib/rutinas';
import { mostrarPeso, pesoACanonico } from '@/lib/peso';
import { reloj, segundosDeReloj } from '@/lib/tiempo';
import styles from './PanelEjercicio.module.css';
import type { Unidades } from './Tablero';

const TIPO = {
  fuerza: { etiqueta: 'Fuerza', icono: Dumbbell },
  isometrico: { etiqueta: 'Isométrico', icono: Timer },
  cardio: { etiqueta: 'Cardio', icono: HeartPulse },
  hibrido: { etiqueta: 'Híbrido', icono: Footprints },
};

interface Props {
  ejercicio: EjercicioBorrador;
  /** "Push · ejercicio 1 de 4". */
  rotulo: string;
  /** "Pecho · Barra", si el catalogo ya llego. */
  detalle: string | null;
  unidades: Unidades;
  despachar: (a: Accion) => void;
  onCerrar: () => void;
  onQuitar: () => void;
}

export function PanelEjercicio({ ejercicio, rotulo, detalle, unidades, despachar, onCerrar, onQuitar }: Props) {
  const cuerpo = useRef<HTMLDivElement>(null);
  // Lo que se cambio en el modal, todavia sin pasar al borrador.
  const [cambios, setCambios] = useState<Partial<EjercicioPlan>>({});
  const e: EjercicioBorrador = { ...ejercicio, ...cambios };
  const cambiar = (c: Partial<EjercicioPlan>) => setCambios((actual) => ({ ...actual, ...c }));
  const guardar = () => {
    if (Object.keys(cambios).length > 0) despachar({ tipo: 'configurar', uid: e.uid, cambios });
    onCerrar();
  };
  const tipo = TIPO[e.kind];
  const unica = esSerieUnica(e.kind);
  const rpeOpcional = unica || e.kind === 'isometrico';

  // Corre despues de que el modal se abre (su efecto va primero).
  useEffect(() => {
    // El input y no los botones de - y + que lo rodean.
    const caja = cuerpo.current;
    (caja?.querySelector<HTMLElement>('input') ?? caja?.querySelector<HTMLElement>('button'))?.focus();
  }, [e.uid]);

  const series = <Numero rotulo="Series" valor={e.sets} onChange={(v) => cambiar({ sets: v ?? 1 })} min={1} max={20} />;

  const tiempo = e.tracks.duration ? (
    <Numero
      rotulo={unica ? 'Tiempo' : 'Tiempo por serie'}
      extra={unica ? 'h:mm:ss' : 'mm:ss'}
      valor={e.durationSeconds}
      onChange={(v) => cambiar({ durationSeconds: v })}
      min={unica ? 60 : 5}
      max={unica ? 10 * 3600 : 30 * 60}
      paso={unica ? 60 : 5}
      pasoGrande={unica ? 600 : 30}
      formato={reloj}
      parsear={(t) => segundosDeReloj(t, unica ? 'minutos' : 'segundos')}
    />
  ) : null;

  const descanso = unica ? null : (
    <div className={styles.grupo}>
      <div className={styles.filaEntre}>
        <span className={`${texto.label} ${texto.terciario}`}>Descanso entre series</span>
        <Interruptor
          etiqueta="Descanso entre series"
          encendido={e.restSeconds !== null}
          onChange={(on) => cambiar({ restSeconds: on ? (e.kind === 'isometrico' ? 60 : DESCANSO_POR_DEFECTO) : null })}
        />
      </div>
      {e.restSeconds !== null ? (
        <Numero etiqueta="Descanso" valor={e.restSeconds} onChange={(v) => cambiar({ restSeconds: v ?? DESCANSO_POR_DEFECTO })} min={5} max={DESCANSO_MAXIMO} paso={5} pasoGrande={30} formato={reloj} parsear={(t) => segundosDeReloj(t)} />
      ) : (
        <span className={`${texto.bodySm} ${texto.terciario}`}>Sin temporizador.</span>
      )}
    </div>
  );

  return (
    <Modal
      abierto
      titulo={e.name}
      texto={rotulo}
      onCerrar={onCerrar}
      pie={
        <>
          <Boton icono={Check} onClick={guardar}>
            Guardar
          </Boton>
          <span className={styles.crece} />
          <Boton variante="danger" icono={Trash2} onClick={onQuitar}>
            Quitar ejercicio
          </Boton>
        </>
      }
    >
      <div className={styles.filaDetalle}>
        <Insignia icono={tipo.icono}>{tipo.etiqueta}</Insignia>
        {detalle ? <span className={`${texto.label} ${texto.terciario}`}>{detalle}</span> : null}
      </div>

      <div ref={cuerpo} data-foco-inicial className={styles.cuerpo}>
        {unica ? (
          <>
            <div className={styles.grilla}>
              {tiempo}
              {e.tracks.distance ? (
                <Numero
                  rotulo="Distancia"
                  extra="opcional"
                  valor={e.distanceM === null ? null : mostrarDistancia(e.distanceM, unidades.distancia)}
                  onChange={(v) => cambiar({ distanceM: v === null ? null : Math.max(1, distanciaACanonico(v, unidades.distancia)) })}
                  min={0.1}
                  max={500}
                  paso={0.5}
                  pasoGrande={5}
                  unidad={unidades.distancia}
                  vacio
                />
              ) : null}
            </div>
            <span className={`${texto.bodySm} ${texto.secundario}`}>El cardio va en una sola serie continua, sin descanso.</span>
          </>
        ) : e.kind === 'isometrico' ? (
          <>
            <div className={styles.grilla}>
              {series}
              {tiempo}
            </div>
            {planificaPeso(e.kind, e.tracks) ? (
              <div className={styles.grupo}>
                <Numero
                  rotulo="Peso objetivo"
                  extra="opcional"
                  valor={e.weightKg === null ? null : mostrarPeso(e.weightKg, unidades.peso)}
                  onChange={(v) => cambiar({ weightKg: v === null ? null : pesoACanonico(v, unidades.peso) })}
                  min={0.5}
                  max={500}
                  paso={unidades.peso === 'kg' ? 0.5 : 1}
                  pasoGrande={unidades.peso === 'kg' ? 5 : 10}
                  unidad={unidades.peso}
                  vacio
                />
                <span className={`${texto.bodySm} ${texto.secundario}`}>Si lo dejás vacío, se carga al entrenar.</span>
              </div>
            ) : null}
          </>
        ) : (
          <div className={styles.grilla}>
            {series}
            {e.tracks.reps ? <Numero rotulo="Repeticiones" valor={e.reps} onChange={(v) => cambiar({ reps: v ?? 1 })} min={1} max={100} /> : null}
          </div>
        )}

        {rpeOpcional ? (
          <div className={styles.grupo}>
            <span className={`${texto.label} ${texto.terciario}`}>Intensidad</span>
            <Segmentado
              etiqueta="Intensidad"
              ancho
              valor={e.intensityKind === null ? 'no' : 'rpe'}
              onChange={(v) => cambiar(v === 'no' ? { intensityKind: null, intensityValue: null } : { intensityKind: 'rpe', intensityValue: intensidadPorDefecto('rpe', e.kind) })}
              opciones={[
                { valor: 'rpe', etiqueta: 'RPE' },
                { valor: 'no', etiqueta: 'Sin intensidad' },
              ]}
            />
            {e.intensityKind === 'rpe' ? <Numero etiqueta="RPE" valor={e.intensityValue} onChange={(v) => cambiar({ intensityValue: v ?? 1 })} min={1} max={10} /> : null}
          </div>
        ) : (
          <Intensidad ejercicio={e} cambiar={cambiar} />
        )}

        {descanso}
      </div>
    </Modal>
  );
}

/** Fuerza e hibrido: RIR (con al fallo) o RPE, siempre con valor. */
function Intensidad({ ejercicio: e, cambiar }: { ejercicio: EjercicioBorrador; cambiar: (c: Partial<EjercicioPlan>) => void }) {
  const medidor = e.intensityKind ?? 'rir';
  const valor = e.intensityValue ?? intensidadPorDefecto(medidor);
  const fallo = medidor === 'rir' && valor < 0;
  const rango = rangoIntensidad(medidor);
  return (
    <div className={styles.grupo}>
      <span className={`${texto.label} ${texto.terciario}`}>Intensidad</span>
      <Segmentado
        etiqueta="Medidor de intensidad"
        ancho
        valor={medidor}
        onChange={(m) => cambiar({ intensityKind: m, intensityValue: intensidadPorDefecto(m) })}
        opciones={[
          { valor: 'rir', etiqueta: 'RIR' },
          { valor: 'rpe', etiqueta: 'RPE' },
        ]}
      />
      <div className={styles.filaIntensidad}>
        <div className={styles.crece}>
          <Numero
            etiqueta={medidor.toUpperCase()}
            valor={valor}
            onChange={(v) => cambiar({ intensityKind: medidor, intensityValue: v ?? rango.min })}
            min={medidor === 'rir' ? 0 : rango.min}
            max={rango.max}
            formato={(v) => (v < 0 ? 'Al fallo' : String(v))}
            disabled={fallo}
          />
        </div>
        {medidor === 'rir' ? (
          <Casilla marcada={fallo} onChange={(m) => cambiar({ intensityKind: 'rir', intensityValue: m ? -1 : 0 })}>
            Al fallo
          </Casilla>
        ) : null}
      </div>
    </div>
  );
}
