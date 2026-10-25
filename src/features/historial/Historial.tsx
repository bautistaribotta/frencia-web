/* Historial (/historial). Las sesiones se registran en el celular y se
   revisan aca: los totales del periodo arriba y una tabla por mes, de la mas
   nueva a la mas vieja (kit web, Web · 6). Se pagina sola al llegar al
   final; el total de un mes aparece cuando ya no quedan paginas por traer.
   Toda la fila abre el detalle.
   La racha se cuenta en entrenamientos seguidos segun la rutina en curso,
   como en la app y en el inicio.
   Pendiente del diseño: el filtro por rutina (falta el selector) y el menu
   de cada fila (ticket y eliminar).
   Fondo: velada. */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChevronRight, History, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { Metrica, tabla } from '@/design/components/datos';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Encabezado, Lista, Pagina } from '@/design/components/Pagina';
import { Ruedita } from '@/design/components/Ruedita';
import { Segmentado } from '@/design/components/Segmentado';
import { Esqueleto, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { textoTonelaje } from '@/lib/estadisticas';
import {
  agruparPorMes,
  cargarPaginaHistorial,
  cargarTotales,
  inicioPeriodo,
  type MesHistorial,
  type Periodo,
  type TotalesPeriodo,
} from '@/lib/historial';
import { cargarFechasEntrenadas, cargarRutinaActiva } from '@/lib/inicio';
import { miles } from '@/lib/numeros';
import { usePerfil } from '@/lib/perfil';
import { mostrarPeso, type UnidadPeso } from '@/lib/peso';
import { calcularRacha, fechaLocal } from '@/lib/streak';
import { duracionSesion, indiceSemanaLunes, MESES_LARGO } from '@/lib/tiempo';
import styles from './Historial.module.css';

const DIAS_CORTO = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** "Octubre", con el año solo si no es el actual: "Octubre 2025". */
function nombreMes(epochMs: number): string {
  const d = new Date(epochMs);
  const mes = MESES_LARGO[d.getMonth()];
  return d.getFullYear() === new Date().getFullYear() ? mes : `${mes} ${d.getFullYear()}`;
}

export function Historial() {
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const [periodo, setPeriodo] = useState<Periodo>('90');
  // El inicio del periodo se fija al elegirlo: si se recalculara en cada
  // render cambiaria la clave de la consulta todo el tiempo.
  const [desde, setDesde] = useState(() => inicioPeriodo('90'));
  const unidadPeso = (usePerfil().data?.unidad_peso ?? 'kg') as UnidadPeso;

  const historial = useInfiniteQuery({
    queryKey: ['historial', userId, periodo],
    queryFn: ({ pageParam, signal }) => cargarPaginaHistorial(userId, desde, pageParam, signal),
    initialPageParam: null as Parameters<typeof cargarPaginaHistorial>[2],
    getNextPageParam: (ultima) => ultima.siguiente,
    enabled: !!userId,
  });

  function cambiarPeriodo(nuevo: Periodo) {
    setPeriodo(nuevo);
    setDesde(inicioPeriodo(nuevo));
  }

  const paginas = historial.data?.pages ?? [];
  const sesiones = paginas.flatMap((p) => p.sesiones);
  const proximaFecha = paginas.length > 0 ? paginas[paginas.length - 1].proximaFecha : null;
  const meses = agruparPorMes(sesiones, proximaFecha);

  let contenido;
  if (historial.isPending) contenido = <Cargando />;
  else if (historial.isError && sesiones.length === 0)
    contenido = <AvisoPie texto="No pudimos cargar tus entrenamientos." onReintentar={() => void historial.refetch()} />;
  else if (sesiones.length === 0) contenido = <Vacio periodo={periodo} />;
  else
    contenido = (
      <>
        {meses.map((mes) => (
          <Mes key={mes.key} mes={mes} unidadPeso={unidadPeso} />
        ))}
        {historial.hasNextPage ? (
          historial.isFetchNextPageError ? (
            <AvisoPie texto="No pudimos cargar más entrenamientos." onReintentar={() => void historial.fetchNextPage()} />
          ) : (
            // Se vuelve a montar con cada pagina: si el pie sigue a la vista,
            // el observador nuevo avisa de entrada y pide la siguiente.
            <Sensor
              key={paginas.length}
              alVer={() => {
                if (!historial.isFetchingNextPage) void historial.fetchNextPage();
              }}
            >
              <Ruedita />
              <span className={texto.bodySm}>Cargando {proximaFecha ? nombreMes(proximaFecha).toLowerCase() : 'más'}…</span>
            </Sensor>
          )
        ) : null}
      </>
    );

  return (
    <>
      <Fondo posicion="velada" />
      <Pagina>
        <Encabezado
          rotulo="Historial"
          titulo="Lo que hiciste"
          acciones={
            <Segmentado
              etiqueta="Período"
              valor={periodo}
              onChange={cambiarPeriodo}
              opciones={[
                { valor: '30', etiqueta: '30 días' },
                { valor: '90', etiqueta: '3 meses' },
                { valor: 'todo', etiqueta: 'Todo' },
              ]}
            />
          }
        />
        <Totales userId={userId} periodo={periodo} desde={desde} unidadPeso={unidadPeso} />
        {contenido}
      </Pagina>
    </>
  );
}

/** Sesiones, tiempo y tonelaje del periodo, y la racha (que no depende del
 *  periodo). Las lecturas de la racha comparten cache con el inicio. */
function Totales({ userId, periodo, desde, unidadPeso }: { userId: string; periodo: Periodo; desde: string | null; unidadPeso: UnidadPeso }) {
  const totales = useQuery({ queryKey: ['historial-totales', userId, periodo], queryFn: () => cargarTotales(userId, desde), enabled: !!userId });
  const rutina = useQuery({ queryKey: ['rutina-activa', userId], queryFn: () => cargarRutinaActiva(userId), enabled: !!userId });
  const fechas = useQuery({ queryKey: ['fechas-entrenadas', userId], queryFn: () => cargarFechasEntrenadas(userId), enabled: !!userId });

  const weekdays = rutina.data?.dias.flatMap((d) => d.weekdays) ?? [];
  const racha = fechas.data && weekdays.length > 0 ? calcularRacha(weekdays, fechas.data, fechaLocal(new Date().getTime())).racha : rutina.data === null ? 0 : null;

  return (
    <div className={styles.cuatro}>
      <Tarjeta>{valorTotal('Sesiones', totales.data, (t) => ({ valor: miles(t.sesiones) }))}</Tarjeta>
      <Tarjeta>{valorTotal('Tiempo total', totales.data, (t) => textoHoras(t.segundos))}</Tarjeta>
      <Tarjeta>{valorTotal('Tonelaje', totales.data, (t) => textoTonelaje(t.tonelajeKg, unidadPeso))}</Tarjeta>
      <Tarjeta>
        {racha !== null ? (
          <Metrica rotulo="Racha" valor={racha} unidad={racha === 1 ? 'entrenamiento' : 'entrenamientos'} />
        ) : (
          <Metrica rotulo="Racha" valor={<Esqueleto className={styles.esqValor} />} />
        )}
      </Tarjeta>
    </div>
  );
}

function valorTotal(rotulo: string, totales: TotalesPeriodo | undefined, formato: (t: TotalesPeriodo) => { valor: string; unidad?: string }) {
  if (!totales) return <Metrica rotulo={rotulo} valor={<Esqueleto className={styles.esqValor} />} />;
  const { valor, unidad } = formato(totales);
  return <Metrica rotulo={rotulo} valor={valor} unidad={unidad} />;
}

/** Horas enteras; por debajo de una hora, minutos. */
function textoHoras(segundos: number): { valor: string; unidad: string } {
  if (segundos < 3600) return { valor: String(Math.round(segundos / 60)), unidad: 'min' };
  return { valor: miles(Math.round(segundos / 3600)), unidad: 'h' };
}

function Mes({ mes, unidadPeso }: { mes: MesHistorial; unidadPeso: UnidadPeso }) {
  const navegar = useNavigate();
  const n = mes.sesiones.length;
  return (
    <section className={styles.mes}>
      <div className={styles.fila}>
        <h2 className={`${texto.subtitle} ${styles.sinMargen}`}>{nombreMes(mes.finishedAt)}</h2>
        {mes.completo ? (
          <span className={`${texto.label} ${texto.terciario}`}>
            {n} {n === 1 ? 'sesión' : 'sesiones'}
          </span>
        ) : null}
      </div>
      <Lista>
        <table className={tabla.tabla}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Día</th>
              <th>Rutina</th>
              <th className={tabla.num}>Duración</th>
              <th className={tabla.num}>Series</th>
              <th className={tabla.num}>Tonelaje · {unidadPeso}</th>
              <th aria-label="Abrir" />
            </tr>
          </thead>
          <tbody>
            {mes.sesiones.map((s) => {
              const fecha = new Date(s.finishedAt);
              return (
                <tr key={s.id} className={tabla.filaEnlace} onClick={() => navegar(`/historial/${s.id}`)}>
                  <td className={texto.secundario}>
                    {DIAS_CORTO[indiceSemanaLunes(fecha)]} {fecha.getDate()}
                  </td>
                  <td>
                    <Link to={`/historial/${s.id}`} className={tabla.enlace} onClick={(e) => e.stopPropagation()}>
                      {s.dayName ?? 'Día eliminado'}
                    </Link>
                  </td>
                  <td className={texto.secundario}>{s.rutina ?? '—'}</td>
                  <td className={tabla.num}>{duracionSesion(s.startedAt, s.finishedAt)}</td>
                  <td className={tabla.num}>{s.series}</td>
                  <td className={tabla.num}>{s.tonelajeKg === null ? '—' : miles(mostrarPeso(s.tonelajeKg, unidadPeso))}</td>
                  <td className={tabla.acc}>
                    <Icono icono={ChevronRight} tamano={18} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Lista>
    </section>
  );
}

/** Pide la pagina siguiente cuando el pie entra en pantalla. */
function Sensor({ alVer, children }: { alVer: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const ultimo = useRef(alVer);
  useEffect(() => {
    ultimo.current = alVer;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) ultimo.current();
    }, { rootMargin: '400px 0px' });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);
  return (
    <div ref={ref} className={styles.cargandoMas} role="status">
      {children}
    </div>
  );
}

function AvisoPie({ texto: mensaje, onReintentar }: { texto: string; onReintentar: () => void }) {
  return (
    <div className={styles.avisoPie} role="alert">
      <span className={`${texto.bodySm} ${texto.secundario} ${styles.crece}`}>{mensaje}</span>
      <Boton variante="soft" tamano="sm" icono={RotateCw} onClick={onReintentar}>
        Reintentar
      </Boton>
    </div>
  );
}

function Vacio({ periodo }: { periodo: Periodo }) {
  const todo = periodo === 'todo';
  return (
    <div className={styles.vacio}>
      <Icono icono={History} tamano={28} className={texto.terciario} />
      <span className={texto.subtitle}>{todo ? 'Todavía no hay sesiones' : 'No hay sesiones en este período'}</span>
      <span className={`${texto.bodySm} ${texto.secundario}`}>
        {todo
          ? 'Cuando termines tu primer entrenamiento en la app, va a aparecer acá con cada serie y el peso que levantaste.'
          : 'Probá con un período más largo para ver entrenamientos anteriores.'}
      </span>
    </div>
  );
}

function Cargando() {
  return (
    <section className={styles.mes}>
      <Esqueleto className={styles.esqTitulo} />
      <Lista>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.esqFila}>
            <Esqueleto className={styles.esqLinea} />
          </div>
        ))}
      </Lista>
    </section>
  );
}
