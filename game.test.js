const test = require('node:test');
const assert = require('node:assert/strict');
const game = require('./game.js');

test('a játék szabályai betölthetők', () => {
  assert.equal(typeof game, 'object');
});

test('a tábla 30×30-as', () => {
  assert.equal(game.SIZE, 30);
});

test('az új tábla minden sejtje halott', () => {
  const grid = game.createGrid(30, 30);
  assert.equal(grid.length, 30);
  for (const row of grid) {
    assert.equal(row.length, 30);
    assert.ok(row.every((alive) => alive === false));
  }
});

test('nem négyzetes tábla is létrehozható', () => {
  assert.deepEqual(game.createGrid(2, 3), [
    [false, false, false],
    [false, false, false],
  ]);
});

test('a sorok nem közös tömbök', () => {
  const grid = game.createGrid(2, 2);
  assert.notEqual(grid[0], grid[1]);
});

test('kattintásra a halott sejt élő lesz, újabb kattintásra ismét halott', () => {
  const start = game.createGrid(3, 3);
  const once = game.toggleCell(start, 1, 2);
  assert.equal(once[1][2], true);
  const twice = game.toggleCell(once, 1, 2);
  assert.deepEqual(twice, start);
});

test('a váltás csak a kattintott sejtet érinti, és az eredeti táblát nem módosítja', () => {
  const start = game.createGrid(3, 3);
  const next = game.toggleCell(start, 0, 1);
  assert.deepEqual(next, [
    [false, true, false],
    [false, false, false],
    [false, false, false],
  ]);
  assert.deepEqual(start, game.createGrid(3, 3));
});

// A grid from strings: '#' = alive, '.' = dead.
function parse(...rows) {
  return rows.map((row) => [...row].map((ch) => ch === '#'));
}

test('a szomszédok száma: mind a 8 élő szomszéd számít, a sejt saját maga nem', () => {
  const grid = parse('###', '###', '###');
  assert.equal(game.countLiveNeighbours(grid, 1, 1), 8);
  assert.equal(game.countLiveNeighbours(parse('...', '.#.', '...'), 1, 1), 0);
});

test('a tábla széle fal: a sarok legfeljebb 3 szomszédot lát, a túloldal nem számít', () => {
  const full = parse('###', '###', '###');
  assert.equal(game.countLiveNeighbours(full, 0, 0), 3);
  assert.equal(game.countLiveNeighbours(full, 0, 1), 5);
  // Élő sejtek csak a túlsó szélen: körbefordulás esetén a (0,0) sarok szomszédjai lennének.
  assert.equal(game.countLiveNeighbours(parse('..#', '..#', '###'), 0, 0), 0);
});

test('élő sejt 0 vagy 1 élő szomszéddal elpusztul', () => {
  assert.equal(game.nextGeneration(parse('...', '.#.', '...'))[1][1], false);
  assert.equal(game.nextGeneration(parse('#..', '.#.', '...'))[1][1], false);
});

test('élő sejt 2 vagy 3 élő szomszéddal életben marad', () => {
  assert.equal(game.nextGeneration(parse('#.#', '.#.', '...'))[1][1], true);
  assert.equal(game.nextGeneration(parse('#.#', '.#.', '#..'))[1][1], true);
});

test('élő sejt 4 vagy több élő szomszéddal elpusztul', () => {
  assert.equal(game.nextGeneration(parse('#.#', '.#.', '#.#'))[1][1], false);
  assert.equal(game.nextGeneration(parse('###', '###', '###'))[1][1], false);
});

test('halott sejt pontosan 3 élő szomszéddal életre kel', () => {
  assert.equal(game.nextGeneration(parse('#.#', '...', '#..'))[1][1], true);
});

test('halott sejt 2 vagy 4 élő szomszéddal halott marad', () => {
  assert.equal(game.nextGeneration(parse('#.#', '...', '...'))[1][1], false);
  assert.equal(game.nextGeneration(parse('#.#', '...', '#.#'))[1][1], false);
});

test('a villogó függőlegesre fordul, és két lépés után visszatér', () => {
  const start = parse('.....', '.....', '.###.', '.....', '.....');
  const once = game.nextGeneration(start);
  assert.deepEqual(once, parse('.....', '..#..', '..#..', '..#..', '.....'));
  assert.deepEqual(game.nextGeneration(once), start);
});

test('a villogó a tábla szélén is működik', () => {
  const start = parse('...', '###', '...');
  const once = game.nextGeneration(start);
  assert.deepEqual(once, parse('.#.', '.#.', '.#.'));
  assert.deepEqual(game.nextGeneration(once), start);
});

test('a szélre tett minta nem jelenik meg a túloldalon', () => {
  // A felső sorban álló villogó a fal miatt csak két sejtté zsugorodik, alul nem kel életre semmi.
  const next = game.nextGeneration(parse('###', '...', '...', '...'));
  assert.deepEqual(next, parse('.#.', '.#.', '...', '...'));
});

test('a blokk (2×2) nem változik', () => {
  const block = parse('....', '.##.', '.##.', '....');
  assert.deepEqual(game.nextGeneration(block), block);
});

test('az üres tábla üres marad', () => {
  assert.deepEqual(game.nextGeneration(game.createGrid(4, 5)), game.createGrid(4, 5));
});

test('a következő lépés nem módosítja az eredeti táblát', () => {
  const start = parse('.....', '.....', '.###.', '.....', '.....');
  const copy = start.map((row) => [...row]);
  game.nextGeneration(start);
  assert.deepEqual(start, copy);
});
