/* Regla (kit web, .w-regla) y su variante curva, Arco (.w-arco): elegir un
   numero grande en el setup, la altura en la regla y el peso en la banda en
   arco. Se arrastran de costado con el mouse, la rueda mueve de a un paso y
   el teclado tambien (flechas ±paso, Shift ±10 pasos, Inicio y Fin). En la
   regla un clic salta hasta ahi. La lectura de arriba se puede escribir:
   clic, el numero y Enter. AyudaTeclado recuerda las teclas debajo. */

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type WheelEvent } from 'react';

import { Kbd } from './varios';
import styles from './Regla.module.css';

interface Comun {
  etiqueta: string;
  valor: number;
  onChange: (valor: number) => void;
  min: number;
  max: number;
  paso: number;
  /** Cada cuantos pasos va una marca mayor (con numero) y una media. */
  mayor: number;
  media: number;
  /** La lectura grande: "175", "5′ 9″". */
  lectura?: (valor: number) => string;
  /** Lo que se escribe en la lectura pasa a valor; null si no se entiende. */
  leer?: (escrito: string) => number | null;
  unidad: string;
  /** Los numeros de las marcas mayores. */
  numero?: (valor: number) => string;
}

function ajustar(v: number, { min, max, paso }: Pick<Comun, 'min' | 'max' | 'paso'>): number {
  const redondo = Math.round(v / paso) * paso;
  return Math.min(max, Math.max(min, Math.round(redondo * 1000) / 1000));
}

/** Arrastre, rueda y teclado comunes a la regla y al arco. `pxPorPaso`
 *  traduce el movimiento del mouse a pasos. */
function useControl(c: Comun, pxPorPaso: number) {
  const inicio = useRef<{ x: number; valor: number; movio: boolean } | null>(null);
  const cambiar = (v: number) => {
    const nuevo = ajustar(v, c);
    if (nuevo !== c.valor) c.onChange(nuevo);
  };
  return {
    cambiar,
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      inicio.current = { x: e.clientX, valor: c.valor, movio: false };
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const i = inicio.current;
      if (!i) return;
      const dx = e.clientX - i.x;
      if (Math.abs(dx) > 3) i.movio = true;
      // Se arrastra la regla: hacia la izquierda suben los numeros.
      if (i.movio) cambiar(i.valor - (dx / pxPorPaso) * c.paso);
    },
    onPointerUp: () => {
      const i = inicio.current;
      inicio.current = null;
      return i?.movio ?? false;
    },
    onWheel: (e: WheelEvent<HTMLElement>) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (d !== 0) cambiar(c.valor + Math.sign(d) * c.paso);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      const salto = (e.shiftKey ? 10 : 1) * c.paso;
      let v: number | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = c.valor + salto;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = c.valor - salto;
      else if (e.key === 'Home') v = c.min;
      else if (e.key === 'End') v = c.max;
      if (v === null) return;
      e.preventDefault();
      cambiar(v);
    },
  };
}

/** La lectura grande, que se puede escribir. */
function Lectura({ c, onCommit }: { c: Comun; onCommit: (v: number) => void }) {
  const [escrito, setEscrito] = useState<string | null>(null);
  const texto = c.lectura ? c.lectura(c.valor) : String(c.valor);
  const leer = c.leer ?? ((t: string) => (Number.isFinite(Number(t.replace(',', '.'))) && t.trim() ? Number(t.replace(',', '.')) : null));
  const cerrar = (guardar: boolean) => {
    if (guardar && escrito !== null) {
      const v = leer(escrito);
      if (v !== null) onCommit(v);
    }
    setEscrito(null);
  };
  if (escrito !== null)
    return (
      <span className={`${styles.lectura} ${styles.edita}`}>
        <input
          className={styles.numero}
          aria-label={c.etiqueta}
          value={escrito}
          size={Math.max(escrito.length, 2)}
          autoFocus
          onChange={(e) => setEscrito(e.target.value)}
          onBlur={() => cerrar(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              cerrar(true);
            } else if (e.key === 'Escape') {
              e.stopPropagation();
              cerrar(false);
            }
          }}
        />
        <span className={styles.unidad}>{c.unidad}</span>
      </span>
    );
  return (
    <button type="button" className={styles.lectura} title="Escribir el valor" onClick={() => setEscrito(texto.replace(/[′″]/g, '').trim())}>
      <span className={styles.numero}>{texto}</span>
      <span className={styles.unidad}>{c.unidad}</span>
    </button>
  );
}

const MARCAS = 36;

export function Regla(c: Comun) {
  const pista = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(560);
  const pxPorPaso = ancho / (2 * MARCAS);
  const control = useControl(c, pxPorPaso);

  const marcas: ReactNode[] = [];
  const numeros: ReactNode[] = [];
  for (let i = -MARCAS; i <= MARCAS; i++) {
    const v = Math.round((c.valor + i * c.paso) * 1000) / 1000;
    const k = Math.round(v / c.paso);
    const M = k % c.mayor === 0;
    const m = !M && k % c.media === 0;
    marcas.push(<span key={i} className={M ? styles.M : m ? styles.m : ''} />);
    if (M)
      numeros.push(
        // La posicion de cada numero depende del valor: es una medida.
        <span key={i} style={{ left: `${((i + MARCAS) / (2 * MARCAS)) * 100}%` }}>
          {c.numero ? c.numero(v) : v.toFixed(0)}
        </span>,
      );
  }

  return (
    <div className={styles.regla}>
      <Lectura c={c} onCommit={control.cambiar} />
      <div
        ref={pista}
        className={styles.pista}
        role="slider"
        tabIndex={0}
        aria-label={c.etiqueta}
        aria-valuemin={c.min}
        aria-valuemax={c.max}
        aria-valuenow={c.valor}
        aria-valuetext={`${c.lectura ? c.lectura(c.valor) : c.valor} ${c.unidad}`.trim()}
        onPointerDown={(e) => {
          setAncho(pista.current?.clientWidth ?? ancho);
          control.onPointerDown(e);
        }}
        onPointerMove={control.onPointerMove}
        onPointerUp={(e) => {
          const movio = control.onPointerUp();
          if (movio || !pista.current) return;
          // Clic sin arrastrar: salta hasta donde se hizo clic.
          const caja = pista.current.getBoundingClientRect();
          control.cambiar(c.valor + ((e.clientX - caja.left - caja.width / 2) / (caja.width / (2 * MARCAS))) * c.paso);
        }}
        onWheel={control.onWheel}
        onKeyDown={control.onKeyDown}
      >
        <div className={styles.marcas}>{marcas}</div>
        <div className={styles.numeros}>{numeros}</div>
        <span className={styles.aguja} />
      </div>
    </div>
  );
}

/* Medidas del arco, en unidades del viewBox (kit web). */
const W = 620;
const H = 120;
const R = 520;
const GROSOR = 64;
const CX = W / 2;
const CY = R + 6;
const R_IN = R - GROSOR;
const R_T = R - 8;
const R_N = R_T - 38;
const LIMITE = 34;
const GRADOS = 1.6;

function punto(r: number, a: number): string {
  const t = ((a - 90) * Math.PI) / 180;
  return `${(CX + r * Math.cos(t)).toFixed(2)} ${(CY + r * Math.sin(t)).toFixed(2)}`;
}

export function Arco(c: Comun) {
  const control = useControl(c, 9);
  const n = Math.floor(LIMITE / GRADOS);
  const base = Math.round(c.valor / c.paso);
  const marcas: ReactNode[] = [];
  const numeros: ReactNode[] = [];
  for (let i = -n; i <= n; i++) {
    const k = base + i;
    const a = ((k * c.paso - c.valor) / c.paso) * GRADOS;
    if (Math.abs(a) > LIMITE) continue;
    const M = k % c.mayor === 0;
    const m = !M && k % c.media === 0;
    const largo = M ? 26 : m ? 17 : 10;
    const rad = ((a - 90) * Math.PI) / 180;
    marcas.push(
      <line
        key={`m${k}`}
        className={`${styles.tick} ${M ? styles.tickM : ''}`}
        x1={CX + R_T * Math.cos(rad)}
        y1={CY + R_T * Math.sin(rad)}
        x2={CX + (R_T - largo) * Math.cos(rad)}
        y2={CY + (R_T - largo) * Math.sin(rad)}
      />,
    );
    if (M)
      numeros.push(
        <text key={`n${k}`} className={styles.num} x={CX} y={CY - R_N} transform={`rotate(${a} ${CX} ${CY})`} textAnchor="middle" dominantBaseline="central">
          {c.numero ? c.numero(k * c.paso) : (k * c.paso).toFixed(0)}
        </text>,
      );
  }
  const L = LIMITE + 3;
  const banda = `M ${punto(R, -L)} A ${R} ${R} 0 0 1 ${punto(R, L)} L ${punto(R_IN, L)} A ${R_IN} ${R_IN} 0 0 0 ${punto(R_IN, -L)} Z`;

  return (
    <div className={styles.regla}>
      <Lectura c={c} onCommit={control.cambiar} />
      <div
        className={styles.arco}
        role="slider"
        tabIndex={0}
        aria-label={c.etiqueta}
        aria-valuemin={c.min}
        aria-valuemax={c.max}
        aria-valuenow={c.valor}
        aria-valuetext={`${c.lectura ? c.lectura(c.valor) : c.valor} ${c.unidad}`}
        onPointerDown={control.onPointerDown}
        onPointerMove={control.onPointerMove}
        onPointerUp={control.onPointerUp}
        onWheel={control.onWheel}
        onKeyDown={control.onKeyDown}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <path className={styles.banda} d={banda} />
          {marcas}
          {numeros}
          <line className={styles.agujaArco} x1={CX} y1={CY - R + 2} x2={CX} y2={CY - R_T + 32} />
          <path className={styles.punta} d={`M ${CX - 5} ${CY - R + 2} L ${CX + 5} ${CY - R + 2} L ${CX} ${CY - R + 8} Z`} />
        </svg>
      </div>
    </div>
  );
}

/** Las teclas de la regla, debajo: [['←', '→'], '±1 cm']. */
export function AyudaTeclado({ items }: { items: [string[], string][] }) {
  return (
    <div className={styles.ayuda}>
      {items.map(([teclas, texto]) => (
        <span key={texto}>
          {teclas.map((t) => (
            <Kbd key={t}>{t}</Kbd>
          ))}
          {texto}
        </span>
      ))}
    </div>
  );
}
