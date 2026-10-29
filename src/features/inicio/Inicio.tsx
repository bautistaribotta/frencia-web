/* Inicio (/). Responde que toca esta semana y que paso; no hay Empezar,
   porque desde la web no se entrena (kit web, Web · 4).
   - Con rutina en curso: Actividad arriba (los dias entrenados del ultimo
     año, solo informativa), los dias de la rutina con el que toca marcado
     (hoy o el proximo) y, a la derecha, las ultimas sesiones.
   - Cuenta nueva: la invitacion a armar la primera rutina y los tres pasos.
   - Primera carga: esqueletos con la forma del contenido.
   La racha y la semana salen de las mismas lecturas que usa la app.
   Pendiente del diseño: las mejores marcas recientes (no hay de donde
   leerlas todavia) y la lista de ejercicios de cada dia, que llega con el
   resumen de ejercicios de la etapa de rutinas.
   Fondo: cumbre, quieto. */

import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Flame, Plus, RotateCw, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { claseFila, Encabezado, Lista, Pagina } from '@/design/components/Pagina';
import { Esqueleto, Insignia, Tarjeta, TiraSemana } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { useSesion } from '@/contexts/sesion';
import { cargarActividad, diaQueToca, type SesionHecha } from '@/lib/actividad';
import { cargarRutinaActiva, cargarUltimasSesiones, type RutinaDetalle } from '@/lib/inicio';
import { useNombre } from '@/lib/perfil';
import { calcularRacha, fechaLocal } from '@/lib/streak';
import { duracionSesion, indiceSemanaLunes, MESES_CORTO, MESES_LARGO } from '@/lib/tiempo';
import { Actividad } from './Actividad';
import styles from './Inicio.module.css';

const DIAS_LARGO = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DIAS_CORTO = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** "Sábado 24 de octubre". */
function fechaSaludo(d: Date): string {
  return `${DIAS_LARGO[indiceSemanaLunes(d)]} ${d.getDate()} de ${MESES_LARGO[d.getMonth()].toLowerCase()}`;
}

/** "Jue 22 oct". */
function fechaCorta(d: Date): string {
  return `${DIAS_CORTO[indiceSemanaLunes(d)]} ${d.getDate()} ${MESES_CORTO[d.getMonth()]}`;
}

export function Inicio() {
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const { nombre } = useNombre();
  const ahora = new Date();

  const rutina = useQuery({ queryKey: ['rutina-activa', userId], queryFn: () => cargarRutinaActiva(userId), enabled: !!userId });
  const actividad = useQuery({
    queryKey: ['actividad', userId],
    queryFn: () => cargarActividad(userId),
    enabled: !!userId,
  });
  const sesiones = useQuery({
    queryKey: ['ultimas-sesiones', userId],
    queryFn: () => cargarUltimasSesiones(userId),
    enabled: !!userId,
  });

  const conRutina = rutina.data != null && rutina.data.dias.length > 0;
  const weekdays = conRutina ? rutina.data!.dias.flatMap((d) => d.weekdays) : [];
  const racha =
    actividad.data && weekdays.length > 0
      ? calcularRacha(
          weekdays,
          actividad.data.map((s) => s.fecha),
          fechaLocal(ahora.getTime()),
        )
      : null;

  // Llama en tinta con la racha viva; neutra si hoy toca y todavia no se
  // entreno. Racha cero: no se muestra nada.
  const insigniaRacha =
    racha && racha.racha > 0 ? (
      <Insignia tono={racha.pendienteHoy ? undefined : 'intensity'} icono={Flame}>
        {racha.racha} {racha.racha === 1 ? 'entrenamiento' : 'entrenamientos'} de racha
      </Insignia>
    ) : null;

  let contenido;
  if (rutina.isPending) contenido = <Cargando />;
  else if (rutina.isError)
    contenido = (
      <Tarjeta className={styles.aviso}>
        <span className={`${texto.body} ${texto.secundario}`}>No pudimos cargar tu rutina. Revisá la conexión.</span>
        <Boton variante="secondary" icono={RotateCw} onClick={() => void rutina.refetch()}>
          Reintentar
        </Boton>
      </Tarjeta>
    );
  else if (!conRutina) contenido = <Vacio />;
  else
    contenido = (
      <ConRutina rutina={rutina.data!} actividad={actividad} sesiones={sesiones.data} />
    );

  return (
    <>
      <Fondo posicion="cumbre" />
      <Pagina>
        <Encabezado rotulo={fechaSaludo(ahora)} titulo={`Hola, ${nombre.split(' ')[0]}`} acciones={insigniaRacha} />
        {contenido}
      </Pagina>
    </>
  );
}

function ConRutina({
  rutina,
  actividad,
  sesiones,
}: {
  rutina: RutinaDetalle;
  actividad: { data: SesionHecha[] | undefined; isError: boolean; refetch: () => unknown };
  sesiones: Awaited<ReturnType<typeof cargarUltimasSesiones>> | undefined;
}) {
  // Mientras se lee la actividad no se marca ningun dia: podria ser hoy o no.
  const toca = actividad.data ? diaQueToca(rutina.dias, actividad.data, new Date()) : null;
  return (
    <>
      {actividad.data ? (
        <Actividad sesiones={actividad.data} />
      ) : actividad.isError ? (
        <Tarjeta className={styles.aviso}>
          <span className={`${texto.bodySm} ${texto.secundario}`}>No pudimos cargar tu actividad.</span>
          <Boton variante="secondary" tamano="sm" icono={RotateCw} onClick={() => void actividad.refetch()}>
            Reintentar
          </Boton>
        </Tarjeta>
      ) : (
        <Tarjeta className={styles.esqActividad}>
          <Esqueleto className={styles.esqLinea} />
          <Esqueleto className={styles.esqCuadro} />
        </Tarjeta>
      )}

      <div className={styles.dos}>
        <section className={styles.columna}>
          <div className={styles.fila}>
            <div className={styles.nombreRutina}>
              <h2 className={`${texto.subtitle} ${styles.sinMargen}`}>{rutina.name}</h2>
              <Insignia tono="signal">En curso</Insignia>
            </div>
            <BotonEnlace to={`/rutinas/${rutina.id}`}>Ver rutina</BotonEnlace>
          </div>
          <div className={styles.tres}>
            {rutina.dias.map((d) => {
              const marca = toca?.id === d.id ? toca : null;
              return (
                <Link
                  key={d.id}
                  to={`/rutinas/${rutina.id}`}
                  className={`${styles.tarjetaDia} ${marca ? styles.tarjetaHoy : ''}`}
                >
                  <span className={styles.diaTextos}>
                    <span className={`${texto.subtitle} ${texto.primario}`}>{d.name}</span>
                    <span className={`${texto.label} ${texto.terciario}`}>
                      {marca ? <span className={texto.acento}>{rotuloToca(marca)} · </span> : null}
                      {d.ejercicios} {d.ejercicios === 1 ? 'ejercicio' : 'ejercicios'}
                    </span>
                    {marca?.cuando === 'hoy' ? (
                      <span className={`${styles.hoyToca} ${texto.bodySm} ${texto.secundario}`}>
                        <Icono icono={Smartphone} tamano={16} />
                        Empezalo desde la app
                      </span>
                    ) : null}
                  </span>
                  <TiraSemana marcados={d.weekdays} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className={styles.columna}>
          <div className={styles.fila}>
            <h2 className={`${texto.subtitle} ${styles.sinMargen}`}>Últimas sesiones</h2>
            <BotonEnlace to="/historial">Historial</BotonEnlace>
          </div>
          {sesiones === undefined ? (
            <Tarjeta className={styles.listaCargando}>
              <Esqueleto />
              <Esqueleto className={styles.esqLinea} />
              <Esqueleto />
            </Tarjeta>
          ) : sesiones.length === 0 ? (
            <div className={styles.punteada}>
              <span className={`${texto.bodySm} ${texto.secundario}`}>
                Todavía no hay sesiones. Las que registres desde la app aparecen acá.
              </span>
            </div>
          ) : (
            <Lista>
              {sesiones.map((s) => (
                <Link key={s.id} to={`/historial/${s.id}`} className={claseFila(true)}>
                  <span className={styles.filaTextos}>
                    <span className={`${texto.bodySm} ${texto.primario} ${texto.semi}`}>{s.dayName ?? 'Sesión'}</span>
                    <span className={`${texto.label} ${texto.terciario}`}>
                      {fechaCorta(new Date(s.finishedAt))} · {s.series} {s.series === 1 ? 'serie' : 'series'}
                    </span>
                  </span>
                  <span className={`${texto.data} ${texto.primario}`}>{duracionSesion(s.startedAt, s.finishedAt)}</span>
                </Link>
              ))}
            </Lista>
          )}
        </section>
      </div>
    </>
  );
}

/** "Hoy", "Próximo · Vie" o, sin dias de la semana, "Próximo". */
function rotuloToca(toca: NonNullable<ReturnType<typeof diaQueToca>>): string {
  if (toca.cuando === 'hoy') return 'Hoy';
  return toca.weekday === null ? 'Próximo' : `Próximo · ${DIAS_CORTO[toca.weekday]}`;
}

/** Boton fantasma chico que navega: "Ver rutina →", "Historial →". */
function BotonEnlace({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className={styles.enlace}>
      {children}
      <Icono icono={ArrowRight} tamano={16} />
    </Link>
  );
}

const PASOS = [
  ['Armá tu rutina acá', 'Con el catálogo al lado y arrastrando ejercicios.'],
  ['Entrená con la app', 'Registrá peso, reps y RIR desde el celular.'],
  ['Revisá tu progreso', 'Historial y mejores marcas, en la pantalla grande.'],
];

function Vacio() {
  const navegar = useNavigate();
  return (
    <>
      <Tarjeta className={styles.hero}>
        <span className={`${texto.label} ${texto.terciario}`}>Tu primera rutina</span>
        <span className={`${texto.display} ${styles.heroTexto}`}>Traé la rutina que ya usás.</span>
        <span className={`${texto.body} ${texto.secundario} ${styles.heroTexto}`}>
          Todavía no tenés rutinas. Cargala acá con el teclado y el catálogo a mano; después la entrenás desde el celular.
        </span>
        <Boton tamano="lg" icono={Plus} title="Crear primera rutina (N)" onClick={() => navegar('/rutinas/nueva')}>
          Crear primera rutina
        </Boton>
      </Tarjeta>
      <div className={styles.tres}>
        {PASOS.map(([titulo, detalle], i) => (
          <div key={titulo} className={`${styles.paso} ${styles.punteada}`}>
            <span className={`${styles.pasoN} ${i === 0 ? styles.pasoOn : ''}`}>{i + 1}</span>
            <span className={`${texto.bodySm} ${texto.primario} ${texto.semi}`}>{titulo}</span>
            <span className={`${texto.bodySm} ${texto.secundario}`}>{detalle}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Cargando() {
  return (
    <div className={styles.cargando} aria-busy="true" aria-label="Cargando el inicio">
      <Tarjeta>
        <Esqueleto className={styles.esqBloque} />
      </Tarjeta>
      <div className={styles.dos}>
        <div className={styles.tres}>
          {[0, 1, 2].map((i) => (
            <Tarjeta key={i} className={styles.esqTarjeta}>
              <Esqueleto className={styles.esqTitulo} />
              <Esqueleto className={styles.esqLinea} />
              <Esqueleto />
              <Esqueleto className={styles.esqRotulo} />
            </Tarjeta>
          ))}
        </div>
        <Tarjeta className={styles.esqTarjeta}>
          <Esqueleto />
          <Esqueleto className={styles.esqLinea} />
          <Esqueleto />
        </Tarjeta>
      </div>
    </div>
  );
}
