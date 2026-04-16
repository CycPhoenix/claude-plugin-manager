'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock homedir with unique temp directory
const FAKE_HOME = path.join(os.tmpdir(), `cpm-int-cowork-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

// Mock fetchFromUrl from fetcher
const fetcher = require('../../src/core/fetcher');
jest.spyOn(fetcher, 'fetchFromUrl').mockResolvedValue({
  manifest: {
    name: 'test-cowork-plugin',
    version: '1.0.0',
    author: 'diana',
    targets: {
      cowork: {
        files: ['plugin.ts', 'plugin.json']
      }
    }
  },
  files: {
    'plugin.ts': Buffer.from('export const plugin = {};'),
    'plugin.json': Buffer.from(JSON.stringify({ id: 'test-plugin' })),
    'manifest.json': Buffer.from(JSON.stringify({
      name: 'test-cowork-plugin',
      version: '1.0.0',
      author: 'diana',
      targets: {
        cowork: {
          files: ['plugin.ts', 'plugin.json']
        }
      }
    }))
  }
});

const { installPlugin } = require('../../src/core/installer');

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('Integration: installPlugin - cowork target', () => {
  test('installs cowork plugin successfully', async () => {
    const results = await installPlugin('https://github.com/diana/test-cowork-plugin', ['cowork']);
    expect(results).toHaveLength(1);
    expect(results[0].target).toBe('cowork');
    expect(results[0].success).toBe(true);
  });

  test('writes all declared files to install path', async () => {
    const results = await installPlugin('https://github.com/diana/test-cowork-plugin', ['cowork']);
    const installedPath = results[0].installedPath;
    expect(fs.existsSync(path.join(installedPath, 'plugin.ts'))).toBe(true);
    expect(fs.existsSync(path.join(installedPath, 'plugin.json'))).toBe(true);
  });

  test('file contents are correct', async () => {
    const results = await installPlugin('https://github.com/diana/test-cowork-plugin', ['cowork']);
    const installedPath = results[0].installedPath;

    const tsContent = fs.readFileSync(path.join(installedPath, 'plugin.ts'), 'utf8');
    expect(tsContent).toContain('export const plugin');

    const jsonContent = JSON.parse(fs.readFileSync(path.join(installedPath, 'plugin.json'), 'utf8'));
    expect(jsonContent.id).toBe('test-plugin');
  });

  test('installs to ~/.claude/plugins/cache/diana/test-cowork-plugin/1.0.0', async () => {
    const results = await installPlugin('https://github.com/diana/test-cowork-plugin', ['cowork']);
    const installedPath = results[0].installedPath;
    expect(installedPath).toContain('.claude');
    expect(installedPath).toContain('plugins');
    expect(installedPath).toContain('cache');
    expect(installedPath).toContain('diana');
    expect(installedPath).toContain('test-cowork-plugin');
    expect(installedPath).toContain('1.0.0');
  });

  test('directory structure is created correctly', async () => {
    const results = await installPlugin('https://github.com/diana/test-cowork-plugin', ['cowork']);
    const installedPath = results[0].installedPath;
    expect(fs.statSync(installedPath).isDirectory()).toBe(true);
  });
});
