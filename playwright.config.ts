/* Playwright: capturas y recorridos de pantallas contra el servidor de
   desarrollo, con la sesion y Supabase simulados (e2e/simulacion.ts). Las
   capturas quedan en capturas/, que no se sube. */

import { defineConfig, devices } from '@playwright/test';

const PUERTO = 5180;

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'e2e/resultados',
  fullyParallel: true,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://localhost:${PUERTO}`,
    viewport: { width: 1440, height: 900 },
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
  },
  webServer: {
    command: `npm run dev -- --port ${PUERTO} --strictPort`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: true,
  },
});
