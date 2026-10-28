/* Historial (/historial). Las sesiones se registran en el celular y se
   revisan aca: sesiones y tiempo de todo el historial arriba y una tabla por
   mes, de la mas nueva a la mas vieja (kit web, Web · 6). Sin filtro de
   periodo: entra con los ultimos tres meses y, al llegar al final, trae de a
   HISTORIAL_PAGINA mas viejas hasta el principio, como en la app. El total
   de un mes aparece cuando ya no quedan paginas por traer.
   Toda la fila abre el detalle.
   Arriba a la derecha, el filtro por rutina (Todas las rutinas, la en curso y
   las anteriores): cambia la lista y los totales y queda en la URL
   (?rutina=id), asi sobrevive a recargar y a volver desde una sesion.
   Pendiente del diseño: el ticket de cada fila.
   Fondo: velada. */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { History, Layers, RotateCw } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { Metrica, tabla } from '@/design/components/datos';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Encabezado, Lista, Pagina } from '@/design/components/Pagina';
import { Ruedita } from '@/design/components/Ruedita';
import { Selector } from '@/design/components/Selector';
import { Esqueleto, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import {
  agruparPorMes,
  cargarPaginaHistorial,
  cargarTotales,
  type MesHistorial,
  type TotalesHistorial,
} from '@/lib/historial';
import { miles } from '@/lib/numeros';
import { cargarRutinas } from '@/lib/rutinas';
import { duracionSesion, indiceSemanaLunes, MESES_LARGO } from '@/lib/tiempo';
import { EliminarSesion } from '@/features/historial/EliminarSesion';
import styles from './Historial.module.css';

const DIAS_CORTO = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** "Octubre", con el año solo si no es el actual: "Octubre 2025". */
function nombreMes(epochMs: number): string {
  const d = new Date(epochMs);
  const mes = MESES_LARGO[d.getMonth()];
  return d.getFullYear() === new Date().getFullYear() ? mes : `${mes} ${d.getFullYear()}`;
}

const TODAS = 'todas';

export function Historial() {
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const [parametros, setParametros] = useSearchParams();

  // Las rutinas para el filtro: la en curso primero y despues las anteriores.
  const lista = useQuery({ queryKey: ['rutinas', userId], queryFn: () => cargarRutinas(userId), enabled: !!userId });
  const rutinas = lista.data ? [...(lista.data.activa ? [lista.data.activa] : []), ...lista.data.anteriores] : [];
  const pedida = parametros.get('rutina');
  // Una rutina que ya no existe vuelve a todas.
  const rutinaId = pedida && (!lista.data || rutinas.some((r) => r.id === pedida)) ? pedida : null;
  const filtrada = rutinas.find((r) => r.id === rutinaId) ?? null;
  const filtrar = (valor: string) =>
    setParametros(valor === TODAS ? {} : { rutina: valor }, { replace: true });

  const historial = useInfiniteQuery({
    queryKey: ['historial', userId, rutinaId],
    queryFn: ({ pageParam, signal }) => cargarPaginaHistorial(userId, pageParam, signal, rutinaId),
    initialPageParam: null as Parameters<typeof cargarPaginaHistorial>[1],
    getNextPageParam: (ultima) => ultima.siguiente,
    enabled: !!userId,
  });

  const paginas = historial.data?.pages ?? [];
  const sesiones = paginas.flatMap((p) => p.sesiones);
  const proximaFecha = paginas.length > 0 ? paginas[paginas.length - 1].proximaFecha : null;
  const meses = agruparPorMes(sesiones, proximaFecha);

  let contenido;
  if (historial.isPending) contenido = <Cargando />;
  else if (historial.isError && sesiones.length === 0)
    contenido = <AvisoPie texto="No pudimos cargar tus entrenamientos." onReintentar={() => void historial.refetch()} />;
  else if (sesiones.length === 0 && !historial.hasNextPage)
    contenido = filtrada ? <VacioFiltro nombre={filtrada.name} onTodas={() => filtrar(TODAS)} /> : <Vacio />;
  else
    contenido = (
      <>
        {meses.map((mes) => (
          <Mes key={mes.key} mes={mes} />
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
          titulo="Listado de los días entrenados"
          acciones={
            rutinas.length > 0 ? (
              <Selector
                etiqueta="Filtrar por rutina"
                icono={Layers}
                valor={rutinaId ?? TODAS}
                opciones={[{ valor: TODAS, etiqueta: 'Todas las rutinas' }, ...rutinas.map((r) => ({ valor: r.id, etiqueta: r.name }))]}
                alCambiar={filtrar}
                className={styles.filtro}
              />
            ) : null
          }
        />
        <Totales userId={userId} rutinaId={rutinaId} />
        {contenido}
      </Pagina>
    </>
  );
}

/** Sesiones y tiempo de todo el historial: no cambian al scrollear. */
function Totales({ userId, rutinaId }: { userId: string; rutinaId: string | null }) {
  const totales = useQuery({
    queryKey: ['historial-totales', userId, rutinaId],
    queryFn: () => cargarTotales(userId, rutinaId),
    enabled: !!userId,
  });
  return (
    <div className={styles.cuatro}>
      <Tarjeta>{valorTotal('Sesiones', totales.data, (t) => ({ valor: miles(t.sesiones) }))}</Tarjeta>
      <Tarjeta>{valorTotal('Tiempo total', totales.data, (t) => textoHoras(t.segundos))}</Tarjeta>
    </div>
  );
}

function valorTotal(rotulo: string, totales: TotalesHistorial | undefined, formato: (t: TotalesHistorial) => { valor: string; unidad?: string }) {
  if (!totales) return <Metrica rotulo={rotulo} valor={<Esqueleto className={styles.esqValor} />} />;
  const { valor, unidad } = formato(totales);
  return <Metrica rotulo={rotulo} valor={valor} unidad={unidad} />;
}

/** Horas enteras; por debajo de una hora, minutos. */
function textoHoras(segundos: number): { valor: string; unidad: string } {
  if (segundos < 3600) return { valor: String(Math.round(segundos / 60)), unidad: 'min' };
  return { valor: miles(Math.round(segundos / 3600)), unidad: 'h' };
}

function Mes({ mes }: { mes: MesHistorial }) {
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
              <th aria-label="Acciones" />
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
                  <td className={tabla.acc}>
                    <EliminarSesion id={s.id} nombre={s.dayName} fecha={s.finishedAt} />
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

function Vacio() {
  return (
    <div className={styles.vacio}>
      <Icono icono={History} tamano={28} className={texto.terciario} />
      <span className={texto.subtitle}>Todavía no hay sesiones</span>
      <span className={`${texto.bodySm} ${texto.secundario}`}>
        Cuando termines tu primer entrenamiento en la app, va a aparecer acá con cada serie y el peso que levantaste.
      </span>
    </div>
  );
}

function VacioFiltro({ nombre, onTodas }: { nombre: string; onTodas: () => void }) {
  return (
    <div className={styles.vacio}>
      <Icono icono={Layers} tamano={28} className={texto.terciario} />
      <span className={texto.subtitle}>Sin sesiones de {nombre}</span>
      <span className={`${texto.bodySm} ${texto.secundario}`}>Cuando entrenes un día de esta rutina en la app, va a aparecer acá.</span>
      <Boton variante="secondary" tamano="sm" onClick={onTodas}>
        Ver todas las rutinas
      </Boton>
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
