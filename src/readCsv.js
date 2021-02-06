const fs = require('fs');

module.exports = (path, rowIteratee) =>
  fs
    .readFileSync(path, 'utf8')
    .split('\n')
    .slice(1) // header row
    .forEach(rowIteratee);
