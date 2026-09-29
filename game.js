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

// How many of the 8 neighbours of a cell are alive. The edge of the board is a wall: beyond it there are no cells.
function countLiveNeighbours(grid, row, col) {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (grid[r] && grid[r][c]) count++;
    }
  }
  return count;
}

// The next generation as a new grid; the original is unchanged.
// A live cell stays alive with 2 or 3 live neighbours, a dead cell comes alive with exactly 3.
function nextGeneration(grid) {
  return grid.map((cells, row) =>
    cells.map((alive, col) => {
      const neighbours = countLiveNeighbours(grid, row, col);
      return alive ? neighbours === 2 || neighbours === 3 : neighbours === 3;
    }),
  );
}

// ── the page ─────────────────────────────────────────────────────────────────

if (typeof document !== 'undefined') {
  // Runs in the browser only.
  let grid = createGrid(SIZE, SIZE);

  const board = document.createElement('div');
  board.className = 'board';
  board.setAttribute('role', 'group');
  board.setAttribute('aria-label', 'Játéktábla');

  // cells[row][col] is the button of that cell.
  const cells = [];
  for (let row = 0; row < SIZE; row++) {
    cells.push([]);
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute('aria-label', `Sejt: ${row + 1}. sor, ${col + 1}. oszlop`);
      cell.setAttribute('aria-pressed', 'false');
      board.append(cell);
      cells[row].push(cell);
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

  // Draws the whole grid onto the board.
  function render() {
    grid.forEach((row, r) =>
      row.forEach((alive, c) => {
        cells[r][c].classList.toggle('alive', alive);
        cells[r][c].setAttribute('aria-pressed', String(alive));
      }),
    );
  }

  // The "next step" button moves the board on by one generation.
  const step = document.createElement('button');
  step.type = 'button';
  step.className = 'step';
  step.textContent = 'Következő lépés';
  step.addEventListener('click', () => {
    grid = nextGeneration(grid);
    render();
  });

  document.getElementById('app').append(board, step);
}

// The tests load this file with require().
if (typeof module !== 'undefined') {
  module.exports = { SIZE, createGrid, toggleCell, countLiveNeighbours, nextGeneration };
}
