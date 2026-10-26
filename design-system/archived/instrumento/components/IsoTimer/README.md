Cronómetro de esfuerzo para isométricos: cuenta hacia arriba con una barra ámbar y la marca del objetivo.

```jsx
<IsoTimer target={45} value={tiempo} onChange={setTiempo} />
```

El flujo es Empezar → Frenar → duración editable. `target` es el objetivo del plan en segundos (sin objetivo no hay barra y se muestra el guion); `value` y `onChange` llevan la duración cargada. `initialPhase` e `initialElapsed` son para maquetas. Frenar es el único relleno ámbar de la pantalla; Empezar va en tinta.
