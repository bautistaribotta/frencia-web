/* Navegacion lateral en vidrio denso: reemplaza la barra de pestañas de la
   app. Arriba la marca (link al Inicio) y Nueva rutina (en lugar del boton central de la
   barra), despues Inicio, Rutinas e Historial; al pie el recordatorio de que
   se entrena desde el celular, Configuracion y el usuario, que lleva al
   Perfil. Entre 1024 y 1279 px se vuelve riel de iconos (ver el CSS).
   Atajos: G I, G R y G H para navegar; N para una rutina nueva. Con el
   limite de rutinas alcanzado, Nueva rutina y N abren el aviso. */

import { History, House, Layers, Plus, Settings, Smartphone, type LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';

import { Boton } from '@/design/components/Boton';
import { Icono } from '@/design/components/Icono';
import { Avatar } from '@/design/components/Avatar';
import { Kbd, Marca } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { useNuevaRutina } from '@/features/rutinas/acciones';
import { useFotoPerfil, useNombre, usePerfil } from '@/lib/perfil';
import styles from './Navegacion.module.css';

interface Item {
  ruta: string;
  etiqueta: string;
  icono: LucideIcon;
  tecla: string;
}

const ITEMS: Item[] = [
  { ruta: '/', etiqueta: 'Inicio', icono: House, tecla: 'I' },
  { ruta: '/rutinas', etiqueta: 'Rutinas', icono: Layers, tecla: 'R' },
  { ruta: '/historial', etiqueta: 'Historial', icono: History, tecla: 'H' },
];

function claseItem({ isActive }: { isActive: boolean }) {
  return `${styles.item} ${isActive ? styles.activo : ''}`;
}

/** G seguido de una letra dentro del segundo navega; N abre una rutina
 *  nueva. Se ignoran mientras se escribe en un campo. */
function useAtajos(nuevaRutina: () => void) {
  const navegar = useNavigate();
  useEffect(() => {
    let esperandoG = 0;
    function alTeclear(evento: KeyboardEvent) {
      if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
      const destino = evento.target as HTMLElement | null;
      if (destino?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const tecla = evento.key.toUpperCase();
      if (esperandoG && Date.now() - esperandoG < 1000) {
        esperandoG = 0;
        const item = ITEMS.find((i) => i.tecla === tecla);
        if (item) {
          evento.preventDefault();
          navegar(item.ruta);
        }
        return;
      }
      if (tecla === 'G') esperandoG = Date.now();
      else if (tecla === 'N') nuevaRutina();
    }
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [navegar, nuevaRutina]);
}

export function Navegacion() {
  const { completo, semilla } = useNombre();
  const foto = useFotoPerfil(usePerfil().data?.avatar_path);
  const nueva = useNuevaRutina();
  useAtajos(nueva.abrir);

  return (
    <nav className={styles.nav} aria-label="Principal">
      <div className={styles.cabeza}>
        {/* La marca lleva al Inicio, como en cualquier sitio. */}
        <Link to="/" className={styles.marcaLink} aria-label="Frencia, ir al inicio" title="Inicio">
          <Marca className={styles.marca} />
          <span className={styles.marcaCorta} aria-hidden="true">
            F.
          </span>
        </Link>
      </div>

      <Boton
        variante="primary"
        icono={Plus}
        ancho
        className={styles.nueva}
        title="Nueva rutina (N)"
        onClick={nueva.abrir}
      >
        <span className={styles.texto}>Nueva rutina</span>
      </Boton>
      {nueva.modal}

      <div className={styles.grupo}>
        {ITEMS.map((item) => (
          <NavLink key={item.ruta} to={item.ruta} end={item.ruta === '/'} className={claseItem} title={`${item.etiqueta} (G ${item.tecla})`}>
            <Icono icono={item.icono} tamano={20} className={styles.icono} />
            <span className={styles.texto}>{item.etiqueta}</span>
            <span className={styles.atajo}>
              <Kbd>G {item.tecla}</Kbd>
            </span>
          </NavLink>
        ))}
      </div>

      <div className={styles.pie}>
        <div className={styles.notaMovil}>
          <Icono icono={Smartphone} tamano={18} className={texto.secundario} />
          <span className={`${texto.bodySm} ${texto.secundario}`}>
            Para entrenar, abrí Frencia en el celular. Acá se planifica y se revisa.
          </span>
        </div>
        <NavLink to="/configuracion" className={claseItem} title="Configuración">
          <Icono icono={Settings} tamano={20} className={styles.icono} />
          <span className={styles.texto}>Configuración</span>
        </NavLink>
        <NavLink
          to="/perfil"
          title="Perfil"
          className={({ isActive }) => `${styles.usuario} ${isActive ? styles.usuarioActivo : ''}`}
        >
          <Avatar semilla={semilla} foto={foto.data} lado={34} />
          <span className={styles.usuarioTextos}>
            <span className={`${texto.bodySm} ${texto.primario} ${styles.semi} ${styles.unaLinea}`}>{completo}</span>
            <span className={`${texto.label} ${texto.terciario}`}>Perfil</span>
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
