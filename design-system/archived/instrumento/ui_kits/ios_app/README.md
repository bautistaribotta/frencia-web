# Frencia — iOS app UI kit

A high-fidelity recreation of the Frencia iOS app: log the routine you already have
on paper, then review history, progress, and effort math (RIR/RPE/AMRAP).

## Run
Open `index.html`. It renders inside an iPhone frame (`ios-frame.jsx`) and is
interactive:
- **Hoy** → tap **Empezar entrenamiento** (or the center action) to start.
- **Registro** → adjust **Peso / Reps**, pick **RIR**, tap **Registrar serie**
  (advances + shows a rest banner). Tap **Terminar** to finish.
- **Stub** → the workout-receipt summary (the signature artifact). **Hecho**
  returns home.
- Bottom tabs: **Hoy · Historial · Progreso · Perfil** (Perfil shows `Switch` in context).

## Files
- `index.html` — app shell, tab nav + workout flow, plus inline History/Profile screens.
- `data.js` — mock data (plain globals).
- `HomeScreen.jsx` — today's session, week stats, last PR.
- `WorkoutLogScreen.jsx` — active set logging (Steppers, RIR, SetRows, rest timer).
- `ProgressScreen.jsx` — est. 1RM, weekly volume chart, PR history.
- `SessionStub.jsx` — the "receipt" session summary.
- `ios-frame.jsx` — device bezel (starter component).

## Composition
Screens compose primitives from `window.FrenciaDesignSystem_377129` (the compiled
bundle): `Button`, `IconButton`, `Card`, `Badge`, `Tag`, `Avatar`, `StatTile`,
`Stepper`, `SetRow`, `ProgressBar`, `MetricPill`, `SegmentedControl`, `TabBar`,
`Switch`. Each screen file pulls what it needs at the top and attaches itself to
`window`. Icons are Lucide; `lucide.createIcons()` re-runs after every render.

> Recreation built from the user's moodboard (no original Frencia codebase existed).
> The bar chart and barcode are CSS/`div` data renderings, not illustrations.

## Pantallas de la app (desde el código)

Mockup de cada pantalla de la app tal como está hoy en el repositorio
(`src/app/*.tsx` y `src/components/*`), con sus estados: vacío, con datos,
foco, error, carga, hojas, diálogos y toasts. Cada pantalla replica los
espaciados y roles de texto del port RN (`src/design/`) y consume solo
tokens; el conmutador de arriba pasa todas las pantallas a claro u oscuro.

| Página | Pantallas | Código |
|---|---|---|
| `Pantallas - 1 Acceso.html` | Login, registro, recuperar contraseña | `src/app/(auth)/*` |
| `Pantallas - 2 Primer ingreso.html` | Aceptación legal, documento legal, setup en 4 pasos, cuenta en eliminación, error de carga | `legal-consent`, `terms`, `privacy`, `setup`, `account-recovery`, `profile-error` |
| `Pantallas - 3 Pestanias.html` | Inicio, Rutinas e Historial con sus estados | `src/app/(main)/home`, `routines`, `history` |
| `Pantallas - 4 Crear rutina.html` | Wizard de rutina y selector de ejercicios (fuerza, cardio, isométrico, descanso) | `create-routine`, `DayEditor`, `ExercisePickerModal`, `ArchiveRoutineDialog` |
| `Pantallas - 5 Rutina.html` | Detalle, editar rutina, editar día, confirmaciones | `routine`, `edit-routine`, `edit-day` |
| `Pantallas - 6 Sesion.html` | Wizard de sesión: serie de fuerza, descanso, cardio, isométrico, menú, conflicto, ticket | `session`, `SerieComparativa`, `RestRing`, `ResumenSesion`, `TicketSesion` |
| `Pantallas - 7 Entrenamiento.html` | Detalle de un entrenamiento del historial y su ticket | `session-history`, `session-ticket` |
| `Pantallas - 8 Perfil.html` | Perfil, foto, editar perfil, configuración, eliminar cuenta | `(main)/profile`, `edit-profile`, `settings` |

Cada página carga su código desde `pantallas-N.jsx` y se ve también como tarjeta en el Design System (`components/Pantallas*/preview.html`, que la arma con `cargar-kit.js`).

Piezas compartidas: `pantallas-base.jsx` (marco, campos, ruedas, grilla de
serie, aro de descanso, ticket, hojas, diálogos, toast) y `pantallas.css`.

### Piezas que viven solo en las pantallas

Se dibujan en `pantallas-base.jsx` / `pantallas.css` hasta que se sumen al bundle:

- El marco de los wizards: `Paso`, `Escala`, `Opciones`, `Linea`, `Regla` y `BotonTexto`.
- `NumberField` (`CampoNumero`), `WheelPicker` / `MeasurePicker` (`Rueda`, `Medida`), `Dialogo` y las hojas inferiores.
- `SerieComparativa` del código (filas Rutina / Última / Hoy con columnas dinámicas, `Grilla`) y la esfera de descanso de 240 px (`Aro`).
- El ticket de la sesión (`Ticket`) y el icono de la app como marca (`IconoApp`).
- `Avatar` sin foto: la app dibuja un avatar generativo (boring-avatars, variante beam) en acero; el del bundle muestra iniciales.

`Button` `soft` y `danger` ya están en el bundle.
