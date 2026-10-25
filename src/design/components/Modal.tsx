/* Modal (kit web, .w-velo + .w-modal): reemplaza a la hoja con una decision y
   a la alerta de la app. Usa <dialog> nativo: atrapa el foco, Esc cierra y el
   resto de la pagina queda inerte. El foco arranca en el control marcado
   con data-foco-inicial (en lo destructivo, Cancelar). Sin onCerrar no se
   puede descartar: ni Esc, ni la cruz, ni el clic afuera.
   Con `documento` toma el alto fijo de la lectura (.w-modal--doc), la bajada
   pasa a rotulo (la fecha de vigencia) y el contenido scrollea adentro
   (DocumentoLegal). */

import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

import texto from '../texto.module.css';
import { BotonIcono } from './BotonIcono';
import styles from './Modal.module.css';

interface Props {
  abierto: boolean;
  titulo: string;
  texto?: string;
  chico?: boolean;
  documento?: boolean;
  onCerrar?: () => void;
  pie?: ReactNode;
  children?: ReactNode;
}

export function Modal({ abierto, titulo, texto: bajada, chico = false, documento = false, onCerrar, pie, children }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    if (abierto && !el.open) {
      el.showModal();
      el.querySelector<HTMLElement>('[data-foco-inicial]')?.focus();
    }
    if (!abierto && el.open) el.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogo}
      className={`${styles.modal} ${chico ? styles.chico : ''} ${documento ? styles.documento : ''}`}
      aria-labelledby={idTitulo}
      onCancel={(evento) => {
        evento.preventDefault();
        onCerrar?.();
      }}
      onClick={(evento) => {
        if (evento.target === dialogo.current) onCerrar?.();
      }}
    >
      {abierto ? (
        <div className={styles.contenido}>
          <div className={styles.cabeza}>
            <div className={styles.textos}>
              <h2 id={idTitulo} className={`${texto.title} ${styles.titulo}`}>
                {titulo}
              </h2>
              {bajada ? (
                <p className={`${documento ? `${texto.label} ${texto.terciario}` : `${texto.bodySm} ${texto.secundario}`} ${styles.bajada}`}>{bajada}</p>
              ) : null}
            </div>
            {onCerrar ? <BotonIcono icono={X} etiqueta="Cerrar" onClick={onCerrar} /> : null}
          </div>
          {children}
          {pie ? <div className={styles.pie}>{pie}</div> : null}
        </div>
      ) : null}
    </dialog>
  );
}
