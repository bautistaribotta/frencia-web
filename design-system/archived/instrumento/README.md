> **Frencia** es una app de iOS para registrar entrenamientos. Traés la rutina que ya
> tenés en papel y Frencia la convierte en un registro vivo. **No genera rutinas**:
> registra series, sigue la progresión y hace las cuentas que usan los atletas:
> **RIR, RPE, AMRAP, 1RM estimado, tonelaje**.
>
> Lema: **"Cada serie cuenta."**

El carácter es el de un **instrumento de precisión**: un cronógrafo, una balanza de
laboratorio, una regla de acero. Grafito o marfil de fondo, tinta para lo que importa,
una sola señal de color para lo que está pasando ahora. Se usa en los 30 segundos entre
series, con una mano y poca luz, así que todo se lee de un vistazo y nada compite.

El nombre del producto es **Frencia**. El nombre de la etapa de diseño ("HEFT") está
retirado y no aparece en ningún lado.

---

## Contenido: cómo escribe Frencia

**Idioma.** La interfaz está en **español rioplatense, con voseo**: "Registrá tu serie",
"¿Cuántos años tenés?", "Entrá a tu cuenta". Las abreviaturas de entrenamiento quedan en
su forma universal: **RIR, RPE, AMRAP, PR, 1RM**.

**Voz.** Un entrenador que está al lado, no una tribuna. Frases cortas, en presente,
afirmativas. El sistema habla en tercera persona discreta, nunca en "yo".

**Mayúsculas.**
- **Rótulos de datos** en mayúsculas con tracking ancho (`text-label`): `VOLUMEN`, `RIR MEDIO`, `SERIES`.
- **Títulos y preguntas** en oración, nunca en mayúsculas: "Sesión de hoy", "¿Cuántos días tiene?".
- **Botones** con verbo en oración: "Empezar", "Registrar serie", "Finalizar rutina".
- **No hay titulares en mayúsculas.** Ni en estados vacíos ni en el cierre de la sesión: "Sesión completa", no "SESIÓN COMPLETA".

**Los números mandan.** Cuando un número es el mensaje, es lo más grande de la pantalla:
`82.5 kg`, `1:24`, `RIR 2`. La unidad va más chica y en `text-tertiary`, después del valor.
Punto decimal (82.5); los campos aceptan coma o punto.

**Ejemplos de tono**
- Acción: **"Empezar entrenamiento"** · **"Registrar serie"** · **"Saltar descanso"**
- Aliento (con mesura): **"Una más que la última vez."**
- Vacío: **"Todavía no tenés rutinas. Cargá la que ya usás y registrá cada serie a tu manera."**
- Esfuerzo: **"¿Cuántas te quedaron en el tanque?"** (captura de RIR)
- Faltante: **"Falta cargar el RIR."** (con icono `circle-alert`, en `intensity-text`)

**No.** Sin signos de exclamación en serie, sin emoji en la interfaz, sin frases de póster
motivacional en textos funcionales, sin datos inventados. La app registra lo que pasó.

---

## Fundamentos visuales

### Color

Cuatro roles y nada más. Los mismos nombres resuelven distinto en cada tema; **ningún
componente elige un color por tema**.

| Rol | Token | Oscuro | Claro | Para qué |
|---|---|---|---|---|
| Tinta | `accent` | `graphite-100` marfil | `ivory-900` casi negro | La acción principal, lo seleccionado y lo hecho. |
| Señal | `signal` / `signal-text` | `steel-400` | `steel-600` / `steel-700` | Lo que está en curso, en foco o corriendo. Uno por pantalla. |
| Intensidad | `intensity` / `intensity-text` | `amber-500` / `amber-400` | `amber-600` / `amber-700` | Esfuerzo: RIR, RPE, PR, el cronómetro isométrico. |
| Peligro | `danger` / `danger-text` | `crimson-500` / `crimson-400` | `crimson-600` / `crimson-700` | Eliminar, descartar, cuenta en riesgo. |

- **La acción principal es tinta, no color.** El botón primario es `accent` con `text-on-accent`: marfil sobre grafito en oscuro, casi negro sobre marfil en claro. Así se ve caro: por contraste, no por saturación.
- **Una señal por pantalla.** `signal` marca la celda en foco, el paso actual de la escala, el arco del descanso, el campo enfocado. Si dos cosas están en acero, una de las dos no está en curso.
- **Lo hecho es tinta.** Series hechas, días marcados, pasos cumplidos y casillas tildadas van en `accent`. No hay verde de éxito; `success` es un alias de `signal` y siempre va con check.
- **El ámbar es esfuerzo, no alarma.** `intensity-text` para valores de RIR/RPE y PR. Los avisos de algo que falta lo usan, pero siempre con icono. Un solo relleno ámbar por pantalla como mucho (Frenar, Nuevo PR).
- **Carmín solo para lo destructivo.** `danger` delineado en botones; relleno únicamente detrás de una fila deslizada.
- Acero y ámbar se distinguen también por luz (azul profundo contra ámbar claro), no solo por tono.

**Superficies.** Se separan por un paso de luz y un hairline, no por sombra.
- Oscuro (grafito, frío apenas): `bg-app` `graphite-900`, `surface-card` `graphite-800`, `surface-card-elevated` `graphite-750`, `surface-raised` `graphite-850` (hojas), `surface-inset` `graphite-950` (pozos).
- Claro (marfil, papel cálido): `bg-app` `ivory-100`, `surface-card` `ivory-0`, `surface-inset` `ivory-200`, `surface-chip` `ivory-300`.
- Texto: `text-primary` (16:1), `text-secondary` (8:1), `text-tertiary` (≥ 4.5:1 sobre `bg-app`, `surface-card` y `surface-card-elevated`), `text-disabled` solo para lo que no se lee.

### Tipografía

Una familia, **Instrument Sans**, en tres anchos (eje `wdth`), más **DM Mono** solo para sellos.
Las fuentes viven en `fonts/` y se cargan desde `tokens.json`.

| Rol | Estilo | Uso |
|---|---|---|
| `text-hero` | 500 · 72 px · ancho 78 (`--vs-condensed`) · tabular | El número que es el mensaje: peso, reloj, marca. |
| `text-display` | 500 · 34 / 1.08 · −0.028em | La pregunta de cada paso de los wizards y el cierre de la sesión. |
| `text-title` | 600 · 26 / 1.15 | Título de pantalla. |
| `text-subtitle` | 600 · 19 / 1.25 | Nombres de día, rutina y ejercicio. |
| `text-body` / `text-body-sm` | 400 · 16 / 1.5 y 14 / 1.45 | Cuerpo y texto de apoyo. |
| `text-data` | 500 · 15 · tabular | Valores en línea: `82.5 kg × 8`. |
| `text-label` | 600 · 11 · ancho 88 · 0.08em · mayúsculas | Rótulos de datos. |
| `text-meta` | DM Mono 400 · 11 | Sellos técnicos: fechas, horas, códigos del ticket. Único uso de la mono. |

- Las cifras son **siempre tabulares** (el `body` ya trae `tabular-nums`): los relojes y las columnas no bailan.
- Los números grandes usan el ancho **condensado** (`font-variation-settings: var(--vs-condensed)`), que conversa con las letras condensadas del icono.
- Interletra negativa en lo grande (`ls-display`), cero en el cuerpo, ancha solo en rótulos (`ls-wider`).

### Espaciado y layout

Grilla de 4 / 8 px (`space-*`). Márgenes de pantalla de **24 px** (`pad-screen`); padding de
tarjeta 20 px (`pad-card`). Área táctil mínima 44 px (`hit-min`), siempre. Botones de pie y
de wizard a 54 px (`control-h-lg`). La acción principal vive siempre abajo, en la zona del
pulgar; lo secundario sube.

### Radios

Precisos, no blandos: `radius-md` 10 px en botones, campos y celdas; `radius-lg` 14 px en
filas; `radius-xl` 16 px en tarjetas y listas; `radius-2xl` 22 px en hojas y el ticket;
`radius-sm` 6 px en badges, chips y casillas. Las píldoras quedan para el switch.

### Bordes, sombras y profundidad

- **Hairlines de 1 px** en todo: `border-subtle` entre superficies hermanas, `divider` dentro de listas, `border-default` en controles sin relleno, `border-strong` (3:1) en casillas y radios vacíos.
- **Sin brillos.** No hay glow ni halos de color. `halo-accent` es un anillo de 1 px en hover y nada más.
- Sombra real solo para lo que flota: `shadow-lg` en diálogos y toasts, `shadow-sheet` en hojas. En claro las sombras se tiñen con la tinta del tema.
- **Foco de teclado**: anillo sólido de 2 px en `focus-ring` (acero), ≥ 3:1 sobre toda superficie.

### Movimiento

Rápido y sin rebote: `ease-out` sobre `dur-base` 180 ms; presionar achica a
`press-scale` 0.985. La esfera del descanso es la única animación continua. Se respeta
`prefers-reduced-motion`.

### Estados de interacción

- **Hover:** el relleno sube un paso de luz (`accent-hover`); los controles sin relleno ganan `surface-chip`.
- **Presionado:** escala 0.985 y `accent-press`.
- **Seleccionado:** relleno de tinta (`Tag`, días, opción) o superficie elevada con hairline (`SegmentedControl`).
- **En foco / en curso:** borde y anillo de 1 px en `signal`.
- **Deshabilitado:** el relleno pasa a `surface-chip` y el texto a `text-disabled`; no se baja la opacidad.

---

## Las lecturas: motivos propios

Frencia se reconoce por cuatro formas de mostrar un dato, todas sacadas de instrumentos:

- **La escala.** El avance de un wizard o de una sesión es una fila de marcas de 2 px: hechas en tinta, la actual en acero, las que faltan en `data-track`. En la sesión, un corte separa ejercicio de ejercicio.
- **La esfera.** El descanso es un dial de 60 marcas (mayores cada 5) con un arco de acero que se vacía y el reloj condensado al centro (`RestRing`, `Aro`).
- **La regla.** Altura y peso se eligen con una lectura grande y una regla horizontal con aguja de acero.
- **El ticket.** La sesión terminada se entrega como un pase: papel `surface-card-elevated`, muescas laterales, perforación punteada, sellos en DM Mono y el código de barras que sale del id de la sesión.

---

## Wizards: el marco de un paso

Los tres wizards de la app (setup del perfil, crear rutina y la sesión) comparten un
mismo marco. Se diseñó para que el pulgar aprenda una sola vez dónde está cada cosa.

1. **Barra:** volver a la izquierda (`Salir` en el primer paso, `Atrás` después) · contador `01 / 04` al centro · acción secundaria a la derecha (`Saltar` en el setup).
2. **Escala** de avance debajo de la barra.
3. **Enunciado** que arranca siempre a la misma altura: rótulo (`Tu perfil · Edad`), pregunta en `text-display` y una línea de ayuda. Nunca centrado en vertical: la pregunta no salta de lugar entre pasos.
4. **Control** del paso: una sola cosa por pantalla.
5. **Pie** con una única acción ancha en tinta (`Continuar`, `Siguiente`, `Finalizar`). En la sesión, `Anterior` se reduce a un botón de icono a la izquierda y la acción ancha es la que avanza (`Registrar serie`, `Saltar descanso`, `Terminar`).

Reglas de cada flujo:
- **Setup.** Sexo con tres filas con radio; edad en rueda; altura y peso con regla. `Saltar` arriba a la derecha, lejos de `Continuar`.
- **Crear rutina.** El nombre se escribe grande sobre una línea, con sugerencias que desaparecen apenas hay texto. La cantidad de días se elige con siete números (un toque), y debajo se listan los días que se van a armar. Cada día: nombre, días de la semana y ejercicios numerados en orden; `Agregar ejercicio` va en un recuadro punteado porque es la acción del paso pero no la que avanza.
- **Sesión.** Rutina / Última / Hoy en una tabla de hairlines; lo de hoy se escribe en pozos grandes y la celda en foco toma el acero. `Saltar serie` va en el título de la serie y desaparece apenas se carga un dato. Lo que falta se avisa en ámbar con icono. Durante el descanso, debajo de la esfera se muestra lo que viene. El menú del ejercicio es una lista de acciones, no una pila de botones.

---

## Iconografía

**Lucide** (https://lucide.dev), trazo **1.75** en todos los tamaños, `currentColor`.

- Tamaños: 16 (en línea), 18–20 (controles y pestañas), 24 (navegación).
- Color heredado del texto. Acero solo si el icono es lo que corre (cronómetro activo); ámbar solo para el fuego del esfuerzo; carmín solo junto a una acción destructiva.
- Nunca relleno, nunca emoji en la interfaz. Glifos permitidos en texto: `×` (peso × reps), `↑ ↓` (deltas), `·` (separador).
- En las páginas del kit se cargan desde la CDN fijada a una versión (`lucide@0.469.0`) y `lucide.createIcons()` corre después de cada render.

---

## Marca

- **El icono de la app no cambia.** `assets/Brand/app-icon-light.png` y `app-icon-dark.png`: FREN / CIA con el punto. La paleta de grafito y marfil sale de él. En la app, el icono es la marca de las pantallas de acceso (`IconoApp`).
- **Wordmark** `FRENCIA.` en Instrument Sans condensada y negrita, como el icono: `frencia-wordmark.svg` (marfil sobre grafito) y `frencia-wordmark-light.svg` (tinta sobre marfil). Una sola tinta, sin degradados.
- **Marca** `F.` en un cuadrado de grafito: `frencia-mark.svg`, para avatar de redes y favicon chico.
- En texto corrido el nombre se escribe "Frencia", nunca en mayúsculas.

**Imágenes.** Si aparece fotografía (estados vacíos, ejercicios), es en blanco y negro o
desaturada, con grano, nunca foto de stock de gimnasio brillante. El dato va encima en
`text-primary` y `text-label`. Para fotos reales se dejan marcadores; no se generan.

---

## Dónde está cada cosa

- `tokens.json` — colores de los dos temas, tipografía y fuentes, espaciado, radios, sombras, tamaños, escala tipográfica y anchos de Instrument Sans. `tokens.css` lo genera la página.
- `fonts/` — Instrument Sans (variable, ancho y peso) y DM Mono 400 / 500.
- `components/bundle.css` — los roles de texto `--text-*`, los anchos `--vs-*`, el movimiento, `--drop-shadow-lg` y los estilos base (cifras tabulares, foco, selección).
- `styles.css` — entrada de las páginas del kit: importa `tokens.css` y `components/bundle.css`.
- `components/bundle.js` — los componentes en `window.FrenciaDesignSystem_377129`; tipos en `components/index.d.ts`, fuentes en `components/src/`.
- `components/<Componente>/` — `README.md` con la guía, `<Componente>.d.ts` y `preview.html`.
- Páginas de guía en `components/<Nombre>/preview.html`: `Paleta`, `TipografiaClaroOscuro`, `ComponentesClaroOscuro`, `Iconografia`, `Wordmark`, `AppIcon`, las reglas de registro (`TiposDeEjercicio`), el kit (`Kit*`) y las pantallas de la app (`Pantallas1Acceso` a `Pantallas8Perfil`).
- `components/DireccionLujoEditorial/` y `components/DireccionAtleticoPremium/` — las dos direcciones que quedaron anotadas como alternativa (ver `direcciones.md`).
- `ui_kits/ios_app/` — el kit iOS; `pantallas-base.jsx` trae las piezas compartidas (marco de paso, escala, regla, esfera, ticket) y `pantallas.css` sus estilos.
- `assets/Brand/`, `assets/Moodboard/`, `assets/Screenshots/` — imágenes, cada grupo con su `README.md`. El moodboard es el del sistema anterior: queda como historia.
- `cambios.md` — qué cambió respecto del sistema anterior y cómo pasarlo al código.
- `archived/` — hojas, tarjetas y páginas de guías anteriores, guardadas tal como estaban.
