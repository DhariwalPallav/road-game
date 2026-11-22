import * as THREE from 'three';
import { CONFIG } from './config.js';

// Reused every frame so we don't allocate new objects 60 times a second.
const desired = new THREE.Vector3();

export function updateCamera(camera, target, dt, speed) {
  desired.set(
    target.position.x + CONFIG.camOffsetX,
    target.position.y + CONFIG.camOffsetY,
    target.position.z + CONFIG.camOffsetZ
  );
  const t = 1 - Math.exp(-CONFIG.camDamping * dt); // frame-rate independent
  camera.position.lerp(desired, t);
  camera.lookAt(target.position);
  const speedRatio = Math.min(speed / CONFIG.fovSpeedMax, 1); // 0..1
  const targetFov = CONFIG.fovBase + speedRatio * CONFIG.fovBoost;
  camera.fov += (targetFov - camera.fov) * t; // same damping factor
  camera.updateProjectionMatrix();

}