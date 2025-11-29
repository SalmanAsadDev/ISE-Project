const express = require('express');
const router = express.Router();
const { getUserPath, readJson, writeJson, ensureUser, getPlanPath } = require('../utils/fileDb');
const { hashPassword, verifyPassword } = require('../utils/crypto');
const { signToken, verifyToken } = require('../utils/token');

function sanitizeUser(user) {
  const { passwordHash, salt, ...rest } = user;
  return rest;
}

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  ensureUser(email);
  const userPath = getUserPath(email);
  const existing = readJson(userPath);
  if (existing && existing.passwordHash) {
    return res.status(409).json({ message: 'Account already exists.' });
  }
  const { hash, salt } = hashPassword(password);
  const userData = {
    email,
    passwordHash: hash,
    salt,
    role: 'user',
    profile: {},
    goals: {},
    diet: [],
    appointments: [],
    progress: [],
    reminders: [],
    analytics: [],
    createdAt: new Date().toISOString(),
  };
  writeJson(userPath, userData);
  const planPath = getPlanPath(email);
  writeJson(planPath, { email, mealPlans: [], workoutPlans: [] });
  const token = signToken({ email, role: userData.role });
  return res.json({ token, user: sanitizeUser(userData) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  const userPath = getUserPath(email);
  const existing = readJson(userPath);
  if (!existing || !existing.passwordHash) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const valid = verifyPassword(password, existing.passwordHash, existing.salt);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = signToken({ email, role: existing.role });
  return res.json({ token, user: sanitizeUser(existing) });
});

router.get('/verify', (req, res) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ message: 'Missing token' });
  }
  const token = tokenHeader.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  const userPath = getUserPath(payload.email);
  const user = readJson(userPath);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({ user: sanitizeUser(user), token });
});

module.exports = router;
