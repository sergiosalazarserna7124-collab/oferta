/* Lead Master · Oferta — calculadora de fuga, asesor/dueño, embudo sin/con y animaciones al entrar */
(function () {
  'use strict';

  var canvas = document.getElementById('canvas');
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var fmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function setOut(name, value) {
    $all('[data-out="' + name + '"]').forEach(function (el) {
      var txt = typeof value === 'number' ? fmt.format(value) : value;
      if (el.textContent === txt) return;
      el.textContent = txt;
      if (reduce) return;
      el.classList.remove('o-bump');
      void el.offsetWidth; // reinicia la animación
      el.classList.add('o-bump');
    });
  }

  /* ---------- 1 · contador "sin actualizar" del CRM ---------- */
  var crmCounter = $('[data-counter="crm"]');
  var crmTimer = null;
  function startCrmCounter() {
    if (!crmCounter || crmTimer || reduce) return;
    var n = 12;
    crmTimer = setInterval(function () {
      n = n >= 48 ? 12 : n + 1;
      crmCounter.textContent = n;
    }, 650);
  }

  /* ---------- 2 · calculadora: leads pagados sin seguimiento ---------- */
  var rLeads = $('#rLeads');
  var rWorked = $('#rWorked');
  var grid = $('#dotsGrid');
  var dots = [];
  if (grid) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 100; i++) {
      var d = document.createElement('span');
      d.className = 'o-dot';
      d.style.setProperty('--dl', (Math.random() * 3).toFixed(2) + 's');
      frag.appendChild(d);
      dots.push(d);
    }
    grid.appendChild(frag);
  }

  function paintRange(r) {
    var pct = (r.value - r.min) / (r.max - r.min) * 100;
    r.style.setProperty('--fill', pct + '%');
  }

  function updateLeak() {
    if (!rLeads || !rWorked) return;
    var leads = parseInt(rLeads.value, 10);
    var worked = parseInt(rWorked.value, 10);
    var lostShare = (10 - worked) / 10;
    var lostMonth = Math.round(leads * lostShare);
    var lostYear = lostMonth * 12;
    var sales = Math.round(lostYear / 50);

    paintRange(rLeads);
    paintRange(rWorked);
    setOut('leads', leads);
    setOut('worked', String(worked));
    setOut('lostMonth', lostMonth);
    setOut('lostYear', lostYear);
    setOut('sales', sales);

    // de cada 100 puntos, los "perdidos" son los últimos (se ven caer)
    var lostDots = Math.round(lostShare * 100);
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('is-lost', idx >= 100 - lostDots);
    });
  }
  [rLeads, rWorked].forEach(function (r) {
    if (r) r.addEventListener('input', updateLeak);
  });
  updateLeak();

  /* ---------- 4 · asesor / dueño ---------- */
  var role = $('.o-role');
  var day = $('.o-day');
  if (role && day) {
    $all('.o-role-btn', role).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-role');
        role.setAttribute('data-role', v);
        day.setAttribute('data-view', v);
        $all('.o-role-btn', role).forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      });
    });
  }

  /* ---------- 6 · embudo sin / con Lead Master ---------- */
  var funnel = $('.o-funnel-card');
  var userTouchedFunnel = false;
  function setFunnel(mode) {
    if (!funnel) return;
    funnel.setAttribute('data-mode', mode);
    $all('.o-sw-btn', funnel).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
    $all('.o-fn b', funnel).forEach(function (b) {
      b.textContent = mode === 'con' ? b.getAttribute('data-v') : '¿?';
    });
  }
  if (funnel) {
    $all('.o-sw-btn', funnel).forEach(function (b) {
      b.addEventListener('click', function () {
        userTouchedFunnel = true;
        setFunnel(b.getAttribute('data-mode'));
      });
    });
    setFunnel('sin');
  }

  /* ---------- 2 · la carrera: repartir a mano vs. contestar primero ---------- */
  var race = $('#race');
  var raceTimers = [];
  function runRace() {
    if (!race) return;
    raceTimers.forEach(clearTimeout);
    raceTimers = [];
    var items = $all('[data-at]', race);
    race.classList.remove('is-done');
    if (reduce) {
      items.forEach(function (el) { el.classList.add('on'); });
      race.classList.add('is-done');
      return;
    }
    items.forEach(function (el) { el.classList.remove('on'); });
    items.forEach(function (el) {
      raceTimers.push(setTimeout(function () { el.classList.add('on'); }, parseInt(el.getAttribute('data-at'), 10) + 150));
    });
    raceTimers.push(setTimeout(function () { race.classList.add('is-done'); }, 8600));
  }
  var raceLoop = null;
  function startRace() {
    if (!race || raceLoop) return;
    runRace();
    if (!reduce) raceLoop = setInterval(runRace, 13500);
  }

  /* ---------- precio según asesores ---------- */
  var BASE = 197, INCL = 5, EXTRA = 7;
  var seats = INCL;
  function renderPrice() {
    setOut('seats', String(seats));
    setOut('price', BASE + Math.max(0, seats - INCL) * EXTRA);
  }
  $all('.o-step-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      seats = Math.max(1, Math.min(200, seats + parseInt(b.getAttribute('data-seats'), 10)));
      renderPrice();
    });
  });

  /* ---------- paneles que entran en pantalla ---------- */
  function onEnter(panel) {
    if (panel.querySelector('[data-counter="crm"]')) startCrmCounter();
    if (race && panel.contains(race)) startRace();
    if (funnel && panel.contains(funnel) && !userTouchedFunnel) {
      setTimeout(function () { if (!userTouchedFunnel) setFunnel('con'); }, reduce ? 0 : 1600);
    }
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !e.target.classList.contains('in-view')) {
          e.target.classList.add('in-view');
          onEnter(e.target);
        }
      });
    }, { root: canvas, threshold: 0.35 });
    panels.forEach(function (p) { io.observe(p); });
  } else {
    panels.forEach(function (p) { p.classList.add('in-view'); onEnter(p); });
  }
})();
