import { } from '../lib/safe-tx-builder'
import { expect, test } from '@jest/globals';

// const sum = require('./sum');

function sum(a,b) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});