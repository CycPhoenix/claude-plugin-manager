'use strict';

const path = require('path');
const { safeWriteJson, readJsonFile } = require('../utils/fs');
const { getCpmConfigDir } = require('../utils/paths');

const SERVICE = 'claude-plugin-manager';
const ACCOUNT = 'github';

function getConfigFilePath() {
  return path.join(getCpmConfigDir(), 'config.json');
}

async function setToken(token) {
  await safeWriteJson(getConfigFilePath(), { githubToken: token });
}

async function getToken() {
  try {
    const config = await readJsonFile(getConfigFilePath());
    return config.githubToken || null;
  } catch {
    return null;
  }
}

async function deleteToken() {
  await safeWriteJson(getConfigFilePath(), {});
}

module.exports = { setToken, getToken, deleteToken, SERVICE, ACCOUNT };
