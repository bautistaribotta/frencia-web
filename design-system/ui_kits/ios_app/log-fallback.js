// Respaldo: si el bundle todavía no incluye components/log (recién agregados),
// los transpila desde la fuente. No hace nada cuando el bundle ya los trae.
// Stepper va primero y desde data/: ExerciseConfig usa su format y fullWidth,
// que un bundle anterior no tiene.
(function () {
  var NS = (window.FrenciaDesignSystem_377129 = window.FrenciaDesignSystem_377129 || {});
  var files = ['../data/Stepper', 'ExerciseMetrics', 'DurationField', 'DistanceField', 'IsoTimer', 'RestRing', 'SerieComparativa', 'SeriesTable', 'ExerciseSummary', 'ExerciseTypeTag', 'RestField', 'ExerciseConfig'];
  var nameOf = function (f) { return f.split('/').pop(); };
  var script = document.currentScript;
  // Dentro de bundle.js los componentes se exponen al final del script: no hay nada que transpilar.
  if (!script || /bundle\.js/.test(script.src || '') || typeof Babel === 'undefined') { window.__frenciaLogReady = window.__frenciaLogReady || Promise.resolve(); return; }
  var base = script.getAttribute('data-base') || '../../components/src/log/';
  if (files.every(function (f) { return NS[nameOf(f)]; })) { window.__frenciaLogReady = Promise.resolve(); return; }
  window.__frenciaLogReady = Promise.all(files.map(function (f) {
    return fetch(base + f + '.jsx').then(function (r) { return r.text(); }).then(function (src) { return [nameOf(f), src]; });
  })).then(function (list) {
    list.forEach(function (pair) {
      var src = pair[1].replace(/^import[^\n]*\n/gm, '').replace(/^export\s+/gm, '');
      var code = Babel.transform(src, { presets: ['react'] }).code;
      NS[pair[0]] = new Function('React', code + '\nreturn ' + pair[0] + ';')(React);
    });
  });
})();
