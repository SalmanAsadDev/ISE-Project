const path = require('path');
const express = require('express');
const router = express.Router();
const { getUserPath, readJson, writeJson, getPlanPath } = require('../utils/fileDb');
const { verifyToken } = require('../utils/token');
const { dataDir } = require('../utils/fileDb');

router.use((req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.userEmail = payload.email;
  req.userRole = payload.role;
  req.userPath = getUserPath(payload.email);
  req.userData = readJson(req.userPath);
  if (!req.userData) {
    return res.status(404).json({ message: 'User not found' });
  }
  next();
});

router.get('/', (req, res) => {
  const { passwordHash, salt, ...safeUser } = req.userData;
  res.json(safeUser);
});

router.put('/', (req, res) => {
  const profile = req.body;
  req.userData.profile = { ...req.userData.profile, ...profile, updatedAt: new Date().toISOString() };
  writeJson(req.userPath, req.userData);
  res.json({ profile: req.userData.profile });
});

router.put('/goals', (req, res) => {
  req.userData.goals = { ...req.userData.goals, ...req.body, updatedAt: new Date().toISOString() };
  writeJson(req.userPath, req.userData);
  res.json({ goals: req.userData.goals });
});

router.post('/diet', (req, res) => {
  const entry = { ...req.body, date: req.body.date || new Date().toISOString() };
  req.userData.diet.push(entry);
  writeJson(req.userPath, req.userData);
  res.json({ diet: req.userData.diet.slice(-30) });
});

router.post('/appointments', (req, res) => {
  const appointment = { ...req.body, id: `appt-${Date.now()}` };
  req.userData.appointments.push(appointment);
  writeJson(req.userPath, req.userData);
  res.json({ appointments: req.userData.appointments });
});

router.post('/progress', (req, res) => {
  const { weight } = req.body;
  const steps = req.body.steps || Math.floor(5000 + Math.random() * 5000);
  const progress = {
    id: `prog-${Date.now()}`,
    weight,
    steps,
    date: req.body.date || new Date().toISOString(),
  };
  req.userData.progress.push(progress);
  writeJson(req.userPath, req.userData);
  res.json({ progress: req.userData.progress.slice(-14) });
});

router.get('/reports', (req, res) => {
  const weekly = req.userData.progress.slice(-7);
  const monthly = req.userData.progress.slice(-30);
  res.json({ weekly, monthly });
});

router.post('/reminders', (req, res) => {
  const reminder = {
    ...req.body,
    id: `rem-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  req.userData.reminders.push(reminder);
  writeJson(req.userPath, req.userData);
  res.json({ reminders: req.userData.reminders });
});

router.post('/analytics', (req, res) => {
  const event = {
    type: req.body.type || 'click',
    label: req.body.label || 'unknown',
    timestamp: new Date().toISOString(),
  };
  req.userData.analytics.push(event);
  writeJson(req.userPath, req.userData);
  res.json({ analytics: req.userData.analytics.slice(-100) });
});

router.get('/analytics', (req, res) => {
  res.json({ analytics: req.userData.analytics.slice(-100) });
});

router.post('/feedback', (req, res) => {
  const feedbackPath = path.join(dataDir, 'feedback.json');
  const feedback = readJson(feedbackPath, []);
  feedback.push({
    email: req.userEmail,
    message: req.body.message,
    rating: req.body.rating || 5,
    createdAt: new Date().toISOString(),
  });
  writeJson(feedbackPath, feedback);
  res.json({ message: 'Feedback saved', feedbackCount: feedback.length });
});

router.delete('/data', (req, res) => {
  const planPath = getPlanPath(req.userEmail);
  req.userData.diet = [];
  req.userData.appointments = [];
  req.userData.progress = [];
  req.userData.reminders = [];
  req.userData.goals = {};
  req.userData.profile = {};
  writeJson(req.userPath, req.userData);
  writeJson(planPath, { email: req.userEmail, mealPlans: [], workoutPlans: [] });
  res.json({ message: 'All user data cleared.' });
});

module.exports = router;
