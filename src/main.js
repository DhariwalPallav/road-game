import * as THREE from 'three';
import { CONFIG } from './config.js';
import { input } from './input.js';
import { updateCamera } from './cameraRig.js';

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

// 3. Light, sky, fog, ground
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(20, 40, 10);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

scene.background = new THREE.Color(CONFIG.skyColor);
scene.fog = new THREE.Fog(CONFIG.skyColor, CONFIG.fogNear, CONFIG.fogFar);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: CONFIG.groundColor })
);
ground.rotation.x = -Math.PI / 2; // lay it flat
ground.position.y = -0.5;         // the cube's bottom face sits at y = -0.5
scene.add(ground);

// 4. Game loop with delta time
let last = performance.now();

function frame(now) {            // 'now' is passed in by requestAnimationFrame (ms)
  const dt = Math.min((now - last) / 1000, CONFIG.maxDt); // seconds, clamped
  last = now;
  input.update();
  cube.position.x += input.steer * CONFIG.moveSpeed * dt;
  cube.position.z -= input.throttle * CONFIG.moveSpeed * dt; // -z is "forward" in Three.js

  cube.rotation.x += CONFIG.cubeSpinSpeed * dt;
  cube.rotation.y += CONFIG.cubeSpinSpeed * dt;

  const speed = Math.hypot(input.steer, input.throttle) * CONFIG.moveSpeed; // temporary
  updateCamera(camera, cube, dt, speed);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);