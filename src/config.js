// All tunable numbers live here.
export const CONFIG = {
  cubeSpinSpeed: 0.6, // radians per second (matches old 0.01/frame at 60 FPS)
  maxDt: 0.05,        // seconds; caps the time step after tab switches or lag
  moveSpeed: 3,       // units per second (temporary, for the input test)
  skyColor: 0xbfd8e8,    // also used as fog color so the horizon blends
  groundColor: 0x6a9955,
  fogNear: 30,           // fog starts here (world units)
  fogFar: 200,           // fully fogged here
};

