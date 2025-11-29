const express = require('express');
const path = require('path');
const router = express.Router();
const { verifyToken } = require('../utils/token');
const { dataDir, readJson, writeJson, getUserPath } = require('../utils/fileDb');
const professionalsPath = path.join(dataDir, 'professionals.json');
const logsPath = path.join(dataDir, 'admin_logs.json');

router.use((req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  req.adminEmail = payload.email;
  next();
});

router.get('/professionals', (req, res) => {
  res.json(readJson(professionalsPath, []));
});

router.post('/professionals', (req, res) => {
  const pros = readJson(professionalsPath, []);
  const professional = { ...req.body, id: req.body.id || `pro-${Date.now()}` };
  pros.push(professional);
  writeJson(professionalsPath, pros);
  logAdmin(`Added professional ${professional.name}`);
  res.json(professional);
});

router.delete('/professionals/:id', (req, res) => {
  let pros = readJson(professionalsPath, []);
  const before = pros.length;
  pros = pros.filter((pro) => pro.id !== req.params.id);
  writeJson(professionalsPath, pros);
  logAdmin(`Removed professional ${req.params.id}`);
  res.json({ removed: before !== pros.length });
});

router.get('/users', (req, res) => {
  const fs = require('fs');
  const usersDir = path.join(dataDir, 'users');
  const files = fs.readdirSync(usersDir);
  const users = files.map((file) => {
    const data = readJson(path.join(usersDir, file));
    return { email: data.email, role: data.role, status: data.status || 'active' };
  });
  res.json({ users });
});

router.post('/users/status', (req, res) => {
  const { email, status } = req.body;
  if (!email || !status) {
    return res.status(400).json({ message: 'email and status required' });
  }
  const userPath = getUserPath(email);
  const data = readJson(userPath);
  if (!data) {
    return res.status(404).json({ message: 'User not found' });
  }
  data.status = status;
  writeJson(userPath, data);
  logAdmin(`Set ${email} to ${status}`);
  res.json({ email, status });
});

router.get('/analytics', (req, res) => {
  res.json({ events: readJson(logsPath, []) });
});

router.post('/analytics', (req, res) => {
  const logs = readJson(logsPath, []);
  logs.push({ ...req.body, recordedBy: req.adminEmail });
  writeJson(logsPath, logs.slice(-500));
  res.json({ message: 'Event logged' });
});

function logAdmin(message) {
  const logs = readJson(logsPath, []);
  logs.push({ message, timestamp: new Date().toISOString() });
  writeJson(logsPath, logs.slice(-500));
}

module.exports = router;
