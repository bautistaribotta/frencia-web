Indicador de carga: el **círculo clásico**. Una pista en `data-track` y un tramo en tinta que gira, una vuelta cada **1,2 s**, lineal. Es simple a propósito: no compite con el contenido que está por aparecer.

```jsx
<Cargando texto="Cargando rutinas…" />
<Cargando tam="lg" />   {/* arrastrar para actualizar */}
```

- `sm` 16 px: dentro de un botón (el texto del botón se reemplaza por el círculo).
- `md` 20 px: carga de una pantalla o de una lista, con su leyenda debajo.
- `lg` 28 px: arrastrar para actualizar; aparece arriba de la lista mientras se tira y gira al soltar.

Con *Reducir movimiento*, gira tres veces más lento (3,6 s por vuelta).
