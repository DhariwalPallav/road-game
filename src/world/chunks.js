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

// Keeps a square of chunks around the car: creates new ones, disposes old ones.
export function createChunkManager(scene) {
  const chunks = new Map();   // key "cx,cz" -> mesh
  let lastCx = null;
  let lastCz = null;

  function update(x, z) {
    const { size, viewRadius } = CONFIG.chunk;
    // Which chunk is the car in? Chunks are centered on cx * size.
    const carCx = Math.round(x / size);
    const carCz = Math.round(z / size);

    // Same chunk as last frame? Nothing to do.
    if (carCx === lastCx && carCz === lastCz) return;
    lastCx = carCx;
    lastCz = carCz;

    // 1. Create missing chunks inside the square
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

    // 2. Remove chunks outside the square
    for (const [key, mesh] of chunks) {
      const [cx, cz] = key.split(',').map(Number);
      if (Math.abs(cx - carCx) > viewRadius || Math.abs(cz - carCz) > viewRadius) {
        scene.remove(mesh);
        mesh.geometry.dispose();   // free GPU memory (material is shared, so keep it)
        chunks.delete(key);
      }
    }
  }

  return { update };
}