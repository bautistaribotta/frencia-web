# Copia del design system

Copia de referencia del design system **Frencia 2.0 (Lume)** de Claude Design
(https://claude.ai/artifact/UUp4wXWL7CrPVELCR42nEX), tomada el 26 de octubre de 2026 (version con `Web - 9 Errores`: 404, error inesperado y sin conexion con la ilustracion de Storyset).
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

- `README.md`, `cambios.md`, `direcciones.md`: el libro de marca.
- `tokens.json`, `tokens.css`: los tokens del sistema (hex, para la app movil).
- `ui_kits/web_desktop/`: el kit de escritorio. Su `README.md` documenta rutas, fondos,
  estados, el constructor y los iconos.
- `components/`: `Fondo` y `Vidrio` (guia, tipos y fuente), `bundle.css` e `index.d.ts`.
- `entrega/`: lo que se preparo para la app movil (fondos y fuentes estaticas).
- `assets/Brand/`: icono, marca y wordmark.

Para actualizarla, se vuelve a bajar del artifact y se reemplaza la carpeta entera.
