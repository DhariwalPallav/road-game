import { createNoise2D } from 'simplex-noise';
import { CONFIG } from './config.js';

// Small seeded random generator (mulberry32): same seed -> same sequence.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const noise2D = createNoise2D(mulberry32(CONFIG.noise.seed));

const size = 256;
const canvas = document.createElement('canvas');
canvas.width = canvas.height = size;
canvas.style.width = '512px';            // show it bigger
canvas.style.imageRendering = 'pixelated';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
const img = ctx.createImageData(size, size);

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const n = noise2D(x * CONFIG.noise.frequency, y * CONFIG.noise.frequency); // -1..1
    const v = Math.round((n * 0.5 + 0.5) * 255); // remap to 0..255 gray
    const i = (y * size + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
}
ctx.putImageData(img, 0, 0);