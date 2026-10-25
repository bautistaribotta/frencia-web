import styles from './Ruedita.module.css';

export function Ruedita({ lg = false }: { lg?: boolean }) {
  return <span className={`${styles.ruedita} ${lg ? styles.lg : ''}`} aria-hidden="true" />;
}
