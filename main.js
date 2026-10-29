(function () {
  var WA = '551137944040';

  var CARS = [
    { id: 'mobi', name: 'Mobi', cat: 'hatch', label: 'Hatch compacto', desc: 'Econômico, ágil e fácil de estacionar no dia a dia da cidade.' },
    { id: 'argo', name: 'Argo', cat: 'hatch', label: 'Hatch', desc: 'Espaço e versatilidade, com versões de câmbio manual e CVT.' },
    { id: 'cronos', name: 'Cronos', cat: 'hatch', label: 'Sedã', desc: 'Porta-malas amplo e conforto pra família inteira.' },
    { id: 'pulse', name: 'Pulse', cat: 'suv', label: 'SUV', desc: 'SUV compacto com motor turbo, também na linha Abarth.' },
    { id: 'fastback', name: 'Fastback', cat: 'suv', label: 'SUV coupé', desc: 'Design marcante de SUV coupé, também na linha Abarth.' },
    { id: 'strada', name: 'Strada', cat: 'picape', label: 'Picape', desc: 'Picape compacta pro trabalho e pro lazer, com cabine dupla.' },
    { id: 'toro', name: 'Toro', cat: 'picape', label: 'Picape', desc: 'Picape com versões turbodiesel e tração 4x4.' },
    { id: 'titano', name: 'Titano', cat: 'picape', label: 'Picape média', desc: 'Turbodiesel 4x4, feita pra carga pesada e estrada.' },
    { id: 'fiorino', name: 'Fiorino', cat: 'util', label: 'Furgão compacto', desc: 'Ágil e econômico, ideal pras entregas urbanas.' },
    { id: 'scudo', name: 'Scudo', cat: 'util', label: 'Furgão médio', desc: 'Versões a diesel com espaço de carga pro seu negócio.' },
    { id: 'ducato', name: 'Ducato', cat: 'util', label: 'Furgão grande', desc: 'O maior da linha, pra carga ou transporte de passageiros.' }
  ];

  var arrow = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // models grid + form options
  var grid = document.getElementById('cars');
  var modSel = document.getElementById('f-mod');
  grid.innerHTML = CARS.map(function (c) {
    return '<article class="car rv" data-cat="' + c.cat + '">' +
      '<div class="car__img"><img src="img/' + c.id + '-720.jpg" srcset="img/' + c.id + '-720.jpg 720w, img/' + c.id + '.jpg 1280w" sizes="(max-width: 640px) 82vw, (max-width: 960px) 48vw, 400px" alt="Fiat ' + c.name + '" loading="lazy" width="720" height="440"></div>' +
      '<div class="car__body"><span class="car__cat">' + c.label + '</span><h3 class="car__name">' + c.name + '</h3><p class="car__desc">' + c.desc + '</p>' +
      '<button class="car__go" type="button" data-model="' + c.name + '">Consultar condições ' + arrow + '</button></div></article>';
  }).join('');
  CARS.forEach(function (c) { var o = document.createElement('option'); o.textContent = c.name; modSel.appendChild(o); });

  // filter
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      var f = ch.dataset.f;
      chips.forEach(function (x) { var on = x === ch; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      grid.querySelectorAll('.car').forEach(function (el) { el.classList.toggle('is-hidden', f !== 'all' && el.dataset.cat !== f); });
      grid.scrollTo({ left: 0 });
    });
  });

  // prefill form from CTAs
  var intSel = document.getElementById('f-int');
  function goForm(interesse, modelo) {
    if (interesse) intSel.value = interesse;
    if (modelo !== undefined) modSel.value = modelo;
    document.getElementById('contato').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () { document.getElementById('f-nome').focus({ preventScroll: true }); }, 600);
  }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.car__go'); if (!b) return;
    goForm('Comprar um 0 km', b.dataset.model);
  });
  document.querySelectorAll('[data-interesse]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); goForm(a.dataset.interesse); });
  });

  // form -> whatsapp
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.nome.value.trim();
    var field = form.nome.closest('.field');
    if (!nome) { field.classList.add('is-err'); form.nome.focus(); return; }
    field.classList.remove('is-err');
    var txt = 'Olá! Meu nome é ' + nome + '. Vim pelo site da Fiat Amazonas Mooca.\n' +
      'Interesse: ' + form.interesse.value +
      (form.modelo.value ? '\nModelo: Fiat ' + form.modelo.value : '') +
      (form.mensagem.value.trim() ? '\n' + form.mensagem.value.trim() : '');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  });
  form.nome.addEventListener('input', function () { form.nome.closest('.field').classList.remove('is-err'); });

  // header
  var hd = document.getElementById('hd');
  var menuBtn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  addEventListener('resize', function () { if (innerWidth > 960 && !menu.hidden) setMenu(false); });

  var ticking = false;
  function onScroll() { hd.classList.toggle('is-scrolled', scrollY > 8); ticking = false; }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // active nav link
  var links = document.querySelectorAll('.hd__nav a');
  var secs = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a, i) { a.classList.toggle('is-on', secs[i] === en.target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) navIO.observe(s); });
  }

  // gentle reveal
  document.querySelectorAll('.sec__head, .way, .steps li, .store, .timeline li, .contact > *, .group__text').forEach(function (el) { el.classList.add('rv'); });
  var rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
  }

  // map loads near viewport
  var map = document.getElementById('map');
  function loadMap() {
    if (map.dataset.done) return; map.dataset.done = 1;
    var f = document.createElement('iframe');
    f.src = map.dataset.src; f.title = 'Mapa da Fiat Amazonas Mooca'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    map.appendChild(f);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { loadMap(); o.disconnect(); } }, { rootMargin: '400px' }).observe(map);
  } else loadMap();
})();
