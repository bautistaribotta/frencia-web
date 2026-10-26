Segunda cara del selector de ejercicios: configura el plan de un ejercicio al agregarlo o editarlo en un día.

```jsx
<ExerciseConfig exercise={banca} plan={{ sets: 4, reps: 8 }} mode="add" onSubmit={guardar} onBack={volver} />
```

Muestra solo los campos que corresponden a los datos del ejercicio (`ExerciseMetrics`): nunca pide peso, y en cardio de una serie no pide descanso. Quien lo usa pasa `exercise`, el `plan` inicial o parcial, `mode` (`add` | `edit`), las `prefs` de unidades y recibe el plan final en `onSubmit` (con `rest: null` cuando el descanso no aplica). Montalo dentro de un contenedor con `position: relative`: el descanso abre su hoja contra ese ancestro.
