import * as THREE from 'three';

export const LEVEL_MAX = 0.58;
export const LEVEL_MIN = 0.13;
const GROUNDS_Y = 0.092;

type P = [number, number];

const v2 = (pts: P[]) => pts.map(([x, y]) => new THREE.Vector2(x, y));
const spline = (pts: P[], n: number) => new THREE.SplineCurve(v2(pts)).getPoints(n);

const outerWall: P[] = [
  [0.27, 0],
  [0.3, 0.02],
  [0.35, 0.06],
  [0.44, 0.19],
  [0.52, 0.38],
  [0.555, 0.57],
  [0.56, 0.655],
];
const innerWall: P[] = [
  [0.53, 0.655],
  [0.525, 0.55],
  [0.49, 0.38],
  [0.42, 0.22],
  [0.32, 0.12],
  [0.17, GROUNDS_Y - 0.004],
  [0, GROUNDS_Y - 0.007],
];

const innerSamples = spline(innerWall, 60);

export function innerRadiusAt(y: number): number {
  for (let i = 0; i < innerSamples.length - 1; i++) {
    const a = innerSamples[i];
    const b = innerSamples[i + 1];
    if (y <= a.y && y >= b.y) {
      const t = (a.y - y) / (a.y - b.y || 1);
      return a.x + (b.x - a.x) * t;
    }
  }
  return innerSamples[innerSamples.length - 1].x;
}

function cupProfile(): THREE.Vector2[] {
  const outer = spline(outerWall, 48);
  const rim: THREE.Vector2[] = [];
  for (let i = 1; i <= 6; i++) {
    const a = (i / 7) * Math.PI;
    rim.push(new THREE.Vector2(0.545 + Math.cos(a) * 0.015, 0.655 + Math.sin(a) * 0.015));
  }
  const inner = spline(innerWall, 48).slice(0);
  return [...outer, ...rim, ...inner];
}

function saucerProfile(): THREE.Vector2[] {
  const under = spline(
    [
      [0, -0.075],
      [0.34, -0.075],
      [0.37, -0.06],
      [0.6, -0.03],
      [0.9, 0.03],
      [0.985, 0.07],
    ],
    36,
  );
  const lip: P[] = [
    [0.99, 0.085],
    [0.98, 0.098],
    [0.965, 0.1],
  ];
  const top = spline(
    [
      [0.965, 0.1],
      [0.9, 0.085],
      [0.7, 0.035],
      [0.62, 0.005],
      [0.5, -0.015],
      [0, -0.02],
    ],
    36,
  ).slice(1);
  return [...under, ...v2(lip), ...top];
}

function radialTexture(draw: (g: CanvasRenderingContext2D, s: number) => void, size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function cremaTexture() {
  return radialTexture((g, s) => {
    const r = s / 2;
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, '#1b0e08');
    grad.addColorStop(0.5, '#25130a');
    grad.addColorStop(0.72, '#4a2a16');
    grad.addColorStop(0.88, '#9a6a40');
    grad.addColorStop(0.965, '#b98a58');
    grad.addColorStop(1, '#5e3b21');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  });
}

function groundsTexture() {
  return radialTexture((g, s) => {
    g.fillStyle = '#1e110a';
    g.fillRect(0, 0, s, s);
    const tones = ['#2a1a12', '#3a2415', '#150b06', '#4a2e1b'];
    for (let i = 0; i < 4200; i++) {
      g.fillStyle = tones[(Math.random() * tones.length) | 0];
      g.beginPath();
      g.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 3.2, 0, Math.PI * 2);
      g.fill();
    }
  });
}

function shadowTexture() {
  return radialTexture((g, s) => {
    const r = s / 2;
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, 'rgba(0,0,0,0.26)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  }, 256);
}

export interface Cup {
  group: THREE.Group;
  steamAnchor: THREE.Object3D;
  setLevel(level: number, liquidOpacity: number): void;
  dispose(): void;
}

export function buildCup(): Cup {
  const group = new THREE.Group();

  const ceramic = new THREE.MeshPhysicalMaterial({
    color: 0xf6eee1,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    side: THREE.DoubleSide,
  });

  const cup = new THREE.Group();
  cup.position.y = -0.02;
  const body = new THREE.Mesh(new THREE.LatheGeometry(cupProfile(), 112), ceramic);
  cup.add(body);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.036, 24, 56, Math.PI), ceramic);
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(0.455, 0.36, 0);
  handle.scale.set(1, 1.05, 0.78);
  cup.add(handle);

  const cremaTex = cremaTexture();
  const liquidMat = new THREE.MeshPhysicalMaterial({
    map: cremaTex,
    roughness: 0.1,
    clearcoat: 0.7,
    clearcoatRoughness: 0.15,
    transparent: true,
  });
  const liquid = new THREE.Mesh(new THREE.CircleGeometry(1, 72), liquidMat);
  liquid.rotation.x = -Math.PI / 2;
  cup.add(liquid);

  const groundsTex = groundsTexture();
  const groundsMat = new THREE.MeshStandardMaterial({ map: groundsTex, roughness: 0.95 });
  const grounds = new THREE.Mesh(new THREE.CircleGeometry(1, 56), groundsMat);
  grounds.rotation.x = -Math.PI / 2;
  grounds.position.y = GROUNDS_Y;
  grounds.scale.setScalar(innerRadiusAt(GROUNDS_Y) * 0.97);
  cup.add(grounds);

  const steamAnchor = new THREE.Object3D();
  cup.add(steamAnchor);
  group.add(cup);

  const saucer = new THREE.Mesh(new THREE.LatheGeometry(saucerProfile(), 128), ceramic);
  group.add(saucer);

  const shadowTex = shadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 3.1), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.08;
  group.add(shadow);

  function setLevel(level: number, liquidOpacity: number) {
    liquid.position.y = level;
    liquid.scale.setScalar(innerRadiusAt(level) * 0.985);
    liquidMat.opacity = liquidOpacity;
    liquid.visible = liquidOpacity > 0.01;
    steamAnchor.position.y = level;
  }
  setLevel(LEVEL_MAX, 1);

  return {
    group,
    steamAnchor,
    setLevel,
    dispose() {
      group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      [ceramic, liquidMat, groundsMat, shadowMat].forEach((m) => m.dispose());
      [cremaTex, groundsTex, shadowTex].forEach((t) => t.dispose());
    },
  };
}
