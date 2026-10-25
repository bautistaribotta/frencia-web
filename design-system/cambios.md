# Cambios: de Instrumento a Lume

Qué cambió al pasar del sistema *Instrumento de precisión* a **Lume** y cómo llevarlo al
código. Si la app todavía está en el sistema original (el del verde `#22C55E`), primero
aplicá los renombres de `archived/instrumento/cambios.md` y después estos.

## La idea en una línea

Antes: superficies opacas separadas por hairlines, tinta para la acción, acero como señal y
ámbar para el esfuerzo. Ahora: **vidrio sobre un fondo de luces fijas**, un solo color
(**lume**) para la acción y lo en curso, y el esfuerzo **en tinta**.

## Tokens semánticos: mismo nombre, otro valor

Ningún token semántico cambió de nombre. Los componentes que ya usan `accent`, `signal`,
`intensity`, `surface-*` y `text-*` toman Lume sin tocarse.

| Token | Instrumento (oscuro / claro) | Lume (oscuro / claro) |
|---|---|---|
| `accent` | marfil / tinta | **lume-500** / tinta |
| `signal`, `signal-text` | acero 400 / acero 600–700 | **lume-500** / **lume-800** oliva |
| `intensity`, `intensity-text` | ámbar 500 / ámbar 600–700 | **tinta** (graphite-100 / ivory-900) |
| `surface-card` | graphite-800 / ivory-0, opacos | **rgba(20,22,18,.42)** ahumado / **rgba(255,255,255,.55)** |
| `surface-card-elevated` | graphite-750 / ivory-0 | rgba(38,40,36,.55) / rgba(255,255,255,.78) |
| `surface-raised` | graphite-850 / ivory-50 | rgba(16,17,19,.82) / rgba(248,249,242,.86) |
| `bg-app` | graphite-900 / ivory-100 | #08090A / #EEF0E6 (con el Fondo encima) |
| `focus-ring` | acero | lume / oliva |
| `halo-accent` | anillo de 1 px | resplandor difuso del botón principal |

## Primitivos

**Eliminados:** `amber-300…700`, `steel-400`, `steel-600`, `steel-700`, `graphite-200`,
`graphite-600`, `graphite-750`, `graphite-800`, `ivory-300`. Si algún archivo los usa
directo (no a través de un semántico), pasalo al semántico que corresponda.

**Nuevos:**
- `lume-300 … lume-900` — el color. 500 es el lume puro; 800 el oliva del tema claro.
- `forest-600` — la luz ambiente del oscuro.
- `glow-a`, `glow-b`, `glow-c` — las tres luces del Fondo.
- `velo-top`, `velo-bottom` — los velos de arriba y abajo.
- `glass-line`, `glass-highlight` — el borde y el brillo del vidrio.
- `shadow-glass`, `halo-signal` — el brillo interior del vidrio y el de lo en curso.
- `blur-glass` 22, `blur-sheet` 30, `blur-glow` 46 — desenfoques.
- `surface-card-opaco`, `surface-card-elevated-opaco`, `surface-raised-opaco` — el vidrio cuando el sistema pide Reducir transparencia.

**Radios más grandes:** sm 6→8, md 10→14, lg 14→18, xl 16→22, 2xl 22→28, y nuevo 3xl 36.
**Márgenes de pantalla:** 24 → 20 px.

## Componentes nuevos

- **`Fondo`** — las luces detrás de cada pantalla. Posición fija por ruta (`cumbre`, `centro`, `flanco`, `base`, `velada`), `intensidad` pleno o suave, `animado` solo en el onboarding.
- **`Vidrio`** — el panel translúcido base, en tres niveles.

## Componentes que cambiaron

- `Button`: primary con resplandor (`halo-accent`) y radio lg; secondary pasa a vidrio.
- `Card`, `SetRow`, `IsoTimer`, `RestRing`, `SerieComparativa`, `MetricPill`, `Tag`, `SegmentedControl`, `IconButton surface`: vidrio.
- `TabBar`: `surface-raised` con `blur-sheet`; el icono activo y su marca, en lume.
- `Avatar` sin foto: tinta sobre vidrio (antes, acero). El avatar generativo: cara en `bg-app` sobre `accent`.
- `Badge intensity`, `IsoTimer` (barra y Frenar): tinta. La llama se mantiene como icono del esfuerzo.
- Escala de avance: marcas de 3 px; hechas en `text-primary` (antes `accent`), la actual en `signal` con `halo-signal`.

## Pantallas

Cada pantalla monta su `Fondo` con la posición de la tabla en `entrega/implementacion.md`.
Los fundidos de los bordes del scroll pasan de degradados al color de fondo a máscaras.
En la home, solo el próximo día lleva Empezar en lume; los demás, en vidrio.

## Cómo pasarlo a Expo Go

Todo lo específico de React Native (expo-blur, react-native-svg, Reanimated, fuentes
estáticas) está en `entrega/implementacion.md`.
