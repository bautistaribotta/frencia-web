import { CircleAlert, type LucideIcon } from 'lucide-react';
import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import texto from '../texto.module.css';
import styles from './Campo.module.css';
import { Icono } from './Icono';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  rotulo: string;
  /** A la derecha del rotulo: un enlace como "¿La olvidaste?". */
  extra?: ReactNode;
  icono?: LucideIcon;
  /** Al final de la caja: un boton de icono como mostrar la contraseña. */
  final?: ReactNode;
  ayuda?: string;
  error?: string | null;
  className?: string;
}

export function Campo({ rotulo, extra, icono, final, ayuda, error, disabled, className = '', id, ...input }: Props) {
  const idPropio = useId();
  const idCampo = id ?? idPropio;
  const idNota = `${idCampo}-nota`;
  const nota = error || ayuda;
  const clases = [styles.campo, error ? styles.error : '', disabled ? styles.off : '', className].join(' ');

  return (
    <div className={clases}>
      <span className={styles.rotulo}>
        <label htmlFor={idCampo} className={`${texto.label} ${texto.terciario}`}>
          {rotulo}
        </label>
        {extra ? <span className={`${texto.label} ${texto.terciario}`}>{extra}</span> : null}
      </span>
      <div className={styles.caja}>
        {icono ? <Icono icono={icono} tamano={20} /> : null}
        <input
          {...input}
          id={idCampo}
          className={styles.valor}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={nota ? idNota : undefined}
        />
        {final}
      </div>
      {error ? (
        <span id={idNota} className={styles.mensajeError} role="alert">
          <Icono icono={CircleAlert} tamano={16} />
          {error}
        </span>
      ) : ayuda ? (
        <span id={idNota} className={styles.ayuda}>
          {ayuda}
        </span>
      ) : null}
    </div>
  );
}
