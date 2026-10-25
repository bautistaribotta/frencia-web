import { Marca } from '@/design/components/varios';
import styles from './Billete.module.css';

const MICRO = 'CADA SERIE CUENTA · FRENCIA · REGISTRÁ CADA SERIE · RIR · RPE · AMRAP · 1RM · TONELAJE · '.repeat(8);

/** La imagen del acceso. Es decorativa: el lector de pantalla la saltea. */
export function Billete() {
  return (
    <div className={styles.billete} aria-hidden="true">
      <div className={styles.imagen} />
      <span className={`${styles.micro} ${styles.microArriba}`}>{MICRO}</span>
      <span className={`${styles.micro} ${styles.microAbajo}`}>{MICRO}</span>
      <div className={styles.serie}>
        <span>Nº FR 0001240</span>
        <span>SERIE A</span>
      </div>
      <div className={styles.cartela}>
        <Marca className={styles.marca} />
        <span className={styles.sello}>PESO MUERTO · 140 KG × 5 · RIR 2</span>
      </div>
      <span className={styles.credito}>Foto: Serjan Midili · Unsplash</span>
    </div>
  );
}
