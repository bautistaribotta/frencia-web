/* Frencia · Documento legal (kit web, Web · 3, DocumentoLegal): los
   Terminos y condiciones o la Politica de privacidad en un modal de lectura.
   Titulo y fecha de vigencia arriba, las secciones scrollean adentro y se
   funden al pie. Port de src/components/LegalDocument.tsx del repo mobile.
   Con `onLeido` (el gate de aceptacion, /bienvenida) muestra al pie la
   barra de lectura, que avanza con el scroll; al llegar al final avisa una
   vez que el documento quedo leido. */

import { useEffect, useRef, useState } from 'react';

import texto from '../texto.module.css';
import { PRIVACIDAD, PRIVACIDAD_VIGENCIA } from '@/lib/privacidad';
import { TERMINOS, TERMINOS_VIGENCIA } from '@/lib/terminos';
import type { BloqueLegal } from '@/lib/legal';
import styles from './DocumentoLegal.module.css';
import { Modal } from './Modal';

export type Documento = 'terminos' | 'privacidad';

const DOCUMENTOS = {
  terminos: { titulo: 'Términos y condiciones', vigencia: TERMINOS_VIGENCIA, secciones: TERMINOS },
  privacidad: { titulo: 'Política de privacidad', vigencia: PRIVACIDAD_VIGENCIA, secciones: PRIVACIDAD },
};

interface Props {
  documento: Documento | null;
  onCerrar: () => void;
  /** Con esto se muestra la barra de lectura y avisa al llegar al final. */
  onLeido?: (documento: Documento) => void;
}

export function DocumentoLegal({ documento, onCerrar, onLeido }: Props) {
  // El ultimo abierto queda montado mientras el dialogo se cierra.
  const doc = DOCUMENTOS[documento ?? 'terminos'];
  const caja = useRef<HTMLDivElement>(null);
  // Lo leido vale para el documento abierto: otro arranca de cero.
  const [lectura, setLectura] = useState<{ documento: Documento | null; parte: number }>({ documento: null, parte: 0 });
  const leido = lectura.documento === documento ? lectura.parte : 0;
  const avisado = useRef(false);

  const medir = () => {
    const el = caja.current;
    if (!el || !documento) return;
    const total = el.scrollHeight - el.clientHeight;
    const parte = total <= 4 ? 1 : Math.min(1, el.scrollTop / (total - 4));
    setLectura({ documento, parte });
    if (parte >= 1 && !avisado.current && onLeido) {
      avisado.current = true;
      onLeido(documento);
    }
  };

  // Cada documento que se abre empieza de cero, arriba de todo.
  useEffect(() => {
    avisado.current = false;
    if (caja.current) caja.current.scrollTop = 0;
    // Si entra entero sin scrollear, ya esta leido.
    const t = window.setTimeout(medir, 50);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documento]);

  return (
    <Modal abierto={documento !== null} documento titulo={doc.titulo} texto={`Última actualización · ${doc.vigencia}`} onCerrar={onCerrar}>
      <div ref={caja} className={styles.doc} tabIndex={0} aria-label={doc.titulo} onScroll={onLeido ? medir : undefined}>
        {doc.secciones.map((seccion) => (
          <section key={seccion.titulo} className={styles.seccion}>
            <h3 className={`${texto.subtitle} ${styles.titulo}`}>{seccion.titulo}</h3>
            {seccion.bloques.map((bloque, i) => (
              <Bloque key={i} bloque={bloque} />
            ))}
          </section>
        ))}
      </div>
      {onLeido ? (
        <div className={styles.progreso}>
          <div className={styles.barra} role="progressbar" aria-label="Leído" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(leido * 100)}>
            {/* El avance de la lectura se conoce recien al scrollear. */}
            <span style={{ transform: `scaleX(${leido})` }} />
          </div>
          <span className={`${texto.label} ${leido >= 1 ? texto.acento : texto.terciario}`}>{leido >= 1 ? 'Leído' : `Leído ${Math.round(leido * 100)} %`}</span>
        </div>
      ) : null}
    </Modal>
  );
}

function Bloque({ bloque }: { bloque: BloqueLegal }) {
  if (typeof bloque === 'string') return <p className={`${texto.body} ${texto.secundario} ${styles.parrafo}`}>{bloque}</p>;
  return (
    <ul className={styles.lista}>
      {bloque.lista.map((item) => (
        <li key={item} className={`${texto.body} ${texto.secundario}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}
