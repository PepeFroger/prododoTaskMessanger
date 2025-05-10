const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.Unauthorized('Токен не предоставлен');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.Unauthorized('Неверный формат токена');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    next(ApiError.Unauthorized('Недействительный токен'));
  }
};