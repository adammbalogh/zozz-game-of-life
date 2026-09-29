# Game of Life — demo project for zozz-coder

A static page: `index.html`, `style.css`, `game.js`. No build step, no dependencies, no frameworks.

- `game.js` is a classic script (no ES modules), so the page also works when `index.html` is opened
  from a file. Keep the rules (neighbours, next generation, …) in pure functions at the top, the page
  code below them, and export the rules at the bottom for the tests (`module.exports = { … }`).
- Tests: `npm test` (`node --test`, `game.test.js`). Every rule gets a test.
- The page text is Hungarian. Keep it simple and easy to read: this project is a live demo, so each
  card should make a small, clearly visible change.
