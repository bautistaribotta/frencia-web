Control segmentado iOS para alternar vistas hermanas, rangos de tiempo o unidades.

```jsx
const [tab, setTab] = React.useState('semana');
<SegmentedControl fullWidth value={tab} onChange={setTab}
  options={[{value:'semana',label:'Semana'},{value:'mes',label:'Mes'},{value:'año',label:'Año'}]} />
```

Las opciones pueden ser strings o `{value, label, icon}`. La activa se levanta en `surface-card-elevated` con hairline; `accent` la pinta de tinta (reservalo para cuando la elección es el dato, como kg / lb). `fullWidth` lo estira al contenedor.
