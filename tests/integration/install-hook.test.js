'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock homedir with unique temp directory
const FAKE_HOME = path.join(os.tmpdir(), `cpm-int-hook-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

// Mock fetchFromUrl from fetcher
const fetcher = require('../../src/core/fetcher');
jest.spyOn(fetcher, 'fetchFromUrl').mockResolvedValue({
  manifest: {
    name: 'test-hook-plugin',
    version: '1.0.0',
    author: 'charlie',
    targets: {
      'cc-hook': {
        event: 'PreToolUse',
        command: 'echo "hook triggered"'
      }
    }
  },
  files: {
    'manifest.json': Buffer.from(JSON.stringify({
      name: 'test-hook-plugin',
      version: '1.0.0',
      author: 'charlie',
      targets: {
        'cc-hook': {
          event: 'PreToolUse',
          command: 'echo "hook triggered"'
        }
      }
    }))
  }
});

const { installPlugin } = require('../../src/core/installer');

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('Integration: installPlugin - cc-hook target', () => {
  test('installs cc-hook plugin successfully', async () => {
    const results = await installPlugin('https://github.com/charlie/test-hook-plugin', ['cc-hook']);
    expect(results).toHaveLength(1);
    expect(results[0].target).toBe('cc-hook');
    expect(results[0].success).toBe(true);
  });

  test('creates settings.json with hooks entry', async () => {
    await installPlugin('https://github.com/charlie/test-hook-plugin', ['cc-hook']);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    expect(fs.existsSync(settingsPath)).toBe(true);
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.hooks).toBeDefined();
    expect(settings.hooks.PreToolUse).toBeDefined();
  });

  test('hook array contains plugin entry with correct command', async () => {
    await installPlugin('https://github.com/charlie/test-hook-plugin', ['cc-hook']);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const hooks = settings.hooks.PreToolUse;
    expect(Array.isArray(hooks)).toBe(true);
    const hookEntry = hooks.find(h => h._cpmName === 'test-hook-plugin');
    expect(hookEntry).toBeDefined();
    expect(hookEntry.command).toBe('echo "hook triggered"');
  });

  test('preserves other settings when writing hooks', async () => {
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify({ existingKey: 'existingValue' }));

    await installPlugin('https://github.com/charlie/test-hook-plugin', ['cc-hook']);
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.existingKey).toBe('existingValue');
    expect(settings.hooks.PreToolUse).toBeDefined();
  });

  test('hook installation is idempotent (second install overwrites)', async () => {
    await installPlugin('https://github.com/charlie/test-hook-plugin', ['cc-hook']);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settingsAfterFirst = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const countAfterFirst = settingsAfterFirst.hooks.PreToolUse.length;

    await installPlugin('https://github.com/charlie/test-hook-plugin', ['cc-hook']);
    const settingsAfterSecond = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const countAfterSecond = settingsAfterSecond.hooks.PreToolUse.length;

    expect(countAfterSecond).toBe(countAfterFirst);
  });
});
