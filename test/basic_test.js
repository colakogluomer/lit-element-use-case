/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {assert} from '@open-wc/testing';

suite('Basic Tests', () => {
  test('should pass basic assertion', () => {
    assert.equal(1 + 1, 2);
  });

  test('should handle arrays', () => {
    const arr = [1, 2, 3];
    assert.equal(arr.length, 3);
  });

  test('should handle objects', () => {
    const obj = {name: 'test', value: 42};
    assert.equal(obj.name, 'test');
    assert.equal(obj.value, 42);
  });
});
