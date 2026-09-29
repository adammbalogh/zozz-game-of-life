const test = require('node:test');
const assert = require('node:assert/strict');
const game = require('./game.js');

test('a játék szabályai betölthetők', () => {
  assert.equal(typeof game, 'object');
});
