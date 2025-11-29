const path = require('path');
const express = require('express');
const cors = require('cors');
const { ensureDirs, dataDir, getUserPath, writeJson, readJson } = require('./utils/fileDb');
const { hashPassword } = require('./utils/crypto');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const plansRoutes = require('./routes/plans');
const professionalsRoutes = require('./routes/professionals');
const adminRoutes = require('./routes/admin');

const app = express();
ensureDirs();
ensureAdminAccount();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Simple analytics middleware for admin logs
app.use((req, res, next) => {
  res.on('finish', () => {
    if (req.path.startsWith('/api')) {
      const logsPath = path.join(dataDir, 'admin_logs.json');
      const logs = readJson(logsPath, []);
      logs.push({
        route: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        status: res.statusCode,
      });
      writeJson(logsPath, logs.slice(-500));
    }
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/admin', adminRoutes);

const frontendDir = path.join(__dirname, '..', 'frontend');
const fs = require('fs');

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(frontendDir));

// Serve HTML pages directly - check if file exists first
app.get('/pages/:filename', (req, res, next) => {
  const filePath = path.join(frontendDir, 'pages', req.params.filename);
  if (fs.existsSync(filePath) && filePath.endsWith('.html')) {
    return res.sendFile(filePath);
  }
  next();
});

// Catch-all for SPA routing (only for non-file requests)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
    return res.sendFile(path.join(frontendDir, 'index.html'));
  }
  return next();
});

function ensureAdminAccount() {
  const adminEmail = 'admin@local.test';
  const adminPassword = 'AdminPass!123';
  const userPath = getUserPath(adminEmail);
  const existing = readJson(userPath);
  if (existing && existing.passwordHash) {
    return;
  }
  const { hash, salt } = hashPassword(adminPassword);
  writeJson(userPath, {
    email: adminEmail,
    role: 'admin',
    passwordHash: hash,
    salt,
    profile: {
      name: 'Site Admin',
      activityLevel: 'moderate',
    },
    goals: {},
    diet: [],
    appointments: [],
    progress: [],
    reminders: [],
    analytics: [],
    createdAt: new Date().toISOString(),
  });
}

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Fitness app listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
