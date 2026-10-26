Chip de métrica para lecturas secundarias: descanso, RIR, ritmo, duración.

```jsx
<MetricPill icon="timer" label="Descanso" value="2:00" tone="signal" />
<MetricPill icon="flame" label="RIR" value="1" tone="intensity" layout="inline" />
```

`tone`: `neutral` (hairline), `signal` (acero, lo que corre ahora) o `intensity` (ámbar). `layout`: `stack` (rótulo sobre valor) o `inline`. Para un número protagonista usá `StatTile`; para un estado, `Badge`. `green` / `orange` siguen como alias.
