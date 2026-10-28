/* Terminos y privacidad (/bienvenida), la fase legal de la cuenta (kit web,
   Web · 3). Cada documento se abre en el modal de lectura y se marca leido
   al llegar al final; con los dos leidos, Aceptar y continuar registra la
   aceptacion de las versiones vigentes y la puerta deja pasar. La otra
   salida es cerrar sesion. Fondo: cumbre, anima. */

import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, Check, LogOut } from 'lucide-react';
import { useState } from 'react';

import { useAvisos } from '@/contexts/avisos';
import { useSesion } from '@/contexts/sesion';
import { Boton } from '@/design/components/Boton';
import { DocumentoLegal, type Documento } from '@/design/components/DocumentoLegal';
import { Fondo } from '@/design/components/Fondo';
import { Icono } from '@/design/components/Icono';
import { Marca, Tarjeta } from '@/design/components/varios';
import texto from '@/design/texto.module.css';
import { PRIVACIDAD_VERSION, PRIVACIDAD_VIGENCIA } from '@/lib/privacidad';
import { supabase } from '@/lib/supabase';
import { TERMINOS_VERSION, TERMINOS_VIGENCIA } from '@/lib/terminos';
import styles from './Bienvenida.module.css';

const DOCUMENTOS: { id: Documento; titulo: string; vigencia: string }[] = [
  { id: 'terminos', titulo: 'Términos y condiciones', vigencia: TERMINOS_VIGENCIA },
  { id: 'privacidad', titulo: 'Política de privacidad', vigencia: PRIVACIDAD_VIGENCIA },
];

export function Consentimiento() {
  const { user } = useSesion();
  const cliente = useQueryClient();
  const avisar = useAvisos();
  const [abierto, setAbierto] = useState<Documento | null>(null);
  const [leidos, setLeidos] = useState<Documento[]>([]);
  const [aceptando, setAceptando] = useState(false);
  const ambos = leidos.length === DOCUMENTOS.length;

  async function aceptar() {
    if (!ambos || aceptando) return;
    setAceptando(true);
    const { error } = await supabase.rpc('registrar_aceptacion_legal', {
      p_version_terminos: TERMINOS_VERSION,
      p_version_privacidad: PRIVACIDAD_VERSION,
    });
    if (error) {
      setAceptando(false);
      avisar('No pudimos registrar la aceptación. Probá de nuevo.', 'error');
      return;
    }
    // Con la aceptacion vigente la puerta lleva al setup o a la app.
    await cliente.invalidateQueries({ queryKey: ['perfil', user?.id] });
  }

  return (
    <>
      <Fondo posicion="cumbre" animado />
      <main className={styles.centrada}>
        <Tarjeta className={styles.caja}>
          <Marca />
          <div className={styles.textos}>
            <span className={`${texto.label} ${texto.terciario}`}>Antes de empezar</span>
            <h1 className={texto.display}>Términos y privacidad</h1>
            <span className={`${texto.bodySm} ${texto.secundario}`}>
              Para usar Frencia necesitás leer y aceptar los dos documentos. Cada uno se marca al llegar al final.
            </span>
          </div>
          <div className={styles.documentos}>
            {DOCUMENTOS.map((d) => {
              const ok = leidos.includes(d.id);
              return (
                <div key={d.id} className={styles.documento}>
                  <span className={`${styles.check} ${ok ? styles.checkOn : ''}`} aria-hidden="true">
                    {ok ? <Icono icono={Check} tamano={14} /> : null}
                  </span>
                  <div className={styles.documentoTextos}>
                    <span className={`${texto.bodySm} ${texto.semi} ${texto.primario}`}>{d.titulo}</span>
                    <span className={`${texto.label} ${ok ? texto.acento : texto.terciario}`}>{ok ? 'Leído' : `Vigente desde el ${d.vigencia}`}</span>
                  </div>
                  <Boton variante="ghost" tamano="sm" iconoDer={ArrowUpRight} onClick={() => setAbierto(d.id)} aria-label={`${ok ? 'Volver a leer' : 'Leer'} ${d.titulo}`}>
                    {ok ? 'Volver a leer' : 'Leer'}
                  </Boton>
                </div>
              );
            })}
          </div>
          <div className={styles.pie}>
            <Boton variante="ghost" tamano="sm" icono={LogOut} className={styles.volverIzq} disabled={aceptando} onClick={() => void supabase.auth.signOut()}>
              Cerrar sesión
            </Boton>
            <Boton tamano="lg" icono={Check} disabled={!ambos} cargando={aceptando} title={ambos ? undefined : 'Leé los dos documentos hasta el final'} onClick={() => void aceptar()}>
              Aceptar y continuar
            </Boton>
          </div>
        </Tarjeta>
      </main>
      <DocumentoLegal
        documento={abierto}
        onCerrar={() => setAbierto(null)}
        onLeido={(d) => {
          setLeidos((actuales) => (actuales.includes(d) ? actuales : [...actuales, d]));
          // Al 100 % se marca y, despues de ver la barra llena, vuelve a la lista.
          window.setTimeout(() => setAbierto((actual) => (actual === d ? null : actual)), 600);
        }}
      />
    </>
  );
}
