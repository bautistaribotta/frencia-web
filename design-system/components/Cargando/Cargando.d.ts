import * as React from 'react';

export interface CargandoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `sm` 16 px (dentro de un boton), `md` 20 px (listas, pantalla), `lg` 28 px (arrastrar para actualizar). */
  tam?: 'sm' | 'md' | 'lg';
  /** Leyenda debajo: "Cargando rutinas…". */
  texto?: string;
}

/** Indicador de carga de Frencia: el anillo clasico, una vuelta cada 1,2 s. */
export function Cargando(props: CargandoProps): React.ReactElement;
