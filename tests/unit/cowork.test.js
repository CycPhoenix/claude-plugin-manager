'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Point paths to tmp dir
const FAKE_HOME = path.join(os.tmpdir(), `cpm-cowork-test-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

const { install, uninstall, getInstallPath } = require('../../src/targets/cowork');

const manifest = {
  name: 'my-cowork-plugin',
  version: '1.0.0',
  author: 'alice',
  targets: {
    cowork: { files: ['plugin.md', 'manifest.json'] }
  }
};
const files = {
  'plugin.md': Buffer.from('# My Plugin'),
  'manifest.json': Buffer.from(JSON.stringify(manifest))
};

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('getInstallPath', () => {
  test('returns path under ~/.claude/plugins/cache', () => {
    const p = getInstallPath('alice', 'my-cowork-plugin', '1.0.0');
    expect(p).toContain(path.join('.claude', 'plugins', 'cache'));
  });
});

describe('install', () => {
  test('copies declared files to install path', async () => {
    const result = await install(manifest, files);
    expect(result.success).toBe(true);
    expect(fs.existsSync(path.join(result.installedPath, 'plugin.md'))).toBe(true);
    expect(fs.existsSync(path.join(result.installedPath, 'manifest.json'))).toBe(true);
  });

  test('throws when a declared file is missing from files map', async () => {
    await expect(install(manifest, { 'plugin.md': files['plugin.md'] }))
      .rejects.toThrow('manifest.json not found');
  });
});

describe('uninstall', () => {
  test('removes install directory', async () => {
    const result = await install(manifest, files);
    await uninstall(manifest);
    expect(fs.existsSync(result.installedPath)).toBe(false);
  });
});
