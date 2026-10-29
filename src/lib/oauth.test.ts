import { describe, expect, it, vi } from 'vitest';

import { errorDeVuelta } from './oauth';

// Lo que se prueba es puro: el cliente real pide las variables del .env.local.
vi.mock('./supabase', () => ({ supabase: { auth: {} } }));

describe('errorDeVuelta', () => {
  it('sin error, nada', () => {
    expect(errorDeVuelta('https://frencia.fit/login')).toBeNull();
    expect(errorDeVuelta('https://frencia.fit/login?code=abc')).toBeNull();
  });

  it('cancelar en el proveedor es access_denied', () => {
    expect(errorDeVuelta('https://frencia.fit/login?error=access_denied&error_description=The+user+denied')).toEqual({ cancelado: true });
  });

  it('lee el error tambien del fragmento', () => {
    expect(errorDeVuelta('https://frencia.fit/signup#error=server_error&error_description=user_cancelled_authorize')).toEqual({ cancelado: true });
    expect(errorDeVuelta('https://frencia.fit/signup#error=server_error&error_description=Unable+to+exchange')).toEqual({ cancelado: false });
  });
});
