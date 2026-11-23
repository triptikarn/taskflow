const { test } = require('node:test');
const assert = require('node:assert/strict');
const { signToken, verifyToken } = require('../utils/token');

const SECRET = 'test-secret-for-unit-tests';

test('sign + verify round-trips the user id', () => {
  const token = signToken('user-123', SECRET, '1h');
  const payload = verifyToken(token, SECRET);
  assert.equal(payload.sub, 'user-123');
});

test('verify returns null for a tampered token', () => {
  const token = signToken('user-123', SECRET, '1h');
  assert.equal(verifyToken(token + 'x', SECRET), null);
});

test('verify returns null with the wrong secret', () => {
  const token = signToken('user-123', SECRET, '1h');
  assert.equal(verifyToken(token, 'another-secret'), null);
});

test('verify returns null for garbage input', () => {
  assert.equal(verifyToken('not-a-token', SECRET), null);
});
