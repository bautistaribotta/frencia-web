/* Foto de perfil (kit web, Web · 7, ModalFoto): la hoja de la app pasa a un
   modal. Arriba la vista previa, que refleja cada cambio en el acto; abajo la
   zona para soltar o elegir una imagen; al pie, Listo y Generar otro avatar
   a lo ancho de la zona. Con foto cargada suma Quitar foto, como la hoja de
   la app. Cada accion se guarda en el momento: Listo solo cierra. */

import { Repeat, Upload, X } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Avatar } from '@/design/components/Avatar';
import { Boton } from '@/design/components/Boton';
import { Icono } from '@/design/components/Icono';
import { Modal } from '@/design/components/Modal';
import { Ruedita } from '@/design/components/Ruedita';
import texto from '@/design/texto.module.css';
import { semillaNueva, subirFoto, TIPOS_ACEPTADOS, usarAvatarGenerado } from '@/lib/avatar';
import { useFotoPerfil, useNombre, useParchePerfil, usePerfil } from '@/lib/perfil';
import styles from './ModalFoto.module.css';

export function ModalFoto({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const { user } = useSesion();
  const perfil = usePerfil();
  const { semilla } = useNombre();
  const ruta = perfil.data?.avatar_path ?? null;
  const foto = useFotoPerfil(ruta);
  const parche = useParchePerfil();
  const avisar = useAvisos();
  const selector = useRef<HTMLInputElement>(null);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [encima, setEncima] = useState(false);

  async function usarArchivo(archivo: File | undefined) {
    if (!archivo || !user || ocupado) return;
    setError(null);
    setOcupado(true);
    const resultado = await subirFoto(user.id, ruta, archivo);
    setOcupado(false);
    if ('error' in resultado) {
      setError(resultado.error);
      return;
    }
    parche({ avatar_path: resultado.path });
    avisar('Foto de perfil actualizada');
  }

  async function generar(semillaElegida: string) {
    if (!user || ocupado) return;
    setError(null);
    setOcupado(true);
    const ok = await usarAvatarGenerado(user.id, ruta, semillaElegida);
    setOcupado(false);
    if (!ok) {
      setError('No pudimos cambiar el avatar. Probá de nuevo.');
      return;
    }
    parche({ avatar_seed: semillaElegida, avatar_path: null });
  }

  function alSoltar(evento: DragEvent<HTMLButtonElement>) {
    evento.preventDefault();
    setEncima(false);
    void usarArchivo(evento.dataTransfer.files[0]);
  }

  return (
    <Modal
      abierto={abierto}
      chico
      titulo="Foto de perfil"
      texto="Sin foto, Frencia dibuja un avatar con los colores de la app."
      onCerrar={ocupado ? undefined : onCerrar}
      pie={
        // Listo a la izquierda y Generar otro avatar a la derecha, a lo ancho
        // de la zona para soltar. Quitar foto, si hay foto, abajo y entero.
        <div className={styles.pie}>
          <Boton data-foco-inicial disabled={ocupado} onClick={onCerrar}>
            Listo
          </Boton>
          <Boton variante="secondary" icono={Repeat} disabled={ocupado} onClick={() => void generar(semillaNueva())}>
            Generar otro avatar
          </Boton>
          {ruta ? (
            <Boton
              variante="ghost"
              icono={X}
              disabled={ocupado}
              className={styles.entero}
              onClick={() => void generar(perfil.data?.avatar_seed ?? semillaNueva())}
            >
              Quitar foto
            </Boton>
          ) : null}
        </div>
      }
    >
      <div className={styles.vista}>
        <Avatar semilla={semilla} foto={ruta ? foto.data : null} lado={128} />
        {ocupado ? (
          <span className={styles.cargando}>
            <Ruedita />
          </span>
        ) : null}
      </div>

      <button
        type="button"
        className={`${styles.soltar} ${encima ? styles.encima : ''}`}
        disabled={ocupado}
        onClick={() => selector.current?.click()}
        onDragOver={(evento) => {
          evento.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={alSoltar}
      >
        <Icono icono={Upload} tamano={20} className={texto.secundario} />
        <span className={`${texto.bodySm} ${texto.primario}`}>
          Arrastrá una imagen o <span className={`${texto.acento} ${texto.semi}`}>elegila</span>
        </span>
        <span className={`${texto.label} ${texto.terciario}`}>JPG o PNG · hasta 5 MB</span>
      </button>
      <input
        ref={selector}
        type="file"
        accept={TIPOS_ACEPTADOS.join(',')}
        className={styles.oculto}
        tabIndex={-1}
        onChange={(evento) => {
          void usarArchivo(evento.target.files?.[0]);
          evento.target.value = '';
        }}
      />

      {error ? (
        <span className={`${texto.bodySm} ${texto.peligro}`} role="alert">
          {error}
        </span>
      ) : null}
    </Modal>
  );
}
