(() => {
  'use strict';
  const video = document.getElementById('hero-film');
  const button = document.getElementById('motion-toggle');
  if (!video || !button) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const label = button.querySelector('.motion-label');
  const icon = button.querySelector('.motion-icon');
  let userPaused = false;
  let inView = true;
  button.hidden = reduced.matches;

  function update(playing) {
    label.textContent = playing ? 'Pause film' : 'Play film';
    icon.textContent = playing ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', playing ? 'Pause background film' : 'Play background film');
    button.setAttribute('aria-pressed', String(playing));
  }
  async function play() {
    if (reduced.matches || document.hidden || !inView) return;
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    try { await video.play(); } catch { update(false); }
  }
  video.addEventListener('playing', () => { video.classList.add('is-playing'); update(true); });
  video.addEventListener('pause', () => update(false));
  video.addEventListener('error', () => { video.classList.remove('is-playing'); button.hidden = true; });
  button.addEventListener('click', () => {
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; video.pause(); }
  });
  reduced.addEventListener('change', () => {
    button.hidden = reduced.matches;
    if (reduced.matches) { video.pause(); video.classList.remove('is-playing'); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else if (!userPaused && video.getAttribute('src')) play();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (!inView) video.pause();
      else if (!userPaused && video.getAttribute('src')) play();
    }, { threshold: 0.02 }).observe(document.querySelector('.hero'));
  }
  window.addEventListener('load', () => {
    if (innerWidth <= 640 || navigator.connection?.saveData || reduced.matches) return;
    if ('requestIdleCallback' in window) requestIdleCallback(play, { timeout: 2200 });
    else setTimeout(play, 800);
  }, { once: true });
})();
