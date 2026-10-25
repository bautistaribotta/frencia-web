import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { Fondo } from '@/design/components/Fondo';
import texto from '@/design/texto.module.css';
import styles from './NoEncontrada.module.css';

export function NoEncontrada() {
  const navegar = useNavigate();
  return (
    <>
      <Fondo posicion="cumbre" />
      <main className={styles.pagina}>
        <span className={`${texto.label} ${texto.terciario}`}>Error 404</span>
        <h1 className={`${texto.title} ${styles.titulo}`}>Esta página no existe</h1>
        <Boton variante="secondary" icono={ArrowLeft} onClick={() => navegar('/')}>
          Volver al inicio
        </Boton>
      </main>
    </>
  );
}
