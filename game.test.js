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
