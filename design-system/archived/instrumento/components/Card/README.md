Superficie base: tarjeta plana con hairline que agrupa contenido relacionado.

```jsx
<Card variant="signal">
  <span className="frencia-label">En curso</span>
  <div style={{ font: 'var(--text-data)' }}>Push Pull Legs</div>
</Card>
```

Variantes: `default` (`surface-card` con `border-subtle`), `elevated` (solo para lo que flota: lleva `shadow-md`), `inset` (pozo de datos), `signal` (lo que está en curso) e `intensity` (esfuerzo, PR). `hairline` sube el borde a `border-default`; `interactive` la vuelve tocable. Las variantes marcan estado, nunca decoran. `green` / `orange` siguen como alias.
