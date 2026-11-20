import * as THREE from 'three';
import { CONFIG } from './config.js';

// 1. Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,                                      // field of view (degrees)
  window.innerWidth / window.innerHeight,  // aspect ratio
  0.1,                                     // near clip
  1000                                     // far clip
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. A mesh = geometry + material
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x44aa88 })
);
scene.add(cube);

// 3. Light
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(2, 3, 4);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// 4. Game loop with delta time
let last = performance.now();

function frame(now) {            // 'now' is passed in by requestAnimationFrame (ms)
  const dt = Math.min((now - last) / 1000, CONFIG.maxDt); // seconds, clamped
  last = now;

  cube.rotation.x += CONFIG.cubeSpinSpeed * dt;
  cube.rotation.y += CONFIG.cubeSpinSpeed * dt;

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);