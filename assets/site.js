/* IndoSultan — shared interactions: mobile menu, accessible Products
   dropdown, scroll reveals and stat count-ups (progressive enhancement). */
(function () {
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav-burger');
  if (nav && burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var drop = document.querySelector('.nav-drop');
  var trigger = document.querySelector('.nav-drop-trigger');
  if (drop && trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', function () {
      var open = drop.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) {
        drop.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        drop.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        if (nav) { nav.classList.remove('open'); }
        if (burger) { burger.setAttribute('aria-expanded', 'false'); }
      }
    });
  }

  /* ---- Export chart: hovering a continent row spotlights its route ---- */
  var map = document.querySelector('.reach-map');
  if (map) {
    document.querySelectorAll('.region[data-route]').forEach(function (row) {
      row.addEventListener('mouseenter', function () { map.setAttribute('data-focus', row.dataset.route); });
      row.addEventListener('mouseleave', function () { map.removeAttribute('data-focus'); });
    });
  }

  var motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!motionOK || !('IntersectionObserver' in window)) { return; }

  /* ---- Scroll reveals: tag existing components, stagger siblings ---- */
  var SEL = ['.section .header', '.pillar', '.stat', '.news-card', '.line-card',
    '.op-card', '.soap-card', '.gallery .shot', '.perk', '.app', '.pack',
    '.step', '.timeline-row', '.job', '.news-item', '.news-feature',
    '.brand-card', '.variant', '.prose-2', '.spec-table', '.article-figure',
    '.cap-card', '.glance', '.reach-map', '.vshot'].join(',');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  document.querySelectorAll(SEL).forEach(function (el) {
    var i = 0, sib = el;
    while ((sib = sib.previousElementSibling) && i < 5) {
      if (sib.classList.contains('rv')) { i++; }
    }
    el.style.setProperty('--rvd', (i * 70) + 'ms');
    el.classList.add('rv');
    io.observe(el);
  });

  /* ---- Stat count-up (skips year-like values) ---- */
  function countUp(node, target, fmt) {
    var t0 = null, DUR = 1100;
    function step(ts) {
      if (!t0) { t0 = ts; }
      var p = Math.min(1, (ts - t0) / DUR);
      var eased = 1 - Math.pow(1 - p, 3);
      node.nodeValue = fmt(Math.round(target * eased));
      if (p < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  var sio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) { return; }
      sio.unobserve(en.target);
      var tn = en.target.firstChild;
      if (!tn || tn.nodeType !== 3) { return; }
      var raw = tn.nodeValue.trim();
      var v = parseInt(raw.replace(/,/g, ''), 10);
      if (isNaN(v) || (v >= 1900 && v <= 2100)) { return; }
      var grouped = raw.indexOf(',') !== -1;
      countUp(tn, v, function (n) {
        return grouped ? n.toLocaleString('en-US') : String(n);
      });
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat .v').forEach(function (el) { sio.observe(el); });
})();
