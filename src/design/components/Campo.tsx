/* Campo de texto (kit web, .w-campo). Dos formas:
   - Comun: rotulo arriba de la caja y, a su derecha, el extra.
   - Flotante (acceso, .w-campo--flotante): sin placeholder; con el campo
     vacio el rotulo va adentro, en el lugar del texto, y con foco o con valor
     sube al borde de arriba al 75 %. El extra ("¿La olvidaste?") baja a la
     linea de debajo, junto a la ayuda o el error. */

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
  /** Rotulo flotante dentro de la caja, sin placeholder. */
  flotante?: boolean;
  className?: string;
}

export function Campo({ rotulo, extra, icono, final, ayuda, error, flotante = false, disabled, className = '', id, ...input }: Props) {
  const idPropio = useId();
  const idCampo = id ?? idPropio;
  const idNota = `${idCampo}-nota`;
  const nota = error || ayuda;
  const clases = [styles.campo, flotante ? styles.flotante : '', error ? styles.error : '', disabled ? styles.off : '', className].join(' ');

  const campo = (
    <input
      {...input}
      // En el flotante el placeholder vacio solo sirve para que el CSS sepa,
      // con :placeholder-shown, si el campo tiene texto.
      placeholder={flotante ? ' ' : input.placeholder}
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

  if (flotante) {
    return (
      <div className={clases}>
        <div className={styles.caja}>
          {icono ? <Icono icono={icono} tamano={20} /> : null}
          <div className={styles.cuerpo}>
            {campo}
            <label htmlFor={idCampo} className={styles.flota}>
              {rotulo}
            </label>
          </div>
          {final}
        </div>
        {mensaje || extra ? (
          <div className={styles.pie}>
            {mensaje ?? <span />}
            {extra ? <span className={styles.extra}>{extra}</span> : null}
          </div>
        ) : null}
      </div>
    );
  }

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
        {campo}
        {final}
      </div>
      {mensaje}
    </div>
  );
}
