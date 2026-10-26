Paso numérico para cargar reps y peso: valor condensado y tabular entre − y +, separados por hairlines.

```jsx
const [peso, setPeso] = React.useState(82.5);
<Stepper label="Peso" value={peso} onChange={setPeso} step={2.5} precision={1} unit="kg" size="lg" />
```

Controlado con `value` / `onChange`. `step={2.5}` con `precision={1}` para discos; `step={1}` para reps. `min` / `max` limitan y deshabilitan los botones.

`format` cambia el número por un texto: el de esfuerzo usa `min={-1}` y `format={(v) => v < 0 ? 'Fallo' : String(v)}`, así el fallo queda un paso debajo de RIR 0. `fullWidth` lo estira (en la configuración del ejercicio, series y reps van lado a lado).
