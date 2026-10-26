Botón de Frencia. La acción principal es tinta, no color: marfil sobre grafito en oscuro, casi negro sobre marfil en claro.

```jsx
<Button variant="primary" size="lg" icon="play" fullWidth>Empezar entrenamiento</Button>
```

Variantes: `primary` (tinta, una por pantalla), `secondary` (hairline sin relleno), `ghost` (solo texto, para Atrás y Cancelar), `soft` (texto en acero: Saltar serie, Deshacer), `intensity` (ámbar: PR o Frenar un cronómetro de esfuerzo, con mucha mesura) y `danger` (delineado en carmín, para Eliminar o Descartar). Tamaños `sm` 36 px, `md` 44 px y `lg` 54 px; en pies de pantalla y wizards va `lg` con `fullWidth`. Pasá nombres de Lucide en `icon` / `iconRight` y corré `lucide.createIcons()` después de montar. Deshabilitado no baja la opacidad: pasa a `surface-chip` con `text-disabled`.
