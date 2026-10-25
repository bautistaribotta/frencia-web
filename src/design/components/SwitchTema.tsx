import { Moon, Sun } from 'lucide-react';

import { useTema } from '../tema';
import { Icono } from './Icono';
import { Interruptor } from './Interruptor';
import styles from './SwitchTema.module.css';

export function SwitchTema({ className = '' }: { className?: string }) {
  const [modo, elegir] = useTema();
  const oscuro = modo === 'dark';

  return (
    <div className={`${styles.switchTema} ${className}`}>
      <span className={`${styles.icono} ${oscuro ? '' : styles.activo}`}>
        <Icono icono={Sun} tamano={18} />
      </span>
      <Interruptor
        encendido={oscuro}
        etiqueta="Modo oscuro"
        title={oscuro ? 'Pasar a modo claro' : 'Pasar a modo oscuro'}
        onChange={(encender) => elegir(encender ? 'dark' : 'light')}
      />
      <span className={`${styles.icono} ${oscuro ? styles.activo : ''}`}>
        <Icono icono={Moon} tamano={18} />
      </span>
    </div>
  );
}
