(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const film = document.getElementById('hero-film');
  const motionButton = document.getElementById('motion-toggle');
  const motionLabel = motionButton.querySelector('.motion-label');
  const motionIcon = motionButton.querySelector('.motion-icon');
  let manuallyPaused = false;
  let motionAllowed = !reducedMotion.matches;
  let heroVisible = true;
  motionButton.hidden = reducedMotion.matches;

  function updateMotionUI(playing) {
    motionLabel.textContent = playing ? 'Pause film' : 'Play film';
    motionIcon.textContent = playing ? 'Ⅱ' : '▶';
    motionButton.setAttribute('aria-label', playing ? 'Pause background film' : 'Play background film');
    motionButton.setAttribute('aria-pressed', String(playing));
  }
  async function playFilm() {
    if (!motionAllowed) return;
    if (!film.getAttribute('src')) film.src = film.dataset.src;
    try { await film.play(); } catch { updateMotionUI(false); }
  }
  film.addEventListener('playing', () => { film.classList.add('is-playing'); updateMotionUI(true); });
  film.addEventListener('pause', () => updateMotionUI(false));
  film.addEventListener('error', () => {
    film.classList.remove('is-playing');
    motionLabel.textContent = 'Still image';
    motionButton.setAttribute('aria-label', 'Background film unavailable; still image displayed');
    motionButton.disabled = true;
  });
  motionButton.addEventListener('click', () => {
    if (film.paused) { motionAllowed = true; manuallyPaused = false; playFilm(); }
    else { manuallyPaused = true; film.pause(); }
  });
  reducedMotion.addEventListener('change', () => {
    motionAllowed = !reducedMotion.matches;
    motionButton.hidden = reducedMotion.matches;
    if (!motionAllowed) { film.pause(); film.classList.remove('is-playing'); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) film.pause();
    else if (heroVisible && motionAllowed && !manuallyPaused && film.getAttribute('src')) playFilm();
  });

  if ('IntersectionObserver' in window) {
    if (!reducedMotion.matches) {
      document.documentElement.classList.add('motion-ready');
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
      }, { threshold: 0.06, rootMargin: '0px 0px -15px 0px' });
      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
    const heroObserver = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      if (!heroVisible) film.pause();
      else if (film.getAttribute('src') && motionAllowed && !manuallyPaused && !document.hidden) playFilm();
    }, { threshold: 0.02 });
    heroObserver.observe(document.querySelector('.hero'));
    let pastHero = false, atEnquiry = false;
    const mobileCTA = document.querySelector('.mobile-cta');
    const syncCTA = () => mobileCTA.classList.toggle('is-visible', pastHero && !atEnquiry);
    new IntersectionObserver(entries => { pastHero = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0; syncCTA(); }).observe(document.querySelector('.hero'));
    new IntersectionObserver(entries => { atEnquiry = entries[0].isIntersecting; syncCTA(); }, { threshold: 0.01 }).observe(document.getElementById('enquire'));
  }
  window.addEventListener('load', () => {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (motionAllowed && !saveData && window.innerWidth > 640 && heroVisible) {
      if ('requestIdleCallback' in window) requestIdleCallback(playFilm, { timeout: 2200 });
      else window.setTimeout(playFilm, 800);
    }
  }, { once: true });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('a').focus();
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { setMenu(false); menuButton.focus(); }
    if (event.key === 'Tab' && !menu.hidden) {
      const links = [...menu.querySelectorAll('a'), menuButton];
      const current = links.indexOf(document.activeElement);
      const next = (current + (event.shiftKey ? -1 : 1) + links.length) % links.length;
      event.preventDefault();
      links[next].focus();
    }
  });
  window.matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
