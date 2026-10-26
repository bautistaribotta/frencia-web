# Cambios respecto del sistema anterior

Qué cambió en el rediseño y cómo llevarlo al código (`src/design/`).

## Tokens que cambiaron de nombre

| Antes | Ahora | Nota |
|---|---|---|
| `ink-*` | `graphite-*` | Neutros del tema oscuro, ahora grafito frío. |
| `stone-*` | `ivory-*` | Neutros del tema claro, ahora marfil cálido. |
| `green-*` | `steel-*` | El verde ya no existe; el acero es la señal. |
| `green-deep` | `steel-900` | Fondo del avatar sin foto. |
| `orange-*` | `amber-*` | La intensidad pasa de naranja a ámbar. |
| `accent-text` | `signal-text` | El texto de color es acero, no tinta. |
| `surface-green-soft` / `-line` | `surface-signal-soft` / `-line` | |
| `surface-orange-soft` / `-line` | `surface-intensity-soft` / `-line` | |
| `glow-green`, `glow-orange` | `halo-accent`, `halo-intensity` | Anillos de 1 px; los brillos se retiraron. |
| `glow-green-soft` | (eliminado) | |

Nuevos: `signal`, `signal-press`, `text-on-signal`, `text-on-intensity`, `focus-ring`,
`data-tick`, `hairline` y la familia `width` (`wdth-condensed`, `wdth-semi`, `wdth-normal`).

**Cambió el significado de `accent`.** Antes era el verde; ahora es **tinta** (marfil en
oscuro, casi negro en claro). Todo lo que era "verde = seleccionado / hecho" queda en tinta;
todo lo que era "verde = en curso / en foco" pasa a `signal`.

## Tipografía

Anton, Archivo y JetBrains Mono se reemplazan por **Instrument Sans** (un solo archivo
variable con ancho 75–100 y peso 400–700) y **DM Mono** solo para sellos. No hay más
titulares en mayúsculas. En React Native: Instrument Sans se carga como fuente variable o
en instancias estáticas (ancho 78 para números, 88 para rótulos, 100 para el resto).

## Componentes

- Las APIs no cambian. Los tonos nuevos son `signal` / `intensity` (y `accent-solid` / `intensity-solid` en `Badge`); `green` y `orange` siguen aceptados como alias.
- `ProgressBar` pasa a tinta por defecto (`tone="accent"`).
- `Button` suma al bundle las variantes `soft` y `danger`, que antes solo dibujaban las pantallas.
- `RestRing` pasa de anillo grueso a esfera de 60 marcas con arco de acero.
- `SetRow`: hecha = círculo de tinta; numeración `01`, `02`.

## Wizards (UX)

Los pasos y los datos que piden son los mismos; cambia el marco y algunos controles.

- Marco común en los tres: contador `01 / 04` y escala arriba, pregunta a altura fija, una sola acción ancha abajo.
- **Setup:** Saltar sube a la barra; sexo con filas de radio; altura y peso con regla en lugar de ruedas.
- **Crear rutina:** nombre en campo de línea con sugerencias; días con selector 1–7 en lugar de stepper; ejercicios del día numerados.
- **Sesión:** Anterior pasa a botón de icono; la acción ancha dice qué hace (Registrar serie, Saltar descanso, Siguiente serie, Terminar); el descanso muestra lo que viene; el menú del ejercicio es una lista.
- El diálogo de rutina activa ya no pinta Cancelar como destructivo.

## Voz

El brand book anterior pedía tuteo, pero las pantallas ya usaban voseo. El sistema
adopta el voseo en todo, y se corrigieron los textos que estaban en tú.
