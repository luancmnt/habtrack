const jwt = require('jsonwebtoken');
const { users, revokedTokens, nextUserId } = require('../models/dataStore');

const JWT_SECRET = process.env.JWT_SECRET || 'habtrack-secret-dev';
const JWT_EXPIRES_IN = '1h';

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function registerUser(payload) {
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    const error = new Error('name, email e password sao obrigatorios.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userExists = users.some((user) => user.email === normalizedEmail);

  if (userExists) {
    const error = new Error('Ja existe usuario cadastrado com este email.');
    error.statusCode = 409;
    throw error;
  }

  const user = {
    id: nextUserId(),
    name: name.trim(),
    email: normalizedEmail,
    password: password.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

function loginUser(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    const error = new Error('email e password sao obrigatorios.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(
    (storedUser) =>
      storedUser.email === normalizedEmail && storedUser.password === password.trim()
  );

  if (!user) {
    const error = new Error('Credenciais invalidas.');
    error.statusCode = 401;
    throw error;
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user),
  };
}

function logoutUser(token) {
  if (token) {
    revokedTokens.add(token);
  }
}

function isTokenRevoked(token) {
  return revokedTokens.has(token);
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  isTokenRevoked,
  verifyToken,
};
