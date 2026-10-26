Casilla cuadrada: marcada es un relleno de tinta con el check; vacía, un borde `border-strong` (3:1 sobre la tarjeta).

```jsx
const [ok, setOk] = React.useState(false);
<Checkbox checked={ok} onChange={setOk} />
<Checkbox checked />  {/* indicador estático, sin onChange */}
```

Controlada con `checked` / `onChange`. Sin `onChange` es un indicador de solo lectura que marca el padre (la aceptación legal marca cada documento al volver de abrirlo). Para confirmaciones dentro de una lista; para ajustes binarios usá `Switch`.
