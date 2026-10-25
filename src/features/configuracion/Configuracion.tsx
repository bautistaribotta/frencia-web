/* Configuracion (/configuracion). Junta lo que en la app esta repartido entre
   Perfil y Configuracion (kit web, Web · 7): tema, reducir transparencia,
   unidades y medidor de esfuerzo, los textos legales (en el modal de
   lectura) y la eliminacion de la cuenta.
   Todo menos la transparencia se guarda en profiles y se aplica en el acto;
   si la base no lo acepta vuelve a lo anterior y avisa, como en la app.
   Eliminar cuenta: dos pasos, como en la app (docs/specs/eliminacion-de-cuenta.md
   del repo mobile). El foco arranca en Cancelar; el segundo aviso no se
   puede descartar y Entendido cierra la sesion.
   Fondo: cumbre. */

import { ArrowUpRight, FileText, Monitor, Moon, Shield, Sun, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { useAvisos } from '@/contexts/avisos';
import { Boton } from '@/design/components/Boton';
import { DocumentoLegal, type Documento } from '@/design/components/DocumentoLegal';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Interruptor } from '@/design/components/Interruptor';
import { Modal } from '@/design/components/Modal';
import { claseFila, Encabezado, Fila, Lista, Pagina } from '@/design/components/Pagina';
import { Segmentado } from '@/design/components/Segmentado';
import { aplicarPreferencia, preferenciaAPerfil, usePreferenciaTema, type PreferenciaTema } from '@/design/tema';
import texto from '@/design/texto.module.css';
import { useTransparenciaReducida } from '@/design/transparencia';
import { DIAS_DE_GRACIA, fechaPurga, solicitarEliminacionCuenta } from '@/lib/cuenta';
import { usePerfil, useGuardarPreferencias, type CambioPreferencias } from '@/lib/perfil';
import { supabase } from '@/lib/supabase';
import { fechaLarga } from '@/lib/tiempo';
import styles from './Configuracion.module.css';

const TEMA_SUB: Record<PreferenciaTema, string> = {
  system: 'Sigue al tema de tu computadora',
  dark: 'Siempre oscuro',
  light: 'Siempre claro',
};

type CampoUnidad = 'unidad_peso' | 'unidad_altura' | 'unidad_distancia' | 'medidor_esfuerzo';

// Las tres unidades y el medidor van juntos, con el selector del mismo ancho.
// La primera opcion es el valor por defecto de la base.
const UNIDADES: { campo: CampoUnidad; titulo: string; sub?: string; etiqueta: string; opciones: [string, string] }[] = [
  { campo: 'unidad_peso', titulo: 'Peso', etiqueta: 'Unidad de peso', opciones: ['kg', 'lb'] },
  { campo: 'unidad_altura', titulo: 'Altura', etiqueta: 'Unidad de altura', opciones: ['cm', 'ft'] },
  { campo: 'unidad_distancia', titulo: 'Distancia', etiqueta: 'Unidad de distancia', opciones: ['km', 'mi'] },
  {
    campo: 'medidor_esfuerzo',
    titulo: 'Esfuerzo',
    sub: 'Lo que se propone al armar una rutina. Cada ejercicio puede cambiarlo.',
    etiqueta: 'Medir el esfuerzo con',
    opciones: ['rir', 'rpe'],
  },
];

function Ajuste({ titulo, sub, children }: { titulo: string; sub?: string; children: ReactNode }) {
  return (
    <Fila>
      <div className={styles.ajusteTextos}>
        <span className={`${texto.bodySm} ${texto.semi}`}>{titulo}</span>
        {sub ? <span className={`${texto.bodySm} ${texto.terciario}`}>{sub}</span> : null}
      </div>
      {children}
    </Fila>
  );
}

type PasoEliminar = null | 'confirmar' | { purga: Date };

export function Configuracion() {
  const perfil = usePerfil();
  const guardar = useGuardarPreferencias();
  const avisar = useAvisos();
  const tema = usePreferenciaTema();
  const [transparenciaReducida, setTransparenciaReducida] = useTransparenciaReducida();
  const [paso, setPaso] = useState<PasoEliminar>(null);
  const [eliminando, setEliminando] = useState(false);
  const [documento, setDocumento] = useState<Documento | null>(null);

  const p = perfil.data;
  const listo = !!p;

  function cambiar(cambio: CambioPreferencias) {
    guardar.mutate(cambio, {
      onError: () => avisar('No pudimos guardar el ajuste. Probá de nuevo.', 'error'),
    });
  }

  function cambiarTema(nuevo: PreferenciaTema) {
    aplicarPreferencia(nuevo);
    cambiar({ tema: preferenciaAPerfil(nuevo) });
  }

  async function confirmarEliminacion() {
    setEliminando(true);
    const solicitadaEn = await solicitarEliminacionCuenta();
    setEliminando(false);
    if (!solicitadaEn) {
      setPaso(null);
      avisar('No pudimos procesar la solicitud. Probá de nuevo.', 'error');
      return;
    }
    setPaso({ purga: fechaPurga(solicitadaEn) });
  }

  return (
    <>
      <Fondo posicion="cumbre" />
      <Pagina>
        <Encabezado rotulo="Configuración" titulo="Configuración" bajada="Se guarda en tu cuenta y se aplica también en la app." />
        <div className={styles.ajustes}>
          <span className={`${texto.label} ${texto.terciario}`}>Apariencia</span>
          <Lista>
            <Ajuste titulo="Tema" sub={TEMA_SUB[tema]}>
              <Segmentado
                etiqueta="Tema"
                valor={tema}
                onChange={cambiarTema}
                disabled={!listo}
                opciones={[
                  { valor: 'system', etiqueta: 'Sistema', icono: Monitor },
                  { valor: 'dark', etiqueta: 'Oscuro', icono: Moon },
                  { valor: 'light', etiqueta: 'Claro', icono: Sun },
                ]}
              />
            </Ajuste>
            <Ajuste
              titulo="Reducir transparencia"
              sub="Superficies opacas y luces más bajas. Se guarda en este navegador y arranca siguiendo al sistema."
            >
              <Interruptor encendido={transparenciaReducida} onChange={setTransparenciaReducida} etiqueta="Reducir transparencia" />
            </Ajuste>
          </Lista>

          <span className={`${texto.label} ${texto.terciario}`}>Unidades / medidores</span>
          <Lista>
            {UNIDADES.map((u) => (
              <Ajuste key={u.campo} titulo={u.titulo} sub={u.sub}>
                <Segmentado
                  etiqueta={u.etiqueta}
                  valor={p?.[u.campo] ?? u.opciones[0]}
                  onChange={(v) => cambiar({ [u.campo]: v })}
                  disabled={!listo}
                  className={styles.unidad}
                  opciones={u.opciones.map((o) => ({ valor: o, etiqueta: u.campo === 'medidor_esfuerzo' ? o.toUpperCase() : o }))}
                />
              </Ajuste>
            ))}
          </Lista>

          <span className={`${texto.label} ${texto.terciario}`}>Legal</span>
          <Lista>
            <button type="button" className={claseFila(true)} onClick={() => setDocumento('terminos')}>
              <Icono icono={FileText} tamano={20} className={texto.secundario} />
              <span className={`${texto.bodySm} ${texto.semi} ${styles.crece}`}>Términos y condiciones</span>
              <Icono icono={ArrowUpRight} tamano={18} className={texto.terciario} />
            </button>
            <button type="button" className={claseFila(true)} onClick={() => setDocumento('privacidad')}>
              <Icono icono={Shield} tamano={20} className={texto.secundario} />
              <span className={`${texto.bodySm} ${texto.semi} ${styles.crece}`}>Política de privacidad</span>
              <Icono icono={ArrowUpRight} tamano={18} className={texto.terciario} />
            </button>
          </Lista>

          <span className={`${texto.label} ${texto.terciario}`}>Cuenta</span>
          <Lista>
            <Ajuste
              titulo="Eliminar cuenta"
              sub={`Tus datos se borran a los ${DIAS_DE_GRACIA} días. Hasta entonces podés recuperarla entrando.`}
            >
              <Boton variante="danger" tamano="sm" icono={Trash2} onClick={() => setPaso('confirmar')}>
                Eliminar cuenta
              </Boton>
            </Ajuste>
          </Lista>
        </div>
      </Pagina>

      <DocumentoLegal documento={documento} onCerrar={() => setDocumento(null)} />
      <Modal
        abierto={paso === 'confirmar'}
        chico
        titulo="Eliminar cuenta"
        texto={`Tu cuenta y todos tus datos (rutinas, sesiones e historial) se eliminan en ${DIAS_DE_GRACIA} días. Hasta entonces podés recuperarla iniciando sesión. Después no se pueden recuperar.`}
        onCerrar={eliminando ? undefined : () => setPaso(null)}
        pie={
          <>
            <Boton variante="secondary" data-foco-inicial disabled={eliminando} onClick={() => setPaso(null)}>
              Cancelar
            </Boton>
            <Boton variante="danger" icono={Trash2} cargando={eliminando} onClick={() => void confirmarEliminacion()}>
              Eliminar cuenta
            </Boton>
          </>
        }
      />
      <Modal
        abierto={paso !== null && paso !== 'confirmar'}
        chico
        titulo="Cuenta programada para eliminarse"
        texto={
          paso !== null && paso !== 'confirmar'
            ? `Se elimina el ${fechaLarga(paso.purga)}. Si cambiás de idea, entrá antes de esa fecha y vas a poder recuperarla con todos tus datos.`
            : undefined
        }
        pie={
          <Boton data-foco-inicial onClick={() => void supabase.auth.signOut()}>
            Entendido
          </Boton>
        }
      />
    </>
  );
}
