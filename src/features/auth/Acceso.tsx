/* Marco comun del acceso (login, registro, recuperar y nueva contraseña),
   con el formato de los bloques de login de shadcn/ui: fondo muted, la marca
   arriba, el formulario en una Card centrada (titulo, bajada y campos) y,
   debajo, los terminos y la politica de privacidad, que se leen en el modal
   de lectura sin salir de la pantalla. El boton de tema va en la esquina de
   arriba a la derecha. */

import { useState, type FormEvent, type ReactNode } from 'react';

import { BotonTema } from '@/design/components/BotonTema';
import { DocumentoLegal, type Documento } from '@/design/components/DocumentoLegal';
import { Marca } from '@/design/components/varios';
import styles from './Acceso.module.css';

interface Props {
  titulo: string;
  bajada: ReactNode;
  /** Lo que va arriba del titulo: volver al login, el sello con el icono. */
  cabeza?: ReactNode;
  onSubmit?: (evento: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function Acceso({ titulo, bajada, cabeza, onSubmit = (evento) => evento.preventDefault(), children }: Props) {
  const [documento, setDocumento] = useState<Documento | null>(null);

  return (
    <>
      <main className={styles.acceso}>
        <BotonTema className={styles.tema} />
        <div className={styles.columna}>
          <Marca className={styles.marca} />
          <div className={styles.tarjeta}>
            <form className={styles.formulario} onSubmit={onSubmit} noValidate>
              {cabeza}
              <div className={styles.encabezado}>
                <h1 className={styles.titulo}>{titulo}</h1>
                <p className={styles.bajada}>{bajada}</p>
              </div>
              {children}
            </form>
          </div>
          <p className={styles.legal}>
            Al continuar, aceptás los{' '}
            <button type="button" className={styles.enlaceLegal} onClick={() => setDocumento('terminos')}>
              Términos y condiciones
            </button>{' '}
            y la{' '}
            <button type="button" className={styles.enlaceLegal} onClick={() => setDocumento('privacidad')}>
              Política de privacidad
            </button>
            .
          </p>
        </div>
      </main>
      <DocumentoLegal documento={documento} onCerrar={() => setDocumento(null)} />
    </>
  );
}
