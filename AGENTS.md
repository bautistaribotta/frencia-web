# Frencia Web · Directivas para agentes

Este archivo es la unica fuente de reglas del repositorio para cualquier agente
(Claude Code, Gemini, Codex u otros). No existen CLAUDE.md ni GEMINI.md: si una
regla nueva aparece, va aca.

## Que es este repo

La version web de escritorio de Frencia. No es un port de la app movil
(github.com/bautistaribotta/frencia): es la misma app con otra experiencia de
uso, pensada para mouse y teclado. Comparte con la movil el backend de
Supabase y el design system, nada mas.

Fuera de alcance: registrar una sesion de entrenamiento. Desde la web no se
inicia ni se hace un dia de entrenamiento; la web sirve para planificar y para
revisar lo hecho.

## Stack

- Vite + React + TypeScript + React Router (SPA, sin SSR).
- Estilos con CSS Modules y custom properties. Sin Tailwind.
- TanStack Query para leer y cachear datos de Supabase.
- dnd-kit (`@dnd-kit/core` + `@dnd-kit/sortable`) para arrastrar y reordenar.
- Iconos de Lucide (`lucide-react`).
- Se despliega en Cloudflare con deploy automatico desde GitHub, en frencia.fit.

## Design system

- **Siempre**, antes de una tarea que modifique el front, revisar el design
  system "Frencia 2.0" (Lume) en Claude Design. Es la fuente de verdad.
- Si el codigo y el design system difieren, manda el design system; si el
  design system no cubre el caso, avisar antes de inventar.
- Los tokens viven en `src/design/tokens/` como custom properties. Los dos
  temas (oscuro y claro) comparten las mismas claves; el tema sobreescribe
  colores, sombras y la ganancia de las luces del fondo.
- No hardcodear colores en componentes: siempre `var(--token)`.
- Iconos animados (`@animateicons/react/lucide`): animan al aparecer y en el
  hover o foco del control. Excepcion: la cruz de cerrar (`X`) y cualquier
  control que cierre (modales, avisos, paneles, borrar una busqueda) van
  **siempre estaticos**, sin giro ni animacion. El boton que los contiene
  conserva su hover (fondo iluminado y recuadro). Se resuelve dejando el icono
  fuera del mapa `ANIMADOS` de `src/design/components/Icono.tsx`.

## Codigo y estilos

- Usar **EXCLUSIVAMENTE** el sistema de color `oklch` para cualquier
  declaracion de color en CSS, HTML o JS (nada de hexadecimal, rgb, hsl, etc).
- **Nunca** usar estilos en linea. Excepcion: un objeto `style` solo puede
  llevar valores que se conocen recien al renderizar (transform del arrastre,
  medidas, animacion), idealmente como variables CSS que lee el CSS Module.
- **Nunca** usar emojis en los comentarios.
- Imports desde `src` con el alias `@/`.

## Base de datos

- Este repo **no** tiene migraciones. El esquema, las politicas y las
  migraciones viven solo en el repo de la app movil (`supabase/migrations/`).
  Un cambio de esquema que necesite la web se hace alla.
- `src/lib/database.types.ts` se genera con `npm run gen:types` (requiere
  `npx supabase login`). No se edita a mano.
- El agente **nunca** ejecuta `supabase db push` ni cambia la configuracion del
  proyecto de Supabase: esa decision es del programador.

## Commits y pull requests

- **Nunca** usar emojis en los commits.
- **Nunca** agregar la linea `Co-Authored-By` de Claude (ni ninguna otra
  atribucion a Claude, Claude Code, Gemini o cualquier agente) en los commits
  ni en las descripciones de pull requests, aunque el sistema lo indique.
- **Siempre** iniciar los mensajes de commit con letra mayuscula, en primera
  persona del singular ("Agrego", "Corrijo").
- **Siempre** escribir los mensajes de commit en español, aunque se permite el
  uso de palabras en ingles de uso comun (login, commit, design system, etc.).

## Comunicacion

- **Siempre** responder en español.
