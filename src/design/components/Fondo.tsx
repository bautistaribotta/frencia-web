/* Fondo de la pantalla. Con shadcn/ui no hay luces: el fondo es el color
   plano de background (lo pinta el body). Se conserva el componente y su
   posicion para no tocar cada pantalla. */

export type PosicionFondo = 'cumbre' | 'centro' | 'flanco' | 'base' | 'velada';

interface Props {
  posicion: PosicionFondo;
  /** Se ignora: sin luces no hay nada que animar. */
  animado?: boolean;
}

export function Fondo(props: Props) {
  void props;
  return null;
}
