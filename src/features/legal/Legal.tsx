/* Textos legales publicos (/terminos y /privacidad, kit web, Web · 3,
   .w-legal): los mismos documentos del modal de lectura en una pagina que se
   abre sin sesion, para los links que piden Google, Apple y las tiendas.
   Va afuera de las puertas: con sesion no redirige y la cabecera ofrece Ir a
   Frencia; sin sesion, Entrar y Crear cuenta. El segmentado pasa de un
   documento al otro cambiando la URL. Fondo: velada. */

import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { DOCUMENTOS, SeccionesLegales, type Documento } from '@/design/components/DocumentoLegal';
import { Fondo } from '@/design/components/Fondo';
import { Segmentado } from '@/design/components/Segmentado';
import { Marca, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { EMAIL_CONTACTO } from '@/lib/legal';
import { useEsTelefono } from '@/lib/tamano';
import styles from './Legal.module.css';

const RUTA: Record<Documento, string> = { terminos: '/terminos', privacidad: '/privacidad' };

export function Legal({ documento }: { documento: Documento }) {
  const { session, iniciando } = useSesion();
  const navegar = useNavigate();
  const telefono = useEsTelefono();
  const doc = DOCUMENTOS[documento];

  useEffect(() => {
    const anterior = document.title;
    document.title = `${doc.titulo} · Frencia`;
    return () => {
      document.title = anterior;
    };
  }, [doc.titulo]);

  // Cada documento arranca arriba de todo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [documento]);

  return (
    <>
      <Fondo posicion="velada" />
      <div className={styles.pagina}>
        <header className={styles.cabeza}>
          <Link to="/" className={styles.marca} aria-label="Frencia, ir al inicio">
            <Marca />
          </Link>
          {/* Mientras se resuelve la sesion no se ofrece ni entrar ni seguir. */}
          {iniciando ? null : session ? (
            <Boton variante="secondary" tamano={telefono ? 'sm' : 'md'} iconoDer={ArrowRight} onClick={() => navegar('/')}>
              Ir a Frencia
            </Boton>
          ) : (
            <div className={styles.entrar}>
              <Boton variante="ghost" tamano={telefono ? 'sm' : 'md'} onClick={() => navegar('/login')}>
                Entrar
              </Boton>
              {/* En el telefono la cabecera chica lleva solo Entrar. */}
              {telefono ? null : (
                <Boton variante="secondary" onClick={() => navegar('/signup')}>
                  Crear cuenta
                </Boton>
              )}
            </div>
          )}
        </header>

        <main className={styles.legal}>
          <Segmentado
            etiqueta="Documento"
            ancho={telefono}
            opciones={[
              { valor: 'terminos', etiqueta: 'Términos' },
              { valor: 'privacidad', etiqueta: 'Privacidad' },
            ]}
            valor={documento}
            onChange={(siguiente) => navegar(RUTA[siguiente], { replace: true })}
          />
          <div className={styles.titulos}>
            <h1 className={`${texto.display} ${styles.titulo}`}>{doc.titulo}</h1>
            <span className={`${texto.label} ${texto.terciario}`}>Última actualización · {doc.vigencia}</span>
          </div>
          <Tarjeta className={styles.doc}>
            <SeccionesLegales documento={documento} nivel="h2" />
          </Tarjeta>
          <p className={`${texto.bodySm} ${texto.terciario} ${styles.pie}`}>
            ¿Dudas? Escribinos a <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>
          </p>
        </main>
      </div>
    </>
  );
}
