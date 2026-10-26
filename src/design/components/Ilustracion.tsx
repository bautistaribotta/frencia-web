/* Ilustracion de las paginas de error (kit web, Web · 9, .w-ilu): "Gym",
   estilo Bro, de Storyset. Es un SVG animado: entra con la animacion de
   Storyset y despues queda con un loop suave (la que trota, el que hace
   plancha, las nubes). Sus colores son variables (--ilu-*) que salen de los
   tokens, asi que sigue al tema. Con reducir movimiento queda quieta.
   La licencia gratuita de Storyset pide la atribucion visible en la pagina:
   va debajo, como en el kit. Creditos en design-system/ui_kits/web_desktop/img. */

import gym from '@/assets/storyset-gym.svg?raw';
import styles from './Ilustracion.module.css';

export function Ilustracion() {
  return (
    <figure className={styles.ilu}>
      {/* El SVG es un archivo propio del repo, no contenido de usuarios. */}
      <div className={styles.arte} dangerouslySetInnerHTML={{ __html: gym }} />
      <figcaption className={styles.credito}>
        <a href="https://storyset.com/sport" target="_blank" rel="noreferrer">
          Sport illustrations by Storyset
        </a>
      </figcaption>
    </figure>
  );
}
