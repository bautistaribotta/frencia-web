Panel de vidrio sobre el Fondo: relleno translúcido, borde `glass-line`, brillo interior (`shadow-glass`) y desenfoque.

```jsx
<Vidrio nivel="fuerte" style={{ padding: 20 }}>…</Vidrio>
<Vidrio pill>Paso 2 de 4</Vidrio>
```

- `normal`: `surface-card` (vidrio ahumado al 42 % en oscuro, blanco al 55 % en claro). Tarjetas, opciones, campos.

Con *Reducir transparencia* (`data-transparencia="reducida"`) los tres niveles pasan a sus versiones `-opaco` y sin desenfoque.
- `fuerte`: `surface-card-elevated`. Lo que se elige o flota.
- `denso`: `surface-raised` + `blur-sheet`. Barra de pestañas, hojas, paneles de wizard.

En Expo Go el desenfoque real (`expo-blur`) va **solo en el cromo**: barras, hojas, paneles de wizard y tab bar. Las tarjetas de una lista son translúcidas sin blur, porque 20 `BlurView` en scroll cuestan cuadros.
