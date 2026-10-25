/* Frencia · Avatar
   La foto de perfil o, sin foto, el avatar generativo de la app (boring
   avatars, variante beam) a partir de la semilla del perfil: la misma
   semilla da la misma cara que en el celular. Dos colores, accent y bg-app;
   la cara va en el contrario de la forma que la rodea.
   Port de react-native-boring-avatars (avatar-beam y utilities). */

import { useId, useState } from 'react';

import styles from './Avatar.module.css';

const SIZE = 36;

function numeroDe(nombre: string): number {
  let suma = 0;
  for (const caracter of Array.from(nombre)) suma += caracter.charCodeAt(0);
  return suma;
}

function digito(numero: number, posicion: number): number {
  return Math.floor((numero / Math.pow(10, posicion)) % 10);
}

function booleano(numero: number, posicion: number): boolean {
  return !(digito(numero, posicion) % 2);
}

function unidad(numero: number, rango: number, indice?: number): number {
  const valor = numero % rango;
  return indice && digito(numero, indice) % 2 === 0 ? -valor : valor;
}

/** Los datos de la cara. Con dos colores, la forma y el fondo nunca coinciden:
 *  13 es impar. */
function generar(nombre: string) {
  const n = numeroDe(nombre);
  const formaEsAcento = n % 2 === 0;
  const preX = unidad(n, 10, 1);
  const x = preX < 5 ? preX + SIZE / 9 : preX;
  const preY = unidad(n, 10, 2);
  const y = preY < 5 ? preY + SIZE / 9 : preY;
  return {
    formaEsAcento,
    x,
    y,
    rotacion: unidad(n, 360),
    escala: 1 + unidad(n, SIZE / 12) / 10,
    bocaAbierta: booleano(n, 2),
    circulo: booleano(n, 1),
    ojos: unidad(n, 5),
    boca: unidad(n, 3),
    caraRotacion: unidad(n, 10, 3),
    caraX: x > SIZE / 6 ? x / 2 : unidad(n, 8, 1),
    caraY: y > SIZE / 6 ? y / 2 : unidad(n, 7, 2),
  };
}

interface Props {
  /** avatar_seed del perfil; sin semilla, el nombre (como en la app). */
  semilla: string;
  /** URL firmada de la foto, si tiene. */
  foto?: string | null;
  lado: 28 | 34 | 36 | 44 | 96 | 128;
  className?: string;
}

export function Avatar({ semilla, foto, lado, className = '' }: Props) {
  const mascara = useId();
  // Si la foto no carga (firma vencida, Storage caido) queda el generado.
  const [fallida, setFallida] = useState<string | null>(null);
  if (foto && foto !== fallida) {
    return (
      <span className={`${styles.avatar} ${className}`}>
        <img src={foto} alt="" width={lado} height={lado} className={styles.foto} onError={() => setFallida(foto)} />
      </span>
    );
  }

  const d = generar(semilla);
  const forma = d.formaEsAcento ? styles.acento : styles.fondo;
  const contraria = d.formaEsAcento ? styles.fondo : styles.acento;
  const trazo = d.formaEsAcento ? styles.trazoFondo : styles.trazoAcento;

  return (
    <span className={`${styles.avatar} ${className}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={lado} height={lado} fill="none" aria-hidden="true">
        <mask id={mascara} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
          <rect width={SIZE} height={SIZE} rx={SIZE * 2} className={styles.mascara} />
        </mask>
        <g mask={`url(#${mascara})`}>
          <rect width={SIZE} height={SIZE} className={contraria} />
          <rect
            width={SIZE}
            height={SIZE}
            transform={`translate(${d.x} ${d.y}) rotate(${d.rotacion} ${SIZE / 2} ${SIZE / 2}) scale(${d.escala})`}
            rx={d.circulo ? SIZE : SIZE / 6}
            className={forma}
          />
          <g transform={`translate(${d.caraX} ${d.caraY}) rotate(${d.caraRotacion} ${SIZE / 2} ${SIZE / 2})`}>
            {d.bocaAbierta ? (
              <path d={`M15 ${19 + d.boca}c2 1 4 1 6 0`} fill="none" strokeLinecap="round" className={trazo} />
            ) : (
              <path d={`M13,${19 + d.boca} a1,0.75 0 0,0 10,0`} className={contraria} />
            )}
            <rect x={14 - d.ojos} y={14} width={1.5} height={2} rx={1} className={contraria} />
            <rect x={20 + d.ojos} y={14} width={1.5} height={2} rx={1} className={contraria} />
          </g>
        </g>
      </svg>
    </span>
  );
}
