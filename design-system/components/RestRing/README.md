Temporizador de descanso: una esfera de 60 marcas con un arco de acero que se vacía, +15 s y Saltar.

```jsx
<RestRing total={90} remaining={64} next="Sigue la serie 3 de 4." onSkip={saltar} onDone={seguir} />
```

Es la única animación continua del sistema. `total` y `remaining` en segundos, `next` dice lo que viene, `running` lo pausa. El arco usa `signal` sobre la pista `data-track`; las marcas que quedan por correr también pasan a `signal`.
