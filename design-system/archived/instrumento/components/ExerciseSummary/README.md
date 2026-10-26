Resumen de una línea del plan de un ejercicio: volumen · intensidad · descanso.

```jsx
<ExerciseSummary exercise={plancha} plan={{ sets: 3, tiempo: 45, intensity: 'RIR', intensityValue: 1, rest: 60 }} />
```

La intensidad va en ámbar y el descanso lleva el ícono de reloj, para no confundirse con un tiempo de trabajo. Quien lo usa pasa `exercise`, `plan` y, si hay distancia, `prefs`. Va debajo del nombre en las filas de un día.
