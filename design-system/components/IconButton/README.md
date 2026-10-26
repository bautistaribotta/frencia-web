Botón de solo icono para barras, navegación y la acción Anterior de la sesión.

```jsx
<IconButton icon="chevron-left" variant="surface" size="lg" aria-label="Anterior" />
```

Variantes: `primary` (tinta), `surface` (hairline sin relleno) y `ghost`. Tamaños `sm` 36, `md` 44 y `lg` 54 px; para tocar, `md` o más. `round` lo hace circular. Siempre con `aria-label`. Pasá el nombre de Lucide en `icon` y corré `lucide.createIcons()` después de montar.
