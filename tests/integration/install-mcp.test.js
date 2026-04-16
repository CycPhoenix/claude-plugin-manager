'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock homedir with unique temp directory
const FAKE_HOME = path.join(os.tmpdir(), `cpm-int-mcp-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

// Mock fetchFromUrl from fetcher
const fetcher = require('../../src/core/fetcher');
jest.spyOn(fetcher, 'fetchFromUrl').mockResolvedValue({
  manifest: {
    name: 'test-mcp-plugin',
    version: '1.0.0',
    author: 'bob',
    targets: {
      'cc-mcp': {
        server: { command: 'node', args: ['server.js'] }
      }
    }
  },
  files: {
    'manifest.json': Buffer.from(JSON.stringify({
      name: 'test-mcp-plugin',
      version: '1.0.0',
      author: 'bob',
      targets: {
        'cc-mcp': {
          server: { command: 'node', args: ['server.js'] }
        }
      }
    }))
  }
});

const { installPlugin } = require('../../src/core/installer');

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('Integration: installPlugin - cc-mcp target', () => {
  test('installs cc-mcp plugin successfully', async () => {
    const results = await installPlugin('https://github.com/bob/test-mcp-plugin', ['cc-mcp']);
    expect(results).toHaveLength(1);
    expect(results[0].target).toBe('cc-mcp');
    expect(results[0].success).toBe(true);
  });

  test('creates settings.json with mcpServers entry', async () => {
    await installPlugin('https://github.com/bob/test-mcp-plugin', ['cc-mcp']);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    expect(fs.existsSync(settingsPath)).toBe(true);
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.mcpServers).toBeDefined();
    expect(settings.mcpServers['test-mcp-plugin']).toEqual({
      command: 'node',
      args: ['server.js']
    });
  });

  test('preserves other settings when writing mcpServers', async () => {
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify({ existingKey: 'existingValue' }));

    await installPlugin('https://github.com/bob/test-mcp-plugin', ['cc-mcp']);
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    expect(settings.existingKey).toBe('existingValue');
    expect(settings.mcpServers['test-mcp-plugin']).toBeDefined();
  });

  test('mcp server config stored in settings.json', async () => {
    await installPlugin('https://github.com/bob/test-mcp-plugin', ['cc-mcp']);
    const settingsPath = path.join(FAKE_HOME, '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const serverConfig = settings.mcpServers['test-mcp-plugin'];
    expect(serverConfig.command).toBe('node');
    expect(serverConfig.args).toContain('server.js');
  });
});
