import gsap from 'gsap';
import { lenis, reduceMotion, scrollToTarget } from './smooth';

const btn = document.getElementById('menu-btn') as HTMLButtonElement | null;
const menu = document.getElementById('menu') as HTMLElement | null;

export function initMenu() {
  if (!btn || !menu) return;

  const items = menu.querySelectorAll<HTMLElement>('.menu__item');
  const clip = { r: 0 };
  let open = false;
  let tl: gsap.core.Timeline | null = null;

  const center = () => {
    const b = btn.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  };
  const maxRadius = (x: number, y: number) =>
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 8;

  const paint = () => {
    const { x, y } = center();
    menu.style.clipPath = `circle(${clip.r}px at ${x}px ${y}px)`;
  };

  function setOpen(next: boolean, after?: () => void) {
    open = next;
    btn!.setAttribute('aria-expanded', String(open));
    btn!.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    tl?.kill();

    if (open) {
      lenis?.stop();
      menu!.classList.add('is-open');
      menu!.removeAttribute('inert');
      const { x, y } = center();
      if (reduceMotion) {
        clip.r = maxRadius(x, y);
        paint();
        gsap.set(items, { opacity: 1, y: 0 });
      } else {
        tl = gsap.timeline();
        tl.fromTo(clip, { r: 0 }, { r: maxRadius(x, y), duration: 0.95, ease: 'power3.inOut', onUpdate: paint }, 0).fromTo(
          items,
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.045 },
          0.4,
        );
      }
      menu!.querySelector<HTMLElement>('.menu__link')?.focus({ preventScroll: true });
    } else {
      menu!.setAttribute('inert', '');
      const done = () => {
        menu!.classList.remove('is-open');
        clip.r = 0;
        paint();
        lenis?.start();
        after?.();
      };
      if (reduceMotion) {
        done();
      } else {
        tl = gsap.timeline({ onComplete: done });
        tl.to(items, { y: -30, opacity: 0, duration: 0.3, ease: 'power2.in', stagger: { each: 0.015, from: 'end' } }, 0).to(
          clip,
          { r: 0, duration: 0.7, ease: 'power3.inOut', onUpdate: paint },
          0.15,
        );
      }
      btn!.focus({ preventScroll: true });
    }
  }

  btn.addEventListener('click', () => setOpen(!open));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  menu.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!a) return;
    const url = new URL(a.href, location.href);
    const samePage = url.pathname === location.pathname && url.hash;
    if (samePage) {
      e.preventDefault();
      history.replaceState(null, '', url.hash);
      setOpen(false, () => scrollToTarget(url.hash));
    } else {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (!open) return;
    const { x, y } = center();
    clip.r = maxRadius(x, y);
    paint();
  });

  paint();
}
