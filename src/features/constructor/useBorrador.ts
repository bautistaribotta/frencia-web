/* El borrador del constructor: el estado de la rutina mientras se edita, la
   cuenta de cambios sin guardar y su copia en localStorage, que sobrevive a
   recargar la pestaña (frencia:borrador:<id> o frencia:borrador:nueva).

   La cuenta junta las ediciones seguidas del mismo dato (escribir el nombre
   letra por letra es un cambio) y vuelve a cero si el borrador queda igual a
   lo guardado. */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { firma, nuevoUid, reducerBorrador, type Accion, type Borrador } from '@/lib/constructor';

export interface Foto {
  borrador: Borrador;
  cambios: number;
}

interface Guardado extends Foto {
  /** Firma de la rutina sobre la que se hizo el borrador. Si la guardada
   *  cambio despues (por ejemplo desde el celular), el borrador ya no vale. */
  base: string;
}

const clave = (routineId: string | null) => `frencia:borrador:${routineId ?? 'nueva'}`;

function leer(routineId: string | null): Guardado | null {
  try {
    const texto = window.localStorage.getItem(clave(routineId));
    return texto ? (JSON.parse(texto) as Guardado) : null;
  } catch {
    return null;
  }
}

export function borrarBorradorGuardado(routineId: string | null) {
  try {
    window.localStorage.removeItem(clave(routineId));
  } catch {
    // Sin almacenamiento no hay nada que borrar.
  }
}

/** Los uid se generan por pestaña: lo que viene de otra carga los renueva
 *  para que no choquen con los que se creen de aca en mas. */
function renovarUids(b: Borrador): Borrador {
  return {
    ...b,
    dias: b.dias.map((d) => ({ ...d, uid: nuevoUid('dia'), ejercicios: d.ejercicios.map((e) => ({ ...e, uid: nuevoUid('ej') })) })),
  };
}

/** Que dato toca una accion, para juntar las ediciones seguidas del mismo. */
function claveDeAccion(a: Accion): string | null {
  if (a.tipo === 'nombre') return 'nombre';
  if (a.tipo === 'nombreDia') return `nombreDia:${a.dia}`;
  if (a.tipo === 'configurar') return `configurar:${a.uid}:${Object.keys(a.cambios).sort().join(',')}`;
  return null;
}

export function useBorrador(routineId: string | null, base: Borrador) {
  const firmaBase = useMemo(() => firma(base), [base]);

  // Al montar: el borrador guardado si sigue valiendo, si no la rutina.
  const [inicial] = useState(() => {
    const guardado = leer(routineId);
    if (guardado && guardado.base === firmaBase && firma(guardado.borrador) !== firmaBase) {
      return { foto: { borrador: renovarUids(guardado.borrador), cambios: Math.max(1, guardado.cambios) }, recuperado: true };
    }
    if (guardado) borrarBorradorGuardado(routineId);
    return { foto: { borrador: base, cambios: 0 }, recuperado: false };
  });
  const [foto, setFoto] = useState<Foto>(inicial.foto);
  const ultimaClave = useRef<string | null>(null);

  const despachar = useCallback(
    (accion: Accion) => {
      const claveAccion = claveDeAccion(accion);
      // Se decide antes: React puede correr la funcion de abajo mas tarde (y
      // dos veces en modo estricto), cuando la clave ya es la de esta accion.
      const junta = claveAccion !== null && claveAccion === ultimaClave.current;
      ultimaClave.current = claveAccion;
      setFoto((actual) => {
        const borrador = reducerBorrador(actual.borrador, accion);
        if (borrador === actual.borrador) return actual;
        const firmaNueva = firma(borrador);
        if (firmaNueva === firma(actual.borrador)) return { ...actual, borrador };
        const sinCambios = firmaNueva === firmaBase;
        return { borrador, cambios: sinCambios ? 0 : junta && actual.cambios > 0 ? actual.cambios : actual.cambios + 1 };
      });
    },
    [firmaBase],
  );

  /** Vuelve a una foto anterior (Deshacer) o a la rutina (Descartar). */
  const restaurar = useCallback((f: Foto) => {
    ultimaClave.current = null;
    setFoto(f);
  }, []);

  // Copia local de lo que no se guardo.
  useEffect(() => {
    try {
      if (foto.cambios === 0) window.localStorage.removeItem(clave(routineId));
      else window.localStorage.setItem(clave(routineId), JSON.stringify({ ...foto, base: firmaBase } satisfies Guardado));
    } catch {
      // Sin almacenamiento el borrador vive solo en memoria.
    }
  }, [foto, firmaBase, routineId]);

  return { ...foto, foto, despachar, restaurar, recuperado: inicial.recuperado };
}
