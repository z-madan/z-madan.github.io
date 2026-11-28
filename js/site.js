/* حركات موقع المحامية زينب علي مدن — Netmara */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  root.classList.add('js');

  /* شاشة التحميل */
  var loader = document.getElementById('loader');
  function hideLoader() { if (loader) { loader.classList.add('done'); setTimeout(function(){ loader.remove(); }, 700); } }
  window.addEventListener('load', function(){ setTimeout(hideLoader, reduce ? 0 : 450); });
  setTimeout(hideLoader, 2500); // احتياط

  /* الترويسة + شريط التقدم */
  var header = document.querySelector('.site-header');
  var bar = document.getElementById('progress');
  var top = document.getElementById('toTop');
  var ring = top && top.querySelector('circle');
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  function onScroll() {
    var y = window.scrollY || 0;
    if (top) {
      top.classList.toggle('show', y > 400);
      var hh = document.documentElement.scrollHeight - window.innerHeight;
      if (ring) ring.style.strokeDashoffset = 182 - 182 * (hh > 0 ? y / hh : 0);
    }
    if (header) header.classList.toggle('scrolled', y > 30);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* خريطة قوقل: تُحمَّل على الموقع المنشور (المعاينة داخل claude.ai تمنع الإطارات الخارجية) */
  var inPreview = /claude|anthropic|usercontent/i.test(location.hostname) || location.protocol === 'file:';
  document.querySelectorAll('.gmap-frame[data-embed]').forEach(function (f) {
    if (inPreview) return;
    function load() {
      if (f.querySelector('iframe')) return;
      var i = document.createElement('iframe');
      i.src = f.dataset.embed; i.loading = 'lazy'; i.title = 'موقع مكتب المحامية زينب علي مدن على خرائط قوقل';
      i.referrerPolicy = 'no-referrer-when-downgrade'; i.allowFullscreen = true;
      f.appendChild(i);
    }
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { load(); o.disconnect(); } }, { rootMargin: '300px' });
      o.observe(f);
    } else load();
  });


  /* تتبع التحويلات في Google Analytics */
  function track(name, params) { try { if (window.gtag) gtag('event', name, params || {}); } catch (e) {} }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a'); if (!a) return;
    var h = a.getAttribute('href') || '';
    var where = { link_text: (a.textContent || '').trim().slice(0, 60), page: location.pathname };
    if (h.indexOf('wa.me') > -1) track('whatsapp_click', where);
    else if (h.indexOf('tel:') === 0) track('phone_call', where);
    else if (h.indexOf('mailto:') === 0) track('email_click', where);
    else if (h.indexOf('google.com/maps') > -1) track('map_directions', where);
    else if (/instagram|tiktok/.test(h)) track('social_click', where);
  }, true);
  var cf = document.getElementById('cform');
  if (cf) cf.addEventListener('submit', function () { track('generate_lead', { method: 'contact_form' }); });

  /* تسميات خلايا الجداول للجوال */
  document.querySelectorAll('table').forEach(function (t) {
    var heads = Array.prototype.map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    t.querySelectorAll('tbody tr').forEach(function (tr) {
      Array.prototype.forEach.call(tr.children, function (td, i) { if (heads[i]) td.setAttribute('data-label', heads[i]); });
    });
  });

  /* ظهور العناصر عند التمرير */
  var groups = [
    ['.sec-head', 'up'], ['.grid > .card', 'up'], ['.steps > .step', 'up'],
    ['.table-wrap', 'up'], ['.table-wrap tbody tr', 'right'],
    ['.photo-frame', 'zoom'], ['.about-text > *', 'left'],
    ['.info-list > *', 'left'], ['.form', 'up'], ['.map-card', 'up'],
    ['.cta-band', 'zoom'], ['details', 'up'], ['.f-grid > div', 'up'], ['.table-note', 'up'], ['.posts > .post', 'up'], ['.gmap', 'up'], ['.pains > .pain', 'zoom'], ['.other-svc > a', 'up'], ['.res-grid > .res', 'up'], ['.article > *', 'up'], ['.art-side > *', 'left'], ['.papers', 'up'], ['.filters', 'up']
  ];
  var items = [];
  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el) {
      if (el.dataset.anim) return;
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(g[0]); });
      el.dataset.anim = g[1];
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 8) * 90 + 'ms';
      items.push(el);
    });
  });
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* عدّاد الأرقام */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = +el.dataset.count, start = null;
    if (reduce) { el.textContent = target; return; }
    el.textContent = '0';
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 1600, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 1100);
  });

  /* ميلان الصورة مع حركة الماوس */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.photo-frame').forEach(function (f) {
      f.addEventListener('mousemove', function (e) {
        var r = f.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        f.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
      });
      f.addEventListener('mouseleave', function () { f.style.transform = ''; });
    });
    /* حركة الماسات مع الماوس في الواجهة */
    var hero = document.querySelector('.hero');
    var dia = document.querySelector('.hero .diamonds');
    if (hero && dia) hero.addEventListener('mousemove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      dia.style.transform = 'translate(' + (x * -30) + 'px,' + (y * -20) + 'px)';
    });
  }

  /* انتقال ناعم بين الصفحات */
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || a.target === '_blank') return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function () { window.location.href = a.getAttribute('href'); }, reduce ? 0 : 280);
    });
  });
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); });
})();
/* الوضع الداكن + تتبع تبديل اللغة */
(function () {
  var b = document.getElementById('themeTg'), root = document.documentElement;
  if (b) b.addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
    if (window.gtag) gtag('event', 'theme_toggle', { theme: t });
  });
  var l = document.querySelector('.lang-sw');
  if (l) l.addEventListener('click', function () { if (window.gtag) gtag('event', 'language_switch', { to: l.getAttribute('hreflang') }); });
})();
