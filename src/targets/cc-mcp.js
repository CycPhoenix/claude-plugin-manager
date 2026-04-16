'use strict';

const { getCCSettingsPath } = require('../utils/paths');
const { safeWriteJson, readJsonFile } = require('../utils/fs');

async function readSettings() {
  try {
    return await readJsonFile(getCCSettingsPath());
  } catch {
    return {};
  }
}

async function install(manifest) {
  const server = manifest.targets['cc-mcp'].server;
  const settings = await readSettings();
  settings.mcpServers = settings.mcpServers || {};
  settings.mcpServers[manifest.name] = server;
  await safeWriteJson(getCCSettingsPath(), settings);
  return { success: true };
}

async function uninstall(manifest) {
  const settings = await readSettings();
  if (settings.mcpServers) {
    delete settings.mcpServers[manifest.name];
  }
  await safeWriteJson(getCCSettingsPath(), settings);
}

module.exports = { install, uninstall };
