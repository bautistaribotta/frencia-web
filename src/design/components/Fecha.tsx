/* Fecha de nacimiento en tres cajas (kit web, .w-fecha): dia, mes y año se
   escriben de corrido; al completar una caja el foco pasa a la siguiente y
   Borrar en una vacia vuelve a la anterior. Las flechas suben y bajan el
   segmento en foco. El valor sale como "DD/MM/AAAA" (lib/edad.ts lo lee). */

import { useRef, type KeyboardEvent } from 'react';

import styles from './Fecha.module.css';

interface Props {
  /** "DD/MM/AAAA", completo o a medias. */
  valor: string;
  onChange: (valor: string) => void;
  error?: string | null;
  autoFocus?: boolean;
}

const SEGMENTOS = [
  { rotulo: 'Día', ph: 'DD', largo: 2, min: 1, max: 31 },
  { rotulo: 'Mes', ph: 'MM', largo: 2, min: 1, max: 12 },
  { rotulo: 'Año', ph: 'AAAA', largo: 4, min: 1900, max: new Date().getFullYear() },
];

export function Fecha({ valor, onChange, error, autoFocus = false }: Props) {
  const cajas = useRef<(HTMLInputElement | null)[]>([]);
  const partes = valor.split('/');
  const segmento = (i: number) => partes[i] ?? '';

  const cambiar = (i: number, texto: string) => {
    const nuevas = SEGMENTOS.map((_, k) => (k === i ? texto : segmento(k)));
    onChange(nuevas.join('/'));
  };

  const alTeclear = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    const s = SEGMENTOS[i];
    if (e.key === 'Backspace' && segmento(i) === '' && i > 0) {
      e.preventDefault();
      cajas.current[i - 1]?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const actual = Number(segmento(i)) || (e.key === 'ArrowUp' ? s.min - 1 : s.max + 1);
      const n = Math.min(s.max, Math.max(s.min, actual + (e.key === 'ArrowUp' ? 1 : -1)));
      cambiar(i, String(n).padStart(s.largo, '0'));
    } else if (e.key === 'ArrowRight' && e.currentTarget.selectionStart === segmento(i).length && i < 2) {
      e.preventDefault();
      cajas.current[i + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0 && i > 0) {
      e.preventDefault();
      cajas.current[i - 1]?.focus();
    }
  };

  return (
    <div className={styles.fecha}>
      <div className={styles.fila} role="group" aria-label="Fecha de nacimiento">
        {SEGMENTOS.map((s, i) => (
          <div key={s.rotulo} className={styles.parte}>
            {i > 0 ? (
              <span className={styles.separador} aria-hidden="true">
                /
              </span>
            ) : null}
            <label className={styles.segmento}>
              <input
                ref={(el) => {
                  cajas.current[i] = el;
                }}
                className={`${styles.caja} ${s.largo === 4 ? styles.anio : ''} ${error ? styles.conError : ''}`}
                inputMode="numeric"
                autoComplete={['bday-day', 'bday-month', 'bday-year'][i]}
                placeholder={s.ph}
                maxLength={s.largo}
                value={segmento(i)}
                aria-invalid={error ? true : undefined}
                autoFocus={autoFocus && i === 0}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => {
                  const limpio = e.target.value.replace(/\D/g, '').slice(0, s.largo);
                  cambiar(i, limpio);
                  if (limpio.length === s.largo && i < 2) cajas.current[i + 1]?.focus();
                }}
                onKeyDown={alTeclear(i)}
              />
              <span className={styles.rotulo}>{s.rotulo}</span>
            </label>
          </div>
        ))}
      </div>
      {error ? (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
