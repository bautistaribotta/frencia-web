/* Piezas de pagina del kit web: el contenedor centrado (.w-pagina), el
   encabezado con rotulo, titulo y acciones (.w-encabezado), y la lista de
   vidrio con filas separadas por divisor (.w-lista y .w-fila). */

import type { HTMLAttributes, ReactNode } from 'react';

import texto from '../texto.module.css';
import styles from './Pagina.module.css';

/** El contenido de una pagina, por encima del fondo de luces. */
export function Pagina({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.pagina} ${className}`}>{children}</div>;
}

export function Encabezado({
  rotulo,
  titulo,
  bajada,
  acciones,
}: {
  rotulo?: string;
  titulo: string;
  bajada?: string;
  acciones?: ReactNode;
}) {
  return (
    <header className={styles.encabezado}>
      <div className={styles.encabezadoTextos}>
        {rotulo ? <span className={`${texto.label} ${texto.terciario}`}>{rotulo}</span> : null}
        <h1 className={`${texto.display} ${styles.titulo}`}>{titulo}</h1>
        {bajada ? <span className={`${texto.bodySm} ${texto.secundario}`}>{bajada}</span> : null}
      </div>
      {acciones ? <div className={styles.acciones}>{acciones}</div> : null}
    </header>
  );
}

export function Lista({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.lista} ${className}`}>{children}</div>;
}

/** Fila de una lista. Con `enlace`, toma el hover y el foco de las filas que
 *  llevan a otro lado; la etiqueta (a, button) la pone quien la usa. */
// eslint-disable-next-line react-refresh/only-export-components
export function claseFila(enlace = false): string {
  return `${styles.fila} ${enlace ? styles.filaEnlace : ''}`;
}

export function Fila({ className = '', ...resto }: HTMLAttributes<HTMLDivElement>) {
  return <div {...resto} className={`${styles.fila} ${className}`} />;
}
