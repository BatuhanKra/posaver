import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uSway;
  attribute vec3 aSeed;
  varying float vAlpha;

  void main() {
    float speed = 0.1 + aSeed.z * 0.07;
    float t = fract(uTime * speed + aSeed.x);
    float ang = aSeed.y * 6.2831853;
    float r = sqrt(aSeed.z) * 0.1 * (0.4 + t);
    vec3 p = vec3(cos(ang) * r, t * 0.95, sin(ang) * r);
    p.x += sin(t * 7.0 + aSeed.x * 24.0) * 0.12 * t;
    p.z += cos(t * 5.0 + aSeed.y * 24.0) * 0.07 * t;
    p.x += uSway * t * t * 1.4;
    vAlpha = smoothstep(0.0, 0.14, t) * (1.0 - smoothstep(0.5, 1.0, t));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (0.075 + t * 0.2) * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

export interface Steam {
  points: THREE.Points;
  uniforms: {
    uTime: { value: number };
    uScale: { value: number };
    uSway: { value: number };
    uColor: { value: THREE.Color };
    uOpacity: { value: number };
  };
  dispose(): void;
}

export function createSteam(count = 130): Steam {
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));

  const uniforms = {
    uTime: { value: 0 },
    uScale: { value: 1 },
    uSway: { value: 0 },
    uColor: { value: new THREE.Color('#e9dcc9') },
    uOpacity: { value: 0.5 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  return {
    points,
    uniforms,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
