/* Detalle de una rutina (/rutinas/:id). Los dias en columnas, con cada
   ejercicio, su tipo y su resumen: volumen · intensidad en tinta · descanso
   (kit web, Web · 4).
   Editar rutina abre el constructor. Compartir, Poner en curso (si esta
   archivada) y el menu quedan a la vista pero desactivados por ahora.
   Fondo: cumbre. */

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Ellipsis, Pencil, Play, RotateCw, Share } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { Resumen, Tipo } from '@/design/components/datos';
import { Fondo } from '@/design/components/Fondo';
import { Pagina } from '@/design/components/Pagina';
import { Esqueleto, Insignia, Tarjeta, TiraSemana } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import type { UnidadDistancia } from '@/lib/distancia';
import { usePerfil } from '@/lib/perfil';
import type { UnidadPeso } from '@/lib/peso';
import { cargarRutina, cuentaRutina, fechaCorta, resumenEjercicio, type DiaDetalle, type RutinaDetalle } from '@/lib/rutinas';
import styles from './DetalleRutina.module.css';

const PRONTO = 'Muy pronto';

export function DetalleRutina() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const rutina = useQuery({ queryKey: ['rutina', id], queryFn: () => cargarRutina(id) });

  let contenido;
  if (rutina.isPending) contenido = <Cargando />;
  else if (rutina.isError)
    contenido = (
      <Aviso titulo="No pudimos cargar la rutina" texto="Revisá tu conexión y probá de nuevo.">
        <Boton variante="secondary" icono={RotateCw} onClick={() => void rutina.refetch()}>
          Reintentar
        </Boton>
      </Aviso>
    );
  else if (!rutina.data) contenido = <Aviso titulo="No encontramos esta rutina" texto="Puede que se haya eliminado o que no sea tuya." />;
  else contenido = <Contenido rutina={rutina.data} />;

  return (
    <>
      <Fondo posicion="cumbre" />
      <Pagina>
        <div className={styles.migas}>
          <Boton variante="ghost" tamano="sm" icono={ChevronLeft} onClick={() => navegar('/rutinas')}>
            Rutinas
          </Boton>
        </div>
        {contenido}
      </Pagina>
    </>
  );
}

function Contenido({ rutina }: { rutina: RutinaDetalle }) {
  const navegar = useNavigate();
  const fecha = rutina.archivadaEl ? `archivada el ${fechaCorta(rutina.archivadaEl)}` : `creada el ${fechaCorta(rutina.creadaEl)}`;
  return (
    <>
      <header className={styles.encabezado}>
        <div className={styles.encabezadoTextos}>
          <div>{rutina.activa ? <Insignia tono="signal">En curso</Insignia> : <Insignia>Archivada</Insignia>}</div>
          <h1 className={styles.nombre}>{rutina.name}</h1>
          <span className={`${texto.data} ${texto.secundario}`}>
            {cuentaRutina(rutina)} · {fecha}
          </span>
        </div>
        <div className={styles.acciones}>
          <Boton variante="secondary" icono={Share} disabled title={PRONTO}>
            Compartir
          </Boton>
          {rutina.activa ? (
            <Boton icono={Pencil} onClick={() => navegar(`/rutinas/${rutina.id}/editar`)}>
              Editar rutina
            </Boton>
          ) : (
            <Boton icono={Play} disabled title={PRONTO}>
              Poner en curso
            </Boton>
          )}
          <BotonIcono icono={Ellipsis} variante="surface" etiqueta="Más acciones: muy pronto" disabled />
        </div>
      </header>
      <div className={styles.dias}>
        {rutina.dias.map((d) => (
          <Dia key={d.id} dia={d} />
        ))}
      </div>
    </>
  );
}

function Dia({ dia }: { dia: DiaDetalle }) {
  const perfil = usePerfil().data;
  const unidadPeso = (perfil?.unidad_peso ?? 'kg') as UnidadPeso;
  const unidadDistancia = (perfil?.unidad_distancia ?? 'km') as UnidadDistancia;
  return (
    <Tarjeta className={styles.dia}>
      {/* De arriba hacia abajo: el nombre, los dias de la semana y la cantidad
          de ejercicios; despues, la lista. */}
      <div className={styles.diaCabeza}>
        <h2 className={`${texto.subtitle} ${styles.sinMargen}`}>{dia.name}</h2>
        <TiraSemana marcados={dia.weekdays} />
        <span className={`${texto.label} ${texto.terciario}`}>
          {dia.ejercicios} {dia.ejercicios === 1 ? 'ejercicio' : 'ejercicios'}
        </span>
      </div>
      {dia.plan.length > 0 ? (
        <ol className={styles.ejercicios}>
          {dia.plan.map((ej, i) => (
            <li key={i} className={styles.ejercicio}>
              <span className={styles.numero}>{String(i + 1).padStart(2, '0')}</span>
              <Tipo tipo={ej.kind} />
              <div className={styles.ejercicioTextos}>
                <span className={`${texto.bodySm} ${texto.semi} ${styles.unaLinea}`}>{ej.name}</span>
                <Resumen {...resumenEjercicio(ej, unidadPeso, unidadDistancia)} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <span className={`${texto.bodySm} ${texto.terciario}`}>Sin ejercicios todavía.</span>
      )}
    </Tarjeta>
  );
}

function Aviso({ titulo, texto: bajada, children }: { titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className={styles.aviso}>
      <span className={texto.subtitle}>{titulo}</span>
      <span className={`${texto.bodySm} ${texto.secundario}`}>{bajada}</span>
      {children}
    </div>
  );
}

function Cargando() {
  return (
    <>
      <div className={styles.encabezadoTextos}>
        <Esqueleto className={styles.esqRotulo} />
        <Esqueleto className={styles.esqNombre} />
        <Esqueleto className={styles.esqLinea} />
      </div>
      <div className={styles.dias}>
        {[0, 1, 2].map((i) => (
          <Tarjeta key={i} className={styles.dia}>
            <Esqueleto className={styles.esqTitulo} />
            <Esqueleto className={styles.esqLinea} />
            <Esqueleto />
            <Esqueleto className={styles.esqLinea} />
          </Tarjeta>
        ))}
      </div>
    </>
  );
}
