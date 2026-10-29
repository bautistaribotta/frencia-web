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
| `Web - 1 Estructura.html` | Navegación lateral, riel en pantallas medianas, tablet y teléfono, atajos |
| `Web - 2 Componentes.html` | Todos los componentes con hover, foco, presionado, deshabilitado y carga; equivalentes de las piezas táctiles; reglas de iconos animados |
| `Web - 3 Acceso y primer ingreso.html` | Login, signup, recuperar y nueva contraseña, términos y privacidad, setup del perfil |
| `Web - 4 Inicio y Rutinas.html` | Inicio, lista de rutinas, detalle, compartir, confirmaciones |
| `Web - 5 Constructor de rutinas.html` | Catálogo + rutina, arrastre (levantar, hueco, inválido, quitar, teclado), modal de configuración, guardado |
| `Web - 6 Historial.html` | Lista por mes, detalle de una sesión, ticket |
| `Web - 7 Perfil y configuración.html` | Perfil, foto, editar perfil, configuración, eliminar cuenta |
| `Web - 8 Rutina compartida.html` | `/r/:codigo` en escritorio y en el celular |

Archivos: `tokens.web.css` (tokens exportables, oklch), `web.css` (estilos; cada bloque
`.w-*` es un CSS Module), `web-base.jsx` (componentes y marco del kit), `web-N.jsx` (cada
página), `tools/tokens_web.py` (regenera los tokens desde `tokens.json`).

## Estructura de escritorio

| Ancho | Navegación | Contenido |
|---|---|---|
| < 768 px (teléfono) | Barra inferior | Modo consulta, ver «Tablet y teléfono» |
| 768–1023 (tablet) | Riel de 76 px | Como la mediana, con márgenes de 24 px |
| 1024–1279 (mediana) | Riel de 76 px, solo iconos; etiqueta y atajo en tooltip | Márgenes de 32 px; constructor con catálogo de 296 px |
| 1280–1599 (grande) | Lateral de 248 px | Máximo 1200 px centrado, márgenes de 40 px |
| ≥ 1600 (amplia) | Lateral de 248 px | Igual; el constructor gana columnas de días |

- La barra de pestañas se vuelve navegación lateral en vidrio denso (`surface-raised` +
  `blur-sheet`): Inicio, Rutinas, Historial; Configuración y el usuario (→ Perfil) al pie.
- **Nueva rutina** reemplaza al botón central de la barra. Es un botón primario, igual que «Crear primera rutina»: relleno `accent` y texto `text-on-accent`, lima en oscuro y negro en claro.
  Abre el constructor (`/rutinas/nueva`), también con `N`, con el cursor de mano (`pointer`). Vive solo en la barra
  lateral: el encabezado de Rutinas no lo repite. Con 5 rutinas abre el aviso de límite (ver «Rutinas»).
- La pestaña activa: icono en lume y marca de 3 px pegada al borde, como en la app.
- Se colapsa a riel con `[` o con el botón de la cabecera (preferencia en `localStorage`).
- El **constructor** es pantalla completa, sin navegación lateral: es una tarea de foco.
- Atajos: `G I` / `G R` / `G H` navegar, `N` nueva rutina, `/` buscar, `Ctrl S` guardar, `?` ayuda.
- **Volver tiene memoria**: lleva a la pantalla de la que se vino, no a un padre fijo, y su
  texto dice a dónde va. Desde Inicio → Ver rutina, el volver del detalle dice «Inicio» y
  vuelve a Inicio; desde Rutinas dice «Rutinas». Ir al constructor y volver no cuenta como
  un paso. En las migas va el nombre corto («Inicio», «Rutina», «Sesión»); en un botón con
  texto o un tooltip, el largo («Volver a Inicio», «Volver a la sesión»). Sin memoria (se
  entró directo por la URL, o se vino del constructor o del acceso) va a la pantalla de
  arriba: el detalle de una rutina a Rutinas, el de una sesión a Historial, Editar perfil a
  Perfil, el ticket a su sesión. Guardar o Cancelar en Editar perfil también vuelven ahí.

### Rutas y fondo de luces

Cada ruta declara su posición fija (las luces no se mueven fuera del onboarding). En
ventanas apaisadas los radios de las luces bajan (tabla `POS_WEB` en `web-base.jsx`); las
cinco posiciones y la regla de lectura son las de la app.

| Ruta (React Router) | Pantalla | Fondo |
|---|---|---|
| `/login`, `/signup`, `/recuperar`, `/nueva-contrasena` | Acceso | `flanco` · anima |
| `/cuenta-en-baja` | Cuenta con la baja pedida | `cumbre` · anima |
| `/bienvenida` | Términos y privacidad | `cumbre` · anima |
| `/terminos`, `/privacidad` | Términos y privacidad públicos | `velada` |
| `/bienvenida/perfil` | Setup: sexo | `cumbre` · anima |
| `/bienvenida/perfil` | Setup: fecha, altura, peso | `centro` · anima (fundido de 420 ms entre pasos) |
| `/` | Inicio | `cumbre` |
| `/rutinas`, `/rutinas/:id` | Rutinas y detalle | `cumbre` |
| `/rutinas/nueva`, `/rutinas/:id/editar` | Constructor | `velada` |
| `/historial`, `/historial/:id` | Historial y detalle | `velada` |
| `/historial/:id/ticket` | Ticket | `centro` |
| `/perfil`, `/perfil/editar`, `/configuracion` | Perfil y configuración | `cumbre` |
| `/r/:codigo` | Rutina compartida | escritorio `flanco` · celular `cumbre` |
| `/rutinas/nueva`, `/rutinas/:id/editar` en el teléfono | Constructor bloqueado | `centro` |

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
- Al tocar Apple o Google, ese botón cambia el logo por la ruedita y el otro queda apagado
  hasta que el navegador sale a la pantalla del proveedor. Al volver, si se entró, la puerta
  lleva al inicio (o a donde se quería ir); una cuenta nueva pasa por términos y setup.
  Si se vuelve con la flecha del navegador, los botones quedan como antes.
- Si la persona cancela en el proveedor, vuelve a la misma pantalla con un aviso informativo
  («Cancelaste el ingreso con Google.»); si falla el proveedor o la red, el aviso es de error
  («No pudimos entrar con Google. Probá de nuevo.»). La URL se limpia y el formulario queda
  como estaba.
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

## Tablet y teléfono

Frencia Web se piensa para escritorio, pero no se bloquea en pantallas chicas: los mails
(confirmar la cuenta, restablecer la contraseña), los links compartidos y los textos
legales se abren casi siempre desde el celular. En el teléfono la web queda en **modo
consulta** y lleva a la app; en la tablet se usa entera.

| Ancho | Tamaño | Navegación | Qué se puede hacer |
|---|---|---|---|
| < 768 px | Teléfono | Barra inferior | Todo menos el constructor |
| 768–1023 | Tablet | Riel de 76 px | Todo, constructor incluido |
| ≥ 1024 | Escritorio | Riel o lateral (ver arriba) | Todo |

- Se decide por **ancho**, no por dispositivo. Lo táctil se decide aparte, con
  `(hover: none)`: lo que en escritorio aparece al pasar el mouse queda siempre a la
  vista y los objetivos miden 44 px como mínimo (`hit-min`).
- Las pantallas públicas funcionan completas a 390 px: acceso, recuperar y nueva
  contraseña, bienvenida y setup, términos y privacidad, errores y `/r/:codigo`.

### Teléfono

- **Barra inferior** en lugar de la navegación lateral: Inicio · Rutinas · Historial ·
  Perfil, icono arriba y nombre abajo, en vidrio denso (`surface-raised` + `blur-sheet`),
  fija abajo, de `barra-movil-h` (64 px) más el margen seguro del sistema. La activa lleva
  el icono en `signal` y una marca de 3 px pegada al borde de arriba, como la lateral.
  Perfil queda activa también en Editar perfil y en Configuración, que se entra desde
  Perfil. No hay Nueva rutina: abre el constructor.
- **Aviso de la app**, arriba del contenido: «Frencia anda mejor en la app», con
  Descargar (la tienda del sistema: App Store en iPhone, Google Play en Android) y la cruz,
  siempre estática. Al cerrarlo no vuelve (se guarda en el navegador). Mientras la app no
  esté publicada, Descargar dice «Pronto» y queda desactivado. Reemplaza la nota «Para
  entrenar, abrí Frencia en el celular» de la navegación lateral.
- **Página**: una columna, márgenes de `pad-screen` (20 px) y espacio abajo para la barra.
  El encabezado apila los textos y, debajo, las acciones, que bajan de línea si no entran.
  El selector del Historial va a lo ancho.
- **Tablas**: se quedan las columnas que identifican la fila y sus acciones. Rutinas
  muestra Rutina, Sesiones y ⋯ (sin Días ni Fecha de creación); el Historial, Fecha, Día,
  Series y la papelera (sin Rutina ni Duración). Las celdas bajan su relleno a 16 px.
- **En curso** (Rutinas): el nombre arriba y los días debajo, sin la cuenta de ejercicios.
- **Totales**: la grilla de cuatro pasa a dos columnas.
- **Inicio**: una columna; los días de la rutina, de a uno. Actividad muestra las últimas 5
  semanas (unos 30 días), con celdas de 28 px alineadas a la izquierda.
- **Menú ⋯**: si abajo no entra (por la barra), se abre hacia arriba; si hacia la izquierda
  se sale de la pantalla (un ⋯ que quedó a la izquierda), se abre hacia la derecha.
- **Configuración**: si el control de un ajuste no entra al lado del texto (el tema,
  Eliminar cuenta), baja debajo.
- **Detalle de una rutina**: las acciones bajo el nombre, en una sola fila y en el mismo
  orden, y los días en una columna. Para que entren: Editar rutina dice solo «Editar» y
  Compartir es solo el icono. En una archivada, Poner en curso mantiene su texto y Editar
  también pasa a ser solo el icono (lápiz). Editar lleva al constructor bloqueado.
- **Detalle de una sesión**: el ticket va debajo de las series.
- **Modales**: se vuelven hoja desde abajo, a lo ancho, con las esquinas de arriba
  redondeadas y el margen seguro de abajo. El orden de los botones no cambia.
- **Avisos (toasts)**: arriba de la barra, a lo ancho. Entran y salen por la derecha,
  como en escritorio.
- **Atajos**: no se muestran (ni `Kbd`, ni el «N» de Nueva rutina, ni las pistas «Enter
  para ingresar» del login y la bienvenida).
- **Constructor bloqueado** (`/rutinas/nueva` y `/rutinas/:id/editar`): pantalla sin
  navegación, fondo `centro`, con el icono del celular, «Armá tus rutinas en la app o en
  la compu», una línea que explica que arrastrar ejercicios y ver los días lado a lado
  necesita una pantalla más grande, y los botones Volver (con memoria: dice a dónde
  vuelve), App Store y Google Play, cada uno con el logo de su tienda (la manzana en tinta,
  el triángulo de Google Play con sus cuatro colores). Sin las tiendas publicadas, los dos quedan
  desactivados y debajo dice «Las apps llegan pronto a las tiendas.».

### Tablet

- El riel de la pantalla mediana, con márgenes de página de 24 px.
- En curso (Rutinas): el nombre en una columna de 200 px y los días sin la cuenta de
  ejercicios.
- Inicio: la rutina y lo último que pasó, uno debajo del otro. Actividad muestra las
  últimas 26 semanas (6 meses).
- Detalle de una sesión: el ticket va debajo de las series (hasta 420 px de ancho), sin
  pegarse arriba: lado a lado no entran.
- El constructor se usa entero, con el catálogo de 296 px plegable. Como el catálogo va a
  todo el alto, la barra tiene el ancho del tablero: se compacta (márgenes y espacios de
  12 px), el nombre cede ancho y el estado de guardado se corta con puntos suspensivos;
  volver, el nombre y Guardar siempre entran.

## El constructor de rutinas

Anatomía: catálogo de 340 px a la izquierda, de arriba a abajo (búsqueda, chips por tipo,
selector de grupo muscular) · a su derecha, la barra superior (volver, nombre editable,
estado de guardado, Guardar), que ocupa solo el ancho del tablero · debajo, el tablero con
un día por columna (300 px, desplazamiento horizontal con borde fundido) · modal centrado
para configurar un ejercicio.

- **Barra**: a la derecha, Atajos de teclado, `Ctrl S` pegado a la izquierda de Guardar,
  Guardar y, si hay cambios, Descartar a la derecha del todo. Guardar es la acción importante: va antes.
- **Catálogo oculto** (botón de la cabecera o `[`): se pliega a un riel de 48 px
  (`catalogo-w-riel`), de arriba a abajo, con el borde del catálogo y solo el botón Mostrar
  catálogo arriba, a la misma altura que tenía Ocultar catálogo. La barra y el tablero
  ganan ese ancho.
- **Cómo se arma**: la tarjeta de ayuda al final del tablero, mientras la rutina no tiene
  ejercicios. Lleva la cruz arriba a la derecha (estática, como todo lo que cierra); al
  cerrarla no vuelve, se guarda en el navegador.

- **Nombres en cinta** (como `MarqueeText` de la app): el nombre de un ejercicio que no
  entra en su renglón, en el catálogo y en las tarjetas de los días, se desplaza lento
  (28 px/s) de derecha a izquierda. Lleva dos copias separadas por 40 px, así la segunda
  ocupa el lugar de la primera y el reinicio no se nota. Cada vuelta arranca con 2 s quieto
  para leer el comienzo. Si entra, queda quieto. Con «reducir movimiento» no se mueve y se
  corta con puntos suspensivos; la copia que sigue al puntero al arrastrar, tampoco.

### dnd-kit

- Las tarjetas de un día se arrastran solo desde su agarre (`setActivatorNodeRef`); el resto de la tarjeta es el botón que abre el modal de configuración.
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
| Reposo / hover | En el catálogo, al hover aparece el agarre y el `+` (agrega al día elegido). En un día, la tarjeta tiene dos partes: el agarre de la derecha (seis puntos, cursor `grab`) es lo único que arrastra; el resto abre el modal de configuración, con cursor de mano, y al hover se vela (`scrim` con desenfoque que tapa el contenido) con el lápiz y «Editar» al centro. Sobre el agarre no hay velo. Mientras se arrastra no aparece |
| Levantado | Copia en vidrio denso (`surface-raised` + `blur-sheet`), borde y halo de `signal`, `scale(1.02)`, sin rotar, `shadow-lg` |
| Dónde cae | Hueco punteado de 1,5 px en `signal` sobre `surface-signal-soft`, del alto de una tarjeta y en el orden real; las tarjetas se corren con 180 ms `ease-out` |
| Día destino | Borde `signal` + anillo + `halo-signal`; los otros días bajan la saturación |
| Origen (entre días) | Lugar punteado en tinta hasta soltar; Esc vuelve ahí |
| Inválido | La copia pierde el lume, cursor `no-drop`, sello en tinta "Soltá dentro de un día" |
| Quitar | El catálogo se cubre con la única zona en carmín: "Soltá para quitar de Push"; el aviso trae Deshacer |
| Teclado | Espacio levanta, flechas mueven (← → cambian de día), Espacio suelta, Esc cancela; aviso abajo y `aria-live` |
| Recién agregado | Borde `signal` hasta el próximo clic |

### Modal de configuración

Configurar un ejercicio es un modal centrado (`Modal`, 560 px), no un panel lateral. Se
abre con clic (o Enter) en una tarjeta y **cada vez que se agrega un ejercicio a un día**
(con `+` o arrastrándolo del catálogo), para cargar series, repeticiones, intensidad y
descanso. Título: el ejercicio; bajada: «Push · ejercicio 1 de 4»; arriba de los campos,
la insignia del tipo y el detalle del catálogo. El foco arranca en el primer campo. Pie:
solo Guardar a la izquierda y Quitar ejercicio (carmín) a la derecha del todo; no hay
Siguiente ni se pasa de un ejercicio a otro desde el modal. Guardar aplica los cambios al
borrador de la rutina y cierra; la cruz o Esc cierran sin aplicarlos (un ejercicio recién
agregado queda con sus valores por defecto). Sin notas de ayuda ni atajos de teclado en el
cuerpo. Los campos salen de lo que registra el ejercicio
(`exercises.tracks_*`) y escriben en `training_day_exercises`:

| Tipo | Campos |
|---|---|
| Fuerza | Series, reps, intensidad (RIR con "al fallo" = `-1`, o RPE 1–10), descanso. **Sin peso**: el plan no lo prescribe |
| Isométrico | Series, tiempo por serie (obligatorio), **peso objetivo opcional** (`weight_kg`, solo si registra peso), **RPE o Sin intensidad**, descanso |
| Cardio | Tiempo (obligatorio) y distancia opcional, **RPE o Sin intensidad**. Una sola serie continua y **sin descanso** |

Las intensidades siguen las reglas de la base (trigger `validar_plan_de_ejercicio`):
RIR no aplica a sostener una posición ni a correr, así que isométricos y cardio solo
ofrecen RPE (opcional); fuerza e híbrido llevan intensidad siempre. El cardio se
planifica como una serie continua sin descanso, por eso su modal no tiene series ni
descanso (las mesas de `web-5.jsx` con RIR y series en isométrico y cardio quedaron
como antecedente).
| Híbrido | Los campos que marque `tracks_*` (p. ej. peso + distancia) |

Descanso apagado = `rest_seconds = null` (sin temporizador). Las incoherencias se avisan en
tinta con `circle-alert`, sin bloquear.

### Guardado

- Los cambios van a un **borrador** (estado local + `localStorage`
  `frencia:borrador:<routineId>`), que sobrevive a recargar.
- Guardar / `Ctrl S` escribe `routines`, `training_days` (con `position`),
  `training_day_weekdays` y `training_day_exercises` (con `position`) con la RPC
  `guardar_rutina_completa`, en una transacción, para no dejar una rutina a medias.
- Estado en la barra: Guardado · Cambios sin guardar (punto en tinta y cantidad) ·
  Guardando… · No se guardó (+ Reintentar en el aviso).
- **Al guardar se sale del constructor** (Guardar, `Ctrl S` o la opción Ponerla en curso /
  Guardarla sin activar): vuelve a la pantalla de la que se llegó, con el aviso «Rutina
  guardada» (check animado) ya ahí. Por ejemplo, Inicio → Ver rutina → Editar rutina →
  Guardar vuelve al detalle de esa rutina; Rutinas → Nueva rutina → Guardar vuelve a
  Rutinas, con la nueva en la lista. Si se entró directo por la URL, va al detalle de la
  rutina guardada. Si falla, se queda en el constructor con los cambios.
- Rutina nueva con otra en curso: al guardar, modal «¿La ponés en curso?» con Ponerla
  en curso (izquierda, foco inicial) y Guardarla sin activar. Sin rutina en curso, queda activa.
- Salir con cambios: `useBlocker` de React Router + `beforeunload`. Modal con Guardar y salir
  (izquierda, foco inicial), Descartar y Seguir editando (derecha del todo).

## Equivalentes de las piezas táctiles

| En la app | En la web | Componente |
|---|---|---|
| Hoja de acciones | Menú contextual (botón ⋯ o clic derecho) | `Menu` |
| Hoja con una decisión | Modal de 440–560 px | `Modal` |
| Hoja con un formulario largo | Panel lateral de 400 px, no modal | `Panel` |
| Alerta | Modal chico (dos acciones); foco en Cancelar si es destructivo. Con tres acciones en el pie, modal mediano: en el chico no entran | `Modal` |

Orden de los botones en el pie de un modal:

- **Acción no crítica** (no borra nada de forma permanente): la importante a la izquierda,
  la secundaria a su derecha y la terciaria a la derecha del todo. «Tenés cambios sin
  guardar»: Guardar y salir · Descartar · Seguir editando.
- **Borrado permanente** (eliminar la cuenta, un entrenamiento): el botón que confirma va
  siempre a la derecha, con Cancelar a su izquierda y el foco inicial.
| Rueda de edad | Fecha de nacimiento en tres segmentos (la cuenta guarda `fecha_nacimiento`) | `DateField` |
| Regla de altura | Lectura editable + regla arrastrable; flechas ±1, Shift ±10, rueda del mouse | `RulerSlider` |
| Regla curva de peso | La misma lectura sobre la banda en arco; flechas ±0,5, Shift ±5 | `ArcSlider` |
| Deslizar una fila | ⋯ al hover + menú; `Supr` sobre la fila enfocada | `Menu` |
| Mantener apretado para reordenar | Agarre al hover; dnd-kit con mouse o teclado | `Sortable` |
| Toast arriba | Toast abajo a la derecha, apilado. Entra deslizándose desde la derecha y se va deslizándose hacia la derecha (`dur-slow`, 280 ms); con «reducir movimiento», solo aparece y desaparece | `Toast` |

## Estados de los componentes

- **Hover**: el relleno sube un paso (`accent-hover`; el vidrio pasa a `surface-card-elevated`; fantasmas y filas a `surface-chip`).
- **Foco de teclado** (`:focus-visible`): anillo sólido de 2 px en `focus-ring` con 2 px de separación. En campos: borde `signal` + anillo de 1 px + `halo-signal`.
- **Presionado**: `scale(0.985)` y `accent-press`.
- **Deshabilitado**: relleno `surface-chip`, sin halo, texto `text-disabled`. Nunca opacidad.
- **Cargando**: en botones, la ruedita reemplaza al icono y el texto queda (no salta el ancho, `aria-busy`); en páginas, esqueletos con la forma del contenido. Nunca las dos juntas.
- `prefers-reduced-motion`: sin deriva de luces, sin animación de iconos, esqueletos quietos.
- **Selector** (`Select`): nunca el desplegable del sistema. La caja mediana del campo con el valor y las flechas; abajo, la lista en vidrio opaco (`surface-raised-opaco`), del ancho de la caja, con 360 px de alto como mucho y desplazamiento adentro. La elegida lleva el check en `signal`; la activa, el relleno `surface-chip`. Teclado: flechas, Inicio y Fin recorren, Enter o Espacio eligen, Esc cierra sin cambiar y una letra salta a la opción que empieza con ella (sin tildes).
- **Autocompletado** (`:autofill`, del navegador o de un gestor como Bitwarden): el campo se ve igual que con texto escrito. Sin el relleno celeste ni el texto oscuro del navegador; el vidrio, el color del texto (`text-primary`) y el cursor (`signal`) se mantienen.

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
| Siempre quieta | dumbbell: el tipo fuerza en cada ejercicio, chips e insignias | Ni al aparecer ni en hover |
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
- El límite de 5 rutinas todavía no está en la base: hoy lo cuida la web. La regla en
  la base va en una migración del repo de la app móvil.

## Ticket de una sesión

- En el detalle de la sesión, el ticket va al costado de las series (columna de 380 px,
  pegada arriba al scrollear) con Descargar y Ver grande debajo.
- `/historial/:id/ticket` muestra el ticket solo, sin la navegación, sobre la luz del centro:
  Volver a la sesión · Copiar imagen · Descargar PNG.
- Contenido: Nº (los 6 primeros del id), Sesión completa, día · fecha · hora; Duración y
  Tonelaje grandes; la perforación con una muesca a cada lado; Ejercicios, Series y Mejor
  marca (el peso más alto de la sesión, o — si no hubo peso); una fila por ejercicio con sus
  series y su mejor serie; el código de barras y el código, los dos salen del id.
- Va en el vidrio **opaco** (`surface-raised-opaco`), como en la app: así se ve igual en
  pantalla y en la imagen, que se exporta en PNG con fondo transparente al doble de
  resolución. Copiar imagen usa el portapapeles del navegador; si no lo permite, avisa y
  ofrece descargar.

## Fases de la cuenta

Con sesión, antes de la app, el perfil decide la pantalla, en este orden (como el gate de
la app móvil):

1. **Leyendo el perfil:** nada, para no parpadear.
2. **No se pudo leer:** la pantalla de sin conexión con Reintentar. Nunca el setup: una
   lectura fallida no es una cuenta nueva.
3. **Baja pedida** (`deletion_requested_at`): `/cuenta-en-baja`, la única pantalla. Recuperar
   cuenta cancela la solicitud (`cancelar_eliminacion_cuenta`) y sigue el ingreso normal;
   Cerrar sesión vuelve al login.
4. **Términos sin aceptar** (la última aceptación no es de las versiones vigentes):
   `/bienvenida`. Cada documento se abre en el modal de lectura y se marca leído al llegar
   al final; Aceptar y continuar registra la aceptación (`registrar_aceptacion_legal`).
5. **Setup sin terminar** (`onboarding_completed` en falso): `/bienvenida/perfil` al entrar.
   Saltar deja el dato vacío y avanza; Finalizar guarda lo cargado y las unidades y marca el
   setup como terminado, aunque se hayan saltado datos. No se fuerza más que esa vez: si se
   sale a mitad, vuelve en el próximo ingreso.
6. **Adentro:** la app.

## Términos y privacidad públicos

`/terminos` y `/privacidad` muestran los textos legales en una página que se abre sin
sesión: son los links que piden Google (pantalla de consentimiento de OAuth), Apple y las
tiendas. En `Web - 3`, sección "Términos y privacidad públicos".

- Van afuera de las puertas del router: con sesión no redirigen y sin sesión no mandan al
  login. La cabecera es la pública (la de la 404 sin sesión): marca a la izquierda y, a la
  derecha, Entrar y Crear cuenta sin sesión o Ir a Frencia con sesión.
- Debajo, el segmentado Términos · Privacidad pasa de un documento al otro y cambia la URL.
  Después el título (`t-display`), «Última actualización · fecha» y las secciones en una
  tarjeta, con el mismo formato que el modal de lectura (subtítulo, párrafos en
  `text-secondary`, viñetas de raya). Columna de lectura de 760 px, centrada.
- Al pie, centrado: «¿Dudas? Escribinos a» y el correo de contacto, como link `mailto:`.
- El texto sale de los mismos archivos que el modal (`terminos.ts`, `privacidad.ts`), así
  que lo que se publica es siempre lo que se acepta. El título de la pestaña es el del
  documento.
- En el teléfono: cabecera chica (Entrar o Ir a Frencia en tamaño `sm`), el segmentado a
  lo ancho y la tarjeta con relleno `space-6`.
- En la tablet la cabecera baja su margen a `space-9`, alineada con la columna.
- Fondo `velada`, como las pantallas de mucho texto.

## Recuperar la contraseña

- «¿La olvidaste?» del login lleva a `/recuperar` con el correo ya escrito, si había uno.
  Mismo marco que el login (billete a la izquierda). Enviar enlace pide a Supabase el
  correo de recuperación con vuelta a `/nueva-contrasena`. Siempre confirma «Revisá tu
  correo», exista o no la cuenta: no se revela qué correos están registrados. Reenviar
  espera un minuto.
- `/nueva-contrasena` canjea el código del enlace y pide la contraseña dos veces. Los
  requisitos (6 caracteres o más · las dos coinciden) se marcan en vivo; si el servidor
  dice que es igual a la anterior, el error va en el campo. Guardar y entrar lleva al
  inicio con el aviso «Contraseña actualizada».
- Sin código válido (vencido, ya usado o abierto en otro navegador) muestra «El enlace
  venció» con Pedir otro enlace.
- La dirección de vuelta (`https://frencia.fit/nueva-contrasena` y la de desarrollo) tiene
  que estar en las Redirect URLs de Supabase Auth; si no, el correo vuelve a la Site URL.

## Configuración

- Secciones: Apariencia, Preferencias (peso, altura, distancia y el medidor de esfuerzo),
  Legal y Cuenta.
- Cada cambio de Preferencias se guarda en el acto y lo confirma un aviso (toast) con la
  opción elegida: «El peso ahora va en libras», «El esfuerzo ahora se mide con RPE».
  Si la base no lo acepta, vuelve a lo anterior y el aviso es de error.

## Inicio

- Arriba, debajo del saludo, **Actividad**: los días entrenados, como el cuadro de
  contribuciones de GitHub. Reemplaza a «Esta semana». Una columna por semana (de lunes a
  domingo, de arriba a abajo) y la más reciente a la derecha; arriba el mes donde empieza,
  a la izquierda L, X y V. En escritorio, las últimas 53 semanas (el último año); en la
  tablet, 26; en el teléfono, 5.
- Un solo tono: el día con al menos una sesión terminada va en `signal`; el resto, en
  `data-track`. Los días que la rutina pedía y no se entrenaron no se marcan. Hoy lleva un
  borde fino (`border-strong`); los días que todavía no llegaron no se dibujan.
- Arriba a la derecha, el total: «96 sesiones en el último año» (o «en los últimos 6
  meses», «en las últimas 5 semanas»).
- Es **solo informativo**: no se hace clic ni lleva a ningún lado. Al pasar el mouse, un
  tooltip con el día: «Mar 28 oct · Push · 15 series», o «Mar 28 oct · Sin entrenar».
- La racha sigue en el encabezado, a la derecha del saludo.
- **El día que toca**, en la rutina en curso: una sola tarjeta de día lleva el borde de
  acento y su rótulo. Si hoy es día de entrenar y todavía no hay sesión terminada hoy, dice
  «Hoy», con «Empezalo desde la app» debajo. Si no (hoy no toca o ya se entrenó), marca el
  próximo día que toca, con el día de la semana: «Próximo · Vie». Si dos días de la rutina
  caen el mismo día de la semana, gana el primero. Una rutina sin días de la semana
  asignados marca, en orden, el que sigue al último que se entrenó («Próximo»).

## Inicio sin rutinas

- Arriba, la tarjeta «Tu primera rutina» con Crear primera rutina. Debajo, los tres pasos
  (Armá tu rutina acá · Entrená con la app · Revisá tu progreso), los tres en la tarjeta
  punteada de lo vacío, porque todavía no hay nada hecho. El primero, el que toca ahora,
  se distingue solo por el número relleno en `accent`.
- Los textos de los pasos entran en dos líneas a 1440 px, para que las tres tarjetas
  queden del mismo alto: «Revisá tu progreso» dice «Historial y mejores marcas, en la
  pantalla grande.»

## Rutinas

- Sin rutinas, la tarjeta punteada del vacío. Al pie, una columna centrada: arriba el
  atajo («Apretá N para crear una rutina», en terciario) y debajo Crear rutina, botón
  primario. Los dos centrados en la tarjeta y el atajo centrado sobre el botón. En el
  teléfono el atajo no se muestra.
- Título «Todas las rutinas», con la bajada «Una en curso, al poner otra en curso, la
  actual se archiva.» Sin botón Nueva rutina: ya está siempre en la navegación.
- La en curso arriba, en una tarjeta con borde de lume: a la izquierda el nombre (ancho
  fijo, hasta dos renglones) y su cuenta; a la derecha los días en una **lista vertical**,
  una fila por día con su nombre, la tira de la semana y la cantidad de ejercicios. Crece
  hacia abajo, así no se rompe con 4 o más días.
- Las anteriores en una tabla de la más nueva a la más vieja, sin
  orden a elegir (son pocas). A la derecha del rótulo «Anteriores · N», la cuenta
  contra el límite: «4 de 5 rutinas».
- Columnas: Rutina, Días, Fecha de creación (`27 OCT 2026`), Sesiones y el menú ⋯.
- **Límite:** cada cuenta gratuita tiene hasta 5 rutinas, contando la en curso y las
  archivadas. Con 5, Nueva rutina abre el modal chico «Llegaste a 5 rutinas» con un
  solo botón, Entendido, en lugar del constructor. Si igual se llega a guardar una
  sexta (por ejemplo, desde otra pestaña), el guardado avisa el error y no la crea.
- **Menú ⋯ de una fila** (también con clic derecho sobre la fila):
  - Poner en curso: archiva la actual y avisa «X está en curso» con Deshacer, que
    vuelve a poner en curso la anterior.
  - Editar: abre el constructor. Una archivada se edita y sigue archivada.
  - Duplicar: crea una copia **archivada** (no reemplaza la en curso) con los días, sus
    días de la semana y los ejercicios con su configuración; el historial no se copia.
    El nombre sigue a Windows: «Lunes - copia», y si ya existe «Lunes - copia (2)»,
    «(3)»… Duplicar una copia sale de la misma base, sin apilar sufijos; si no entra en
    60 caracteres se recorta la base. Avisa «Creaste Lunes - copia» con Editar, que abre
    el constructor de la copia. Cuenta para el límite: con 5 abre el mismo aviso que
    Nueva rutina.
  - Compartir: desactivado hasta tenerlo.
  - Eliminar (carmín, `Supr` sobre la fila enfocada): pide confirmar en el modal
    chico; Cancelar a la izquierda con el foco inicial y Eliminar a la derecha. Se
    borra la rutina con sus días y ejercicios; las sesiones del historial quedan.
- **Acciones del detalle:** de izquierda a derecha, de la más importante a la menos, y
  el ⋯ siempre a la derecha del todo. En curso: Editar rutina (principal) · Compartir ·
  ⋯. Archivada: Poner en curso (principal) · Editar rutina (secundario) · Compartir ·
  ⋯.
- **Menú ⋯ del detalle** (en vidrio, mediano): Duplicar y Eliminar. Al eliminar vuelve a
  Rutinas.

## Filtrar el historial por rutina

- En el encabezado del Historial, a la derecha, un Selector mediano de 280 px con el icono
  de capas: «Todas las rutinas» primero, después la en curso y las archivadas. Si no hay
  ninguna rutina no se muestra.
- Filtra la lista y los totales (sesiones, tiempo, tonelaje). Se guarda en la URL
  (`/historial?rutina=id`), así que volver de una sesión o recargar lo conserva; un id que
  no es de una rutina del usuario se toma como «Todas las rutinas».
- Sin sesiones de la rutina elegida, el vacío propio: «Sin sesiones de {rutina}» con
  «Ver todas las rutinas», que quita el filtro.
- Las sesiones de un día que ya se borró no tienen rutina: solo aparecen con «Todas las
  rutinas».

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
