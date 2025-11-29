const fs = require('fs');
const path = require('path');
const { hashEmail } = require('./crypto');

const dataDir = path.join(__dirname, '..', '..', 'data');
const usersDir = path.join(dataDir, 'users');
const plansDir = path.join(dataDir, 'plans');

function ensureDirs() {
  [dataDir, usersDir, plansDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function getUserPath(email) {
  return path.join(usersDir, `${hashEmail(email)}.json`);
}

function getPlanPath(email) {
  return path.join(plansDir, `${hashEmail(email)}_plans.json`);
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error('Failed to read JSON', filePath, err);
    return fallback;
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write JSON', filePath, err);
    return false;
  }
}

function ensureUser(email) {
  ensureDirs();
  const filePath = getUserPath(email);
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, {
      email,
      role: 'user',
      passwordHash: '',
      salt: '',
      profile: {},
      goals: {},
      diet: [],
      appointments: [],
      progress: [],
      reminders: [],
      analytics: [],
      createdAt: new Date().toISOString(),
    });
  }
  return filePath;
}

module.exports = {
  ensureDirs,
  getUserPath,
  getPlanPath,
  readJson,
  writeJson,
  ensureUser,
  dataDir,
};
