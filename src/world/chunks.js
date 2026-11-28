import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { createFbm } from './noise.js';

const fbm = createFbm(CONFIG.noise.seed);
const material = new THREE.MeshStandardMaterial({ color: 0x5f8f4e, flatShading: true });

// Pure function: world position in, terrain height out.
export function heightAt(x, z) {
  const n = fbm(x, z, CONFIG.noise);            // -1..1
  return ((n + 1) / 2 - 0.4) * CONFIG.chunk.heightScale;
}

export function createChunk(cx, cz) {
  const { size, segments } = CONFIG.chunk;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);               // lay flat

  const pos = geometry.attributes.position;
  const offsetX = cx * size;
  const offsetZ = cz * size;
  for (let i = 0; i < pos.count; i++) {
    const worldX = pos.getX(i) + offsetX;
    const worldZ = pos.getZ(i) + offsetZ;
    pos.setY(i, heightAt(worldX, worldZ));
  }
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(offsetX, 0, offsetZ);       // vertices are local, so move the mesh
  return mesh;
}