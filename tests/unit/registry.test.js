'use strict';

const nock = require('nock');
const { fetchRegistry, searchRegistry } = require('../../src/core/registry');

const REGISTRY_URL = 'https://raw.githubusercontent.com/claude-plugin-manager/registry/main/registry.json';
const mockRegistry = [
  { name: 'plugin-one', description: 'Does thing one', author: 'alice', url: 'https://github.com/alice/plugin-one', tags: ['productivity'] },
  { name: 'plugin-two', description: 'Does thing two', author: 'bob', url: 'https://github.com/bob/plugin-two', tags: ['writing'] },
  { name: 'write-helper', description: 'Helps with writing', author: 'carol', url: 'https://github.com/carol/write-helper', tags: ['writing', 'productivity'] }
];

afterEach(() => nock.cleanAll());

describe('fetchRegistry', () => {
  test('fetches and returns registry array', async () => {
    const url = new URL(REGISTRY_URL);
    nock(`https://${url.host}`).get(url.pathname).reply(200, mockRegistry);
    const result = await fetchRegistry();
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('plugin-one');
  });

  test('throws on network error', async () => {
    const url = new URL(REGISTRY_URL);
    nock(`https://${url.host}`).get(url.pathname).reply(500);
    await expect(fetchRegistry()).rejects.toThrow('Failed to fetch');
  });
});

describe('searchRegistry', () => {
  test('returns all plugins when query is empty', () => {
    expect(searchRegistry(mockRegistry, '')).toHaveLength(3);
  });

  test('matches by name (case-insensitive)', () => {
    expect(searchRegistry(mockRegistry, 'Plugin-ONE')).toHaveLength(1);
    expect(searchRegistry(mockRegistry, 'Plugin-ONE')[0].name).toBe('plugin-one');
  });

  test('matches by description', () => {
    expect(searchRegistry(mockRegistry, 'writing')).toHaveLength(2);
  });

  test('matches by tag', () => {
    expect(searchRegistry(mockRegistry, 'productivity')).toHaveLength(2);
  });

  test('returns empty array when no match', () => {
    expect(searchRegistry(mockRegistry, 'xyznonexistent')).toHaveLength(0);
  });
});
