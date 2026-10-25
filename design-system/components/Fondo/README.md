El fondo de luces de Lume. Va detrás de cada pantalla, absoluto, y todo lo demás flota encima en vidrio.

```jsx
<div style={{ position: 'relative', height: '100%' }}>
  <Fondo posicion="centro" />
  <main style={{ position: 'relative' }}>…</main>
</div>
```

**Las luces no se mueven en la app.** Cada pantalla elige una posición fija según dónde está su contenido, para que nada de texto chico quede sobre la zona clara. La única excepción es el onboarding (`animado`), donde las luces derivan despacio y se desplazan de una posición a la siguiente entre pasos (`Fondo.RECORRIDO`).

| Posición | Dónde cae la luz | Para |
|---|---|---|
| `cumbre` | arriba a la derecha | pestañas, listas, formularios que arrancan bajo el título |
| `centro` | detrás del centro | un control protagonista en vidrio: rueda, regla, esfera, ticket |
| `flanco` | borde derecho, media altura | formularios alineados a la izquierda: acceso, nombre de rutina |
| `base` | sube desde abajo a la izquierda | contenido arriba y CTA abajo a la derecha |
| `velada` | solo en los bordes: abajo a la derecha y arriba a la izquierda | pantallas densas en datos: la serie, el historial, el catálogo |

Todas las pantallas de la app usan intensidad plena; `intensidad="suave"` baja las luces para un caso puntual. Con *Reducir transparencia* las luces bajan solas (`--fondo-ganancia`).

**Regla de lectura (oscuro):** el texto chico va sobre vidrio ahumado o fuera de la luz; detrás de números grandes y del CTA, la luz puede ser fuerte. Se verificó píxel a píxel en todas las pantallas del kit: todo el texto ≥ 4.5:1. En claro, todo pasa en cualquier posición.

En Expo Go: `react-native-svg` con tres `RadialGradient` (no hay blur en RN). Ver `entrega/implementacion.md` y `entrega/fondos.json`.
