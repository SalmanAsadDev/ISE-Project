const express = require('express');
const router = express.Router();
const { getPlanPath, readJson, writeJson, getUserPath } = require('../utils/fileDb');
const { verifyToken } = require('../utils/token');
const mealTemplates = ['Oatmeal + Berries', 'Grilled Chicken + Veggies', 'Quinoa Salad', 'Greek Yogurt + Nuts'];
const workoutTemplates = ['Full body circuit', 'Upper body strength', 'HIIT sprints', 'Yoga flow'];

router.use((req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.userEmail = payload.email;
  req.planPath = getPlanPath(payload.email);
  req.userPath = getUserPath(payload.email);
  req.planData = readJson(req.planPath, { email: payload.email, mealPlans: [], workoutPlans: [] });
  next();
});

router.get('/', (req, res) => {
  res.json(req.planData);
});

router.post('/meal/auto', (req, res) => {
  const plan = {
    id: `meal-${Date.now()}`,
    goal: req.body.goal || 'balanced',
    days: Array.from({ length: 7 }).map((_, idx) => ({
      day: `Day ${idx + 1}`,
      meals: mealTemplates.slice(0, 3).map((name, mealIdx) => ({
        name,
        calories: 400 + mealIdx * 100,
      })),
    })),
    createdAt: new Date().toISOString(),
  };
  req.planData.mealPlans.push(plan);
  writeJson(req.planPath, req.planData);
  res.json(plan);
});

router.post('/workout/auto', (req, res) => {
  const plan = {
    id: `work-${Date.now()}`,
    focus: req.body.focus || 'general',
    sessions: Array.from({ length: 5 }).map((_, idx) => ({
      name: workoutTemplates[idx % workoutTemplates.length],
      duration: 30 + idx * 10,
    })),
    createdAt: new Date().toISOString(),
  };
  req.planData.workoutPlans.push(plan);
  writeJson(req.planPath, req.planData);
  res.json(plan);
});

router.put('/', (req, res) => {
  req.planData = { ...req.planData, ...req.body };
  writeJson(req.planPath, req.planData);
  res.json(req.planData);
});

router.post('/export', (req, res) => {
  res.json({ filename: `${req.userEmail}_plans.json`, data: req.planData });
});

router.post('/import', (req, res) => {
  if (!req.body || !req.body.data) {
    return res.status(400).json({ message: 'Missing plan data' });
  }
  req.planData = req.body.data;
  writeJson(req.planPath, req.planData);
  res.json({ message: 'Plans imported', plans: req.planData });
});

router.get('/search', (req, res) => {
  const term = (req.query.q || '').toLowerCase();
  const results = [];
  req.planData.mealPlans.forEach((plan) => {
    if (plan.goal.toLowerCase().includes(term)) {
      results.push(plan);
    }
  });
  req.planData.workoutPlans.forEach((plan) => {
    if (plan.focus.toLowerCase().includes(term)) {
      results.push(plan);
    }
  });
  res.json({ results });
});

module.exports = router;
