(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    if (!reducedMotion.matches) {
      document.documentElement.classList.add('motion-ready');
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
      }, { threshold: 0.06, rootMargin: '0px 0px -15px 0px' });
      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
    let pastHero = false, atEnquiry = false;
    const mobileCTA = document.querySelector('.mobile-cta');
    const syncCTA = () => { const visible = pastHero && !atEnquiry; mobileCTA.classList.toggle('is-visible', visible); mobileCTA.setAttribute('aria-hidden', String(!visible)); mobileCTA.querySelector('a').tabIndex = visible ? 0 : -1; };
    new IntersectionObserver(entries => { pastHero = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0; syncCTA(); }).observe(document.querySelector('.hero'));
    new IntersectionObserver(entries => { atEnquiry = entries[0].isIntersecting; syncCTA(); }, { threshold: 0.01 }).observe(document.getElementById('enquire'));
  }
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
