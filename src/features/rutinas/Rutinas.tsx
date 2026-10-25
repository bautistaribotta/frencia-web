/* Rutinas (/rutinas). Lista los planes: la en curso arriba, con el filo de
   lume, y las anteriores en una tabla ordenable (kit web, Web · 4).
   Por ahora solo se mira: Nueva rutina y el menu de cada fila (poner en
   curso, editar, duplicar, compartir, eliminar) quedan a la vista pero
   desactivados hasta que llegue el constructor. Toda la fila abre el detalle.
   Fondo: cumbre. */

import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Ellipsis, Layers, Plus, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { tabla } from '@/design/components/datos';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Encabezado, Lista, Pagina } from '@/design/components/Pagina';
import { Segmentado } from '@/design/components/Segmentado';
import { Esqueleto, Tarjeta, TiraSemana } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { cargarRutinas, cuentaRutina, fechaCorta, type RutinaResumen } from '@/lib/rutinas';
import styles from './Rutinas.module.css';

type Orden = 'recientes' | 'az';

const PRONTO = 'Muy pronto';

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
        {rutinas.data.anteriores.length > 0 ? <Anteriores rutinas={rutinas.data.anteriores} /> : null}
      </>
    );

  return (
    <>
      <Fondo posicion="cumbre" />
      <Pagina>
        <Encabezado
          rotulo="Rutinas"
          titulo="Tus rutinas"
          bajada="Una en curso; al poner otra en curso, la actual pasa a Anteriores con su historial."
          acciones={
            <Boton icono={Plus} disabled title={PRONTO}>
              Nueva rutina
            </Boton>
          }
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
        <span className={texto.title}>{rutina.name}</span>
        <span className={`${texto.bodySm} ${texto.secundario}`}>{cuentaRutina(rutina)}</span>
      </div>
      <div className={styles.activaDias}>
        {rutina.dias.map((d) => (
          <div key={d.id} className={styles.activaDia}>
            <span className={`${texto.label} ${texto.terciario} ${styles.unaLinea}`}>{d.name}</span>
            <TiraSemana marcados={d.weekdays} />
          </div>
        ))}
      </div>
      <Icono icono={ChevronRight} tamano={20} className={texto.terciario} />
    </Link>
  );
}

function Anteriores({ rutinas }: { rutinas: RutinaResumen[] }) {
  const navegar = useNavigate();
  const [orden, setOrden] = useState<Orden>('recientes');
  const ordenadas = orden === 'az' ? rutinas.slice().sort((a, b) => a.name.localeCompare(b.name, 'es')) : rutinas;

  return (
    <section className={styles.anteriores}>
      <div className={styles.fila}>
        <span className={`${texto.label} ${texto.terciario}`}>Anteriores · {rutinas.length}</span>
        <Segmentado
          etiqueta="Ordenar las anteriores"
          valor={orden}
          onChange={setOrden}
          opciones={[
            { valor: 'recientes', etiqueta: 'Recientes' },
            { valor: 'az', etiqueta: 'A–Z' },
          ]}
        />
      </div>
      <Lista>
        <table className={tabla.tabla}>
          <thead>
            <tr>
              <th>Rutina</th>
              <th>Días</th>
              <th>Archivada</th>
              <th className={tabla.num}>Sesiones</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {ordenadas.map((r) => (
              <tr key={r.id} className={tabla.filaEnlace} onClick={() => navegar(`/rutinas/${r.id}`)}>
                <td>
                  <Link to={`/rutinas/${r.id}`} className={tabla.enlace} onClick={(e) => e.stopPropagation()}>
                    {r.name}
                  </Link>
                </td>
                <td className={texto.secundario}>
                  {r.dias.length} {r.dias.length === 1 ? 'día' : 'días'} · {r.ejercicios} {r.ejercicios === 1 ? 'ejercicio' : 'ejercicios'}
                </td>
                <td className={texto.secundario}>{r.archivadaEl ? `Archivada el ${fechaCorta(r.archivadaEl)}` : null}</td>
                <td className={tabla.num}>{r.sesiones}</td>
                <td className={tabla.acc}>
                  <BotonIcono
                    icono={Ellipsis}
                    tamano="sm"
                    etiqueta={`Más acciones de ${r.name}: muy pronto`}
                    disabled
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Lista>
    </section>
  );
}

function Vacia() {
  return (
    <div className={styles.vacia}>
      <Icono icono={Layers} tamano={28} className={texto.terciario} />
      <span className={texto.subtitle}>Todavía no tenés rutinas</span>
      <span className={`${texto.bodySm} ${texto.secundario}`}>
        Cuando crees una va a aparecer acá, junto con las que archives más adelante.
      </span>
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
