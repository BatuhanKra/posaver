import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { reduceMotion } from './smooth';

export async function initReveal() {
  if (reduceMotion) return;
  gsap.registerPlugin(SplitText);
  await document.fonts.ready;

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const hero = !!el.closest('#hero');
    SplitText.create(el, {
      type: 'lines',
      autoSplit: true,
      linesClass: 'split-line',
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.09,
          delay: hero ? 0.15 : 0,
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 86%', once: true },
        });
      },
    });
  });

  const vw = window.innerWidth;
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    let x = 0;
    let rotation = 0;
    if (vw >= 768 && r.width < vw * 0.5) {
      if (cx < vw * 0.4) {
        x = -120;
        rotation = -2.5;
      } else if (cx > vw * 0.6) {
        x = 120;
        rotation = 2.5;
      }
    }
    gsap.set(el, { x, y: 56, rotation, scale: 0.95 });
  });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1.2, ease: 'power3.out', stagger: 0.11, overwrite: true }),
  });

  document.querySelectorAll<HTMLElement>('[data-wave]').forEach((wave) => {
    const section = wave.parentElement as HTMLElement;
    const trigger = { trigger: section, start: 'top bottom', end: 'top 15%', scrub: true };
    gsap.fromTo(wave.querySelector('.wave__layer--1'), { xPercent: 0 }, { xPercent: -50, ease: 'none', scrollTrigger: trigger });
    gsap.fromTo(wave.querySelector('.wave__layer--2'), { xPercent: -50 }, { xPercent: 0, ease: 'none', scrollTrigger: trigger });
    gsap.fromTo(wave.querySelector('.wave__layer--3'), { xPercent: -12 }, { xPercent: -62, ease: 'none', scrollTrigger: trigger });
  });

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const fmt = (v: number) => v.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const o = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(o, {
      v: end,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => (el.textContent = fmt(o.v)),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => {
    gsap.fromTo(
      el,
      { '--d': 0 },
      {
        '--d': 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: true },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-formula]').forEach((box) => {
    const net = box.querySelector('[data-f="net"]');
    const steps = box.querySelectorAll('[data-f="step"]');
    gsap
      .timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: box, start: 'top 78%', end: 'bottom 52%', scrub: true },
      })
      .fromTo(net, { opacity: 0, y: 40, scale: 0.94, transformOrigin: 'left center' }, { opacity: 1, y: 0, scale: 1, duration: 1.2 })
      .fromTo(steps, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.35 }, '-=0.2');
  });

  ScrollTrigger.refresh();
}
