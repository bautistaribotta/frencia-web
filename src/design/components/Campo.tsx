/* Campo de texto con el aspecto del Input de shadcn/ui: rotulo arriba (con
   el extra, como "¿La olvidaste?", a su derecha), la caja con icono, sufijo
   ("cm", "kg") y una accion final opcional, y debajo la ayuda o el error.
   Los iconos de la caja van quietos (tambien el del boton final); el icono
   del campo anima solo cuando aparece un error. */

import { CircleAlert, type LucideIcon } from 'lucide-react';
import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import styles from './Campo.module.css';
import { Icono, IconosQuietos } from './Icono';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  rotulo: string;
  /** A la derecha del rotulo: un enlace como "¿La olvidaste?". */
  extra?: ReactNode;
  icono?: LucideIcon;
  /** Al final de la caja: un boton de icono como mostrar la contraseña. */
  final?: ReactNode;
  /** Unidad pegada al valor, dentro de la caja: "cm", "kg". */
  sufijo?: string;
  ayuda?: string;
  error?: string | null;
  /** Caja mas baja (kit web, .w-campo--md), para barras y paneles. */
  md?: boolean;
  className?: string;
}

export function Campo({ rotulo, extra, icono, final, sufijo, ayuda, error, md = false, disabled, className = '', id, ...input }: Props) {
  const idPropio = useId();
  const idCampo = id ?? idPropio;
  const idNota = `${idCampo}-nota`;
  const nota = error || ayuda;
  const clases = [styles.campo, md ? styles.md : '', error ? styles.error : '', disabled ? styles.off : '', className].join(' ');

  const campo = (
    <input
      {...input}
      id={idCampo}
      className={styles.valor}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={nota ? idNota : undefined}
    />
  );
  const mensaje = error ? (
    <span id={idNota} className={styles.mensajeError} role="alert">
      <Icono icono={CircleAlert} tamano={16} />
      {error}
    </span>
  ) : ayuda ? (
    <span id={idNota} className={styles.ayuda}>
      {ayuda}
    </span>
  ) : null;

  return (
    <div className={clases}>
      <span className={styles.rotulo}>
        <label htmlFor={idCampo} className={styles.etiqueta}>
          {rotulo}
        </label>
        {extra ? <span className={styles.extra}>{extra}</span> : null}
      </span>
      <div className={styles.caja}>
        <IconosQuietos>
          {icono ? <Icono icono={icono} tamano={md ? 18 : 20} disparo={error} /> : null}
          {campo}
          {sufijo ? <span className={styles.sufijo}>{sufijo}</span> : null}
          {final}
        </IconosQuietos>
      </div>
      {mensaje}
    </div>
  );
}
