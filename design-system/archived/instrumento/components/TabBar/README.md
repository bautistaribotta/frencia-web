Barra inferior translúcida con una acción central opcional.

```jsx
<TabBar value={tab} onChange={setTab}
  items={[
    {value:'home', label:'Inicio', icon:'home'},
    {value:'routines', label:'Rutinas', icon:'layers'},
    {value:'history', label:'Historial', icon:'history'},
    {value:'profile', label:'Perfil', icon:'user'},
  ]}
  fab={{ icon:'plus', label:'Crear' }} />
```

Con `fab`, las pestañas se reparten a los dos lados de un botón cuadrado de tinta. Los rótulos van en sentence case; la activa pasa a `text-primary` con una marca de 2 px arriba, el resto queda en `text-tertiary`.
