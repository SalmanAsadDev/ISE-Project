const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { writeJson, readJson, ensureDirs, dataDir } = require('../backend/utils/fileDb');

describe('fileDb helpers', () => {
  const testFile = path.join(dataDir, 'test.json');

  before(() => {
    ensureDirs();
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });

  it('writes and reads JSON data', () => {
    const payload = { hello: 'world' };
    writeJson(testFile, payload);
    const result = readJson(testFile, {});
    assert.deepStrictEqual(result, payload);
  });

  it('returns fallback when file missing', () => {
    const fallback = { value: 1 };
    const result = readJson(testFile, fallback);
    assert.deepStrictEqual(result, fallback);
  });
});
