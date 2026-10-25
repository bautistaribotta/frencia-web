// Cliente unico de Supabase para toda la web. Es el mismo proyecto que la app
// movil: mismo esquema, mismas politicas. La sesion vive en localStorage y se
// refresca sola.
import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el .env.local');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // OAuth y los links de los mails vuelven a la web con el code en la URL.
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
