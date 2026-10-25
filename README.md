# frencia-web

App web de Frencia para escritorio: planificar rutinas y revisar entrenamientos
desde el navegador. Usa el mismo backend de Supabase que la app movil.

## Desarrollo

```bash
cp .env.example .env.local   # completar con las claves publicas de Supabase
npm install
npm run dev
```

| Script | Que hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Typecheck + build de produccion en `dist/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | Solo TypeScript |
| `npm test` | Vitest |
| `npm run gen:types` | Regenera `src/lib/database.types.ts` desde Supabase |

## Estructura

```
src/
  main.tsx            entrada: providers y router
  router.tsx          rutas
  design/             design system Lume: tokens/, components/, global.css
  features/           una carpeta por area: auth, inicio, rutinas, constructor,
                      historial, perfil, compartir, legal
  lib/                cliente de Supabase, tipos generados y utilidades
  contexts/           sesion, perfil, tema
```

Las reglas para trabajar en el repo estan en [AGENTS.md](AGENTS.md).
