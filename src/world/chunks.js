import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { createFbm } from './noise.js';

const fbm = createFbm(CONFIG.noise.seed);
const material = new THREE.MeshStandardMaterial({
  color: 0x5f8f4e,
  flatShading: CONFIG.chunk.flatShading,   // NEW: controlled from config
});

// Pure function: world position in, terrain height out.
export function heightAt(x, z) {
  const n = fbm(x, z, CONFIG.noise);
  return ((n + 1) / 2 - 0.4) * CONFIG.chunk.heightScale;
}

// NEW: smooth normals from the height function itself, so chunk edges always agree.
function setSeamlessNormals(geometry, offsetX, offsetZ) {
  const pos = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const e = 1;                                    // sample distance (world units)
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + offsetX;
    const z = pos.getZ(i) + offsetZ;
    const dhdx = (heightAt(x + e, z) - heightAt(x - e, z)) / (2 * e);
    const dhdz = (heightAt(x, z + e) - heightAt(x, z - e)) / (2 * e);
    const n = new THREE.Vector3(-dhdx, 1, -dhdz).normalize();
    normal.setXYZ(i, n.x, n.y, n.z);
  }
  normal.needsUpdate = true;
}

export function createChunk(cx, cz) {
  const { size, segments } = CONFIG.chunk;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const pos = geometry.attributes.position;
  const offsetX = cx * size;
  const offsetZ = cz * size;
  for (let i = 0; i < pos.count; i++) {
    const worldX = pos.getX(i) + offsetX;
    const worldZ = pos.getZ(i) + offsetZ;
    pos.setY(i, heightAt(worldX, worldZ));
  }

  // NEW: flat shading ignores vertex normals, so only compute them for smooth mode
  if (!CONFIG.chunk.flatShading) {
    setSeamlessNormals(geometry, offsetX, offsetZ);
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(offsetX, 0, offsetZ);
  return mesh;
}

// Keeps a square of chunks around the car: creates new ones, disposes old ones.
export function createChunkManager(scene) {
  const chunks = new Map();
  let lastCx = null;
  let lastCz = null;

  function update(x, z) {
    const { size, viewRadius } = CONFIG.chunk;
    const carCx = Math.round(x / size);
    const carCz = Math.round(z / size);

    if (carCx === lastCx && carCz === lastCz) return;
    lastCx = carCx;
    lastCz = carCz;

    for (let cz = carCz - viewRadius; cz <= carCz + viewRadius; cz++) {
      for (let cx = carCx - viewRadius; cx <= carCx + viewRadius; cx++) {
        const key = `${cx},${cz}`;
        if (!chunks.has(key)) {
          const mesh = createChunk(cx, cz);
          scene.add(mesh);
          chunks.set(key, mesh);
        }
      }
    }

    for (const [key, mesh] of chunks) {
      const [cx, cz] = key.split(',').map(Number);
      if (Math.abs(cx - carCx) > viewRadius || Math.abs(cz - carCz) > viewRadius) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        chunks.delete(key);
      }
    }
  }

  return { update };
}