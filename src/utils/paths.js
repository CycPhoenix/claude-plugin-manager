'use strict';

const path = require('path');
const os = require('os');

function getClaudeDir() {
  return path.join(os.homedir(), '.claude');
}

function getCpmConfigDir() {
  return path.join(os.homedir(), '.cpm');
}

function getCCPluginsDir() {
  return path.join(getClaudeDir(), 'plugins');
}

function getCCSettingsPath() {
  return path.join(getClaudeDir(), 'settings.json');
}

function getCoworkPluginsDir() {
  return path.join(getCCPluginsDir(), 'cache');
}

function getAgentsDir() {
  return path.join(getClaudeDir(), 'agents');
}

module.exports = {
  getClaudeDir,
  getCpmConfigDir,
  getCCPluginsDir,
  getCCSettingsPath,
  getCoworkPluginsDir,
  getAgentsDir
};
