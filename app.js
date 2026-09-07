/* Lead Master · Propuesta — navegación del tablero horizontal */
(function () {
  'use strict';

  var canvas   = document.getElementById('canvas');
  var progress = document.getElementById('progressBar');
  var chips    = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var panels   = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  /* ---------- respetar "reducir movimiento": congela también la cuerda (SMIL) ---------- */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var svg = document.querySelector('.ferrari-svg');
    if (svg && svg.pauseAnimations) svg.pauseAnimations();
  }

  /* ---------- ir a un panel (animación propia: el snap del navegador
       pelea con scrollTo({behavior:'smooth'}) en contenedores horizontales) ---------- */
  var animId = null;   // id del temporizador de la animación

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateTo(target, duration) {
    if (animId) clearTimeout(animId);
    var max = canvas.scrollWidth - canvas.clientWidth;
    target = Math.max(0, Math.min(max, target));
    var start = canvas.scrollLeft;
    var delta = target - start;
    if (Math.abs(delta) < 1) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.scrollLeft = target;
      return;
    }

    var dur = duration || Math.min(900, Math.max(380, Math.abs(delta) * 0.45));
    var t0 = performance.now();
    canvas.style.scrollSnapType = 'none';

    (function step() {
      var t = Math.min(1, (performance.now() - t0) / dur);
      canvas.scrollLeft = start + delta * easeInOutCubic(t);
      if (t < 1) {
        animId = setTimeout(step, 16);
      } else {
        animId = null;
        canvas.style.scrollSnapType = '';
      }
    })();
  }

  function goTo(index) {
    var panel = panels[index];
    if (!panel) return;
    animateTo(panel.offsetLeft - (canvas.clientWidth - panel.offsetWidth) / 2);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-go]');
    if (!btn) return;
    goTo(parseInt(btn.getAttribute('data-go'), 10));
  });

  /* ---------- rueda vertical -> desplazamiento horizontal ---------- */
  function cancelAnim() {
    if (animId) { clearTimeout(animId); animId = null; canvas.style.scrollSnapType = ''; }
  }

  canvas.addEventListener('wheel', function (e) {
    cancelAnim();
    // si el panel puede desplazarse verticalmente y el gesto es claramente vertical, dejarlo pasar
    var scrollablePanel = e.target.closest('.panel');
    if (scrollablePanel && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      var canScrollDown = scrollablePanel.scrollTop + scrollablePanel.clientHeight < scrollablePanel.scrollHeight - 1;
      var canScrollUp = scrollablePanel.scrollTop > 0;
      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) return;
    }
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpad horizontal: nativo
    e.preventDefault();
    canvas.scrollLeft += e.deltaY * 1.15;
  }, { passive: false });

  /* ---------- arrastrar para navegar (tipo Miro) ---------- */
  var dragging = false, startX = 0, startScroll = 0, moved = 0;
  var NO_DRAG = 'button, a, input, textarea, select';

  canvas.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || e.target.closest(NO_DRAG)) return;
    cancelAnim();
    dragging = true; moved = 0;
    startX = e.clientX;
    startScroll = canvas.scrollLeft;
    canvas.classList.add('is-dragging');
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    moved = Math.abs(dx);
    canvas.scrollLeft = startScroll - dx;
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('is-dragging');
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    if (moved > 40) snapToNearest();
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('dragstart', function (e) { e.preventDefault(); });

  function snapToNearest() {
    goTo(currentIndex());
  }

  /* ---------- teclado ---------- */
  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement || {}).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    var i = currentIndex();
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault(); goTo(Math.min(panels.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault(); goTo(Math.max(0, i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault(); goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault(); goTo(panels.length - 1);
    }
  });

  /* ---------- panel actual + barra de progreso ---------- */
  function currentIndex() {
    var center = canvas.scrollLeft + canvas.clientWidth / 2;
    var best = 0, bestDist = Infinity;
    panels.forEach(function (p, i) {
      var pc = p.offsetLeft + p.offsetWidth / 2;
      var d = Math.abs(pc - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    setTimeout(function () {
      var max = canvas.scrollWidth - canvas.clientWidth;
      var pct = max > 0 ? (canvas.scrollLeft / max) * 100 : 0;
      progress.style.width = pct.toFixed(2) + '%';

      var i = currentIndex();
      chips.forEach(function (c, ci) { c.classList.toggle('is-active', ci === i); });

      var activeChip = chips[i];
      if (activeChip && activeChip.parentElement) {
        var nav = activeChip.parentElement;
        var left = activeChip.offsetLeft - nav.clientWidth / 2 + activeChip.offsetWidth / 2;
        nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
      ticking = false;
    }, 16);
  }
  canvas.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
