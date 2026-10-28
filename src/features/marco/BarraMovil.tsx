/* Barra inferior del teléfono (kit web, .w-barra-movil): reemplaza a la
   navegacion lateral por debajo de 768 px. Inicio, Rutinas, Historial y
   Perfil; Perfil queda activa tambien en Editar perfil y en Configuracion,
   que se entra desde Perfil. Sin Nueva rutina: abre el constructor, que en
   el teléfono esta bloqueado. En pantallas mas grandes no se muestra. */

import { History, House, Layers, UserRound, type LucideIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

import { Icono } from '@/design/components/Icono';
import styles from './BarraMovil.module.css';

const ITEMS: { ruta: string; etiqueta: string; icono: LucideIcon }[] = [
  { ruta: '/', etiqueta: 'Inicio', icono: House },
  { ruta: '/rutinas', etiqueta: 'Rutinas', icono: Layers },
  { ruta: '/historial', etiqueta: 'Historial', icono: History },
  { ruta: '/perfil', etiqueta: 'Perfil', icono: UserRound },
];

export function BarraMovil() {
  const { pathname } = useLocation();
  const enConfiguracion = pathname.startsWith('/configuracion');

  return (
    <nav className={styles.barra} aria-label="Principal" data-barra-inferior>
      {ITEMS.map((item) => (
        <NavLink
          key={item.ruta}
          to={item.ruta}
          end={item.ruta === '/'}
          className={({ isActive }) => `${styles.item} ${isActive || (item.ruta === '/perfil' && enConfiguracion) ? styles.activo : ''}`}
        >
          <Icono icono={item.icono} tamano={20} className={styles.icono} />
          <span>{item.etiqueta}</span>
        </NavLink>
      ))}
    </nav>
  );
}
