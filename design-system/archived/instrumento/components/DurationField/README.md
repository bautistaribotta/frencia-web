Entrada de tiempo m:ss o h:mm:ss con escritura directa y ajuste ± step.

```jsx
<DurationField label="Tiempo por serie" value={45} onChange={setSeg} size="lg" fullWidth />
<DurationField label="Tiempo" value={1800} onChange={setSeg} step={60} allowHours size="lg" fullWidth />
```

`value` va en segundos (`null` muestra el formato como placeholder). Usá `step` 5 en isométricos y 60 en cardio; `allowHours` solo en cardio largo, si no el tope es 59:59. El formato esperado aparece a la derecha de la etiqueta.
