/* Foto de perfil y avatar generado, con las mismas reglas que la app
   (src/lib/avatar.ts del repo mobile):
   - El bucket avatars es privado: la imagen va a avatars/{userId}/{aleatorio}.jpg
     y en profiles.avatar_path queda la ruta. Para mostrarla se firma
     (useFotoPerfil en perfil.ts).
   - Lo que se elige nunca se sube tal cual: se redibuja en un canvas, lo que
     tira el EXIF (ubicacion, fecha, modelo de la camara) y aplica la
     orientacion. Sale cuadrada, de 512 px como mucho, en JPEG al 85 %.
   - Recien con el perfil apuntando al archivo nuevo se borra el viejo. */

import { supabase } from './supabase';

const LADO_MAX = 512;
const CALIDAD = 0.85;
/** Tope de entrada del diseño web: "JPG o PNG · hasta 5 MB". */
export const MAX_BYTES_ENTRADA = 5 * 1024 * 1024;
export const TIPOS_ACEPTADOS = ['image/jpeg', 'image/png'];

/** Recorta al centro en cuadrado, achica y reencoda en JPEG. */
async function prepararImagen(archivo: File): Promise<Blob> {
  const imagen = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
  const lado = Math.min(imagen.width, imagen.height);
  const salida = Math.min(lado, LADO_MAX);
  const canvas = document.createElement('canvas');
  canvas.width = salida;
  canvas.height = salida;
  const contexto = canvas.getContext('2d');
  if (!contexto) throw new Error('Sin canvas');
  contexto.drawImage(imagen, (imagen.width - lado) / 2, (imagen.height - lado) / 2, lado, lado, 0, 0, salida, salida);
  imagen.close();
  return new Promise((resolver, rechazar) =>
    canvas.toBlob((blob) => (blob ? resolver(blob) : rechazar(new Error('Sin imagen'))), 'image/jpeg', CALIDAD),
  );
}

/** Sube la foto y la deja como foto de perfil. Devuelve la ruta nueva o el
 *  mensaje de error para mostrar. */
export async function subirFoto(
  userId: string,
  anterior: string | null,
  archivo: File,
): Promise<{ path: string } | { error: string }> {
  if (!TIPOS_ACEPTADOS.includes(archivo.type)) return { error: 'Elegí una imagen JPG o PNG.' };
  if (archivo.size > MAX_BYTES_ENTRADA) return { error: 'Esa imagen pesa más de 5 MB. Elegí una más liviana.' };

  let jpeg: Blob;
  try {
    jpeg = await prepararImagen(archivo);
  } catch {
    return { error: 'No pudimos procesar la imagen.' };
  }

  // Nombre aleatorio: no se deduce del usuario y cada subida es un archivo
  // nuevo, sin versiones viejas en la cache.
  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const { error: errorSubida } = await supabase.storage.from('avatars').upload(path, jpeg, { contentType: 'image/jpeg' });
  if (errorSubida) return { error: 'No pudimos subir la imagen. Probá de nuevo.' };

  const { error: errorPerfil } = await supabase.from('profiles').update({ avatar_path: path }).eq('id', userId);
  if (errorPerfil) {
    // Nadie la referencia: se saca en vez de dejarla colgada.
    await supabase.storage.from('avatars').remove([path]);
    return { error: 'Subimos la imagen pero no pudimos guardarla en tu perfil.' };
  }

  if (anterior && anterior !== path) await supabase.storage.from('avatars').remove([anterior]);
  return { path };
}

/** Pasa al avatar generado con esta semilla y suelta la foto, si habia. */
export async function usarAvatarGenerado(userId: string, anterior: string | null, semilla: string): Promise<boolean> {
  const { error } = await supabase.from('profiles').update({ avatar_seed: semilla, avatar_path: null }).eq('id', userId);
  if (error) return false;
  // Si el borrado falla queda un archivo huerfano en un bucket privado, al que
  // ya no apunta ninguna fila.
  if (anterior) await supabase.storage.from('avatars').remove([anterior]);
  return true;
}

/** Semilla nueva al azar, con el mismo formato que la app. */
export function semillaNueva(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
