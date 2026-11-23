import { createNoise2D } from 'simplex-noise';

// Seeded random generator: same seed -> same sequence.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createFbm(seed) {
  const noise2D = createNoise2D(mulberry32(seed));
  return function fbm(x, y, { frequency, octaves, lacunarity, gain }) {
    let amp = 1, freq = frequency, sum = 0, norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += noise2D(x * freq, y * freq) * amp;
      norm += amp;
      amp *= gain;        // each octave: less height...
      freq *= lacunarity; // ...and finer detail
    }
    return sum / norm;    // back to -1..1
  };
}