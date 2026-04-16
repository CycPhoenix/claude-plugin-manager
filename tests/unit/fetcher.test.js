'use strict';

const nock = require('nock');
const { parseGitHubUrl, fetchFromUrl } = require('../../src/core/fetcher');

afterEach(() => nock.cleanAll());

describe('parseGitHubUrl', () => {
  test('parses standard GitHub repo URL', () => {
    expect(parseGitHubUrl('https://github.com/alice/my-plugin'))
      .toEqual({ owner: 'alice', repo: 'my-plugin', ref: 'main' });
  });

  test('parses GitHub URL with tree/branch', () => {
    expect(parseGitHubUrl('https://github.com/alice/my-plugin/tree/dev'))
      .toEqual({ owner: 'alice', repo: 'my-plugin', ref: 'dev' });
  });

  test('returns null for non-GitHub URL', () => {
    expect(parseGitHubUrl('https://example.com/plugin.json')).toBeNull();
  });

  test('returns null for raw.githubusercontent.com URL', () => {
    expect(parseGitHubUrl('https://raw.githubusercontent.com/alice/repo/main/manifest.json')).toBeNull();
  });
});

describe('fetchFromUrl — direct URL', () => {
  test('fetches manifest.json from direct URL', async () => {
    const manifest = { name: 'test-plugin', version: '1.0.0', targets: { 'cc-skill': { file: 'skill.md' } } };
    nock('https://example.com')
      .get('/plugin/manifest.json')
      .reply(200, manifest);

    const result = await fetchFromUrl('https://example.com/plugin/manifest.json');
    expect(result.manifest).toEqual(manifest);
  });

  test('throws when URL returns non-200', async () => {
    nock('https://example.com').get('/bad.json').reply(404);
    await expect(fetchFromUrl('https://example.com/bad.json'))
      .rejects.toThrow('Failed to fetch');
  });
});
