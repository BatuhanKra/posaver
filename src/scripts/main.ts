import { initSmooth, scrollToTarget } from './smooth';
import { initMenu } from './menu';
import { initReveal } from './reveal';

initSmooth();

document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!a || a.closest('#menu')) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
  const el = document.querySelector<HTMLElement>(url.hash);
  if (!el) return;
  e.preventDefault();
  scrollToTarget(el);
  history.replaceState(null, '', url.hash);
});

initMenu();
if (document.getElementById('cup-canvas')) import('./cup').then((m) => m.initCup());
initReveal();
