const authService = require('../services/authService');
const { users } = require('../models/dataStore');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Token Bearer nao informado.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (authService.isTokenRevoked(token)) {
      return res.status(401).json({
        message: 'Token invalido ou expirado.',
      });
    }

    const payload = authService.verifyToken(token);
    const user = users.find((storedUser) => storedUser.id === Number(payload.sub));

    if (!user) {
      return res.status(401).json({
        message: 'Usuario do token nao encontrado.',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    req.token = token;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token invalido ou expirado.',
    });
  }
}

module.exports = authenticate;
