Entrada de distancia con la unidad fija del ejercicio, escritura directa y ajuste ±.

```jsx
<DistanceField label="Distancia" value={5} onChange={setKm} unit="km" fullWidth />
```

Quien lo usa pasa `value` (en la unidad indicada, `null` sin valor) y `onChange`. `unit` es `m` para ejercicios de distancia corta (entero) y `km` o `mi` según la preferencia del usuario (dos decimales). El paso ± es 10 en metros y 0.1 en km/mi salvo que se pase `step`. Misma piel que `Stepper` y `DurationField`.
