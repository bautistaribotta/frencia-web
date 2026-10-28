/* Aviso de la app (kit web, .w-aviso-app), arriba del contenido y solo en el
   teléfono: «Frencia anda mejor en la app», con Descargar (la tienda del
   sistema) y la cruz, estatica. Al cerrarlo no vuelve: se guarda en el
   navegador. Sin la app publicada, Descargar dice «Pronto» y queda
   desactivado. */

import { Smartphone, X } from 'lucide-react';
import { useState } from 'react';

import { Boton } from '@/design/components/Boton';
import { BotonIcono } from '@/design/components/BotonIcono';
import { Icono } from '@/design/components/Icono';
import texto from '@/design/texto.module.css';
import { TIENDAS, tiendaDelSistema } from '@/lib/tiendas';
import styles from './AvisoApp.module.css';

const CLAVE = 'frencia:aviso-app';

function estaCerrado() {
  try {
    return localStorage.getItem(CLAVE) === 'cerrado';
  } catch {
    return false;
  }
}

export function AvisoApp() {
  const [cerrado, setCerrado] = useState(estaCerrado);
  if (cerrado) return null;

  const { enlace } = TIENDAS[tiendaDelSistema()];
  const cerrar = () => {
    setCerrado(true);
    try {
      localStorage.setItem(CLAVE, 'cerrado');
    } catch {
      // Sin almacenamiento, vuelve a aparecer en la proxima visita.
    }
  };

  return (
    <aside className={styles.aviso} aria-label="La app de Frencia">
      <Icono icono={Smartphone} tamano={18} className={styles.icono} />
      <span className={`${texto.bodySm} ${texto.primario} ${styles.texto}`}>Frencia anda mejor en la app</span>
      <Boton
        variante="soft"
        tamano="sm"
        disabled={!enlace}
        title={enlace ? undefined : 'Todavía no está publicada'}
        onClick={() => window.location.assign(enlace)}
      >
        {enlace ? 'Descargar' : 'Pronto'}
      </Boton>
      <BotonIcono icono={X} etiqueta="Cerrar aviso" tamano="sm" onClick={cerrar} />
    </aside>
  );
}
