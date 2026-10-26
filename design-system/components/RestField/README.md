Campo de descanso entre series que abre una hoja inferior con ruedas de minutos y segundos.

```jsx
<RestField value={120} onChange={setDescanso} />
```

Las ruedas van cada 5 s, hasta 10:55; confirmar 0:00 devuelve `null` y el campo dice "Sin descanso". La hoja se posiciona contra el ancestro con `position: relative`: dáselo al contenedor de la pantalla.
