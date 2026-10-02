import * as THREE from 'three';

const BEANS = 30;
const LEAVES = 18;

function beanGeometry() {
  const g = new THREE.SphereGeometry(1, 24, 16);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    const z = pos.getZ(i);
    if (y > 0) y *= 1 - 0.5 * Math.exp(-(z * z) / 0.012);
    x *= 0.115;
    y *= 0.055;
    pos.setXYZ(i, x, y, z * 0.078);
  }
  g.computeVertexNormals();
  return g;
}

function leafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.38, 0.18, 0.42, 0.72, 0, 1);
  s.bezierCurveTo(-0.42, 0.72, -0.38, 0.18, 0, 0);
  const g = new THREE.ShapeGeometry(s, 10);
  g.translate(0, -0.5, 0);
  g.scale(0.26, 0.26, 0.26);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, -(x * x) * 2.4 - y * y * 0.6);
  }
  g.computeVertexNormals();
  return g;
}

interface Item {
  r: number;
  y: number;
  speed: number;
  phase: number;
  incline: number;
  spin: THREE.Vector3;
  size: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makeItems(n: number, rMin: number, rMax: number, size: [number, number]): Item[] {
  return Array.from({ length: n }, () => ({
    r: rand(rMin, rMax),
    y: rand(-0.12, 1.1),
    speed: rand(0.05, 0.14) * (Math.random() < 0.5 ? 1 : 0.85),
    phase: Math.random() * Math.PI * 2,
    incline: rand(-0.25, 0.25),
    spin: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)),
    size: rand(size[0], size[1]),
  }));
}

export function createOrbit() {
  const group = new THREE.Group();

  const beanGeo = beanGeometry();
  const leafGeo = leafGeometry();
  const beanMat = new THREE.MeshStandardMaterial({ color: 0x8a5634, roughness: 0.42, metalness: 0.05 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x86b05e, roughness: 0.5, side: THREE.DoubleSide });

  const beans = new THREE.InstancedMesh(beanGeo, beanMat, BEANS);
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, LEAVES);
  beans.frustumCulled = false;
  leaves.frustumCulled = false;
  group.add(beans, leaves);

  const beanItems = makeItems(BEANS, 1.3, 2.5, [0.8, 1.5]);
  const leafItems = makeItems(LEAVES, 1.4, 2.6, [0.8, 1.4]);

  const dummy = new THREE.Object3D();

  function place(mesh: THREE.InstancedMesh, items: Item[], t: number, angle: number, appear: number, radiusK: number, spinSpeed: number) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const th = it.phase + t * it.speed + angle * (0.7 + (i % 5) * 0.12);
      const r = it.r * radiusK;
      dummy.position.set(
        Math.cos(th) * r,
        it.y + Math.sin(th * 1.3 + it.phase) * 0.08 + Math.sin(th) * it.incline,
        Math.sin(th) * r * 0.85,
      );
      dummy.rotation.set(it.spin.x * (t * spinSpeed + th), it.spin.y * (t * spinSpeed + th * 0.7), it.spin.z * (t * spinSpeed));
      dummy.scale.setScalar(it.size * appear);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = appear > 0.01;
  }

  function update(t: number, angle: number, climate: number, radiusK: number) {
    place(beans, beanItems, t, angle, 1 - climate, radiusK, 0.6);
    place(leaves, leafItems, t, angle, climate, radiusK, 0.45);
  }

  function dispose() {
    beanGeo.dispose();
    leafGeo.dispose();
    beanMat.dispose();
    leafMat.dispose();
  }

  return { group, update, dispose };
}
