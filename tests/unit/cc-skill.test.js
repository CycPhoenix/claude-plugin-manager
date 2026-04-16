'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Point paths to tmp dir
const FAKE_HOME = path.join(os.tmpdir(), `cpm-test-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

const { install, uninstall, getInstallPath } = require('../../src/targets/cc-skill');

const manifest = {
  name: 'my-skill',
  version: '1.2.0',
  author: 'alice',
  targets: { 'cc-skill': { file: 'skill.md' } }
};
const files = {
  'skill.md': Buffer.from('# My Skill\nDoes stuff.'),
  'manifest.json': Buffer.from(JSON.stringify(manifest))
};

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('getInstallPath', () => {
  test('returns path under ~/.claude/plugins/cache', () => {
    const p = getInstallPath('alice', 'my-skill', '1.2.0');
    expect(p).toContain(path.join('.claude', 'plugins', 'cache'));
    expect(p).toContain('alice');
    expect(p).toContain('my-skill');
    expect(p).toContain('1.2.0');
  });
});

describe('install', () => {
  test('writes skill.md to install path', async () => {
    const result = await install(manifest, files);
    expect(result.success).toBe(true);
    expect(fs.existsSync(path.join(result.installedPath, 'skill.md'))).toBe(true);
  });

  test('writes manifest.json to install path', async () => {
    const result = await install(manifest, files);
    expect(fs.existsSync(path.join(result.installedPath, 'manifest.json'))).toBe(true);
  });

  test('throws when skill.md not in files', async () => {
    await expect(install(manifest, {})).rejects.toThrow('skill.md not found');
  });
});

describe('uninstall', () => {
  test('removes installed skill directory', async () => {
    const result = await install(manifest, files);
    expect(fs.existsSync(result.installedPath)).toBe(true);
    await uninstall(manifest);
    expect(fs.existsSync(result.installedPath)).toBe(false);
  });
});
