// All tunable numbers live here.
export const CONFIG = {
  cubeSpinSpeed: 0.6, // radians per second (matches old 0.01/frame at 60 FPS)
  maxDt: 0.05,        // seconds; caps the time step after tab switches or lag
  moveSpeed: 8,       // units per second (temporary, for the input test)
  skyColor: 0xbfd8e8,    // also used as fog color so the horizon blends
  groundColor: 0x6a9955,
  fogNear: 30,           // fog starts here (world units)
  fogFar: 200,           // fully fogged here

  camOffsetX: 0,     // camera position relative to the cube
  camOffsetY: 2,
  camOffsetZ: 6,
  camDamping: 5,     // higher = stiffer follow, lower = floatier

  fovBase: 60,       // degrees at standstill
  fovBoost: 15,      // extra degrees at top speed
  fovSpeedMax: 8,    // speed at which the full boost applies (matches moveSpeed for now)

  road: { width: 8, segmentLength: 40, segmentCount: 8, segmentsBehind: 2, y: -0.48 },

  noise: { seed: 1, frequency: 0.01, octaves: 4, lacunarity: 2, gain: 0.8 },

  patch: { size: 100, segments: 64, heightScale: 30, x: 70, z: -60 },
};

