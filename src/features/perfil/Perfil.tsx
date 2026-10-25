/* Perfil (/perfil). En la web el perfil de la app se separa en dos: Perfil
   muestra quien sos y lo acumulado; tema, unidades y esfuerzo pasan a
   Configuracion (kit web, Web · 7). Se llega desde el usuario al pie de la
   navegacion.
   Tocar el avatar abre el modal de la foto (ModalFoto).
   Pendiente del diseño: Editar perfil y la "Racha mas larga", que todavia no
   tiene una definicion: la racha de la app se mide contra la rutina activa.
   Fondo: cumbre. */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, ChevronRight, LogOut, Pencil, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Avatar } from '@/design/components/Avatar';
import { Boton } from '@/design/components/Boton';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { claseFila, Encabezado, Fila, Lista, Pagina } from '@/design/components/Pagina';
import { Esqueleto, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { mostrarAltura, type UnidadAltura } from '@/lib/altura';
import { fechaNacimientoAEdad } from '@/lib/edad';
import { contarSesiones, tonelajeTotalKg } from '@/lib/estadisticas';
import { useFotoPerfil, useNombre, usePerfil } from '@/lib/perfil';
import { mostrarPeso, type UnidadPeso } from '@/lib/peso';
import { supabase } from '@/lib/supabase';
import { MESES_LARGO } from '@/lib/tiempo';
import { miles } from '@/lib/numeros';
import { ModalFoto } from './ModalFoto';
import styles from './Perfil.module.css';

const SEXO: Record<string, string> = { masculino: 'Masculino', femenino: 'Femenino', otro: 'Otro' };

/** "25 años · 14/03/2001". */
function textoEdad(fecha: string | null): string | null {
  const edad = fechaNacimientoAEdad(fecha);
  if (edad === null || !fecha) return null;
  const [a, m, d] = fecha.split('-');
  return `${edad} ${edad === 1 ? 'año' : 'años'} · ${d}/${m}/${a}`;
}

/** Tonelaje en la unidad del usuario: toneladas si es kg, libras si es lb. */
function textoTonelaje(kg: number, unidad: UnidadPeso): { valor: string; unidad: string } {
  if (unidad === 'lb') return { valor: miles(mostrarPeso(kg, 'lb')), unidad: 'lb' };
  return { valor: (Math.round(kg / 100) / 10).toFixed(1), unidad: 't' };
}

export function Perfil() {
  const { user } = useSesion();
  const userId = user?.id ?? '';
  const perfil = usePerfil();
  const { completo, semilla } = useNombre();
  const foto = useFotoPerfil(perfil.data?.avatar_path);
  const navegar = useNavigate();
  const avisar = useAvisos();
  const cliente = useQueryClient();
  const [cambiandoFoto, setCambiandoFoto] = useState(false);

  const sesiones = useQuery({ queryKey: ['estadisticas', 'sesiones', userId], queryFn: () => contarSesiones(userId), enabled: !!userId });
  const tonelaje = useQuery({ queryKey: ['estadisticas', 'tonelaje', userId], queryFn: () => tonelajeTotalKg(userId), enabled: !!userId });

  const p = perfil.data;
  const unidadPeso = (p?.unidad_peso ?? 'kg') as UnidadPeso;
  const desde = p ? new Date(p.created_at) : null;

  const datos: [string, string | null][] = [
    ['Sexo', p?.sexo ? (SEXO[p.sexo] ?? null) : null],
    ['Edad', textoEdad(p?.fecha_nacimiento ?? null)],
    ['Altura', p?.altura != null ? mostrarAltura(p.altura, (p.unidad_altura ?? 'cm') as UnidadAltura) : null],
    ['Peso', p?.peso != null ? `${mostrarPeso(p.peso, unidadPeso)} ${unidadPeso}` : null],
  ];

  // La puerta ConSesion ve la sesion cerrada y lleva al login.
  async function cerrarSesion() {
    await supabase.auth.signOut();
    cliente.clear();
    avisar('Sesión cerrada', 'info');
  }

  const tonelajeVisible = tonelaje.data != null ? textoTonelaje(tonelaje.data, unidadPeso) : null;

  return (
    <>
      <Fondo posicion="cumbre" />
      <Pagina>
        <Encabezado
          rotulo="Perfil"
          titulo={completo}
          acciones={
            <Boton variante="secondary" icono={Pencil} onClick={() => navegar('/perfil/editar')}>
              Editar perfil
            </Boton>
          }
        />
        <div className={styles.dos}>
          <div className={styles.columna}>
            <Tarjeta className={styles.usuario}>
              <button
                type="button"
                className={styles.avatarEditar}
                aria-label="Cambiar foto de perfil"
                title="Cambiar foto de perfil"
                onClick={() => setCambiandoFoto(true)}
              >
                <Avatar semilla={semilla} foto={foto.data} lado={96} className={styles.avatar} />
                <span className={styles.camara}>
                  <Icono icono={Camera} tamano={14} />
                </span>
              </button>
              <div className={styles.usuarioTextos}>
                <span className={texto.subtitle}>{completo}</span>
                <span className={`${texto.bodySm} ${texto.secundario}`}>{user?.email}</span>
                {desde ? (
                  <span className={`${texto.label} ${texto.terciario}`}>
                    Miembro desde {MESES_LARGO[desde.getMonth()].toLowerCase()} de {desde.getFullYear()}
                  </span>
                ) : null}
              </div>
            </Tarjeta>
            <Lista>
              {datos.map(([rotulo, valor]) => (
                <Fila key={rotulo}>
                  <span className={`${texto.bodySm} ${texto.secundario} ${styles.crece}`}>{rotulo}</span>
                  <span className={`${texto.data} ${valor ? texto.primario : texto.terciario}`}>{valor ?? 'Sin cargar'}</span>
                </Fila>
              ))}
            </Lista>
          </div>

          <div className={styles.columna}>
            <span className={`${texto.label} ${texto.terciario}`}>Desde que empezaste</span>
            <Tarjeta className={styles.metricas}>
              <div className={styles.metrica}>
                <span className={`${texto.label} ${texto.terciario}`}>Sesiones</span>
                {sesiones.data != null ? (
                  <span className={styles.valor}>{miles(sesiones.data)}</span>
                ) : (
                  <Esqueleto className={styles.esqValor} />
                )}
              </div>
              <div className={styles.metrica}>
                <span className={`${texto.label} ${texto.terciario}`}>Tonelaje total</span>
                {tonelajeVisible ? (
                  <span className={styles.valor}>
                    {tonelajeVisible.valor}
                    <small>{tonelajeVisible.unidad}</small>
                  </span>
                ) : tonelaje.isError ? (
                  <span className={`${texto.bodySm} ${texto.terciario}`}>No pudimos calcularlo.</span>
                ) : (
                  <Esqueleto className={styles.esqValor} />
                )}
              </div>
            </Tarjeta>
            <Lista>
              <Link to="/configuracion" className={claseFila(true)}>
                <Icono icono={Settings} tamano={20} className={texto.secundario} />
                <span className={`${texto.bodySm} ${texto.semi} ${styles.crece}`}>Configuración</span>
                <Icono icono={ChevronRight} tamano={18} className={texto.terciario} />
              </Link>
              <button type="button" className={claseFila(true)} onClick={() => void cerrarSesion()}>
                <Icono icono={LogOut} tamano={20} className={texto.peligro} />
                <span className={`${texto.bodySm} ${texto.semi} ${texto.peligro} ${styles.crece}`}>Cerrar sesión</span>
              </button>
            </Lista>
          </div>
        </div>
      </Pagina>
      <ModalFoto abierto={cambiandoFoto} onCerrar={() => setCambiandoFoto(false)} />
    </>
  );
}
