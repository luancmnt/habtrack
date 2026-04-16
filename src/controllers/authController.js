const authService = require('../services/authService');

function register(req, res, next) {
  try {
    const result = authService.registerUser(req.body);
    return res.status(201).json({
      message: 'Usuario cadastrado com sucesso.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

function login(req, res, next) {
  try {
    const result = authService.loginUser(req.body);
    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

function logout(req, res, next) {
  try {
    const token = req.token;
    authService.logoutUser(token);

    return res.status(200).json({
      message: 'Logout realizado com sucesso.',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
};
