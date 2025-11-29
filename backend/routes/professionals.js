const express = require('express');
const router = express.Router();
const path = require('path');
const { readJson, writeJson, dataDir } = require('../utils/fileDb');
const { verifyToken } = require('../utils/token');

const professionalsPath = path.join(dataDir, 'professionals.json');

function withProfessionals() {
  return readJson(professionalsPath, []);
}

router.get('/', (req, res) => {
  const lat = Number(req.query.lat || 37.7749);
  const lng = Number(req.query.lng || -122.4194);
  const professionals = withProfessionals().map((pro) => ({
    ...pro,
    distanceKm: Number(haversine(lat, lng, pro.lat, pro.lng).toFixed(2)),
  }));
  res.json({ professionals });
});

router.get('/search', (req, res) => {
  const term = (req.query.q || '').toLowerCase();
  const professionals = withProfessionals().filter(
    (pro) => pro.name.toLowerCase().includes(term) || pro.type.toLowerCase().includes(term)
  );
  res.json({ professionals });
});

router.get('/:id', (req, res) => {
  const professional = withProfessionals().find((pro) => pro.id === req.params.id);
  if (!professional) {
    return res.status(404).json({ message: 'Professional not found' });
  }
  res.json(professional);
});

router.post('/rate', (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const pros = withProfessionals();
  const idx = pros.findIndex((pro) => pro.id === req.body.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Professional not found' });
  }
  pros[idx].reviews = pros[idx].reviews || [];
  pros[idx].reviews.push({ user: payload.email, text: req.body.text || 'Great service!' });
  pros[idx].rating = Math.min(5, Number(req.body.rating) || pros[idx].rating);
  writeJson(professionalsPath, pros);
  res.json(pros[idx]);
});

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;
