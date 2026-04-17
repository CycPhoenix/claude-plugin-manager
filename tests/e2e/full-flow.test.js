'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const FAKE_HOME = path.join(os.tmpdir(), `cpm-e2e-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

// Mock fetcher before importing installer
jest.mock('../../src/core/fetcher', () => ({
  fetchFromUrl: jest.fn()
}));

const { installPlugin } = require('../../src/core/installer');
const { fetchFromUrl } = require('../../src/core/fetcher');

const manifest = {
  name: 'e2e-skill', version: '2.0.0', author: 'testuser',
  description: 'E2E test skill',
  targets: { 'cc-skill': { file: 'skill.md' } }
};

afterAll(() => {
  fs.rmSync(FAKE_HOME, { recursive: true, force: true });
});

test('full flow: URL → fetch → detect → install → verify file on disk', async () => {
  // Stub fetcher to avoid real network call
  fetchFromUrl.mockResolvedValueOnce({
    manifest,
    files: {
      'skill.md': Buffer.from('# E2E Skill\nThis is the skill content.'),
      'manifest.json': Buffer.from(JSON.stringify(manifest))
    }
  });

  const results = await installPlugin(
    'https://github.com/testuser/e2e-skill',
    ['cc-skill']
  );

  // Verify result shape
  expect(results).toHaveLength(1);
  expect(results[0].target).toBe('cc-skill');
  expect(results[0].success).toBe(true);

  // Verify file on disk
  const skillPath = path.join(results[0].installedPath, 'skill.md');
  expect(fs.existsSync(skillPath)).toBe(true);
  expect(fs.readFileSync(skillPath, 'utf8')).toBe('# E2E Skill\nThis is the skill content.');

  // Verify manifest on disk
  const manifestPath = path.join(results[0].installedPath, 'manifest.json');
  expect(fs.existsSync(manifestPath)).toBe(true);
  const saved = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  expect(saved.name).toBe('e2e-skill');
  expect(saved.version).toBe('2.0.0');
});
