// Keyboard -> one input state. Touch/gamepad will fill the same object later.
const keys = new Set(); // codes of keys currently held

window.addEventListener('keydown', (e) => keys.add(e.code));
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear()); // avoid "stuck" keys

const held = (...codes) => codes.some((c) => keys.has(c));

export const input = {
  steer: 0,    // -1 (left) .. +1 (right)
  throttle: 0, // -1 (back) .. +1 (forward)

  update() {
    this.steer = (held('KeyD', 'ArrowRight') ? 1 : 0) - (held('KeyA', 'ArrowLeft') ? 1 : 0);
    this.throttle = (held('KeyW', 'ArrowUp') ? 1 : 0) - (held('KeyS', 'ArrowDown') ? 1 : 0);
  },
};