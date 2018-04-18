'use strict';

module.exports = length => {
  if (typeof length === 'undefined') {
    throw new Error('Invalid number length');
  }

  const numbers = [];

  for (let i = 0; i < length; i++) {
    if (i !== 0) {
      // Random number between 0 and 9
      numbers.push(Math.floor((Math.random() * 10) + 0));
    } else {
      // Random number between 1 and 9
      numbers.push(Math.floor((Math.random() * 9) + 1));
    }
  }

  return parseInt(numbers.join(''));
}