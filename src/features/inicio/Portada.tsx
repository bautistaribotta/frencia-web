// Portada provisoria de la etapa 0: confirma que la web compila, se despliega
// y llega a Supabase. Se reemplaza por el Inicio real en la etapa 4.
//
// Sin sesion no se puede leer ninguna tabla (anon no tiene privilegios, ver la
// migracion recortar_grants_de_la_api del repo movil). Por eso la prueba
// consulta la configuracion publica de Auth, que solo pide la clave.
import { useQuery } from '@tanstack/react-query';

import styles from './Portada.module.css';

interface AjustesAuth {
  external: Record<string, boolean>;
}

async function leerAjustesAuth(): Promise<string[]> {
  const respuesta = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
    headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
  });
  if (!respuesta.ok) throw new Error(`Auth respondio ${respuesta.status}`);
  const ajustes = (await respuesta.json()) as AjustesAuth;
  return Object.entries(ajustes.external)
    .filter(([, activo]) => activo)
    .map(([proveedor]) => proveedor);
}

export function Portada() {
  const { data, isPending, isError } = useQuery({ queryKey: ['auth', 'ajustes'], queryFn: leerAjustesAuth });

  let estado = 'Conectando con Supabase…';
  if (isError) estado = 'No se pudo conectar con Supabase.';
  else if (!isPending) estado = `Supabase conectado. Ingreso con: ${data.join(', ')}.`;

  return (
    <main className={styles.portada}>
      <h1 className={styles.marca}>FRENCIA.</h1>
      <p className={styles.estado}>{estado}</p>
    </main>
  );
}
