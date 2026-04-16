'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const FAKE_HOME = path.join(os.tmpdir(), `cpm-hook-test-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

const { install, uninstall } = require('../../src/targets/cc-hook');

const manifest = {
  name: 'my-hook',
  version: '1.0.0',
  author: 'alice',
  targets: {
    'cc-hook': { event: 'PostToolUse', command: 'node hook.js' }
  }
};

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('install', () => {
  test('adds hook entry to settings.json hooks array', async () => {
    const result = await install(manifest);
    expect(result.success).toBe(true);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.hooks.PostToolUse).toContainEqual({
      _cpmName: 'my-hook',
      command: 'node hook.js'
    });
  });

  test('does not duplicate hook on second install', async () => {
    await install(manifest);
    await install(manifest);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const matches = settings.hooks.PostToolUse.filter(h => h._cpmName === 'my-hook');
    expect(matches).toHaveLength(1);
  });
});

describe('uninstall', () => {
  test('removes hook entry from settings.json', async () => {
    await install(manifest);
    await uninstall(manifest);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const matches = (settings.hooks?.PostToolUse || []).filter(h => h._cpmName === 'my-hook');
    expect(matches).toHaveLength(0);
  });
});
