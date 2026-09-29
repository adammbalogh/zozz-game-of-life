// Game of Life: the rules as pure functions (tested in game.test.js), and the page that uses them.
// A classic script, no modules: the page also works when index.html is opened from a file.

// ── the rules ────────────────────────────────────────────────────────────────

// ── the page ─────────────────────────────────────────────────────────────────

if (typeof document !== 'undefined') {
  // Runs in the browser only.
}

// The tests load this file with require().
if (typeof module !== 'undefined') {
  module.exports = {};
}
