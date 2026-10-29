> **Frencia** es una app de iOS para registrar entrenamientos. Traés la rutina que ya
> tenés en papel y Frencia la convierte en un registro vivo. **No genera rutinas**:
> registra series, sigue la progresión y hace las cuentas que usan los atletas:
> **RIR, RPE, AMRAP, 1RM estimado, tonelaje**.
>
> Lema: **"Cada serie cuenta."**

El sistema se llama **Lume**. Cada pantalla flota sobre un **fondo de luces** (grafito o
marfil con tres luces difusas) y su contenido va en **vidrio**: superficies translúcidas
con un borde de luz. Hay **un solo color**, el lume, un verde lima, para la acción y para
lo que está pasando ahora. El esfuerzo no tiene color: va en tinta. Se usa en los 30
segundos entre series, con una mano y poca luz, así que todo se lee de un vistazo y nada
compite.

Dos temas, mismo peso: **Lume oscuro** (grafito, lume puro) y **Lume claro** (marfil,
tinta y oliva).

El nombre del producto es **Frencia**. El sistema anterior, *Instrumento de precisión*,
está guardado completo en `archived/instrumento/`.

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
- Faltante: **"Falta cargar el RIR."** (con icono `circle-alert`, en tinta)

**No.** Sin signos de exclamación en serie, sin emoji en la interfaz, sin frases de póster
motivacional en textos funcionales, sin datos inventados. La app registra lo que pasó.

---

## Fundamentos visuales

### Color

Cuatro roles. Los mismos nombres resuelven distinto en cada tema; **ningún componente
elige un color por tema**.

| Rol | Token | Lume oscuro | Lume claro | Para qué |
|---|---|---|---|---|
| Acción | `accent` | `lume-500` #C9E25F | `ivory-900` tinta | El botón principal y lo elegido. |
| En curso | `signal` / `signal-text` | `lume-500` | `lume-800` oliva #4F6A0A | Lo que está en curso, en foco o corriendo. |
| Esfuerzo | `intensity` / `intensity-text` | `graphite-100` tinta | `ivory-900` tinta | RIR, RPE, PR, el cronómetro isométrico. Sin color. |
| Peligro | `danger` / `danger-text` | `crimson-500` / `crimson-400` | `crimson-600` / `crimson-700` | Eliminar, descartar, cuenta en riesgo. |

- **Un solo color.** En oscuro, acción y en curso comparten el lume. En claro, el lume puro no sostiene contraste sobre marfil: la acción pasa a tinta y lo en curso a oliva (`lume-800`, ≥ 5:1).
- **El esfuerzo es tinta.** Los valores de RIR/RPE y PR van en `intensity-text`, en semibold y con la llama (`flame`). Se distinguen por peso y por el icono, no por color. Un solo relleno de tinta de esfuerzo por pantalla como mucho (Frenar, Nuevo PR).
- **Lo hecho es tinta.** Pasos cumplidos de la escala, series hechas y días de la semana en la home van en `text-primary`. Lo que ya pasó no está en curso.
- **El lume se racionaliza.** Si dos cosas están en lume y ninguna es la acción, una de las dos no está en curso. En una lista de tarjetas con la misma acción, solo la próxima lleva el botón en lume; las demás, en vidrio.
- **Carmín solo para lo destructivo.** `danger` delineado en botones; relleno únicamente detrás de una fila deslizada.
- No hay verde de éxito: `success` es un alias de `signal` y siempre va con check.

**Texto.** `text-primary`, `text-secondary`, `text-tertiary` y `text-disabled` (solo para lo
que no se lee). En claro todo pasa contraste en cualquier posición del fondo. En oscuro,
ver la regla de lectura más abajo.

### El fondo de luces

Cada pantalla tiene detrás un `Fondo`: la base `bg-app` y tres luces radiales.

| Luz | Token | Oscuro | Claro |
|---|---|---|---|
| A, la principal | `glow-a` | lume | lume pálido (`lume-300`) |
| B, el ambiente | `glow-b` | bosque (`forest-600`) | blanco |
| C, el contrapunto | `glow-c` | acero tenue | acero tenue |

Encima, dos velos (`velo-top`, `velo-bottom`) oscurecen o aclaran los bordes donde viven la
barra de estado y el pie, y un grano fino evita bandas en el degradado. El acero solo
aparece acá, como luz débil: no es un color de interfaz.

**Las luces no se mueven.** Cada pantalla elige una de cinco posiciones fijas según dónde
está su contenido, para que el texto chico nunca caiga en la zona clara:

| Posición | Dónde cae la luz | Para |
|---|---|---|
| `cumbre` | arriba a la derecha | pestañas, listas y formularios que arrancan bajo el título |
| `centro` | detrás del centro | un control protagonista en vidrio: rueda, regla, esfera del descanso, ticket |
| `flanco` | borde derecho, a media altura | formularios alineados a la izquierda: acceso, nombre de la rutina |
| `base` | sube desde abajo a la izquierda | contenido arriba y la acción abajo |
| `velada` | solo en los bordes: abajo a la derecha y arriba a la izquierda | pantallas densas en datos: la serie, el historial, el catálogo |

Todas las pantallas usan las luces a intensidad plena; `intensidad="suave"` queda para
casos puntuales. La tabla de cada ruta de la app está en `entrega/implementacion.md`.

**Regla de lectura (oscuro).** Detrás de texto chico la luz no pasa del 15 %; detrás de
números grandes y del botón principal, hasta 30 %. Si una pantalla nueva no cumple, se
cambia la posición del fondo, no el texto.

**Movimiento del fondo.** Solo en el **onboarding** (acceso, textos legales y setup del
perfil) las luces derivan despacio (20–31 s por ciclo) y, entre pasos, se desplazan de una
posición a la siguiente. En el resto de la app son fijas; dentro de un wizard, el cambio de
posición entre pasos es un fundido cruzado de 420 ms.

### Accesibilidad del fondo

Las luces detrás del texto son el riesgo de este sistema, así que se midieron: en las
ocho páginas de pantallas, en los dos temas, cada texto contra el píxel real que tiene
detrás (el fondo renderizado sin el texto, tomando el 10 % más desfavorable de cada
renglón). Resultado: **3.354 mediciones, todo el texto visible ≥ 4.5:1** (≥ 3:1 en texto grande). Para
llegar ahí hicieron falta tres reglas que ahora son parte del sistema:

1. **El vidrio oscuro es ahumado, no blanco.** En oscuro, `surface-card` oscurece la luz que tiene detrás (`rgba(20,22,18,.42)`) en lugar de aclararla. Es como los materiales oscuros de iOS. Con vidrio blanco, el texto terciario caía a 2.6:1 sobre la luz de bosque.
2. **El texto chico sin tarjeta no va sobre la luz.** Rótulos y párrafos que están directo sobre el fondo eligen una posición que los deje en la zona oscura (por eso las pantallas de estado de cuenta, conflicto y día vacío usan `cumbre` y no `centro`).
3. **Las unidades al lado de un número grande van en tinta**, no en terciario: comparten la luz del número.

En claro todo pasa en cualquier posición: el texto es oscuro y la luz es clara.

**Reducir transparencia.** Si el teléfono tiene activado *Reducir transparencia*, el vidrio
pasa a superficies opacas (`surface-card-opaco`, `surface-card-elevated-opaco`,
`surface-raised-opaco`), sin desenfoque, y las luces bajan a menos de la mitad
(`--fondo-ganancia: 0.45`). En el kit se ve en *Pantallas · 3*, "Con Reducir transparencia".
**Reducir movimiento** deja quietas las luces del onboarding.

### Vidrio

Todo lo que agrupa contenido es vidrio: relleno translúcido, borde `glass-line`, brillo
interior (`shadow-glass`) y desenfoque (`blur-glass`, 22 px).

- **`surface-card`** (en oscuro, vidrio ahumado al 42 %; en claro, blanco al 55 %): tarjetas, opciones, campos, celdas.
- **`surface-card-elevated`** (ahumado claro al 55 % / blanco al 78 %): lo elegido, lo que flota, la banda de la rueda.
- **`surface-raised`** (82 % / 86 %) con `blur-sheet` (30 px): tab bar, hojas, diálogos, toasts, el ticket.
- **`surface-inset`**: pozos sin vidrio (recuadros punteados, el botón de agregar).

La barra de los wizards y la cabecera de la sesión son **píldoras de vidrio**. Los bordes
del scroll se funden con una máscara, nunca con un degradado al color de fondo.

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

- Las cifras son **siempre tabulares**: los relojes y las columnas no bailan.
- Los números grandes usan el ancho **condensado**, que conversa con las letras condensadas del icono.
- En Expo Go el eje de ancho no se puede mover: se usan las instancias estáticas de `entrega/fuentes/`.

### Espaciado y layout

Grilla de 4 / 8 px (`space-*`). Márgenes de pantalla de **20 px** (`pad-screen`); padding de
tarjeta 20 px (`pad-card`). Área táctil mínima 44 px (`hit-min`), siempre. Botones de pie y
de wizard a 54 px (`control-h-lg`). La acción principal vive siempre abajo, en la zona del
pulgar; lo secundario sube.

### Radios

Más redondos que antes, porque el vidrio lo pide: `radius-sm` 8 px en badges y casillas;
`radius-md` 14 px en celdas y controles chicos; `radius-lg` 18 px en botones, campos y
filas; `radius-xl` 22 px en tarjetas y listas; `radius-2xl` 28 px en diálogos;
`radius-3xl` 36 px en hojas. Píldoras para chips, la barra del wizard y el switch.

### Sombras y resplandor

- **`shadow-glass`**: el brillo interior de 1 px arriba que hace que el vidrio se lea como vidrio. Lo llevan todas las superficies translúcidas.
- **`halo-accent`**: el resplandor del botón principal. Lume difuso en oscuro, sombra de tinta en claro.
- **`halo-signal`**: el brillo de lo en curso (marca actual de la escala, aguja de la regla, arco del descanso, celda en foco).
- `shadow-lg` en diálogos y toasts, `shadow-sheet` en hojas.
- **Foco de teclado**: anillo sólido de 2 px en `focus-ring` (lume / oliva).

### Movimiento

Rápido y sin rebote: `ease-out` sobre `dur-base` 180 ms; presionar achica a
`press-scale` 0.985. Fuera del onboarding, la esfera del descanso es la única animación
continua. Se respeta `prefers-reduced-motion` (y en la app, "Reducir movimiento"): las
luces del onboarding quedan quietas.

### Estados de interacción

- **Hover / presionado:** el relleno sube un paso (`accent-hover`, `accent-press`); el vidrio pasa a `surface-card-elevated`.
- **Seleccionado:** relleno de `accent` (chips, días, cantidad de días) o vidrio elevado con borde `accent` (opciones).
- **En foco / en curso:** borde `signal` con anillo de 1 px y `halo-signal`.
- **Deshabilitado:** el relleno pasa a `surface-chip`, sin resplandor, y el texto a `text-disabled`; no se baja la opacidad.

---

## Las lecturas: motivos propios

- **La escala.** El avance de un wizard o de una sesión es una fila de marcas de 3 px: hechas en tinta, la actual en lume con su brillo, las que faltan en `data-track`. En la sesión, un corte separa ejercicio de ejercicio.
- **La esfera.** El descanso es un disco de vidrio con 60 marcas (mayores cada 5), un arco de lume que se vacía y el reloj condensado al centro (`RestRing`, `Aro`). Va sobre el fondo `centro`.
- **La regla.** Altura y peso se eligen con una lectura grande y una regla en vidrio con aguja de lume. La de la altura es recta; la del peso es un arco muy abierto, más ancho que la pantalla (los extremos salen por los costados), como el visor de una balanza: la banda gira debajo de la aguja fija.
- **El ticket.** La sesión terminada se entrega como un pase: vidrio denso, muescas laterales, perforación punteada, sellos en DM Mono, el punto de la marca en lume y el código de barras que sale del id de la sesión. Va sobre el fondo `centro`, con la luz rodeándolo.

---

## Wizards: el marco de un paso

Los tres wizards de la app (setup del perfil, crear rutina y la sesión) comparten un
mismo marco. Se diseñó para que el pulgar aprenda una sola vez dónde está cada cosa.

1. **Barra** en una píldora de vidrio: volver a la izquierda (`Salir` en el primer paso, `Atrás` después) · contador `01 / 04` al centro · acción secundaria a la derecha (`Saltar` en el setup).
2. **Escala** de avance debajo de la barra.
3. **Enunciado** que arranca siempre a la misma altura: rótulo (`Tu perfil · Edad`), pregunta en `text-display` y una línea de ayuda. Nunca centrado en vertical.
4. **Control** del paso, en vidrio: una sola cosa por pantalla.
5. **Pie** con una única acción ancha (`Continuar`, `Siguiente`, `Finalizar`). En la sesión, `Anterior` se reduce a un botón de icono a la izquierda.

**Cada paso declara su fondo.** El contenido del paso no se mueve; si un control cae sobre
la parte clara, se mueve la luz:

- **Setup** (anima): sexo `cumbre`; edad, altura y peso `centro`, porque la rueda y la regla son el protagonista y van en vidrio sobre la luz.
- **Crear rutina:** nombre `base` (la luz sube por abajo, lejos del contador de caracteres); cantidad de días `cumbre`; cada día `cumbre`.
- **Sesión:** la serie `velada` (la luz entra por abajo, detrás del botón); el descanso `centro` (la esfera); el ticket `centro`.

Reglas de cada flujo:
- **Setup.** Sexo con tres filas con radio; edad en rueda con la banda elegida en vidrio; altura y peso con regla. `Saltar` arriba a la derecha, lejos de `Continuar`.
- **Crear rutina.** El nombre se escribe grande sobre una línea, con sugerencias que desaparecen apenas hay texto. La cantidad de días se elige con siete números (un toque). Cada día: nombre, días de la semana y ejercicios numerados; `Agregar ejercicio` va en un recuadro punteado.
- **Sesión.** Rutina / Última / Hoy en una tabla; lo de hoy se escribe en celdas de vidrio y la celda en foco toma el lume. `Saltar serie` va en el título de la serie. Lo que falta se avisa en tinta con icono. El menú del ejercicio es una lista de acciones.

---

## Iconografía

**Lucide** (https://lucide.dev), trazo **1.75** en todos los tamaños, `currentColor`.

- Tamaños: 16 (en línea), 18–20 (controles y pestañas), 24 (navegación).
- Color heredado del texto. Lume solo si el icono es lo que corre (cronómetro activo) o la pestaña activa. La llama del esfuerzo, en tinta. Carmín solo junto a una acción destructiva.
- Nunca relleno, nunca emoji en la interfaz. Glifos permitidos en texto: `×` (peso × reps), `↑ ↓` (deltas), `·` (separador).
- En las páginas del kit se cargan desde la CDN fijada a una versión (`lucide@0.469.0`). En la app: `lucide-react-native`.

---

## Marca

- **El icono de la app no cambia.** `assets/Brand/app-icon-light.png` y `app-icon-dark.png`: FREN / CIA con el punto. En el acceso (login y registro) no va el icono: va solo el nombre `FRENCIA.` con esas mismas letras, centrado arriba, en blanco en el tema oscuro y en negro en el claro (`ui_kits/ios_app/marca/`).
- **Wordmark** `FRENCIA.` en Instrument Sans condensada y negrita: `frencia-wordmark.svg` (marfil sobre grafito) y `frencia-wordmark-light.svg` (tinta sobre marfil). Una sola tinta, nunca en lume, sin degradados.
- **Marca** `F.` en un cuadrado de grafito: `frencia-mark.svg`, para avatar de redes.
- **Favicon de la web** (`assets/Brand/favicon/`, copiado a `public/` del repo web): el icono de
  la app en su versión clara (FREN / CIA con el punto, tinta sobre marfil) con las esquinas
  redondeadas y un borde negro de cerca de 1 px. Es uno solo, no cambia con el tema: la
  pestaña la pinta el navegador, y el blanco se distingue sobre pestañas oscuras y el borde
  sobre las claras. `favicon.ico` (16, 32 y 48), `favicon-16.png`, `favicon-32.png` y
  `apple-touch-icon.png` (180, el icono sin borde: el celular redondea solo). Se regeneran
  desde `app-icon-light.png` del repo de la app.
- En texto corrido el nombre se escribe "Frencia", nunca en mayúsculas.

**Imágenes.** Si aparece fotografía, es en blanco y negro o desaturada, con grano, nunca
foto de stock de gimnasio brillante. Para fotos reales se dejan marcadores; no se generan.

---

## Dónde está cada cosa

- `tokens.json` — colores de los dos temas (incluidas las luces y el vidrio), tipografía y fuentes, espaciado, radios, sombras, desenfoques (`blur-*`) y tamaños. `tokens.css` lo genera la página.
- `fonts/` — Instrument Sans (variable, ancho y peso) y DM Mono 400 / 500.
- `components/bundle.css` — los roles de texto `--text-*`, los anchos `--vs-*`, los filtros de vidrio (`--glass-filter`, `--sheet-filter`), el movimiento, la clase `.frencia-escenario` (un fondo estático para documentación) y los estilos base.
- `components/bundle.js` — los componentes en `window.FrenciaDesignSystem_377129`, incluidos **`Fondo`** y **`Vidrio`**; tipos en `components/index.d.ts`, fuentes en `components/src/`.
- `components/<Componente>/` — `README.md` con la guía, `<Componente>.d.ts` y `preview.html`.
- Páginas de guía: `Paleta`, `Fondo` (las cinco posiciones), `Vidrio`, `TipografiaClaroOscuro`, `ComponentesClaroOscuro`, `Iconografia`, `Wordmark`, `AppIcon`, `TiposDeEjercicio`, el kit (`Kit*`) y las pantallas (`Pantallas1Acceso` a `Pantallas8Perfil`, cada una con su fondo anotado).
- `ui_kits/ios_app/` — el kit iOS; `pantallas-base.jsx` trae las piezas compartidas y la tabla `FONDOS` (ruta → posición), `pantallas.css` sus estilos.
- `entrega/` — lo que necesita Claude Code para implementarlo en Expo Go: `implementacion.md`, `fondos.json` y las fuentes estáticas.
- `components/DireccionLujoEditorial/` y `components/DireccionAtleticoPremium/` — direcciones anotadas como alternativa (ver `direcciones.md`).
- `archived/instrumento/` — el sistema anterior completo (Instrumento de precisión), con las exploraciones que llevaron a Lume.
- `cambios.md` — qué cambió de Instrumento a Lume y cómo pasarlo al código.
