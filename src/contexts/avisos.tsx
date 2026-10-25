/* Frencia · Avisos (toasts).
   En la web el toast va abajo a la derecha y se apila (kit web, .w-toast).
   ok: check en lume; error: triangulo en carmin; info: en tinta. Se van
   solos a los 4 s y tienen su cruz para cerrarlos antes. */

import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

import { BotonIcono } from '@/design/components/BotonIcono';
import { Icono } from '@/design/components/Icono';
import texto from '@/design/texto.module.css';
import styles from './avisos.module.css';

type TipoAviso = 'ok' | 'error' | 'info';

interface Aviso {
  id: number;
  mensaje: string;
  tipo: TipoAviso;
}

type Avisar = (mensaje: string, tipo?: TipoAviso) => void;

const ContextoAvisos = createContext<Avisar>(() => {});

const ICONO = { ok: Check, error: TriangleAlert, info: Info };
const DURACION_MS = 4000;

export function ProveedorAvisos({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const siguiente = useRef(0);

  const cerrar = useCallback((id: number) => setAvisos((lista) => lista.filter((a) => a.id !== id)), []);

  const avisar = useCallback<Avisar>(
    (mensaje, tipo = 'ok') => {
      const id = ++siguiente.current;
      setAvisos((lista) => [...lista, { id, mensaje, tipo }]);
      window.setTimeout(() => cerrar(id), DURACION_MS);
    },
    [cerrar],
  );

  return (
    <ContextoAvisos.Provider value={avisar}>
      {children}
      <div className={styles.avisos} aria-live="polite">
        {avisos.map((a) => (
          <div key={a.id} className={`${styles.aviso} ${styles[a.tipo]}`} role="status">
            <Icono icono={ICONO[a.tipo]} tamano={20} className={styles.icono} />
            <span className={`${texto.bodySm} ${texto.primario} ${styles.mensaje}`}>{a.mensaje}</span>
            <BotonIcono icono={X} tamano="sm" etiqueta="Cerrar aviso" onClick={() => cerrar(a.id)} />
          </div>
        ))}
      </div>
    </ContextoAvisos.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAvisos(): Avisar {
  return useContext(ContextoAvisos);
}
