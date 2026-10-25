/* Frencia · Documento legal (kit web, Web · 3, DocumentoLegal): los
   Terminos y condiciones o la Politica de privacidad en un modal de lectura.
   Titulo y fecha de vigencia arriba, las secciones scrollean adentro y se
   funden al pie. Port de src/components/LegalDocument.tsx del repo mobile.
   La barra de lectura del kit es del gate de aceptacion, que todavia no
   existe en la web: aca solo se lee. */

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

export function DocumentoLegal({ documento, onCerrar }: { documento: Documento | null; onCerrar: () => void }) {
  // El ultimo abierto queda montado mientras el dialogo se cierra.
  const doc = DOCUMENTOS[documento ?? 'terminos'];
  return (
    <Modal abierto={documento !== null} documento titulo={doc.titulo} texto={`Última actualización · ${doc.vigencia}`} onCerrar={onCerrar}>
      <div className={styles.doc} tabIndex={0} aria-label={doc.titulo}>
        {doc.secciones.map((seccion) => (
          <section key={seccion.titulo} className={styles.seccion}>
            <h3 className={`${texto.subtitle} ${styles.titulo}`}>{seccion.titulo}</h3>
            {seccion.bloques.map((bloque, i) => (
              <Bloque key={i} bloque={bloque} />
            ))}
          </section>
        ))}
      </div>
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
