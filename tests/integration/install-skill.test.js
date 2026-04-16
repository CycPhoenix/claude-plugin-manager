'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock homedir with unique temp directory
const FAKE_HOME = path.join(os.tmpdir(), `cpm-int-skill-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

// Mock fetchFromUrl from fetcher
const fetcher = require('../../src/core/fetcher');
jest.spyOn(fetcher, 'fetchFromUrl').mockResolvedValue({
  manifest: {
    name: 'test-skill-plugin',
    version: '1.0.0',
    author: 'alice',
    targets: { 'cc-skill': { file: 'skill.md' } }
  },
  files: {
    'skill.md': Buffer.from('# Test Skill\nDoes stuff.'),
    'manifest.json': Buffer.from(JSON.stringify({
      name: 'test-skill-plugin',
      version: '1.0.0',
      author: 'alice',
      targets: { 'cc-skill': { file: 'skill.md' } }
    }))
  }
});

const { installPlugin } = require('../../src/core/installer');

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('Integration: installPlugin - cc-skill target', () => {
  test('installs cc-skill plugin successfully', async () => {
    const results = await installPlugin('https://github.com/alice/test-skill-plugin', ['cc-skill']);
    expect(results).toHaveLength(1);
    expect(results[0].target).toBe('cc-skill');
    expect(results[0].success).toBe(true);
  });

  test('writes skill.md file to install path', async () => {
    const results = await installPlugin('https://github.com/alice/test-skill-plugin', ['cc-skill']);
    const installedPath = results[0].installedPath;
    const skillFile = path.join(installedPath, 'skill.md');
    expect(fs.existsSync(skillFile)).toBe(true);
    const content = fs.readFileSync(skillFile, 'utf8');
    expect(content).toContain('# Test Skill');
  });

  test('writes manifest.json to install path', async () => {
    const results = await installPlugin('https://github.com/alice/test-skill-plugin', ['cc-skill']);
    const installedPath = results[0].installedPath;
    const manifestFile = path.join(installedPath, 'manifest.json');
    expect(fs.existsSync(manifestFile)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    expect(manifest.name).toBe('test-skill-plugin');
  });

  test('installs to ~/.claude/plugins/cache/alice/test-skill-plugin/1.0.0', async () => {
    const results = await installPlugin('https://github.com/alice/test-skill-plugin', ['cc-skill']);
    const installedPath = results[0].installedPath;
    expect(installedPath).toContain('.claude');
    expect(installedPath).toContain('plugins');
    expect(installedPath).toContain('cache');
    expect(installedPath).toContain('alice');
    expect(installedPath).toContain('test-skill-plugin');
    expect(installedPath).toContain('1.0.0');
  });
});
