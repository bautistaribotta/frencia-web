/* Numero con pasos (kit web, .w-numero): − valor + en una caja de vidrio.
   Se escribe directo o se cambia con los botones y las flechas (↑ ↓ un
   paso, Shift el paso grande). Lo escrito se valida al salir o con Enter:
   si no se entiende vuelve al valor anterior, y si se pasa del rango queda
   en el borde. Con `vacio` admite borrarlo (null), como un dato opcional. */

import { Minus, Plus } from 'lucide-react';
import { useId, useState, type KeyboardEvent } from 'react';

import texto from '../texto.module.css';
import { BotonIcono } from './BotonIcono';
import styles from './Numero.module.css';

interface Props {
  rotulo?: string;
  /** Nombre accesible cuando no hay rotulo visible. */
  etiqueta?: string;
  /** A la derecha del rotulo: "opcional", "mm:ss". */
  extra?: string;
  valor: number | null;
  onChange: (valor: number | null) => void;
  min: number;
  max: number;
  paso?: number;
  pasoGrande?: number;
  /** Como se lee el valor: "2:00", "Al fallo". */
  formato?: (valor: number) => string;
  /** Lo escrito a valor; null si no se entiende. */
  parsear?: (texto: string) => number | null;
  unidad?: string;
  vacio?: boolean;
  disabled?: boolean;
}

const parsearNumero = (t: string) => {
  const n = Number(t.replace(',', '.'));
  return t.trim() === '' || Number.isNaN(n) ? null : n;
};

export function Numero({
  rotulo,
  etiqueta,
  extra,
  valor,
  onChange,
  min,
  max,
  paso = 1,
  pasoGrande = paso * 10,
  formato = String,
  parsear = parsearNumero,
  unidad,
  vacio = false,
  disabled = false,
}: Props) {
  const id = useId();
  // Mientras se escribe, el texto es libre; al confirmar se vuelve valor.
  const [escrito, setEscrito] = useState<string | null>(null);

  const acotar = (n: number) => Math.min(Math.max(Math.round(n * 100) / 100, min), max);
  const sumar = (pasos: number) => onChange(acotar((valor ?? (pasos > 0 ? min - paso : max + paso)) + pasos * paso));

  function confirmar() {
    if (escrito === null) return;
    const t = escrito.trim();
    setEscrito(null);
    if (t === '' && vacio) return onChange(null);
    const n = parsear(t);
    if (n !== null) onChange(acotar(n));
  }

  function alTeclear(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === 'Enter') confirmar();
    if (evento.key === 'ArrowUp' || evento.key === 'ArrowDown') {
      evento.preventDefault();
      setEscrito(null);
      const signo = evento.key === 'ArrowUp' ? 1 : -1;
      sumar(signo * (evento.shiftKey ? pasoGrande / paso : 1));
    }
  }

  return (
    <div className={`${styles.numero} ${disabled ? styles.off : ''}`}>
      {rotulo ? (
        <span className={styles.rotulo}>
          <label htmlFor={id} className={`${texto.label} ${texto.terciario}`}>
            {rotulo}
          </label>
          {extra ? <span className={`${texto.label} ${texto.terciario}`}>{extra}</span> : null}
        </span>
      ) : null}
      <div className={styles.fila}>
        <BotonIcono icono={Minus} tamano="sm" etiqueta={`Restar ${rotulo ?? etiqueta ?? ''}`.trim()} tabIndex={-1} disabled={disabled || (valor !== null && valor <= min)} onClick={() => sumar(-1)} />
        <span className={styles.centro}>
          <input
            id={id}
            className={styles.valor}
            type="text"
            inputMode="decimal"
            role="spinbutton"
            aria-label={rotulo ? undefined : etiqueta}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={valor ?? undefined}
            aria-valuetext={valor === null ? 'Sin valor' : formato(valor)}
            placeholder="—"
            disabled={disabled}
            value={escrito ?? (valor === null ? '' : formato(valor))}
            size={1}
            onChange={(evento) => setEscrito(evento.target.value)}
            onFocus={(evento) => evento.target.select()}
            onBlur={confirmar}
            onKeyDown={alTeclear}
          />
          {unidad && valor !== null ? <small className={styles.unidad}>{unidad}</small> : null}
        </span>
        <BotonIcono icono={Plus} tamano="sm" etiqueta={`Sumar ${rotulo ?? etiqueta ?? ''}`.trim()} tabIndex={-1} disabled={disabled || (valor !== null && valor >= max)} onClick={() => sumar(1)} />
      </div>
    </div>
  );
}
