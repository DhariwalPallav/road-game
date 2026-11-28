import * as THREE from 'three';
import { CONFIG } from './config.js';
import { input } from './input.js';
import { updateCamera } from './cameraRig.js';
import { createRoad } from './road.js';
import { createChunk, heightAt } from './world/chunks.js';

// 1. Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,                                      // field of view (degrees)
  window.innerWidth / window.innerHeight,  // aspect ratio
  0.1,                                     // near clip
  1000                                     // far clip
);
camera.position.set(0, 2, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. A mesh = geometry + material
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x44aa88 })
);
scene.add(cube);

// 3. Light, sky, fog
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(20, 40, 10);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

scene.background = new THREE.Color(CONFIG.skyColor);
scene.fog = new THREE.Fog(CONFIG.skyColor, CONFIG.fogNear, CONFIG.fogFar);

// Old ground plane and terrain patch are removed: chunks are the ground now.

const road = createRoad(scene);

// NEW: a (2r+1) x (2r+1) grid of terrain chunks around the origin
const r = CONFIG.chunk.gridRadius;
for (let cz = -r; cz <= r; cz++) {
  for (let cx = -r; cx <= r; cx++) {
    scene.add(createChunk(cx, cz));
  }
}

// 4. Game loop with delta time
let last = performance.now();

function frame(now) {
  const dt = Math.min((now - last) / 1000, CONFIG.maxDt);
  last = now;
  input.update();
  cube.position.x += input.steer * CONFIG.moveSpeed * dt;
  cube.position.z -= input.throttle * CONFIG.moveSpeed * dt;

  // NEW: keep the cube sitting on top of the terrain
  cube.position.y = heightAt(cube.position.x, cube.position.z) + 0.5;

  road.update(cube.position.z);

  cube.rotation.x += CONFIG.cubeSpinSpeed * dt;
  cube.rotation.y += CONFIG.cubeSpinSpeed * dt;

  const speed = Math.hypot(input.steer, input.throttle) * CONFIG.moveSpeed;
  updateCamera(camera, cube, dt, speed);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);