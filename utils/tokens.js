const jwt = require('jsonwebtoken');

function signAccessToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  return jwt.sign(payload, secret, { expiresIn });
}

function signRefreshToken(user) {
  const payload = { id: user.id };
  const secret = process.env.JWT_SECRET_REFRESH || process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
}

function verifyRefreshToken(token) {
  const secret = process.env.JWT_SECRET_REFRESH || process.env.JWT_SECRET;
  return jwt.verify(token, secret);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};