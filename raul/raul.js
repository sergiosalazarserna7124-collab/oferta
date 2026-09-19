/* Propuesta para Raúl — calculadora de gerentes y animaciones al entrar en vista */
(function () {
  'use strict';

  var SUELDO = 25000;
  var fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  var money = function (n) { return fmt.format(n).replace('MX', ''); };

  var ranges = Array.prototype.slice.call(document.querySelectorAll('.proj-range'));
  var grids  = Array.prototype.slice.call(document.querySelectorAll('[data-bind-grid="mgr"]'));

  function bind(name, value) {
    document.querySelectorAll('[data-bind="' + name + '"]').forEach(function (el) { el.textContent = value; });
  }

  function render(n) {
    n = Math.max(1, Math.min(10, n | 0));

    ranges.forEach(function (r) {
      r.value = n;
      r.style.setProperty('--fill', ((n - 1) / 9 * 100) + '%');
    });

    bind('n', n);
    bind('total', money(SUELDO * n));
    bind('year', money(SUELDO * n * 12));
    bind('nMinus1', n - 1);
    bind('saving', money(SUELDO * (n - 1)));
    bind('savingYear', money(SUELDO * (n - 1) * 12));
    document.documentElement.style.setProperty('--x', n);

    grids.forEach(function (g) {
      var html = '';
      for (var i = 0; i < n; i++) html += '<div class="mgr"><span>👔</span><small>$25k</small></div>';
      g.innerHTML = html;
    });
  }

  ranges.forEach(function (r) {
    r.addEventListener('input', function () { render(parseInt(r.value, 10)); });
  });
  render(ranges.length ? parseInt(ranges[0].value, 10) : 4);

  /* animaciones que arrancan cuando el panel entra en pantalla */
  var canvas = document.getElementById('canvas');
  var panels = document.querySelectorAll('.panel');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { root: canvas, threshold: 0.45 });
    panels.forEach(function (p) { io.observe(p); });
  } else {
    panels.forEach(function (p) { p.classList.add('in-view'); });
  }
})();
