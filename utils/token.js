const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for a user id.
 * @param {string} userId
 * @param {string} secret
 * @param {string} expiresIn e.g. "7d"
 * @returns {string}
 */
function signToken(userId, secret, expiresIn = '7d') {
  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

/**
 * Verify a JWT and return its payload, or null when invalid/expired.
 * @param {string} token
 * @param {string} secret
 * @returns {object|null}
 */
function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

module.exports = { signToken, verifyToken };
