import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { createFbm } from './noise.js';

export function createTerrainPatch(scene) {
  const { size, segments, heightScale, x: cx, z: cz } = CONFIG.patch;
  const fbm = createFbm(CONFIG.noise.seed);

  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  geo.rotateX(-Math.PI / 2); // lay flat: Y is now height

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const wx = pos.getX(i) + cx; // local -> world coordinates
    const wz = pos.getZ(i) + cz;
    const h = fbm(wx, wz, CONFIG.noise) * 0.5 + 0.5; // remap -1..1 to 0..1
    pos.setY(i, h * heightScale);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({ color: 0x7fae6a, flatShading: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(cx, -0.5 - heightScale * 0.4, cz);
  scene.add(mesh);
  return mesh;
}