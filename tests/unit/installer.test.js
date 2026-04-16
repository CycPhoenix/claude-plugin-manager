'use strict';

jest.mock('../../src/core/fetcher');
jest.mock('../../src/core/detector');
jest.mock('../../src/targets/cc-skill');
jest.mock('../../src/targets/cc-mcp');
jest.mock('../../src/targets/cc-hook');
jest.mock('../../src/targets/cowork');

const fetcher = require('../../src/core/fetcher');
const detector = require('../../src/core/detector');
const ccSkill = require('../../src/targets/cc-skill');
const ccMcp = require('../../src/targets/cc-mcp');
const ccHook = require('../../src/targets/cc-hook');
const cowork = require('../../src/targets/cowork');
const { installPlugin } = require('../../src/core/installer');

const manifest = {
  name: 'test-plugin', version: '1.0.0', author: 'alice',
  targets: { 'cc-skill': { file: 'skill.md' } }
};
const files = { 'skill.md': Buffer.from('# skill'), 'manifest.json': Buffer.from('{}') };

beforeEach(() => {
  jest.clearAllMocks();
  fetcher.fetchFromUrl.mockResolvedValue({ manifest, files });
  detector.validateManifest.mockImplementation(() => {});
  detector.detectTargets.mockReturnValue(['cc-skill']);
  ccSkill.install.mockResolvedValue({ success: true, installedPath: '/fake/path' });
});

describe('installPlugin', () => {
  test('calls fetchFromUrl with url and token', async () => {
    await installPlugin('https://github.com/alice/test-plugin', ['cc-skill'], 'ghp_token');
    expect(fetcher.fetchFromUrl).toHaveBeenCalledWith('https://github.com/alice/test-plugin', 'ghp_token');
  });

  test('calls validateManifest', async () => {
    await installPlugin('https://github.com/alice/test-plugin', ['cc-skill']);
    expect(detector.validateManifest).toHaveBeenCalledWith(manifest);
  });

  test('routes to cc-skill target when chosen', async () => {
    await installPlugin('https://github.com/alice/test-plugin', ['cc-skill']);
    expect(ccSkill.install).toHaveBeenCalledWith(manifest, files);
  });

  test('routes to cc-mcp target when chosen', async () => {
    detector.detectTargets.mockReturnValue(['cc-mcp']);
    ccMcp.install.mockResolvedValue({ success: true });
    await installPlugin('https://url', ['cc-mcp']);
    expect(ccMcp.install).toHaveBeenCalledWith(manifest, files);
  });

  test('returns results for each installed target', async () => {
    const results = await installPlugin('https://github.com/alice/test-plugin', ['cc-skill']);
    expect(results).toEqual([{ target: 'cc-skill', success: true, installedPath: '/fake/path' }]);
  });

  test('throws when chosen target not in detected targets', async () => {
    detector.detectTargets.mockReturnValue(['cowork']);
    await expect(installPlugin('https://url', ['cc-skill']))
      .rejects.toThrow('target cc-skill not supported by this plugin');
  });
});
