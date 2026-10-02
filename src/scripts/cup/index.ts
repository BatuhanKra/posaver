import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildCup, LEVEL_MAX, LEVEL_MIN } from './geometry';
import { createSteam } from './steam';
import { createOrbit } from './orbit';
import { reduceMotion } from '../smooth';

const FOV = 28;
const DIST = 7;
const PIVOT_Y = 0.35;
const ELEVATION = THREE.MathUtils.degToRad(10);
const ROT_START = -0.3;
const TURNS = 3;
const SAUCER_UNITS = 2;
const FADED_OPACITY = 0.25;

const STEAM_CREMA = new THREE.Color('#e9dcc9');
const STEAM_DARKTONE = new THREE.Color('#b9a58e');
const STEAM_GREEN = new THREE.Color('#8fb86a');
const GREEN_SECTIONS = new Set(['olcum', 'neden-posaver']);

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function initCup() {
  const canvas = document.getElementById('cup-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch {
    canvas.remove();
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;
  const key = new THREE.DirectionalLight(0xfff1dc, 1.5);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe9dcc9, 1.6);
  rim.position.set(3.5, 2.5, -3.5);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, PIVOT_Y + Math.sin(ELEVATION) * DIST, Math.cos(ELEVATION) * DIST);
  camera.lookAt(0, PIVOT_Y, 0);

  const cup = buildCup();
  const steam = createSteam();
  cup.steamAnchor.add(steam.points);
  scene.add(cup.group);
  const orbit = createOrbit();
  scene.add(orbit.group);
  const motion = { prevP: 0, vel: 0, lean: 0 };

  // Hedef (scroll) ve görüntülenen (lerp) durum
  const target = { p: 0, h: 0 };
  const cur = { p: 0, h: 0, opacity: 1 };
  const steamTarget = STEAM_CREMA.clone();
  let W = 0;
  let H = 0;

  function layout(h: number) {
    const mobile = W < 768;
    const ppu = H / (2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    const hero = mobile
      ? { w: 0.62 * W, dx: 0, dy: 0.24 * H }
      : { w: Math.min(0.32 * W, 0.46 * H), dx: 0, dy: 0.345 * H };
    const small = mobile
      ? { w: 0.34 * W, dx: 0, dy: 0.3 * H }
      : { w: Math.min(0.2 * W, 0.3 * H), dx: 0, dy: 0 };
    const e = smooth(0, 1, h);
    const w = THREE.MathUtils.lerp(hero.w, small.w, e);
    return {
      s: w / (SAUCER_UNITS * ppu),
      dx: THREE.MathUtils.lerp(hero.dx, small.dx, e),
      dy: THREE.MathUtils.lerp(hero.dy, small.dy, e),
      ppu,
    };
  }

  let avoidEls: HTMLElement[] = [];
  const collectAvoid = () => {
    avoidEls = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main h1, main h2, main h3, main p, main li, main blockquote, main table, main figcaption, main label, main [data-cup-avoid]',
      ),
    );
  };

  function overlapsText(l: ReturnType<typeof layout>) {
    const hw = SAUCER_UNITS * l.s * l.ppu * 0.5 * 0.8;
    const hh = 0.45 * l.s * l.ppu;
    const cx = W / 2 + l.dx;
    const cy = H / 2 + l.dy;
    for (const el of avoidEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < cy - hh || r.top > cy + hh) continue;
      if (r.right > cx - hw && r.left < cx + hw && r.width > 0 && r.height > 0) return true;
    }
    return false;
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    if (reduceMotion) drawStatic();
  }

  function apply(time: number) {
    const l = layout(cur.h);
    cup.group.scale.setScalar(l.s);
    const bob = reduceMotion ? 0 : Math.sin(time * 0.9) * 0.03;
    cup.group.position.y = PIVOT_Y * (1 - l.s) + bob * l.s;
    cup.group.rotation.y = ROT_START + cur.p * TURNS * Math.PI * 2;
    cup.group.rotation.z = motion.lean;
    cup.group.rotation.x = -motion.lean * 0.35 + (reduceMotion ? 0 : Math.sin(time * 0.7) * 0.012);
    orbit.group.scale.copy(cup.group.scale);
    orbit.group.position.copy(cup.group.position);
    orbit.update(time, -cur.p * 7 * Math.PI * 2, smooth(0.52, 0.78, cur.p), W < 768 ? 0.78 : 1);
    camera.setViewOffset(W, H, -l.dx, -l.dy, W, H);

    const level = THREE.MathUtils.lerp(LEVEL_MAX, LEVEL_MIN, smooth(0, 1, cur.p));
    cup.setLevel(level, 1 - smooth(0.82, 0.97, cur.p));

    steam.uniforms.uTime.value = time;
    steam.uniforms.uScale.value =
      (renderer.getPixelRatio() * H) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2))) * l.s;
    steam.uniforms.uOpacity.value = 0.34 * (1 - 0.5 * smooth(0.75, 1, cur.p));
    steam.uniforms.uColor.value.lerp(steamTarget, 0.04);
    steam.uniforms.uSway.value = motion.lean * 6;
    rim.color.copy(steam.uniforms.uColor.value);
    return l;
  }

  function drawStatic() {
    cur.p = 0;
    cur.h = 0;
    steam.uniforms.uColor.value.copy(STEAM_CREMA);
    apply(3.2);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();
  collectAvoid();

  if (reduceMotion) return;

  // Scroll bağlantıları: sayfa ilerlemesi + hero'dan ortaya geçiş
  gsap.to(target, {
    p: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
  });
  gsap.to(target, {
    h: 1,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  document.querySelectorAll<HTMLElement>('section[data-section]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        if (GREEN_SECTIONS.has(el.dataset.section ?? '')) steamTarget.copy(STEAM_GREEN);
        else if (el.dataset.tone?.startsWith('light')) steamTarget.copy(STEAM_DARKTONE);
        else steamTarget.copy(STEAM_CREMA);
      },
    });
  });
  ScrollTrigger.addEventListener('refresh', collectAvoid);

  let raf = 0;
  let last = performance.now();
  let t = 0;
  let frame = 0;

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    t += dt;
    frame++;
    const k = 1 - Math.exp(-dt * 7);
    cur.p += (target.p - cur.p) * k;
    cur.h += (target.h - cur.h) * k;

    const v = (target.p - motion.prevP) / Math.max(dt, 0.001);
    motion.prevP = target.p;
    motion.vel += (v - motion.vel) * 0.15;
    const wantLean = THREE.MathUtils.clamp(motion.vel * 5, -0.14, 0.14);
    motion.lean += (wantLean - motion.lean) * (1 - Math.exp(-dt * 5));

    const l = apply(t);
    if (frame % 6 === 0) {
      const want = overlapsText(l) ? FADED_OPACITY : 1;
      cur.opacity += (want - cur.opacity) * 0.35;
    }
    canvas.style.opacity = String(cur.opacity.toFixed(3));

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();

  if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__cup = { target, cur, renderer, scene, ScrollTrigger };
}
