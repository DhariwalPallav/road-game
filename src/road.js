import * as THREE from 'three';
import { CONFIG } from './config.js';

const { width, segmentLength: len, segmentCount: count, segmentsBehind } = CONFIG.road;
const total = count * len;
const behind = segmentsBehind * len;
const mod = (a, n) => ((a % n) + n) % n; // JS % can go negative; this fixes it

export function createRoad(scene) {
  const asphalt = new THREE.MeshStandardMaterial({ color: 0x3a3a40 });
  const paint = new THREE.MeshStandardMaterial({ color: 0xe8e8e8 });
  const roadGeo = new THREE.PlaneGeometry(width, len).rotateX(-Math.PI / 2);
  const dashGeo = new THREE.PlaneGeometry(0.2, len * 0.4).rotateX(-Math.PI / 2);

  const segments = [];
  for (let i = 0; i < count; i++) {
    const seg = new THREE.Mesh(roadGeo, asphalt); // shared geometry + material
    const dash = new THREE.Mesh(dashGeo, paint);
    dash.position.y = 0.01;
    seg.position.y = CONFIG.road.y; // just above the ground to avoid flicker
    seg.add(dash);
    scene.add(seg);
    segments.push(seg);
  }

  function update(targetZ) {
    segments.forEach((seg, i) => {
      seg.position.z = targetZ + behind - mod(targetZ + behind + i * len, total);
    });
  }
  return { update };
}