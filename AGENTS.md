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

- La fuente de verdad del diseño es `design-system/`, en este repo: el design
  system "Frencia 2.0" (Lume), que nacio en Claude Design y ahora se mantiene
  aca. El artifact de Claude Design quedo como antecedente y ya no se
  sincroniza. **Siempre**, antes de diseñar o modificar cualquier pantalla o
  componente, revisá:
  - `design-system/ui_kits/web_desktop/README.md` (estructura, estados, reglas)
  - `design-system/ui_kits/web_desktop/web.css` y `web-base.jsx` (componentes de referencia)
  - la página del kit que corresponda (`Web - N ….html` y su `web-N.jsx`)
  - `design-system/README.md` (marca: voz, color, vidrio, fondo de luces)
- Si el codigo y el design system difieren, manda el design system; si el
  design system no cubre el caso, avisar antes de inventar.
- Un cambio de diseño se hace primero en `design-system/` (README del kit,
  `web.css`, la pagina `Web - N` y su `web-N.jsx`, tokens) y despues en el
  codigo, en el mismo commit o en uno anterior. Si se suma una pagina o una
  regla nueva, se documenta en el README que corresponda.
- Usá los tokens: viven en `src/design/tokens/` como custom properties (copia
  de `design-system/ui_kits/web_desktop/tokens.web.css`, que solo cambia la
  ruta de las fuentes). Un token nuevo o cambiado se edita en los dos archivos
  a la vez. No inventes colores,
  radios, espaciados ni tipografías: si falta algo, proponelo como token nuevo.
  Nada de colores hardcodeados en componentes: siempre `var(--token)`.
- CSS Modules + custom properties (ver "Codigo y estilos": oklch y sin estilos
  en linea).
- Cada pantalla tiene que funcionar en tema oscuro y claro, con la posición del
  fondo de luces que indica el README del kit. Los dos temas comparten las
  mismas claves; el tema sobreescribe colores, sombras y la ganancia de las
  luces del fondo.
- Iconos animados (`@animateicons/react/lucide`): animan al aparecer y en el
  hover o foco del control. Excepcion: la cruz de cerrar (`X`) y cualquier
  control que cierre (modales, avisos, paneles, borrar una busqueda) van
  **siempre estaticos**, sin giro ni animacion. El boton que los contiene
  conserva su hover (fondo iluminado y recuadro). Se resuelve dejando el icono
  fuera del mapa `ANIMADOS` de `src/design/components/Icono.tsx`.
- Los iconos dentro de un input (el icono del campo y los botones de la caja,
  como mostrar la contraseña) van **siempre quietos**: no animan al aparecer
  ni con hover o foco. La unica excepcion es el icono del campo cuando aparece
  un error (por ejemplo el candado con "Correo o contraseña incorrectos"), que
  anima una vez cada vez que se muestra. Los iconos de los botones (Ingresar,
  Crear cuenta, etc.) siguen animando. Se resuelve en `Campo`, que envuelve la
  caja con `IconosQuietos` y le pasa el error al icono como `disparo`.
- Al terminar un cambio visual, verificalo con Playwright:
  1. Levantá el proyecto y abrí la ruta.
  2. Sacá capturas a 1440×900 en oscuro y en claro (y a 390×844 si la pantalla es pública).
  3. Comparalas con la pantalla equivalente del kit y corregí las diferencias
     antes de dar el cambio por terminado.
  4. Revisá también hover, foco de teclado y estados vacío, error y carga.

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
