/* Constructor bloqueado (kit web, .w-bloqueo): en el teléfono, en lugar del
   constructor, una pantalla sin navegacion sobre la luz del centro que
   explica por que no se arma ahi y ofrece bajar la app o volver. Sin las
   tiendas publicadas, sus botones quedan desactivados con una nota. Arrastrar
   ejercicios y ver los dias lado a lado necesita una pantalla mas grande. */

import { ChevronLeft, Smartphone } from 'lucide-react';
import { useParams } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import texto from '@/design/texto.module.css';
import { useEsTelefono } from '@/lib/tamano';
import { TIENDAS, type Tienda } from '@/lib/tiendas';
import { useVolver } from '@/lib/volver';
import { Constructor } from './Constructor';
import styles from './ConstructorBloqueado.module.css';

/** El constructor, salvo en el teléfono, donde va bloqueado. */
export function ConstructorSegunPantalla() {
  return useEsTelefono() ? <ConstructorBloqueado /> : <Constructor />;
}

export function ConstructorBloqueado() {
  const { id } = useParams();
  const volver = useVolver(id ? `/rutinas/${id}` : '/rutinas');
  const publicadas = Boolean(TIENDAS.appStore.enlace && TIENDAS.googlePlay.enlace);

  return (
    <>
      <Fondo posicion="centro" />
      <main className={styles.bloqueo}>
        <span className={styles.icono}>
          <Icono icono={Smartphone} tamano={28} />
        </span>
        <h1 className={`${texto.title} ${styles.titulo}`}>Armá tus rutinas en la app o en la compu</h1>
        <p className={`${texto.bodySm} ${texto.secundario} ${styles.parrafo}`}>
          Arrastrar ejercicios y ver los días lado a lado necesita una pantalla más grande.
        </p>
        <div className={styles.acciones}>
          <div className={styles.tiendas}>
            <BotonTienda tienda="appStore" />
            <BotonTienda tienda="googlePlay" />
          </div>
          {publicadas ? null : <span className={`${texto.bodySm} ${texto.terciario}`}>Las apps llegan pronto a las tiendas.</span>}
          <Boton variante="ghost" icono={ChevronLeft} onClick={volver.volver}>
            {volver.larga}
          </Boton>
        </div>
      </main>
    </>
  );
}

function BotonTienda({ tienda }: { tienda: Tienda }) {
  const { nombre, enlace } = TIENDAS[tienda];
  return (
    <Boton
      variante="secondary"
      ancho
      disabled={!enlace}
      title={enlace ? undefined : 'Todavía no está publicada'}
      icono={Smartphone}
      onClick={() => window.location.assign(enlace)}
    >
      {nombre}
    </Boton>
  );
}
