# Copia del design system

Copia completa del design system **Frencia 2.0 (Lume)** de Claude Design
(https://claude.ai/artifact/UUp4wXWL7CrPVELCR42nEX), tomada el 26 de octubre de 2026 (version con `Web - 9 Errores` y Editar perfil en una sola columna con campos de texto).
Es todo lo que el artifact guarda en `project/`, con la misma estructura de carpetas;
lo unico que queda afuera es el visor propio del tipo de artifact (`artifact-type/`,
`index.html` y su `SKILL.md`), que no es parte del diseño.
La fuente de verdad sigue siendo Claude Design: esta carpeta es un respaldo para
consultar sin conexion y para ver que cambio entre una copia y la siguiente.

**No se edita a mano** y la app no la importa. Lo que usa el codigo vive en `src/design/`:

| Aca | En el codigo |
|---|---|
| `ui_kits/web_desktop/tokens.web.css` | `src/design/tokens/tokens.css` (misma copia, solo cambia la ruta de las fuentes) |
| `fonts/*.woff2` | `src/design/fuentes/` |
| `ui_kits/web_desktop/img/grabado-*.webp` | `src/assets/` |
| `ui_kits/web_desktop/img/storyset-gym.svg` | `src/assets/` (creditos y licencia en `img/CREDITOS.md`) |
| `ui_kits/web_desktop/web.css` (bloques `.w-*`) | un CSS Module por componente en `src/design/components/` |

Que hay:

- `README.md`, `cambios.md`, `direcciones.md`, `github.md`: el libro de marca y sus notas.
- `design-system.json`: el indice del artifact (titulo, namespace, ultima modificacion).
- `tokens.json`, `tokens.css`: los tokens del sistema (hex, para la app movil).
- `ui_kits/web_desktop/`: el kit de escritorio. Su `README.md` documenta rutas, fondos,
  estados, el constructor y los iconos.
- `ui_kits/ios_app/`: el kit de la app movil, con sus pantallas y las letras de la marca (`marca/`).
- `components/`: cada componente con su guia, tipos y `preview.html`; `bundle.js`,
  `bundle.css`, `index.d.ts` y las fuentes en `components/src/`.
- `entrega/`: lo que se preparo para la app movil (fondos y fuentes estaticas).
- `assets/Brand/`: icono, marca y wordmark; `assets/notes/`: notas de la migracion.
- `fonts/`, `styles.css`, `support.js`, `templates/`: lo que cargan las paginas del kit.
- `archived/`: el sistema anterior (Instrumento de precision) y sus exploraciones.

Las paginas del kit (`*.html`) se abren con un servidor estatico desde esta carpeta,
porque cargan `styles.css` y `components/bundle.js` por ruta relativa.

Para actualizarla, se vuelve a bajar del artifact y se reemplaza la carpeta entera.
