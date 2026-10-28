/* Rutinas (/rutinas). Lista los planes: la en curso arriba, con un borde fino de
   lume, y las anteriores en una tabla de la mas nueva a la mas vieja (kit web,
   Web · 4). Nueva rutina vive solo en la navegacion. Al lado de Anteriores, la
   cuenta contra el limite de rutinas.
   Sin rutinas, el vacio ofrece Crear rutina (o N).
   El menu de cada fila (boton ⋯ o clic derecho): Poner en curso, Editar,
   Duplicar, Compartir (desactivado por ahora) y Eliminar, tambien con Supr
   sobre la fila. Toda la fila abre el detalle.
   Fondo: cumbre. */

import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Copy, Layers, Pencil, Play, Plus, RotateCw, Share, Trash2 } from 'lucide-react';
import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { tabla } from '@/design/components/datos';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Menu } from '@/design/components/Menu';
import { Encabezado, Lista, Pagina } from '@/design/components/Pagina';
import { Esqueleto, Kbd, Tarjeta, TiraSemana } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { cargarRutinas, cuentaRutina, fechaCorta, MAXIMO_RUTINAS, totalRutinas, type RutinaResumen } from '@/lib/rutinas';
import { EliminarRutina, useDuplicarRutina, usePonerEnCurso } from './acciones';
import styles from './Rutinas.module.css';

export function Rutinas() {
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const rutinas = useQuery({ queryKey: ['rutinas', userId], queryFn: () => cargarRutinas(userId), enabled: !!userId });

  let contenido;
  if (rutinas.isPending) contenido = <Cargando />;
  else if (rutinas.isError)
    contenido = (
      <Tarjeta className={styles.aviso}>
        <span className={`${texto.bodySm} ${texto.secundario} ${styles.crece}`}>No pudimos cargar tus rutinas.</span>
        <Boton variante="soft" tamano="sm" icono={RotateCw} onClick={() => void rutinas.refetch()}>
          Reintentar
        </Boton>
      </Tarjeta>
    );
  else if (!rutinas.data.activa && rutinas.data.anteriores.length === 0) contenido = <Vacia />;
  else
    contenido = (
      <>
        {rutinas.data.activa ? <EnCurso rutina={rutinas.data.activa} /> : null}
        {rutinas.data.anteriores.length > 0 ? <Anteriores rutinas={rutinas.data.anteriores} total={totalRutinas(rutinas.data)} /> : null}
      </>
    );

  return (
    <>
      <Fondo posicion="cumbre" />
      <Pagina>
        <Encabezado
          rotulo="Rutinas"
          titulo="Todas las rutinas"
          bajada="Una en curso, al poner otra en curso, la actual se archiva."
        />
        {contenido}
      </Pagina>
    </>
  );
}

function EnCurso({ rutina }: { rutina: RutinaResumen }) {
  return (
    <Link to={`/rutinas/${rutina.id}`} className={styles.activa}>
      <div className={styles.activaTextos}>
        <span className={`${texto.label} ${texto.acento}`}>En curso · desde {fechaCorta(rutina.creadaEl)}</span>
        <span className={`${texto.title} ${styles.activaNombre}`}>{rutina.name}</span>
        <span className={`${texto.bodySm} ${texto.secundario}`}>{cuentaRutina(rutina)}</span>
      </div>
      {/* Una fila por dia: crece hacia abajo, sin romperse con 4 o mas. */}
      <div className={styles.activaDias}>
        {rutina.dias.map((d) => (
          <div key={d.id} className={styles.activaDia}>
            <span className={`${texto.bodySm} ${styles.semi} ${styles.unaLinea}`}>{d.name}</span>
            <TiraSemana marcados={d.weekdays} />
            <span className={`${texto.label} ${texto.terciario} ${styles.activaCuenta}`}>
              {d.ejercicios} {d.ejercicios === 1 ? 'ejercicio' : 'ejercicios'}
            </span>
          </div>
        ))}
      </div>
      <Icono icono={ChevronRight} tamano={20} className={`${texto.terciario} ${styles.activaFlecha}`} />
    </Link>
  );
}

function Anteriores({ rutinas, total }: { rutinas: RutinaResumen[]; total: number }) {
  const navegar = useNavigate();
  const ponerEnCurso = usePonerEnCurso();
  const copia = useDuplicarRutina();
  const [aEliminar, setAEliminar] = useState<RutinaResumen | null>(null);

  // Clic derecho sobre la fila: abre su menu ⋯.
  const abrirMenu = (evento: MouseEvent<HTMLTableRowElement>) => {
    evento.preventDefault();
    evento.currentTarget.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')?.click();
  };
  const alTeclear = (r: RutinaResumen) => (evento: KeyboardEvent<HTMLTableRowElement>) => {
    if (evento.key !== 'Delete') return;
    evento.preventDefault();
    setAEliminar(r);
  };

  return (
    <section className={styles.anteriores}>
      <div className={styles.fila}>
        <span className={`${texto.label} ${texto.terciario}`}>Anteriores · {rutinas.length}</span>
        <span className={`${texto.label} ${texto.terciario}`}>
          {total} de {MAXIMO_RUTINAS} rutinas
        </span>
      </div>
      <Lista sinRecorte>
        <table className={tabla.tabla}>
          <thead>
            <tr>
              <th>Rutina</th>
              <th className={tabla.sinTelefono}>Días</th>
              <th className={tabla.sinTelefono}>Fecha de creación</th>
              <th className={tabla.num}>Sesiones</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {rutinas.map((r) => (
              <tr key={r.id} className={tabla.filaEnlace} onClick={() => navegar(`/rutinas/${r.id}`)} onContextMenu={abrirMenu} onKeyDown={alTeclear(r)}>
                <td>
                  <Link to={`/rutinas/${r.id}`} className={tabla.enlace} onClick={(e) => e.stopPropagation()}>
                    {r.name}
                  </Link>
                </td>
                <td className={`${texto.secundario} ${tabla.sinTelefono}`}>
                  {r.dias.length} {r.dias.length === 1 ? 'día' : 'días'} · {r.ejercicios} {r.ejercicios === 1 ? 'ejercicio' : 'ejercicios'}
                </td>
                <td className={`${texto.secundario} ${tabla.sinTelefono}`}>{fechaCorta(r.creadaEl)}</td>
                <td className={tabla.num}>{r.sesiones}</td>
                <td className={tabla.acc} onClick={(e) => e.stopPropagation()}>
                  <Menu
                    etiqueta={`Más acciones de ${r.name}`}
                    opciones={[
                      { etiqueta: 'Poner en curso', icono: Play, alElegir: () => void ponerEnCurso(r) },
                      { etiqueta: 'Editar', icono: Pencil, alElegir: () => navegar(`/rutinas/${r.id}/editar`) },
                      { etiqueta: 'Duplicar', icono: Copy, alElegir: () => void copia.duplicar(r), disabled: copia.duplicando !== null },
                      { etiqueta: 'Compartir', icono: Share, alElegir: () => {}, disabled: true },
                      { etiqueta: 'Eliminar', icono: Trash2, alElegir: () => setAEliminar(r), peligro: true, separada: true, atajo: 'Supr' },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Lista>
      <EliminarRutina rutina={aEliminar} onCerrar={() => setAEliminar(null)} />
      {copia.modal}
    </section>
  );
}

function Vacia() {
  const navegar = useNavigate();
  return (
    <div className={styles.vacia}>
      <Icono icono={Layers} tamano={28} className={texto.terciario} />
      <span className={texto.subtitle}>Todavía no tenés rutinas</span>
      <span className={`${texto.bodySm} ${texto.secundario}`}>
        Cuando crees una va a aparecer acá, junto con las que archives más adelante.
      </span>
      <div className={styles.vaciaAcciones}>
        <Boton icono={Plus} onClick={() => navegar('/rutinas/nueva')}>
          Crear rutina
        </Boton>
        <span className={`${texto.bodySm} ${texto.terciario} ${styles.vaciaAtajo}`}>
          o apretá <Kbd>N</Kbd>
        </span>
      </div>
    </div>
  );
}

function Cargando() {
  return (
    <>
      <Tarjeta className={styles.esqActiva}>
        <Esqueleto className={styles.esqRotulo} />
        <Esqueleto className={styles.esqTitulo} />
        <Esqueleto className={styles.esqLinea} />
      </Tarjeta>
      <Lista>
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.esqFila}>
            <Esqueleto className={styles.esqLinea} />
          </div>
        ))}
      </Lista>
    </>
  );
}
