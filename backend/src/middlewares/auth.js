const jwt = require('jsonwebtoken');
const {secret} = require('../config/jwtConfig.js');

const authenticateJWT = (req, res, next) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(403);
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

module.exports = { authenticateJWT };
