# Direcciones alternativas

El sistema sigue la dirección **Lume** (vidrio sobre luces, un solo color). Antes fue
**instrumento de precisión**, y al elegirla quedaron anotadas otras dos. Ninguna está
aplicada: Instrumento está guardado completo en `archived/instrumento/`, y las otras dos
tienen una demo corta con su paleta, su tipografía y dos pantallas (Inicio y el paso
"¿Cuántos días tiene?" del wizard de crear rutina).

## Instrumento de precisión (anterior)

Archivo: `archived/instrumento/` (README, tokens, componentes y todas las pantallas).

- **Idea.** Un cronógrafo o una balanza de laboratorio: superficies opacas separadas por hairlines, sin brillos.
- **Paleta.** Grafito y marfil, tinta para la acción, acero `steel-400` como única señal, ámbar para el esfuerzo.
- **Por qué se dejó.** El ámbar se leía genérico, y la calma total del sistema lo volvía frío. Lume conserva su tipografía, sus lecturas (escala, esfera, regla, ticket) y la tinta en lo hecho, y suma la luz.
- **Exploraciones de la transición** (variantes del color de intensidad y el primer setup con gradiente): `archived/instrumento/components/VariantesIntensidad/` y `ExploracionGradiente/`.

## Lujo editorial

Demo: `components/DireccionLujoEditorial/preview.html`.

- **Idea.** Un diario de entrenamiento, no una app. Papel marfil, tinta espresso y una serif de alto contraste. Se siente como una revista de moda o la carta de un hotel.
- **Paleta.** Marfil `#F2EBDD`, espresso `#16120E`, champagne `#B8955A` (un solo uso por pantalla), bronce `#8A6A36`, oxblood `#7A2323` para el peligro.
- **Tipografía.** Bodoni Moda para titulares y números grandes, Hanken Grotesk para la interfaz, rótulos espaciados en mayúsculas.
- **Forma.** Esquinas casi rectas (2 px), filas separadas por filetes, ninguna tarjeta con sombra.
- **Qué cuesta.** La serif choca con el icono condensado y se lee más lento a un metro, entre series. Es la más lujosa y la menos deportiva.

## Atlético premium

Demo: `components/DireccionAtleticoPremium/preview.html`.

- **Idea.** Negro y blanco puros, una condensada en itálica que corre y un solo color para la acción. Se siente cara por contundencia, no por calma.
- **Paleta.** Negro `#000000`, panel `#141414`, blanco `#FFFFFF` y un rojo de competición `#E1251B`. Se planteó con un acento frío; la demo usa rojo para distinguirla de las demás. Si se retoma, vale probar un petróleo profundo.
- **Tipografía.** Barlow Condensed en itálica para titulares y números, Barlow para la interfaz. Es pariente del icono.
- **Qué cuesta.** El rojo compite con los errores y la itálica cansa en pantallas largas, como el historial.

## Si se retoma una

Los tokens semánticos (`accent`, `signal`, `intensity`, `danger`, `surface-*`, `text-*`) y
los roles de texto (`--text-*`) no cambian de nombre: girar de dirección es cambiar valores
en `tokens.json`, las fuentes en `fonts/` y los roles en `components/bundle.css`. Los
componentes no eligen colores ni fuentes por su cuenta.
