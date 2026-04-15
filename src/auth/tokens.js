'use strict';

const path = require('path');
const { safeWriteJson, readJsonFile } = require('../utils/fs');
const { getCpmConfigDir } = require('../utils/paths');

const SERVICE = 'claude-plugin-manager';
const ACCOUNT = 'github';

function loadKeytar() {
  try {
    return require('keytar');
  } catch {
    return null;
  }
}

function getConfigFilePath() {
  return path.join(getCpmConfigDir(), 'config.json');
}

async function setToken(token) {
  const keytar = loadKeytar();
  if (keytar) {
    await keytar.setPassword(SERVICE, ACCOUNT, token);
    return;
  }
  await safeWriteJson(getConfigFilePath(), { githubToken: token });
}

async function getToken() {
  const keytar = loadKeytar();
  if (keytar) {
    return keytar.getPassword(SERVICE, ACCOUNT);
  }
  try {
    const config = await readJsonFile(getConfigFilePath());
    return config.githubToken || null;
  } catch {
    return null;
  }
}

async function deleteToken() {
  const keytar = loadKeytar();
  if (keytar) {
    await keytar.deletePassword(SERVICE, ACCOUNT);
    return;
  }
  await safeWriteJson(getConfigFilePath(), {});
}

module.exports = { setToken, getToken, deleteToken };
