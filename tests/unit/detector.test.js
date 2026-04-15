'use strict';

const { detectTargets, validateManifest } = require('../../src/core/detector');

describe('validateManifest', () => {
  test('throws when name is missing', () => {
    expect(() => validateManifest({ version: '1.0.0', targets: { 'cc-skill': { file: 'skill.md' } } }))
      .toThrow('manifest missing required field: name');
  });

  test('throws when version is missing', () => {
    expect(() => validateManifest({ name: 'test', targets: { 'cc-skill': { file: 'skill.md' } } }))
      .toThrow('manifest missing required field: version');
  });

  test('throws when targets is missing', () => {
    expect(() => validateManifest({ name: 'test', version: '1.0.0' }))
      .toThrow('manifest missing required field: targets');
  });

  test('throws when targets is empty object', () => {
    expect(() => validateManifest({ name: 'test', version: '1.0.0', targets: {} }))
      .toThrow('manifest has no valid targets');
  });

  test('does not throw for valid manifest', () => {
    expect(() => validateManifest({
      name: 'test', version: '1.0.0',
      targets: { 'cc-skill': { file: 'skill.md' } }
    })).not.toThrow();
  });
});

describe('detectTargets', () => {
  test('detects cc-skill', () => {
    const manifest = { name: 'p', version: '1.0.0', targets: { 'cc-skill': { file: 'skill.md' } } };
    expect(detectTargets(manifest)).toEqual(['cc-skill']);
  });

  test('detects cc-mcp', () => {
    const manifest = { name: 'p', version: '1.0.0', targets: { 'cc-mcp': { server: { command: 'node', args: ['s.js'] } } } };
    expect(detectTargets(manifest)).toEqual(['cc-mcp']);
  });

  test('detects cc-hook', () => {
    const manifest = { name: 'p', version: '1.0.0', targets: { 'cc-hook': { event: 'PostToolUse', command: 'node h.js' } } };
    expect(detectTargets(manifest)).toEqual(['cc-hook']);
  });

  test('detects cowork', () => {
    const manifest = { name: 'p', version: '1.0.0', targets: { cowork: { files: ['plugin.md', 'manifest.json'] } } };
    expect(detectTargets(manifest)).toEqual(['cowork']);
  });

  test('detects multiple targets', () => {
    const manifest = {
      name: 'p', version: '1.0.0',
      targets: {
        'cc-skill': { file: 'skill.md' },
        cowork: { files: ['plugin.md', 'manifest.json'] }
      }
    };
    const result = detectTargets(manifest);
    expect(result).toContain('cc-skill');
    expect(result).toContain('cowork');
    expect(result).toHaveLength(2);
  });

  test('ignores unknown target keys', () => {
    const manifest = { name: 'p', version: '1.0.0', targets: { unknown: {}, 'cc-skill': { file: 'skill.md' } } };
    expect(detectTargets(manifest)).toEqual(['cc-skill']);
  });
});
