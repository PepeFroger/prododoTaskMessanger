const jwt = require('jsonwebtoken')
require('dotenv').config()


module.exports = {
  generateToken(id, email, role) {
    return jwt.sign(
      { id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  },
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};