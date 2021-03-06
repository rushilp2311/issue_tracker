const jwt = require('jsonwebtoken');
const config = require('config');

function adminAuth(req, res, next) {
  const token = req.header('x-auth-token');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    if (!decoded.is_admin)
      return res.status(401).send('Access denied. You are not an admin');
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}

module.exports = {
  auth,
  adminAuth,
};
