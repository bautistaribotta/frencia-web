# Lume en Expo Go: guía de implementación

Esto es lo que necesita Claude Code para llevar Lume a la app. El diseño manda (tokens,
pantallas del kit, guías); este documento dice **cómo hacerlo en React Native dentro de
Expo Go**, sin módulos nativos propios.

Contenido de `entrega/`:

| Archivo | Para qué |
|---|---|
| `implementacion.md` | Esta guía. |
| `fondos.json` | Las cinco posiciones del fondo, los colores por tema, la tabla ruta → fondo y los tiempos del onboarding. Generado; no editar a mano. |
| `fuentes/*.ttf` | Instrument Sans en instancias estáticas (normal, semicondensada, condensada) y DM Mono. |
| `grano.png` | Textura de grano de 128 px para repetir sobre las luces (opcional). |

La fuente de verdad de los valores sigue siendo `../tokens.json`.

---

## 1. Dependencias (todas corren en Expo Go)

```sh
npx expo install expo-blur react-native-svg react-native-reanimated expo-font \
  expo-linear-gradient @react-native-masked-view/masked-view lucide-react-native
```

- **expo-blur**: el vidrio (`BlurView`).
- **react-native-svg**: las luces del fondo (`RadialGradient`). RN no tiene `filter: blur`; un degradado radial ya es la luz difusa.
- **react-native-reanimated**: la deriva de las luces en el onboarding y el fundido entre pasos.
- **expo-linear-gradient**: los velos de arriba y abajo.
- **@react-native-masked-view/masked-view**: fundir los bordes del scroll (opcional).
- **lucide-react-native**: los iconos, trazo 1.75.

## 2. Tokens

Generá un `theme.ts` desde `tokens.json` con los dos temas (`dark`, `light`) y elegí con
`useColorScheme()` más la preferencia guardada del usuario. Los valores `rgba(...)` de
`surface-*`, `glass-*` y `velo-*` sirven tal cual en RN.

Lo que **no** pasa directo:

| Token web | En RN |
|---|---|
| `shadow-glass` (inset 0 1px 0 highlight) | RN no tiene sombra interior: una `View` absoluta de 1 px de alto arriba con `glass-highlight`, dentro del borde redondeado. O `borderTopColor: glass-highlight` y el resto del borde en `glass-line`. |
| `halo-accent`, `halo-signal` | Con RN ≥ 0.76 (Expo SDK 52+, nueva arquitectura), `boxShadow` acepta el mismo string del token. Si no: `shadowColor` lume, `shadowOpacity`, `shadowRadius`, `shadowOffset` en iOS; en Android se omite. |
| `blur-glass` 22, `blur-sheet` 30 | `BlurView intensity` ≈ 40 y ≈ 60. Ajustar a ojo contra las pantallas del kit. |
| `--vs-condensed`, `--vs-semi` | No se puede mover el eje de ancho: usar las familias estáticas (sección 6). |
| `tabular-nums` | `fontVariant: ['tabular-nums']` en todo texto con cifras. |

## 3. El Fondo

Un componente `<Fondo posicion intensidad animado />` absoluto detrás de cada pantalla
(`StyleSheet.absoluteFill`, `pointerEvents="none"`). Lee `fondos.json`.

Capas, de abajo hacia arriba:
1. `View` con `backgroundColor: bg-app`.
2. Una capa por luz (`a`, `b`, `c`): cada una es un `Svg` a pantalla completa con un `Rect` relleno con su `RadialGradient`.
3. Grano (opcional): `Image source={grano.png}` con `resizeMode="repeat"`, `opacity: 0.2`. En oscuro funciona bien; en claro probalo a 0.12.
4. Velo: `LinearGradient` vertical con `velo-top` en 0, transparente en 0.30 y 0.64, `velo-bottom` en 1.

Geometría de cada luz (todo en `fondos.json`):

```tsx
// W, H: ancho y alto de la pantalla (useWindowDimensions)
const cx = (luz.x / 100) * W;
const cy = (luz.y / 100) * H;
const r  = (luz.radio / 100) * W;          // el radio va en % del ANCHO
const ganancia = reducirTransparencia ? 0.45 : (isDark ? 1 : 1.7);     // fondos.ganancia
const a  = Math.min(1, luz.alfa * ganancia * (intensidad === 'suave' ? fondos.intensidad.suave[luz.capa] : 1));

<Svg width={W} height={H} style={StyleSheet.absoluteFill}>
  <Defs>
    <RadialGradient id={`luz-${luz.capa}`} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
      <Stop offset="0"    stopColor={tema[`glow-${luz.capa}`]} stopOpacity={a} />
      <Stop offset="0.42" stopColor={tema[`glow-${luz.capa}`]} stopOpacity={a * 0.45} />
      <Stop offset="1"    stopColor={tema[`glow-${luz.capa}`]} stopOpacity={0} />
    </RadialGradient>
  </Defs>
  <Rect width={W} height={H} fill={`url(#luz-${luz.capa})`} />
</Svg>
```

Los centros pueden caer fuera de la pantalla (x = 112, y = −10): es a propósito, la luz entra
desde el borde.

### Qué fondo lleva cada pantalla

Las luces **no se mueven** salvo en el onboarding. La posición se elige para que el texto
chico no caiga sobre la parte clara; si una pantalla nueva no cumple la regla de lectura
(abajo), se cambia la posición, nunca el texto.

| Ruta | Posición | Intensidad | Anima |
|---|---|---|---|
| `(auth)/login`, `register`, `forgot-password` | flanco | pleno | sí |
| `legal-consent`, `terms`, `privacy` | cumbre | pleno | sí |
| `setup` paso 1 (sexo) | cumbre | pleno | sí |
| `setup` pasos 2–4 (edad, altura, peso) | centro | pleno | sí |
| `account-recovery`, `profile-error` | cumbre | pleno | no |
| `(main)/home`, `routines`, `history`, `profile` | cumbre | pleno | no |
| `create-routine` · nombre | base | pleno | no |
| `create-routine` · cantidad de días | cumbre | pleno | no |
| `create-routine` · cada día (`DayEditor`) | cumbre | pleno | no |
| `ExercisePickerModal` (catálogo y configurar) | velada | pleno | no |
| `session` · serie (fuerza, cardio, isométrico) | velada | pleno | no |
| `session` · descanso (`RestRing`) | centro | pleno | no |
| `session` · ticket (`ResumenSesion`) | centro | pleno | no |
| `session` · conflicto, día sin ejercicios | cumbre | pleno | no |
| `session-history` | velada | pleno | no |
| `session-ticket` | centro | pleno | no |
| `routine`, `edit-routine`, `edit-day` | cumbre | pleno | no |
| `edit-profile`, `settings` | cumbre | pleno | no |

Las hojas y los diálogos no traen fondo propio: se ven sobre el de la pantalla de abajo,
con el `scrim` encima.

### Regla de lectura (tema oscuro)

- El texto chico va **sobre vidrio ahumado** (`surface-card` oscuro oscurece la luz de atrás) o en una zona del fondo sin luz.
- Detrás de **números grandes y del botón principal**, la luz puede ser fuerte.
- Las unidades pegadas a un número grande (`kg`, `cm`) van en `text-primary`.
- En el tema claro todo pasa en cualquier posición.

Así quedó verificado en el kit: cada texto de las ocho páginas de pantallas, medido contra el
píxel real del fondo en los dos temas, da ≥ 4.5:1 (≥ 3:1 en texto grande). Si agregás una
pantalla nueva y el texto chico cae sobre la luz, cambiá la posición del fondo.

### Movimiento

- **Onboarding** (acceso, legales, setup): cada capa de luz va dentro de un `Animated.View` que deriva con `transform` (translate y scale) en loop: `(0, 0, 1) → (+5 %, −4 %, 1.08) → (−4 %, +5 %, 0.96)`, `withRepeat(withTiming(…, { duration }), -1, true)`, con 20, 26 y 31 s para a, b y c y desfases de −7 y −13 s. Se anima la `View`, no el degradado: corre en el hilo de UI y no re-renderiza el SVG.
- **Entre pasos del onboarding** (`fondos.json → onboarding.recorrido`): desplazá cada capa hacia la posición siguiente con el mismo `transform`: `translateX = (x₂ − x₁)% · W`, `translateY = (y₂ − y₁)% · H`, `scale = r₂ / r₁`, en 600 ms ease-in-out; al terminar, re-renderizá con la posición nueva y transform en cero.
- **Wizards fuera del onboarding** (crear rutina, sesión): las luces quedan quietas. Al cambiar de paso, fundido cruzado de 420 ms entre el fondo anterior y el nuevo (dos `Fondo` superpuestos, opacidad animada).
- Con "Reducir movimiento" (`useReducedMotion()` de Reanimated) no hay deriva ni desplazamiento: cambio directo.

## 4. Vidrio

`<Vidrio nivel="normal | fuerte | denso">`: fondo translúcido, borde de 1 px `glass-line`,
brillo de 1 px arriba (`glass-highlight`) y, según dónde esté, desenfoque.

| Nivel | Relleno | Blur | Dónde |
|---|---|---|---|
| normal | `surface-card` | no | tarjetas, opciones, campos, celdas, chips |
| fuerte | `surface-card-elevated` | no | lo elegido, la banda de la rueda, la celda en foco |
| denso | `surface-raised` | `BlurView` | tab bar, hojas, diálogos, toast, barra del wizard, cabecera de la sesión |

**El blur va solo en el cromo.** Veinte `BlurView` en una lista con scroll cuestan cuadros
y en Android son experimentales. Las tarjetas de lista son translúcidas sin blur: como
detrás hay luces ya difusas, la diferencia casi no se ve.

```tsx
<BlurView intensity={60} tint={isDark ? 'dark' : 'light'}
  style={{ borderRadius: 22, overflow: 'hidden' }}>
  <View style={{ backgroundColor: t['surface-raised'], borderWidth: 1, borderColor: t['glass-line'] }}>…</View>
</BlurView>
```

En Android, `expo-blur` necesita `experimentalBlurMethod="dimezisBlurView"` para desenfocar
de verdad; si da problemas, sacalo y queda el relleno `surface-raised`, que ya es casi opaco.

En oscuro el vidrio es **ahumado** (`rgba(20,22,18,.42)`), no blanco: así el texto
terciario sostiene el contraste aunque haya luz detrás. No lo reemplaces por un blanco
translúcido.

Los bordes del scroll se funden con `MaskedView` + `LinearGradient` (negro → transparente),
nunca con un degradado al color de fondo: debajo hay luces, no un color plano.

### Accesibilidad del sistema

```ts
const [reducida, setReducida] = useState(false);
useEffect(() => {
  AccessibilityInfo.isReduceTransparencyEnabled().then(setReducida);   // solo iOS
  const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReducida);
  return () => sub.remove();
}, []);
```

Con **Reducir transparencia** activado:
- `surface-card`, `surface-card-elevated` y `surface-raised` pasan a `surface-card-opaco`, `surface-card-elevated-opaco` y `surface-raised-opaco`.
- Sin `BlurView` (render directo de la `View` con el color opaco).
- Las luces del Fondo multiplican su alfa por 0.45 y se saca el grano.

Con **Reducir movimiento** (`useReducedMotion()`), las luces del onboarding quedan quietas y los cambios de paso son directos.

El modo se ve en el kit: *Pantallas · 3*, "Con Reducir transparencia".

## 5. Componentes: qué cambia

- **Button primary**: `accent` + `text-on-accent`, radio 18, alto 54 (lg), con `halo-accent`. **Secondary**: vidrio normal. **Ghost**: sin fondo.
- **Escala de avance**: marcas de 3 px y radio 2; hechas en `text-primary`, la actual en `signal` con `halo-signal`, las que faltan en `data-track`.
- **Barra del wizard / cabecera de sesión**: píldora de vidrio denso, `marginHorizontal: 14`, alto 44.
- **Opciones (radio)**: vidrio normal; elegida en vidrio fuerte con borde `accent`.
- **Rueda**: la banda elegida es una pastilla de vidrio fuerte de 52 px, radio 18.
- **Regla** (altura): el riel va en vidrio normal, radio 22; la aguja en `signal` con `halo-signal`; los bordes izquierdo y derecho se funden con máscara.
- **Regla curva** (peso): misma lectura arriba y mismo selector kg / lb; la regla es una banda de vidrio en un arco muy abierto (radio exterior 420, grosor 70) más ancha que la pantalla, centrada, con los extremos cortados por el borde del teléfono. Arriba al centro queda 6 px por debajo de la lectura. Marcas en el borde exterior (12 / 20 / 30 px), números cada 5 kg 42 px hacia adentro, girados con la banda; 1,7° por marca (0,5 kg), sin desvanecer en los extremos. La aguja es fija arriba al centro (`signal`). Se arrastra en horizontal (`PanGesture` de react-native-gesture-handler): el desplazamiento se convierte en giro, cada 1,7° es un paso, con háptico liviano (`expo-haptics`) en cada kilo.
- **Esfera del descanso**: disco de vidrio normal; 60 marcas; arco en `signal` con brillo.
- **Ticket**: silueta en `surface-raised` con borde `glass-line`; el punto de la marca en `signal`.
- **TabBar**: vidrio denso; icono activo en `signal`, marca superior en `signal` con brillo; el botón central en `accent` con `halo-accent`.
- **Esfuerzo** (RIR, RPE, PR, isométrico): `intensity-text` en semibold con el icono `flame`. Sin color.
- **Home**: solo el próximo día lleva Empezar en primary; los demás en secondary. Los días de la semana marcados, en `text-primary` sólido (dato); en el editor de día, en `accent` (elección).

Las pantallas de referencia son las del kit (`ui_kits/ios_app/Pantallas - *.html`); debajo
de cada teléfono figura la ruta y el fondo que usa.

### Series realizadas (session-history)

Cada serie es una fila de vidrio normal (sin blur), alto mínimo 52, radio 18, separadas 8 px:
- **Número** en un círculo de 26 px (`surface-chip`), 12 px semibold, `text-secondary`.
- **Datos** en una sola línea, todos al mismo tamaño: valor 17 px semibold (`InstrumentSans-SemiBold`, ancho normal, cifras tabulares) en `text-primary`, unidad 12 px medium en `text-tertiary` pegada al valor. Peso y reps se separan con `×`; tiempo y distancia, con `·` (14 px, `text-tertiary`).
- **Esfuerzo** en una píldora de 24 px a la derecha: borde `surface-intensity-line`, fondo `surface-intensity-soft`, la llama de 13 px y el texto ("RIR 2", "RPE 7", "Al fallo") 11 px semibold semicondensado en mayúsculas, `intensity-text`.
- **Check** de 18 px en `signal` al final.

### Carga

- **Círculo**: `ActivityIndicator` no; un anillo propio para que coincida con el diseño. Pista `data-track`, un cuarto del borde en `text-primary` (o `text-on-accent` dentro de un botón), una vuelta cada 1,2 s, lineal, con Reanimated (`withRepeat(withTiming(360, { duration: 1200, easing: Easing.linear }), -1)`). Tamaños 16 / 20 / 28 px, borde 1,5 / 1,5 / 2.
- **Pantalla cargando**: el círculo de 20 px centrado con la leyenda debajo ("Cargando rutinas…", `text-body-sm`, `text-secondary`).
- **Arrastrar para actualizar**: `RefreshControl` con `tintColor` en `text-primary` sirve en iOS; para que se vea igual al diseño, el círculo de 28 px arriba de la lista mientras se tira y gira al soltar.
- Con *Reducir movimiento*, el círculo gira 3 veces más lento (3,6 s por vuelta).

### Marca en el acceso (login y registro)

Sin icono ni lema. Solo el nombre `FRENCIA.` armado con las letras del icono (`ui_kits/ios_app/marca/linea-letras.png` y `linea-punto.png`, usalos como imagen con `tintColor`), 168 px de ancho, centrado en horizontal. En vertical se centra entre el borde superior de la pantalla (incluida la barra de estado) y el título "Entrá a tu cuenta" / "Creá tu cuenta": un contenedor con `flex: 1` y `justifyContent: 'center'` que arranca en y = 0, con el formulario debajo. Color: `#FFFFFF` en oscuro, `#000000` en claro; letras y punto del mismo color.

## 6. Fuentes

```ts
const [ok] = useFonts({
  'InstrumentSans-Regular': require('./fuentes/InstrumentSans-Regular.ttf'),
  'InstrumentSans-Medium': require('./fuentes/InstrumentSans-Medium.ttf'),
  'InstrumentSans-SemiBold': require('./fuentes/InstrumentSans-SemiBold.ttf'),
  'InstrumentSans-Bold': require('./fuentes/InstrumentSans-Bold.ttf'),
  'InstrumentSansSemiCondensed-Medium': require('./fuentes/InstrumentSansSemiCondensed-Medium.ttf'),
  'InstrumentSansSemiCondensed-SemiBold': require('./fuentes/InstrumentSansSemiCondensed-SemiBold.ttf'),
  'InstrumentSansCondensed-Medium': require('./fuentes/InstrumentSansCondensed-Medium.ttf'),
  'InstrumentSansCondensed-SemiBold': require('./fuentes/InstrumentSansCondensed-SemiBold.ttf'),
  'InstrumentSansCondensed-Bold': require('./fuentes/InstrumentSansCondensed-Bold.ttf'),
  'DMMono-Regular': require('./fuentes/DMMono-Regular.ttf'),
  'DMMono-Medium': require('./fuentes/DMMono-Medium.ttf'),
});
```

En RN cada peso es una familia; no uses `fontWeight` junto con estas familias.

| Rol | Familia | Tamaño / alto de línea |
|---|---|---|
| `text-hero`, relojes, lecturas | `InstrumentSansCondensed-Medium` | 72 (reloj 60, lectura 88) |
| números de celdas y ruedas | `InstrumentSansCondensed-Medium` | 22–38 |
| `text-display` | `InstrumentSans-Medium` | 34 / 37, `letterSpacing` −0.95 |
| `text-title` | `InstrumentSans-SemiBold` | 26 / 30 |
| `text-subtitle` | `InstrumentSans-SemiBold` | 19 / 24 |
| `text-body`, `text-body-sm` | `InstrumentSans-Regular` | 16 / 24, 14 / 20 |
| `text-data` | `InstrumentSans-Medium` | 15 / 20, tabular |
| `text-label` | `InstrumentSansSemiCondensed-SemiBold` | 11 / 15, mayúsculas, `letterSpacing` 0.9 |
| `text-meta` | `DMMono-Regular` | 11 / 14, mayúsculas |

Las instancias se cortaron del archivo variable del sistema (subconjunto latino: cubre
español completo, `× · ↑ ↓`). Instrument Sans y DM Mono tienen licencia SIL Open Font
License 1.1.

## 7. Orden sugerido

1. `theme.ts` desde `tokens.json` y la carga de fuentes.
2. `Fondo` estático con `fondos.json` y la tabla de rutas.
3. `Vidrio` y el cambio de superficies de los componentes (Card, Button, campos, TabBar).
4. Wizards: barra en píldora, escala, rueda, regla, esfera y ticket.
5. Movimiento del onboarding y fundido entre pasos.
6. Revisión en los dos temas contra el kit, en un iPhone real y en un Android de gama media (el blur y las sombras cambian mucho entre plataformas).
