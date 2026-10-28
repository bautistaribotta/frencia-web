/* Setup del perfil (/bienvenida/perfil), la ultima fase antes de la app
   (kit web, Web · 3): un dato por paso en una tarjeta centrada, con la
   escala arriba y la pregunta siempre a la misma altura. Sexo, fecha de
   nacimiento, altura (regla) y peso (arco), con su unidad.
   Saltar deja el dato vacio y avanza; Finalizar guarda lo cargado y las
   unidades y marca el setup como terminado, aunque se hayan saltado datos.
   Enter continua. Port de setup.tsx del repo mobile, sin el modo de prueba
   que lo muestra en cada ingreso.
   Fondo: cumbre en el primer paso y centro en los demas, anima. */

import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Check, ChevronLeft, X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { Fecha } from '@/design/components/Fecha';
import { Fondo } from '@/design/components/Fondo';
import { Opciones } from '@/design/components/Opciones';
import { Arco, AyudaTeclado, Regla } from '@/design/components/Regla';
import { Segmentado } from '@/design/components/Segmentado';
import { Escala, Kbd, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { CM_POR_IN, type UnidadAltura } from '@/lib/altura';
import type { TablesUpdate } from '@/lib/database.types';
import { EDAD_MAXIMA, EDAD_MINIMA, leerFechaNacimiento } from '@/lib/edad';
import { usePerfil } from '@/lib/perfil';
import { kgALb, lbAKg, type UnidadPeso } from '@/lib/peso';
import { supabase } from '@/lib/supabase';
import styles from './Bienvenida.module.css';

type Sexo = 'masculino' | 'femenino' | 'otro';
type Dato = 'sexo' | 'fecha' | 'altura' | 'peso';

const PASOS: { dato: Dato; rotulo: string; pregunta: string; ayuda: string }[] = [
  { dato: 'sexo', rotulo: 'Tu perfil · Sexo', pregunta: '¿Con qué sexo te identificás?', ayuda: 'Afina los cálculos de progreso.' },
  { dato: 'fecha', rotulo: 'Tu perfil · Fecha de nacimiento', pregunta: '¿Cuándo naciste?', ayuda: 'Calculamos tu edad a partir de esta fecha. No se muestra a nadie.' },
  {
    dato: 'altura',
    rotulo: 'Tu perfil · Altura',
    pregunta: '¿Cuál es tu altura?',
    ayuda: 'Arrastrá la regla, usá las flechas o escribí el número. Se guarda en centímetros.',
  },
  { dato: 'peso', rotulo: 'Tu perfil · Peso', pregunta: '¿Cuál es tu peso?', ayuda: 'Lo podés cambiar desde tu perfil cuando quieras.' },
];

const SEXOS: { valor: Sexo; titulo: string }[] = [
  { valor: 'masculino', titulo: 'Masculino' },
  { valor: 'femenino', titulo: 'Femenino' },
  { valor: 'otro', titulo: 'Otro' },
];

/** "AAAA-MM-DD" de la base a "DD/MM/AAAA" de las cajas. */
function fechaACajas(fecha: string | null): string {
  const p = fecha ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha) : null;
  return p ? `${p[3]}/${p[2]}/${p[1]}` : '';
}

const pulgadasALectura = (pulgadas: number) => `${Math.floor(pulgadas / 12)}′ ${pulgadas % 12}″`;
function leerPiesPulgadas(escrito: string): number | null {
  const dos = /^(\d+)\D+(\d+)$/.exec(escrito.trim());
  if (dos) return Number(dos[1]) * 12 + Number(dos[2]);
  const uno = /^(\d+)$/.exec(escrito.trim());
  return uno ? Number(uno[1]) * 12 : null;
}

export function Setup() {
  const { user } = useSesion();
  const perfil = usePerfil().data;
  const cliente = useQueryClient();
  const navegar = useNavigate();
  const desde = (useLocation().state as { desde?: string } | null)?.desde ?? '/';

  const [indice, setIndice] = useState(0);
  const [sexo, setSexo] = useState<Sexo | null>((perfil?.sexo as Sexo | null) ?? null);
  const [fecha, setFecha] = useState(() => fechaACajas(perfil?.fecha_nacimiento ?? null));
  const [alturaCm, setAlturaCm] = useState<number>(perfil?.altura ?? 170);
  const [pesoKg, setPesoKg] = useState<number>(perfil?.peso ?? 70);
  const [unidadAltura, setUnidadAltura] = useState<UnidadAltura>(perfil?.unidad_altura === 'ft' ? 'ft' : 'cm');
  const [unidadPeso, setUnidadPeso] = useState<UnidadPeso>(perfil?.unidad_peso === 'lb' ? 'lb' : 'kg');
  // Los datos salteados no se guardan.
  const [salteados, setSalteados] = useState<Dato[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paso = PASOS[indice];
  const ultimo = indice === PASOS.length - 1;
  const lecturaFecha = leerFechaNacimiento(fecha);
  const errorFecha =
    lecturaFecha.estado === 'inexistente'
      ? 'Esa fecha no existe.'
      : lecturaFecha.estado === 'fuera'
        ? `Tenés que tener entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años.`
        : null;
  const completo = paso.dato === 'sexo' ? sexo !== null : paso.dato === 'fecha' ? lecturaFecha.estado === 'ok' : true;

  async function finalizar(salteadosFinal: Dato[]) {
    if (guardando || !user) return;
    setGuardando(true);
    setError(null);
    const vale = (d: Dato) => !salteadosFinal.includes(d);
    const payload: TablesUpdate<'profiles'> = {
      // Las unidades se guardan siempre, aunque se salte el dato.
      unidad_altura: unidadAltura,
      unidad_peso: unidadPeso,
      onboarding_completed: true,
    };
    if (vale('sexo') && sexo) payload.sexo = sexo;
    if (vale('fecha') && lecturaFecha.estado === 'ok') payload.fecha_nacimiento = lecturaFecha.fecha;
    if (vale('altura')) payload.altura = alturaCm;
    if (vale('peso')) payload.peso = pesoKg;

    const { error: fallo } = await supabase.from('profiles').update(payload).eq('id', user.id);
    if (fallo) {
      setGuardando(false);
      setError('No pudimos guardar tus datos. Probá de nuevo.');
      return;
    }
    await cliente.invalidateQueries({ queryKey: ['perfil', user.id] });
    navegar(desde, { replace: true });
  }

  function continuar() {
    if (!completo || guardando) return;
    const sinEste = salteados.filter((d) => d !== paso.dato);
    setSalteados(sinEste);
    if (ultimo) void finalizar(sinEste);
    else setIndice((i) => i + 1);
  }

  function saltar() {
    if (guardando) return;
    const con = salteados.includes(paso.dato) ? salteados : [...salteados, paso.dato];
    setSalteados(con);
    setError(null);
    if (ultimo) void finalizar(con);
    else setIndice((i) => i + 1);
  }

  // Enter continua desde cualquier lado del paso, salvo en los botones de
  // la barra y el pie, que hacen lo suyo.
  function alTeclear(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Enter' || e.defaultPrevented) return;
    const destino = e.target as HTMLElement;
    if (destino.tagName === 'BUTTON' && destino.getAttribute('role') !== 'radio') return;
    e.preventDefault();
    continuar();
  }

  const pulgadas = Math.round(alturaCm / CM_POR_IN);
  const libras = Math.round(kgALb(pesoKg));

  let control;
  if (paso.dato === 'sexo')
    control = <Opciones etiqueta="Sexo" opciones={SEXOS} valor={sexo} onChange={setSexo} autoFocus />;
  else if (paso.dato === 'fecha') control = <Fecha valor={fecha} onChange={setFecha} error={errorFecha} autoFocus />;
  else if (paso.dato === 'altura')
    control = (
      <div className={styles.centro}>
        <Segmentado
          etiqueta="Unidad de altura"
          className={styles.unidad}
          valor={unidadAltura}
          onChange={setUnidadAltura}
          opciones={[
            { valor: 'cm', etiqueta: 'cm' },
            { valor: 'ft', etiqueta: 'ft' },
          ]}
        />
        {unidadAltura === 'cm' ? (
          <Regla etiqueta="Altura" valor={Math.round(alturaCm)} onChange={setAlturaCm} min={100} max={250} paso={1} mayor={10} media={5} unidad="cm" />
        ) : (
          <Regla
            etiqueta="Altura"
            valor={pulgadas}
            onChange={(v) => setAlturaCm(Math.round(v * CM_POR_IN))}
            min={40}
            max={98}
            paso={1}
            mayor={12}
            media={6}
            unidad=""
            lectura={pulgadasALectura}
            leer={leerPiesPulgadas}
            numero={(v) => `${v / 12}′`}
          />
        )}
        <AyudaTeclado items={[[['←', '→'], unidadAltura === 'cm' ? '±1 cm' : '±1 in'], [['Shift'], '±10']]} />
      </div>
    );
  else
    control = (
      <div className={styles.centro}>
        <Segmentado
          etiqueta="Unidad de peso"
          className={styles.unidad}
          valor={unidadPeso}
          onChange={setUnidadPeso}
          opciones={[
            { valor: 'kg', etiqueta: 'kg' },
            { valor: 'lb', etiqueta: 'lb' },
          ]}
        />
        {unidadPeso === 'kg' ? (
          <Arco
            etiqueta="Peso"
            valor={Math.round(pesoKg * 2) / 2}
            onChange={setPesoKg}
            min={30}
            max={250}
            paso={0.5}
            mayor={10}
            media={2}
            unidad="kg"
            lectura={(v) => v.toFixed(1)}
          />
        ) : (
          <Arco etiqueta="Peso" valor={libras} onChange={(v) => setPesoKg(Math.round(lbAKg(v) * 10) / 10)} min={66} max={550} paso={1} mayor={10} media={5} unidad="lb" />
        )}
        <AyudaTeclado items={[[['←', '→'], unidadPeso === 'kg' ? '±0,5 kg' : '±1 lb'], [['Shift'], unidadPeso === 'kg' ? '±5' : '±10']]} />
      </div>
    );

  return (
    <>
      <Fondo posicion={indice === 0 ? 'cumbre' : 'centro'} animado />
      <main className={styles.centrada}>
        <Tarjeta className={styles.paso}>
          <div onKeyDown={alTeclear} className={styles.pasoCuerpo} role="group" aria-label="Tu perfil">
            <div className={styles.barra}>
              {indice === 0 ? (
                <Boton variante="ghost" tamano="sm" icono={X} disabled>
                  Salir
                </Boton>
              ) : (
                <Boton variante="ghost" tamano="sm" icono={ChevronLeft} disabled={guardando} onClick={() => setIndice((i) => i - 1)}>
                  Atrás
                </Boton>
              )}
              <span className={styles.contador} aria-hidden="true">
                {String(indice + 1).padStart(2, '0')}
                <span> / {String(PASOS.length).padStart(2, '0')}</span>
              </span>
              <Boton variante="ghost" tamano="sm" disabled={guardando} onClick={saltar}>
                Saltar
              </Boton>
            </div>
            <Escala total={PASOS.length} actual={indice} />
            <div key={`enunciado-${indice}`} className={`${styles.enunciado} ${styles.entra}`}>
              <span className={`${texto.label} ${texto.acento}`}>{paso.rotulo}</span>
              <h1 className={texto.display}>{paso.pregunta}</h1>
              <span className={`${texto.bodySm} ${texto.secundario}`}>{paso.ayuda}</span>
            </div>
            <div key={`control-${indice}`} className={`${styles.control} ${styles.entra}`}>
              {control}
            </div>
            {error ? (
              <p role="alert" className={`${texto.bodySm} ${styles.error}`}>
                {error}
              </p>
            ) : null}
            <div className={styles.pie}>
              <span className={`${texto.bodySm} ${texto.terciario} ${styles.pista}`}>
                <Kbd>Enter</Kbd>
                {ultimo ? 'para terminar' : 'para continuar'}
              </span>
              <Boton
                tamano="lg"
                icono={ultimo && !guardando ? Check : undefined}
                iconoDer={ultimo ? undefined : ArrowRight}
                disabled={!completo}
                cargando={guardando}
                onClick={continuar}
              >
                {guardando ? 'Guardando…' : ultimo ? 'Finalizar' : 'Continuar'}
              </Boton>
            </div>
          </div>
        </Tarjeta>
      </main>
    </>
  );
}
