Una serie registrada: número · carga × reps · RIR · marca de hecha. La unidad mínima del registro.

```jsx
<SetRow index={1} load={82.5} reps={8} rir={2} state="done" onToggle={fn} />
<SetRow index={2} load={82.5} reps={8} state="active" onToggle={fn} />
```

Estados: `pending` (valores en `text-secondary`), `active` (hairline de acero y el número en `signal-text`) y `done` (círculo de tinta con el check). Los números van condensados y tabulares; el RIR, en ámbar y en mayúsculas. Apilá las filas de un ejercicio con 8 px entre sí.
