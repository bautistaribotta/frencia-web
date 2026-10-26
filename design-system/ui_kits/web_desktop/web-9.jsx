// Frencia Web · 9 Errores: 404 y error inesperado, con la ilustración "Gym" de Storyset.
// La ilustración es un SVG animado (entrada de Storyset + un loop suave propio) con los
// colores pasados a variables (--ilu-*), así sigue al tema. En el producto se importa
// como componente (vite-plugin-svgr o inline); acá se trae con fetch y se inyecta.

let SVG_ILU = null;
const svgIlu = fetch((window.__KIT_BASE__ || '') + 'img/storyset-gym.svg').then((r) => r.text()).then((t) => { SVG_ILU = t; return t; });

function Ilustracion({ chica }) {
  const [svg, setSvg] = React.useState(SVG_ILU);
  React.useEffect(() => { if (!svg) svgIlu.then(setSvg); }, []);
  return (
    <figure className={`w-ilu${chica ? ' w-ilu--chica' : ''}`}>
      <div className="w-ilu__arte" dangerouslySetInnerHTML={{ __html: svg || '' }} />
      <figcaption className="w-ilu__credito"><a href="https://storyset.com/sport">Sport illustrations by Storyset</a></figcaption>
    </figure>
  );
}

const TEXTOS = {
  404: {
    sello: 'Error 404 · Serie no encontrada',
    titulo: 'Esta serie no está en tu rutina.',
    texto: 'La página que buscás no existe o cambió de lugar. Volvé a Inicio y seguí donde la dejaste.',
  },
  500: {
    sello: 'Error 500 · Se cortó la serie',
    titulo: 'Algo falló de nuestro lado.',
    texto: 'Tus datos están a salvo: falló la carga, no se borró nada. Probá de nuevo en un momento.',
  },
  red: {
    sello: 'Sin conexión',
    titulo: 'Te quedaste sin conexión.',
    texto: 'Revisá tu internet. Lo que estabas viendo vuelve apenas haya señal; no se perdió nada.',
  },
};

function PantallaError({ tipo = 404, publica, movil }) {
  const t = TEXTOS[tipo];
  const acciones = tipo === 404
    ? (publica ? <><Boton t="lg" icoDer="arrow-right">Ir a Frencia</Boton><Boton v="secondary" t="lg">Entrar</Boton></> : <><Boton t="lg" ico="house" anima>Volver a Inicio</Boton><Boton v="secondary" t="lg" ico="layers">Ir a mis rutinas</Boton></>)
    : <><Boton t="lg" ico="rotate-ccw" anima>Reintentar</Boton><Boton v="secondary" t="lg" ico="house">Volver a Inicio</Boton></>;
  return (
    <div className={`w-error${movil ? ' w-error--movil' : ''}`}>
      <Ilustracion chica={movil} />
      <div className="w-error__textos">
        <span className="w-error__sello">{t.sello}</span>
        <span className="t-display w-error__titulo">{t.titulo}</span>
        <span className="t-body c-sec">{t.texto}</span>
      </div>
      <div className="w-error__acciones">{acciones}</div>
      {tipo === 500 ? <span className="t-meta c-ter">Código para soporte · FR-500-7C1E2A9B</span> : null}
    </div>
  );
}

function CabezaPublica({ movil }) {
  return (
    <header className={`w-publica__cabeza${movil ? ' w-publica__cabeza--movil' : ''}`}>
      <Marca />
      {movil ? <Boton t="sm" v="secondary" icoDer="arrow-up-right">Abrir en la app</Boton> : <div className="row g3"><Boton v="ghost">Entrar</Boton><Boton v="secondary">Crear cuenta</Boton></div>}
    </header>
  );
}

function AppWeb() {
  return (
    <Lienzo titulo="Errores" bajada="Las páginas de error usan la ilustración Gym (estilo Bro) de Storyset: entra con la animación de Storyset y después queda con un loop suave (la que corre sigue trotando, el que hace plancha baja y sube, las nubes se corren). Los colores salen de los tokens, así que cambia sola con el tema: en claro es tinta sobre marfil con el acento en lume pálido; en oscuro, el trazo pasa a marfil. El mensaje juega con el idioma de la app, sin exclamaciones.">
      <Seccion titulo="Página no encontrada" nota="* (404) — con sesión va dentro de la app, con la navegación lateral, para que se pueda seguir desde ahí. Fondo cumbre: la luz queda arriba a la derecha, lejos del texto.">
        <Mesa nombre="404 con sesión" ruta="* · 404" fondo="cumbre" url="frencia.app/rutinas/no-existe"><App><PantallaError tipo={404} /></App></Mesa>
        <Mesa nombre="404 sin sesión" nota="Por ejemplo, un link viejo que llega desde afuera: sin navegación, con la marca arriba." ruta="* · 404 · pública" fondo="cumbre" url="frencia.app/algo-que-no-existe"><div className="w-publica"><CabezaPublica /><PantallaError tipo={404} publica /></div></Mesa>
        <Mesa nombre="404 en el celular" movil ancho={390} alto={844} ruta="* · 404 · móvil" fondo="cumbre" url="frencia.app/r/XXXX"><div className="w-publica w-publica--movil"><CabezaPublica movil /><PantallaError tipo={404} publica movil /></div></Mesa>
      </Seccion>
      <Seccion titulo="Otros errores" nota="Error inesperado (500) y sin conexión: misma ilustración y mismo esqueleto; la acción principal pasa a Reintentar. El 500 muestra un código corto para soporte.">
        <Mesa nombre="Error inesperado" ruta="errorElement · 500" fondo="cumbre" url="frencia.app/historial"><App activo="history"><PantallaError tipo={500} /></App></Mesa>
        <Mesa nombre="Sin conexión" ruta="errorElement · sin red" fondo="cumbre" url="frencia.app/historial"><App activo="history"><PantallaError tipo="red" /></App></Mesa>
      </Seccion>
    </Lienzo>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<AppWeb />);
