/* Ingreso con Apple y Google, debajo del formulario. Los logos son los de
   cada marca: el de Google lleva sus cuatro colores, el de Apple la tinta.
   Al tocar uno, ese cambia el logo por la ruedita y el otro queda apagado
   hasta que el navegador sale hacia el proveedor (lib/oauth.ts). Al volver
   con un error (cancelado, proveedor caido) se avisa y se limpia la URL; si
   se entro, la puerta SoloInvitado lleva al inicio. Solo se muestran los
   proveedores activos (PROVEEDORES_ACTIVOS): con uno solo, ocupa el ancho. */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { Boton } from '@/design/components/Boton';
import { LogoApple } from '@/design/components/Logos';
import { Divisor } from '@/design/components/varios';
import { borrarIntento, entrarCon, errorDeVuelta, leerIntento, NOMBRE_PROVEEDOR, PROVEEDORES_ACTIVOS, type Proveedor } from '@/lib/oauth';
import styles from './Acceso.module.css';

function LogoGoogle() {
  return (
    <svg className={styles.logo} viewBox="0 0 24 24" aria-hidden="true">
      <path className={styles.googleAzul} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path className={styles.googleVerde} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path className={styles.googleAmarillo} d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path className={styles.googleRojo} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

const LOGO: Record<Proveedor, () => React.JSX.Element> = { apple: LogoApple, google: LogoGoogle };

interface Props {
  deshabilitado?: boolean;
}

export function Sociales({ deshabilitado = false }: Props) {
  const [cargando, setCargando] = useState<Proveedor | null>(null);
  const avisar = useAvisos();
  const navegar = useNavigate();
  const { pathname, state } = useLocation();

  // Volvio del proveedor con un error: se avisa una vez y se limpia la URL.
  useEffect(() => {
    const vuelta = errorDeVuelta(window.location.href);
    if (!vuelta) return;
    const nombre = NOMBRE_PROVEEDOR[leerIntento()?.proveedor ?? 'google'];
    borrarIntento();
    if (vuelta.cancelado) avisar(`Cancelaste el ingreso con ${nombre}.`, 'info');
    else avisar(`No pudimos entrar con ${nombre}. Probá de nuevo.`, 'error');
    navegar(pathname, { replace: true, state });
    // Solo al llegar a la pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Volver con la flecha del navegador puede traer la pagina de la cache
  // tal como quedo, con la ruedita: los botones vuelven a como estaban.
  useEffect(() => {
    const alMostrar = (evento: PageTransitionEvent) => {
      if (evento.persisted) setCargando(null);
    };
    window.addEventListener('pageshow', alMostrar);
    return () => window.removeEventListener('pageshow', alMostrar);
  }, []);

  async function entrar(proveedor: Proveedor) {
    setCargando(proveedor);
    const { error } = await entrarCon(proveedor, (state as { desde?: string } | null)?.desde);
    if (!error) return;
    setCargando(null);
    avisar(`No pudimos conectar con ${NOMBRE_PROVEEDOR[proveedor]}. Probá de nuevo.`, 'error');
  }

  const boton = (proveedor: Proveedor) => {
    const Logo = LOGO[proveedor];
    const esEste = cargando === proveedor;
    return (
      <Boton
        key={proveedor}
        variante="secondary"
        disabled={deshabilitado || (cargando !== null && !esEste)}
        cargando={esEste}
        onClick={() => entrar(proveedor)}
      >
        <span className={styles.conLogo}>
          {/* Mientras carga, la ruedita del boton ocupa el lugar del logo. */}
          {esEste ? null : <Logo />}
          {NOMBRE_PROVEEDOR[proveedor]}
        </span>
      </Boton>
    );
  };

  return (
    <>
      <Divisor>o continuá con</Divisor>
      <div className={styles.fila}>{PROVEEDORES_ACTIVOS.map((proveedor) => boton(proveedor))}</div>
    </>
  );
}
