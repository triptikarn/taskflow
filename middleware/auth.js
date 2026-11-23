const { verifyToken } = require('../utils/token');

/**
 * Protect a route: requires a valid "Authorization: Bearer <jwt>" header.
 * On success, req.userId holds the authenticated user's id.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const payload = verifyToken(token, process.env.JWT_SECRET);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = payload.sub;
  next();
}

module.exports = requireAuth;
