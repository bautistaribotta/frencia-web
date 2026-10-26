Reglas y formatos compartidos por los componentes de registro; no es un componente visual.

```js
const M = FrenciaDesignSystem_377129.ExerciseMetrics;
M.clock(95);            // "1:35"
M.summary(ex, plan).text;
```

Define los tipos de ejercicio (`fuerza`, `isometrico`, `cardio`, `hibrido`) con su ícono y escala de intensidad, el orden fijo de las columnas (peso, reps, tiempo, distancia, intensidad), el guion de dato ausente y los formatos de tiempo y distancia. Todo componente de registro arma sus columnas y textos desde acá: no repitas estas reglas en otro lado. Las reglas completas están en la preview `TiposDeEjercicio`.
