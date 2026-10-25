import * as React from 'react';

/** Donde cae la luz. Cada pantalla elige la que deja su contenido fuera de la zona clara. */
export type FondoPosicion = 'cumbre' | 'centro' | 'flanco' | 'base' | 'velada';

/** Una luz: [capa a|b|c, x %, y %, radio en % del ancho, opacidad 0–1]. */
export type FondoLuz = ['a' | 'b' | 'c', number, number, number, number];

export interface FondoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Posicion fija de las luces. Por defecto `cumbre`. */
  posicion?: FondoPosicion;
  /** `pleno` para pantallas de un solo protagonista; `suave` baja las luces en pantallas de datos. */
  intensidad?: 'pleno' | 'suave';
  /** Las luces derivan lentamente. Solo en el onboarding; el resto de la app es fijo. */
  animado?: boolean;
  /** Grano sobre las luces para que el degradado no haga bandas. Por defecto true. */
  grano?: boolean;
}

/**
 * Fondo de luces de Frencia: base `bg-app`, tres luces radiales (glow-a lume, glow-b bosque o blanco,
 * glow-c acero tenue), velos arriba y abajo y grano. Se ubica absoluto detras de la pantalla.
 */
export function Fondo(props: FondoProps): React.ReactElement;
export namespace Fondo {
  const POSICIONES: Record<FondoPosicion, { uso: string; luces: FondoLuz[] }>;
  /** Posiciones del onboarding en orden; la transicion entre pasos desplaza las luces. */
  const RECORRIDO: FondoPosicion[];
}
