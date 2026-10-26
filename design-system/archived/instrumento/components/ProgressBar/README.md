Barra de avance: continua o segmentada, una marca por serie como en una escala.

```jsx
<ProgressBar label="Volumen objetivo" value={68} showValue />
<ProgressBar segments={4} value={3} label="Series" showValue />
```

Por defecto el relleno es tinta (`accent`); `tone="signal"` para lo que está en curso y `tone="intensity"` para esfuerzo. `size` `sm` 3 px, `md` 4 px, `lg` 8 px: es una línea, no un tubo. Con `segments` se arma serie por serie; si no, `value` / `max` mueven una barra continua. `green` / `orange` siguen como alias.
