import { describe, expect, it } from 'vitest';

import { tiendaDelSistema } from './tiendas';

describe('tiendaDelSistema', () => {
  it('manda el iPhone y el iPad a la App Store', () => {
    expect(tiendaDelSistema('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', 5)).toBe('appStore');
    expect(tiendaDelSistema('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5)).toBe('appStore');
  });

  it('manda Android y el resto a Google Play', () => {
    expect(tiendaDelSistema('Mozilla/5.0 (Linux; Android 15; Pixel 9)', 5)).toBe('googlePlay');
    expect(tiendaDelSistema('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0)).toBe('googlePlay');
  });
});
