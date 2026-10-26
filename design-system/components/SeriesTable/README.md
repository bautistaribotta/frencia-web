Tabla de las series registradas de un ejercicio en el historial, con las columnas fijas del ejercicio.

```jsx
<SeriesTable exercise={granjero} sets={[{ peso: 32, distancia: 40 }, { peso: 36, distancia: 40 }]} />
```

Quien la usa pasa `exercise`, las `sets` en orden, la escala de `intensity` de la sesión (`null` sin columna) y las `prefs` de unidades. Es de solo lectura: un registro histórico no se edita.
