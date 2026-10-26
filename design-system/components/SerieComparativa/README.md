Grilla Plan / Anterior / Hoy de una serie, con columnas que salen de los datos del ejercicio.

```jsx
<SerieComparativa exercise={plancha} plan={plan} previous={{ tiempo: 42 }} today={{ tiempo: 47 }} activeKey="tiempo" />
```

Las tres lecturas comparten columnas y tipografía para leerse de arriba hacia abajo. El plan nunca prescribe peso: esa celda queda con el guion. `activeKey` subraya en acero la celda de hoy que se está editando; lo que falta se muestra con el guion.
