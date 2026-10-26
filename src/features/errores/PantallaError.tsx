/* Pantalla de error (kit web, Web · 9, .w-error): la ilustracion de Storyset,
   un sello, el titulo y el texto, y las acciones. Tres casos con el mismo
   esqueleto:
   - 404: la pagina no existe. Con sesion, Volver a Inicio e Ir a mis rutinas;
     sin sesion (un link viejo que llega de afuera), Ir a Frencia y Entrar.
   - 500: algo fallo de nuestro lado. Reintentar y un codigo corto para
     soporte.
   - Sin conexion: Reintentar, y vuelve sola cuando hay señal.
   Con sesion va dentro del marco, con la navegacion lateral; sin sesion, con
   la cabecera publica (marca, Entrar y Crear cuenta). Fondo: cumbre. */

import { ArrowRight, House, Layers, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { Fondo } from '@/design/components/Fondo';
import { Ilustracion } from '@/design/components/Ilustracion';
import { Marca } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import styles from './PantallaError.module.css';

export type TipoError = '404' | '500' | 'red';

const TEXTOS: Record<TipoError, { sello: string; titulo: string; texto: string }> = {
  404: {
    sello: 'Error 404 · Serie no encontrada',
    titulo: 'Esta serie no está en tu rutina.',
    texto: 'La página que buscás no existe o cambió de lugar. Volvé a Inicio y seguí donde la dejaste.',
  },
  500: {
    sello: 'Error 500 · Se cortó la serie',
    titulo: 'Algo falló de nuestro lado.',
    texto: 'Tus datos están a salvo: falló la carga, no se borró nada. Probá de nuevo en un momento.',
  },
  red: {
    sello: 'Sin conexión',
    titulo: 'Te quedaste sin conexión.',
    texto: 'Revisá tu internet. Lo que estabas viendo vuelve apenas haya señal; no se perdió nada.',
  },
};

interface Props {
  tipo: TipoError;
  /** Sin sesion: cabecera publica y acciones para entrar. */
  publica?: boolean;
  /** Codigo para soporte del 500. */
  codigo?: string;
}

export function PantallaError({ tipo, publica = false, codigo }: Props) {
  const navegar = useNavigate();
  const t = TEXTOS[tipo];
  const reintentar = () => window.location.reload();

  let acciones: ReactNode;
  if (tipo !== '404') {
    acciones = (
      <>
        <Boton tamano="lg" icono={RotateCcw} onClick={reintentar}>
          Reintentar
        </Boton>
        <Boton variante="secondary" tamano="lg" icono={House} onClick={() => navegar('/')}>
          Volver a Inicio
        </Boton>
      </>
    );
  } else if (publica) {
    acciones = (
      <>
        <Boton tamano="lg" iconoDer={ArrowRight} onClick={() => navegar('/')}>
          Ir a Frencia
        </Boton>
        <Boton variante="secondary" tamano="lg" onClick={() => navegar('/login')}>
          Entrar
        </Boton>
      </>
    );
  } else {
    acciones = (
      <>
        <Boton tamano="lg" icono={House} onClick={() => navegar('/')}>
          Volver a Inicio
        </Boton>
        <Boton variante="secondary" tamano="lg" icono={Layers} onClick={() => navegar('/rutinas')}>
          Ir a mis rutinas
        </Boton>
      </>
    );
  }

  const cuerpo = (
    <div className={styles.error}>
      <Ilustracion />
      <div className={styles.textos}>
        <span className={styles.sello}>{t.sello}</span>
        <h1 className={`${texto.display} ${styles.titulo}`}>{t.titulo}</h1>
        <p className={`${texto.body} ${texto.secundario} ${styles.parrafo}`}>{t.texto}</p>
      </div>
      <div className={styles.acciones}>{acciones}</div>
      {tipo === '500' && codigo ? <span className={`${texto.meta} ${texto.terciario}`}>Código para soporte · {codigo}</span> : null}
    </div>
  );

  return (
    <>
      <Fondo posicion="cumbre" />
      {publica ? (
        <div className={styles.publica}>
          <header className={styles.cabeza}>
            <Link to="/" className={styles.marca} aria-label="Frencia, ir al inicio">
              <Marca />
            </Link>
            <div className={styles.entrar}>
              <Boton variante="ghost" onClick={() => navegar('/login')}>
                Entrar
              </Boton>
              <Boton variante="secondary" onClick={() => navegar('/signup')}>
                Crear cuenta
              </Boton>
            </div>
          </header>
          {cuerpo}
        </div>
      ) : (
        cuerpo
      )}
    </>
  );
}
