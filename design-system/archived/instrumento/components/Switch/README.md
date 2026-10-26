Interruptor iOS: pista de tinta cuando está encendido, pista `surface-chip` con hairline cuando no.

```jsx
const [on, setOn] = React.useState(true);
<Switch checked={on} onChange={setOn} />
```

Controlado con `checked` / `onChange`. Para ajustes binarios ("Avisar al terminar el descanso", "Usar RPE"). El pulgar toma `text-on-accent` encendido y `text-secondary` apagado, así se lee en los dos temas.
