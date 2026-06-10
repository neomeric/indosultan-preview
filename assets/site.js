/* IndoSultan — shared interactions: mobile menu + accessible Products dropdown */
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
})();
