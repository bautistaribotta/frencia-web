/* Boton de tema del acceso (kit web, Web · 3, propuesta A): un boton de icono
   en vidrio con el icono del tema actual, luna en oscuro y sol en claro. Un
   clic alterna; la etiqueta dice a que modo pasa. Al cambiar, el icono nuevo
   anima al aparecer. Sin sesion la eleccion se guarda en el navegador. */

import { Moon, Sun } from 'lucide-react';

import { useTema } from '../tema';
import { BotonIcono } from './BotonIcono';

export function BotonTema({ className = '' }: { className?: string }) {
  const [modo, elegir] = useTema();
  const oscuro = modo === 'dark';

  return (
    <BotonIcono
      icono={oscuro ? Moon : Sun}
      variante="surface"
      etiqueta={oscuro ? 'Pasar a modo claro' : 'Pasar a modo oscuro'}
      className={className}
      onClick={() => elegir(oscuro ? 'light' : 'dark')}
    />
  );
}
