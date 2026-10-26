# Frencia Web — kit de escritorio

La versión de navegador de Frencia. No es un port de la app: es la misma marca (Lume) con
otra forma de uso, pensada para pantalla grande, mouse y teclado. **Sirve para planificar y
para revisar.** Desde la web no se inicia ni se registra una sesión de entrenamiento; eso
queda en el celular, y la interfaz lo recuerda donde haría falta un "Empezar".

Stack de destino: Vite + React 19 + TypeScript + React Router (SPA, sin SSR), CSS Modules +
custom properties, dnd-kit, Lucide (+ `@animateicons/react/lucide`), Supabase (el mismo
proyecto y el mismo modelo de datos que la app).

## Páginas del kit

Cada página muestra cada pantalla **en oscuro y en claro, lado a lado**, con su ruta y la
posición del fondo de luces debajo. El conmutador de arriba deja ver un solo tema al 100 %.

| Página | Qué tiene |
|---|---|
| `Web - 1 Estructura.html` | Navegación lateral, riel en pantallas medianas, ancho mínimo, atajos |
| `Web - 2 Componentes.html` | Todos los componentes con hover, foco, presionado, deshabilitado y carga; equivalentes de las piezas táctiles; reglas de iconos animados |
| `Web - 3 Acceso y primer ingreso.html` | Login, signup, recuperar y nueva contraseña, términos y privacidad, setup del perfil |
| `Web - 4 Inicio y Rutinas.html` | Inicio, lista de rutinas, detalle, compartir, confirmaciones |
| `Web - 5 Constructor de rutinas.html` | Catálogo + rutina, arrastre (levantar, hueco, inválido, quitar, teclado), panel de configuración, guardado |
| `Web - 6 Historial.html` | Lista por mes, detalle de una sesión, ticket |
| `Web - 7 Perfil y configuración.html` | Perfil, foto, editar perfil, configuración, eliminar cuenta |
| `Web - 8 Rutina compartida.html` | `/r/:codigo` en escritorio y en el celular |

Archivos: `tokens.web.css` (tokens exportables, oklch), `web.css` (estilos; cada bloque
`.w-*` es un CSS Module), `web-base.jsx` (componentes y marco del kit), `web-N.jsx` (cada
página), `tools/tokens_web.py` (regenera los tokens desde `tokens.json`).

## Estructura de escritorio

| Ancho | Navegación | Contenido |
|---|---|---|
| < 1024 px | — | Aviso "Agrandá la ventana" (salvo `/r/:codigo`, que es responsive) |
| 1024–1279 (mediana) | Riel de 76 px, solo iconos; etiqueta y atajo en tooltip | Márgenes de 32 px; constructor con catálogo de 296 px |
| 1280–1599 (grande) | Lateral de 248 px | Máximo 1200 px centrado, márgenes de 40 px |
| ≥ 1600 (amplia) | Lateral de 248 px | Igual; el constructor gana columnas de días |

- La barra de pestañas se vuelve navegación lateral en vidrio denso (`surface-raised` +
  `blur-sheet`): Inicio, Rutinas, Historial; Configuración y el usuario (→ Perfil) al pie.
- **Nueva rutina** reemplaza al botón central de la barra. Va con relleno `signal` y texto `text-on-signal`: lima en oscuro, oliva en claro.
  Mientras el constructor no esté disponible conserva el color, `aria-disabled` y el
  título «Nueva rutina: muy pronto», sin navegar al activarlo. Tanto en la barra lateral como en el encabezado de Rutinas,
  el cursor es de mano (`pointer`), nunca de bloqueo.
- La pestaña activa: icono en lume y marca de 3 px pegada al borde, como en la app.
- Se colapsa a riel con `[` o con el botón de la cabecera (preferencia en `localStorage`).
- El **constructor** es pantalla completa, sin navegación lateral: es una tarea de foco.
- Atajos: `G I` / `G R` / `G H` navegar, `N` nueva rutina, `/` buscar, `Ctrl S` guardar, `?` ayuda.

### Rutas y fondo de luces

Cada ruta declara su posición fija (las luces no se mueven fuera del onboarding). En
ventanas apaisadas los radios de las luces bajan (tabla `POS_WEB` en `web-base.jsx`); las
cinco posiciones y la regla de lectura son las de la app.

| Ruta (React Router) | Pantalla | Fondo |
|---|---|---|
| `/login`, `/signup`, `/recuperar`, `/nueva-contrasena` | Acceso | `flanco` · anima |
| `/bienvenida` | Términos y privacidad | `cumbre` · anima |
| `/bienvenida/perfil` | Setup: sexo | `cumbre` · anima |
| `/bienvenida/perfil` | Setup: fecha, altura, peso | `centro` · anima (fundido de 420 ms entre pasos) |
| `/` | Inicio | `cumbre` |
| `/rutinas`, `/rutinas/:id` | Rutinas y detalle | `cumbre` |
| `/rutinas/nueva`, `/rutinas/:id/editar` | Constructor | `velada` |
| `/historial`, `/historial/:id` | Historial y detalle | `velada` |
| `/historial/:id/ticket` | Ticket | `centro` |
| `/perfil`, `/perfil/editar`, `/configuracion` | Perfil y configuración | `cumbre` |
| `/r/:codigo` | Rutina compartida | escritorio `flanco` · celular `cumbre` |
| `*` con ancho < 1024 | Ventana chica | `centro` |

### Variante de acceso: billete grabado (propuesta)

En `Web - 3`, sección "Variante: billete grabado". La foto de alguien entrenando se convierte
en un grabado de líneas como el de un billete: talla dulce que sigue la forma, tramado
cruzado en las sombras y guilloché en las luces. Va enmarcada a la derecha del formulario
con microtexto, número de serie y una cartela con la marca `FRENCIA.` (en lugar del lema).

- El login lleva el billete a la izquierda y el formulario a la derecha; el signup, al revés.
- La tarjeta del formulario, el texto legal y "¿No tenés cuenta?" / "¿Ya tenés cuenta?" van
  centrados en la columna del formulario.
- Login y signup llevan Apple y Google debajo del botón principal, con el divisor "o
  continuá con". En el signup crean la cuenta si no existe; el alta sigue por términos y
  el setup del perfil, igual que con correo.
- Arriba, en la esquina del lado del formulario, va el switch de tema (sol · interruptor ·
  luna; encendido = oscuro) en el lugar donde estaba la marca. Sin sesión la elección se
  guarda en el navegador; con sesión manda `profiles.tema`.
- En el repo web el billete ocupa el 56 % del ancho, con tope de 0,92 × su alto para que el
  grabado (vertical) no se acerque en pantallas anchas.
- En pantallas bajas (alto de 820 px o menos, como una notebook de 1366 × 768) el acceso
  se compacta: la columna baja su relleno a `space-6`, la separación entre bloques a
  `space-5` y la tarjeta su relleno a `space-7`. Si el formulario igual no entra (el signup),
  scrollea solo la columna y el billete queda fijo, del alto de la ventana.

- Se genera una vez con `tools/grabado.py foto.jpg salida 1400` (Python + OpenCV) y se sirve
  en WebP, una imagen por tema: en oscuro la línea es la luz (marfil sobre grafito), en claro
  la sombra (tinta sobre marfil).
- Color selectivo: lo rojo saturado de la foto (las placas) pasa a lume en oscuro y a oliva
  en claro, como único color de la imagen.
- La foto de prueba es de Serjan Midili en Unsplash (licencia Unsplash, crédito opcional
  pero recomendado). Para producción, conviene una foto propia o elegida con ese fin.

## El constructor de rutinas

Anatomía: barra superior (volver, nombre editable, estado de guardado, Guardar) · catálogo
de 340 px (búsqueda, chips por tipo, selector de grupo muscular) · tablero con un día por
columna (300 px, desplazamiento horizontal con borde fundido) · panel lateral de 400 px.

### dnd-kit

- `DndContext` con `PointerSensor` (`activationConstraint: { distance: 4 }`, para no
  confundir clic con arrastre) y `KeyboardSensor` con `sortableKeyboardCoordinates`.
- Cada día es un `SortableContext` (`verticalListSortingStrategy`); los días entre sí, un
  `SortableContext` horizontal (se reordenan arrastrando la cabecera).
- El catálogo usa `useDraggable` y es un **origen de copia**: el ejercicio no sale de la lista.
- `DragOverlay` dibuja lo que se levanta. El catálogo es además un droppable `quitar`
  (solo se activa cuando lo arrastrado viene de un día).
- `collisionDetection`: `closestCorners`. Sin día bajo el puntero → zona inválida.
- `accessibility.announcements` en español: "Press inclinado levantado · 2 de 4 en Push",
  "Movido a Legs, posición 2", "Soltado", "Cancelado: vuelve a Push, posición 2".

| Estado | Cómo se ve |
|---|---|
| Reposo / hover | Al hover aparece el agarre; en el catálogo, además, el `+` (agrega al día elegido) |
| Levantado | Copia en vidrio denso (`surface-raised` + `blur-sheet`), borde y halo de `signal`, `scale(1.02)`, sin rotar, `shadow-lg` |
| Dónde cae | Hueco punteado de 1,5 px en `signal` sobre `surface-signal-soft`, del alto de una tarjeta y en el orden real; las tarjetas se corren con 180 ms `ease-out` |
| Día destino | Borde `signal` + anillo + `halo-signal`; los otros días bajan la saturación |
| Origen (entre días) | Lugar punteado en tinta hasta soltar; Esc vuelve ahí |
| Inválido | La copia pierde el lume, cursor `no-drop`, sello en tinta "Soltá dentro de un día" |
| Quitar | El catálogo se cubre con la única zona en carmín: "Soltá para quitar de Push"; el aviso trae Deshacer |
| Teclado | Espacio levanta, flechas mueven (← → cambian de día), Espacio suelta, Esc cancela; aviso abajo y `aria-live` |
| Recién agregado | Borde `signal` hasta el próximo clic |

### Panel de configuración

Clic (o Enter) en una tarjeta abre el panel; no es modal. Los campos salen de lo que
registra el ejercicio (`exercises.tracks_*`) y escriben en `training_day_exercises`:

| Tipo | Campos |
|---|---|
| Fuerza | Series, reps, intensidad (RIR con "al fallo" = `-1`, o RPE 1–10), descanso. **Sin peso**: el plan no lo prescribe |
| Isométrico | Series, tiempo por serie, **peso objetivo opcional** (`weight_kg`, solo si registra peso), intensidad, descanso |
| Cardio | Tiempo, distancia, series, intensidad o **Sin intensidad** (`intensity_kind = null`, solo cardio), descanso opcional |
| Híbrido | Los campos que marque `tracks_*` (p. ej. peso + distancia) |

Descanso apagado = `rest_seconds = null` (sin temporizador). Las incoherencias se avisan en
tinta con `circle-alert`, sin bloquear.

### Guardado

- Los cambios van a un **borrador** (estado local + `localStorage`
  `frencia:borrador:<routineId>`), que sobrevive a recargar.
- Guardar / `Ctrl S` escribe `routines`, `training_days` (con `position`),
  `training_day_weekdays` y `training_day_exercises` (con `position`). Recomendado: una
  función RPC que lo haga en una transacción, para no dejar una rutina a medias.
- Estado en la barra: Guardado · Cambios sin guardar (punto en tinta y cantidad) ·
  Guardando… · Guardado recién (check animado) · No se guardó (+ Reintentar en el aviso).
- Salir con cambios: `useBlocker` de React Router + `beforeunload`. Modal con Guardar y salir
  (foco inicial), Descartar y Seguir editando.

## Equivalentes de las piezas táctiles

| En la app | En la web | Componente |
|---|---|---|
| Hoja de acciones | Menú contextual (botón ⋯ o clic derecho) | `Menu` |
| Hoja con una decisión | Modal de 440–560 px | `Modal` |
| Hoja con un formulario largo | Panel lateral de 400 px, no modal | `Panel` |
| Alerta | Modal chico; foco en Cancelar si es destructivo | `Modal` |
| Rueda de edad | Fecha de nacimiento en tres segmentos (la cuenta guarda `fecha_nacimiento`) | `DateField` |
| Regla de altura | Lectura editable + regla arrastrable; flechas ±1, Shift ±10, rueda del mouse | `RulerSlider` |
| Regla curva de peso | La misma lectura sobre la banda en arco; flechas ±0,5, Shift ±5 | `ArcSlider` |
| Deslizar una fila | ⋯ al hover + menú; `Supr` sobre la fila enfocada | `Menu` |
| Mantener apretado para reordenar | Agarre al hover; dnd-kit con mouse o teclado | `Sortable` |
| Toast arriba | Toast abajo a la derecha, apilado | `Toast` |

## Estados de los componentes

- **Hover**: el relleno sube un paso (`accent-hover`; el vidrio pasa a `surface-card-elevated`; fantasmas y filas a `surface-chip`).
- **Foco de teclado** (`:focus-visible`): anillo sólido de 2 px en `focus-ring` con 2 px de separación. En campos: borde `signal` + anillo de 1 px + `halo-signal`.
- **Presionado**: `scale(0.985)` y `accent-press`.
- **Deshabilitado**: relleno `surface-chip`, sin halo, texto `text-disabled`. Nunca opacidad.
- **Cargando**: en botones, la ruedita reemplaza al icono y el texto queda (no salta el ancho, `aria-busy`); en páginas, esqueletos con la forma del contenido. Nunca las dos juntas.
- `prefers-reduced-motion`: sin deriva de luces, sin animación de iconos, esqueletos quietos.

Componentes nuevos del sistema (no existían en la app): `Tooltip`, `Kbd`, `Menu`,
`Select`, `Modal`, `Panel`, `FilterChip`, `DateField`, `RulerSlider`, `ArcSlider`,
`SideNav`, `Table`, `DropZone` / estados de arrastre, `Skeleton`.

## Iconos

Lucide, trazo 1.75, `currentColor`. Todo icono que exista en `@animateicons/react/lucide` se
usa en su versión animada (con el trazo llevado a 1.75); si no existe, `lucide-react` estático.

| Cuándo | Iconos | Regla |
|---|---|---|
| Al aparecer | todos los animados, navegación lateral incluida | Una vez, al entrar a la vista (150 ms después de montarse) |
| Hover y foco del control | los mismos | Una vez por entrada del puntero o del foco de teclado al control que lo contiene (botón, enlace, fila); si no hay control, el hover del propio icono. Nunca en bucle |
| Al confirmar | check (guardado, agregado), copy → check, trash-2 (en el aviso de quitado) | Una vez, en el botón o el aviso que confirma |
| Siempre quieta | x: cerrar modales, avisos y paneles, borrar una búsqueda | Ni al aparecer ni en hover: cerrar no gira. El botón conserva su hover (fondo iluminado y recuadro) |
| Siempre quieto | plus: Nueva rutina, Crear rutina, Agregar, Sumar | Ni al aparecer ni en hover. El botón conserva su hover |
| Reducir movimiento | todos | Versión estática |

Verificar en el paquete el nombre y la forma de disparar cada animación (hover o controlada);
el kit las simula con `.w-ico--anima` y `.w-ico--confirma`.

## Tokens

`tokens.web.css` trae todo como custom properties en oklch, con:

- `:root, [data-theme="dark"]` → Lume oscuro (por defecto) · `[data-theme="light"]` → Lume claro.
- `@media (prefers-color-scheme: light)` aplicado a `:root` sin `data-theme` o con `data-theme="system"`.
- El cambio de tema sobreescribe colores, sombras y halos, `--drop-shadow-lg` y `--fondo-ganancia`.
- `[data-transparencia="reducida"]` y `prefers-reduced-transparency` pasan el vidrio a opaco;
  `[data-transparencia="normal"]` lo deja en vidrio aunque el sistema pida reducirla (el
  ajuste de Configuración apagado).

```ts
// profiles.tema: 'sistema' | 'oscuro' | 'claro'
const mapa = { sistema: 'system', oscuro: 'dark', claro: 'light' } as const;
document.documentElement.dataset.theme = mapa[perfil.tema];
```

Fuente: Instrument Sans variable (pesos 400–700 y eje `wdth` 75–100, se usan 78 / 88 / 100
vía `--vs-*`) y DM Mono solo para sellos. En la web el eje de ancho funciona: no hacen falta
las instancias estáticas de `entrega/fuentes/`.

Todo color, en CSS o en TS, en oklch. Para pasar a CSS Modules: cada bloque `.w-*` de
`web.css` es un módulo (`src/ui/Button/Button.module.css`, etc.); las clases `.is-*` son
solo del kit y se reemplazan por las pseudoclases.

## Datos: lo que conviene saber

- **Compartir no existe todavía en el modelo.** `/r/:codigo` y el modal de compartir
  necesitan una tabla nueva (link, modo copia u original, vencimiento, quién la siguió).
  Es el único cambio de datos que pide este diseño.
- Edad: la cuenta guarda `fecha_nacimiento`; la web pide la fecha y calcula la edad.
- Peso en el plan: solo `weight_kg` en isométricos que registran peso.
- Sin intensidad: solo cardio. RIR `-1` = al fallo.
- Reducir transparencia no está en `profiles`: se guarda en el navegador.

## Eliminar una sesión

La lista ofrece una papelera visible por fila; no abre el detalle al pulsarla. El detalle
también ofrece «Eliminar entrenamiento». Ambas acciones abren el mismo modal chico,
con día y fecha, aviso de borrado irreversible de las series y foco inicial en Cancelar.
Durante el borrado no se puede cerrar ni repetir la acción. Si falla, se conserva el
modal con un aviso y la posibilidad de reintentar. Al confirmar, se actualizan lista,
totales y resúmenes de inicio y rutinas. La rutina y su planificación se conservan.

### Verificación sin servidor

Si el entorno no permite conexiones a localhost, ejecutar primero `npm run build` y
luego Playwright con `FRENCIA_E2E_DIST=1`: la simulación responde los archivos de `dist/`
sin red. `FRENCIA_E2E_CHANNEL=chrome` permite usar Chrome instalado. Por defecto,
`npm run e2e` sigue usando Vite y el Chromium de Playwright.
