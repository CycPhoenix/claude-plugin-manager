'use strict';

const path = require('path');
const { safeWriteJson, readJsonFile } = require('../utils/fs');
const { getCpmConfigDir } = require('../utils/paths');

const SERVICE = 'claude-plugin-manager';
const ACCOUNT = 'github';

function getEntry() {
  try {
    const { Entry } = require('@napi-rs/keyring');
    return new Entry(SERVICE, ACCOUNT);
  } catch {
    return null;
  }
}

function getConfigFilePath() {
  return path.join(getCpmConfigDir(), 'config.json');
}

async function setToken(token) {
  const entry = getEntry();
  if (entry) {
    entry.setPassword(token);
    return;
  }
  await safeWriteJson(getConfigFilePath(), { githubToken: token });
}

async function getToken() {
  const entry = getEntry();
  if (entry) {
    try {
      return entry.getPassword();
    } catch {
      return null;
    }
  }
  try {
    const config = await readJsonFile(getConfigFilePath());
    return config.githubToken || null;
  } catch {
    return null;
  }
}

async function deleteToken() {
  const entry = getEntry();
  if (entry) {
    try {
      entry.deletePassword();
    } catch {
      // ignore if not found
    }
    return;
  }
  await safeWriteJson(getConfigFilePath(), {});
}

module.exports = { setToken, getToken, deleteToken };
