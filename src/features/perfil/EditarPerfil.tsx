/* Editar perfil (/perfil/editar, kit web, Web · 7). Los mismos datos que la
   pantalla de la app (nombre, apellido, sexo, fecha de nacimiento, altura y
   peso) en una sola columna, con los campos flotantes del acceso en lugar de
   rueda, regla y arco: todo se escribe, salvo el sexo, que es un selector.
   Ningun dato es obligatorio; los vacios se guardan como null.
   Altura y peso se escriben en la unidad de Configuracion, que va como sufijo
   dentro del campo, y se guardan en cm y kg. En pies, la altura se parte en
   pies y pulgadas. Mientras el campo tiene foco, debajo va el rango; al
   salir, si no esta en rango, el error.
   Guardar se habilita cuando algo cambio y todo es valido. Salir con cambios
   (Cancelar, Perfil, la navegacion o cerrar la pestaña) pide confirmar antes
   de descartarlos, como en la app.
   Fondo: cumbre. */

import { Calendar, Check, ChevronLeft, Ruler, User, Weight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { Boton } from '@/design/components/Boton';
import { Campo } from '@/design/components/Campo';
import { Fondo } from '@/design/components/Fondo';
import { Modal } from '@/design/components/Modal';
import { Pagina } from '@/design/components/Pagina';
import { Segmentado } from '@/design/components/Segmentado';
import { Esqueleto, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { cmAPiesPulgadas, piesPulgadasACm, type UnidadAltura } from '@/lib/altura';
import { EDAD_MAXIMA, EDAD_MINIMA, formatearFecha, leerFechaNacimiento } from '@/lib/edad';
import { useGuardarDatosPersonales, usePerfil, type Perfil } from '@/lib/perfil';
import { kgALb, mostrarPeso, pesoACanonico, type UnidadPeso } from '@/lib/peso';
import { useVolver } from '@/lib/volver';
import styles from './EditarPerfil.module.css';

type Sexo = 'masculino' | 'femenino' | 'otro';

const SEXOS: { valor: Sexo; etiqueta: string }[] = [
  { valor: 'masculino', etiqueta: 'Masculino' },
  { valor: 'femenino', etiqueta: 'Femenino' },
  { valor: 'otro', etiqueta: 'Otro' },
];

// Rangos del kit. En pies se valida en pulgadas totales: 3' 3" a 8' 2".
const ALTURA_CM = { min: 100, max: 250 };
const ALTURA_IN = { min: 39, max: 98 };
const PESO_KG = { min: 30, max: 300 };
const PESO_LB = { min: Math.round(kgALb(PESO_KG.min)), max: Math.round(kgALb(PESO_KG.max)) };

const MAX_NOMBRE = 40;
const FORMATO_FECHA = 'Se escribe como día/mes/año.';

const piesYPulgadas = (pulgadas: number) => `${Math.floor(pulgadas / 12)}' ${pulgadas % 12}"`;
const soloDigitos = (escrito: string, largo: number) => escrito.replace(/\D/g, '').slice(0, largo);

/** Numero con un decimal como mucho; acepta coma o punto. */
function soloDecimal(escrito: string): string {
  const limpio = escrito.replace(',', '.').replace(/[^\d.]/g, '');
  const [entero = '', ...resto] = limpio.split('.');
  return resto.length ? `${entero.slice(0, 3)}.${resto.join('').slice(0, 1)}` : entero.slice(0, 3);
}

/** Lo que muestra el formulario, como texto y en la unidad del usuario. */
interface Valores {
  nombre: string;
  apellido: string;
  sexo: Sexo | '';
  fecha: string;
  /** cm, o pies en el sistema imperial. */
  altura: string;
  pulgadas: string;
  peso: string;
}

type Clave = keyof Valores;

function valoresIniciales(p: Perfil, unidadAltura: UnidadAltura, unidadPeso: UnidadPeso): Valores {
  const [a, m, d] = p.fecha_nacimiento?.split('-') ?? [];
  const pies = p.altura != null && unidadAltura === 'ft' ? cmAPiesPulgadas(p.altura) : null;
  return {
    nombre: p.name ?? '',
    apellido: p.surname ?? '',
    sexo: SEXOS.some((s) => s.valor === p.sexo) ? (p.sexo as Sexo) : '',
    fecha: a ? `${d}/${m}/${a}` : '',
    altura: p.altura == null ? '' : pies ? String(pies.pies) : String(Math.round(p.altura)),
    pulgadas: pies ? String(pies.pulgadas) : '',
    peso: p.peso == null ? '' : String(mostrarPeso(p.peso, unidadPeso)),
  };
}

// Firma de lo que se persiste, para saber si hay cambios sin guardar.
function firma(v: Valores): string {
  return JSON.stringify([v.nombre.trim(), v.apellido.trim(), v.sexo, v.fecha, Number(v.altura) || '', Number(v.pulgadas) || '', Number(v.peso) || '']);
}

export function EditarPerfil() {
  const perfil = usePerfil();
  return (
    <>
      <Fondo posicion="cumbre" />
      <Pagina>
        {perfil.data ? (
          <Formulario perfil={perfil.data} />
        ) : (
          <div className={styles.form}>
            <Encabezado />
            <Esqueleto className={styles.esqTarjeta} />
          </div>
        )}
      </Pagina>
    </>
  );
}

function Encabezado() {
  const volver = useVolver('/perfil');
  return (
    <>
      <div className={styles.migas}>
        <Boton variante="ghost" tamano="sm" icono={ChevronLeft} onClick={volver.volver}>
          {volver.corta}
        </Boton>
      </div>
      <div className={styles.titulos}>
        <h1 className={`${texto.display} ${styles.titulo}`}>Editar perfil</h1>
        <span className={`${texto.bodySm} ${texto.secundario}`}>Ningún dato es obligatorio. Las unidades se cambian en Configuración.</span>
      </div>
    </>
  );
}

function Formulario({ perfil }: { perfil: Perfil }) {
  const volver = useVolver('/perfil');
  const avisar = useAvisos();
  const guardar = useGuardarDatosPersonales();
  const unidadAltura = (perfil.unidad_altura ?? 'cm') as UnidadAltura;
  const unidadPeso = (perfil.unidad_peso ?? 'kg') as UnidadPeso;
  const imperial = unidadAltura === 'ft';
  const [original] = useState(() => valoresIniciales(perfil, unidadAltura, unidadPeso));
  const [v, setV] = useState(original);
  const [enFoco, setEnFoco] = useState<Clave | null>(null);
  const cambiar = (cambio: Partial<Valores>) => setV((anterior) => ({ ...anterior, ...cambio }));
  // El foco de cada campo decide si debajo va el rango (escribiendo) o el error.
  const foco = (clave: Clave) => ({ onFocus: () => setEnFoco(clave), onBlur: () => setEnFoco(null) });

  // Fecha
  const fecha = leerFechaNacimiento(v.fecha);
  const errorFecha =
    fecha.estado === 'incompleta'
      ? `Falta completarla. ${FORMATO_FECHA}`
      : fecha.estado === 'inexistente'
        ? 'Esa fecha no existe.'
        : fecha.estado === 'fuera'
          ? `La edad tiene que estar entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años.`
          : null;
  const ayudaFecha = fecha.estado === 'ok' ? `Tenés ${fecha.edad} ${fecha.edad === 1 ? 'año' : 'años'}. ${FORMATO_FECHA}` : FORMATO_FECHA;

  // Altura: en pulgadas totales si es imperial, si no en cm. null = vacia.
  const sinAltura = v.altura === '' && (!imperial || v.pulgadas === '');
  const alturaNum = sinAltura ? null : imperial ? Number(v.altura || 0) * 12 + Number(v.pulgadas || 0) : Number(v.altura);
  const rangoAltura = imperial ? ALTURA_IN : ALTURA_CM;
  const alturaValida = alturaNum === null || (alturaNum >= rangoAltura.min && alturaNum <= rangoAltura.max && Number(v.pulgadas || 0) < 12);
  const textoRangoAltura = imperial
    ? `Entre ${piesYPulgadas(ALTURA_IN.min)} y ${piesYPulgadas(ALTURA_IN.max)}.`
    : `Entre ${ALTURA_CM.min} y ${ALTURA_CM.max} cm.`;
  const errorAltura = alturaValida ? null : `La altura tiene que estar ${textoRangoAltura.toLowerCase().replace(/\.$/, '')}.`;

  // Peso
  const pesoNum = v.peso === '' ? null : Number(v.peso);
  const rangoPeso = unidadPeso === 'lb' ? PESO_LB : PESO_KG;
  const pesoValido = pesoNum === null || (pesoNum >= rangoPeso.min && pesoNum <= rangoPeso.max);
  const textoRangoPeso = `Entre ${rangoPeso.min} y ${rangoPeso.max} ${unidadPeso}.`;
  const errorPeso = pesoValido ? null : `El peso tiene que estar ${textoRangoPeso.toLowerCase().replace(/\.$/, '')}.`;

  const sucio = firma(v) !== firma(original);
  const valido = !errorFecha && alturaValida && pesoValido;
  const puedeGuardar = sucio && valido && !guardar.isPending;

  // Despues de guardar se sale sin preguntar.
  const guardado = useRef(false);
  const bloqueo = useBlocker(({ currentLocation, nextLocation }) => sucio && !guardado.current && currentLocation.pathname !== nextLocation.pathname);

  // Cerrar o recargar la pestaña con cambios: el aviso del navegador.
  useEffect(() => {
    if (!sucio) return;
    const alSalir = (evento: BeforeUnloadEvent) => evento.preventDefault();
    window.addEventListener('beforeunload', alSalir);
    return () => window.removeEventListener('beforeunload', alSalir);
  }, [sucio]);

  async function enviar() {
    if (!puedeGuardar) return;
    // Lo que no se toco se manda tal como estaba, sin pasar por la unidad del
    // usuario: un peso guardado en kg y mostrado en lb no se redondea.
    const alturaIgual = v.altura === original.altura && v.pulgadas === original.pulgadas;
    const datos = {
      name: v.nombre.trim() || null,
      surname: v.apellido.trim() || null,
      sexo: v.sexo || null,
      fecha_nacimiento: fecha.estado === 'ok' ? fecha.fecha : null,
      altura: alturaIgual ? perfil.altura : alturaNum === null ? null : imperial ? piesPulgadasACm(0, alturaNum) : alturaNum,
      peso: v.peso === original.peso ? perfil.peso : pesoNum === null ? null : pesoACanonico(pesoNum, unidadPeso),
    };
    try {
      await guardar.mutateAsync(datos);
    } catch {
      avisar('No pudimos guardar tu perfil. Probá de nuevo.', 'error');
      return;
    }
    guardado.current = true;
    avisar('Perfil actualizado');
    // Guardar vuelve, como Cancelar, a la pantalla de la que se llego.
    volver.volver();
  }

  return (
    <form
      className={styles.form}
      onSubmit={(evento) => {
        evento.preventDefault();
        void enviar();
      }}
    >
      <Encabezado />
      <Tarjeta className={styles.tarjeta}>
        <Campo
          flotante
          rotulo="Nombre"
          icono={User}
          value={v.nombre}
          onChange={(e) => cambiar({ nombre: e.target.value })}
          autoComplete="given-name"
          maxLength={MAX_NOMBRE}
        />
        <Campo
          flotante
          rotulo="Apellido"
          icono={User}
          value={v.apellido}
          onChange={(e) => cambiar({ apellido: e.target.value })}
          autoComplete="family-name"
          maxLength={MAX_NOMBRE}
        />
        <div className={styles.grupo}>
          <span className={`${texto.label} ${texto.terciario}`}>Sexo</span>
          <Segmentado<Sexo | ''> opciones={SEXOS} valor={v.sexo} onChange={(sexo) => cambiar({ sexo })} etiqueta="Sexo" ancho />
        </div>
        <Campo
          flotante
          rotulo="Fecha de nacimiento"
          icono={Calendar}
          value={v.fecha}
          onChange={(e) => cambiar({ fecha: formatearFecha(e.target.value) })}
          inputMode="numeric"
          autoComplete="bday"
          maxLength={10}
          ayuda={ayudaFecha}
          error={enFoco === 'fecha' ? null : errorFecha}
          {...foco('fecha')}
        />
        {imperial ? (
          <div className={styles.fila}>
            <Campo
              flotante
              className={styles.crece}
              rotulo="Altura · pies"
              icono={Ruler}
              sufijo="ft"
              value={v.altura}
              onChange={(e) => cambiar({ altura: soloDigitos(e.target.value, 1) })}
              inputMode="numeric"
              ayuda={enFoco === 'altura' || enFoco === 'pulgadas' ? textoRangoAltura : undefined}
              error={enFoco === 'altura' || enFoco === 'pulgadas' ? null : errorAltura}
              {...foco('altura')}
            />
            <Campo
              flotante
              className={styles.crece}
              rotulo="Pulgadas"
              sufijo="in"
              value={v.pulgadas}
              onChange={(e) => cambiar({ pulgadas: soloDigitos(e.target.value, 2) })}
              inputMode="numeric"
              {...foco('pulgadas')}
            />
          </div>
        ) : (
          <Campo
            flotante
            rotulo="Altura"
            icono={Ruler}
            sufijo="cm"
            value={v.altura}
            onChange={(e) => cambiar({ altura: soloDigitos(e.target.value, 3) })}
            inputMode="numeric"
            ayuda={enFoco === 'altura' ? textoRangoAltura : undefined}
            error={enFoco === 'altura' ? null : errorAltura}
            {...foco('altura')}
          />
        )}
        <Campo
          flotante
          rotulo="Peso"
          icono={Weight}
          sufijo={unidadPeso}
          value={v.peso}
          onChange={(e) => cambiar({ peso: soloDecimal(e.target.value) })}
          inputMode="decimal"
          ayuda={enFoco === 'peso' ? textoRangoPeso : undefined}
          error={enFoco === 'peso' ? null : errorPeso}
          {...foco('peso')}
        />
      </Tarjeta>
      <div className={styles.botones}>
        <Boton type="submit" tamano="lg" ancho icono={Check} disabled={!puedeGuardar} cargando={guardar.isPending}>
          Guardar
        </Boton>
        <Boton variante="ghost" tamano="lg" ancho onClick={volver.volver} disabled={guardar.isPending}>
          Cancelar
        </Boton>
      </div>

      <Modal
        abierto={bloqueo.state === 'blocked'}
        chico
        titulo="¿Descartar los cambios?"
        texto="Lo que editaste en tu perfil se va a perder."
        onCerrar={() => bloqueo.reset?.()}
        pie={
          <>
            <Boton variante="secondary" data-foco-inicial onClick={() => bloqueo.reset?.()}>
              Seguir editando
            </Boton>
            <Boton variante="danger" onClick={() => bloqueo.proceed?.()}>
              Descartar
            </Boton>
          </>
        }
      />
    </form>
  );
}
