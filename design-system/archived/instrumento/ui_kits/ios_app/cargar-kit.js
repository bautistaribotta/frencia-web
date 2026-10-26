// Frencia · Carga las piezas del kit en las previews del Design System.
// Trae cada archivo en orden, transpila los .jsx con Babel y los ejecuta
// como scripts clasicos, igual que <script type="text/babel"> en las
// paginas del kit. Devuelve una promesa que se cumple con todo cargado.
window.cargarKit = function (archivos) {
  return archivos.reduce(function (anterior, archivo) {
    return anterior
      .then(function () { return fetch(archivo); })
      .then(function (r) {
        if (!r.ok) throw new Error('cargar-kit: no se pudo traer ' + archivo);
        return r.text();
      })
      .then(function (fuente) {
        var codigo = /\.jsx$/.test(archivo)
          ? Babel.transform(fuente, { presets: ['react'] }).code
          : fuente;
        var s = document.createElement('script');
        s.text = codigo;
        document.head.appendChild(s);
      });
  }, Promise.resolve());
};
