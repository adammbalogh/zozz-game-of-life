// Game of Life: the rules as pure functions (tested in game.test.js), and the page that uses them.
// A classic script, no modules: the page also works when index.html is opened from a file.

// ── the rules ────────────────────────────────────────────────────────────────

// The board is SIZE × SIZE cells.
const SIZE = 30;

// A grid of rows × cols cells, all dead (false = dead, true = alive).
function createGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

// A new grid in which the given cell is flipped between dead and alive; the original is unchanged.
function toggleCell(grid, row, col) {
  return grid.map((cells, r) => (r === row ? cells.map((alive, c) => (c === col ? !alive : alive)) : cells));
}

// ── the page ─────────────────────────────────────────────────────────────────

if (typeof document !== 'undefined') {
  // Runs in the browser only.
  let grid = createGrid(SIZE, SIZE);

  const board = document.createElement('div');
  board.className = 'board';
  board.setAttribute('role', 'group');
  board.setAttribute('aria-label', 'Játéktábla');

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute('aria-label', `Sejt: ${row + 1}. sor, ${col + 1}. oszlop`);
      cell.setAttribute('aria-pressed', 'false');
      board.append(cell);
    }
  }

  // One listener for the whole board: a click flips the clicked cell.
  board.addEventListener('click', (event) => {
    const cell = event.target.closest('.cell');
    if (!cell) return;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    grid = toggleCell(grid, row, col);
    const alive = grid[row][col];
    cell.classList.toggle('alive', alive);
    cell.setAttribute('aria-pressed', String(alive));
  });

  document.getElementById('app').append(board);
}

// The tests load this file with require().
if (typeof module !== 'undefined') {
  module.exports = { SIZE, createGrid, toggleCell };
}
