'use strict';

const path = require('path');
const os = require('os');

// Override HOME for predictable test output
const FAKE_HOME = '/fake/home';
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

const { getClaudeDir, getCpmConfigDir, getCoworkPluginsDir, getCCPluginsDir, getCCSettingsPath } = require('../../src/utils/paths');

describe('paths', () => {
  test('getClaudeDir returns ~/.claude', () => {
    expect(getClaudeDir()).toBe(path.join(FAKE_HOME, '.claude'));
  });

  test('getCpmConfigDir returns ~/.cpm', () => {
    expect(getCpmConfigDir()).toBe(path.join(FAKE_HOME, '.cpm'));
  });

  test('getCCPluginsDir returns ~/.claude/plugins', () => {
    expect(getCCPluginsDir()).toBe(path.join(FAKE_HOME, '.claude', 'plugins'));
  });

  test('getCCSettingsPath returns ~/.claude/settings.json', () => {
    expect(getCCSettingsPath()).toBe(path.join(FAKE_HOME, '.claude', 'settings.json'));
  });

  test('getCoworkPluginsDir returns ~/.claude/plugins/cache', () => {
    expect(getCoworkPluginsDir()).toBe(path.join(FAKE_HOME, '.claude', 'plugins', 'cache'));
  });
});
