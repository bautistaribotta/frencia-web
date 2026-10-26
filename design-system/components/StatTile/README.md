El número como mensaje: cifra condensada y tabular, rótulo en mayúsculas arriba y la unidad atenuada.

```jsx
<StatTile label="Volumen total" value="12 480" unit="kg" size="lg" delta="+640" deltaDir="up" />
<StatTile label="RIR medio" value="1.8" tone="intensity" size="md" />
```

Tamaños `sm` 30, `md` 44, `lg` 64 y `xl` 84 px. `tone`: `signal` (acero) o `intensity` (ámbar); sin tono, tinta. `delta` + `deltaDir` suman la tendencia (sube en acero, baja en carmín, con flecha de Lucide: corré `lucide.createIcons()`). `green` / `orange` siguen como alias.
