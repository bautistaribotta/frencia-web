/* Marco comun del acceso (login, registro, recuperar y nueva contraseña): el fondo de luces (cumbre, anima, como
   todo el onboarding), el boton de tema arriba del lado del formulario, el
   formulario en vidrio y el billete, que lleva la marca. Los terminos y la
   politica de privacidad se leen en el modal de lectura, sin salir de la
   pantalla. */

import { useState, type FormEvent, type ReactNode } from 'react';

import { DocumentoLegal, type Documento } from '@/design/components/DocumentoLegal';
import { Fondo } from '@/design/components/Fondo';
import { BotonTema } from '@/design/components/BotonTema';
import { Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import styles from './Acceso.module.css';
import { Billete } from './Billete';
import './transicion.css';

interface Props {
  /** Login lleva el billete a la izquierda; el registro, a la derecha. */
  billete: 'izquierda' | 'derecha';
  titulo: string;
  bajada: ReactNode;
  /** Lo que va arriba del titulo: volver al login, el sello con el icono. */
  cabeza?: ReactNode;
  onSubmit?: (evento: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function Acceso({ billete, titulo, bajada, cabeza, onSubmit = (evento) => evento.preventDefault(), children }: Props) {
  const izquierda = billete === 'izquierda';
  const [documento, setDocumento] = useState<Documento | null>(null);

  const columna = (
    <div className={styles.columna}>
      <BotonTema className={styles.tema} />
      <Tarjeta className={styles.tarjeta}>
        <form className={styles.formulario} onSubmit={onSubmit} noValidate>
          {cabeza}
          <div className={styles.encabezado}>
            <h1 className={texto.title}>{titulo}</h1>
            <span className={`${texto.bodySm} ${texto.secundario}`}>{bajada}</span>
          </div>
          {children}
        </form>
      </Tarjeta>
      <span className={`${texto.bodySm} ${texto.terciario} ${styles.legal}`}>
        Al continuar, aceptás los{' '}
        <button type="button" className={`${styles.enlace} ${styles.enlaceBoton}`} onClick={() => setDocumento('terminos')}>
          Términos y condiciones
        </button>{' '}
        y la{' '}
        <button type="button" className={`${styles.enlace} ${styles.enlaceBoton}`} onClick={() => setDocumento('privacidad')}>
          Política de privacidad
        </button>
        .
      </span>
    </div>
  );

  return (
    <>
      <Fondo posicion="cumbre" animado />
      <main className={`${styles.acceso} ${izquierda ? styles.billeteIzq : ''}`}>
        {izquierda ? (
          <>
            <Billete />
            {columna}
          </>
        ) : (
          <>
            {columna}
            <Billete />
          </>
        )}
      </main>
      <DocumentoLegal documento={documento} onCerrar={() => setDocumento(null)} />
    </>
  );
}
