import { createFbm } from './world/noise.js';
import { CONFIG } from './config.js';

const fbm = createFbm(CONFIG.noise.seed);

const size = 256;
const canvas = document.createElement('canvas');
canvas.width = canvas.height = size;
canvas.style.width = '512px';
canvas.style.imageRendering = 'pixelated';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
const img = ctx.createImageData(size, size);

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const n = fbm(x, y, CONFIG.noise); // -1..1
    const v = Math.round((n * 0.5 + 0.5) * 255);
    const i = (y * size + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
}
ctx.putImageData(img, 0, 0);