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
  const { event, command } = manifest.targets['cc-hook'];
  const settings = await readSettings();
  settings.hooks = settings.hooks || {};
  settings.hooks[event] = settings.hooks[event] || [];

  // Remove existing entry for this plugin (idempotent)
  settings.hooks[event] = settings.hooks[event].filter(h => h._cpmName !== manifest.name);
  settings.hooks[event].push({ _cpmName: manifest.name, command });

  await safeWriteJson(getCCSettingsPath(), settings);
  return { success: true };
}

async function uninstall(manifest) {
  const { event } = manifest.targets['cc-hook'];
  const settings = await readSettings();
  if (settings.hooks && settings.hooks[event]) {
    settings.hooks[event] = settings.hooks[event].filter(h => h._cpmName !== manifest.name);
  }
  await safeWriteJson(getCCSettingsPath(), settings);
}

module.exports = { install, uninstall };
