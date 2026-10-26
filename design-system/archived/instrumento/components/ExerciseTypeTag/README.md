Tipo de ejercicio con ícono y texto, nunca solo color, y opcionalmente los datos que registra.

```jsx
<ExerciseTypeTag exercise={cinta} />
<ExerciseTypeTag kind="fuerza" variant="chip" />
```

Pasá `exercise` para que liste sus datos (`TIEMPO · DIST.`) o solo `kind`. `variant="inline"` en listas y `chip` en cabeceras. La fuerza es el caso por defecto: en listas no hace falta marcarla.
