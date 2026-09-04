(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !hasFinePointer) return;

  var root = document.documentElement;
  var layer = null;
  var lastSpawn = 0;
  var activeCount = 0;
  var MAX_ACTIVE = 40;
  var MIN_INTERVAL = 45;

  function isDarkMode() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function ensureLayer() {
    if (layer) return layer;
    layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    document.body.appendChild(layer);
    return layer;
  }

  function spawnSparkle(x, y) {
    if (activeCount >= MAX_ACTIVE) return;
    var el = document.createElement('span');
    el.className = 'sparkle';
    var size = 4 + Math.random() * 5;
    var offsetX = (Math.random() - 0.5) * 18;
    var offsetY = (Math.random() - 0.5) * 18;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = (x + offsetX) + 'px';
    el.style.top = (y + offsetY) + 'px';
    el.style.animationDuration = (0.7 + Math.random() * 0.5) + 's';

    ensureLayer().appendChild(el);
    activeCount++;

    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      if (el.parentNode) el.parentNode.removeChild(el);
      activeCount--;
    }
    el.addEventListener('animationend', cleanup);
    setTimeout(cleanup, 1500);
  }

  window.addEventListener('mousemove', function (e) {
    if (!isDarkMode()) return;
    var now = performance.now();
    if (now - lastSpawn < MIN_INTERVAL) return;
    lastSpawn = now;
    spawnSparkle(e.clientX, e.clientY);
  }, { passive: true });
})();
