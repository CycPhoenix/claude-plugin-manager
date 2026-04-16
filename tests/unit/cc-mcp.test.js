'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const FAKE_HOME = path.join(os.tmpdir(), `cpm-mcp-test-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

const { install, uninstall } = require('../../src/targets/cc-mcp');

const manifest = {
  name: 'my-mcp',
  version: '1.0.0',
  author: 'alice',
  targets: {
    'cc-mcp': {
      server: { command: 'node', args: ['server.js'] }
    }
  }
};

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('install', () => {
  test('creates settings.json with mcpServers entry', async () => {
    const result = await install(manifest);
    expect(result.success).toBe(true);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.mcpServers['my-mcp']).toEqual({ command: 'node', args: ['server.js'] });
  });

  test('merges into existing settings.json without clobbering other keys', async () => {
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify({ someOtherKey: true }));
    await install(manifest);
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.someOtherKey).toBe(true);
    expect(settings.mcpServers['my-mcp']).toBeDefined();
  });
});

describe('uninstall', () => {
  test('removes mcpServers entry from settings.json', async () => {
    await install(manifest);
    await uninstall(manifest);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.mcpServers?.['my-mcp']).toBeUndefined();
  });
});
